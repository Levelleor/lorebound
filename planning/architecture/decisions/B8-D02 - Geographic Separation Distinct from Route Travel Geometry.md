---
type: architecture-decision
status: accepted
decision_id: "B8-D02"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B8 Batch 1 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - spatial-distance
  - architecture-decision
---

# B8-D02 — Distinguish grounded geographic separation from optional route-specific travel distance

## Later explicit B8-D06 B placement refinement — 2026-10-31

[Accepted B8-D06 B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) authorises **system-generated, saved initial location coordinates** even when narration has not established an exact map position. The older “leave coordinates unplaced” guidance below now records the earlier approval context, not today's default. **Generated geographic placement is not evidence of a canonical narrated distance**. This D02 Option A still requires geographic drawing geometry to be distinct from *grounded* route length/time/cost and any portal/winding-road semantics; never infer those story metrics from automatically allocated pixel distances.



## Approval and provenance

**User's explicit decision, 2026-10-31:** “Review B8 Batch 1: B8-D01: A; B8-D02: A; B8-D03: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

This accepts **B8-D02 Option A** from the [B8 Batch 1 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md). D01 A and D03 A were separate approvals; no exact world unit, route-cost formula, travel simulation or B8 design closure is inferred.

## Accepted decision — Option A

**Make meaningful geometric/geographic separation, visual connector geometry and optional route-specific travel properties distinct, grounded parts of the spatial-map and travel-topology model.**

1. **Semantic geographic separation:** Persist accepted location coordinates, appropriate local scale and nested spatial transforms under [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md). At the relevant level of scale, cities established far apart must not be drawn adjacent just because an abstract graph connects them; two nearby rooms should not be forced to equal length with an intercity route. Present the spatially separated endpoints honestly.
2. **Route geometry is separate:** Explicit keyed route relations from [B7-D06](./B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md) determine **connectivity**. Lines/paths drawn between pinned endpoints may include *grounded* route shapes, bends, crossings or entrance anchors. A meandering road's path length can differ from straight-line geographic separation; a portal may have exceptional nonlocal connectivity.
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

[B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md); [B7-D10](./B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md); [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md); [B7-D06](./B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md); [IDEA-0035](../../staging/Configurable%20Travel%20Graph%20Rules.md); [IDEA-0037](../../staging/Zoomable%20Node%20Map%20Canvas.md). Relevant owners S04/S06/S11/S12.

## Decision history

- **2026-10-31:** B7-D10 accepted non-arbitrary visually meaningful geographic separation/link lengths; travel-distance semantics deferred.
- **2026-10-31:** B8-D02 unapproved A/B/C proposed with A recommended.
- **2026-10-31:** User explicitly selected **B8-D02 A**, alongside separately approved D01 A/D03 A. No route metric simulation, implementation, stage promotion or B8 closure approved.
