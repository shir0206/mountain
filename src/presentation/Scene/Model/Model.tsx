import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

import type { SceneObject } from "../types";
import { SCENE_OBJECTS } from "../config/sceneObjects";
import { applyMaterialPolicy } from "./applyMaterialPolicy";

// Draco decoder needed for the optimized GLBs (geometry compressed with Draco).
useGLTF.setDecoderPath(
	"https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);

SCENE_OBJECTS.forEach(({ path }) => {
	const model = import.meta.env.BASE_URL + path;
	useGLTF.preload(model);
});

// Preload the code GLB used on monitors (not in SCENE_OBJECTS — rendered via CodeOnMonitors)
useGLTF.preload(
	import.meta.env.BASE_URL +
		"models_optimized/alexandra_cardenas_livecoding_d5.glb"
);

export function Model({
	path,
	position,
	scale,
	rotationY = 0,
}: Omit<SceneObject, "label">) {
	const url = import.meta.env.BASE_URL + path;
	const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };

	const cloned = useMemo(() => {
		const c = scene.clone(true);
		applyMaterialPolicy(c, path);
		return c;
	}, [scene, path]);

	return (
		<primitive
			object={cloned}
			position={position}
			scale={scale}
			rotation-y={rotationY}
		/>
	);
}
