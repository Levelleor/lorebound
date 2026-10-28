---
type: architecture-decision
status: accepted
decision_id: "B4-D06"
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

# B4-D06 — Preflight structural integrity of current-history mutations

## Approval and provenance

**Explicit approval, 2026-10-27:** “Review B4 Batch 2: B4-D04: B; B4-D05: A; B4-D06: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B4 review.”

This ADR records **B4-D06 Option A**, separately from D04's selected Option B and D05's accepted Option A. Original alternatives remain in [B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md).

## Context

Manual event correction, historical truncation, and committed story-turn Undo can remove or change events within the **single current** canon. If remaining ordered events depend on deleted entities, items or references, replay might violate structural invariants. Conversely, the user's deliberate **Keep Later Turns** may leave purely fictional inconsistencies without violating state structure. These must not be confused.

## Accepted decision — Option A

**Before committing a deliberate current-history mutation, deterministically check the intended resulting event sequence for genuine structural replay/integrity conflicts, and reject invalid changes without mutating canon.**

- S05/S06 browser TypeScript computes and validates the proposed resulting ordered current-event sequence using the established deterministic domain validators, including stable IDs, custody, entity and cross-module consistency as applicable. Do not introduce a new LLM acceptance pass or second Go gameplay validator.
- A structural failure (e.g., a surviving event referring to an entity whose required creation has been removed) results in an **actionable conflict** explaining what must be corrected. No silent cascade deletion, event rewrite, suspended/reinstated historical effects, guessed state or AI repair is allowed.
- An invalid/stale proposal is **not committed**. Current canonical passage bodies, event order, state and adventure version remain unchanged; if an explicit pending-commit workflow is active, retain its noncanonical proposal and full composer overlay under B3-D07/B3-D10 until the player resolves or discards it.
- After validation, S12 Go still checks durable/storage constraints, adventure expected-version, library epoch, global maintenance fence and all-or-nothing transaction integrity under B3-D01. Browser preflight is not permission to accept a stale write or partially apply a complex event mutation.
- **Keep Later Turns** remains free to preserve existing accepted events and later passages even when the revised prose no longer justifies their fictional meaning. **Narrative mismatch is not automatically a structural invalidity.**
- Unsupported or unconvertible required **core** event formats remain subject to B2-D08 fail-closed handling; supported format upgrades follow B4-D04's coordinated current-event migration. An absent/removed optional plugin continues to receive the accepted exception without forcing migration of unavailable custom state.
- This applies to **deliberate current-event modifications**, historical Delete All After Point, committed Undo and similar mutation operations. It does **not** silently disallow a logically valid authorial action merely because world prose is surprising; nor does it approve a new event-editor feature or an arbitrary current-only rewrite command.

## Alternatives and trade-offs

1. **Option A — accepted:** Deterministic validation before acceptance, with reject-and-report for real structural conflicts. Some edits require a further deliberate correction, but active canon stays reconstructable.
2. **Option B — rejected:** Automatically cascade changes into dependent accepted events to make the edit pass. Violates explicit player intent and hides changes to surviving state.
3. **Option C — rejected:** Commit even if structural replay will fail; report errors later. Risks leaving the adventure unplayable and contradicts deterministic authoritative replay safety.

## Deferred engineering details

Precise event-dependency strategy, proposed history simulation, cross-plugin invariants, unsupported-event error type, timeout/performance budget, and UI for resolving preflight conflicts remain future contract/test work. This ADR does **not** imply a new AI model reviewer, app-wide gameplay halt, automatic prose rewriting, schema test results or production promotion.

## Traceability

[B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md), [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), [B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md), [B3-D10](./B3-D10%20-%20Pending%20Commit%20Failure%20Recovery.md), [B2-D08](./B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md). Owners S05, S06, S10, S11, S12.

## Decision history

- **2026-10-27 — Proposed, not yet accepted:** B4-D06 A deterministic preflight/rejection; B auto cascade; C commit despite invalid replay.
- **2026-10-27 — Explicit approval:** User selected **B4-D06: A**, alongside D04 B and D05 A. Only this option is approved, not a new event-edit UI, implementation or later B4 choices.
