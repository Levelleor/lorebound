---
type: architecture-decision
status: accepted
decision_id: "B3-D09"
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

# B3-D09 — Single pending change set per editing context

## Approval and provenance

**Explicit user approval on 2026-10-27:** “Review B3 Batch 3: B3-D08: A; B3-D09: A; B3-D10: A. Record only accepted decisions in Lorebound GitHub ADRs, preserve approval history, then assess B3 closure.”

This ADR accepts **only B3-D09 Option A**, as proposed in the [B3 review](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md). D08/D10 are separately approved and documented.

## Context

The player may adjust several inventory or character values while a pending change set blocks the story composer ([B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md), [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md)). Multiple queued batches would introduce acceptance order, conflicting baselines and retry/version hazards.

## Accepted decision — Option A

**Maintain one pending canonical change set per adventure/session editing context, accumulating compatible changes until the player commits or discards it.**

- On the first actual noncanonical manual deviation, begin one pending set with a known base adventure version. Subsequent **compatible** manual edits to that context update the same pending proposal (including changes that reverse prior pending values). The UI shows the net proposed outcome and distinguishes it from canon.
- There is **no queue of independent pending commits, alternate staged histories or automatic commit between edits**. The pending proposal contains the intended final changes as one atomic unit, not multiple sequential accepted events before approval.
- When a requested new action is incompatible with the existing pending set, present the conflict and require the player to **resolve the current proposal by approving or discarding**, or modifying it into a compatible set, **before** proceeding. Do not silently merge incompatible proposals or let the blocked composer bypass this rule.
- The full chat-composer overlay defined in [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) stays in place while the pending proposal remains. Approve/Commit applies the existing validation/atomic Go flow; Discard leaves canonical state unchanged.
- Keep the pending proposal **noncanonical** and restore it from the accepted [B3-D08](./B3-D08%20-%20Persistent%20Noncanonical%20Pending%20Change%20Sets.md) draft where available. Atomic accepted correction events only appear after explicit approval and durable Go commit.
- The phrase **“per adventure/session editing context”** does not itself introduce a global one-editor lease or decide whether two tabs share a single physical draft slot. Ordinary optimistic concurrency and stale rejection under [B3-D05](./B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) still apply.

## Alternatives considered

1. **Option A — accepted:** One pending proposal aggregating compatible edits. Simplifies player choice and prevents hidden queues; disallows staging multiple independent alternative batches.
2. **Option B — rejected:** Multiple independent pending batches with a queue/selector. Adds ordering and version/conflict complexity.
3. **Option C — rejected:** Automatically accept current pending changes when a new edit begins. Contradicts explicit approval.

## Consequences and deferred details

Exact handling of overlapping editing contexts, multiple browser tabs, pending form navigation, simultaneous noncanonical prose edits, visibility of a “change summary,” batch-level validation UI, and canonical-turn adjacency remain implementation/refinement questions. No new global lock, playable history branch, promotion or implementation is approved.

## Traceability

[B3 review](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md); [B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md), [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md), [B3-D08](./B3-D08%20-%20Persistent%20Noncanonical%20Pending%20Change%20Sets.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md). Owners S04, S05, S06, S12.

## Decision history

- **2026-10-27 — Original proposal:** B3-D09 Option A (one compatible pending set), B (queue multiple batches), and C (auto-commit prior pending batch). All initially unaccepted.
- **2026-10-27 — Explicit approval:** User selected **B3-D09: A**, with D08 and D10 independently accepted in the same reply. No implementation or formal B3 closure accepted.
