---
name: PPT-Design-DNA
description: "Use when creating, improving, converting, or redesigning design-system-driven PPT, PowerPoint, PPTX, slides, decks, webpage PPT, HTML-first presentations, pitch decks, reports, defense decks, course/training decks, talks, keynotes, or presentations through Design DNA. Especially useful for distinctive visual style, style transfer from reference images/screenshots, reusable Design DNA/Profile assets, no-image Design Discovery, scenario adaptation, animated fixed-stage HTML slides, existing deck renovation, or optional PDF/PPTX export. This is for DIY design-system-driven PPT creation, not template filling."
when_to_use: "Use by default for generic PPT/slides/presentation requests such as 做PPT, 生成PPT, 美化PPT, 帮我做个汇报, HTML PPT, PowerPoint, PPTX, pitch deck, defense deck, course deck, create slides, build a presentation, or redesign slides, unless the user explicitly asks for another slide skill."
---

# PPT-Design-DNA

Build presentation decks by creating or reusing reusable Design DNA, managing it as a versioned design asset, adapting it to the user's presentation scenario, planning a deck blueprint, generating detailed page specs, and producing a fixed-stage animated HTML deck or optional PPTX.

This skill is **not** a template-filling PPT generator. It should behave like an AI design architect: infer or discover a visual system, expose controllable parameters, warn about design/content conflicts, adapt the system when needed, then generate slides through structured constraints.

Current version: **V3.1 - Trigger, Renovation, and Preview UX**.

V3.1 includes:

- V1: image-to-Design-DNA, parameter panel, HTML-first deck generation
- V2: reusable profile library, profile details, version history, Design Diff, optional Design Prompt export, and compact usage pointers
- V3: Design Adapter scenario variants, stronger conflict detection, visual-director advice, no-image Design Discovery, Image Asset Strategy, and stronger pre-generation visual safety constraints
- V3.1: stronger trigger metadata, existing deck enhancement/conversion mode, Design DNA visual previews, requirement panel extraction, and failure recovery rules

## Core Chain

Use this strict chain:

```text
Mode routing: new deck, existing deck renovation/conversion, profile management, or skill-design discussion
-> Profile library check: targeted read of canonical Design Profile index when relevant
-> Existing deck intake when the user provides or references a PPT/PPTX/HTML deck
-> Design source: saved profile/adapter, reference images, or no-image Design Discovery
-> Design DNA
-> Design DNA visual preview when discovery/extraction needs visual confirmation
-> mandatory Design DNA parameter panel
-> user tuning
-> active Design DNA candidate, with optional user-approved save as a versioned Design Profile
-> PPT requirement discovery
-> content image intent and asset strategy
-> design-scenario fit check
-> optional Design Adapter
-> Design Contract
-> PPT Blueprint
-> Page Specs
-> fixed-stage animated HTML deck
-> optional PDF/PPTX export if requested
-> final handoff
```

The main reusable asset is the **Design DNA Profile**. Scenario-specific adapters are derived profile variants. The primary deck output is HTML. PDF/PPTX is an optional export path only when requested.

## When To Use / Trigger Scope

Use this skill by default when the user asks for PPT or presentation work and does not explicitly request another slide skill.

Common trigger phrases include:

- 中文：做 PPT、生成 PPT、帮我做个汇报、做演示文稿、做幻灯片、网页 PPT、HTML PPT、美化 PPT、改 PPT、PPT 风格迁移、参考图做 PPT、根据截图做风格、答辩 PPT、路演 PPT、课程/培训课件、发布会 PPT、保存/复用这个 PPT 风格。
- English: make a PPT, create slides, build a presentation, design a deck, HTML presentation, webpage slides, pitch deck, report deck, keynote, talk slides, PowerPoint, PPTX, beautify slides, redesign slides, use this screenshot/reference as style.

If the request is generic PPT creation, prefer this skill when the user seems to want a distinctive, reusable, or design-system-driven result. If the user asks for a fixed template style such as magazine PPT or Swiss-style horizontal web deck, consider `guizang-ppt-skill`; if the user asks for a simpler zero-dependency HTML slide deck or PPTX conversion workflow, consider `frontend-slides`.

## First Response Behavior

When the user wants to create, improve, style, convert, or discuss a PPT / PowerPoint / PPTX / slides / deck / presentation, including generic requests such as "做PPT", "生成PPT", "帮我做个汇报", "美化PPT", "网页PPT", or "create slides", first identify the current mode:

- **Reuse saved design**: user mentions saved designs, previous Design DNA, a profile name, "my designs", "use that style", or the workspace contains the canonical `design-profiles/profile-index.json`.
- **Create from images**: user explicitly uploaded or pointed to reference images/screenshots.
- **Reuse profile**: user selected a saved Design Profile or adapter.
- **Manage profiles**: user wants to list, inspect, compare, export, or reuse profiles.
- **No-image discovery**: user has no images and describes a target style, vibe, or named style.
- **Enhance or convert existing deck**: user provides or references an existing PPT/PPTX/HTML deck and asks to beautify, redesign, preserve content, convert to HTML, or polish part of the deck.
- **Modify deck/profile**: user wants to tune an existing style or deck.
- **Spec/design discussion**: user is designing the skill itself; discuss schema/process without generating a deck.

V3 can create Design DNA in three ways only:

1. extract from explicit user-provided reference images
2. reuse an explicit saved Design Profile or adapter
3. run no-image Design Discovery and show candidate DNA directions

Before asking for images, perform a **targeted profile-library check** when reuse is plausible:

- If `design-profiles/profile-index.json` exists in the current project root, read only that index and offer the matching saved profiles/adapters as a design source.
- If the user names a profile, read its `profile.json` and current version snapshot.
- Do not recursively browse for profiles, images, decks, or random JSON files.
- Do not treat old conversation images as reusable design sources unless the user explicitly names them.

Do not create a deck directly from vague text. If the user has no reference images and no saved profile, enter Design Discovery first. Do not browse the workspace for images, infer images from the current directory, or reuse previous-turn images unless the user explicitly names them for this deck.

Make the reference-image contract explicit:

- Reference images are for **style extraction only**.
- Do not place reference images into the generated deck.
- Do not redraw, trace, stylize, or approximate identifiable subjects from reference images as CSS, SVG, HTML, AI-generated images, icons, mascots, or decorative objects.
- Extract visual language only: palette, typography mood, composition rhythm, borders, shadows, texture, grain, line quality, density, motion direction, crop treatment, and contrast behavior.
- Never extract reference-image subject matter as reusable visual content. Forbidden subject matter includes people, animals, characters, mascots, specific products, buildings, vehicles, toys, recognizable objects, and subject parts such as faces, eyes, ears, tails, fins, horns, wings, paws, clothing, posture, expressions, fur, scales, or silhouettes.
- If a user uploads a cat, fish, dinosaur, person, product, or mascot as a style reference, the deck may learn its color, line, texture, composition, and mood, but must not generate that subject, its outline, or its parts.
- Only embed a user image if the user separately says it is content material for a slide.
- If the user wants slide images later, handle them through Image Asset Strategy rather than generic placeholders.

For deck creation, ask only the missing high-leverage choices. Avoid long generic questionnaires.

For existing deck enhancement or conversion, inspect the current deck/content source first, classify the task, then choose or create a Design DNA source. Use [Existing Deck Enhancement](references/existing-deck-enhancement.md). Do not discard the user's existing content unless they explicitly ask for a rewrite.

## Interaction Gates

V3 has strict gates:

Gate progression is user-turn based. A single assistant response must not cross from Design DNA extraction into PPT requirements, or from PPT requirements into deck generation, unless the user has already confirmed the previous gate in an earlier message. Internal assumptions, "default" handling, old memory, or being "in a hurry" do not count as gate confirmation before the gate is shown.

1. **Design Source Gate**: ensure explicit reference images, a saved profile/adapter, or no-image Design Discovery choices exist.
   - Apply the Reference Subject Firewall at this gate. Record allowed style traits separately from forbidden subject matter before extracting Design DNA.
2. **Design Preview Gate**: when the design source is no-image discovery, show three Design DNA preview cards or single-slide title previews before the parameter panel. When the source is reference imagery, show one style-transfer preview slide when feasible. Optional profile preview thumbnails are created only when the user asks or explicitly saves a reusable profile.
3. **Design DNA Panel Gate**: after extraction/discovery and any needed visual preview, show the parameter panel and stop for user confirmation/tuning. Do not ask page count, audience, purpose, content source, or export before this gate.
   - For reference-image extraction, the first substantive response must include the detailed image analysis, the Reference Subject Firewall split, a synthesized Design DNA candidate, and the detailed parameter panel. It must then stop.
   - Do not generate a deck, create output folders, write HTML, write manifests, choose a default theme, choose page count, or infer audience before the user accepts or tunes this panel.
4. **Active DNA Gate**: after confirmation/tuning in a later user message, use the result as an active Design DNA candidate for this deck. Do not save or update `design-profiles/` by default.
5. **PPT Requirement Gate**: only after the user accepts/tunes the active Design DNA or selects a saved profile/adapter, ask topic, audience, page count, content source, purpose, density, narrative style, and output needs. Show the numbered option-first panel and stop again for the user's choices.
6. **Image Asset Gate**: after PPT requirements are answered, ask or confirm whether the deck needs content images, AI-generated images, replaceable image slots, no images, or mixed handling. Do not treat earlier reference images as content images.
7. **Adapter Gate**: after requirements are known, detect scenario conflicts and offer visual-first, dynamic-downgrade, or cell-division handling when needed.
8. **Generation Handoff Gate**: after HTML/PPTX generation, deliver the requested artifact and report only concise paths, active Design DNA summary, saved profile/version only if applicable, and any known limitations.
   - If the active Design DNA is an unsaved candidate, the handoff must also ask whether the user wants to save it as a reusable Design Profile after reviewing the deck. Do not create `design-profiles/` until the user explicitly chooses to save.

If the user replies "default" at the Design DNA Panel Gate, treat it as accepting the extracted/discovered DNA for this deck, then proceed to PPT Requirement Discovery in the next assistant response. Do not also generate the deck in that same response. Do not save a new Design Profile unless the user explicitly chooses a save option.

If the user replies "default" at the PPT Requirement Gate, choose the recommended/default requirement options, confirm the choices briefly, then proceed through Image Asset Strategy, fit check, Design Contract, Blueprint, Page Specs, and generation. This is the earliest point where a default path may generate a deck.

For profile-management requests, do not ask for reference images, deck topic, audience, or page count. Use [Profile Management](references/profile-management.md).

## Core Workflow

1. **Design Intake**
   - Accept arbitrary images: website screenshots, PPT screenshots, game screenshots, posters, magazine pages, landscapes, portraits, product pages, UI screenshots.
   - Accept saved profiles/adapters.
   - If no images/profile exist, run no-image Design Discovery before asking deck questions.
   - If multiple images are provided, default to a blended style unless the user asks for weighted or separate profiles.
   - Summarize what each image contributes.
   - Treat reference images as style evidence only; never embed them by default.
   - For each reference image, summarize allowed style traits separately from forbidden subject matter. The forbidden subject matter cannot become CSS/SVG/HTML illustrations, AI-generated visuals, icons, mascots, or decorative motifs later.
   - See [Core Workflow](references/workflow.md) and [Design Discovery](references/design-discovery.md).

1B. **Existing Deck Enhancement Or Conversion**
   - Use when the user provides or references an existing `.ppt`, `.pptx`, HTML deck, screenshots of slides, or a current deck folder and asks to beautify, redesign, convert, polish, preserve content, or update only selected slides.
   - First extract or inspect current content, assets, slide count, visual style, and constraints; then classify the task as preserve-content redesign, HTML conversion, partial polish, content rewrite, or visual-system migration.
   - Choose the design source after inspection: existing deck style, user reference images, saved profile/adapter, or no-image Design Discovery.
   - Create a renovation Design Contract before editing or regenerating slides.
   - See [Existing Deck Enhancement](references/existing-deck-enhancement.md).

2. **Style Extraction Or Discovery**
   - Extract or create Design DNA across five required layers: Mood, Composition, Visual, Content Strategy, Presentation.
   - Do not reduce style to colors, fonts, and layout only.
   - For no-image discovery, generate three visual Design DNA previews or three single-slide title previews before final DNA selection.
   - For reference-image extraction, create one style-transfer preview slide when feasible to confirm visual interpretation before full deck planning.
   - For reusable profiles, create profile preview thumbnails only when explicitly requested or when saving a profile.
   - See [Design DNA Schema](references/design-dna-schema.md).

3. **Design DNA Panel**
   - Show the detailed Design DNA panel, not a short style summary.
   - The minimum visible panel must include:
     - source/extraction summary with allowed style traits and forbidden subject matter for each reference image
     - fused direction name and one-line design thesis
     - all fixed hard parameters: whitespace, information_density, image_weight, title_weight, chart_weight, text_density, formula_friendliness, grid_strictness, hierarchy_strength, motion_intensity
     - 10 or more dynamic semantic tags scored 0-100
     - the five required DNA layers: Mood, Composition, Visual, Content Strategy, Presentation
     - execution constraints: canvas, safe margins, density gates, typography minimums, reference subject firewall, mechanical layout preflight, layout_box_budget, motion rules
     - design tokens summary: background, text, accents, surface, border/shadow, material/texture, type direction
     - negative constraints and P0 failure risks
     - visual consequences, best-fit scenarios, risky scenarios, and confirmation choices
   - Explain major visual consequences.
   - Include best-fit and risky scenarios.
   - Stop for user confirmation/tuning.
   - See panel examples in [Core Workflow](references/workflow.md).

4. **User Tuning And Design Diff**
   - Let the user adjust sliders or choices.
   - Explain Design Diff as visual consequences, not only number changes.
   - If tuning creates contradiction, warn and offer choices.
   - Tuning a saved profile creates a new immutable version.

5. **Active Design DNA Candidate And Optional Profile Save**
   - Keep the confirmed/tuned Design DNA as the active candidate for the current deck.
   - Do not create `design-profiles/`, `profile.json`, version snapshots, diffs, or usage records by default.
   - Save a reusable Design Profile only when the user explicitly asks before generation or after reviewing the generated deck.
   - When saving is requested, save the minimal reproducible Design Profile: profile identity, source/discovery summary, current version pointer, Design DNA snapshot, design tokens, reference-subject firewall policy, negative constraints, and derived prompt.
   - Design Prompt is a derived export, not the source of truth.
   - See [Profile Management](references/profile-management.md).

6. **PPT Requirement Discovery**
   - Ask topic, goal, audience, content source, page count, density, narrative style, image intent, and output/export needs as option-first choices.
   - Ask only after the active Design DNA is accepted/tuned, or after a saved profile/adapter is selected.
   - Adapt questions to the Design DNA and scenario.
   - Do not present blank fill-in fields such as `topic: ____`; provide A/B/C/D options plus an "Other/custom" escape hatch.
   - After the active Design DNA is accepted, the next assistant response must be a guided choice panel, not a free-form intake form.
   - Never say "直接回复一行：主题..., 6页..., 给谁看..." as the primary requirement collection method. Compact answers such as `1A 2C 3B` are allowed only after showing options.
   - Stop after showing the requirement panel unless the user has already answered it in the current or previous message.

7. **Image Asset Strategy**
   - Ask how the deck should use content images only after Design DNA is accepted and PPT requirements are known.
   - Options: no content images, user-provided real images, replaceable slots for later, AI-generated images, or mixed.
   - If images exist, evaluate them as content assets and let them influence the blueprint from the start.
   - If the user wants later replacement, create designed image slots or hidden manifest slots with CSS fallback; never render ugly empty boxes by default.
   - See [Image Asset Strategy](references/image-asset-strategy.md).

8. **Design-Scenario Fit Check And Adapter**
   - Detect conflicts between the active profile and the deck scenario.
   - Warn without blocking.
   - Offer:
     - A. Visual first: preserve the style, compress content.
     - B. Dynamic downgrade: allow less beauty, increase density/readability.
     - C. Cell division: keep beauty, split dense content across more pages.
   - If the user accepts adaptation, create a named adapter such as `Apple Academic` or `Cyber Minimal Consulting`.
   - See [Design Adapter](references/design-adapter.md).

9. **Design Contract**
   - Convert the active profile/adapter into scenario-specific rules.
   - Specify what to preserve, what to adapt, density strategy, chart/formula strategy, slide splitting strategy, and forbidden mistakes.
   - Include image asset rules: approved content images, generated image briefs, replaceable slots, fallback visuals, reference-subject firewall rules, and forbidden placeholder behavior.
   - See [Page Spec Contract](references/page-spec-contract.md).

10. **PPT Blueprint**
   - Generate the deck narrative before generating slides.
   - Include sections, page titles, page purpose, content role, density, and visual strategy.
   - If content images are approved, co-design the outline around those images instead of inserting them after the fact.
   - Allow approval/editing when the user is in planning mode; continue when the user asked to generate directly.

11. **Page Specs**
   - Generate a structured spec for every slide before rendering.
   - Include purpose, core message, layout archetype, zones, word limits, visual constraints, required elements, forbidden elements, and quality targets.
   - Include image strategy fields for each slide when relevant: asset role, slot type, ratio, fit, safe area, caption, and fallback.
   - Include `visual_subject_policy`, `mechanical_layout_preflight`, and `layout_box_budget` for every slide with reference-derived visuals or more than one major element.
   - Do not generate slides from one loose prompt.

12. **HTML Deck Generation**
    - Generate a single-file or folder-based HTML deck as the primary artifact.
    - Save deck artifacts using the hard output contract in [Output Contract](references/output-contract.md).
    - Use a fixed 1920x1080 internal stage scaled uniformly to the viewport.
    - Enforce design tokens, density gates, layout archetypes, safe margins, and minimum font sizes.
    - Enforce visual safety: no generic empty image slots, no unreadable text/surface pairs, no decorative layers covering content, and no unreserved navigation overlap.
    - Enforce the Reference Subject Firewall: CSS/SVG/HTML visuals can express style, but cannot depict subjects or subject parts from style reference images.
    - Enforce Mechanical Layout Preflight and `layout_box_budget` before writing HTML for each slide: estimate text fit, reserve visual-effect/descender padding, reserve navigation safe zones, and check zone collisions. If either gate fails, recompose, reduce copy, reduce title size slightly, move the next zone, change layout, or split the slide before generating.
    - After writing HTML, run the source-level layout guard when Node is available: `node scripts/ppt-layout-guard.js <output-html> --report <output-dir>/layout-guard-report.json`. This is not browser QA and does not use Playwright. A P0 result blocks handoff; revise the HTML/Page Specs and rerun until the guard returns PASS.
    - Do not replace the guard command with page-count checks, manifest checks, server startup, browser preview, screenshots, or "file exists" checks. Those may be extra checks only after the guard has run.
    - Use purposeful motion derived from Design DNA; avoid one generic animation recipe for every slide.
    - Do not use reference images as slide assets unless explicitly approved as content.
    - See [HTML Generation Rules](references/html-generation-rules.md) and [Visual Safety Rules](references/visual-safety-rules.md).

13. **Final Handoff**
    - Deliver the requested HTML deck and optional PDF/PPTX export.
    - Hard delivery lock for HTML decks: before final response, there must be an actual command result from `node scripts/ppt-layout-guard.js <output-html> --report <output-dir>/layout-guard-report.json`, unless Node is genuinely unavailable. Do not say "I will run it" and then hand off; run it first.
    - Keep final output concise: artifact path, layout guard status and report path, active Design DNA summary, saved Design Profile/version only if one was selected or explicitly saved, adapter strategy if used, and known limitations.
    - If the active Design DNA is unsaved, end the handoff with an explicit save decision prompt in the user's language: `If this deck feels right, do you want to save this Design DNA for reuse? A. Save as Design Profile B. Do not save yet C. Tune first, then save`. This is mandatory because users may want to reuse the style later.
    - The save prompt is not permission to save automatically. Create or update `design-profiles/` only after the user answers with an explicit save choice.
    - Do not claim layout safety from page-count, manifest, class-name checks, browser preview, local server response, or screenshot inspection. Final handoff requires the source-level layout guard to pass for HTML decks when Node is available; if Node is unavailable, perform the same checks manually from source and state that the script could not be run.
    - If the guard report is missing, failed, or was not generated in the output directory, the deck is not deliverable. Fix the HTML/Page Specs and rerun the guard before final handoff.
    - End at the generated artifact; this V3 flow does not include a post-generation browser QA stage.
    - Do not look for, install, import, or run Playwright/browser automation in the default flow. If browser QA is unavailable or unrequested, complete source-level checks only and do not mention dependency probing as a workflow step.
    - See [Quality Rubric](references/quality-rubric.md) for pre-generation and source-level quality constraints.

## Design Lessons To Reuse

Borrow useful constraints from strong HTML slide skills without becoming a template skill:

- Use a fixed 16:9 design stage.
- Treat style as a design system, not decoration.
- Constrain colors, fonts, spacing, density, motion, and layout behavior.
- Use layout archetypes, not rigid templates.
- Include negative constraints for every style.
- Use visual safety rules for image slots, contrast, layer order, and collision zones.
- Plan deck rhythm before slide rendering.
- Keep HTML as the source of truth for visual fidelity, motion, inspection, and export.
- Prefer lightweight artifact checks over screenshot-review loops.

See [Reference Skill Lessons](references/reference-skill-lessons.md).

## Visual Safety Requirements

Before generating HTML slides, apply [Visual Safety Rules](references/visual-safety-rules.md). These rules are mandatory because they prevent the most common ugly deck failures:

- reference-image subjects being redrawn as bad CSS/SVG/AI illustrations
- a repeated right-side "image area" that is actually an empty placeholder
- white or low-contrast text on pale cards/backgrounds
- large images, shapes, or background type covering readable content
- decorative objects crossing text zones
- navigation controls covering slide content
- cards whose background and text colors are not designed as a pair
- title, subtitle, divider, and body text squeezed together because line-height or vertical gaps are too tight
- surface/ink pairs that are inherited accidentally instead of declared for each readable region
- title, card, visual, decoration, footer, and navigation zones competing for the same space
- layout archetypes carrying more content than their capacity allows

If a slide needs a visual but has no user-approved content image, use typography, diagrams, CSS/SVG visuals, intentional whitespace, or ask for/generated images when appropriate. Do not create a fake image placeholder.

Reference Subject Firewall is a P0 safety category. A style reference can teach the deck how to look, but not what specific subject to draw. If the source image contains a cat, fish, dinosaur, person, mascot, product, vehicle, toy, or other recognizable subject, the generated deck must use abstract style surrogates instead of subject-derived illustrations. This blocks direct insertion, tracing, redraws, stylized approximations, subject silhouettes, and subject parts.

Typography spacing is a mandatory visual safety category. Large titles must reserve visual clearance for Chinese glyph height, English descenders, stroke, shadow, glow, and offset layers. Keep spacing compact but safe: do not solve squeezed text by making the whole deck loose; instead use safe line-height, small visual-effect padding, controlled gaps, title splitting, or a slight font-size reduction.

Chinese and mixed Chinese/Latin headline breaking is also a P0 visual safety category. A generated deck must not allow ugly browser auto-wrapping such as a single Chinese character or 1-2 character fragment on the last line (`要`, `的`, `计划`, etc.). Before authoring HTML, manually plan display-title line breaks by meaning and visual balance. If a title would orphan a character, reduce font size by 5-12%, widen the title zone, rewrite the title, split it across slides, or choose another composition. Do not use tight line-height, negative tracking, `text-wrap: balance` alone, or hidden overflow as the fix.

Readable text blocks need visible breathing room in every direction. Adjacent title/subtitle/body/card/footer text cannot merely avoid CSS box overlap; the glyphs must have visible air. At 1920x1080, keep at least 44-72px after a huge title before subtitle/body text, 34-56px after section titles before body/cards, 18-32px between eyebrow and title, 24px minimum between ordinary text blocks, and 28-44px around dividers. If text feels crowded, reduce copy, split the slide, or recompose; do not keep shrinking gaps until words visually touch.

Surface Pair, Zone Budget, and Layout Capacity are P0 mechanical constraints, not aesthetic suggestions. They protect freedom by preventing mechanical failures; they must not turn the deck into a fixed template system:

- Every readable region must declare a `surface_token` and `ink_token`. Cards, labels, badges, stat blocks, captions, chart labels, and formula labels cannot inherit text color from the slide.
- Pale or bright surfaces such as white, light gray, pale blue, pale pink, and bright yellow default to dark ink. Do not use white text on them.
- Zone Budget is a per-slide dynamic safety declaration, not a reusable template. Each slide may choose its own composition, but must declare the actual `title_zone`, `body_zone`, `visual_zone`, `card_zone`, `footer_zone`, `nav_safe_zone`, and `decoration_zone` when those roles exist.
- Zones use the fixed 1920x1080 stage coordinate system only for collision reasoning. They must come from the slide's unique composition and must not force repeated layouts.
- Main text zones cannot intersect visual, decoration, footer, navigation, or no-text zones. If there is no room, change layout, split the slide, reduce card count, compress copy, or lower decorative weight.
- Layout Capacity is a freedom-preserving capacity check, not a template rule. It says what a page type can safely carry; it does not dictate where everything must go.
- Mechanical Layout Preflight plus `layout_box_budget` is required before HTML authoring. Estimate text boxes, CJK line-height, English descenders, stroke/shadow/offset expansion, card padding, and nav safe-zone occupancy. A failed estimate must trigger recomposition or slide splitting, not hidden overflow.
- `layout_box_budget` must calculate each readable zone's required height before placing the next zone. Do not place body notes, cards, dividers, footers, or navigation with independent absolute `top` guesses that ignore title/body height.
- Every major readable element in the generated HTML must expose `data-zone` on the real slide element (`section`, `article`, or `div` with class `slide`) so the static guard can inspect it. A deck that omits zones or `layout_box_budget` is not considered checked.
- Large English serif display titles use `line-height >= 1.02`; if they wrap beyond one line, use `line-height >= 1.06` and reserve descender padding for `g/y/p/q/j`. `line-height < 0.95` is allowed only for a single-line decorative title with no content directly below.
- CJK or mixed CJK/Latin display titles use `line-height >= 1.02`, preferably `1.04-1.12`, `letter-spacing: 0`, and planned semantic line breaks. Any orphan short line or visibly cramped title stack is P0.
- DOM order is not a collision fix. Later cards, grids, panels, or frames must not paint over earlier title/body text, and `z-index` must not be used to hide a failed content layout.

## Option-First Requirement Collection

When entering PPT Requirement Discovery, always ask with numbered A/B/C/D choices. This is mandatory even when the user seems willing to describe the deck in prose.

Required behavior:

- Start with a short confirmation that the active Design DNA is accepted, or that a saved Design Profile/adapter is selected.
- Then show 6-9 numbered questions with choices.
- Include `Other / custom` where the answer space is naturally open.
- Tell the user they can reply compactly, for example `1A 2E 3C 4B 5A 6D`.
- If the user chooses `Other / custom`, ask for that custom detail afterward.
- If the user says `default`, choose the recommended/default options and continue.

Forbidden behavior:

- Do not ask the user to fill blank fields like `PPT 主题/标题：`, `页数：`, `受众：`.
- Do not present slash-separated field values as the main interaction, such as `老师/同学/客户/团队`.
- Do not ask the user to write one free-form sentence as the main path, such as `主题：AI 视觉趋势分享，6页，给同学看，HTML`.
- Do not merge the Design DNA confirmation step and PPT requirements into one questionnaire.

Use the standard panels in [Requirement Panels](references/requirement-panels.md). Read that file when entering PPT Requirement Discovery or when the user asks to see/edit the intake choices.

## Image Asset Strategy

Read [Image Asset Strategy](references/image-asset-strategy.md) whenever the user asks about adding images, provides slide-content images, wants later-replaceable image areas, asks for AI images, or when Page Specs include image/visual slots.

Core rules:

- Reference images are Design DNA evidence, not slide assets.
- Content images must be explicitly approved as slide material.
- Do not default to a repeated right-side image box.
- If the user has no content images, the deck must still look complete through CSS/SVG visuals, typography, diagrams, or intentional whitespace.
- If the user wants to add images later, prefer hidden `image-manifest` slots with CSS fallback; show designed placeholders only when the user asks to see editable slots.
- Image slots must have semantic roles, aspect ratios, fit behavior, safe zones, caption rules, and missing-image fallback.

## Output Rules

Use [Output Contract](references/output-contract.md) for hard directory rules and minimal-retention rules.

When producing a deck, provide:

- final HTML deck path
- concise Design DNA summary
- reusable Design Profile path only if saved or selected
- current profile or adapter version only if applicable
- adapter/fit strategy if used
- optional PDF/PPTX export path only if requested
- unresolved limitations or manual edits, if any

Do not clutter the final response with internal artifact lists. `design-contract`, `ppt-blueprint`, and `page-specs` are required planning steps, but they are transient by default. Persist them only when the user asks to inspect, edit, audit, or regenerate from specs.

When managing profiles, provide only the requested profile/library information: list, detail, diff, adapter, export path, or usage history. Do not generate a deck unless explicitly requested.

When only discussing the skill design, do not generate PPT files unless the user explicitly asks.

## Failure Recovery And Fallbacks

Use these defaults when generation or export hits a blocker:

- **Layout guard P0**: return to Page Specs and layout budget, repair composition, split slides, reduce copy, or adjust zones; do not patch around the failure with blind CSS tweaks.
- **Node unavailable**: perform the same source-level checks manually from HTML/CSS/Page Specs, state that the layout guard could not be run, and keep the deck in HTML.
- **PPTX export unavailable**: keep HTML as the source artifact, offer PDF export or manual PowerPoint recreation notes only if useful, and do not claim PPTX was produced.
- **Only a vague request such as "做PPT"**: enter Design Discovery or saved-profile selection first; do not start a long PPT questionnaire.
- **User says "default" or is in a hurry**: apply the default only to the current visible gate. At Design Discovery/Design DNA gates, this means selecting or accepting the design direction and then stopping at the next gate. At PPT Requirement Gate, this means choosing balanced density, HTML-only output, and no reusable profile save unless explicitly requested.
- **Existing deck extraction fails**: preserve the original file untouched, summarize what could not be read, and ask for a different source representation only if screenshots, pasted outline, or extracted text cannot be discovered locally.

## Non-Negotiables

- Do not reduce style extraction to color palette extraction.
- Do not skip the Design DNA layer.
- Do not skip the Design DNA parameter panel.
- Do not compress the Design DNA panel into a few sentences; it must expose detailed parameters, five-layer DNA, execution constraints, tokens, negative constraints, and P0 risks.
- Do not cross interaction gates in a single response; each gate that requires user confirmation must stop and wait.
- Do not treat "I will use defaults" as permission to invent topic, page count, audience, or output before the PPT Requirement Gate is shown and answered.
- Do not ask PPT task questions before the user accepts or tunes Design DNA.
- Do not overwrite a saved profile version; create a new version and Design Diff.
- Do not save new Design Profiles by default. Promote an active Design DNA candidate into `design-profiles/` only after explicit user approval.
- Do not save generated user decks, profiles, or outputs inside the skill source/installation directory. Use the current user project root and the hard output contract.
- Do not treat Design Prompt as source of truth; it is derived from Design DNA.
- Do not treat Design Adapter as source of truth; it is a derived scenario variant.
- Do not skip Page Specs for real deck generation.
- Do not rely on one giant prompt as the only quality control.
- Do not start a deck from vague text; run Design Discovery first when no images/profile exist.
- Do not treat reference images as slide content.
- Do not ask about content images before the Design DNA Panel Gate; image intent belongs after PPT Requirement Discovery.
- Do not silently force a style when it conflicts with the content scenario.
- Do not block the user from risky choices; warn and provide options.
- Do not use a fixed template library as the core product model.
- Do not generate unreadable slides to preserve visual style.
- Do not create generic empty image placeholders or repeated meaningless side blocks.
- Do not insert a content image after layout is complete; approved images must participate in Blueprint and Page Specs.
- Do not place text on a surface unless the text/surface pair passes contrast rules.
- Do not let decorative, media, background type, or motion layers cover content at rest.
- Do not add a post-generation browser QA stage to the default flow.
- Do not probe for Playwright, install Playwright, add Node module directories for Playwright, or run browser automation unless the user explicitly asks for browser QA.
- Do not allow title lines, subtitles, dividers, or body text to visually touch or squeeze each other. Tight editorial typography is allowed only when glyphs remain clearly separated and body text remains readable.
