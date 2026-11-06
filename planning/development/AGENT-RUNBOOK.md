---
type: development-agent-runbook
status: current
created: "2026-11-03"
updated: "2026-11-06"
tags:
  - planning/development
  - agents
  - verification
---

# Lorebound — Implementation and Review Runbook

## Preflight

Read [NOW](./NOW.md), the relevant [TASKS](./TASKS.md) entry, affected [FEATURES](./FEATURES.md) rows, recent [JOURNAL](./JOURNAL.md) decisions and the [development workflow](./README.md). Before application changes or architectural review, read the [system overview](../architecture/Lorebound%20-%20System%20Architecture%20Overview.md), relevant original production IDEAs and later ADRs. For UI work, read the [approved design](../design/README.md). Inspect actual source and tests.

Use the required personal-development-style skill. Confirm the user's execution authority and one bounded task; production promotion or closure of another child does not launch it. State scope and material uncertainties briefly before working.

## Implementation

1. Work on the authorised slice, using a feature branch for a reviewed PR. Commit/push/open a PR only when requested or already authorised in the session.
2. Add or refine acceptance criteria and regression tests for material behavior. Preserve stable requirement IDs and distinguish a bounded slice from whole-IDEA completion.
3. Run focused local checks when they help implement or debug. Put repeatable build, unit, SQLite, browser, failure/recovery and restart checks in [CI](../../.github/workflows/verify.yml). Add missing automation there instead of repeating an ad hoc manual test on each launch.
4. Keep NOW short. Update TASKS for task scope, FEATURES for feature status, requirements for coverage, and JOURNAL for durable decisions or significant unresolved findings. Link to the owning record; do not duplicate test inventories across these files.
5. In the PR, give a short scope/result summary, relevant requirement/test references, CI link and checked revision, review disposition and material limitations. At most one short task delivery record belongs in `evidence/` when the PR alone is insufficient. No separate review, publication, closure or reconciliation writeups in planning.
6. Provide the [user review handoff](#user-review-before-merge) before requesting finalise/merge approval. Address feedback within the authorised scope.
7. Follow [single-PR closure](./README.md#single-pr-closure-and-verbal-approval): one verbal approval to finalise/merge the named PR, same-branch closure updates, review and applicable final-head checks, merge/provenance confirmation, then the final report. Do not start another slice automatically.

**Generated output policy:** never commit build/test logs, screenshots, traces, environment dumps, command transcripts, copied CI output or source-hash tables to planning/instructions. Use CI job logs and seven-day browser/failed-host artifacts. Local output goes to a temporary directory. Preserve source tests, fixtures, requirement coverage, decisions and PR/run links. See the [full evidence policy](./README.md#ci-and-evidence-policy).

## Independent review

Work from accepted requirements and the diff. Inspect correctness, omitted behavior, test adequacy, ownership boundaries, version/epoch/idempotency/recovery paths and relevant security. A passing test written by the implementer is not a complete specification.

Reuse passing CI for the reviewed revision and inspect relevant artifacts for UI fidelity. Do not automatically rerun every suite locally or require a second browser run by another agent. Reproduce only a specific concern or a check unavailable in CI, and automate a useful regression. When the application/tooling changes after review, require fresh applicable CI; when only documentation changes, review that delta and its repository checks.

Record sign-off and remaining findings in the PR or the single task record. Review closure additions for truthful merge conditions, scope/counts and the next-task boundary. Do not generate another report file merely to state that the preceding report was reviewed.

CI runs the actual Linux Firefox → Wails → Go → SQLite path with disposable data. Unit provider/storage fixtures remain simulated. Neither establishes live-provider behavior, Windows/macOS packaging or full accessibility certification. For visual changes, inspect captures at the affected sizes/states; geometry checks alone do not establish the approved appearance.

## User review before merge

When work is ready, hand it to the user for hands-on acceptance before requesting merge approval:

- Provide a running URL after checking that the current revision is served and reachable. State that it is a local preview and how to stop/relaunch it. If leaving a server running is impractical, provide one copyable command from [development setup](../../docs/development.md) that builds and launches the current checkout.
- Use a separate review library by default, identify whether it persists between launches, and never silently switch to the user's regular library or destroy review data. Rebuild/restart after relevant changes so an old binary is not presented as the current work.
- Give a short task-specific walkthrough: starting state, actions and visible expected results. Cover the changed behavior and a relevant recovery/edge case where useful; label simulated functionality. Keep the walkthrough in the chat/PR, not another report file.
- For infrastructure/documentation-only work, explain what changed and what the application demo can actually show; do not invent a visible product change. Still provide the launch command so the user can explore the current app.
- Keep NOW at ready/awaiting user review until feedback arrives. Fix reported issues and refresh the preview/demo as needed. A running process, automated PASS or silence does not establish the user's acceptance.

The user's clear approval to finalise and merge the named PR after this review is the existing single closure approval; do not add a second ritual approval. If they explicitly waive trying the app, record that briefly in the PR. Publication authority remains separate, and this handoff does not itself authorise a commit, push or merge.

## Completion and handoff

A task is VERIFIED & MERGED when its accepted scope is implemented, applicable automated checks and source/coverage review pass, no blocking finding remains, the user has approved finalising/merging its named primary PR, and that PR has actually merged. Prepared closure stays conditional until merge. A complete IDEA additionally needs all its accepted requirements satisfied; keep partial ideas in production.

Give a concise final report covering:

- What changed and why; task/PR and actual merge state.
- Checks used, CI link/revision and review result; material limits or missing checks.
- Review URL or single launch command, with the task's short demo flow and user-review disposition.
- Remaining blocker or one next action, stating any execution/merge approval still required.

Do not reproduce command output, test counts, full gate matrices or tracker checklists in the handoff. Actual merge SHA belongs in the merged PR/report. Report local-only or uncommitted work truthfully.

Use independent review for bounded tasks; a separate reviewer may be a human or agent. Coordinate any authorised parallel work by file ownership. Keep one next task in NOW, preserve later accepted ADR precedence, and leave B9-D12 spatial migrations deferred.
