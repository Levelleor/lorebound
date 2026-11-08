---
type: development-requirements
status: in-progress
created: "2026-11-08"
updated: "2026-11-08"
task: "DEV-003J"
parent: "DEV-003"
tags:
  - planning/development
---

# DEV-003J — Same-tab reload recovery for uncertain Fork

The user's separate DEV-003 launch on 2026-11-08 authorises one bounded child, implementation/tests, independent review and one primary PR. Named-PR verbal approval is required before finalise/merge. Base: confirmed [PR #19](https://github.com/Levelleor/lorebound/pull/19) merge `667bd51e508159c36fa501d7c3f5885b8edd9ae9`, satisfying DEV-003I's approved conditional closure.

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

Accepted authority: [IDEA-0011](../../production/Manual%20Generation%20Branches.md), including the 2026-11-06 per-turn icon/separate-tab/default-title correction; [B4-D05](../../architecture/decisions/B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md), [B3-D02](../../architecture/decisions/B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md) and [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md). Preserve the [visual interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md). The [eight stable IDEA-0011 rows](./DEV-003B.md#stable-idea-0011-inventory) retain their IDs; this increment extends R01/R04–R08's supported interaction, isolation and technical recovery coverage, without certifying whole rows.

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

Implementation and verification are in progress. CI owns build/typecheck, TypeScript contracts, real SQLite/host/browser and exact restart output. Independent source/coverage review is required; inspect affected CI captures. Record the primary PR and actual checked CI/review here when available. No verified-main claim before approved merge.

Recovery is limited to the same source tab's session storage and origin/port. Tab closure, browser crash, cleared session data, creation recovery, live providers, other platforms and complete world/library behavior gain no guarantee. Generation and intercepted faults remain simulated; Firefox/Wails/Go/SQLite execution is real when run. Parent DEV-003 and IDEA-0011 stay PARTIAL; feature counts and three formal IDEA-0006 certifications stay unchanged. No original IDEA is archived and no next slice starts through closure approval.
