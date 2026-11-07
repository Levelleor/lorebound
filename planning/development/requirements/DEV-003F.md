---
type: development-requirements
status: in-progress
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003F"
parent: "DEV-003"
tags:
  - planning/development
---

# DEV-003F — Accepted generated-passage editing

The user's 2026-11-06 launch explicitly authorises auditing DEV-003, selecting and implementing one bounded child, testing, independent review and one primary PR. Finalise/merge requires a subsequent verbal approval of that named PR. Base: confirmed [PR #15](https://github.com/Levelleor/lorebound/pull/15), merge `987310abf8ad39d43144c53ae77c78da937bff3b`.

## Remaining requirements and dependencies

[Parent inventory](./DEV-003.md) retains the original IDEA-0004 IDs. Retry, independent zero-effects Fork, composer drafts and committed-turn Undo are merged. Remaining direct/historical editing needs passage-scoped drafts, current-body replacement, explicit historical choice, atomic truncation and safe recovery. Existing stable passage IDs, structured documents, monotonic concurrency versions, coherent reads and idempotent Commit receipts satisfy those dependencies. No new database format is needed.

This child selects **generated passages**, the last passage in each existing two-passage Story turn. This gives Delete All After Point an exact boundary: preserve the edited turn and delete all subsequent turns/passages. Authored-passage editing and cross-passage movement/splitting/merging need their own boundary treatment and remain later. Nonempty events, standalone corrections, derived memories/module state, other modes and live providers remain unsupported. B9-D12 remains **DEFERRED — NO WORK**.

## Accepted sources

- [IDEA-0003](../../production/Direct%20Editable%20Prose%20Document.md): direct inline paragraph edits, stable logical passage identity, latest shared noncanonical draft per target and deliberate confirmation.
- [IDEA-0041](../../production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md): Keep Later Turns / Delete All After Point / Continue Editing / Discard; player-owned continuity and no AI repair.
- [IDEA-0005](../../production/Adventure%20Save%20and%20Export%20Management.md), [IDEA-0040](../../production/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md), [IDEA-0042](../../production/Snapshots%20and%20Incremental%20State%20Rebuild.md): draft/canonical distinction, structured identity and coherent reconstruction. Existing [IDEA-0005 inventory](./DEV-003C.md) and IDEA-0042/R01 remain partial.
- [B3-D04](../../architecture/decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) supersedes older revision requirements: overwrite current body, preserve existing events on Keep, no old-body archive or canonical Redo.
- [B3-D02](../../architecture/decisions/B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md): immutable operation recovery, expected-version/epoch fencing, fresh decision after conflict.
- [B3-D07](../../architecture/decisions/B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md): shared blocking composer overlay with workflow-specific decisions; no second commit bar.
- [B4-D02](../../architecture/decisions/B4-D02%20-%20Undo%20and%20Truncation%20Boundaries%20for%20Independent%20Corrections.md), [B4-D06](../../architecture/decisions/B4-D06%20-%20Preflight%20Structural%20Integrity%20of%20Current%20History%20Mutations.md), [B6-D01](../../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md): explicit suffix, deterministic technical preflight, no fictional-continuity veto. Zero effects do not certify nonempty replay.
- [B4-D09](../../architecture/decisions/B4-D09%20-%20Shared%20Latest%20Pending%20Draft%20Without%20Tab%20Locks.md): latest shared draft, no tab locks/branches. Prose drafts follow IDEA-0003; stale manual world-correction rules are not extended to discard prose silently.
- [Visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md): inline gold edit marker, truthful pending/saved labels, accessible controls and shared composer.

## Affected atomic inventory

These stable rows inventory affected clauses, not whole-IDEA completion. Broader requirements remain visible in the original production notes.

| ID | Observable accepted behavior | Bounded disposition |
| --- | --- | --- |
| IDEA-0003/R01 | Edit/insert/remove/reorder paragraphs within a logical passage inline; preserve structured body, identity and source. | Generated Story passages; nonempty document limits retained. Whole-passage deletion and authored targets later. |
| IDEA-0003/R02 | Each logical editing target has one latest shared noncanonical autosaved draft, separate from composer and other targets. | Debounced passage slots, empty draft versus absent slot, reload/focus restore, failure/retry; overwritten/unsaved values not guaranteed. |
| IDEA-0003/R03 | Draft typing does not mutate canon or trigger AI/replay; deliberate confirmation replaces current body atomically. | Shared composer review/confirmation, stable IDs, no revision archive. |
| IDEA-0003/R04 | Confirmed edits preserve provenance and deterministic state integrity under expected-version/epoch checks. | Complete supported zero-effects history only; nonempty provenance remains later. |
| IDEA-0041/R01 | Historical editing is draft-first; before saving offer Keep Later Turns, Delete All After Point, Continue Editing and Discard. | All four actions for generated passages, including current head. |
| IDEA-0041/R02 | Keep changes only the chosen body and retains all later prose/events despite fictional discontinuity. | Exact zero-effects history comparison; no AI or downstream repair. |
| IDEA-0041/R03 | Delete commits the edited point and removes its complete later suffix atomically. | Later whole Story turns; source turn/baseline survive, version increases, subsequent continuation/Fork/Undo work. |
| IDEA-0041/R04 | Continue Editing and Discard leave accepted history unchanged; defer reconstruction until a canonical decision. | Accessible keyboard/focus and explicit draft discard; no implicit acceptance. |
| IDEA-0041/R05 | Failed/stale changes preserve accepted history; reconstruct only surviving history after successful confirmation. | Atomic rollback, stale/epoch/isolation guards, immutable receipt recovery including newer canon and restart. Nonempty events later. |

IDEA-0004/R11 gains bounded historical-edit coverage; R06's native temporary textarea history remains transient, with no custom composer history. No original IDEA archival or new full-row certification follows.

## Verification and review

Implementation in progress on `feat/dev-003f-generated-passage-edit`. Go transaction/draft tests, TypeScript coordinator tests and real Firefox/Wails/SQLite browser/restart coverage will own repeatable checks in existing CI. UI captures remain temporary CI artifacts. Independent review and named-PR user acceptance are pending. No passing result or verified-main claim is made yet.
