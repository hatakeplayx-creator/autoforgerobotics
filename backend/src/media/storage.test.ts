import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createMediaStorage } from "./storage.js";

test("local adapter uploads, retrieves by URL contract, and deletes idempotently",async()=>{const directory=await mkdtemp(path.join(os.tmpdir(),"autoforge-media-"));try{const storage=createMediaStorage({driver:"local",uploadDir:directory});await storage.initialize();const saved=await storage.put({publicId:"safe.jpg",data:Buffer.from("bytes"),contentType:"image/jpeg",originalFilename:"original.jpg"});assert.equal(saved.url,"/uploads/safe.jpg");assert.equal((await readFile(path.join(directory,"safe.jpg"))).toString(),"bytes");await storage.delete(saved.key);await storage.delete(saved.key);}finally{await rm(directory,{recursive:true,force:true});}});
test("local deletion rejects arbitrary paths",async()=>{const storage=createMediaStorage({driver:"local",uploadDir:path.join(os.tmpdir(),"autoforge-media-unused")});await assert.rejects(storage.delete("../other.jpg"),/Invalid local media key/);});
