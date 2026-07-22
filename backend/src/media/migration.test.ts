import assert from "node:assert/strict";
import test from "node:test";
import { selectMigrationCandidates } from "./migration.js";
test("migration is resumable and respects batch size",()=>{const rows=[{id:"done"},{id:"cloud",provider:"cloudinary"},{id:"next"},{id:"later"}];assert.deepEqual(selectMigrationCandidates(rows,["done"],1).map(row=>row.id),["next"]);});
test("migration dry-run planning does not mutate records",()=>{const rows=[{id:"legacy",provider:"local"}];const snapshot=structuredClone(rows);selectMigrationCandidates(rows,[],50);assert.deepEqual(rows,snapshot);});
