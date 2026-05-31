"use client";

import dynamic from "next/dynamic";
import { Lazy3D } from "./Lazy3D";
import { ComputerPoster } from "./posters";

const ComputerScene = dynamic(() => import("./scenes/ComputerScene"), {
  ssr: false,
  loading: () => <ComputerPoster />,
});

export function HeroComputer({ className }: { className?: string }) {
  return (
    <Lazy3D className={className} poster={<ComputerPoster />} rootMargin="0px">
      <ComputerScene />
    </Lazy3D>
  );
}
