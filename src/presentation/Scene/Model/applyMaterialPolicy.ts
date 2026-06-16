import * as THREE from "three";
import {
	EMISSIVE_TEXT_PATH,
	MOUNTAIN_PATH,
	MOUNTAIN_BACKGROUND_MATERIAL,
} from "../config/renderPolicy";

export type TextureTier = "primary" | "secondary" | "tertiary";

/** Textures deferred for lazy GPU upload (secondary/tertiary tiers). */
const pendingTextures: THREE.Texture[] = [];

/** Returns and clears the pending texture queue. */
export function drainPendingTextures(): THREE.Texture[] {
	return pendingTextures.splice(0, pendingTextures.length);
}

/**
 * Applies the scene-wide material policy to a freshly cloned GLTF scene:
 *  - emissive "screen-on" effect for the welcome text GLB
 *  - soft-blurred background skybox for the mountain GLB
 *  - anisotropy / mipmap defaults on all textures
 *  - deferred GPU upload for secondary/tertiary tiers (lazy loading)
 */
export function applyMaterialPolicy(
	root: THREE.Object3D,
	path: string,
	tier: TextureTier = "primary"
): void {
	const isEmissiveText = path === EMISSIVE_TEXT_PATH;
	const isMountain = path === MOUNTAIN_PATH;

	root.traverse((child) => {
		const mesh = child as THREE.Mesh;
		if (!mesh.isMesh) return;

		mesh.castShadow = !isMountain;
		mesh.receiveShadow = true;

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
					texture.needsUpdate = true;
				} else if (tier === "primary") {
					texture.anisotropy = 16;
					texture.minFilter = THREE.LinearMipmapLinearFilter;
					texture.magFilter = THREE.LinearFilter;
					texture.generateMipmaps = true;
					texture.needsUpdate = true;
				} else {
					// Deferred: cheap initial state — no mipmaps, low anisotropy.
					// Full quality applied later via drainPendingTextures().
					texture.anisotropy = 1;
					texture.minFilter = THREE.LinearFilter;
					texture.magFilter = THREE.LinearFilter;
					texture.generateMipmaps = false;
					texture.needsUpdate = true;
					pendingTextures.push(texture);
				}
			});
		});
	});
}
