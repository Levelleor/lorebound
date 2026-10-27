---
type: architecture-decision
status: accepted
decision_id: "B2-D03"
created: "2026-10-26"
updated: "2026-10-26"
approved_at: "2026-10-26"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
  - architecture-decision
---

# B2-D03 — Turn-0 replay for authoritative reconstruction

## Approval and provenance

**Accepted by the requesting user on 2026-10-26:** “For d03 we go with option a.” This explicitly selects the **revised Option A** presented in B2 Batch 3 following the user's earlier instruction to “rebuild the entire state every time from 0 turn.” It replaces the **unapproved** initial B2-D03 proposal to use optional persisted checkpoints, but it does not alter the independent approved runtime allocation in B1-D06 (TypeScript S05 replay).

The user asked to discuss B2-D07 in more depth rather than approving it; B2-D07 and B2-D08 remain unapproved. This is an architecture decision only, not approval to implement any staged feature.

## Context

B2-D01 accepts immutable structured outcome events; B2-D02 accepts a single selected active history over preserved audit records; B2-D04 allows only **structurally unrepresentable** later effects to be suspended while maintaining event provenance. B1-D06 locates deterministic replay in browser TypeScript, not Go. The accepted source staging IDEA-0042 permits optional checkpoints but **does not require** them. The player prefers a simple baseline-first reconstruction model until measured performance demonstrates otherwise.

## Accepted decision — revised Option A

**Whenever an authoritative world-state reconstruction is needed, reconstruct from the validated Turn-0 baseline and deterministically replay the selected active history in order up to the requested historical point or active head.**

- Use the selected immutable event outcomes, passage revisions and supported currently installed core/module reducers to reconstruct all supported persistent state domains. Never rerun AI, random rolls, external side effects or original attempted-gameplay resolution.
- **Do not implement persisted replay checkpoints, periodic state snapshots or a replay-from-intermediate-checkpoint acceleration path** for the accepted initial design. Authoritative information remains in the baseline, selected history, accepted events and passage revisions.
- Reconstruct from Turn 0 on opening an adventure, reconstructing a historical view/selected point, after confirmed historical edits or Undo when a full authoritative rebuild is required, and after any other operation that explicitly requires authoritative reconstruction. **This does not mean replay on each UI render, keypress or passive display.**
- For a normal new committed turn or historied manual state change, an already valid current-version in-memory projection **may be updated incrementally** with newly accepted outcomes, rather than automatically replaying the entire adventure. It must remain equivalent to a full Turn-0 replay of the same selected canonical history, and be discarded/invalidated when stale. Commit acceptance still occurs solely through the atomic Go/SQLite boundary.
- An already reconstructed in-memory state may be reused for displaying the **same committed adventure version**; this is a noncanonical view/projection, **not a new persisted authoritative snapshot**. Persistent changes that matter to history must be recorded through accepted source/event records.
- Preserve the [B2-D04](./B2-D04%20-%20Retained%20History%20and%20Suspended%20Unrepresentable%20Effects.md) suspension policy and the accepted removed-plugin historical custom-state replay exception.
- Go serves version-consistent ordered records and enforces durable version/epoch/transaction integrity; Go does not replay gameplay rules.

## Alternatives considered

1. **Option A, accepted:** Full Turn-0 replay whenever **authoritative reconstruction** is needed, but permit normal incremental updates of an already valid projection after committed turns; no persisted checkpoints.
2. **Option B, not selected:** Force complete Turn-0 replay after **every canonical mutation**, including ordinary new turns and manual corrections, regardless of whether valid incremental state exists.
3. **Original B2-D03 proposal, explicitly revised:** Optional persisted checkpoints/materialized snapshots for acceleration. The user requested a simpler full-baseline reconstruction approach instead.

## Consequences, verification and open details

- **Benefit:** A single simple source-of-truth replay model, no snapshot invalidation algorithm, easy baseline-to-head correctness comparison, minimal persisted derived-state complexity.
- **Cost:** Full reconstructions take time proportional to the selected history's length and applicable event complexity. Large adventures may require measured performance limits and thoughtful progress/error UX. **Do not add checkpoint acceleration without a separate human design decision.**
- **Still open:** exact replay API and ordering contract, deterministic coverage across supported schema versions, status encoding for unrepresentable effects, when to display replay progress/errors, and version/epoch invalidation protocol (B2/B3).
- **Not accepted by implication:** B2-D07 automatic or explicit suspended-effect reinstatement, B2-D08 unsupported-core-format failure behaviour, any code implementation, or staging-to-production promotion.

## Traceability

S05, S06, S10, S11, S12; [IDEA-0039](../../staging/Event-Sourced%20World%20History.md), [IDEA-0041](../../staging/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md), [IDEA-0042](../../staging/Snapshots%20and%20Incremental%20State%20Rebuild.md); B1-D01, B1-D03, [B1-D06](./B1-D06%20-%20Browser%20TypeScript%20Event%20Replay.md), B2-D01, B2-D02 and B2-D04.

## Decision history

- **2026-10-25:** Initial proposal offered deterministic replay with optional persisted checkpoints; user marked **D03: revise**, requesting entire state rebuilt from Turn 0 instead.
- **2026-10-26:** Revised B2 Batch 3 explicitly compared **A**, Turn-0 replay for authoritative reconstruction with normal incremental commits permitted, with **B**, full Turn-0 replay after every commit. User explicitly selected **Option A**.
- **2026-10-26:** Accepted ADR recorded; B2-D07 and B2-D08 remain under review.
