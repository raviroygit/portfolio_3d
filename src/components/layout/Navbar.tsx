"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { navItems, siteConfig } from "@/lib/seo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-fluid",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-mono text-sm font-medium"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/assets/logo.png"
            alt="Ravi Roy"
            width={28}
            height={28}
            className="size-7 rounded-full border border-signal/50 object-cover transition-transform group-hover:scale-110"
          />
          <span className="text-fg">Ravi Roy</span>
          <span className="text-fg-subtle">/ AI Platform Engineer</span>
        </Link>

        {/* desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 font-mono text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
          <Button
            href={siteConfig.calendar || "/contact"}
            size="sm"
            className="ml-2"
          >
            Book a call
          </Button>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-full border border-border text-fg md:hidden"
        >
          <span className="font-mono text-lg leading-none">{open ? "×" : "≡"}</span>
        </button>
      </nav>

      {/* mobile menu */}
      {open ? (
        <div className="border-t border-border bg-bg/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-mono text-sm text-fg-muted hover:bg-surface/60 hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <Button
              href={siteConfig.calendar || "/contact"}
              size="sm"
              className="mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Book a call
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
