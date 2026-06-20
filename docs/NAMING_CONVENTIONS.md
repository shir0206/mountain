# Naming Conventions & Code Consistency

> **Goal:** Strict, clear naming across the codebase. Readable without extra explanation. A new developer should understand intent from names alone.

---

## Core Principles

1. **Clarity over brevity** — verbose is fine, cryptic is not.
2. **No abbreviations** — `button` not `btn`, `navigation` not `nav`, `modal` not `mdl`, `message` not `msg`, `configuration`/`config` not `cfg`, `index` not `idx`, `position` not `pos`, `target` not `tgt`, `material` not `mat`, `segment` not `seg`, `event` not `e`.
3. **Names reflect intent and meaning** — `calculateCameraDistance` not `calc`.
4. **Consistency beats personal preference.**

---

## JavaScript / TypeScript

### Variables & Functions — `camelCase`

| ✅ Good | ❌ Bad |
|---|---|
| `handleOpenModal` | `openMdl`, `oM` |
| `contactLinks` | `cLinks`, `cl` |
| `activeSection` | `sec`, `s` |

### Booleans — prefix with `is` / `has` / `should` / `can`

| ✅ Good | ❌ Bad |
|---|---|
| `isOpen` | `open`, `opened` |
| `hasAccess` | `access` |
| `shouldAnimate` | `animate` |
| `canScroll` | `scroll` |

### Functions — start with a verb

| ✅ Good | ❌ Bad |
|---|---|
| `calculatePosition` | `position`, `pos` |
| `scrollToSection` | `section` |
| `handleClickButton` | `click`, `onBtn` |

Handlers:
- `handle*` for internal component handlers (`handleSubmit`)
- `on*` for props that receive handlers (`onSubmit`)

### Constants — `UPPER_SNAKE_CASE` only for **true** constants

True = literal values known at authoring time, never re-assigned, not derived from runtime.

| ✅ Good | ❌ Bad |
|---|---|
| `MAX_RETRY_COUNT` | `maxRetryCount` (if truly constant) |
| `SECTIONS`, `PRESET_BUTTONS` | `sections` (if module-level static list) |
| `const user = useUser()` | `const USER = useUser()` |

### React Components — `PascalCase`

| ✅ Good | ❌ Bad |
|---|---|
| `NavigationMenu` | `navigationMenu`, `navigation_menu` |
| `SceneButton3D` | `sceneBtn3D` |

### Types & Interfaces — `PascalCase`

`ContactLink`, `DeviceContextValue`, `NavigationItem`. No `I` prefix.

### Loop / callback parameters — no single letters

```ts
// ❌
items.map((i, x) => …)
array.map((b) => b.key)
onClick={(e) => …}

// ✅
items.map((item, index) => …)
buttons.map((button) => button.key)
onClick={(event) => …}
```

Exception: `(a, b) => a - b` in a sort comparator is acceptable. `x`, `y`, `z` for 3D coordinates is acceptable.

---

## CSS

### Class names — `kebab-case`, semantic, descriptive, no abbreviations

| ✅ Good | ❌ Bad |
|---|---|
| `primary-button` | `btn-primary`, `btnPrimary` |
| `navigation-container` | `nav`, `.n` |
| `popup-overlay` | `pop`, `overlay-pop` |
| `window-control-close` | `close-btn` |

### State — use `is-*` / `has-*` classes or `data-*` attributes. **NEVER BEM.**

```css
/* ❌ BEM — forbidden in this project */
.popup--visible { … }
.button--active { … }
.browser__header { … }

/* ✅ state class */
.popup.is-visible { … }
.button.is-active { … }
.navigation.is-scrolled { … }

/* ✅ or data-attribute */
.popup[data-visible="true"] { … }
```

Rules:
- **No `--` modifiers.** No `__` element separators.
- State classes begin with `is-` or `has-` (`is-open`, `is-scrolled`, `has-error`).
- Structural sub-parts use their own descriptive kebab-case name (`.navigation-link`, `.browser-header`, `.window-control`), not `block__element`.

### Forbidden

- Single-letter class names (`.t`, `.x`).
- Unjustified shorthands (`.btn`, `.nav`, `.hdr`, `.pop`).
- BEM `--` or `__` separators.
- `@keyframes` in PascalCase or camelCase — use kebab-case (`@keyframes fade-in`, not `FadeIn` or `fadeIn`).

### CSS Custom Properties

Kebab-case. Design-system t-shirt sizes are acceptable (`--space-sm`, `--font-size-lg`) because they are industry-standard.

---

## File Naming

Per-category (consistent within each category):

| Type | Convention | Example |
|---|---|---|
| React components `.tsx` | `PascalCase` | `NavigationMenu.tsx` |
| Component-scoped CSS | `PascalCase` (match component) | `NavigationMenu.css` |
| Hooks `.ts` | `camelCase`, `use` prefix | `useScrollNavigation.ts` |
| Services / utils / adapters | `camelCase` | `computeActiveSection.ts`, `language.ts` |
| Configs | descriptive `camelCase` | `cameraPresets.ts`, `browserConfig.ts` |
| Types files | `types.ts` or `*.types.ts` | `types.ts` |
| Global CSS | `kebab-case` | `tokens.css`, `index.css` |
| Folders for components | `PascalCase` | `LanguageSwitcher/` |

**Filename must match default/primary export.** `Lighting.tsx` must export `Lighting`, not `PostRainSummerLighting`.

**Rationale for PascalCase components:** React ecosystem convention; file name matches exported component name; tools, linters and IDEs assume it. This overrides the general "kebab-case for files" preference.

Avoid generic names like `config.ts` or `utils.ts` — prefer descriptive (`browserConfig.ts`, `phoneValidator.ts`).

---

## Enforcement

1. Refactor existing violations (see backlog below).
2. Review every new PR against this document.
3. Reject ambiguous names at code review.
4. (Optional) Add lint rules:
   - `@typescript-eslint/naming-convention`
   - `stylelint` with a rule banning `--` and `__` in class selectors

---

## Refactor Backlog (verified against current codebase, 2026-05)

### TypeScript / TSX — abbreviations & single-letter params

| File | Current | → Suggested |
|---|---|---|
| `src/presentation/Scene/Model/applyMaterialPolicy.ts` (L21) | `root.traverse((obj) => …)` + `obj as Mesh` | `(child) => …` |
| `src/presentation/Scene/Model/applyMaterialPolicy.ts` (L28,31) | `mat`, `mats` | `material`, `materials` |
| `src/presentation/Scene/Model/applyMaterialPolicy.ts` (L32) | `mats.forEach((m) => …)` | `materials.forEach((material) => …)` |
| `src/presentation/Scene/Model/applyMaterialPolicy.ts` (L52) | `maps.forEach((t) => …)` | `(texture) => …` |
| `src/presentation/Scene/IntroAnimation/IntroAnimation.tsx` (L18,69,75,90) | `easeInOutCubic(t)`, local `t` | `easeInOutCubic(progress)`, `progress` |
| `src/presentation/Scene/IntroAnimation/IntroAnimation.tsx` (L64–104) | `pos`, `tgt`, `fromPos`, `toPos`, `fromTgt`, `toTgt` | `position`, `target`, `fromPosition`, `toPosition`, `fromTarget`, `toTarget` |
| `src/presentation/Scene/IntroAnimation/IntroAnimation.tsx` | `segElapsed` | `segmentElapsed` |
| `src/presentation/Scene/config/introChoreography.ts` (L41) | `seg` | `segment` |
| `src/presentation/Scene/CameraRig/CameraRig.tsx` (L21,25–47) | `pos`, `lastPos` | `position`, `lastPosition` |
| `src/presentation/Browser/Sections/Contact/hooks/useContactLinks.ts` (L63–75) | `cfg` | `calendarConfig` |
| `src/presentation/Scene/LoaderOverlay/LoaderOverlay.tsx` (L12) | `clearTimeout(t)` | `clearTimeout(timeoutId)` |
| `src/presentation/Browser/Navigation/LanguageSwitcher/LanguageSwitcher.tsx` (L80,95) | `(e) => handleOptionKeyDown(e, …)` | `(event) => handleOptionKeyDown(event, …)` |
| `src/presentation/Browser/Browser.tsx` (L46) | `(e) => e.stopPropagation()` | `(event) => event.stopPropagation()` |

### CSS — kebab-case, no BEM, keyframes kebab-case

| File | Current | → Suggested |
|---|---|---|
| `LanguageSwitcher.css:113` | `@keyframes MoveUpDown` | `@keyframes move-up-down` |
| `LanguageSwitcher.css:123` | `@keyframes Flip` | `@keyframes flip` |
| `LanguageSwitcher.css:71,108` + `LanguageSwitcher.tsx` | `.language-switcher.open`, `[data-open="true"]` | `.language-switcher.is-open` (+ update className in tsx) |
| `Navigation.css` + `Navigation.tsx` (L46) | `.nav-link` | `.navigation-link` |
| `Navigation.css` + `Navigation.tsx` (L40) | `${isScrolled ? "scrolled" : ""}` | `is-scrolled` class |
| `Browser.css:83,162` + `BrowserHeader.tsx` (L36,43,50) | `.control-btn`, `.close-btn`, `.minimize-btn`, `.maximize-btn`, `.browser-container.maximized` | `.window-control`, `.window-control-close`, `.window-control-minimize`, `.window-control-maximize`, `.browser-container.is-maximized` |
| `Overview.css:39` | `.dot` (too short) | `.skill-dot` |

### Files / Exports

| Current | Issue | → Suggested |
|---|---|---|
| `src/shared/i18n/Language.ts` | util module in PascalCase | `src/shared/i18n/language.ts` (update 3 import sites) |
| `src/presentation/Scene/Lighting/Lighting.tsx` | exports `PostRainSummerLighting` — name ≠ filename | rename export to `Lighting`; update `Scene.tsx` import |

---

## Validation Checklist

- [ ] No abbreviations (`btn`, `nav`, `mdl`, `msg`, `cfg`, `idx`, `tmp`, `pos`, `rot`, `tgt`, `mat`, `seg`, `obj`, `len`, `pts`).
- [ ] No single-letter callback params except `(a, b)` in sort comparators and `x`/`y`/`z` for 3D.
- [ ] All booleans prefixed `is` / `has` / `should` / `can`.
- [ ] All functions start with a verb.
- [ ] No BEM `--` / `__` in any CSS selector.
- [ ] All state expressed via `is-*` / `has-*` classes or `data-*` attributes.
- [ ] All `@keyframes` in kebab-case.
- [ ] All CSS class names kebab-case, semantic, no abbreviations.
- [ ] Component file name matches exported component PascalCase.
- [ ] No generic `config.ts` / `utils.ts` — use descriptive names.
- [ ] A new developer can read any file top-to-bottom without asking "what does this mean?"
