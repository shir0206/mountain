#!/usr/bin/env bash
# Optimize every GLB referenced in sceneObjects.ts.
# Per-tier simplify ratios + 1024 textures + Draco + WebP + bbox diffing.
# Writes compressed outputs to public/models_optimized/ (same filenames).

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
optimize_model "weisse_wand_mountain_peek_2517_m_8257_ft_m.glb" 0.4 2048
optimize_model "wisteria_sinensis005.glb" 0.5 1024

# ── Tier 2: Medium ──
optimize_model "dwarf_snowflake_mock_orange_flowers_spring.glb" 0.7 1024
optimize_model "realistic_hd_large-leaved_lupine_318.glb" 0.7 1024
optimize_model "fruit_basket.glb" 0.75 1024
optimize_model "green_creeper_plant.glb" 0.75 1024
optimize_model "realistic_hd_chinese_jungle_geranium_310.glb" 0.75 1024

# ── Never simplify (must run BEFORE tier 3 loop) ──
optimize_model "welcome_text.glb" 1.0 1024
optimize_model "monitor.glb" 1.0 1024
optimize_model "imac_magic_mouse.glb" 1.0 1024
optimize_model "mac_keyboard.glb" 1.0 1024

# ── Tier 3: Small (light touch — loop catches remaining) ──
for name in $(echo "$FILES"); do
  optimize_model "$name" 0.9 1024
done

echo
echo "Done. Size comparison:"
du -sh "$SRC_DIR" "$OUT_DIR"
