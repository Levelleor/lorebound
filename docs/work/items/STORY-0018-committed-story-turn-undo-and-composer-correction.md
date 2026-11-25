---
id: STORY-0018
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0017
priority: 3
related:
- PRD-0005
- PRD-0043
- PRD-0007
- STORY-0003
---

# Committed Story turn Undo and composer correction

## Outcome

Committed Story turn Undo and composer correction.

[Legacy task: DEV-003E](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003e)

**Bounded delivery verified and merged:** [PR #15](https://github.com/Levelleor/lorebound/pull/15), confirmed on source main at `987310abf8ad39d43144c53ae77c78da937bff3b`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003E.md)

The user rejected DEV-003D's composer-only interpretation and explicitly accepted one corrective PR: remove custom input Undo/Redo, implement Undo of accepted story turns, continue differently in the same adventure, verify persistence/atomicity/conflicts, independently review, and provide a reachable review address and explanation **before requesting finalise/merge approval**. That launch authorised implementation/publication; subsequent user acceptance and finalisation/merge authority are recorded below. [PR #14](https://github.com/Levelleor/lorebound/pull/14) is confirmed merged at `e31cad1d60e4d99cc3d45592b03fbca954524e61`; its historical delivery is preserved rather than relabelled as turn Undo.

## Accepted authority and dependency audit

[IDEA-0004](../../product/PRD-0005-retry-undo-and-alternative-continuations.md), Accepted direction / Committed Undo / Same adventure may continue differently, requires deleting the latest accepted turn and reconstructing the surviving story/state back to Turn 0, without a temporary-editor depth limit. [B3-D04](../../decisions/ADR-0017-single-current-history-without-revisions.md) governs current-only deletion and no canonical Redo/archive; [B3-D02](../../decisions/ADR-0015-idempotent-canonical-commit-attempts.md) and [B3-D05](../../decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md) require original-operation recovery and fresh decisions after stale rejection. [B3-D03](../../decisions/ADR-0016-atomic-historical-selection-and-undo.md) is qualified by the later current-only decision. [B4-D06](../../decisions/ADR-0029-preflight-structural-integrity-of-current-history-mutations.md), [B2-D03](../../decisions/ADR-0009-turn-0-replay-for-authoritative-reconstruction.md) and [B6-D01](../../decisions/ADR-0042-narrative-first-declarative-outcome-events.md) govern deterministic preflight/reconstruction without AI. [IDEA-0042](../../product/PRD-0043-snapshots-and-incremental-state-rebuild.md) covers complete supported-state replay, not invented world/module functionality.

Source inspection: merged code has only a minimal empty baseline, ordered structured authored/generated passages and zero world effects. Adventure version previously equalled turn count. No characters/world/lore/memory/plugin records or independent state corrections exist; [B4-D02](../../decisions/ADR-0025-undo-and-truncation-boundaries-for-independent-corrections.md)'s correction boundaries remain later. This child reconstructs **all currently supported state**, not nonempty world effects. Unknown effects stay read-only. Existing latest-draft autosave and independent Fork remain.

Engineering contract: canonical operations increment a monotonic adventure version while turn order remains contiguous in the surviving current story. Typed `undo_story_turn` uses the existing atomic Commit path with expected version, epoch, operation ID and pinned latest turn ID. Receipts retain technical metadata only; replay never repeats a deletion or resurrects prose. Wire v3 rejects old tabs; a transactional nonspatial database v3→v4 metadata upgrade fences binaries that still assume version equals count, preserving existing identity/history/drafts/receipts. No spatial migration, new event schema or persisted checkpoint.

## Bounded acceptance and maintained coverage

Uses existing IDEA-0004/R07–R10 and R12 IDs from [the parent inventory](STORY-0003-retry-drafts-undo-fork-and-current-history-prose-editing.md), plus the affected reconstruction requirement below. Whole-IDEA certification remains incomplete.

| Criterion | Observable requirement | Coverage target |
| --- | --- | --- |
| E01 — correct feature | Custom input-history owner/buttons/hotkey interception are removed; ordinary textarea editing and draft autosave remain. Only the latest accepted turn offers Undo; confirmation names the turn/boundary and explains permanent removal. Shared composer overlay blocks input until Confirm/Cancel. | UI/native input/browser checks; accepted B3-D07 pattern and design contract. |
| E02 — surviving prefix | Undo Turn 2 removes its authored/generated passages and returns to exact Turn 1; repeated Undo reaches the unchanged baseline without a small depth cap. Restart/resume retains the result. No inactive body/event archive or canonical Redo. | Real SQLite deep/repeated rollback and reopen; TypeScript replay and real browser exact-prefix/restart scenarios. |
| E03 — independent continuation | A new Turn 2 after Undo has new identities and only surviving history as generation context; old prose never returns. Existing independent Forks retain their original history and can still fork a source whose version exceeds count. | SQLite and coordinator continuation/Fork tests; real browser independent-future checks. |
| E04 — atomic/conflict fencing | Delete/version/receipt are atomic; failure leaves canon/receipts unchanged. Wrong epoch, stale versions (including equal-count ABA), wrong target/baseline, malformed shapes and unsupported effects reject without writes. | SQLite rollback/rejection/concurrency/upgrade tests; coordinator stale/refetch and browser cross-tab race. |
| E05 — uncertain operations | Lost Undo success/read failure blocks fresh writes and recovers the identical request without deleting the next turn. Old append/Fork receipt recovery after later Undo returns current canon without resurrection or permanent uncertainty. | SQLite receipt/reopen/cross-kind tests, coordinator/Fork recovery tests, real browser lost-response and changed-history scenarios. |
| E06 — drafts and interaction | Undo retains available input and the latest shared saved draft. Pending generation/acceptance/uncertain writes cannot be bypassed; cancellation makes no canonical write. Keyboard confirmation/Cancel/Escape/focus and Dark/Bright four-width checks apply. | Coordinator/draft gating and browser input/focus/confirmation/responsive scenarios. |
| E07 — user review gate | One primary PR contains scope/code/evidence/controls; CI and independent review precede a current verified review URL, explanation and demo. Await user feedback and explicit named-PR finalise/merge approval. | PR/chat handoff and NOW ready/awaiting review; no merge authority inferred from this launch. |

## Affected IDEA-0042 reconstruction requirement

The original [IDEA-0042](../../product/PRD-0043-snapshots-and-incremental-state-rebuild.md), **Reconstruct committed Undo to the immediately previous active turn**, explicitly accepts this deletion/reconstruction path. Earlier append/Fork display alone did not certify it. This child supplies newly tested bounded foundation evidence; it does not certify nonempty world or derived/module state.

| Stable ID | Full accepted obligation | Current disposition / evidence |
| --- | --- | --- |
| IDEA-0042/R01 | Committed Undo reconstructs all supported authoritative state and derived context at N−1 from the accepted baseline/surviving current history, repeatably to baseline; invalidates affected derived records, preserves source/version consistency, rejects incomplete rollback atomically, and makes a newly committed continuation the sole active future. B2-D03/B3-D04/B6-D01 qualify older checkpoint/revision prose. | **PARTIAL scoped coverage, verified only on confirmed PR #15 merge after final checks/review** for existing Story-only zero-effects state: E02–E05; coordinator exact-prefix/replacement-generation-context tests, SQLite 75-step/reopen/rollback/receipt tests and real browser Undo/restart. Nonempty entities/world, corrections, summaries/memory/cache/module invalidation remain later. No full-row certification; verified-main feature counts stay at ten partial until merge, then become eleven partial / 41 without feature-level evidence; zero complete and three formal IDEA-0006 rows remain unchanged. |

## Maintained implementation and verification

Source owners: [atomic Commit/Undo and technical history validation](../../../internal/store/story.go), [version fence](../../../internal/store/store.go), [Fork](../../../internal/store/fork.go), [coordinator/preflight/recovery](../../../frontend/src/lib/coordinator.ts), [wire contracts](../../../frontend/src/lib/library.ts), [replay](../../../frontend/src/lib/story.ts), [UI](../../../frontend/src/lib/StoryWorkspace.svelte). Existing draft storage remains separate and unchanged.

Maintained coverage: [SQLite Undo/upgrade/recovery tests](../../../internal/store/undo_test.go), [coordinator/replay tests](../../../frontend/tests/story.test.ts), [Fork recovery tests](../../../frontend/tests/fork.test.ts), [real browser Undo scenarios](../../../frontend/scripts/check-story-undo.mjs) integrated into the [browser/exact restart harness](../../../frontend/scripts/check-browser.mjs). Focused SQLite, unit, typecheck/build and browser checks passed during development; the final version-limit guard is covered by a focused unit regression. IME key coverage is synthetic; no actual OS IME certification is claimed. Independent subagent `/root/dev003e_review` reviewed the exact published source/coverage and CI captures: **PASS for `97fe7ab8ae30ce426ce42da772ccb090ed622f62`, no remaining blocking finding**, after the IME guard finding was fixed. [Application CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42309007148) covers that revision: repository, build/typecheck, units, vet, real SQLite, actual Firefox/Wails/Go integration, host restrictions and exact restart. The reviewer inspected actual CI 390 Dark / 1440 Bright captures; automation covers all four widths/themes. The user subsequently accepted the functionality and authorised finalisation/merge as recorded below. Final closure still requires its review/checks and confirmed merge. No generated output is committed.

## Remaining obligations

Nonempty world effects, independent correction Undo boundaries, module/lore/memory reconstruction, historical prose edits, other modes/providers and broader library lifecycle remain later. Temporary passage-editor history remains later; removing DEV-003D does not erase its original acceptance history or certify IDEA-0004/R06. B9-D12 remains **DEFERRED — NO WORK**. Parent DEV-003 and IDEA-0004 remain PARTIAL; original notes stay in production. No next child starts automatically.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
