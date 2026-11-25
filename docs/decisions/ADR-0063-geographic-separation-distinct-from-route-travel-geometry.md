---
id: ADR-0063
type: adr
status: accepted
related:
- ADR-0077
- ADR-0078
- ADR-0079
- ADR-0080
- ADR-0067
- ADR-0062
- ADR-0064
- ADR-0057
- ADR-0055
- ADR-0061
- PRD-0036
- PRD-0038
supersedes: []
---

# Geographic Separation Distinct from Route Travel Geometry

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B8-D02](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) · approved at: 2026-10-31; approved by: requesting user (explicit B8 Batch 1 Option A approval)

## Latest B9 Batch 3 approval — 2026-10-31

The user explicitly accepted [B9-D07 B](ADR-0077-automatic-numeric-metre-conversion-of-qualitative-geography.md), [B9-D08 A](ADR-0078-event-triggered-deterministic-spatial-reconciliation-and-conflic.md), and [B9-D09 A](ADR-0079-valid-overlapping-mutable-region-geometry-without-implicit-conta.md). **D07 B expressly overrides earlier B8 advice against inferring exact geographic metres from qualitative statements**: supported relative geography converts to exact metre constraints, with stable typed frame scale; this is an engine-derived measurement, **not** an exact surveyed narrator claim. Route length/time/cost stay separately grounded, not inferred from canvas pixels. D08 A restricts deterministic atomic re-layout to relevant accepted world changes (all pins remain moveable under D04 C), preserving conflicting accepted facts and surfacing nonblocking conflicts. D09 A accepts technically valid region overlaps without implicit containment/routes/ownership updates. **B9-D10–D12 are unapproved proposals**; B9 is still in review. Earlier text below preserves dated decisions even when superseded.


## Later explicit B8-D06 B placement refinement — 2026-10-31

[Accepted B8-D06 B](ADR-0067-automatic-persistent-location-placement-with-player-overrides.md) authorises **system-generated, saved initial location coordinates** even when narration has not established an exact map position. The older “leave coordinates unplaced” guidance below now records the earlier approval context, not today's default. **Generated geographic placement is not evidence of a canonical narrated distance**. This D02 Option A still requires geographic drawing geometry to be distinct from *grounded* route length/time/cost and any portal/winding-road semantics; never infer those story metrics from automatically allocated pixel distances.



## Approval and provenance

**User's explicit decision, 2026-10-31:** “Review B8 Batch 1: B8-D01: A; B8-D02: A; B8-D03: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

This accepts **B8-D02 Option A** from the [B8 Batch 1 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md). D01 A and D03 A were separate approvals; no exact world unit, route-cost formula, travel simulation or B8 design closure is inferred.

## Accepted decision — Option A

**Make meaningful geometric/geographic separation, visual connector geometry and optional route-specific travel properties distinct, grounded parts of the spatial-map and travel-topology model.**

1. **Semantic geographic separation:** Persist accepted location coordinates, appropriate local scale and nested spatial transforms under [B8-D01](ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md). At the relevant level of scale, cities established far apart must not be drawn adjacent just because an abstract graph connects them; two nearby rooms should not be forced to equal length with an intercity route. Present the spatially separated endpoints honestly.
2. **Route geometry is separate:** Explicit keyed route relations from [B7-D06](ADR-0057-typed-keyed-relations-and-derived-world-travel-graph.md) determine **connectivity**. Lines/paths drawn between pinned endpoints may include *grounded* route shapes, bends, crossings or entrance anchors. A meandering road's path length can differ from straight-line geographic separation; a portal may have exceptional nonlocal connectivity.
3. **Optional route-specific semantics:** Travel length, time/cost, conditions, door/bridge status, directional constraints and similar data are **optional field-defined assertions only when fiction or player-approved edits establish them**. Do **not** automatically infer canonical travel time/cost from visual line length, graph hop count, pixel spacing or a generic route-precondition simulator.
4. **Unknown remains unknown:** If there are no grounded relative positions or real route-distance claims, keep coordinate/metric/route properties unknown or unplaced under B7-D04/B7-D10. Renderer previews may convey a provisional path but cannot invent accepted geography, canonical distance or reachability.
5. **Cross-scale coherence:** The displayed line should follow the current spatial projection at its appropriate scale. Nested city and room frames may need explicit cross-frame endpoint/attachment semantics; the exact line-shape and distance-unit conversion rules are deferred.
6. **No fictional validity gate:** Optional travel policies can inform **uncommitted** action attempts; accepted narration establishing a character's arrival is still a declarative current fact without route-history proof. Closing a bridge changes future context, not old accepted journeys.
7. **Independent edits:** Repositioning a pin updates grounded semantic geographic geometry through the explicit Commit workflow but does **not automatically create/remove a route, relocate characters or change explicit route travel values**. If a map property becomes inconsistent with accepted explicit distance lore, that is a refinement/review question, not licence to silently fabricate or rewrite canonical fiction.

## Original options and disposition

- **A — accepted:** Meaningful geometric separation from pinned coordinates/scale, distinct optional grounded route-specific geometry/length/time/cost.
- **B — not selected:** Draw every route at arbitrary equal length as a purely topological graph, contradicting accepted spatial-semantic map.
- **C — not selected:** Treat straight-line screen distance as mandatory travel time/legality and reject fiction that disagrees.

## Deferred technical contracts

Exactly how distance is measured across group frames, unit conversion and user-defined scales, route geometries, polyline anchors, portals, map size validation, direction/parallel-route modelling, rendering and performance, user-visible scale bars and route-cost UI. No implementation is claimed.

## Traceability

[B8 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md); [B7-D10](ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md); [B8-D01](ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md); [B7-D06](ADR-0057-typed-keyed-relations-and-derived-world-travel-graph.md); [IDEA-0035](../product/PRD-0036-configurable-travel-graph-rules.md); [IDEA-0037](../product/PRD-0038-zoomable-node-map-canvas.md). Relevant owners S04/S06/S11/S12.

## Decision history

- **2026-10-31:** B7-D10 accepted non-arbitrary visually meaningful geographic separation/link lengths; travel-distance semantics deferred.
- **2026-10-31:** B8-D02 unapproved A/B/C proposed with A recommended.
- **2026-10-31:** User explicitly selected **B8-D02 A**, alongside separately approved D01 A/D03 A. No route metric simulation, implementation, stage promotion or B8 closure approved.
