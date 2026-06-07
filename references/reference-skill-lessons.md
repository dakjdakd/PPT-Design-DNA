# Reference Skill Lessons

These lessons come from studying strong PPT skills such as Guizang PPT Skill and Frontend Slides. Use the ideas, not their template-first product model.

## Guizang-Style Lessons

Useful mechanisms:

- HTML deck as the main presentation surface
- strong visual systems
- strict style boundaries
- predefined color discipline
- layout constraints
- image slot discipline
- navigation safe areas
- explicit negative checks for ugly slide failures
- deck rhythm planning
- negative rules
- validation scripts/checks
- purposeful page-level motion recipes

What to borrow:

- Prefer HTML when visual fidelity, interaction, and inspection matter.
- Do not let each slide invent its own style.
- Constrain theme colors and typography.
- Require layout intent before rendering.
- Enforce readable image/text zones.
- Treat image placement as a designed role, not a default side placeholder.
- Reserve safe zones so controls, captions, and page chrome do not cover content.
- Use source-level checks instead of trusting a loose prompt.
- Use strict "do not" rules to protect a style from aesthetic drift.
- Use hard negative rules as blocking constraints, especially for reference-subject redraws and ugly placeholders.
- Require layout preflight before authoring content-heavy or multi-zone slides.
- Do not let visual richness become arbitrary decorative drawing.

What not to copy:

- Do not limit the product to two fixed styles.
- Do not make the core workflow "choose template, fill content".
- Do not prevent users from creating new styles from arbitrary images or discovery.

## Frontend-Slides-Style Lessons

Useful mechanisms:

- single HTML presentation output
- fixed 16:9 stage
- show-don't-tell visual direction
- density modes
- design recipes
- overlap/overflow constraints
- anti-generic-design rules
- animation-rich single-file decks

What to borrow:

- Use a fixed 1920x1080 HTML canvas as the primary design surface.
- Separate speaker-led decks from reading-first decks.
- Use density choice to control word count, page count, and font scale.
- Prefer visual preview/summary before final deck generation.
- Use strict Page Specs because loose prompts miss visual covering, low contrast, and ugly composition.
- Generate visual directions when users do not have reference images.
- Keep slide content on a fixed stage and scale the stage as a whole.
- Re-budget zones before adding content to an already dense slide.
- Treat overlap, overflow, clipped text, and nav/content collisions as source-level failures that require recomposition or slide splitting.

What not to copy:

- Do not make preset visual recipes the core.
- Do not ignore export needs if the user needs PPTX.
- Do not let bold visual templates override user-uploaded Design DNA.
- Do not copy default Playwright/browser screenshot QA into PPT-Design-DNA. Browser QA is optional only when explicitly requested and already available; source-level mechanical preflight is the default.

## PPT-Design-DNA Adaptation

The correct adaptation is:

```text
Strong constraints without fixed templates.
```

Use:

- Design DNA instead of fixed style presets
- layout archetypes instead of rigid templates
- design tokens instead of free color picking
- Page Specs instead of loose prompts
- Quality Rubric instead of trusting first output
- Design Contract instead of blindly applying a style to every scenario
- HTML-first generation instead of direct PPTX-first generation
- Design Adapter instead of blindly forcing one style into every scenario
- Visual safety constraints instead of one-shot prompt-only generation
- Design Discovery instead of requiring every user to upload images
- Visual Safety Rules instead of trusting the generator to avoid placeholders, bad contrast, and layer collisions

## Reference Image Rule

PPT-Design-DNA has a stricter rule than ordinary HTML slide skills:

```text
User reference images are design evidence, not slide assets.
```

This is the Reference Subject Firewall: reference-image style can be reused, but reference-image subjects cannot be redrawn.

They may influence:

- mood
- palette
- typography direction
- material language
- composition
- density
- motion
- image treatment rules

They must not be inserted into the deck unless the user explicitly marks them as content images.

They also must not be redrawn. Identifiable subjects from reference images cannot become CSS/SVG/HTML drawings, icons, mascots, generated-image prompts, diagrams, or decorative motifs. This includes people, animals, characters, mascots, products, buildings, vehicles, toys, recognizable objects, and subject parts such as eyes, ears, tails, paws, fins, horns, wings, posture, clothing, fur, scales, and silhouettes.

Use this decision rule:

```text
Does the visual come from the reference image's style?
-> yes: keep palette, texture, line quality, typography, layout rhythm, material, and motion.
Does it recreate the reference image's subject?
-> yes: remove it and use typography, diagram, abstract material shape, texture, pattern, or whitespace.
```

## Image Slot Lesson

Strong HTML slide skills often have image layouts, but PPT-Design-DNA must not default to "right side image area" when no real content image exists.

Use this decision rule:

```text
Does the slide have an approved content image?
-> yes: use a real image display mode with safe crop and contrast.
-> no: use typography, diagram, CSS/SVG visual, material object, or intentional whitespace.
-> never: blank image placeholder, plus-sign box, generic side rectangle.
```

The visual zone must serve the page message. If it only exists to balance the layout, remove it or turn it into a meaningful diagram/typographic device.

When the active profile came from identifiable reference subjects, the fallback visual must be non-representational by default. Abstract material objects may include paper strips, tape, labels, slices, grid blocks, hand-drawn lines, halftone fields, crop marks, and geometric modules. They must not include reference-subject silhouettes or parts.

## Contrast And Layer Lesson

HTML freedom makes it easy to create beautiful but unreadable slides. Protect the deck with:

- explicit surface/text pairs
- contrast targets
- z-index ladder
- no-text exclusion zones
- nav safe zone

White text on pale cards, background objects covering text, and large decorative type intersecting foreground text are blocking failures.

## Mechanical Layout Lesson

Strong slide skills do not trust visual placement by intuition alone. PPT-Design-DNA should keep free compositions, but each composition must prove it fits before HTML is written.

Use this source-level gate:

```text
Before HTML:
-> estimate title/body/card text height
-> calculate layout_box_budget required heights
-> chain body/card/footer positions from prior readable zone bottoms
-> reserve stroke/shadow/offset padding
-> reserve English descender padding for large serif headings
-> reserve navigation safe zone
-> check title/card/body/visual/footer/nav collision pairs
-> if any fail: recompose, reduce copy, reduce title size slightly, change archetype, or split slide
```

Do not use `overflow: hidden` on text containers as a fix. It hides the failure instead of solving it.

Borrow from Frontend Slides: fixed 1920x1080 stage, density-based splitting, and the lesson that simple existence checks are not enough; panels can visually cover text even when classes, pages, and manifests look valid. Borrow from Guizang: preflight the chosen layout before writing content. Do not copy either skill's template-first model.

## Quality Principle

Good decks come from three forms of control:

1. **Before generation**: Design DNA, tokens, density gates, adapters, negative constraints.
2. **During generation**: Blueprint, Page Specs, fixed-stage HTML rules.
3. **At handoff**: concise artifact delivery, optional export, and known limitations.

Prompt quality matters, but it should not be the only control layer.

## HTML Quality Lessons

Use HTML for the primary deck because it gives:

- reliable 16:9 stage control
- stronger typography and motion
- CSS tokenization for Design DNA
- easier iteration
- optional PDF/PPTX export when requested

HTML does not remove the need for constraints. It only gives a better execution surface.
