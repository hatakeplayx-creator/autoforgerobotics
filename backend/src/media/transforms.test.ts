import assert from "node:assert/strict";
import test from "node:test";
import { transformMediaUrl } from "./transforms.js";
test("Cloudinary delivery URL receives bounded automatic optimization",()=>assert.equal(transformMediaUrl("https://res.cloudinary.com/demo/image/upload/v1/autoforge/products/a.jpg","productCard"),"https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_640,h_640/v1/autoforge/products/a.jpg"));
test("legacy and external URLs remain unchanged",()=>{assert.equal(transformMediaUrl("/uploads/old.jpg","productCard"),"/uploads/old.jpg");assert.equal(transformMediaUrl("https://example.com/old.jpg","productCard"),"https://example.com/old.jpg");});
