---
type: architecture-decision
status: accepted
decision_id: "B8-D01"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B8 Batch 1 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - spatial-canvas
  - architecture-decision
---

# B8-D01 — Hierarchical local coordinate frames on one persistent world canvas

## Later explicit B8-D06 B override — 2026-10-31

[Accepted B8-D06 Option B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) supersedes the earlier paragraph below saying a new location with unknown coordinates **must always remain unplaced**. New accepted locations are now **automatically assigned and persisted initial positions within the appropriate supported local frame**, with **system-generated origin distinct from established story geography**. Users can then intentionally move them and Commit. The **hierarchical local frame** and deterministic transform choice of this D01 Option A remains accepted; what changed is **how the initial coordinate is obtained**. Never invent a known journey distance or override manually committed pins merely to lay out the canvas.



## Approval and provenance

**Explicit user selection, 2026-10-31:** “Review B8 Batch 1: B8-D01: A; B8-D02: A; B8-D03: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

This accepts **B8-D01 Option A** from the [B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md). D02 and D03 are separately approved. B8 remains in review; no exact coordinate schema, implementation, stage promotion or design closure is approved.

## Accepted decision — Option A

**Represent the user-facing world map as one persistent, zoomable semantic spatial canvas, using nested local coordinate frames and declared scale/transform semantics for supported containing regions and their placed descendants.**

1. **Location placement:** A placed world location has a stable internal identity and a **durable semantic position relative to its containing spatial frame**. A continent/country, city, building or room may itself define a local coordinate frame and meaningful spatial extent. Different nested scales need not force a universal pixel/metre ratio. These are world-map facts, not merely widget layout preferences.
2. **Deterministic composition:** Compose validated parent/group transforms to render the descendant's position and appropriately scaled footprint in the **same overall canvas**. Deliberately moving a parent/group can move its displayed descendants coherently **without rewriting all their local placements**, preserving their relative geometry. Exactly how transforms, orientations and units are serialized remains deferred.
3. **Meaningful relative geography:** Positions, footprint sizes and visible separation should express plausible setting-relative size and distance at the appropriate scale, including empires, cities, buildings and rooms. Graph auto-layout and label-collision algorithms must **not overwrite saved semantic coordinates**.
4. **Containment versus geometry versus routes:** A location's parent/group is not automatically a walkable route; spatial proximity does not invent roads. The existing acyclic containment relationship and accepted keyed travel graph remain **different semantic layers** projected alongside spatial positions.
5. **Sparse/unplaced:** If fiction establishes a location but not its position or supported scale, keep **unknown/unplaced geographic placement** rather than generating exact coordinates or a fake road merely to fill the map. A noncanonical suggested visual layout is not a canonical geographic assertion.
6. **Player control and replay:** A deliberate position/frame/extent edit is a semantic world-map correction governed by [B8-D03](./B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) and the existing pending player Commit/Discard boundary. Panning/zooming only alters the presentation viewport. Stable placed coordinates survive reopen, current-history replay, supported migration and Fork under the existing single-current-history design.
7. **No new movement simulation:** Repositioning a city pin does not automatically relocate characters, change city membership, rewrite routes, recalculate accepted journeys or veto accepted narration.
8. **Technical integrity:** Supported typed coordinates, parent-frame associations and transform composition must yield deterministic renderable positions and reject impossible *technical* structures (such as a containment/transform cycle), not fictional impossibilities. Do not leak internal location IDs into narrator prompts.

## Alternatives recorded

- **A — accepted:** Persistent hierarchical local coordinate frames and typed scale/transform composition on one canvas.
- **B — not chosen:** A single flat universal coordinate unit for all world/room scales.
- **C — not chosen:** Persist only topology/containment and let graph auto-layout choose geography, contradicting [B7-D10](./B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md).

## Deferred refinements

Actual coordinate and unit types, transform composition conventions, geographic/non-geographic containment cases, shape geometry, non-Euclidean settings, rendering/zoom implementation, frame version migrations and collision/visibility behaviour. The user approved the **frame strategy**, not an exact algorithm or TypeScript class.

## Traceability

[B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md); [B7-D10](./B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md); [B7-D06](./B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md); [IDEA-0033](../../staging/Hierarchical%20World%20Locations.md); [IDEA-0037](../../staging/Zoomable%20Node%20Map%20Canvas.md). Relevant owners S04/S05/S06/S11/S12.

## Decision history

- **2026-10-31:** B7-D10 explicitly accepted pinned spatial canvas, nested groups and meaningful scale, leaving concrete coordinate frames open.
- **2026-10-31:** B8-D01 Options A/B/C presented as **unapproved**; A recommended.
- **2026-10-31:** User explicitly selected **B8-D01 A** alongside D02 A/D03 A. Original options remain in the review; implementation and B8 closure not approved.
