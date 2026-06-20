import {
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  BakeShadows,
  Preload,
  AdaptiveDpr,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useDeviceContext } from "../../context/device/useDeviceContext";
import { DEVICE } from "../../context/device/types";
import { CAMERA_PRESETS, INITIAL_PRESET } from "./config/cameraPresets";
import {
  SCENE_OBJECTS_PRIMARY,
  SCENE_OBJECTS_SECONDARY,
  SCENE_OBJECTS_TERTIARY,
  SCENE_OBJECTS_PRIMARY_MOBILE,
  SCENE_OBJECTS_SECONDARY_MOBILE,
  SCENE_OBJECTS_TERTIARY_MOBILE,
} from "./config/sceneObjects";

import { useUploadTexturesOnIdle } from "./hooks/useUploadTexturesOnIdle";
import { Model, OnSuspenseResolved } from "./Model/Model";
import { Lighting } from "./Lighting/Lighting";
import {
  CameraTracker,
  CameraRig,
  type CameraRigHandle,
} from "./CameraRig/CameraRig";
import {
  IntroAnimation,
  type IntroAnimationHandle,
} from "./IntroAnimation/IntroAnimation";
import { ShaderWarmup } from "./ShaderWarmup/ShaderWarmup";
import { SceneReadyGate } from "./SceneReadyGate/SceneReadyGate";
import { MemoryMonitor } from "./Model/MemoryMonitor";
import { PortalButton3D } from "./PortalButton3D/PortalButton3D";
import { ClickTextButton3D } from "./ClickTextButton3D/ClickTextButton3D";
import { useSceneContext } from "../../context/scene/useSceneContext";
import { SceneBackground } from "./SceneBackground/SceneBackground";
import { SceneVignette } from "./SceneVignette/SceneVignette";

// ─── Inner scene (runs inside Canvas) ─────────────────────────────────────────
// Minimum Y the camera/target can reach — just above the pergola floor (-92)
const MIN_CAMERA_Y = -88;

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
  const { camera } = useThree();
  useUploadTexturesOnIdle(introComplete);

  // Clamp camera + target Y so user never sees below the floor (runs every frame)
  useFrame(() => {
    const controls = controlsRef.current;
    let clamped = false;
    if (camera.position.y < MIN_CAMERA_Y) {
      camera.position.y = MIN_CAMERA_Y;
      clamped = true;
    }
    if (controls && controls.target.y < MIN_CAMERA_Y) {
      controls.target.y = MIN_CAMERA_Y;
      clamped = true;
    }
    if (clamped && controls) {
      controls.update();
    }
  });

  // Called directly by SceneReadyGate once GPU is flushed — no useEffect needed.
  const handleSceneReady = useCallback(() => {
    if (isMobile) {
      onIntroComplete();
    } else {
      introRef.current?.start();
    }
  }, [isMobile, onIntroComplete]);

  // Signal-based: tier 3 mounts only after tier 2's Suspense resolves.
  const onTier2Ready = useCallback(() => {
    startTransition(() => setTier2Ready(true));
  }, []);

  return (
    <>
      <SceneBackground />
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
        {(isMobile ? SCENE_OBJECTS_PRIMARY_MOBILE : SCENE_OBJECTS_PRIMARY).map(
          (config) => (
            <Model
              key={config.position.join(",")}
              path={config.path}
              position={config.position}
              scale={config.scale}
              rotationY={config.rotationY}
              tier="primary"
            />
          )
        )}
      </Suspense>

      {/* Tier 2: near furniture — textures deferred until idle */}
      <Suspense fallback={null}>
        {(isMobile
          ? SCENE_OBJECTS_SECONDARY_MOBILE
          : SCENE_OBJECTS_SECONDARY
        ).map((config) => (
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
          {(isMobile
            ? SCENE_OBJECTS_TERTIARY_MOBILE
            : SCENE_OBJECTS_TERTIARY
          ).map((config) => (
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

      {/* Portal button — anchored above monitors */}
      <Suspense fallback={null}>
        <PortalButton3D />
      </Suspense>

      {/* Transparent click area over "click text" on tablet */}
      <ClickTextButton3D />

      {/* Non-critical effects deferred until intro completes */}
      {introComplete && <BakeShadows />}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={80}
        maxPolarAngle={Math.PI * 0.52}
      />

      {import.meta.env.DEV && <MemoryMonitor />}
    </>
  );
}

// ─── Scene (root export — replaces World) ─────────────────────────────────────
export default function Scene({
  onIntroComplete: onIntroCompleteProp,
}: {
  onIntroComplete: () => void;
}) {
  const { setIntroComplete, setTransitionFn } = useSceneContext();
  const { device, renderSettings } = useDeviceContext();
  const isMobile = device === DEVICE.MOBILE;
  const [introComplete, setLocalIntroComplete] = useState(isMobile);
  const cameraRigRef = useRef<CameraRigHandle>(null);

  const handleIntroComplete = useCallback(() => {
    setLocalIntroComplete(true);
    setIntroComplete(true);
    onIntroCompleteProp();
  }, [setIntroComplete, onIntroCompleteProp]);

  // Register the camera transition function so overlay components can trigger it
  useEffect(() => {
    setTransitionFn((preset) => {
      cameraRigRef.current?.transitionTo(preset);
    });
  }, [setTransitionFn]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      <SceneVignette />
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
          gl.toneMappingExposure = 1.1;
        }}
      >
        <AdaptiveDpr />
        <SceneInner
          introComplete={introComplete}
          onIntroComplete={handleIntroComplete}
          isMobile={isMobile}
          cameraRigRef={cameraRigRef}
        />
      </Canvas>
    </div>
  );
}
