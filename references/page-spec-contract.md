# Design Contract, Blueprint, and Page Spec

The deck should not be generated from one loose prompt. Use structured intermediate artifacts.

## Design Contract

The Design Contract adapts a reusable Design DNA Profile or adapter to one concrete deck.

Example:

```json
{
  "design_contract": {
    "base_profile": "Apple Minimal",
    "adapter": "Apple Academic",
    "scenario": "math_modeling_defense",
    "selected_strategy": "cell_division",
    "preserve": [
      "minimal mood",
      "clean typography",
      "single-focus pages",
      "calm premium rhythm"
    ],
    "adapt": {
      "information_density": { "from": 30, "to": 55 },
      "chart_weight": { "from": 35, "to": 75 },
      "formula_friendliness": { "from": 20, "to": 65 },
      "page_count_multiplier": 1.6
    },
    "risk_notes": [
      "High whitespace conflicts with formula-heavy content.",
      "Charts must be larger than the base style would normally allow."
    ],
    "negative_constraints": [
      "Do not shrink formulas below readable size.",
      "Do not preserve whitespace by hiding required evidence.",
      "Do not create decorative title-only pages for technical steps."
    ]
  }
}
```

## PPT Blueprint

The blueprint plans the story and page sequence.

```json
{
  "ppt_blueprint": {
    "title": "University Math Modeling Defense",
    "goal": "defense",
    "audience": "teachers",
    "page_count_target": 12,
    "density_mode": "balanced",
    "narrative_style": "academic_storytelling",
    "sections": [
      {
        "name": "Opening and Problem",
        "purpose": "Establish the research question and value",
        "pages": [1, 2]
      },
      {
        "name": "Model and Method",
        "purpose": "Explain modeling logic and assumptions",
        "pages": [3, 4, 5]
      },
      {
        "name": "Results and Validation",
        "purpose": "Show results, charts, and reliability",
        "pages": [6, 7, 8, 9]
      }
    ]
  }
}
```

## Page Spec

The Page Spec is the true execution instruction for each slide.

Required fields:

- page_number
- page_type
- title
- purpose
- core_message
- layout
- zones
- content_constraints
- visual_constraints
- required_elements
- forbidden_elements
- motion_recipe
- quality_targets
- safe_zones
- visual_slot_policy
- image_strategy
- text_surface_pairs
- typography_spacing
- z_index_plan
- collision_exclusions
- speaker_note

Example:

```json
{
  "page_spec": {
    "page_number": 3,
    "page_type": "method_flow",
    "title": "From Raw Data to Explainable Variables",
    "purpose": "Help judges understand the modeling pipeline quickly.",
    "core_message": "The model turns raw data into three interpretable variables before prediction.",
    "layout": {
      "archetype": "center_flow_with_side_notes",
      "grid": "12_col",
      "safe_zones": {
        "content": { "x": 96, "y": 80, "w": 1728, "h": 900 },
        "nav": { "x": 1680, "y": 980, "w": 220, "h": 70 },
        "no_text": []
      },
      "zones": [
        {
          "id": "title",
          "x": 110,
          "y": 90,
          "w": 980,
          "h": 120,
          "content_type": "text",
          "hierarchy": "primary"
        },
        {
          "id": "flow_diagram",
          "x": 180,
          "y": 280,
          "w": 1180,
          "h": 420,
          "content_type": "diagram",
          "hierarchy": "primary"
        },
        {
          "id": "explanation",
          "x": 1400,
          "y": 300,
          "w": 360,
          "h": 390,
          "content_type": "short_text",
          "hierarchy": "secondary"
        }
      ]
    },
    "content_constraints": {
      "max_words": 48,
      "max_bullets": 3,
      "required_elements": ["flow_diagram", "three_step_explanation"],
      "forbidden_elements": ["long_paragraph", "dense_table"]
    },
    "visual_constraints": {
      "background": "light",
      "accent_usage": "single_accent_for_flow_nodes",
      "image_or_diagram_weight": 70,
      "whitespace": 65,
      "minimum_font_size": 26,
      "text_surface_pairs": [
        {
          "zone": "title",
          "text": "var(--ink)",
          "surface": "var(--bg)",
          "contrast_target": "4.5:1"
        },
        {
          "zone": "explanation",
          "text": "var(--surface-light-ink)",
          "surface": "var(--surface-light)",
          "contrast_target": "4.5:1"
        }
      ],
      "typography_spacing": {
        "title_stack": {
          "zone": "title",
          "font_size": 96,
          "line_height": 1.08,
          "visual_effect_pad": 0,
          "gap_after": 44,
          "min_clearance_to_next_block": 36,
          "cjk_or_mixed_script": true,
          "has_stroke_shadow_or_offset": false
        },
        "subtitle_or_lead": {
          "font_size": 34,
          "line_height": 1.32,
          "gap_after": 24
        }
      },
      "visual_slot_policy": {
        "image_or_visual_role": "diagram",
        "approved_content_image_required": false,
        "empty_slot_fallback": "css_svg_diagram",
        "forbid_placeholder_box": true
      },
      "image_strategy": {
        "intent": "fallback_visual",
        "slot_type": null,
        "asset_id": null,
        "slot_id": null,
        "semantic_role": "explain_workflow",
        "ratio": null,
        "fit": null,
        "placement": "center",
        "caption": null,
        "text_overlay_allowed": false,
        "fallback_if_missing": "css_svg_diagram",
        "visible_placeholder": false
      },
      "z_index_plan": {
        "background": 0,
        "decoration": 2,
        "media_or_diagram": 4,
        "content": 10,
        "navigation": 90
      },
      "collision_exclusions": [
        "no primary text inside nav zone",
        "no decorative object above content layer"
      ]
    },
    "motion_recipe": {
      "type": "diagram_build",
      "intensity": 15,
      "final_state_readable": true
    },
    "quality_targets": {
      "design_dna_alignment": 85,
      "readability": 90,
      "density_fit": 85
    },
    "speaker_note": "Explain the process; leave formula details for the next slide."
  }
}
```

## Layout Archetypes

Use layout archetypes instead of rigid templates.

Current archetype library:

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

An archetype is reshaped by Design DNA:

```text
Apple Minimal + data_hero
-> large number, high whitespace, one short explanation

Cyber Editorial + data_hero
-> dark background, one neon accent, grid lines, sharper contrast

Academic + data_hero
-> bigger chart, clearer labels, lower whitespace, stronger evidence note
```

## Density Gate

Before rendering each slide, compare content amount with the profile capacity.

If too dense, choose or ask:

- compress copy
- split slide
- reduce whitespace
- increase page count
- switch layout archetype

Never silently shrink text below the minimum readable size.

## HTML Renderer Contract

For HTML decks, each Page Spec should compile to a fixed-stage slide:

```html
<section class="slide" data-page="03" data-layout="process-flow" data-density="balanced">
```

The renderer must:

- use the profile or adapter tokens
- respect the selected density strategy
- include a semantic motion recipe per slide
- reserve safe areas for navigation
- keep internal slide dimensions at 1920x1080
- prevent scrollbars
- prevent reference images from becoming content assets by accident
- prevent fake image placeholders and repeated meaningless side visuals
- prevent late image insertion after the blueprint has been planned
- enforce valid text/surface pairs
- enforce typography spacing and title-stack clearance
- enforce z-index layer order and collision exclusions

See [HTML Generation Rules](html-generation-rules.md).

## Renderer Instructions

LLM decides design and content. Renderer executes deterministically.

Renderer should enforce:

- fixed 16:9 canvas
- safe margins
- type scale
- design tokens
- max blocks per slide
- min font size
- no overlap
- no overflow
- allowed layout archetypes
- no empty image placeholders
- no unreadable text/surface pairs
- no title/subtitle/body text squeezing caused by unsafe line-height or missing vertical clearance
- no decorative/media layer covering text

## Visual Safety Fields

Every real Page Spec must include the following fields. If any field cannot be filled, revise the Page Spec before rendering.

```json
{
  "visual_safety": {
    "safe_zones": {
      "content": { "x": 96, "y": 80, "w": 1728, "h": 900 },
      "nav": { "x": 1680, "y": 980, "w": 220, "h": 70 },
      "no_text": [
        { "reason": "hero visual", "x": 1120, "y": 120, "w": 700, "h": 760 }
      ]
    },
    "visual_slot_policy": {
      "image_or_visual_role": "typographic_visual | diagram | approved_content_image | material_object | whitespace",
      "approved_content_image_required": false,
      "empty_slot_fallback": "typography | css_svg_diagram | material_object | whitespace",
      "forbid_placeholder_box": true
    },
    "image_strategy": {
      "intent": "none | approved_content_image | replaceable_slot | generated_image | fallback_visual",
      "slot_type": "hero_bleed | object_focus | screenshot_frame | evidence_card | image_grid | editorial_cutout | background_texture | side_visual | inline_thumbnail | diagram_image | null",
      "asset_id": "approved asset id or null",
      "slot_id": "replaceable slot id or null",
      "semantic_role": "evidence | atmosphere | identity | explanation | feature | proof | null",
      "ratio": "16:9 | 16:10 | 4:3 | 1:1 | 3:2 | null",
      "fit": "cover | contain | frame | null",
      "placement": "specific stage zone or null",
      "caption": "caption text or null",
      "text_overlay_allowed": false,
      "fallback_if_missing": "typography | css_svg_diagram | material_object | whitespace | css_wireframe | none",
      "visible_placeholder": false
    },
    "text_surface_pairs": [
      {
        "zone": "card_1",
        "surface": "var(--surface-muted)",
        "text": "var(--surface-muted-ink)",
        "contrast_target": "4.5:1"
      }
    ],
    "typography_spacing": {
      "display_title": {
        "font_size": 144,
        "line_height": 1.06,
        "visual_effect_pad": 24,
        "gap_after": 56,
        "min_clearance_to_next_block": 40,
        "cjk_or_mixed_script": true,
        "has_stroke_shadow_or_offset": true
      },
      "lead": {
        "font_size": 36,
        "line_height": 1.36,
        "gap_after": 24
      }
    },
    "z_index_plan": {
      "background": 0,
      "atmosphere": 1,
      "decoration": 2,
      "media": 4,
      "content": 10,
      "chrome": 80,
      "navigation": 90
    },
    "collision_exclusions": [
      "primary text cannot intersect no_text zones",
      "cards cannot intersect nav zone",
      "decoration cannot sit above content"
    ]
  }
}
```

See [Visual Safety Rules](visual-safety-rules.md).

For detailed image field semantics, read [Image Asset Strategy](image-asset-strategy.md).
