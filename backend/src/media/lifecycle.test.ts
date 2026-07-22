import assert from "node:assert/strict";
import test from "node:test";
import { countReferences, persistMediaUpload, replaceMediaAsset } from "./lifecycle.js";
import type { StoredMedia } from "./storage.js";

const stored:StoredMedia={provider:"cloudinary",key:"autoforge/media/new",publicId:"autoforge/media/new",url:"https://example/new",secureUrl:"https://example/new",resourceType:"image",bytes:10,originalFilename:"new.jpg"};
const input={publicId:"autoforge/media/new",data:Buffer.from("image"),contentType:"image/jpeg",originalFilename:"new.jpg"};
test("successful upload persists safe Mongo metadata",async()=>{let saved:StoredMedia|undefined;const storage={put:async()=>stored,delete:async()=>undefined};const result=await persistMediaUpload(storage,input,async metadata=>{saved=metadata;return {id:"media-1",url:metadata.secureUrl};});assert.equal(result.value.id,"media-1");assert.equal(saved?.publicId,"autoforge/media/new");});
test("upload outage prevents database save",async()=>{let saves=0;const storage={put:async()=>{throw new Error("outage");},delete:async()=>undefined};await assert.rejects(persistMediaUpload(storage,input,async()=>{saves++;return {}; } ),/outage/);assert.equal(saves,0);});
test("database-save failure cleans up the new remote asset",async()=>{const deleted:string[]=[];const storage={put:async()=>stored,delete:async(id:string)=>{deleted.push(id);}};await assert.rejects(persistMediaUpload(storage,input,async()=>{throw new Error("database failure");}),/database failure/);assert.deepEqual(deleted,["autoforge/media/new"]);});
test("replacement saves new metadata before deleting the old asset",async()=>{const order:string[]=[];const storage={put:async()=>{order.push("upload");return stored;},delete:async()=>undefined};await replaceMediaAsset(storage,input,async()=>{order.push("save");return {};},async()=>{order.push("delete-old");},()=>undefined);assert.deepEqual(order,["upload","save","delete-old"]);});
test("replacement keeps the valid new row when old cleanup fails",async()=>{let warned=false;const storage={put:async()=>stored,delete:async()=>undefined};const result=await replaceMediaAsset(storage,input,async()=>({id:"new"}),async()=>{throw new Error("cleanup");},()=>{warned=true;});assert.equal(result.value.id,"new");assert.equal(warned,true);});
test("reference totals reject used assets and allow unreferenced assets",()=>{assert.equal(countReferences({products:1,categories:0}),1);assert.equal(countReferences({products:0,categories:0}),0);});
