"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Html } from "@react-three/drei";

function Loader() {
  return (
    <Html center>
      <span className="font-mono text-xs text-fg-subtle">loading…</span>
    </Html>
  );
}

function Earth() {
  const earth = useGLTF("/planet/scene.gltf");
  return <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />;
}

export default function EarthScene() {
  return (
    <Canvas
      shadows="percentage"
      frameloop="always"
      dpr={[1, 1.75]}
      gl={{ preserveDrawingBuffer: true, alpha: true }}
      camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
    >
      <Suspense fallback={<Loader />}>
        <OrbitControls
          autoRotate
          autoRotateSpeed={1.2}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/planet/scene.gltf");
