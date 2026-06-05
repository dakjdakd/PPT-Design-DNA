# V3 Profile Management

V3 turns Design DNA from a one-time generation result into a reusable design asset, then lets that asset travel into different scenarios through adapters.

Active V3 scope:

- My Design Profiles
- Profile detail view
- Profile versions
- Design Diff
- Design Prompt export
- Usage records
- Scenario adapters
- Adapter versions
- Adapter Diff

Not in scope:

- team collaboration
- marketplace/community profiles
- destructive deletion workflows

## Profile Library

Recommended workspace layout:

```text
design-profiles/
  profile-index.json
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
          base-to-a001.json
          base-to-a001.md
      consulting/
        adapter.json
    diffs/
      v001-to-v002.json
      v001-to-v002.md
```

Logical separation:

- `profile-index.json`: profile list and quick metadata
- `profile.json`: current profile pointer and stable identity
- `versions/*.json`: immutable Design DNA snapshots
- `adapters/*`: scenario-specific variants derived from a profile/version
- `diffs/*.json`: required machine-readable version changes
- `diffs/*.md`: optional human-readable version changes, only when the user asks

Do not create `exports/`, `usage-log.json`, copied reference images, thumbnails, or long reports by default. See [Output Contract](output-contract.md) for required vs optional assets.

## Profile Index

Each entry in `profile-index.json` should include enough metadata to list profiles without loading every version.

```json
{
  "profiles": [
    {
      "profile_id": "cyber-minimal-editorial",
      "display_name": "Cyber Minimal Editorial",
      "current_version": "v002",
      "adapters": ["academic", "startup_pitch"],
      "created_at": "2026-06-05T21:40:00+08:00",
      "updated_at": "2026-06-05T22:10:00+08:00",
      "last_used_at": "2026-06-05T22:30:00+08:00",
      "last_output_path": "outputs/math-modeling-defense/index.html",
      "source_summary": ["Cyberpunk 2077 screenshot", "Notion homepage"],
      "primary_moods": ["minimal", "tech", "editorial"],
      "best_for": ["product launch", "tech portfolio", "creative pitch"],
      "risky_for": ["formula-heavy defense", "dense financial report"],
      "one_line_summary": "Dark tech mood softened by Notion-like grid clarity."
    }
  ]
}
```

When the user asks "show my designs", return a compact list:

```text
My Design Profiles
01 Cyber Minimal Editorial - v002 - adapters: academic, startup_pitch
02 Apple Academic - v001 - best for defense / research report
03 Notion Clean Report - v003 - best for internal updates / documentation
```

Do not include internal JSON unless the user asks.

## Profile Detail

When the user opens a profile, show:

- profile name
- current version
- adapters
- source images or discovery origin
- created/updated/last used
- suitable scenarios
- risky scenarios
- primary mood tags
- fixed hard parameters
- dynamic semantic tags
- plain-language design summary
- available versions
- compact recent usage if present

## Version Rules

Versions are immutable snapshots. Never overwrite a saved version.

Create a new normal profile version when:

- the user tunes any fixed hard parameter
- the user tunes any dynamic semantic tag
- the user changes source weighting or fusion strategy
- the user imports a profile and modifies it

Create an adapter version, not a normal version, when:

- the base visual identity remains but the target scenario changes
- the user chooses visual-first, dynamic-downgrade, or cell-division strategy
- the result is named like `Apple Academic`, `Cyber Consulting`, or `Notion Pitch`

Version naming:

```text
v001 - original extraction
v002 - reduced cyber intensity
v003 - increased academic density

a001 - academic adapter from v002
a002 - academic adapter with higher chart weight
```

Version snapshots should include:

- version_id
- parent_version_id
- created_at
- change_reason
- source summary
- user_dna
- execution_dna
- design_prompt
- tokens
- negative_constraints
- best_for
- risky_for

## Design Diff

Design Diff must explain design consequences, not only numeric changes.

The required persisted file is JSON. Markdown Diff is optional and should be created only when the user asks for a readable export.

Required JSON shape:

```json
{
  "diff_id": "v001-to-v002",
  "diff_type": "profile_version",
  "profile_id": "cyber-minimal-editorial",
  "adapter_id": null,
  "from_version": "v001",
  "to_version": "v002",
  "created_at": "2026-06-05T22:10:00+08:00",
  "change_reason": "reduced cyber intensity and increased whitespace",
  "parameter_changes": [
    {
      "path": "user_dna.semantic_tags.cyber",
      "label": "Cyber",
      "from": 80,
      "to": 30
    }
  ],
  "visual_consequences": [
    {
      "change_ref": "user_dna.semantic_tags.cyber",
      "impact": "Neon saturation and glow edges decrease while the dark tech atmosphere remains.",
      "confidence": "direct"
    }
  ],
  "scenario_consequences": [
    {
      "scenario": "speech",
      "impact": "The deck becomes calmer and easier to present live.",
      "confidence": "inferred"
    }
  ],
  "risks": [
    "The profile may become less distinctive for cyberpunk-themed launches."
  ],
  "recommendation": "Use v002 for calmer product or portfolio decks; keep v001 for high-energy visual openings."
}
```

Required fields:

- `diff_id`
- `diff_type`: `profile_version` or `adapter_version`
- `profile_id`
- `from_version`
- `to_version`
- `created_at`
- `change_reason`
- `parameter_changes`
- `visual_consequences`
- `risks`
- `recommendation`

Use `adapter_id` when the diff is for an adapter. Use `scenario_consequences` when the change affects scenario fit.

```text
V1 -> V2

Cyber: 80 -> 30
Impact:
- neon saturation decreases
- glow edges are reduced
- dark tech atmosphere remains
- visual stimulation decreases

Whitespace: 70 -> 85
Impact:
- slides feel calmer
- each page carries less content
- better for speeches, riskier for dense reports
```

If a change has no clear design consequence, do not invent certainty. Say the consequence is likely and mark it as an inference.

## Scenario Adapters

Adapters let one style travel to many tasks.

Example:

```text
Cyber Minimal Editorial
|-- Base
|-- Academic Adapter
|-- Consulting Adapter
`-- Startup Pitch Adapter
```

Each adapter should include:

- adapter_id
- adapter_name
- base_profile_id
- base_version_id
- scenario
- selected_strategy
- conflicts
- visual_director_advice
- parameter_changes
- design_diff
- contract_overrides
- best_for
- risky_for

When listing profiles, show adapters only as a compact suffix unless the user asks for details.

When opening an adapter, show:

- base profile and version
- scenario
- selected strategy
- what it preserves
- what it changes
- conflicts it solved
- remaining risks
- usage history

See [Design Adapter](design-adapter.md).

## Design Prompt Export

Design Prompt is a derived export. It is useful, but it is not the source of truth.

Export formats:

- `design-prompt.md`
- `design-tokens.json`
- optional short prompt block for other tools

Prompt export is optional. Do not create export files unless the user asks to export or share the profile with another tool.

`design-prompt.md` should include:

- profile or adapter name and version
- short design prompt
- long design prompt
- style do rules
- style don't rules
- best-fit scenarios
- risky scenarios
- derived tokens summary

Rule:

```text
Do not edit the exported prompt as if it were the source profile. To change the style, update Design DNA and create a new version/adapter version, then regenerate the prompt.
```

## Usage Log

Usage history is optional and not required to reproduce a Design Profile.

By default, update compact usage pointers only:

- `last_used_at`
- `last_output_path`

Create `usage-log.json` only when the user asks for detailed history or when a project needs auditability.

```json
{
  "usage": [
    {
      "used_at": "2026-06-05T22:30:00+08:00",
      "profile_version": "v002",
      "adapter_version": "academic/a001",
      "deck_title": "Math Modeling Defense",
      "deck_type": "defense",
      "output_path": "outputs/math-modeling-defense/index.html",
      "fit_strategy": "cell_division",
      "notes": "High-whitespace profile adapted by splitting dense model content across more pages."
    }
  ]
}
```

When finalizing a deck, update compact usage pointers if a Design Profile or adapter was used. Append a detailed usage entry only if `usage-log.json` already exists or the user requested detailed history.

## Profile Commands

Understand these request types:

- "show/list my designs" -> list profile index
- "open/view this design" -> profile detail
- "compare v1 and v2" -> Design Diff
- "make this less cyber / more academic" -> create new version with diff
- "make this Apple style work for math modeling" -> propose/create an adapter
- "use the academic adapter" -> proceed to PPT Requirement Discovery with that adapter
- "export prompt" -> generate derived `design-prompt.md`
- "use this profile for a deck" -> proceed to PPT Requirement Discovery
- "what did I use this design for?" -> show compact usage pointers or create/read `usage-log.json` if detailed history is requested

Avoid destructive actions. If the user asks to delete a profile, prefer archiving and ask for explicit confirmation.

## Interaction Orders

Creating a new profile from images:

```text
reference images
-> extraction
-> Design DNA parameter panel
-> user confirm/tune
-> save profile v001
-> ask whether to create a deck now
```

Creating a new profile without images:

```text
Design Discovery
-> choose/mix DNA direction
-> Design DNA parameter panel
-> user confirm/tune
-> save profile v001
-> ask whether to create a deck now
```

Using an existing profile:

```text
select profile
-> show profile detail/current version/adapters
-> ask whether to use current version, tune first, or choose adapter
-> if tune: create new version and Design Diff
-> if use: proceed to PPT Requirement Discovery
```

Creating a deck:

```text
selected/saved profile version
-> PPT Requirement Discovery
-> design-scenario fit check
-> optional adapter creation/selection
-> Design Contract
-> Blueprint
-> Page Specs
-> HTML deck
-> optional PDF/PPTX export if requested
-> compact usage pointer update
```
