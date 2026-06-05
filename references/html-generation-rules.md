# HTML Generation Rules

V3 is HTML-first. HTML is the visual source of truth because it supports layout fidelity, motion, inspection, and later export.

## Output Model

Prefer a single self-contained `index.html` when possible.

Use a small folder only when needed for user-approved content images, generated images, fonts, or media:

```text
deck-output/
  index.html
  assets/
    images/
    fonts/
  profile/
    design-profile.json
```

Reference images used for style extraction must not be copied into `assets/images/` unless the user explicitly marks them as content.

For user-approved content images, generated images, or replaceable slots, follow [Image Asset Strategy](image-asset-strategy.md).

## Fixed Stage

Every deck must use a fixed 16:9 internal slide stage:

```text
Stage: 1920 x 1080
Viewport: scales the whole stage uniformly
No internal responsive reflow
No scrolling inside a slide
```

Use CSS/JS to scale:

```css
:root {
  --stage-w: 1920;
  --stage-h: 1080;
}

.viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--outside-bg);
}

.stage {
  width: 1920px;
  height: 1080px;
  position: relative;
  transform-origin: center center;
}
```

The scale script should use:

```js
const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
stage.style.transform = `scale(${scale})`;
```

Slide switching should use `visibility`, `opacity`, and `pointer-events`; avoid `display:none` if it can conflict with layout CSS.

## Design Tokens

Compile Design DNA into tokens before writing slides:

```css
:root {
  --bg: #f8f7f2;
  --surface: #ffffff;
  --ink: #111111;
  --muted: #6b7280;
  --accent: #6ee7f9;
  --accent-2: #f0abfc;
  --font-heading: "font from DNA";
  --font-body: "font from DNA";
  --radius: 28px;
  --line: rgba(17,17,17,.14);
  --shadow: none;
}
```

Rules:

- one dominant background system per deck
- one main accent per slide unless the DNA explicitly supports multicolor
- font families must match the DNA mood and language
- token values come from Design DNA, not arbitrary per-slide taste
- negative constraints are enforced in CSS and layout choices
- text/surface pairs must be explicit, readable, and reused consistently

Add surface-pair tokens for readability:

```css
:root {
  --surface-light: #f6f7f8;
  --surface-light-ink: #101114;
  --surface-dark: #080a0f;
  --surface-dark-ink: #ffffff;
  --surface-accent: #0877ff;
  --surface-accent-ink: #ffffff;
  --surface-muted: #dfe7ef;
  --surface-muted-ink: #111827;
}
```

Do not use white text on pale cards, pale blue panels, pale gray blocks, or light image areas. A card background and card text color must always be chosen as a pair.

## Layout From Page Specs

Do not freestyle slides from one prompt. Render from Page Specs.

Every slide should declare:

```html
<section class="slide" data-page="04" data-layout="process-flow" data-density="balanced">
```

Map layout archetypes to concrete zones:

- cover_hero
- section_divider
- single_big_claim
- split_text_image
- data_hero
- three_point_argument
- process_flow
- timeline
- comparison
- quote
- image_grid
- chart_explanation
- formula_walkthrough
- closing_takeaway

If a Page Spec does not fit the selected archetype, change the archetype or split the slide. Do not shrink text below the minimum.

Each Page Spec must also declare visual safety fields:

- safe_zones
- no_text zones
- image_or_visual_role
- empty_slot_fallback
- text_surface_pairs
- z_index_plan
- collision_exclusions

See [Visual Safety Rules](visual-safety-rules.md).

## Image And Visual Slot Policy

Do not create a default right-side image placeholder. A visual zone is allowed only when it has a purpose and appears in the Page Spec or Image Asset Strategy.

Reference images are style evidence only and must not be copied into the deck unless the user explicitly marks them as content.

If approved content images exist, use one of the display modes defined in [Image Asset Strategy](image-asset-strategy.md), such as:

- `hero_bleed`
- `object_focus`
- `screenshot_frame`
- `evidence_frame`
- `evidence_card`
- `image_grid`
- `editorial_cutout`
- `background_texture`
- `inline_thumbnail`

If no approved content image exists, use one of these alternatives:

- typographic visual
- CSS/SVG diagram
- material object derived from Design DNA
- intentional whitespace
- image-generation prompt only after user approval

Never render blank boxes, plus signs, or "drop image here" areas in final slides.

If the user wants later-replaceable images, prefer a stable `image-manifest` plus CSS fallback visuals. Show visible designed placeholders only when the user asks for editable slots, and make those placeholders follow the active Design DNA rather than a generic gray frame.

## Motion And Effects

Motion must express the Design DNA and deck purpose.

Use meaningful recipes:

- minimal/premium: soft reveal, slow mask, small movement, calm transitions
- cyber/tech: controlled glow pulse, scanline, grid reveal, numeric count-up
- editorial/magazine: image crop reveal, title wipe, staggered captions
- academic/report: low-motion fade, diagram build, chart highlight
- toy/3D/friendly: gentle floating, soft scale, playful but restrained object motion

Avoid:

- the same fade-up on every slide
- motion that delays comprehension on dense evidence slides
- decorative particles that compete with text
- motion intensity that contradicts the selected adapter strategy

Include `prefers-reduced-motion` support and a low-motion fallback.

## Visual Richness Without Templates

Good HTML decks need visual assets or visual systems. If no content images are provided, use CSS-generated visuals derived from the DNA:

- large typographic compositions
- grid systems
- diagrams
- abstract shapes
- material panels
- CSS gradients only when the DNA supports them
- SVG or CSS data visualizations
- generated images only with explicit user approval or when the deck needs them

Do not use generic decorative blobs, purple-gradient defaults, or repeated card walls unless the DNA specifically calls for them.

## Readability Invariants

Minimums at 1920x1080:

- main body: 28px preferred, 24px absolute floor
- captions/labels: 20px preferred, 18px absolute floor
- chart labels: 20px floor
- formula text: 28px preferred

## Typography Spacing And Text Stack Safety

Prevent text from looking squeezed while keeping the deck compact. Spacing must be based on the **visual bounds** of the text, not only the CSS line box.

Common failures to prevent:

- English descenders such as `g`, `y`, `p`, `q`, `j` touch the next line or subtitle.
- Large Chinese title lines visually collide because ultra-bold fonts have tall glyphs.
- Stroke, shadow, glow, or offset duplicate text expands the title but the layout does not reserve space for it.
- A subtitle starts too close to a thick divider line or a huge display title.
- Mixed Chinese and Latin text uses one line-height that is too tight for one script.

Baseline rules at 1920x1080:

| Text role | Font size range | Line-height | Minimum gap after block |
|---|---:|---:|---:|
| huge display title | 132-220px | 0.92-1.04 | 44-72px |
| CJK huge display title | 132-220px | 0.98-1.10 | 48-76px |
| outlined / shadowed title | 96-180px | 1.02-1.14 | 56-88px |
| section title | 72-120px | 1.05-1.16 | 34-56px |
| subtitle / lead | 34-54px | 1.22-1.38 | 24-40px |
| body paragraph | 28-40px | 1.36-1.55 | 18-30px |
| label / badge | 20-32px | 1.12-1.28 | 14-24px |

Rules:

- Never use `line-height < 0.98` for Chinese display text.
- Never use `line-height < 1.02` when text has stroke, thick shadow, glow, duplicate offset layers, or cartoon/pop treatment.
- If a display title has `-webkit-text-stroke`, `text-shadow`, `filter`, or layered duplicate text, add extra reserved block padding of 16-36px.
- A title block and its subtitle/lead must have a real vertical gap. Do not position them by eye with absolute `top` values that ignore title height.
- Tight editorial styles may be compact, but the visible glyphs must not touch. Use overlap only as an intentional typographic poster effect, and never between title and explanatory body text.
- If a large title wraps to multiple lines, reduce font size slightly, split the title into designed lines, or increase the title zone height. Do not reduce line-height below the safe range.
- For mixed Latin + CJK headings, prefer separate spans/lines with their own line-height when needed.

Recommended CSS pattern:

```css
.text-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.headline {
  line-height: var(--headline-lh, 1.04);
  margin: 0;
  padding-bottom: var(--headline-visual-pad, 0px);
}

.headline.is-cjk {
  --headline-lh: 1.06;
}

.headline.has-stroke,
.headline.has-shadow,
.headline.has-offset-layer {
  --headline-lh: 1.10;
  --headline-visual-pad: 24px;
}

.text-stack > .subtitle {
  margin-top: var(--title-subtitle-gap, 48px);
}
```

Compact does not mean cramped. If the slide needs a tighter style, reduce text amount or split the title, but keep the safe line-height and gap ranges.

Contrast minimums:

- body/captions/chart labels/formula labels: 4.5:1
- large display text: 3:1 absolute floor, 4.5:1 preferred
- text over image or patterned background: 4.5:1 after scrim or plate

Text on images, gradients, dots, glow, or busy texture must use one of:

- solid plate
- translucent scrim
- outline plate
- relocation to a clean surface

If content exceeds capacity:

- reduce copy
- split slide
- change layout
- lower whitespace only if the selected strategy allows it

Never hide overflow. Never use tiny text to preserve visual style.

## Layering And Collision

Use a z-index ladder:

```css
.layer-bg { z-index: 0; }
.layer-atmosphere { z-index: 1; }
.layer-decoration { z-index: 2; pointer-events: none; }
.layer-media { z-index: 4; }
.layer-content { z-index: 10; }
.layer-emphasis { z-index: 12; }
.layer-chrome { z-index: 80; }
.layer-nav { z-index: 90; }
```

Rules:

- content must sit above decorative and media layers unless it has a contrast plate
- oversized objects and background type require no-text exclusion zones
- navigation controls require a reserved safe zone or must sit outside the scaled stage
- decorative elements may be cropped off-stage, but content may not
- if objects collide, split the slide, move the object, or change the layout; do not keep the collision

## Navigation

Include basic navigation:

- arrow keys
- space/enter
- click/tap advance when useful
- slide counter
- optional overview/index if the deck is long

Navigation UI must not cover slide content. Reserve bottom safe area or keep controls outside the scaled stage.

## Export

HTML comes first.

```text
HTML deck
-> PDF export if requested
-> PPTX export if requested and feasible
```

If exporting PPTX, treat HTML as source of truth. PPTX may lose motion fidelity; mention that clearly.

## Preflight Before Handoff

Before final handoff:

- inspect visible text for internal metadata
- ensure reference images are not embedded accidentally
- verify all slides remain 16:9
- verify no scrollbars inside slides
- verify no overlap or overflow
- verify no fake image placeholders or meaningless repeated side blocks
- verify all text/surface pairs are readable
- verify decorative/media layers do not cover text at rest
- end at the requested generated artifact; no post-generation browser QA stage is part of the V3 default flow
