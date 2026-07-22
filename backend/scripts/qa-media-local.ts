import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { connectMongoDB, disconnectMongoDB } from "../src/mongodb/connection.js";
import { mongo, Role } from "../src/mongodb/database.js";

const environment=z.object({NODE_ENV:z.string().default("development"),JWT_SECRET:z.string().min(32),MEDIA_STORAGE_DRIVER:z.string().default("local"),API_QA_BASE_URL:z.string().url().default("http://127.0.0.1:4000")}).parse(process.env);
if(environment.NODE_ENV==="production"||process.env.VERCEL_ENV)throw new Error("Local media QA cannot run in a hosted environment");
if(environment.MEDIA_STORAGE_DRIVER!=="local")throw new Error("Local media QA requires MEDIA_STORAGE_DRIVER=local");

const token=(id:string,role:string,expiresIn:"5m"|"-1s"="5m")=>jwt.sign({sub:id,role},environment.JWT_SECRET,{algorithm:"HS256",issuer:"autoforge-api",audience:"autoforge-web",expiresIn});
const request=(route:string,options:RequestInit={})=>fetch(`${environment.API_QA_BASE_URL}${route}`,options);
const auth=(value:string)=>({Authorization:`Bearer ${value}`});

async function main(){
  await connectMongoDB();
  const [admin,customer,referenced]=await Promise.all([mongo.user.findFirst({where:{role:Role.ADMIN}}),mongo.user.findFirst({where:{role:Role.CUSTOMER}}),mongo.productImage.findFirst()]);
  if(!admin)throw new Error("Seed an ADMIN user before running local media integration QA");
  const adminToken=token(admin.id,admin.role);let createdId:string|undefined;
  const results:Record<string,unknown>={};
  results.unauthenticated=(await request("/api/media",{method:"POST"})).status;
  results.modifiedToken=(await request("/api/media",{method:"POST",headers:auth(`${adminToken}modified`)})).status;
  results.expiredToken=(await request("/api/media",{method:"POST",headers:auth(token(admin.id,admin.role,"-1s"))})).status;
  if(customer)results.customerUpload=(await request("/api/media",{method:"POST",headers:auth(token(customer.id,customer.role))})).status;
  if(referenced)results.referencedDelete=(await request(`/api/media/${referenced.mediaId}`,{method:"DELETE",headers:auth(adminToken)})).status;
  try{
    const first=await readFile(path.resolve("backend/uploads/cat-components.jpg"));const uploadForm=new FormData();uploadForm.append("folder","temp");uploadForm.append("files",new Blob([new Uint8Array(first)],{type:"image/jpeg"}),"qa-components.jpg");
    const uploadResponse=await request("/api/media",{method:"POST",headers:auth(adminToken),body:uploadForm});results.upload=uploadResponse.status;const uploaded=await uploadResponse.json() as Array<{id:string;url:string}>;createdId=uploaded[0]?.id;if(!createdId)throw new Error("Upload did not return a media ID");
    const second=await readFile(path.resolve("backend/uploads/cat-sensors.jpg"));const replacementForm=new FormData();replacementForm.append("folder","temp");replacementForm.append("file",new Blob([new Uint8Array(second)],{type:"image/jpeg"}),"qa-sensors.jpg");
    const replacement=await request(`/api/media/${createdId}/replace`,{method:"POST",headers:auth(adminToken),body:replacementForm});results.replacement=replacement.status;
    results.delete=(await request(`/api/media/${createdId}`,{method:"DELETE",headers:auth(adminToken)})).status;
    results.repeatedDelete=(await request(`/api/media/${createdId}`,{method:"DELETE",headers:auth(adminToken)})).status;createdId=undefined;
  }finally{if(createdId)await request(`/api/media/${createdId}`,{method:"DELETE",headers:auth(adminToken)}).catch(()=>undefined);}
  const expected:Record<string,number>={unauthenticated:401,modifiedToken:401,expiredToken:401,upload:201,replacement:200,delete:204,repeatedDelete:204};if(customer)expected.customerUpload=403;if(referenced)expected.referencedDelete=409;
  for(const [name,status] of Object.entries(expected))if(results[name]!==status)throw new Error(`${name} expected ${status}, received ${String(results[name])}`);
  console.log(JSON.stringify({event:"local_media_integration_qa",results},null,2));
}
main().catch(error=>{console.error(error instanceof Error?error.message:"Local media QA failed");process.exitCode=1;}).finally(()=>disconnectMongoDB());
