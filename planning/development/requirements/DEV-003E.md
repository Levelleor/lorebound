---
type: development-requirements
status: verified-on-confirmed-merge
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003E"
parent: "DEV-003"
tags:
  - planning/development
  - requirements
---

# DEV-003E — Committed Story turn Undo and composer correction

The user rejected DEV-003D's composer-only interpretation and explicitly accepted one corrective PR: remove custom input Undo/Redo, implement Undo of accepted story turns, continue differently in the same adventure, verify persistence/atomicity/conflicts, independently review, and provide a reachable review address and explanation **before requesting finalise/merge approval**. That launch authorised implementation/publication; subsequent user acceptance and finalisation/merge authority are recorded below. [PR #14](https://github.com/Levelleor/lorebound/pull/14) is confirmed merged at `e31cad1d60e4d99cc3d45592b03fbca954524e61`; its historical delivery is preserved rather than relabelled as turn Undo.

## Accepted authority and dependency audit

[IDEA-0004](../../production/Retry%20Undo%20and%20Alternative%20Continuations.md), Accepted direction / Committed Undo / Same adventure may continue differently, requires deleting the latest accepted turn and reconstructing the surviving story/state back to Turn 0, without a temporary-editor depth limit. [B3-D04](../../architecture/decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) governs current-only deletion and no canonical Redo/archive; [B3-D02](../../architecture/decisions/B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md) and [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) require original-operation recovery and fresh decisions after stale rejection. [B3-D03](../../architecture/decisions/B3-D03%20-%20Atomic%20Historical%20Selection%20and%20Undo.md) is qualified by the later current-only decision. [B4-D06](../../architecture/decisions/B4-D06%20-%20Preflight%20Structural%20Integrity%20of%20Current%20History%20Mutations.md), [B2-D03](../../architecture/decisions/B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md) and [B6-D01](../../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) govern deterministic preflight/reconstruction without AI. [IDEA-0042](../../production/Snapshots%20and%20Incremental%20State%20Rebuild.md) covers complete supported-state replay, not invented world/module functionality.

Source inspection: merged code has only a minimal empty baseline, ordered structured authored/generated passages and zero world effects. Adventure version previously equalled turn count. No characters/world/lore/memory/plugin records or independent state corrections exist; [B4-D02](../../architecture/decisions/B4-D02%20-%20Undo%20and%20Truncation%20Boundaries%20for%20Independent%20Corrections.md)'s correction boundaries remain later. This child reconstructs **all currently supported state**, not nonempty world effects. Unknown effects stay read-only. Existing latest-draft autosave and independent Fork remain.

Engineering contract: canonical operations increment a monotonic adventure version while turn order remains contiguous in the surviving current story. Typed `undo_story_turn` uses the existing atomic Commit path with expected version, epoch, operation ID and pinned latest turn ID. Receipts retain technical metadata only; replay never repeats a deletion or resurrects prose. Wire v3 rejects old tabs; a transactional nonspatial database v3→v4 metadata upgrade fences binaries that still assume version equals count, preserving existing identity/history/drafts/receipts. No spatial migration, new event schema or persisted checkpoint.

## Bounded acceptance and maintained coverage

Uses existing IDEA-0004/R07–R10 and R12 IDs from [the parent inventory](./DEV-003.md), plus the affected reconstruction requirement below. Whole-IDEA certification remains incomplete.

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

The original [IDEA-0042](../../production/Snapshots%20and%20Incremental%20State%20Rebuild.md), **Reconstruct committed Undo to the immediately previous active turn**, explicitly accepts this deletion/reconstruction path. Earlier append/Fork display alone did not certify it. This child supplies newly tested bounded foundation evidence; it does not certify nonempty world or derived/module state.

| Stable ID | Full accepted obligation | Current disposition / evidence |
| --- | --- | --- |
| IDEA-0042/R01 | Committed Undo reconstructs all supported authoritative state and derived context at N−1 from the accepted baseline/surviving current history, repeatably to baseline; invalidates affected derived records, preserves source/version consistency, rejects incomplete rollback atomically, and makes a newly committed continuation the sole active future. B2-D03/B3-D04/B6-D01 qualify older checkpoint/revision prose. | **PARTIAL scoped coverage, verified only on confirmed PR #15 merge after final checks/review** for existing Story-only zero-effects state: E02–E05; coordinator exact-prefix/replacement-generation-context tests, SQLite 75-step/reopen/rollback/receipt tests and real browser Undo/restart. Nonempty entities/world, corrections, summaries/memory/cache/module invalidation remain later. No full-row certification; verified-main feature counts stay at ten partial until merge, then become eleven partial / 41 without feature-level evidence; zero complete and three formal IDEA-0006 rows remain unchanged. |

## Maintained implementation and verification

Source owners: [atomic Commit/Undo and technical history validation](../../../internal/store/story.go), [version fence](../../../internal/store/store.go), [Fork](../../../internal/store/fork.go), [coordinator/preflight/recovery](../../../frontend/src/lib/coordinator.ts), [wire contracts](../../../frontend/src/lib/library.ts), [replay](../../../frontend/src/lib/story.ts), [UI](../../../frontend/src/lib/StoryWorkspace.svelte). Existing draft storage remains separate and unchanged.

Maintained coverage: [SQLite Undo/upgrade/recovery tests](../../../internal/store/undo_test.go), [coordinator/replay tests](../../../frontend/tests/story.test.ts), [Fork recovery tests](../../../frontend/tests/fork.test.ts), [real browser Undo scenarios](../../../frontend/scripts/check-story-undo.mjs) integrated into the [browser/exact restart harness](../../../frontend/scripts/check-browser.mjs). Focused SQLite, unit, typecheck/build and browser checks passed during development; the final version-limit guard is covered by a focused unit regression. IME key coverage is synthetic; no actual OS IME certification is claimed. Independent subagent `/root/dev003e_review` reviewed the exact published source/coverage and CI captures: **PASS for `97fe7ab8ae30ce426ce42da772ccb090ed622f62`, no remaining blocking finding**, after the IME guard finding was fixed. [Application CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42309007148) covers that revision: repository, build/typecheck, units, vet, real SQLite, actual Firefox/Wails/Go integration, host restrictions and exact restart. The reviewer inspected actual CI 390 Dark / 1440 Bright captures; automation covers all four widths/themes. The user subsequently accepted the functionality and authorised finalisation/merge as recorded below. Final closure still requires its review/checks and confirmed merge. No generated output is committed.

## Review preview

The published application at `97fe7ab8ae30ce426ce42da772ccb090ed622f62` was served at **http://127.0.0.1:8082**, with the separate persistent `.local/review/dev003e` library. Firefox/Wails reachability, wire v3, served index and Story bundle were verified against the checkout. Its two-turn sample is [A lantern-lit station](http://127.0.0.1:8082/?adventure=4094003c-48c1-437b-b091-c17d6eaa432a). Only an empty review library was seeded; existing review/user data was not reset. Port 8081 was occupied, so this preview uses 8082. The disposable test listener was stopped.

Demo: type unfinished input and wait for Draft saved; click Undo turn 2, review the Turn 1 boundary, Cancel/Escape once, then Confirm Undo. Only Turn 1 remains and the input stays. Reload retains the prefix; generate/accept creates a different Turn 2. Repeated Undo reaches the unchanged beginning. Fork first if retaining the original future matters. Generation is simulated; no live world/provider claim.

Relaunch from the checkout with `bash scripts/dev.sh -port 8082 -data-dir "$PWD/.local/review/dev003e"`; Ctrl+C stops it, and review data persists. The PR/chat handoff explicitly requested actual user functional review before merge. On 2026-11-06 the user replied: “looks good to me, you may proceed after you're done”, then “continue”. In direct context of the named PR #15/sample/walkthrough, this accepts the functionality and authorises routine finalisation/merge after closure review/checks. No claim is made that the user personally executed every listed test.

## Conditional single-PR closure

[Readiness-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42309993023) covers `36b2664cb3bafe9cbfd160f2d35b9b256c763902`, including repository and full application jobs, with application sources identical to the independently reviewed implementation. Closure adds planning updates only. Final closure review and applicable final-head checks remain required before merge.

**Effective only after confirmed checked-final-head merge of this same PR:** DEV-003E is VERIFIED for E01–E07 within supported Story-only zero-effects state. IDEA-0004 remains PARTIAL; IDEA-0042 becomes PARTIAL under the scoped R01 evidence above. Counts become eleven partial / 41 without feature-level evidence / zero complete original ideas; all 52 originals remain in production and three formally certified IDEA-0006 rows remain unchanged. No additional full-row certification is inferred.

Actual merge SHA, reviewed head/tree provenance, final CI and review-listener shutdown are recorded in PR #15/final handoff. Routine closure stays on this branch, with no separate reconciliation PR, post-merge repository write or next-child launch.

## Remaining obligations

Nonempty world effects, independent correction Undo boundaries, module/lore/memory reconstruction, historical prose edits, other modes/providers and broader library lifecycle remain later. Temporary passage-editor history remains later; removing DEV-003D does not erase its original acceptance history or certify IDEA-0004/R06. B9-D12 remains **DEFERRED — NO WORK**. Parent DEV-003 and IDEA-0004 remain PARTIAL; original notes stay in production. No next child starts automatically.
