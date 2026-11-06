---
type: development-guide
status: current
created: "2026-11-03"
updated: "2026-11-06"
tags:
  - planning/development
  - implementation
  - verification
---

# Lorebound Development Control Centre

This directory records scope, decisions, remaining work and links to delivered changes. [System architecture](../architecture/Lorebound%20-%20System%20Architecture%20Overview.md) describes the accepted application; [CI](../../.github/workflows/verify.yml) owns repeatable verification and execution output.

| File | Responsibility |
| --- | --- |
| [NOW](./NOW.md) | Short current handoff, active work and exactly one next development task |
| [TASKS](./TASKS.md) | Task scope, dependencies and acceptance criteria |
| [FEATURES](./FEATURES.md) | All 52 original IDEA notes and their completion status |
| [JOURNAL](./JOURNAL.md) | Significant decisions, discoveries and unresolved constraints |
| [AGENT-RUNBOOK](./AGENT-RUNBOOK.md) | Implementation, review and handoff rules |
| [requirements](./requirements/) | Accepted requirement IDs, coverage and remaining obligations |
| [evidence](./evidence/) | At most one concise delivery record per task, when needed beyond the PR |

Read these with repository [AGENTS](../../AGENTS.md), [planning rules](../AGENTS.md), relevant production IDEAs and later accepted ADRs. An approved IDEA is implementation-ready, not shipped. Execution of a later slice still needs separate user authority. B9-D12 spatial migration remains deferred.

## Development loop

1. Select the authorised task from NOW and confirm dependencies against code and merged PRs.
2. Define observable acceptance criteria and add maintainable automated regression checks where the change warrants them. Inventory only the affected requirements; do not rewrite all 52 ideas before coding.
3. Implement one cohesive slice. Use focused local checks for feedback or diagnosis; CI runs the repeatable build, unit, SQLite, real-browser, recovery and restart checks.
4. Update each control file only where its facts change. Put scope and requirement coverage in their owning record; link to them elsewhere instead of copying the same report.
5. Review the accepted requirements, diff, test adequacy and CI result for the reviewed revision. Reuse passing CI; a reviewer does not routinely rerun the full suite. Address missing coverage in the automated suite.
6. Hand the user a working preview URL or single launch command and a short task-specific demo with expected results. Address their feedback before named-PR merge approval. Close in the primary PR using the workflow below; work becomes verified-main truth only after confirmed merge.

## CI and evidence policy

**User direction, 2026-11-06:** generated build/test output belongs in CI, not planning or instruction documents. This supersedes earlier demands to preserve local logs, screenshots, command transcripts, source-hash tables and separate execution/reconciliation reports.

- GitHub Actions job logs are the execution record. Record a PR/run link, checked revision, brief result and material limitations; do not paste or commit their output. Inspect individual logs when investigating a failure, uncertainty or suspicious result, rather than transcribing every successful run.
- CI checks local Markdown file links and rejects generated verification files in planning. Application/tooling changes run the headless suite; documentation-only changes run repository checks. A manual workflow dispatch runs the full suite.
- Browser captures and failed-host diagnostics are short-lived CI artifacts, retained for seven days. Console build/unit/test output stays in the job log. Databases and user libraries are never uploaded. Artifact expiry does not require a repository copy or a new report; source tests and PR/run links retain the durable context.
- Keep tests, fixtures, accepted decisions, requirement coverage and meaningful limitations in Git. Do not commit screenshots from test runs, logs, traces, reports, recordings, copied environment dumps or ad hoc temporary probes. Deliberate design references and essential regression fixtures are source material, not execution output.
- Local verification is for focused development, reproducing a defect or a check CI cannot perform. Use a disposable library and temporary output outside the repository. Do not duplicate full local runs for each agent, documentation update or closure commit.
- For UI changes, review the relevant CI captures and automated responsive/accessibility checks. Passing geometry assertions alone do not establish visual fidelity. Manual checks require a short result and limitation in the PR, with any temporary captures in artifacts, not planning.
- Preserve truthful boundaries: simulated providers do not prove live-provider support; actual Linux Firefox/Go/SQLite tests do not prove Windows/macOS packaging. Missing applicable coverage stays NOT RUN or BLOCKED until resolved.

## Single-PR closure and verbal approval

1. Complete implementation, applicable CI and independent source/coverage review in one primary PR. Prepare a concrete scope/result/limitations summary and [hands-on review handoff](./AGENT-RUNBOOK.md#user-review-before-merge): running URL or one launch command, starting state, demo steps and expected results. Give the user a chance to try it and address feedback. CI does not replace user acceptance.
2. Obtain one clear verbal approval in chat to **finalise and merge that named PR**. Implementation authority alone is not merge authority.
3. Finish routine reconciliation on the same branch: update NOW/TASKS/FEATURES/JOURNAL and affected requirements only as needed, plus the PR description. Keep any prepared closure explicitly conditional on confirmed merge. Routine closure within the approved scope needs no second approval; material scope changes do.
4. Review the closure additions and pass the checks applicable to the final head. Reuse the reviewed application CI when only documentation changes; final-head repository checks still run. Source/tooling changes require fresh application CI.
5. Merge that same PR, confirm its actual merge/head/tree provenance, sync local main and record the actual merge SHA and CI in the PR/final report. No routine post-merge repository write, separate reconciliation PR or automatic next slice follows.

Earlier reconciliation PR pairs remain historical. Do not repeat that workflow or invent a future merge SHA. Full-IDEA archival still requires all its accepted requirements to be implemented and verified.

## Status and traceability

Accepted IDEA/ADR → stable requirement ID → task → source/test → PR/CI → reviewed merge is the traceability chain. Use test-file/symbol references for coverage and PR/run links for execution; raw artifacts are not a second specification.

| Status | Meaning |
| --- | --- |
| NOT STARTED | No corresponding implementation |
| IN PROGRESS | Active authorised branch work |
| IMPLEMENTED / UNVERIFIED | Code exists; applicable verification or review is incomplete |
| PARTIAL | A bounded part works; the complete IDEA or parent remains unfinished |
| BLOCKED | A specific unmet dependency or required check prevents progress |
| VERIFIED | All in-scope requirements are checked, reviewed and merged |
| DEFERRED | Explicitly postponed by the user |

Results use PASS, FAIL, NOT RUN, BLOCKED or N/A with a reason. Empty world-effect arrays do not certify nonempty reducers or provenance. Preserve current-only history, TypeScript domain authority, Go-owned SQLite atomicity, the shared pending composer, and the accepted map restrictions.

Record significant findings and changed scope in JOURNAL; preserve original accepted IDEA/ADR provenance. Routine commands, retries, agent interruptions and passing build inventories belong in the PR/CI, unless they explain an unresolved constraint or lasting decision.
