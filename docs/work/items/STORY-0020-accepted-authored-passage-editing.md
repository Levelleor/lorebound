---
id: STORY-0020
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0019
priority: 3
related:
- PRD-0004
- PRD-0042
- PRD-0006
- PRD-0041
- PRD-0043
- PRD-0007
- STORY-0003
---

# Accepted authored-passage editing

## Outcome

Accepted authored-passage editing.

[Legacy task: DEV-003G](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003g)

**Bounded delivery verified and merged:** [PR #17](https://github.com/Levelleor/lorebound/pull/17), confirmed on source main at `632ed6fb78b88a51e5135a516ff7ec7a1e35fdb1`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003G.md)

The user's separate 2026-11-07 launch authorises auditing DEV-003, implementing one bounded child, testing, independent review and one primary PR. The user supplied named-PR finalise/merge approval after the review handoff, as recorded below. Base: confirmed [PR #16](https://github.com/Levelleor/lorebound/pull/16), merge `020e36fd68b2360982ff288622539dcc42058552`; its conditional DEV-003F closure is satisfied.

## Remaining scope and dependency audit

Retry, independent Story-prefix Fork, shared composer drafts, committed-turn Undo and generated-passage editing are merged. This child selects **accepted player-authored Story passages**, extending the existing passage editor, latest shared draft slots and four-choice confirmation flow. Existing stable passage IDs, structured documents, monotonic adventure versions, coherent reads and atomic Go/SQLite Commit receipts supply the core dependencies.

The binding [B3-D04](../../decisions/ADR-0017-single-current-history-without-revisions.md) rule removes **all later passages** after the chosen passage, not merely subsequent turns. Thus authored Delete All After Point removes that turn's generated continuation and every later turn, retains the edited authored passage/turn identity and baseline, and increments the concurrency version. Keep retains the same-turn continuation and all later prose unchanged. An authored-only turn is a valid surviving history boundary, remains editable/forkable/undoable, and can precede a newly accepted Story turn. Ordinary new-turn acceptance still requires an authored/generated pair; this is not a new authored-only submission mode.

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

[IDEA-0003](../../product/PRD-0004-direct-editable-prose-document.md) and [IDEA-0041](../../product/PRD-0042-historical-edit-confirmation-and-bulk-truncation.md) own direct inline editing, latest passage-scoped drafts, explicit choices and player-owned continuity. [IDEA-0005](../../product/PRD-0006-adventure-save-and-export-management.md), [IDEA-0040](../../product/PRD-0041-versioned-text-blocks-and-revision-ids.md) and [IDEA-0042](../../product/PRD-0043-snapshots-and-incremental-state-rebuild.md) supply draft separation, stable identity and reconstruction, qualified by later current-only B3-D04. The [existing nine stable rows](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003F.md#affected-atomic-inventory) are reused; this child adds no duplicate atomic IDs or full-row certification.

[B3-D02](../../decisions/ADR-0015-idempotent-canonical-commit-attempts.md), [B3-D05](../../decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md) and [B3-D07](../../decisions/ADR-0020-shared-pending-commit-composer-overlay.md) require immutable recovery, stale rejection/fresh decisions and shared blocking composer controls. [B4-D02](../../decisions/ADR-0025-undo-and-truncation-boundaries-for-independent-corrections.md), [B4-D06](../../decisions/ADR-0029-preflight-structural-integrity-of-current-history-mutations.md) and [B6-D01](../../decisions/ADR-0042-narrative-first-declarative-outcome-events.md) preserve deterministic technical integrity without fictional-continuity veto or AI repair. Latest-only draft behavior follows IDEA-0003 and [B4-D09](../../decisions/ADR-0032-shared-latest-pending-draft-without-tab-locks.md). The [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) govern presentation.

| Existing requirement IDs | Observable acceptance for this child | Maintained coverage |
| --- | --- | --- |
| IDEA-0003/R01, R03 | Inline authored paragraph edits preserve passage/turn IDs and authored source; typing/Continue/Discard do not commit or call AI. | `StoryWorkspace.svelte`, `StoryCoordinator`; `frontend/tests/edit.test.ts` DEV-003G cases; `check-story-edit.mjs` authored variant. |
| IDEA-0003/R02 | One latest shared authored draft per target; distinct composer/generated targets; absent/empty values, reload/restore and conditional discard remain supported. | `TextDraft`, `draft.go`; existing draft failure/race tests; authored coordinator/browser draft/empty/reload/discard; full passage-slot process-restart comparison in `check-browser.mjs`. |
| IDEA-0003/R04; IDEA-0041/R05 | Atomic version/epoch-guarded replacement/truncation; failures leave canon intact; stale decision retains accessible text and requires fresh review; original-operation recovery cannot delete a newer future. | `authored_edit_test.go`, existing edit/receipt tests; authored coordinator/browser stale and lost-reply paths. Unsupported effects remain read-only. |
| IDEA-0041/R01, R04 | All four named decisions in shared composer; composer blocked; appropriate keyboard focus/Escape; Discard/Continue preserve accepted history. | Authored browser variant of `check-story-edit.mjs`, coordinator transitions and draft regressions. |
| IDEA-0041/R02 | Keep replaces only authored body; same-turn generated continuation and all later history survive unchanged. | Exact Go/coordinator/browser comparisons. |
| IDEA-0041/R03 | Delete removes same-turn continuation and complete later suffix; authored-only turn persists and supports editing, Fork, Undo and a new continuation. | `TestAuthoredEditExactBoundaryDraftsRecoveryForkUndoAndReopen`, authored coordinator recovery, browser authored boundary/Fork/Undo/new continuation and process restart. |
| Cross-cutting representation/compatibility | One/two-passage stored history; malformed/duplicate/generated-only/empty history rejected; append still requires two passages; database upgrade preserves rows and rejects old wire. | Go authored rejection/upgrade tests, adjusted Fork corruption regression, TypeScript replay tests and current-wire browser fixtures. |

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
