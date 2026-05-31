"use client";

import dynamic from "next/dynamic";
import { Lazy3D } from "./Lazy3D";
import { StarfieldPoster } from "./posters";

const StarfieldScene = dynamic(() => import("./scenes/StarfieldScene"), {
  ssr: false,
  loading: () => <StarfieldPoster />,
});

export function BackgroundStarfield({ className }: { className?: string }) {
  return (
    <Lazy3D className={className} poster={<StarfieldPoster />} rootMargin="0px">
      <StarfieldScene />
    </Lazy3D>
  );
}
