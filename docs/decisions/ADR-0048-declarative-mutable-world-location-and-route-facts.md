---
id: ADR-0048
type: adr
status: accepted
related:
- ADR-0046
- ADR-0047
- ADR-0045
- ADR-0042
- ADR-0044
- PRD-0039
- PRD-0036
- PRD-0034
supersedes: []
---

# Declarative Mutable World Location and Route Facts

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B6-D07](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B6-D07%20-%20Declarative%20Mutable%20World%20Location%20and%20Route%20Facts.md) · approved at: 2026-10-31; approved by: requesting user (explicit Option A approval)

## Approval and provenance

**Explicit acceptance, 2026-10-31:** “Review B6 Batch 2: B6-D05: A; B6-D06: A; B6-D07: A. Notes: for d05. we'll remove the bracelet assignment only if we implement that feature where we have the anatomy where hands or arms are real. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B6 review.”

This ADR records **B6-D07 Option A**, independently from D06 A and D05 A's anatomy condition. Original B6-D07 alternatives and proposal history remain in the [B6 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md).

## Accepted decision — Option A

**When accepted narration or an explicitly committed player correction establishes that a door, container, route, structure, place or environmental property has changed, record that current fact as a typed declarative property/relationship assertion associated with engine-owned stable identities.**

- **Typed outcomes rather than procedural proof:** Prefer current `SetDoorState`, `SetRouteStatus`, `Set/Clear` location attributes and keyed `Add/RemoveRoute`-style assertions for grounded facts. These event names are illustrative, not an approved final JSON schema. Don't require a past key acquisition, source holder, earlier known travel edge, prior journey or game-simulation cause as a condition for representing an accepted outcome.
- **Reconstruct current context:** Replay the single ordered current event sequence from Turn 0, with last-supported assertion determining current tracked door/route/property values and keyed relationship additions/removals updating current graph context. Preserve stable/sparse IDs and unknown values when earlier history never established the object's origin.
- **Future narration/travel relevance:** Current doors, bridge conditions and route connectivity inform subsequent map views, context retrieval and **optional pre-narration travel attempt guardrails**, where selected by the player. **Changing a route now does not rewrite, reject, delete or invalidate an already accepted earlier journey.**
- **Grounded extraction, not mere mentions:** Only established accepted facts, or explicit player edits after Commit, change state. A remembered bridge, rumour about a collapse, hypothetical future event or unsuccessful door-opening attempt does not automatically set current status. Unsupported environmental prose remains valid narrative text.
- **Technical coherence:** Relationship keys, typed identity, event schema support and deterministic current graph representation remain mandatory; don't infer a traversable route from a hierarchy parent or invent links/keys/destinations. Malformed required-core payloads and unsafe/stale transactions fail safely, but fictional impossibility is not a rejection reason.
- **Player and storage boundaries:** Internal IDs and mappings never enter prose-generating narrator prompts (B6-D04). Manual edits remain noncanonical until explicit Commit using the shared chat overlay. Go/SQLite maintains atomic, idempotent version/epoch-safe storage; TypeScript maintains grounded interpretation and replay. No historical revision archive, AI retroactive repair or compulsory world simulation.

## Alternatives considered

1. **Option A — accepted:** Current door/route/environment assertions, with future context updates and no retroactive mechanical validity checks. Meaningful, replayable narrative memory.
2. **Option B — rejected:** Re-evaluate and rewrite accepted older journeys after a current route change. Violates story-authorial canon and revision-free current history.
3. **Option C — rejected:** Treat environmental changes as cosmetic map-only annotations without replayable current world facts. Loses established story context.

## Deferred engineering questions

Exact route/property event keys and shared entity type registry, optional graph policies, unknown/unset semantics, location-hierarchy technical integrity, environment plugin boundaries, concurrent manual edits and UI representation remain later contracts; no implementation or integration test claim.

## Traceability

[B6 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), [B6-D01](ADR-0042-narrative-first-declarative-outcome-events.md), [B6-D03](ADR-0044-grounded-declarative-location-and-scene-presence.md), [B6-D04](ADR-0045-narrator-safe-entity-references-and-internal-identity-resolution.md), [IDEA-0038](../product/PRD-0039-persistent-location-state-and-travel-interactions.md), [IDEA-0035](../product/PRD-0036-configurable-travel-graph-rules.md), [IDEA-0033](../product/PRD-0034-hierarchical-world-locations.md). Owners S05/S06/S09/S11/S12.

## Decision history

- **2026-10-28:** B6-D01 approved declarative state assertions, replacing simulation-first mechanics.
- **2026-10-30:** B6-D07 A/B/C alternatives proposed, with A recommended but unapproved.
- **2026-10-31:** User explicitly approved **B6-D07 A**, separately chose D06 A and D05 A with structured-anatomy prerequisite. No other B6 decision, formal B6 closure or implementation inferred.
