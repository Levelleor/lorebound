---
type: architecture-decision
status: accepted
decision_id: "B2-D02"
created: "2026-10-25"
updated: "2026-10-28"
approved_at: "2026-10-25"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
  - architecture-decision
---

# B2-D02 — Immutable history and single active selection

## Subsequent accepted architectural supersession — 2026-10-28

**CURRENT AUTHORITY:** [B6-D01 — Narrative-first declarative outcome events](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), together with [B3-D04 — Single current history](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), supersedes earlier simulation-style event preconditions and prior immutable passage/event audit assumptions in this ADR. The engine primarily **tracks the fictional facts established by accepted narration and player corrections**. Events are ordered typed **Create/Remove, Set/Clear and keyed relation Add/Remove assertions**, not procedural transfers or movement operations that must prove historic source possession, prior introduction, prior route or fictional causality. A later accepted reference may construct a **sparse stable identity** when its old introduction has been removed; unspecified fields remain unknown. Preserve technical typed/supported-format, deterministic folding, version/epoch, atomic transaction and one-current-property safety. Only a **technically unprocessable** event fails closed; narrative contradiction does not. The original earlier approval and alternatives below are **historical provenance**, not permission to reinstate rejected prerequisites or old revision archives. Actual implementation remains unapproved.



## Decision status and provenance

**Accepted by the requesting user on 2026-10-25** in B2 Batch 1: `B2-D02: accept`. This records D02 only, independent of the same reply's `B2-D03: revise`. It preserves existing product decisions rather than approving a new variant-history feature.

## Context

Lorebound supports mutable player-authored prose, passage-level revisions, committed Undo, historical editing with Keep Later Turns or Delete All After Point, and separate independent adventure Fork. Previous revisions/events require durable provenance, but old revisions need not remain **active** after player changes. A single adventure must not expose selectable in-story alternate futures.

## Accepted decision

**Keep historical passage revisions and accepted outcome events immutable, and represent current canon as one durable, explicit active-history selection per adventure.**

- Stable logical passage/turn identities have distinct committed revisions. The active selector determines the current applicable passage revisions, their associated accepted event/outcome membership and the active story head in deterministic order.
- Superseding a revision, committed Undo or removing later turns from active canon **does not physically overwrite the old historical provenance**. Inactive audit records are not a selectable alternate branch or a promise of canonical Redo.
- **Keep Later Turns:** atomically accept the revised earlier passage while retaining the later accepted passages and their recorded outcomes, even where the earlier fictional premise no longer supports them. No new AI call, automatic narrative rewrite, inferred replacement fact or compensating item is authorised. The player can manually correct canon as a separate validated historied edit.
- **Delete All After Point:** atomically select the revised earlier passage and remove subsequent turns/events from the *active* timeline without corrupting retained audit history.
- **Committed Undo:** atomically select the preceding committed turn head; it is not temporary editor Undo, Retry, a retained candidate list or a player-visible redo stack.
- **Independent Fork:** copies/reconstructs an appropriate committed prefix into a separate adventure identity; it does not insert an alternate branch selector into the source adventure.
- **Continue Editing / Discard:** leave the active canonical selection untouched until explicit confirmation. Each canonical change remains expected-version and library-epoch guarded by Go/SQLite.

## Considered alternatives

1. **Accepted:** Immutable audit history with one active selection/head per adventure.
2. **Not selected:** Destructively overwriting/deleting older accepted source revisions and provenance.
3. **Not selected:** Exposing a selectable tree of alternate in-story futures or retaining Undo candidates as player-selectable Redo variants.

## Consequences and design still open

- **Benefits:** traceability, deterministic history selection and coherent semantics for Undo, editing and independent Fork without player-facing branch complexity.
- **Cost:** requires a reliable active selection model and strict distinction between historical audit records and current canonical state.
- **Open:** exact active selector representation, event invalidation membership, ordering of compound revisions, event replay failures after changed earlier premises, draft recovery and details of whole-passage split/merge lineage (further B2 decisions).
- **Not approved by this ADR:** B2-D03 checkpoint or replay optimisation policy; it was marked **revise** in the same user reply.

## Traceability

Subsystems S03, S05, S06, S12. Sources [IDEA-0003](../../staging/Direct%20Editable%20Prose%20Document.md), [IDEA-0004](../../staging/Retry%20Undo%20and%20Alternative%20Continuations.md), [IDEA-0039](../../staging/Event-Sourced%20World%20History.md), [IDEA-0040](../../staging/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md), [IDEA-0041](../../staging/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md); Pass A audit A-02, A-06 and A-07; B1-D03/D06.


## Decision history

- **2026-10-25:** Proposed in the B2 first decision batch: immutable history with a single active selection for passage revisions/events.
- **2026-10-25:** User explicitly approved `B2-D02: accept`, without conditions. D03 remains separately under revision.
