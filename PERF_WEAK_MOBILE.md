# Weak Mobile Devices — Performance Guide

> Desktop lies. Always test thermals, sustained FPS, battery drain, memory usage on actual phones.
> Especially: older iPhones, mid-range Androids.

---

## Current Repo State

`Scene.tsx` already gates some settings by device:

```tsx
const isMobile = device === DEVICE.MOBILE;
// ...
fov: isMobile ? 55 : 35,
dpr: isMobile ? [1, 1.5] : [1, 2],
```

### What's Good ✅

- `DeviceContext` / `deviceDetector.ts` exists — device-aware architecture
- DPR reduced on mobile (`[1, 1.5]` vs `[1, 2]`)
- `powerPreference: "high-performance"` set

### What's Killing Mobile ❌

- `shadows="soft"` — always on, even mobile
- `antialias: true` — always on, even mobile
- 59 MB mountain model — downloads to phone
- No postprocessing gating
- No transparency limits
- No particle budgets
- No `frameloop="demand"` for idle state

---

## Rule #1: Realtime Shadows Are GPU Killers

### Problem

`Scene.tsx`:

```tsx
<Canvas shadows="soft">
```

Soft shadows require:

- Shadow map renders per light per frame
- Multiple shadow samples (PCF soft)
- Large shadow map textures in VRAM

On mobile: instant GPU meltdown.

### Fix

```tsx
<Canvas shadows={isMobile ? false : "soft"}>
```

### Better: Baked/Fake Shadows

Instead of realtime shadows:

| Technique                                      | Cost            | Quality |
| ---------------------------------------------- | --------------- | ------- |
| Realtime soft shadows                          | 🔴 Extreme      | High    |
| Realtime basic shadows                         | 🟡 High         | Medium  |
| `<BakeShadows />` (freeze after first frame)   | 🟢 Low          | Medium  |
| Baked shadow textures (from Blender)           | 🟢 Zero runtime | High    |
| Fake blob shadows (circle plane under objects) | 🟢 Minimal      | Low     |
| AO textures baked into materials               | 🟢 Zero runtime | Medium  |

Current repo has `<BakeShadows />` inside Suspense — but `shadows="soft"` still forces the initial shadow render. On mobile, skip shadows entirely and rely on baked AO in GLB materials.

### Blob Shadow Example

```tsx
function BlobShadow({ position }) {
  return (
    <mesh
      position={[position[0], 0.01, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[0.5, 16]} />
      <meshBasicMaterial color="black" transparent opacity={0.15} />
    </mesh>
  );
}
```

---

## Rule #2: Disable Antialias on Mobile

### Current Code

```tsx
gl={{ antialias: true }}
```

MSAA is expensive on mobile GPUs. Fill rate is already the bottleneck.

### Fix

```tsx
gl={{
  antialias: !isMobile,
  toneMapping: 3,
  powerPreference: "high-performance",
}}
```

Visual difference on mobile screens (small, high DPI): barely noticeable.

---

## Rule #3: Lower DPR Aggressively

### Current Code

```tsx
dpr={isMobile ? [1, 1.5] : [1, 2]}
```

iPhones render at insane native resolutions. DPR 1.5 on an iPhone 15 Pro = 2556×1179 effective pixels.

### Tighter for Weak Mobile

```tsx
const getDeviceDPR = (device: Device): [number, number] => {
  switch (device) {
    case DEVICE.MOBILE:
      return [1, 1]; // Weak phones: native 1x
    case DEVICE.TABLET:
      return [1, 1.5];
    default:
      return [1, 2];
  }
};
```

DPR `[1, 1]` on mobile:

- Huge GPU savings (renders 2–4× fewer pixels)
- Tiny visual difference (phone screens are small)
- Massive thermal improvement

### Adaptive DPR

R3F supports adaptive DPR via `@react-three/drei`:

```tsx
import { AdaptiveDpr } from "@react-three/drei";

<Canvas dpr={[1, 2]}>
  <AdaptiveDpr pixelated /> {/* Auto-lowers DPR when FPS drops */}
</Canvas>;
```

---

## Rule #4: Mobile GPUs Hate Transparency

### Problem

Transparency destroys fill rate. Each transparent pixel must be:

- Sorted back-to-front
- Blended with whatever's behind it
- Cannot use early-Z rejection

### Avoid on Mobile

- Massive alpha layers
- Overlapping transparent particles
- Glass/translucent materials
- Large-screen-coverage transparency

### Strategy

```tsx
// Desktop: full transparency
<meshPhysicalMaterial transmission={0.9} />

// Mobile: opaque approximation
<meshStandardMaterial color="#d4e8f0" />
```

---

## Rule #5: Postprocessing Is Usually Overused

### Expensive Effects

| Effect    | Mobile Cost | Alternative        |
| --------- | ----------- | ------------------ |
| SSAO      | 🔴 Extreme  | Baked AO textures  |
| DOF       | 🔴 High     | Skip or intro-only |
| Bloom     | 🟡 Medium   | Emissive materials |
| SSR       | 🔴 Extreme  | Environment maps   |
| FXAA/SMAA | 🟡 Medium   | Skip on mobile     |

### Strategy: Device-Gated Postprocessing

```tsx
function PostProcessing({ isMobile }) {
  if (isMobile) return null;

  return (
    <EffectComposer>
      <Bloom intensity={0.5} />
      <SSAO />
    </EffectComposer>
  );
}
```

Or: enable only during intro, disable after.

---

## Rule #6: Frustum Culling Is Not Enough

Three.js frustum culling helps — skips objects outside camera view. But not enough.

### Additional Strategies

1. **Manually hide distant sections** — `visible = false` on far groups
2. **Unload unseen areas** — unmount React components for off-camera zones
3. **Reduce animation updates offscreen** — skip useFrame work for invisible objects
4. **LOD (Level of Detail)** — swap high-poly for low-poly at distance

```tsx
import { Detailed } from "@react-three/drei";

<Detailed distances={[0, 10, 30]}>
  <HighPolyModel /> {/* < 10 units */}
  <MedPolyModel /> {/* 10–30 units */}
  <LowPolyModel /> {/* > 30 units */}
</Detailed>;
```

---

## Rule #7: Animation LOD

### Principle

Far objects can update slower. Humans barely notice.

| Distance    | Update Rate | Perceived    |
| ----------- | ----------- | ------------ |
| Near (< 5m) | 60 FPS      | Smooth       |
| Mid (5–20m) | 30 FPS      | Fine         |
| Far (> 20m) | 15 FPS      | Unnoticeable |

### Implementation

```tsx
useFrame(({ camera, clock }) => {
  const distance = camera.position.distanceTo(objectRef.current.position);
  const frameSkip = distance > 20 ? 4 : distance > 5 ? 2 : 1;
  const frame = Math.floor(clock.elapsedTime * 60);

  if (frame % frameSkip !== 0) return;

  // ... update logic
});
```

---

## Rule #8: Mobile Safari Is Your Real Enemy

### iOS Safari Specifics

- **Aggressive memory limits** — WebGL context lost at ~200–300 MB
- **Thermal throttling** — GPU clocks down after sustained load
- **WebGL instability** — context loss more frequent than Chrome
- **No SharedArrayBuffer** — some optimizations unavailable
- **Viewport resize** — address bar show/hide triggers expensive resize

### Design for Safari FIRST

```tsx
// Detect iOS Safari
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// Apply strictest limits
if (isIOS) {
  // Max texture budget: 150 MB VRAM
  // Max draw calls: 100
  // Max polygons: 500K total
  // DPR: 1
  // Shadows: off
  // Postprocessing: off
}
```

### Memory Budget

| Platform       | Safe VRAM Budget | Context Loss Threshold |
| -------------- | ---------------- | ---------------------- |
| iOS Safari     | ~150 MB          | ~300 MB                |
| Android Chrome | ~300 MB          | ~500 MB                |
| Desktop Chrome | ~1 GB+           | Rarely                 |

---

## Rule #9: Particle Systems Need Hard Limits

### Problem

Particles scale catastrophically. Especially:

- Transparent particles (fill rate)
- Additive blending (no early-Z)
- Large screen coverage (pixel shader bound)

### Adaptive Particle Counts

```tsx
const getParticleCount = (device: Device): number => {
  switch (device) {
    case DEVICE.MOBILE:
      return 20; // Bare minimum
    case DEVICE.TABLET:
      return 100;
    default:
      return 1000; // Desktop
  }
};
```

### Rules

- Never let particles cover >25% of screen on mobile
- Use `depthWrite={false}` + `depthTest={true}`
- Prefer point sprites over quad particles
- Hard cap: 50 particles on weak mobile, period

---

## Rule #10: Prefer Illusion Over Simulation

**Master principle for mobile.**

| Instead Of           | Use                   |
| -------------------- | --------------------- |
| Realtime water       | Animated normal maps  |
| Volumetric clouds    | Layered fog planes    |
| Physics simulation   | Animation curves      |
| Realtime reflections | Environment maps      |
| Dynamic GI           | Baked lightmaps       |
| Soft shadows         | AO textures           |
| Particle fire        | Animated sprite sheet |

The goal is **uninterrupted emotional immersion** — not maximum polygons, realism, or effects.

---

## Rule #11: Stable FPS > Maximum FPS

A locked **30 FPS** feels far better than: 60 → 28 → 52 → 17.

Consistency is UX.

### Strategy

If targeting mobile:

- Cap at 30 FPS intentionally
- Ensure ZERO drops below 30
- Better than chasing 60 and failing

### Implementation

```tsx
// Cap to 30 FPS via frameloop
useFrame((state, delta) => {
  // Skip every other frame
  frameCount.current++;
  if (frameCount.current % 2 !== 0) return;

  // ... update at 30Hz
});
```

Or throttle via Canvas:

```tsx
<Canvas
  gl={{ powerPreference: "default" }} // Don't force high-perf on battery
  frameloop="demand" // Render only when needed
/>
```

---

## Rule #12: Render Less Often

### `frameloop="demand"`

Instead of continuous 60fps rendering:

```tsx
<Canvas frameloop="demand">
```

Render only when something changes. Then:

```tsx
// Invalidate on interaction
controlsRef.current?.addEventListener("change", invalidate);

// Invalidate during animation
useFrame(({ invalidate }) => {
  if (animating.current) {
    // ... do work
    invalidate();
  }
});
```

Benefits:

- Massive battery savings
- Zero thermal buildup when idle
- Phone stays cool

---

## Rule #13: `powerPreference` Strategy

### Current Code

```tsx
gl={{ powerPreference: "high-performance" }}
```

On mobile, `"high-performance"` forces discrete GPU (if available) and prevents power saving.

### Better for Mobile

```tsx
gl={{
  powerPreference: isMobile ? "default" : "high-performance",
}}
```

`"default"` lets the OS decide — preserves battery on mobile.

---

## Repo-Specific Fixes

### Scene.tsx Changes

```tsx
<Canvas
  camera={{
    position: CAMERA_PRESETS[INITIAL_PRESET].position,
    fov: isMobile ? 55 : 35,
    near: 0.1,
    far: isMobile ? 300 : 600,    // Reduce far plane on mobile
  }}
  gl={{
    antialias: !isMobile,           // Off on mobile
    toneMapping: 3,
    powerPreference: isMobile ? "default" : "high-performance",
  }}
  dpr={isMobile ? [1, 1] : [1, 2]}  // DPR 1 on mobile
  shadows={isMobile ? false : "soft"} // No shadows on mobile
  frameloop="demand"                   // Render only when needed
>
```

### DeviceContext Enhancement

Extend `deviceDetector.ts` to detect weak vs strong mobile:

```tsx
export enum DEVICE_TIER {
  WEAK_MOBILE = "weak_mobile", // Old iPhones, budget Androids
  MOBILE = "mobile", // Modern phones
  TABLET = "tablet",
  DESKTOP = "desktop",
}

function detectDeviceTier(): DEVICE_TIER {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) return DEVICE_TIER.DESKTOP;

  // Heuristic: weak if <4 cores or <4GB RAM
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory || 2;

  if (cores <= 4 && memory <= 4) return DEVICE_TIER.WEAK_MOBILE;
  return DEVICE_TIER.MOBILE;
}
```

Then gate everything by tier:

```tsx
const settings = {
  [DEVICE_TIER.WEAK_MOBILE]: {
    dpr: [1, 1],
    shadows: false,
    antialias: false,
    postprocessing: false,
    particles: 20,
    textureSize: 512,
    farPlane: 200,
  },
  [DEVICE_TIER.MOBILE]: {
    dpr: [1, 1.5],
    shadows: false,
    antialias: false,
    postprocessing: false,
    particles: 100,
    textureSize: 1024,
    farPlane: 300,
  },
  [DEVICE_TIER.DESKTOP]: {
    dpr: [1, 2],
    shadows: "soft",
    antialias: true,
    postprocessing: true,
    particles: 1000,
    textureSize: 2048,
    farPlane: 600,
  },
};
```

---

## Mobile Performance Budget

### Per-Frame Budget at 30 FPS

Total: **33ms** per frame.

| Stage                        | Budget |
| ---------------------------- | ------ |
| JavaScript (useFrame, React) | 8ms    |
| GPU draw calls               | 10ms   |
| GPU fragment shading         | 8ms    |
| GPU texture sampling         | 4ms    |
| Overhead (OS, compositor)    | 3ms    |

If ANY stage exceeds budget → dropped frame.

### Total Scene Budget

| Metric        | Weak Mobile | Mobile   | Desktop  |
| ------------- | ----------- | -------- | -------- |
| Draw calls    | < 50        | < 100    | < 300    |
| Triangles     | < 200K      | < 500K   | < 2M     |
| Textures VRAM | < 50 MB     | < 150 MB | < 500 MB |
| Total VRAM    | < 100 MB    | < 250 MB | < 1 GB   |
| Materials     | < 10        | < 20     | < 50     |
| Lights        | 1–2         | 2–3      | 4+       |

---

## Testing Checklist

### Real Device Testing (Not Desktop Chrome)

- [ ] iPhone SE (2nd gen) — minimum iOS target
- [ ] iPhone 12/13 — mainstream iOS
- [ ] Samsung Galaxy A series — mid-range Android
- [ ] Pixel 5/6a — mid-range Android

### What to Measure

- [ ] Sustained FPS (not just peak — run for 60+ seconds)
- [ ] Thermal state (does phone get hot?)
- [ ] Memory usage (Safari Web Inspector → Memory tab)
- [ ] Battery drain rate during active use
- [ ] Time to first meaningful paint
- [ ] Time from loader complete → interactive
- [ ] WebGL context loss events

### Tools

| Tool                                    | What It Shows                  |
| --------------------------------------- | ------------------------------ |
| Safari Web Inspector → Canvas tab       | GPU draw calls, triangle count |
| Safari Web Inspector → Memory tab       | JS heap, texture memory        |
| Chrome DevTools → Performance tab       | Frame timing, CPU usage        |
| Chrome DevTools → Rendering → FPS meter | Realtime FPS overlay           |
| `stats.js` (drei `<Stats />`)           | In-app FPS/MS/MB counter       |
| Spector.js                              | WebGL call inspector           |

---

## Action Checklist

- [ ] Gate `shadows` by device: `shadows={isMobile ? false : "soft"}`
- [ ] Gate `antialias` by device: `antialias: !isMobile`
- [ ] Tighten mobile DPR to `[1, 1]`
- [ ] Change `powerPreference` to `"default"` on mobile
- [ ] Reduce `far` plane on mobile (600 → 300)
- [ ] Add `frameloop="demand"` + `invalidate()` pattern
- [ ] Extend `deviceDetector.ts` with `DEVICE_TIER` (weak/mobile/desktop)
- [ ] Create device-tier settings object for all rendering parameters
- [ ] Add `<AdaptiveDpr />` from drei as fallback
- [ ] Audit transparency usage — replace with opaque approximations on mobile
- [ ] Set particle hard caps per device tier
- [ ] Test on iPhone SE, Galaxy A series, Pixel 6a
- [ ] Measure sustained FPS (60+ seconds), not just peak
- [ ] Monitor WebGL context loss events on iOS Safari
