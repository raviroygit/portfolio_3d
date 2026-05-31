"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

function Loader() {
  return (
    <Html center>
      <span className="font-mono text-xs text-fg-subtle">loading…</span>
    </Html>
  );
}

function Computer({ isMobile }: { isMobile: boolean }) {
  const computer = useGLTF("/desktop_pc/scene.gltf");
  const screen = useTexture("/assets/desk-screen.png");

  // Replace the monitor's code-editor texture (material "Material.074_30")
  // with Ravi's photo so the on-screen content is his headshot.
  useEffect(() => {
    screen.flipY = false;
    screen.colorSpace = THREE.SRGBColorSpace;
    screen.needsUpdate = true;
    computer.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (mat.name === "Material.074_30") {
          mat.map = screen;
          mat.emissiveMap = screen;
          mat.emissive = new THREE.Color(0xffffff);
          mat.emissiveIntensity = 1.15;
          mat.toneMapped = false;
          mat.needsUpdate = true;
        }
      });
    });
  }, [computer.scene, screen]);

  return (
    <mesh>
      <hemisphereLight intensity={0.2} groundColor="black" />
      {/* signal-tinted key light to match the palette */}
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1.2}
        color="#dffbb3"
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} color="#b6f24a" />
      <pointLight position={[-6, -4, -6]} intensity={0.5} color="#7dd3fc" />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.8 : 1.0}
        position={isMobile ? [0, -1.6, -1.5] : [0, -1.9, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
}

export default function ComputerScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={<Loader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computer isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}

useGLTF.preload("/desktop_pc/scene.gltf");
