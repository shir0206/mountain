# Stonecrop Planter GLB Rebuild — Design Spec

## Goal

Rebuild `public/models/stringy_stonecrop.glb` in-place via a Python script so it matches a wall-mounted rectangular planter box with directional stem rules.

---

## Model Coordinate System

| Axis | Role in model |
|------|---------------|
| X    | Vertical (height). Vase sits X=0.317–0.397. Stems grow to X≈0.58. |
| Y    | Horizontal wide axis. Original vase spans Y ≈ ±0.048. |
| Z    | Horizontal narrow axis. Original vase spans Z ≈ ±0.047. |

Three.js applies a Y-up correction on load, so X-vertical in the GLB becomes Y-up in the rendered scene.

---

## Change 1: Remove rope

- Delete node `Herb.003_rope_0` (node index 4) from its parent's `children` list.
- Delete mesh 0 (`Herb.003_rope_0`) and its bufferView / accessor data.
- Delete material 0 (`rope`).

---

## Change 2: Replace vase with rectangular planter box

Replace the vertex data of mesh 1 (`Herb.003_Vase_0`) with a procedurally generated box.

**Dimensions:**
- Wide axis (Y): ±0.18 → total width 0.36
- Narrow axis (Z): ±0.06 → total depth 0.12 (aspect ratio 3:1)
- Height (X): X=0.317 (bottom) to X=0.397 (rim) — same as original vase height

**Geometry:**
- 6 faces, each as 2 triangles (12 triangles total, 24 unique vertices for flat normals)
- Hard normals per face (no smoothing)
- UV: simple planar per-face unwrap
- Material: reuse existing `Vase` material (index 1 after rope removal)

---

## Change 3: Stem and leaf face culling by zone

Three stem/leaf meshes (mesh indices 2, 3, 4 — `Herb.003_stem_0`, `Herb.003_Herb_Leaf_0` ×2).

For each mesh, iterate triangles. For each triangle compute its centroid `(cx, cy, cz)`.

**Zone rules (applied per triangle centroid):**

| Zone | Condition | Action |
|------|-----------|--------|
| Wall face | `cz < -0.04` (near -Z edge of box) | Delete triangle entirely |
| Narrow sides | `abs(cy) > 0.12` (beyond ±60% of half-width) | Scale X coordinate down: `x_new = box_rim + (x - box_rim) * 0.55` — keeps stem but clips height to ~55% above rim |
| Front / center | everything else | No change |

`box_rim = 0.397`

**Why -Z is the wall side:** After setting `STONECROP_ANGLE` in the scene config, the -Z face of the model will point toward the wall. No stems on that face.

---

## Change 4: Update scene config

In `src/presentation/Scene/config/positions.ts`, set:

```ts
export const STONECROP_ANGLE = Math.PI / 2;
```

This rotates the planter so its -Z face points toward the scene wall (adjust sign/value after visual check).

---

## Implementation

Single Python script: `scripts/rebuild_stonecrop.py`

Steps:
1. Load GLB with `pygltflib`
2. Remove rope node, mesh, material
3. Regenerate vase mesh vertices/indices/normals/UVs as a box
4. For each stem/leaf mesh: read POSITION accessor, read INDEX accessor, cull/scale triangles by zone rules, write back
5. Save as `public/models/stringy_stonecrop.glb` (overwrites original; original backed up as `stringy_stonecrop.glb.bak`)

---

## Open questions / post-merge checks

- Visual check: confirm -Z correctly faces the wall after `STONECROP_ANGLE` change
- If stem cut edges look harsh, increase the wall-zone threshold (e.g., `cz < -0.035`) to cut further inward
- Box taper (narrower at top) can be added as a follow-up if needed
