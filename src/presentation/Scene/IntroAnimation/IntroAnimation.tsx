import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useSceneContext } from "../../../context/scene/useSceneContext";

import { CAMERA_PRESETS } from "../config/cameraPresets";
import {
  ORBIT_POINTS,
  ORBIT_TARGET,
  ORBIT_DURATION,
  ORBIT_TO_MEETING,
  MEETING_DWELL,
  MEETING_TO_WORKSPACE,
  INTRO_DURATION,
} from "../config/introChoreography";

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

// ── Module-scoped vectors — allocated once, reused every frame ──
const _position = new THREE.Vector3();
const _target = new THREE.Vector3();
const _fromPos = new THREE.Vector3();
const _toPos = new THREE.Vector3();
const _fromTarget = new THREE.Vector3();
const _toTarget = new THREE.Vector3();

// Cinematic fly-through: smooth Catmull-Rom orbit around mountain peak →
// transition to meeting area → pause → fly to workspace (landscape view).
// ~12 seconds total.
export function IntroAnimation({
  controlsRef,
  onComplete,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  onComplete: () => void;
}) {
  const { camera, invalidate, set } = useThree();
  const { sceneReady } = useSceneContext();
  const startedRef = useRef(false);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);

  // Pre-build the Catmull-Rom spline for the orbit phase (once).
  const orbitCurve = useMemo(() => {
    const orbitVectors = ORBIT_POINTS.map(
      (point) => new THREE.Vector3(...point)
    );
    return new THREE.CatmullRomCurve3(orbitVectors, false, "catmullrom", 0.5);
  }, []);

  // Start once scene is fully ready (assets + shaders + GPU flush)
  useEffect(() => {
    if (sceneReady && !startedRef.current) {
      startedRef.current = true;
      elapsedRef.current = 0;
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
        controlsRef.current.enableDamping = false; // avoid damping fighting lerp
      }
      // Set camera to first point on spline (write into _position, no alloc)
      orbitCurve.getPointAt(0, _position);
      camera.position.copy(_position);
      camera.lookAt(...ORBIT_TARGET);
      invalidate();
    }
  }, [sceneReady, camera, controlsRef, orbitCurve, invalidate]);

  useFrame((_, delta) => {
    if (!startedRef.current || doneRef.current) return;

    elapsedRef.current += delta;
    const elapsed = Math.min(elapsedRef.current, INTRO_DURATION);

    if (elapsed <= ORBIT_DURATION) {
      // ── Phase 1: Catmull-Rom orbit around mountain peak ──
      const progress = easeInOutCubic(elapsed / ORBIT_DURATION);
      orbitCurve.getPointAt(progress, _position);
      _target.set(...ORBIT_TARGET);
    } else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING) {
      // ── Phase 2: Transition from orbit end → meeting ──
      const segmentElapsed = elapsed - ORBIT_DURATION;
      const progress = easeInOutCubic(segmentElapsed / ORBIT_TO_MEETING);
      orbitCurve.getPointAt(1, _fromPos);
      _toPos.set(...CAMERA_PRESETS.meeting.position);
      _position.lerpVectors(_fromPos, _toPos, progress);
      _fromTarget.set(...ORBIT_TARGET);
      _toTarget.set(...CAMERA_PRESETS.meeting.target);
      _target.lerpVectors(_fromTarget, _toTarget, progress);
    } else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING + MEETING_DWELL) {
      // ── Phase 3: Dwell at meeting ──
      _position.set(...CAMERA_PRESETS.meeting.position);
      _target.set(...CAMERA_PRESETS.meeting.target);
    } else {
      // ── Phase 4: Meeting → workspace (landscape view) ──
      const segmentElapsed =
        elapsed - ORBIT_DURATION - ORBIT_TO_MEETING - MEETING_DWELL;
      const progress = easeInOutCubic(segmentElapsed / MEETING_TO_WORKSPACE);
      _fromPos.set(...CAMERA_PRESETS.meeting.position);
      _toPos.set(...CAMERA_PRESETS.workstation.position);
      _position.lerpVectors(_fromPos, _toPos, progress);
      _fromTarget.set(...CAMERA_PRESETS.meeting.target);
      _toTarget.set(...CAMERA_PRESETS.workstation.target);
      _target.lerpVectors(_fromTarget, _toTarget, progress);
    }

    camera.position.copy(_position);
    if (controlsRef.current) {
      controlsRef.current.target.copy(_target);
      controlsRef.current.update();
    } else {
      camera.lookAt(_target);
    }

    invalidate(); // request next frame (frameloop="demand" compat)

    if (elapsed >= INTRO_DURATION) {
      doneRef.current = true;
      if (controlsRef.current) {
        controlsRef.current.enableDamping = true; // restore damping
        controlsRef.current.enabled = true;
      }
      set({ frameloop: "demand" }); // stop render loop — only invalidate() triggers frames now
      invalidate();
      onComplete();
    }
  });

  return null;
}
