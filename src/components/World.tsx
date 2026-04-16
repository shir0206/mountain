import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float, Environment } from "@react-three/drei";
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

const MOUNTAIN_SCALE = 80;
const MOUNTAIN_Y = -50;
const PEAK_WORLD_Y = MOUNTAIN_Y + 0.23 * MOUNTAIN_SCALE;

const TERRACE_X = -5;
const TERRACE_Y = PEAK_WORLD_Y - 0.5;
const TERRACE_Z = -8;
const TERRACE_SCALE = 0.003;

const SHELF_X = TERRACE_X + 2.5;
const SHELF_Y = TERRACE_Y + 0.05;
const SHELF_Z = TERRACE_Z - 3;
const SHELF_SCALE = 0.015;
const SHELF_ANGLE = Math.PI * 1.5;

const DESK_X = TERRACE_X - 1.5;
const DESK_Y = TERRACE_Y + 0.02;
const DESK_Z = TERRACE_Z - 5.3;
const DESK_SCALE = 0.015;

const MONITOR_X = DESK_X - 3;
const MONITOR_Y = DESK_Y + 0.75;
const MONITOR_Z = DESK_Z - 0.05;

const KEYBOARD_X = DESK_X;
const KEYBOARD_Y = DESK_Y + 1.08;
const KEYBOARD_Z = DESK_Z + 0.5;

const LAPTOP_X = DESK_X - 0.7;
const LAPTOP_Y = DESK_Y + 1.14;
const LAPTOP_Z = DESK_Z;

const MOUSE_X = DESK_X + 0.6;
const MOUSE_Y = DESK_Y + 1.08;
const MOUSE_Z = DESK_Z + 0.3;

const OFFICE_CHAIR_X = DESK_X;
const OFFICE_CHAIR_Y = DESK_Y + 0.02;
const OFFICE_CHAIR_Z = DESK_Z + 1.0;
const OFFICE_CHAIR_SCALE = 0.015;

const COFFEE_TABLE_X = TERRACE_X - 1.7;
const COFFEE_TABLE_Y = TERRACE_Y + 0.03;
const COFFEE_TABLE_Z = TERRACE_Z + 0.75;
const COFFEE_TABLE_SCALE = 0.01;

const ARMCHAIR_X = COFFEE_TABLE_X + 0.2;
const ARMCHAIR_Y = COFFEE_TABLE_Y + 0.01;
const ARMCHAIR_Z = COFFEE_TABLE_Z - 1.4;
const ARMCHAIR_SCALE = 0.012;

const ARMCHAIR_ANGLE = Math.atan2(
  COFFEE_TABLE_X - ARMCHAIR_X,
  COFFEE_TABLE_Z - ARMCHAIR_Z
);
const SOFA_X = COFFEE_TABLE_X + 1.25;
const SOFA_Y = COFFEE_TABLE_Y + 0.01;
const SOFA_Z = COFFEE_TABLE_Z + 0.2;
const SOFA_SCALE = 0.01;
const SOFA_ANGLE = Math.PI * 1.5;

const PILLOW_X = SOFA_X - 0.15;
const PILLOW_Y = SOFA_Y + 0.15;
const PILLOW_Z = SOFA_Z - 0.5;
const PILLOW_SCALE = 0.0007;
const PILLOW_ANGLE = -Math.PI / 4;

const RUG_MEETING_X = COFFEE_TABLE_X + 0.5;
const RUG_MEETING_Y = COFFEE_TABLE_Y + 0.01;
const RUG_MEETING_Z = COFFEE_TABLE_Z - 0.2;
const RUG_MEETING_SCALE = 2;

const RUG_OFFICE_X = DESK_X;
const RUG_OFFICE_Y = DESK_Y + 0.02;
const RUG_OFFICE_Z = DESK_Z + 0.4;
const RUG_OFFICE_SCALE = 2;
const RUG_OFFICE_ANGLE = Math.PI / 2;

interface ModelConfig {
  path: string;
  label: string;
  position: [number, number, number];
  scale: number | [number, number, number];
  floatSpeed: number;
  floatIntensity: number;
  rotationY?: number;
}

const MODEL_CONFIG: ModelConfig[] = [
  {
    path: "/models/weisse_wand_mountain_peek_2517_m_8257_ft.glb",
    label: "Mountain Peak",
    position: [0, MOUNTAIN_Y, 0],
    scale: MOUNTAIN_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/terrace.glb",
    label: "Glass Terrace",
    position: [TERRACE_X, TERRACE_Y, TERRACE_Z],
    scale: [TERRACE_SCALE * 2, TERRACE_SCALE, TERRACE_SCALE * 4],
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/jenson_extending_dining_table_solid_oak.glb",
    label: "Desk",
    position: [DESK_X, DESK_Y, DESK_Z],
    scale: [DESK_SCALE * 1.2, DESK_SCALE, DESK_SCALE * 1.2],
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
    rotationY: Math.PI,
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
    scale: [SOFA_SCALE * 1.3, SOFA_SCALE, SOFA_SCALE],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: SOFA_ANGLE,
  },
  {
    path: "/models/pillow_test.glb",
    label: "pillow",
    position: [PILLOW_X, PILLOW_Y, PILLOW_Z],
    scale: PILLOW_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PILLOW_ANGLE,
  },
  {
    path: "/models/round_range_coffee_table_oak_and_brass.glb",
    label: "coffee table",
    position: [COFFEE_TABLE_X, COFFEE_TABLE_Y, COFFEE_TABLE_Z],
    scale: [
      COFFEE_TABLE_SCALE * 1.1,
      COFFEE_TABLE_SCALE * 0.7,
      COFFEE_TABLE_SCALE * 1.5,
    ],
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/rug.glb",
    label: "rug meeting",
    position: [RUG_MEETING_X, RUG_MEETING_Y, RUG_MEETING_Z],
    scale: [
      RUG_MEETING_SCALE * 1.4,
      RUG_MEETING_SCALE,
      RUG_MEETING_SCALE * 1.4,
    ],
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/esme_coffee_table_with_2_drawers_ash.glb",
    label: "shelf",
    position: [SHELF_X, SHELF_Y, SHELF_Z],
    scale: [SHELF_SCALE * 1.4, SHELF_SCALE * 1.1, SHELF_SCALE * 0.4],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: SHELF_ANGLE,
  },
];

MODEL_CONFIG.forEach(({ path }) => useGLTF.preload(path));

// ─── Glass material keywords ──────────────────────────────────────────────────
const GLASS_KEYWORDS = [
  "glass",
  "glazing",
  "window",
  "crystal",
  "transparent",
  "transp",
];

function isGlassMaterial(mat: THREE.Material): boolean {
  const name = mat.name.toLowerCase();
  return (
    GLASS_KEYWORDS.some((kw) => name.includes(kw)) ||
    (mat instanceof THREE.MeshPhysicalMaterial && mat.transmission > 0)
  );
}

// Builds a glass MeshPhysicalMaterial that visibly shines and refracts
function makeGlass(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xd0e8ff), // faint ice-blue tint
    transmission: 1.0,
    opacity: 1.0,
    transparent: true,
    roughness: 0.0, // perfectly smooth = sharp reflections
    metalness: 0.0,
    ior: 1.52, // real soda-lime glass
    thickness: 0.4,
    envMapIntensity: 4.0, // glass MUST be high so env map shows
    reflectivity: 1.0,
    iridescence: 0.2,
    iridescenceIOR: 1.3,
    attenuationDistance: 6.0,
    attenuationColor: new THREE.Color(0xd8eeff),
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

// ─── Material enhancer ────────────────────────────────────────────────────────
// `forceGlass` — set true for the terrace model so every mesh gets glass
// treatment regardless of material name.
function enhanceMaterials(root: THREE.Object3D, forceGlass = false) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.castShadow = true;
    child.receiveShadow = true;

    const mats: THREE.Material[] = Array.isArray(child.material)
      ? child.material
      : [child.material];

    mats.forEach((mat, idx) => {
      if (!mat) return;

      if (forceGlass || isGlassMaterial(mat)) {
        const glass = makeGlass();
        glass.name = mat.name;
        if (Array.isArray(child.material)) {
          (child.material as THREE.Material[])[idx] = glass;
        } else {
          child.material = glass;
        }
      } else if (
        mat instanceof THREE.MeshStandardMaterial ||
        mat instanceof THREE.MeshPhysicalMaterial
      ) {
        // Non-glass PBR: modest env reflection — don't overdo it
        mat.envMapIntensity = 0.9;
        mat.needsUpdate = true;
      }
    });
  });
}

// ─── Individual model loader ──────────────────────────────────────────────────
const TERRACE_PATH = "/models/terrace.glb";

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
  const isTerraceModel = path === TERRACE_PATH;

  // Run material enhancement once after the clone is ready
  useEffect(() => {
    enhanceMaterials(cloned, isTerraceModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

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
// Minimal direct lights — the Environment map already provides ambient fill
// and reflection data for glass. Stacking ambient + hemisphere + env was the
// cause of the "flash / everything blown out" look.
function AlpineLighting() {
  return (
    <>
      {/* Single primary sun — crisp, slightly warm. Everything else comes from env. */}
      <directionalLight
        color="#fff6ee"
        intensity={1.2}
        position={[12, 20, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={120}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0005}
      />

      {/* Very subtle cool fill from the opposite side — just enough for shadow detail */}
      <directionalLight
        color="#c8ddf0"
        intensity={0.18}
        position={[-10, 6, -12]}
        castShadow={false}
      />
    </>
  );
}

// ─── Camera tracker ──────────────────────────────────────────────────────────
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
      {/*
        ── Environment map ─────────────────────────────────────────────────────
        This is THE most important fix for glass reflections.
        `preset="apartment"` gives a bright, neutral interior sky that reads
        well as alpine light. Swap to "city", "dawn", "sunset" to taste.
        `background={false}` keeps your white canvas, but still feeds
        all MeshStandardMaterial / MeshPhysicalMaterial their reflection data.
        `resolution={512}` is enough for reflections — raise to 1024 if you
        want sharper env reflections at the cost of GPU memory.
      */}
      <Environment
        preset="apartment"
        background={false}
        resolution={512}
        environmentIntensity={0.65}
      />

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
        target={[-8.27, -29.56, -3.16]}
      />
    </>
  );
}

// ─── World (root export) ──────────────────────────────────────────────────────
export default function World() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#fff" }}>
      <Canvas
        camera={{
          position: [0, 4, 55],
          fov: 20,
          near: 0.1,
          far: 600,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8, // pull back from blown-out white
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        // ↓ Required for physically correct light attenuation with PBR materials
        // In R3F v9+ this replaces the deprecated `physicallyCorrectLights` prop
        scene={{ backgroundIntensity: 1 }}
        shadows="soft" // PCFSoft shadows — smoother than default
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#ffffff");
          // Ensure the renderer uses physically correct light falloff
          // (needed for transmission / glass to behave properly)
          // Tone mapping already set via gl prop but set here as well for safety
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
