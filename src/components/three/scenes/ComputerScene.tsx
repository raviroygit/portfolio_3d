"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { Desktop } from "@/components/desktop/Desktop";

// the on-screen UI sits just in front of the screen panel
const FRONT_Z = 0.06;
// head-on fly-in distance, as a multiple of the screen's world width — small
// enough that the modal frames just the monitor screen (tower/desk leave frame)
const CAM_DIST = 0.72;
// overscan so the OS fully covers the screen (no wallpaper peeking at edges)
const FILL = 1.06;

type ScreenInfo = {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  halfRight: THREE.Vector3; // world vector from center to the screen's right edge
  aspect: number; // width / height
};

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

type ScreenXf = {
  pos: [number, number, number];
  quat: [number, number, number, number];
  scale: [number, number, number];
  width: number;
  height: number;
  aspect: number;
};

function Computer({
  variant,
  isMobile,
  screenPx,
  onOpen,
  onExit,
  onScreenInfo,
}: {
  variant: "hero" | "modal";
  isMobile: boolean;
  screenPx: number;
  onOpen?: () => void;
  onExit?: () => void;
  onScreenInfo: (info: ScreenInfo) => void;
}) {
  const gltf = useGLTF("/desktop_pc/scene.gltf");
  // clone so the same model can render in both the hero and the modal canvases
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const screen = useTexture("/assets/desk-screen.png");
  const plateTex = useMemo(() => makeNameplateTexture(), []);
  const [xf, setXf] = useState<ScreenXf | null>(null);

  // Replace the flat monitor screen (mesh "MY SCREEN", material
  // "Material.074_30") with a curved 32:9 ultrawide panel showing the headshot.
  useEffect(() => {
    screen.colorSpace = THREE.SRGBColorSpace;
    screen.needsUpdate = true;

    let screenMesh: THREE.Mesh | undefined;
    scene.traverse((o) => {
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

    // expose the screen's WORLD transform so the click target + hint (rendered
    // in JSX under the world-origin <mesh>) sit exactly on the monitor.
    group.updateWorldMatrix(true, false);
    const wp = new THREE.Vector3();
    const wq = new THREE.Quaternion();
    const ws = new THREE.Vector3();
    group.matrixWorld.decompose(wp, wq, ws);
    setXf({
      pos: [wp.x, wp.y, wp.z],
      quat: [wq.x, wq.y, wq.z, wq.w],
      scale: [ws.x, ws.y, ws.z],
      width,
      height,
      aspect: width / height,
    });
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(wq).normalize();
    const halfRight = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(wq)
      .multiplyScalar((width * ws.x) / 2);
    onScreenInfo({ center: wp.clone(), normal, halfRight, aspect: width / height });

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
  }, [scene, screen, plateTex, isMobile, onScreenInfo]);

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
        object={scene}
        scale={isMobile ? 0.8 : 1.0}
        position={isMobile ? [0, -1.6, -1.5] : [0, -1.9, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />

      {/* on-screen UI welded to the monitor. hero → "open desktop" button
          (lg only); modal → the live interactive desktop, sized to the screen. */}
      {xf && (variant === "modal" || !isMobile) ? (
        <group position={xf.pos} quaternion={xf.quat} scale={xf.scale}>
          <Html center position={[0, 0, FRONT_Z]} zIndexRange={[30, 0]} pointerEvents="auto">
            {variant === "modal" ? (
              <div
                style={{
                  width: (screenPx || 900) * FILL,
                  height: ((screenPx || 900) * FILL) / xf.aspect,
                  opacity: screenPx ? 1 : 0,
                }}
                className="overflow-hidden rounded-[4px] transition-opacity duration-200"
              >
                <Desktop onExit={onExit} />
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen?.();
                }}
                className="-translate-y-1 cursor-pointer whitespace-nowrap rounded-full border border-signal/50 bg-bg/60 px-5 py-2.5 font-mono text-sm text-signal shadow-glow backdrop-blur-sm transition-colors hover:bg-signal/15"
              >
                ⏻ open desktop
              </button>
            )}
          </Html>
        </group>
      ) : null}
    </mesh>
  );
}

/** Flies the camera head-on to the screen when `active` (back to the hero view
 *  otherwise), and reports the screen's on-screen pixel width once settled. */
function CameraRig({
  active,
  animating,
  info,
  onSettle,
  setScreenPx,
}: {
  active: boolean;
  animating: boolean;
  info: ScreenInfo | null;
  onSettle: () => void;
  setScreenPx: (px: number) => void;
}) {
  const { camera, gl, invalidate } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(20, 3, 5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const lastPx = useRef(0);

  const measure = () => {
    if (!info) return;
    camera.updateMatrixWorld();
    const l = info.center.clone().sub(info.halfRight).project(camera);
    const r = info.center.clone().add(info.halfRight).project(camera);
    const w = (Math.abs(r.x - l.x) / 2) * gl.domElement.clientWidth;
    if (w > 0 && Math.abs(w - lastPx.current) > 0.5) {
      lastPx.current = w;
      setScreenPx(w);
    }
  };

  useEffect(() => {
    if (active && info) {
      const n = info.normal.clone();
      if (n.dot(new THREE.Vector3(20, 3, 5).sub(info.center)) < 0) n.negate();
      const width = info.halfRight.length() * 2;
      targetPos.current = info.center.clone().addScaledVector(n, width * CAM_DIST);
      targetLook.current = info.center.clone();
    } else {
      targetPos.current.set(20, 3, 5);
      targetLook.current.set(0, 0, 0);
    }
    invalidate();
  }, [active, info, invalidate]);

  // recompute the overlay size on resize while engaged (camera is static then)
  useEffect(() => {
    if (!active) return;
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, info]);

  useFrame(() => {
    if (!animating) return;
    camera.position.lerp(targetPos.current, 0.09);
    look.current.lerp(targetLook.current, 0.09);
    camera.lookAt(look.current);
    if (active) measure(); // converge the overlay size during the fly-in
    if (camera.position.distanceTo(targetPos.current) > 0.03) {
      invalidate();
    } else {
      if (active) measure();
      onSettle();
    }
  });

  return null;
}

export default function ComputerScene({
  variant = "hero",
  onOpen,
  onExit,
}: {
  variant?: "hero" | "modal";
  onOpen?: () => void;
  onExit?: () => void;
}) {
  const isModal = variant === "modal";
  const [isMobile, setIsMobile] = useState(false);
  const [animating, setAnimating] = useState(isModal); // modal flies head-on on mount
  const [info, setInfo] = useState<ScreenInfo | null>(null);
  const [screenPx, setScreenPx] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Canvas
      frameloop={isModal && animating ? "always" : "demand"}
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={<Loader />}>
        <OrbitControls
          enabled={!isModal}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computer
          variant={variant}
          isMobile={isMobile}
          screenPx={screenPx}
          onOpen={onOpen}
          onExit={onExit}
          onScreenInfo={setInfo}
        />
        {isModal ? (
          <CameraRig
            active
            animating={animating}
            info={info}
            onSettle={() => setAnimating(false)}
            setScreenPx={setScreenPx}
          />
        ) : null}
      </Suspense>
      <Preload all />
    </Canvas>
  );
}

useGLTF.preload("/desktop_pc/scene.gltf");
