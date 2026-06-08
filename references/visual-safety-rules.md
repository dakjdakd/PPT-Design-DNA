# Visual Safety Rules

Use these rules whenever generating an HTML deck. They target the common failures users notice first: ugly empty image slots, unreadable text, decorative shapes covering content, and poor composition.

## Core Principle

A slide is valid only when every visible element has a role and a safe relationship to nearby elements.

Before rendering each slide, define:

- content zones
- visual zones
- decorative zones
- navigation safe zone
- z-index ladder
- contrast pairs
- typography spacing and text-stack clearance
- reference subject firewall
- collision exclusions
- dynamic zone budget
- mechanical layout preflight
- layout capacity gate

Do not rely on a loose prompt. Encode safety in Page Specs, CSS tokens, layer rules, and visual-slot policy before writing the final deck.

These constraints are not templates. They do not prescribe where a title, card, diagram, or visual must appear. They require each free composition to prove that readable content has enough space, contrast, and layer priority.

## Image And Visual Slots

Reference images are style evidence only. They are not deck images unless the user explicitly marks them as slide content.

They also cannot be redrawn. Do not trace, stylize, approximate, abstract into a mascot, or rebuild identifiable reference subjects as CSS, SVG, HTML, AI-generated images, icons, diagrams, or decorative motifs. Forbidden subjects include people, animals, characters, mascots, specific products, buildings, vehicles, toys, recognizable objects, and subject parts such as faces, eyes, ears, tails, fins, horns, wings, paws, posture, clothing, fur, scales, and silhouettes.

For full image handling, use [Image Asset Strategy](image-asset-strategy.md). It defines content images, replaceable slots, image manifests, AI-generated visuals, and slot types.

Never draw a generic empty image placeholder such as:

- a blank white rectangle with a plus sign
- a large flat box that repeats on every slide
- a "drop image here" area
- a decorative block that pretends to be an image slot

If a slide needs visual weight but no approved content image exists, use one of these instead:

- **Typographic visual**: oversized keyword, number, or phrase integrated into the layout.
- **CSS/SVG diagram**: flow, matrix, orbit, grid, timeline, topology, or data shape.
- **Generated visual brief**: a clearly described image prompt or image-generation task, only if the user approves image generation.
- **Material object**: abstract CSS shape derived from the Design DNA, with no "image placeholder" affordance and no reference-subject silhouette or parts.
- **Empty space**: intentional whitespace when the Design DNA supports it.

Approved content images can use these display modes:

| Mode | Use for | Rules |
|---|---|---|
| `hero_bleed` | atmospheric cover/section image | full or partial bleed with mandatory scrim/plate for text |
| `object_focus` | one strong photo/product/person/object | large crop, protected text area, no overlap unless text has a contrast plate |
| `screenshot_frame` | website, software, code, dashboard | contain or framed crop, preserve legibility, captions outside the image |
| `evidence_card` | screenshot, chart, UI, document | contain, readable labels, caption outside |
| `image_grid` | multiple related images | consistent aspect ratio, equal height, same treatment |
| `editorial_cutout` | magazine-like people/object crop | protected title zone; intentional crop only |
| `background_texture` | atmospheric or full-bleed visual | mandatory scrim/overlay and contrast audit for all text |

If the Page Spec asks for an image but no image asset is approved, the renderer must change the visual strategy instead of drawing a placeholder.

If the user asks for later-replaceable image slots, visible placeholders must be designed in the active Design DNA. Default to hidden slots with CSS fallback, not a visible empty frame.

If the active Design Profile came from identifiable reference subjects, the Page Spec must include `visual_subject_policy`. The visual strategy must be `abstract_material_shape`, `typography`, `diagram`, `texture`, `pattern`, or `whitespace` unless an approved content image exists. A cat reference can produce yellow palette and hand-drawn line quality, but not a cat, cat outline, cat ears, cat face, or cat-shaped decoration.

## Text Contrast

Every text element must declare its background context:

```json
{
  "text_surface_pair": {
    "text": "var(--ink)",
    "surface": "var(--bg)",
    "surface_type": "solid",
    "contrast_target": "high"
  }
}
```

Hard rules:

- never use white text on pale gray, pale blue, pale yellow, or low-saturation light surfaces
- never use white text on bright yellow, pale pink, white, translucent white, or off-white stat cards
- never use accent-blue text on a blue background unless luminance contrast is high
- never place text directly over busy images, gradients, glow, dots, or large decorative type
- text on images must use a scrim, solid label plate, outline plate, or move outside the image
- cards/panels must set both background and text color as a pair
- stat cards, labels, badges, captions, chart labels, formula labels, and navigation chrome must set explicit `background` and `color`; they cannot inherit either from the slide by accident
- pale surfaces use dark ink; dark surfaces use light ink; accent surfaces use a preselected contrast ink

Minimum contrast targets:

- body, captions, chart labels, formula labels: at least 4.5:1 contrast
- large display text: at least 3:1 contrast, preferably 4.5:1
- text over image or patterned background: at least 4.5:1 after scrim or plate

When in doubt, increase contrast by changing the text color or adding a clean plate. Do not add glow as the primary readability fix.

## Surface Pair Tokens

Create explicit text/surface pairs from the Design DNA:

```css
:root {
  --surface-light: #f6f7f8;
  --surface-light-ink: #101114;
  --surface-dark: #080a0f;
  --surface-dark-ink: #ffffff;
  --surface-accent: #0877ff;
  --surface-accent-ink: #ffffff;
  --surface-accent-yellow: #e5ff00;
  --surface-accent-yellow-ink: #050505;
  --surface-muted: #dfe7ef;
  --surface-muted-ink: #111827;
}
```

Do not style cards as `background: var(--surface-muted); color: white;`. Do not style a yellow card as `background: var(--surface-accent-yellow); color: white;`. These are blocking failures.

## Z-Index Ladder

Use a consistent layer system:

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

- text, charts, formulas, and labels must be above decorative and media layers unless intentionally placed on a contrast plate
- decorative elements cannot cross the content safe zone unless their opacity is very low and they do not reduce contrast
- oversized background type must stay behind foreground text and must not share the same baseline region
- large media/objects must have an exclusion zone so text is not hidden behind them
- navigation controls must be outside the content area or reserve a safe area

## Collision And Safe Zones

Every Page Spec must define slide-level safe zones. These zones are generated dynamically for the current slide composition; they are not a reusable layout template:

```json
{
  "safe_zones": {
    "content": { "x": 96, "y": 80, "w": 1728, "h": 900 },
    "nav": { "x": 1680, "y": 980, "w": 220, "h": 70 },
    "no_text": [
      { "reason": "hero object", "x": 1120, "y": 120, "w": 700, "h": 760 }
    ]
  }
}
```

Hard rules:

- no primary text can intersect `no_text`
- no card or text block can extend into the navigation zone
- no title zone can overlap card, footer, or body zones unless the overlap is an intentional typographic composition and there is no readability conflict
- no decoration zone can cross a body, chart, formula, caption, or navigation zone at normal opacity
- decorative objects can be cropped off-stage, but content cannot
- if a hero visual is oversized, reserve a real text column or move the title above it
- if content blocks collide, split the slide or switch layout; do not keep shrinking text

## Dynamic Zone Budget

Use a dynamic zone budget for every slide with more than one major element. The generated zones prove that the free composition is physically possible.

Required role zones when present:

- `title_zone`
- `body_zone`
- `visual_zone`
- `card_zone`
- `footer_zone`
- `nav_safe_zone`
- `decoration_zone`

Rules:

- Missing roles do not need fake zones. A slide without content images should not create a fake image zone.
- `title_zone` must include the full visible title height, including line-height, descenders, stroke, shadow, glow, and offset layers.
- `body_zone` and `card_zone` must begin after the title stack's visible clearance unless the design intentionally separates them into a different column with safe distance.
- `title_zone`, `body_zone`, `card_zone`, `footer_zone`, and `nav_safe_zone` are content layers. They cannot overlap each other after padding, descender clearance, card padding, and navigation reservation are counted.
- Do not rely on DOM order to cover a bad fit. A later card, panel, grid, or frame must not paint over earlier title/body text.
- Do not repair content collisions by giving the hidden text a higher `z-index`; revise the budget, move the next zone, reduce copy, reduce title size, change archetype, or split the slide.
- `visual_zone` must be meaningful: evidence, diagram, metaphorical anchor, approved/generated image, or rhythmic device. Otherwise remove it.
- `nav_safe_zone` must be reserved before cards, captions, and footer are placed.
- If a free composition cannot satisfy the budget, generate a different composition rather than forcing a template.

## Layout Box Budget

Every multi-element slide must include `layout_box_budget` before HTML authoring. This is the numeric version of the visual safety check.

Required fields:

```json
{
  "layout_box_budget": {
    "stage": { "w": 1920, "h": 1080 },
    "zones": [
      {
        "id": "title",
        "x": 110,
        "y": 140,
        "w": 980,
        "allocated_h": 310,
        "font_size": 100,
        "line_height": 1.06,
        "estimated_lines": 3,
        "glyph_pad_top": 18,
        "glyph_pad_bottom": 32,
        "visual_effect_pad": 0,
        "required_h": 368,
        "fit": "pass | fail"
      }
    ],
    "derived_zone_rules": [
      "body_zone.y >= title_zone.y + title_zone.required_h + 44",
      "card_zone.y >= max(planned_card_y, body_zone.y + body_zone.required_h + 56)"
    ],
    "collision_pairs": [
      ["title_zone", "body_zone"],
      ["title_zone", "card_zone"],
      ["body_zone", "card_zone"],
      ["card_zone", "nav_safe_zone"]
    ],
    "if_fail": "lower_title_size_or_move_next_zone_or_split_slide"
  }
}
```

Rules:

- `required_h` must be calculated as `estimated_lines * font_size * line_height + glyph_pad_top + glyph_pad_bottom + visual_effect_pad`.
- English serif/display titles and titles with descenders such as `g`, `y`, `p`, `q`, or `j` require `glyph_pad_bottom`.
- The next readable zone must start after the previous readable zone's calculated bottom plus the declared gap.
- Fixed absolute `top` values are allowed only when they satisfy the chained budget. A card grid cannot have a hard top that ignores the actual title/body height.

## Mechanical Layout Preflight

Use Mechanical Layout Preflight before HTML authoring for every slide with more than one major element. The Page Spec field is `mechanical_layout_preflight`. It prevents the failures users see first: titles blocking cards, visuals covering text, footer/nav overlap, and text clipped inside cards.

Required checks:

- estimate text box height from available width, font size, line-height, expected line count, script, and visual-effect padding
- verify `layout_box_budget` required heights and derived zone rules
- include CJK glyph height, English descenders, stroke, glow, shadow, and duplicate-offset layers in title-zone height
- include card padding, badges, labels, captions, and internal gaps in card capacity
- reserve navigation safe zone before placing bottom cards, captions, footers, progress bars, or page counters
- check collision pairs such as title/card, title/visual, body/decoration, card/nav, footer/nav, and caption/media

If any check fails, revise the source plan before writing HTML:

- recompose the slide
- reduce copy
- reduce title size by 5-12%
- change layout archetype
- split the slide

Do not use `overflow: hidden` on text containers to hide failures. It is allowed only for decorative crop containers.

## Source-Level Layout Guard

For HTML decks, run the bundled static guard after writing the HTML when Node is available:

```powershell
node scripts/ppt-layout-guard.js <output-html> --report <output-dir>/layout-guard-report.json
```

This is a mechanical source check, not a browser QA step. It must not trigger Playwright lookup, installation, screenshots, bundled runtime probing, or dependency debugging.

The guard blocks handoff on P0 findings:

- `missing_layout_box_budget`
- `title_zone_collision`
- `body_card_collision`
- `nav_safe_zone_collision`
- `unsafe_display_line_height`
- `unsafe_tight_line_height`
- `text_overflow_hidden`

Repair order:

1. Move the next readable zone after the previous zone's calculated visual bottom plus gap.
2. Reduce density by removing secondary copy, notes, legends, or extra cards.
3. Reduce title size by 5-12% while preserving readability.
4. Change the layout archetype.
5. Split the slide.

Do not fix guard failures with `z-index`, hidden overflow, compressed line-height, or by letting later DOM panels cover earlier text.

## Typography Spacing Safety

Text-to-text collisions are blocking failures, even when no boxes overlap in CSS. Check the visual shape of glyphs, especially for large titles, Chinese characters, English descenders, and stroked/shadowed display type.

Hard rules:

- A display title may be tight, but its glyphs cannot touch the next title line, subtitle, divider, body paragraph, badge, or caption.
- Large English serif display titles default to `line-height >= 1.02`; if they wrap to more than one line, use `line-height >= 1.06`.
- `line-height < 0.95` is allowed only for a single-line decorative title with no body text, divider, card, or frame directly below it.
- Multi-line body and card copy default to `line-height >= 1.28`; reduce copy or split slides instead of compressing line-height.
- Chinese display headings need more line-height than Latin-only headings at the same size. Do not use very tight Latin poster settings for CJK.
- CJK display headings use `letter-spacing: 0`; negative tracking is a blocking failure when it causes visual collision.
- Do not use `line-height: .8`, `.85`, or `.9` for CJK display headings. A Latin poster setting must not be copied into Chinese title pages.
- If a title uses thick stroke, black offset shadow, glow, duplicate colored layers, or cartoon/pop treatment, reserve extra vertical padding around the title block.
- Subtitle and body text must start after the title's visual effect area, not after the raw CSS line box.
- A divider line under a title needs at least 28-44px clearance from the title's visible bottom and 28-44px from the lead/body top.
- Navigation and footer text cannot be squeezed into the same baseline area as slide body text.

Compact safe defaults:

| Pair | Minimum visible gap |
|---|---:|
| huge title line -> huge title line | 10-18px visible air |
| huge title block -> subtitle/lead | 44-72px |
| stroked/shadow title -> next text | 56-88px |
| section title -> body/card | 34-56px |
| badge/eyebrow -> title | 18-32px |
| divider line -> nearby text | 28-44px |

If a slide feels too loose after applying spacing, reduce copy, split title lines more intentionally, or reduce font size by 5-10%. Do not collapse safe gaps until glyphs touch.

## Composition Rules

Avoid repeated "thing on the right" layouts. A visual zone must be chosen because the page needs it, not because the generator habitually fills a side.

Layout archetypes are capacity gates, not templates. They identify what a slide can safely carry, while the actual composition remains free and derived from Design DNA.

Use the visual role matrix:

| Page role | Preferred visual strategy |
|---|---|
| Cover | hero type, approved hero image, or abstract DNA object |
| Pipeline/process | diagram first, not empty media box |
| Evaluation/criteria | matrix, score ring, cards with high-contrast ink |
| Comparison | two-column or 2x2 matrix, no giant unrelated side object |
| Next steps | roadmap, numbered path, or three action blocks |
| Quote/manifesto | typography and negative space; background type must not cover the quote |

If a right-side visual is used, it must have one of these roles:

- content evidence
- metaphorical anchor
- diagram container
- section rhythm device
- generated/approved image

Otherwise remove it.

Capacity rules:

- `cover_hero` carries one main title, one subtitle/lead, and optional small meta only.
- `single_big_claim` carries one dominant claim plus at most one supporting block.
- `three_point_argument` carries up to three primary cards/points after the title has real visual clearance.
- `stat_grid` carries up to four stat cards, each with explicit surface/ink pair and enough internal padding.
- `split_text_visual` requires a meaningful visual role and protected text area.
- `closing_takeaway` cannot force a huge title and action cards into the same vertical zone; split when needed.

## Motion Safety

Final resting state must be readable.

- no animation may leave text behind another object
- no rotating or floating object may cross a text zone at rest
- animated decorative layers must sit below content layers
- text reveal must complete before export
- dense/academic adapters should reduce or disable decorative motion

## Generation Correction Mapping

Use these source-level corrections:

| Failure | Patch |
|---|---|
| reference subject redrawn | remove subject-derived visual; replace with typography, abstract material shape, diagram, texture, pattern, or whitespace |
| empty image placeholder | replace with typographic visual, diagram, or whitespace |
| low text contrast | change text/surface pair, add plate, or move text |
| decorative/media object covers text | move or crop object, lower opacity, add exclusion zone, or adjust decorative/media z-index below content |
| content layer covers another content layer | revise `layout_box_budget`, move the next zone, reduce copy/title size, change archetype, or split slide; do not fix with z-index |
| card text unreadable | switch card variant to valid surface pair |
| pale card inherits white text | assign explicit dark ink token to the card and its descendants |
| title zone underestimated | increase title zone, reserve visual-effect padding, split title, or reduce title size by 5-12% |
| title/subtitle/body squeezed | increase title line-height, add visual-effect padding, add compact safe gap, split title lines, or reduce title size by 5-10% |
| title and cards compete for space | change composition, move cards below/aside with a safe gap, reduce card count, or split slide |
| card zone collision | reduce card count, change archetype, recompose, or split slide |
| decoration crosses readable content | lower opacity, move to decoration zone, crop off-stage, or remove |
| oversized side visual unrelated | remove, convert to diagram, or make it background-only |
| content too dense | split slide, compress copy, or change layout |
| nav covers content | reserve nav safe zone or move controls outside stage |

Mechanical failures such as overlap, overflow, unreadable contrast, and accidental placeholders should be corrected directly during generation without asking the user.
