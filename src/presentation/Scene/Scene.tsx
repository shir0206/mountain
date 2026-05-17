import { Suspense, startTransition, useCallback, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  BakeShadows,
  Preload,
  AdaptiveDpr,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useDeviceContext } from "../../context/device/useDeviceContext";
import { DEVICE } from "../../context/device/types";
import {
  CAMERA_PRESETS,
  INITIAL_PRESET,
  PRESET_BUTTONS,
} from "./config/cameraPresets";
import {
  SCENE_OBJECTS_PRIMARY,
  SCENE_OBJECTS_SECONDARY,
  SCENE_OBJECTS_TERTIARY,
  SCENE_OBJECTS_PRIMARY_MOBILE,
  SCENE_OBJECTS_SECONDARY_MOBILE,
  SCENE_OBJECTS_TERTIARY_MOBILE,
} from "./config/sceneObjects";
import { KEYBOARD_X, KEYBOARD_Y, KEYBOARD_Z } from "./config/positions";

import { useOpenPortfolio } from "./hooks/useOpenPortfolio";
import { useUploadTexturesOnIdle } from "./hooks/useUploadTexturesOnIdle";
import { useChangeCameraPreset } from "./hooks/useChangeCameraPreset";
import { Model, OnSuspenseResolved } from "./Model/Model";
import { Lighting } from "./Lighting/Lighting";
import { CameraTracker, CameraRig, type CameraRigHandle } from "./CameraRig/CameraRig";
import { SceneButton3D } from "./SceneButton3D/SceneButton3D";
import { IntroAnimation, type IntroAnimationHandle } from "./IntroAnimation/IntroAnimation";
import { ShaderWarmup } from "./ShaderWarmup/ShaderWarmup";
import { SceneReadyGate } from "./SceneReadyGate/SceneReadyGate";
import { MemoryMonitor } from "./Model/MemoryMonitor";
import { usePortfolioContext } from "../../context/portfolio/usePortfolioContext";
import { BROWSER_MODE } from "../../context/portfolio/types";

// ─── Inner scene (runs inside Canvas) ─────────────────────────────────────────
function SceneInner({
  introComplete,
  onIntroComplete,
  isMobile,
  cameraRigRef,
}: {
  introComplete: boolean;
  onIntroComplete: () => void;
  isMobile: boolean;
  cameraRigRef: React.RefObject<CameraRigHandle | null>;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const introRef = useRef<IntroAnimationHandle>(null);
  const [tier2Ready, setTier2Ready] = useState(false);
  const { invalidate } = useThree();
  const openPortfolio = useOpenPortfolio();
  useUploadTexturesOnIdle(introComplete);
  const { browserMode } = usePortfolioContext();
  const isBrowserOpen = browserMode !== BROWSER_MODE.CLOSED;

  // Called directly by SceneReadyGate once GPU is flushed — no useEffect needed.
  const handleSceneReady = useCallback(() => {
    introRef.current?.start();
  }, []);

  // Signal-based: tier 3 mounts only after tier 2's Suspense resolves.
  const onTier2Ready = useCallback(() => {
    startTransition(() => setTier2Ready(true));
  }, []);

  return (
    <>
      <Lighting />
      <CameraTracker controlsRef={controlsRef} />
      <SceneReadyGate onReady={handleSceneReady} />
      {introComplete && (
        <CameraRig ref={cameraRigRef} controlsRef={controlsRef} />
      )}
      {!introComplete && (
        <IntroAnimation
          ref={introRef}
          controlsRef={controlsRef}
          onComplete={onIntroComplete}
        />
      )}

      {/* Tier 1: mountain, pergola, mud, fences — visible during intro orbit */}
      <Suspense fallback={null}>
        {(isMobile ? SCENE_OBJECTS_PRIMARY_MOBILE : SCENE_OBJECTS_PRIMARY).map((config) => (
          <Model
            key={config.position.join(",")}
            path={config.path}
            position={config.position}
            scale={config.scale}
            rotationY={config.rotationY}
            tier="primary"
          />
        ))}
      </Suspense>

      {/* Tier 2: near furniture — textures deferred until idle */}
      <Suspense fallback={null}>
        {(isMobile ? SCENE_OBJECTS_SECONDARY_MOBILE : SCENE_OBJECTS_SECONDARY).map((config) => (
          <Model
            key={config.position.join(",")}
            path={config.path}
            position={config.position}
            scale={config.scale}
            rotationY={config.rotationY}
            tier="secondary"
          />
        ))}
        <OnSuspenseResolved onResolved={onTier2Ready} />
        <ShaderWarmup />
        <Preload all />
      </Suspense>

      {/* Tier 3: decorative plants — true lazy load, textures deferred */}
      {tier2Ready && (
        <Suspense fallback={null}>
          {(isMobile ? SCENE_OBJECTS_TERTIARY_MOBILE : SCENE_OBJECTS_TERTIARY).map((config) => (
            <Model
              key={config.position.join(",")}
              path={config.path}
              position={config.position}
              scale={config.scale}
              rotationY={config.rotationY}
              tier="tertiary"
            />
          ))}
        </Suspense>
      )}

      {/* Non-critical effects deferred until intro completes */}
      {introComplete && (
        <>
          <SceneButton3D
            position={[KEYBOARD_X + 0.8, KEYBOARD_Y + 0.35, KEYBOARD_Z - 0.1]}
            color="#137f7f"
            label={isBrowserOpen ? "" : "Open"}
            onClick={openPortfolio}
            size={0.1}
            hotspot
          />
          <BakeShadows />
        </>
      )}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={0}
        maxDistance={80}
        onChange={() => invalidate()}
      />

      {import.meta.env.DEV && <MemoryMonitor />}
    </>
  );
}

// ─── Scene (root export — replaces World) ─────────────────────────────────────
export default function Scene() {
  const { cameraPreset: activePreset, changeCameraPreset } =
    useChangeCameraPreset();
  const [introComplete, setIntroComplete] = useState(false);
  const { device, renderSettings } = useDeviceContext();
  const isMobile = device === DEVICE.MOBILE;
  const cameraRigRef = useRef<CameraRigHandle>(null);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#0d1117",
      }}
    >
      <Canvas
        camera={{
          position: CAMERA_PRESETS[INITIAL_PRESET].position,
          fov: isMobile ? 55 : 35,
          near: 0.1,
          far: renderSettings.farPlane,
        }}
        gl={{
          antialias: renderSettings.antialias,
          toneMapping: 3 /* ACESFilmic */,
          powerPreference: renderSettings.powerPreference,
        }}
        dpr={renderSettings.dpr}
        shadows={renderSettings.shadows}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
      >
        <AdaptiveDpr />
        <SceneInner
          introComplete={introComplete}
          onIntroComplete={() => setIntroComplete(true)}
          isMobile={isMobile}
          cameraRigRef={cameraRigRef}
        />
      </Canvas>

      {/* 2D overlay fallback buttons (accessibility + visibility guarantee) */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          zIndex: 5,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {PRESET_BUTTONS.map((button) => (
          <button
            key={button.key}
            onClick={() => {
              cameraRigRef.current?.transitionTo(button.key);
              changeCameraPreset(button.key);
            }}
            style={{
              background:
                activePreset === button.key
                  ? button.color
                  : "rgba(30,20,10,0.75)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
