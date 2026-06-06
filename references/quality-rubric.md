# Quality Rubric

V3 uses this rubric as a pre-generation and source-level quality contract. It is not a post-generation browser QA loop.

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
- CJK display title glyphs collide because of Latin poster line-height, negative tracking, or missing reserved title-zone height
- huge title, subtitle, divider, body, card, or footer text visually touch because the text stack has no real clearance

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
- split_dense_evidence_slide

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
3. Identify large decorative/media/background layers and verify they do not cover content.
4. Check cards, labels, badges, captions, and chart text for paired colors.
5. Check the navigation safe zone.
6. Correct blocking issues in the source before delivery.
```

The following are P0 issues:

- unreadable text caused by color pairing
- pale card or bright accent card with inherited white or low-contrast text
- any text hidden behind an object
- any text crossing a busy image without a plate or scrim
- any fake image placeholder in final output
- any slide where navigation covers content
- any CJK display title using unsafe line-height or negative tracking that causes visual collision
- any title/card/body/visual overlap caused by missing dynamic zone budget

## Source-Level Mechanical Preflight

This is a lightweight source-level authoring check, not a post-generation screenshot review loop. It should be used while writing or revising HTML, and it ends at the requested artifact.

Check the HTML/CSS source for obvious mechanical failures:

- `color: white` or `color: #fff` inside light card, stat, badge, label, caption, or bright accent components without an explicit compatible surface.
- `.card`, `.stat-card`, `.badge`, `.caption`, `.label`, chart labels, and formula labels missing explicit `color`.
- CJK display selectors using `line-height < 0.98`, negative `letter-spacing`, or Latin poster settings such as `.8`, `.85`, or `.9`.
- visible placeholder language or blank boxes such as `drop image here`, plus-sign empty frames, or meaningless right-side image areas.
- navigation controls positioned over body/card/footer zones.
- decoration, media, or background type assigned a higher z-index than content without a contrast plate.
- `overflow: hidden` used on text containers to mask missing capacity instead of revising copy, layout, or page count.

These checks do not require browser screenshots and must not reintroduce the removed screenshot-review-and-revision flow.
