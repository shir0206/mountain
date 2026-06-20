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
// RIGHT SIDE wall (model right = scene left after PI rotation)
// Beams rotated 90°: wide face (4.7) extends in Y toward meeting area
// Thin edge (1.5) in X direction

// X position: centered on column (290.945 to 295.669), thin 1.5 units
const COLUMN_CENTER_X = (290.945 + 295.669) / 2; // ~293.3
const BEAM_THIN_X = 1.5;
const WALL_X_MIN = COLUMN_CENTER_X - BEAM_THIN_X / 2;
const WALL_X_MAX = COLUMN_CENTER_X + BEAM_THIN_X / 2;

// Z range: full height (bottom to top)
const WALL_Z_MIN = -7.874;
const WALL_Z_MAX = 102.0;

// Y range: beams span from ~109 to ~164, each beam is 4.7 wide in Y
const Y_START = 109.0;
const Y_END = 164.0;

// Beam dimensions: wide face = 4.7 in Y, gap = 0.5 between beams
const BEAM_WIDTH_Y = 4.724;  // wide face toward meeting
const GAP_Y = 0.5;           // gap between beams
const SPACING_Y = BEAM_WIDTH_Y + GAP_Y; // 5.224 center-to-center

// Calculate number of beams
const numBeams = Math.floor((Y_END - Y_START) / SPACING_Y);
console.log(`Adding ${numBeams} rotated vertical wall beams (wide face toward meeting)`);

// ── Box geometry helper ──
function createBoxGeometry(doc, xMin, xMax, yMin, yMax, zMin, zMax) {
  const xLen = (xMax - xMin) / 10;
  const yLen = (yMax - yMin) / 10;
  const zLen = (zMax - zMin) / 10;

  const positions = new Float32Array([
    // Front face (z = zMax)
    xMin, yMin, zMax,  xMax, yMin, zMax,  xMax, yMax, zMax,  xMin, yMax, zMax,
    // Back face (z = zMin)
    xMax, yMin, zMin,  xMin, yMin, zMin,  xMin, yMax, zMin,  xMax, yMax, zMin,
    // Top face (y = yMax)
    xMin, yMax, zMin,  xMin, yMax, zMax,  xMax, yMax, zMax,  xMax, yMax, zMin,
    // Bottom face (y = yMin)
    xMin, yMin, zMin,  xMax, yMin, zMin,  xMax, yMin, zMax,  xMin, yMin, zMax,
    // Right face (x = xMax)
    xMax, yMin, zMin,  xMax, yMax, zMin,  xMax, yMax, zMax,  xMax, yMin, zMax,
    // Left face (x = xMin)
    xMin, yMin, zMax,  xMin, yMax, zMax,  xMin, yMax, zMin,  xMin, yMin, zMin,
  ]);

  const normals = new Float32Array([
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  ]);

  // UVs: wood grain runs along Z (vertical) — rotated to match other beams
  const uvs = new Float32Array([
    // Front face (XZ visible) — grain along Z
    0, 0,  0, xLen,  zLen, xLen,  zLen, 0,
    // Back face — grain along Z
    0, 0,  0, xLen,  zLen, xLen,  zLen, 0,
    // Top face (XY visible)
    0, 0,  0, yLen,  xLen, yLen,  xLen, 0,
    // Bottom face
    0, 0,  xLen, 0,  xLen, yLen,  0, yLen,
    // Right face (YZ visible) — grain along Z (vertical)
    0, 0,  0, yLen,  zLen, yLen,  zLen, 0,
    // Left face (YZ visible) — grain along Z (vertical)
    0, 0,  0, yLen,  zLen, yLen,  zLen, 0,
  ]);

  const indices = new Uint16Array([
    0,1,2, 0,2,3,
    4,5,6, 4,6,7,
    8,9,10, 8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23,
  ]);

  const posAccessor = doc.createAccessor('wall_pos')
    .setType('VEC3')
    .setArray(positions);

  const normAccessor = doc.createAccessor('wall_norm')
    .setType('VEC3')
    .setArray(normals);

  const uvAccessor = doc.createAccessor('wall_uv')
    .setType('VEC2')
    .setArray(uvs);

  const indexAccessor = doc.createAccessor('wall_idx')
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

// ── Find the "Viskon" node ──
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

// ── Create vertical beams, wide face in Y toward meeting ──
for (let i = 0; i < numBeams; i++) {
  const yMin = Y_START + i * SPACING_Y;
  const yMax = yMin + BEAM_WIDTH_Y;

  const primitive = createBoxGeometry(
    doc,
    WALL_X_MIN, WALL_X_MAX,
    yMin, yMax,
    WALL_Z_MIN, WALL_Z_MAX
  );

  const mesh = doc.createMesh(`wall_beam_rotated_${i}`)
    .addPrimitive(primitive);

  const meshNode = doc.createNode(`wall_beam_rotated_node_${i}`)
    .setMesh(mesh);

  const wrapperNode = doc.createNode(`wall_beam_rotated_wrapper_${i}`)
    .addChild(meshNode);

  const instanceNode = doc.createNode(`instance_wall_beam_rotated_${i}`)
    .addChild(wrapperNode);

  viskonNode.addChild(instanceNode);
}

// ── Write output ──
await io.write('public/models/pegrola_-_micha.xml.glb', doc);
console.log(`Done – added ${numBeams} rotated beams (wide ${BEAM_WIDTH_Y} in Y toward meeting, thin ${BEAM_THIN_X} in X).`);