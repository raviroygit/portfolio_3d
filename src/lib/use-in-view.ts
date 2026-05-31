"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver hook — gates expensive client work (3D canvases) so they
 * only mount/animate when near the viewport.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  rootMargin = "200px",
  once = true,
}: { rootMargin?: string; once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return { ref, inView };
}
