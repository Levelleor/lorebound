---
type: architecture-decision
status: accepted
decision_id: "B7-D09"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B7 Batch 3 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - event-representation
  - replay
  - architecture-decision
---

# B7-D09 — Minimal durable event provenance and deterministic current-history replay verification

## Approval and provenance

**Explicit user approval, 2026-10-31:** “Review B7 Batch 3: B7-D07: A; B7-D08: A; B7-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and assess B7 design closure.”

This accepts **B7-D09 Option A** from [B7 Batch 3](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md). D07 A and D08 A have independent ADRs. The instruction to **assess** B7 closure does **not** itself authorise formal closure, code changes, testing claims or staging promotion.

## Inherited architecture

[B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) keeps only the one current passage body/history and current ordered event stream; superseded/deleted old passages and event revisions are not retained in an immutable archive. [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md) gives independent manually committed corrections positions in that total order. [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) requires grounded accepted outcome assertions, and [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) accepts versioned typed event envelopes. Undo/Delete After/Fork and coordinated migration preserve the current replayable source facts, not an archival event stream.

## Accepted decision — Option A

**Persist only the durable provenance and total-order metadata necessary to associate canonical events with currently accepted story passages or explicitly committed independent player corrections, then verify that deterministic replay reconstructs equivalent current world state across supported current-history operations and schema upgrades.**

1. **Minimal source association:** A canonical event identifies its **current accepted source**: a passage/turn association where derived from narration, or a separate explicitly committed manual correction where appropriate. Include supported durable event identity, source classification and total-order location, without retaining old passage revisions or inferring actor/provenance from a name string. Exact field names/timestamps and source pointer types remain for engineering.
2. **No secondary immutable audit ledger:** Source/provenance metadata lives with the **current event history**. Historical edits that replace/delete current passages operate under previously accepted atomic deletion/boundary contracts; they do not keep every old event payload, passage revision, or unaccepted proposed extraction for audit. Fork copies independent current prefix records with coherent identifiers; there is no mutable coupling to the source adventure.
3. **Deterministic replay invariants:** Current supported typed events reduce in the one agreed total order to the same current results after reload/reopen, Undo, Delete All After, Keep Later Turns, current history editing, Fork and coordinated supported-version migration, subject to those actions' accepted semantics. **Never invoke the model to reconstruct historical events from prose during ordinary replay**.
4. **Grounding and sparse references:** Replay can preserve a later keyed property or relation whose earlier entity introduction was removed, using a minimal stable/sparse identity and leaving unknown attributes unspecified. Never fabricate old causes or delete surviving later accepted facts merely because an earlier introduction is missing.
5. **Coverage across world modules:** Future regression fixtures should include one-item/one-current-holder, distinct equipment projections, character physical/remote presence, typed absence/unknown, keyed route status, current entity Remove/Re-establish, removed optional-plugin history and B7-D10's **persistent coordinate-pinned, meaningful-scale spatial canvas**. Verify that a logical route graph overlay does not become a second map authority or override pinned geographic coordinates.
6. **Technical integrity/transactions:** Test unsupported required-core event failure, safe migration rollback, ordering/version fences, idempotent receipt handling and atomic story/event/manual-correction saves. Real failures must not be mistaken for B7-D03's deliberately **silent discard only of ambiguous optional automatic extraction candidates**.
7. **No fabricated runtime evidence:** This establishes **test obligations** and durable record design, not an assertion that any tests or migration code currently run.

## Original alternatives and disposition

- **A, accepted:** Durable minimal origin and order, deterministic replay regression contracts over only current accepted history.
- **B, not chosen:** Store event payloads with no origin/order and reconstruct their meaning/provenance later from text.
- **C, not chosen:** Reintroduce an immutable full revision/audit archive of superseded story passage/event versions solely to retain provenance.

## Deferred technical work

Final event envelope provenance JSON, precise event-versus-passage pointer cardinality, ordering key/index structure, source span representation (if any), test fixture format, cross-adventure fork ID treatment, persisted semantic map coordinates and renderer-state separation, event replay benchmarks and real Go/SQLite migration integration. Do not infer approval of any implementation or archival revision schema.

## Decision history

- **2026-10-27–28:** Current-only no-revisions policy and total ordering already accepted (B3-D04/B4-D01).
- **2026-10-31:** B7-D09 A/B/C initially proposed, with A recommended but **not yet approved**.
- **2026-10-31:** User explicitly chose **B7-D09 A** alongside separately approved D07 A/D08 A; asked for B7 **design-closure assessment only**. No formal closure sign-off yet.
