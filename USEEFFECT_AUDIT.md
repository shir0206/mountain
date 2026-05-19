# useEffect & Re-render Audit — Summary of Changes

## Changes Made

### 1. Loader.tsx — useEffect eliminated ✅
**Before:** `Loader` received `onLoaded` callback, fired it inside a `useEffect` when `sceneReady` flipped. The callback was an inline arrow `() => setIsLoading(false)` — new ref every render, triggering needless effect re-fires (masked by a guard ref).

**After:** Extracted `AppContent` component that reads `sceneReady` directly from `useSceneContext()`. Loader renders when `!sceneReady` — no effect, no callback, no guard ref. Pure derived state.

**Files:** `src/App.tsx`, `src/presentation/Loader/Loader.tsx`

---

### 2. CameraRig.tsx — useEffect replaced with useFrame ✅
**Before:** A mount-only `useEffect` (with `eslint-disable`) snapped camera to initial preset. Redundant because the `useFrame` loop already existed and ran every frame.

**After:** Initial snap logic moved into `useFrame` behind the existing `snappedRef` guard. Runs on the first animation frame — guaranteed OrbitControls are mounted. No `useEffect`, no eslint suppression.

**File:** `src/presentation/Scene/CameraRig/CameraRig.tsx`

---

### 3. useScrollReveal.ts — containerRef removed from deps ✅
**Before:** `[ready, containerRef]` — `containerRef` is a `useRef` object whose identity never changes. It was noise that confused readers into thinking the effect was reactive to ref changes.

**After:** `[ready]` only, with explanatory comment.

**File:** `src/presentation/Browser/hooks/useScrollReveal.ts`

---

### 4. useSectionVisibility (useScreenVisibility.ts) — mergedConfig stabilized ✅
**Before:** `mergedConfig = { ...DEFAULT_CONFIG, ...config }` created a new object every render. This was in the useEffect dep array → scroll listener was torn down and re-attached on **every render**.

**After:** `mergedConfig` wrapped in `useMemo([config.threshold, config.passive])`. Also removed `contentRef` from deps (stable ref, same as #3).

**File:** `src/presentation/Browser/Navigation/hooks/useScreenVisibility.ts`

---

### 5. useTransitionState.ts — reviewed, kept as-is ✅
The double-rAF for entering and `setTimeout(EXIT_DURATION_MS)` for exiting is a standard mount/unmount choreography pattern (used by Radix, Headless UI). The hook has no DOM element access, so `transitionend` would require a ref parameter breaking the clean API. The timeout is correct here.

---

## Remaining useEffects (all legitimate)

| Hook | Dep Array | Why it's needed |
|------|-----------|-----------------|
| Browser.tsx focus management | `[isModalMode]` | Focus trap on modal open/close — must be reactive |
| useBodyScrollLock | `[active]` | Locks/unlocks body scroll — lifecycle side-effect |
| useEscapeKey | `[handler]` | Keydown event listener — must attach/detach |
| useFocusTrap | `[active, containerRef]` | DOM focus cycling — lifecycle |
| useHtmlReady | `[...]` | Bridge between HTML iframe and React state |
| useScrollReveal | `[ready]` | IntersectionObserver — DOM subscription |
| useSectionVisibility | `[ready, markVisible, mergedConfig]` | Scroll listener — DOM subscription |
| ShaderWarmup | `[]` | One-shot GPU warmup on mount |

---

## Anti-patterns Addressed

- **Unstable objects in dep arrays** → `useMemo` (useSectionVisibility)
- **Stable refs in dep arrays** → removed (useScrollReveal, useSectionVisibility)
- **useEffect for derived state** → replaced with conditional render (Loader)
- **useEffect for initialization that could run in frame loop** → moved to useFrame (CameraRig)
- **Inline callbacks as effect deps** → eliminated callback chain entirely (Loader/App)