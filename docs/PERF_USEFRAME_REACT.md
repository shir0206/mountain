# useFrame & React in the Render Loop

> The biggest R3F mistake: React thinking inside the render loop.

---

## Two Incompatible Philosophies

| React        | Realtime Rendering  |
| ------------ | ------------------- |
| Declarative  | Imperative          |
| Reactive     | Frame-budget-driven |
| State-driven | Mutation-driven     |

If React rerenders during animation → performance dies.

---

## Rule #1: Never Trigger React State Inside useFrame

### BAD

```tsx
useFrame(() => {
  setPosition(...)  // React state update
})
```

Creates:

- React reconciliation
- Component rerenders
- Garbage collection pressure
- Frame instability

### GOOD

```tsx
useFrame(() => {
  mesh.current.position.x += 0.01; // Direct mutation
});
```

No React involvement. No rerenders. No GC pressure.

---

## Rule #2: Separate "Visual State" From "React State"

Most animation state should **NOT** live in React.

Use instead:

- `useRef` for mutable values
- Module-scoped variables
- External stores (zustand with `subscribeWithSelector`)
- Local variables in closures

### Good Candidates for Refs

- Camera movement
- Lerp values
- Animation progress (`elapsedRef`, `doneRef`)
- Particle systems
- Shader uniforms
- Mouse smoothing

### Repo Example ✅ (Already Correct)

`IntroAnimation.tsx` correctly uses refs:

```tsx
const startedRef = useRef(false);
const elapsedRef = useRef(0);
const doneRef = useRef(false);
```

Animation progress never touches React state. Good.

### Repo Example ❌ (Problematic)

`Scene.tsx` uses React state for intro completion:

```tsx
const [introComplete, setIntroComplete] = useState(false);
// ...
onIntroComplete={() => setIntroComplete(true)}
```

This triggers a rerender of `SceneInner` which conditionally mounts/unmounts `CameraRig` and `IntroAnimation`. Acceptable because it happens once — but if this pattern were used frequently, it would cause GPU stalls during camera transitions.

---

## Rule #3: useFrame Is Expensive When Overused

### Problem

100 components each with `useFrame(...)` creates:

- Callback overhead per frame
- JS scheduling overhead
- Poor CPU cache behavior

### Better Pattern: Centralize Updates

Instead of 100 useFrames → use 1 orchestrator useFrame that updates everything.

```tsx
// BAD: Each plant has its own useFrame
function Plant({ ref }) {
  useFrame(() => {
    ref.current.rotation.y += 0.001;
  });
}
// × 50 plants = 50 useFrame callbacks

// GOOD: One orchestrator
function PlantAnimator({ plantRefs }) {
  useFrame(() => {
    for (const ref of plantRefs) {
      ref.current.rotation.y += 0.001;
    }
  });
}
// 1 useFrame callback total
```

### Current Repo useFrame Count

| Component        | useFrame | Notes                             |
| ---------------- | -------- | --------------------------------- |
| `IntroAnimation` | 1        | ✅ Exits early when done          |
| `CameraRig`      | 1        | ✅ Exits early when not animating |
| `CameraTracker`  | 1        | ⚠️ Runs EVERY frame, even idle    |

3 useFrames total — acceptable. But `CameraTracker` should be dev-only.

---

## Rule #4: Move Expensive Math Outside useFrame

### BAD

```tsx
useFrame(() => {
  const noise = complicatedNoiseFunction(); // Computed every frame
});
```

### GOOD

Precompute outside render loop:

- Paths / curves
- Lookup tables
- Random positions
- Noise textures

### Repo Example ✅

`IntroAnimation.tsx` precomputes the spline:

```tsx
const orbitCurve = useMemo(() => {
  const orbitVectors = ORBIT_POINTS.map((point) => new THREE.Vector3(...point));
  return new THREE.CatmullRomCurve3(orbitVectors, false, "catmullrom", 0.5);
}, []);
```

Good — built once, sampled per frame.

---

## Rule #5: Kill Per-Frame Allocations

### 🔴 Critical Bug in `IntroAnimation.tsx`

Lines 74, 81, 86, 88, 98, 104, 109, 111 allocate `new THREE.Vector3()` every frame:

```tsx
// INSIDE useFrame — runs 60×/sec
target = new THREE.Vector3(...ORBIT_TARGET);           // allocation
position = new THREE.Vector3().lerpVectors(...)        // allocation
const fromPosition = new THREE.Vector3(...)            // allocation
const toPosition = new THREE.Vector3(...)              // allocation
const fromTarget = new THREE.Vector3(...)              // allocation
const toTarget = new THREE.Vector3(...)                // allocation
```

**6 new Vector3 × 60 fps = 360 garbage objects per second.**

Creates:

- GC spikes
- Micro-stutters
- Dropped frames
- Inconsistent FPS

### Fix: Hoist Temp Vectors

```tsx
// Module-scoped — allocated once, reused forever
const _position = new THREE.Vector3();
const _target = new THREE.Vector3();
const _fromPos = new THREE.Vector3();
const _toPos = new THREE.Vector3();
const _fromTarget = new THREE.Vector3();
const _toTarget = new THREE.Vector3();

// Inside useFrame — zero allocations
useFrame((_, delta) => {
  // Phase 2 example:
  _fromPos.copy(orbitCurve.getPointAt(1));
  _toPos.set(...CAMERA_PRESETS.meeting.position);
  _position.lerpVectors(_fromPos, _toPos, progress);

  _fromTarget.set(...ORBIT_TARGET);
  _toTarget.set(...CAMERA_PRESETS.meeting.target);
  _target.lerpVectors(_fromTarget, _toTarget, progress);

  camera.position.copy(_position);
  // ...
});
```

### 🔴 Bug in `CameraRig.tsx` — `CameraTracker`

```tsx
// Line 22 — new Vector3 every frame as fallback
const target = controlsRef.current?.target ?? new THREE.Vector3();
```

Fix:

```tsx
const _fallbackTarget = new THREE.Vector3();
// ...
const target = controlsRef.current?.target ?? _fallbackTarget;
```

---

## Rule #6: Stop Updating Static Objects

If an object doesn't move: **DO NOT TOUCH IT.**

Even tiny mutations matter at scale. Three.js marks objects dirty on any property write, triggering GPU re-uploads.

### Pattern

```tsx
useFrame(() => {
  if (!animating.current) return; // ← Early exit
  // ... expensive work
});
```

### Repo ✅

`CameraRig.tsx` does this correctly:

```tsx
useFrame(() => {
  if (!animating.current) return; // Skips when idle
  // ...lerp work
});
```

`IntroAnimation.tsx` also exits early:

```tsx
useFrame((_, delta) => {
  if (!startedRef.current || doneRef.current) return;
  // ...
});
```

---

## Rule #7: Remove CameraTracker in Production

`CameraTracker` runs `console.log` every frame when camera moves.

`console.log` is **extremely** expensive:

- String serialization
- Object formatting
- DevTools rendering
- Main thread blocking

### Fix

```tsx
export function CameraTracker({ controlsRef }) {
  if (!import.meta.env.DEV) return null; // Strip in production

  // Also: throttle to 4Hz instead of 60Hz
  const lastLog = useRef(0);
  useFrame(({ clock }) => {
    if (clock.elapsedTime - lastLog.current < 0.25) return;
    lastLog.current = clock.elapsedTime;
    // ...log
  });

  return null;
}
```

---

## Rule #8: Memoize Everything

Avoid recreating per render:

- Geometries
- Materials
- Vectors
- Arrays

### BAD

```tsx
function MyMesh() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} /> {/* new geometry each render */}
      <meshStandardMaterial color="red" /> {/* new material each render */}
    </mesh>
  );
}
```

### GOOD

```tsx
const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
const material = useMemo(
  () => new THREE.MeshStandardMaterial({ color: "red" }),
  []
);

function MyMesh() {
  return <mesh geometry={geometry} material={material} />;
}
```

Or for R3F JSX: components only re-create when props change, so the JSX form is fine IF the parent doesn't rerender.

---

## Rule #9: Avoid Garbage Collection Spikes

GC spikes create:

- Micro-stutters (5–20ms pauses)
- Dropped frames
- Inconsistent FPS

### Common Causes Inside useFrame

| Cause                | Example                      | Fix                     |
| -------------------- | ---------------------------- | ----------------------- |
| Object allocations   | `new Vector3()`              | Module-scoped temp      |
| Array every frame    | `[x, y, z]`                  | Reuse typed array       |
| Inline functions     | `() => {}` in useFrame       | Stable ref              |
| Temporary vectors    | `.normalize()` returning new | In-place `.normalize()` |
| String concatenation | Template literals for debug  | Remove from hot path    |

---

## Rule #10: CPU Is Often The Real Bottleneck

Especially in React apps. Not GPU.

Why? Because:

- React reconciliation
- useEffect cleanup/setup
- Event listeners
- Layout calculations
- State updates

All fight for the main thread — same thread as `useFrame`.

### Strategy

During animation-heavy phases:

- Freeze unnecessary app logic
- Pause analytics
- Pause intersection observers
- Delay heavy hooks
- Avoid `useEffect` that allocates memory or triggers layout

---

## Rule #11: useEffect Can Hurt FPS

Especially if effects:

- Allocate memory
- Trigger DOM layout
- Subscribe to frequent events
- Update React state

During intro animation:

```tsx
// BAD — subscribes during animation
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

// BETTER — defer until after intro
useEffect(() => {
  if (!introComplete) return;
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [introComplete]);
```

---

## Rule #12: Shader Animation > Mesh Animation

Vertex transforms (moving geometry) are expensive.

Sometimes cheaper:

- UV movement (scrolling textures)
- Shader wobble (vertex shader displacement)
- Texture scrolling (animated offset)

Instead of moving 10,000 vertices per frame → move 1 uniform value.

---

## Action Checklist

- [ ] Hoist temp Vector3 allocations in `IntroAnimation.tsx` to module scope
- [ ] Fix `CameraTracker` fallback `new Vector3()` to module-scoped const
- [ ] Gate `CameraTracker` behind `import.meta.env.DEV`
- [ ] Throttle `CameraTracker` logging to 4Hz
- [ ] Audit all `useFrame` callbacks for per-frame allocations
- [ ] Ensure all useFrame callbacks exit early when inactive
- [ ] Defer non-critical `useEffect` subscriptions until after intro
