// Re-fetch real logos via microlink metadata (renders past Cloudflare challenge,
// which had caused the favicon fetch to grab the CF cloud icon).
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public", "assets", "projects");

// default: clipcam only (the confirmed-broken one). Pass ALL=1 to refresh every logo.
const all = process.env.ALL === "1";
const targets = (all
  ? [
      { slug: "nextgen-ai-dev", url: "https://nxtgenaidev.com" },
      { slug: "elevence-ai", url: "https://www.elevence.ai" },
      { slug: "echo-ai", url: "https://echo-ai.nxtgenaidev.com" },
      { slug: "exl-ai-playground", url: "https://exlaiplayground.com" },
      { slug: "voagents-ai", url: "https://voagents.ai" },
      { slug: "clipcam", url: "https://www.clipcam.app" },
      { slug: "fanisin", url: "https://fanisin.com" },
      { slug: "bae-i", url: "https://bae-i.com" },
      { slug: "hihellohr", url: "https://hihellohr.com" },
      { slug: "parking-bucket", url: "https://parkingbucket.com" },
    ]
  : [{ slug: "clipcam", url: "https://www.clipcam.app" }]);

async function microlinkMeta(url) {
  const api = `https://api.microlink.io/?url=${encodeURIComponent(url)}&palette=true`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch(api, { signal: ctrl.signal });
    const json = await res.json();
    return json.data || {};
  } finally {
    clearTimeout(t);
  }
}

const metaPath = join(OUT_DIR, "meta.json");
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : [];
const bySlug = new Map(meta.map((r) => [r.slug, r]));

for (const t of targets) {
  process.stdout.write(`→ ${t.slug} … `);
  try {
    const data = await microlinkMeta(t.url);
    const logoUrl = data.logo?.url || data.image?.url;
    if (!logoUrl) {
      process.stdout.write("no logo url\n");
      continue;
    }
    const res = await fetch(logoUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize({ width: 128, height: 128, fit: "inside" })
      .png()
      .toFile(join(OUT_DIR, `${t.slug}-logo.png`));
    const rec = bySlug.get(t.slug);
    if (rec) rec.logo = `/assets/projects/${t.slug}-logo.png`;
    process.stdout.write(`✓ ${logoUrl.slice(0, 60)}\n`);
  } catch (e) {
    process.stdout.write(`failed (${e.message})\n`);
  }
}

writeFileSync(metaPath, JSON.stringify(meta, null, 2));
console.log("Done.");
