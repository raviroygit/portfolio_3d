import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Work & case studies by Ravi Roy";

export default function Image() {
  return renderOgCard({
    eyebrow: "work · case studies",
    title: "AI platforms, products, and systems.",
    footer: ["17 projects"],
  });
}
