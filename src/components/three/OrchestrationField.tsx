"use client";

import dynamic from "next/dynamic";
import { Lazy3D } from "./Lazy3D";
import { OrchestrationPoster } from "./posters";

const OrchestrationScene = dynamic(() => import("./scenes/OrchestrationScene"), {
  ssr: false,
  loading: () => <OrchestrationPoster />,
});

export function OrchestrationField({ className }: { className?: string }) {
  return (
    <Lazy3D className={className} poster={<OrchestrationPoster />}>
      <OrchestrationScene />
    </Lazy3D>
  );
}
