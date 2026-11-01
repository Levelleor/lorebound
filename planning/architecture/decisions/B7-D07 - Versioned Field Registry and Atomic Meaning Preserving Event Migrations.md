---
type: architecture-decision
status: accepted
decision_id: "B7-D07"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B7 Batch 3 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - event-representation
  - schema-migration
  - architecture-decision
---

# B7-D07 — Versioned field registry and meaning-preserving current event migrations

## Explicit approval and provenance

**2026-10-31 user approval:** “Review B7 Batch 3: B7-D07: A; B7-D08: A; B7-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and assess B7 design closure.”

This is an explicit acceptance of **B7-D07 Option A**, separately from D08 A and D09 A. The [B7 review](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md) preserves the original unapproved A/B/C text and its chronological later selection. The requested **closure assessment** is not an approval to formally close B7, implement code or move staging to production.

## Existing accepted constraints

- [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) selects a versioned typed declarative durable envelope and domain-owned payload registry.
- [B7-D04](./B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md) separates unknown, explicitly absent and known value, with `Clear` an explicitly current unset/unknown result, not a return to a previous event's value.
- [B4-D04](./B4-D04%20-%20Coordinated%20Migration%20of%20Current%20Event%20Schemas.md) **already accepted its Option B**: coordinated upgrade-time migration of the currently stored supported events, superseding in part B2-D06's earlier no-bulk-rewrite preference.
- [B4-D07](./B4-D07%20-%20Fail%20Safe%20Atomic%20Event%20Migration.md) already requires a fenced, all-or-nothing, fail-safe library migration for supported required core formats. Unavailable optional plugin-owned historical state retains [B7-D02](./B7-D02%20-%20Core%20and%20Optional%20Plugin%20Event%20Ownership.md)'s removal exception.

## Accepted decision — Option A

**Domain field/type definitions have explicit schema versions. On compatible application/data upgrades, deterministically and atomically migrate the currently stored supported event payloads according to tested, meaning-preserving conversion rules.**

1. **Typed versioned registry:** Each supported event domain/operation and its registered field definitions declares value types and relevant version. Migrations can identify source/target representations unambiguously instead of reinterpretation by today's field names or JavaScript truthiness.
2. **Preserve meaning:** Convert known values, explicit absence, unknown/unset and field-specific `Clear` meaning without conflation. Preserve stable entity IDs, source/origin metadata, total replay order, keyed relation identities and present entity lifecycle semantics. A schema conversion is not a story mutation, a model-generated new world fact or a fictional precondition check.
3. **Upgrade current records:** Convert only currently durable supported event data requiring schema changes, within the existing B4-D04/B4-D07 coordinated atomic upgrade. Do not maintain every old supported format forever as a normal-replay upcaster, recreate deleted historical passage revisions, or construct a second canonical history.
4. **Required core failure is safe:** If an essential core event cannot be converted deterministically and meaning-preservingly, fail the migration without publishing mixed/partial converted library state. Preserve the previous durable library and provide actionable technical failure handling. No silent skip/defaulting/invented schema data.
5. **Optional plugin exception preserved:** Removed or disabled optional plugin-specific effects do not force plugin reinstatement, emulation or historical custom-event migration. Supported **core** assertions previously produced by a plugin remain core and still require safe conversion/replay.
6. **Verification scope:** Future implementation must test supported schema version boundaries, replay-equivalent current projections before/after conversions, ID/key/provenance order preservation, rollback/fencing and sparse/unknown cases, including a persisted B7-D10 spatial-map property if/when its domain schema is implemented. These are requirements, **not evidence that tests have passed**.

## Alternatives and original recommendation

- **A, accepted:** Versioned typed field registry and deterministic, meaning-preserving coordinated migrations for supported current records.
- **B, not chosen:** Reinterpret old event data using new definitions without conversion, risking silently changed fiction facts.
- **C, not chosen:** Retain unlimited old event formats with permanent lazy upcasting in normal replay; incompatible with the earlier explicit B4-D04 upgrade choice.

## Deferred implementation contracts

Exact schema/field type registry structures, conversion function declarations and location (TypeScript vs Go orchestration), ordered migration sequencing, crash recovery, backup/restore mechanics, handling removed optional plugin data, concrete spatial-coordinate schema/transforms and regression fixtures. No implementation or staging-promotion authority.

## Decision history

- **2026-10-27:** User accepted B4-D04 **Option B** for coordinated current-only event migration; 2026-10-28 B4-D07 required fenced all-or-nothing failure behaviour.
- **2026-10-31:** B7-D07 Options A/B/C were proposed with A recommended but **unapproved**.
- **2026-10-31:** User expressly chose **B7-D07 A**, alongside separate D08 A/D09 A, and asked for an **assessment** of closure only. No formal B7 closure.
