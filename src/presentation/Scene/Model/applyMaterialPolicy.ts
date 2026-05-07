import * as THREE from "three";
import {
	EMISSIVE_TEXT_PATH,
	MOUNTAIN_PATH,
	MOUNTAIN_BACKGROUND_MATERIAL,
	NO_SHADOW_PATHS,
} from "../config/renderPolicy";

/**
 * Applies the scene-wide material policy to a freshly cloned GLTF scene:
 *  - shadow casting/receiving per NO_SHADOW_PATHS
 *  - emissive "screen-on" effect for the welcome text GLB
 *  - soft-blurred background skybox for the mountain GLB
 *  - anisotropy / mipmap defaults on all textures
 */
export function applyMaterialPolicy(root: THREE.Object3D, path: string): void {
	const skipShadows = NO_SHADOW_PATHS.has(path);
	const isEmissiveText = path === EMISSIVE_TEXT_PATH;
	const isMountain = path === MOUNTAIN_PATH;

	root.traverse((child) => {
		const mesh = child as THREE.Mesh;
		if (!mesh.isMesh) return;

		mesh.castShadow = !skipShadows;
		mesh.receiveShadow = !skipShadows;

		const meshMaterial = mesh.material as
			| THREE.MeshStandardMaterial
			| THREE.MeshStandardMaterial[];
		const materials = Array.isArray(meshMaterial)
			? meshMaterial
			: [meshMaterial];
		materials.forEach((material) => {
			if (!material) return;

			if (isEmissiveText) {
				material.emissive = new THREE.Color("#a8d4ff");
				material.emissiveIntensity = 3.5;
				material.toneMapped = false;
			}

			const isBackground =
				isMountain && material.name === MOUNTAIN_BACKGROUND_MATERIAL;

			const maps: (THREE.Texture | null | undefined)[] = [
				material.map,
				material.normalMap,
				material.roughnessMap,
				material.metalnessMap,
				material.aoMap,
				material.emissiveMap,
			];
			maps.forEach((texture) => {
				if (!texture) return;
				if (isBackground) {
					texture.anisotropy = 1;
					texture.minFilter = THREE.LinearMipmapLinearFilter;
					texture.magFilter = THREE.LinearFilter;
					texture.generateMipmaps = true;
					(texture as unknown as { bias: number }).bias = 1.5;
				} else {
					texture.anisotropy = 16;
					texture.minFilter = THREE.LinearMipmapLinearFilter;
					texture.magFilter = THREE.LinearFilter;
					texture.generateMipmaps = true;
				}
				texture.needsUpdate = true;
			});
		});
	});
}
