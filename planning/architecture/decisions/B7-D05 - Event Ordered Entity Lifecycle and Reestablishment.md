---
type: architecture-decision
status: accepted
decision_id: "B7-D05"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Batch 2 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - entity-lifecycle
  - architecture-decision
---

# B7-D05 — Entity lifecycle from ordered events with later grounded re-establishment

## Approval and provenance

**Explicit user choice, 2026-10-31:** “Review B7 Batch 2: B7-D04: A; B7-D05: A; B7-D06: A. Notes: for D06: should we also record the map is a graph object or something? Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue B7.”

Accept **B7-D05 Option A** as proposed in the [B7 Batch 2 review](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md); not a silent approval of concrete schema syntax, the D06 map object shape, implementation or closure.

## Inherited authority

[B6-D10](./B6-D10%20-%20Entity%20Removal%20Distinct%20from%20Property%20Clearing.md) establishes that a destroyed/removed entity is not the same as an entity whose current holder/field is unknown. Later grounded narration can re-establish the same identifiable entity without a fictional resurrection proof. [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) and [B6-D09](./B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md) prohibit guessing whether a later same-name mention means that same entity. [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) sets the typed event envelope.

## Accepted Option A

1. **The authoritative lifecycle is reconstructed from the same ordered current event history** as the other facts. A grounded `RemoveEntity(entityId)` or equivalent marks the entity currently removed/inactive; it is a declarative lifecycle assertion, not a command that requires causal or game-mechanics validation.
2. **Later re-establishment uses grounded ordered assertions** (`Create/Restore/Set`-style, precise operation schema deferred) that explicitly establish the current existence/active state for the same unambiguously identified stable ID. Later accepted fiction wins for the current projection even without narrative proof of survival, recovery or reconstruction.
3. **Identity persists but facts need not:** A sparse identity can retain stable references while name, previous holder, status, origin or other unspecified facts remain unknown. Do not synthesize old attributes as present merely because the ID has been re-established. Decide exact retained/cleared field policy by a later typed lifecycle specification.
4. **No independent permanent tombstone ledger:** An index or cached inactive/active projection may be derived, but cannot be a second competing source of truth that overrides newer accepted events.
5. **No cascade deletion or historical repair:** Removing the entity does not erase current accepted prose or surviving ordered events; Undo/Fork/history edits follow existing current-only rules. A new mention of a similarly named object is **not** proof of reused identity; ambiguous references are discarded as automatic extraction candidates under [B7-D03 Option C](./B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md).
6. **Technical validation remains:** Typed ID, supported version, deterministic lifecycle reducer, coherent derived relationships and safe atomic Go/SQLite commits remain mandatory. Fictional continuity is not a technical constraint. Internal IDs never appear in narrator-facing prompts.

## Original alternatives

- **A (accepted):** Ordered lifecycle assertion and unambiguously grounded later re-establishment, with derived current active state and sparse identity.
- **B (not accepted):** Physically delete stable ID and cascade-delete all later references/events.
- **C (not accepted):** A separate permanent removal ledger overrides newer event assertions.

## Deferred detail

Exact `Create` vs `Restore` behaviour, whether `Set` implies active state for particular entity types, field restoration after lifecycle changes, relationship projections around inactive entities, type-specific destruction verbs, migration and replay fixtures. **Do not silently choose these behaviours** as though they were part of Option A.

## Decision history

- **2026-10-31:** B7-D05 A/B/C proposed, A recommended but unapproved; B6-D10 already settled removal ≠ property clear.
- **2026-10-31:** User explicitly selected **D05 A**, alongside D04 A/D06 A and a D06 graph-object question. No code, other B7 options, stage promotion or formal B7 closure approved.
