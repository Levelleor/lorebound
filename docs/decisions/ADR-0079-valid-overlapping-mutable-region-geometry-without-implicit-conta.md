---
id: ADR-0079
type: adr
status: accepted
related:
- ADR-0077
- ADR-0078
- ADR-0065
- ADR-0075
- ADR-0074
supersedes: []
---

# Valid Overlapping Mutable Region Geometry Without Implicit Containment

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D09](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D09%20-%20Valid%20Overlapping%20Mutable%20Region%20Geometry%20Without%20Implicit%20Containment.md) · approved at: 2026-10-31; approved by: requesting user (explicit B9 Batch 3 option selection)

## Approval

**Explicit user approval, 2026-10-31:** “Review B9 Batch 3: B9-D07: B; B9-D08: A; B9-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option A.** Supported regions can overlap or partly intersect and their saved outlines can change. Only technical geometry/schema constraints determine whether a shape can be accepted.

## Accepted design

1. **Allow overlap and resizing:** A well-formed region, administrative jurisdiction, city boundary, fictional zone or other type-supported outline/extent may intersect or overlap another valid footprint. No universal no-overlap invariant is imposed.
2. **Validate geometric representation:** Check supported schema/version, stable frame/location references, finite typed points/transform values, coherent supported shape structure and any documented type-specific restrictions. Precise polygon winding, rings, holes, degenerate edges and self-intersection handling remain engineering decisions. Fictional political plausibility is **not** a Go or TypeScript technical validation gate.
3. **Keep different relationship types distinct:** Moving or resizing a border cannot by geometry alone modify explicit parent/child containment, stable entity identity, administrative ownership, road/door/portal relation, character presence or travel status. Such relationships change only through separately accepted supported assertions.
4. **Versioned current spatial facts:** Mutable region outlines are typed accepted current-world spatial assertions under [B8-D04](ADR-0065-mutable-spatial-region-footprints-separate-from-containment.md), [B9-D05](ADR-0075-validated-local-frame-coordinates-and-mutable-region-geometry.md) and Go/SQLite atomic commit boundaries. The renderer's cached polygons and picking indexes are replaceable projections.
5. **Automatic layout and distance contracts:** [B9-D04 C](ADR-0074-all-coordinates-eligible-for-automatic-layout.md) allows later automatic movement of saved pins, and [B9-D08 A](ADR-0078-event-triggered-deterministic-spatial-reconciliation-and-conflic.md) controls triggers; neither alone warrants rewriting region membership. [B9-D07 B](ADR-0077-automatic-numeric-metre-conversion-of-qualitative-geography.md) addresses geographic metre conversion, not polygon overlap or political control.

## Original alternatives

- **A — ACCEPTED:** Permit valid type-appropriate overlapping/intersecting outlines; validate technical shape coherence; maintain independent containment and routes.
- **B — not selected:** Enforce a blanket no-overlap rule.
- **C — not selected:** Infer containment/travel/ownership directly from geometric intersection.

## Deferred engineering and history

Specify concrete outline/holes/multipolygon conventions, transform projection, selecting overlapping regions, split/merge/clear semantics, event migrations and mock fixture matrix later. No geometry engine, renderer, implementation, tests or B9 closure authorised.

- **2026-10-31:** B8-D04 A explicitly accepted dynamic region borders and independent containment.
- **2026-10-31 — explicit selection:** User selected **B9-D09 A**, alongside D07 B/D08 A, reinforcing the type-specific overlap model.
