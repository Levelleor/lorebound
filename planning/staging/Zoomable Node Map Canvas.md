---
id: "IDEA-0037"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-31"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Zoomable Node Map Canvas

## Latest accepted spatial-map definition: B7-D10 (2026-10-31)

**The map is a persistent *semantic spatial canvas*, not merely a laid-out travel graph.** [Accepted B7-D10](../architecture/decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) explicitly requires:
- **Saved, pinned location coordinates:** Every placed location has a stable map position that persists after reload/reopen; graph auto-layout cannot shuffle existing geography. Newly mentioned unplaced places remain unplaced/unknown until positioned, not assigned invented exact coordinates.
- **One zoomable/pannable canvas with nested spatial groups:** Cities, buildings, rooms, regions and empires can be visibly grouped with meaningful extents and relationships within the same map experience. Parent-child/grouping is distinct from passable roads or doorways.
- **Meaningful distances/scale and link geometry:** Locations that are fictionally farther apart must appear farther apart at the appropriate scale, and connections have visibly meaningful separations rather than arbitrary equal-length graph edges. Regional and room scales may use different linked coordinate frames; units and transforms are still engineering decisions. Route travel distance may differ from straight-line separation.
- **Persistent geographic edits, not ephemeral decoration:** Deliberately moving/repositioning a location pin, adjusting its meaningful group/region footprint or changing world-map scale is a world-map **semantic edit** that persists through the existing pending-change explicit Commit/Discard pathway. It does **not** independently change character location, containment, discovery or route availability. Pan/zoom, temporary visual previews and purely cosmetic label offsets remain presentation-only.
- **Logical graph remains underneath:** Accepted keyed route relations determine edges between stable location identities for optional routing and line drawing. The underlying graph does not determine coordinates and has no independent competing authoritative map state.

**This later explicit user direction supersedes older sentences below** claiming that location-node positioning is presentation-only, precise geographic coordinates are not assumed or whether to persist pinned positions remains completely open. The original dated staging acceptance is preserved as provenance; no canvas implementation or exact coordinate/scale schema is approved.



## Map as derived graph view, not independent canon — 2026-10-31

[Accepted B7-D06](../architecture/decisions/B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md) explicitly treats the map's **travel connections as a graph**: stable location entities are the nodes; **keyed, current route relation assertions** yield the edges. Separately, a location's acyclic containment parent and children determine the visual nested grouping, not travel edges. The map canvas **renders/edits this projected world state** through already-approved pending-Commit controls; it must not become a competing durable graph-object truth or interpret mere node selection/drag as story movement. A graph-shaped in-memory view is reasonable, but the user asked *whether* we should record a “graph object”; **no particular `Graph` class, graph library or underlying SQLite structure has been selected**. Map pan/zoom/layout and visible undiscovered node semantics are unchanged.



## Latest accepted event and narrative authority — 2026-10-28

**Current map world-memory semantics ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)):** Map nodes/links and discoverability are grounded **current declarative location/relationship assertions**. Player editing them is a **pending noncanonical change set until explicit Commit**, with the shared full-composer blocking overlay. Renaming, moving layout or stating a new location must not require old fictional travel-proof; source-grounded acceptance, stable IDs and technically coherent hierarchy still apply. Pan/zoom/layout remain presentation-only.


## Idea
Display the world as a pannable, zoomable **spatial world canvas with persisted location coordinates, meaningful scale and nested geographic groups**. Logical travel graph edges are an additional layer, not the map's positioning algorithm.

## Why this idea matters
Makes discovered places and buildings easy to navigate.

## Accepted direction
- **Interactive node-based world map:** Display established and discoverable locations on a canvas that supports **panning and zooming** over different scales of the story world.
- **Nested location groups:** Visualise the flexible location hierarchy from [[Hierarchical World Locations]] (IDEA-0033) through nested, grouped nodes, including regions, settlements, buildings, rooms and nonstandard custom place types.
- **Visual travel connections distinct from containment:** Render actual known travel graph edges separately from parent/child grouping so the UI does not suggest automatic travel access between siblings or contained locations.
- **Selection, inspection and direct world editing (user decision 2026-10-23):** Selecting a map node opens its recorded details, **including its name**, discovery status and known links, and permits the player to **edit/correct that location's information** or add new locations through valid world-state editing controls. The map is a *view/editor of recorded world state*, **not a gameplay input mode**. A click, selection, drag or node-focus action never means 'travel there' or advances a story turn.
- **Pinned semantic world coordinates:** Locations placed on the canvas retain their player-defined coordinates across reload/reopening, with relative distance and group size meaningful for the fiction. A manual map-placement correction is persistent world data and uses the existing explicit Commit/Discard workflow. Automatic graph layout must not arbitrarily replace saved geographic positions. Exact coordinate units, nested transforms and cosmetic layout offsets remain for refinement.
- **Legible and minimally overlapping:** Design the canvas to avoid unnecessary overlapping nodes, unreadable labels and obscured connections through suitable layout and collision-handling behaviour, without preapproving a specific algorithm.
- **Undiscovered is a visible node state, not a map redaction rule (user decision 2026-10-23):** Recorded world locations can appear on the player's **editable map even when marked `undiscovered`**, with their already recorded name/details inspectable and editable. A grounded discovery event may change the status to `discovered`. This marker describes in-story discovery/AI narrative knowledge, **not permission to hide or disable a location in the player's map editor**. Where genuinely restricted details need protection for a separate reason, treat that explicitly and independently; do not equate every undiscovered node with a hidden/spoiler-blocked node.
- **Coherent canonical geographic state:** Persistent map coordinates/meaningful group extents are world-map facts associated with stable location identities; grouping and traversable routes remain separate accepted relationships. Deliberate map repositioning changes saved **geographic placement**, but does **not by itself** move characters, create roads, change containment or grant traversal.
- **Implementation choices remain open:** No accepted frontend framework or graph library. React Flow is only a brainstormed example. The zoom/group-collapse thresholds, saved-layout scheme, collision algorithms and very-large-map performance strategy remain for staging refinement.
- **Map editor vs travel controls (2026-10-23; refined by B7-D10):** The map is a world-state visualisation/editor, not a travel-command panel. Pan/zoom, select and inspect never move characters. **Deliberately repositioning a pinned location changes its semantic map coordinates** and is saved as an approved world-map correction; it still does **not** change actual character positions, containment or explicit traversable routes unless separately asserted.

## Proposed behaviour
Provide a viewport onto the persistent hierarchy and travel graph. Users pan/zoom, inspect a location and navigate from broad nested areas into more specific places. Map nodes represent stable location IDs and recorded information, including **player-visible `undiscovered` nodes**; grouping represents containment, separately styled links represent established connections, and the node's discovery marker changes independently of whether the user can inspect or edit its name. Users may reposition nodes and groups in a visual layout independent of game-world location or route semantics. Layout processing should make nodes and labels legible, with sensible handling of overcrowding. Treat discovery as **visible editable node metadata**, not automatic filtering of undiscovered nodes from the player's map. Do not feed undiscovered/secret facts into in-story AI narration as if characters know them merely because the player can inspect the world editor. Integrate world expansions and changes only after they have been validated and committed by the authoritative world model.

## Alternatives and trade-offs
A nested graph canvas is flexible for non-geographic worlds and supports traversal and hierarchy, but graph density and nesting can impair readability or performance. Automatic layout and collision avoidance may fight manual positioning, so their balance remains to be specified. Collapsing children at certain zoom levels can improve legibility but risks hiding important routes or scene context. React Flow is a possible graph UI library, **not an accepted framework or dependency**. A simpler custom canvas, other graph libraries, or alternative rendering could be considered during refinement; stable data IDs and map semantics should not depend on the chosen frontend implementation.

## Dependencies and constraints
- Render locations by stable IDs and parent/child containment from accepted [[Hierarchical World Locations]] (IDEA-0033).
- Display actual known travel connections from accepted [[Configurable Travel Graph Rules]] (IDEA-0035), distinguishing them clearly from containment links. A drawn line must not invent travel access.
- Use validated world/discovery records under [[AI World Discovery and Expansion]] (IDEA-0036). **Undiscovered locations are allowed on the user-editable map** with names and recorded details; the distinction between player-editor visibility and in-story narrator/character knowledge must be maintained. Any separately restricted secret content requires its own explicit policy, not automatic undiscovered-node suppression.
- Changes to current-scene or character location from [[Character Presence and Current Scene]] (IDEA-0034) may be reflected by the view but are not automatically caused by selecting or dragging a node.
- Panning, zooming and node selection are presentation-only and **never travel requests**. **Repositioning a pinned place is a deliberate persistent geographic world edit**, not a character travel request. Editing its other properties, discovery, hierarchy or route links remains a distinct manual world edit, through the established pending explicit Commit workflow.
- **B7-D10 now requires persistent semantic spatial coordinates and meaningful relative scale/route-link separation.** Do not assume a specific Earth-like projection, exact metric unit, image map, fixed region levels or a single global pixel-to-distance conversion.
- Do not choose React Flow or any frontend graph technology before refinement, and do not precommit a performance, collision-avoidance or saved-layout algorithm.
- Staging acceptance does not imply production approval or implemented functionality.

## Open questions
- At what zoom levels should children collapse, and how are layout positions saved?
- **Persist geographic coordinates with the adventure's world-map state** (approved B7-D10); exact coordinate-space and per-group transform persistence, and separation from transient viewport preferences, remain engineering refinements.
- How can provisional auto-placement avoid overlap **without shifting or inventing canonical pinned geographic coordinates** or hiding genuine semantic scale?
- How are cross-group edges, nested building entrances and large clusters displayed legibly?
- How should selection expose details for a location, its parent chain, current known routes and scene participants?
- How should node discovery change visible status indicators and the AI's in-story knowledge without altering the player's ability to see/edit the node's stored name/details? Any genuinely restricted secret field needs a separate explicit mechanism, not blanket suppression of `undiscovered` nodes.
- What virtualisation, grouping or rendering strategies are needed for very large worlds?
- What navigation and accessibility alternatives should support keyboard, touch, screen readers and mobile layouts?
- How should edits to location hierarchy and travel links differ from purely visual arrangement actions?

## Draft acceptance criteria
- [ ] A player can pan and zoom a node-based map of recorded world locations, including nodes marked `undiscovered`.
- [ ] Locations are represented by stable-ID nodes that may appear inside nested parent-location groups.
- [ ] Existing travel graph edges are visually distinguishable from location containment; parent/child grouping is not misrepresented as traversability.
- [ ] Selecting a node displays its recorded name, discovery state and editable details, including when `undiscovered`, without generating a travel action.
- [ ] A player can adjust the visual arrangement without modifying canonical hierarchy or travel connections.
- [ ] Placed locations retain persisted semantic positions across save/reopen and graph/layout redraw; geography and link lengths remain meaningful across relevant scales. Cosmetic label positioning may avoid overlaps without moving canonical pins.
- [ ] Locations with an `undiscovered` state may remain visible, named, inspectable and editable in the **player's map editor**. Their discovered/undiscovered state remains distinguishable for narration/character knowledge; no blanket hiding rule is derived from the flag.
- [ ] Newly committed discoveries and valid changes can appear on the map without fabricated duplicate locations.
- [ ] Map clicks/select/drag/pan/zoom **never initiate player travel or a story turn**. Deliberate **add location** or **edit/correct location data** actions can persist through the normal validated world-state edit path without interpreting the node click as gameplay input.
- [ ] Group collapse/zoom, exact coordinate transforms/units, visual label collisions, large-world performance and framework choice remain open for refinement; **persistent semantic location coordinates themselves are not optional**.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Initially a user-requested Inbox idea, now explicitly accepted into staging as a node-map UI direction.
- This is an **accepted but unrefined idea**, not a production-ready specification or implemented feature; map-layout and technical choices are deliberately undecided.

## Decisions and review history

- 2026-10-23 — **User resolved A-19/A-20:** The world map is only a representation and player editor of recorded game-world state, not an input form for travel/actions. Selecting a node never moves a character; player map interaction is for inspecting/fixing/changing location records or adding locations. Nodes may carry a visible `undiscovered` status and still display their recorded names/details for player editing; accepted discoveries switch the status to `discovered`. In-story AI knowledge is separate from player access to the editor. Earlier blanket hiding of undiscovered nodes is superseded. No production promotion.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Interactive pannable and zoomable node-based world map; nested location groups; visual travel connections distinct from containment; selection and details; adjustable layout; legible non-overlapping nodes; and hidden/discovered-location visibility. Group-collapse thresholds, layout persistence, collision algorithms, performance details and frontend graph framework left open for refinement. Moved to staging only, not production.

- 2026-10-28 — Explicit user-approved narrative-first declaration in B6-D01 governs any older contradictory mechanical/simulation prose in this staged note. Original decision provenance preserved; no implementation or stage promotion.
