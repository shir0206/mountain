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

const fontSize = 0.15;
const lineHeight = fontSize * 1.5;

// Text segments: each has text, line index, x-offset, and material index
// Line 0: "> click to"
// Line 1: "  open website" (aligned below "click to")
const segments = [
  { text: ">", line: 0, xOffset: 0, material: 0 },           // green
  { text: " click to", line: 0, xOffset: null, material: 1 }, // white (follows previous)
  { text: "open website", line: 1, xOffset: null, material: 2 }, // gold (aligned below "click to")
];

// Letter spacing factor (extra space between characters)
const letterSpacing = 0.04;

// Measure character width for monospace positioning
const measureGeom = new TextGeometry(">", { font, size: fontSize, depth: 0.01, curveSegments: 4, bevelEnabled: false });
measureGeom.computeBoundingBox();
const charWidth = measureGeom.boundingBox.max.x - measureGeom.boundingBox.min.x;
// For monospace, each char is roughly the same width. We'll use actual geometry placement.

// Build geometry for each segment with letter spacing
function buildSegmentGeometry(text, line, xOffset) {
  // Build each character separately and space them out
  const charGeometries = [];
  let cursorX = xOffset;

  for (let c = 0; c < text.length; c++) {
    const ch = text[c];
    if (ch === " ") {
      // Advance cursor by space width + letter spacing
      cursorX += spaceWidth + letterSpacing;
      continue;
    }
    const charGeom = new TextGeometry(ch, {
      font,
      size: fontSize,
      depth: 0.02,
      curveSegments: 4,
      bevelEnabled: false,
    });
    charGeom.computeBoundingBox();
    const charW = charGeom.boundingBox.max.x - charGeom.boundingBox.min.x;
    charGeom.translate(cursorX, -line * lineHeight, 0);
    charGeometries.push(charGeom);
    cursorX += charW + letterSpacing;
  }

  // Merge all character geometries
  const merged = new THREE.BufferGeometry();
  const positions = [];
  const normals = [];
  const indices = [];
  let indexOffset = 0;

  for (const geom of charGeometries) {
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
      for (let i = 0; i < pos.count; i++) {
        indices.push(i + indexOffset);
      }
    }
    indexOffset += pos.count;
  }

  merged.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
  merged.setIndex(indices);
  merged.computeBoundingBox();
  return merged;
}

// Measure space width for the font
const spaceGeom = new TextGeometry("I", { font, size: fontSize, depth: 0.01, curveSegments: 4, bevelEnabled: false });
spaceGeom.computeBoundingBox();
const spaceWidth = spaceGeom.boundingBox.max.x - spaceGeom.boundingBox.min.x;

// Calculate text width with letter spacing
function getTextWidthWithSpacing(text) {
  if (text.length === 0) return 0;
  let width = 0;
  for (let c = 0; c < text.length; c++) {
    const ch = text[c];
    if (ch === " ") {
      width += spaceWidth + letterSpacing;
    } else {
      const g = new TextGeometry(ch, { font, size: fontSize, depth: 0.01, curveSegments: 4, bevelEnabled: false });
      g.computeBoundingBox();
      width += (g.boundingBox.max.x - g.boundingBox.min.x) + letterSpacing;
    }
  }
  return width;
}

// Compute offsets - "open website" aligns below "click to"
// First compute "> " width for line 0 offset
let line0Text = "";
for (const seg of segments) {
  if (seg.line === 0) {
    if (seg.xOffset === null) {
      seg.xOffset = getTextWidthWithSpacing(line0Text);
    }
    line0Text += seg.text;
  }
}
// "open website" starts at same x as "click to" (which is after "> ")
const clickToOffset = getTextWidthWithSpacing("> ");
for (const seg of segments) {
  if (seg.line === 1 && seg.xOffset === null) {
    seg.xOffset = clickToOffset;
  }
}

// Extract geometry data per segment
const segmentData = segments.map(seg => {
  const geom = buildSegmentGeometry(seg.text, seg.line, seg.xOffset);
  const pos = geom.getAttribute("position");
  const norm = geom.getAttribute("normal");
  const idx = geom.getIndex();

  const positions = [];
  const normals = [];
  const indices = [];

  for (let i = 0; i < pos.count; i++) {
    positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
    normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
  }
  if (idx) {
    for (let i = 0; i < idx.count; i++) {
      indices.push(idx.array[i]);
    }
  } else {
    for (let i = 0; i < pos.count; i++) {
      indices.push(i);
    }
  }

  return { positions, normals, indices, vertexCount: pos.count, material: seg.material };
});

// Compute global bounds for centering
let allPositions = [];
for (const sd of segmentData) {
  allPositions.push(...sd.positions);
}
let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
for (let i = 0; i < allPositions.length; i += 3) {
  minX = Math.min(minX, allPositions[i]);
  minY = Math.min(minY, allPositions[i + 1]);
  minZ = Math.min(minZ, allPositions[i + 2]);
  maxX = Math.max(maxX, allPositions[i]);
  maxY = Math.max(maxY, allPositions[i + 1]);
  maxZ = Math.max(maxZ, allPositions[i + 2]);
}
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const cz = (minZ + maxZ) / 2;

// Center all segment positions
for (const sd of segmentData) {
  for (let i = 0; i < sd.positions.length; i += 3) {
    sd.positions[i] -= cx;
    sd.positions[i + 1] -= cy;
    sd.positions[i + 2] -= cz;
  }
}
minX -= cx; maxX -= cx;
minY -= cy; maxY -= cy;
minZ -= cz; maxZ -= cz;

// Build multi-primitive GLB
function buildMultiMaterialGLB(segments) {
  // Layout: for each segment, store pos + norm + idx sequentially
  const buffers = [];
  const bufferViews = [];
  const accessors = [];
  const primitives = [];
  let byteOffset = 0;
  let accessorIdx = 0;

  for (let s = 0; s < segments.length; s++) {
    const sd = segments[s];
    const posArr = new Float32Array(sd.positions);
    const normArr = new Float32Array(sd.normals);
    const useUint32 = sd.indices.some(i => i >= 65536);
    const idxArr = useUint32 ? new Uint32Array(sd.indices) : new Uint16Array(sd.indices);

    const posBytes = Buffer.from(posArr.buffer);
    const normBytes = Buffer.from(normArr.buffer);
    const idxBytes = Buffer.from(idxArr.buffer);

    // Pad idx to 4-byte boundary
    const idxPadding = (4 - (idxBytes.length % 4)) % 4;
    const idxBytesPadded = idxPadding > 0 ? Buffer.concat([idxBytes, Buffer.alloc(idxPadding)]) : idxBytes;

    // Compute per-segment bounds
    let sMinX = Infinity, sMinY = Infinity, sMinZ = Infinity;
    let sMaxX = -Infinity, sMaxY = -Infinity, sMaxZ = -Infinity;
    for (let i = 0; i < posArr.length; i += 3) {
      sMinX = Math.min(sMinX, posArr[i]);
      sMinY = Math.min(sMinY, posArr[i + 1]);
      sMinZ = Math.min(sMinZ, posArr[i + 2]);
      sMaxX = Math.max(sMaxX, posArr[i]);
      sMaxY = Math.max(sMaxY, posArr[i + 1]);
      sMaxZ = Math.max(sMaxZ, posArr[i + 2]);
    }

    // Position buffer view
    bufferViews.push({ buffer: 0, byteOffset, byteLength: posBytes.length, target: 34962 });
    const posViewIdx = bufferViews.length - 1;
    byteOffset += posBytes.length;

    // Normal buffer view
    bufferViews.push({ buffer: 0, byteOffset, byteLength: normBytes.length, target: 34962 });
    const normViewIdx = bufferViews.length - 1;
    byteOffset += normBytes.length;

    // Index buffer view
    bufferViews.push({ buffer: 0, byteOffset, byteLength: idxBytes.length, target: 34963 });
    const idxViewIdx = bufferViews.length - 1;
    byteOffset += idxBytesPadded.length; // advance by padded length

    // Position accessor
    accessors.push({
      bufferView: posViewIdx,
      componentType: 5126,
      count: sd.vertexCount,
      type: "VEC3",
      max: [sMaxX, sMaxY, sMaxZ],
      min: [sMinX, sMinY, sMinZ],
    });
    const posAccessor = accessorIdx++;

    // Normal accessor
    accessors.push({
      bufferView: normViewIdx,
      componentType: 5126,
      count: sd.vertexCount,
      type: "VEC3",
    });
    const normAccessor = accessorIdx++;

    // Index accessor
    accessors.push({
      bufferView: idxViewIdx,
      componentType: useUint32 ? 5125 : 5123,
      count: sd.indices.length,
      type: "SCALAR",
    });
    const idxAccessor = accessorIdx++;

    primitives.push({
      attributes: { POSITION: posAccessor, NORMAL: normAccessor },
      indices: idxAccessor,
      material: sd.material,
    });

    buffers.push(posBytes, normBytes, idxBytesPadded);
  }

  const binBuffer = Buffer.concat(buffers);

  // Materials: console-style colors on dark background
  const materials = [
    // 0: Shiny Green (console green)
    {
      pbrMetallicRoughness: {
        baseColorFactor: [0.0, 1.0, 0.0, 1.0],
        metallicFactor: 0.6,
        roughnessFactor: 0.2,
      },
      emissiveFactor: [0.0, 0.8, 0.0],
    },
    // 1: White (terminal white)
    {
      pbrMetallicRoughness: {
        baseColorFactor: [0.95, 0.95, 0.95, 1.0],
        metallicFactor: 0.0,
        roughnessFactor: 0.4,
      },
      emissiveFactor: [0.3, 0.3, 0.3],
    },
    // 2: Shiny Gold (deeper gold tone)
    {
      pbrMetallicRoughness: {
        baseColorFactor: [0.85, 0.65, 0.13, 1.0],
        metallicFactor: 0.9,
        roughnessFactor: 0.15,
      },
      emissiveFactor: [0.4, 0.3, 0.02],
    },
  ];

  const json = {
    asset: { version: "2.0", generator: "mountain-text-gen" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{ primitives }],
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: binBuffer.length }],
  };

  const jsonStr = JSON.stringify(json);
  const jsonPadding = (4 - (jsonStr.length % 4)) % 4;
  const jsonPadded = jsonStr + " ".repeat(jsonPadding);
  const jsonBuf = Buffer.from(jsonPadded, "utf-8");

  const totalLength = 12 + 8 + jsonBuf.length + 8 + binBuffer.length;
  const glb = Buffer.alloc(totalLength);
  let offset = 0;

  // Header
  glb.writeUInt32LE(0x46546C67, offset); offset += 4; // glTF
  glb.writeUInt32LE(2, offset); offset += 4;
  glb.writeUInt32LE(totalLength, offset); offset += 4;

  // JSON chunk
  glb.writeUInt32LE(jsonBuf.length, offset); offset += 4;
  glb.writeUInt32LE(0x4E4F534A, offset); offset += 4; // JSON
  jsonBuf.copy(glb, offset); offset += jsonBuf.length;

  // BIN chunk
  glb.writeUInt32LE(binBuffer.length, offset); offset += 4;
  glb.writeUInt32LE(0x004E4942, offset); offset += 4; // BIN\0
  binBuffer.copy(glb, offset);

  return glb;
}

const glb = buildMultiMaterialGLB(segmentData);
const outPath = path.join(ROOT, "public/models_optimized/click_text.glb");
fs.writeFileSync(outPath, glb);
console.log(`✓ Written ${outPath} (${glb.byteLength} bytes)`);