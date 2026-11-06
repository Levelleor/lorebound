---
type: development-evidence
status: verified-merged-scoped
created: "2026-11-05"
updated: "2026-11-06"
task: "DEV-003A"
---

# DEV-003A — Replace provisional candidates on Retry

[PR #10](https://github.com/Levelleor/lorebound/pull/10) merged on 2026-11-05 as `9b30042dd0c3cedd8b4d22a02cdc7eb0d53b7145`. Checked head: `75384544377b4de982514549976619ad368b5f56`; reviewed and merged trees match. [Final-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42141159906).

Retry immediately invalidates the preceding unaccepted candidate. Repeated replacements remain provisional; failure/Stop retains available input and fences late results. Only the latest validated candidate may accept. Saving/uncertain receipt recovery remains a separate unchanged-request operation, with stale version/epoch rejection and authoritative refetch. The simulated generator may return identical prose; no variant archive or provider is added.

[Accepted-source inventory](../requirements/DEV-003.md) maps bounded IDEA-0004/R01–R05 to [coordinator/unit tests](../../../frontend/tests/story.test.ts) and [browser Retry checks](../../../frontend/scripts/check-story-retry.mjs). R02's nonempty-effects obligation and R06–R12 remain outside this child. IDEA-0004 became PARTIAL: eight partial ideas, zero complete, with three formal IDEA-0006 rows unchanged. Parent DEV-003 remains partial.

Independent reviewer `requirements_review` passed source/unit/runtime review with no scoped blocker. A mistaken B4-D08 reconstruction citation was corrected to B2-D03/B4-D01. Linked CI covers build/typecheck, TS, Go vet/SQLite regression, actual Linux Firefox/Wails/Go Retry/Stop, lost-response recovery, stale tabs and exact restart. Responsive Dark/Bright keyboard controls and scoped appearance were reviewed. Go storage/schema/wire behavior was unchanged.

Durable drafts, temporary editor undo, committed Undo/Fork/history editing, live providers, nonempty effects, Windows/macOS packaging and full visual/accessibility certification were outside this child. B9-D12 remains deferred. Historical reconciliation was merged in PR #11; future closure uses one primary PR.
