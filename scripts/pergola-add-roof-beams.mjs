import { NodeIO, Document } from '@gltf-transform/core';
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

// Find the "material" (wood) material
let woodMat = null;
for (const mat of root.listMaterials()) {
  if (mat.getName() === 'material') {
    woodMat = mat;
    break;
  }
}
if (!woodMat) throw new Error('Could not find "material" material');

// ── Configuration ──
// Existing roof rafters span Z from ~96.061 to ~106.299
// Place new beams overlapping into the rafter tops so they look glued
const BEAM_Z_BOTTOM = 104.0;       // overlap into existing rafter tops by ~2.3 units
const BEAM_HEIGHT = 2.5;            // Z thickness of new beams
const BEAM_Z_TOP = BEAM_Z_BOTTOM + BEAM_HEIGHT;

const BEAM_WIDTH_Y = 2.0;           // width in Y direction
const GAP_Y = 1.2;                  // gap between beams in Y
const SPACING_Y = BEAM_WIDTH_Y + GAP_Y; // 3.2 center-to-center

// Beams run along X from 0 to 295.669
const BEAM_X_START = 0;
const BEAM_X_END = 295.669;

// Y range (between the two main horizontal beams)
const Y_START = 5.0;
const Y_END = 159.0;

// Calculate number of beams
const numBeams = Math.floor((Y_END - Y_START) / SPACING_Y);
console.log(`Adding ${numBeams} dense roof beams perpendicular to existing ones`);

// ── Box geometry helper ──
function createBoxGeometry(doc, xMin, xMax, yMin, yMax, zMin, zMax) {
  // Calculate dimensions for UV tiling (1 UV unit = ~10 world units)
  const xLen = (xMax - xMin) / 10;
  const yLen = (yMax - yMin) / 10;
  const zLen = (zMax - zMin) / 10;

  const positions = new Float32Array([
    // Front face (z = zMax)
    xMin, yMin, zMax,  xMax, yMin, zMax,  xMax, yMax, zMax,  xMin, yMax, zMax,
    // Back face (z = zMin)
    xMax, yMin, zMin,  xMin, yMin, zMin,  xMin, yMax, zMin,  xMax, yMax, zMin,
    // Top face (y = yMax) — this is the most visible face
    xMin, yMax, zMin,  xMin, yMax, zMax,  xMax, yMax, zMax,  xMax, yMax, zMin,
    // Bottom face (y = yMin)
    xMin, yMin, zMin,  xMax, yMin, zMin,  xMax, yMin, zMax,  xMin, yMin, zMax,
    // Right face (x = xMax)
    xMax, yMin, zMin,  xMax, yMax, zMin,  xMax, yMax, zMax,  xMax, yMin, zMax,
    // Left face (x = xMin)
    xMin, yMin, zMax,  xMin, yMax, zMax,  xMin, yMax, zMin,  xMin, yMin, zMin,
  ]);

  const normals = new Float32Array([
    // Front
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back
    0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
    // Top
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom
    0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
    // Right
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  ]);

  // UVs: tile texture along the beam length
  const uvs = new Float32Array([
    // Front face (XY plane visible) — tile along X
    0, 0,  xLen, 0,  xLen, yLen,  0, yLen,
    // Back face (XY plane visible) — tile along X
    0, 0,  xLen, 0,  xLen, yLen,  0, yLen,
    // Top face (XZ plane visible) — tile along X (wood grain direction)
    0, 0,  0, zLen,  xLen, zLen,  xLen, 0,
    // Bottom face (XZ plane visible)
    0, 0,  xLen, 0,  xLen, zLen,  0, zLen,
    // Right face (YZ plane visible)
    0, 0,  yLen, 0,  yLen, zLen,  0, zLen,
    // Left face (YZ plane visible)
    0, 0,  yLen, 0,  yLen, zLen,  0, zLen,
  ]);

  const indices = new Uint16Array([
    0,1,2, 0,2,3,       // front
    4,5,6, 4,6,7,       // back
    8,9,10, 8,10,11,    // top
    12,13,14, 12,14,15, // bottom
    16,17,18, 16,18,19, // right
    20,21,22, 20,22,23, // left
  ]);

  const posAccessor = doc.createAccessor('beam_pos')
    .setType('VEC3')
    .setArray(positions);

  const normAccessor = doc.createAccessor('beam_norm')
    .setType('VEC3')
    .setArray(normals);

  const uvAccessor = doc.createAccessor('beam_uv')
    .setType('VEC2')
    .setArray(uvs);

  const indexAccessor = doc.createAccessor('beam_idx')
    .setType('SCALAR')
    .setArray(indices);

  const primitive = doc.createPrimitive()
    .setAttribute('POSITION', posAccessor)
    .setAttribute('NORMAL', normAccessor)
    .setAttribute('TEXCOORD_0', uvAccessor)
    .setIndices(indexAccessor)
    .setMaterial(woodMat);

  return primitive;
}

// ── Find the "Viskon" node to add beams as children ──
let viskonNode = null;
function findNode(node, name) {
  if (node.getName() === name) return node;
  for (const child of node.listChildren()) {
    const found = findNode(child, name);
    if (found) return found;
  }
  return null;
}

for (const scene of root.listScenes()) {
  for (const node of scene.listChildren()) {
    viskonNode = findNode(node, 'Viskon');
    if (viskonNode) break;
  }
  if (viskonNode) break;
}

if (!viskonNode) throw new Error('Could not find Viskon node');

// ── Create beams ──
for (let i = 0; i < numBeams; i++) {
  const yCenter = Y_START + i * SPACING_Y + BEAM_WIDTH_Y / 2;
  const yMin = yCenter - BEAM_WIDTH_Y / 2;
  const yMax = yCenter + BEAM_WIDTH_Y / 2;

  const primitive = createBoxGeometry(
    doc,
    BEAM_X_START, BEAM_X_END,
    yMin, yMax,
    BEAM_Z_BOTTOM, BEAM_Z_TOP
  );

  const mesh = doc.createMesh(`roof_beam_dense_${i}`)
    .addPrimitive(primitive);

  // Create node hierarchy matching existing pattern: instance -> ____ -> Material4
  const meshNode = doc.createNode(`dense_beam_${i}`)
    .setMesh(mesh);

  const wrapperNode = doc.createNode(`dense_beam_wrapper_${i}`)
    .addChild(meshNode);

  const instanceNode = doc.createNode(`instance_dense_${i}`)
    .addChild(wrapperNode);

  viskonNode.addChild(instanceNode);
}

// ── Write output ──
await io.write('public/models/pegrola_-_micha.xml.glb', doc);
console.log(`Done – added ${numBeams} dense perpendicular roof beams above existing layer.`);