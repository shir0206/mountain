import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

import {
	MONITOR_A_X, MONITOR_A_Y, MONITOR_A_Z, MONITOR_A_ANGLE,
	MONITOR_B_X, MONITOR_B_Y, MONITOR_B_Z, MONITOR_B_ANGLE,
	MONITOR_C_X, MONITOR_C_Y, MONITOR_C_Z, MONITOR_C_ANGLE,
} from "../config/positions";

// Loads the livecoding GLB once and renders 3 clipped copies — one per monitor.
// Each copy shows a vertical third of the code mesh using clipping planes.
export function CodeOnMonitors() {
	const url =
		import.meta.env.BASE_URL +
		"models_optimized/alexandra_cardenas_livecoding_d5.glb";
	const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };

	// Compute bounding box once to determine vertical thirds.
	const { sections } = useMemo(() => {
		const box = new THREE.Box3().setFromObject(scene);
		const minY = box.min.y;
		const maxY = box.max.y;
		const third = (maxY - minY) / 3;

		return {
			sections: [
				{ clipMin: minY + third * 2, clipMax: maxY }, // top third
				{ clipMin: minY + third, clipMax: minY + third * 2 }, // middle third
				{ clipMin: minY, clipMax: minY + third }, // bottom third
			],
		};
	}, [scene]);

	// Monitor positions + rotations for A, B, C
	const monitors: {
		position: [number, number, number];
		rotationY: number;
		section: (typeof sections)[number];
	}[] = useMemo(
		() => [
			{
				position: [MONITOR_A_X + 0.05, MONITOR_A_Y + 0.55, MONITOR_A_Z - 0.02],
				rotationY: MONITOR_A_ANGLE,
				section: sections[0],
			},
			{
				position: [MONITOR_B_X + 0.05, MONITOR_B_Y + 0.55, MONITOR_B_Z - 0.02],
				rotationY: MONITOR_B_ANGLE,
				section: sections[1],
			},
			{
				position: [MONITOR_C_X + 0.05, MONITOR_C_Y + 0.55, MONITOR_C_Z - 0.02],
				rotationY: MONITOR_C_ANGLE,
				section: sections[2],
			},
		],
		[sections]
	);

	return (
		<>
			{monitors.map((monitor, index) => (
				<CodeSection
					key={index}
					scene={scene}
					position={monitor.position}
					rotationY={monitor.rotationY}
					clipMin={monitor.section.clipMin}
					clipMax={monitor.section.clipMax}
				/>
			))}
		</>
	);
}

function CodeSection({
	scene,
	position,
	rotationY,
	clipMin,
	clipMax,
}: {
	scene: THREE.Group;
	position: [number, number, number];
	rotationY: number;
	clipMin: number;
	clipMax: number;
}) {
	const cloned = useMemo(() => {
		const clonedScene = scene.clone(true);
		// Two clipping planes: cut below clipMin, cut above clipMax
		const planeBottom = new THREE.Plane(new THREE.Vector3(0, 1, 0), -clipMin);
		const planeTop = new THREE.Plane(new THREE.Vector3(0, -1, 0), clipMax);
		const planes = [planeBottom, planeTop];

		clonedScene.traverse((child) => {
			const mesh = child as THREE.Mesh;
			if (mesh.isMesh) {
				// Clone material to avoid shared clipping state
				const material = (mesh.material as THREE.Material).clone();
				material.clippingPlanes = planes;
				material.clipShadows = true;
				mesh.material = material;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
			}
		});
		return clonedScene;
	}, [scene, clipMin, clipMax]);

	return (
		<primitive
			object={cloned}
			position={position}
			scale={0.45}
			rotation-y={rotationY}
		/>
	);
}
