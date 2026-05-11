# GLB Optimization — Heavy Scene Pipeline

> Most GLBs from designers are catastrophically unoptimized.
> This project ships **~167 MB** of GLBs. Mountain alone is **59 MB** after "optimize".

---

## Current State (Broken)

`scripts/optimize-models.sh` issues:

1. **`--texture-size 4096`** — way too large. Mobile chokes on 4K textures.
2. **`--simplify false`** — no geometry reduction at all.
3. **Grep path broken** — reads `src/components/World.tsx` which no longer exists. Should be `src/presentation/Scene/config/sceneObjects.ts`.
4. **No KTX2 pass** — WebP only. Missing huge mobile VRAM savings.
5. **No per-model tiers** — mountain (59 MB background) gets same treatment as a mug (216 KB hero prop).

---

## Essential Pipeline

Every GLB must go through:

| Step             | Tool                           | What It Does                                          |
| ---------------- | ------------------------------ | ----------------------------------------------------- |
| Prune            | `gltf-transform prune`         | Remove unused nodes, materials, accessors             |
| Dedup            | `gltf-transform dedup`         | Merge identical buffers/textures                      |
| Weld             | `gltf-transform weld`          | Merge duplicate vertices within tolerance             |
| Instance         | `gltf-transform instance`      | Convert repeated meshes to GPU instances              |
| Flatten          | `gltf-transform flatten`       | Bake node transforms into mesh data                   |
| Join             | `gltf-transform join`          | Merge meshes sharing same material → fewer draw calls |
| Simplify         | `gltf-transform simplify`      | Reduce polygon count (ratio-controlled)               |
| Draco            | `gltf-transform draco`         | Lossless geometry compression                         |
| Texture Resize   | `gltf-transform resize`        | Shrink textures to target resolution                  |
| Texture Compress | `gltf-transform webp` / `ktx2` | GPU-friendly texture encoding                         |

---

## Tier System — Per-Model Strategy

### 🔴 Tier 1: Huge (>5 MB)

| File                        | Current Size | Action                                                    |
| --------------------------- | ------------ | --------------------------------------------------------- |
| `weisse_wand_mountain_peek` | 59 MB        | Blender decimate to 30%, simplify 0.4, texture 1024, KTX2 |
| `wisteria_sinensis005`      | 5.1 MB       | simplify 0.5, texture 1024, KTX2                          |

Mountain is background geometry. Viewer never sees fine detail. Aggressive reduction safe.

### 🟡 Tier 2: Medium (1–5 MB)

| File                               | Current Size | Action                      |
| ---------------------------------- | ------------ | --------------------------- |
| `dwarf_snowflake_mock_orange`      | 2.3 MB       | simplify 0.7, texture 1024  |
| `realistic_hd_large-leaved_lupine` | 2.2 MB       | simplify 0.7, texture 1024  |
| `fruit_basket`                     | 2.0 MB       | simplify 0.75, texture 1024 |
| `green_creeper_plant`              | 1.2 MB       | simplify 0.75, texture 1024 |

Plants and foliage. Mid-distance. Keep silhouette, reduce interior polygons.

### 🟢 Tier 3: Small (<1 MB)

Everything else. Apply:

- Draco compression
- Weld + dedup
- Texture resize to 1024
- No simplify (or 0.9 if > 500 KB)

### 🛑 Never Simplify

- `welcome_text.glb` — readable text, simplify destroys glyphs
- `monitor.glb`, `imac_magic_mouse.glb`, `mac_keyboard.glb` — hero props near camera

---

## Optimization Priority Order

```
PRIORITY 1 — Critical (70%+ file size reduction)
│
├─ Fix optimize-models.sh
│  ├─ Change --texture-size 4096 → 1024
│  ├─ Enable --simplify with per-tier ratios
│  ├─ Fix broken grep path → sceneObjects.ts
│  └─ Add --instance true for repeated meshes
│
├─ Add KTX2 compression pass
│
└─ Expected result: ~167 MB → ~25-30 MB

PRIORITY 2 — High (mountain-specific 90% reduction)
│
├─ Mountain dedicated pass
│  ├─ Blender decimate to 30% OR aggressive simplify-ratio 0.2
│  └─ KTX2 textures
│
└─ Expected result: 59 MB → 3-5 MB

PRIORITY 3 — Medium (draw call reduction)
│
├─ Mesh merging via --join + --instance
├─ Material count audit per GLB
│
└─ Expected result: fewer draw calls, less GPU state switching

PRIORITY 4 — Low (code cleanup, marginal perf gain)
│
├─ Scale baking (automated via scripts/bake-scales.mjs)
│  ├─ Audit current scales
│  ├─ Bake oversized GLBs to sane coordinate space
│  └─ Update positions.ts constants
│
└─ Expected result: correct frustum culling, cleaner code
```

**Do Priorities 1-2 first. Ship. Test. Then 3-4.**

---

## Proportion / Position Preservation

### Why positions stay safe

`sceneObjects.ts` applies `position`, `scale`, `rotationY` **externally** via `<Model>` component props. GLB internal geometry is relative to its own origin.

These operations **DO NOT** move geometry:

- ✅ Draco (lossless compression)
- ✅ WebP / KTX2 (texture only)
- ✅ Prune / dedup (removes unused data)
- ✅ Weld (merges microscopic duplicate vertices)
- ✅ Texture resize (pixels only)
- ✅ Instance (same world positions)

These operations **CAN** shift appearance:

- ⚠️ `simplify` — can change silhouette if ratio too aggressive
- ⚠️ `flatten` — bakes node transforms. Origin preserved but hierarchy lost.
- ⚠️ `join` — merges meshes. Loses per-mesh pivots.

### Safety net: bbox diff

```bash
# Before optimizing
gltf-transform inspect "$in" > "$OUT_DIR/$name.before.txt"

# After optimizing
gltf-transform inspect "$out" > "$OUT_DIR/$name.after.txt"

# Manual check: if bounding box delta > 1%, lower simplify ratio
```

### Visual regression checklist per model

1. Run `gltf-transform inspect` before/after — compare bounding box dimensions
2. Render side-by-side in Scene — check silhouette
3. If silhouette changes → lower simplify ratio for that file
4. If pivot shifts → re-export from Blender with same origin

---

## Mesh Merging

### Problem

Each mesh = 1 draw call + 1 material switch + GPU overhead.

A GLB with 200 meshes can destroy mobile performance.

### Solution

Merge static geometry. Especially:

- Decorations
- Environment props (mountain terrain sub-meshes)
- Background assets
- Repeated plants → use `--instance true`

`gltf-transform join` handles this. But only merges meshes that share the same material.

### Rule of Thumb

| Category                         | Target Draw Calls                      |
| -------------------------------- | -------------------------------------- |
| Background terrain               | 1–3                                    |
| Furniture group                  | 1–5                                    |
| Plants cluster                   | 1–3 per species                        |
| Hero objects (monitor, keyboard) | 1 each (keep separate for interaction) |

---

## Material Count

Material switches are expensive. GPU state changes per material.

Better: 1 atlas material than 20 tiny materials.

### Action Items

1. Audit material count per GLB: `gltf-transform inspect model.glb`
2. If >5 materials on a static prop → merge in Blender (bake textures to atlas)
3. Plants sharing same visual → share single material instance

---

## Texture Optimization

### Current Problem

Most mobile bottlenecks = memory bandwidth. Textures are the #1 VRAM consumer.

### Avoid

- 4K textures (current script uses `--texture-size 4096` — **must change to 1024**)
- PNG everywhere (huge file size)
- Too many separate textures

### Prefer

- **WebP** — good compression, wide support
- **KTX2** — GPU-compressed, massive VRAM savings on mobile
- **Texture atlases** — fewer texture switches
- **1024px max** for most assets, 512px for small props

### KTX2 Compression (Critical for Mobile)

Reduces:

- VRAM usage (4–8× less than PNG/JPEG)
- Texture upload cost
- Memory bandwidth

```bash
# After webp pass, add KTX2 for mobile-priority models
gltf-transform ktx2 input.glb output.glb --slots "baseColor,normal,emissive"
```

---

## Fixed Optimize Script

Key changes from current `scripts/optimize-models.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT/public/models"
OUT_DIR="$ROOT/public/models_optimized"
CLI="npx --no-install gltf-transform"

mkdir -p "$OUT_DIR"

# FIX: Read from correct file (was src/components/World.tsx)
FILES=$(grep -oE 'models_optimized/[^"]+\.glb' \
  "$ROOT/src/presentation/Scene/config/sceneObjects.ts" \
  | sed 's|models_optimized/||' | sort -u)

optimize_model() {
  local name="$1"
  local simplify_ratio="${2:-0.75}"
  local texture_size="${3:-1024}"
  local in="$SRC_DIR/$name"
  local out="$OUT_DIR/$name"

  [ ! -f "$in" ] && echo "SKIP (missing): $name" && return
  [ -f "$out" ] && echo "SKIP (exists): $name" && return

  # Bbox before
  $CLI inspect "$in" > "$OUT_DIR/${name%.glb}.before.txt" 2>/dev/null || true

  echo "Optimizing: $name (simplify=$simplify_ratio, tex=$texture_size)"
  $CLI optimize "$in" "$out" \
    --compress draco \
    --texture-compress webp \
    --texture-size "$texture_size" \
    --simplify true \
    --simplify-ratio "$simplify_ratio" \
    --simplify-error 0.001 \
    --instance true \
    --prune true \
    --flatten true \
    --join true \
    --weld 0.0001 \
    || echo "  !! failed: $name"

  # Bbox after
  $CLI inspect "$out" > "$OUT_DIR/${name%.glb}.after.txt" 2>/dev/null || true
}

# ── Tier 1: Huge (aggressive) ──
optimize_model "weisse_wand_mountain_peek_2517_m_8257_ft_m.glb" 0.4 1024
optimize_model "wisteria_sinensis005.glb" 0.5 1024

# ── Tier 2: Medium ──
optimize_model "dwarf_snowflake_mock_orange_flowers_spring.glb" 0.7 1024
optimize_model "realistic_hd_large-leaved_lupine_318.glb" 0.7 1024
optimize_model "fruit_basket.glb" 0.75 1024
optimize_model "green_creeper_plant.glb" 0.75 1024
optimize_model "realistic_hd_chinese_jungle_geranium_310.glb" 0.75 1024

# ── Tier 3: Small (light touch) ──
for name in $(echo "$FILES"); do
  optimize_model "$name" 0.9 1024
done

# ── Never simplify (override with ratio 1.0) ──
optimize_model "welcome_text.glb" 1.0 1024
optimize_model "monitor.glb" 1.0 1024
optimize_model "imac_magic_mouse.glb" 1.0 1024
optimize_model "mac_keyboard.glb" 1.0 1024

echo
echo "Done. Size comparison:"
du -sh "$SRC_DIR" "$OUT_DIR"
```

### Expected Results

| Before          | After (estimated) |
| --------------- | ----------------- |
| Mountain: 59 MB | 3–5 MB            |
| Total: ~167 MB  | ~25–30 MB         |
| Mobile VRAM     | ~70% reduction    |

---

## Manual Blender Pass (Mountain)

For the mountain model (59 MB), automated simplify alone may not be enough.

1. Open in Blender
2. Apply **Decimate** modifier → ratio 0.3 (keep 30% faces)
3. Check silhouette from camera positions defined in `cameraPresets.ts`
4. Re-export as GLB (embed textures)
5. Run through gltf-transform pipeline

Mountain is always far from camera. 70% polygon reduction is invisible.

---

## Scale Audit (Priority 4)

### Why Scale Baking Is Low Priority

Scale does NOT affect:

- Vertex count (the real GPU cost)
- Texture size (the real VRAM cost)
- Draw call count (the real CPU cost)
- Material count

Scale baking fixes **secondary** issues:

- Frustum culling accuracy (bounding box in wrong coordinate space)
- Animation LOD distance math
- Float precision at extreme scales
- Code readability (`0.00007` is unreadable)

**Do Priorities 1-3 first. Scale baking is cleanup.**

---

### Complete Model Map — All 60+ Scene Objects

#### 🔴 Extreme Scale (< 0.01) — Bake Recommended

| Object        | GLB File                  | Base Scale | Instances | Bake Factor | New Scale |
| ------------- | ------------------------- | ---------- | --------- | ----------- | --------- |
| Creeper Left  | `green_creeper_plant.glb` | 0.00007    | 1         | ×14285      | 1         |
| Creeper Right | `green_creeper_plant.glb` | 0.00007    | 1         | ×14285      | 1         |
| Pillow        | `pillow_test.glb`         | 0.0007     | 1         | ×1428       | 1         |
| Keyboard      | `mac_keyboard.glb`        | 0.007      | 1         | ×142        | 1         |

#### 🟡 Medium Scale (0.01–0.05) — Bake Optional

| Object           | GLB File                                      | Base Scale | Instances | Bake Factor | New Scale |
| ---------------- | --------------------------------------------- | ---------- | --------- | ----------- | --------- |
| Desk             | `jenson_extending_dining_table_solid_oak.glb` | 0.015      | 1         | ×66         | 1         |
| Office Chair     | `harvey_swivel_chair_mineral_blue.glb`        | 0.015      | 1         | ×66         | 1         |
| Armchair         | `Untitled.glb`                                | 0.012      | 1         | ×83         | 1         |
| Bar Table        | `edelweiss_bar_table_ash_and_white.glb`       | 0.01       | 1         | ×100        | 1         |
| Bar Chair (×2)   | `set_of_2_edelweiss_bar_chairs_white.glb`     | 0.01       | 2         | ×100        | 1         |
| Mud              | `mud_material.glb`                            | 0.01       | 1         | ×100        | 1         |
| Coffee Table     | `edelweiss_round_table_ash_and_white.glb`     | 0.01       | 1         | ×100        | 1         |
| Floor Lamp       | `irvin_floor_lamp_natural_wood_and_white.glb` | 0.01       | 1         | ×100        | 1         |
| Sofa             | `dylan_2_seater_sofa_mineral_blue.glb`        | 0.01       | 1         | ×100        | 1         |
| Bookcase         | `jenson_sideboard_solid_oak.glb`              | 0.01       | 1         | ×100        | 1         |
| Mug              | `mug.glb`                                     | 0.02       | 1         | ×50         | 1         |
| Pergola          | `pergola.glb`                                 | 0.05       | 1         | ×20         | 1         |
| Bush Square (×3) | `bush_square.glb`                             | 0.1        | 3         | ×10         | 1         |
| Coaster          | `unhyun__straw_mat_a.glb`                     | 0.15       | 1         | ×6.67       | 1         |

#### 🟢 Normal Scale (0.1–80) — No Bake Needed

| Object            | GLB File                                         | Base Scale | Instances |
| ----------------- | ------------------------------------------------ | ---------- | --------- |
| Mountain          | `weisse_wand_mountain_peek...glb`                | 80         | 1         |
| Nespresso         | `nespresso_machine_2.glb`                        | 35         | 1         |
| Rug (×2)          | `rug.glb`                                        | 2–2.2      | 2         |
| Palm (×2)         | `realistic_hd_windmill_palm_1625.glb`            | 1.6–2      | 2         |
| Fruits            | `fruit_basket.glb`                               | 1.7        | 1         |
| Laptop            | `lowpoly_laptop_closed.glb`                      | 1.8        | 1         |
| Shelf             | `shoe_cabinet.glb`                               | 1.8        | 1         |
| Mouse             | `imac_magic_mouse.glb`                           | 1.5        | 1         |
| Tablet            | `ipad_air4.glb`                                  | 1.5        | 1         |
| Teapot            | `teapot.glb`                                     | 1.4        | 1         |
| Sinensis (×2)     | `wisteria_sinensis005.glb`                       | 1.2–1.4    | 2         |
| Monitor (×3)      | `monitor.glb`                                    | 1.2        | 3         |
| Welcome Text      | `welcome_text.glb`                               | 1          | 1         |
| Lupine (×4)       | `realistic_hd_large-leaved_lupine_318.glb`       | 0.8–1      | 4         |
| Geranium 310 (×5) | `realistic_hd_chinese_jungle_geranium_310.glb`   | 0.8–1      | 5         |
| TV                | `tv_with_a_wall_mount.glb`                       | 0.8        | 1         |
| Desk Lamp         | `the_serpent_-_tret030.glb`                      | 0.8        | 1         |
| Bush 710 (×4)     | `realistic_hd_chinese_jungle_geranium_710.glb`   | 1.6–1.8    | 4         |
| Snowflake (×4)    | `dwarf_snowflake_mock_orange_flowers_spring.glb` | 0.6–0.75   | 4         |
| Wooden Fence (×5) | `wooden_fence.glb`                               | 0.5        | 5         |
| Money Plant       | `free_pothos_potted_plant_-_money_plant.glb`     | 0.5        | 1         |
| Pad               | `mousepad.glb`                                   | 0.4        | 1         |
| Croton (×4)       | `croton_leaf_plants.glb`                         | 0.22–0.28  | 4         |

**Total: 64 scene objects using 30 unique GLB files.**

---

### Non-Uniform Scale Handling

Many objects use deliberate non-uniform stretching in `sceneObjects.ts`:

```tsx
// Desk: stretched X, squashed Y, stretched Z
scale: [DESK_SCALE * 1.8, DESK_SCALE * 0.9, DESK_SCALE * 1.2];

// Mud: stretched X, normal Y, squashed Z
scale: [MUD_SCALE * 3, MUD_SCALE, MUD_SCALE * 0.5];

// Pergola: squashed Y
scale: [PERGOLA_SCALE * 0.8, PERGOLA_SCALE * 0.5, PERGOLA_SCALE * 1.2];
```

**These multipliers MUST stay in `sceneObjects.ts`** — they're intentional design choices.

Scale baking only changes the **base constant** (e.g., `DESK_SCALE = 0.015` → `1`). The multipliers (`* 1.8, * 0.9, * 1.2`) remain unchanged.

#### Proportion Preservation Proof

Example — Desk:

```
Before bake:
  DESK_SCALE = 0.015
  Scene: [0.015 × 1.8, 0.015 × 0.9, 0.015 × 1.2] = [0.027, 0.0135, 0.018]
  Visual size = GLB × [0.027, 0.0135, 0.018]

After bake (factor ×66.67 into GLB vertices):
  DESK_SCALE = 1
  Scene: [1 × 1.8, 1 × 0.9, 1 × 1.2] = [1.8, 0.9, 1.2]
  Visual size = (GLB × 66.67) × [1.8, 0.9, 1.2] / 66.67
             = GLB × [0.027, 0.0135, 0.018]  ← IDENTICAL
```

**Positions are NOT affected** — `position` is world-space, applied to mesh group origin after scale.

---

### Automated Scale Baking Script

`scripts/bake-scales.mjs` — Node SDK approach, no Blender needed.

```js
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
```

### Workflow After Running Script

1. Run: `node scripts/bake-scales.mjs`
2. Verify baked models visually (swap path in `sceneObjects.ts` temporarily)
3. Update `positions.ts`:

```tsx
// Before
export const PLANT_CREEPER_LEFT_SCALE = 0.00007;
export const PILLOW_SCALE = 0.0007;
export const DESK_SCALE = 0.015;
// etc.

// After
export const PLANT_CREEPER_LEFT_SCALE = 1;
export const PILLOW_SCALE = 1;
export const DESK_SCALE = 1;
// etc.
```

4. Update `sceneObjects.ts` paths: `models_optimized/` → `models_optimized_baked/`
5. Non-uniform multipliers stay unchanged:

```tsx
// Before AND after — identical
scale: [DESK_SCALE * 1.8, DESK_SCALE * 0.9, DESK_SCALE * 1.2];
```

6. Visual A/B test in Scene

### Safety

- **Never touches originals** — writes to separate `models_optimized_baked/` dir
- **Rollback** — revert `positions.ts` + revert `sceneObjects.ts` paths
- **Normals unchanged** — uniform scaling preserves normals
- **Textures unchanged** — only vertex positions modified

---

## Action Checklist (By Priority)

### Priority 1 — Critical (Do First)

- [ ] Fix grep path in `optimize-models.sh` → `sceneObjects.ts`
- [ ] Change `--texture-size` from 4096 → 1024
- [ ] Enable `--simplify true` with per-tier ratios
- [ ] Add `--instance true` for repeated meshes (plants, chairs)
- [ ] Add KTX2 compression pass for mobile-priority models
- [ ] Add bbox inspection before/after each model
- [ ] Test on real mobile device (iPhone Safari, mid Android)

### Priority 2 — High (Mountain)

- [ ] Blender decimate pass on mountain model (or aggressive simplify 0.2)
- [ ] Verify mountain silhouette from all camera presets

### Priority 3 — Medium (Draw Calls)

- [ ] Audit material count per GLB
- [ ] Merge static decorations via `--join`
- [ ] Instance repeated plants/chairs via `--instance`

### Priority 4 — Low (Scale Cleanup)

- [ ] Create `scripts/bake-scales.mjs` from template above
- [ ] Install `@gltf-transform/core` + `@gltf-transform/extensions` + `draco3dgltf`
- [ ] Run bake script on 17 target models
- [ ] Update `positions.ts` constants (set baked models to scale 1)
- [ ] Update `sceneObjects.ts` paths to `models_optimized_baked/`
- [ ] Visual A/B test all baked models in scene
- [ ] Verify positions unchanged (same world-space layout)
