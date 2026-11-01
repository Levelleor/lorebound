---
type: architecture-decision
status: accepted
decision_id: "B9-D09"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 3 option selection)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - region-geometry
---

# B9-D09 — Validate overlapping mutable regions without inferring containment

## Approval

**Explicit user approval, 2026-10-31:** “Review B9 Batch 3: B9-D07: B; B9-D08: A; B9-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option A.** Supported regions can overlap or partly intersect and their saved outlines can change. Only technical geometry/schema constraints determine whether a shape can be accepted.

## Accepted design

1. **Allow overlap and resizing:** A well-formed region, administrative jurisdiction, city boundary, fictional zone or other type-supported outline/extent may intersect or overlap another valid footprint. No universal no-overlap invariant is imposed.
2. **Validate geometric representation:** Check supported schema/version, stable frame/location references, finite typed points/transform values, coherent supported shape structure and any documented type-specific restrictions. Precise polygon winding, rings, holes, degenerate edges and self-intersection handling remain engineering decisions. Fictional political plausibility is **not** a Go or TypeScript technical validation gate.
3. **Keep different relationship types distinct:** Moving or resizing a border cannot by geometry alone modify explicit parent/child containment, stable entity identity, administrative ownership, road/door/portal relation, character presence or travel status. Such relationships change only through separately accepted supported assertions.
4. **Versioned current spatial facts:** Mutable region outlines are typed accepted current-world spatial assertions under [B8-D04](./B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md), [B9-D05](./B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md) and Go/SQLite atomic commit boundaries. The renderer's cached polygons and picking indexes are replaceable projections.
5. **Automatic layout and distance contracts:** [B9-D04 C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) allows later automatic movement of saved pins, and [B9-D08 A](./B9-D08%20-%20Event%20Triggered%20Deterministic%20Spatial%20Reconciliation%20and%20Conflict%20Reporting.md) controls triggers; neither alone warrants rewriting region membership. [B9-D07 B](./B9-D07%20-%20Automatic%20Numeric%20Metre%20Conversion%20of%20Qualitative%20Geography.md) addresses geographic metre conversion, not polygon overlap or political control.

## Original alternatives

- **A — ACCEPTED:** Permit valid type-appropriate overlapping/intersecting outlines; validate technical shape coherence; maintain independent containment and routes.
- **B — not selected:** Enforce a blanket no-overlap rule.
- **C — not selected:** Infer containment/travel/ownership directly from geometric intersection.

## Deferred engineering and history

Specify concrete outline/holes/multipolygon conventions, transform projection, selecting overlapping regions, split/merge/clear semantics, event migrations and mock fixture matrix later. No geometry engine, renderer, implementation, tests or B9 closure authorised.

- **2026-10-31:** B8-D04 A explicitly accepted dynamic region borders and independent containment.
- **2026-10-31 — explicit selection:** User selected **B9-D09 A**, alongside D07 B/D08 A, reinforcing the type-specific overlap model.
