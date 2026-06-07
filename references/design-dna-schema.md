# Design DNA Schema

V3 uses a layered schema. The user sees a simple control panel and profile library; the agent uses a stricter execution schema; adapters derive scenario variants; generation uses quality constraints.

## Top-Level Shape

```json
{
  "version": "3.0",
  "profile_id": "my-design-profile-01",
  "profile_name": "Cyber Minimal Editorial",
  "current_profile_version": "v001",
  "source": {},
  "discovery": {},
  "user_dna": {},
  "execution_dna": {},
  "design_prompt": {},
  "negative_constraints": [],
  "tokens": {},
  "profile_metadata": {},
  "versioning": {},
  "compact_usage": {},
  "adapters": {},
  "quality_constraints": {}
}
```

For saved profiles, `profile_metadata` and `versioning` are required. `compact_usage` is optional. `discovery` is required when the profile came from no-image Design Discovery. `adapters` is required only when scenario variants are created.

## Minimal Reproducible Profile

A saved Design Profile should keep only what is needed to reproduce the style.

Required in every version snapshot:

- `version`
- `profile_id`
- `profile_name`
- `source` or `discovery`
- `user_dna`
- `execution_dna`
- `tokens`
- reference subject firewall policy when the profile came from images
- `negative_constraints`
- `design_prompt`
- `quality_constraints`

Required in `profile.json`:

- `profile_id`
- `display_name`
- `current_version`
- `created_at`
- `updated_at`
- `source_summary`
- `best_for`
- `risky_for`
- `primary_moods`
- `one_line_summary`
- `versions`
- `adapters`, if any

Optional by default:

- copied reference images
- thumbnail galleries
- detailed usage logs
- exported prompts
- exported design tokens
- human-readable reports

Store bulky or derived assets only when the user asks for them. The source of truth is the version snapshot JSON, not exported prompts or reports.

## Source

Records where the style came from and how references were fused.

Valid `input_mode` values:

- `single_image`
- `multi_image`
- `saved_profile`
- `no_image_discovery`
- `named_style_discovery`

```json
{
  "source": {
    "input_mode": "multi_image",
    "fusion_strategy": "blend",
    "source_assets": [
      {
        "id": "img_01",
        "type": "game_screenshot",
        "description": "Cyberpunk 2077 neon city scene",
        "weight": 0.45,
        "role": "style_reference",
        "style_traits_allowed": [
          "dark cinematic atmosphere",
          "neon accent contrast",
          "high contrast lighting",
          "immersive depth"
        ],
        "subject_matter_detected": [
          "vehicles",
          "people",
          "buildings"
        ],
        "subject_replication_policy": "forbidden"
      },
      {
        "id": "img_02",
        "type": "website_screenshot",
        "description": "Notion homepage",
        "weight": 0.55,
        "role": "style_reference",
        "style_traits_allowed": [
          "high whitespace",
          "strict grid",
          "calm typography",
          "low visual noise"
        ],
        "subject_matter_detected": [
          "specific UI surface",
          "icons",
          "logo"
        ],
        "subject_replication_policy": "forbidden"
      }
    ],
    "extraction_confidence": 0.82
  }
}
```

`role` must distinguish `style_reference` from `content_asset`. Style references must not be embedded in the deck by default.

For every `style_reference`, record `style_traits_allowed`, `subject_matter_detected`, and `subject_replication_policy`. The default policy is `forbidden`: identifiable subjects in reference images are not reusable visual content and cannot be redrawn, traced, stylized, approximated, abstracted into mascots, or rebuilt as CSS/SVG/HTML/AI visuals. A cat reference may produce yellow palette, hand-drawn line quality, soft color blocks, or playful hierarchy; it must not produce a cat, cat outline, cat ears, cat face, or cat-shaped decoration.

Allowed style traits include palette, type mood, composition rhythm, border/shadow treatment, material, texture, line quality, information density, crop behavior, contrast behavior, and motion feeling. Forbidden subject matter includes people, animals, characters, mascots, specific products, buildings, vehicles, toys, recognizable objects, and subject parts such as faces, eyes, ears, tails, fins, horns, wings, paws, posture, clothing, fur, scales, and silhouettes.

## Discovery

When Design DNA comes from no-image discovery, record questions, answers, named style parsing, and chosen direction.

```json
{
  "discovery": {
    "mode": "no_image",
    "named_style_input": "OpenAI style but for university defense",
    "answers": {
      "first_impression": "authoritative and credible",
      "density": "balanced for live explanation",
      "closest_world": "academic/research"
    },
    "directions": [
      {
        "name": "OpenAI Minimal Academic",
        "summary": "Calm, credible, medium-density research presentation."
      },
      {
        "name": "Editorial Research",
        "summary": "Magazine-like narrative research deck."
      }
    ],
    "selected_direction": "OpenAI Minimal Academic"
  }
}
```

## Profile Metadata

Saved profiles need enough metadata to become manageable assets.

```json
{
  "profile_metadata": {
    "profile_id": "cyber-minimal-editorial",
    "display_name": "Cyber Minimal Editorial",
    "created_at": "2026-06-05T21:40:00+08:00",
    "updated_at": "2026-06-05T22:10:00+08:00",
    "last_used_at": "2026-06-05T22:30:00+08:00",
    "last_output_path": "outputs/math-modeling-defense/index.html",
    "best_for": ["product launch", "tech portfolio", "creative pitch"],
    "risky_for": ["formula-heavy defense", "dense financial report"],
    "primary_moods": ["minimal", "tech", "editorial"],
    "one_line_summary": "Dark tech mood softened by Notion-like grid clarity."
  }
}
```

## Versioning

Versions are immutable Design DNA snapshots. Tuning creates a new version.

```json
{
  "versioning": {
    "current_version": "v002",
    "versions": [
      {
        "version_id": "v001",
        "created_at": "2026-06-05T21:40:00+08:00",
        "change_reason": "original extraction",
        "snapshot_path": "versions/v001.json"
      },
      {
        "version_id": "v002",
        "created_at": "2026-06-05T22:10:00+08:00",
        "parent_version_id": "v001",
        "change_reason": "reduced cyber intensity and increased whitespace",
        "snapshot_path": "versions/v002.json",
        "diff_path": "diffs/v001-to-v002.md"
      }
    ]
  }
}
```

## User DNA

This is the visible control panel. It should be easy to understand and tune.

### Fixed Hard Parameters

These exist for every profile:

- whitespace
- information_density
- image_weight
- title_weight
- chart_weight
- text_density
- formula_friendliness
- grid_strictness
- hierarchy_strength
- motion_intensity

The minimum panel shown to users must include:

```text
Whitespace
Information density
Image/visual weight
Title weight
Chart weight
Text density
Motion intensity
```

### Dynamic Semantic Tags

These are inferred from references or discovery answers and may vary:

- cyber
- minimal
- editorial
- academic
- tech
- premium
- futuristic
- business
- playful
- serious
- youthful
- luxurious
- cinematic
- trustworthy
- experimental
- toy_3d
- candy_color
- soft_future

Example:

```json
{
  "user_dna": {
    "fixed_parameters": {
      "whitespace": 70,
      "information_density": 35,
      "image_weight": 65,
      "title_weight": 85,
      "chart_weight": 35,
      "text_density": 30,
      "formula_friendliness": 20,
      "grid_strictness": 78,
      "hierarchy_strength": 85,
      "motion_intensity": 35
    },
    "semantic_tags": {
      "minimal": 90,
      "cyber": 30,
      "tech": 82,
      "editorial": 55,
      "academic": 20,
      "business": 45,
      "playful": 12,
      "serious": 68,
      "premium": 74,
      "emotional": 28
    },
    "plain_language_summary": "A restrained cyber-minimal design combining dark tech atmosphere with Notion-like grid clarity."
  }
}
```

## Five Required DNA Layers

### 1. Mood

Mood is visual psychology. It must not be reduced to colors.

Recommended fields:

- minimal
- tech
- academic
- business
- futuristic
- premium
- editorial
- youthful
- playful
- serious
- authoritative
- trustworthy
- emotional
- experimental
- luxurious

Impact examples:

- high minimal -> fewer blocks, more whitespace, fewer colors
- high academic -> more chart weight, formula friendliness, clearer citations
- high cyber -> darker surfaces, neon accents, stronger contrast
- high premium -> restrained palette, larger whitespace, refined type hierarchy

### 2. Composition

Composition controls how slides are organized.

Recommended fields:

- whitespace
- information_density
- alignment
- grid_system
- grid_strictness
- hierarchy_strength
- visual_focus
- asymmetry
- layout_rhythm
- section_rhythm
- preferred_layout_archetypes
- forbidden_layout_patterns

### 3. Visual

Visual controls design tokens and treatments.

Recommended fields:

- primary_background
- secondary_background
- primary_text
- secondary_text
- accent_primary
- accent_secondary
- neutral_scale
- heading_style
- body_style
- font_candidates
- type_scale
- line_height
- radius
- border_style
- shadow_style
- gradient_usage
- material
- texture
- image_treatment
- crop_strategy

### 4. Content Strategy

Content Strategy defines what the style can safely carry.

Recommended fields:

- density_mode
- max_words_per_slide
- max_bullets_per_slide
- max_bullet_length
- image_text_ratio
- image_weight
- chart_weight
- formula_friendliness
- data_table_friendliness
- text_heavy_tolerance
- preferred_content_forms
- split_rules

### 5. Presentation

Presentation controls rhythm, motion, and storytelling.

Recommended fields:

- pacing
- narrative_style
- speaker_led_vs_reading_first
- animation_intensity
- transition_style
- section_break_frequency
- emotional_curve
- reveal_strategy
- motion_recipes

## Execution DNA

Execution DNA is the stricter internal schema used to generate slides.

It should include:

- fixed 16:9 canvas
- safe margins
- design tokens
- grid rules
- layout behavior
- typography scale
- density gates
- image treatment rules
- reference subject firewall
- mechanical layout preflight requirements
- motion rules
- negative constraints

Example:

```json
{
  "execution_dna": {
    "canvas": {
      "aspect_ratio": "16:9",
      "target_size": { "width": 1920, "height": 1080 },
      "safe_margin": { "top": 90, "right": 110, "bottom": 90, "left": 110 }
    },
    "composition_rules": {
      "max_primary_blocks": 3,
      "max_nested_cards": 0,
      "snap_to_grid": true,
      "avoid_centered_everything": true,
      "prefer_single_primary_focus": true
    },
    "density_rules": {
      "max_words_per_slide": 55,
      "minimum_font_size": 24,
      "split_when_overflow": true
    },
    "reference_subject_firewall": {
      "enabled": true,
      "forbidden_subjects": [
        "people",
        "animals",
        "characters",
        "mascots",
        "specific objects from references"
      ],
      "allowed_surrogates": [
        "typographic visual",
        "abstract material object",
        "geometric diagram",
        "texture",
        "pattern",
        "intentional whitespace"
      ],
      "forbid_subject_silhouette": true,
      "forbid_subject_parts": true,
      "forbid_svg_redraw": true,
      "forbid_ai_redraw": true
    },
    "mechanical_layout_preflight": {
      "required_before_html": true,
      "estimate_text_fit": true,
      "reserve_visual_effect_padding": true,
      "reserve_nav_safe_zone": true,
      "check_collision_pairs": true,
      "if_fail": "recompose_reduce_copy_reduce_title_or_split_slide"
    },
    "motion_rules": {
      "max_motion_intensity": 45,
      "prefers_reduced_motion": true,
      "avoid_generic_repeated_animation": true
    }
  }
}
```

## Adapters

Adapters are derived scenario variants of a profile.

```json
{
  "adapters": {
    "academic": {
      "adapter_id": "cyber-minimal-academic",
      "adapter_name": "Cyber Minimal Academic",
      "base_profile_id": "cyber-minimal-editorial",
      "base_version_id": "v002",
      "current_adapter_version": "a001",
      "scenario": "math_modeling",
      "selected_strategy": "cell_division",
      "preserve": ["minimal grid", "dark tech mood", "single accent"],
      "adapt": {
        "semantic_tags.cyber": { "from": 30, "to": 15 },
        "semantic_tags.academic": { "from": 20, "to": 65 },
        "fixed_parameters.information_density": { "from": 35, "to": 65 },
        "fixed_parameters.chart_weight": { "from": 35, "to": 80 },
        "fixed_parameters.whitespace": { "from": 70, "to": 50 }
      },
      "conflicts": [
        "Base profile has low information density for math modeling.",
        "Base profile has low formula friendliness."
      ],
      "visual_director_advice": "Preserve cyber-minimal identity but give evidence slides more room.",
      "diff_path": "adapters/academic/diffs/base-to-a001.md"
    }
  }
}
```

Adapter changes must include visual consequences, not only numeric deltas.

## Negative Constraints

Every profile must include "do not" rules. These are often more effective than style adjectives.

Examples:

- Do not shrink text below the minimum readable size.
- Do not use more than one accent color on one slide unless DNA supports it.
- Do not create dense card walls unless the scenario explicitly requires dashboard density.
- Do not preserve high whitespace when it makes charts unreadable.
- Do not use decorative effects that compete with the core message.
- Do not mix unrelated visual systems inside one deck.
- Do not place reference images into the deck unless explicitly marked as content.

## Design Prompt

The design prompt is compiled from the schema. It is not the source of truth. Exporting a prompt must not mutate the profile. To change style, update Design DNA, create a new version or adapter version, then regenerate the derived prompt.

```json
{
  "design_prompt": {
    "short": "Cyber Minimal Editorial: controlled dark tech mood, Notion-like grid clarity, high whitespace, single-focus slides.",
    "long": "Use a restrained cyber-minimal visual system. Preserve dark technology atmosphere but reduce neon intensity and visual noise. Combine it with Notion-like spacing, grid clarity, calm editorial structure, large titles, single focal visuals, short claims, and precise diagrams.",
    "style_do": [
      "Use high whitespace and clear typographic hierarchy",
      "Use one accent color per slide",
      "Use large single-focus visuals",
      "Use grid-aligned layouts"
    ],
    "style_dont": [
      "Do not use multiple neon colors together",
      "Do not create dense card walls",
      "Do not shrink text to fit content",
      "Do not mix gaming UI language with academic diagrams without adaptation"
    ]
  }
}
```
