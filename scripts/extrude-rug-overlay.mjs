/**
 * Extrude rug_round_maple_overlay.glb so it has unit height (Y: 0→1).
 * This allows Y-axis scaling to control visible thickness.
 *
 * Strategy: read existing flat disc, duplicate vertices for top (Y=1) and
 * bottom (Y=0) faces, add side quads around the perimeter.
 *
 * Usage: node scripts/extrude-rug-overlay.mjs
 */

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.resolve(
  __dirname,
  "../public/models/rug_round_maple_overlay.glb"
);

async function main() {
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
      "draco3d.encoder": await draco3d.createEncoderModule(),
    });

  const doc = await io.read(TARGET);
  const root = doc.getRoot();

  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const posAccessor = prim.getAttribute("POSITION");
      const normAccessor = prim.getAttribute("NORMAL");
      const uvAccessor = prim.getAttribute("TEXCOORD_0");
      const idxAccessor = prim.getIndices();

      if (!posAccessor || !idxAccessor) continue;

      const oldPos = posAccessor.getArray();
      const oldNorm = normAccessor ? normAccessor.getArray() : null;
      const oldUv = uvAccessor ? uvAccessor.getArray() : null;
      const oldIdx = idxAccessor.getArray();

      const vertCount = oldPos.length / 3;
      const triCount = oldIdx.length / 3;

      // Find boundary edges (edges that belong to only one triangle)
      const edgeMap = new Map(); // "min-max" -> [v0, v1, count]
      for (let t = 0; t < triCount; t++) {
        const i0 = oldIdx[t * 3];
        const i1 = oldIdx[t * 3 + 1];
        const i2 = oldIdx[t * 3 + 2];
        const edges = [
          [i0, i1],
          [i1, i2],
          [i2, i0],
        ];
        for (const [a, b] of edges) {
          const key = Math.min(a, b) + "-" + Math.max(a, b);
          if (edgeMap.has(key)) {
            edgeMap.get(key).count++;
          } else {
            edgeMap.set(key, { a, b, count: 1 });
          }
        }
      }

      const boundaryEdges = [];
      for (const edge of edgeMap.values()) {
        if (edge.count === 1) {
          boundaryEdges.push([edge.a, edge.b]);
        }
      }

      // New geometry layout:
      // - Top face vertices (copy of original, Y += 1.0) indices: 0..vertCount-1
      // - Bottom face vertices (copy of original, Y = 0) indices: vertCount..2*vertCount-1
      // - Side vertices: 2 per boundary edge endpoint (top + bottom) for sharp normals

      // Build top + bottom positions, normals, uvs
      const positions = [];
      const normals = [];
      const uvs = [];
      const indices = [];

      // Top face (Y = 1.0, normal up)
      for (let i = 0; i < vertCount; i++) {
        positions.push(oldPos[i * 3], 1.0, oldPos[i * 3 + 2]);
        normals.push(0, 1, 0);
        if (oldUv) {
          uvs.push(oldUv[i * 2], oldUv[i * 2 + 1]);
        }
      }

      // Bottom face (Y = 0.0, normal down)
      for (let i = 0; i < vertCount; i++) {
        positions.push(oldPos[i * 3], 0.0, oldPos[i * 3 + 2]);
        normals.push(0, -1, 0);
        if (oldUv) {
          uvs.push(oldUv[i * 2], oldUv[i * 2 + 1]);
        }
      }

      // Top face indices (same winding as original)
      for (let t = 0; t < triCount; t++) {
        indices.push(oldIdx[t * 3], oldIdx[t * 3 + 1], oldIdx[t * 3 + 2]);
      }

      // Bottom face indices (reversed winding)
      for (let t = 0; t < triCount; t++) {
        indices.push(
          vertCount + oldIdx[t * 3],
          vertCount + oldIdx[t * 3 + 2],
          vertCount + oldIdx[t * 3 + 1]
        );
      }

      // Side faces: for each boundary edge, create a quad (2 triangles)
      const sideBaseIdx = positions.length / 3;
      let sideVertIdx = 0;

      for (const [a, b] of boundaryEdges) {
        // Top-a, Top-b, Bottom-a, Bottom-b
        const ax = oldPos[a * 3],
          az = oldPos[a * 3 + 2];
        const bx = oldPos[b * 3],
          bz = oldPos[b * 3 + 2];

        // Outward normal (perpendicular to edge in XZ plane, pointing out)
        const edgeX = bx - ax;
        const edgeZ = bz - az;
        const len = Math.sqrt(edgeX * edgeX + edgeZ * edgeZ) || 1;
        const nx = edgeZ / len;
        const nz = -edgeX / len;

        // 4 vertices for this side quad
        const topA = sideBaseIdx + sideVertIdx++;
        const topB = sideBaseIdx + sideVertIdx++;
        const botA = sideBaseIdx + sideVertIdx++;
        const botB = sideBaseIdx + sideVertIdx++;

        positions.push(ax, 1.0, az); // topA
        positions.push(bx, 1.0, bz); // topB
        positions.push(ax, 0.0, az); // botA
        positions.push(bx, 0.0, bz); // botB

        normals.push(nx, 0, nz);
        normals.push(nx, 0, nz);
        normals.push(nx, 0, nz);
        normals.push(nx, 0, nz);

        if (oldUv) {
          uvs.push(0, 1);
          uvs.push(1, 1);
          uvs.push(0, 0);
          uvs.push(1, 0);
        }

        // Two triangles (CCW from outside)
        indices.push(topA, botA, topB);
        indices.push(topB, botA, botB);
      }

      // Write new accessors
      const buf =
        posAccessor.getBuffer() || doc.createBuffer();

      const newPosArr = new Float32Array(positions);
      const newNormArr = new Float32Array(normals);
      const newIdxArr =
        positions.length / 3 > 65535
          ? new Uint32Array(indices)
          : new Uint16Array(indices);

      posAccessor.setArray(newPosArr);
      if (normAccessor) normAccessor.setArray(newNormArr);
      if (uvAccessor && uvs.length > 0) {
        uvAccessor.setArray(new Float32Array(uvs));
      }
      idxAccessor.setArray(newIdxArr);
    }
  }

  await io.write(TARGET, doc);
  console.log(`✅ Extruded rug written to ${TARGET}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});