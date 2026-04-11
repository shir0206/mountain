import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

// ─── Model config ────────────────────────────────────────────────────────────
// Adjust `scale` and `position` per model once you see them in scene.
// position[1] = vertical offset (raise/lower individual models)
const MODEL_CONFIG: ModelConfig[] = [
  {
    path: "/models/weisse_wand_mountain_peek_2517_m_8257_ft.glb",
    label: "Mountain Peak",
    position: [0, 0, 0],
    scale: 1.2,
    floatSpeed: 0.4,
    floatIntensity: 0.3,
  },
  {
    path: "/models/scandi_modern_office_desk_psx_style.glb",
    label: "White Desk",
    position: [-2, 0, 0],
    scale: 0.91,
    floatSpeed: 0.6,
    floatIntensity: 0.2,
  },
  {
    path: "/models/muskonge_n24t6n23s2001.glb",
    label: "Chair",
    position: [3, 0, 0],
    scale: 0.91,
    floatSpeed: 0.7,
    floatIntensity: 0.2,
  },

  {
    path: "/models/free_mac_book_pro_-_laptop.glb",
    label: "Laptop",
    position: [4, 0, 0],
    scale: 0.005,
    floatSpeed: 0.8,
    floatIntensity: 0.15,
  },
  {
    path: "/models/mac_keyboard.glb",
    label: "Keyboard",
    position: [4, 0, 0],
    scale: 0.005,
    floatSpeed: 0.8,
    floatIntensity: 0.15,
  },
  {
    path: "/models/two_monitors.glb",
    label: "Monitors",
    position: [4, 0, 0],
    scale: 0.005,
    floatSpeed: 0.8,
    floatIntensity: 0.15,
  },

  {
    path: "/models/macbookair.glb",
    label: "Macbook Air",
    position: [5, 0, 0],
    scale: 0.005,
    floatSpeed: 0.8,
    floatIntensity: 0.15,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ModelConfig {
  path: string;
  label: string;
  position: [number, number, number];
  scale: number;
  floatSpeed: number;
  floatIntensity: number;
}

// Preload all models
MODEL_CONFIG.forEach(({ path }) => useGLTF.preload(path));

// ─── Individual model loader ──────────────────────────────────────────────────
function Model({
  path,
  position,
  scale,
  floatSpeed,
  floatIntensity,
}: Omit<ModelConfig, "label">) {
  const { scene } = useGLTF(path) as GLTF & { scene: THREE.Group };

  // Clone so multiple instances don't share materials
  const cloned = scene.clone(true);

  return (
    <Float
      speed={floatSpeed}
      floatIntensity={floatIntensity}
      rotationIntensity={0.05}
    >
      <primitive object={cloned} position={position} scale={scale} />
    </Float>
  );
}

// ─── Loading fallback placeholder ─────────────────────────────────────────────
function Placeholder({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3a4a5a" wireframe />
    </mesh>
  );
}

// ─── Cloudy day lighting ──────────────────────────────────────────────────────
// Overcast sky = soft diffuse light from all angles, no harsh sun.
function CloudyLighting() {
  return (
    <>
      {/* Main ambient fill — cool overcast sky tone */}
      <ambientLight color="#c8d8e8" intensity={1.2} />

      {/* Hemisphere: sky above is blue-grey, ground below is warm-grey */}
      <hemisphereLight args={["#b8ccd8", "#8a9aaa", 1.4]} />

      {/* Very soft "sun through clouds" — nearly white, very low intensity */}
      {/* Remove this entirely for a fully flat-lit overcast look */}
      <directionalLight
        color="#e4eef8"
        intensity={0.05}
        position={[8, 14, 6]}
        castShadow={false}
      />

      {/* Subtle fill from opposite side — eliminates harsh darks */}
      <directionalLight
        color="#d0dce8"
        intensity={0.15}
        position={[-6, 4, -8]}
        castShadow={false}
      />
    </>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <CloudyLighting />

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
          />
        </Suspense>
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={60}
      />
    </>
  );
}

// ─── World (root export) ──────────────────────────────────────────────────────
export default function World() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#1a2230" }}>
      <Canvas
        camera={{ position: [0, 4, 22], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, toneMapping: 3 /* ACESFilmic */ }}
        shadows={false}
        // Slightly desaturated tone for overcast feel
        onCreated={({ gl }) => {
          gl.setClearColor("#1a2230");
        }}
      >
        <fog attach="fog" args={["#1a2230", 30, 80]} />
        <Scene />
      </Canvas>
    </div>
  );
}
