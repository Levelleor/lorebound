---
id: STORY-0019
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0018
priority: 3
related:
- PRD-0005
- PRD-0004
- PRD-0042
- PRD-0006
- PRD-0041
- PRD-0043
- PRD-0007
- STORY-0003
---

# Accepted generated-passage editing

## Outcome

Accepted generated-passage editing.

[Legacy task: DEV-003F](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003f)

**Bounded delivery verified and merged:** [PR #16](https://github.com/Levelleor/lorebound/pull/16), confirmed on source main at `020e36fd68b2360982ff288622539dcc42058552`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003F.md)

The user's 2026-11-06 launch explicitly authorises auditing DEV-003, selecting and implementing one bounded child, testing, independent review and one primary PR. The user supplied the subsequent named-PR merge/closure approval on 2026-11-07, as recorded below. Base: confirmed [PR #15](https://github.com/Levelleor/lorebound/pull/15), merge `987310abf8ad39d43144c53ae77c78da937bff3b`.

## Remaining requirements and dependencies

[Parent inventory](STORY-0003-retry-drafts-undo-fork-and-current-history-prose-editing.md) retains the original IDEA-0004 IDs. Retry, independent zero-effects Fork, composer drafts and committed-turn Undo are merged. Remaining direct/historical editing needs passage-scoped drafts, current-body replacement, explicit historical choice, atomic truncation and safe recovery. Existing stable passage IDs, structured documents, monotonic concurrency versions, coherent reads and idempotent Commit receipts satisfy those dependencies. No new database format is needed.

This child selects **generated passages**, the last passage in each existing two-passage Story turn. This gives Delete All After Point an exact boundary: preserve the edited turn and delete all subsequent turns/passages. Authored-passage editing and cross-passage movement/splitting/merging need their own boundary treatment and remain later. Nonempty events, standalone corrections, derived memories/module state, other modes and live providers remain unsupported. B9-D12 remains **DEFERRED — NO WORK**.

## Accepted sources

- [IDEA-0003](../../product/PRD-0004-direct-editable-prose-document.md): direct inline paragraph edits, stable logical passage identity, latest shared noncanonical draft per target and deliberate confirmation.
- [IDEA-0041](../../product/PRD-0042-historical-edit-confirmation-and-bulk-truncation.md): Keep Later Turns / Delete All After Point / Continue Editing / Discard; player-owned continuity and no AI repair.
- [IDEA-0005](../../product/PRD-0006-adventure-save-and-export-management.md), [IDEA-0040](../../product/PRD-0041-versioned-text-blocks-and-revision-ids.md), [IDEA-0042](../../product/PRD-0043-snapshots-and-incremental-state-rebuild.md): draft/canonical distinction, structured identity and coherent reconstruction. Existing [IDEA-0005 inventory](STORY-0016-shared-latest-story-composer-draft.md) and IDEA-0042/R01 remain partial.
- [B3-D04](../../decisions/ADR-0017-single-current-history-without-revisions.md) supersedes older revision requirements: overwrite current body, preserve existing events on Keep, no old-body archive or canonical Redo.
- [B3-D02](../../decisions/ADR-0015-idempotent-canonical-commit-attempts.md), [B3-D05](../../decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md): immutable operation recovery, expected-version/epoch fencing, fresh decision after conflict.
- [B3-D07](../../decisions/ADR-0020-shared-pending-commit-composer-overlay.md): shared blocking composer overlay with workflow-specific decisions; no second commit bar.
- [B4-D02](../../decisions/ADR-0025-undo-and-truncation-boundaries-for-independent-corrections.md), [B4-D06](../../decisions/ADR-0029-preflight-structural-integrity-of-current-history-mutations.md), [B6-D01](../../decisions/ADR-0042-narrative-first-declarative-outcome-events.md): explicit suffix, deterministic technical preflight, no fictional-continuity veto. Zero effects do not certify nonempty replay.
- [B4-D09](../../decisions/ADR-0032-shared-latest-pending-draft-without-tab-locks.md): latest shared draft, no tab locks/branches. Prose drafts follow IDEA-0003; stale manual world-correction rules are not extended to discard prose silently.
- [Visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md): inline gold edit marker, truthful pending/saved labels, accessible controls and shared composer.

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

Implementation is in [primary PR #16](https://github.com/Levelleor/lorebound/pull/16). [Reviewed application CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42393461928) checks `e047e916e60a3c3302837ea0b19da4f04f45761f`: build/typecheck, TypeScript, vet, real Go/SQLite, Firefox/host restrictions, recovery and exact process restart. The earlier CI failure exposed an ordinary-acceptance disposal timing regression; the fix preserves the original behavior and its existing regression now passes. Independent source/coverage, final Dark/Bright capture and readiness-document review PASS. Final closure-head CI and merge provenance belong in the primary PR/final handoff. Verified-main status remains conditional on confirmed merge below.

| Requirements | Maintained source / verification |
| --- | --- |
| IDEA-0003/R01, R03–R04; IDEA-0041/R01–R04 | `StoryWorkspace.svelte`, `StoryCoordinator` edit transitions and `editedTurns`; `frontend/tests/edit.test.ts`; `frontend/scripts/check-story-edit.mjs` covers inline editing, all four choices, stable identity, exact retained/truncated history, no typing-time commit, keyboard/focus and four-width Dark/Bright overlay. |
| IDEA-0003/R02 | `TextDraft`, `internal/store/draft.go`; `frontend/tests/draft.test.ts` covers absent/empty values, delayed restore fencing, serialization, failures and conditional discard; `TestPassageDraftTargetsEmptyDiscardAndReopen` plus browser draft/reload and `check-browser.mjs` passage-draft restart equality. |
| IDEA-0003/R04; IDEA-0041/R02–R03, R05 | `internal/store/edit.go` within `Store.commit`; `TestEditKeepTruncateDraftsForkRecoveryAndReopen`, `TestEditRejectsAtomicFailureMalformedStaleEpochAndUnsupported`, `TestEditRacesWithAppend`; coordinator tests cover exact operation recovery, post-commit read failure, stale/refetch failure, removed target/epoch changes, retained text and explicit fresh review. Browser coverage includes actual SQLite changes and intercepted lost replies/stale-tab conflicts, Fork/Undo isolation and newer continuation during recovery. |

Draft failure regressions cover Discard after failed-before-write and lost-success-reply autosaves, repeated uncertainty, and preservation of a different newer shared draft. Native textarea history stays temporary; no custom composer Undo/Redo is reintroduced. Unsupported nonempty effects fail closed. No live-provider, Windows/macOS packaging, full accessibility, recovery of overwritten/unsaved draft values or cross-reload uncertain-operation persistence is claimed.

Review launch: `bash scripts/dev.sh -port 8082 -data-dir "$PWD/.local/review/dev003f"`. The persistent sample library is separate from ordinary user data. [NOW](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/NOW.md) owns the checked review address and current handoff; the PR/chat owns the task-specific walkthrough. No original IDEA is complete or archived; parent DEV-003 stays PARTIAL.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
