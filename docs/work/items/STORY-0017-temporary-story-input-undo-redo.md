---
id: STORY-0017
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0016
priority: 3
related:
- PRD-0005
- PRD-0006
- PRD-0004
- PRD-0007
- STORY-0003
---

# Temporary Story input Undo/Redo

## Outcome

Temporary Story input Undo/Redo.

[Legacy task: DEV-003D](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003d)

**Bounded delivery verified and merged:** [PR #14](https://github.com/Levelleor/lorebound/pull/14), confirmed on source main at `e31cad1d60e4d99cc3d45592b03fbca954524e61`. Broader IDEA delivery is not inferred.

Historical behavior: the custom composer-only controls were removed by [STORY-0018](STORY-0018-committed-story-turn-undo-and-composer-correction.md); this is not a description of current input behavior.

## Acceptance criteria

bounded in-memory Story input edits, named buttons/keyboard controls and selection recovery, latest-draft autosave, empty histories on reload/generation/acceptance/canonical replacement/disposal, and no canonical mutations or candidate recovery. Committed Undo, passage editing and B9-D12 remain unselected/deferred. Independent source/coverage review and readiness CI PASS. The user authorised independent subagent review and finalisation after the named-PR handoff. Closure becomes effective only after review, applicable final-head checks and confirmed merge of this same PR. No next child starts.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003D.md)

The user's 2026-11-06 launch authorises auditing DEV-003, selecting and implementing one bounded child, and publishing one primary PR. It does not authorise merge before the named-PR verbal approval. This child adds bounded, ephemeral Undo/Redo to **unfinished Story composer input**. Implementation is published in [primary PR #14](https://github.com/Levelleor/lorebound/pull/14). Readiness-head CI passes. After the preview/demo handoff, the user explicitly requested independent subagent review and task finalisation. Independent implementation review passes; routine closure is conditional on its final review/checks and confirmed merge; no merged-main claim follows before confirmed merge.

## Accepted-source and dependency audit

[IDEA-0004](../../product/PRD-0005-retry-undo-and-alternative-continuations.md), Accepted direction / Temporary undo is bounded, permits finite uncommitted edit history with engineering-defined depth/lifetime. [Parent R06/R12](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003.md#idea-0004-requirement-inventory) distinguish it from generation Retry, committed rollback and selectable old futures. [IDEA-0005](../../product/PRD-0006-adventure-save-and-export-management.md) and [B4-D09](../../decisions/ADR-0032-shared-latest-pending-draft-without-tab-locks.md) retain only one shared saved draft. Temporary in-memory edits are never a stored draft history. [B3-D04](../../decisions/ADR-0017-single-current-history-without-revisions.md) forbids a canonical revision archive; [B3-D05](../../decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md) preserves stale-write protection. [B3-D07](../../decisions/ADR-0020-shared-pending-commit-composer-overlay.md) keeps input blocked while a turn is pending.

Source inspection confirms DEV-003A/B and the Go-owned latest-draft path from DEV-003C are merged. [PR #13](https://github.com/Levelleor/lorebound/pull/13) is confirmed merged at `3632386d407efc0e40bfe9a8c9e7916a9fef9199`. Current code already edits plain Story input but has no explicit bounded application history. This child builds on that input/draft lifecycle without changing canonical storage.

Remaining parent dependencies:

- Passage-edit drafts need logical passage targets and guarded edit confirmation under IDEA-0003/0041; not selected.
- Committed Undo needs adventure concurrency versions separated from turn count, an atomic removal operation, receipt/recovery changes and coherent reconstruction; not selected.
- Historical editing additionally needs Keep Later/Delete All After/Continue Editing/Discard and structural preflight; not selected.
- Broader module/world replay and Fork state copying depend on supported nonempty events; still later. B9-D12 remains **DEFERRED — NO WORK**.

## Bounded acceptance and maintained coverage

These are child acceptance criteria under the existing IDEA-0004/R06 and R12 IDs, not new whole-IDEA certification.

| Criterion | Observable behavior | Source / maintained coverage |
| --- | --- | --- |
| D01 — finite input edits | Undo/Redo traverses local unfinished text, including empty/multiline/Unicode text. Keep at most 50 changes and 500,000 UTF-16 units across snapshots; current oversized input stays available but cannot retain oversized prior values. A new edit clears redo. | `InputHistory`; `inputHistory.test.ts` exhaustion, size and replacement tests. |
| D02 — controls and selection | Named Undo input/Redo input buttons, Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl/Cmd+Y affect input only. Restore cursor/selection, group a composition, and fence native history events at exhausted boundaries. Controls remain visible at four widths in Dark/Bright. | `StoryWorkspace.svelte`; browser `exerciseInputHistory` keyboard, selection, synthetic IME/native-event and responsive scenarios. |
| D03 — latest-draft persistence | Undo/Redo saves its resulting text through the existing debounce path; no canonical operation, draft revision or browser-storage history. Reload restores latest saved text with empty edit stacks. Same-value focus reads preserve history; a different restored shared draft clears both stacks. | Coordinator integration tests; real Firefox/Wails/Go/SQLite draft reload in `check-input-history.mjs`. Existing draft tests retain failure/late-read coverage. |
| D04 — lifecycle fencing | Generation start ends the temporary history even on Stop/Discard/failure; Retry cannot recover input edits or prior candidates. Acceptance clears input/history; saving/uncertain/read-only phases reject edit Undo/Redo. Canonical refresh to a different version/epoch and disposal clear history while retaining available input as appropriate. | Coordinator tests for generation, Retry, Stop, Discard, acceptance/uncertain recovery, changed canon and disposal; browser generation/Discard/acceptance boundary. |
| D05 — canonical isolation | Repeated temporary Undo exhausts without changing accepted turns, IDs, version or candidates. New explicit acceptance still uses the existing expected-version/epoch/receipt path. | Coordinator no-write assertions and browser exact snapshot comparison; existing SQLite/host/recovery suite remains CI regression coverage. |

Source: [input history](https://github.com/Levelleor/lorebound/blob/178ac138984789085984cd0f3b92d49da104fd3f/frontend/src/lib/inputHistory.ts), [coordinator](https://github.com/Levelleor/lorebound/blob/178ac138984789085984cd0f3b92d49da104fd3f/frontend/src/lib/coordinator.ts), [workspace](https://github.com/Levelleor/lorebound/blob/178ac138984789085984cd0f3b92d49da104fd3f/frontend/src/lib/StoryWorkspace.svelte). Tests: [history unit](https://github.com/Levelleor/lorebound/blob/178ac138984789085984cd0f3b92d49da104fd3f/frontend/tests/inputHistory.test.ts), [coordinator](https://github.com/Levelleor/lorebound/blob/178ac138984789085984cd0f3b92d49da104fd3f/frontend/tests/story.test.ts), [browser](https://github.com/Levelleor/lorebound/blob/178ac138984789085984cd0f3b92d49da104fd3f/frontend/scripts/check-input-history.mjs) integrated into the existing [CI browser/restart harness](https://github.com/Levelleor/lorebound/blob/178ac138984789085984cd0f3b92d49da104fd3f/frontend/scripts/check-browser.mjs). CI owns output and temporary captures.

## Limits and remaining scope

The budget is an engineering choice: each native input event is an edit, with one IME composition grouped; no word/time grouping is promised. History ends on generation start, navigation/reload, changed canonical version/epoch or replacement by a different shared draft. The current draft text remains governed by latest-successful-save recovery; final unsaved text and overwritten drafts can be lost. Automated composition/native-menu events are synthetic; real OS IMEs, browser menus, macOS shortcuts and Windows/macOS packaging are not certified by Linux Firefox checks.

This does not implement committed-turn Undo, passage editing, canonical Redo, an AI candidate archive, new draft targets, live providers or world effects. Parent DEV-003 and IDEA-0004 remain PARTIAL; the existing 52 production / ten partial / zero complete counts and three formally certified IDEA-0006 rows do not change. No original IDEA is archived. All closure remains in the primary PR, conditional on verbal approval, final-head checks/review and confirmed merge; no next child starts automatically.

## Subsequent user correction

PR #14 merged at `e31cad1d60e4d99cc3d45592b03fbca954524e61`, satisfying the historical closure above. The user then rejected its composer-only scope and explicitly authorised [DEV-003E](STORY-0018-committed-story-turn-undo-and-composer-correction.md): remove custom input history and implement accepted-turn Undo. That correction has passing CI/independent review and user acceptance/finalisation authority; its removal becomes effective only after PR #15 final checks/review and confirmed merge. Source/test links above pin the actual historical implementation; this record must never be cited as evidence of committed-turn Undo or current passage-editor history.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
