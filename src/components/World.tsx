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

const BOOKS_X = SHELF_X - 1;
const BOOKS_Y = SHELF_Y + 14;
const BOOKS_Z = SHELF_Z - 0.1;
const BOOKS_SCALE = 150;
const BOOKS_ANGLE = Math.PI * 1.5;

const DESK_X = TERRACE_X - 1.5;
const DESK_Y = TERRACE_Y + 0.02;
const DESK_Z = TERRACE_Z - 5.3;
const DESK_SCALE = 0.015;

const MUG_X = DESK_X + 1;
const MUG_Y = DESK_Y + 1.09;
const MUG_Z = DESK_Z + 0.3;
const MUG_SCALE = 1.8;
const MUG_ANGLE = Math.PI * 0.8;

const MONITOR_LEFT_X = DESK_X - 3.3;
const MONITOR_LEFT_Y = DESK_Y + 0.73;
const MONITOR_LEFT_Z = DESK_Z - 0.35;

const MONITOR_RIGHT_X = DESK_X - 2.4;
const MONITOR_RIGHT_Y = DESK_Y + 0.73;
const MONITOR_RIGHT_Z = DESK_Z - 0.35;

const KEYBOARD_X = DESK_X;
const KEYBOARD_Y = DESK_Y + 1.08;
const KEYBOARD_Z = DESK_Z + 0.5;

const LAPTOP_X = DESK_X - 1;
const LAPTOP_Y = DESK_Y + 1.1;
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

const TABLET_X = COFFEE_TABLE_X - 0.2;
const TABLET_Y = COFFEE_TABLE_Y + 0.5;
const TABLET_Z = COFFEE_TABLE_Z + 0.2;
const TABLET_SCALE = 1.5;
const TABLET_ANGLE = Math.PI * 1.5;

const TV_X = COFFEE_TABLE_X - 0.3;
const TV_Y = COFFEE_TABLE_Y + 0.2;
const TV_Z = COFFEE_TABLE_Z + 2;
const TV_SCALE = 0.5;
const TV_ANGLE = -Math.PI * 1.13;

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

const PILLOW_X = SOFA_X - 0.1;
const PILLOW_Y = SOFA_Y + 0.13;
const PILLOW_Z = SOFA_Z - 0.6;
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
  // {
  //   path: "/models/wood_floor.glb",
  //   label: "Glass Terrace",
  //   position: [TERRACE_X, TERRACE_Y, TERRACE_Z],
  //   scale: 5,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  // },

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
    label: "Monitor Left",
    position: [MONITOR_LEFT_X, MONITOR_LEFT_Y, MONITOR_LEFT_Z],
    scale: 1.2,
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/monitor.glb",
    label: "Monitor Right",
    position: [MONITOR_RIGHT_X, MONITOR_RIGHT_Y, MONITOR_RIGHT_Z],
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
    path: "/models/mug.glb",
    label: "Mug",
    position: [MUG_X, MUG_Y, MUG_Z],
    scale: MUG_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: MUG_ANGLE,
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
    path: "/models/tv_with_a_wall_mount.glb",
    label: "TV",
    position: [TV_X, TV_Y, TV_Z],
    scale: TV_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: TV_ANGLE,
  },
  {
    path: "/models/ipad_air4.glb",
    label: "tablet",
    position: [TABLET_X, TABLET_Y, TABLET_Z],
    scale: TABLET_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: TABLET_ANGLE,
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
  {
    path: "/models/stack_of_books_3d_scan.glb",
    label: "books",
    position: [BOOKS_X, BOOKS_Y, BOOKS_Z],
    scale: BOOKS_SCALE, //[BOOKS_SCALE * 1.4, BOOKS_SCALE * 1.1, BOOKS_SCALE * 0.4],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: BOOKS_ANGLE,
  },
];

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
          key={config.position.join(",")}
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
