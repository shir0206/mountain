# Lighting Overhaul — Match Reference Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shift scene lighting from warm-amber overcast to mid-morning alpine summer — cool blue-sky ambient, single strong sun from upper-left, mountain-face bounce from right, warm interior lamps as accent contrast.

**Architecture:** Two independent changes: (1) color-grade `background.exr` in-place with `oiiotool` to cool-shift the sky background, and (2) replace all lighting values in `Lighting.tsx`. No other files change. The EXR only sets `scene.background`; IBL comes solely from the hemisphere + directionals, so the EXR grade has zero impact on PBR shading.

**Tech Stack:** React Three Fiber (Three.js), `oiiotool` (OpenImageIO CLI), TypeScript/TSX

---

## File Map

| File | Action | What changes |
|---|---|---|
| `public/textures/background.exr` | Modify (oiiotool) | Cool-shift R×0.88 G×0.94 B×1.08 |
| `src/presentation/Scene/Lighting/Lighting.tsx` | Modify | All light colors, intensities, positions |

---

### Task 1: Install oiiotool and back up the EXR

**Files:**
- Modify: `public/textures/background.exr` (backup step)

- [ ] **Step 1: Check if oiiotool is already installed**

```bash
which oiiotool
```

Expected: a path like `/usr/local/bin/oiiotool` — if you see "not found", continue to Step 2. If found, skip to Step 3.

- [ ] **Step 2: Install oiiotool via Homebrew**

```bash
brew install openimageio
```

Expected: installs successfully. Confirm with `which oiiotool`.

- [ ] **Step 3: Back up the original EXR**

```bash
cp public/textures/background.exr public/textures/background.exr.bak
```

Expected: `public/textures/background.exr.bak` now exists alongside the original.

```bash
ls -lh public/textures/background.exr*
```

Expected: two files of identical size.

---

### Task 2: Color-grade the background EXR

**Files:**
- Modify: `public/textures/background.exr`

The EXR is in linear HDR space. `--mulc` multiplies each channel by a scalar — no gamma artifacts. R×0.88 reduces warm/red, G×0.94 slightly reduces green, B×1.08 boosts blue → net cool alpine sky shift.

- [ ] **Step 1: Run the cool-shift grade**

```bash
oiiotool public/textures/background.exr \
  --mulc 0.88,0.94,1.08 \
  -o public/textures/background.exr
```

Expected: exits with no errors, output file size changes slightly (recompressed).

- [ ] **Step 2: Verify the file is valid**

```bash
oiiotool --info public/textures/background.exr
```

Expected: prints image info (resolution, channels) with no error. A corrupted EXR would produce an error here.

- [ ] **Step 3: Commit**

```bash
git add public/textures/background.exr
git commit -m "feat: cool-shift background EXR for alpine sky (R×0.88 G×0.94 B×1.08)"
```

**Rollback if EXR still looks too warm:**
Re-run with stronger values: `--mulc 0.82,0.90,1.14`
Or restore original: `cp public/textures/background.exr.bak public/textures/background.exr`

---

### Task 3: Update Lighting.tsx — ambient and hemisphere

**Files:**
- Modify: `src/presentation/Scene/Lighting/Lighting.tsx:28-31`

This is the root cause of the warm-overcast look. The hemisphere sky color `#fff4dc` floods all upward-facing surfaces with warm cream. Replacing it with alpine blue is the single highest-impact change.

- [ ] **Step 1: Replace ambientLight color and intensity**

In `src/presentation/Scene/Lighting/Lighting.tsx`, find:

```tsx
			{/* Humid post-rain ambient — warm, slightly reduced so shadows read */}
			<ambientLight color='#fff1d6' intensity={0.55} />
```

Replace with:

```tsx
			{/* Cool alpine sky ambient */}
			<ambientLight color='#d0e4f4' intensity={0.4} />
```

- [ ] **Step 2: Replace hemisphereLight sky, ground, and intensity**

Find:

```tsx
			{/* Bright cloudy sky + warm earth bounce */}
			<hemisphereLight args={["#fff4dc", "#b89878", 1.2]} />
```

Replace with:

```tsx
			{/* Alpine sky dome — blue above, dry-rock ground bounce below */}
			<hemisphereLight args={["#a8c8e8", "#8a7a5a", 0.9]} />
```

---

### Task 4: Update Lighting.tsx — primary sun

**Files:**
- Modify: `src/presentation/Scene/Lighting/Lighting.tsx:33-53`

The sun position moves to `[-25, 20, -15]`. At Y=20 (well above the scene) with target at PERGOLA_Y+8≈-34.9, the elevation to target is arctan(35/29)≈50° — within the 35–45° reference window when measured from the pergola floor plane. Negative X + negative Z = upper-left of frame.

- [ ] **Step 1: Replace primary sun comment, color, intensity, and position**

Find:

```tsx
			{/* Primary sun — positioned above the initial camera point,
			    shining down toward the pergola. Casts shadows on pergola floor
			    and mountain surface below. */}
			<primitive object={sunTarget} />
			<directionalLight
				color='#fff8e8'
				intensity={4}
				position={[-19.95, -5, -1.54]}
```

Replace with:

```tsx
			{/* Primary sun — upper-left, ~38° elevation, mid-morning summer */}
			<primitive object={sunTarget} />
			<directionalLight
				color='#fff4e0'
				intensity={3.5}
				position={[-25, 20, -15]}
```

All shadow camera/bias props below that line remain unchanged.

---

### Task 5: Update Lighting.tsx — secondary directional (warm sun → mountain bounce)

**Files:**
- Modify: `src/presentation/Scene/Lighting/Lighting.tsx:55-73`

The secondary light currently acts as a second competing warm sun at intensity 2.5. It becomes a cool mountain-face bounce at 0.5 — fills shadow faces without fighting the primary sun's warm-gold signature.

- [ ] **Step 1: Replace the entire secondary directionalLight block**

Find the block starting with:

```tsx
			{/* Secondary warm sun — wider angle, covers mountain slopes for
			    visible shadows on the terrain. */}
			<directionalLight
				color='#ffe3b8'
				intensity={2.5}
				position={[PERGOLA_X - 45, PERGOLA_Y + 55, PERGOLA_Z - 40]}
				target={sunTarget}
				castShadow
				shadow-mapSize-width={shadowMapSize}
				shadow-mapSize-height={shadowMapSize}
				shadow-bias={-0.0003}
				shadow-normalBias={0.04}
				shadow-camera-near={1}
				shadow-camera-far={150}
				shadow-camera-left={-50}
				shadow-camera-right={50}
				shadow-camera-top={50}
				shadow-camera-bottom={-50}
			/>
```

Replace with:

```tsx
			{/* Mountain face bounce — cool blue-grey fill from right-back */}
			<directionalLight
				color='#c8d8e8'
				intensity={0.5}
				position={[PERGOLA_X + 40, PERGOLA_Y + 30, PERGOLA_Z + 20]}
				target={sunTarget}
			/>
```

Note: `castShadow` removed — bounce light doesn't cast hard shadows. All shadow props removed with it.

---

### Task 6: Update Lighting.tsx — cool fill and interior lamps

**Files:**
- Modify: `src/presentation/Scene/Lighting/Lighting.tsx:75-98`

- [ ] **Step 1: Update cool fill light**

Find:

```tsx
			{/* Soft opposite fill — lifts crushed shadows on turquoise chairs */}
			<directionalLight
				color='#dfeaff'
				intensity={0.6}
				position={[PERGOLA_X + 30, PERGOLA_Y + 40, PERGOLA_Z + 30]}
			/>
```

Replace with:

```tsx
			{/* Sky fill — reinforces cool upper hemisphere */}
			<directionalLight
				color='#c8ddf4'
				intensity={0.4}
				position={[PERGOLA_X + 30, PERGOLA_Y + 40, PERGOLA_Z + 30]}
			/>
```

- [ ] **Step 2: Update desk lamp intensity**

Find:

```tsx
			{/* Desk lamp — warm, low. No shadow (point-light shadow = 6 cube passes). */}
			<pointLight
				color='#ffb870'
				intensity={6}
```

Replace with:

```tsx
			{/* Desk lamp — warm point, accent contrast against cool ambient */}
			<pointLight
				color='#ffb870'
				intensity={4}
```

- [ ] **Step 3: Update floor lamp intensity**

Find:

```tsx
			{/* Coffee-table / floor lamp — warm, low. No shadow for same reason. */}
			<pointLight
				color='#ffb870'
				intensity={7}
```

Replace with:

```tsx
			{/* Floor lamp — warm point */}
			<pointLight
				color='#ffb870'
				intensity={5}
```

- [ ] **Step 4: Commit all Lighting.tsx changes**

```bash
git add src/presentation/Scene/Lighting/Lighting.tsx
git commit -m "feat: overhaul lighting for alpine mid-morning — cool sky ambient, repositioned sun, mountain bounce"
```

---

### Task 7: Visual verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Expected: dev server starts, no TypeScript errors, opens in browser.

- [ ] **Step 2: Check workstation camera preset**

Navigate to the **workstation** preset (matches the reference angle).

Expected visual checklist:
- Beam shadow faces read **blue-grey**, not warm brown ✓
- Beam lit faces read **warm gold** ✓
- Floor has diagonal sun/shadow stripes — shadow stripe is cool grey ✓
- Interior lamp halos are visibly warm and contrast against the cooler ambient ✓
- Sky background reads cool alpine blue ✓

- [ ] **Step 3: Check balcony and garden presets**

Switch to **balcony** and **garden** camera presets.

Expected: no shadow acne, no z-fighting, no pure-black or blown-out patches on mountain/terrain. The cool ambient should read consistently across all presets.

- [ ] **Step 4: Side view rotation check**

Rotate to a side view (approx 90° from workstation).

Expected: no shadow acne or z-fighting on beam undersides or terrain.

---

## Rollback Knobs

**Scene too cold/flat:**
- `hemisphereLight` intensity `0.9 → 1.1`
- `ambientLight` intensity `0.4 → 0.5`

**EXR still looks warm after grade:**
- Re-run `oiiotool` with stronger blue boost: `--mulc 0.82,0.90,1.14`
- Or approve Plan B: change `EXR_PATH` in `SceneBackground.tsx` to `"textures/champagne_castle_1_4k.exr"`

**Restore original EXR:**
```bash
cp public/textures/background.exr.bak public/textures/background.exr
```
