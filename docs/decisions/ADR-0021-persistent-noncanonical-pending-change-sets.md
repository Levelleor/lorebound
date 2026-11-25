---
id: ADR-0021
type: adr
status: accepted
related:
- ADR-0022
- ADR-0023
- ADR-0019
- ADR-0020
- ADR-0018
- ADR-0017
- PRD-0052
supersedes: []
---

# Persistent Noncanonical Pending Change Sets

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B3-D08](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B3-D08%20-%20Persistent%20Noncanonical%20Pending%20Change%20Sets.md) · approved at: 2026-10-27; approved by: requesting user (explicit chat approval)

Partially superseded by [ADR-0031](ADR-0031-discard-stale-pending-manual-drafts.md).

## Approval and provenance

**Explicitly accepted by the requesting user on 2026-10-27**: “Review B3 Batch 3: B3-D08: A; B3-D09: A; B3-D10: A. Record only accepted decisions in Lorebound GitHub ADRs, preserve approval history, then assess B3 closure.”

This ADR records **only B3-D08 Option A** as proposed in [Pass B3 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md), not blanket approval of technical implementation choices, staging promotion, or formal B3 closure.

## Context

[B3-D06](ADR-0019-pending-manual-state-corrections-and-explicit-commit.md) accumulates manually edited world-state deviations in a noncanonical pending change set, committed only on the player's explicit Commit. [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md) covers the entire chat composer while the proposal remains unresolved. Losing pending edits on a page reload would unnecessarily discard work. Lorebound already uses Go-managed SQLite for its noncanonical prose drafts.

## Accepted decision — Option A

**Persist the current pending manual change set as a noncanonical draft in the Go-managed SQLite library, and restore it on reload without automatically committing it.**

- Keep the pending change set **separate from the current canonical passage/event sequence**. Persist the intended edited values/deltas and enough context to identify its **adventure and base expected adventure version**; do not treat its presence as a new canonical event, transaction, or committed world state.
- Saving the pending draft is **not** the player's canonical Commit action: no accepted outcome events, adventure-version advance, gameplay transaction, AI call, or finalisation occurs solely from draft persistence, reload, navigation, timeout or application restart.
- On reopening the relevant adventure/editing context, restore an available saved pending proposal and show the **B3-D07 composer overlay**, with approval/review and Discard controls. If there are no actual remaining deviations after comparison with current canon, the pending state may clear through ordinary review.
- **Before approving**, refetch/check the current adventure version and relevant state. If another tab or a library restore advanced/replaced canon, **do not automatically apply, rebase or silently drop the pending proposal**. Follow [B3-D05](ADR-0018-reject-stale-canonical-submissions-and-refetch.md) and [B3-D10](ADR-0023-pending-commit-failure-recovery.md): player review and fresh preparation are required.
- **Discard** deletes the pending draft for the targeted change set and leaves accepted canon unchanged. A successful, durably confirmed Commit clears or reconciles the pending draft with newly accepted state. A failed or uncertain Commit does **not** silently remove it.
- Under the accepted **global Go maintenance fence**, noncanonical pending-draft writes must not bypass backup/restore coordination. Existing library-epoch checks remain in force for canonical writes.
- This applies at minimum to manually edited world-state change sets approved by B3-D06. When other workflows have a corresponding explicit pending-commit state, use the common overlay under B3-D07; their exact draft/persistence semantics are not expanded without separate review.

## Alternatives considered

1. **Option A — accepted:** Noncanonical SQLite persistence of the most recent pending proposal; resilient to reload; requires draft lifecycle and stale-state checks.
2. **Option B — rejected:** Only browser-tab memory; simpler but loses pending work on reload or restart.
3. **Option C — rejected:** Commit on exit/reload; contradicts the explicit player Commit requirement.

## Consequences and deferred contract details

The draft's exact table/JSON representation, autosave timing, independent contexts across multiple tabs, whether there is one shared last-write-wins slot, crash-during-draft-save behaviour, application-wide navigation policy and backup snapshot details remain later engineering/interface questions. **Do not assume a hidden multi-tab lock, duplicate queued proposals or historical revisions.** Stale rejection and error resolution follow the accepted D05/D10 policies. No product implementation or test result is claimed.

## Traceability

[B3 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md); [B3-D04](ADR-0017-single-current-history-without-revisions.md), [B3-D05](ADR-0018-reject-stale-canonical-submissions-and-refetch.md), [B3-D06](ADR-0019-pending-manual-state-corrections-and-explicit-commit.md), [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md), [IDEA-0051](../product/PRD-0052-browser-persistent-story-database.md). Owners S04, S05, S06, S12.

## Decision history

- **2026-10-27 — Proposed, not accepted:** B3 Batch 3 offered A (noncanonical SQLite pending-draft persistence), B (memory-only pending edits), and C (auto-commit on reload/exit).
- **2026-10-27 — Explicit approval:** User selected **B3-D08: A**; separately approved D09 and D10 in the same response, and requested a B3 closure assessment, **not** yet formal closure.
