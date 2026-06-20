# Floating Browser / Popup Experience — Plan

## Context

- Rendered via drei `<Html>` inside the 3D scene → `src/presentation/Browser/Browser.tsx`.
- Four modes via `browserMode` (`PortfolioProvider`): `open | minimized | maximized | closed`.
- Styling: `src/presentation/Browser/Browser.css`; design tokens in `src/styles/tokens.css`.
- Current gaps:
  - No semi-transparent overlay / backdrop behind the popup.
  - No body scroll lock while popup is open.
  - Transitions only cover size/opacity — no proper enter/exit choreography.
  - Mobile is not near full-screen (95vw only).
  - Maximized removes border-radius entirely (jarring).
  - Minimized collapses via `max-height` only; content remains mounted/measurable.
  - No `Esc` to close, no focus management, no `role="dialog"`.

## Key Architectural Decision

The Browser today is mounted via drei's `<Html>` (world space, anchored to the monitor).
A centered floating modal with overlay + viewport centering needs a **fixed DOM layer outside the Canvas**.

**Chosen approach:** keep mode-driven rendering from a single source of truth (`browserMode`), but
split the render tree:

| Mode        | Render target                                        | Purpose                          |
| ----------- | ---------------------------------------------------- | -------------------------------- |
| `closed`    | `null`                                               | Fully unmounted                  |
| `minimized` | Existing `<Html>` (world-anchored)                   | Dock feel, pinned to monitor     |
| `open`      | `createPortal(<BrowserShell/>, #browser-root)`       | Centered floating modal          |
| `maximized` | `createPortal(<BrowserShell/>, #browser-root)`       | Near full-screen modal           |

Portal target `#browser-root` lives in `index.html` (sibling to `#root`), so overlay and popup are
truly viewport-relative and unaffected by Three/Canvas transforms.

## Steps

### 1. Layout & Positioning

- [ ] Add `<div id="browser-root"></div>` to `index.html` (sibling of `#root`).
- [ ] In `Browser.tsx`, branch on `browserMode`:
  - `closed` → render nothing.
  - `minimized` → current `<Html>` path.
  - `open | maximized` → `createPortal(<BrowserShell/>, document.getElementById("browser-root"))`.
- [ ] `BrowserShell` root: `position: fixed; inset: 0; display: grid; place-items: center;`.
- [ ] Container sizing:
  - Desktop open: `min(960px, 92vw) × min(640px, 80svh)`.
  - Maximized: `96vw × 92svh`.
  - Mobile: `100vw × 100svh` (near full-screen).

### 2. Overlay & Background

- [ ] New `.browser-overlay`:
  ```css
  position: fixed;
  inset: 0;
  background: rgba(15, 17, 20, 0.45);
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  ```
- [ ] Click on overlay → `useClosePortfolio()`.
- [ ] Popup container keeps `onClick={stopPropagation}` (already present).
- [ ] ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at header title id.
- [ ] Basic focus management: move focus to first window-control on open; restore previous focus on close.

### 3. Popup Styling

- [ ] Keep glass surface: `var(--color-surface-glass)` + `backdrop-filter: blur(20px)`.
- [ ] Border radius:
  - Open: `var(--radius-xl)`.
  - Maximized: `var(--radius-lg)` (instead of `0`) — retains modern modal feel.
  - Mobile: `0` (full-screen edge-to-edge).
- [ ] Shadow: `var(--shadow-lg)` in portal modes; `var(--shadow-md)` when minimized.
- [ ] Spacing: header `--space-md --space-lg`; content padding stays per-section.
- [ ] 1px inner hairline border `var(--color-border)` for edge definition on glass.

### 4. Scroll Behavior

- [ ] `.browser-content` retains `overflow-y: auto`; add `overscroll-behavior: contain` and
      `touch-action: pan-y` to prevent iOS rubber-band / scroll chaining to the page.
- [ ] New hook `useBodyScrollLock(active: boolean)`:
  - On `active=true`: save `document.body.style.overflow` + `scrollY`, set `overflow: hidden`,
    freeze position via `top: -scrollY` (iOS-safe).
  - On `active=false` / unmount: restore style + scroll position.
- [ ] Wire from `Browser.tsx`: active when `browserMode === open || maximized`.

### 5. Responsiveness

- [ ] Desktop (≥ 769px): centered modal, rounded, shadowed.
- [ ] Tablet (481–768px): width `min(720px, 94vw)`, height `min(680px, 86svh)`.
- [ ] Mobile (≤ 480px): `width:100vw; height:100svh; border-radius:0;`.
  - Visual drag-handle affordance at top (4×40px pill) — decorative only for v1.
  - Header sticks to top; content scrolls beneath.
- [ ] Maximized variant unchanged on mobile (already edge-to-edge).
- [ ] Minimized: keep `42px` dock; only header receives pointer-events.

### 6. Transitions

Replace single blanket `transition: ...` with split, composable transitions:

- [ ] Overlay:
  - enter: `opacity 200ms ease-out`
  - exit: `opacity 160ms ease-in`
- [ ] Popup:
  - enter: `opacity 220ms ease-out, transform 260ms cubic-bezier(.2,.8,.2,1)`
  - start: `opacity:0; transform: scale(.96) translateY(8px);`
  - end:   `opacity:1; transform: scale(1) translateY(0);`
- [ ] Mode transitions (open ↔ min ↔ max): continue animating `width/height/max-height/border-radius`
      with `var(--transition-base)`; ensure no `border-radius` jump between modes.
- [ ] Driver: small `useTransitionState(browserMode)` helper that emits
      `data-state="entering" | "entered" | "exiting" | "exited"` on the overlay + shell so CSS
      selectors target states (avoids AnimatePresence dependency).
- [ ] Respect `@media (prefers-reduced-motion: reduce)`: disable `transform` transitions; keep fade.

### 7. Verification (each must be proven)

- [ ] Open: overlay + popup fade/scale in; focus lands inside dialog; body scroll locked.
- [ ] Close (button, overlay click, `Esc`): overlay + popup fade/scale out; focus restored;
      body scroll restored to exact previous `scrollY`.
- [ ] Minimize ↔ Open: smooth collapse to header dock and back; no layout jump; content remains.
- [ ] Maximize ↔ Open: size/radius transitions smoothly; no radius snap to 0.
- [ ] Mobile Safari: `100svh` correct (address bar aware); overlay tap closes; no background scroll.
- [ ] Keyboard: `Esc` closes; `Tab` cycles within the dialog.
- [ ] `prefers-reduced-motion`: no transforms, fades only.
- [ ] `yarn test` green.

## Files to Touch

- `index.html` — add `<div id="browser-root"></div>`.
- `src/presentation/Browser/Browser.tsx` — portal branch, ARIA, `Esc` handler, scroll lock wiring.
- `src/presentation/Browser/Browser.css` — overlay, responsive breakpoints, transitions, per-state rules.
- `src/presentation/Browser/hooks/useBodyScrollLock.ts` — new.
- `src/presentation/Browser/hooks/useEscapeKey.ts` — new (close on `Esc`).
- `src/presentation/Browser/hooks/useTransitionState.ts` — new (mode → `data-state`).
- `src/presentation/Browser/hooks/useFocusTrap.ts` — new (basic focus trap for dialog).

## Tests to Add

- `src/presentation/Browser/Browser.test.tsx`
  - Renders nothing when `browserMode=closed`.
  - Renders overlay only when `open | maximized`.
  - Overlay click fires `useClosePortfolio`.
  - `Esc` closes dialog.
  - `document.body.style.overflow === "hidden"` while open; restored on close.
  - Focus moves into dialog on open; returns to previously focused element on close.
- `src/presentation/Browser/BrowserHeader/BrowserHeader.test.tsx`
  - Minimize button toggles `open ↔ minimized`.
  - Maximize button toggles `open ↔ maximized`.
  - Close button dispatches `closed` and clears visible sections.

## Out of Scope

- Redesign of section content (About, Service, Contact, Overview).
- Drag / resize of popup.
- Multiple concurrent popups.
- Route-driven open state.

## Rollout Order

1. Add portal target + `BrowserShell` split (no style change).
2. Overlay + body scroll lock + `Esc` + focus.
3. Transition states + `data-state` driven CSS.
4. Responsive breakpoints (mobile full-screen).
5. Tests → `yarn test`.
6. Manual verification checklist (section 7).
