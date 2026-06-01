import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Writing by Ravi Roy";

export default function Image() {
  return renderOgCard({
    eyebrow: "writing",
    title: "Notes on building AI infrastructure.",
  });
}
