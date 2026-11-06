---
type: development-requirements
status: awaiting-user-review
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003C"
parent: "DEV-003"
tags:
  - planning/development
  - requirements
---

# DEV-003C — Shared latest Story composer draft

The user's 2026-11-06 launch authorises auditing DEV-003 and selecting one bounded child. This child saves and restores unfinished **Story composer input** in the existing Go-owned library. It also carries the previously requested workflow/evidence maintenance as its prerequisite in [primary PR #13](https://github.com/Levelleor/lorebound/pull/13). [CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42264622826) and independent source/coverage review PASS for `1cd6ed4`; actual CI Dark/Bright draft captures were reviewed. User acceptance and finalise/merge approval remain pending. Nothing here declares verified-main behavior.

## Source audit and dependency choice

[IDEA-0005](../../production/Adventure%20Save%20and%20Export%20Management.md), Accepted direction / Latest-draft-wins / Dependencies and constraints, approves debounced SQLite drafts, latest-only recovery, visible failures and no synchronous per-keystroke guarantee. [IDEA-0051](../../production/Browser-Persistent%20Story%20Database.md) owns Go-only SQLite, isolated adventures and epoch fencing. [B4-D09](../../architecture/decisions/B4-D09%20-%20Shared%20Latest%20Pending%20Draft%20Without%20Tab%20Locks.md) reinforces shared latest-value semantics. Its manual-correction context and [B4-D08](../../architecture/decisions/B4-D08%20-%20Discard%20Stale%20Pending%20Manual%20Drafts.md) do not turn ordinary unsent Story input into a manual world-correction batch. Canonical stale rejection/input retention and unchanged-request recovery remain governed by B3-D05/B3-D02.

Actual source before this child retained input only in memory. DEV-003A/B provide the merged Story loop and independent Fork. Drafts need a separate table and narrow bridge operations but no change to canonical version/order assumptions. Committed Undo requires replacing those append-only assumptions; prose editing additionally needs passage-target drafts and historical confirmation. Temporary editor undo needs an editor lifecycle. Those are later children, so composer recovery is the selected independent increment.

## Affected accepted requirements

These seven stable IDEA-0005 IDs inventory the affected draft obligations, not the complete library IDEA. Each remains scoped to Story composer input; prose-edit/other-mode coverage remains outstanding where applicable. No new whole-row or whole-IDEA certification is inferred.

| ID | Accepted behavior | Implementation / maintained coverage |
| --- | --- | --- |
| IDEA-0005/R01 | Autosave unfinished input after a brief typing pause, separately from canon; empty replacement must not restore cleared input. | 600 ms inactivity debounce; `ComposerDraft`; `draft.test.ts` debounce/empty case; `TestDraftLatestValueIsolationAndReopen`; browser `exerciseDrafts`. |
| IDEA-0005/R02 | Reopening restores only the latest successfully saved draft; unsaved final keystrokes and overwritten values have no recovery guarantee. | Read on mount/safe focus; late reads cannot overwrite newer typing; unit late-restore cases and real browser reload/process-restart comparison. |
| IDEA-0005/R03 | One shared last-successful-write-wins value per target; no draft history, merge, tab branches or exclusive lease. | SQLite upsert; local writes serialize; focus restores latest clean saved input; unit concurrent flush and browser two-tab replacement. Canonical expected-version guards remain unchanged. |
| IDEA-0005/R04 | Unlike targets/adventures stay independent; Fork excludes unfinished drafts. | `(adventure_id,target)` ownership; only `composer_story` supported; unsupported targets reject. SQLite isolation and existing real-browser Fork exclusion. Passage targets/other composer modes remain later. |
| IDEA-0005/R05 | Submission/acceptance remains explicit and atomic; retire accepted source input without clearing a different latest draft or losing data on failed commits. | Await outstanding autosaves before first commit dispatch; consume matching authored text inside the canonical transaction; original receipt replay never consumes again. SQLite rollback/receipt tests and coordinator delayed-save/uncertain-recovery tests. |
| IDEA-0005/R06 | Draft failures are visible; available input and previous canon survive generation/save failure. Do not label unconfirmed writes saved. | Distinct draft loading/unsaved/saving/saved/error status, named retry control; 20,000 Unicode-codepoint budget. Unit malformed/oversize/failure tests; browser lost-response retry, Stop/Retry/Discard and abandoned-proposal input recovery. |
| IDEA-0005/R07 | Drafts remain in the active Go-managed library with technical isolation and stale-library write protection. | Epoch-checked draft transactions; additive **nonspatial** v2→v3 table upgrade, preserving baseline/history/receipts and rollback on upgrade failure. `draft_test.go` epoch/payload/upgrade tests; existing v1 upgrade and origin restrictions remain gates. |

Source owners: [draft controller](../../../frontend/src/lib/draft.ts), [coordinator](../../../frontend/src/lib/coordinator.ts), [workspace](../../../frontend/src/lib/StoryWorkspace.svelte), [SQLite drafts](../../../internal/store/draft.go), [atomic consumption](../../../internal/store/story.go). Coverage owners: [draft unit tests](../../../frontend/tests/draft.test.ts), [coordinator tests](../../../frontend/tests/story.test.ts), [SQLite tests](../../../internal/store/draft_test.go), [browser scenarios](../../../frontend/scripts/check-story-draft.mjs), [process restart harness](../../../frontend/scripts/check-browser.mjs). [CI](../../../.github/workflows/verify.yml) owns execution output and temporary captures.

## Boundaries and remaining work

Draft autosave does not save AI candidates, accept story, create events or replay history. It stores one plain-text input value, including paragraph breaks and literal markup; no browser storage copy is authoritative. A different draft saved by another context survives acceptance. Current input is retained after ordinary canonical conflict; saved drafts can be overwritten under the accepted last-wins policy.

Leaving before the debounce or before a successful write can lose final input; no unload-time durability guarantee. Draft recovery does not preserve a provisional response or an uncertain canonical operation across reload. Same-session uncertain saves still recover their original immutable operation. Whole-library restore/directory switching/maintenance workflows, backup, rename, duplicate, delete, other modes, passage editing, temporary undo, committed Undo, nonempty world effects and live providers remain later. Draft table foreign keys prepare ownership without claiming those lifecycle features exist. B9-D12 remains **DEFERRED — NO WORK**.

Parent DEV-003 and original IDEAs remain incomplete. No original note moves to specs/archive. Closure stays in this primary PR, conditional on checks, independent review, explicit user approval to finalise/merge the named PR and confirmed merge. Closing this child launches no next slice.
