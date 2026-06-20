# CSS Refactoring & Design Tokens — Plan

## 1. Audit Findings

**Scope:** 9 CSS files, 1511 lines total.

| File                                                                        | Lines |
| --------------------------------------------------------------------------- | ----- |
| `src/index.css`                                                             | 108   |
| `src/App.css`                                                               | 8     |
| `src/presentation/Browser/Browser.css`                                      | 525   |
| `src/presentation/Browser/Navigation/Navigation.css`                        | 160   |
| `src/presentation/Browser/Navigation/LanguageSwitcher/LanguageSwitcher.css` | 165   |
| `src/presentation/Browser/Sections/Overview/Overview.css`                   | 158   |
| `src/presentation/Browser/Sections/About/About.css`                         | 107   |
| `src/presentation/Browser/Sections/Service/Service.css`                     | 146   |
| `src/presentation/Browser/Sections/Contact/Contact.css`                     | 134   |

### 1.1 Unused tokens (defined, never used)

In `index.css`: `--text`, `--text-h`, `--border`, `--code-bg`, `--accent-border`, `--social-bg`, `--shadow`, `--heading`, `--mono`, and the entire `prefers-color-scheme: dark` block.

### 1.2 Undefined tokens referenced (broken)

In `Browser.css`: `--black`, `--dusty-olive`, `--ash-grey`, `--lilac-ash`, `--platinum`.

### 1.3 Dead CSS (classes/keyframes not used in any `.tsx`)

- `Browser.css`: `.section`, `.section-1..6`, `.scroll-indicator`, `.scroll-arrow`, `.two-column`, `.column`, `.profile-pic`, `.contact-links`, `@keyframes swap`, global `h1`/`h2` overrides.
- `App.css`: `.counter` (entire file unused).
- `index.css`: global `code`, `.counter`, dark-mode styles.

### 1.4 Hardcoded value clusters

**Colors — Sage/Olive:** `#a8b3a5`, `#7fa573`, `#2d3319`, `rgba(120,128,97,0.06..0.15)`, `rgba(170,180,173,0.08..0.2)`.

**Colors — Blush:** `#e2c4c1`, `hsl(5,36%,82%)`, `rgba(190,173,175,0.08..0.18)`.

**Colors — Cream/Surface:** `#f5f5f0`, `#f6f7f3`, `rgb(246 247 244)`, `rgba(236,237,238,0.7..0.95)`, `#fff`, `white`.

**Colors — Text:** `#000`, `#1a1a1a`, `#111827`, `#1f2937`, `#2d3319`, `#333`, `#374151`, `#666`, `#6b7280`, `#72757e`.

**Colors — Traffic lights:** `#ff605c`, `#ffbd44`, `#00ca4e`.

**Font sizes (mixed units):** px → 10, 14, 15, 16, 18, 20, 22, 24, 28, 36, 48, 56. rem → 0.95, 1, 1.125, 1.25, 1.35, 1.5, 1.75, 2, 3.5, 3.75, 4.5.

**Spacing:** 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 80, 100 (+ rem variants).

**Radius:** 4, 5, 6, 8, 12, 16, 50%.

**Shadows:** 4 distinct variants.

**Media queries (target: mobile + desktop only):** currently 480, 640, 768, 1024 → collapse to single `768px` (matches `DEVICE_DETECTION_CONFIG.mobileViewportThreshold`).

**Font families:** 3 variants → 2 tokens (sans + serif).

**Animations:** `swap` (unused), `draw-circle`, `draw`, `MoveUpDown`, `Flip`.

---

## 2. Unit Strategy

| Category                         | Unit                                | Why                                                                                                                       |
| -------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Font sizes                       | `rem`                               | Respects user OS/browser accessibility scaling. Single source (`html` root).                                              |
| Spacing / padding / margin / gap | `rem`                               | Scales proportionally with type.                                                                                          |
| Radius                           | `rem` (semantic) / `px` (hairlines) | Small fixed shapes stay crisp.                                                                                            |
| Borders, shadow offsets          | `px`                                | Visual chrome, shouldn't scale with font.                                                                                 |
| Fixed UI dots (traffic lights)   | `px`                                | Fixed 12px circles.                                                                                                       |
| Media-query breakpoints          | `px`                                | Stable threshold regardless of root font-size.                                                                            |
| Viewport height                  | `svh` (fallback `vh`)               | **Mobile URL bar fix** — `svh` = small viewport, excludes dynamic URL bar space, no layout jump/cutoff when bar retracts. |
| Viewport width                   | `svw` (fallback `vw`)               | Consistency with `svh`.                                                                                                   |
| Fluid widths                     | `%` + `max-width` in `rem`          | Flexible without breaking readability.                                                                                    |

**`em` reserved** for element-local scaling (icon inside a button, `line-height`). Not for global use — compounds unpredictably.

**URL-bar problem:** on mobile Safari/Chrome, `100vh` includes space behind the retracting URL bar → jump/cutoff. Solution:

```css
height: 100vh; /* fallback for pre-2022 browsers */
height: 100svh; /* modern: small viewport height */
```

Browser support for `svh`/`lvh`/`dvh`: Safari 15.4+, Chrome 108+, Firefox 101+ (≈97% global).

Current `vh`/`vw` sites to migrate: `Browser.css` (`90vh`, `70vh`, `90vw`, `95vw`, `max(500px,90vh)`), `Contact.css` (`65vh`), `Overview.css` (`75vh`).

**Root baseline:** `html { font-size: 100% }` (= 16px). Remove current `:root { font: 18px/145% ... }` override (breaks user prefs). Body: `font: 400 1rem/1.45 var(--font-sans)`.

---

## 3. Design Tokens

Create `src/styles/tokens.css`, import once in `main.tsx`.

```css
:root {
	/* Brand */
	--color-sage: #a8b3a5;
	--color-sage-strong: #7fa573;
	--color-sage-deep: #2d3319;
	--color-olive-15: rgba(120, 128, 97, 0.15);
	--color-blush: #e2c4c1;

	/* Surfaces */
	--color-cream: #f5f5f0;
	--color-cream-alt: #f6f7f3;
	--color-surface: #ffffff;
	--color-surface-glass: rgba(236, 237, 238, 0.75);
	--color-surface-glass-header: rgba(236, 237, 238, 0.7);
	--color-border: rgba(120, 128, 97, 0.15);
	--color-border-soft: #e0e0e0;

	/* Text */
	--color-text: #1f2937;
	--color-text-strong: #111827;
	--color-text-muted: #6b7280;
	--color-text-subtle: #72757e;
	--color-text-inverse: #ffffff;

	/* Traffic lights */
	--color-close: #ff605c;
	--color-minimize: #ffbd44;
	--color-maximize: #00ca4e;

	/* Typography */
	--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	--font-serif: Georgia, "Times New Roman", serif;

	--font-size-xs: 0.875rem; /* 14 */
	--font-size-sm: 1rem; /* 16 */
	--font-size-md: 1.25rem; /* 20 */
	--font-size-lg: 1.5rem; /* 24 */
	--font-size-xl: 1.75rem; /* 28 */
	--font-size-2xl: 2.25rem; /* 36 */
	--font-size-3xl: 3rem; /* 48 */
	--font-size-4xl: 3.5rem; /* 56 */

	--font-weight-light: 300;
	--font-weight-regular: 400;
	--font-weight-medium: 500;
	--font-weight-bold: 700;

	--line-height-tight: 1.2;
	--line-height-base: 1.6;
	--line-height-loose: 2;

	/* Spacing (rem, 4px base) */
	--space-xs: 0.25rem; /* 4 */
	--space-sm: 0.5rem; /* 8 */
	--space-md: 1rem; /* 16 */
	--space-lg: 1.5rem; /* 24 */
	--space-xl: 2.5rem; /* 40 */
	--space-2xl: 3.75rem; /* 60 */
	--space-3xl: 5rem; /* 80 */

	/* Radius */
	--radius-sm: 0.25rem; /* 4 */
	--radius-md: 0.5rem; /* 8 */
	--radius-lg: 0.75rem; /* 12 */
	--radius-xl: 1rem; /* 16 */
	--radius-pill: 50%;

	/* Shadow */
	--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.07);
	--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08), 0 12px 24px rgba(0, 0, 0, 0.12);
	--shadow-lg: 0 20px 60px rgba(5, 9, 4, 0.15);
	--shadow-dropdown: 0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.1);

	/* Motion */
	--transition-fast: 0.2s ease;
	--transition-base: 0.3s ease;
}
```

**Media query convention:**

- Default styles = desktop.
- `@media (max-width: 768px)` = mobile.

---

## 4. Typography Hierarchy

| Element               | Family | Size              | Weight  |
| --------------------- | ------ | ----------------- | ------- |
| h1 / `.overview-name` | serif  | `--font-size-4xl` | regular |
| h2 / section titles   | serif  | `--font-size-3xl` | regular |
| h3 / card title       | serif  | `--font-size-lg`  | medium  |
| body                  | sans   | `--font-size-md`  | light   |
| caption / nav         | sans   | `--font-size-sm`  | medium  |

---

## 5. File-by-File Changes

1. **Create** `src/styles/tokens.css`; import in `main.tsx` before `index.css`.
2. **`index.css`** — strip dead tokens, dark-mode block, unused global `h1/h2/code`; keep `#root`/`body` reset only, refer to tokens.
3. **`App.css`** — delete (unused).
4. **`Browser.css`** — tokenize; delete `.section*`, `.scroll-*`, `.two-column`, `.column`, `.profile-pic`, `.contact-*` duplicates, `@keyframes swap`, nested `h1/h2/p/ul`; collapse 768 + 480 MQs → single `768px`.
5. **`Navigation.css`** — merge 480 into 768; tokenize.
6. **`LanguageSwitcher.css`** — collapse 480 → 768; tokenize.
7. **`Overview/About/Service/Contact.css`** — collapse 640/768/1024 → single 768; tokenize; dedupe font-family declarations.

---

## 6. Validation

- `grep` script: every `--token-*` must be referenced ≥1×; every class in `.css` must appear in a `.tsx` (report offenders).
- `yarn build` passes.
- Visual snapshot desktop (≥769px) + mobile (≤768px).

### 6.1 Results

- **Tokens removed (0 usage):** `--color-olive-15`, `--color-text-inverse`, `--font-size-xs`, `--font-size-2xl`, `--line-height-tight`, `--line-height-loose`.
- **Classes removed (0 usage):** `.button-icon`, `.icon` (renamed `.control-icon` in `Browser.css` to match `BrowserHeader.tsx`).
- **Remaining token offenders:** none.
- **Remaining class offenders:** none (false positive `js` = `/* Three.js */` comment).
- **`yarn build`:** ✅ CSS 16.78 kB → 16.46 kB.
- **`yarn test`:** N/A (no test script in `package.json`).

- Task Checklist

- [x] Audit & inventory
- [ ] Create `src/styles/tokens.css` + import in `main.tsx`
- [ ] Refactor `index.css`
- [ ] Delete `App.css`
- [ ] Refactor `Browser.css`
- [ ] Refactor `Navigation.css` + `LanguageSwitcher.css`
- [ ] Refactor `Overview/About/Service/Contact.css`
- [x] Unify typography

- [ ] Collapse media queries to single 768px
- [ ] Validate (no unused tokens/classes, build + visual)
