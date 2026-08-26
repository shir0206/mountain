# Deploy Readiness — Results — 2026-08-25

Reviewed against [2026-08-25-deploy-readiness-checklist.md](2026-08-25-deploy-readiness-checklist.md). Every finding below was verified by actually running `yarn install`, `yarn build`, `yarn lint`, and grepping the source tree — not just re-stating old docs. Ordered by severity. Items marked **✅ Applied** were fixed in this same pass.

---

## 🔴 Blocking — fix before deploy

### 1. 86 MB of source assets shipped in every production build — ✅ Applied
`public/models/` (86 MB) was **not referenced anywhere** in `src/` — the app only uses `public/models_optimized/` (22 files, 2.9 MB, all referenced, verified 1:1). Vite copies `public/` verbatim into `dist/`, confirmed by an actual build:

```
dist/            93M
dist/models/      87M   ← 94% of the deploy, entirely dead
```

**Correction after listing the actual directory (not just the old audit doc's file list):** the original finding assumed `public/models/` still held the 91 unrelated marketplace-asset files described in [`../UNUSED_ASSETS.md`](../UNUSED_ASSETS.md) (`teapot.glb`, `chrysanthemum.glb`, etc.). It didn't — it actually held **13 files** with simple names (`mountain.glb`, `armchair.glb`, `pergola_structure.glb`, ...) that are the **pre-optimization source versions** of a subset of `models_optimized/`, kept intentionally for `scripts/optimize-models.sh`. Not dead junk — legitimate source material that just didn't belong in `public/`.

**Fix applied:** moved the 13 files to `src/assets/models/original/` (still 86 MB, still in the repo, no longer copied into any build). Updated `scripts/optimize-models.sh`'s `SRC_DIR` to the new path. Rebuilt — `dist/` dropped from 93 MB to 6 MB, `dist/models/` no longer exists. Updated [`../UNUSED_ASSETS.md`](../UNUSED_ASSETS.md) to correct the stale file list rather than leave it actively wrong.

### 2. `yarn lint` fails — 3 errors — ✅ Applied
`eslint-plugin-react-hooks@7`'s new `react-hooks/immutability` rule flagged idiomatic react-three-fiber code as errors:
- [Scene.tsx:76](../../src/presentation/Scene/Scene.tsx:76) — `camera.position.y = ...`
- [SceneBackground.tsx:30](../../src/presentation/Scene/SceneBackground/SceneBackground.tsx:30) — `gl.autoClear = false`
- [SceneBackground.tsx:37](../../src/presentation/Scene/SceneBackground/SceneBackground.tsx:37) — `bgCamera.aspect = ...`

These aren't bugs — mutating `three.js` objects returned from `useThree()`/passed to `useFrame()` is the standard r3f pattern, not React state. The rule doesn't know that.

**Fix applied:** added a scoped override in [eslint.config.js](../../eslint.config.js) disabling `react-hooks/immutability` for `src/presentation/Scene/**`, with a comment explaining why r3f mutation is intentional there. `yarn lint` now exits 0.

---

## 🟡 Should fix — real issues, not blocking a first deploy

### 3. ~~Production console spam from camera debug logging~~ — corrected, no fix needed
Original finding was wrong. [CameraRig.tsx](../../src/presentation/Scene/CameraRig/CameraRig.tsx) has two exports: `CameraTrackerDev` (contains the `console.log`) and the public `CameraTracker` wrapper, which returns `null` unless `import.meta.env.DEV` before ever rendering `CameraTrackerDev`. [Scene.tsx:106](../../src/presentation/Scene/Scene.tsx:106) renders the gated `CameraTracker`, not `CameraTrackerDev` directly — confirmed by grep, no other call site exists. The log is already dev-only. Moved here from "blocking" after re-reading the full file; no action taken.

### 4. Dual lockfiles can drift — ✅ Applied
Both `yarn.lock` and `package-lock.json` were committed. `package.json` pins `packageManager: yarn@1.22.22`, so `package-lock.json` was a leftover from an `npm install` at some point.

**Fix applied:** deleted `package-lock.json`. `yarn.lock` is the single source of truth.

### 5. No favicon, no meta description/Open Graph tags — partially applied
`index.html` had no `<link rel="icon">` and no `<meta name="description">` / OG tags.

**Fix applied (icon only):** added [public/favicon.svg](../../public/favicon.svg) — the "Shir" wordmark set in the site's own body font (Jost, weight 500, subsetted to 4 glyphs and embedded as a base64 `@font-face` inside the SVG so it renders identically everywhere, not dependent on the visitor having Jost installed), on the same dark/caramel-gold palette as the rest of the UI (`--color-dark-bg` / `--nav-icon-active` from `tokens.css`). Linked via `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` in [index.html](../../index.html) — verified the built `dist/index.html` correctly resolves it to `/mountain/favicon.svg` under the configured `base`.

**Not applied:** meta description / Open Graph tags — out of scope for this pass, still open.

### 6. Two unreferenced standalone HTML files at repo root — open, needs your call
- [shir.zabolotny.html](../../shir.zabolotny.html) (68 KB) — a standalone snapshot containing a hardcoded personal email, not linked from `index.html` or any source file.
- [loader.html](../../loader.html) (35 KB) — not referenced anywhere in `src/`; contains malformed/duplicated CSS (`}` repeated with no matching rules), reads like an abandoned experiment.

Neither is copied into `dist/` (they're outside `public/`), so they don't bloat the deploy — left as-is pending confirmation these aren't intentional backups.

### 7. Stale commented-out line in `App.tsx` — ✅ Applied
[App.tsx:69](../../src/App.tsx:69) had `// className={...isRTL(language)...}`, dead and superseded by the `dir` attribute on the next line. Removed.

---

## 🟢 Informational — verified clean, or low-priority polish

- **Type checking:** `tsc -b` passes with **zero errors** (re-verified after all fixes above).
- **No secrets/credentials** found in `src/` (checked for API keys, tokens, passwords). `.env*` is correctly git-ignored and none are committed.
- **No `@ts-ignore`, `@ts-expect-error`, `debugger`, or `TODO/FIXME/HACK`** left in `src/` — the DDD dead-code sweep described in [`../DDD_ALIGNMENT.md`](../DDD_ALIGNMENT.md) and the naming-convention backlog in [`../NAMING_CONVENTIONS.md`](../NAMING_CONVENTIONS.md) have **already been fully executed** — verified by grepping for every item they flagged (`AppState`, `useEnhancedAppContext`, `ANIMATION_CONFIG`, `UI_TIMING_CONFIG`, `windowState`, `navbarRef`, `getContactLinks`, `floatSpeed`/`floatIntensity`, `SectionComponent`): **zero matches**, current tree already matches the target `presentation/`/`context/`/`shared/` layout. Those two docs are historical records of finished work, not open issues — worth a one-line "✅ completed" note at the top so future readers don't re-investigate them.
- **`../UNUSED_ASSETS.md` was stale in two ways**, both corrected in this pass: its `public/models/` file list (91 marketplace filenames) didn't match what was actually on disk (13 differently-named source files — see #1), and its `favicon.svg`/`icons.svg` findings were already moot (`icons.svg` was gone from `public/` entirely; `favicon.svg` is now real and used, added in #5).
- **Six root-level `.md` files are byte-identical duplicates of files already in `docs/`:** `PERF_CAMERA_INTRO.md`, `PERF_GLB_OPTIMIZATION.md`, `PERF_USEFRAME_REACT.md`, `PERF_WEAK_MOBILE.md`, `USEEFFECT_AUDIT.md`, `INTRO_SYNC_PLAN.md` all exist both at the repo root and under `docs/`, `diff -q` confirms identical content. `docs/` is the canonical location (README and every cross-reference point there). Left as-is — didn't delete unasked, but this is a straightforward "pick one" cleanup whenever convenient.
- **`useEffect` audit** ([`../USEEFFECT_AUDIT.md`](../USEEFFECT_AUDIT.md)): all fixes described are present in the current code (verified `Loader`, `CameraRig`, `useScrollReveal`, `useScreenVisibility`). No open items.
- **Error boundary:** `App.tsx` wraps the whole tree in `ErrorBoundary` — good.
- **RTL:** `dir="rtl"/"ltr"` is applied dynamically on `.app-root` based on language, and all component CSS scopes correctly off `[dir="rtl"]`. Minor gap: `<html lang="en">` in `index.html` never updates to `he` when Hebrew is selected — cosmetic/SEO nit, not a functional issue since RTL layout itself works.
- **Bundle size:** single JS chunk is 1.24 MB (343 KB gzip) — Vite's own build warns about this. Not blocking for a portfolio site, but if load time matters, code-splitting the R3F/Three.js scene from the Browser UI (`React.lazy`) would help first paint.
- **Scripts directory:** `scripts/*.mjs` and `scripts/*.py` (asset-pipeline one-offs for specific models — desk, pergola, rug, etc.) aren't wired into any `package.json` script and have no README. They look like already-applied one-time migration scripts. Not urgent, but worth a short `scripts/README.md` noting which are still re-runnable vs. historical, so a future maintainer doesn't have to guess.
- **README.md** says "React 18 + TypeScript" but `package.json` pins React `^19.2.4` — stale, one-line fix.
- **No automated tests exist** in the project (no test runner configured). Acceptable for a portfolio site; flagging only because "future maintenance" was in scope — worth a conscious decision rather than an oversight.

---

## Suggested fix order (remaining)
1. Delete or relocate `shir.zabolotny.html` / `loader.html` (#6) once confirmed they're not needed.
2. Meta description / OG tags (#5, remainder) and `<html lang>` sync (informational) — cosmetic, batch whenever convenient.
3. Dedupe the six root-level `.md` files against their `docs/` copies (informational) — pick a canonical location, delete the other.
