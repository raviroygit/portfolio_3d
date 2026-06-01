"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

/** A draggable, focusable, closable desktop window (glass surface). */
export function Window({
  title,
  x,
  y,
  z,
  width = 460,
  onClose,
  onFocus,
  onMoveBy,
  children,
}: {
  title: string;
  x: number;
  y: number;
  z: number;
  width?: number;
  onClose: () => void;
  onFocus: () => void;
  onMoveBy: (dx: number, dy: number) => void;
  children: React.ReactNode;
}) {
  const last = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    onFocus();
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!last.current) return;
    onMoveBy(e.clientX - last.current.x, e.clientY - last.current.y);
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    last.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      role="dialog"
      aria-label={title}
      onPointerDown={onFocus}
      style={{ left: x, top: y, width, zIndex: z }}
      className={cn(
        "absolute flex max-h-[82%] flex-col overflow-hidden rounded-xl border border-border glass shadow-card",
      )}
    >
      {/* title bar (drag handle) */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex shrink-0 cursor-grab items-center gap-2 border-b border-border bg-bg-2/70 px-3 py-2 active:cursor-grabbing"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          onPointerDown={(e) => e.stopPropagation()}
          className="size-3 rounded-full bg-[#ff5f57]/90 transition-transform hover:scale-110"
        />
        <span className="size-3 rounded-full bg-[#febc2e]/70" aria-hidden />
        <span className="size-3 rounded-full bg-[#28c840]/70" aria-hidden />
        <span className="ml-2 select-none truncate font-mono text-xs uppercase tracking-[0.14em] text-fg-muted">
          {title}
        </span>
      </div>
      {/* body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}
