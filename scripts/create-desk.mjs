import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

// ── Step 1: Extract WALNUT material from round table ──
const sourceDoc = await io.read('public/models_optimized/edelweiss_round_table_ash_and_white.glb');
const sourceRoot = sourceDoc.getRoot();

let walnutMat = null;
for (const mat of sourceRoot.listMaterials()) {
  if (mat.getName() === 'WALNUT') {
    walnutMat = mat;
    break;
  }
}
if (!walnutMat) throw new Error('Could not find WALNUT material');

const walnutTexture = walnutMat.getBaseColorTexture();
if (!walnutTexture) throw new Error('WALNUT material has no baseColor texture');

const walnutImage = walnutTexture.getImage();
const walnutMimeType = walnutTexture.getMimeType();
const walnutMetallic = walnutMat.getMetallicFactor();
const walnutRoughness = walnutMat.getRoughnessFactor();
const walnutBaseColor = walnutMat.getBaseColorFactor();

console.log('WALNUT texture:', walnutMimeType, walnutImage?.byteLength, 'bytes');
console.log('  metallic:', walnutMetallic, 'roughness:', walnutRoughness);

// ── Step 2: Create a new document with a box shelf ──
const doc = new Document();
const buffer = doc.createBuffer('main');

// Desk dimensions (meters): shelf box running front-to-back
const W = 0.6;   // width (X) - narrow
const H = 0.1;   // height (Y) - visible box thickness (shelf)
const D = 3.0;   // depth (Z) - long, front-to-back

const hw = W / 2, hh = H / 2, hd = D / 2;

// Full closed box: 6 faces, 4 verts each = 24 verts
// Face order: +Y (top/ceiling), -Y (bottom), +X (right), -X (left), +Z (front), -Z (back)
const positions = new Float32Array([
  // Top face (+Y) - ceiling
  -hw, hh, -hd,   hw, hh, -hd,   hw, hh, hd,   -hw, hh, hd,
  // Bottom face (-Y)
  -hw, -hh, hd,   hw, -hh, hd,   hw, -hh, -hd,   -hw, -hh, -hd,
  // Right face (+X)
  hw, -hh, -hd,   hw, -hh, hd,   hw, hh, hd,   hw, hh, -hd,
  // Left face (-X)
  -hw, -hh, hd,   -hw, -hh, -hd,   -hw, hh, -hd,   -hw, hh, hd,
  // Front face (+Z)
  -hw, -hh, hd,   -hw, hh, hd,   hw, hh, hd,   hw, -hh, hd,
  // Back face (-Z)
  hw, -hh, -hd,   hw, hh, -hd,   -hw, hh, -hd,   -hw, -hh, -hd,
]);

const normals = new Float32Array([
  // Top
  0,1,0, 0,1,0, 0,1,0, 0,1,0,
  // Bottom
  0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
  // Right
  1,0,0, 1,0,0, 1,0,0, 1,0,0,
  // Left
  -1,0,0, -1,0,0, -1,0,0, -1,0,0,
  // Front
  0,0,1, 0,0,1, 0,0,1, 0,0,1,
  // Back
  0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
]);

// UVs - rotated 90 degrees: grain runs along X (width) instead of Z (depth)
// Top face: Z→u, X→v (rotated 90° from before)
// Side faces: similarly rotated
const uvs = new Float32Array([
  // Top face (+Y): Z→u, X→v (grain along X, 90° rotated)
  0,0, 0,1, 1,1, 1,0,
  // Bottom face (-Y): same rotation
  1,0, 1,1, 0,1, 0,0,
  // Right face (+X): Z→u, Y→v
  0,0, 1,0, 1,1, 0,1,
  // Left face (-X): Z→u, Y→v
  0,0, 1,0, 1,1, 0,1,
  // Front face (+Z): Y→u, X→v (rotated)
  0,0, 0,1, 1,1, 1,0,
  // Back face (-Z): Y→u, X→v (rotated)
  0,0, 0,1, 1,1, 1,0,
]);

// Indices: 2 triangles per face, 6 faces = 36 indices
const indices = new Uint16Array([
  0,1,2, 0,2,3,       // top (ceiling)
  4,5,6, 4,6,7,       // bottom
  8,9,10, 8,10,11,    // right
  12,13,14, 12,14,15, // left
  16,17,18, 16,18,19, // front
  20,21,22, 20,22,23, // back
]);

// Create accessors
const posAccessor = doc.createAccessor('position').setType('VEC3').setArray(positions).setBuffer(buffer);
const normAccessor = doc.createAccessor('normal').setType('VEC3').setArray(normals).setBuffer(buffer);
const uvAccessor = doc.createAccessor('texcoord').setType('VEC2').setArray(uvs).setBuffer(buffer);
const idxAccessor = doc.createAccessor('indices').setType('SCALAR').setArray(indices).setBuffer(buffer);

// Create texture and material
const texture = doc.createTexture('walnut_wood')
  .setImage(walnutImage)
  .setMimeType(walnutMimeType);

const material = doc.createMaterial('WALNUT')
  .setBaseColorFactor(walnutBaseColor)
  .setMetallicFactor(walnutMetallic)
  .setRoughnessFactor(walnutRoughness)
  .setBaseColorTexture(texture)
  .setDoubleSided(true);

// Create primitive and mesh
const prim = doc.createPrimitive()
  .setAttribute('POSITION', posAccessor)
  .setAttribute('NORMAL', normAccessor)
  .setAttribute('TEXCOORD_0', uvAccessor)
  .setIndices(idxAccessor)
  .setMaterial(material);

const mesh = doc.createMesh('desk_mesh').addPrimitive(prim);

// Create node and scene
const node = doc.createNode('desk').setMesh(mesh);
const scene = doc.createScene('Scene').addChild(node);

// ── Step 3: Write output ──
await io.write('public/models_optimized/desk.glb', doc);
console.log('\nDone – desk.glb created (closed box shelf, walnut, UVs rotated 90°)');