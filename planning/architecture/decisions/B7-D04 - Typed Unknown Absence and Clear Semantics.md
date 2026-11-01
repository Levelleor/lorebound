---
type: architecture-decision
status: accepted
decision_id: "B7-D04"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Batch 2 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - event-representation
  - architecture-decision
---

# B7-D04 — Typed field semantics for unknown, explicit absence, values and Clear

## Approval and provenance

**Explicit user approval, 2026-10-31:** “Review B7 Batch 2: B7-D04: A; B7-D05: A; B7-D06: A. Notes: for D06: should we also record the map is a graph object or something? Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue B7.”

This ADR accepts **B7-D04 Option A** from the [B7 Batch 2 review](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md). The map question applies to D06, not D04. D05 and D06 have separate ADRs. No code, final literal type declarations, stage promotion or B7 closure is authorised.

## Inherited architecture

[B6-D08](./B6-D08%20-%20Distinct%20Unknown%20Absent%20and%20Known%20Current%20Facts.md) already approved semantic separation of unknown/unrecorded, explicitly absent and known valued current fields. [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) chose a versioned typed declarative envelope with domain-defined fields. This decision refines the **representation discipline**, not the product meaning.

## Accepted Option A

1. **Field-defined semantic states:** Every supported typed property declares its meaningful current result states and value type. Where applicable, a field distinguishes **unknown/unrecorded**, **known absent/none** and **known value**; not all fields need all three.
2. **Set with typed payload:** `Set(entityId, fieldKey, typedResult)` (illustrative, not final JSON API) establishes a source-grounded validated known value or an explicit known absence when the field supports it. Numeric `0`, boolean `false`, empty string and explicit `none` are not interchangeable with `unknown`.
3. **Clear has explicit unset meaning:** `Clear(entityId, fieldKey)` is a current assertion intentionally making the affected field **unset/unknown according to its registered semantics**. It must not covertly mean “known absent,” force a value default, or resurrect an older assertion by scanning backward. The latest applicable assertion determines the field's current projected state.
4. **Typed envelopes and safe evolution:** A reader and migration can distinguish missing field data, explicit absence and supported typed values without relying on arbitrary JavaScript truthiness checks or overloaded JSON `null`. Exact serialization tags and field catalogue are later refinements. Unsupported required-core schemas, malformed payloads and unsafe storage remain technical errors; fictional contradictions are not.
5. **Only grounded assertions:** Narration and explicitly committed player corrections establish state. Unstated or ambiguous mentions leave fields unrecorded; no guessed facts or internal entity IDs in prose-producing prompts. Candidate extraction lifecycle remains [B7-D03 Option C](./B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md): silently discard uncertain automatic suggestions.
6. **Cross-module projections:** The same field registry meanings apply to inventory custody, optional equipment, character location and presence, status fields, anatomy if implemented, doors and route states, respecting existing ownership boundaries. No parallel authoritative snapshot.

## Rejected alternatives

- **B (not selected):** An undifferentiated untagged JSON `null` for both unknown and explicit absence. Loses accepted semantic information.
- **C (not selected):** Clearing a field restores whichever earlier historical value existed. This replaces a current declarative assertion with unintended time-travel semantics.

## Deferred contracts

Exact TypeScript union syntax, JSON tags, missing/null handling, migration conversion, field-specific `none` support, conflict and projection tests, and storage format. No implementation claim.

## Decision history

- **2026-10-31:** B7-D04 A/B/C proposed with A recommended and **unapproved**; inherited B6-D08 was already accepted.
- **2026-10-31:** User explicitly selected **D04 A**, separately D05 A and D06 A with a map/graph design question. Original alternatives retained in B7 review.
