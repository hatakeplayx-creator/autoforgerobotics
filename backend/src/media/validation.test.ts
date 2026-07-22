import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { MAX_MEDIA_FILE_BYTES, MAX_MEDIA_FILES, MediaValidationError, validateImageBatch, validateImageFile } from "./validation.js";

const jpeg=readFileSync(path.resolve("backend/uploads/cat-components.jpg"));
const file=(overrides:Partial<{buffer:Buffer;mimetype:string;originalname:string;size:number}>={})=>({buffer:jpeg,mimetype:"image/jpeg",originalname:"motor.jpg",size:jpeg.length,...overrides});
test("valid JPEG signature and dimensions are accepted",()=>{const result=validateImageFile(file());assert.equal(result.mimeType,"image/jpeg");assert.ok(result.width>0&&result.height>0);});
test("invalid extension is rejected",()=>assert.throws(()=>validateImageFile(file({originalname:"motor.png"})),MediaValidationError));
test("spoofed MIME type is rejected",()=>assert.throws(()=>validateImageFile(file({mimetype:"image/png",originalname:"motor.png"})),/signature/));
test("invalid binary signature is rejected",()=>assert.throws(()=>validateImageFile(file({buffer:Buffer.from("not an image"),size:12})),/signature/));
test("oversized files return a size error",()=>assert.throws(()=>validateImageFile(file({size:MAX_MEDIA_FILE_BYTES+1})),error=>error instanceof MediaValidationError&&error.status===413));
test("multi-file count is bounded",()=>assert.throws(()=>validateImageBatch(Array.from({length:MAX_MEDIA_FILES+1},()=>file())),/maximum/));
test("SVG and HTML are rejected",()=>assert.throws(()=>validateImageFile(file({buffer:Buffer.from("<svg></svg>"),mimetype:"image/svg+xml",originalname:"x.svg",size:11})),/Only JPEG/));
