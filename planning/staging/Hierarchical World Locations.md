---
id: "IDEA-0033"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Hierarchical World Locations

## Idea
Organise places into nested worlds, regions, settlements, buildings and rooms.

## Why this idea matters
Allows a rich setting with intuitive zoom levels and local scene context.

## Accepted direction
- **Flexible hierarchical locations:** Model places as nested parent/child locations, including worlds, regions, settlements, buildings, rooms and unusual or story-specific kinds of spaces. Do not require a fixed sequence of levels or a uniform depth.
- **Durable identity and information:** Give each location a stable unique ID, name, description, optional type, parent reference (where applicable) and children. Renaming or reorganising a location must preserve its identity and relevant references.
- **Customisable location types:** Type labels such as world, region, settlement, building, room, wilderness site, vehicle or other custom classifications may help display/search, but no rigid taxonomy is mandatory.
- **Sparse/unknown-friendly records:** Locations may be created with minimal known details or without all descendants mapped. Missing information must not be silently invented or treated as a known empty world.
- **Acyclic containment:** Reject or prevent parent/child links that form cycles, including a location becoming its own direct or indirect ancestor.
- **Containment is distinct from traversal:** Nesting indicates that a place is situated within a larger place. **Do not treat parent/child relations as automatically passable travel connections**, or sibling locations as directly connected. Route/adjacency/travel constraints belong to separately reviewed ideas such as [[Configurable Travel Graph Rules]] (IDEA-0035).
- **Local scene context and discoverability:** The hierarchy can supply broad-to-specific place context, e.g. room → building → settlement → region, to a current scene or navigation interface without requiring the entire world to be supplied every time.
- **Stable links to world entities:** Character presence, persistent items and Lorebook place references can point to stable location IDs, not only names or prose. The particular presence and travel mechanics remain separate review decisions.
- **No premature visual map or strict travel approval:** This accepts the hierarchical location **data model**, not the zoomable graph UI (IDEA-0037), strict movement rules (IDEA-0035), automatic world discovery (IDEA-0036) or mutable route/environment systems (IDEA-0038).
- **Open hierarchy operations:** Moving a location and its descendants, deleting or merging places and resolving parent/child transitions when no valid travel route exists need further refinement.

## Proposed behaviour
Represent each place as a location entity keyed by a stable ID, with editable name, optional type and description, and a single parent reference (or no parent for a root). Derive child lists consistently from parent relationships. Allow parents to contain children at arbitrary depths and support rearranging a location subtree without resetting IDs or losing character, item and Lorebook links. Validate parent changes to prevent cycles. For contextual narration, resolve a character's current location and optionally its ancestry to obtain relevant local setting information. Keep a separate representation for route/door/movement edges; a place's ancestry is never in itself sufficient proof that a character can travel through a locked corridor or teleport between sibling rooms.

## Alternatives and trade-offs
A strict World → Region → Settlement → Building → Room chain makes some navigation predictable but fails for wilderness camps, ships, branching dungeon levels, nested realms and other unusual settings. The user accepted **flexible location containers** with optional type labels and arbitrary depths. A pure parent tree is easier to manage for containment and breadcrumbs than a generic directed graph, but does not model multiple entrances, routes or nonphysical links; those belong to the separate travel graph. Storing children explicitly may be convenient but risks conflict with parent references; indexing or deriving children from a canonical parent reference is a possible approach, not yet a chosen implementation.

## Dependencies and constraints
- Compatible with accepted [[Shared PC and NPC Character Entities]] (IDEA-0026), [[Persistent Items and Inventory Transfers]] (IDEA-0029), and [[Entity-Based Lorebook]] (IDEA-0020), whose records may reference location IDs.
- Character position and scene presence are a separate candidate [[Character Presence and Current Scene]] (IDEA-0034), not automatically accepted here.
- Valid connections and traversal policies are separate candidate [[Configurable Travel Graph Rules]] (IDEA-0035). The graph visualization/UI (IDEA-0037) and persistent changes to routes/environments (IDEA-0038) also remain separate review gates.
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
- Can an unknown/undiscovered child exist privately in world state but be hidden from the player?
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Originally a user-requested candidate, now explicitly accepted for staging with flexible nesting, stable IDs, optional location types and distinct containment/travel links.
- This is **not yet refined or approved for production**, and the document makes no claim of implementation.

## Decisions and review history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Flexible hierarchical world locations with stable IDs; optional types; names and descriptions; parent/child nesting; acyclic ancestry; preservation of identity when renaming/reorganising; strict separation between containment hierarchy and travel links; and support for sparse, unusual location structures. Moved to staging for refinement only, not production.
