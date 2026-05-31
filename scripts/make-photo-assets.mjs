// Builds branding assets from the headshot:
//  - app/icon.png + app/apple-icon.png (square favicons)
//  - public/assets/desk-screen.png (monitor wallpaper): the headshot feathered
//    into a branded gradient so it blends like a real desktop wallpaper, rotated
//    180° to match the desktop_pc screen's flipped UVs.
import sharp from "sharp";
import { existsSync } from "node:fs";

const ROOT = process.cwd();
const original = `${ROOT}/public/assets/logo.png`;
// prefer a true transparent cutout if one was produced, else use the original
const cutout = `${ROOT}/public/assets/logo-cutout.png`;
const src = existsSync(cutout) ? cutout : original;
console.log("source:", src.replace(ROOT + "/", ""));

// --- square favicons / icons ---
const meta = await sharp(src).metadata();
const side = Math.min(meta.width, meta.height);
const square = () =>
  sharp(src).extract({
    left: Math.round((meta.width - side) / 2),
    top: Math.round((meta.height - side) / 2),
    width: side,
    height: side,
  });
await square().resize(256, 256).png().toFile(`${ROOT}/app/icon.png`);
await square().resize(180, 180).png().toFile(`${ROOT}/app/apple-icon.png`);
console.log("wrote app/icon.png, app/apple-icon.png");

// --- monitor wallpaper ---
const W = 1600;
const H = 900;
const bgSvg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="80%">
      <stop offset="0%" stop-color="#1c2742"/>
      <stop offset="55%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#06090e"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <circle cx="${W / 2}" cy="${H * 0.4}" r="${H * 0.55}" fill="#b6f24a" opacity="0.08"/>
</svg>`);

// transparent headshot cutout, sized to fit and centered on the gradient
const hasAlpha = (await sharp(src).metadata()).hasAlpha;
console.log("source hasAlpha:", hasAlpha);
const head = await sharp(src)
  .resize({ height: Math.round(H * 0.94), fit: "inside" })
  .toBuffer();

// NOTE: sharp applies flip() before composite() in its pipeline, so composite
// first, then flip the flattened result in a second pass. The monitor's screen
// UV is vertically flipped, so a single vertical flip makes it render upright
// and un-mirrored.
const composited = await sharp(bgSvg)
  .composite([{ input: head, gravity: "center" }])
  .png()
  .toBuffer();
await sharp(composited)
  .flip() // vertical flip to counter the monitor's V-flipped screen UV
  .png()
  .toFile(`${ROOT}/public/assets/desk-screen.png`);
console.log("wrote public/assets/desk-screen.png (1600x900, cutout, v-flipped)");
