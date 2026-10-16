# Planning vault rules

Read [Start Here.md](Start%20Here.md) and the repository [AGENTS.md](../AGENTS.md). This directory is an Obsidian vault and a collection of version-controlled Markdown files.

## Folder authority

| Location | Meaning | Can it direct implementation? |
| --- | --- | --- |
| `brainstorming/` | Exploratory sessions that may generate many different ideas | No |
| `inbox/` | One note per distinct, unaccepted candidate; status `candidate` or `rejected` | No |
| `staging/` | Human-accepted direction requiring refinement; status `staging` | No |
| `production/` | Refined, explicitly approved but unimplemented idea; status `production` | Yes, for planned work |
| `specs/archive/` | Original implemented idea notes moved from production, status `implemented` | Historical evidence, not current spec |
| `specs/*.md` | Current application behaviour and testable requirements; type `spec`, status `implemented` | Yes, source of current requirement truth |
| `templates/` | Blank note templates | No |

## Transitions

- **Brainstorm → inbox:** when asked to capture, split or extract possibilities, create a separate note for each independent candidate from [[Candidate Idea]] (see `templates/Candidate Idea.md`). Give each a unique immutable `IDEA-` ID, mark its origin (`user`, `agent`, or `mixed`), link the originating brainstorm and set `status: candidate`. Keep speculative details explicitly speculative. **This is not an approval gate.** Do not force every brainstorm thought into Inbox or silently generate a flood of notes.
- **Inbox → staging:** only after explicit human acceptance, **move the existing candidate file**, keeping its ID, useful details and provenance, to `staging/`; set `status: staging`, record `accepted_at` and `accepted_by` if known, and distinguish accepted scope from alternatives. Other candidates remain in Inbox. A candidate may be refined in Inbox without being accepted.
- **Rejecting a candidate:** keep its history and source links in Inbox, set `status: rejected` with the recorded decision and (if known) rejection date/reason; do not delete or re-open it silently.
- **Staging → production:** review assumptions, behaviour, UX, dependencies, failures, alternatives, out-of-scope items and testable acceptance criteria. Obtain explicit human acceptance. Move/rename the same idea file into production; maintain `id` and provenance. Set `approved_by` and `approved_at` only from actual approval.
- **Production → implemented:** confirm code and tests/manual checks match accepted behaviour. Move the idea document into `specs/archive/`, set `status: implemented` and record `implemented_at`, `implementation` and `specs`. Write or update direct-child canonical spec files to reflect actual behaviour, with requirement IDs and evidence. If work only partially shipped, retain the idea in production with its outstanding scope; document only shipped behaviour in current specs, and avoid prematurely archiving the idea.
- If an implemented feature is being rethought, start a new brainstorm or new idea. Do not quietly alter the existing current spec until the changed behaviour is actually implemented.

## Note metadata

Shared keys: `type` (`brainstorm`/`idea`/`spec`), `status`, `created`, `updated`, and `tags`. An idea receives immutable `id`, `origin` (`user`/`agent`/`mixed`), `source_brainstorms` and review history in Inbox. Add `accepted_by` and `accepted_at` **only upon human acceptance** into staging; production adds `approved_by` and `approved_at`; archived notes add `implemented_at`, `implementation`, and `specs`. Brainstorms track `mode`, `topic`, `goal`, `sources`, `outputs`; specs track `implements` and verification.

Use ISO date strings for timestamps/dates; Obsidian supports YAML properties, tags and wiki-link references. Use `[]` for unknown link arrays and `""` for unknown text, not fabricated values. Quoted YAML links look like `source_brainstorms: ["[[Crafting Brainstorm]]"]`. Place a concise, descriptive H1 in each note. When moving files, check/update Markdown links and verify Obsidian backlinks.

**Status vocabulary is intentionally narrow:** brainstorm `active` or `complete`; idea `candidate` or `rejected` (Inbox), `staging`, `production`, or `implemented`; spec `implemented`. The location and the `status` must agree. Avoid a status called `approved`, which confuses the two approval gates.

## Session hygiene

Brainstorm Session Log is append-only, with prefixes `User idea`, `AI possibility`, `Question`, `Insight`, `Decision`, and `Direction`. Keep Current Threads, Decisions, Outputs, and Resume Here concise and up to date. Outputs link **Inbox candidates**, whether or not they were later accepted. `complete` means the user finished the exploration, not that any candidate was accepted; brainstorms can remain `active` after extraction.

Never silently rewrite human decisions or promote speculative content. When sources conflict, show the disagreement and get a human decision. Requirements in specs should be observable or testable, have stable identifiers, and reference code/tests or an explicit manual check. Missing test coverage is a visible gap, not an invitation to claim it exists.
