# Quality Rubric

V3 uses this rubric as a pre-generation and source-level quality contract. It is not a post-generation browser QA loop. The default workflow must not probe for Playwright, install browser automation packages, or debug missing browser dependencies.

## Quality Targets

Score each slide from 0-100:

- Design DNA alignment: does the page match the profile or adapter?
- Readability: can text, labels, formulas, and charts be read?
- Composition balance: is the visual weight organized?
- Density fit: does the page match the chosen density/adaptation mode?
- Narrative clarity: does the page serve its blueprint purpose?
- Style consistency: does it match the deck system?
- Scenario fit: does it work for the user's actual use case?
- Motion final-state clarity: does the slide settle into a readable state?
- Visual slot validity: does every image/visual area have a real role instead of acting as a generic placeholder?
- Layer safety: are decoration, media, background type, and navigation kept away from readable content?

Recommended pass targets:

```json
{
  "design_dna_alignment": 85,
  "readability": 90,
  "composition_balance": 85,
  "density_fit": 85,
  "narrative_clarity": 85,
  "style_consistency": 90,
  "scenario_fit": 85,
  "motion_final_state_clarity": 90,
  "visual_slot_validity": 90,
  "layer_safety": 95
}
```

## Automatic Failure Conditions

Do not knowingly generate a slide with any of these issues:

Reference Subject Firewall failures:

- reference-image subjects are redrawn as CSS/SVG/HTML/AI visuals, icons, mascots, diagrams, or decorative motifs
- animal, person, character, mascot, product, object, or subject-part motifs are derived from style reference images
- a slide that needs `visual_subject_policy` omits it or allows subject replication without explicit content approval

Mechanical layout failures:

- text below minimum readable size
- text overflow
- element overlap
- chart too small to read
- contrast too low
- white or low-contrast text on pale card/background/image
- pale or bright cards, stat blocks, badges, labels, captions, or chart labels inheriting unreadable text color
- shallow surface/ink pairing such as white text on bright yellow, pale gray, pale blue, pale pink, white, or translucent white
- text on a busy image, glow, dot pattern, or gradient without a scrim/plate
- more than one unrelated primary focus
- too many bullets for the selected density
- visual style contradicts the Design Contract
- page ignores its Page Spec purpose
- formulas or data labels are unreadable
- decorative elements compete with core message
- reference images appear even though they were only style references
- generic empty image placeholder appears in the final deck
- repeated meaningless side object/block appears without a content or visual role
- motion or effects hide content at rest
- decorative object, media object, background type, or overlay covers text at rest
- a visual object intersects a declared no-text or collision-exclusion zone
- navigation controls cover content
- title zone and card/body/visual zones compete for the same physical space
- title, card, body, visual, footer, or nav zones overlap after accounting for stroke, shadow, glow, duplicate offset layers, padding, and navigation safe area
- title/body/card/footer/nav content layers overlap after `layout_box_budget` required heights are counted
- a title descender or visual-effect pad enters the next body, card, divider, frame, footer, or navigation zone
- a later DOM element such as a card, panel, grid, or frame paints over earlier title/body text
- a card grid, body note, divider, or footer uses a fixed `top` that does not reference the previous readable zone's required height
- multi-line large English serif/display titles use `line-height < 1.06`
- any multi-line display title uses `line-height < 0.95` when body text, cards, dividers, or frames appear below it
- text containers use `overflow: hidden` to conceal missing capacity
- body, card, caption, or footer content enters the navigation safe zone
- a large side visual has no approved content role and no abstract surrogate strategy
- CJK display title glyphs collide because of Latin poster line-height, negative tracking, or missing reserved title-zone height
- huge title, subtitle, divider, body, card, or footer text visually touch because the text stack has no real clearance
- CJK or mixed Chinese/Latin display titles rely on browser auto-wrap and produce an orphan line, such as a single Chinese character or 1-2 character fragment on the last line
- large display titles use `word-break: break-all`, `overflow-wrap: anywhere`, negative tracking, or compressed line-height to force text into a zone
- a multi-element slide omits guard-readable `data-zone` markers, so the source-level layout guard cannot verify title/body/card/footer spacing

## Preferred Generation Corrections

When a Page Spec would create a failure, correct the spec or generated source before handoff.

Common corrections:

- split_slide
- reduce_copy
- increase_chart_area
- increase_font_size
- rebalance_grid
- remove_decorative_elements
- simplify_color_usage
- increase_contrast
- change_layout_archetype
- reduce_accent_intensity
- convert_paragraph_to_diagram
- replace_empty_slot_with_diagram
- replace_empty_slot_with_typography
- remove_unneeded_side_visual
- apply_valid_surface_pair
- assign_explicit_surface_and_ink_tokens
- add_text_plate_or_scrim
- update_z_index_ladder
- create_no_text_zone
- create_dynamic_zone_budget
- enforce_layout_capacity_gate
- split_or_recompose_when_zones_collide
- move_detail_to_speaker_notes
- reduce_motion
- reserve_nav_safe_area
- remove_reference_asset
- remove_reference_subject_redraw
- replace_reference_subject_with_abstract_surrogate
- add_visual_subject_policy
- add_mechanical_layout_preflight
- add_layout_box_budget
- fix_title_zone_estimate
- fix_card_zone_collision
- fix_content_layer_collision
- fix_title_descender_collision
- replace_unsafe_absolute_top_with_chained_zone_budget
- enforce_display_title_line_height_floor
- split_dense_evidence_slide
- rewrite_or_rebalance_headline_lines
- add_guard_readable_data_zones

Example:

```json
{
  "generation_corrections": [
    {
      "page": 4,
      "issue": "chart_too_small",
      "action": "increase_chart_area",
      "changes": {
        "chart_width": "+220",
        "body_text": "reduce_to_2_bullets"
      }
    },
    {
      "page": 6,
      "issue": "density_exceeds_profile",
      "action": "split_slide",
      "new_pages": 2
    }
  ]
}
```

## User Choice During Generation

Ask the user only when the correction strategy changes product meaning or page count materially.

Example:

```text
Page 6 is too dense for the selected profile.
Choose:
A. Compress text
B. Split into two slides
C. Lower whitespace for this deck
D. Keep as is
```

If the issue is mechanical, such as overlap, overflow, contrast, unreadable chart labels, or accidental reference-image insertion, correct it during authoring.

Also correct directly when the issue is a fake image placeholder, unreadable text/surface pair, decorative object covering content, or navigation overlap. Do not ask the user whether to keep a mechanically broken page.

Also correct directly when reference-image subjects are redrawn or approximated. Remove the subject-derived visual and replace it with typography, an abstract material shape, a diagram, texture/pattern, or intentional whitespace. Do not ask whether to keep a mechanically or policy-broken redraw.

## Handoff Reporting

When reporting generation quality, keep it concise:

```text
Generated:
- Final deck: index.html
- Profile: Cyber Minimal Editorial v002
- Adapter: Academic / cell division
- Known limitation: PPTX export may lose some HTML motion
```

## Deck-Level Rhythm Check

Plan the deck as a sequence, not only isolated slides.

Check:

- too many consecutive dense slides
- too many consecutive hero slides
- repeated layout without variation
- sudden style breaks
- missing section pauses
- weak ending
- motion intensity that does not match the narrative

Use the Design DNA's Presentation layer to decide whether the rhythm should be keynote-like, academic, consulting, editorial, teaching, or sales-oriented.

## Visual Safety Checklist

Before final handoff, apply [Visual Safety Rules](visual-safety-rules.md) while authoring the HTML/PPTX source:

```text
For each slide:
1. Identify all text surfaces and verify contrast.
2. Identify all image/visual zones and verify each has a role.
3. Verify `visual_subject_policy` when references contain identifiable subjects; no subject redraws, silhouettes, parts, mascots, or CSS/SVG/AI approximations are allowed.
4. Identify large decorative/media/background layers and verify they do not cover content.
5. Check cards, labels, badges, captions, and chart text for paired colors.
6. Check `mechanical_layout_preflight`: text estimates, title visual padding, card padding, and collision pairs.
7. Check the navigation safe zone.
8. Correct blocking issues in the source before delivery.
9. For HTML decks, run `node scripts/ppt-layout-guard.js <output-html> --report <output-dir>/layout-guard-report.json` when Node is available, then repair and rerun until it returns PASS.
```

The following are P0 issues:

- `content_layer_collision`: title/body/card/footer/nav content layers overlap after required heights and padding are counted
- `title_descender_collision`: title descender, stroke, shadow, glow, or offset layer enters the next content zone
- `dom_order_covering_text`: later DOM card, panel, grid, or frame covers earlier title/body text
- `unsafe_absolute_top`: body/card/footer placement uses a fixed top that ignores prior readable zone required height
- `unsafe_display_line_height`: multi-line display title uses a line-height below the required floor
- unreadable text caused by color pairing
- pale card or bright accent card with inherited white or low-contrast text
- any text hidden behind an object
- any text crossing a busy image without a plate or scrim
- any reference-subject redraw or approximation in CSS/SVG/HTML/AI visuals
- any fake image placeholder in final output
- any slide where navigation covers content
- any CJK display title using unsafe line-height or negative tracking that causes visual collision
- any CJK or mixed CJK/Latin display title with an orphan final line or ugly 1-2 character title line
- any display title relying on `word-break: break-all`, `overflow-wrap: anywhere`, or browser-only wrapping instead of planned headline lines
- any title/card/body/visual overlap caused by missing dynamic zone budget
- any title/body/card/footer/nav overlap caused by missing or failed `layout_box_budget`
- any large multi-line English serif/display title using `line-height < 1.06`
- any `line-height < 0.95` display title with body text, cards, dividers, or frames directly below it
- any title descender, stroke, shadow, glow, or offset layer entering the next content zone
- any later DOM card, panel, grid, or frame covering earlier title/body text
- any fixed absolute `top` placement for cards/body/footer that ignores calculated title/body required height
- any slide missing required mechanical layout preflight when multiple major elements exist
- any slide missing required `layout_box_budget` when multiple major elements exist
- `missing_layout_box_budget` from `scripts/ppt-layout-guard.js`
- `missing_data_zones` from `scripts/ppt-layout-guard.js`
- `cjk_orphan_line` from `scripts/ppt-layout-guard.js`
- `estimated_cjk_orphan_line` from `scripts/ppt-layout-guard.js`
- `ugly_cjk_short_title_line` from `scripts/ppt-layout-guard.js`
- `unsafe_cjk_display_line_height` from `scripts/ppt-layout-guard.js`
- `unsafe_display_selector_line_height` from `scripts/ppt-layout-guard.js`
- `negative_display_letter_spacing` from `scripts/ppt-layout-guard.js`
- `unsafe_display_word_break` from `scripts/ppt-layout-guard.js`
- `unsafe_text_block_gap` from `scripts/ppt-layout-guard.js`
- `title_zone_collision` from `scripts/ppt-layout-guard.js`
- `body_card_collision` from `scripts/ppt-layout-guard.js`
- `nav_safe_zone_collision` from `scripts/ppt-layout-guard.js`
- `unsafe_display_line_height` or `unsafe_tight_line_height` from `scripts/ppt-layout-guard.js`
- `text_overflow_hidden` from `scripts/ppt-layout-guard.js`

## Source-Level Mechanical Preflight

This is a lightweight source-level authoring check, not a post-generation screenshot review loop. It should be used while writing or revising HTML, and it ends at the requested artifact.

Check the HTML/CSS source for obvious mechanical failures:

- `color: white` or `color: #fff` inside light card, stat, badge, label, caption, or bright accent components without an explicit compatible surface.
- `.card`, `.stat-card`, `.badge`, `.caption`, `.label`, chart labels, and formula labels missing explicit `color`.
- CJK display selectors using `line-height < 1.02`, negative `letter-spacing`, or Latin poster settings such as `.8`, `.85`, or `.9`.
- English serif/display title selectors using `line-height < 1.02`, or `< 1.06` when the title can wrap beyond one line.
- Any display title using `line-height < 0.95` while body text, cards, dividers, or frames are below it.
- CJK/mixed display titles missing planned semantic line breaks, or containing explicit `<br>` lines with only one Chinese character or a 1-2 character fragment.
- Display title selectors using `word-break: break-all` or `overflow-wrap: anywhere`.
- `.body-note`, `.cards`, `.decision-grid`, `.two-column`, or similar content blocks using independent absolute `top` values with no `layout_box_budget` or chained zone rule.
- Cards, panels, grids, or frames appearing later in the DOM where their zone intersects earlier title/body zones.
- visible placeholder language or blank boxes such as `drop image here`, plus-sign empty frames, or meaningless right-side image areas.
- reference-subject redraws such as animal/person/character/object silhouettes, eyes, ears, tails, paws, fins, horns, wings, mascot faces, or product/object outlines derived from style references.
- navigation controls positioned over body/card/footer zones.
- decoration, media, or background type assigned a higher z-index than content without a contrast plate.
- `overflow: hidden` used on text containers to mask missing capacity instead of revising copy, layout, or page count.
- missing `visual_subject_policy` when reference images included identifiable subjects.
- missing `mechanical_layout_preflight` for slides with multiple major elements.
- missing `layout_box_budget` for slides with multiple major elements.
- missing `data-zone` markers on major readable elements in a generated HTML deck.

These checks do not require browser screenshots and must not reintroduce the removed screenshot-review-and-revision flow. Do not look for `playwright`, `playwright-core`, bundled Node module paths, or browser runtimes unless the user explicitly requests browser QA.

The bundled source-level guard is the default HTML handoff gate when Node is available:

```powershell
node scripts/ppt-layout-guard.js <output-html> --report <output-dir>/layout-guard-report.json
```

If the guard reports P0 issues, repair the Page Spec or HTML and run it again. Do not replace this with page-count checks, manifest JSON parsing, class-name scans, or dependency probing. If Node is not available, manually apply the same source checks and say the script could not be run.
