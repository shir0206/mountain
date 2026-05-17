import * as THREE from "three";

/**
 * Recursively disposes all geometries, materials, and textures in a scene graph.
 * Call on unmount to release GPU + CPU memory (ArrayBuffers).
 */
export function disposeSceneGraph(root: THREE.Object3D): void {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    // Dispose geometry (releases ArrayBuffer attribute data)
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    // Dispose materials and their textures
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    materials.forEach((mat) => {
      if (!mat) return;
      // Dispose all texture properties
      for (const key of Object.keys(mat)) {
        const value = (mat as unknown as Record<string, unknown>)[key];
        if (value && typeof value === "object" && "isTexture" in value && (value as THREE.Texture).isTexture) {
          (value as THREE.Texture).dispose();
        }
      }
      mat.dispose();
    });
  });
}