---
type: development-evidence
status: verified-merged-scoped
created: "2026-11-04"
updated: "2026-11-06"
task: "DEV-002B"
---

# DEV-002B — Provisional and accepted Story turn

[PR #6](https://github.com/Levelleor/lorebound/pull/6) merged on 2026-11-05 as `f0c57b8b808308534cda1c3cb862262c813f5d11`. Checked head: `ec7537c982e4dc91fe2f50faa11e87c983825176`; reviewed and merged trees match. [Final-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42038112388).

Story input produces an explicitly simulated fixed continuation. Authored/generated passages remain provisional until explicit Accept; Stop/Discard never writes them. Go atomically saves separate structured passages, the ordered turn, empty effects, version and receipt. TypeScript prepares/replays; SQLite remains Go-owned. Schema/wire version 2 protects old blank-only clients and preserves existing blank adventures through a nonspatial upgrade.

## Requirement coverage

[Accepted-source audit](../requirements/DEV-002B.md) and [parent inventory](../requirements/DEV-002.md) retain the requirements and exclusions.

| Requirements | Tested scope | Source / executed evidence |
| --- | --- | --- |
| IDEA-0002/R01–R03; IDEA-0044/R01–R03/R10–R12 | Characterless Story, explicit simulated generation and acceptance, natural-prose provider input, no fictional veto or network | `coordinator.ts`; named lifecycle/unit cases; real `check-story.mjs` generation/discard/accept flow; R10–R12 are first-slice boundary subsets only |
| IDEA-0002/R04–R07 | Multiline docked Story composer, accessible send/Stop/Accept/Discard, truthful blue/green states, four-width Dark/Bright geometry/focus | `StoryWorkspace.svelte`, `appearance.css`; browser screenshots and assertions |
| IDEA-0040/R01–R03; R04 source subset | Distinct stable authored/generated passage IDs in one turn; structured current JSON, paragraph/hard-break roundtrip and safe text rendering | `story.ts`, `story.go`; structured-document unit cases; `TestStoryAtomicDurabilityAndOriginalReceipt`; browser exact reopen |
| IDEA-0039/R01/R03–R06; R02/R07 contract subset | Ordered current zero-effects history; pure reconstruction; provisional isolation; unknown core effects block writes and preserve readable prose | Pure replay/cancellation tests; `TestUnknownStoredEventsPreserveReadableHistoryAndBlockAppend`; simulated incompatible-read browser fixture |
| IDEA-0044/R04/R05/R07–R09 | Failure/cancellation, late replies, stale/epoch refetch, unchanged uncertain retry, coherent current state, refresh typing | Named coordinator unit cases; real lost-response and two-tab browser scenarios; corrected delayed-refresh test |
| IDEA-0051/R01–R08 | Adventure isolation, typed one-call append, real transaction/receipt rollback, scoped idempotency, stale races, coherent read, reopen | `internal/store/story_test.go` (9 new top-level functions); actual Firefox/Wails/Go/SQLite browser/restart |
| IDEA-0006/R04/R09/R11 and IDEA-0053/R01–R05/R10/R15 subsets | Baseline protection/no invented actor, host/storage authority, no provider prerequisite, tab/process persistence, browser restrictions and responsive controls | Existing blank tests retained; Story suite; actual Host/Origin/preflight/WebSocket checks; no full host lifecycle/platform claim |

Empty effects do not certify nonempty reduction/provenance: IDEA-0039/R02/R07 and event-association parts of IDEA-0040/R04 remain partial. Seven whole IDEAs were partial at this milestone; formal certification remained the three IDEA-0006 rows.

## Review and verification

Independent `requirements_audit` and `final_review` passed scoped source/runtime review. Corrected findings: idle refresh preserves newly typed input, Story receipts are adventure-scoped, uncertain saves say “Save unconfirmed”, and creation-receipt recovery refetches current history. Regression sources: [story tests](../../../frontend/tests/story.test.ts), [SQLite tests](../../../internal/store/story_test.go), [Story browser scenarios](../../../frontend/scripts/check-story.mjs).

Linked CI covers build/typecheck, TS, Go vet/real SQLite, actual Linux Firefox/Wails/Go acceptance/recovery/conflicting tabs and exact restart. Independent visual review covered responsive Dark/Bright states and keyboard acceptance. Fault interception is simulated over real storage; generation is a fixed fixture. Other modes, live providers, nonempty effects, durable drafts, editing/Undo/Fork, broader host lifecycle and Windows/macOS packaging were outside this child. B9-D12 remains deferred.

Historical reconciliation was merged in PR #7; future closure uses one primary PR. Execution logs and temporary captures belong in CI.
