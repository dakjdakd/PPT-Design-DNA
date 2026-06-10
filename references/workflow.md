# Core Workflow

V3.1 is a complete Design DNA loop. It can create a deck from reference images, a saved profile, no-image Design Discovery, or an existing deck renovation/conversion request, but deck generation starts from an accepted active Design DNA candidate. Saving that candidate as a reusable Design Profile is optional and requires explicit user approval.

V3 is HTML-first and Design-DNA-first. The profile library is useful for reuse, but it must not become an automatic archive for every generation. The deck is authored as fixed-stage animated HTML, then optionally exported to PDF/PPTX only if the user asks.

Before asking for new reference images, check whether the user is likely trying to reuse an existing Design DNA. If the current project has `design-profiles/profile-index.json`, read that one file and offer saved profiles/adapters as possible design sources. Do not recursively scan the workspace.

## Mandatory Order

The order is strict. It is also an interaction contract: the assistant must stop at confirmation gates and wait for a later user reply before moving to the next gate.

```text
0. Route the request:
   A. new deck
   B. existing deck enhancement/conversion
   C. profile management
   D. skill-design discussion
1. User provides or selects a design source:
   A. saved Design Profile or adapter
   B. reference images
   C. no-image Design Discovery choices
   D. existing deck style after inspection
2. If an existing deck is involved, inspect/extract current content and classify the renovation task
3. Extract or generate Design DNA
4. Show visual previews when needed: three no-image previews, one reference style-transfer preview, or an optional profile preview card
5. Show the Design DNA parameter panel
6. User confirms/tunes the active Design DNA candidate; optionally saves it as a versioned asset only by explicit choice
7. Ask PPT task questions: topic, audience, page count, content source, purpose, output
8. Ask content image intent and plan Image Asset Strategy
9. Check design-scenario fit
10. Create or select an optional scenario Adapter
11. Generate Design Contract
12. Generate Blueprint
13. Generate Page Specs
14. Generate fixed-stage animated HTML deck
15. Optional PDF/PPTX export if requested
16. Final handoff
```

Do not ask "topic / audience / page count / purpose / content source / PPTX export" before the active Design DNA candidate is accepted, unless the user is explicitly asking to inspect or classify an existing deck source. Those questions belong to PPT Requirement Discovery, not Design Intake.

Do not ask how slide images should appear before step 5 unless the user explicitly says a provided image is slide content. Image intent is not Design Intake; it is a deck-planning choice after the active Design DNA exists.

Do not create files, output folders, HTML, manifests, or generated decks before steps 5-8 have each been completed in order. A reference-image request must first produce analysis and a detailed Design DNA panel, not a finished default deck.

## No Default Browser QA Or Playwright Dependency

The default V3 workflow must not try to locate, install, import, or run Playwright, `playwright-core`, bundled browser runtimes, Node module directory hacks, screenshot loops, or browser automation.

Use source-level checks instead:

- Design Contract
- Page Specs
- `visual_subject_policy`
- `mechanical_layout_preflight`
- `layout_box_budget`
- `scripts/ppt-layout-guard.js` after HTML is written, when Node is available
- Quality Rubric P0 checks
- static HTML/CSS/JS completeness checks when useful

If the user explicitly asks for browser QA and the environment already has a working browser automation tool, it may be used as an optional advanced check. If it is missing, skip browser QA and say it was skipped; do not debug dependencies as part of the deck workflow.

## Phase 1: Design Intake

### Existing Deck Intake

If the user asks to beautify, redesign, convert, preserve, or partially polish an existing PPT/PPTX/HTML deck, read [Existing Deck Enhancement](existing-deck-enhancement.md) and inspect the source before choosing the final design source.

Use this mode for requests like:

```text
帮我美化这个 PPT
把这个 PPTX 改成网页 PPT
这个 HTML deck 太丑，按某风格重做
保留内容，重做视觉
只改封面和章节页
```

After inspection, classify the task as preserve-content redesign, HTML conversion, partial polish, content rewrite, or style migration. Keep the original source untouched.

### Existing Profile Lookup

If the user says things like "use my saved design", "reuse that profile", "use Apple Academic", "show my designs", "用我保存的 Design DNA", or if `design-profiles/profile-index.json` exists in the current project, treat the Profile Library as a first-class design source.

Read only:

```text
design-profiles/profile-index.json
design-profiles/<selected-profile>/profile.json
design-profiles/<selected-profile>/versions/<current-version>.json
```

If the user selects an adapter, also read:

```text
design-profiles/<selected-profile>/adapters/<adapter-id>/adapter.json
design-profiles/<selected-profile>/adapters/<adapter-id>/versions/<current-adapter-version>.json
```

Then show a compact choice:

```text
我找到了可复用的 Design Profiles：
01 Cyber Minimal Editorial - v002 - 适合 product launch / portfolio - adapters: academic
02 Apple Academic - v001 - 适合 defense / research report

你想：
A. 直接使用某个 Profile
B. 使用某个 Adapter
C. 先微调再生成新版本
D. 新建一个 Design DNA
```

Do not ask for reference images when a matching saved profile or adapter is available unless the user wants to create a new style.

Accept any explicit user-provided visual reference:

- PPT screenshots
- website screenshots
- game screenshots
- magazine pages
- posters
- UI screenshots
- landscapes
- portraits
- product photos
- movie frames

If the user has not provided visual references and has not selected a saved Design Profile, run no-image Design Discovery. Ask whether they want to upload images, choose a saved profile, or answer style questions:

```text
PPT-Design-DNA needs a Design DNA source before it can create a deck.

Choose:
A. Upload 1-5 visual reference images
B. Use a saved Design Profile
C. Start no-image Design Discovery

Reference images are only for extracting Design DNA. I will not place them into the PPT unless you explicitly mark them as slide content.
```

Do not search the workspace for images. Do not use images from previous turns unless the user explicitly reselects them.

Apply the Reference Subject Firewall during intake:

- identify allowed style traits separately from forbidden subject matter
- allowed traits include palette, typography mood, composition rhythm, line quality, border/shadow treatment, material, texture, density, crop treatment, and motion feeling
- forbidden subject matter includes people, animals, characters, mascots, specific objects, products, buildings, vehicles, toys, and recognizable subject parts such as faces, eyes, ears, tails, fins, horns, wings, paws, posture, clothing, fur, scales, and silhouettes
- forbidden subject matter cannot become CSS, SVG, HTML, AI-generated visuals, icons, mascots, diagrams, or decorative motifs later
- if the user wants the subject itself to appear, handle it later as an explicit content image through Image Asset Strategy; do not redraw or approximate it from the reference

### Reference Image vs Content Image

Always separate these two roles:

```text
Reference image:
- used to extract mood, color, composition, visual grammar, density, and motion feeling
- not inserted into the deck by default
- subject matter is not reusable visual content and cannot be redrawn, traced, stylized, or approximated

Content image:
- used as an actual slide asset
- inserted only when the user explicitly says it should appear in the deck
```

If the user provides multiple images, ask only when needed:

```text
How should these references be fused?
A. Blend into one unified Design DNA
B. Use the first image as the main style and others as support
C. Extract separate profiles and let me choose
D. Extract only their common visual traits
```

Default in V3: blend into one unified profile unless the user asks for separate profiles.

## Phase 1B: No-Image Design Discovery

If the user chooses no-image discovery, ask 3-5 compact style questions or parse their named style phrase. Then generate 2-3 Design DNA directions and ask the user to choose or mix.

Do not ask deck topic, audience, page count, content source, purpose, or export before the user chooses a Design DNA direction and sees the parameter panel.

See [Design Discovery](design-discovery.md).

## Phase 2: Extraction Summary

Describe what the references contribute:

```text
Cyberpunk screenshot:
Allowed style traits:
- dark cinematic atmosphere
- neon accent color
- high contrast
- immersive depth
Forbidden subject matter:
- vehicles, people, weapons, buildings, or any recognizable source-scene subject

Notion homepage:
Allowed style traits:
- high whitespace
- strict grid
- calm typography
- low visual noise
Forbidden subject matter:
- specific UI screenshots, icons, logos, or product surfaces unless approved as content
```

Every reference summary must use this split:

```text
Reference image:
- Allowed style traits: <palette / type / layout / texture / line / motion / crop behavior>
- Forbidden subject matter: <people / animals / characters / mascots / objects / products / subject parts>
- Subject Firewall: these subjects will not be redrawn, traced, stylized, abstracted into mascots, used as CSS/SVG/HTML visuals, or used as slide assets unless explicitly marked as content.
```

Then produce a fused direction:

```text
Cyber Minimal Editorial
```

After reference-image extraction, show the Design DNA candidate and detailed parameter panel, then stop. Do not infer a deck topic such as "CHILL MODE", choose a page count, choose an audience, or generate a sample deck unless the user has already accepted the Design DNA and then answered the PPT requirement panel.

For no-image discovery, describe the chosen direction and why it fits the user's stated style intent.

## Phase 3: Design DNA Panel

Show:

- source/extraction summary
- reference subject firewall split
- fused direction name and design thesis
- fixed hard parameters
- dynamic semantic tags
- five required DNA layers
- execution constraints
- design tokens
- negative constraints and P0 risks
- plain-language style summary
- risks and best-fit scenarios
- visual consequences
- confirmation choices

Do not collapse this panel into a few sentences. The user must be able to inspect and tune the design system before any deck requirements are collected.

Minimum detailed panel structure:

```text
Design DNA: <name>
Persistence: unsaved_candidate

1. Source extraction
- Reference 1 contribution:
  - Allowed style traits: ...
  - Forbidden subject matter: ...
  - Subject Firewall: ...
- Reference 2 contribution: ...
- Fusion strategy: blend / weighted / separated

2. Fixed hard parameters (0-100)
- Whitespace: ...
- Information density: ...
- Image/visual weight: ...
- Title weight: ...
- Chart weight: ...
- Text density: ...
- Formula friendliness: ...
- Grid strictness: ...
- Hierarchy strength: ...
- Motion intensity: ...

3. Dynamic semantic tags (0-100)
- <tag>: ...

4. Five DNA layers
- Mood: ...
- Composition: ...
- Visual: ...
- Content Strategy: ...
- Presentation: ...

5. Execution constraints
- Canvas: 1920x1080, 16:9
- Safe margins: ...
- Density gates: ...
- Typography minimums: ...
- Mechanical layout preflight: required before HTML
- layout_box_budget: required before HTML
- Reference Subject Firewall: enabled
- Motion rules: ...

6. Design tokens
- Background: ...
- Ink/text: ...
- Accent: ...
- Surfaces: ...
- Border/shadow: ...
- Material/texture: ...
- Type direction: ...

7. Negative constraints / P0 risks
- ...

8. Visual consequences
- ...

9. Best for / risky for
- Best for: ...
- Risky for: ...

Choose:
A. Confirm this Design DNA and continue
B. Tune parameters
C. Regenerate Design DNA from the same source
D. Save this Design DNA as a reusable Profile now
```

Example:

```text
Design DNA: Cyber Minimal Editorial

Fixed hard parameters:
- Whitespace: 70
- Information density: 35
- Image/visual weight: 65
- Title weight: 85
- Chart weight: 35
- Text density: 30
- Motion intensity: 35

Dynamic semantic tags:
- Cyber: 80
- Minimal: 90
- Tech: 82
- Editorial: 55
- Futuristic: 76
- Academic: 20
- Business: 45
- Premium: 74
- Youthful: 48
- Serious: 68

Visual consequences:
- high minimal means fewer decorative objects and more negative space
- high cyber means neon edges, darker contrast, and stronger glow control
- low chart weight means the profile is risky for dense data reports

Reference Subject Firewall:
- Detected subjects: vehicles / people / UI product surfaces
- These will not be redrawn, traced, stylized, abstracted into mascots, or used as slide visuals.
- Allowed extraction only: dark palette, neon contrast, grid clarity, calm typography.

Best for:
- product launch
- tech portfolio
- creative pitch

Risky for:
- formula-heavy academic defense
- dense financial report

Choose:
A. Confirm this Design DNA and continue
B. Tune parameters
C. Regenerate Design DNA from the same source
D. Save this Design DNA as a reusable Profile now
```

For the user's three-image "3D toy future" example, the panel should look more like:

```text
Design DNA: Soft Toy Future

Fixed hard parameters:
- Whitespace: 82
- Information density: 24
- Image/visual weight: 78
- Title weight: 88
- Chart weight: 22
- Text density: 20
- Motion intensity: 42

Dynamic semantic tags:
- 3D toy feel: 92
- Soft futuristic: 86
- Minimal: 74
- Candy color: 68
- Premium: 62
- Academic: 12
- Business: 35
- Youthful: 78
- Serious: 18

Visual consequences:
- high whitespace means fewer words per page
- high visual weight means each slide needs one strong synthetic visual anchor
- low chart weight means it is not ideal for dense data reports unless adapted
- high toy feel means shapes should be rounded, glossy, friendly, and close-cropped

Reference Subject Firewall:
- Detected subjects: toy objects / characters / product-like forms
- These subjects and their parts will not be redrawn as CSS/SVG/AI visuals.
- Allowed extraction only: soft material, rounded geometry, candy palette, close-crop composition.

Choose:
A. Confirm this Design DNA and continue
B. Tune parameters
C. Regenerate Design DNA from the same references
D. Save this Design DNA as a reusable Profile now
```

After this panel, stop. If the user says "default", treat it as A and keep the Design DNA as an unsaved active candidate for this deck.

Do not proceed to PPT Requirement Discovery until the user has answered this panel.

## Phase 4: Tuning

Let the user tune parameters.

Always explain the visual consequence:

```text
Cyber 80 -> 30:
- neon saturation decreases
- glow edges are reduced
- dark tech atmosphere remains
- style shifts from game UI to calm tech editorial
```

If tuning creates a contradiction, warn:

```text
You set whitespace to 90 and information density to 85. This is a conflict.
Choose:
A. Keep whitespace high and split content into more slides
B. Lower whitespace to fit more information
C. Keep both and accept higher visual risk
```

After tuning, show a short Design Diff and ask:

```text
Use this updated Design DNA?
A. Confirm and continue
B. Tune again
C. Save as reusable Profile now
```

## Phase 5: Active Design DNA Candidate And Optional Profile Save

Default behavior:

- Keep the accepted Design DNA in memory/reasoning as the active candidate for this deck.
- Do not create or modify `design-profiles/` by default.
- Do not create `profile-index.json`, `profile.json`, `versions/*.json`, `diffs/*.json`, adapters, usage logs, thumbnails, or prompt exports by default.
- Do not update `last_used_at` or `last_output_path` on existing profiles unless the user is explicitly managing/saving profile history.
- Continue to PPT Requirement Discovery after the active candidate is accepted.

Only save a reusable Design Profile when:

- the user chooses "Save this Design DNA as a reusable Profile now"
- the user explicitly says "save this style", "save this profile", "保存这个风格", or similar before generation
- the user reviews the final deck and says they are satisfied and want to save the style for reuse

Final handoff must offer saving when the current deck used an unsaved active Design DNA candidate. This is not optional wording. The assistant should ask a compact decision question in the user's language after the artifact and layout-check status:

```text
If this deck feels right, do you want to save this Design DNA for reuse?
A. Save as a reusable Design Profile
B. Do not save yet
C. Tune first, then save
```

Do not create `design-profiles/` before the user answers with an explicit save choice.

When saving is explicitly requested, write the minimal reproducible profile assets below.

Profile fields:

- profile_id
- profile_name
- source or discovery summary
- user_dna
- execution_dna
- design_prompt
- tokens
- negative_constraints
- profile_metadata
- versioning
- compact usage pointers, if present
- adapters, if any

Reusable / compounding artifacts:

- profile-index.json
- profile.json
- profile version snapshots
- machine-readable Design Diff JSON
- adapter records

Project-local artifacts:

- index.html
- deck-manifest.json

Final output:

- outputs/<deck-slug>/index.html
- optional PDF/PPTX export

Planning artifacts such as Design Contract, PPT Blueprint, and Page Specs are required steps, but they are transient by default. Persist them under `outputs/<deck-slug>/specs/` only when the user asks to inspect, edit, audit, or regenerate from specs.

In the final response, mention only the final deck, active Design DNA summary, reusable profile only if saved or selected, current profile/adapter version only if applicable, adapter strategy if used, known limitations, and the mandatory save decision prompt when the active Design DNA is unsaved. Do not list internal specs unless the user asks for them.

For full profile rules, see [Profile Management](profile-management.md).

## Phase 6: Requirement Discovery

Ask concise, option-first questions. Do not present this phase as blank fields for the user to fill in.

Only ask these after the Design DNA Panel Gate is passed.

If the user already provided any of these answers earlier, reuse them and ask only what is missing.

When Phase 6 starts immediately after accepting an active Design DNA candidate or selecting a saved profile, the assistant must show a numbered choice panel. Do not ask the user to write an open sentence first.

Requirement Discovery must feel like a guided choice panel:

```text
Good:
1. PPT topic?
A. AI product/project showcase
B. Research or academic topic
C. Business plan or startup pitch
D. Course / teaching content
E. Other / custom

Bad:
1. PPT topic:
2. Audience:
3. Page count:
```

Rules:

- Every requirement should provide 3-6 choices first.
- Include `Other / custom` only when the answer space is naturally open, such as topic or purpose.
- Let the user answer compactly, for example `1B 2D 3C`.
- If the user picks `Other / custom`, then ask for the custom text.
- Defaults are allowed only after the user says `default`, and only for this requirement panel. Do not use default requirements before this panel is shown.
- Adapt option labels to the active Design DNA and likely scenario when helpful.
- Do not say `你可以直接回复一行：主题：..., 6页, 给同学看, HTML` as the primary input method.
- Do not show slash-separated fill-in prompts such as `受众：老师/同学/客户/团队/公开演讲？`.
- If there is no strong reason to customize, use the standard Chinese panel below.

### Standard Chinese Requirement Panel

Use this structure as the default Phase 6 interaction after the active Design DNA is accepted. If the profile is saved/selected, mention that. If it is unsaved, say it is being used only for this deck unless the user later saves it:

```text
Design DNA：<dna-name>（当前仅用于本次 PPT；满意后可保存为 Design Profile）
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

If the active Design DNA or user context suggests better topic choices, replace only question 1's choices while preserving the numbered A/B/C/D structure.

### Topic

Offer topic options instead of asking for a blank subject. Tailor the choices to the active profile if possible.

```text
What is the PPT topic?
A. AI product / project showcase
B. Research, paper, or academic topic
C. Business plan / startup pitch
D. Course, tutorial, or training content
E. Personal portfolio / work showcase
F. Other / custom
```

If the Design DNA or prior user message implies a narrower set, customize it:

```text
What is the PPT topic?
A. AI Design Architect product concept
B. PPT-Design-DNA skill proposal
C. Math modeling defense
D. Startup pitch deck
E. Other / custom
```

### Presentation Goal

```text
What is this PPT for?
A. Defense
B. Report
C. Pitch
D. Speech
E. Teaching
F. Sales
G. Other / custom
```

### Audience

```text
Who will watch/read it?
A. Teachers
B. Investors
C. Clients
D. Leaders
E. Classmates
F. Public audience
G. Other / custom
```

### Content Source

```text
What is the content source?
A. I will provide materials
B. AI organizes/generates from the selected topic
C. Use a specific local file or pasted document
D. Mixed: user materials + AI organization
E. Other / custom
```

### Content Image Intent

Ask this as part of requirement discovery, after the core PPT task is clear:

```text
How should this deck use content images?
A. No content images; use Design DNA visuals, typography, diagrams, and whitespace
B. I will provide real images; plan slides around them
C. Reserve replaceable image slots for later
D. Generate AI images for concept/atmosphere
E. Mixed
```

Important:

- This question refers to **content images**, not Design Reference Images.
- If the user chooses B or E, evaluate approved content images before Blueprint.
- If the user chooses C, decide whether placeholders are visible or hidden behind CSS fallback.
- Default when uncertain: no visible placeholders; use CSS fallback visuals.

See [Image Asset Strategy](image-asset-strategy.md).

### Page Count

```text
How many pages?
A. Auto-plan
B. Short: 5-7 pages
C. Standard: 8-12 pages
D. Long: 15-20 pages
E. Custom page count
```

### Information Density

```text
Preferred density?
A. Minimal / speaker-led
B. Balanced
C. Information-dense / reading-first
D. Adaptive by section
```

### Narrative Style

```text
Preferred storytelling style?
A. Apple keynote
B. TED talk
C. Consulting report
D. Magazine story
E. Academic paper
F. Other / custom
```

### Output

```text
What output do you want?
A. HTML only
B. HTML + PPTX
C. HTML + PDF
D. HTML + PDF + PPTX
E. Decide after seeing the HTML
```

## Phase 7: Image Asset Strategy

Convert the content image intent into a concrete strategy:

```text
No content images
-> HTML/CSS/SVG visuals, diagrams, typography, and whitespace must make the deck feel complete.

User-provided real images
-> classify assets, assign semantic roles, decide fit/crop/caption rules, and let images shape the blueprint.

Replaceable slots for later
-> create image-manifest slots and CSS fallback; show designed placeholders only if requested.

AI-generated images
-> create image briefs for concept/atmosphere only; do not create fake evidence.

Mixed
-> combine the above per slide.
```

Do not insert images after the layout is already decided. Approved images and future slots must be represented in Blueprint and Page Specs.

See [Image Asset Strategy](image-asset-strategy.md).

## Phase 8: Design-Scenario Fit Check And Adapter

Compare Design DNA against the presentation scenario.

Example:

```text
Design: Apple Minimal
Scenario: math modeling defense

Risk:
- math modeling needs higher information density
- charts and formulas require more space
- current design may make text too small

Choose:
A. Visual first: compress 2000 words into core conclusions
B. Dynamic downgrade: reduce whitespace and increase density
C. Cell division: keep beauty and split dense pages into more slides
```

When conflict is meaningful, give visual-director advice and create a scenario adapter if the user chooses a strategy:

```text
Base Profile: Cyber Minimal Editorial
Scenario: math modeling defense
Generated Adapter: Cyber Minimal Academic
Strategy: cell division
```

Save the adapter as a derived profile variant. See [Design Adapter](design-adapter.md).

## Phase 9: Design Contract

Create scenario-specific rules:

- what to preserve
- what to adapt
- density strategy
- chart/formula strategy
- slide splitting strategy
- animation/motion strategy
- forbidden design mistakes
- image asset policy: no images, approved content images, replaceable slots, generated image briefs, fallback visuals

## Phase 10: PPT Blueprint

Before generating slides, output a deck blueprint:

```text
Page 1: Cover
Purpose: establish first impression
Elements: large visual, oversized title, one subtitle

Page 2: Problem background
Purpose: explain why the topic matters
Elements: two-column layout, short claim, data card

Page 3: Method
Purpose: show the core approach
Elements: central flow diagram, three notes
```

Ask for approval if the user is in a discussion/planning mood. If the user asked to generate directly, continue after showing the plan briefly.

If content images are approved, co-design the blueprint around them. For example, 3 product screenshots can become 3 feature/proof slides; one logo can affect cover/closing identity; a chart can require a chart explanation slide. Do not make the outline first and paste images later.

## Phase 11: Page Specs

For each slide, create a structured Page Spec. Do not jump from blueprint to slides.

Each Page Spec needs:

- page number
- page type
- purpose
- core message
- layout archetype
- zones
- word limits
- visual constraints
- required elements
- forbidden elements
- motion recipe
- quality targets
- visual safety fields:
  - safe zones
  - no-text zones
  - image/visual slot role
  - empty-slot fallback
  - image strategy when relevant
  - visual subject policy
  - mechanical layout preflight
  - text/surface pairs
  - z-index plan
  - collision exclusions
- speaker note if helpful

If a slide has no approved content image, its visual slot must become typography, diagram, CSS/SVG visual, material object, or whitespace. Do not create a blank image placeholder, plus-sign box, or meaningless repeated side block.

If the active Design Profile came from reference images with identifiable subjects, each Page Spec must include:

```json
{
  "visual_subject_policy": {
    "uses_reference_subject": false,
    "subject_replication_allowed": false,
    "forbidden_reference_subjects": ["cat", "fish", "dinosaur", "person", "mascot", "product object"],
    "visual_surrogate_strategy": "abstract_material_shape | typography | diagram | texture | whitespace",
    "forbid_subject_silhouette": true,
    "forbid_subject_parts": true
  }
}
```

For every slide with more than one major element, include:

```json
{
  "mechanical_layout_preflight": {
    "stage": { "w": 1920, "h": 1080 },
    "safe_margin": { "top": 80, "right": 96, "bottom": 96, "left": 96 },
    "nav_safe_zone_reserved": true,
    "text_fit_estimates": [],
    "collision_pairs_checked": [],
    "if_fail": "recompose_or_split_slide"
  },
  "layout_box_budget": {
    "stage": { "w": 1920, "h": 1080 },
    "zones": [
      {
        "id": "title",
        "x": 110,
        "y": 140,
        "w": 980,
        "allocated_h": 310,
        "font_family_role": "display_serif",
        "font_size": 100,
        "line_height": 1.06,
        "estimated_lines": 3,
        "glyph_pad_top": 18,
        "glyph_pad_bottom": 32,
        "visual_effect_pad": 0,
        "required_h": 368,
        "fit": "pass | fail"
      }
    ],
    "derived_zone_rules": [
      "body_zone.y >= title_zone.y + title_zone.required_h + 44",
      "card_zone.y >= max(planned_card_y, body_zone.y + body_zone.required_h + 56)"
    ],
    "collision_pairs": [
      ["title_zone", "body_zone"],
      ["title_zone", "card_zone"],
      ["body_zone", "card_zone"],
      ["card_zone", "nav_safe_zone"]
    ],
    "if_fail": "lower_title_size_or_move_next_zone_or_split_slide"
  }
}
```

Do not proceed from Page Spec to HTML when `visual_subject_policy`, `mechanical_layout_preflight`, or `layout_box_budget` fails.

For image strategy fields, use [Image Asset Strategy](image-asset-strategy.md).

## Phase 12: HTML Deck Generation

Generate HTML first.

Core rules:

- fixed 1920x1080 internal stage
- uniform scale to viewport
- no responsive reflow inside slides
- single-file HTML when possible, or a small folder if assets are needed
- inline CSS/JS where practical
- design tokens in `:root`
- valid text/surface pairs
- z-index ladder and no-text exclusion zones
- no scrolling inside slides
- no overflow
- no fake image placeholders
- no decorative/media layers covering text
- no overlap
- no text below comfortable reading size
- no CJK or mixed Chinese/Latin title orphan lines; display headlines require planned semantic line breaks, not browser-only auto-wrap
- purposeful motion derived from DNA
- no reference images used as slide assets by default
- no reference-image subject redrawn as CSS/SVG/HTML/AI visuals, icons, mascots, diagrams, or decorative motifs
- mechanical layout preflight passes before HTML is authored
- layout box budget passes before HTML is authored
- major content elements use `data-zone` or an equivalent class-to-zone mapping
- every slide with multiple readable elements must expose guard-readable `data-zone` markers; page-count checks or manifest checks do not replace layout guard coverage
- body/card/footer positions are derived from prior zone required heights instead of independent absolute `top` guesses
- large multi-line English serif titles use safe line-height and descender padding
- CJK/mixed display titles use `line-height >= 1.02`, `letter-spacing: 0`, and planned line breaks with no single-character or 1-2 character orphan final line
- DOM order must not be used to let later cards/panels cover earlier text

Use CSS, layout, typography, generated shapes, diagrams, and motion to express the extracted Design DNA. If image-like visuals are needed, create abstract style surrogates from the style; do not paste the user's reference images and do not redraw their identifiable subjects.

HTML is preferred because:

- layout fidelity is higher than direct PPTX generation
- animation and micro-interactions are easier
- CSS variables make tuning easier
- the result can still export to PDF or PPTX later

Use [HTML Generation Rules](html-generation-rules.md) and [Visual Safety Rules](visual-safety-rules.md).

## Phase 13: Optional Export And Final Handoff

If the user requested PDF/PPTX, export from the generated HTML when feasible and mention any motion/fidelity limits. If the user requested HTML only, stop at the generated HTML deck.

Before final handoff for an HTML deck, run the source-level layout guard when Node is available:

```powershell
node scripts/ppt-layout-guard.js <output-html> --report <output-dir>/layout-guard-report.json
```

This command is a hard delivery lock. The assistant must have an actual command result before final handoff. A promise such as "I will run it now" is not enough, and final handoff must not happen until one of these is true:

- the guard returned PASS and wrote `<output-dir>/layout-guard-report.json`
- the guard returned P0 failures, the HTML/Page Specs were repaired, and the guard was rerun until PASS
- Node is genuinely unavailable, in which case the same source-level checks are performed manually and the final response states that the script could not be run

Do not substitute page-count checks, manifest validation, local server startup, browser preview, screenshot inspection, or "HTML can be opened" for this command. Those checks can be optional extras only after the source-level guard has run.

## Failure Recovery

- If the layout guard returns P0, revise Page Specs and layout budgets first; do not hide the failure with blind CSS changes.
- If Node is unavailable, manually perform the source-level layout checks and state that the script could not be run.
- If PPTX export fails or is unavailable, keep HTML as the source artifact and provide PDF/manual export alternatives only when useful.
- If the user only says "做PPT" or gives a similarly vague request, enter saved-profile selection or no-image Design Discovery instead of asking the full PPT questionnaire.
- If the user says "default", apply it only to the current visible gate. At Design DNA confirmation, default means accept the design and move to the requirement panel. At the requirement panel, default means balanced density, HTML-only output, and no reusable profile save.

This guard is a static source check, not browser QA. It must not trigger Playwright lookup, installation, bundled runtime probing, screenshots, or dependency debugging. If the guard reports P0 issues such as `missing_data_zones`, `missing_layout_box_budget`, `cjk_orphan_line`, `estimated_cjk_orphan_line`, `ugly_cjk_short_title_line`, `unsafe_cjk_display_line_height`, `unsafe_display_selector_line_height`, `negative_display_letter_spacing`, `unsafe_display_word_break`, `unsafe_text_block_gap`, `title_zone_collision`, `body_card_collision`, `nav_safe_zone_collision`, `unsafe_display_line_height`, `unsafe_tight_line_height`, or `text_overflow_hidden`, revise the Page Spec or HTML and rerun the guard. Do not deliver the deck until it returns PASS. If Node is unavailable, apply the same checks manually from source and state that the script could not be run.

If the active Design DNA was not saved or selected from an existing profile, final handoff must include the save decision prompt in the user's language. Keep it short and action-oriented. The default is no save until the user explicitly chooses option A.

Final handoff for an HTML deck must include a short verification line:

```text
Layout guard: PASS - <output-dir>/layout-guard-report.json
```

If the report cannot be produced because Node is unavailable, replace the PASS line with the manual source-check status and the reason Node could not run. End at the requested generated artifact. V3 does not include a post-generation browser QA stage in its default flow. Do not probe for Playwright, `playwright-core`, browser runtimes, bundled Node modules, or dependency fixes unless the user explicitly requests browser QA.
