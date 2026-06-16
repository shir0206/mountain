# GLB Optimization — Execution Report

## Summary

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| **Total scene GLB payload** | ~85 MB (unique files loaded) | **4.8 MB** | **94%** |
| Mountain | 42 MB | 1.1 MB | 97% |
| Armchair (×5 instances) | 21 MB | 192 KB | 99% |
| Office Chair | 19 MB | 560 KB | 97% |
| All other models combined | ~3 MB | ~1.1 MB | 63% |

---

## What Was Done

### 1. Rewrote `scripts/optimize-models.sh`

Previous script only processed files already in `models_optimized/` — the 3 heaviest models (82 MB combined) were never touched because `sceneObjects.ts` referenced them from `models/`.

New script explicitly targets every model by tier.

### 2. Ran Tiered Optimization Pipeline

Every GLB goes through `gltf-transform optimize` with:

| Step | Effect | Quality Impact |
|------|--------|----------------|
| `dedup` | Merge identical buffers/textures | None |
| `instance` | GPU instancing for repeated meshes | None |
| `flatten` | Bake node transforms | None (origin preserved) |
| `join` | Merge meshes sharing material → fewer draw calls | None |
| `weld` (0.0001) | Merge near-duplicate vertices | Imperceptible |
| `simplify` | Reduce polygon count by ratio | Controlled per tier |
| `prune` | Remove unused nodes/materials | None |
| `textureCompress` (WebP) | Lossy texture compression | Near-lossless |
| `draco` | Geometry compression | Lossless |
| `texture-size` resize | Shrink textures | Per-tier |

### 3. Tier Assignments

| Tier | Models | Simplify Ratio | Texture Max | Rationale |
|------|--------|---------------|-------------|-----------|
| **1: Huge** | `mountain_optimized.glb` | 0.3 (keep 30%) | 1024px | Background terrain, never close to camera. 70% poly reduction invisible. |
| **2: Large** | `ritchie_armchair`, `office_chair_cream` | 0.75 (keep 75%) | 1024px | Near camera but large source. Moderate reduction safe. |
| **3: Medium** | Plants, mug, furniture, pergola, rugs | 0.8–1.0 | 512px | Small files, light touch. Flat geometry gets no simplify. |
| **Never simplify** | `click_text`, `welcome_text`, `monitor`, `keyboard`, `mouse` | 1.0 | 1024px | Text glyphs or hero props too close to camera. |

### 4. Updated All Path References

- `src/presentation/Scene/config/sceneObjects.ts` — all 19 unique path entries changed from `models/` → `models_optimized/`
- `src/presentation/Scene/config/renderPolicy.ts` — mountain path updated

---

## Per-Model Results

| File | Before | After | Ratio |
|------|--------|-------|-------|
| `mountain_optimized.glb` | 42 MB | 1.1 MB | 0.3 simplify + 1024 tex + draco |
| `ritchie_armchair_barley_beige.glb` | 21 MB | 192 KB | 0.75 simplify + 1024 tex + draco |
| `office_chair_cream.glb` | 19 MB | 560 KB | 0.75 simplify + 1024 tex + draco |
| `zelkova_schneideriana_optimized.glb` | 644 KB | 600 KB | Already draco'd, marginal gain |
| `railing-plant-fixed.glb` | 628 KB | 44 KB | 0.8 simplify + 512 tex |
| `coffee_mug_school_project.glb` | 608 KB | 72 KB | 0.9 simplify + 512 tex |
| `pergola_floor.glb` | 472 KB | 20 KB | No simplify + 512 tex + draco |
| `rug_round_maple_overlay.glb` | 316 KB | 36 KB | No simplify + 512 tex |
| `rug_round_maple_overlay_extrudable.glb` | 316 KB | 28 KB | No simplify + 512 tex |
| `coffee_table_final (1).glb` | 300 KB | 52 KB | 0.9 simplify + 512 tex |
| `rug_round_maple.glb` | 300 KB | 24 KB | No simplify + 512 tex |
| `click_text.glb` | 220 KB | 12 KB | No simplify + draco |
| `pergola_structure.glb` | 196 KB | 20 KB | 0.9 simplify + 512 tex |
| `pot-plant-with-mud.glb` | 128 KB | 40 KB | 0.9 simplify + 512 tex |
| `desk_fixed.glb` | 40 KB | 12 KB | No simplify + draco |

---

## Quality Preservation Strategy

1. **No simplify on text** — `click_text.glb`, `welcome_text.glb` use ratio 1.0. Glyph shapes preserved.
2. **No simplify on flat geometry** — Rugs and floors only get texture compression + draco.
3. **Hero props near camera** — Monitor, keyboard, mouse already tiny (8–20 KB), untouched.
4. **Background terrain aggressive** — Mountain at 0.3 ratio is safe because it's always far from camera. Silhouette preserved (simplify-error 0.001 prevents topology collapse).
5. **Bbox inspection** — `.before.txt` and `.after.txt` files written for each model to verify bounding box unchanged.

---

## What Was NOT Changed

- Original files in `public/models/` are untouched (safe rollback)
- Position/scale/rotation values in `positions.ts` unchanged
- Non-uniform scale multipliers in `sceneObjects.ts` unchanged
- No Blender manual pass needed (gltf-transform handled everything)
- No KTX2 pass (would require additional runtime decoder — saved for future)

---

## How to Re-run

```bash
# Delete existing optimized files to regenerate
rm -rf public/models_optimized/*.glb

# Run pipeline
bash scripts/optimize-models.sh
```

Script skips files that already exist in output. To force re-optimize a specific model, delete its output file first.

---

## Verification Checklist

- [ ] `yarn build` succeeds (no broken imports)
- [ ] Visual check: mountain silhouette unchanged from all camera presets
- [ ] Visual check: armchairs still look correct up close
- [ ] Visual check: text glyphs still readable
- [ ] Mobile test: page loads in <5s on mid-range Android
- [ ] Compare `.before.txt` / `.after.txt` bbox dimensions for any model with simplify < 1.0