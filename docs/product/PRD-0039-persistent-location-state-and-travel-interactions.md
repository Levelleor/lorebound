---
id: PRD-0039
type: prd
status: accepted
related:
- NOTE-0046
- PRD-0001
- NOTE-0016
- NOTE-0008
---

# Persistent Location State and Travel Interactions

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0038](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Persistent%20Location%20State%20and%20Travel%20Interactions.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S11**. First milestone: **M6**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Current accepted narrative-first scope — 2026-10-28

**Later current state model ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** A door opening, route clearing, empty chest or changed location is a `Set/Clear` current-fact assertion when accepted narration or player correction establishes it. The tracker is **story memory**, not a mechanism that retroactively judges whether the character possessed a key or could traverse a route. Derive related current route/container views from assertions and keep stable/sparse entity IDs. Unsupported claims remain prose, failed provisional attempts do not mutate canon, and technical atomicity still protects data.


## Accepted direction
- Persist current mutable state for places, doors, containers, routes and environmental conditions across scenes.
- Validate accepted actions such as unlocking doors, emptying chests, blocking passages, and damaging or restoring travel connections before changing authoritative records.
- Derive current container, route, item and character projections from the **latest accepted grounded assertions**, retaining single-valued current properties and atomic storage; do not require fictional preconditions or reject an accepted outcome because an earlier key/route fact was missing.
- Route conditions affect future legal travel according to accepted Configurable Travel Graph Rules (IDEA-0035), while completed committed journeys are never retroactively undone.
- Preserve stable world identities from Hierarchical World Locations (IDEA-0033) and coherent characters and items from IDEA-0034 and IDEA-0029.
- Leave detailed environmental mechanics, plugins and disruption of ongoing journeys for refinement. Event-Sourced World History (IDEA-0039) was **subsequently accepted independently in staging**; no new event schema is implied by this location/environment idea.

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

## Supporting detail

See [NOTE-0046](../knowledge/inbox/NOTE-0046-prd-0039-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
