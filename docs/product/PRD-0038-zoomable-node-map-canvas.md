---
id: PRD-0038
type: prd
status: accepted
related:
- NOTE-0045
- PRD-0001
- NOTE-0016
---

# Zoomable Node Map Canvas

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0037](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Zoomable%20Node%20Map%20Canvas.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S04**. First milestone: **M6**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Goals

Implement persistent semantic coordinates and nested frames with movable grounded pins and relative distances. Keep typed travel connectivity separate from geometric layout. Use best-effort deterministic reconciliation, player-location-first opening, basic pointer controls and shared composer Commit/Discard for edits. Spatial schema/event migration is explicitly deferred.

## Latest accepted spatial-map definition: B7-D10 (2026-10-31)

**The map is a persistent *semantic spatial canvas*, not merely a laid-out travel graph.** [Accepted B7-D10](../decisions/ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md) explicitly requires:
- **Saved, pinned location coordinates:** Every placed location has a stable map position that persists after reload/reopen; graph auto-layout cannot shuffle existing geography. Newly mentioned unplaced places remain unplaced/unknown until positioned, not assigned invented exact coordinates.
- **One zoomable/pannable canvas with nested spatial groups:** Cities, buildings, rooms, regions and empires can be visibly grouped with meaningful extents and relationships within the same map experience. Parent-child/grouping is distinct from passable roads or doorways.
- **Meaningful distances/scale and link geometry:** Locations that are fictionally farther apart must appear farther apart at the appropriate scale, and connections have visibly meaningful separations rather than arbitrary equal-length graph edges. Regional and room scales may use different linked coordinate frames; units and transforms are still engineering decisions. Route travel distance may differ from straight-line separation.
- **Persistent geographic edits, not ephemeral decoration:** Deliberately moving/repositioning a location pin, adjusting its meaningful group/region footprint or changing world-map scale is a world-map **semantic edit** that persists through the existing pending-change explicit Commit/Discard pathway. It does **not** independently change character location, containment, discovery or route availability. Pan/zoom, temporary visual previews and purely cosmetic label offsets remain presentation-only.
- **Logical graph remains underneath:** Accepted keyed route relations determine edges between stable location identities for optional routing and line drawing. The underlying graph does not determine coordinates and has no independent competing authoritative map state.

**This later explicit user direction supersedes older sentences below** claiming that location-node positioning is presentation-only, precise geographic coordinates are not assumed or whether to persist pinned positions remains completely open. The original dated staging acceptance is preserved as provenance; no canvas implementation or exact coordinate/scale schema is approved.



## Latest accepted event and narrative authority — 2026-10-28

**Current map world-memory semantics ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Map nodes/links and discoverability are grounded **current declarative location/relationship assertions**. Player editing them is a **pending noncanonical change set until explicit Commit**, with the shared full-composer blocking overlay. Renaming or **authorially repositioning the persistent spatial layout** requires no proof of earlier fictional travel; source-grounded acceptance, stable IDs and technically coherent hierarchy still apply. **Only viewport pan/zoom and optional label offsets are presentation-only.** A committed pin/group coordinate edit is a persistent semantic world-map correction under later B7-D10.


## Accepted direction
- **Interactive node-based world map:** Display established and discoverable locations on a canvas that supports **panning and zooming** over different scales of the story world.
- **Nested location groups:** Visualise the flexible location hierarchy from Hierarchical World Locations (IDEA-0033) through nested, grouped nodes, including regions, settlements, buildings, rooms and nonstandard custom place types.
- **Visual travel connections distinct from containment:** Render actual known travel graph edges separately from parent/child grouping so the UI does not suggest automatic travel access between siblings or contained locations.
- **Selection, inspection and direct world editing (user decision 2026-10-23):** Selecting a map node opens its recorded details, **including its name**, discovery status and known links, and permits the player to **edit/correct that location's information** or add new locations through valid world-state editing controls. The map is a *view/editor of recorded world state*, **not a gameplay input mode**. A click, selection, drag or node-focus action never means 'travel there' or advances a story turn.
- **Pinned semantic world coordinates:** Locations placed on the canvas retain their player-defined coordinates across reload/reopening, with relative distance and group size meaningful for the fiction. A manual map-placement correction is persistent world data and uses the existing explicit Commit/Discard workflow. Automatic graph layout must not arbitrarily replace saved geographic positions. Exact coordinate units, nested transforms and cosmetic layout offsets remain for refinement.
- **Legible and minimally overlapping:** Design the canvas to avoid unnecessary overlapping nodes, unreadable labels and obscured connections through suitable layout and collision-handling behaviour, without preapproving a specific algorithm.
- **Undiscovered is a visible node state, not a map redaction rule (user decision 2026-10-23):** Recorded world locations can appear on the player's **editable map even when marked `undiscovered`**, with their already recorded name/details inspectable and editable. A grounded discovery event may change the status to `discovered`. This marker describes in-story discovery/AI narrative knowledge, **not permission to hide or disable a location in the player's map editor**. Where genuinely restricted details need protection for a separate reason, treat that explicitly and independently; do not equate every undiscovered node with a hidden/spoiler-blocked node.
- **Coherent canonical geographic state:** Persistent map coordinates/meaningful group extents are world-map facts associated with stable location identities; grouping and traversable routes remain separate accepted relationships. Deliberate map repositioning changes saved **geographic placement**, but does **not by itself** move characters, create roads, change containment or grant traversal.
- **Implementation choices remain open:** No accepted frontend framework or graph library. React Flow is only a brainstormed example. The zoom/group-collapse thresholds, saved-layout scheme, collision algorithms and very-large-map performance strategy remain for staging refinement.
- **Map editor vs travel controls (2026-10-23; refined by B7-D10):** The map is a world-state visualisation/editor, not a travel-command panel. Pan/zoom, select and inspect never move characters. **Deliberately repositioning a pinned location changes its semantic map coordinates** and is saved as an approved world-map correction; it still does **not** change actual character positions, containment or explicit traversable routes unless separately asserted.

## Dependencies and constraints
- Render locations by stable IDs and parent/child containment from accepted Hierarchical World Locations (IDEA-0033).
- Display actual known travel connections from accepted Configurable Travel Graph Rules (IDEA-0035), distinguishing them clearly from containment links. A drawn line must not invent travel access.
- Use validated world/discovery records under AI World Discovery and Expansion (IDEA-0036). **Undiscovered locations are allowed on the user-editable map** with names and recorded details; the distinction between player-editor visibility and in-story narrator/character knowledge must be maintained. Any separately restricted secret content requires its own explicit policy, not automatic undiscovered-node suppression.
- Changes to current-scene or character location from Character Presence and Current Scene (IDEA-0034) may be reflected by the view but are not automatically caused by selecting or dragging a node.
- Panning, zooming and node selection are presentation-only and **never travel requests**. **Repositioning a pinned place is a deliberate persistent geographic world edit**, not a character travel request. Editing its other properties, discovery, hierarchy or route links remains a distinct manual world edit, through the established pending explicit Commit workflow.
- **B7-D10 now requires persistent semantic spatial coordinates and meaningful relative scale/route-link separation.** Do not assume a specific Earth-like projection, exact metric unit, image map, fixed region levels or a single global pixel-to-distance conversion.
- Do not choose React Flow or any frontend graph technology before refinement, and do not precommit a performance, collision-avoidance or saved-layout algorithm.
- Staging acceptance does not imply production approval or implemented functionality.

## Supporting detail

See [NOTE-0045](../knowledge/inbox/NOTE-0045-prd-0038-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
