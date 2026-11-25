---
id: ADR-0009
type: adr
status: accepted
related:
- ADR-0042
- ADR-0017
- ADR-0006
- ADR-0013
- ADR-0007
- ADR-0008
- ADR-0010
- PRD-0043
- PRD-0040
- PRD-0042
- ADR-0001
- ADR-0003
supersedes: []
---

# Turn-0 Replay for Authoritative Reconstruction

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B2-D03](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md) · approved at: 2026-10-26; approved by: requesting user (explicit chat approval)

## Subsequent accepted architectural supersession — 2026-10-28

**CURRENT AUTHORITY:** [B6-D01 — Narrative-first declarative outcome events](ADR-0042-narrative-first-declarative-outcome-events.md), together with [B3-D04 — Single current history](ADR-0017-single-current-history-without-revisions.md), supersedes earlier simulation-style event preconditions and prior immutable passage/event audit assumptions in this ADR. The engine primarily **tracks the fictional facts established by accepted narration and player corrections**. Events are ordered typed **Create/Remove, Set/Clear and keyed relation Add/Remove assertions**, not procedural transfers or movement operations that must prove historic source possession, prior introduction, prior route or fictional causality. A later accepted reference may construct a **sparse stable identity** when its old introduction has been removed; unspecified fields remain unknown. Preserve technical typed/supported-format, deterministic folding, version/epoch, atomic transaction and one-current-property safety. Only a **technically unprocessable** event fails closed; narrative contradiction does not. The original earlier approval and alternatives below are **historical provenance**, not permission to reinstate rejected prerequisites or old revision archives. Actual implementation remains unapproved.



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
- Preserve the **current** [B2-D04](ADR-0010-retained-history-and-suspended-unrepresentable-effects.md) historical-edit semantics: Keep Later Turns retains existing accepted events even when passage prose changes, and Delete All After Point excludes later turns/events from active replay. The former D04 ordinary suspension policy was superseded by explicit user clarification after this ADR's original approval. The removed-plugin historical custom-state replay exception remains.
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

S05, S06, S10, S11, S12; [IDEA-0039](../product/PRD-0040-event-sourced-world-history.md), [IDEA-0041](../product/PRD-0042-historical-edit-confirmation-and-bulk-truncation.md), [IDEA-0042](../product/PRD-0043-snapshots-and-incremental-state-rebuild.md); B1-D01, B1-D03, [B1-D06](ADR-0006-browser-typescript-event-replay.md), B2-D01, B2-D02 and B2-D04.


### Deterministic assertion folding

Replay applies surviving ordered assertions using latest-value/clear semantics per stable ID and property. An earlier deleted creation event need not be replayed for later supported SetItemHolder/SetCharacterLocation assertions to apply: sparse records with unknown history suffice. Do **not** re-run fictional action validation during replay. No persisted checkpoints.

## Decision history

- **2026-10-25:** Initial proposal offered deterministic replay with optional persisted checkpoints; user marked **D03: revise**, requesting entire state rebuilt from Turn 0 instead.
- **2026-10-26:** Revised B2 Batch 3 explicitly compared **A**, Turn-0 replay for authoritative reconstruction with normal incremental commits permitted, with **B**, full Turn-0 replay after every commit. User explicitly selected **Option A**.
- **2026-10-26:** Accepted ADR recorded; B2-D07 and B2-D08 remain under review.

- **2026-10-27 — Editorial cross-reference alignment:** Corrected the D04 reference to point to the user-clarified Keep/Truncate event policy rather than the superseded original suspension rule. B2-D03's accepted Turn-0 replay choice is unchanged.
