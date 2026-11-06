# Lorebound agent instructions

## Read the current sources

These are standing rules, not a development-status snapshot. Do not add task IDs, branch names, progress counts or dated execution reports here.

- For development, start with [planning/development/NOW.md](planning/development/NOW.md), then the relevant [task](planning/development/TASKS.md), [feature coverage](planning/development/FEATURES.md), [journal decisions](planning/development/JOURNAL.md) and [runbook](planning/development/AGENT-RUNBOOK.md). NOW owns the current focus and exactly one next task.
- Before application development or architectural review, read the [System Architecture Overview](planning/architecture/Lorebound%20-%20System%20Architecture%20Overview.md), relevant original production IDEA notes and later accepted ADRs. Specific later user-approved decisions govern earlier prose; the overview is navigation, not new feature authority.
- For planning work, read [planning/AGENTS.md](planning/AGENTS.md) and [planning/Start Here.md](planning/Start%20Here.md).
- For exploratory ideation, use the [brainstorm skill](.agents/skills/brainstorm/SKILL.md). Capturing a candidate is not acceptance.
- For UI work, read [design guidance](planning/design/README.md), the [visual contract](planning/design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](planning/design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md). Accepted behavior still governs styling.

Inspect actual code before claiming a feature exists. Production notes are an implementation queue, not shipped specifications. Respect explicit deferrals and separate execution authority; closing one task never authorises the next slice.

## Required development style

Use the **personal-development-style** skill for implementation, refactoring, architecture and code review. Read `/home/alex/.codex/skills/personal-development-style/SKILL.md` and relevant references; discover it by name if moved.

**Project priority override:** its style preferences take precedence over conflicting repository conventions for new and directly affected code. Correctness, security/reliability, platform constraints, accepted contracts and required verification remain binding. Align conflicting formatting/lint settings within the authorised scope while preserving semantic checks; do not reformat the repository wholesale.

Prefer straightforward readable code, explicit ownership, pragmatic composition, early returns, minimal useful comments and safe concurrency for independent work. TypeScript/JavaScript uses 2 spaces, Allman block braces, semicolons, single quotes and no optional trailing commas, respecting framework syntax. Go remains idiomatic and gofmt-formatted.

## Verification and repository hygiene

Follow the [CI/evidence policy](planning/development/README.md#ci-and-evidence-policy).

- Put repeatable build, unit, integration, browser and recovery checks in CI. Reuse passing CI for the reviewed revision; local runs are focused feedback, diagnosis or checks CI cannot perform. Reviewers inspect requirements, code, coverage and relevant artifacts without routinely repeating the full suite.
- Keep generated build/test logs, screenshots, traces, reports, command transcripts, environment dumps and source-hash tables out of planning and instruction documents. CI job logs own execution output; short-lived artifacts hold necessary captures/diagnostics. Local output belongs in temporary directories.
- Preserve maintainable tests/fixtures, accepted decisions, requirement coverage, meaningful limitations and concise PR/run links. At most one short task delivery record is needed beyond the PR. Do not create separate review/publication/reconciliation/closure report files.
- Update control files only where their facts change and link to the owning record rather than copying test inventories. Keep NOW concise and current.
- Distinguish simulated checks, real integration, manual review and missing coverage. Never claim checks passed without execution evidence or treat an unmerged PR as verified main.
- Before requesting merge approval, provide a verified running review URL or one command to launch the current checkout, plus a short demo flow with actions, expected results and relevant limits. Give the user an opportunity to try the app and address feedback; CI success is not user acceptance. Follow the [review handoff](planning/development/AGENT-RUNBOOK.md#user-review-before-merge).

## One primary PR and verbal closure approval

Implementation, review evidence, reconciliation and closure belong in the **same primary PR**. After implementation, applicable checks and review, obtain one clear verbal approval in chat to **finalise and merge that named PR**. Then complete routine closure on its existing branch, review the additions, pass checks applicable to the final head and merge that same PR. Routine reconciliation within approved scope needs no second approval; material scope changes do.

Prepare closure as explicitly conditional on confirmed merge. After merge, confirm provenance, sync local main and record the actual merge SHA/CI in the PR and final report. No routine follow-up repository write or reconciliation PR is needed. Do not start the next slice through closure approval. See the [closure workflow](planning/development/README.md#single-pr-closure-and-verbal-approval).

Commit, push or open PRs only when requested or already authorised in the session. Never infer merge approval from implementation or publication authority.

## Planning and truth boundaries

```text
brainstorming → inbox (candidate) → staging (accepted) → production (implementation-ready)
                                                        ↓ implement and verify
                                       specs/archive (original idea) + specs (current requirements)
```

1. Exploration and capture are not approval. Attribute user choices and agent suggestions separately.
2. Inbox → staging and staging → production need explicit human acceptance/readiness approval. Never invent an approver or infer approval from document detail.
3. Preserve one original note per idea, its stable ID, history, provenance and links through promotion. Brainstorm session records remain in brainstorming.
4. Archive an idea and update current specs only when the relevant implementation exists and has been verified. Partial delivery leaves the original idea in production with outstanding scope visible.
5. Current specs use stable, objectively testable requirement IDs and source/test/PR references. Keep planned or unverified behavior out of current specs.
6. Before changing project notes, inspect the note, related records and relevant code. Preserve original approvals/ADRs; correct current summaries without copying their full histories into instructions.

Planning notes are plain Markdown in an Obsidian-compatible vault. Use YAML frontmatter, ISO dates, stable IDs and quoted wikilinks in YAML. Follow the [vault rules](planning/AGENTS.md) and templates. Check links/frontmatter after moving notes; Git does not track empty directories.
