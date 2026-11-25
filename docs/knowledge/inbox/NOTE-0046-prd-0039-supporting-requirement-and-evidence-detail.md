---
id: NOTE-0046
type: note
status: inbox
source: PRD-0039
related: []
---

# PRD-0039 supporting requirement and evidence detail

## Discovery

Supporting detail for [PRD-0039](../../product/PRD-0039-persistent-location-state-and-travel-interactions.md). Explicitly scoped or draft rows below are not whole-feature verification.

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0038](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Persistent%20Location%20State%20and%20Travel%20Interactions.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S11**. First milestone: **M6**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Goals and acceptance details

## B9 Batch 1 typed map fields, Go commit and mock tests — 2026-10-31

[B9-D01 qualified A](../../decisions/ADR-0071-typed-spatial-coordinates-without-ai-player-authorship-labels.md) stores **validated typed spatial coordinates**, not a mandatory **AI-versus-player author label** on each coordinate. B8-D06 generated first placement, B8-D08 protection of deliberate pins, and B8-D09 same-transaction identity/position are unchanged, but any needed pin-protection field is operational state and **unapproved B9-D04** will refine it. [B9-D02 A](../../decisions/ADR-0072-typescript-prepared-events-and-go-sqlite-atomic-commit-authority.md) assigns TypeScript preparation/projections and Go technical verification/atomic SQLite writes, not fictional travel simulation. [B9-D03 B](../../decisions/ADR-0073-mock-based-component-verification-without-live-ai-scenarios.md) selects mocked tests of app components, **no live AI scenario tests**; mocks do not prove an actual host database ran. This is accepted planning, not implemented behaviour.



## B8 Batch 3 coherent initial placement transaction — 2026-10-31

[B8-D07 A](../../decisions/ADR-0068-deterministic-scoped-automatic-map-placement.md), [B8-D08 A](../../decisions/ADR-0069-provenance-aware-spatial-reconciliation-of-generated-placement.md), and [B8-D09 A](../../decisions/ADR-0070-atomic-canonical-location-creation-and-initial-placement.md) ensure newly accepted locations have **deterministically generated and durably stored** first map positions **in the same atomic transaction** as the accepted location identity, with explicit generated provenance. Later accepted narrative geography can reconcile *generated-only* positions, never silently moving a committed player-positioned pin or inventing an exact travel distance. Story arrival, route status and border changes remain separate accepted assertions. Player-driven map repositioning uses the established noncanonical draft and explicit Commit, not a free direct SQLite drag write. This is design-only; technical replay/fork/migration verification remains unimplemented.



## Latest B8 spatial world contracts — 2026-10-31

[B8-D04 A](../../decisions/ADR-0065-mutable-spatial-region-footprints-separate-from-containment.md) accepts **mutable geographic/administrative region footprints** separately from location containment; later grounded changes use typed current-world assertions. [B8-D05 A](../../decisions/ADR-0066-stable-cross-frame-routes-with-grounded-door-and-portal-anchors.md) accepts stable cross-frame route keys and optional door/portal anchors. **[B8-D06 B](../../decisions/ADR-0067-automatic-persistent-location-placement-with-player-overrides.md) explicitly replaces the older rule to leave new locations unplaced**: on accepted location creation assign a **persisted generated initial map coordinate**, with user edits permitted via pending explicit Commit and generated versus narrative geography provenance distinguished. Generated placements do not imply character movement, routes or known travel distances. No separate authoritative graph layout database.



## B8 Batch 1 spatial durability and route separation — 2026-10-31

[B8-D01](../../decisions/ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md) selects **persistent nested local-frame coordinates and meaningful group scale**, [B8-D02](../../decisions/ADR-0063-geographic-separation-distinct-from-route-travel-geometry.md) distinguishes geographic separation from optional grounded route path/travel metrics, and [B8-D03](../../decisions/ADR-0064-versioned-spatial-assertions-and-explicit-map-edit-commit.md) stores deliberately committed semantic map placements/extents as **versioned typed current-world assertions**, not as a separate authoritative graph or presentation-only layout. Player drag/edit previews are noncanonical until explicit Commit; TypeScript reduces accepted spatial properties alongside *separate* containment and keyed route events, with Go/SQLite atomic storage. Reopening, replay and Fork preserve pinned coordinates according to accepted history boundaries. Moving pins does not automatically move inhabitants, grant passages or modify travel cost; no invented coordinates.



## Persistent geographic placement and route topology — B7-D10 (2026-10-31)

[Accepted B7-D10](../../decisions/ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md) requires the **world-map canvas to save semantic coordinates, spatial grouping/extents and meaningful relative distance/scale** for placed locations. These facts are part of persistent world-map state tied to stable location identities, alongside the current route/door/environment events; the graph derived from route relations alone **is not the complete map**. A collapsed bridge can change edge availability without moving city pins; moving a city pin as a deliberately committed map edit does not create or remove a route, change container hierarchy or move story characters. Drawn connector lengths should reflect meaningful world separation at the current scale rather than arbitrary graph layout. Exact nested coordinate transforms, map unit definitions and route-specific travel lengths are later technical contracts.



## Derived mutable travel graph from keyed facts — 2026-10-31

[Accepted B7-D06](../../decisions/ADR-0057-typed-keyed-relations-and-derived-world-travel-graph.md) refines B6-D07's mutable environment contract: persistent accepted door/bridge/route assertions and keyed relation Add/Remove events reconstruct **a current travel graph projection**. Location IDs are nodes; explicit routes are edges; current access/availability properties may affect optional pre-narration travel attempts. Containment hierarchy is **not** an automatic route. A collapsed bridge changes the **current projected graph**, not accepted earlier journeys. No separately authoritative graph object/table or simulated fictional-prerequisite engine is introduced; exact graph representation remains open.



## Current accepted narrative-first scope — 2026-10-28

**Later current state model ([B6-D01](../../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** A door opening, route clearing, empty chest or changed location is a `Set/Clear` current-fact assertion when accepted narration or player correction establishes it. The tracker is **story memory**, not a mechanism that retroactively judges whether the character possessed a key or could traverse a route. Derive related current route/container views from assertions and keep stable/sparse entity IDs. Unsupported claims remain prose, failed provisional attempts do not mutate canon, and technical atomicity still protects data.


## Idea
Store mutable facts about places, routes, doors, containers and traversal.

## Why this idea matters
Scenes should remember locked doors, depleted chests and destroyed structures.

## Accepted direction
- Persist current mutable state for places, doors, containers, routes and environmental conditions across scenes.
- Validate accepted actions such as unlocking doors, emptying chests, blocking passages, and damaging or restoring travel connections before changing authoritative records.
- Derive current container, route, item and character projections from the **latest accepted grounded assertions**, retaining single-valued current properties and atomic storage; do not require fictional preconditions or reject an accepted outcome because an earlier key/route fact was missing.
- Route conditions affect future legal travel according to accepted Configurable Travel Graph Rules (IDEA-0035), while completed committed journeys are never retroactively undone.
- Preserve stable world identities from Hierarchical World Locations (IDEA-0033) and coherent characters and items from IDEA-0034 and IDEA-0029.
- Leave detailed environmental mechanics, plugins and disruption of ongoing journeys for refinement. Event-Sourced World History (IDEA-0039) was **subsequently accepted independently in staging**; no new event schema is implied by this location/environment idea.

## Proposed behaviour
Model current facts on persistent places and world objects. Proposed unlock, empty, block, damage or repair actions are validated against existing state. Commit related effects consistently, update route accessibility and future narration, and preserve prior committed travel history. Rejected or failed proposals leave no state mutation.

## Alternatives and trade-offs
Start with simple mutable facts and validated events; optional environmental simulation or plugin-based rules can be refined later. Event sourcing versus directly stored state is a separate design question, not settled by this acceptance.

## Story-authorial environmental changes bypass fictional obstacles but remain coherent
- **Accepted IDEA-0002 Option B (2026-10-18):** **Explicit player Story prose** may author events such as a door suddenly opening, a blocked passage becoming clear, or a character appearing beyond an impassable route even when ordinary **Do/Say simulation rules** would reject such outcomes. Treat the event as authored world reality rather than an attempted action requiring ordinary keys, adjacency, skill or route prerequisites.
- **Update what the prose establishes:** Persist the appropriate door/passage/location/character state and link it to the committed Story source without inventing missing causal explanation, additional routes, movement of bystanders or unsupported prerequisites. Structural cross-entity coherence, stable identities, event provenance, revision/version checks and Go/SQLite atomicity still apply. Model-generated incidental claims/Continue do not gain independent exemption.
- **Existing world policy remains available:** A player Story exception does not disable the adventure's selected travel/interaction rules for later Do/Say actions. Invalid reference/technical errors remain reportable, not disguised as successful authorial changes.

## Dependencies and constraints
- Integrates with accepted Hierarchical World Locations (IDEA-0033), Configurable Travel Graph Rules (IDEA-0035), Character Presence and Current Scene (IDEA-0034), and Persistent Items and Inventory Transfers (IDEA-0029).
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

## Evaluation notes
- Origin: **mixed**. Explicitly accepted for staging refinement, not approved for production or implemented.

## Decisions and review history

- 2026-10-23 — **Pass A batch 4 reference correction:** IDEA-0039 event-sourced history is already accepted separately in staging, not unaccepted. The exact environmental event schema and in-transit effects still need refinement. No new feature approval.
- 2026-10-18 — **Accepted IDEA-0002 environmental effects alignment:** Player-authored Story outcomes may supersede in-fiction access/route restrictions as direct world declarations, with coherent validated state and provenance. Do/Say and AI/Continue remain subject to gameplay rules; safe transaction integrity remains mandatory. Staging only.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Persist mutable state for locations, doors, containers, routes and environmental conditions; validated unlocking, emptying, blocking, destroying/restoring links; coherence with items, locations and travel rules; no retroactive invalidation of committed travel. Environmental mechanics, route disruption and event-storage architecture remain open. Moved to staging, not production.

- 2026-10-28 — **Explicit user-approved B6-D01 reconciliation:** Narrative-first declarative events govern current behaviour; any earlier simulation-style validity statements in historical proposals/old acceptance text are subordinate. Original approval provenance retained; staging only, not implemented or promoted.

## Classification

Source requirement detail and evidence; not a separate task or implementation approval.
