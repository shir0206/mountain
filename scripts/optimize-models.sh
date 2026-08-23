#!/usr/bin/env bash
# Optimize ALL GLBs used in sceneObjects.ts into public/models_optimized/.
# Per-tier simplify ratios + 1024/512 textures + Draco + WebP + bbox diffing.
# Safe: never touches originals. Skips files that already exist in output.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT/public/models"
OUT_DIR="$ROOT/public/models_optimized"
CLI="npx gltf-transform"

mkdir -p "$OUT_DIR"

optimize_model() {
  local name="$1"
  local simplify_ratio="${2:-0.75}"
  local texture_size="${3:-1024}"
  local in="$SRC_DIR/$name"
  local out="$OUT_DIR/$name"

  [ ! -f "$in" ] && echo "SKIP (missing source): $name" && return
  [ -f "$out" ] && echo "SKIP (already exists): $name" && return

  # Bbox before
  $CLI inspect "$in" > "$OUT_DIR/${name%.glb}.before.txt" 2>/dev/null || true

  echo "━━━ Optimizing: $name (simplify=$simplify_ratio, tex=$texture_size) ━━━"

  # Run full pipeline
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
    || { echo "  !! FAILED: $name"; return; }

  # Bbox after
  $CLI inspect "$out" > "$OUT_DIR/${name%.glb}.after.txt" 2>/dev/null || true

  # Size comparison
  local size_before size_after
  size_before=$(du -h "$in" | cut -f1)
  size_after=$(du -h "$out" | cut -f1)
  echo "  ✓ $size_before → $size_after"
  echo
}

echo "╔══════════════════════════════════════════╗"
echo "║  GLB Optimization Pipeline               ║"
echo "╚══════════════════════════════════════════╝"
echo

# ══════════════════════════════════════════════════════════════════════════════
# TIER 1: HUGE (>5 MB) — Aggressive reduction, background/far objects
# ══════════════════════════════════════════════════════════════════════════════
echo "── Tier 1: Huge models (aggressive) ──"

# Mountain: 42 MB background terrain, never close to camera
optimize_model "mountain_optimized.glb" 0.3 1024

# ══════════════════════════════════════════════════════════════════════════════
# TIER 2: LARGE (1-20 MB) — Moderate reduction, furniture near camera
# ══════════════════════════════════════════════════════════════════════════════
echo "── Tier 2: Large models (moderate) ──"

# Armchair: 21 MB, used 5× but near camera — keep quality
optimize_model "ritchie_armchair_barley_beige.glb" 0.75 1024

# Office chair: 19 MB, hero prop near camera
optimize_model "office_chair_cream.glb" 0.75 1024

# ══════════════════════════════════════════════════════════════════════════════
# TIER 3: MEDIUM (200K-1MB) — Light touch, keep shape
# ══════════════════════════════════════════════════════════════════════════════
echo "── Tier 3: Medium models (light) ──"

# Plants — slight simplify ok
optimize_model "zelkova_schneideriana_optimized.glb" 0.8 512
optimize_model "railing-plant-fixed.glb" 0.8 512
optimize_model "pot-plant-with-mud.glb" 0.9 512

# Mug — near camera but small geometry
optimize_model "coffee_mug_school_project.glb" 0.9 512

# Furniture
optimize_model "Table_final (1).glb" 0.9 512
optimize_model "pergola_structure.glb" 0.9 512
optimize_model "pergola_floor.glb" 1.0 512

# Rugs — flat geometry, no simplify needed
optimize_model "rug_round_maple.glb" 1.0 512
optimize_model "rug_round_maple_overlay.glb" 1.0 512
optimize_model "rug_round_maple_overlay_extrudable.glb" 1.0 512

# ══════════════════════════════════════════════════════════════════════════════
# NEVER SIMPLIFY — Text glyphs, hero props already in models_optimized/
# ══════════════════════════════════════════════════════════════════════════════
echo "── Never-simplify models ──"

# Text — simplify destroys readability
optimize_model "click_text.glb" 1.0 1024

# Desk — tiny file, just compress
optimize_model "desk_fixed.glb" 1.0 512

echo
echo "╔══════════════════════════════════════════╗"
echo "║  Done. Size comparison:                  ║"
echo "╚══════════════════════════════════════════╝"
du -sh "$SRC_DIR" "$OUT_DIR"
echo
echo "Per-file sizes in output:"
find "$OUT_DIR" -name "*.glb" -exec du -h {} \; | sort -rh