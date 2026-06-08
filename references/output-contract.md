# Output Contract

Use this contract whenever creating decks, optionally saving reusable Design Profiles, or generating from saved Design Profiles.

The goal is **minimal reproducible assets**, not a bulky management archive. A normal one-off deck must not create or mutate `design-profiles/` unless the user explicitly approves saving a reusable profile.

## Artifact Root

Use the current user project root as the artifact root.

Never save user-generated profiles, decks, media, or exports into the skill source or skill installation directory. A skill directory contains instructions only.

## Hard Directory Layout

For a normal deck generation, create only the `outputs/<deck-slug>/` branch that is needed for the requested artifact. Create the `design-profiles/` branch only when the user explicitly saves or manages reusable profiles.

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
      layout-guard-report.json
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

- Create `design-profiles/` only when the user explicitly saves or manages a reusable profile.
- Create `assets/` only when user-approved content images, generated images, fonts, or media are used.
- Create `exports/` only when PDF/PPTX is requested.
- Create `specs/` only when the user asks to inspect, edit, audit, or regenerate from internal specs.
- Create `layout-guard-report.json` when the static HTML layout guard is run; it is a compact QA artifact for the generated deck, not a reusable Design Profile.
- Create `adapters/` only when an adapter exists.
- Create `diffs/` only when a version or adapter has changed.

## Required Profile Assets

These are required only after the user explicitly saves a reusable Design Profile:

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
- profile preview cards or preview thumbnails
- long profile reports
- `usage-log.json`
- `exports/design-prompt.md`
- `exports/design-tokens.json`
- human-readable `*.md` diffs

Create optional assets only when the user asks for them or when they are necessary for a specific workflow.

If a profile preview is requested, keep it lightweight:

```text
design-profiles/<profile-id>/preview.html
design-profiles/<profile-id>/preview.svg
```

The preview should show palette, typography mood, composition rhythm, suitable scenarios, risky scenarios, and one compact cover-like visual sample. It must not copy reference-image subjects, store reference images, or create a thumbnail gallery by default.

Usage history is not required to reproduce a style. Do not update `last_used_at`, `last_output_path`, or any other `design-profiles/` file during normal deck generation unless the user explicitly wants profile tracking or has asked to save/manage the profile.

## Required Deck Assets

For every generated deck, save:

- `outputs/<deck-slug>/index.html`
- `outputs/<deck-slug>/deck-manifest.json`

`deck-manifest.json` is intentionally compact. It records:

- deck title
- created time
- active Design DNA summary
- profile id and version only if a saved profile/adapter was selected or explicitly saved
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

If the user has not saved a reusable profile, do not create a profile version snapshot. Store only compact source/style metadata in `deck-manifest.json` when useful for deck traceability:

- source id
- description
- role: `style_reference` or `content_asset`
- original path or user-provided label when available
- extraction weight
- allowed style traits
- forbidden subject matter

When a reusable profile is explicitly saved, store only source metadata in the profile version snapshot:

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
- active Design DNA summary
- profile id/version only if saved or selected
- adapter id/version and strategy, if used
- optional PDF/PPTX paths
- known limitations
- mandatory save decision prompt when the active Design DNA is unsaved

After the user has reviewed the deck, ask in the user's language whether they want to save the current active Design DNA as a reusable profile when it is still unsaved. Do not save it preemptively.

Recommended prompt:

```text
If this deck feels right, do you want to save this Design DNA for reuse?
A. Save as a reusable Design Profile
B. Do not save yet
C. Tune first, then save
```

Do not list internal specs or optional profile files unless the user asks.
