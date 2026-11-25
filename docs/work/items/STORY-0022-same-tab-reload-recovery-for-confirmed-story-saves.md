---
id: STORY-0022
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0021
priority: 3
related:
- PRD-0004
- PRD-0005
- PRD-0042
- PRD-0006
- PRD-0052
- PRD-0007
- STORY-0003
---

# Same-tab reload recovery for confirmed Story saves

## Outcome

Same-tab reload recovery for confirmed Story saves.

[Legacy task: DEV-003I](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003i)

**Bounded delivery verified and merged:** [PR #19](https://github.com/Levelleor/lorebound/pull/19), confirmed on source main at `667bd51e508159c36fa501d7c3f5885b8edd9ae9`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003I.md)

The user's separate 2026-11-08 launch authorises auditing DEV-003, selecting one bounded child, implementation/tests, independent review and one primary PR. The user supplied verbal approval to finalise/merge PR #19 after its checked handoff, as recorded below. Base: confirmed [PR #18](https://github.com/Levelleor/lorebound/pull/18), merge `39d770c59392f514fb2e2b59499f21da10a59833`; its checked closure is satisfied.

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

[B3-D02](../../decisions/ADR-0015-idempotent-canonical-commit-attempts.md) requires unchanged-request recovery for uncertain canonical commits. [B3-D05](../../decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md) requires stale/epoch rejection and a fresh deliberate decision. [B3-D10](../../decisions/ADR-0023-pending-commit-failure-recovery.md) preserves the pending overlay while an outcome is unresolved. This child applies these existing safeguards to supported Story saves, not the unimplemented standalone manual-correction workflow.

[IDEA-0004](../../product/PRD-0005-retry-undo-and-alternative-continuations.md) separates provisional Retry from confirmed save recovery and committed Undo. [IDEA-0003](../../product/PRD-0004-direct-editable-prose-document.md), [IDEA-0041](../../product/PRD-0042-historical-edit-confirmation-and-bulk-truncation.md) and [B3-D04](../../decisions/ADR-0017-single-current-history-without-revisions.md) preserve the selected passage/choice and prohibit old-body archives. [IDEA-0005](../../product/PRD-0006-adventure-save-and-export-management.md), [IDEA-0051](../../product/PRD-0052-browser-persistent-story-database.md) and [B4-D09](../../decisions/ADR-0032-shared-latest-pending-draft-without-tab-locks.md) keep canonical history and latest shared drafts in Go-owned SQLite. The session journal holds only a confirmed in-flight transport request; it is never used as accepted history or as a competing draft slot. It contains no baseline/current-history snapshot, prior body, temporary edit history or unconfirmed candidate. It is removed once resolution and cleanup succeed.

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

[Primary PR #19](https://github.com/Levelleor/lorebound/pull/19) contains implementation, maintained tests, controls and this evidence record. [Application CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42505302655) checks exact corrected source head `dd826949c0f17649d47f20a09bc1a9c51de954b9`: repository checks, build/typecheck, TypeScript contracts, vet, real Go/SQLite, Linux Firefox/host/recovery and exact process restart. Focused local recovery tests and actual Firefox/Go/SQLite reload scenarios also PASS.

Independent `/root/dev003i_review` accepted-source, implementation, coverage, immutable recovery/lifecycle/draft ownership and UI review PASS at that exact head, with no remaining blocking findings. The reviewer found that a malformed stored edit choice could pass browser validation through string coercion; strict literal checks and six malformed-choice regressions now reject it before dispatch. The reviewer independently confirmed fresh full CI PASS and inspected all eight exact original application-CI recovery captures at the required widths/themes; UI and browser scenario source are unchanged by the fix. The [original capture run](https://github.com/Levelleor/lorebound/actions/runs/42497298974) owns those artifacts. [Complete readiness-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42505737117) checks `cdb0c0d6769fbf6f271ad877a0ec62e3c527c56c`; independent exact-head readiness review PASS. Closure changes are documentation only and reuse the passing application source; closure review and applicable final-head checks remain required. No extra local full-suite run or separate report is needed.

The checked [two-turn sample](http://127.0.0.1:8085/?adventure=4954b65e-7ff1-48d4-8c4c-e96064bcd155) served matching built assets and uses the separate persistent `.local/review/dev003i` library. The precise saved-draft → Review edit → Offline → Keep Later Turns → Online → same-tab reload → Recover save walkthrough passed locally, preserving both turns. [NOW](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/NOW.md) owns review/relaunch status; PR/chat owns the demo. Review/test hosts are stopped and the persistent review library is preserved. The user accepted the handoff and approved finalising/merging PR #19 on 2026-11-08; this does not claim personal execution of every automated scenario. Execution output stays in CI/temporary directories; no separate delivery/reconciliation report is created.

Generation remains simulated. Browser faults are intercepted around actual Go/SQLite transactions; unit storage/provider fixtures remain simulated. Same-origin session storage surviving a reload is the recovery boundary. Live providers, Windows/macOS packaging, full accessibility and tab/browser-crash recovery remain unverified. All 52 original IDEAs stay in production; thirteen partial / 39 without feature-level evidence / zero complete and three formal IDEA-0006 rows stay unchanged. DEV-003 remains PARTIAL. No next child starts through this work or closure approval.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
