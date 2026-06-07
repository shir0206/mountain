# Current Lighting Analysis

---

## 1. BACKGROUND MOUNTAIN

### Light Source Direction
- **No visible sun disk** — fully overcast sky with a dense stratocumulus cloud layer
- Light is diffused uniformly from above, with the brightest zone centered slightly left-of-center in the sky, suggesting the sun is hidden behind clouds at roughly **10–11 o'clock azimuth** (slightly left overhead)
- No defined light directionality on mountain faces — purely **ambient dome lighting**
- Foreground rocks receive marginally more light than the mountain flanks, consistent with top-down diffuse fill

### Color Palette
| Element | Approximate Hex | Notes |
|---|---|---|
| Sky / cloud base | `#8898A8` | Cool blue-gray, desaturated |
| Cloud highlights | `#C4CDD4` | Slightly warm white where thicker |
| Far mountain ridges | `#7A8878` | Muted sage-gray, aerial haze |
| Mid-range mountain slopes | `#6B7A50` | Muted olive-green |
| Snow on peaks | `#E0E8EC` | Cool white with slight blue cast |
| Foreground rocks | `#8A7A6A` | Warm earthy gray, highest saturation in scene |
| Valley grass | `#8A9055` | Desaturated yellow-green |

### Season
- **Late Spring / Early Summer**
- Snow persists above treeline on all major peaks — temperatures recently cold
- Valley floors are vegetated with green/tawny grass and shrubs — not frozen
- No autumn leaf coloration; vegetation reads as fresh but sparse
- Patchy snowmelt patterns visible on lower slopes confirm the transitional season

### Time of Day
- **Late morning to early midday (~10:00–13:00)**
- Light angle is near-overhead (no long shadows, no warm golden tones)
- Overcast conditions make precise time difficult, but the diffuse intensity and neutral color temperature (~**6200–6800K**) are consistent with midday under cloud cover
- No warm horizon color that would indicate morning or evening

### Shadow Quality
- **Extremely soft, near-absent hard shadows**
- Cloud cover acts as a giant softbox — zero sharp shadow terminator lines anywhere on the mountains
- Mountain crevices and rock faces show only faint gradients, not deep cast shadows
- Contrast across the entire background is low — approximately **1.5–2 stops** of dynamic range in the mountain zone
- No specular highlights anywhere on rock or snow

### Atmospheric Depth (Aerial Perspective)
- **Strong, well-defined aerial perspective** present across multiple depth planes:
  - **Foreground rocks** (~5m): High saturation, warm earth tones, maximum sharpness
  - **Mid mountains** (~1–3 km): Medium saturation, greens visible but muted
  - **Far peaks** (~5–10 km): Significantly desaturated, shifted to blue-gray, reduced contrast
  - **Horizon mountains**: Nearly monochromatic blue-gray, merging with sky tone
- Haze is **cool and blue**, consistent with moist mountain air (not dry desert haze)
- This aerial perspective is the primary depth cue in the scene — without it the image would appear flat

### Cloud Lighting
- **Flat underlit stratocumulus** — no dramatic top-lighting or silver lining
- Cloud base appears as a near-uniform gray ceiling with subtle brighter zones where the cloud layer is thinner
- No crepuscular rays, no god-rays, no backlit cloud edges
- Cloud texture is visible in the upper portion — soft volumetric rolls with low internal contrast
- The clouds create a **neutral light wrap** effect — light comes from essentially 180° of the upper hemisphere

### Snow Reflectance
- Snow patches show **cool-tinted diffuse reflectance** (~`#DCE4E8`)
- No specular "blowout" — the diffuse sky prevents hotspots
- Snow in crevices is slightly blue-shadowed (`#B8C4CC`) showing subtle self-shadowing
- Snow acts as a **secondary fill light** for surrounding rock faces — you can see slight brightening on rock immediately below snowfields
- Reflectance is physically plausible for **wet spring snow** (albedo ~0.5–0.7), not fresh powder (which would be brighter)

---

## 2. PERGOLA MODEL

### Light Source Direction
- **Two apparent sources — one natural, one artificial:**
  1. **Ambient diffuse from above** — matching the overcast sky (accounts for the overall soft fill on wood surfaces)
  2. **Warm artificial point light** near the left desk area — visible as a warm glow emanating from the circular wall fixture (star/moon decoration) and pooling light on the desk surface
- The warm light source appears positioned at **~2.5m height on the left interior wall**
- The right half of the pergola receives noticeably less warm light — it falls off toward the lounge area, which is lit by cooler, flatter ambient only
- There is **no dominant sunbeam or directional outdoor shaft of light** entering the structure

### Color Palette
| Element | Approximate Hex | Notes |
|---|---|---|
| Wood structure (lit faces) | `#C4883A` | Warm amber-honey |
| Wood structure (shadowed faces) | `#8A5C28` | Deep warm brown |
| Roof underside | `#6A4820` | Dark warm brown — AO |
| Floor | `#3C3228` | Dark charcoal-brown concrete |
| Furniture upholstery | `#E0D4A0` | Warm cream-ivory |
| Hanging plant (left) | `#8B9A3A` | Warm yellow-green |
| Palm (right) | `#4A6832` | Cooler mid-green |
| Wall fixture glow | `#F0E0A0` | Warm yellow-white |

### Color Temperature Mismatch
- **Critical observation:** The pergola has a color temperature of approximately **3800–4500K** (warm amber)
- The background sky/mountain reads at approximately **6200–6800K** (cool overcast)
- This is a **~2000–3000K mismatch** — the model and background environment are lit with different color temperatures
- This inconsistency creates a subtle but noticeable composite feel: the pergola looks like it belongs to a different scene or lighting time than the mountains behind it

### Season (Aesthetic Intent)
- The warm amber wood tones and lush plants suggest a **summer/warm season** aesthetic intent
- This conflicts slightly with the cold overcast background suggesting late spring
- No environmental season cues on the pergola itself (no snow accumulation, no frost, no dead plants)

### Time of Day (Aesthetic Read)
- The presence of a warm artificial interior light source suggests either:
  - **Evening/dusk** — when interior lights become prominent relative to fading natural light
  - **Interior ambiance design** — independent of outdoor time-of-day
- The background reads as **midday overcast** but the pergola reads as **late afternoon / evening ambiance**
- This temporal mismatch compounds the color temperature inconsistency noted above

### Shadow Quality
- Shadows on the pergola are **soft and diffuse**, consistent with overcast sky lighting
- The roof beam structure casts only faint shadow gradients on the floor — no sharp stripe patterns
- The vertical posts have very gentle shadow falls with wide penumbra
- The underside of the roof canopy is darkened by **ambient occlusion** — the contact shadows between beams are appropriately deep
- Floor shadow from the structure perimeter is barely distinguishable — blends into the dark floor material
- **Right side of the structure is noticeably darker** than the left — the warm artificial light does not reach it, and the cool ambient alone gives it a colder, flatter feel

### Atmospheric Depth on Model
- The pergola sits in the **near foreground** — full color saturation, maximum perceived sharpness
- No atmospheric haze is applied to the model itself
- The **transition from pergola to background mountain is abrupt** — there is no aerial haze gradient bridging the two, which is another indicator of a composited/rendered scene
- A real scene would show slight haze even between 0–20m depth

### Artificial vs. Natural Light Interaction
- The warm artificial point light (desk area) does not appear to cast proper light bounce onto the background or floor near the right side
- Light falloff from the point source is moderate — visible effect extends ~3–4m from source
- The floor does not show a warm light pool — the floor is uniformly dark, suggesting the artificial light contributes more to the wall/wood warm tone than it does ground illumination
- The monitor screen at the desk has its own emissive glow (cool blue), creating a **tertiary, cooler micro-light source** that competes slightly with the warm wall fixture

### Snow Reflectance
- N/A — no snow on or around the pergola
- However, the mountain snow visible in the background **does not appear to reflect onto the pergola** — there is no cool blue fill light from the snow field that would be expected in a real environment

---

## Summary: Key Lighting Discrepancies (Composite Analysis)

| Factor | Background Mountain | Pergola Model | Consistency |
|---|---|---|---|
| Color Temperature | ~6500K cool | ~4000K warm | ❌ Mismatch |
| Light Source | Overcast diffuse dome | Warm point light + ambient | ❌ Different sources |
| Time of Day Read | Midday | Late afternoon/evening | ❌ Mismatch |
| Shadow Softness | Extremely soft | Soft (matches) | ✅ Consistent |
| Aerial Perspective | Strong | None applied | ⚠️ Expected gap |
| Season | Late spring | Summer ambiance | ⚠️ Slight mismatch |
| Snow Fill Light Bounce | Present on rocks | Not received by model | ❌ Missing interaction |

**Conclusion:** The background and pergola model are visually and physically inconsistent in their lighting setups. The background is a real photographic plate with cool overcast midday lighting, while the pergola is a 3D render with a warm artificial light rig that does not match the environment. To achieve cohesion, the pergola would need: (1) a cooler color temperature shift toward ~6000K, (2) removal or subduing of the warm point light, (3) subtle blue-gray fill from the mountain snow, and (4) a slight aerial haze layer at the far edge to bridge the foreground/background transition.
