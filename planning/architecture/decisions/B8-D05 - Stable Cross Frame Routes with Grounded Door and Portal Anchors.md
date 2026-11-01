---
type: architecture-decision
status: accepted
decision_id: "B8-D05"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B8 Batch 2 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - spatial-canvas
  - architecture-decision
---

# B8-D05 — Stable cross-frame route identity with grounded entrance and portal anchors

## Explicit approval and provenance

**User approval, 2026-10-31:** “Review B8 Batch 2: B8-D04: A; B8-D05: A; B8-D06: B. Notes: Note: the region boundaries could change eventually so the boundaries are also a dynamic content which is subject for change eventually. Note: we want to just automatically place everything on the map, but user should be able to move the stuff however they like if they wish. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

This records **B8-D05 Option A** from [Batch 2](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), independently of D04 A (mutable borders) and D06 **B** (automatic persisted initial placement). No implementation or B8 closure is inferred.

## Accepted decision: Option A

1. **Durable route identity:** A grounded accepted route, door or portal relationship between locations uses a **stable typed keyed relation identity** and stable endpoint location identities under [B7-D06](./B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md). A route can connect a street to a room inside a building, distant regions, or locations at different hierarchy depths. Do not require them to be siblings.
2. **Optional grounded anchors and route paths:** Entrances, doors, gates, bridges or portals may have explicit grounded anchor/attachment references and path geometry expressed in the relevant [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) coordinate frames. A named door can connect the entrance of one nested region to another without becoming an invented traversal path for every sibling.
3. **Deterministic cross-frame drawing:** Compose supported parent/group transforms to render endpoints and paths across the one spatial canvas. Collapsing/zooming groups can simplify visible segments without changing the canonical route key, actual connectivity or accepted current endpoint facts. When an endpoint has an automatically generated initial position under B8-D06 B, the drawn line may use it but **must not misstate that generated positions, lengths or travel-time are known canonical narrative geography**.
4. **Route connectivity remains explicit:** Canvas proximity, line intersection, region containment, automatic map placement or a boundary reshape under B8-D04 **do not establish a traversable edge**. Only accepted grounded route assertions or explicitly committed corrections update current connectivity. Door/bridge/portal property assertions may separately alter future route availability.
5. **Travel distance remains separate:** [B8-D02](./B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) separates geometric distance from optional fictional route length/time/cost and exceptional portal travel semantics. Rendering cannot turn a straight-line length or graph hop count into an invented canonical journey metric.
6. **Event and approval integrity:** TypeScript owns typed route/anchor projection and scene/map representations; accepted events use the current ordered story/manual correction workflow and Go/SQLite atomicity. Map canvas is an editor/view, not a second independent graph database or a travel-request interface.
7. **Stable identity and unknown anchors:** The engine resolves location references privately under B7-D08; if grounded endpoints exist but no entry anchor was established, don't invent a door or force an imaginary edge-anchor. Unsupported detail may remain absent without rejecting story prose.

## Original options

- **A — accepted:** Stable route endpoints/keys with optional grounded door/portal/entrance anchors and paths across nested frames.
- **B — not selected:** Restrict to sibling links and implicitly invent doors/routes across parent hierarchy.
- **C — not selected:** Depict cross-group connections only as decorative lines with no reliable keyed relation.

## Deferred contracts

Anchor schema, directedness, multi-edge routes, portal exceptions, cross-group routing transforms, path/geometry encoding, status/visibility, edge rendering at multiple scales, replay and upgrade fixtures. No exact UI/DB representation, route cost algorithm or implementation approved.

## Traceability

[B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), [B7-D06](./B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md), [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md), [B8-D02](./B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md), [B8-D04](./B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md), [IDEA-0035](../../staging/Configurable%20Travel%20Graph%20Rules.md). Owners S04/S06/S11/S12.

## Decision history

- **2026-10-31:** B7-D06/B8-D01/B8-D02 accepted route identity and frame geometry; cross-group route anchoring still open.
- **2026-10-31:** B8-D05 A/B/C originally offered, A recommended, **not approved** when first proposed.
- **2026-10-31:** User expressly selected **D05 A**, separately D04 A (dynamic borders) and D06 B (automatic user-adjustable positioning). Original options remain in B8 register. No other B8 approval inferred.
