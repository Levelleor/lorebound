---
id: PRD-0034
type: prd
status: accepted
related:
- NOTE-0041
- PRD-0001
- NOTE-0016
- NOTE-0012
---

# Hierarchical World Locations

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0033](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Hierarchical%20World%20Locations.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S11**. First milestone: **M6**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Current accepted narrative-first scope — 2026-10-28

**Latest event model ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Location hierarchy, discovery markers and mutable properties are **current accepted state assertions**, keyed by stable/sparse IDs. A newly accepted location or changed parent/property does not require a prior story route or old location introduction, though a *current parent graph* must still be technically representable (e.g., no cycles). Hierarchy does not imply traversability; a place being mentioned is not necessarily a fictional arrival.


## Accepted direction
- **Flexible hierarchical locations on one spatial canvas:** Model places as nested parent/child groups, including worlds, empires, regions, settlements/cities, buildings, rooms and unusual kinds of spaces. **Placed locations retain meaningful persisted coordinates and extents** at appropriate map scales; hierarchy records containment separately from coordinate position. Do not require a fixed sequence of levels or a uniform depth.
- **Durable identity and information:** Give each location a stable unique ID, name, description, optional type, parent reference (where applicable) and children. Renaming or reorganising a location must preserve its identity and relevant references.
- **Customisable location types:** Type labels such as world, region, settlement, building, room, wilderness site, vehicle or other custom classifications may help display/search, but no rigid taxonomy is mandatory.
- **Sparse/unknown-friendly records:** Locations may be created with minimal known details or without all descendants mapped. Missing information must not be silently invented or treated as a known empty world.
- **Independent, editable discovery status (2026-10-23):** A recorded location can be `undiscovered` or `discovered` for in-story purposes while **remaining visible, named and editable** on the player's map editor (IDEA-0037). The discovery marker is separate from hierarchy, identity and any actual travel permission. A manual edit to a location does not necessarily mean a character discovered or visited it.
- **Acyclic containment:** Reject or prevent parent/child links that form cycles, including a location becoming its own direct or indirect ancestor.
- **Containment is distinct from traversal:** Nesting indicates that a place is situated within a larger place. **Do not treat parent/child relations as automatically passable travel connections**, or sibling locations as directly connected. Route/adjacency/travel constraints belong to separately reviewed ideas such as Configurable Travel Graph Rules (IDEA-0035).
- **Local scene context and discoverability:** The hierarchy can supply broad-to-specific place context, e.g. room → building → settlement → region, to a current scene or navigation interface without requiring the entire world to be supplied every time.
- **Stable links to world entities:** Character presence, persistent items and Lorebook place references can point to stable location IDs, not only names or prose. The particular presence and travel mechanics remain separate review decisions.
- **Separate acceptance boundaries:** This idea itself approves only the hierarchical location **data model**. Zoomable map UI (IDEA-0037), optional strict/freeform travel policies (IDEA-0035), AI world discovery (IDEA-0036) and mutable route/environment state (IDEA-0038) have each **subsequently been accepted separately in staging**. Their separate implementation and refinement gates remain intact.
- **Open hierarchy operations:** Moving a location and its descendants, deleting or merging places and resolving parent/child transitions when no valid travel route exists need further refinement.

## Dependencies and constraints
- Compatible with accepted Shared PC and NPC Character Entities (IDEA-0026), Persistent Items and Inventory Transfers (IDEA-0029), and Entity-Based Lorebook (IDEA-0020), whose records may reference location IDs.
- Character position/scene presence are a separate, **independently accepted staging** feature in Character Presence and Current Scene (IDEA-0034). Accepting location hierarchy alone did not approve presence, and the two retain distinct implementation/refinement gates.
- Valid connections and traversal policies have been accepted separately in staging through Configurable Travel Graph Rules (IDEA-0035). Graph visualisation (IDEA-0037), AI discovery (IDEA-0036) and persistent environmental/route effects (IDEA-0038) are also separately accepted in staging, not unaccepted proposals. None is automatically implemented or in scope merely because the hierarchy was accepted.
- Parent/child nesting must be acyclic and references remain valid across renaming or subtree reorganisation.
- Moving or reorganising location containers must not silently teleport their occupants in violation of movement rules. Whether a ship and its interior occupants share mobile containment versus physical world location requires explicit design.
- Sparse data and unknown descriptions/children must be distinguishable from intentionally recorded absence.
- Do not automatically grant a travel edge, visibility, interaction or presence solely on the basis of shared containment ancestry.
- Staging acceptance is not approval to implement or evidence that any world mapping feature already exists.

## Open questions
- How should a parent/child transition work when no direct travel connection exists?
- How are nested moving locations such as vehicles or ships represented, especially when occupants move along with the container?
- Should a place be allowed multiple container parents or aliases, or should a single canonical parent always be required?
- How should merge, deletion, relocation and renaming preserve IDs and backlinks to characters, items and Lorebook entries?
- Should root worlds/realms be top-level locations, with parallel settings or dimensions allowed?
- Which optional type labels and metadata are useful as defaults without forcing a rigid taxonomy?
- **Resolved 2026-10-23:** An `undiscovered` child location may exist in world state and still be visible/named/editable on the player's map. The `undiscovered` flag does **not** itself hide the node. Any truly confidential attributes require a different explicit policy.
- How do location hierarchy, travel adjacency, range of visibility and co-location in large spaces interact?
- Which ancestor descriptions should be provided to the context builder, and what happens when the context budget is constrained?

## Draft acceptance criteria
- [ ] The world can contain stable-ID location entities with name, description, optional type and parent/child relationships.
- [ ] Location nesting supports variable depths and story-specific places rather than imposing a fixed World → Region → Settlement → Building → Room chain.
- [ ] Cyclic nesting and self-parent relationships are rejected or prevented.
- [ ] Renaming or reparenting a location preserves its stable ID and valid character/item/lore references.
- [ ] Sparse location records and unknown details are permitted without inventing unrecorded child locations or descriptions.
- [ ] A scene can resolve its current location's ancestry for relevant broader setting context when such ancestry is recorded.
- [ ] Parent/child containment and sibling relations never automatically imply passable travel edges, door access or legal movement.
- [ ] Hierarchy updates maintain coherent parent and child listings without orphaning references silently.
- [ ] Detailed movement policy, automated discovery, map visualization and mutable routes remain separately gated decisions.

## Supporting detail

See [NOTE-0041](../knowledge/inbox/NOTE-0041-prd-0034-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
