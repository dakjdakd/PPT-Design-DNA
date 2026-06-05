# Design Adapter

V3 turns a saved Design Profile into scenario-aware variants. It solves:

```text
I like this style, but I need it for a different presentation context.
```

Example:

```text
Apple Minimal
-> Apple Academic
-> Apple Consulting
-> Apple Startup Pitch
-> Apple Product Launch
```

Adapters are derived assets. The base profile remains the source; the adapter records what changed for the scenario.

## When To Use

Use the adapter after the profile is accepted/saved and after PPT requirements are known.

Do not adapt before the user passes the Design DNA Panel Gate. Do not ask presentation task questions before the panel gate just to decide an adapter.

## Scenario Types

Recognize at least:

- academic_defense
- math_modeling
- business_report
- investor_pitch
- product_launch
- teaching_courseware
- sales_proposal
- portfolio_showcase
- consulting_report

If the scenario is unclear, infer from the user's purpose/audience/content only after Requirement Discovery.

## Scenario Targets

Use scenario target ranges to compare against the active profile. These are review anchors, not absolute laws.

```json
{
  "math_modeling": {
    "information_density": [60, 80],
    "chart_weight": [70, 90],
    "formula_friendliness": [65, 85],
    "whitespace": [35, 60],
    "motion_intensity": [5, 25]
  },
  "academic_defense": {
    "information_density": [55, 75],
    "chart_weight": [60, 85],
    "formula_friendliness": [55, 80],
    "whitespace": [40, 65],
    "motion_intensity": [5, 25]
  },
  "investor_pitch": {
    "information_density": [35, 60],
    "chart_weight": [45, 75],
    "title_weight": [70, 95],
    "business": [65, 90],
    "motion_intensity": [25, 55]
  },
  "product_launch": {
    "information_density": [20, 45],
    "image_weight": [65, 90],
    "title_weight": [75, 95],
    "whitespace": [60, 90],
    "motion_intensity": [35, 70]
  },
  "consulting_report": {
    "information_density": [55, 80],
    "chart_weight": [65, 90],
    "business": [70, 95],
    "grid_strictness": [75, 95],
    "motion_intensity": [5, 25]
  }
}
```

## Conflict Detection

Compare active Design DNA against scenario targets.

Report only meaningful conflicts:

```text
Design: Apple Minimal
Scenario: math modeling defense

Conflict:
- information density is 30, but math modeling usually needs 60-80
- chart weight is 35, but math modeling usually needs 70-90
- formula friendliness is 20, but formula-heavy defense usually needs 65-85
```

Use visual-director advice, not a hard refusal:

```text
This style is excellent for a product launch, but risky for math modeling defense:
- data display space may be insufficient
- charts may become too small
- formulas may become decorative instead of readable

Recommendation: preserve the Apple-like minimal mood, but increase density, chart weight, and formula friendliness.
```

## Three Handling Modes

Always offer these when conflict is high:

```text
A. Visual first
Preserve the original Design DNA. Compress content into core conclusions.
Best for speeches, launches, pitch openings, or emotional persuasion.

B. Dynamic downgrade
Allow the deck to become slightly less beautiful. Lower whitespace, increase density, enlarge charts/formulas.
Best for defense, reports, teacher review, and evidence-heavy decks.

C. Cell division
Preserve visual quality by splitting dense content across more slides.
Best when the user wants both beauty and content completeness.
```

Do not block the user from choosing A. Warn clearly and proceed.

## Adapter Generation

When the user chooses an adaptation path, generate an adapter:

```text
Base Profile: Cyber Minimal Editorial
Scenario: math modeling defense
Generated Adapter: Cyber Minimal Academic
Strategy: cell division
```

Example parameter changes:

```text
Cyber: 30 -> 15
Academic: 20 -> 65
Information density: 35 -> 65
Chart weight: 35 -> 80
Formula friendliness: 20 -> 75
Whitespace: 70 -> 50
Motion intensity: 35 -> 15
```

Every adapter must include:

- adapter_id
- adapter_name
- base_profile_id
- base_version_id
- scenario
- selected_strategy
- preserve
- adapt
- conflicts
- visual_director_advice
- design_diff
- deck_contract_overrides

## Adapter Storage

Recommended profile library shape:

```text
design-profiles/
  cyber-minimal-editorial/
    profile.json
    versions/
      v001.json
      v002.json
    adapters/
      academic/
        adapter.json
        versions/
          a001.json
        diffs/
          base-to-a001.md
      consulting/
        adapter.json
```

Adapter versions are immutable. If the user tunes an adapter, create a new adapter version.

## Adapter Diff

Adapter Diff must explain visual consequences:

```text
Information density: 35 -> 65
Impact:
- each page can carry more evidence
- body text and chart zones become larger
- whitespace decreases, so the deck feels less luxurious
- review slides become more teacher-friendly

Motion intensity: 35 -> 15
Impact:
- transitions become calmer
- data and formulas feel more credible
- less attention is spent on spectacle
```

If a consequence is only likely, label it as an inference.

## Design Contract Impact

The Design Contract should name what is preserved and what changes:

```json
{
  "preserve": [
    "minimal mood",
    "clean typography",
    "single-focus pages"
  ],
  "adapt": {
    "information_density": { "from": 35, "to": 65 },
    "chart_weight": { "from": 35, "to": 80 },
    "formula_friendliness": { "from": 20, "to": 75 }
  },
  "negative_constraints": [
    "Do not shrink formulas below readable size.",
    "Do not use product-launch whitespace on evidence slides.",
    "Do not animate charts in a way that delays comprehension."
  ]
}
```

## Boundary

Adapters do not replace the profile library. They live under or beside the base profile as scenario-specific variants. The user can later reuse an adapter directly.
