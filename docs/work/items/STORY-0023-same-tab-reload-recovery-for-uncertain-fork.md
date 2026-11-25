---
id: STORY-0023
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0022
- STORY-0015
priority: 3
related:
- PRD-0004
- PRD-0012
- PRD-0007
- STORY-0003
---

# Same-tab reload recovery for uncertain Fork

## Outcome

Same-tab reload recovery for uncertain Fork.

[Legacy task: DEV-003J](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003j)

**Bounded delivery verified and merged:** [PR #20](https://github.com/Levelleor/lorebound/pull/20), confirmed on source main at `6f74134b6dd72228040939f9cfba22f12699ecd9`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003J.md)

The user's separate DEV-003 launch on 2026-11-08 authorises one bounded child, implementation/tests, independent review and one primary PR. The user supplied verbal approval to finalise/merge PR #20 after its checked handoff, as recorded below. Base: confirmed [PR #19](https://github.com/Levelleor/lorebound/pull/19) merge `667bd51e508159c36fa501d7c3f5885b8edd9ae9`, satisfying DEV-003I's approved conditional closure.

## Remaining scope and dependencies

Source inspection confirms Story Retry, independent Fork, composer/passage drafts, committed Undo, authored/generated passage edits, temporary passage history and same-tab Story Commit recovery. Fork's immutable request remained memory-only. Go already atomically fingerprints Fork requests, checks epoch before receipts and resolves original success before checking a subsequently changed source; the controller then reads current destination history through Go. This child extends that recovery path without a schema/wire change.

| Remaining parent obligation | Dependency / disposition |
| --- | --- |
| Uncertain Fork through source-tab reload | **Selected.** Persist the immutable request plus original turn order before dispatch; require deliberate recovery and reuse the destination/operation IDs. |
| Whole-passage split/merge/move/delete | Unselected; IDEA-0003 leaves identity/boundary decisions open. |
| Nonempty effects, corrections, derived/module reconstruction and full Fork state | Later; supported world/event/module contracts and implementation are prerequisites. |
| Other modes and draft targets | Later; Do/Say need character context, manual correction needs its own supported workflow. |
| Rename/delete/duplicate, backup/restore and complete library lifecycle | Later DEV-008; this child does not add them. |
| Spatial event/schema migration | **B9-D12 DEFERRED — NO WORK.** |

Accepted authority: [IDEA-0011](../../product/PRD-0012-manual-generation-branches.md), including the 2026-11-06 per-turn icon/separate-tab/default-title correction; [B4-D05](../../decisions/ADR-0028-independent-fork-from-current-adventure-prefix.md), [B3-D02](../../decisions/ADR-0015-idempotent-canonical-commit-attempts.md) and [B3-D05](../../decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md). Preserve the [visual interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md). The [eight stable IDEA-0011 rows](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003B.md#stable-idea-0011-inventory) retain their IDs; this increment extends R01/R04–R08's supported interaction, isolation and technical recovery coverage, without certifying whole rows.

## Observable child criteria

| ID | Accepted behavior / engineering boundary | Maintained coverage |
| --- | --- | --- |
| J01 | Before a Fork dispatch, store one immutable confirmed request and turn order per source adventure in this tab's session storage. Include no source prose, drafts, provisional output or receipt archive. Blocked initial pop-up sends no request. | `forkRecovery.ts`, `ForkController.submit`; unit/browser tests. |
| J02 | Reload never automatically resubmits. Recover fork reuses original payload/IDs/epoch/version and resolves exactly one independent destination, including after source advancement or removal of the boundary. | `ForkController.restore/submit`; recovery unit/browser tests. |
| J03 | Validate original receipt identity/boundary, then read/replay current destination. Later destination Undo/edits/continuation are not overwritten by the old prefix. Failed/inconsistent reads retain recovery. | `ForkController.submit`; existing Fork tests and recovery regressions. |
| J04 | Storage format/access/write/readback/cleanup failures block new Fork/story submissions. Never overwrite a different unresolved request. Disposal/in-flight reload retains the request. Clear only confirmed resolution or definitive rejection. | `SessionForkRecovery`; controller fault/validation tests and browser guards. |
| J05 | Definitive stale/epoch rejection clears the original attempt, refetches current source and requires a fresh icon decision. No automatic rebase. Preserve available/latest SQLite source input; destination receives no draft. | Existing Go receipt/epoch tests; recovery unit/browser scenarios. |
| J06 | Recovery remains reachable if the turn disappeared. Losing the popup handle on reload offers Open fork after confirmation, without another copy. Preserve accessible per-turn feedback when that turn exists, source URL and responsive Dark/Bright layout. | `StoryWorkspace.svelte`; Firefox recovery/keyboard/viewport checks and capture review. |

## Verification and limits

[Primary PR #20](https://github.com/Levelleor/lorebound/pull/20) contains this bounded child. [Full application CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42524823030) checks corrected source/test head `0cdb903762553b61ae5a568e46a7067ccc19ea6d`: repository, build/typecheck, TypeScript, vet, real Go/SQLite, Firefox/host/recovery and exact process restart. The recovery regressions live in `frontend/tests/forkRecovery.test.ts` and `frontend/scripts/check-fork-recovery.mjs`, integrated by `check-browser.mjs`; existing Fork unit/browser/SQLite tests retain the other technical gates.

Independent `/root/dev003j_review` accepted-source, exact-head implementation/coverage/controls, CI association and all eight Dark/Bright viewport capture reviews PASS, with no remaining blockers. Its receipt-boundary validation finding is fixed and regression-covered. Focused local Fork tests and the exact offline/online source-tab reload/Recover fork/Open fork walkthrough also PASS. The separate persistent review library and checked two-turn address are in [NOW](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/NOW.md); the checked preview served assets matching the reviewed application source.

[Complete readiness-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42525536975) checks exact `28f89fa4721add24c06bcb600121c2e457637e60`, including repository and full headless/browser/restart jobs. Independent exact-head readiness documentation review PASS; application/tooling remains identical to the reviewed passing source/test head. The agent-hosted preview is stopped and the persistent review library is preserved. User acceptance/closure authority is recorded below; CI alone does not establish acceptance.

Recovery is limited to the same source tab's session storage and origin/port. Tab closure, browser crash, cleared session data, creation recovery, live providers, other platforms and complete world/library behavior gain no guarantee. Generation and intercepted faults remain simulated; Firefox/Wails/Go/SQLite execution is real when run. Parent DEV-003 and IDEA-0011 stay PARTIAL; feature counts and three formal IDEA-0006 certifications stay unchanged. No original IDEA is archived and no next slice starts through closure approval.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
