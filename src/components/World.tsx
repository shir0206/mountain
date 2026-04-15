import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import type { GLTF, OrbitControls as OrbitControlsImpl } from "three-stdlib";
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

const MOUNTAIN_SCALE = 80; // world-filling — edges never visible, you live inside it
const MOUNTAIN_Y = -50; // sink the base deep; the peak rises above the camera

// Peak world-Y derived from original model-space ratio (0.83) measured at scale 10 / Y -3.5
// Formula: MOUNTAIN_Y + 0.83 * MOUNTAIN_SCALE
const PEAK_WORLD_Y = MOUNTAIN_Y + 0.23 * MOUNTAIN_SCALE; // ≈ 16.4

// Terrace is locked to the real peak — no guesswork
const TERRACE_X = -2;
const TERRACE_Y = PEAK_WORLD_Y;
const TERRACE_Z = -4.5;
const TERRACE_SCALE = 0.003;

const SHELF_X = TERRACE_X + 3.5; // slight offset from terrace center
const SHELF_Y = TERRACE_Y + 0.5;
const SHELF_Z = TERRACE_Z - 3.5;
const SHELF_ANGLE = Math.PI; // slight angle facing the desk

const DESK_X = TERRACE_X - 2.5; // slight offset from terrace center
const DESK_Y = TERRACE_Y + 0.6;
const DESK_Z = TERRACE_Z - 4;
const DESK_SCALE = 1;

const MONITOR_X = DESK_X - 3;
const MONITOR_Y = DESK_Y + 0.41;
const MONITOR_Z = DESK_Z - 0.05; // slightly back on the desk

const KEYBOARD_X = DESK_X;
const KEYBOARD_Y = DESK_Y + 0.74;
const KEYBOARD_Z = DESK_Z + 0.5;

const LAPTOP_X = DESK_X - 0.7;
const LAPTOP_Y = DESK_Y + 0.74;
const LAPTOP_Z = DESK_Z;

const MOUSE_X = DESK_X + 0.6;
const MOUSE_Y = DESK_Y + 0.74;
const MOUSE_Z = DESK_Z + 0.3;
const OFFICE_CHAIR_X = DESK_X;
const OFFICE_CHAIR_Y = DESK_Y - 0.4;
const OFFICE_CHAIR_Z = DESK_Z + 1.0; // in front of desk (toward camera)
const OFFICE_CHAIR_SCALE = 0.015;

const COFFEE_TABLE_X = TERRACE_X + 1.2;
const COFFEE_TABLE_Y = TERRACE_Y + 0.2;
const COFFEE_TABLE_Z = TERRACE_Z - 0.75;

const ARMCHAIR_X = COFFEE_TABLE_X + 0.2;
const ARMCHAIR_Y = COFFEE_TABLE_Y - 0.15;
const ARMCHAIR_Z = COFFEE_TABLE_Z - 1.4;
const ARMCHAIR_SCALE = 0.012;

const ARMCHAIR_ANGLE = Math.atan2(
  COFFEE_TABLE_X - ARMCHAIR_X,
  COFFEE_TABLE_Z - ARMCHAIR_Z
);
const SOFA_X = COFFEE_TABLE_X + 1.5;
const SOFA_Y = COFFEE_TABLE_Y - 0.05;
const SOFA_Z = COFFEE_TABLE_Z - 0.8;
const SOFA_ANGLE = Math.PI * 1.5;
// const PLANT_X = TABLE_X;
// const PLANT_Y = TABLE_Y + 0.45;
// const PLANT_Z = TABLE_Z;

const RUG_MEETING_X = TERRACE_X + 2;
const RUG_MEETING_Y = TERRACE_Y + 0.05;
const RUG_MEETING_Z = TERRACE_Z - 1;

const RUG_OFFICE_X = DESK_X;
const RUG_OFFICE_Y = DESK_Y - 0.5;
const RUG_OFFICE_Z = DESK_Z + 0.4;
const RUG_OFFICE_SCALE = 2;
const RUG_OFFICE_ANGLE = Math.PI / 2;

interface ModelConfig {
  path: string;
  label: string;
  position: [number, number, number];
  scale: number | [number, number, number]; // uniform or per-axis [x, y, z]
  floatSpeed: number;
  floatIntensity: number;
  rotationY?: number; // optional Y-axis rotation in radians
}

const MODEL_CONFIG: ModelConfig[] = [
  {
    path: "/models/weisse_wand_mountain_peek_2517_m_8257_ft.glb",
    label: "Mountain Peak",
    position: [0, MOUNTAIN_Y, 0],
    scale: MOUNTAIN_SCALE,
    floatSpeed: 0, // static — mountains don't float
    floatIntensity: 0,
  },

  {
    path: "/models/terrace.glb",
    label: "Glass Terrace",
    position: [TERRACE_X, TERRACE_Y, TERRACE_Z],
    scale: [TERRACE_SCALE * 2.2, TERRACE_SCALE, TERRACE_SCALE * 4], // stretch X+Z, keep height
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/old_table_-_game_ready.glb",
    label: "Desk",
    position: [DESK_X, DESK_Y, DESK_Z],
    scale: [DESK_SCALE * 1.2, DESK_SCALE, DESK_SCALE * 1.2], // stretch X+Z, keep height
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/harvey_swivel_chair_mineral_blue.glb",
    label: "Chair",
    position: [OFFICE_CHAIR_X, OFFICE_CHAIR_Y, OFFICE_CHAIR_Z],
    scale: OFFICE_CHAIR_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: Math.PI, // face the desk
  },

  {
    path: "/models/monitor.glb",
    label: "Monitor",
    position: [MONITOR_X, MONITOR_Y, MONITOR_Z],
    scale: 1.2,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/mac_keyboard.glb",
    label: "Keyboard",
    position: [KEYBOARD_X, KEYBOARD_Y, KEYBOARD_Z],
    scale: 0.007,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/lowpoly_laptop_closed.glb",
    label: "Laptop",
    position: [LAPTOP_X, LAPTOP_Y, LAPTOP_Z],
    scale: 1.8,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/imac_magic_mouse.glb",
    label: "mouse",
    position: [MOUSE_X, MOUSE_Y, MOUSE_Z],
    scale: 1.5,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/rug.glb",
    label: "rug office",
    position: [RUG_OFFICE_X, RUG_OFFICE_Y, RUG_OFFICE_Z],
    scale: [RUG_OFFICE_SCALE * 1.2, RUG_OFFICE_SCALE, RUG_OFFICE_SCALE * 1.2],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: RUG_OFFICE_ANGLE,
  },

  {
    path: "/models/Untitled.glb",
    label: "Armchair",
    position: [ARMCHAIR_X, ARMCHAIR_Y, ARMCHAIR_Z],
    scale: ARMCHAIR_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: ARMCHAIR_ANGLE,
  },
  {
    path: "/models/dylan_2_seater_sofa_mineral_blue.glb",
    label: "sofa",
    position: [SOFA_X, SOFA_Y, SOFA_Z],
    scale: 0.01,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: SOFA_ANGLE,
  },

  {
    path: "/models/retro_wood_coffee_table.glb",
    label: "coffee table",
    position: [COFFEE_TABLE_X, COFFEE_TABLE_Y, COFFEE_TABLE_Z],
    scale: 2,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/rug.glb",
    label: "rug meeting",
    position: [RUG_MEETING_X, RUG_MEETING_Y, RUG_MEETING_Z],
    scale: 2,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/tv_bench__tv_table__tv_stand_wood.glb",
    label: "shelf",
    position: [SHELF_X, SHELF_Y, SHELF_Z],
    scale: 2,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: SHELF_ANGLE,
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
      <meshStandardMaterial color="#fff" wireframe />
    </mesh>
  );
}

// ─── Lighting ─────────────────────────────────────────────────────────────────
// Crisp alpine atmosphere — thin cold air, bright directional sun, blue shadows.
function AlpineLighting() {
  return (
    <>
      {/* Cold-sky ambient fill */}
      <ambientLight color="#dedede" intensity={0.9} />
      <hemisphereLight args={["#dedede", "#dedede", 1.6]} />

      {/* High-altitude sun — sharp, slightly warm white */}
      <directionalLight
        color="#dedede"
        intensity={2.2}
        position={[12, 20, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.01}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Cool fill light from opposite side — blue alpine shadow */}
      <directionalLight
        color="#dedede"
        intensity={0.6}
        position={[-10, 6, -12]}
        castShadow={false}
      />

      {/* Subtle warm bounce from below (snow reflection) */}
      <directionalLight
        color="#dedede"
        intensity={0.35}
        position={[0, -8, 0]}
        castShadow={false}
      />
    </>
  );
}

// ─── Camera tracker ──────────────────────────────────────────────────────────
// Logs camera position + OrbitControls target to devtools on every change.
function CameraTracker({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const lastPos = useRef(new THREE.Vector3());
  const lastTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const pos = camera.position;
    const target = controlsRef.current?.target ?? new THREE.Vector3();

    const posChanged =
      Math.abs(pos.x - lastPos.current.x) > 0.01 ||
      Math.abs(pos.y - lastPos.current.y) > 0.01 ||
      Math.abs(pos.z - lastPos.current.z) > 0.01;

    const targetChanged =
      Math.abs(target.x - lastTarget.current.x) > 0.01 ||
      Math.abs(target.y - lastTarget.current.y) > 0.01 ||
      Math.abs(target.z - lastTarget.current.z) > 0.01;

    if (posChanged || targetChanged) {
      console.log("%c[Camera]", "color:#dedede;font-weight:bold", {
        position: {
          x: +pos.x.toFixed(2),
          y: +pos.y.toFixed(2),
          z: +pos.z.toFixed(2),
        },
        target: {
          x: +target.x.toFixed(2),
          y: +target.y.toFixed(2),
          z: +target.z.toFixed(2),
        },
      });
      lastPos.current.copy(pos);
      lastTarget.current.copy(target);
    }
  });

  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <AlpineLighting />
      <CameraTracker controlsRef={controlsRef} />

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
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={0}
        maxDistance={80}
        //  target={[50, -30, -20]}
        // target={[1, -30, -15]}
        // target={[30, -40, -30]}
        target={[-8.27, -29.56, -3.16]}
      />
    </>
  );
}

// ─── World (root export) ──────────────────────────────────────────────────────
// Camera: pulled back and slightly low so the mountain fills the frame,
// with the glass terrace + desk visible at the summit.
export default function World() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#fff" }}>
      <Canvas
        camera={{
          position: [0, 4, 55], // deep inside the mountain base, looking up
          fov: 20,
          near: 0.1,
          far: 600,
        }}
        gl={{ antialias: true, toneMapping: 3 /* ACESFilmic */ }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor("#fff");
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
