import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const doc = await io.read('public/models/pegrola_-_micha.xml.glb');
const root = doc.getRoot();

console.log('=== MATERIALS ===');
for (const mat of root.listMaterials()) {
  console.log(`  Material: "${mat.getName()}" baseColor:${JSON.stringify(mat.getBaseColorFactor())}`);
}

console.log('\n=== MESHES ===');
for (const mesh of root.listMeshes()) {
  console.log(`  Mesh: "${mesh.getName()}" primitives:${mesh.listPrimitives().length}`);
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    if (pos) {
      const arr = pos.getArray();
      let minX = Infinity, minY = Infinity, minZ = Infinity;
      let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
      for (let i = 0; i < arr.length; i += 3) {
        minX = Math.min(minX, arr[i]);
        maxX = Math.max(maxX, arr[i]);
        minY = Math.min(minY, arr[i+1]);
        maxY = Math.max(maxY, arr[i+1]);
        minZ = Math.min(minZ, arr[i+2]);
        maxZ = Math.max(maxZ, arr[i+2]);
      }
      console.log(`    BBOX: X[${minX.toFixed(3)}, ${maxX.toFixed(3)}] Y[${minY.toFixed(3)}, ${maxY.toFixed(3)}] Z[${minZ.toFixed(3)}, ${maxZ.toFixed(3)}]`);
      console.log(`    Size: ${(maxX-minX).toFixed(3)} x ${(maxY-minY).toFixed(3)} x ${(maxZ-minZ).toFixed(3)}`);
      console.log(`    Vertices: ${arr.length / 3}`);
    }
    const mat = prim.getMaterial();
    if (mat) console.log(`    Material: "${mat.getName()}"`);
  }
}

console.log('\n=== NODES ===');
function printNode(node, depth = 0) {
  const indent = '  '.repeat(depth + 1);
  const t = node.getTranslation();
  const r = node.getRotation();
  const s = node.getScale();
  const mesh = node.getMesh();
  console.log(`${indent}Node: "${node.getName()}" T:[${t.map(v=>v.toFixed(3))}] R:[${r.map(v=>v.toFixed(3))}] S:[${s.map(v=>v.toFixed(3))}]${mesh ? ` Mesh:"${mesh.getName()}"` : ''}`);
  for (const child of node.listChildren()) {
    printNode(child, depth + 1);
  }
}

for (const scene of root.listScenes()) {
  console.log(`Scene: "${scene.getName()}"`);
  for (const node of scene.listChildren()) {
    printNode(node);
  }
}