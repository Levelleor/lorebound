---
type: brainstorm
status: active
mode: autonomous
topic: "World locations, NPC placement, travel rules and zoomable nested graph"
goal: "Make places, paths and character presence persistent, navigable game entities rather than improvised prose."
created: 2026-10-16
updated: 2026-10-16
sources: []
outputs: []
tags:
  - planning/brainstorm
  - planning/world
---
# World Map and Location Rules Brainstorm

## Goal
Make places, paths and character presence persistent, navigable game entities rather than improvised prose.

## Context
- Retrospective consolidation of the project-design conversation through 2026-10-16. This records wishes, proposals, trade-offs, and open questions; it is **not** an implementation specification or approval to ship.
- Repository guidance: [[Start Here]] (in the planning vault) and the repository AGENTS.md. No application functionality is asserted as implemented.
- Terminology: **User direction** = explicitly expressed preference; **AI possibility** = suggested but not selected; **Open** = requires a design decision.

## Two distinct relationships
- **Hierarchy/containment:** world → region → settlement → building → room (or other nested locations).
- **Travel graph:** directed/bidirectional traversable edges with possible locks, travel cost, conditions or permission.
- A room being inside a building does NOT establish which other rooms it can reach.
- Map screen coordinates are separate from authoritative world positions and connections.

Example: Aetheria → Northern Kingdom → Ravenfall → Silver Inn → Common Room / Guest Room; Ravenfall also contains a Blacksmith and Town Square.

## World/location data (proposal)
Stable ID, name, aliases, type, parent location, description, discovery status (unknown / rumoured / discovered / visited), adjacency/edge constraints, present characters and world objects, tags, custom fields, and visual layout coordinates. Proposed generated locations receive validated unique IDs; generated names need collision disambiguation.

## Characters and scene presence
- Every character has an actual current location, including player and NPCs.
- Only the NPCs in the immediate relevant scene are **present participants**.
- Remote characters may appear as lore/memories/mentions, but should not spontaneously act in the scene.
- Distinguish *nearby*, *co-located*, *known elsewhere*, *unknown whereabouts* and *in transit*.
- On movement, update location via event; update scene context and map/projection from that same event.
- Locations themselves can change: doors locked/unlocked, looted containers, buildings altered/destroyed, NPCs entering/leaving.

## Settings to keep separate
1. **Enforce graph connectivity:** only allowed connection edges can be traversed; do not teleport.
2. **Allow world expansion:** model can propose discovering/creating new places and attaching new valid edges.
3. **Travel granularity:** one edge per turn vs route/path traversal with intermediate events.
4. **Discovery/privacy:** show known locations, rumoured places and hidden nodes differently.
5. **Simulation strictness:** which narration movements are proposals requiring validation.

## Movement validation example
Player says “I leave the square and head to the castle,” but Castle is not adjacent.
~~~json
{"allowed":false,"reason":"NOT_ADJACENT","currentLocationId":"town-square","destinationId":"castle","allowedNext":["silver-inn","blacksmith"]}
~~~
- **Explicit UI click destination:** IDs are known, so TypeScript can validate directly.
- **Freeform prose destination:** interpretation usually requires LLM semantic parsing; “pay the king a visit” might refer to castle.
- **Narrator-invented transition:** requires a plan/constraint and/or post-draft extraction; reject/repair before final authoritative commit in strict mode.
- If expansion is allowed and the model discovers a cave in forest, it may propose **create location + connect cave to forest + enter cave** as one validated batch.

## Map experience
- Zoomable, pannable canvas showing nested locations, parent groups, edges and item/NPC markers.
- Zoom out to region/settlement; zoom in to buildings/rooms; clicking reveals text description, lore, occupants and reachable neighbours.
- Automatic layout and collision avoidance: nodes cannot visually overlap or sit unreasonably close.
- Allow deliberate manual drag/reposition, save UI positions separately from historical world movement.
- Candidate implementation: React Flow with nested groups and an auto-layout/collision pass; technology not chosen.
- Avoid treating canvas pixel distance as automatic travel distance; authoritative path graph determines reachability.
- Optional travel-path UI, breadcrumb hierarchy, fog-of-war/reveal settings, entry/exit handling, and location-level event history.

## World creation risks
- AI might invent duplicate inns or inconsistent names; maintain IDs and aliases.
- If location group is town, a child inn and a separate town node need clear graph connection conventions.
- Narration may describe a fast journey across several nodes; policy must determine legal multi-hop movement.
- Character position needs a unique current-location invariant, except explicitly modelled transit/unknown states.
- A destroyed route can invalidate previously planned travel; validation uses current snapshot.


## Session Log
- 2026-10-16 — **User idea:** World/map with AI-discovered named nodes, grouped buildings and towns, zoom and spatial separation.
- 2026-10-16 — **User direction:** Characters belong to locations; absent NPCs can be mentioned but should not suddenly participate.
- 2026-10-16 — **User idea:** Optional locked-connections graph means model-generated travel must be validated.
- 2026-10-16 — **AI possibility:** Separate hierarchy from adjacency, and separate graph enforcement from world expansion.

## Current Threads
- Define graph edge semantics across nested group boundaries and multi-hop routes.
- Define optional strict adjacency and world-expansion policies.
- Determine how a narrator should repair rejected invented movement.
- Choose layout algorithm and details of zoom-based grouping.

## Decisions
- World map and persistent character location are explicit user directions.
- The strict travel graph is a desired **configurable** setting, not a universal restriction.
- Generated location discovery and nested location groups are part of the envisioned world system.

## Outputs
- None. No idea has been promoted to staging or production by this documentation request.

## Resume Here
Work through a location transition end-to-end: freeform ambiguous destination, locked edge rejection, newly discovered room/cave, and scene/NPC presence updates.
