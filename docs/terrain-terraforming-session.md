# Terrain Terraforming Session Summary

## Original Prompt

Place a pergola model naturally between the hills of a Dartmoor terrain mesh (GLB). The terrain should be surgically modified so the pergola sits flush in the landscape — as if the terrain was intentionally terraformed to accommodate it.

**Key requirements:**
- Find the best natural valley/saddle between hills for placement
- Create a flat buildable area under the pergola footprint
- Smoothly blend terrain edits into surrounding landscape (no sharp cuts)
- Preserve UVs, textures, materials
- Recompute normals after mesh edits
- Do not deform the pergola geometry
- Update the pergola world position constants in `positions.ts`

---

## What Was Asked of the AI

1. **Analyze both GLB models** — inspect terrain mesh structure (vertex counts, bounding boxes, tile layout) and pergola footprint dimensions
2. **Find the best valley** in the terrain using spatial analysis of vertex heights
3. **Modify the terrain GLB geometry** — flatten a zone under the pergola, blend into surroundings with smooth falloff, recompute normals
4. **Update `positions.ts`** with the new world-space pergola coordinates

---

## What the AI Did (Step by Step)

### Step 1 — Inspect models
Wrote and ran `scripts/inspect-terrain.mjs`:
- Read both GLBs via `@gltf-transform/core`
- Extracted terrain: 13 mesh tiles, ~840k total vertices, local bounds X[-237, 224] Z[-96, -23]
- Dumped all vertex positions to `scripts/terrain-vertices.json` for analysis
- Confirmed pergola footprint: ~14.78 × 5.5 world units at `PERGOLA_SCALE=0.05`

### Step 2 — Find best valley
Wrote and ran `scripts/find-best-placement.mjs`:
- Derived the local↔world coordinate transform from `MOUNTAIN_ANGLE = Math.PI * 1.5`:
  - `world_x = -lz × 0.2`, `world_z = lx × 0.2`, `world_y = ly × 0.2 − 10`
- Built a 1D height profile along the terrain's lX axis
- Scored positions by valley depth and hill enclosure on both sides
- **First attempt picked lX=107 (world_z=21.4)** — identified as a valley but was actually the base of Haytor Rocks

### Step 3 — First terraform attempt (failed)
Wrote and ran `scripts/terraform-terrain.mjs`:
- Computed `flatY = mean Y` of vertices near lX=107 → got `-30.076` local (world -16)
- Applied flat zone ±18 lX × ±40 lZ with smooth-step blend
- 217k vertices modified, terrain written, `positions.ts` updated

**Result: Pergola was floating** — the terrain surface at that location was actually at world_y = +25 (the Haytor Rocks), not -16. The mean was dragged down by thousands of underground LOD vertices from overlapping mesh tiles, giving a wildly incorrect surface estimate.

---

## Root Cause of the Bug

The terrain GLB contains **13 overlapping mesh tiles** (a common LOD/tile export pattern from Sketchfab). Each tile covers the full terrain extent with varying detail levels. This means at any given XZ location, there are vertices from multiple tiles — including underground geometry far below the visible surface.

Using the **mean Y** of all nearby vertices gave a heavily biased result: the mean was ~-30 local (world -16) while the actual visible rock surface peaked at local +228 (world +35).

---

## Fix

### Correct surface height method
Switched to **90th percentile (p90)** as the surface height estimator — this correctly captures the visible terrain surface while ignoring the underground bulk of overlapping tile geometry.

### Correct placement location
Scanned the full terrain with p90 analysis. Found **lX=165 (world_z=33.0)** — the grassy slope immediately to the right of Haytor Rocks:
- Surface p90: world_y = -5 (low grass)
- Surface max: world_y = -9.12 (small grass bump, no rock)
- Haytor Rocks rise steeply to the left → natural hill backdrop
- Right side slopes away → natural valley framing

### Correct flatY
Set `flatY = 4.4` local units (world_y = -9.12) = the **actual surface maximum** within the footprint. This means the terraform only lowers vertices that protrude above this level — it never raises the floor (no "digging a pit").

### Re-terraformed
- Inner flat zone: ±22 lX × ±40 lZ (covers full terrain Z width)
- Blend zone: ±60 lX with smooth-step falloff
- 15,781 vertices modified (only protruding bumps clipped)
- Normals recomputed from triangle face data

### positions.ts final values
```ts
export const PERGOLA_X = 11.925;          // world_x = -lzCenter × 0.2
export const PERGOLA_Y = PEAK_WORLD_Y + 0.834;  // = -9.12 world_y, matches flat terrain
export const PERGOLA_Z = 33.0;            // world_z = 165 × 0.2
```

---

## Key Lesson

Multi-tile terrain GLBs (Sketchfab exports) contain massive amounts of underground geometry from overlapping LOD tiles. **Never use mean Y as a surface estimate.** Use a high percentile (p90+) or the spatial maximum to find the true visible surface.
