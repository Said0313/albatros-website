"use strict";
const fs = require("fs");

// Generic JSON-array data file access shared by the Phase 2 content types
// (brands/partners, clients, certificates, events). Same guarantees as the
// Phase 1 catalog writer: records are written exactly as given (each object's
// own key order preserved, so untouched records produce a zero-line diff), and
// the write is atomic (serialize, re-parse to prove validity, temp file,
// rename) so a bad save can never corrupt a site data file.

function readArray(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error(`${filePath} is not a JSON array`);
  return data;
}

function writeArray(filePath, records) {
  if (!Array.isArray(records)) throw new Error("writeArray expects an array");
  const json = JSON.stringify(records, null, 2) + "\n";
  JSON.parse(json); // throws if somehow invalid
  const tmp = filePath + ".tmp";
  fs.writeFileSync(tmp, json, "utf8");
  fs.renameSync(tmp, filePath);
}

// Order the keys of a NEW record canonically (existing records keep their own
// key order). `fieldOrder` lists the preferred order; unknown keys keep their
// insertion order after the known ones.
function orderRecord(record, fieldOrder) {
  const out = {};
  for (const key of fieldOrder) {
    if (record[key] !== undefined) out[key] = record[key];
  }
  for (const key of Object.keys(record)) {
    if (!(key in out)) out[key] = record[key];
  }
  return out;
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueId(base, existingIds, fallback) {
  let id = slugify(base) || fallback;
  if (!existingIds.includes(id)) return id;
  let i = 2;
  while (existingIds.includes(`${id}-${i}`)) i += 1;
  return `${id}-${i}`;
}

module.exports = { readArray, writeArray, orderRecord, slugify, uniqueId };
