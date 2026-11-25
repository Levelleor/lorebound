---
id: ADR-0062
type: adr
status: accepted
related:
- ADR-0074
- ADR-0075
- ADR-0067
- ADR-0063
- ADR-0064
- ADR-0061
- ADR-0057
- PRD-0034
- PRD-0038
supersedes: []
---

# Nested Local Coordinate Frames on One Spatial Canvas

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B8-D01](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) · approved at: 2026-10-31; approved by: requesting user (explicit B8 Batch 1 Option A approval)

## Subsequent B9 Batch 2 override — 2026-10-31

**Later B9-D04 C and D05 A (2026-10-31):** [B9-D04 C](ADR-0074-all-coordinates-eligible-for-automatic-layout.md) permits valid future automatic coordinate changes to **all** saved positions, including those previously moved by the player. Earlier “never auto-override manually committed pin” language is superseded. [B9-D05 A](ADR-0075-validated-local-frame-coordinates-and-mutable-region-geometry.md) refines the accepted nested-frame approach with typed validated relative coordinates/transforms and mutable region outlines. Persisted geography remains deterministic and separate from viewport pixels and route travel facts.


## Later explicit B8-D06 B override — 2026-10-31

[Accepted B8-D06 Option B](ADR-0067-automatic-persistent-location-placement-with-player-overrides.md) supersedes the earlier paragraph below saying a new location with unknown coordinates **must always remain unplaced**. New accepted locations are now **automatically assigned and persisted initial positions within the appropriate supported local frame**, with **system-generated origin distinct from established story geography**. Users can then intentionally move them and Commit. The **hierarchical local frame** and deterministic transform choice of this D01 Option A remains accepted; what changed is **how the initial coordinate is obtained**. Never invent a known journey distance or override manually committed pins merely to lay out the canvas.



## Approval and provenance

**Explicit user selection, 2026-10-31:** “Review B8 Batch 1: B8-D01: A; B8-D02: A; B8-D03: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

This accepts **B8-D01 Option A** from the [B8 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md). D02 and D03 are separately approved. B8 remains in review; no exact coordinate schema, implementation, stage promotion or design closure is approved.

## Accepted decision — Option A

**Represent the user-facing world map as one persistent, zoomable semantic spatial canvas, using nested local coordinate frames and declared scale/transform semantics for supported containing regions and their placed descendants.**

1. **Location placement:** A placed world location has a stable internal identity and a **durable semantic position relative to its containing spatial frame**. A continent/country, city, building or room may itself define a local coordinate frame and meaningful spatial extent. Different nested scales need not force a universal pixel/metre ratio. These are world-map facts, not merely widget layout preferences.
2. **Deterministic composition:** Compose validated parent/group transforms to render the descendant's position and appropriately scaled footprint in the **same overall canvas**. Deliberately moving a parent/group can move its displayed descendants coherently **without rewriting all their local placements**, preserving their relative geometry. Exactly how transforms, orientations and units are serialized remains deferred.
3. **Meaningful relative geography:** Positions, footprint sizes and visible separation should express plausible setting-relative size and distance at the appropriate scale, including empires, cities, buildings and rooms. Graph auto-layout and label-collision algorithms must **not overwrite saved semantic coordinates**.
4. **Containment versus geometry versus routes:** A location's parent/group is not automatically a walkable route; spatial proximity does not invent roads. The existing acyclic containment relationship and accepted keyed travel graph remain **different semantic layers** projected alongside spatial positions.
5. **Sparse/unplaced:** If fiction establishes a location but not its position or supported scale, keep **unknown/unplaced geographic placement** rather than generating exact coordinates or a fake road merely to fill the map. A noncanonical suggested visual layout is not a canonical geographic assertion.
6. **Player control and replay:** A deliberate position/frame/extent edit is a semantic world-map correction governed by [B8-D03](ADR-0064-versioned-spatial-assertions-and-explicit-map-edit-commit.md) and the existing pending player Commit/Discard boundary. Panning/zooming only alters the presentation viewport. Stable placed coordinates survive reopen, current-history replay, supported migration and Fork under the existing single-current-history design.
7. **No new movement simulation:** Repositioning a city pin does not automatically relocate characters, change city membership, rewrite routes, recalculate accepted journeys or veto accepted narration.
8. **Technical integrity:** Supported typed coordinates, parent-frame associations and transform composition must yield deterministic renderable positions and reject impossible *technical* structures (such as a containment/transform cycle), not fictional impossibilities. Do not leak internal location IDs into narrator prompts.

## Alternatives recorded

- **A — accepted:** Persistent hierarchical local coordinate frames and typed scale/transform composition on one canvas.
- **B — not chosen:** A single flat universal coordinate unit for all world/room scales.
- **C — not chosen:** Persist only topology/containment and let graph auto-layout choose geography, contradicting [B7-D10](ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md).

## Deferred refinements

Actual coordinate and unit types, transform composition conventions, geographic/non-geographic containment cases, shape geometry, non-Euclidean settings, rendering/zoom implementation, frame version migrations and collision/visibility behaviour. The user approved the **frame strategy**, not an exact algorithm or TypeScript class.

## Traceability

[B8 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md); [B7-D10](ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md); [B7-D06](ADR-0057-typed-keyed-relations-and-derived-world-travel-graph.md); [IDEA-0033](../product/PRD-0034-hierarchical-world-locations.md); [IDEA-0037](../product/PRD-0038-zoomable-node-map-canvas.md). Relevant owners S04/S05/S06/S11/S12.

## Decision history

- **2026-10-31:** B7-D10 explicitly accepted pinned spatial canvas, nested groups and meaningful scale, leaving concrete coordinate frames open.
- **2026-10-31:** B8-D01 Options A/B/C presented as **unapproved**; A recommended.
- **2026-10-31:** User explicitly selected **B8-D01 A** alongside D02 A/D03 A. Original options remain in the review; implementation and B8 closure not approved.
