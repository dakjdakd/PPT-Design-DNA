# Image Asset Strategy

Use this reference whenever a deck may contain images. The goal is to prevent template-like empty boxes while still supporting real user images, later replacement, and optional AI-generated visuals.

## Core Distinction

Always classify every image into one role before planning the deck:

```text
Design Reference Image
- used to extract Design DNA
- contributes mood, palette, composition, density, texture, image treatment, and visual psychology
- never inserted into the deck by default

Content Image / Slide Asset
- used as actual slide content
- must be explicitly approved by the user as slide material
- participates in Blueprint and Page Specs from the beginning
```

Do not infer that a reference image should appear in the deck. If unclear, ask one short clarification.

## When To Ask

Ask image-intent questions only after:

1. Design DNA exists
2. the Design DNA panel has been accepted or tuned
3. the profile has been saved or selected
4. PPT requirements are being collected

Do not ask image-intent questions during Design Intake unless the user explicitly says an image should appear in the slides.

## Image Intent Question

During PPT Requirement Discovery, ask:

```text
How should this deck use content images?

A. No content images; use Design DNA visuals, typography, diagrams, and whitespace
B. I will provide real images; plan slides around them
C. Reserve replaceable image slots for later
D. Generate AI images for concept/atmosphere
E. Mixed
```

If the user chooses B or E, ask what type of images they will provide:

```text
A. Product / website / software screenshots
B. People / team / event photos
C. Data charts / paper figures / technical diagrams
D. Brand assets / logos / visual identity material
E. Mixed
```

If the user chooses C, ask:

```text
How should missing images appear in the draft?

A. Show designed placeholders that match the Design DNA
B. Hide empty boxes and show CSS fallback visuals
C. Keep slots only in image-manifest metadata
```

Default to B if the user does not specify.

## Asset Evaluation

For each approved content image, create an asset record:

```json
{
  "asset_id": "img_03_dashboard",
  "file": "assets/images/03-dashboard.png",
  "type": "product_screenshot",
  "semantic_role": "evidence",
  "best_use": ["feature_slide", "proof_slide"],
  "avoid_use": ["full_bleed_background"],
  "recommended_ratio": "16:10",
  "fit": "contain",
  "crop_policy": "preserve_ui_text",
  "caption_required": true,
  "safe_text_overlay": false
}
```

Asset type guidance:

| Type | Default treatment | Avoid |
|---|---|---|
| `product_screenshot` | framed contain, browser/device chrome when useful | full-bleed crop that cuts UI text |
| `data_chart` | contain, large enough labels, caption outside | cover crop, decorative background use |
| `people_photo` | hero subject or editorial crop | text over face, crop through eyes/hands |
| `brand_logo` | small identity mark, cover/closing, preview styling | stretching, busy backgrounds |
| `atmosphere_photo` | background image with scrim or crop reveal | pretending it is evidence |
| `object_product` | object focus, shadow/material integration | repeated side placement without purpose |

## Image Slot Types

Choose a slot type based on page purpose, not on a fixed template.

| Slot type | Use for | Rules |
|---|---|---|
| `hero_bleed` | cover, section opener, atmospheric transition | mandatory scrim/plate for text |
| `object_focus` | product, person, 3D object, artifact | reserve exclusion zone; no text behind subject |
| `screenshot_frame` | website, app, dashboard, code, UI | `contain` by default; preserve important text |
| `evidence_card` | case proof, research figure, source image | caption outside; high contrast frame |
| `image_grid` | portfolio, multiple cases, before/after | consistent ratios and spacing |
| `editorial_cutout` | magazine-style people/object crop | intentional crop; protected title area |
| `background_texture` | low-salience atmosphere | opacity/scrim; never reduce text contrast |
| `side_visual` | deliberate split page | allowed only when the page purpose calls for it; not the default |
| `inline_thumbnail` | list/process/case card | small, aligned, not decorative clutter |
| `diagram_image` | technical figure/system diagram | caption and label legibility first |

Never repeat `side_visual` on many slides just because images might exist.

## Missing Image Strategies

If no approved content image exists, the slide should still feel finished.

Use:

- typographic visual
- CSS/SVG diagram
- data visualization built in HTML/CSS/SVG
- material object derived from Design DNA
- controlled texture/pattern
- intentional whitespace
- optional AI-generated image only after user approval

Do not render a large empty rectangle, plus sign, "drop image here", "image placeholder", or a meaningless decorative side panel.

## Replaceable Slots

Use replaceable slots only when the user wants to add images later.

Preferred default:

```text
CSS fallback is visible.
Image slot metadata is saved.
No ugly empty frame appears in the final deck.
```

If the user wants visible editable slots, the placeholder must follow the active Design DNA:

| Style direction | Placeholder treatment |
|---|---|
| minimal/premium | hairline border, pale grid, small slot id, no loud label |
| cyber/tech | dark panel, corner brackets, subtle glow, restrained scanline |
| editorial/magazine | crop marks, figure number, caption baseline, paper tone |
| academic/report | `Figure N` frame, caption area, clean border |
| playful/3D | soft inset panel, rounded material surface, small index marker |

Visible placeholder text must be minimal: slot id, ratio, or short semantic label. Do not place large instructional text in the slide.

## Image Manifest

When slots are replaceable or images are external assets, create an `image-manifest.json` or equivalent internal spec:

```json
{
  "image_slots": [
    {
      "slot_id": "p03-main-visual",
      "page": 3,
      "purpose": "show product interface or system screenshot",
      "recommended_file": "assets/images/03-main-visual.png",
      "slot_type": "screenshot_frame",
      "ratio": "16:10",
      "fit": "contain",
      "safe_area": "center-right",
      "caption_required": true,
      "fallback_if_missing": "css_wireframe_dashboard",
      "visible_placeholder": false
    }
  ]
}
```

For folder-based HTML decks, use stable names:

```text
assets/images/01-cover-visual.jpg
assets/images/03-dashboard.png
assets/images/05-team-photo.jpg
assets/images/07-proof-chart.png
```

Use `{page}-{semantic-name}.{ext}`. If users replace the image with the same file name, the HTML should not need path edits.

## Page Spec Fields

When a slide has image or future image behavior, include:

```json
{
  "image_strategy": {
    "intent": "none | approved_content_image | replaceable_slot | generated_image | fallback_visual",
    "slot_type": "screenshot_frame",
    "asset_id": "img_03_dashboard",
    "slot_id": "p03-main-visual",
    "semantic_role": "evidence",
    "ratio": "16:10",
    "fit": "contain",
    "placement": "center-right",
    "safe_area": { "x": 980, "y": 170, "w": 780, "h": 620 },
    "caption": "Model result dashboard",
    "text_overlay_allowed": false,
    "fallback_if_missing": "css_wireframe_dashboard",
    "visible_placeholder": false
  }
}
```

For `intent: none`, state the non-image visual strategy instead of leaving this blank.

## Text Over Image Safety

Rules:

- Text must not sit directly on busy images, screenshots, gradients, glow, or patterned areas.
- Text over images requires a scrim, solid plate, translucent plate, outline plate, or a separate protected text area.
- Evidence images and screenshots should usually have captions outside the image, not overlaid on top.
- `cover` crop is allowed for atmosphere; `contain` is default for screenshots, charts, UI, formulas, and evidence.
- If image and text are both important and crowded, split into more slides rather than shrinking text.

## AI-Generated Image Use

AI images are allowed for:

- concept covers
- atmosphere
- metaphors
- abstract technology visuals
- product vision imagery
- section visuals

AI images are not allowed to pretend to be:

- real screenshots
- factual evidence
- financial charts
- academic results
- real people or events

Ask for approval before generating AI images unless the user has already requested generated visuals.
