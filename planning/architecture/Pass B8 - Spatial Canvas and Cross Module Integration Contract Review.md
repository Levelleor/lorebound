---
type: architecture
status: in-review
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
tags:
  - planning/architecture
  - pass-b
  - spatial-canvas
  - cross-module-integration
---

# Pass B8 — Spatial Canvas and Cross-Module Integration Contract Review

> **B8 IN REVIEW — 2026-10-31.** [P-B7-01](./decisions/P-B7-01%20-%20Design%20Closure%20and%20Deferred%20Spatial%20Canvas%20Integration%20Contracts.md) closed B7 design and opened B8. **B8-D01, D02 and D03 were each explicitly accepted as Option A on 2026-10-31**, after the original unapproved proposals below were presented. **B8-D04–D06 remain unapproved new proposals.** No implementation, stage promotion, verified integration or formal B8 closure is implied.

## Purpose and immutable inherited boundaries

**B6 defined narrative-first world facts; B7 defined typed, ordered, narrator-safe event semantics.** B8 reviews the still-unresolved **semantic spatial-map representation and cross-module contracts**, beginning with how locations keep meaningful, persistent positions and distances while nested and edited. It may later refine event and integration handoffs; it does not reopen previously accepted product choices.

### Governing accepted decisions

1. **[B7-D10 — persistent semantic spatial canvas](./decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md):** The **main map is a single pan/zoom canvas** with saved semantically pinned location positions, nested spatial grouping for empires/regions/cities/buildings/rooms and meaningful relative scale/distances. A graph auto-layout must never replace committed geographic placement. Unknown locations must not be assigned invented coordinates. **This requirement is already accepted, not an option in B8.**
2. **[B7-D06 — keyed relations and travel topology](./decisions/B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md):** Explicit grounded routes yield a **logical graph connectivity layer**, separate from the **spatial canvas** and separate from an acyclic parent/child containment hierarchy. Nearby pixels or shared parent do not imply a traversable route. Route properties affect future attempted-travel context, not already accepted narrated arrival.
3. **[B7-D01](./decisions/B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md), [B7-D04](./decisions/B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md), [B7-D05](./decisions/B7-D05%20-%20Event%20Ordered%20Entity%20Lifecycle%20and%20Reestablishment.md), [B7-D07](./decisions/B7-D07%20-%20Versioned%20Field%20Registry%20and%20Atomic%20Meaning%20Preserving%20Event%20Migrations.md) and [B7-D09](./decisions/B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md):** typed/versioned accepted assertions, explicit unknown/absence, current-only event order/provenance, deterministic projection and atomic meaning-preserving migrations. Do not invent a second canonical map/graph authority or archived old passage revisions.
4. **[B7-D08](./decisions/B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md) and [B7-D03 C](./decisions/B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md):** No engine IDs or ID mappings in narrator prompts. Natural references bind to IDs internally. Truly ambiguous automatic extraction candidates are omitted *silently*, but technical failures are not hidden.
5. **[B6-D01](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B6-D05](./decisions/B6-D05%20-%20Conditional%20Anatomy%20Linked%20Equipment%20Detachment.md):** Accepted fiction grounds world state without simulated causal legality. Auto-unequipping after limb loss requires actual active structured anatomy-to-equipment binding, not merely textual anatomy.
6. **Existing manual edit workflow:** Editing a location's **semantic pinned coordinates/group extent** is a world-state correction pending the already-approved explicit player Commit/Discard/full composer overlay and atomic Go/SQLite storage. Pan/zoom/selection/temporary label movement are presentation-only. Moving a pin is **not character travel**, route creation or changing containment.

## Batch 1 — accepted Option A for D01–D03 (original proposals retained)

### B8-D01 — How nested location coordinates share one canvas (Option A accepted)

**Accepted 2026-10-31:** [B8-D01 ADR](./decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md). The original proposed A/B/C alternatives remain below as approval history. Accepted A chooses persistent local frames and composed transforms, not final unit types.

**Question:** What coordinate semantics allow an empire, a city within it, a building and a room to retain meaningful positions and extents across zoom levels, while avoiding one nonsensical fixed pixel/metre ratio for every fictional scale?

- **A (recommended, proposed):** **Hierarchical local coordinate frames:** Each placed location/group has **persistent coordinates relative to its containing spatial frame**, with a declared, type-checked frame transform/scale where supported. A group defines its own meaningful extent and nested scale; a deterministic composition of transforms renders all groups on **one unified zoomable canvas**. Moving a parent by a deliberate world-map edit affects its rendered descendants coherently without rewriting each child's local coordinate; child positions remain stable relative to their parent. Unknown placements stay unplaced. **Trade-off:** More careful coordinate/transform validation and cross-group projection.
- **B (proposed):** Persist every location in **one flat global coordinate system** with a single fixed distance-unit scale, regardless of nested room/city/empire representation. **Trade-off:** Simple transforms but awkward across dramatic story scales and fictional/non-Euclidean places; large coordinate ranges and group movements become cumbersome.
- **C (proposed):** Persist only hierarchy and route connectivity and let graph auto-layout choose position every time. **Trade-off:** Reverses accepted B7-D10 geographic persistence; unsuitable for meaningful distances.

**Existing user requirement:** Pin positions and meaningful scale must persist whichever encoding is chosen. This question selects the **coordinate/frame representation strategy**, not whether the map is spatial.

### B8-D02 — Visual separation, route length and travel meaning (Option A accepted)

**Accepted 2026-10-31:** [B8-D02 ADR](./decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md). Visual geographic separation follows meaningful pinned positions; optional grounded route-specific geometry/travel length/cost remains distinct. The original A/B/C alternatives remain below as history.

**Question:** A map draws two cities far apart, two neighbouring rooms close together, and may also include winding roads, bridges or portals. How can route lines communicate scale without turning straight-line separation into mandatory travel time?

- **A (recommended, proposed):** Model **grounded geometric separation** from persistent semantic coordinates/scale, distinct from **optional route-specific path geometry, travel length, conditions and time/cost** when fiction or explicit player edits establish them. Render connectors between pinned endpoints (with supported route shapes as needed), so visual length reflects **meaningful spatial separation**; a road may be longer than its straight-line chord and a portal can have unusual travel semantics. Unknown units/distance/cost remain unknown rather than generated from hop count. **Trade-off:** More than one distance notion and cross-scale rendering rules.
- **B (proposed):** Draw every route as a uniform short link regardless of geographic separation; treat the map as a purely topological graph. **Trade-off:** Contradicts the accepted meaningful geography and distances of B7-D10.
- **C (proposed):** Automatically compute canonical journey time and action legality from Euclidean on-screen line length alone, including for portals/complex terrain, and reject accepted fiction that disagrees. **Trade-off:** Creates fabricated mechanics and overrides B6 narrative-first acceptance.

**Existing user requirement:** Distinct link lengths and world-relative size are already accepted. This chooses how **visual distance relates to route-specific semantics** without inventing story facts.

### B8-D03 — Durable spatial placement and map-edit transaction contract (Option A accepted)

**Accepted 2026-10-31:** [B8-D03 ADR](./decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md). Persist semantic pin/group coordinates and scale as typed current-world assertions through the existing pending explicit Commit and atomic transaction; the canvas is a derived view, not an independent authority. The original A/B/C alternatives remain below as history.

**Question:** Where does a deliberate map-pin/region movement become authoritative, and how is it kept coherent with the current story/event history, hierarchy and travel connections?

- **A (recommended, proposed):** Represent **semantic pinned coordinates, group extents and relevant frame/scale attributes as versioned, typed current-world spatial properties** associated with stable location identities, recorded through the existing ordered accepted event/correction contract. An intentional map edit creates a **noncanonical preview** and an explicit pending correction; only after player Commit does an atomic Go/SQLite transaction save the grounded spatial assertion(s). TypeScript projects the canvas alongside **separate** containment and keyed route relations. Optional cached drawing indexes are disposable, **never an independently mutable canonical map**. **Trade-off:** Requires typed geometry validation and careful commit/undo/replay tests.
- **B (proposed):** Persist coordinates immediately on every drag into an independent authoritative map table with no pending Commit and no link to current ordered world assertions. **Trade-off:** Convenient drag saving but bypasses approved player control, creates competing truth and complicates historical edits/Fork.
- **C (proposed):** Keep geographic positions solely as local UI layout preferences, not part of persisted world state. **Trade-off:** Breaks the already accepted B7-D10 requirement that positions and spatial meaning survive reloads/edits.

**Existing user requirement:** Persistent map geography and explicit approval for canonical manual edits are already settled. D03 addresses the **cross-module data representation/transaction integration**.

## Batch 1 accepted disposition — 2026-10-31

| Decision | Explicitly approved | Current architecture record |
| --- | --- | --- |
| **B8-D01** | **A** | [Nested local coordinate frames and composed transforms](./decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) |
| **B8-D02** | **A** | [Geographic separation versus grounded route-specific geometry/metrics](./decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) |
| **B8-D03** | **A** | [Typed durable spatial properties, pending explicit map-edit Commit and atomic persistence](./decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) |

These choices retain the already accepted B7-D10 primary **semantic spatial canvas**. Coordinates are not arbitrary UI auto-layout; the **route graph** is only the connectivity overlay. All actual implementation representations, tests and stage promotion are deferred.

## Batch 2 — new proposals, NOT accepted

### B8-D04 — Spatial group footprints and containment

**Question:** How should a drawn empire/city/building boundary and the accepted location parent hierarchy relate, particularly if groups overlap or their shapes change?

- **A (recommended, proposed):** A spatial group has an explicit **persistent extent/footprint**, rendered in its accepted local frame, while its **canonical parent/child containment relationship remains a separate typed, acyclic assertion**. When both are grounded, group footprint and child placements should be meaningfully coherent, but overlapping shapes or proximity must **not automatically change parent membership or invent a political/physical inclusion fact**. Explicitly committed parent or footprint corrections update only the relevant accepted fields, with deterministic projection and safe technical checks. **Trade-off:** Needs group-shape editing and cross-frame visualization decisions.
- **B (proposed):** Infer canonical parent/child location identity solely from whether a pin falls inside a drawn outline; moving any border automatically rewrites the hierarchy and all child groups. **Trade-off:** Quick map interaction but silently changes fictional relationships.
- **C (proposed):** Render groups as cosmetic, nonpersistent colored containers unrelated to location positions. **Trade-off:** Simple but contradicts pinned, meaningful group geography.

**Inherited:** B8-D01 A already establishes nested coordinate frames; this proposal refines **group-boundary and containment interaction**, not the existence of the canvas.

### B8-D05 — Cross-group routes, doors and portals

**Question:** How should a route between a city street and a room inside a building, or a portal between two distant regions, attach to different coordinate frames on the same canvas?

- **A (recommended, proposed):** Give explicitly established keyed route edges **stable endpoint location identities**, with optional grounded entrance/door/portal anchors and path geometry expressed in appropriate local frames. The map **projects endpoint coordinates through frame transforms** and renders a meaningful cross-group connection, collapsing or zooming segments as appropriate without changing canonical link identity. Door/bridge/portal properties can affect future route availability; nested containment, drawn adjacency and visual endpoint attachment never create implied travel edges. **Trade-off:** Needs coordinate projection and edge-anchor/layering rules.
- **B (proposed):** Link only direct sibling locations and automatically create implicit doorway/routes for every ancestor and nested group needed for a connected line. **Trade-off:** Fewer visible gaps but fabricates traversable connections and constrains arbitrary fictional routes.
- **C (proposed):** Treat cross-group links as purely visual lines with no stable keyed route identity or semantic meaning, even when accepted narration established the connection. **Trade-off:** Simpler rendering, but loses reliable travel topology.

**Inherited:** A route's visual separation and optional travel length remain distinct under B8-D02. This proposal does not select a final routing algorithm or travel-cost rule.

### B8-D06 — New locations whose coordinates are unknown

**Question:** If a story establishes a new city but not where it lies, how should the canvas represent the city without inventing exact geography?

- **A (recommended, proposed):** Keep a **first-class known location with unknown/unplaced spatial coordinates**, preserving its stable ID, accepted attributes and containment where grounded. Surface it in a clearly **non-geographic unplaced/location organizer** within the map/editor, allowing player placement by a pending explicit Commit. Any temporary preview/suggested position is visibly provisional and must never become canonical solely through auto-layout. **Trade-off:** Requires an unplaced-organizer UX that does not mislead players about distance.
- **B (proposed):** Silently assign and commit exact canonical coordinates whenever a new location is first mentioned. **Trade-off:** Every location is immediately drawable, but invented geography contaminates the accepted world.
- **C (proposed):** Hide every unplaced location entirely from the world/map editor until its coordinates become known. **Trade-off:** Cleaner canvas but the player may lose sight of otherwise established locations.

**Inherited:** B7-D10 and B8-D01 already forbid invented canonical positions. This proposal refines **visibility and user placement flow**, not whether unknown placement is permissible.

**Batch 2 status:** **B8-D04, D05 and D06 are unapproved proposals only**, pending explicit player review. No new ADRs have been accepted for them, and no code, stage promotion or B8 closure is authorised.

## Later proposed review topics (not yet selected)

- **B8-D07+:** Narrated spatial references versus exact coordinates, route directionality/parallel edges, schema migrations of existing pins, typed geometry normalization, map rendering and replay tests. The new **D04–D06 proposals** appear in Batch 2 below and remain **unapproved**.
- **B8 integration handoffs:** Versioned Go/SQLite persistence vs TypeScript reducer ownership, scene/item/route/location projection reads, narrator-safe map context, manual world edit atomicity and replay/evidence fixtures. Their exact interfaces are not yet approved and no code is implemented.
- No B8 choice can require a full geographical simulation, invent coordinates or travel lengths to fill missing lore, auto-move characters because a map pin changed, silently create traversable links or retroactively reject accepted narration.

## Status and decision history

- **2026-10-31:** B7 D01–D10 accepted; a prior user request only authorised a **closure assessment**, so B7 remained `in-review`.
- **2026-10-31 — Separate explicit closure and opening:** After a direct invitation to record B7 formal design-only closure and open B8, user replied **“yes proceed”**. [P-B7-01](./decisions/P-B7-01%20-%20Design%20Closure%20and%20Deferred%20Spatial%20Canvas%20Integration%20Contracts.md) closes B7 **design-only**, and this file **opens B8**. The A/B/C options for D01–D03 above are **unapproved suggestions** for later explicit review, not accepted user choices. No software changes, test results, stage promotion or B8 closure.

- **2026-10-31 — Batch 1 explicit user approvals:** User selected **B8-D01 A, B8-D02 A and B8-D03 A**, instructed independent accepted GitHub ADRs and chronological preservation, and asked to **continue B8**. Created [D01](./decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md), [D02](./decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) and [D03](./decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md). Proposed new **unapproved** D04–D06 options. B8 remains `in-review`; no implementation, tests, stage promotion or design closure.
