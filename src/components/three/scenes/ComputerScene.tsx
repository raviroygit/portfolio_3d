"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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

// ---- curved ultrawide screen tuning ----------------------------------------
const ASPECT = 24 / 9; // ultrawide, narrow enough that the speakers stay visible
const IMG_ASPECT = 1600 / 900; // headshot source aspect
const CURVE = 0.42; // bend depth as a fraction of half-width (strong curve)
const WIDTH_SCALE = ASPECT / IMG_ASPECT; // widen the original screen to 32:9
const BEZEL = 0.06; // bezel thickness as a fraction of screen height
const EMISSIVE = 1.15;
const FLIP_Y = false; // flip the headshot vertically if it appears upside down
const MIRROR = false; // mirror horizontally if the photo reads reversed

/** Build a bent (concave-toward-viewer) panel in a local frame where
 *  width→X, height→Y, normal→+Z. Curves the edges forward along Z. */
function makeCurvedPanel(width: number, height: number, curve: number) {
  const geo = new THREE.PlaneGeometry(width, height, 96, 1);
  const half = width / 2;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const t = x / half;
    pos.setZ(i, curve * half * (t * t)); // parabolic: edges toward viewer
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

// ---- RGB nameplate (drawn on a canvas, glows like an LED sign) --------------
// Split around a transparent center gap so the monitor's central stand/neck
// sits in the gap and every letter stays clear: "RAVI | ROY" / "AI PLATFORM | ENGINEER".
const PLATE_W = 1024;
const PLATE_H = 360;
const GAP_L = PLATE_W * 0.37; // name: left edge of the center gap
const GAP_R = PLATE_W * 0.63; // name: right edge of the center gap
const ROLE_GAP_L = PLATE_W * 0.33; // role is longer → a wider gap
const ROLE_GAP_R = PLATE_W * 0.67;

function makeNameplateTexture() {
  const c = document.createElement("canvas");
  c.width = PLATE_W;
  c.height = PLATE_H;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, PLATE_W, PLATE_H);
  ctx.textBaseline = "middle";

  // RGB gradient across the full width → "RAVI" reads magenta, "ROY" reads cyan
  const grad = ctx.createLinearGradient(0, 0, PLATE_W, 0);
  grad.addColorStop(0.0, "#ff3db5");
  grad.addColorStop(0.5, "#8b5cff");
  grad.addColorStop(1.0, "#22d3ee");

  // name — large, glowing, split across the gap (drawn twice for intensity)
  ctx.font = "800 138px ui-sans-serif, system-ui, Arial, sans-serif";
  ctx.fillStyle = grad;
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 44;
  const nameY = PLATE_H * 0.36;
  ctx.textAlign = "right";
  ctx.fillText("RAVI", GAP_L, nameY);
  ctx.fillText("RAVI", GAP_L, nameY);
  ctx.textAlign = "left";
  ctx.fillText("ROY", GAP_R, nameY);
  ctx.fillText("ROY", GAP_R, nameY);

  // role — smaller, cyan, spaced; also split across the gap
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "4px";
  } catch {
    /* older engines: ignore */
  }
  ctx.font = "600 40px ui-monospace, monospace";
  ctx.fillStyle = "#d7f5ff";
  ctx.shadowColor = "#22d3ee";
  ctx.shadowBlur = 24;
  const roleY = PLATE_H * 0.64;
  ctx.textAlign = "right";
  ctx.fillText("AI PLATFORM", ROLE_GAP_L, roleY);
  ctx.textAlign = "left";
  ctx.fillText("ENGINEER", ROLE_GAP_R, roleY);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function Computer({ isMobile }: { isMobile: boolean }) {
  const computer = useGLTF("/desktop_pc/scene.gltf");
  const screen = useTexture("/assets/desk-screen.png");
  const plateTex = useMemo(() => makeNameplateTexture(), []);

  // Replace the flat monitor screen (mesh "MY SCREEN", material
  // "Material.074_30") with a curved 32:9 ultrawide panel showing the headshot.
  useEffect(() => {
    screen.colorSpace = THREE.SRGBColorSpace;
    screen.needsUpdate = true;

    let screenMesh: THREE.Mesh | undefined;
    computer.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      if (mats.some((m) => (m as THREE.Material).name === "Material.074_30")) {
        screenMesh = mesh;
      }
    });

    if (!screenMesh || !screenMesh.parent) return;

    // --- measure the original flat screen in its local space ---
    screenMesh.geometry.computeBoundingBox();
    const bb = screenMesh.geometry.boundingBox!;
    const size = new THREE.Vector3();
    bb.getSize(size);
    const center = new THREE.Vector3();
    bb.getCenter(center);
    const ext = [size.x, size.y, size.z];
    const normalAxis = ext.indexOf(Math.min(...ext)); // thinnest = facing normal
    const planar = [0, 1, 2].filter((a) => a !== normalAxis);
    const widthAxis = ext[planar[0]] >= ext[planar[1]] ? planar[0] : planar[1];
    const heightAxis = planar[0] === widthAxis ? planar[1] : planar[0];

    const baseW = ext[widthAxis];
    const baseH = ext[heightAxis];
    const width = baseW * WIDTH_SCALE;
    const height = baseH;

    // --- curved screen panel (built in width=X / height=Y / normal=+Z) ---
    const tex = screen.clone();
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = FLIP_Y;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    // keep the headshot undistorted & centered; dark edges fill the wide sides
    tex.repeat.set((MIRROR ? -1 : 1) * WIDTH_SCALE, 1);
    tex.offset.set((1 - tex.repeat.x) / 2, 0);
    tex.needsUpdate = true;

    const screenMat = new THREE.MeshStandardMaterial({
      map: tex,
      emissiveMap: tex,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: EMISSIVE,
      roughness: 0.35,
      metalness: 0,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const screenGeo = makeCurvedPanel(width, height, CURVE);
    const panel = new THREE.Mesh(screenGeo, screenMat);

    // slim dark bezel just behind the screen
    const bez = baseH * BEZEL;
    const bezelGeo = makeCurvedPanel(width + bez * 2, height + bez * 2, CURVE);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x07070a,
      roughness: 0.5,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.z = -bez * 0.6;

    // orient the local XYZ frame onto the screen's width/height/normal axes
    const group = new THREE.Group();
    group.add(bezel, panel);
    const basis = new THREE.Matrix4();
    const col = (axis: number, sign = 1) => {
      const v = [0, 0, 0];
      v[axis] = sign;
      return new THREE.Vector3(v[0], v[1], v[2]);
    };
    basis.makeBasis(col(widthAxis), col(heightAxis), col(normalAxis));
    const basisQuat = new THREE.Quaternion().setFromRotationMatrix(basis);
    // group is a sibling of the screen mesh: reproduce the screen's local
    // transform, then offset to the screen's geometry center and align axes.
    group.quaternion.copy(screenMesh.quaternion).multiply(basisQuat);
    group.scale.copy(screenMesh.scale);
    group.position
      .copy(center)
      .multiply(screenMesh.scale)
      .applyQuaternion(screenMesh.quaternion)
      .add(screenMesh.position);

    // --- glowing RGB nameplate on the BACK of the monitor ---
    const plateW = width * 0.72;
    const plateH = plateW * (PLATE_H / PLATE_W);
    const plateGeo = new THREE.PlaneGeometry(plateW, plateH);
    const plateMat = new THREE.MeshBasicMaterial({
      map: plateTex,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const nameplate = new THREE.Mesh(plateGeo, plateMat);
    // vertically centered on the monitor back; the split text clears the
    // central stand/neck via the gap. Sit just behind the bezel, face the back.
    nameplate.position.set(0, 0, -(baseH * BEZEL + 0.05));
    nameplate.rotation.y = Math.PI;
    group.add(nameplate);

    screenMesh.visible = false; // hide the flat screen
    screenMesh.parent.add(group);

    return () => {
      screenMesh!.parent?.remove(group);
      screenGeo.dispose();
      bezelGeo.dispose();
      screenMat.dispose();
      bezelMat.dispose();
      tex.dispose();
      plateGeo.dispose();
      plateMat.dispose();
      screenMesh!.visible = true;
    };
  }, [computer.scene, screen, plateTex]);

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
