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
- **Selection, inspection and direct world editing (user decision 2026-10-23):** Selecting a map node opens its recorded details, **including its name**, discovery status and known links, and permits the player to **edit/correct that location's information** or add new locations through valid world-state editing controls. The map is a *view/editor of recorded world state*, **not a gameplay input mode**. A click, selection, drag or node-focus action never means 'travel there' or advances a story turn.
- **User-adjustable layout:** Players should be able to rearrange nodes or groups into a comprehensible layout. Exact layout persistence and precedence of manual adjustments over auto-layout remain to be refined.
- **Legible and minimally overlapping:** Design the canvas to avoid unnecessary overlapping nodes, unreadable labels and obscured connections through suitable layout and collision-handling behaviour, without preapproving a specific algorithm.
- **Undiscovered is a visible node state, not a map redaction rule (user decision 2026-10-23):** Recorded world locations can appear on the player's **editable map even when marked `undiscovered`**, with their already recorded name/details inspectable and editable. A grounded discovery event may change the status to `discovered`. This marker describes in-story discovery/AI narrative knowledge, **not permission to hide or disable a location in the player's map editor**. Where genuinely restricted details need protection for a separate reason, treat that explicitly and independently; do not equate every undiscovered node with a hidden/spoiler-blocked node.
- **Consistent with authoritative world state:** Visual location IDs, hierarchy links, and travel connections are derived from current validated world data; changing the graphical arrangement must not itself mutate place containment or travel permissions.
- **Implementation choices remain open:** No accepted frontend framework or graph library. React Flow is only a brainstormed example. The zoom/group-collapse thresholds, saved-layout scheme, collision algorithms and very-large-map performance strategy remain for staging refinement.
- **Scope boundary clarified 2026-10-23:** The map is a **world-state visualisation and editor**, not a travel command panel or a separate player-action input format. Pan/zoom, select, inspect, and rearrange layout never cause character movement. Explicit add/edit/correct actions **may update authoritative location data** through validated, historied world-state edits; dragging a node changes only presentation layout, not physical placement/routes.

## Proposed behaviour
Provide a viewport onto the persistent hierarchy and travel graph. Users pan/zoom, inspect a location and navigate from broad nested areas into more specific places. Map nodes represent stable location IDs and recorded information, including **player-visible `undiscovered` nodes**; grouping represents containment, separately styled links represent established connections, and the node's discovery marker changes independently of whether the user can inspect or edit its name. Users may reposition nodes and groups in a visual layout independent of game-world location or route semantics. Layout processing should make nodes and labels legible, with sensible handling of overcrowding. Treat discovery as **visible editable node metadata**, not automatic filtering of undiscovered nodes from the player's map. Do not feed undiscovered/secret facts into in-story AI narration as if characters know them merely because the player can inspect the world editor. Integrate world expansions and changes only after they have been validated and committed by the authoritative world model.

## Alternatives and trade-offs
A nested graph canvas is flexible for non-geographic worlds and supports traversal and hierarchy, but graph density and nesting can impair readability or performance. Automatic layout and collision avoidance may fight manual positioning, so their balance remains to be specified. Collapsing children at certain zoom levels can improve legibility but risks hiding important routes or scene context. React Flow is a possible graph UI library, **not an accepted framework or dependency**. A simpler custom canvas, other graph libraries, or alternative rendering could be considered during refinement; stable data IDs and map semantics should not depend on the chosen frontend implementation.

## Dependencies and constraints
- Render locations by stable IDs and parent/child containment from accepted [[Hierarchical World Locations]] (IDEA-0033).
- Display actual known travel connections from accepted [[Configurable Travel Graph Rules]] (IDEA-0035), distinguishing them clearly from containment links. A drawn line must not invent travel access.
- Use validated world/discovery records under [[AI World Discovery and Expansion]] (IDEA-0036). **Undiscovered locations are allowed on the user-editable map** with names and recorded details; the distinction between player-editor visibility and in-story narrator/character knowledge must be maintained. Any separately restricted secret content requires its own explicit policy, not automatic undiscovered-node suppression.
- Changes to current-scene or character location from [[Character Presence and Current Scene]] (IDEA-0034) may be reflected by the view but are not automatically caused by selecting or dragging a node.
- Panning, zooming, node selection and layout movements are presentation only and **never travel requests**. Explicitly editing a node's properties, discovery status, hierarchy or links and adding a location are **manual canonical world-edit operations**, validated by their appropriate domain rules without requiring AI narration or gameplay travel.
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
- [ ] Locations with an `undiscovered` state may remain visible, named, inspectable and editable in the **player's map editor**. Their discovered/undiscovered state remains distinguishable for narration/character knowledge; no blanket hiding rule is derived from the flag.
- [ ] Newly committed discoveries and valid changes can appear on the map without fabricated duplicate locations.
- [ ] Map clicks/select/drag/pan/zoom **never initiate player travel or a story turn**. Deliberate **add location** or **edit/correct location data** actions can persist through the normal validated world-state edit path without interpreting the node click as gameplay input.
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

- 2026-10-23 — **User resolved A-19/A-20:** The world map is only a representation and player editor of recorded game-world state, not an input form for travel/actions. Selecting a node never moves a character; player map interaction is for inspecting/fixing/changing location records or adding locations. Nodes may carry a visible `undiscovered` status and still display their recorded names/details for player editing; accepted discoveries switch the status to `discovered`. In-story AI knowledge is separate from player access to the editor. Earlier blanket hiding of undiscovered nodes is superseded. No production promotion.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Interactive pannable and zoomable node-based world map; nested location groups; visual travel connections distinct from containment; selection and details; adjustable layout; legible non-overlapping nodes; and hidden/discovered-location visibility. Group-collapse thresholds, layout persistence, collision algorithms, performance details and frontend graph framework left open for refinement. Moved to staging only, not production.
