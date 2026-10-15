# Architecture

[Project overview](../README.md) · [Getting started](getting-started.md) · [Contributing](../CONTRIBUTING.md)

PPT-Design-DNA is an instruction-driven skill. The AI host executes the workflow described in `SKILL.md` and its references. A standalone Node.js script validates selected layout properties of generated HTML.

## Repository responsibilities

```text
PPT-Design-DNA/
├── README.md
├── README.zh-CN.md
├── CONTRIBUTING.md
├── LICENSE
├── .editorconfig
├── .gitignore
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── workflow.md
│   ├── design-discovery.md
│   ├── design-dna-schema.md
│   ├── profile-management.md
│   ├── design-adapter.md
│   ├── existing-deck-enhancement.md
│   ├── requirement-panels.md
│   ├── image-asset-strategy.md
│   ├── page-spec-contract.md
│   ├── html-generation-rules.md
│   ├── visual-safety-rules.md
│   ├── quality-rubric.md
│   ├── output-contract.md
│   └── reference-skill-lessons.md
├── scripts/
│   └── ppt-layout-guard.js
└── docs/
    ├── getting-started.md
    ├── architecture.md
    ├── showcase.md
    └── media/
        ├── overview-en.png
        ├── overview-zh-cn.png
        ├── pop-comic/
        └── blue-sketch-bubble/
```

| Location | Responsibility |
| --- | --- |
| `README.md`, `README.zh-CN.md` | English and Simplified Chinese project overviews with matching navigation and capabilities. |
| `SKILL.md` | Runtime entry point, mode routing, confirmation gates, and references to detailed rules. |
| `agents/openai.yaml` | Display metadata, default invocation prompt, and implicit invocation policy. |
| `references/` | Runtime specifications loaded for the relevant part of a task. |
| `scripts/` | Executable helpers; currently the HTML layout guard. |
| `docs/` | Human-facing setup, architecture, and case studies. |
| `docs/media/` | Documentation imagery, grouped by visual case and named by role. |

The runtime entry point, reference paths, script name, and skill identifier remain stable. Documentation images are separate from any content assets created for a user's deck. The skill format also supports an `assets/` directory; add it only when the skill actually ships generation assets.

## Execution flow

```text
User request
    ↓
Mode routing
    ├── New presentation
    ├── Existing deck renovation / conversion
    ├── Profile management
    └── Skill design discussion

Presentation workflow
    ↓
Design source → Design DNA → Preview / parameter confirmation
    ↓
Presentation requirements → Content image strategy
    ↓
Scenario fit → Optional Design Adapter
    ↓
Design Contract → Blueprint → Page Specs
    ↓
HTML generation → Source-level layout guard → Delivery
    ↓
Optional PDF / PPTX export
```

Profile management and skill design discussions do not generate a presentation unless requested. Confirmation gates are part of the runtime contract: selecting a design direction does not automatically authorize assumptions about slide count, audience, or content.

## Core concepts

| Concept | Role |
| --- | --- |
| Design DNA | A structured visual system covering Mood, Composition, Visual, Content Strategy, and Presentation. |
| Active candidate | The accepted design for a task; it can remain unsaved. |
| Design Profile | An explicitly saved, versioned reusable design asset. |
| Design Adapter | A derived profile variant for a particular audience, density, or presentation scenario. |
| Design Contract | The constraints that bind the selected design to the task. |
| Blueprint | The deck-level narrative, sequence, and slide purposes. |
| Page Specs | Per-slide content, composition, geometry, image roles, and layout budgets. |
| Layout guard | A source-level check of the generated HTML against supported mechanical rules. |

Reference imagery supplies visual rules. Its recognizable subjects are excluded from generated slide artwork by the runtime's reference-subject policy. Images explicitly selected as slide content follow a separate asset strategy.

## Runtime specification map

| Area | Specification | Defines |
| --- | --- | --- |
| Orchestration | [Workflow](../references/workflow.md) | Phase order, confirmation gates, and task progression. |
| Discovery | [Design Discovery](../references/design-discovery.md) | Candidate directions when no reference image is supplied. |
| Data model | [Design DNA schema](../references/design-dna-schema.md) | DNA layers, tokens, metadata, and constraints. |
| Persistence | [Profile management](../references/profile-management.md) | Explicit saves, version snapshots, indexes, and diffs. |
| Adaptation | [Design Adapter](../references/design-adapter.md) | Scenario fit and derived profile variants. |
| Renovation | [Existing deck enhancement](../references/existing-deck-enhancement.md) | Intake and content fidelity for existing presentations. |
| Intake | [Requirement panels](../references/requirement-panels.md) | Option-based presentation and renovation questions. |
| Images | [Image asset strategy](../references/image-asset-strategy.md) | Content-image intent, slots, fit, and fallbacks. |
| Planning | [Page Spec contract](../references/page-spec-contract.md) | Design Contract, Blueprint, and per-slide specs. |
| Rendering | [HTML generation rules](../references/html-generation-rules.md) | Fixed-stage HTML, typography, motion, and navigation. |
| Safety | [Visual safety rules](../references/visual-safety-rules.md) | Contrast, layering, spacing, geometry, and text budgets. |
| Evaluation | [Quality rubric](../references/quality-rubric.md) | Quality targets and blocking failure conditions. |
| Delivery | [Output contract](../references/output-contract.md) | Artifact locations and retention rules. |
| Design rationale | [Reference skill lessons](../references/reference-skill-lessons.md) | Lessons incorporated from related presentation workflows. |

`SKILL.md` and these references define execution behavior. Human-facing documentation explains that behavior without introducing an additional workflow or schema.

## Generated artifact boundary

User artifacts belong in the current working project, outside the skill's source or installation directory:

```text
working-project/
├── outputs/
│   └── <deck-slug>/
│       ├── index.html
│       ├── deck-manifest.json
│       ├── layout-guard-report.json
│       ├── assets/       # Only when content media is needed
│       ├── exports/      # Only when export is requested
│       └── specs/        # Only when retained specs are requested
└── design-profiles/      # Only after explicit save / management approval
```

Design Contract, Blueprint, and Page Specs are required planning steps. Persisting those intermediate specs is optional. A saved profile preserves the reusable design system independently of any particular generated deck. The [output contract](../references/output-contract.md) is authoritative for retained files.

## Validation boundaries

The [layout guard](../scripts/ppt-layout-guard.js) reads HTML source using Node.js built-ins. It checks supported declarations and estimates, including layout budgets, `data-zone` markers, headline wrapping constraints, and spacing relationships. It can emit a JSON report through `--report`.

The guard does not launch a browser or measure rendered glyphs. A passing result is evidence for the supported source checks, not a guarantee of complete visual correctness, accessibility, or export fidelity. Browser QA is a separate, explicitly requested workflow in the current skill. PDF/PPTX conversion depends on tools supplied by the host.

## Naming and language

Use descriptive lowercase English names with hyphens for directories and ordinary files. Preserve established entry points such as `SKILL.md`, `README.md`, and `agents/openai.yaml`; use `README.zh-CN.md` for the Chinese overview.

Within each visual case, use `reference-01.webp`, `slide-01.png`, and language-qualified comparison images such as `comparison-en.png` and `comparison-zh-cn.png`. Slide numbering follows presentation order among the included images. These are visual case studies; complete runnable decks and saved profiles are not bundled.

English is the primary documentation language. Keep the two READMEs aligned in scope. Runtime examples may retain language-specific content where it serves the workflow, including Chinese requirement panels and CJK typography rules.
