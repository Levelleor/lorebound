---
id: STORY-0021
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0020
priority: 3
related:
- PRD-0005
- PRD-0004
- PRD-0006
- PRD-0042
- PRD-0007
- STORY-0003
---

# Temporary passage-editor Undo/Redo

## Outcome

Temporary passage-editor Undo/Redo.

[Legacy task: DEV-003H](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003h)

**Bounded delivery verified and merged:** [PR #18](https://github.com/Levelleor/lorebound/pull/18), confirmed on source main at `39d770c59392f514fb2e2b59499f21da10a59833`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003H.md)

The user's separate 2026-11-07 launch authorises auditing DEV-003, selecting one bounded child, implementation/tests, independent review and one primary PR. The user supplied verbal approval to finalise/merge PR #18 after the hands-on handoff, as recorded below. Base: confirmed [PR #17](https://github.com/Levelleor/lorebound/pull/17), merge `632ed6fb78b88a51e5135a516ff7ec7a1e35fdb1`; DEV-003G's conditional closure is satisfied.

## Remaining requirements and dependencies

Retry, independent Story-prefix Fork, shared composer/passage drafts, committed-turn Undo and accepted authored/generated passage editing are merged within supported simulated Story-only zero-effects scope. The existing editor, latest-only draft persistence, four explicit confirmation choices and version/epoch/receipt safeguards support temporary passage editing without a schema or wire change.

| Remaining parent obligation | Dependency / disposition |
| --- | --- |
| Bounded temporary passage-editor history | **Selected.** IDEA-0004/R06/R12 permits a finite in-memory lifetime/depth. Both accepted authored/generated targets use the existing inline editor; ordinary composer input and committed-turn Undo keep their existing behavior. |
| Whole-passage deletion, moving, splitting or merging | IDEA-0003 leaves boundary/identity rules open. Unselected; empty accepted documents remain invalid. |
| Nonempty world effects, independent corrections, module/derived reconstruction | Supported typed events/reducers/provenance are not yet implemented. Fail closed; empty effects establish no broader coverage. |
| Other modes, live providers, full library lifecycle and cross-reload uncertain-operation persistence | Later independently authorised work. No recovery guarantee for overwritten/unsaved drafts. |
| B9-D12 spatial event/schema migration | **DEFERRED — NO WORK.** |

## Accepted authority

[IDEA-0004](../../product/PRD-0005-retry-undo-and-alternative-continuations.md), Accepted direction “Temporary undo is bounded” and its 2026-10-18 clarification, explicitly separates finite temporary editing history from deterministic committed-turn Undo and replace-on-Retry. Its [existing R06/R12 inventory](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003.md#idea-0004-requirement-inventory) is reused; no new atomic row or full-IDEA certification is claimed. The user's later rejection of composer-only DEV-003D remains binding: no custom composer controls return.

[IDEA-0003](../../product/PRD-0004-direct-editable-prose-document.md) allows free paragraph editing and latest-only passage drafts; [IDEA-0005](../../product/PRD-0006-adventure-save-and-export-management.md) separates drafts from accepted story. [IDEA-0041](../../product/PRD-0042-historical-edit-confirmation-and-bulk-truncation.md) retains Keep Later Turns / Delete All After Point / Continue Editing / Discard. [B3-D04](../../decisions/ADR-0017-single-current-history-without-revisions.md) prohibits a durable accepted-prose revision archive. [B3-D02](../../decisions/ADR-0015-idempotent-canonical-commit-attempts.md), [B3-D05](../../decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md), [B3-D07](../../decisions/ADR-0020-shared-pending-commit-composer-overlay.md) and [B4-D09](../../decisions/ADR-0032-shared-latest-pending-draft-without-tab-locks.md) preserve immutable recovery, deliberate stale decisions, blocked composer and latest shared draft semantics. The [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) govern the compact inline controls.

## Observable criteria and maintained coverage

| Existing affected requirements | Acceptance for this child | Source / maintained coverage |
| --- | --- | --- |
| IDEA-0004/R06 | Undo edit/Redo edit traverses only the open passage draft. Retain at most 50 changes and 500,000 UTF-16 units across undo/current/redo; when the current value alone exceeds the budget, keep only it. Exhaustion cannot reach older candidates or accepted revisions. New typing removes redo. | `textHistory.ts`; `textHistory.test.ts` depth/size/redo/Unicode/selection cases; `edit.test.ts` DEV-003H authored/generated cases. |
| IDEA-0004/R06/R12 | Buttons and passage-focused Ctrl/⌘+Z, Ctrl/⌘+Shift+Z and Ctrl+Y operate on draft text, restore focus/selection, group an IME composition once and route browser history input through the same limits. | `StoryWorkspace.svelte`, coordinator edit methods; `check-edit-history.mjs` both sources, keyboard and selection, simulated composition/history-input events; responsive Dark/Bright captures. |
| IDEA-0003/R02; IDEA-0004/R06 | Only latest Undo/Redo text uses existing draft autosave. Equal-value restores preserve the session; a different shared value starts empty history. Reload/reopen starts empty histories from latest saved text. No older values/selections enter SQLite. | Coordinator `TextDraft` integration; DEV-003H coordinator restore/autosave tests; maintained browser reload assertion and existing exact process-restart draft checks. |
| IDEA-0004/R06/R12; IDEA-0041/R01/R04 | Continue Editing preserves temporary history; review disables editing/history. Canonical confirmation starts with empty history and keeps its immutable request; conflict/reconsider, discard/close, target switch, reload and disposal cannot revive the old session. | Coordinator guards/reset paths; DEV-003H conflict/uncertain/discard/reopen/dispose tests; existing generated/authored stale/lost-response browser scenarios. |
| IDEA-0003/R01/R04; IDEA-0041/R02/R03/R05 | Temporary operations never generate, accept prose, alter versions/world state or affect composer input. Existing Keep/Delete semantics, independent Fork, committed Undo, original-operation recovery and structural/epoch fencing still apply. | DEV-003H coordinator zero-write/zero-generation assertions; `check-story-edit.mjs` exact canonical comparisons plus existing Keep/Delete/stale/recovery/Fork/Undo checks. |

The coordinator owns one private session history; the UI submits edits/selections/actions and restores selection after rendering. History is released when confirmation begins, on successful discard/close and disposal. A saved draft restore replaces history only when its text differs. Temporary memory is never serialized by the host contract. One composition is one change; ordinary input events are separate steps within the budget.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
