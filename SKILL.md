---
name: PPT-Design-DNA
description: "Use when creating HTML-first presentation decks through Design DNA: extracting style from explicit visual reference images, reusing saved Design Profiles, or running no-image Design Discovery; tuning parameters; managing versioned profile assets; adapting profiles to presentation scenarios; planning blueprints and page specs; and generating fixed-stage animated HTML slides or optional PPTX. This is for DIY design-system-driven PPT creation, not template-filling."
---

# PPT-Design-DNA

Build presentation decks by creating or reusing reusable Design DNA, managing it as a versioned design asset, adapting it to the user's presentation scenario, planning a deck blueprint, generating detailed page specs, and producing a fixed-stage animated HTML deck or optional PPTX.

This skill is **not** a template-filling PPT generator. It should behave like an AI design architect: infer or discover a visual system, expose controllable parameters, warn about design/content conflicts, adapt the system when needed, then generate slides through structured constraints.

Current version: **V3 - Design Adapter and Discovery**.

V3 includes:

- V1: image-to-Design-DNA, parameter panel, HTML-first deck generation
- V2: reusable profile library, profile details, version history, Design Diff, optional Design Prompt export, and compact usage pointers
- V3: Design Adapter scenario variants, stronger conflict detection, visual-director advice, no-image Design Discovery, Image Asset Strategy, and stronger pre-generation visual safety constraints

## Core Chain

Use this strict chain:

```text
Profile library check: targeted read of canonical Design Profile index when relevant
-> Design source: saved profile/adapter, reference images, or no-image Design Discovery
-> Design DNA
-> mandatory Design DNA parameter panel
-> user tuning
-> saved/versioned Design Profile
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

## First Response Behavior

When the user wants to create or discuss a PPT-Design-DNA deck, first identify the current mode:

- **Reuse saved design**: user mentions saved designs, previous Design DNA, a profile name, "my designs", "use that style", or the workspace contains the canonical `design-profiles/profile-index.json`.
- **Create from images**: user explicitly uploaded or pointed to reference images/screenshots.
- **Reuse profile**: user selected a saved Design Profile or adapter.
- **Manage profiles**: user wants to list, inspect, compare, export, or reuse profiles.
- **No-image discovery**: user has no images and describes a target style, vibe, or named style.
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
- Only embed a user image if the user separately says it is content material for a slide.
- If the user wants slide images later, handle them through Image Asset Strategy rather than generic placeholders.

For deck creation, ask only the missing high-leverage choices. Avoid long generic questionnaires.

## Interaction Gates

V3 has strict gates:

1. **Design Source Gate**: ensure explicit reference images, a saved profile/adapter, or no-image Design Discovery choices exist.
2. **Design DNA Panel Gate**: after extraction/discovery, show the parameter panel and stop for user confirmation/tuning. Do not ask page count, audience, purpose, content source, or export before this gate.
3. **Profile Asset Gate**: after confirmation/tuning, save or update a Design Profile before generation. Tuning creates a new version; do not overwrite.
4. **PPT Requirement Gate**: only after the user accepts/saves/tunes the profile, ask topic, audience, page count, content source, purpose, density, narrative style, and output needs.
5. **Image Asset Gate**: after PPT requirements, ask whether the deck needs content images, AI-generated images, replaceable image slots, no images, or mixed handling. Do not treat earlier reference images as content images.
6. **Adapter Gate**: after requirements are known, detect scenario conflicts and offer visual-first, dynamic-downgrade, or cell-division handling when needed.
7. **Generation Handoff Gate**: after HTML/PPTX generation, deliver the requested artifact and report only concise paths, profile/version, and any known limitations.

If the user replies "default" at the Design DNA Panel Gate, treat it as accepting the extracted/discovered DNA, save/use the profile, then proceed to PPT Requirement Discovery.

For profile-management requests, do not ask for reference images, deck topic, audience, or page count. Use [Profile Management](references/profile-management.md).

## Core Workflow

1. **Design Intake**
   - Accept arbitrary images: website screenshots, PPT screenshots, game screenshots, posters, magazine pages, landscapes, portraits, product pages, UI screenshots.
   - Accept saved profiles/adapters.
   - If no images/profile exist, run no-image Design Discovery before asking deck questions.
   - If multiple images are provided, default to a blended style unless the user asks for weighted or separate profiles.
   - Summarize what each image contributes.
   - Treat reference images as style evidence only; never embed them by default.
   - See [Core Workflow](references/workflow.md) and [Design Discovery](references/design-discovery.md).

2. **Style Extraction Or Discovery**
   - Extract or create Design DNA across five required layers: Mood, Composition, Visual, Content Strategy, Presentation.
   - Do not reduce style to colors, fonts, and layout only.
   - See [Design DNA Schema](references/design-dna-schema.md).

3. **Design DNA Panel**
   - Show fixed hard parameters and dynamic semantic tags.
   - Explain major visual consequences.
   - Include best-fit and risky scenarios.
   - Stop for user confirmation/tuning.
   - See panel examples in [Core Workflow](references/workflow.md).

4. **User Tuning And Design Diff**
   - Let the user adjust sliders or choices.
   - Explain Design Diff as visual consequences, not only number changes.
   - If tuning creates contradiction, warn and offer choices.
   - Tuning a saved profile creates a new immutable version.

5. **Save Design Profile**
   - Save the minimal reproducible Design Profile: profile identity, source/discovery summary, current version pointer, Design DNA snapshot, design tokens, negative constraints, and derived prompt.
   - Do not save bulky management artifacts by default. Usage history, prompt exports, source image copies, and human-readable reports are optional.
   - Design Prompt is a derived export, not the source of truth.
   - See [Profile Management](references/profile-management.md).

6. **PPT Requirement Discovery**
   - Ask topic, goal, audience, content source, page count, density, narrative style, image intent, and output/export needs as option-first choices.
   - Ask only after the profile is accepted/saved.
   - Adapt questions to the Design DNA and scenario.
   - Do not present blank fill-in fields such as `topic: ____`; provide A/B/C/D options plus an "Other/custom" escape hatch.
   - After a Design Profile is saved, the next assistant response must be a guided choice panel, not a free-form intake form.
   - Never say "直接回复一行：主题..., 6页..., 给谁看..." as the primary requirement collection method. Compact answers such as `1A 2C 3B` are allowed only after showing options.

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
   - Include image asset rules: approved content images, generated image briefs, replaceable slots, fallback visuals, and forbidden placeholder behavior.
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
   - Do not generate slides from one loose prompt.

12. **HTML Deck Generation**
    - Generate a single-file or folder-based HTML deck as the primary artifact.
    - Save deck artifacts using the hard output contract in [Output Contract](references/output-contract.md).
    - Use a fixed 1920x1080 internal stage scaled uniformly to the viewport.
    - Enforce design tokens, density gates, layout archetypes, safe margins, and minimum font sizes.
    - Enforce visual safety: no generic empty image slots, no unreadable text/surface pairs, no decorative layers covering content, and no unreserved navigation overlap.
    - Use purposeful motion derived from Design DNA; avoid one generic animation recipe for every slide.
    - Do not use reference images as slide assets unless explicitly approved as content.
    - See [HTML Generation Rules](references/html-generation-rules.md) and [Visual Safety Rules](references/visual-safety-rules.md).

13. **Final Handoff**
    - Deliver the requested HTML deck and optional PDF/PPTX export.
    - Keep final output concise: artifact path, Design Profile/version, adapter strategy if used, and known limitations.
    - End at the generated artifact; this V3 flow does not include a post-generation browser QA stage.
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

Typography spacing is a mandatory visual safety category. Large titles must reserve visual clearance for Chinese glyph height, English descenders, stroke, shadow, glow, and offset layers. Keep spacing compact but safe: do not solve squeezed text by making the whole deck loose; instead use safe line-height, small visual-effect padding, controlled gaps, title splitting, or a slight font-size reduction.

Surface Pair, Zone Budget, and Layout Capacity are P0 mechanical constraints, not aesthetic suggestions. They protect freedom by preventing mechanical failures; they must not turn the deck into a fixed template system:

- Every readable region must declare a `surface_token` and `ink_token`. Cards, labels, badges, stat blocks, captions, chart labels, and formula labels cannot inherit text color from the slide.
- Pale or bright surfaces such as white, light gray, pale blue, pale pink, and bright yellow default to dark ink. Do not use white text on them.
- Zone Budget is a per-slide dynamic safety declaration, not a reusable template. Each slide may choose its own composition, but must declare the actual `title_zone`, `body_zone`, `visual_zone`, `card_zone`, `footer_zone`, `nav_safe_zone`, and `decoration_zone` when those roles exist.
- Zones use the fixed 1920x1080 stage coordinate system only for collision reasoning. They must come from the slide's unique composition and must not force repeated layouts.
- Main text zones cannot intersect visual, decoration, footer, navigation, or no-text zones. If there is no room, change layout, split the slide, reduce card count, compress copy, or lower decorative weight.
- Layout Capacity is a freedom-preserving capacity check, not a template rule. It says what a page type can safely carry; it does not dictate where everything must go.

## Option-First Requirement Collection

When entering PPT Requirement Discovery, always ask with numbered A/B/C/D choices. This is mandatory even when the user seems willing to describe the deck in prose.

Required behavior:

- Start with a short confirmation that the Design Profile is saved or selected.
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

Standard Chinese panel:

```text
已保存 Design Profile：<profile-path-or-name>
现在进入 PPT 需求阶段。请直接回复选项编号即可，例如：1A 2E 3B 4C 5A 6D 7B 8A。

1. PPT 主题？
A. AI 产品 / 项目展示
B. 研究、论文或学术主题
C. 商业计划 / 创业路演
D. 课程、教程或培训内容
E. 个人作品集 / 工作展示
F. 其他 / 自定义

2. 这份 PPT 的用途？
A. 汇报
B. 路演
C. 课程 / 教学
D. 答辩
E. 培训
F. 公开演讲
G. 其他 / 自定义

3. 目标受众？
A. 老师
B. 同学
C. 客户
D. 团队
E. 投资人
F. 公开观众
G. 其他 / 自定义

4. 页数？
A. 自动规划
B. 5-7 页
C. 8-12 页
D. 15-20 页
E. 自定义页数

5. 内容来源？
A. 我提供材料
B. AI 根据主题组织 / 生成
C. 基于某个本地文件或粘贴文档
D. 混合：我给材料，AI 帮我整理
E. 其他 / 自定义

6. 信息密度？
A. 极简，适合演讲
B. 平衡，适合展示和阅读
C. 信息密集，适合汇报 / 答辩
D. 分章节自适应

7. 图片策略？
A. 不放内容图，用 Design DNA 视觉、排版、图形和动效完成
B. 我会提供内容图片，围绕图片设计页面
C. 预留可替换图片位，但不要做丑的空框
D. AI 生成概念 / 氛围视觉图
E. 混合

8. 输出格式？
A. 只要 HTML
B. HTML + PPTX
C. HTML + PDF
D. HTML + PDF + PPTX
E. 先看 HTML，再决定是否导出
```

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
- reusable Design Profile path if saved
- current profile or adapter version
- adapter/fit strategy if used
- optional PDF/PPTX export path only if requested
- unresolved limitations or manual edits, if any

Do not clutter the final response with internal artifact lists. `design-contract`, `ppt-blueprint`, and `page-specs` are required planning steps, but they are transient by default. Persist them only when the user asks to inspect, edit, audit, or regenerate from specs.

When managing profiles, provide only the requested profile/library information: list, detail, diff, adapter, export path, or usage history. Do not generate a deck unless explicitly requested.

When only discussing the skill design, do not generate PPT files unless the user explicitly asks.

## Non-Negotiables

- Do not reduce style extraction to color palette extraction.
- Do not skip the Design DNA layer.
- Do not skip the Design DNA parameter panel.
- Do not ask PPT task questions before the user accepts or tunes Design DNA.
- Do not overwrite a saved profile version; create a new version and Design Diff.
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
- Do not allow title lines, subtitles, dividers, or body text to visually touch or squeeze each other. Tight editorial typography is allowed only when glyphs remain clearly separated and body text remains readable.
