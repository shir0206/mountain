import { useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

import type { PresetKey } from "../types";
import { CAMERA_PRESETS, INITIAL_PRESET } from "../config/cameraPresets";

export interface CameraRigHandle {
  transitionTo: (preset: PresetKey) => void;
}

// Module-scoped fallback — avoids allocating new Vector3 every frame
const _zeroTarget = new THREE.Vector3();

// ─── Camera tracker (inner) ──────────────────────────────────────────────────
// Throttled to 4 Hz. Only mounted in dev builds (see wrapper below).
function CameraTrackerDev({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const lastPosition = useRef(new THREE.Vector3());
  const lastTarget = useRef(new THREE.Vector3());
  const lastLogTime = useRef(0);

  useFrame(({ clock }) => {
    // Throttle to 4 Hz (every 0.25 s) — avoids console spam + main-thread pressure
    if (clock.elapsedTime - lastLogTime.current < 0.25) return;

    const position = camera.position;
    const target = controlsRef.current?.target ?? _zeroTarget;

    const positionChanged =
      Math.abs(position.x - lastPosition.current.x) > 0.01 ||
      Math.abs(position.y - lastPosition.current.y) > 0.01 ||
      Math.abs(position.z - lastPosition.current.z) > 0.01;

    const targetChanged =
      Math.abs(target.x - lastTarget.current.x) > 0.01 ||
      Math.abs(target.y - lastTarget.current.y) > 0.01 ||
      Math.abs(target.z - lastTarget.current.z) > 0.01;

    if (positionChanged || targetChanged) {
      lastLogTime.current = clock.elapsedTime;
      console.log("%c[Camera]", "color:#dedede;font-weight:bold", {
        position: {
          x: +position.x.toFixed(2),
          y: +position.y.toFixed(2),
          z: +position.z.toFixed(2),
        },
        target: {
          x: +target.x.toFixed(2),
          y: +target.y.toFixed(2),
          z: +target.z.toFixed(2),
        },
      });
      lastPosition.current.copy(position);
      lastTarget.current.copy(target);
    }
  });

  return null;
}

// ─── Camera tracker (public) ─────────────────────────────────────────────────
// Stripped entirely in production — no hooks, no useFrame, no component tree.
export function CameraTracker(props: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  if (!import.meta.env.DEV) return null;
  return <CameraTrackerDev {...props} />;
}

// ─── Camera rig ──────────────────────────────────────────────────────────────
// Smoothly lerps camera position + OrbitControls target toward active preset.
// Disables user input + damping during transition to avoid fighting the lerp.
export const CameraRig = forwardRef<
  CameraRigHandle,
  { controlsRef: React.RefObject<OrbitControlsImpl | null> }
>(function CameraRig({ controlsRef }, ref) {
  const { camera, invalidate } = useThree();
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const animating = useRef(false);

  const transitionTo = useCallback(
    (preset: PresetKey) => {
      const p = CAMERA_PRESETS[preset];
      desiredPos.current.set(...p.position);
      desiredTarget.current.set(...p.target);
      animating.current = true;
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
      invalidate();
    },
    [controlsRef, invalidate]
  );

  useImperativeHandle(ref, () => ({ transitionTo }), [transitionTo]);

  // Initial snap (before first user interaction) — runs on first frame.
  const snappedRef = useRef(false);

  useFrame(() => {
    if (!snappedRef.current) {
      snappedRef.current = true;
      const p = CAMERA_PRESETS[INITIAL_PRESET];
      camera.position.set(...p.position);
      if (controlsRef.current) {
        controlsRef.current.target.set(...p.target);
        controlsRef.current.update();
      }
    }
    if (!animating.current) return;
    const controls = controlsRef.current;
    camera.position.lerp(desiredPos.current, 0.08);
    if (controls) {
      controls.target.lerp(desiredTarget.current, 0.08);
      controls.update();
    }
    const posDone = camera.position.distanceTo(desiredPos.current) < 0.02;
    const tgtDone = controls
      ? controls.target.distanceTo(desiredTarget.current) < 0.02
      : true;
    if (posDone && tgtDone) {
      camera.position.copy(desiredPos.current);
      if (controls) {
        controls.target.copy(desiredTarget.current);
        controls.enabled = true;
        controls.update();
      }
      animating.current = false;
    } else {
      invalidate(); // keep requesting frames while animating
    }
  });

  return null;
});
