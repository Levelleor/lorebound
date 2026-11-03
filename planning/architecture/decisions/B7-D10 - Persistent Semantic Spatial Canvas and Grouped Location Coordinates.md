---
type: architecture-decision
status: accepted
decision_id: "B7-D10"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit architectural correction in chat)"
tags:
  - planning/architecture
  - pass-b
  - world-map
  - semantic-coordinates
  - architecture-decision
---

# B7-D10 — Persistent spatial canvas with meaningful coordinates, nested groups and scaled connections

## Subsequent B9 Batch 2 override — 2026-10-31

**Later B9-D04 C and D05 A (2026-10-31):** [B9-D04 C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) means “pinned” in the older semantic-canvas description no longer implies permanent immunity from future accepted automatic layout. A committed position persists until a later deterministic, versioned, atomic spatial change, which may move **any** location. Manual moves still require explicit pending Commit. [B9-D05 A](./B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md) confirms typed frame-local geometry and mutable outlines; the canvas remains semantic rather than screen pixels or merely a travel graph.


## Subsequent explicit B8 Batch 2 corrections — 2026-10-31

**Later governing decision:** [B8-D06 Option B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) was **expressly chosen over recommended A**. All new accepted locations receive **automatic, persisted initial map coordinates**, clearly distinguished as **system-generated map placement** rather than fictional facts establishing exact distances. Players may move/reposition them through the existing explicit pending Commit boundary, and their accepted positions must not be silently replaced. This is a deliberate **supersession of this ADR's older no-generated-canonical-coordinate rule for first placement only**. Do not infer roads, character movement or travel metrics from generated map positions. [B8-D04 A](./B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md) also confirms **spatial region borders are dynamic, persistently updated world facts**, separate from canonical containment. [B8-D05 A](./B8-D05%20-%20Stable%20Cross%20Frame%20Routes%20with%20Grounded%20Door%20and%20Portal%20Anchors.md) refines explicit cross-group route/door/portal anchors. All original D10 language below remains as its time-ordered approval provenance; B7 remains design-closed and B8 open.



## Subsequent B8 Batch 1 approvals — 2026-10-31

**The semantic canvas requirement remains binding, now refined by three separately approved B8 Option A decisions.** [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) specifies **nested durable local coordinate frames and composed group transforms**; [B8-D02](./B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) distinguishes meaningful geometric separation from optional route path geometry/time/cost; [B8-D03](./B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) ensures pin/group/frame/scale edits are **versioned typed current-world facts** committed only through the established explicit pending manual workflow and Go/SQLite atomic storage. These choices answer certain originally deferred *representation strategies*, but **do not** approve a particular JSON schema, projection unit, renderer or implementation. Earlier wording below describing those strategies as open is the original, earlier-stage provenance; D10's priority over a graph-only map is unchanged. B8-D04–D06 remain unapproved.



## Subsequent B7 Batch 3 approvals — 2026-10-31

**Chronological status update:** After this user-directed D10 spatial-canvas decision was written, the user expressly accepted **B7-D07 A, B7-D08 A and B7-D09 A** in a separate B7 Batch 3 review. The statements below that call D07–D09 “unapproved” accurately describe **the time of this D10 approval**, not current status. In particular [B7-D07](./B7-D07%20-%20Versioned%20Field%20Registry%20and%20Atomic%20Meaning%20Preserving%20Event%20Migrations.md) covers meaning-preserving versioned migrations of future location-coordinate assertions, [B7-D08](./B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md) protects narrator ID privacy, and [B7-D09](./B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md) requires reproducible replay of persisted pinned positions/group geometry. **None selects an exact coordinate schema or implements the canvas.** B7 is only assessed for, not formally given, design-only closure.



## Approval and provenance

**Explicit user direction, 2026-10-31:** “for the locations, I also want to make sure we record the idea that the locations should be rather a canvas, not a graph. Like, locations should be pinned to coordinates and persist at those coordinates & the same canvas will group the locations together to form cities, buildings/rooms, empires, etc. And the links are also actually different length depending on how far the location is meant to be, so map kinda makes sense semantically to understand how large the world is. Lets ensure that's the definition, not just the ‘graph’.”

This is an **affirmative user-directed refinement** to [B7-D06](./B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md) and accepted [IDEA-0037](../../production/Zoomable%20Node%20Map%20Canvas.md), not another A/B/C selection. It makes the **persistent semantic spatial canvas** the operative **user-facing world map**. D06 remains accepted **only for the logical route-connection graph**, not as a substitute for the spatial map. B7-D07–D09 remain **unapproved**; no implementation or B7 closure is authorised.

## Problem being corrected

A graph captures **connectivity**: locations as nodes and known routes as edges. If it is laid out by an arbitrary force-directed graph algorithm, an empire can appear the size of a room, or two distant cities can look adjacent because a short line was chosen for legibility. That fails the intended map, which must communicate the **relative size, placement, nesting and spatial separation of fictional geography**.

Earlier IDEA-0037 phrasing called node dragging “presentation layout only,” listed saved positions as open, and explicitly declined to assume precise world coordinates or a scale. These are **superseded in their broad interpretation**: semantic spatial placement and persistence are now **accepted requirements**. Temporary viewport pan/zoom and purely cosmetic label offsets remain presentation concerns.

## Accepted map definition

1. **The primary map is a pannable/zoomable spatial canvas, not just a connectivity diagram.** Locations have identifiable, saved **semantic spatial positions/coordinates**, not positions regenerated arbitrarily by graph auto-layout on each opening. Positions pinned by the player persist across canvas redraws, reopening the adventure and ordinary state reconstruction. Different saved places maintain meaningful relative placement.
2. **One coherent canvas with nested/grouped location regions.** The **same map surface** represents nested or grouped worlds, empires/regions, settlements/cities, buildings and rooms, as well as unconventional setting-specific location types. Groups/containers have meaningful spatial extent/placement for their children and may be collapsed or zoomed into. Avoid assuming all worlds use a fixed geography hierarchy or that every political/fictional grouping is automatically a physical traversable connection.
3. **Visual scale carries story/world meaning.** Positions, sizes/group extents and separations should make the **relative size of places and distances between them understandable**. A long-distance city-to-city link must not be drawn as arbitrarily the same short link as neighbouring rooms if the fiction/world-map scale establishes different distances. Links on the canvas connect **spatially placed endpoints**; their displayed length/geometry reflects appropriate world distances and scale, rather than decorative graph edge length or number of hops alone.
4. **Separate conceptual layers, one map experience:**
   - **Spatial layer:** Persisted coordinates/placement, meaningful scale/group footprint and relative geometry for location identities.
   - **Containment/grouping layer:** A city belongs to a region, a room belongs to a building, etc., with flexible nested/grouped canvas representation, reflecting the existing acyclic canonical containment links where applicable.
   - **Travel topology layer:** Explicit, accepted route relationships from B7-D06 determine **whether** two places are connected/traversable. Drawing locations near one another does not create a route; nesting does not imply a doorway. Current doors/bridges can change available routes without rewriting coordinates or prior accepted travel.
   These layers must be **coherent views of one world**, not three unrelated maps competing to define reality.
5. **Persistence and authorial editing:** Actual map placement/scale and region/group geometry that represents the fictional geography are **persistent world-map state**, associated with stable location identity and subject to the existing validated/current-event or equivalent approved current-world-data durability boundary. Player adjustments to **semantic** node placement, group extent or scale are deliberate map/world edits, not silently ephemeral force-layout changes. Follow the established **pending manual change → explicit Commit/Discard** boundary for canonical world edits; no separate direct SQLite write from the canvas.
6. **Do not confuse editing geography with moving a character.** Panning and zooming change the **viewport** only. Selecting a map place does not travel there. Repositioning a location pin changes its represented **geographic position on the canvas**, not by itself its route connections, container/parent identity, character location, discovery status or travel outcome. Those require their own grounded accepted assertions or explicit correction.
7. **Narrative-first and partial geography:** When accepted narration establishes a new location but gives no supported position or distance, **do not invent exact coordinates, scale, route lengths or connecting roads** to fill a diagram. Allow a sparse/unplaced entry until the user positions it or a subsequently grounded spatial fact is accepted. Auto-layout may be an optional **noncanonical visual suggestion**, never the source of fictional spatial truth and never allowed to overwrite pinned positions.
8. **Zoom and nested distance semantics:** A room-scale plan and an empire-scale overview may naturally use **different coordinate frames, group transforms or zoom-dependent units** while remaining one coherent spatial canvas experience. The requirement is meaningful, persistent **relative positions and separations at the relevant scale**, not a forced single global pixel-to-metre ratio for every nested level. The precise coordinate-system and transform strategy remains a subsequent design decision.
9. **Route distance is not identical to Euclidean separation:** Straight-line visual distance should be grounded and visually meaningful. A winding road, portal, river crossing or exceptional nonlocal path may have a **route-specific** travel length/condition different from geometric separation. Don't fabricate route cost or make graph hop count stand in for world distance. Exact route-distance fields, geometry/polyline conventions, units and cross-scale rendering remain deferred.
10. **Identity and rendering bounds:** Engine-managed stable IDs stay internal, not in prose-producing prompts; the map shows readable names, relationships and suitable visual identifiers. Coordinate/geometry projection should have deterministic, versioned representation and coherent save/replay behaviour. No claim that the spatial canvas or its persistence has been built.

## What this refines and what stays intact

- **Refines B7-D06:** The **travel graph remains real** as a *logical derived topology*, but is **not the complete user-facing map data model** and must not control semantic node positions with arbitrary graph layout. The current map derives both **spatial geographic state** and **logical route relations**.
- **Refines IDEA-0037:** Previously accepted pan/zoom, nested groups, direct inspect/edit, visible undiscovered nodes and no-click-to-travel remain. Earlier “layout is presentation-only,” “precise world coordinates aren't assumed,” and “persistence of node positions is an open option” wording is superseded for **semantic pinned location geometry**. Cosmetic layout offsets and viewport choices can remain UI-only.
- **Preserves IDEA-0033:** Flexible containment hierarchy and acyclicity are retained. Geographic adjacency or overlapping visual placement does not silently rewrite a parent/child or travel relation.
- **Preserves IDEA-0035/B6-D07:** Configurable travel attempt guidance uses **explicit** route topology/conditions; accepted narrated arrival needs no retrospectively provable path. A route being longer/shorter on the canvas may inform narrated distances when grounded but does not mechanically veto accepted prose.
- **Preserves B7-D01 and B3/B4:** Canonical current-event semantics, manual edit approval, atomic Go/SQLite storage, no retained revision archive. A concrete canonical spatial-property/event payload shape is future work, not introduced as a second truth store.

## Example of intended behaviour (conceptual only)

- At **regional scale**, two cities are pinned far apart. Their route connector spans a visibly long geographic separation; a village close to one city is pinned nearer to it. Reopening the story does **not** shuffle those positions.
- At **city scale**, a walled district groups several buildings; zooming into a building exposes grouped rooms with their own meaningful relative layout.
- Moving a city pin as an explicit **map correction** updates its saved geographic placement after approval. It does **not** automatically create a road to a visually nearby city, relocate inhabitants or rewrite completed journeys.
- A room may be *inside* a castle but inaccessible by any accepted route; visual containment is not an assumed door.

## Unselected implementation details

No particular Cartesian/lat-long coordinate reference, world distance unit, normalisation, nested-local coordinate transform, map bounds, region outline geometry, polygon/shape system, scale bar, path-rendering spline, automatic geo-constraint solver, graph package, canvas framework, route travel metric, layer persistence table, placement AI model pass or layout algorithm is approved here. Precise handling of spatial unknowns and cross-group route geometry should be reviewed deliberately. **The semantic location/scale persistence and common canvas are requirements; those algorithms are not.**

## Decision history

- **2026-10-16–23:** User accepted IDEA-0033 nested location hierarchy, IDEA-0035 travel graph and IDEA-0037 pannable/zoomable grouped node canvas in staging; concrete coordinates, scale and persistence scope were left for refinement.
- **2026-10-31 — B7-D06:** User approved keyed relations and asked about graph representation. D06 recorded a logical *derived travel graph*, with concrete `Graph` object choices deferred.
- **2026-10-31 — Explicit further correction:** User clarified that locations must instead be **pinned to persistent semantic coordinates on a shared grouped canvas**, and link lengths/positions should convey **relative world distances and size**, not merely abstract graph connectivity. **B7-D10 is this explicitly authorised refinement**. B7-D07–D09 remain unapproved proposals; no code or stage promotion.
