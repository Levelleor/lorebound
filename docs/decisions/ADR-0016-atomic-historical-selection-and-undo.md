---
id: ADR-0016
type: adr
status: accepted
related:
- ADR-0042
- ADR-0014
- ADR-0015
- ADR-0007
- ADR-0009
- PRD-0068
- ADR-0008
- ADR-0010
- ADR-0011
- PRD-0042
- PRD-0005
supersedes: []
---

# Atomic Historical Selection and Undo

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B3-D03](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B3-D03%20-%20Atomic%20Historical%20Selection%20and%20Undo.md) · approved at: 2026-10-27; approved by: requesting user (explicit chat approval)

Partially superseded by [ADR-0017](ADR-0017-single-current-history-without-revisions.md).

## Later accepted narrative-first event semantics — 2026-10-28

**Current governing architecture:** [B6-D01](ADR-0042-narrative-first-declarative-outcome-events.md). Persistent world events primarily **remember the world as established by accepted narration and explicit player corrections**. They are **declarative, typed current-fact assertions** (Set/Clear, Create/Remove, keyed relation Add/Remove), not transfer/movement procedures whose fictional source state must be proven. Order and the latest supported assertion determine current projected holder, location, status and relationships. A historical edit may remove the introduction of an item or character without making later established facts invalid; sparse stable identity and unknown former details are permitted. Retain deterministic representability, technically valid types/IDs, one projected physical placement per item, transactional atomicity, version checks and required-core format failures. **No old story/event revisions**, no automatic AI repair, no extra manual Quick Start approval. This later choice supersedes broad simulation-style validation phrasing in original approval history below, without rescinding its unrelated accepted design.



## Approval and provenance

**Accepted Option A by the requesting user on 2026-10-27:** `B3-D03: A` in the B3 Batch 1 decision message. B3-D01 and B3-D02 were independently approved in that same reply. This ADR records D03 only and refines, but does not reopen, B2 history semantics.

## Context

A confirmed historical passage edit changes the current passage revision and may change which later passages/events remain in the single active canon. Committed Undo also changes active selection. A partial persistence sequence could leave narrative, provenance and replayed world state disagreeing. B2-D01/D02/D04 require immutable audit history and explicit selected events; B2-D03 requires deterministic Turn-0 reconstruction for authoritative replay.

## Accepted decision — Option A

**Represent confirmed Keep Later Turns, Delete All After Point and committed Undo as typed active-history selection changes within a single prepared atomic canonical commit.**

- S05 TypeScript computes the proposed selected passage revisions, ordered active history and event membership against a known current adventure version; S06 applies established gameplay/structural checks as applicable. S12 Go verifies storage integrity and expected adventure version/library epoch, then commits the complete change or none.
- **Keep Later Turns:** Commit the edited passage's new structured revision while retaining the edited passage's **existing accepted outcome events** and **all later active passages and their accepted events**, even if revised prose contradicts their original premise. Immutable event provenance continues to identify the **original** source passage revision; never reattribute it to rewritten prose.
- **Delete All After Point:** Commit the edited passage's new revision, keep its existing accepted events unless separately changed, and remove **all subsequent passages/events** from the **active selected history**. Old durable audit records remain intact, not selectable as an alternate timeline.
- **Committed Undo:** Move the selected active head backward by one available committed **story turn**, without introducing a player-facing canonical Redo or variant browser. Exact turn/commit boundaries for manual state-only changes require further contract refinement.
- **Continue Editing and Discard:** Are noncanonical draft/editor choices, not canonical selection commits.
- A stale, rejected or maintenance-blocked request changes **neither** canonical revision **nor** event membership/head. After a successful commit, invalidate or deterministically reconstruct derived world state as required; do not make noncanonical draft state authoritative.
- **Do not** physically delete immutable history merely to remove it from active canon, automatically regenerate later prose, infer missing state, suspend/reinstate ordinary retained events, or ask AI to reinterpret accepted outcomes. Optional downstream semantic re-evaluation remains unaccepted Inbox IDEA-0067.
- Confirmed historical operations use the [B3-D01](ADR-0014-prepared-atomic-canonical-commit-envelope.md) envelope and [B3-D02](ADR-0015-idempotent-canonical-commit-attempts.md) operation identity.

## Alternatives considered

1. **A — Accepted:** Single atomic revision/active-selection transaction; reliable, deterministic and consistent with existing event sourcing.
2. **B — Rejected:** Separate revision, event-membership and head writes with compensating cleanup. Partial failure could corrupt active canon.
3. **C — Rejected:** Physically delete superseded immutable passage/event audit records. Contradicts accepted historical provenance.

## Deferred engineering details

Exact active-selection SQL representation, ordering, inclusive/exclusive truncation boundary, handling a state-only commit adjacent to committed Undo, mistaken-truncation recovery, noncanonical stale-draft UX, independent Fork copying and derived cache invalidation remain for later explicit contract review. No automatic branch/redo feature or per-adventure export/import is approved. No code or integration testing is claimed.

## Traceability

[B3 Batch 1 proposal](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md); [B2-D01](ADR-0007-immutable-outcome-events-and-atomic-commits.md), [B2-D02](ADR-0008-immutable-history-and-single-active-selection.md), [B2-D03](ADR-0009-turn-0-replay-for-authoritative-reconstruction.md), [B2-D04](ADR-0010-retained-history-and-suspended-unrepresentable-effects.md), [B2-D05](ADR-0011-canonical-structured-passage-documents.md); [IDEA-0041](../product/PRD-0042-historical-edit-confirmation-and-bulk-truncation.md), [IDEA-0004](../product/PRD-0005-retry-undo-and-alternative-continuations.md). Owners S05, S06, S12.

## Decision history

- **2026-10-27 — Proposed, unapproved:** B3 Batch 1 presented Option A (atomic active selection), B (separate writes/compensation) and C (physical deletion of superseded audit).
- **2026-10-27 — Explicit approval:** User selected **B3-D03: A**. No schema, SQL, implementation, Batch 2 or staging promotion was approved.
