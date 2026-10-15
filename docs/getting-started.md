# Getting started

[Project overview](../README.md) · [Architecture](architecture.md) · [Showcase](showcase.md)

PPT-Design-DNA runs as an AI skill inside a compatible host. This repository supplies instructions, design contracts, and a layout validator. The host provides the model, file access, and generation tools.

## Requirements

| Requirement | Used for |
| --- | --- |
| Codex with local skill support | Loading the skill and coordinating the workflow. |
| Git | Installing and updating a local checkout. A downloaded copy can also be placed in a supported skills directory. |
| Node.js | Running the bundled source-level HTML layout guard. It uses Node built-ins and requires no npm packages. |
| A modern browser | Opening the generated HTML presentation. |
| Export tools, when available | Producing PDF or PPTX only when requested. |

Export availability depends on the host environment. HTML remains the primary artifact, and PPTX may not preserve HTML motion effects.

## Install

### User-level installation

Install once to make the skill available across your local projects.

**macOS / Linux**

```bash
mkdir -p "$HOME/.agents/skills"
git clone https://github.com/dakjdakd/PPT-Design-DNA.git "$HOME/.agents/skills/PPT-Design-DNA"
```

**Windows PowerShell**

```powershell
New-Item -ItemType Directory -Force -Path "$HOME/.agents/skills" | Out-Null
git clone https://github.com/dakjdakd/PPT-Design-DNA.git "$HOME/.agents/skills/PPT-Design-DNA"
```

Keep the `SKILL.md`, `agents/`, `references/`, and `scripts/` paths together. If the skill does not appear, restart Codex. The [official Codex skills documentation](https://developers.openai.com/codex/skills/) describes discovery locations and invocation.

### Project-level installation

For a skill scoped to a project, run the appropriate commands from that project's root.

**macOS / Linux**

```bash
mkdir -p .agents/skills
git clone https://github.com/dakjdakd/PPT-Design-DNA.git .agents/skills/PPT-Design-DNA
```

**Windows PowerShell**

```powershell
New-Item -ItemType Directory -Force -Path .agents/skills | Out-Null
git clone https://github.com/dakjdakd/PPT-Design-DNA.git .agents/skills/PPT-Design-DNA
```

Choose one installation scope to avoid duplicate skill entries. These commands create a local Git checkout; decide separately how your team distributes or tracks project-local skills.

### Update an existing installation

Run this inside the installed skill directory:

```bash
git pull --ff-only
```

Review or commit local edits before updating. For an existing copy in a different supported location, use that copy rather than installing a duplicate.

## Start a presentation

Open a separate working project, invoke `$PPT-Design-DNA`, and choose a design source.

| Starting point | What to provide |
| --- | --- |
| Reference imagery | One or more images, identified as style references. |
| Design Discovery | A description of the intended visual direction. |
| Saved Design Profile | An explicitly selected profile or adapter from your working project's library. |
| Existing presentation | The deck, the changes you want, and the required content fidelity. |

The skill first confirms the design source and Design DNA. Presentation requirements follow after that confirmation. Respond to each visible option panel before generation proceeds.

### Extract from references

```text
Use $PPT-Design-DNA with these two reference images.
Blend their visual language into one Design DNA candidate.
Show the parameter panel and wait for confirmation.
```

Reference subjects are excluded from generated artwork unless you separately approve an image as slide content. You can supply product photos, diagrams, or other content images during the image-strategy step.

### Reuse a saved profile

```text
Use $PPT-Design-DNA.
Find the saved profile named "Editorial Research" in this project's profile index.
Show me the selected profile before collecting the presentation requirements.
```

Replace the example name with a profile you have actually saved. The skill does not ship a preset profile library.

### Adapt an existing presentation

```text
Use $PPT-Design-DNA to redesign the attached presentation.
Preserve the facts and overall order; split dense slides where needed.
Inspect the existing deck, then help me choose the visual direction.
```

Once the Design DNA is confirmed, specify the topic, audience, slide count, content source, output format, and image strategy through the requirement panels.

## Find the output

Generated files live in your working project:

```text
your-project/
└── outputs/
    └── <deck-slug>/
        ├── index.html
        ├── deck-manifest.json
        └── layout-guard-report.json
```

The report is produced by the layout guard. Content assets and exports are added only when needed. Open `index.html` in a browser; use arrow keys or space/enter to navigate.

Reusable styles are saved under `design-profiles/` only after explicit approval. Internal planning specs are retained only when requested. The [output contract](../references/output-contract.md) defines the full artifact layout.

## Run the layout guard

The host should run the guard before delivering an HTML deck. To run it manually, use absolute paths so the command works from any directory:

```bash
node /absolute/path/to/PPT-Design-DNA/scripts/ppt-layout-guard.js /absolute/path/to/your-project/outputs/my-deck/index.html --report /absolute/path/to/your-project/outputs/my-deck/layout-guard-report.json
```

**Windows PowerShell**

```powershell
node "C:/path/to/PPT-Design-DNA/scripts/ppt-layout-guard.js" "D:/your-project/outputs/my-deck/index.html" --report "D:/your-project/outputs/my-deck/layout-guard-report.json"
```

Replace the example paths with your installation and output paths. The report's parent directory must already exist. From the skill repository root, `scripts/ppt-layout-guard.js` can be used as the script path.

The validator inspects source-level rules such as layout budgets, declared zones, spacing, and headline constraints. A passing report does not establish pixel-perfect rendering or complete accessibility. See [validation boundaries](architecture.md#validation-boundaries).

## Troubleshooting

| Symptom | Next step |
| --- | --- |
| Skill is missing | Confirm that the installation contains `SKILL.md` in a supported skills location, then restart Codex. |
| Multiple entries appear | Check whether the skill is installed at both user and project scope. |
| Guard cannot find the script | Use the absolute path to your installed copy of `scripts/ppt-layout-guard.js`. |
| Guard reports layout failures | Ask the host to revise the Page Specs, layout budget, or composition, then rerun the guard. |
| Node.js is unavailable | Install Node.js to run the automated check. If the host uses manual source checks, it must disclose that the guard was not run. |
| PDF or PPTX export is unavailable | Keep the generated HTML and use an export-capable environment when needed. |
