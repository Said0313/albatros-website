"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { PRODUCT_IMAGES_DIR } = require("./config");

// Product images follow the site convention: a 1000x1000 white canvas with the
// device contained inside, saved as PNG to public/images/products/<name>.png and
// referenced in catalog.json as /images/products/<name>.png.
const CANVAS = 1000;
const PUBLIC_PREFIX = "/images/products/";

function ensureDir() {
  if (!fs.existsSync(PRODUCT_IMAGES_DIR)) {
    fs.mkdirSync(PRODUCT_IMAGES_DIR, { recursive: true });
  }
}

// Pick a filename that does not clobber an existing image. Base is usually the
// product slug; extra images get -2, -3, ... suffixes.
function uniqueFilename(baseSlug) {
  ensureDir();
  const safe = String(baseSlug || "product")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
  let name = `${safe}.png`;
  let i = 2;
  while (fs.existsSync(path.join(PRODUCT_IMAGES_DIR, name))) {
    name = `${safe}-${i}.png`;
    i += 1;
  }
  return name;
}

// Process an uploaded buffer to the standard canvas and save it.
// Returns the public path to store in catalog.json (/images/products/<name>.png).
async function processAndSave(buffer, baseSlug) {
  ensureDir();
  const filename = uniqueFilename(baseSlug);
  const outPath = path.join(PRODUCT_IMAGES_DIR, filename);

  const resized = await sharp(buffer)
    .resize(CANVAS, CANVAS, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();

  fs.writeFileSync(outPath, resized);
  return PUBLIC_PREFIX + filename;
}

// Delete a product image file by its public path. Only touches files inside the
// products image directory; ignores anything else for safety.
function deleteByPublicPath(publicPath) {
  if (typeof publicPath !== "string" || !publicPath.startsWith(PUBLIC_PREFIX)) {
    return null;
  }
  const filename = path.basename(publicPath);
  const filePath = path.join(PRODUCT_IMAGES_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return filePath;
  }
  return null;
}

function absFromPublicPath(publicPath) {
  return path.join(PRODUCT_IMAGES_DIR, path.basename(publicPath));
}

module.exports = { processAndSave, deleteByPublicPath, absFromPublicPath, PUBLIC_PREFIX };
