import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

import type { SceneObject } from "../types";
import type { ExperienceProfile } from "../types";
import { SCENE_OBJECTS } from "../config/sceneObjects";
import {
	getAllKnownModelPaths,
	resolveModelPathForProfile,
} from "../config/modelVariants";
import { applyMaterialPolicy } from "./applyMaterialPolicy";

// Draco decoder needed for the optimized GLBs (geometry compressed with Draco).
useGLTF.setDecoderPath(
	"https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);

SCENE_OBJECTS.forEach(({ path }) => {
	getAllKnownModelPaths(path).forEach((assetPath) => {
		const model = import.meta.env.BASE_URL + assetPath;
		useGLTF.preload(model);
	});
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
	profile,
}: Omit<SceneObject, "label"> & {
	profile: ExperienceProfile;
}) {
	const resolvedPath = resolveModelPathForProfile(path, profile);
	const url = import.meta.env.BASE_URL + resolvedPath;
	const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };

	const cloned = useMemo(() => {
		const c = scene.clone(true);
		applyMaterialPolicy(c, resolvedPath);
		return c;
	}, [scene, resolvedPath]);

	return (
		<primitive
			object={cloned}
			position={position}
			scale={scale}
			rotation-y={rotationY}
		/>
	);
}
