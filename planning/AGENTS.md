# Planning vault rules

Read [Start Here.md](Start%20Here.md) and the repository [AGENTS.md](../AGENTS.md). This directory is an Obsidian vault and a collection of version-controlled Markdown files.

## Folder authority

| Location | Meaning | Can it direct implementation? |
| --- | --- | --- |
| `brainstorming/` | Active/completed exploratory sessions, rejected alternatives, unresolved questions | No |
| `staging/` | Human-accepted direction requiring refinement; status `staging` | No |
| `production/` | Refined, explicitly approved but unimplemented idea; status `production` | Yes, for planned work |
| `specs/archive/` | Original implemented idea notes moved from production, status `implemented` | Historical evidence, not current spec |
| `specs/*.md` | Current application behaviour and testable requirements; type `spec`, status `implemented` | Yes, source of current requirement truth |
| `templates/` | Blank note templates | No |

## Transitions

- **Brainstorm → staging:** user explicitly selects an idea. Create a distinct staging idea note containing only chosen content. Keep the brainstorm as the enduring session history, and cross-link both.
- **Staging → production:** review assumptions, behaviour, UX, dependencies, failures, alternatives, out-of-scope items and testable acceptance criteria. Obtain explicit human acceptance. Move/rename the same idea file into production; maintain `id` and provenance. Set `approved_by` and `approved_at` only from actual approval.
- **Production → implemented:** confirm code and tests/manual checks match accepted behaviour. Move the idea document into `specs/archive/`, set `status: implemented` and record `implemented_at`, `implementation` and `specs`. Write or update direct-child canonical spec files to reflect actual behaviour, with requirement IDs and evidence. If work only partially shipped, retain the idea in production with its outstanding scope; document only shipped behaviour in current specs, and avoid prematurely archiving the idea.
- If an implemented feature is being rethought, start a new brainstorm or new idea. Do not quietly alter the existing current spec until the changed behaviour is actually implemented.

## Note metadata

Shared keys: `type` (`brainstorm`/`idea`/`spec`), `status`, `created`, `updated`, and `tags`. Idea notes keep immutable `id`, `accepted_by`, `accepted_at`, `source_brainstorms`, and decision/approval history; production adds `approved_by`, `approved_at`; archived notes add `implemented_at`, `implementation`, and `specs`. Brainstorms track `mode`, `topic`, `goal`, `sources`, `outputs`; specs track `implements` and verification.

Use ISO date strings for timestamps/dates; Obsidian supports YAML properties, tags and wiki-link references. Use `[]` for unknown link arrays and `""` for unknown text, not fabricated values. Quoted YAML links look like `source_brainstorms: ["[[Crafting Brainstorm]]"]`. Place a concise, descriptive H1 in each note. When moving files, check/update Markdown links and verify Obsidian backlinks.

**Status vocabulary is intentionally narrow:** brainstorm `active` or `complete`; idea `staging`, `production`, or `implemented`; spec `implemented`. The location and the `status` must agree. Avoid a status called `approved`, which confuses the two approval gates.

## Session hygiene

Brainstorm Session Log is append-only, with prefixes `User idea`, `AI possibility`, `Question`, `Insight`, `Decision`, and `Direction`. Keep Current Threads, Decisions, Outputs, and Resume Here concise and up to date. `complete` means the user finished the exploration, not that an idea was promoted; exported brainstorming can remain `active`.

Never silently rewrite human decisions or promote speculative content. When sources conflict, show the disagreement and get a human decision. Requirements in specs should be observable or testable, have stable identifiers, and reference code/tests or an explicit manual check. Missing test coverage is a visible gap, not an invitation to claim it exists.
