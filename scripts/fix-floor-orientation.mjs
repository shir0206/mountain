/**
 * Fix floor mesh orientation in pergola_new_marble_floor (1).glb
 * 
 * Problem: The floor slab was authored in a Z-up coordinate system.
 * Its large visible face (296×157) lies in the XY plane with normals ±Z.
 * In Three.js (Y-up), the sun shines downward (-Y), so surfaces need
 * normals pointing +Y to receive light/shadows.
 *
 * Fix: Rotate +90° around X axis:
 *   [x, y, z] → [x, -z, y]
 * This moves the big face into the XZ plane with normals ±Y,
 * keeping the floor in positive Y and Z space.
 */

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const GLB_PATH = 'public/models/pergola_new_marble_floor (1).glb';

const doc = await io.read(GLB_PATH);
const root = doc.getRoot();

// Find the floor mesh (material "marble_floor", mesh named "Material3")
let floorMesh = null;
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const mat = prim.getMaterial();
    if (mat && mat.getName() === 'marble_floor') {
      floorMesh = mesh;
      break;
    }
  }
  if (floorMesh) break;
}

if (!floorMesh) {
  console.error('Could not find floor mesh with material "marble_floor"');
  process.exit(1);
}

console.log(`Found floor mesh: "${floorMesh.getName()}"`);

// Flip Y axis: [x, y, z] → [x, -y, z]
for (const prim of floorMesh.listPrimitives()) {
  // Flip positions Y
  const posAccessor = prim.getAttribute('POSITION');
  if (posAccessor) {
    const arr = posAccessor.getArray();
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] = -arr[i + 1];
    }
    posAccessor.setArray(arr);
    console.log(`  Flipped Y on ${arr.length / 3} position vertices`);
  }

  // Flip normals Y
  const normAccessor = prim.getAttribute('NORMAL');
  if (normAccessor) {
    const arr = normAccessor.getArray();
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] = -arr[i + 1];
    }
    normAccessor.setArray(arr);
    console.log(`  Flipped Y on ${arr.length / 3} normals`);
  }
}

// Verify new bounding box
for (const prim of floorMesh.listPrimitives()) {
  const pos = prim.getAttribute('POSITION');
  if (pos) {
    const arr = pos.getArray();
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < arr.length; i += 3) {
      minX = Math.min(minX, arr[i]);   maxX = Math.max(maxX, arr[i]);
      minY = Math.min(minY, arr[i+1]); maxY = Math.max(maxY, arr[i+1]);
      minZ = Math.min(minZ, arr[i+2]); maxZ = Math.max(maxZ, arr[i+2]);
    }
    console.log(`\n  New BBOX: X[${minX.toFixed(2)}, ${maxX.toFixed(2)}] Y[${minY.toFixed(2)}, ${maxY.toFixed(2)}] Z[${minZ.toFixed(2)}, ${maxZ.toFixed(2)}]`);
    console.log(`  New Size: ${(maxX-minX).toFixed(2)} × ${(maxY-minY).toFixed(2)} × ${(maxZ-minZ).toFixed(2)}`);
    
    const norm = prim.getAttribute('NORMAL');
    if (norm) {
      const nArr = norm.getArray();
      console.log(`  All unique normals:`);
      const unique = new Set();
      for (let i = 0; i < nArr.length; i += 3) {
        unique.add(`[${nArr[i].toFixed(4)}, ${nArr[i+1].toFixed(4)}, ${nArr[i+2].toFixed(4)}]`);
      }
      for (const n of unique) console.log(`    ${n}`);
    }
  }
}

await io.write(GLB_PATH, doc);
console.log(`\nDone! Wrote fixed GLB to ${GLB_PATH}`);