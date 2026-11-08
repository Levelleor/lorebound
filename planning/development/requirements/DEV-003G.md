---
type: development-requirements
status: awaiting-user-review
created: "2026-11-07"
updated: "2026-11-07"
task: "DEV-003G"
parent: "DEV-003"
tags:
  - planning/development
---

# DEV-003G — Accepted authored-passage editing

The user's separate 2026-11-07 launch authorises auditing DEV-003, implementing one bounded child, testing, independent review and one primary PR. Finalise/merge requires later verbal approval of the named PR. Base: confirmed [PR #16](https://github.com/Levelleor/lorebound/pull/16), merge `020e36fd68b2360982ff288622539dcc42058552`; its conditional DEV-003F closure is satisfied.

## Remaining scope and dependency audit

Retry, independent Story-prefix Fork, shared composer drafts, committed-turn Undo and generated-passage editing are merged. This child selects **accepted player-authored Story passages**, extending the existing passage editor, latest shared draft slots and four-choice confirmation flow. Existing stable passage IDs, structured documents, monotonic adventure versions, coherent reads and atomic Go/SQLite Commit receipts supply the core dependencies.

The binding [B3-D04](../../architecture/decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) rule removes **all later passages** after the chosen passage, not merely subsequent turns. Thus authored Delete All After Point removes that turn's generated continuation and every later turn, retains the edited authored passage/turn identity and baseline, and increments the concurrency version. Keep retains the same-turn continuation and all later prose unchanged. An authored-only turn is a valid surviving history boundary, remains editable/forkable/undoable, and can precede a newly accepted Story turn. Ordinary new-turn acceptance still requires an authored/generated pair; this is not a new authored-only submission mode.

A metadata-only nonspatial database v4→v5 upgrade fences older binaries that assume every stored turn has two passages; wire v4 rejects old tabs. Existing rows, epoch, baseline, drafts and original receipts remain unchanged. This is not B9-D12 spatial migration.

| Remaining parent obligation | Dependency / disposition |
| --- | --- |
| Authored prose editing and its exact passage suffix | Selected here; existing editor/draft/receipt paths extended, stored-history readers and affected Fork/Undo/restart coverage updated. |
| Temporary passage-editor Undo/Redo | Native textarea history remains transient; custom editor history is unselected. No custom composer Undo/Redo returns. |
| Whole-passage deletion, moving, splitting or merging | Boundary/identity decisions remain open in IDEA-0003/0041; unselected. Empty canonical documents remain invalid. |
| Nonempty world effects, independent corrections, module/derived reconstruction | Typed event reducers/provenance and cross-module contracts remain unavailable; fail closed, no claims from empty effects. |
| Other modes, live providers, library lifecycle and cross-reload uncertain-operation persistence | Later independently authorised work; no new recovery promise for overwritten or unsaved drafts. |
| B9-D12 spatial event/schema migration | **DEFERRED — NO WORK.** |

## Accepted sources and requirement coverage

[IDEA-0003](../../production/Direct%20Editable%20Prose%20Document.md) and [IDEA-0041](../../production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md) own direct inline editing, latest passage-scoped drafts, explicit choices and player-owned continuity. [IDEA-0005](../../production/Adventure%20Save%20and%20Export%20Management.md), [IDEA-0040](../../production/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md) and [IDEA-0042](../../production/Snapshots%20and%20Incremental%20State%20Rebuild.md) supply draft separation, stable identity and reconstruction, qualified by later current-only B3-D04. The [existing nine stable rows](./DEV-003F.md#affected-atomic-inventory) are reused; this child adds no duplicate atomic IDs or full-row certification.

[B3-D02](../../architecture/decisions/B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) and [B3-D07](../../architecture/decisions/B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) require immutable recovery, stale rejection/fresh decisions and shared blocking composer controls. [B4-D02](../../architecture/decisions/B4-D02%20-%20Undo%20and%20Truncation%20Boundaries%20for%20Independent%20Corrections.md), [B4-D06](../../architecture/decisions/B4-D06%20-%20Preflight%20Structural%20Integrity%20of%20Current%20History%20Mutations.md) and [B6-D01](../../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) preserve deterministic technical integrity without fictional-continuity veto or AI repair. Latest-only draft behavior follows IDEA-0003 and [B4-D09](../../architecture/decisions/B4-D09%20-%20Shared%20Latest%20Pending%20Draft%20Without%20Tab%20Locks.md). The [visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) govern presentation.

| Existing requirement IDs | Observable acceptance for this child | Maintained coverage |
| --- | --- | --- |
| IDEA-0003/R01, R03 | Inline authored paragraph edits preserve passage/turn IDs and authored source; typing/Continue/Discard do not commit or call AI. | `StoryWorkspace.svelte`, `StoryCoordinator`; `frontend/tests/edit.test.ts` DEV-003G cases; `check-story-edit.mjs` authored variant. |
| IDEA-0003/R02 | One latest shared authored draft per target; distinct composer/generated targets; absent/empty values, reload/restore and conditional discard remain supported. | `TextDraft`, `draft.go`; existing draft failure/race tests; authored coordinator/browser draft/empty/reload/discard; full passage-slot process-restart comparison in `check-browser.mjs`. |
| IDEA-0003/R04; IDEA-0041/R05 | Atomic version/epoch-guarded replacement/truncation; failures leave canon intact; stale decision retains accessible text and requires fresh review; original-operation recovery cannot delete a newer future. | `authored_edit_test.go`, existing edit/receipt tests; authored coordinator/browser stale and lost-reply paths. Unsupported effects remain read-only. |
| IDEA-0041/R01, R04 | All four named decisions in shared composer; composer blocked; appropriate keyboard focus/Escape; Discard/Continue preserve accepted history. | Authored browser variant of `check-story-edit.mjs`, coordinator transitions and draft regressions. |
| IDEA-0041/R02 | Keep replaces only authored body; same-turn generated continuation and all later history survive unchanged. | Exact Go/coordinator/browser comparisons. |
| IDEA-0041/R03 | Delete removes same-turn continuation and complete later suffix; authored-only turn persists and supports editing, Fork, Undo and a new continuation. | `TestAuthoredEditExactBoundaryDraftsRecoveryForkUndoAndReopen`, authored coordinator recovery, browser authored boundary/Fork/Undo/new continuation and process restart. |
| Cross-cutting representation/compatibility | One/two-passage stored history; malformed/duplicate/generated-only/empty history rejected; append still requires two passages; database upgrade preserves rows and rejects old wire. | Go authored rejection/upgrade tests, adjusted Fork corruption regression, TypeScript replay tests and current-wire browser fixtures. |

## Verification and handoff

Implemented in [primary PR #17](https://github.com/Levelleor/lorebound/pull/17), awaiting user review and named-PR finalise/merge approval. [Application CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42435364390) checks `8063ad1dc3291d18a3f3b1cb4a1c131bc01ab291`: repository checks, build/typecheck, TypeScript, Go/vet/SQLite, real Linux Firefox/host/recovery and exact process restart. Independent source/coverage/documentation review and all eight local authored confirmation captures PASS; final CI-capture/readiness review is recorded in the PR. The reviewer found a malformed stored-ordinal edge case; `readHistory` now rejects it before mutation, with target/version/receipt-preservation regression coverage. No blocking source finding remains. Final readiness-head CI belongs in the PR; application sources are unchanged by readiness documentation. Generated output stays in CI/temporary directories.

The checked [two-turn preview](http://127.0.0.1:8083/?adventure=a15b929e-cab7-4c03-b47c-3eb88739c164) serves matching built assets using the separate persistent `.local/review/dev003g` library. The disposable focused test host is stopped. Relaunch: `bash scripts/dev.sh -port 8083 -data-dir "$PWD/.local/review/dev003g"`. [NOW](../NOW.md) owns readiness; the PR/chat provides the checked address and short authored-edit demo before requesting verbal finalise/merge approval.

No original IDEA is complete or archived; IDEA-0003/0041 and parent DEV-003 remain PARTIAL. Thirteen partial / 39 without feature-level evidence / zero complete originals and three formal IDEA-0006 rows remain unchanged. No next slice starts through this task's closure.

Generation and provider faults are simulated; actual Linux Firefox/Wails/SQLite verification does not certify live providers, Windows/macOS packaging or full accessibility. Overwritten/unsaved drafts and cross-reload uncertain-operation persistence remain outside scope. User acceptance and verbal finalise/merge approval are still pending; no prepared verified-main closure is claimed.
