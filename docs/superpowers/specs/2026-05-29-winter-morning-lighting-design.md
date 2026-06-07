# Winter Morning Lighting Design

**Date:** 2026-05-29
**Branch:** mobile_design

## Goal

Shift the scene atmosphere from "post-rain summer" to "warm winter morning sunshine under dramatic cloudy sky" — matching the reference image: golden-amber sun raking in from a low morning angle, cool blue-grey cloud fill in shadows, dry winter earth bounce.

## Reference

The provided reference image shows:
- Layered dramatic clouds, cool blue-grey at top, warm peach near ridgeline
- Single strong warm golden sun hitting from screen-right at a low morning angle
- Raking highlights on wood grain surfaces
- Cool blue sky bounce filling shadow sides
- Long morning shadow direction

## Files Changed

### `src/presentation/Scene/Lighting/Lighting.tsx`

All lighting values updated for winter morning atmosphere.

| Light | Property | Old | New | Reason |
|---|---|---|---|---|
| `ambientLight` | color | `#fff1d6` | `#d8e8f0` | Cooler winter sky tint |
| `ambientLight` | intensity | 0.55 | 0.35 | Darker winter ambient |
| `hemisphereLight` | sky color | `#fff4dc` | `#8eb8d8` | Cool blue-grey cloud cover |
| `hemisphereLight` | ground color | `#b89878` | `#b8966a` | Dry winter earth |
| `hemisphereLight` | intensity | 1.2 | 0.85 | Less ambient sky energy |
| Primary sun | color | `#fff8e8` | `#ffd070` | Warm golden-amber morning |
| Primary sun | intensity | 4.0 | 5.5 | Stronger single source |
| Primary sun | position | `[-19.95, -5, -1.54]` | `[25, 8, -10]` | Low morning angle from screen-right |
| Secondary sun | color | `#ffe3b8` | `#b8d0f0` | Becomes cool sky fill, not second warm sun |
| Secondary sun | intensity | 2.5 | 0.8 | Subtle fill only |
| Cool fill | color | `#dfeaff` | `#c0d8f0` | Slightly cooler |
| Cool fill | intensity | 0.6 | 0.5 | Slightly reduced |
| Interior lamps | unchanged | — | — | Point lights stay warm as contrast |

**Key design decision:** The secondary directional was previously a second warm sun competing with the primary. Converting it to a cool-blue low-intensity fill creates the warm-highlight / cool-shadow contrast that defines the reference image's look.

### `src/presentation/Scene/SceneBackground/SceneBackground.tsx`

Swap EXR from `background.exr` → `bell_park_dawn_4k.exr` to get the dramatic layered cloud sky visible in the reference.

```
const EXR_PATH = "textures/bell_park_dawn_4k.exr";
```

> If `bell_park_dawn_4k.exr` doesn't match the cloud drama, revert to `background.exr` and rely on lights alone — the lighting changes will still deliver the warm/cool contrast regardless of the sky texture.

## Out of Scope

- No changes to shadow camera frustums, bias, or map sizes
- No changes to interior point lights (they remain warm as-is — that contrast is intentional)
- No new EXR files needed
- No changes to any other scene components
