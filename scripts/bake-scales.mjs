#!/usr/bin/env node
/**
 * Bake extreme scales into GLB vertex data.
 * Reads from models_optimized/, writes to models_optimized_baked/.
 * After running, update positions.ts constants to match NEW_SCALE.
 *
 * Usage: node scripts/bake-scales.mjs
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";

// ── Models to bake: { filename: bakeFactor } ──
// bakeFactor = 1 / currentBaseScale (so new base scale becomes ~1)
const BAKE_TARGETS = {
  // 🔴 Extreme
  "green_creeper_plant.glb": 14285,
  "pillow_test.glb": 1428,
  "mac_keyboard.glb": 142,

  // 🟡 Medium
  "mug.glb": 50,
  "pergola.glb": 20,
  "jenson_extending_dining_table_solid_oak.glb": 66,
  "harvey_swivel_chair_mineral_blue.glb": 66,
  "edelweiss_bar_table_ash_and_white.glb": 100,
  "set_of_2_edelweiss_bar_chairs_white.glb": 100,
  "mud_material.glb": 100,
  "edelweiss_round_table_ash_and_white.glb": 100,
  "irvin_floor_lamp_natural_wood_and_white.glb": 100,
  "Untitled.glb": 83,
  "dylan_2_seater_sofa_mineral_blue.glb": 100,
  "jenson_sideboard_solid_oak.glb": 100,
  "bush_square.glb": 10,
  "unhyun__straw_mat_a.glb": 7,
};

const SRC = "public/models_optimized";
const OUT = "public/models_optimized_baked";

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
  });

import { mkdir } from "node:fs/promises";
await mkdir(OUT, { recursive: true });

for (const [filename, factor] of Object.entries(BAKE_TARGETS)) {
  const inPath = `${SRC}/${filename}`;
  const outPath = `${OUT}/${filename}`;

  console.log(`Baking ${filename} ×${factor}...`);
  const doc = await io.read(inPath);

  // Scale all mesh primitive positions
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const posAccessor = prim.getAttribute("POSITION");
      if (!posAccessor) continue;

      const positions = posAccessor.getArray();
      for (let i = 0; i < positions.length; i++) {
        positions[i] *= factor;
      }
      posAccessor.setArray(positions);
    }
  }

  // Scale node translations too (child nodes offset from root)
  for (const node of doc.getRoot().listNodes()) {
    const t = node.getTranslation();
    node.setTranslation([t[0] * factor, t[1] * factor, t[2] * factor]);
  }

  await io.write(outPath, doc);
  console.log(`  → ${outPath}`);
}

console.log("\nDone. Now update positions.ts constants:");
for (const [filename, factor] of Object.entries(BAKE_TARGETS)) {
  console.log(`  ${filename}: old_scale × ${factor} baked → set constant to 1`);
}
