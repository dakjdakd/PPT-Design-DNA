# Output Contract

Use this contract whenever creating, reusing, or generating from Design Profiles.

The goal is **minimal reproducible assets**, not a bulky management archive.

## Artifact Root

Use the current user project root as the artifact root.

Never save user-generated profiles, decks, media, or exports into the skill source or skill installation directory. A skill directory contains instructions only.

## Hard Directory Layout

```text
project-root/
  design-profiles/
    profile-index.json
    <profile-id>/
      profile.json
      versions/
        v001.json
      diffs/
        v001-to-v002.json
      adapters/
        <adapter-id>/
          adapter.json
          versions/
            a001.json
          diffs/
            base-to-a001.json

  outputs/
    <deck-slug>/
      index.html
      deck-manifest.json
      assets/
        images/
        fonts/
      exports/
        deck.pdf
        deck.pptx
      specs/
        design-contract.json
        ppt-blueprint.json
        page-specs.json
```

Only create folders when needed:

- Create `assets/` only when user-approved content images, generated images, fonts, or media are used.
- Create `exports/` only when PDF/PPTX is requested.
- Create `specs/` only when the user asks to inspect, edit, audit, or regenerate from internal specs.
- Create `adapters/` only when an adapter exists.
- Create `diffs/` only when a version or adapter has changed.

## Required Profile Assets

These are required because they reproduce a saved Design Profile:

- `design-profiles/profile-index.json`
- `design-profiles/<profile-id>/profile.json`
- `design-profiles/<profile-id>/versions/<version-id>.json`
- `design-profiles/<profile-id>/diffs/<from>-to-<to>.json` when a new version is created
- `design-profiles/<profile-id>/adapters/<adapter-id>/adapter.json` when an adapter exists
- `design-profiles/<profile-id>/adapters/<adapter-id>/versions/<adapter-version-id>.json` when an adapter exists
- `design-profiles/<profile-id>/adapters/<adapter-id>/diffs/<from>-to-<to>.json` when an adapter version is created

`profile.json` should be a small pointer and summary file. The full reproducible DNA lives in `versions/*.json`.

## Optional Profile Assets

Do not create these by default:

- copied source/reference images
- thumbnail galleries
- long profile reports
- `usage-log.json`
- `exports/design-prompt.md`
- `exports/design-tokens.json`
- human-readable `*.md` diffs

Create optional assets only when the user asks for them or when they are necessary for a specific workflow.

Usage history is not required to reproduce a style. By default, update only compact fields such as `last_used_at` and `last_output_path` in `profile-index.json` or `profile.json`.

## Required Deck Assets

For every generated deck, save:

- `outputs/<deck-slug>/index.html`
- `outputs/<deck-slug>/deck-manifest.json`

`deck-manifest.json` is intentionally compact. It records:

- deck title
- created time
- profile id and version
- adapter id and version, if used
- output files
- approved content image ids and paths, if any
- export paths, if any
- known limitations, if any

Do not persist `design-contract.json`, `ppt-blueprint.json`, or `page-specs.json` by default. They are required planning steps, not required retained assets.

## Internal Specs

Always create the Design Contract, PPT Blueprint, and Page Specs during reasoning before rendering.

Persist them only when:

- the user asks to inspect the plan/specs
- the user wants editable specs
- the user asks for an audit trail
- the user wants future regeneration from specs
- generation is complex enough that losing specs would make revision unreliable

When persisted, place them under:

```text
outputs/<deck-slug>/specs/
```

## Source Images

Reference images used for style extraction are evidence, not deck assets.

By default, store only source metadata in the profile version snapshot:

- source id
- description
- role: `style_reference` or `content_asset`
- original path or user-provided label when available
- extraction weight

Do not copy reference images into the profile library unless the user explicitly asks to preserve them.

Content images approved for slides belong under:

```text
outputs/<deck-slug>/assets/images/
```

Use stable names:

```text
assets/images/01-cover-visual.jpg
assets/images/03-dashboard.png
assets/images/07-proof-chart.png
```

## Final Handoff

Mention only:

- final HTML path
- profile id/version
- adapter id/version and strategy, if used
- optional PDF/PPTX paths
- known limitations

Do not list internal specs or optional profile files unless the user asks.
