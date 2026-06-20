import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const INPUT = 'public/models/pergola_new_marble_floor (1).glb';
const doc = await io.read(INPUT);
const root = doc.getRoot();

// Remove every other roof beam to widen gaps from ~1.2 to ~4.4 GLB units
// This makes shadow stripes resolvable at the current shadow map resolution.
let removed = 0;
for (const scene of root.listScenes()) {
  const toRemove = [];
  
  scene.traverse((node) => {
    const name = node.getName();
    // Match dense beam instance nodes (even-indexed ones stay, odd get removed)
    const match = name.match(/^instance_dense_(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      if (idx % 2 === 1) {
        toRemove.push(node);
      }
    }
  });

  for (const node of toRemove) {
    // Detach from parent and dispose
    node.detach();
    removed++;
  }
}

console.log(`Removed ${removed} beams (kept every other one)`);

// Also remove orphaned meshes that are no longer referenced
const usedMeshes = new Set();
for (const scene of root.listScenes()) {
  scene.traverse((node) => {
    const mesh = node.getMesh();
    if (mesh) usedMeshes.add(mesh);
  });
}

let meshesRemoved = 0;
for (const mesh of root.listMeshes()) {
  if (!usedMeshes.has(mesh)) {
    mesh.dispose();
    meshesRemoved++;
  }
}
console.log(`Disposed ${meshesRemoved} orphaned meshes`);

await io.write(INPUT, doc);
console.log(`Written: ${INPUT}`);