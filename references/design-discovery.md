# Design Discovery

V3 supports users who have no reference images.

No-image Design Discovery is not permission to skip Design DNA. It is a guided way to create Design DNA before deck generation.

## Entry Conditions

Use Design Discovery when:

- the user has no uploaded visual references
- the user has not selected a saved Design Profile
- the user describes a vibe, named style, brand-like direction, or mood

Examples:

- "I want OpenAI style, but for a university defense."
- "Make it Apple keynote style."
- "Silicon Valley startup pitch."
- "Academic but not old-fashioned."
- "Business but not consulting-template."

If the user asks for a deck from text alone, do not jump to PPT task questions. First create or choose a Design DNA direction.

## Discovery Questions

Ask 3-5 compact questions when needed. If the user already gave enough style signal, reduce the number.

Question examples:

```text
First impression:
A. authoritative and credible
B. innovative and futuristic
C. premium and restrained
D. young and energetic
```

```text
Visual density:
A. keynote-like and minimal
B. balanced for live explanation
C. information-rich for review
D. dense but still structured
```

```text
Closest world:
A. product launch
B. consulting/report
C. academic/research
D. editorial/magazine
```

```text
Emotional temperature:
A. calm
B. sharp
C. playful
D. serious
```

```text
Risk preference:
A. safe and readable
B. distinctive but controlled
C. bold and memorable
D. experimental
```

## Named Style Parsing

When the user names a style, translate it into Design DNA without pretending to copy the exact brand.

Examples:

```text
OpenAI style, but for university defense
-> OpenAI Academic Minimal
-> restrained monochrome, high credibility, medium density, strong diagrams, low motion
```

```text
Apple keynote style for math modeling
-> Apple Academic
-> preserve premium minimalism, increase chart weight and formula friendliness
```

```text
Sequoia-style startup deck
-> Silicon Valley Investor Minimal
-> business high, title weight high, evidence beats, controlled accent color
```

Do not claim official brand ownership or exact private design systems. Treat named styles as public aesthetic references and generate a compatible Design DNA.

## Three Direction Preview

Default no-image discovery should produce 2-3 candidate Design DNA directions before the user chooses.

Example:

```text
Direction A: OpenAI Minimal Academic
- calm, credible, high whitespace, medium evidence density
- best for defense and research explanation

Direction B: Silicon Valley Pitch
- confident, business-forward, stronger metrics and contrast
- best for funding, product demo, opportunity framing

Direction C: Editorial Research
- magazine-like, narrative, visual rhythm, warmer pacing
- best for talks and insight reports
```

Then ask:

```text
Choose:
A. Use Direction A
B. Use Direction B
C. Use Direction C
D. Mix directions
```

After the user chooses, show the mandatory Design DNA parameter panel.

## Visual Preview Mechanism

When the environment can write local HTML, no-image discovery should create three lightweight Design DNA previews before final DNA selection:

```text
outputs/<deck-slug>/previews/design-direction-a.html
outputs/<deck-slug>/previews/design-direction-b.html
outputs/<deck-slug>/previews/design-direction-c.html
```

Each preview is a single fixed-stage title slide or profile card, not a full deck. It should show:

- typography mood
- palette and surface/ink behavior
- composition rhythm
- visual density
- motion feeling if easy to express in HTML/CSS
- a real title or placeholder based on the user's topic, not internal labels

Do not render process text such as "preview", "Design DNA option", file names, paths, or model notes on the slide itself. The assistant message may label the options outside the slide.

When reference images are used, create one style-transfer preview slide when feasible. It should demonstrate the extracted visual language without embedding, tracing, redrawing, or approximating the reference subject.

When saving a reusable profile, create a profile preview thumbnail or preview card only when the user asks for it or when it is needed for profile-library selection. Do not create thumbnail galleries by default.

## DNA From Discovery

Even without images, generate complete Design DNA:

- Mood
- Composition
- Visual
- Content Strategy
- Presentation
- fixed hard parameters
- dynamic semantic tags
- tokens
- negative constraints
- review rubric

Example:

```text
Design DNA: OpenAI Academic Minimal

Fixed hard parameters:
- Whitespace: 72
- Information density: 52
- Image/visual weight: 45
- Title weight: 78
- Chart weight: 72
- Text density: 48
- Motion intensity: 18

Dynamic semantic tags:
- Minimal: 82
- Academic: 70
- Trustworthy: 86
- Futuristic: 38
- Business: 45
- Editorial: 35
- Serious: 78
```

## Discovery Gate

After showing the panel, stop for the user's answer:

```text
Choose:
A. Confirm this Design DNA and continue
B. Tune parameters
C. Regenerate directions
D. Save as a Design Profile only
```

If the user says "default", treat it as A.

Only after this gate may the agent ask PPT topic, audience, page count, content source, purpose, or export format.
