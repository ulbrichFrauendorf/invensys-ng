# invensys-ng agent instructions

- Use the shared [standards adoption skill](../invensys.docs/.agents/skills/invensys-standards-adoption/SKILL.md) for standards alignment and verification.
- Read the shared [Angular patterns](../invensys.docs/.agents/skills/invensys-angular-patterns/SKILL.md), including [component structure and design](../invensys.docs/.agents/skills/invensys-angular-patterns/references/component-structure-and-design.md), for library components, UI-kit demos, templates, themes, and SCSS. Read the shared [environment patterns](../invensys.docs/.agents/skills/invensys-environment-patterns/SKILL.md) for relevant configuration and delivery work. Load only references relevant to the task.
- Follow the shared component rules: theme-owned colors and HTML typography, px lengths instead of em/rem, nested SCSS, lowercase hyphenated class names, and clear names and labels without redundant explanation messages. Useful source comments are permitted for reusable library components; omit routine comments in application/demo components.
- Prettier may handle only .scss, .ts, and .html files. Exclude JavaScript, JSON, Markdown, YAML, and all other file types from formatter commands and scripts.
- Keep reusable skill definitions in invensys.docs. Do not add or copy local skills into this repository. If local skills are discovered, ask the user before consolidating their guidance into the shared library.
- Do not create README files for individual components unless explicitly requested. Put usage examples in UI-kit/demo pages or existing shared documentation.
- Preserve existing work and public component contracts. Shared guidance does not authorize unrelated sibling edits, deployment, publishing, or global skill installation.
