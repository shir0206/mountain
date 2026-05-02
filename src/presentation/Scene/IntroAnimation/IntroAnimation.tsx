import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
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
	const { camera } = useThree();
	const { active, progress } = useProgress();
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

	// Only start once loading finishes
	useEffect(() => {
		if (!active && progress >= 100 && !startedRef.current) {
			startedRef.current = true;
			if (controlsRef.current) controlsRef.current.enabled = false;
			// Set camera to first point on spline
			const startPosition = orbitCurve.getPointAt(0);
			camera.position.copy(startPosition);
			camera.lookAt(...ORBIT_TARGET);
		}
	}, [active, progress, camera, controlsRef, orbitCurve]);

	useFrame((_, delta) => {
		if (!startedRef.current || doneRef.current) return;

		elapsedRef.current += delta;
		const elapsed = Math.min(elapsedRef.current, INTRO_DURATION);

		let position: THREE.Vector3;
		let target: THREE.Vector3;

		if (elapsed <= ORBIT_DURATION) {
			// ── Phase 1: Catmull-Rom orbit around mountain peak ──
			const progress = easeInOutCubic(elapsed / ORBIT_DURATION);
			position = orbitCurve.getPointAt(progress);
			target = new THREE.Vector3(...ORBIT_TARGET);
		} else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING) {
			// ── Phase 2: Transition from orbit end → meeting ──
			const segmentElapsed = elapsed - ORBIT_DURATION;
			const progress = easeInOutCubic(segmentElapsed / ORBIT_TO_MEETING);
			const fromPosition = orbitCurve.getPointAt(1);
			const toPosition = new THREE.Vector3(...CAMERA_PRESETS.meeting.position);
			position = new THREE.Vector3().lerpVectors(
				fromPosition,
				toPosition,
				progress
			);
			const fromTarget = new THREE.Vector3(...ORBIT_TARGET);
			const toTarget = new THREE.Vector3(...CAMERA_PRESETS.meeting.target);
			target = new THREE.Vector3().lerpVectors(fromTarget, toTarget, progress);
		} else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING + MEETING_DWELL) {
			// ── Phase 3: Dwell at meeting ──
			position = new THREE.Vector3(...CAMERA_PRESETS.meeting.position);
			target = new THREE.Vector3(...CAMERA_PRESETS.meeting.target);
		} else {
			// ── Phase 4: Meeting → workspace (landscape view) ──
			const segmentElapsed =
				elapsed - ORBIT_DURATION - ORBIT_TO_MEETING - MEETING_DWELL;
			const progress = easeInOutCubic(segmentElapsed / MEETING_TO_WORKSPACE);
			const fromPosition = new THREE.Vector3(
				...CAMERA_PRESETS.meeting.position
			);
			const toPosition = new THREE.Vector3(
				...CAMERA_PRESETS.workstation.position
			);
			position = new THREE.Vector3().lerpVectors(
				fromPosition,
				toPosition,
				progress
			);
			const fromTarget = new THREE.Vector3(...CAMERA_PRESETS.meeting.target);
			const toTarget = new THREE.Vector3(
				...CAMERA_PRESETS.workstation.target
			);
			target = new THREE.Vector3().lerpVectors(fromTarget, toTarget, progress);
		}

		camera.position.copy(position);
		if (controlsRef.current) {
			controlsRef.current.target.copy(target);
			controlsRef.current.update();
		} else {
			camera.lookAt(target);
		}

		if (elapsed >= INTRO_DURATION) {
			doneRef.current = true;
			if (controlsRef.current) controlsRef.current.enabled = true;
			onComplete();
		}
	});

	return null;
}
