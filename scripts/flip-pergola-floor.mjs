import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const GLB_PATH = 'public/models_optimized/pergola_floor.glb';

const doc = await io.read(GLB_PATH);
const root = doc.getRoot();

// 180° rotation around X axis: [x, y, z] → [x, -y, -z]
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    if (pos) {
      const arr = pos.getArray();
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] = -arr[i + 1];
        arr[i + 2] = -arr[i + 2];
      }
      pos.setArray(arr);
    }

    const norm = prim.getAttribute('NORMAL');
    if (norm) {
      const arr = norm.getArray();
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] = -arr[i + 1];
        arr[i + 2] = -arr[i + 2];
      }
      norm.setArray(arr);
    }
  }
}

await io.write(GLB_PATH, doc);
console.log('Done – flipped pergola_floor.glb 180° around X axis');