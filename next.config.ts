import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js / @react-three packages ship modern ESM that benefits from transpilation
  transpilePackages: ["three"],
  // Remote blog cover images are served from the CMS's R2 bucket.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.r2.dev" }],
  },
  // allow .md/.mdx files to be treated as pages/content alongside ts/tsx
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // This project lives in a sibling-of-other-projects workspace; pin the root so
  // Next doesn't pick up the parent directory's lockfile.
  turbopack: {
    root: import.meta.dirname,
  },
};

// Turbopack requires remark/rehype plugins to be referenced by string name
// (not imported functions). Options are passed as a serializable tuple.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-pretty-code", { theme: "github-dark-default", keepBackground: false }],
      ["rehype-autolink-headings", { behavior: "wrap" }],
    ],
  },
});

export default withMDX(nextConfig);
