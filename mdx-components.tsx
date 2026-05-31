import type { MDXComponents } from "mdx/types";

/**
 * Global MDX component map (required by @next/mdx). Long-form styling is handled
 * by the <Prose> wrapper via descendant selectors, so this stays minimal —
 * mostly safe defaults for links.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = "", children, ...props }) => {
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...props}
        >
          {children}
        </a>
      );
    },
    ...components,
  };
}
