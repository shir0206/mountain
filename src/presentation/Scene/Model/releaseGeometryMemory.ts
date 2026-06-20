import * as THREE from "three";

/**
 * Track geometries already marked for CPU-side release to avoid
 * setting the onUpload callback more than once on shared geometry.
 */
const processed = new WeakSet<THREE.BufferGeometry>();

/**
 * Marks all BufferAttributes in the scene graph for CPU-side array release
 * once the GPU has uploaded the data. This typically halves geometry memory
 * because the Float32Array/Uint16Array backing data is freed after upload.
 *
 * TRADE-OFF: If WebGL context is lost, these geometries cannot be re-uploaded
 * (extremely rare on desktop, slightly more common on mobile but still rare).
 */
export function releaseGeometryMemory(root: THREE.Object3D): void {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;

    const geo = mesh.geometry;
    if (processed.has(geo)) return;
    processed.add(geo);

    // Release each named attribute's CPU array after GPU upload
    for (const key in geo.attributes) {
      const attr = geo.attributes[key] as THREE.BufferAttribute;
      if (!attr || !attr.array || attr.array.byteLength === 0) continue;
      if (typeof attr.onUpload !== "function") continue;
      attr.onUpload(function (this: THREE.BufferAttribute) {
        const Ctor = this.array.constructor as new (
          len: number
        ) => ArrayLike<number>;
        (this as unknown as { array: ArrayLike<number> }).array = new Ctor(0);
      });
    }

    // Release index buffer CPU array after GPU upload
    if (
      geo.index &&
      geo.index.array &&
      geo.index.array.byteLength > 0 &&
      typeof geo.index.onUpload === "function"
    ) {
      geo.index.onUpload(function (this: THREE.BufferAttribute) {
        const Ctor = this.array.constructor as new (
          len: number
        ) => ArrayLike<number>;
        (this as unknown as { array: ArrayLike<number> }).array = new Ctor(0);
      });
    }
  });
}
