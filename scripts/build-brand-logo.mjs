// Rasterize the real brand logo (public/logo.svg) → public/assets/brand-logo.png.
//
// Why: external tools (e.g. the nxtgenaidev blog automation that scrapes this
// site for a cover-image logo) can't consume SVG, and the site's PNG icons
// (icon.png / apple-icon.png / assets/logo.png) are the HEADSHOT, not the mark.
// This emits a clean raster of the actual logo, advertised via og:logo so
// scrapers grab the real brand mark instead of a face or a fabricated logo.
//
// Run: node scripts/build-brand-logo.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const src = join(root, "public", "logo.svg");
const out = join(root, "public", "assets", "brand-logo.png");

// density bumped so the vector renders crisp at the target raster size.
const svg = readFileSync(src);
const png = await sharp(svg, { density: 300 })
  .resize({ width: 600, fit: "inside" })
  .png()
  .toBuffer();
writeFileSync(out, png);
console.log(`✓ wrote ${out} (${png.length} bytes)`);
