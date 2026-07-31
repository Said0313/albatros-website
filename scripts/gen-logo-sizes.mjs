// Regenerates src/data/logoSizes.json: the intrinsic pixel size of every brand
// and client logo.
//
// Why this exists: the marquees scroll with `translateX(-50%)`, which is
// relative to the track's CURRENT width. With images.unoptimized the logos load
// progressively at full size, so if the markup does not declare each logo's real
// aspect ratio the track is laid out from a guess, then reflows as each file
// arrives and the running animation visibly jumps. Declaring the true intrinsic
// size makes the track width final at first paint.
//
// Run after adding or replacing a logo:  node scripts/gen-logo-sizes.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const roots = ["public/images/brands", "public/images/clients"];
const out = {};

for (const root of roots) {
  for (const file of fs.readdirSync(root)) {
    const abs = path.join(root, file);
    if (!fs.statSync(abs).isFile()) continue;
    if (!/\.(png|jpe?g|webp|svg|avif)$/i.test(file)) continue;
    try {
      const m = await sharp(fs.readFileSync(abs)).metadata();
      if (!m.width || !m.height) continue;
      out["/" + root.replace(/^public\//, "") + "/" + file] = [m.width, m.height];
    } catch {
      // unreadable file: skip, the component falls back to a default box
    }
  }
}

const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => (a < b ? -1 : 1)));
fs.writeFileSync("src/data/logoSizes.json", JSON.stringify(sorted, null, 2) + "\n");
console.log(`wrote src/data/logoSizes.json with ${Object.keys(sorted).length} entries`);
