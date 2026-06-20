# GitHub Pages Deploy Fix (Vite)

For this project, the error is usually **not** your `.glb` files.

The browser message appears when a module script URL points to a non-JS file (or missing file), and GitHub Pages returns it as `application/octet-stream` or a fallback page.

## Most Common Cause

You deployed the repository source instead of the Vite build output.

If `index.html` on Pages still contains:

```html
<script type="module" src="./src/main.tsx"></script>
```

then deployment is wrong for production.

## Correct Setup

This repo already has:
- `vite.config.ts` with `base: "/mountain/"`
- deploy to `dist` via `gh-pages`

Use this flow every time:

```bash
npm run deploy
```

`predeploy` now runs `npm run build` automatically, then publishes `dist`.

## Verify It Worked

1. Open your live site.
2. DevTools -> `Network`.
3. Open the first `index-*.js` request under `/mountain/assets/`.
4. Confirm `Content-Type` is JavaScript (`text/javascript` or `application/javascript`).

## GLB Note

`.glb` files are fetched as assets, not as module scripts.  
So this specific error message points to a JS/module URL problem first, not GLB MIME.
