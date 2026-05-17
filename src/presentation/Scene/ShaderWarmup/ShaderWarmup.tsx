import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";

import type { PresetKey } from "../types";
import { CAMERA_PRESETS } from "../config/cameraPresets";

/**
 * Imperatively walks every camera preset and calls gl.compile() so WebGL
 * compiles all shader programs up-front, then triggers a single shadow refresh.
 */
function warmupShaders(
	gl: THREE.WebGLRenderer,
	scene: THREE.Scene,
	camera: THREE.Camera
) {
	const cam = camera as THREE.PerspectiveCamera;
	const originalPos = cam.position.clone();
	const originalQuat = cam.quaternion.clone();

	(Object.keys(CAMERA_PRESETS) as PresetKey[]).forEach((key) => {
		const p = CAMERA_PRESETS[key];
		cam.position.set(...p.position);
		cam.lookAt(...p.target);
		cam.updateMatrixWorld(true);
		gl.compile(scene, cam);
	});

	cam.position.copy(originalPos);
	cam.quaternion.copy(originalQuat);
	cam.updateMatrixWorld(true);

	// Force one shadow refresh now that shaders are compiled; BakeShadows
	// will then freeze autoUpdate.
	gl.shadowMap.needsUpdate = true;
}

// Walks every camera preset once after load so WebGL compiles all shader
// programs up-front. Prevents stutter when switching to a preset for the
// first time (e.g. workstation → garden) since dense vegetation enters the
// frustum and would otherwise JIT-compile mid-transition.
export function ShaderWarmup() {
	const { gl, scene, camera } = useThree();
	const { active, progress } = useProgress();
	const warmedRef = useRef(false);

	useEffect(() => {
		if (warmedRef.current) return;
		if (active || progress < 100) return;
		warmedRef.current = true;

		warmupShaders(gl, scene, camera);
	}, [active, progress, gl, scene, camera]);

	return null;
}
