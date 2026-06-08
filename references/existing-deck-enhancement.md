# Existing Deck Enhancement

Use this reference when the user provides or references an existing `.ppt`, `.pptx`, HTML deck, slide screenshots, or deck folder and asks to beautify, redesign, convert, preserve content, or polish selected slides.

## Intake

Inspect the current deck source before choosing a design direction.

Capture:

- source type: PPT/PPTX, HTML, screenshots, folder, pasted outline, or mixed
- slide count and section structure
- available text, images, charts, speaker notes, and media
- current visual system, if any
- must-preserve content, brand, data, image, and order constraints
- requested change scope: full redesign, HTML conversion, partial polish, content rewrite, or visual-system migration

Do not overwrite or mutate the original deck source. Generate new outputs under the normal output contract.

## Classification

Classify the task before generation:

```text
preserve_content_redesign: keep text/facts/order, rebuild visual system
html_conversion: convert PPT/PPTX or screenshots into fixed-stage HTML
partial_polish: improve selected pages, cover, section dividers, or obvious weak layouts
content_rewrite: rewrite copy and structure before visual generation
style_migration: preserve content, replace style with a reference/profile/discovery DNA
```

If the user gives no preference, default to `preserve_content_redesign` for "美化/改PPT" and `html_conversion` for "转网页PPT/HTML PPT".

## Design Source

Choose the design source after inspection:

- **Existing deck style**: use when the deck already has a coherent direction and the user asks for polish.
- **Reference images**: use when the user supplies screenshots, posters, UI, brand pages, or visual references as style evidence.
- **Saved profile/adapter**: use when the user names a reusable Design Profile or asks to reuse a saved style.
- **No-image Design Discovery**: use when the user only describes a desired vibe or asks for a fresh redesign.

Reference images remain style evidence only. Existing deck images are content images only when they are part of the original deck and the user wants them preserved.

## Renovation Contract

Before rendering, create a renovation Design Contract:

- preserve: content, order, data, brand, charts, images, page count, or required sections
- adapt: typography, color, spacing, hierarchy, layout rhythm, motion, chart treatment
- split/merge policy: when to split dense pages or merge thin pages
- image policy: preserve, replace, crop, reframe, or generate alternatives
- export policy: HTML first; PDF/PPTX only if requested
- failure policy: keep source untouched and fall back to HTML if export fails

## Generation Rules

- Rebuild from Page Specs instead of patching old layout mistakes when the user asks for redesign.
- For partial polish, touch only the requested pages and preserve the rest unless obvious layout breakage would make the result incoherent.
- For HTML conversion, use the fixed 1920x1080 stage and normal visual safety rules.
- Preserve factual content and required data; rewrite copy only when the user allows it.
- Run `scripts/ppt-layout-guard.js` for generated HTML when Node is available.

## Handoff

Report:

- generated HTML path
- what was preserved from the old deck
- what was redesigned or converted
- export paths only if requested
- any source elements that could not be extracted or preserved
