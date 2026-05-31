// Captures real screenshots + branding from each live project URL.
// Uses headless Google Chrome for screenshots and sharp for optimization.
// Output: public/assets/projects/<slug>.webp + meta.json
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, statSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_DIR = join(process.cwd(), "public", "assets", "projects");
mkdirSync(OUT_DIR, { recursive: true });

const targets = [
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
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function screenshot(url, outPng) {
  const userDir = mkdtempSync(join(tmpdir(), "cap-"));
  // old headless captures after the load event and exits reliably (new headless
  // with virtual-time-budget hangs on SPAs that keep network connections open).
  const args = [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--run-all-compositor-stages-before-draw",
    `--user-data-dir=${userDir}`,
    "--force-device-scale-factor=1.5",
    "--window-size=1440,900",
    "--virtual-time-budget=8000",
    `--user-agent=${UA}`,
    `--screenshot=${outPng}`,
    url,
  ];
  execFileSync(CHROME, args, { stdio: "ignore", timeout: 30000 });
}

const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;

function abs(base, href) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

async function fetchMeta(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA },
      signal: ctrl.signal,
      redirect: "follow",
    });
    const html = await res.text();
    const final = res.url || url;
    const pick = (re) => {
      const m = html.match(re);
      return m ? m[1].trim() : null;
    };
    const title = pick(/<title[^>]*>([^<]+)<\/title>/i);
    const description =
      pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
    const ogImage = pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    const themeColor = pick(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i);
    const appleIcon = pick(/<link[^>]+rel=["']apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i);
    const icon = pick(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i);
    return {
      finalUrl: final,
      title,
      description,
      ogImage: ogImage ? abs(final, ogImage) : null,
      themeColor,
      logo: abs(final, appleIcon || icon || "/favicon.ico"),
    };
  } catch (e) {
    return { error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

function toHex({ r, g, b }) {
  const h = (n) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

const results = [];

for (const t of targets.filter((x) => !ONLY || ONLY.includes(x.slug))) {
  const tmpPng = join(tmpdir(), `${t.slug}.png`);
  rmSync(tmpPng, { force: true }); // avoid reusing a stale capture
  let shotOk = false;
  process.stdout.write(`→ ${t.slug} (${t.url}) … `);
  try {
    screenshot(t.url, tmpPng);
  } catch (e) {
    process.stdout.write(`(chrome ${e.code || "timeout"}) `);
  }
  // Chrome often writes the screenshot before it hangs on exit — recover it
  // even when the process was killed by the timeout.
  shotOk = existsSync(tmpPng) && statSync(tmpPng).size > 8000;

  const meta = await fetchMeta(t.url);
  let dominant = meta.themeColor || null;
  let dims = null;

  // optimize screenshot → webp
  if (shotOk) {
    try {
      const buf = readFileSync(tmpPng);
      const img = sharp(buf);
      const stats = await img.stats();
      if (!dominant && stats.dominant) dominant = toHex(stats.dominant);
      const meta2 = await img.metadata();
      const targetW = 1280;
      dims = {
        width: targetW,
        height: Math.round((meta2.height / meta2.width) * targetW),
      };
      await sharp(buf)
        .resize({ width: targetW, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(join(OUT_DIR, `${t.slug}.webp`));
    } catch (e) {
      shotOk = false;
      process.stdout.write(`sharp failed (${e.message}) `);
    }
  }

  // fallback: download og:image if no screenshot
  if (!shotOk && meta.ogImage) {
    try {
      const res = await fetch(meta.ogImage, { headers: { "user-agent": UA } });
      const buf = Buffer.from(await res.arrayBuffer());
      const img = sharp(buf);
      const stats = await img.stats();
      if (!dominant && stats.dominant) dominant = toHex(stats.dominant);
      const m2 = await img.metadata();
      dims = { width: 1280, height: Math.round((m2.height / m2.width) * 1280) };
      await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(OUT_DIR, `${t.slug}.webp`));
      shotOk = true;
      process.stdout.write("(used og:image) ");
    } catch (e) {
      process.stdout.write(`og fallback failed (${e.message}) `);
    }
  }

  // download logo
  let logoFile = null;
  if (meta.logo) {
    try {
      const res = await fetch(meta.logo, { headers: { "user-agent": UA } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        await sharp(buf).resize({ width: 128, height: 128, fit: "inside" }).png().toFile(join(OUT_DIR, `${t.slug}-logo.png`));
        logoFile = `/assets/projects/${t.slug}-logo.png`;
      }
    } catch {
      /* ignore */
    }
  }

  results.push({
    slug: t.slug,
    url: t.url,
    finalUrl: meta.finalUrl || t.url,
    title: meta.title || null,
    description: meta.description || null,
    themeColor: meta.themeColor || null,
    dominant: dominant || null,
    image: shotOk ? `/assets/projects/${t.slug}.webp` : null,
    dims,
    logo: logoFile,
  });
  process.stdout.write(shotOk ? "✓\n" : "✗ (no image)\n");
}

// merge with existing meta.json so a filtered re-run doesn't drop prior captures
let merged = results;
const metaPath = join(OUT_DIR, "meta.json");
if (ONLY && existsSync(metaPath)) {
  const prev = JSON.parse(readFileSync(metaPath, "utf8"));
  const bySlug = new Map(prev.map((r) => [r.slug, r]));
  for (const r of results) bySlug.set(r.slug, r);
  merged = targets.map((t) => bySlug.get(t.slug)).filter(Boolean);
}
writeFileSync(metaPath, JSON.stringify(merged, null, 2));
console.log(`\nDone. ${results.filter((r) => r.image).length}/${results.length} images captured.`);
console.log(JSON.stringify(results.map((r) => ({ slug: r.slug, image: !!r.image, dominant: r.dominant, logo: !!r.logo })), null, 2));
