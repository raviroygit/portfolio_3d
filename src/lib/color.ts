/** Signal lime — the fallback glow when a brand color is too dark/light to glow. */
export const SIGNAL_GLOW = "#b6f24a";

/**
 * Pick a usable glow color from a captured brand dominant. Many product
 * dominants are near-black or near-white (dark/light themes) and don't read as a
 * glow — in those cases fall back to the signal accent so the effect stays vivid.
 */
export function glowColor(hex?: string | null): string {
  if (!hex) return SIGNAL_GLOW;
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return SIGNAL_GLOW;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  // perceived luminance 0..1
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  // saturation (max-min)/max
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (lum < 0.16 || lum > 0.85 || sat < 0.18) return SIGNAL_GLOW;
  return `#${m[1]}`;
}
