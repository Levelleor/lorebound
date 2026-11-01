---
id: "IDEA-0038"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-31"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Persistent Location State and Travel Interactions

## B8 Batch 3 coherent initial placement transaction — 2026-10-31

[B8-D07 A](../architecture/decisions/B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md), [B8-D08 A](../architecture/decisions/B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md), and [B8-D09 A](../architecture/decisions/B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md) ensure newly accepted locations have **deterministically generated and durably stored** first map positions **in the same atomic transaction** as the accepted location identity, with explicit generated provenance. Later accepted narrative geography can reconcile *generated-only* positions, never silently moving a committed player-positioned pin or inventing an exact travel distance. Story arrival, route status and border changes remain separate accepted assertions. Player-driven map repositioning uses the established noncanonical draft and explicit Commit, not a free direct SQLite drag write. This is design-only; technical replay/fork/migration verification remains unimplemented.



## Latest B8 spatial world contracts — 2026-10-31

[B8-D04 A](../architecture/decisions/B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md) accepts **mutable geographic/administrative region footprints** separately from location containment; later grounded changes use typed current-world assertions. [B8-D05 A](../architecture/decisions/B8-D05%20-%20Stable%20Cross%20Frame%20Routes%20with%20Grounded%20Door%20and%20Portal%20Anchors.md) accepts stable cross-frame route keys and optional door/portal anchors. **[B8-D06 B](../architecture/decisions/B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) explicitly replaces the older rule to leave new locations unplaced**: on accepted location creation assign a **persisted generated initial map coordinate**, with user edits permitted via pending explicit Commit and generated versus narrative geography provenance distinguished. Generated placements do not imply character movement, routes or known travel distances. No separate authoritative graph layout database.



## B8 Batch 1 spatial durability and route separation — 2026-10-31

[B8-D01](../architecture/decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) selects **persistent nested local-frame coordinates and meaningful group scale**, [B8-D02](../architecture/decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) distinguishes geographic separation from optional grounded route path/travel metrics, and [B8-D03](../architecture/decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) stores deliberately committed semantic map placements/extents as **versioned typed current-world assertions**, not as a separate authoritative graph or presentation-only layout. Player drag/edit previews are noncanonical until explicit Commit; TypeScript reduces accepted spatial properties alongside *separate* containment and keyed route events, with Go/SQLite atomic storage. Reopening, replay and Fork preserve pinned coordinates according to accepted history boundaries. Moving pins does not automatically move inhabitants, grant passages or modify travel cost; no invented coordinates.



## Persistent geographic placement and route topology — B7-D10 (2026-10-31)

[Accepted B7-D10](../architecture/decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) requires the **world-map canvas to save semantic coordinates, spatial grouping/extents and meaningful relative distance/scale** for placed locations. These facts are part of persistent world-map state tied to stable location identities, alongside the current route/door/environment events; the graph derived from route relations alone **is not the complete map**. A collapsed bridge can change edge availability without moving city pins; moving a city pin as a deliberately committed map edit does not create or remove a route, change container hierarchy or move story characters. Drawn connector lengths should reflect meaningful world separation at the current scale rather than arbitrary graph layout. Exact nested coordinate transforms, map unit definitions and route-specific travel lengths are later technical contracts.



## Derived mutable travel graph from keyed facts — 2026-10-31

[Accepted B7-D06](../architecture/decisions/B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md) refines B6-D07's mutable environment contract: persistent accepted door/bridge/route assertions and keyed relation Add/Remove events reconstruct **a current travel graph projection**. Location IDs are nodes; explicit routes are edges; current access/availability properties may affect optional pre-narration travel attempts. Containment hierarchy is **not** an automatic route. A collapsed bridge changes the **current projected graph**, not accepted earlier journeys. No separately authoritative graph object/table or simulated fictional-prerequisite engine is introduced; exact graph representation remains open.



## Current accepted narrative-first scope — 2026-10-28

**Later current state model ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)):** A door opening, route clearing, empty chest or changed location is a `Set/Clear` current-fact assertion when accepted narration or player correction establishes it. The tracker is **story memory**, not a mechanism that retroactively judges whether the character possessed a key or could traverse a route. Derive related current route/container views from assertions and keep stable/sparse entity IDs. Unsupported claims remain prose, failed provisional attempts do not mutate canon, and technical atomicity still protects data.


## Idea
Store mutable facts about places, routes, doors, containers and traversal.

## Why this idea matters
Scenes should remember locked doors, depleted chests and destroyed structures.

## Accepted direction
- Persist current mutable state for places, doors, containers, routes and environmental conditions across scenes.
- Validate accepted actions such as unlocking doors, emptying chests, blocking passages, and damaging or restoring travel connections before changing authoritative records.
- Derive current container, route, item and character projections from the **latest accepted grounded assertions**, retaining single-valued current properties and atomic storage; do not require fictional preconditions or reject an accepted outcome because an earlier key/route fact was missing.
- Route conditions affect future legal travel according to accepted [[Configurable Travel Graph Rules]] (IDEA-0035), while completed committed journeys are never retroactively undone.
- Preserve stable world identities from [[Hierarchical World Locations]] (IDEA-0033) and coherent characters and items from IDEA-0034 and IDEA-0029.
- Leave detailed environmental mechanics, plugins and disruption of ongoing journeys for refinement. [[Event-Sourced World History]] (IDEA-0039) was **subsequently accepted independently in staging**; no new event schema is implied by this location/environment idea.

## Proposed behaviour
Model current facts on persistent places and world objects. Proposed unlock, empty, block, damage or repair actions are validated against existing state. Commit related effects consistently, update route accessibility and future narration, and preserve prior committed travel history. Rejected or failed proposals leave no state mutation.

## Alternatives and trade-offs
Start with simple mutable facts and validated events; optional environmental simulation or plugin-based rules can be refined later. Event sourcing versus directly stored state is a separate design question, not settled by this acceptance.

## Story-authorial environmental changes bypass fictional obstacles but remain coherent
- **Accepted IDEA-0002 Option B (2026-10-18):** **Explicit player Story prose** may author events such as a door suddenly opening, a blocked passage becoming clear, or a character appearing beyond an impassable route even when ordinary **Do/Say simulation rules** would reject such outcomes. Treat the event as authored world reality rather than an attempted action requiring ordinary keys, adjacency, skill or route prerequisites.
- **Update what the prose establishes:** Persist the appropriate door/passage/location/character state and link it to the committed Story source without inventing missing causal explanation, additional routes, movement of bystanders or unsupported prerequisites. Structural cross-entity coherence, stable identities, event provenance, revision/version checks and Go/SQLite atomicity still apply. Model-generated incidental claims/Continue do not gain independent exemption.
- **Existing world policy remains available:** A player Story exception does not disable the adventure's selected travel/interaction rules for later Do/Say actions. Invalid reference/technical errors remain reportable, not disguised as successful authorial changes.

## Dependencies and constraints
- Integrates with accepted [[Hierarchical World Locations]] (IDEA-0033), [[Configurable Travel Graph Rules]] (IDEA-0035), [[Character Presence and Current Scene]] (IDEA-0034), and [[Persistent Items and Inventory Transfers]] (IDEA-0029).
- World-state changes require an **accepted grounded assertion**, not just a mention or failed provisional generation. Check typed representability and atomicity; do not veto accepted fiction on simulation-style prerequisites.
- An emptied container and its item placements, or a blocked route and its travel permissions, must remain consistent.
- Never retroactively invalidate completed committed travel when a route changes later.
- Do not assume the event sourcing implementation of IDEA-0039 or mandatory detailed environmental simulation.

## Open questions
- How should a changed or destroyed route affect planned movement or journeys already underway?
- Which mutable attributes belong to a location versus a door, container or route entity?
- How are simultaneous multi-entity effects validated, committed or rolled back?
- Which environmental rules should be optional, and how should repair, partial damage and temporary obstructions work?
- How should edits, undo, replay and event dependencies rebuild current conditions without corrupting other records?

## Draft acceptance criteria
- [ ] A definite player-authored Story environment/location change may succeed despite ordinary fictional access restrictions, while canonically updating only justified affected records and recording the source event.
- [ ] Rejection of an ordinary invalid Do/Say attempt remains possible, and no Story exception can cause a half-written door/location/route state or fabricated extra entities.
- [ ] State changes to doors, places, routes and containers survive scene changes.
- [ ] Validated locking/unlocking, emptying, blocking and restoring operations update relevant authoritative facts.
- [ ] Route availability reflects current obstacles under configured travel rules.
- [ ] Item locations agree with container status; impossible duplicates are prevented.
- [ ] Rejected or failed events do not leave partial world-state updates.
- [ ] Route changes do not undo previously committed completed travel.
- [ ] Scene descriptions reflect established current state rather than obsolete text.
- [ ] Detailed environmental simulation and event-storage architecture remain optional/unresolved.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Explicitly accepted for staging refinement, not approved for production or implemented.

## Decisions and review history

- 2026-10-23 — **Pass A batch 4 reference correction:** IDEA-0039 event-sourced history is already accepted separately in staging, not unaccepted. The exact environmental event schema and in-transit effects still need refinement. No new feature approval.
- 2026-10-18 — **Accepted IDEA-0002 environmental effects alignment:** Player-authored Story outcomes may supersede in-fiction access/route restrictions as direct world declarations, with coherent validated state and provenance. Do/Say and AI/Continue remain subject to gameplay rules; safe transaction integrity remains mandatory. Staging only.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Persist mutable state for locations, doors, containers, routes and environmental conditions; validated unlocking, emptying, blocking, destroying/restoring links; coherence with items, locations and travel rules; no retroactive invalidation of committed travel. Environmental mechanics, route disruption and event-storage architecture remain open. Moved to staging, not production.

- 2026-10-28 — **Explicit user-approved B6-D01 reconciliation:** Narrative-first declarative events govern current behaviour; any earlier simulation-style validity statements in historical proposals/old acceptance text are subordinate. Original approval provenance retained; staging only, not implemented or promoted.
