"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import { inSphere } from "maath/random";
import * as THREE from "three";

function Stars() {
  const ref = useRef<THREE.Points>(null);
  // buffer length multiple of 3
  const positions = useMemo(
    () => inSphere(new Float32Array(1800), { radius: 1.3 }) as Float32Array,
    [],
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 18;
    ref.current.rotation.y -= delta / 26;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#9aa3b2"
          size={0.0022}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
    </group>
  );
}

export default function StarfieldScene() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1] }}
      gl={{ antialias: false, alpha: true }}
    >
      <Stars />
      <Preload all />
    </Canvas>
  );
}
