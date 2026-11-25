---
id: ADR-0049
type: adr
status: accepted
related:
- ADR-0050
- ADR-0051
- ADR-0042
- ADR-0045
- ADR-0043
- ADR-0047
- ADR-0048
supersedes: []
---

# Distinct Unknown Absent and Known Current Facts

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B6-D08](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B6-D08%20-%20Distinct%20Unknown%20Absent%20and%20Known%20Current%20Facts.md) · approved at: 2026-10-31; approved by: requesting user (explicit Option A approval)

## Approval and provenance

**Explicit user decision, 2026-10-31:** “Review B6 Batch 3: B6-D08: A; B6-D09: A; B6-D10: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history, then assess B6 design closure.”

This ADR accepts **B6-D08 Option A alone** from the [B6 Batch 3 proposals](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md). D09 and D10 are separately approved in their own ADRs. The user requested an **assessment**, not formal B6 closure; no implementation, future options or staging promotion is implied.

## Context

The narrative-first tracker records only what accepted fiction/player corrections establish ([B6-D01](ADR-0042-narrative-first-declarative-outcome-events.md)). An item might have an unknown current holder, be explicitly unheld, or be known to be inside a chest. Character status may be unrecorded, `false` or `0`. Conflating these states makes the narrator invent negative facts, defeating the tracker's purpose.

## Accepted decision — Option A

**Preserve three distinct meanings wherever a supported field admits them: an unknown or unrecorded fact, an explicitly known absence/none, and a known value.**

- **Unknown/unrecorded:** No grounded accepted assertion has established a current value, or an accepted clear/unset operation intentionally leaves it unspecified. Do **not** infer “not possessed,” “uninjured,” “no route,” “zero” or “false” from lack of information.
- **Explicit known absence/none:** An accepted assertion affirmatively establishes that a condition, possession or relationship is absent, where the field's declared type supports that meaning. This is **positive knowledge of absence**, not missing information.
- **Known value:** A grounded accepted typed `Set` establishes a specific value, which may legitimately be `0`, `false`, an empty string or an explicit `none` marker depending on the field. Do not erase this distinction through defaulting or truthiness checks.
- **Ordered updates:** The latest applicable assertion for the stable entity and field determines the current projected fact. `Clear` or equivalent must have an explicitly defined **field-specific** meaning; it cannot silently turn unknown into confirmed absence. Only grounded accepted events or explicit player-approved corrections change canon. No simulation-style predecessor or fictional feasibility check.
- **Applies across modules:** Item holder/location and equipment, character presence/status/anatomy, door properties and route relations follow consistent unknown-vs-absent semantics where those distinctions make sense. A keyed relationship removed by an explicit accepted fact does not imply the absence of unrelated unknown relationships.
- **Replay and model boundaries:** Types and event schema versions remain deterministic and supported; preserve the same meanings during Turn-0 replay, current-only history edits, Fork and upgrade migrations. Narrator-facing context expresses facts in ordinary language and does not include internal IDs ([B6-D04](ADR-0045-narrator-safe-entity-references-and-internal-identity-resolution.md)).
- **Player correction:** Manual changes remain noncanonical pending proposals until the user explicitly Commits; typed storage and Go/SQLite atomic/version/epoch safeguards remain.

## Alternatives considered

1. **A — accepted:** Explicitly distinguish unknown/unrecorded, known absent/none and known present/value. Requires field-specific schema/UI semantics, avoids invented facts.
2. **B — rejected:** Treat unknown or cleared values as explicit absence. Invents negative world facts.
3. **C — rejected:** Demand inferred/model-filled values for all fields. Encourages hallucinated completeness.

## Deferred work

Exact type tags and serialization (missing vs null vs explicit none), field-specific Clear operation semantics, unknown state display, relation-key semantics, schema migration handling and replay fixtures remain engineering details. This decision does not require every supported field to use all three states, or add compulsory RPG statistics.

## Traceability

[B6 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), [B6-D01](ADR-0042-narrative-first-declarative-outcome-events.md), [B6-D02](ADR-0043-one-item-identity-and-declarative-equipment-placement.md), [B6-D06](ADR-0047-flexible-declarative-character-status-assertions.md), [B6-D07](ADR-0048-declarative-mutable-world-location-and-route-facts.md). Owners S05/S06/S10/S11/S12.

## Decision history

- **2026-10-31 — Originally proposed, unapproved:** D08 A typed unknown/absent/known distinctions (recommended), B collapse unknown into absence, C fill missing values by inference.
- **2026-10-31 — Explicit acceptance:** User selected **B6-D08 A** alongside separate D09 A and D10 A approvals, asking for GitHub ADRs and a closure **assessment only**. Original proposal and alternatives retained; no implementation approval.
