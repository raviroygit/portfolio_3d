// Fallback capture for SPA sites that hang local headless Chrome.
// Uses the microlink rendering API, then optimizes + merges into meta.json.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public", "assets", "projects");
mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { slug: "echo-ai", url: "https://echo-ai.nxtgenaidev.com" },
  { slug: "exl-ai-playground", url: "https://exlaiplayground.com" },
  { slug: "voagents-ai", url: "https://voagents.ai" },
  { slug: "clipcam", url: "https://www.clipcam.app" },
  { slug: "fanisin", url: "https://fanisin.com" },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function toHex({ r, g, b }) {
  const h = (n) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
function abs(base, href) {
  try { return new URL(href, base).toString(); } catch { return null; }
}

async function microlinkShot(url) {
  const api = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900&embed=screenshot.url`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch(api, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`http ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(t);
  }
}

async function fetchMeta(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: ctrl.signal });
    const html = await res.text();
    const final = res.url || url;
    const pick = (re) => { const m = html.match(re); return m ? m[1].trim() : null; };
    return {
      finalUrl: final,
      title: pick(/<title[^>]*>([^<]+)<\/title>/i),
      description:
        pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
        pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i),
      themeColor: pick(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i),
      logo: abs(final, pick(/<link[^>]+rel=["']apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i) || pick(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i) || "/favicon.ico"),
    };
  } catch { return {}; } finally { clearTimeout(t); }
}

const metaPath = join(OUT_DIR, "meta.json");
const prev = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : [];
const bySlug = new Map(prev.map((r) => [r.slug, r]));

for (const t of targets) {
  process.stdout.write(`→ ${t.slug} … `);
  let image = null, dominant = null, dims = null;
  try {
    const buf = await microlinkShot(t.url);
    const img = sharp(buf);
    const m = await img.metadata();
    const stats = await img.stats();
    dominant = stats.dominant ? toHex(stats.dominant) : null;
    dims = { width: 1280, height: Math.round((m.height / m.width) * 1280) };
    await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(OUT_DIR, `${t.slug}.webp`));
    image = `/assets/projects/${t.slug}.webp`;
  } catch (e) {
    process.stdout.write(`shot failed (${e.message}) `);
  }

  const meta = await fetchMeta(t.url);
  let logo = bySlug.get(t.slug)?.logo ?? null;
  if (meta.logo && !logo) {
    try {
      const r = await fetch(meta.logo, { headers: { "user-agent": UA } });
      if (r.ok) {
        await sharp(Buffer.from(await r.arrayBuffer())).resize({ width: 128, height: 128, fit: "inside" }).png().toFile(join(OUT_DIR, `${t.slug}-logo.png`));
        logo = `/assets/projects/${t.slug}-logo.png`;
      }
    } catch { /* ignore */ }
  }

  bySlug.set(t.slug, {
    slug: t.slug,
    url: t.url,
    finalUrl: meta.finalUrl || t.url,
    title: meta.title || bySlug.get(t.slug)?.title || null,
    description: meta.description || bySlug.get(t.slug)?.description || null,
    themeColor: meta.themeColor || null,
    dominant: dominant || meta.themeColor || bySlug.get(t.slug)?.dominant || null,
    image: image || bySlug.get(t.slug)?.image || null,
    dims: dims || bySlug.get(t.slug)?.dims || null,
    logo,
  });
  process.stdout.write(image ? "✓\n" : "✗\n");
}

// preserve a stable order
const order = ["nextgen-ai-dev","elevence-ai","echo-ai","exl-ai-playground","voagents-ai","clipcam","fanisin","bae-i","hihellohr","parking-bucket"];
const merged = order.map((s) => bySlug.get(s)).filter(Boolean);
writeFileSync(metaPath, JSON.stringify(merged, null, 2));
console.log("\nDone.");
merged.forEach((r) => console.log((r.image ? "IMG" : "---"), r.slug.padEnd(20), (r.dominant || "-").padEnd(9), (r.title || "").slice(0, 40)));
