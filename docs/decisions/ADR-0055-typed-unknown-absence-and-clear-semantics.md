---
id: ADR-0055
type: adr
status: accepted
related:
- ADR-0056
- ADR-0057
- ADR-0049
- ADR-0052
- ADR-0054
supersedes: []
---

# Typed Unknown Absence and Clear Semantics

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B7-D04](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md) · approved at: 2026-10-31; approved by: requesting user (explicit Batch 2 Option A approval)

## Approval and provenance

**Explicit user approval, 2026-10-31:** “Review B7 Batch 2: B7-D04: A; B7-D05: A; B7-D06: A. Notes: for D06: should we also record the map is a graph object or something? Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue B7.”

This ADR accepts **B7-D04 Option A** from the [B7 Batch 2 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md). The map question applies to D06, not D04. D05 and D06 have separate ADRs. No code, final literal type declarations, stage promotion or B7 closure is authorised.

## Inherited architecture

[B6-D08](ADR-0049-distinct-unknown-absent-and-known-current-facts.md) already approved semantic separation of unknown/unrecorded, explicitly absent and known valued current fields. [B7-D01](ADR-0052-versioned-typed-declarative-event-envelope.md) chose a versioned typed declarative envelope with domain-defined fields. This decision refines the **representation discipline**, not the product meaning.

## Accepted Option A

1. **Field-defined semantic states:** Every supported typed property declares its meaningful current result states and value type. Where applicable, a field distinguishes **unknown/unrecorded**, **known absent/none** and **known value**; not all fields need all three.
2. **Set with typed payload:** `Set(entityId, fieldKey, typedResult)` (illustrative, not final JSON API) establishes a source-grounded validated known value or an explicit known absence when the field supports it. Numeric `0`, boolean `false`, empty string and explicit `none` are not interchangeable with `unknown`.
3. **Clear has explicit unset meaning:** `Clear(entityId, fieldKey)` is a current assertion intentionally making the affected field **unset/unknown according to its registered semantics**. It must not covertly mean “known absent,” force a value default, or resurrect an older assertion by scanning backward. The latest applicable assertion determines the field's current projected state.
4. **Typed envelopes and safe evolution:** A reader and migration can distinguish missing field data, explicit absence and supported typed values without relying on arbitrary JavaScript truthiness checks or overloaded JSON `null`. Exact serialization tags and field catalogue are later refinements. Unsupported required-core schemas, malformed payloads and unsafe storage remain technical errors; fictional contradictions are not.
5. **Only grounded assertions:** Narration and explicitly committed player corrections establish state. Unstated or ambiguous mentions leave fields unrecorded; no guessed facts or internal entity IDs in prose-producing prompts. Candidate extraction lifecycle remains [B7-D03 Option C](ADR-0054-discard-unresolved-extraction-suggestions-without-diagnostics.md): silently discard uncertain automatic suggestions.
6. **Cross-module projections:** The same field registry meanings apply to inventory custody, optional equipment, character location and presence, status fields, anatomy if implemented, doors and route states, respecting existing ownership boundaries. No parallel authoritative snapshot.

## Rejected alternatives

- **B (not selected):** An undifferentiated untagged JSON `null` for both unknown and explicit absence. Loses accepted semantic information.
- **C (not selected):** Clearing a field restores whichever earlier historical value existed. This replaces a current declarative assertion with unintended time-travel semantics.

## Deferred contracts

Exact TypeScript union syntax, JSON tags, missing/null handling, migration conversion, field-specific `none` support, conflict and projection tests, and storage format. No implementation claim.

## Decision history

- **2026-10-31:** B7-D04 A/B/C proposed with A recommended and **unapproved**; inherited B6-D08 was already accepted.
- **2026-10-31:** User explicitly selected **D04 A**, separately D05 A and D06 A with a map/graph design question. Original alternatives retained in B7 review.
