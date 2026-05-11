# Camera Intro Animations — Performance Guide

> Your intro is the worst-case performance scenario:
> loading + animations + texture uploads + shader compilation + React mounting — ALL AT ONCE.

---

## Current Intro Architecture

`IntroAnimation.tsx` — 4-phase cinematic fly-through (~12s):

| Phase | Duration               | Action                                   |
| ----- | ---------------------- | ---------------------------------------- |
| 1     | `ORBIT_DURATION`       | Catmull-Rom orbit around mountain peak   |
| 2     | `ORBIT_TO_MEETING`     | Transition from orbit end → meeting area |
| 3     | `MEETING_DWELL`        | Pause at meeting                         |
| 4     | `MEETING_TO_WORKSPACE` | Fly to workspace (landscape view)        |

### What's Already Good ✅

- Spline precomputed via `useMemo` — no per-frame curve building
- Refs for all animation state (`startedRef`, `elapsedRef`, `doneRef`)
- Early exit in `useFrame` when not started or done
- Waits for `sceneReady` before starting (no animation during loading)
- OrbitControls disabled during intro (no user input fighting lerp)
- `ShaderWarmup` component exists

### What Needs Fixing ❌

- 6× `new THREE.Vector3()` per frame (see PERF_USEFRAME_REACT.md Rule #5)
- No phased loading — everything mounts at once
- `shadows="soft"` active during intro on mobile
- `CameraTracker` console.log running during intro
- No `frameloop="demand"` after intro ends

---

## Rule #1: Avoid React Rerenders During Intro

### Problem

Camera intro runs → React state updates → entire component tree rerenders → GPU stalls.

### Current Code

```tsx
// Scene.tsx
const [introComplete, setIntroComplete] = useState(false);
// ...
onIntroComplete={() => setIntroComplete(true)}
```

This triggers ONE rerender when intro finishes — acceptable.

### What To Avoid

Never do this during intro:

- `setState` calls
- Context value changes
- Prop drilling changes
- Dynamic component mounting

The intro period must be a **React-silent zone**. Only refs and mutations.

---

## Rule #2: Keep Intro Fully Outside React Lifecycle

### Principle

All intro animation logic should use:

- Refs for state
- Direct camera mutation
- Imperative OrbitControls updates
- No React state, no context, no effects

### Current Code ✅

`IntroAnimation.tsx` correctly:

- Uses `camera.position.copy(position)` — direct mutation
- Uses `controlsRef.current.target.copy(target)` — imperative
- Never calls `setState` during animation

### Enhancement

If intro ever needs GSAP (e.g., for easing timeline):

```tsx
useEffect(() => {
  if (!sceneReady) return;

  const tl = gsap.timeline();
  tl.to(camera.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: 3,
    ease: "power2.inOut",
    onUpdate: () => controlsRef.current?.update(),
  });

  return () => tl.kill();
}, [sceneReady]);
```

GSAP runs outside React. No reconciliation. No GC from React.

---

## Rule #3: Fix Per-Frame Vector Allocations

### Current Problem

`IntroAnimation.tsx` useFrame allocates 6 new Vector3 objects every frame.

### Fix (detailed in PERF_USEFRAME_REACT.md Rule #5)

```tsx
// Module-scoped — allocated once
const _position = new THREE.Vector3();
const _target = new THREE.Vector3();
const _fromPos = new THREE.Vector3();
const _toPos = new THREE.Vector3();
const _fromTarget = new THREE.Vector3();
const _toTarget = new THREE.Vector3();

export function IntroAnimation({ controlsRef, onComplete }) {
  // ...
  useFrame((_, delta) => {
    if (!startedRef.current || doneRef.current) return;

    elapsedRef.current += delta;
    const elapsed = Math.min(elapsedRef.current, INTRO_DURATION);

    if (elapsed <= ORBIT_DURATION) {
      const progress = easeInOutCubic(elapsed / ORBIT_DURATION);
      orbitCurve.getPointAt(progress, _position); // writes INTO _position
      _target.set(...ORBIT_TARGET);
    } else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING) {
      const segmentElapsed = elapsed - ORBIT_DURATION;
      const progress = easeInOutCubic(segmentElapsed / ORBIT_TO_MEETING);
      orbitCurve.getPointAt(1, _fromPos);
      _toPos.set(...CAMERA_PRESETS.meeting.position);
      _position.lerpVectors(_fromPos, _toPos, progress);
      _fromTarget.set(...ORBIT_TARGET);
      _toTarget.set(...CAMERA_PRESETS.meeting.target);
      _target.lerpVectors(_fromTarget, _toTarget, progress);
    }
    // ... phases 3 & 4 same pattern

    camera.position.copy(_position);
    if (controlsRef.current) {
      controlsRef.current.target.copy(_target);
      controlsRef.current.update();
    }

    if (elapsed >= INTRO_DURATION) {
      doneRef.current = true;
      if (controlsRef.current) controlsRef.current.enabled = true;
      onComplete();
    }
  });
}
```

Key change: `orbitCurve.getPointAt(progress, _position)` — second argument writes into existing vector instead of allocating new one.

---

## Rule #4: Intro Should FEEL Expensive, Not BE Expensive

### Critical UX Insight

Your intro should create the perception of a rich, alive world.

Instead of animating 100 meshes, do:

- Animated camera path (already doing this ✅)
- Fog/atmosphere motion
- Bloom pulse
- Slight shader displacement on hero object
- Depth-of-field that sharpens as you arrive

The brain perceives: "the world is alive" — with minimal GPU cost.

### Current Repo

Mountain orbit → meeting pause → workspace arrival.

Camera movement alone creates strong cinematic feel. No need for extra mesh animations during intro.

---

## Rule #5: Camera Path Can Be Precomputed

### Principle

If intro path is deterministic (no user input), you do NOT need realtime calculations.

### Current State

Spline is precomputed ✅. But lerp phases 2–4 recalculate vectors each frame.

### Enhancement: Precompute Entire Path

```tsx
const INTRO_SAMPLES = 720; // 12 seconds × 60 fps

const introPath = useMemo(() => {
  const positions: THREE.Vector3[] = [];
  const targets: THREE.Vector3[] = [];

  for (let i = 0; i <= INTRO_SAMPLES; i++) {
    const elapsed = (i / INTRO_SAMPLES) * INTRO_DURATION;
    // ... same phase logic, but computed once
    positions.push(position.clone());
    targets.push(target.clone());
  }

  return { positions, targets };
}, []);

// In useFrame — just index lookup, zero math
useFrame((_, delta) => {
  elapsedRef.current += delta;
  const t = Math.min(elapsedRef.current / INTRO_DURATION, 1);
  const i = Math.floor(t * INTRO_SAMPLES);

  camera.position.copy(introPath.positions[i]);
  controlsRef.current?.target.copy(introPath.targets[i]);
  controlsRef.current?.update();
});
```

Trade ~50KB memory for zero per-frame math. Massive win on weak CPUs.

---

## Rule #6: Stage Everything — Phase Loading

### Problem

Your intro has:

- Asset loading
- Texture uploads to GPU
- Shader compilation
- React component mounting
- Animation starting

ALL AT ONCE. Worst-case GPU/CPU spike.

### Current Flow

```
Loader (progress bar) → sceneReady → IntroAnimation starts
```

`SceneReadyGate` and `Loader` handle this partially ✅.

### Optimal Flow

| Phase | What Happens                       | User Sees                         |
| ----- | ---------------------------------- | --------------------------------- |
| 1     | Static loading screen (Loader.tsx) | Mountain bar animation + progress |
| 2     | Preload shaders (ShaderWarmup.tsx) | Still loading screen              |
| 3     | Upload textures to GPU             | Still loading screen              |
| 4     | `sceneReady` = true                | Loader fades out                  |
| 5     | Intro animation starts             | Cinematic camera                  |
| 6     | Intro complete                     | Interactive world                 |

### Key: Shader Warmup

Three.js compiles shaders **lazily** on first render. Result: first frame stutters.

`ShaderWarmup.tsx` already exists ✅ — renders hidden scene once to trigger compilation.

If not enough, force a dummy render:

```tsx
useEffect(() => {
  // Force shader compilation for all materials
  gl.compile(scene, camera);
}, []);
```

---

## Rule #7: Use `frameloop="demand"` After Intro

### Huge R3F Trick

After intro completes and user is idle:

- No animation running
- Camera stationary
- Scene static

Why render 60 fps of nothing?

### Implementation

```tsx
<Canvas frameloop="demand">
```

Then invalidate only when needed:

```tsx
// In CameraRig — when lerping
useFrame(({ invalidate }) => {
  if (!animating.current) return;
  // ...lerp work
  invalidate(); // Request next frame
});

// On user interaction
controlsRef.current?.addEventListener("change", () => {
  invalidate();
});
```

### Benefits

- Massive battery savings on mobile
- Zero CPU/GPU when idle
- Thermal throttling avoidance

### Caveat

`frameloop="demand"` means useFrame stops calling unless `invalidate()` is triggered. All animation code must call `invalidate()` when active.

---

## Rule #8: Disable OrbitControls Damping During Intro

### Current Code

```tsx
<OrbitControls enableDamping dampingFactor={0.05} />
```

During intro, OrbitControls is disabled (`controlsRef.current.enabled = false`) ✅.

But `controlsRef.current.update()` is called every frame during intro, which still applies damping internally — fighting the imperative camera position.

### Fix

```tsx
// When intro starts
controlsRef.current.enableDamping = false;

// When intro ends
controlsRef.current.enableDamping = true;
controlsRef.current.enabled = true;
```

---

## Rule #9: Use Suspense Carefully

### Current Code

```tsx
<Suspense fallback={null}>
  {SCENE_OBJECTS.map((config) => (
    <Model key={...} ... />
  ))}
  <ShaderWarmup />
  <BakeShadows />
  <Preload all />
</Suspense>
```

Single Suspense boundary — nothing renders until ALL models loaded ✅.

### Risks

- Heavy Suspense transitions can create mount spikes
- All textures upload to GPU simultaneously when Suspense resolves
- If one model is slow, everything waits

### Alternative: Progressive Loading

```tsx
// Priority models first (near camera at intro start)
<Suspense fallback={null}>
  <Model path="mountain.glb" />  {/* Visible during orbit */}
</Suspense>

// Secondary models (visible later in intro)
<Suspense fallback={null}>
  <Model path="furniture.glb" />  {/* Visible at workspace */}
</Suspense>
```

Allows mountain to render immediately while furniture loads in background. Camera is far from furniture during orbit phase — user won't notice pop-in.

---

## Rule #10: Render Less Often For Far Objects

### During Intro

Camera is far from workspace objects. Those objects don't need 60fps updates.

### Animation LOD Pattern

```tsx
useFrame(({ clock }) => {
  // Near objects: every frame
  updateNearObjects();

  // Far objects: every 4th frame
  if (Math.floor(clock.elapsedTime * 60) % 4 === 0) {
    updateFarObjects();
  }
});
```

Humans barely notice far objects updating at 15fps vs 60fps.

---

## Intro Performance Timeline

```
Time (ms)    Event                          CPU Impact
────────────────────────────────────────────────────────
0            Page load                      ███░░░
100          Loader.tsx mounts              █░░░░░
200          <Canvas> creates WebGL         ████░░
500          Models start loading           ██░░░░
2000         Suspense resolves              █████░  ← texture upload spike
2100         ShaderWarmup renders           ████░░  ← shader compile spike
2200         SceneReadyGate fires           ██░░░░
2300         Loader fades out               █░░░░░
2500         IntroAnimation starts          ███░░░
2500-14500   Camera fly-through             ██░░░░  ← steady, low overhead
14500        Intro complete                 ██░░░░  ← one React rerender
14600        CameraRig + OrbitControls      █░░░░░
15000+       Idle                           ░░░░░░  ← frameloop="demand"
```

Goal: keep spikes at 2000-2200ms range, then smooth sailing.

---

## Action Checklist

- [x] Hoist Vector3 allocations to module scope in `IntroAnimation.tsx`
- [x] Use `getPointAt(t, targetVec)` form to avoid allocation
- [x] Precompute entire intro path (720 samples) — zero per-frame math
- [x] Disable OrbitControls damping during intro
- [x] Add `frameloop="demand"` + `invalidate()` pattern after intro
- [x] Gate `CameraTracker` behind dev mode during intro
- [x] Progressive Suspense boundaries (mountain first, furniture second)
- [x] Force `gl.compile(scene, camera)` in ShaderWarmup
- [x] Defer non-critical effects (`SceneButton3D`, `BakeShadows`) until `introComplete`
- [x] Texture upload spike staggered via progressive Suspense tiers
