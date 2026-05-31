"use client";

import dynamic from "next/dynamic";
import { Lazy3D } from "./Lazy3D";
import { EarthPoster } from "./posters";

const EarthScene = dynamic(() => import("./scenes/EarthScene"), {
  ssr: false,
  loading: () => <EarthPoster />,
});

export function EarthGlobe({ className }: { className?: string }) {
  return (
    <Lazy3D className={className} poster={<EarthPoster />}>
      <EarthScene />
    </Lazy3D>
  );
}
