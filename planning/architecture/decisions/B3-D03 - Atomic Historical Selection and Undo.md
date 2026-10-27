---
type: architecture-decision
status: accepted
decision_id: "B3-D03"
phase: "B3"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - transaction-contracts
  - architecture-decision
---

# B3-D03 — Atomic historical selection and committed Undo

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
- Confirmed historical operations use the [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md) envelope and [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md) operation identity.

## Alternatives considered

1. **A — Accepted:** Single atomic revision/active-selection transaction; reliable, deterministic and consistent with existing event sourcing.
2. **B — Rejected:** Separate revision, event-membership and head writes with compensating cleanup. Partial failure could corrupt active canon.
3. **C — Rejected:** Physically delete superseded immutable passage/event audit records. Contradicts accepted historical provenance.

## Deferred engineering details

Exact active-selection SQL representation, ordering, inclusive/exclusive truncation boundary, handling a state-only commit adjacent to committed Undo, mistaken-truncation recovery, noncanonical stale-draft UX, independent Fork copying and derived cache invalidation remain for later explicit contract review. No automatic branch/redo feature or per-adventure export/import is approved. No code or integration testing is claimed.

## Traceability

[B3 Batch 1 proposal](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md); [B2-D01](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md), [B2-D02](./B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md), [B2-D03](./B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md), [B2-D04](./B2-D04%20-%20Retained%20History%20and%20Suspended%20Unrepresentable%20Effects.md), [B2-D05](./B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md); [IDEA-0041](../../staging/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md), [IDEA-0004](../../staging/Retry%20Undo%20and%20Alternative%20Continuations.md). Owners S05, S06, S12.

## Decision history

- **2026-10-27 — Proposed, unapproved:** B3 Batch 1 presented Option A (atomic active selection), B (separate writes/compensation) and C (physical deletion of superseded audit).
- **2026-10-27 — Explicit approval:** User selected **B3-D03: A**. No schema, SQL, implementation, Batch 2 or staging promotion was approved.
