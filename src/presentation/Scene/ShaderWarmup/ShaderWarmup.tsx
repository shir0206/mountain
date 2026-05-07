import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";

import type { PresetKey } from "../types";
import { CAMERA_PRESETS } from "../config/cameraPresets";

// Walks every camera preset once after load and calls gl.compile() so WebGL
// compiles all shader programs up-front. Prevents the stutter when switching
// to a preset for the first time (e.g. workstation → garden) since the dense
// vegetation enters the frustum and would otherwise JIT-compile mid-transition.
export function ShaderWarmup() {
	const { gl, scene, camera } = useThree();
	const { active, progress } = useProgress();
	const warmedRef = useRef(false);

	useEffect(() => {
		if (warmedRef.current) return;
		if (active || progress < 100) return;
		warmedRef.current = true;

		const cam = camera as THREE.PerspectiveCamera;
		const originalPos = cam.position.clone();
		const originalQuat = cam.quaternion.clone();

		// Compile once at each preset pose so every material/shadow combo
		// this scene will ever use is hot in the GL driver cache.
		(Object.keys(CAMERA_PRESETS) as PresetKey[]).forEach((key) => {
			const p = CAMERA_PRESETS[key];
			cam.position.set(...p.position);
			cam.lookAt(...p.target);
			cam.updateMatrixWorld(true);
			gl.compile(scene, cam);
		});

		// Restore initial camera pose.
		cam.position.copy(originalPos);
		cam.quaternion.copy(originalQuat);
		cam.updateMatrixWorld(true);

		// Force one shadow refresh now that shaders are compiled; BakeShadows
		// will then freeze autoUpdate.
		gl.shadowMap.needsUpdate = true;
	}, [active, progress, gl, scene, camera]);

	return null;
}
