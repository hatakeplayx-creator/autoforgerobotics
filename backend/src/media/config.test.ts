import assert from "node:assert/strict";
import test from "node:test";
import { loadMediaConfiguration } from "./config.js";

test("development storage defaults explicitly to local",()=>{assert.equal(loadMediaConfiguration({NODE_ENV:"development"}).driver,"local");});
test("Preview fails closed without Cloudinary",()=>{assert.throws(()=>loadMediaConfiguration({NODE_ENV:"production",VERCEL_ENV:"preview"}),/CLOUDINARY_CLOUD_NAME/);});
test("partial Cloudinary credentials are rejected without revealing values",()=>{assert.throws(()=>loadMediaConfiguration({NODE_ENV:"development",CLOUDINARY_CLOUD_NAME:"demo"}),/must be configured together/);});
test("complete backend credentials select Cloudinary",()=>{const result=loadMediaConfiguration({NODE_ENV:"test",MEDIA_STORAGE_DRIVER:"cloudinary",CLOUDINARY_CLOUD_NAME:"demo",CLOUDINARY_API_KEY:"key",CLOUDINARY_API_SECRET:"secret"});assert.equal(result.driver,"cloudinary");assert.equal(result.cloudinary?.rootFolder,"autoforge");});
test("hosted local storage is forbidden",()=>{assert.throws(()=>loadMediaConfiguration({NODE_ENV:"production",MEDIA_STORAGE_DRIVER:"local",CLOUDINARY_CLOUD_NAME:"demo",CLOUDINARY_API_KEY:"key",CLOUDINARY_API_SECRET:"secret"}),/must be cloudinary/);});
