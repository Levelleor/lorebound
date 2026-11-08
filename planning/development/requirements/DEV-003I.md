---
type: development-requirements
status: in-progress
created: "2026-11-08"
updated: "2026-11-08"
task: "DEV-003I"
parent: "DEV-003"
tags:
  - planning/development
---

# DEV-003I — Same-tab reload recovery for confirmed Story saves

The user's separate 2026-11-08 launch authorises auditing DEV-003, selecting one bounded child, implementation/tests, independent review and one primary PR. Named-PR verbal approval remains required before finalise/merge. Base: confirmed [PR #18](https://github.com/Levelleor/lorebound/pull/18), merge `39d770c59392f514fb2e2b59499f21da10a59833`; its checked closure is satisfied.

## Remaining requirements and dependencies

Actual source supports simulated Story Retry, independent Fork, latest composer/passage drafts, committed Undo, authored/generated passage edits and temporary passage-editor history. `StoryCoordinator.pending` was memory-only: reloading during an uncertain canonical save discarded the immutable request needed for receipt recovery. Go already checks epoch before receipts, fingerprints the complete request, returns the original result without reapplication, and rejects stale new operations. This child extends that existing recovery path without a database/wire change.

| Remaining parent obligation | Dependency / disposition |
| --- | --- |
| Confirmed Story save recovery through same-tab reload | **Selected.** A browser-session transport journal retains one immutable confirmed Commit request per adventure, written before dispatch. Explicit Recover save reuses its original ID, epoch, expected version and payload. |
| Whole-passage deletion/moving/splitting/merging | Unselected; IDEA-0003 leaves identity/boundary decisions open. Empty accepted documents remain invalid. |
| Nonempty effects, independent corrections, module/derived reconstruction | Supported typed contracts/reducers/provenance are unbuilt. Continue to fail closed. |
| Other modes, live providers, creation/Fork reload recovery and full library lifecycle | Later independently authorised work. Existing creation/Fork in-memory recovery is unchanged. |
| Recovery after tab closure, browser/session-data loss or changing origin/port | Outside the browser-session boundary. No crash-proof or cross-device guarantee, draft history, canonical Redo or candidate archive. |
| B9-D12 spatial event/schema migration | **DEFERRED — NO WORK.** |

## Accepted authority and ownership

[B3-D02](../../architecture/decisions/B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md) requires unchanged-request recovery for uncertain canonical commits. [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) requires stale/epoch rejection and a fresh deliberate decision. [B3-D10](../../architecture/decisions/B3-D10%20-%20Pending%20Commit%20Failure%20Recovery.md) preserves the pending overlay while an outcome is unresolved. This child applies these existing safeguards to supported Story saves, not the unimplemented standalone manual-correction workflow.

[IDEA-0004](../../production/Retry%20Undo%20and%20Alternative%20Continuations.md) separates provisional Retry from confirmed save recovery and committed Undo. [IDEA-0003](../../production/Direct%20Editable%20Prose%20Document.md), [IDEA-0041](../../production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md) and [B3-D04](../../architecture/decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) preserve the selected passage/choice and prohibit old-body archives. [IDEA-0005](../../production/Adventure%20Save%20and%20Export%20Management.md), [IDEA-0051](../../production/Browser-Persistent%20Story%20Database.md) and [B4-D09](../../architecture/decisions/B4-D09%20-%20Shared%20Latest%20Pending%20Draft%20Without%20Tab%20Locks.md) keep canonical history and latest shared drafts in Go-owned SQLite. The session journal holds only a confirmed in-flight transport request; it is never used as accepted history or as a competing draft slot. It contains no baseline/current-history snapshot, prior body, temporary edit history or unconfirmed candidate. It is removed once resolution and cleanup succeed.

## Observable criteria and maintained coverage

These child acceptance IDs qualify existing affected rows; they add no whole-IDEA or full-row certification to the feature ledger.

| Criterion | Existing affected requirements | Observable behavior / maintained coverage |
| --- | --- | --- |
| DEV-003I/AC01 | IDEA-0004/R05/R10; IDEA-0003/R03/R04; IDEA-0041/R05 | Append, Undo and authored/generated Keep/Truncate record the immutable confirmed request before Commit. Reload performs no canonical write; it blocks new actions and offers deliberate Recover save. `saveRecovery.ts`, coordinator; `saveRecovery.test.ts` all six save forms before/after dispatch; `check-save-recovery.mjs` actual Firefox/Go/SQLite reload cases. |
| DEV-003I/AC02 | Same rows | Retry uses exactly the original request. Receipt recovery reads current Go canon, validates the result/read, and never resurrects later-undone prose or reapplies an old truncation/Undo. Unit old-receipt/newer-canon cases and existing real-host receipt regressions remain applicable. |
| DEV-003I/AC03 | IDEA-0004/R05; IDEA-0003/R03; IDEA-0041/R05 | Stale/epoch rejection leaves canon unchanged, clears the resolved request, refetches current state and retains accessible request text for copying before a fresh decision. No rebase, regeneration or new operation ID during recovery. Unit stale/epoch cases. |
| DEV-003I/AC04 | IDEA-0004/R05/R12; IDEA-0003/R04 | Unavailable storage, malformed/unsupported/foreign records, conflicting replacement and failed cleanup block safely. A failed journal write sends no Commit. Cleanup failure keeps original recovery available; no new save can replace it. Unit validation/access/cleanup cases. |
| DEV-003I/AC05 | IDEA-0004/R03/R04/R06/R12; IDEA-0005/R01–R07 scoped draft rows | Unconfirmed candidates and edits stay outside the journal. Recovery does not flush stale reconstructed drafts over SQLite; successful recovery restores the latest saved composer draft. Journal cleanup and a further reload return ordinary editing. Unit exclusion cases and browser composer/passage isolation assertions; existing latest-value and process-restart draft checks remain applicable. |
| DEV-003I/AC06 | Existing recovery/overlay behavior above | Recovery uses the shared blocked composer, accessible retained text and keyboard activation. Dark/Bright 390/768/1024/1440 captures and overlay/no-overflow checks live in `check-save-recovery.mjs`, invoked by the existing full CI browser suite. |

## Verification and review

Implementation and focused verification are in progress. CI, independent review and the checked user handoff remain required; no merge or user acceptance is claimed. Execution output belongs in CI/temporary directories, with PR/run/revision links added here when available. No separate delivery/reconciliation report is needed.

Generation remains simulated. Browser faults are intercepted around actual Go/SQLite transactions; unit storage/provider fixtures remain simulated. Same-origin session storage surviving a reload is the recovery boundary. Live providers, Windows/macOS packaging, full accessibility and tab/browser-crash recovery remain unverified. All 52 original IDEAs stay in production; thirteen partial / 39 without feature-level evidence / zero complete and three formal IDEA-0006 rows stay unchanged. DEV-003 remains PARTIAL. No next child starts through this work or closure approval.
