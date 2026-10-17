---
id: "IDEA-0037"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Zoomable Node Map Canvas

## Idea
Display the world as a pannable, zoomable non-overlapping graph canvas with nested groups.

## Why this idea matters
Makes discovered places and buildings easy to navigate.

## Accepted direction
- **Interactive node-based world map:** Display established and discoverable locations on a canvas that supports **panning and zooming** over different scales of the story world.
- **Nested location groups:** Visualise the flexible location hierarchy from [[Hierarchical World Locations]] (IDEA-0033) through nested, grouped nodes, including regions, settlements, buildings, rooms and nonstandard custom place types.
- **Visual travel connections distinct from containment:** Render actual known travel graph edges separately from parent/child grouping so the UI does not suggest automatic travel access between siblings or contained locations.
- **Selection and inspection:** Allow users to select a location node and inspect its current details, context and known links without requiring the whole world to be shown at once.
- **User-adjustable layout:** Players should be able to rearrange nodes or groups into a comprehensible layout. Exact layout persistence and precedence of manual adjustments over auto-layout remain to be refined.
- **Legible and minimally overlapping:** Design the canvas to avoid unnecessary overlapping nodes, unreadable labels and obscured connections through suitable layout and collision-handling behaviour, without preapproving a specific algorithm.
- **Respect discovery and secrecy:** Only reveal world nodes, details and routes appropriate for the player's established knowledge under [[AI World Discovery and Expansion]] (IDEA-0036). Hidden but stored world entities must not automatically appear on the player-facing map.
- **Consistent with authoritative world state:** Visual location IDs, hierarchy links, and travel connections are derived from current validated world data; changing the graphical arrangement must not itself mutate place containment or travel permissions.
- **Implementation choices remain open:** No accepted frontend framework or graph library. React Flow is only a brainstormed example. The zoom/group-collapse thresholds, saved-layout scheme, collision algorithms and very-large-map performance strategy remain for staging refinement.
- **Scope boundary:** This accepts a world-map *navigation and visualisation* interface, not additional approval for changing world state or automatic traversal by dragging nodes.

## Proposed behaviour
Provide a viewport onto the persistent hierarchy and travel graph. Users pan/zoom, inspect a location and navigate from broad nested areas into more specific places. Map nodes represent stable location IDs and known content; grouping represents containment, while separately styled links represent established traversable connections. Users may reposition nodes and groups in a visual layout independent of game-world location or route semantics. Layout processing should make nodes and labels legible, with sensible handling of overcrowding. Apply visibility/discovery rules before including nodes and connections in player-facing map data. Integrate world expansions and changes only after they have been validated and committed by the authoritative world model.

## Alternatives and trade-offs
A nested graph canvas is flexible for non-geographic worlds and supports traversal and hierarchy, but graph density and nesting can impair readability or performance. Automatic layout and collision avoidance may fight manual positioning, so their balance remains to be specified. Collapsing children at certain zoom levels can improve legibility but risks hiding important routes or scene context. React Flow is a possible graph UI library, **not an accepted framework or dependency**. A simpler custom canvas, other graph libraries, or alternative rendering could be considered during refinement; stable data IDs and map semantics should not depend on the chosen frontend implementation.

## Dependencies and constraints
- Render locations by stable IDs and parent/child containment from accepted [[Hierarchical World Locations]] (IDEA-0033).
- Display actual known travel connections from accepted [[Configurable Travel Graph Rules]] (IDEA-0035), distinguishing them clearly from containment links. A drawn line must not invent travel access.
- Use validated discoveries and player-visible location knowledge under accepted [[AI World Discovery and Expansion]] (IDEA-0036); hidden or secret location data should not leak merely because it exists in storage.
- Changes to current-scene or character location from [[Character Presence and Current Scene]] (IDEA-0034) may be reflected by the view but are not automatically caused by selecting or dragging a node.
- Panning, zooming, layout movements and node collapse are presentation state, not authoritative world edits. Editing a route or the hierarchy itself would require separately validated operations.
- Do not assume precise world coordinates, image maps, fixed region levels or a mandatory strict geographical scale.
- Do not choose React Flow or any frontend graph technology before refinement, and do not precommit a performance, collision-avoidance or saved-layout algorithm.
- Staging acceptance does not imply production approval or implemented functionality.

## Open questions
- At what zoom levels should children collapse, and how are layout positions saved?
- Should node placement persist per adventure, per player, per graph view, or another scope?
- How should automatic layout and overlap avoidance cooperate with user-positioned nodes and pinned layouts?
- How are cross-group edges, nested building entrances and large clusters displayed legibly?
- How should selection expose details for a location, its parent chain, current known routes and scene participants?
- Should node discovery dynamically update the canvas, and how should secret details be withheld without revealing their existence through layout gaps?
- What virtualisation, grouping or rendering strategies are needed for very large worlds?
- What navigation and accessibility alternatives should support keyboard, touch, screen readers and mobile layouts?
- How should edits to location hierarchy and travel links differ from purely visual arrangement actions?

## Draft acceptance criteria
- [ ] A player can pan and zoom a node-based map of known world locations.
- [ ] Locations are represented by stable-ID nodes that may appear inside nested parent-location groups.
- [ ] Existing travel graph edges are visually distinguishable from location containment; parent/child grouping is not misrepresented as traversability.
- [ ] Selecting a node shows relevant known location information.
- [ ] A player can adjust the visual arrangement without modifying canonical hierarchy or travel connections.
- [ ] A selected layout approach avoids unnecessary obscuring overlaps and maintains legible nodes and labels.
- [ ] Previously undiscovered/hidden locations and details are not shown solely because they exist in saved world state.
- [ ] Newly committed discoveries and valid changes can appear on the map without fabricated duplicate locations.
- [ ] The map does not grant new movement or edit world state merely because a user drags/selects a node.
- [ ] Group collapse rules, layout persistence scope, collision algorithm, large-world performance and framework choice remain open for refinement.

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
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Interactive pannable and zoomable node-based world map; nested location groups; visual travel connections distinct from containment; selection and details; adjustable layout; legible non-overlapping nodes; and hidden/discovered-location visibility. Group-collapse thresholds, layout persistence, collision algorithms, performance details and frontend graph framework left open for refinement. Moved to staging only, not production.
