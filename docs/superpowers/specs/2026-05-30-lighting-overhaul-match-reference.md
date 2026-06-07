# Lighting Overhaul — Match Reference Image

**Date:** 2026-05-30
**Branch:** mobile_design
**Status:** Approved, pending implementation

---

## Goal

Shift the scene from its current "warm amber overcast with dominant point light" state to match the reference photograph: a warm mid-morning alpine summer scene where:

- Strong directional sun enters from **upper-left at ~35–45° elevation**
- Shadow faces on beams and posts read **cool blue-grey** (sky fill)
- Lit faces read **warm gold** (~5800 K neutral-warm sun)
- Interior lamp halos remain warm — visibly contrasting against the cool ambient
- The sky background reads as deep alpine blue with cumulus clouds

---

## Gap Summary

Two analysis files document the before/after:

| File | Describes |
|---|---|
| `current-lighting.md` | Current scene — warm amber, overcast-dominant, ~4000 K pergola |
| `lighting-analysis.md` | Goal state — reference render, cool-sky ambient, 5800 K sun, mid-morning |

| Dimension | Goal | Current | Gap |
|---|---|---|---|
| Ambient color temp | Cool blue ~7000–8000 K | Warm cream `#fff1d6` / `#fff4dc` | ~2500–3000 K too warm |
| Sky hemisphere | Alpine blue | Warm cream | Wrong |
| Sun elevation | 35–45° | ~50° (OK) but wrong atmosphere | Atmosphere is the issue |
| Secondary light | Cool mountain bounce | Second warm sun `#ffe3b8` | Competing warm sun |
| Background EXR | Cool alpine blue sky | `background.exr` (warm/ambiguous) | Needs cool-shift |
| Interior lamps | Warm halo ✓ | Warm point lights ✓ | Correct, minor intensity trim |

---

## Scene Geometry Reference

```
PERGOLA world position: [5.0, -42.954, -5.0]
Sun target (PERGOLA_Y + 8): [5.0, -34.954, -5.0]
Camera workstation preset: [-1.82, -37.45, 6.05]
```

"Upper-left in frame" = negative X, positive Y, negative Z in world space.

---

## Gap 1 — Ambient & Sky Fill Color (Critical)

**Root cause of the warm-overcast look:** `hemisphereLight` sky color `#fff4dc` (warm cream) floods all upward-facing surfaces with warm tint. This dominates regardless of sun direction.

**Fix:**
- `ambientLight` color → `#d0e4f4` (cool blue-white), intensity `0.55 → 0.4`
- `hemisphereLight` sky → `#a8c8e8` (alpine blue), ground → `#8a7a5a` (dry summer rock), intensity `1.2 → 0.9`

---

## Gap 2 — Primary Sun Position (Critical)

**Current position:** `[-19.95, -5, -1.54]`

The sun is above the pergola (Y=-5 vs PERGOLA_Y=-42.954), but the Y delta to the target is only ~30 units against a horizontal distance of ~25 units — giving ~50° elevation. The real problem is not the angle but the atmosphere: the warm hemisphere swamps the sun's cool-sky signature.

Nonetheless the sun position should move to better match the reference's upper-left origin:

**New position:** `[-25, 20, -15]`
- Y=20 places it clearly high above scene → unambiguous downward light
- Negative X + negative Z = upper-left of frame ✓
- Elevation to target ≈ 38° — inside the 35–45° reference window

Color stays similar: `#fff8e8 → #fff4e0` (neutral warm white, ~5800 K).
Intensity: `4.0 → 3.5`.

---

## Gap 3 — Secondary Directional: Warm Sun → Mountain Bounce (Critical)

**Current:** `color='#ffe3b8'` intensity `2.5` — a second competing warm sun.

**Fix:**
- Color → `#c8d8e8` (cool blue-grey mountain face reflection)
- Intensity → `0.5`
- Position → `[PERGOLA_X+40, PERGOLA_Y+30, PERGOLA_Z+20]` (right-back, where the mountain face is)
- `castShadow` → `false` (bounce light doesn't cast hard shadows)

---

## Gap 4 — Cool Fill Light (Minor)

**Current:** `#dfeaff` intensity `0.6`

**Fix:** Color `→ #c8ddf4`, intensity `0.6 → 0.4`. Hemisphere now does more of this work.

---

## Gap 5 — Interior Point Lights (Minor)

Warm lamps are **correct** in principle. With ambient now cooler, their contrast reads higher, so slight trim:

- Desk lamp: intensity `6 → 4`
- Floor lamp: intensity `7 → 5`
- Colors unchanged (`#ffb870`)

---

## Gap 6 — Background EXR

**Plan A (default) — Color-grade `background.exr` in place:**

```bash
# Backup
cp public/textures/background.exr public/textures/background.exr.bak

# Cool shift: R×0.88, G×0.94, B×1.08
oiiotool public/textures/background.exr \
  --mulc 0.88,0.94,1.08 \
  -o public/textures/background.exr
```

`--mulc` operates on linear HDR data — no gamma artifacts. No code changes to `SceneBackground.tsx`.

Install if needed: `brew install openimageio`
Revert: `cp public/textures/background.exr.bak public/textures/background.exr`

**Plan B (requires explicit approval) — Swap EXR:**
Change `EXR_PATH` in `SceneBackground.tsx` to `"textures/champagne_castle_1_4k.exr"`.
Only if Plan A doesn't deliver.

**Critical note:** `SceneBackground` sets `scene.background` only — not `scene.environment`. The EXR contributes **zero IBL** to material reflections. All PBR shading comes from the hemisphere + directionals. This is intentional, no change needed.

---

## Implementation — All Changes

### `public/textures/background.exr`

Run the `oiiotool` command above. No `.tsx` changes.

---

### `src/presentation/Scene/Lighting/Lighting.tsx`

Complete value table:

| Light | Property | Before | After |
|---|---|---|---|
| `ambientLight` | color | `#fff1d6` | `#d0e4f4` |
| `ambientLight` | intensity | `0.55` | `0.4` |
| `hemisphereLight` | sky | `#fff4dc` | `#a8c8e8` |
| `hemisphereLight` | ground | `#b89878` | `#8a7a5a` |
| `hemisphereLight` | intensity | `1.2` | `0.9` |
| Primary sun | color | `#fff8e8` | `#fff4e0` |
| Primary sun | intensity | `4.0` | `3.5` |
| Primary sun | position | `[-19.95, -5, -1.54]` | `[-25, 20, -15]` |
| Secondary fill | color | `#ffe3b8` | `#c8d8e8` |
| Secondary fill | intensity | `2.5` | `0.5` |
| Secondary fill | position | `[PERGOLA_X-45, PERGOLA_Y+55, PERGOLA_Z-40]` | `[PERGOLA_X+40, PERGOLA_Y+30, PERGOLA_Z+20]` |
| Secondary fill | `castShadow` | `true` | `false` |
| Cool fill | color | `#dfeaff` | `#c8ddf4` |
| Cool fill | intensity | `0.6` | `0.4` |
| Desk lamp | intensity | `6` | `4` |
| Floor lamp | intensity | `7` | `5` |

**Full resulting component:**

```tsx
// Mid-morning alpine summer — cool blue-sky ambient, single strong sun from upper-left,
// mountain bounce from right, warm interior lamps as accent contrast.
export function Lighting() {
	const { renderSettings } = useDeviceContext();
	const shadowMapSize = renderSettings.shadowMapSize;

	const sunTarget = useMemo(() => {
		const o = new THREE.Object3D();
		o.position.set(PERGOLA_X, PERGOLA_Y + 8, PERGOLA_Z);
		return o;
	}, []);

	return (
		<>
			{/* Cool alpine sky ambient */}
			<ambientLight color='#d0e4f4' intensity={0.4} />

			{/* Alpine sky dome — blue above, dry-rock ground bounce below */}
			<hemisphereLight args={["#a8c8e8", "#8a7a5a", 0.9]} />

			{/* Primary sun — upper-left, ~38° elevation, mid-morning summer */}
			<primitive object={sunTarget} />
			<directionalLight
				color='#fff4e0'
				intensity={3.5}
				position={[-25, 20, -15]}
				target={sunTarget}
				castShadow
				shadow-mapSize-width={shadowMapSize}
				shadow-mapSize-height={shadowMapSize}
				shadow-bias={-0.0004}
				shadow-normalBias={0.03}
				shadow-camera-near={1}
				shadow-camera-far={120}
				shadow-camera-left={-35}
				shadow-camera-right={35}
				shadow-camera-top={35}
				shadow-camera-bottom={-35}
			/>

			{/* Mountain face bounce — cool blue-grey fill from right-back */}
			<directionalLight
				color='#c8d8e8'
				intensity={0.5}
				position={[PERGOLA_X + 40, PERGOLA_Y + 30, PERGOLA_Z + 20]}
				target={sunTarget}
			/>

			{/* Sky fill — reinforces cool upper hemisphere */}
			<directionalLight
				color='#c8ddf4'
				intensity={0.4}
				position={[PERGOLA_X + 30, PERGOLA_Y + 40, PERGOLA_Z + 30]}
			/>

			{/* Desk lamp — warm point, accent contrast against cool ambient */}
			<pointLight
				color='#ffb870'
				intensity={4}
				distance={4}
				decay={2}
				position={[DESK_LAMP_X, DESK_LAMP_Y + 0.2, DESK_LAMP_Z]}
			/>

			{/* Floor lamp — warm point */}
			<pointLight
				color='#ffb870'
				intensity={5}
				distance={5}
				decay={2}
				position={[FLOOR_LAMP_X, FLOOR_LAMP_Y + 2.2, FLOOR_LAMP_Z]}
			/>
		</>
	);
}
```

---

## Expected Visual Result

| Surface | Before | After |
|---|---|---|
| Beam — lit face | Warm amber-brown | Warm gold (~5800 K) |
| Beam — shadow face | **Warm brown (wrong)** | **Cool blue-grey (correct)** |
| Floor — sun stripe | Warm amber | Warm beige |
| Floor — shadow stripe | Warm dark tile | Cool grey tile |
| Chair upholstery | Warm cream | Neutral-cool cream |
| Interior lamps | Warm pool | Warm pool — more contrast against cooler ambient |
| Sky background | Warm/ambiguous EXR | Cool alpine blue |

Primary perceptual shift: **shadow faces go warm brown → cool blue-grey.** This is the defining signature of outdoor alpine daylight.

---

## Out of Scope

- Shadow camera frustums, bias values, map sizes — unchanged
- Post-processing / tone mapping — ACESFilmic already set in Canvas, unchanged
- `applyMaterialPolicy.ts` — material roughness/metalness untouched
- `scene.environment` / PMREMGenerator — not touched

---

## Verification

1. `npm run dev`
2. Check **workstation** preset (matches reference angle)
   - Beam shadow faces = blue-grey ✓
   - Floor has diagonal sun/shadow stripes ✓
   - Lamp halos visible and warm ✓
   - Sky = cool alpine blue ✓
3. Check **balcony** and **garden** presets — no artifacts on mountain/terrain
4. Rotate to side view — no shadow acne or z-fighting

---

## Rollback Knobs

Too cold/flat:
- `hemisphereLight` intensity `0.9 → 1.1`
- `ambientLight` intensity `0.4 → 0.5`

EXR still looks warm:
- Re-run `oiiotool` with stronger blue boost: `--mulc 0.82,0.90,1.14`
- Or approve Plan B (swap to `champagne_castle_1_4k.exr`)
