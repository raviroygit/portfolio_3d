// Capture a screenshot + app icon for the EvenlySplit mobile app and append to meta.json.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "assets", "projects");
const slug = "evenlysplit";
const playUrl = "https://play.google.com/store/apps/details?id=com.nxtgenaidev.evenly";

function toHex({ r, g, b }) {
  const h = (n) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

async function shot(url) {
  const api = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900&embed=screenshot.url`;
  const res = await fetch(api, { signal: AbortSignal.timeout(70000) });
  if (!res.ok) throw new Error("shot http " + res.status);
  return Buffer.from(await res.arrayBuffer());
}
async function meta(url) {
  const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(45000) });
  return (await res.json()).data || {};
}

// screenshot
const buf = await shot(playUrl);
const m = await sharp(buf).metadata();
const st = await sharp(buf).stats();
const dims = { width: 1280, height: Math.round((m.height / m.width) * 1280) };
await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(OUT, `${slug}.webp`));
console.log("screenshot ->", `${slug}.webp`, dims, "dominant", toHex(st.dominant));

// app icon: crop it from the Play listing screenshot (top-right purple icon)
const d = await meta(playUrl).catch(() => ({}));
let logo = null;
try {
  const base = await sharp(buf).resize({ width: 1280 }).toBuffer();
  await sharp(base)
    .extract({ left: 1006, top: 108, width: 204, height: 204 })
    .resize(128, 128)
    .png()
    .toFile(join(OUT, `${slug}-logo.png`));
  logo = `/assets/projects/${slug}-logo.png`;
  console.log("logo cropped from screenshot");
} catch (e) {
  console.log("logo crop failed:", e.message);
}

// merge into meta.json
const metaPath = join(OUT, "meta.json");
const arr = JSON.parse(readFileSync(metaPath, "utf8"));
const rec = {
  slug,
  url: playUrl,
  finalUrl: playUrl,
  title: d.title || "EvenlySplit",
  description: d.description || null,
  themeColor: null,
  dominant: toHex(st.dominant),
  image: `/assets/projects/${slug}.webp`,
  dims,
  logo,
};
const i = arr.findIndex((r) => r.slug === slug);
if (i >= 0) arr[i] = rec; else arr.push(rec);
writeFileSync(metaPath, JSON.stringify(arr, null, 2));
console.log("merged into meta.json. title:", rec.title, "| desc:", (rec.description || "").slice(0, 80));
