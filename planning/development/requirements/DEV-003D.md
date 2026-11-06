---
type: development-requirements
status: awaiting-review
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003D"
parent: "DEV-003"
tags:
  - planning/development
  - requirements
---

# DEV-003D — Temporary Story input Undo/Redo

The user's 2026-11-06 launch authorises auditing DEV-003, selecting and implementing one bounded child, and publishing one primary PR. It does not authorise merge before the named-PR verbal approval. This child adds bounded, ephemeral Undo/Redo to **unfinished Story composer input**. Implementation is published in [primary PR #14](https://github.com/Levelleor/lorebound/pull/14). Application CI passes; independent reviewer sign-off and hands-on acceptance remain pending. No merged-main claim follows.

## Accepted-source and dependency audit

[IDEA-0004](../../production/Retry%20Undo%20and%20Alternative%20Continuations.md), Accepted direction / Temporary undo is bounded, permits finite uncommitted edit history with engineering-defined depth/lifetime. [Parent R06/R12](./DEV-003.md#idea-0004-requirement-inventory) distinguish it from generation Retry, committed rollback and selectable old futures. [IDEA-0005](../../production/Adventure%20Save%20and%20Export%20Management.md) and [B4-D09](../../architecture/decisions/B4-D09%20-%20Shared%20Latest%20Pending%20Draft%20Without%20Tab%20Locks.md) retain only one shared saved draft. Temporary in-memory edits are never a stored draft history. [B3-D04](../../architecture/decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) forbids a canonical revision archive; [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) preserves stale-write protection. [B3-D07](../../architecture/decisions/B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) keeps input blocked while a turn is pending.

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

Source: [input history](../../../frontend/src/lib/inputHistory.ts), [coordinator](../../../frontend/src/lib/coordinator.ts), [workspace](../../../frontend/src/lib/StoryWorkspace.svelte). Tests: [history unit](../../../frontend/tests/inputHistory.test.ts), [coordinator](../../../frontend/tests/story.test.ts), [browser](../../../frontend/scripts/check-input-history.mjs) integrated into the existing [CI browser/restart harness](../../../frontend/scripts/check-browser.mjs). CI owns output and temporary captures.

## Verification and review status

[Application CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42303322677) covers `3e359913e70dc9cc45554def7c9bd7b91da90f52`: repository checks, build/typecheck, TypeScript, vet, real SQLite, actual Linux Firefox/Wails/Go integration, origin restrictions and exact process restart. Focused local development checks also passed; routine suite output stays in CI. Actual CI captures at 390 Dark / 1440 Bright were inspected: quiet controls fit, focus remains visible and the composer stays docked; automation covers all four widths/themes.

The implementing agent completed a separate requirements/diff/coverage pass with no blocking finding. **Independent reviewer sign-off remains pending**; the user was asked whether to use a separate reviewer agent or provide that review. This session requires an explicit request before spawning another agent. No independent-agent PASS or user acceptance is claimed.

The preview at `http://127.0.0.1:8081` was verified reachable through Firefox/Wails and its served index matched the current build. It uses the separate persistent `.local/review/dev003d` library. The disposable test host was stopped. The PR/chat contains the walkthrough; named-PR verbal approval has not been requested or given before independent review.

## Limits and remaining scope

The budget is an engineering choice: each native input event is an edit, with one IME composition grouped; no word/time grouping is promised. History ends on generation start, navigation/reload, changed canonical version/epoch or replacement by a different shared draft. The current draft text remains governed by latest-successful-save recovery; final unsaved text and overwritten drafts can be lost. Automated composition/native-menu events are synthetic; real OS IMEs, browser menus, macOS shortcuts and Windows/macOS packaging are not certified by Linux Firefox checks.

This does not implement committed-turn Undo, passage editing, canonical Redo, an AI candidate archive, new draft targets, live providers or world effects. Parent DEV-003 and IDEA-0004 remain PARTIAL; the existing 52 production / ten partial / zero complete counts and three formally certified IDEA-0006 rows do not change. No original IDEA is archived. All closure remains in the primary PR, conditional on verbal approval, final-head checks/review and confirmed merge; no next child starts automatically.
