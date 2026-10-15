# Contributing

Thank you for helping improve PPT-Design-DNA. Contributions can improve the design workflow, runtime specifications, layout checks, documentation, or visual case studies.

## Before making a change

Read the [architecture guide](docs/architecture.md) to locate the relevant part of the project. For a substantial behavior change, open an issue describing the user need and the proposed scope. Small documentation corrections can go directly to a pull request.

For bug reports, include the expected and actual behavior, the relevant host/runtime information, and a minimal reproduction. For layout failures, include the relevant HTML or Page Specs and guard output where possible. Remove private information before sharing artifacts.

## Local setup

```bash
git clone https://github.com/dakjdakd/PPT-Design-DNA.git
cd PPT-Design-DNA
```

Documentation work requires a text editor. The bundled layout validator uses Node.js built-ins; no package installation or build step is required. Testing the interactive design workflow also requires a compatible AI host.

## Repository conventions

| Area | Convention |
| --- | --- |
| Language | English is primary. Update `README.zh-CN.md` when changing corresponding README capabilities, setup, or navigation. |
| Names | Use descriptive lowercase English names with hyphens, such as `design-discovery.md`. |
| Stable paths | Preserve `SKILL.md`, `agents/openai.yaml`, and existing runtime paths unless a change explicitly requires migration. |
| Human documentation | Put setup, architecture, and case studies under `docs/`. |
| Runtime rules | Keep execution specifications in `references/` and link them from the appropriate entry point. |
| Formatting | Follow `.editorconfig`: UTF-8, LF line endings, a final newline, and two-space indentation. |
| Links | Use repository-relative links and descriptive image alternative text. |

Avoid duplicating detailed runtime rules in the READMEs. Summarize the capability and link to the source specification. Language-specific runtime examples and CJK typography constraints can remain in their applicable language.

Generated user presentations and profile libraries belong in a separate working project. Do not commit local outputs, temporary reports, or personal editor settings to this repository.

## Visual case studies

Group documentation media under `docs/media/<case-name>/`:

```text
docs/media/example-case/
├── reference-01.webp
├── slide-01.png
├── slide-02.png
├── comparison-en.png
└── comparison-zh-cn.png
```

Include only the assets that exist and help explain the case. Number included slides in presentation order. Use language suffixes only when there are localized graphics, and describe any retained non-English slide content in the case study.

Use media you have permission to share. Include source and attribution information when required by its license. Add the case to [Showcase](docs/showcase.md), and check both README variants if they reference it.

## Validate your changes

For documentation and file organization changes:

- Check every changed relative link and image path, including language-switch links.
- Check that English and Chinese README sections agree on capabilities and setup.
- Confirm that every renamed asset is linked from its new location and that no old paths remain.
- Run `git diff --check` and review the changed files with `git status --short`.

For changes to the layout validator, start with a syntax check:

```bash
node --check scripts/ppt-layout-guard.js
```

Then run the guard on relevant sample HTML using an output directory outside this repository:

```bash
node scripts/ppt-layout-guard.js /absolute/path/to/deck.html --report /absolute/path/to/layout-guard-report.json
```

The report's parent directory must exist. Include both a valid case and a case that demonstrates the intended failure when changing a check. A documentation-only change does not require generating a deck.

For runtime instruction changes, walk through the affected mode using a realistic request. Confirm that design confirmation, requirement collection, image intent, explicit profile saving, and output locations still behave as specified. Keep the test scoped to the changed behavior.

## Pull requests

Describe the problem, the resulting behavior, and how you validated the change. Include before/after images only when they help assess a visual change. Keep unrelated fixes and generated artifacts out of the diff.

Contributions are made under the project's [Apache License 2.0](LICENSE).
