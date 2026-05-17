import { useRef, useMemo, useCallback, forwardRef, useImperativeHandle } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

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

// 12 seconds × 60 fps = 720 samples. Trade ~50 KB memory for zero per-frame math.
const INTRO_SAMPLES = 720;

export interface IntroAnimationHandle {
  start: () => void;
}

// Cinematic fly-through: smooth Catmull-Rom orbit around mountain peak →
// transition to meeting area → pause → fly to workspace (landscape view).
// ~12 seconds total.  Entire path precomputed — useFrame is just an index lookup.
export const IntroAnimation = forwardRef<
  IntroAnimationHandle,
  {
    controlsRef: React.RefObject<OrbitControlsImpl | null>;
    onComplete: () => void;
  }
>(function IntroAnimation({ controlsRef, onComplete }, ref) {
  const { camera, invalidate, set } = useThree();
  const startedRef = useRef(false);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);

  // Pre-build the Catmull-Rom spline for the orbit phase (once).
  // Use "centripetal" with tension 0 to eliminate overshoot on 2-point curves.
  const orbitCurve = useMemo(() => {
    const orbitVectors = ORBIT_POINTS.map(
      (point) => new THREE.Vector3(...point)
    );
    return new THREE.CatmullRomCurve3(orbitVectors, false, "centripetal", 0);
  }, []);

  // ── Precompute entire intro path (720 samples) ──
  // All phase logic runs once at mount. useFrame does zero math — just copies
  // from the lookup table. Massive win on weak CPUs / mobile.
  const introPath = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const targets: THREE.Vector3[] = [];

    // Temp vectors used only inside this memo (allocated once, GC'd after)
    const pos = new THREE.Vector3();
    const tgt = new THREE.Vector3();
    const fromPos = new THREE.Vector3();
    const toPos = new THREE.Vector3();
    const fromTgt = new THREE.Vector3();
    const toTgt = new THREE.Vector3();

    for (let i = 0; i <= INTRO_SAMPLES; i++) {
      const elapsed = (i / INTRO_SAMPLES) * INTRO_DURATION;

      if (elapsed <= ORBIT_DURATION) {
        // Phase 1: Catmull-Rom orbit around mountain peak
        const progress = easeInOutCubic(elapsed / ORBIT_DURATION);
        orbitCurve.getPointAt(progress, pos);
        tgt.set(...ORBIT_TARGET);
      } else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING) {
        // Phase 2: Transition from orbit end → meeting (arc above mountain)
        const segmentElapsed = elapsed - ORBIT_DURATION;
        const progress = easeInOutCubic(segmentElapsed / ORBIT_TO_MEETING);
        orbitCurve.getPointAt(1, fromPos);
        toPos.set(...CAMERA_PRESETS.meeting.position);
        // Quadratic bezier with midpoint above the peak to avoid clipping
        const midX = (fromPos.x + toPos.x) / 2;
        const midZ = (fromPos.z + toPos.z) / 2;
        const midY = Math.min(fromPos.y, toPos.y) + 6; // lift above peak
        const oneMinusT = 1 - progress;
        pos.x = oneMinusT * oneMinusT * fromPos.x + 2 * oneMinusT * progress * midX + progress * progress * toPos.x;
        pos.y = oneMinusT * oneMinusT * fromPos.y + 2 * oneMinusT * progress * midY + progress * progress * toPos.y;
        pos.z = oneMinusT * oneMinusT * fromPos.z + 2 * oneMinusT * progress * midZ + progress * progress * toPos.z;
        fromTgt.set(...ORBIT_TARGET);
        toTgt.set(...CAMERA_PRESETS.meeting.target);
        tgt.lerpVectors(fromTgt, toTgt, progress);
      } else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING + MEETING_DWELL) {
        // Phase 3: Dwell at meeting
        pos.set(...CAMERA_PRESETS.meeting.position);
        tgt.set(...CAMERA_PRESETS.meeting.target);
      } else {
        // Phase 4: Meeting → workspace (landscape view)
        const segmentElapsed =
          elapsed - ORBIT_DURATION - ORBIT_TO_MEETING - MEETING_DWELL;
        const progress = easeInOutCubic(segmentElapsed / MEETING_TO_WORKSPACE);
        fromPos.set(...CAMERA_PRESETS.meeting.position);
        toPos.set(...CAMERA_PRESETS.workstation.position);
        pos.lerpVectors(fromPos, toPos, progress);
        fromTgt.set(...CAMERA_PRESETS.meeting.target);
        toTgt.set(...CAMERA_PRESETS.workstation.target);
        tgt.lerpVectors(fromTgt, toTgt, progress);
      }

      positions.push(pos.clone());
      targets.push(tgt.clone());
    }

    return { positions, targets };
  }, [orbitCurve]);

  // Imperative start — called by SceneReadyGate's onReady callback,
  // removing the need for a useEffect watching sceneReady state.
  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    elapsedRef.current = 0;
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
      controlsRef.current.enableDamping = false; // avoid damping fighting lerp
    }
    // Snap camera to first precomputed sample
    camera.position.copy(introPath.positions[0]);
    camera.lookAt(...ORBIT_TARGET);
    invalidate();
  }, [camera, controlsRef, introPath, invalidate]);

  useImperativeHandle(ref, () => ({ start }), [start]);

  // ── Per-frame: pure index lookup, zero math ──
  useFrame((_, delta) => {
    if (!startedRef.current || doneRef.current) return;

    elapsedRef.current += delta;
    const t = Math.min(elapsedRef.current / INTRO_DURATION, 1);
    const i = Math.min(Math.floor(t * INTRO_SAMPLES), INTRO_SAMPLES);

    camera.position.copy(introPath.positions[i]);
    if (controlsRef.current) {
      controlsRef.current.target.copy(introPath.targets[i]);
      controlsRef.current.update();
    } else {
      camera.lookAt(introPath.targets[i]);
    }

    invalidate(); // request next frame (frameloop="demand" compat)

    if (t >= 1) {
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
});
