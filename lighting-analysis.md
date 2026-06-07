# Lighting Analysis Report — Mountain Pergola Render

**Image:** Alpine open-air pergola workspace on a rocky cliff, with a dramatic mountain valley backdrop.  
**Type:** Architectural CGI render (photorealistic, likely rendered with a physical sky model + HDRI + manual lights).  
**Date of analysis:** 2026-05-30

---

## Methodology

This report treats the render as a physical photograph and reads lighting cues the same way a cinematographer or lighting director would: shadow direction and hardness, highlight placement, colour temperature shifts between lit and unlit surfaces, atmospheric effects, and the seasonal/ecological state of the environment. Because this is a CGI render, the analysis also notes artefacts that reveal the render setup (e.g., ambient occlusion baking, specular probe reflections, artificial light contributions).

The two subjects below are analysed **completely independently** — as if each were a separate photograph.

---

## Part A — Background Mountain

*Treat as if the pergola did not exist and you are looking at a landscape photograph only.*

### Overview

The mountain range dominates the upper two-thirds of the composition. A central rocky ridge rises steeply from a deep valley; flanking slopes are heavily vegetated at lower elevations and bare grey limestone above the treeline. Residual snow sits only at the highest summit ridges. The sky is active: deep blue at the zenith, fresh cumulus clouds building over the peaks.

---

### 1. Light Direction

The primary light source (sun) is positioned **upper-left from the viewer's perspective**, at an azimuth suggesting **southeast** (roughly 120–140° from true north) and an **elevation of approximately 30–45°** above the horizon.

Evidence:
- The **left-facing slopes** of the central ridge are strongly illuminated — rock surfaces show a near-white highlight value.
- The **right-facing cliff walls** fall into cool, deep shadow.
- The shadow terminator (lit/unlit boundary) runs diagonally from upper-left to lower-right across the rock faces, consistent with a sun that is high enough to clear the ridgeline but not yet overhead.
- The **valley floor** far below is in partial shadow, suggesting the valley walls are intercepting the low-angle sun from the right side of the scene.

**Light vector (approximate):** From upper-left, ~35° elevation, striking surfaces that face southwest.

---

### 2. Colour Temperature & Palette

| Zone | Colour | Approximate K |
|---|---|---|
| Sky zenith | Deep saturated blue | ~10000 K (sky) |
| Sky mid | Clear medium blue | ~8000 K |
| Horizon sky | Pale cyan-white | ~6500 K |
| Cloud tops (direct sun) | Bright white with warm edge | ~6000 K |
| Cloud undersides | Warm grey (#B0AAA0) | — |
| Sun-lit rock faces | Cool white-grey with slight gold | ~5800–6200 K |
| Shadow rock faces | Cool blue-grey (#7A8A96) | ~7500 K (sky fill) |
| Lit grassy slopes | Warm yellow-green (#8FAD5A) | — |
| Shaded grassy slopes | Cooler, deeper green (#4A6A3A) | — |
| Valley floor / river | Very pale blue-green (#C8D5CC) | — |

**Overall:** The mountain palette is a cool, high-key scene dominated by blue and blue-grey values in the shadows with clean neutral-warm light on sun-exposed surfaces. No golden-hour warmth; the sun reads as a neutral-to-slightly-warm white.

---

### 3. Shadow Quality

- **Direct sun shadows** on rock faces are **semi-hard** — edges are defined but carry a narrow soft penumbra, caused by the large apparent sky dome acting as a secondary fill (altitude increases sky subtended angle vs. sea level).
- **Ambient fill** is strongly blue-sky-dominant: shadowed cliff walls are lit by the open blue sky overhead, producing the characteristic cool blue fill light of alpine environments.
- **Atmospheric softening** increases with distance — foreground rocks have crisp local shadow contrast; mid-distance slopes show softer, lower-contrast shadows due to light scattering between camera and subject.

---

### 4. Atmospheric Depth (Aerial Perspective)

The mountain demonstrates clear **Rayleigh scattering (aerial perspective)**:

- Foreground cliff rocks: high saturation, high contrast, full value range.
- Mid-distance peak: slightly desaturated, slightly lighter.
- Far valley floor: very pale, almost monochromatic blue-green — depth of several kilometres is encoded in the progressive desaturation and lightening toward the horizon.

This is a key lighting cue: the valley appears to be **3–10 km deep**, and the haze confirms clear alpine air (no smoke/industrial haze — scattering is purely molecular, yielding the clean blue rather than grey-brown of lower altitudes).

---

### 5. Cloud Lighting

The cumulus clouds are lit in a **three-layer fashion**:

1. **Top surfaces** — direct sun, bright white, slightly warm on the uppermost convective towers.
2. **Side faces** — transitional mid-grey, side-lit by scattered sky.
3. **Undersides** — flat warm grey, lit by reflected light bouncing off the mountain slopes below.

The cloud build-up pattern (fresh, vertically developed, not yet anvil-shaped) is characteristic of **morning alpine convection**: the mountains heat in the morning sun, triggering upward air movement that forms cumulus. This is a strong time-of-day indicator.

---

### 6. Snow Reflectance

The small residual snow patches at the summit ridge are lit by direct sun and act as **secondary cold reflectors**:
- They throw a faint cool specular bounce onto the north-facing rock walls directly below them.
- Their presence (only patches, not full coverage) confirms the season is past peak snowmelt.

---

### 7. Season

**Late summer (July–August in the Alps):**

| Indicator | Observation |
|---|---|
| Snow coverage | Only summit-level patches; mid/lower slopes fully clear |
| Vegetation | Dense, fully developed green cover on lower slopes |
| Vegetation colour | Pure green — no yellowing, browning, or autumn colour |
| Cumulus build-up | Active — consistent with late-summer thermals |
| Light angle | Not extremely low — past spring equinox geometry |

---

### 8. Time of Day

**Mid-morning: approximately 09:00–11:00 local solar time**

| Indicator | Observation |
|---|---|
| Sun elevation | ~30–45° — above horizon but not near zenith |
| Shadow length | Moderate — present but not extremely long |
| Light colour | Neutral white — past the golden warmth of early morning |
| Cloud state | Fresh cumulus — morning convection just beginning |
| Valley shadow | Valley floor partially shaded — sun not yet high enough to fully illuminate the valley |

---

## Part B — Pergola / Architectural Model

*Treat as if the mountain backdrop did not exist and you are looking at an architectural product photograph only.*

### Overview

A large open-air wooden pergola structure in unfinished light pine. It houses a workstation on the left and a round meeting table with lounge chairs on the right. The roof is an open grid of horizontal and vertical timber slats. A linear pendant lamp hangs above the meeting table. Two tall potted trees flank the interior. The floor is a large-format tile.

---

### 1. Light Sources (All Sources)

This is a **multi-source composite** scene. From most dominant to least:

| Priority | Source | Type | Direction | Colour Temp |
|---|---|---|---|---|
| 1 | Direct sun | Hard, distant | Upper-left, ~35–45° elevation | ~5500–6000 K |
| 2 | Sky dome / diffuse sky | Soft, omnidirectional bias toward zenith | Above and all open sides | ~7000–8000 K |
| 3 | Mountain face bounce | Very soft, large-area | From the right/background | Cool green-grey |
| 4 | Pendant lamp | Soft, local downlight | Directly downward above table | ~2800–3000 K |
| 5 | Monitor screens | Very soft, local | Facing toward viewer | ~6500 K cool blue |

---

### 2. Primary Light Direction (Sun)

The sun enters the pergola from the **upper-left**, consistent with the mountain analysis.

Evidence within the pergola:
- **Floor shadow bars** from the roof slats run diagonally from upper-left to lower-right at approximately **35–45° from vertical** — this angle directly encodes sun elevation and azimuth.
- The **left-facing vertical posts** are brightly lit on their left face; their right face is in shadow.
- The **workstation desk** left surface is brightly lit; the monitor stands in partial self-shadow.
- The **meeting table** is partly in shadow from roof beams but receives sky dome fill from above through the open grid.

**Light vector:** From upper-left, entering the structure at a ~35–45° angle, most intense on southwest-facing surfaces.

---

### 3. Colour Temperature Analysis

#### 3a. Direct Sunlight (~5500–6000 K)
The sun-lit surfaces show the wood's true warm gold tone. Lit beam faces read **warm amber-gold**, approximately `#C8A96E` to `#D4B07A`. Floor tiles in direct sun stripes read **terracotta-warm beige**. This is a slightly warm neutral daylight — not the orange of golden hour, not the blue-white of overcast.

#### 3b. Sky Dome Fill (~7000–8000 K)
The open roof grid allows substantial sky fill from directly overhead. Horizontal top surfaces of every beam are **slightly cooler and brighter** than their vertical faces. Shaded beam undersides read **cool tan-greige** `#9E9080` — visibly cooler than the sun-lit faces. This cool-warm alternation is the primary visual rhythm of the structure.

#### 3c. Mountain Face Bounce (cool green-grey)
The massive open mountain face to the right acts as a **giant bounce card**. Right-facing structural posts and the right side of the meeting chairs carry a **subtle cool green-grey tint** — the mountain's green grass and grey rock reflected as a large-area low-intensity fill. This is the dominant fill source for all surfaces facing right (away from the sun).

#### 3d. Pendant Lamp (~2800–3000 K)
The linear suspension pendant above the round table emits a warm, incandescent-quality downlight. Observable effects:
- **Warm circular halo** on the table surface directly beneath the pendant.
- **Warm gradient on nearest posts** — the closest left and right posts show a subtle warm blush on their faces closest to the lamp.
- Creates a **domestic / workspace warmth** that counterbalances the cool exterior light, giving the space a liveable feel despite the open alpine setting.

#### 3e. Monitor Screens (~6500 K)
The dual monitors on the left workstation emit a faint **cool blue ambient glow** onto the desk surface immediately in front of them. This is a very low-intensity tertiary source but confirms the render models screens as emissive surfaces with material properties.

---

### 4. Wood & Material Colour Response

| Surface | Condition | Colour |
|---|---|---|
| Structural posts — sun-lit face | Direct sun | Warm gold `#C8A96E` |
| Structural posts — shaded face | Sky fill | Cool greige `#9E9080` |
| Roof beams — top face | Sky dome | Pale tan `#BBA882` |
| Roof beams — underside | Ambient occlusion + fill | Dark greige `#7A7060` |
| Floor tiles — sun stripe | Direct sun | Warm beige `#C4B090` |
| Floor tiles — shadow stripe | Sky fill | Cool grey `#9A9A98` |
| Desk surface | Partial sun | Warm honey `#C09A60` |
| Round table top | Pendant + sky fill | Neutral warm `#B89A70` |
| Jute rug | Diffuse only | Warm tan, no specular |

---

### 5. Shadow Quality

- **Structural beam shadows (hard):** The roof slat shadow bars on the floor are **sharp-edged** — the sun is a compact source at this solar elevation, producing well-defined cast shadows. Edge sharpness would soften at lower elevations (larger angular sun disk apparent size).
- **Foliage shadows (soft):** The two potted trees cast **soft, dappled shadows** — leaf translucency scatters and diffuses transmitted light, breaking up the hard geometric shadows of the structure.
- **Ambient occlusion (AO):** Strongest in beam-to-post joints, ceiling grid intersections, and where furniture legs meet the floor. AO gives the render its convincing three-dimensional depth — these dark contact shadows prevent the elements from floating.
- **Self-shadowing:** Posts shadow their own base plates. The monitors shadow the desk below their bottom edge.

---

### 6. Specular & Reflective Observations

- **Monitor screens:** Catch a faint skylight reflection — confirms screens are modelled as physically based surfaces (PBR glass/specular material) rather than fully emissive planes.
- **Table surface:** Shows a low-intensity soft specular reflection of the overhead beam grid — confirming a slightly polished or sealed wood finish.
- **Tile floor:** Very subtle gloss — wet-look polish visible in the long strips of direct sun, nearly matte in shadow.
- **Pendant lamp housing:** Metallic finish — small tight specular highlight from direct sun confirms metal/chrome or brushed steel material.

---

### 7. Floor Shadow Pattern & Sun Angle Decoding

The parallel shadow bars from the roof slats allow a geometric reading of sun angle:

- Shadow bars cross the floor at approximately **35–45° from the floor's left edge**.
- Bar width vs. gap ratio is approximately **1:1.5** (shadow slightly narrower than light stripe) — consistent with slat spacing and a solar elevation that still casts meaningful shadows rather than stacking them directly below.
- If the bars were vertical (perfectly aligned with the slats), the sun would be directly overhead. Their diagonal confirms the sun is **not at zenith**, supporting the mid-morning reading.

---

### 8. Sky Dome Contribution to Interior

The pergola's open roof grid means the interior is bathed in **diffuse sky fill from all open sides and directly above**. This produces:
- Relatively even ambient fill on all upward-facing surfaces.
- Cool-blue tint on surfaces facing upward (sky colour).
- Minimal fill on downward-facing surfaces (beam undersides, table underside) — these rely only on bounce from the floor and low-angle mountain reflection.

---

### 9. Season

**Late summer — matching the mountain analysis:**

| Indicator | Observation |
|---|---|
| Potted trees | Full leaf canopy, no yellowing |
| Outdoor alpine plants at base | Lush, in growth phase |
| Light intensity | High — long day, bright direct sun |
| Plant health visual | Peak summer vigour |

---

### 10. Time of Day

**Mid-morning: approximately 09:00–11:00 local solar time**

| Indicator | Observation |
|---|---|
| Shadow bar angle | ~35–45° — not overhead, not near-horizontal |
| Light colour | Neutral white, no orange/golden warmth |
| Pendant light visible | On, suggesting the interior still benefits from supplemental light |
| Overall scene mood | Bright, energetic, productive — morning workspace atmosphere |

---

## Part C — Cross-Subject Comparison

*How the two lighting environments relate, interact, and differ.*

| Dimension | Background Mountain | Pergola Model |
|---|---|---|
| **Sun azimuth** | Upper-left, ~SE | Upper-left, ~SE — consistent |
| **Sun elevation** | ~30–45° | ~35–45° — consistent |
| **Primary colour temp** | ~5800–6200 K | ~5500–6000 K — consistent |
| **Sky fill colour** | Cool blue | Cool blue-teal, slightly warmer inside due to wood bounce |
| **Shadow hardness** | Semi-hard (landscape scale, distant softening) | Hard (architectural detail scale) |
| **Secondary sources** | Snow bounce (cold), valley haze | Pendant lamp (warm), mountain bounce (cool-green), monitors (cool blue) |
| **Season** | Late summer | Late summer — fully consistent |
| **Time of day** | 09:00–11:00 | 09:00–11:00 — fully consistent |
| **Atmospheric effects** | Strong aerial perspective | Minimal within structure; haze visible through open sides |

**Key interaction at the boundary:**  
The mountain backdrop acts as a fill light for the pergola interior. The green-grey mountain face, being several hundred metres tall and filling the entire right and background opening of the pergola, is effectively a massive area light source. It provides a **cool, desaturated green-grey fill** to all pergola surfaces facing it — a unique lighting interaction that only exists because of the specific placement of the structure on the cliff edge. This mountain-fill is what keeps the right side of the pergola readable without heavy shadow, even though the sun comes from the left.

---

## Summary Master Table

| Attribute | Background Mountain | Pergola Model |
|---|---|---|
| **Light direction** | Upper-left, SE azimuth, ~30–45° elevation | Upper-left, SE azimuth, ~35–45° elevation |
| **Primary colour temp** | 5800–6200 K (neutral cool-white sun) | 5500–6000 K (neutral warm-white sun) |
| **Sky fill temp** | ~8000–10000 K (blue) | ~7000–8000 K (cool blue, partly warmed by wood bounce) |
| **Secondary sources** | Snow cold-bounce, sky dome | Pendant 2800–3000 K, mountain bounce, monitors 6500 K |
| **Shadow hardness** | Semi-hard with atmospheric softening | Hard structural + soft foliage |
| **Atmospheric depth** | Strong aerial perspective (Rayleigh) | Minimal inside; visible in openings |
| **Season** | Late summer (July–August Alps) | Late summer — full foliage, lush growth |
| **Time of day** | Mid-morning, 09:00–11:00 | Mid-morning, 09:00–11:00 |
| **Dominant palette** | Blue sky, cool grey rock, warm green grass | Warm gold wood, cool grey shadow, warm pendant halo |
| **Overall mood** | Clean, crisp, alpine morning grandeur | Warm productive workspace, dual-temperature contrast |

---

*Analysis by Claude Code — 2026-05-30*
