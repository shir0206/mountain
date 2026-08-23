import { NodeIO, Document } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
  });

// ── Step 1: Read source and extract the WALNUT material ──
const sourceDoc = await io.read(
  "public/models_optimized/edelweiss_round_table_ash_and_white.glb"
);
const sourceRoot = sourceDoc.getRoot();

let walnutMat = null;
for (const mat of sourceRoot.listMaterials()) {
  if (mat.getName() === "WALNUT") {
    walnutMat = mat;
    break;
  }
}
if (!walnutMat) throw new Error("Could not find WALNUT material in source");

const walnutTexture = walnutMat.getBaseColorTexture();
if (!walnutTexture) throw new Error("WALNUT material has no baseColor texture");

const walnutImage = walnutTexture.getImage();
const walnutMimeType = walnutTexture.getMimeType();
const walnutMetallic = walnutMat.getMetallicFactor();
const walnutRoughness = walnutMat.getRoughnessFactor();
const walnutBaseColor = walnutMat.getBaseColorFactor();

console.log(
  "Source WALNUT texture:",
  walnutMimeType,
  "size:",
  walnutImage?.byteLength,
  "bytes"
);
console.log(
  "  metallic:",
  walnutMetallic,
  "roughness:",
  walnutRoughness,
  "baseColor:",
  walnutBaseColor
);

// ── Step 2: Read table ──
const tableDoc = await io.read("public/models/Table_final (1).glb");
const tableRoot = tableDoc.getRoot();

// ── Step 3: Generate UVs and Normals for primitives missing them ──
for (const mesh of tableRoot.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const posAccessor = prim.getAttribute("POSITION");
    if (!posAccessor) continue;

    const count = posAccessor.getCount();
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push(posAccessor.getElement(i, [0, 0, 0]));
    }

    // Generate TEXCOORD_0 via box projection if missing
    if (!prim.getAttribute("TEXCOORD_0")) {
      // Find bounding box
      let minX = Infinity,
        minY = Infinity,
        minZ = Infinity;
      let maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity;
      for (const [x, y, z] of positions) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (z < minZ) minZ = z;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        if (z > maxZ) maxZ = z;
      }

      const rangeX = maxX - minX || 1;
      const rangeY = maxY - minY || 1;
      const rangeZ = maxZ - minZ || 1;

      // Use XZ plane projection (top-down) for a table surface
      const uvData = new Float32Array(count * 2);
      for (let i = 0; i < count; i++) {
        const [x, y, z] = positions[i];
        uvData[i * 2] = (x - minX) / rangeX;
        uvData[i * 2 + 1] = (z - minZ) / rangeZ;
      }

      const uvAccessor = tableDoc
        .createAccessor("texcoord_0")
        .setType("VEC2")
        .setArray(uvData);
      prim.setAttribute("TEXCOORD_0", uvAccessor);
      console.log(
        `  Generated TEXCOORD_0 for ${count} vertices (XZ box projection)`
      );
    }

    // Generate NORMAL if missing
    if (!prim.getAttribute("NORMAL")) {
      const indices = prim.getIndices();
      const normals = new Float32Array(count * 3); // init to zero

      if (indices) {
        const idxCount = indices.getCount();
        for (let i = 0; i < idxCount; i += 3) {
          const i0 = indices.getScalar(i);
          const i1 = indices.getScalar(i + 1);
          const i2 = indices.getScalar(i + 2);

          const p0 = positions[i0];
          const p1 = positions[i1];
          const p2 = positions[i2];

          // edge vectors
          const e1x = p1[0] - p0[0],
            e1y = p1[1] - p0[1],
            e1z = p1[2] - p0[2];
          const e2x = p2[0] - p0[0],
            e2y = p2[1] - p0[1],
            e2z = p2[2] - p0[2];

          // cross product
          const nx = e1y * e2z - e1z * e2y;
          const ny = e1z * e2x - e1x * e2z;
          const nz = e1x * e2y - e1y * e2x;

          // accumulate (smooth normals)
          for (const idx of [i0, i1, i2]) {
            normals[idx * 3] += nx;
            normals[idx * 3 + 1] += ny;
            normals[idx * 3 + 2] += nz;
          }
        }
      } else {
        // Non-indexed: compute per-triangle
        for (let i = 0; i < count; i += 3) {
          const p0 = positions[i];
          const p1 = positions[i + 1];
          const p2 = positions[i + 2];

          const e1x = p1[0] - p0[0],
            e1y = p1[1] - p0[1],
            e1z = p1[2] - p0[2];
          const e2x = p2[0] - p0[0],
            e2y = p2[1] - p0[1],
            e2z = p2[2] - p0[2];

          const nx = e1y * e2z - e1z * e2y;
          const ny = e1z * e2x - e1x * e2z;
          const nz = e1x * e2y - e1y * e2x;

          for (const idx of [i, i + 1, i + 2]) {
            normals[idx * 3] += nx;
            normals[idx * 3 + 1] += ny;
            normals[idx * 3 + 2] += nz;
          }
        }
      }

      // Normalize
      for (let i = 0; i < count; i++) {
        const x = normals[i * 3],
          y = normals[i * 3 + 1],
          z = normals[i * 3 + 2];
        const len = Math.sqrt(x * x + y * y + z * z) || 1;
        normals[i * 3] = x / len;
        normals[i * 3 + 1] = y / len;
        normals[i * 3 + 2] = z / len;
      }

      const normalAccessor = tableDoc
        .createAccessor("normal")
        .setType("VEC3")
        .setArray(normals);
      prim.setAttribute("NORMAL", normalAccessor);
      console.log(`  Generated NORMAL for ${count} vertices`);
    }
  }
}

// ── Step 4: Create walnut texture in table doc ──
const newTexture = tableDoc
  .createTexture("walnut_wood_texture")
  .setImage(walnutImage)
  .setMimeType(walnutMimeType);

// ── Step 5: Apply walnut material to all materials ──
let updated = 0;
for (const mat of tableRoot.listMaterials()) {
  mat.setBaseColorFactor(walnutBaseColor);
  mat.setMetallicFactor(walnutMetallic);
  mat.setRoughnessFactor(walnutRoughness);
  mat.setBaseColorTexture(newTexture);
  mat.setEmissiveFactor([0, 0, 0]);
  updated++;
  console.log(`Updated material: "${mat.getName()}"`);
}

await io.write("public/models/Table_final (1).glb", tableDoc);
console.log(
  `\nDone – ${updated} material(s) with WALNUT texture. UVs + normals generated.`
);
