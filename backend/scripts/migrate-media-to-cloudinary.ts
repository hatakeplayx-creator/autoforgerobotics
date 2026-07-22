import "dotenv/config";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { connectMongoDB, disconnectMongoDB } from "../src/mongodb/connection.js";
import { mongo, type MediaRow } from "../src/mongodb/database.js";
import { loadMediaConfiguration } from "../src/media/config.js";
import { createMediaStorage, type StoredMedia } from "../src/media/storage.js";
import { allowedImageTypes, detectImageMimeType, MAX_MEDIA_FILE_BYTES, validateImageFile } from "../src/media/validation.js";
import { selectMigrationCandidates } from "../src/media/migration.js";

interface ManifestEntry {
  mediaId: string;
  old: Pick<MediaRow, "key" | "url" | "provider" | "publicId" | "secureUrl">;
  next: Pick<StoredMedia, "publicId" | "secureUrl" | "format" | "width" | "height" | "bytes" | "version">;
  verifiedAt?: string;
}
interface Manifest { version: 1; createdAt: string; entries: ManifestEntry[]; failures: Array<{mediaId:string;source:string;message:string}> }

const args=process.argv.slice(2);
const dryRun=args.includes("--dry-run");
const verifyOnly=args.includes("--verify-only");
const batchArg=args.find(arg=>arg.startsWith("--batch-size="))?.split("=")[1]??"50";
const batchSize=z.coerce.number().int().min(1).max(500).parse(batchArg);
const manifestPath=path.resolve(process.env.CLOUDINARY_MIGRATION_MANIFEST??"backend/cloudinary-migration-manifest.json");
const uploadDir=path.resolve(process.env.UPLOAD_DIR??"backend/uploads");

async function loadManifest():Promise<Manifest>{try{return JSON.parse(await readFile(manifestPath,"utf8")) as Manifest;}catch{return {version:1,createdAt:new Date().toISOString(),entries:[],failures:[]};}}
async function saveManifest(manifest:Manifest){await writeFile(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,"utf8");}
async function sourceBytes(media:MediaRow):Promise<Buffer>{
  if(media.url.startsWith("/uploads/")){
    const key=decodeURIComponent(media.url.slice("/uploads/".length));
    if(path.basename(key)!==key)throw new Error("Unsafe local media path");
    return readFile(path.join(uploadDir,key));
  }
  if(!/^https:\/\//i.test(media.url))throw new Error("Unsupported source URL");
  const response=await fetch(media.url,{signal:AbortSignal.timeout(20_000)});
  if(!response.ok)throw new Error(`Source returned HTTP ${response.status}`);
  const declared=Number(response.headers.get("content-length")??0);
  if(declared>MAX_MEDIA_FILE_BYTES)throw new Error("Source exceeds migration byte limit");
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length>MAX_MEDIA_FILE_BYTES)throw new Error("Source exceeds migration byte limit");
  return bytes;
}

async function main(){
  await connectMongoDB();
  const manifest=await loadManifest();
  if(verifyOnly){
    let failed=0;
    for(const entry of manifest.entries){const row=await mongo.media.findUnique({where:{id:entry.mediaId}});const ok=Boolean(row?.provider==="cloudinary"&&row.publicId===entry.next.publicId&&row.secureUrl===entry.next.secureUrl);if(!ok)failed++;else entry.verifiedAt=new Date().toISOString();}
    await saveManifest(manifest);console.log(JSON.stringify({event:"cloudinary_media_verification",checked:manifest.entries.length,failed,manifestPath},null,2));if(failed)process.exitCode=1;return;
  }
  const rows=selectMigrationCandidates(await mongo.media.findMany({orderBy:{createdAt:"asc"}}),manifest.entries.map(entry=>entry.mediaId),batchSize);
  console.log(JSON.stringify({event:"cloudinary_media_migration_plan",dryRun,batchSize,candidates:rows.map(row=>({id:row.id,url:row.url,provider:row.provider}))},null,2));
  if(dryRun)return;
  const configuration=loadMediaConfiguration({...process.env,MEDIA_STORAGE_DRIVER:"cloudinary"});
  const storage=createMediaStorage({driver:"cloudinary",uploadDir,cloudinary:configuration.cloudinary});
  for(const media of rows){
    try{
      const bytes=await sourceBytes(media);const detectedMime=detectImageMimeType(bytes);if(!detectedMime)throw new Error("Source is not a supported image");const extension=[...allowedImageTypes[detectedMime].extension][0];const originalName=media.originalFilename??media.filename;const safeOriginalName=allowedImageTypes[detectedMime].extension.has(path.extname(originalName).toLowerCase() as never)?originalName:`${originalName}${extension}`;const probe=validateImageFile({buffer:bytes,mimetype:detectedMime,originalname:safeOriginalName,size:bytes.length});
      const publicId=`${storage.rootFolder}/media/${createHash("sha256").update(`${media.id}:${media.url}`).digest("hex").slice(0,36)}`;
      const stored=await storage.put({publicId,data:bytes,contentType:probe.mimeType,originalFilename:originalName});
      const entry:ManifestEntry={mediaId:media.id,old:{key:media.key,url:media.url,provider:media.provider,publicId:media.publicId,secureUrl:media.secureUrl},next:{publicId:stored.publicId,secureUrl:stored.secureUrl,format:stored.format,width:stored.width,height:stored.height,bytes:stored.bytes,version:stored.version}};
      manifest.entries.push(entry);await saveManifest(manifest);
      await mongo.media.update({where:{id:media.id},data:{key:stored.key,url:stored.secureUrl,provider:"cloudinary",publicId:stored.publicId,secureUrl:stored.secureUrl,resourceType:"image",format:stored.format??probe.format,width:stored.width??probe.width,height:stored.height??probe.height,bytes:stored.bytes,version:stored.version??null,originalFilename:media.originalFilename??media.filename,mimeType:probe.mimeType,size:stored.bytes}});
      entry.verifiedAt=new Date().toISOString();await saveManifest(manifest);
    }catch(error){const message=error instanceof Error?error.message:"Unknown migration error";manifest.failures.push({mediaId:media.id,source:media.url,message});await saveManifest(manifest);console.error(JSON.stringify({event:"cloudinary_media_migration_item_failed",mediaId:media.id,message}));}
  }
  console.log(JSON.stringify({event:"cloudinary_media_migration_complete",migrated:manifest.entries.length,failures:manifest.failures.length,manifestPath},null,2));
}
main().catch(error=>{console.error("Cloudinary media migration failed",error instanceof Error?error.message:"Unknown error");process.exitCode=1;}).finally(()=>disconnectMongoDB());
