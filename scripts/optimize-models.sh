#!/usr/bin/env bash
# Optimize every GLB actually referenced in src/components/World.tsx.
# Uses gltf-transform 'optimize' preset: prune + dedup + weld + Draco + WebP + resize.
# Writes compressed outputs to public/models_optimized/ (same filenames).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT/public/models"
OUT_DIR="$ROOT/public/models_optimized"
CLI="npx --no-install gltf-transform"

mkdir -p "$OUT_DIR"

# Collect every "models/*.glb" path referenced in the code.
FILES=$(grep -oE 'models/[^"]+\.glb' "$ROOT/src/components/World.tsx" | sort -u)

TOTAL=$(echo "$FILES" | wc -l | tr -d ' ')
i=0
for rel in $FILES; do
	i=$((i+1))
	name="${rel#models/}"
	in="$SRC_DIR/$name"
	out="$OUT_DIR/$name"
	if [ ! -f "$in" ]; then
		echo "[$i/$TOTAL] SKIP (missing): $name"
		continue
	fi
	if [ -f "$out" ]; then
		echo "[$i/$TOTAL] SKIP (exists): $name"
		continue
	fi
	echo "[$i/$TOTAL] $name"
	$CLI optimize "$in" "$out" \
		--compress draco \
		--texture-compress webp \
		--texture-size 4096 \
		--simplify false \
		--prune true \
		--flatten true \
		--join true \
		|| echo "  !! failed: $name"
done

echo
echo "Done. Size comparison:"
du -sh "$SRC_DIR" "$OUT_DIR"
