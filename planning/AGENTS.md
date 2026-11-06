# Planning vault rules

These are standing planning rules. Keep current task/progress information in [development/NOW](development/NOW.md), task scope in [TASKS](development/TASKS.md), coverage in [FEATURES](development/FEATURES.md) and significant decisions in [JOURNAL](development/JOURNAL.md). Do not append task-specific execution reports, feature-count snapshots or architecture approval histories to instruction files.

## Read first

Read repository [AGENTS](../AGENTS.md) and [Start Here](Start%20Here.md). Development follows the [development workflow](development/README.md) and [agent runbook](development/AGENT-RUNBOOK.md); start from NOW before selecting work. Application or architecture work also requires the [system overview](architecture/Lorebound%20-%20System%20Architecture%20Overview.md), relevant production IDEA and later accepted ADRs. UI work follows [design guidance](design/README.md).

The overview is a synthesis; specific later accepted decisions take precedence. Preserve original IDEA/ADR approvals and explicit deferrals. A planning summary does not grant execution, migration or merge authority.

## Promotion pipeline

| Stage | Meaning | Gate to advance |
| --- | --- | --- |
| `brainstorming/` | Exploration/session history | Extract independent possibilities; capture is not acceptance |
| `inbox/` | One unaccepted candidate per idea | Explicit human acceptance |
| `staging/` | Accepted direction, still being refined | Explicit implementation-readiness approval |
| `production/` | Approved, awaiting implementation | Implement and verify the accepted behavior |
| `specs/archive/` | The original implemented idea and provenance | Preserve stable ID/history and implementation references |
| `specs/*.md` | Current testable application requirements | Keep aligned with verified implementation |

Keep the same original IDEA note through promotion. Never replace it with a new document or reset its provenance. Partial delivery leaves the idea in production; a title or passing narrow test does not establish whole-IDEA completion. Never invent approval or backdate an acceptance.

## Creating and refining records

- Use the [brainstorm skill](../.agents/skills/brainstorm/SKILL.md) for ideation/resumption. Reuse a matching active session. Its append-only Session Log separates user ideas, AI possibilities, questions, insights, decisions and direction; keep Current Threads, Outputs and Resume Here current. Session completion is not idea approval.
- Capture one distinct possibility per Inbox note using the [candidate template](templates/Candidate%20Idea.md), with a unique stable `IDEA-` ID, source session and user/agent/mixed attribution. Unselected alternatives remain unaccepted.
- On explicit acceptance, move that same note into staging and record the real approver/date. Refine scope, alternatives, dependencies, edge cases and measurable acceptance criteria. Use templates as structural checklists, not implied feature decisions.
- On explicit readiness approval, move the note into production, retaining its ID/history. Implementation remains a separate gate governed by the development controls and user's authorised scope.
- After verified implementation, move the original to specs/archive with implementation references and update direct-child specs. Use separate `SPEC-`/requirement IDs and objectively testable statements. Keep outstanding functionality visible rather than claiming partial work completes the original.
- New changes to shipped behavior follow the idea/approval process; current specs remain truthful until implementation changes.

## Evidence and maintenance

CI owns generated execution output. Follow the [evidence policy](development/README.md#ci-and-evidence-policy): no committed build/test logs, screenshots, traces, environment dumps, copied output or source-hash tables. Use concise PR/run links, tested scope and material limits. Preserve source tests/fixtures, accepted decisions and requirement coverage. Do not create separate review, reconciliation or closure report files.

Use [single-primary-PR closure](development/README.md#single-pr-closure-and-verbal-approval): one verbal approval to finalise/merge the named PR; complete routine closure on that same branch; review and pass applicable final-head checks before merge. Pre-merge closure stays conditional; confirm actual provenance afterward in the PR/report. No routine follow-up PR or automatic next slice.

Before changing notes, inspect their existing contents, related records and relevant code. Keep user decisions distinct from agent suggestions. Significant lasting discoveries belong in JOURNAL; routine execution details belong in CI/PRs. Current summaries may be condensed when redundant, while preserving original approvals, requirement IDs, unresolved constraints and provenance.

## Markdown and Obsidian conventions

- Open `planning/` as the Obsidian vault; plain Markdown tooling must also work.
- Use YAML frontmatter with `type`, `status`, `created`, `updated`, `tags` and note-specific fields. Dates use `YYYY-MM-DD`.
- Assign stable unique human-readable IDEA IDs when candidates enter Inbox; never reuse them. Specs and requirements have their own stable IDs.
- Quote `"[[Obsidian Links]]"` inside YAML sequences. In prose use wikilinks or relative Markdown links appropriate to the reader/tooling.
- Templates are starting structures, not approvals or fictional canon.
- Check local links and required frontmatter when creating/moving notes. CI checks Markdown file targets and generated-output hygiene. Git does not track empty directories.
