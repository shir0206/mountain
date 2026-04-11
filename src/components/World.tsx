import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

// ─── Model config ────────────────────────────────────────────────────────────
//
//  SCENE LAYOUT (top-down):
//
//    [Mountain] — massive, fills viewport, camera looks slightly upward
//        └── [Terrace]  — glass terrace sitting on the summit plateau
//                └── [Desk]      — Scandinavian desk on the terrace floor
//                       ├── [Monitors]  — dual monitors on desk surface
//                       ├── [Keyboard]  — keyboard in front of monitors
//                       └── [Laptop]    — laptop beside keyboard
//             └── [Chair]       — pulled up to the desk
//
//  All Y values are world-space.  Tune them if model origins differ.
//  DESK_Y  = terrace floor height (~4.6)
//  SURF_Y  = desk surface height  (~5.45 = DESK_Y + ~0.85)
// ─────────────────────────────────────────────────────────────────────────────

const MOUNTAIN_SCALE = 10; // fills the screen nicely at fov 55
const MOUNTAIN_Y = -3.5; // push base below camera so peak is centred

// terrace sits on the mountain summit plateau
const TERRACE_Y = 4.8; // ↑ raise/lower to land on the peak
const TERRACE_SCALE = 0.003;

// desk on the terrace floor
const DESK_X = 0;
const DESK_Y = TERRACE_Y + 0.05; // just above terrace floor
const DESK_Z = 0;
const DESK_SCALE = 0.95;

// desk surface (monitors / keyboard / laptop sit here)
const SURF_Y = DESK_Y + 0.88;

// chair — pulled back from the desk
const CHAIR_X = DESK_X;
const CHAIR_Y = DESK_Y;
const CHAIR_Z = DESK_Z + 1.0; // in front of desk (toward camera)
const CHAIR_SCALE = 0.95;

interface ModelConfig {
  path: string;
  label: string;
  position: [number, number, number];
  scale: number;
  floatSpeed: number;
  floatIntensity: number;
  rotationY?: number; // optional Y-axis rotation in radians
}

const MODEL_CONFIG: ModelConfig[] = [
  // ── 1. MOUNTAIN ─────────────────────────────────────────────────────────────
  {
    path: "/models/weisse_wand_mountain_peek_2517_m_8257_ft.glb",
    label: "Mountain Peak",
    position: [0, MOUNTAIN_Y, 0],
    scale: MOUNTAIN_SCALE,
    floatSpeed: 0, // static — mountains don't float
    floatIntensity: 0,
  },

  // ── 2. GLASS TERRACE on the summit ──────────────────────────────────────────
  {
    path: "/models/terrace.glb",
    label: "Glass Terrace",
    position: [0, TERRACE_Y, 0],
    scale: TERRACE_SCALE,

    floatSpeed: 0,
    floatIntensity: 0,
  },

  // ── 3. DESK on the terrace ───────────────────────────────────────────────────
  {
    path: "/models/scandi_modern_office_desk_psx_style.glb",
    label: "Scandi Desk",
    position: [DESK_X, DESK_Y, DESK_Z],
    scale: DESK_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  // ── 4. CHAIR beside / in front of desk ──────────────────────────────────────
  {
    path: "/models/muskonge_n24t6n23s2001.glb",
    label: "Chair",
    position: [CHAIR_X, CHAIR_Y, CHAIR_Z],
    scale: CHAIR_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: Math.PI, // face the desk
  },

  // ── 5. DUAL MONITORS on the desk surface ────────────────────────────────────
  {
    path: "/models/two_monitors.glb",
    label: "Monitors",
    position: [DESK_X, SURF_Y, DESK_Z - 0.25], // pushed toward back of desk
    scale: 0.005,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  // ── 6. KEYBOARD on the desk surface ─────────────────────────────────────────
  {
    path: "/models/mac_keyboard.glb",
    label: "Keyboard",
    position: [DESK_X, SURF_Y, DESK_Z + 0.1], // in front of monitors
    scale: 0.005,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  // ── 7. LAPTOP beside keyboard ────────────────────────────────────────────────
  {
    path: "/models/free_mac_book_pro_-_laptop.glb",
    label: "Laptop",
    position: [DESK_X + 0.5, SURF_Y, DESK_Z + 0.05], // right side of desk
    scale: 0.005,
    floatSpeed: 0,
    floatIntensity: 0,
  },
];

// Preload all models
MODEL_CONFIG.forEach(({ path }) => useGLTF.preload(path));

// ─── Individual model loader ──────────────────────────────────────────────────
function Model({
  path,
  position,
  scale,
  floatSpeed,
  floatIntensity,
  rotationY = 0,
}: Omit<ModelConfig, "label">) {
  const { scene } = useGLTF(path) as GLTF & { scene: THREE.Group };
  const cloned = scene.clone(true);

  return (
    <Float
      speed={floatSpeed}
      floatIntensity={floatIntensity}
      rotationIntensity={floatSpeed > 0 ? 0.05 : 0}
    >
      <primitive
        object={cloned}
        position={position}
        scale={scale}
        rotation-y={rotationY}
      />
    </Float>
  );
}

// ─── Loading fallback ─────────────────────────────────────────────────────────
function Placeholder({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#3a4a5a" wireframe />
    </mesh>
  );
}

// ─── Lighting ─────────────────────────────────────────────────────────────────
// Crisp alpine atmosphere — thin cold air, bright directional sun, blue shadows.
function AlpineLighting() {
  return (
    <>
      {/* Cold-sky ambient fill */}
      <ambientLight color="#b0c8e0" intensity={0.9} />

      {/* Hemisphere: ice-blue sky / grey-white snow ground */}
      <hemisphereLight args={["#a8c8e8", "#d8dde0", 1.6]} />

      {/* High-altitude sun — sharp, slightly warm white */}
      <directionalLight
        color="#fff5e8"
        intensity={2.2}
        position={[12, 20, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Cool fill light from opposite side — blue alpine shadow */}
      <directionalLight
        color="#8ab0d8"
        intensity={0.6}
        position={[-10, 6, -12]}
        castShadow={false}
      />

      {/* Subtle warm bounce from below (snow reflection) */}
      <directionalLight
        color="#e8f0f8"
        intensity={0.35}
        position={[0, -8, 0]}
        castShadow={false}
      />
    </>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <AlpineLighting />

      {MODEL_CONFIG.map((config) => (
        <Suspense
          key={config.path}
          fallback={<Placeholder position={config.position} />}
        >
          <Model
            path={config.path}
            position={config.position}
            scale={config.scale}
            floatSpeed={config.floatSpeed}
            floatIntensity={config.floatIntensity}
            rotationY={config.rotationY}
          />
        </Suspense>
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={80}
        // Start looking slightly upward toward the peak
        target={[0, 3, 0]}
      />
    </>
  );
}

// ─── World (root export) ──────────────────────────────────────────────────────
// Camera: pulled back and slightly low so the mountain fills the frame,
// with the glass terrace + desk visible at the summit.
export default function World() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0d1520" }}>
      <Canvas
        camera={{
          position: [0, 6, 28], // eye level below the peak, looking up
          fov: 55,
          near: 0.1,
          far: 250,
        }}
        gl={{ antialias: true, toneMapping: 3 /* ACESFilmic */ }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor("#0d1520");
        }}
      >
        {/* Deep-blue alpine dusk sky fading into darkness */}
        <fog attach="fog" args={["#0d1a2e", 40, 120]} />
        <Scene />
      </Canvas>
    </div>
  );
}
