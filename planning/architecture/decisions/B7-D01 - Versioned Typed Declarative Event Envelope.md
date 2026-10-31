---
type: architecture-decision
status: accepted
decision_id: "B7-D01"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B7 Batch 1 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - event-representation
  - architecture-decision
---

# B7-D01 — Versioned typed declarative event envelope and domain payloads

## Approval and provenance

**Explicit user selection, 2026-10-31:** “Review B7 Batch 1: B7-D01: A; B7-D02: A; B7-D03: C. Record only explicitly accepted choices as Lorebound GitHub ADRs, preserve approval history, and continue B7.”

This accepts **Option A for B7-D01**, as presented in [B7 Batch 1](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md). B7-D02 A and B7-D03 **C, not A**, are separate choices. Recording this decision does not approve exact JSON layout, Go/SQLite tables, a complete field registry, implementation or B7 closure.

## Inherited authority

[B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) establishes Lorebound as a narrative/world-memory system: accepted narration and explicit player-authorised changes determine the facts, not a procedural game engine. [B6-D08](./B6-D08%20-%20Distinct%20Unknown%20Absent%20and%20Known%20Current%20Facts.md) separates unknown, absence and known values. [B6-D10](./B6-D10%20-%20Entity%20Removal%20Distinct%20from%20Property%20Clearing.md) separates entity lifecycle from field clearing. Event storage and migrations obey existing B2/B3/B4 contracts.

## Accepted decision — Option A

Use a **versioned, typed durable event envelope** and a **small discriminated declarative assertion vocabulary**, with domain-registered and type-checked payloads/fields.

- **Envelope responsibilities:** Identify the durable event, its unambiguous total-order position, source/provenance (accepted story passage or committed player correction), owning event domain/module and supported type/schema version and operation discriminator. Exact names, timestamps, IDs, nesting and formats remain to be refined.
- **Declarative operation shapes:** Conceptual typed `Set(entityId, fieldKey, value)`, `Clear(entityId, fieldKey)`, `CreateEntity`/`RemoveEntity` and keyed `AddRelationship`/`RemoveRelationship`. Domain definitions determine legal entity/field/value combinations and field-specific absence/clear semantics. These are *illustrative operations*, not user-approved literal JSON schemas.
- **Deterministic replay:** A supported reducer applies accepted assertions in the single current ordered stream to produce one current world-state projection. A later supported assertion replaces the current fact for its own field or relation key. Replay cannot depend on AI calls or retest whether earlier fictional possession, travel routes or cause were plausible.
- **Identity and fact grounding:** Only source-grounded resolved facts become canonical events. Engine-managed stable/sparse IDs are private implementation references; names/descriptions are supplied to the narrator without IDs under [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md). [B6-D09](./B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md) keeps ambiguous extraction candidates out of canon.
- **Technical safety, not simulated causality:** Validate parseability, supported type/version, compatible domain payloads, field semantics, identity representation, deterministic one-current-value projections and safe atomic storage. Do **not** require a previous holder, legal route or historical creator when accepted fiction establishes a later current assertion.
- **Cross-domain and plugin boundaries:** Domain/owner metadata must support the [B7-D02](./B7-D02%20-%20Core and Optional Plugin Event Ownership.md) distinction between required core and optional plugin-owned effects.
- **Current history and migrations:** [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) still retains only current passage bodies and events. [B4-D04](./B4-D04%20-%20Coordinated%20Migration%20of%20Current%20Event%20Schemas.md) requires versioned, coordinated conversion of current supported stored event schemas at upgrade, not retained old event revisions. Go/SQLite atomicity, operation IDs, epoch/version fencing remain.
- **No mandatory second model:** Single-pass prose+natural-language event reference proposals and separately routed model tasks remain allowed. The typed envelope is produced by the internal coordinator/resolver, not exposed in narrator-facing context.

## Original alternatives and disposition

- **Option A — accepted:** Versioned typed envelope with small declarative operations, domain-registered payload validation and deterministic latest-value projection.
- **Option B — not accepted:** Unversioned arbitrary JSON patches lacking stable typed registry. Hard to migrate and to distinguish absent/unknown/invalid values.
- **Option C — not accepted:** Persist procedural preconditioned game commands and validate fictional causes during replay. Contradicts B6's primary purpose.

## Deferred refinement

The final discriminated union, `Set` value-tag schema, lifecycle payloads, relationship key type and ordering, origin/source pointers, plugin ownership versioning, compatibility migration layouts, and exact TypeScript and Go transport/SQLite columns remain **unapproved engineering contracts**. This ADR does not implement the feature or authorise staging-to-production promotion.

## Decision history

- **2026-10-31 — B7 opened:** Three A/B/C proposals drafted; none automatically approved by P-B6-01 closure.
- **2026-10-31 — Explicit user choice:** D01 **A**, D02 A, D03 **C**. This ADR records D01 A alone; all original proposed alternatives remain in the B7 review.
