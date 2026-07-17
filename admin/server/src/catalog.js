"use strict";
const fs = require("fs");
const path = require("path");
const { CATALOG_PATH, BRANDS_PATH } = require("./config");

// Reads and writes src/data/catalog.json in the EXACT existing schema.
// Never restructures the file: writes the same array of product objects,
// pretty-printed with 2 spaces (matching the repo's formatting).

function readCatalog() {
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error("catalog.json is not a JSON array");
  }
  return data;
}

function readBrands() {
  const raw = fs.readFileSync(BRANDS_PATH, "utf8");
  return JSON.parse(raw);
}

// Field order kept close to the existing file for clean, readable diffs.
const FIELD_ORDER = [
  "id",
  "slug",
  "name",
  "category",
  "brand",
  "shortDescription",
  "fullDescription",
  "specifications",
  "images",
  "featured",
  "isNew",
  "originalUrl",
  "shortDescriptionUz",
  "fullDescriptionUz",
  "generalDirection",
  "analytes",
  "imageless",
  // Backward-compatible fields added by the admin panel (the site ignores them
  // for now; documented so the site can later respect `hidden` and `priority`).
  "priority",
  "hidden",
];

function orderProduct(p) {
  const out = {};
  for (const key of FIELD_ORDER) {
    if (p[key] !== undefined) out[key] = p[key];
  }
  // Preserve any unexpected keys we did not know about, rather than dropping data.
  for (const key of Object.keys(p)) {
    if (!(key in out)) out[key] = p[key];
  }
  return out;
}

// Basic structural validation so a malformed product can never corrupt the file.
function validateProduct(p) {
  const errors = [];
  const reqStr = (field) => {
    if (typeof p[field] !== "string" || !p[field].trim()) {
      errors.push(`Поле "${field}" обязательно.`);
    }
  };
  reqStr("id");
  reqStr("slug");
  reqStr("name");
  reqStr("category");
  reqStr("shortDescription");
  if (!Array.isArray(p.images)) errors.push('Поле "images" должно быть массивом.');
  if (p.specifications && !Array.isArray(p.specifications)) {
    errors.push('Поле "specifications" должно быть массивом.');
  }
  return errors;
}

// Atomic write: serialize, re-parse to prove it is valid JSON, write to a temp
// file, then rename over the original. Aborts before touching the real file if
// anything is wrong, so the site's data file can never be left half-written.
//
// Products are written exactly as given, preserving each object's own key order,
// so products the admin did not touch produce a zero-line diff. New products are
// given a canonical key order by the create route via orderProduct(); existing
// products keep their original order (edits append new keys in place).
function writeCatalog(products) {
  if (!Array.isArray(products)) throw new Error("writeCatalog expects an array");
  const json = JSON.stringify(products, null, 2) + "\n";
  JSON.parse(json); // throws if somehow not valid
  const tmp = CATALOG_PATH + ".tmp";
  fs.writeFileSync(tmp, json, "utf8");
  fs.renameSync(tmp, CATALOG_PATH);
}

module.exports = {
  readCatalog,
  readBrands,
  writeCatalog,
  validateProduct,
  orderProduct,
  CATALOG_PATH,
  relCatalogPath: () => path.relative(path.resolve(CATALOG_PATH, "..", "..", "..", ".."), CATALOG_PATH),
};
