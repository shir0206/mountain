import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { prune } from '@gltf-transform/functions';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const INPUT = 'public/models/pergola_new_marble_floor (1).glb';
const OUT_STRUCTURE = 'public/models/pergola_structure.glb';
const OUT_FLOOR = 'public/models/pergola_floor.glb';

/**
 * Remove all meshes/nodes that use a given material name.
 * Works by detaching nodes whose mesh primitives ALL use the target material,
 * and for mixed-material meshes, removes only the matching primitives.
 */
function removeByMaterial(doc, materialName) {
  const root = doc.getRoot();

  // Detach nodes whose mesh uses ONLY the target material
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const prims = mesh.listPrimitives();
    const allMatch = prims.every(p => p.getMaterial()?.getName() === materialName);
    if (allMatch) {
      node.setMesh(null);
    }
  }

  // For meshes with mixed materials, remove only matching primitives
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      if (prim.getMaterial()?.getName() === materialName) {
        mesh.removePrimitive(prim);
      }
    }
  }
}

/**
 * Keep only meshes/nodes that use a given material name. Remove everything else.
 */
function keepOnlyMaterial(doc, materialName) {
  const root = doc.getRoot();

  // Detach nodes whose mesh uses NONE of the target material
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const prims = mesh.listPrimitives();
    const anyMatch = prims.some(p => p.getMaterial()?.getName() === materialName);
    if (!anyMatch) {
      node.setMesh(null);
    }
  }

  // For meshes with mixed materials, remove non-matching primitives
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      if (prim.getMaterial()?.getName() !== materialName) {
        mesh.removePrimitive(prim);
      }
    }
  }
}

// --- Create pergola structure (remove floor material) ---
console.log('Creating pergola structure...');
const docStructure = await io.read(INPUT);
removeByMaterial(docStructure, 'marble_floor');
await docStructure.transform(prune());
await io.write(OUT_STRUCTURE, docStructure);
console.log(`  Written: ${OUT_STRUCTURE}`);

// --- Create floor only (keep only floor material) ---
console.log('Creating pergola floor...');
const docFloor = await io.read(INPUT);
keepOnlyMaterial(docFloor, 'marble_floor');
await docFloor.transform(prune());
await io.write(OUT_FLOOR, docFloor);
console.log(`  Written: ${OUT_FLOOR}`);

console.log('Done!');