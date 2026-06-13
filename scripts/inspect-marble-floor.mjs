import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const doc = await io.read('public/models/pergola_new_marble_floor (1).glb');
const root = doc.getRoot();

console.log('=== MATERIALS ===');
for (const mat of root.listMaterials()) {
  console.log(`  Material: "${mat.getName()}"`);
  console.log(`    baseColor: ${JSON.stringify(mat.getBaseColorFactor())}`);
  console.log(`    metalness: ${mat.getMetallicFactor()}`);
  console.log(`    roughness: ${mat.getRoughnessFactor()}`);
  console.log(`    doubleSided: ${mat.getDoubleSided()}`);
  console.log(`    alphaMode: ${mat.getAlphaMode()}`);
  const baseColorTex = mat.getBaseColorTexture();
  const normalTex = mat.getNormalTexture();
  const mrTex = mat.getMetallicRoughnessTexture();
  console.log(`    hasBaseColorTexture: ${!!baseColorTex}`);
  console.log(`    hasNormalTexture: ${!!normalTex}`);
  console.log(`    hasMetallicRoughnessTexture: ${!!mrTex}`);
}

console.log('\n=== MESHES ===');
for (const mesh of root.listMeshes()) {
  console.log(`  Mesh: "${mesh.getName()}" primitives:${mesh.listPrimitives().length}`);
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    const norm = prim.getAttribute('NORMAL');
    const uv = prim.getAttribute('TEXCOORD_0');
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
    if (norm) {
      const nArr = norm.getArray();
      // Sample first 10 normals and check average Y direction
      let avgNx = 0, avgNy = 0, avgNz = 0;
      const count = nArr.length / 3;
      for (let i = 0; i < nArr.length; i += 3) {
        avgNx += nArr[i];
        avgNy += nArr[i+1];
        avgNz += nArr[i+2];
      }
      avgNx /= count; avgNy /= count; avgNz /= count;
      console.log(`    Avg Normal: [${avgNx.toFixed(4)}, ${avgNy.toFixed(4)}, ${avgNz.toFixed(4)}]`);
      // Show first 5 normals
      console.log(`    First 5 normals:`);
      for (let i = 0; i < Math.min(15, nArr.length); i += 3) {
        console.log(`      [${nArr[i].toFixed(4)}, ${nArr[i+1].toFixed(4)}, ${nArr[i+2].toFixed(4)}]`);
      }
    } else {
      console.log(`    NO NORMALS ATTRIBUTE!`);
    }
    console.log(`    hasUV: ${!!uv}`);
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