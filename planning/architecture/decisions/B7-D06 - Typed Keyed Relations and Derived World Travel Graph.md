---
type: architecture-decision
status: accepted
decision_id: "B7-D06"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Batch 2 Option A approval; map graph question noted)"
tags:
  - planning/architecture
  - pass-b
  - event-representation
  - world-graph
  - architecture-decision
---

# B7-D06 — Typed keyed relationships and the derived world travel graph

## Later explicit user refinement: spatial canvas is primary (B7-D10, 2026-10-31)

**Current authoritative map definition:** [Accepted B7-D10](./B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) explicitly corrects any impression here that a **travel graph alone is the world map**. The player-facing map is **one pannable/zoomable semantic spatial canvas** with **persistent pinned coordinates**, meaningful separation/scale and nested groupings for empires, cities, buildings and rooms. Accepted travel relations still form a **derived logical graph**, but they do **not** assign arbitrary layout positions. Map route/link geometry and apparent length should convey appropriate world separation rather than uniformly short graph lines. The source of truth includes **persisted spatial placement/scale facts** as well as grounded containment and route assertions in the accepted world-state model. Earlier D06 choices about typed keyed Add/Remove relationships remain accepted, but the earlier omission of semantic coordinate requirements is now superseded.



## Approval and graph-question provenance

**Explicit user approval, 2026-10-31:** “Review B7 Batch 2: B7-D04: A; B7-D05: A; B7-D06: A. Notes: for D06: should we also record the map is a graph object or something? Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue B7.”

This accepts **B7-D06 Option A** from the [B7 review](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md). The user also asked whether the map should be recorded as a graph object. This ADR records the accepted **logical travel topology**, not a complete spatial map. **Later, B7-D10 expressly approved a persistent, semantically scaled grouped coordinate canvas** as the user-facing map, while continuing to defer the concrete `Graph` class, JSON layout, database tables, graph package and edge directionality.

## Inherited accepted constraints

- [IDEA-0033 Hierarchical World Locations](../../production/Hierarchical%20World%20Locations.md): stable location identities, flexible parent/child containment hierarchy (acyclic); containment and traversal are distinct.
- [IDEA-0035 Configurable Travel Graph Rules](../../production/Configurable%20Travel%20Graph%20Rules.md): explicit route graph and optional freeform/adjacent/multi-hop pre-acceptance attempted-travel policies; no default routing strategy or exact edge attributes yet.
- [B6-D07](./B6-D07%20-%20Declarative%20Mutable%20World%20Location%20and%20Route%20Facts.md): mutable routes, bridges, doors and environment recorded as current declarative facts and affect **future** context, not old journeys.
- [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md): no fictional prior possession/travel-legality gate for accepted story facts.
- [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md): versioned typed declarative event representation; [B7-D04](./B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md): unknown/absence/value distinctions.

## Accepted decision — Option A

1. **Typed keyed relation identity:** Each supported current relationship is distinguished by a deterministic **relation key** incorporating owning domain, relation type and the relevant stable endpoint(s), target identity or relation identity. Direction and multiplicity are part of the **domain's declared schema** where relevant. Avoid treating two different route edges as the same merely because locations have similar names. Exact key string, ordering of endpoints, directedness and multigraph support are deferred.
2. **Declarative Add/Remove:** Supported `AddRelation(key, ...)` and `RemoveRelation(key)`-style assertions are **idempotent current facts** in one existing durable total order. The latest accepted assertion for a given relation key determines its current existence/absence. Repeating an addition does not duplicate the same edge; a later grounded addition can re-establish a previously removed relationship. Unknown unrelated relations are not invented.
3. **Logical travel map = derived graph projection:** Locations are **nodes identified by stable location IDs**; **explicit, accepted travel/route relationship assertions are edges** (possibly with status/conditions from current door/route/environment assertions). The current route graph is **derived deterministically from accepted route assertions**, and a browser TypeScript reducer may expose an adjacency/edge-index view for pathfinding. Under later B7-D10, **saved spatial coordinates, group extents and scale also form authoritative world-map data**, projected alongside the route graph rather than generated arbitrarily from it. The underlying durable authority is current accepted world-state data/events, not a separately mutable route graph competing with spatial canvas state.
4. **Containment hierarchy remains separate from traversal:** Parent/child region-building-room nesting is an acyclic grouping relation, **shown within the same shared spatial canvas** under later B7-D10. It never automatically establishes a traversable edge. Physical position/scale, containment and route relations are **different semantic layers** of one map, not interchangeable graph edges.
5. **Current states and travel policy:** A destroyed bridge or locked door may change current edge availability/conditions in the derived graph. Optional strict travel attempts can consult that graph **before narration is accepted**. Once narration or an explicit player correction establishes a character's arrival, it is a grounded current location fact regardless of a missing earlier traversable route. Never retroactively revalidate or rewrite accepted journeys.
6. **Sparse identity and technical integrity:** A later grounded route assertion may mention locations whose old introduction was removed, leaving sparse typed node identities and unknown attributes. Preserve deterministic typed relation keys, supported payloads, no invalid containment cycles and atomic Go/SQLite commits. Do not guess endpoint identities or create a route just because the narrator named two locations.
7. **Narrator-safe presentation:** Natural-language place names/descriptions and grounded route context may be shown to the narrator, never internal IDs, raw graph mapping keys or private database tokens ([B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md)).

### Conceptual example (not a chosen implementation API)

```text
Containment:
  Castle contains Courtyard
  Castle contains Treasury

Travel graph:
  Courtyard --[north-door]--> Treasury
  Treasury --[return-door?]--> Courtyard   (only if explicitly established)

Event:
  AddRelation(routeKey, CourtyardID, TreasuryID)
  SetProperty(northDoorID, "state", "locked")

Current derived graph:
  nodes = current known location IDs
  edges = latest accepted route Add/Remove assertions
  access/availability = latest grounded door/route properties
```

The example intentionally **does not decide** whether a single route edge is directed, bidirectional, paired or carries multiple door/condition references.

## Original alternatives and selection

- **A — accepted:** Typed keyed relation identities and idempotent ordered Add/Remove assertions determining current relationship state; map/travel graph derived from current location/route facts.
- **B — not selected:** Append duplicate unkeyed relationship objects indefinitely and resolve through array position or prose.
- **C — not selected:** Treat adding routes/ownership as procedurally legal only with proof of all earlier fictional prerequisites.

## Explicitly not yet decided

A concrete `Graph` class or library, SQLite graph-table/materialized-cache design, directed/undirected/multi-edge route shape, exact coordinate reference system, multi-scale group transforms, route-distance encoding, pathfinding algorithm and default travel policy. **Later B7-D10 did explicitly settle that pinned semantic coordinates, persistence, grouped canvas and meaningful scale/link lengths are required**; only their exact technical representations remain unapproved.

## Decision history

- **2026-10-16–23:** The user previously accepted flexible hierarchical locations, configurable **travel graph** and map UI in distinct staging ideas. Graph topology versus containment was already an accepted design distinction.
- **2026-10-28–31:** B6-D07 accepted mutable current route/door assertions; B7-D06 A/B/C was later presented unapproved.
- **2026-10-31:** User explicitly selected **B7-D06 A**, alongside D04 A and D05 A, and separately asked whether the map should be recorded as a graph object. This ADR records the inherited **logical graph topology and derived-map projection** without pretending the user approved a specific `Graph` object/storage class.
