---
type: architecture-decision
status: accepted
decision_id: "B4-D01"
phase: "B4"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - current-canon
  - replay-contracts
  - architecture-decision
---

# B4-D01 — Total ordering of current outcome events

## Approval and provenance

**Explicit approval, 2026-10-27:** The user wrote “Review B4 Batch 1: B4-D01: A; B4-D02: A; B4-D03: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B4 review.”

This ADR records **B4-D01 Option A only**, from [the B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md). D02 and D03 are independently accepted in separate ADRs. No subsequent B4 options, implementation, staging promotion, or testing are approved by this message.

## Context

B3-D04 replaced retained passage/event revision archives with one **current** ordered event history for each adventure. B3-D06 commits manual world-state corrections as deterministic outcome events only after explicit player approval; a correction need not be attributed to a fictional new story turn. B2-D03 still requires complete deterministic replay from the Turn-0 baseline.

Without a well-defined total order, corrections between two story turns could apply unpredictably or be moved into the wrong turn during replay or Undo.

## Accepted decision — Option A

**Maintain one explicit, durable total ordering for all current accepted outcome events within an adventure.**

- Every current event has an unambiguous position in the adventure's **single replay order**. Story-derived events and independently committed manual correction events use the same ordering mechanism; no separate last-applied override authority.
- An independently committed manual correction can occupy a position **between story-turn event groups**, with player-origin/provenance and optional nearest story-turn context. It does **not** fabricate a narrative passage or require every event to be owned by a story turn.
- Deterministic TypeScript replay applies the selected current events in that order from the Turn-0 baseline, preserving already accepted outcomes without rerunning AI, randomness, external operations or fictional validation.
- Ordering, IDs and current event payload/schema versions must survive an ordinary refresh, independent adventure copy/Fork and Go/SQLite read transaction. Canonical commits and order-related changes remain B3-D01 atomic, B3-D02 idempotent, expected-adventure-version and library-epoch protected.
- The event sequence is **current only**; this decision does not reinstate immutable historical event archives, past story revisions, automatic cascade rewrites or a second world-state authority.
- **Undo/truncation behaviour is separately governed by B4-D02**; event sort order alone cannot decide whether a correction survives an edited history boundary.

## Alternatives considered

1. **A — accepted:** Explicit durable total order for all current events, including standalone corrections. Requires clear ordering semantics but makes replay and source placement deterministic.
2. **B — not selected:** Attach every manual correction to the previous story turn and replay only grouped turn events. Simplifies grouping but loses distinct event placement and can blur independent player corrections.
3. **C — not selected:** Apply manual corrections after all events as separate state overrides. Easier manual editing but breaks full event-only Turn-0 reconstruction.

## Deferred contract details

Exact storage sort key, ordering of event groups within atomic commits, placement of corrections relative to targeted earlier turns, handling structural event changes, event-ID remapping for Fork and reducer fixtures remain open. No code, tests or staging-to-production promotion is claimed.

## Traceability

[B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md), [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), [B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md), [B2-D03](./B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md). Owners S05/S06/S10/S11/S12.

## Decision history

- **2026-10-27 — Proposed, unapproved:** B4-D01 A durable total event order, B turn-only grouping, C separate override table.
- **2026-10-27 — Accepted:** User explicitly selected **B4-D01: A** in the same response as separate D02 and D03 approvals. Original alternatives retained; no later B4 choices or software implementation accepted.
