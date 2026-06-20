import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Load monospace font
const fontPath = path.join(
  ROOT,
  "node_modules/three/examples/fonts/droid/droid_sans_mono_regular.typeface.json"
);
const fontData = JSON.parse(fs.readFileSync(fontPath, "utf-8"));
const loader = new FontLoader();
const font = loader.parse(fontData);

const lines = ["Welcome!", "- Shir Zabolotny"];
const fontSize = 0.15;
const lineHeight = fontSize * 1.6;

// Build geometries
const meshes = lines.map((text, i) => {
  const geometry = new TextGeometry(text, {
    font,
    size: fontSize,
    depth: 0.02,
    curveSegments: 4,
    bevelEnabled: false,
  });
  geometry.computeBoundingBox();
  // Offset each line down
  geometry.translate(0, -i * lineHeight, 0);
  return geometry;
});

// Merge into single geometry
const merged = new THREE.BufferGeometry();
const positions = [];
const normals = [];
const indices = [];
let indexOffset = 0;

for (const geom of meshes) {
  const pos = geom.getAttribute("position");
  const norm = geom.getAttribute("normal");
  const idx = geom.getIndex();

  for (let i = 0; i < pos.count; i++) {
    positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
    normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
  }
  if (idx) {
    for (let i = 0; i < idx.count; i++) {
      indices.push(idx.array[i] + indexOffset);
    }
  } else {
    // Non-indexed: generate sequential indices
    for (let i = 0; i < pos.count; i++) {
      indices.push(i + indexOffset);
    }
  }
  indexOffset += pos.count;
}

// Center the geometry
const posArr = new Float32Array(positions);
let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
for (let i = 0; i < posArr.length; i += 3) {
  minX = Math.min(minX, posArr[i]);
  minY = Math.min(minY, posArr[i + 1]);
  minZ = Math.min(minZ, posArr[i + 2]);
  maxX = Math.max(maxX, posArr[i]);
  maxY = Math.max(maxY, posArr[i + 1]);
  maxZ = Math.max(maxZ, posArr[i + 2]);
}
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const cz = (minZ + maxZ) / 2;
for (let i = 0; i < posArr.length; i += 3) {
  posArr[i] -= cx;
  posArr[i + 1] -= cy;
  posArr[i + 2] -= cz;
}
// Rotate -90° around X-axis to lay flat (XY plane → XZ plane)
for (let i = 0; i < posArr.length; i += 3) {
  const y = posArr[i + 1];
  const z = posArr[i + 2];
  posArr[i + 1] = -z;
  posArr[i + 2] = y;
}

// Recompute bounds after rotation
minX = Infinity; minY = Infinity; minZ = Infinity;
maxX = -Infinity; maxY = -Infinity; maxZ = -Infinity;
for (let i = 0; i < posArr.length; i += 3) {
  minX = Math.min(minX, posArr[i]);
  minY = Math.min(minY, posArr[i + 1]);
  minZ = Math.min(minZ, posArr[i + 2]);
  maxX = Math.max(maxX, posArr[i]);
  maxY = Math.max(maxY, posArr[i + 1]);
  maxZ = Math.max(maxZ, posArr[i + 2]);
}

// Rotate normals the same way
const normArr = new Float32Array(normals);
for (let i = 0; i < normArr.length; i += 3) {
  const y = normArr[i + 1];
  const z = normArr[i + 2];
  normArr[i + 1] = -z;
  normArr[i + 2] = y;
}
const idxArr = indices.every(i => i < 65536) ? new Uint16Array(indices) : new Uint32Array(indices);
const useUint32 = !(indices.every(i => i < 65536));

// Build GLB manually
function buildGLB(positionData, normalData, indexData, isUint32) {
  const posBytes = Buffer.from(positionData.buffer);
  const normBytes = Buffer.from(normalData.buffer);
  const idxBytes = Buffer.from(indexData.buffer);

  // Pad index buffer to 4-byte boundary
  const idxPadding = (4 - (idxBytes.length % 4)) % 4;
  const idxBytesPadded = idxPadding > 0
    ? Buffer.concat([idxBytes, Buffer.alloc(idxPadding)])
    : idxBytes;

  const binBuffer = Buffer.concat([posBytes, normBytes, idxBytesPadded]);

  const vertexCount = positionData.length / 3;
  const indexCount = indexData.length;

  const json = {
    asset: { version: "2.0", generator: "mountain-text-gen" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{
      primitives: [{
        attributes: { POSITION: 0, NORMAL: 1 },
        indices: 2,
        material: 0,
      }]
    }],
    materials: [{
      pbrMetallicRoughness: {
        baseColorFactor: [1, 1, 1, 1],
        metallicFactor: 0,
        roughnessFactor: 0.4,
      },
      emissiveFactor: [0.3, 0.3, 0.3],
    }],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126, // FLOAT
        count: vertexCount,
        type: "VEC3",
        max: [maxX, maxY, maxZ],
        min: [minX, minY, minZ],
      },
      {
        bufferView: 1,
        componentType: 5126,
        count: vertexCount,
        type: "VEC3",
      },
      {
        bufferView: 2,
        componentType: isUint32 ? 5125 : 5123, // UNSIGNED_INT or UNSIGNED_SHORT
        count: indexCount,
        type: "SCALAR",
      },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: posBytes.length, target: 34962 },
      { buffer: 0, byteOffset: posBytes.length, byteLength: normBytes.length, target: 34962 },
      { buffer: 0, byteOffset: posBytes.length + normBytes.length, byteLength: idxBytes.length, target: 34963 },
    ],
    buffers: [{ byteLength: binBuffer.length }],
  };

  const jsonStr = JSON.stringify(json);
  // Pad JSON to 4-byte alignment
  const jsonPadding = (4 - (jsonStr.length % 4)) % 4;
  const jsonPadded = jsonStr + " ".repeat(jsonPadding);
  const jsonBuf = Buffer.from(jsonPadded, "utf-8");

  // GLB header: magic(4) + version(4) + length(4) = 12
  // JSON chunk: length(4) + type(4) + data
  // BIN chunk:  length(4) + type(4) + data
  const totalLength = 12 + 8 + jsonBuf.length + 8 + binBuffer.length;

  const glb = Buffer.alloc(totalLength);
  let offset = 0;

  // Header
  glb.writeUInt32LE(0x46546C67, offset); offset += 4; // 'glTF'
  glb.writeUInt32LE(2, offset); offset += 4; // version
  glb.writeUInt32LE(totalLength, offset); offset += 4;

  // JSON chunk
  glb.writeUInt32LE(jsonBuf.length, offset); offset += 4;
  glb.writeUInt32LE(0x4E4F534A, offset); offset += 4; // 'JSON'
  jsonBuf.copy(glb, offset); offset += jsonBuf.length;

  // BIN chunk
  glb.writeUInt32LE(binBuffer.length, offset); offset += 4;
  glb.writeUInt32LE(0x004E4942, offset); offset += 4; // 'BIN\0'
  binBuffer.copy(glb, offset);

  return glb;
}

const glb = buildGLB(posArr, normArr, idxArr, useUint32);
const outPath = path.join(ROOT, "public/models_optimized/welcome_text.glb");
fs.writeFileSync(outPath, glb);
console.log(`✓ Written ${outPath} (${glb.byteLength} bytes)`);
