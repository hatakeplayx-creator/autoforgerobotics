import type { MediaStorage, StoredMedia } from "./storage.js";

type UploadInput = Parameters<MediaStorage["put"]>[0];
type WritableStorage = Pick<MediaStorage, "put" | "delete">;

export async function persistMediaUpload<T>(storage: WritableStorage, input: UploadInput, save: (stored: StoredMedia) => Promise<T>): Promise<{ value: T; stored: StoredMedia }> {
  const stored=await storage.put(input);
  try{return {value:await save(stored),stored};}
  catch(error){await storage.delete(stored.publicId??stored.key).catch(()=>undefined);throw error;}
}

export async function replaceMediaAsset<T>(storage: WritableStorage,input:UploadInput,save:(stored:StoredMedia)=>Promise<T>,deleteOld:()=>Promise<void>,onOldCleanupFailure:(error:unknown)=>void):Promise<{value:T;stored:StoredMedia}>{
  const replacement=await persistMediaUpload(storage,input,save);
  try{await deleteOld();}catch(error){onOldCleanupFailure(error);}
  return replacement;
}

export function countReferences(references:Record<string,number>):number{return Object.values(references).reduce((sum,value)=>sum+value,0);}
