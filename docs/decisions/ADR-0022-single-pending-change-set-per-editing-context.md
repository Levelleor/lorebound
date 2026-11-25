---
id: ADR-0022
type: adr
status: accepted
related:
- ADR-0021
- ADR-0023
- ADR-0019
- ADR-0020
- ADR-0018
- ADR-0014
supersedes: []
---

# Single Pending Change Set Per Editing Context

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B3-D09](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B3-D09%20-%20Single%20Pending%20Change%20Set%20Per%20Editing%20Context.md) · approved at: 2026-10-27; approved by: requesting user (explicit chat approval)

## Approval and provenance

**Explicit user approval on 2026-10-27:** “Review B3 Batch 3: B3-D08: A; B3-D09: A; B3-D10: A. Record only accepted decisions in Lorebound GitHub ADRs, preserve approval history, then assess B3 closure.”

This ADR accepts **only B3-D09 Option A**, as proposed in the [B3 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md). D08/D10 are separately approved and documented.

## Context

The player may adjust several inventory or character values while a pending change set blocks the story composer ([B3-D06](ADR-0019-pending-manual-state-corrections-and-explicit-commit.md), [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md)). Multiple queued batches would introduce acceptance order, conflicting baselines and retry/version hazards.

## Accepted decision — Option A

**Maintain one pending canonical change set per adventure/session editing context, accumulating compatible changes until the player commits or discards it.**

- On the first actual noncanonical manual deviation, begin one pending set with a known base adventure version. Subsequent **compatible** manual edits to that context update the same pending proposal (including changes that reverse prior pending values). The UI shows the net proposed outcome and distinguishes it from canon.
- There is **no queue of independent pending commits, alternate staged histories or automatic commit between edits**. The pending proposal contains the intended final changes as one atomic unit, not multiple sequential accepted events before approval.
- When a requested new action is incompatible with the existing pending set, present the conflict and require the player to **resolve the current proposal by approving or discarding**, or modifying it into a compatible set, **before** proceeding. Do not silently merge incompatible proposals or let the blocked composer bypass this rule.
- The full chat-composer overlay defined in [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md) stays in place while the pending proposal remains. Approve/Commit applies the existing validation/atomic Go flow; Discard leaves canonical state unchanged.
- Keep the pending proposal **noncanonical** and restore it from the accepted [B3-D08](ADR-0021-persistent-noncanonical-pending-change-sets.md) draft where available. Atomic accepted correction events only appear after explicit approval and durable Go commit.
- The phrase **“per adventure/session editing context”** does not itself introduce a global one-editor lease or decide whether two tabs share a single physical draft slot. Ordinary optimistic concurrency and stale rejection under [B3-D05](ADR-0018-reject-stale-canonical-submissions-and-refetch.md) still apply.

## Alternatives considered

1. **Option A — accepted:** One pending proposal aggregating compatible edits. Simplifies player choice and prevents hidden queues; disallows staging multiple independent alternative batches.
2. **Option B — rejected:** Multiple independent pending batches with a queue/selector. Adds ordering and version/conflict complexity.
3. **Option C — rejected:** Automatically accept current pending changes when a new edit begins. Contradicts explicit approval.

## Consequences and deferred details

Exact handling of overlapping editing contexts, multiple browser tabs, pending form navigation, simultaneous noncanonical prose edits, visibility of a “change summary,” batch-level validation UI, and canonical-turn adjacency remain implementation/refinement questions. No new global lock, playable history branch, promotion or implementation is approved.

## Traceability

[B3 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md); [B3-D06](ADR-0019-pending-manual-state-corrections-and-explicit-commit.md), [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md), [B3-D08](ADR-0021-persistent-noncanonical-pending-change-sets.md), [B3-D01](ADR-0014-prepared-atomic-canonical-commit-envelope.md). Owners S04, S05, S06, S12.

## Decision history

- **2026-10-27 — Original proposal:** B3-D09 Option A (one compatible pending set), B (queue multiple batches), and C (auto-commit prior pending batch). All initially unaccepted.
- **2026-10-27 — Explicit approval:** User selected **B3-D09: A**, with D08 and D10 independently accepted in the same reply. No implementation or formal B3 closure accepted.
