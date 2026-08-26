# Deploy Readiness Checklist — 2026-08-25

Audit checklist for shipping this repo to production (GitHub Pages via `yarn deploy`). Written before the review pass — see [2026-08-25-deploy-readiness-results.md](2026-08-25-deploy-readiness-results.md) for findings against each item.

## 1. Build & Type Safety
- [ ] `tsc -b` completes with zero errors
- [ ] `vite build` completes with zero errors
- [ ] No `@ts-ignore` / `@ts-expect-error` masking real type errors
- [ ] Build output (`dist/`) contains only what should ship

## 2. Lint & Code Quality
- [ ] `yarn lint` passes with zero errors/warnings
- [ ] No `eslint-disable` comments without justification
- [ ] No leftover `debugger` statements
- [ ] No stale commented-out code blocks

## 3. Dead Code
- [ ] No unused exports, types, or components (cross-check prior refactor docs against current tree)
- [ ] No unreferenced files at repo root or in `src/`
- [ ] No duplicate/superseded config or context objects

## 4. Unused Assets & Bundle Weight
- [ ] Every file under `public/` is referenced somewhere in `src/` or `index.html`
- [ ] `public/` size in `dist/` is proportional to what's actually used (no dead binaries shipped)
- [ ] JS bundle size is reasonable; large chunks are code-split where feasible
- [ ] `favicon` / site icons present and linked

## 5. Console & Debug Output
- [ ] No unconditional `console.log`/`console.debug` left running in production code paths
- [ ] Dev-only diagnostics are gated behind `import.meta.env.DEV`

## 6. Security & Secrets
- [ ] No API keys, tokens, or credentials committed in source
- [ ] No `.env` files committed; `.gitignore` covers env files
- [ ] No PII/hardcoded personal contact data outside intended contact-config files

## 7. Error Handling
- [ ] Top-level `ErrorBoundary` wraps the app
- [ ] No unreachable/dead error branches (`throw`-only paths treated as normal control flow)

## 8. i18n / Accessibility
- [ ] `dir`/RTL handling is consistent for supported languages
- [ ] `<html lang>` reflects the active language (or documented as a known gap)
- [ ] Meta description / Open Graph tags present for the public-facing page

## 9. Deploy Configuration
- [ ] `vite.config.ts` `base` path matches the actual deploy target
- [ ] `yarn deploy` (`gh-pages -d dist`) publishes only `dist/`
- [ ] Only one lockfile is authoritative (no drift between `yarn.lock` / `package-lock.json`)

## 10. Dependency Hygiene
- [ ] All `dependencies`/`devDependencies` are actually used
- [ ] `packageManager` field matches the lockfile actually used in CI/dev

## 11. Documentation Hygiene
- [ ] Planning/audit docs in `docs/` reflect current code (or are marked historical/resolved)
- [ ] `README.md` architecture section matches the real `src/` tree
