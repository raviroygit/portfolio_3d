"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial, Preload } from "@react-three/drei";
import { inSphere } from "maath/random";
import * as THREE from "three";

const SIGNAL = "#b6f24a";
const NODE_COUNT = 700; // points; buffer length = NODE_COUNT*3 (multiple of 3)

/** Provider nodes drifting around the platform core. */
function NodeField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(
    () => inSphere(new Float32Array(NODE_COUNT * 3), { radius: 3.2 }) as Float32Array,
    [],
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x -= delta * 0.015;
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color={SIGNAL}
          size={0.022}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
    </group>
  );
}

/** The platform core — a wireframe icosahedron with an inner glow. */
function Core() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.z += delta * 0.05;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={ref}>
        {/* outer wireframe shell */}
        <mesh>
          <icosahedronGeometry args={[1.55, 1]} />
          <meshBasicMaterial color={SIGNAL} wireframe transparent opacity={0.55} />
        </mesh>
        {/* inner solid glowing core */}
        <mesh scale={0.62}>
          <icosahedronGeometry args={[1.55, 0]} />
          <meshStandardMaterial
            color={SIGNAL}
            emissive={SIGNAL}
            emissiveIntensity={1.1}
            roughness={0.35}
            metalness={0.1}
            flatShading
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function OrchestrationScene() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 5, 5]} intensity={2.2} color={SIGNAL} />
      <pointLight position={[-6, -4, -2]} intensity={0.8} color="#7dd3fc" />
      <Core />
      <NodeField />
      <Preload all />
    </Canvas>
  );
}
