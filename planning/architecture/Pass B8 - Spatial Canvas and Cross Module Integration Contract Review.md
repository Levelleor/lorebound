---
type: architecture
status: closed-design-only
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

## Later B9 Batch 2 override of pin-protection policy — 2026-10-31

B8 remains **formally closed at design level** under its earlier approvals. However, the user subsequently selected [B9-D04 Option C](./decisions/B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md), which **expressly supersedes** B8-D08's original generated-only reconciliation and no-automatic-movement-of-manually-placed-pins restrictions. The operative design stores semantic coordinates with no author label or permanent fixed/auto-adjustable lock; accepted deterministic, replayable automatic changes may reposition **any** location. B8's original options/approval history remain below as historical evidence, not as a current reason to reintroduce pin immunity. [B9-D05 A](./decisions/B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md) and [B9-D06 A](./decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) further refine geometry and mock testing. B9 is still in review; no code, tests or staging promotion.


> **FORMALLY CLOSED AT DESIGN LEVEL, 2026-10-31, following distinct user approval.** [P-B8-01 closure ADR](./decisions/P-B8-01%20-%20Design%20Closure%20and%20Deferred%20Runtime%20Integration%20Contracts.md) records that after all nine accepted B8 decisions and the *assessment only*, the assistant directly asked **“Shall I record that closure and proceed to B9?”**, and the user replied **“yes.”** [B9 typed spatial data and runtime integration review](./Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) is **opened only with B9-D01–D03 unapproved proposals**. The earlier `in-review`/“not yet closed” statements below are **preserved chronological assessment notes**, not current status. No implementation, test evidence or staging promotion is implied.



> **B8 IN REVIEW — 2026-10-31.** [P-B7-01](./decisions/P-B7-01%20-%20Design%20Closure%20and%20Deferred%20Spatial%20Canvas%20Integration%20Contracts.md) formally closed B7 design. **B8-D01–D05 A and B8-D06 B are now each explicitly accepted.** User clarified that **region boundaries change over time**, and **all new locations should be automatically placed and remain player-movable**. This B8-D06 B direction expressly **supersedes prior no-generated-canonical-coordinate defaults for map placement only**, without making generated map positions narratively established distances. The original proposals are retained as history. **Batch 3 D07–D09 were later explicitly accepted as Option A.** The original proposals below remain as historical provenance. B8 has been **assessed for design closure only**, and no code, staging promotion, integration verification or formal B8 closure is implied.

## Purpose and immutable inherited boundaries

**B6 defined narrative-first world facts; B7 defined typed, ordered, narrator-safe event semantics.** B8 reviews the still-unresolved **semantic spatial-map representation and cross-module contracts**, beginning with how locations keep meaningful, persistent positions and distances while nested and edited. It may later refine event and integration handoffs; it does not reopen previously accepted product choices.

### Governing accepted decisions

1. **[B7-D10 — persistent semantic spatial canvas](./decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md):** The **main map is a single pan/zoom canvas** with saved, pinned location positions and meaningful nested grouping. **Later explicit [B8-D06 B](./decisions/B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) overrides the original prohibition on generated persisted coordinates:** initial system-generated **map** positions are permitted and expected for accepted new locations, with stored generated origin and player override. A generated coordinate is not proof of a narrated measured distance, and no layout pass may overwrite a deliberate committed user position. D10's canvas and explicit route/containment separation remain binding.
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

## Batch 2 — accepted D04 A, D05 A, D06 B (original proposals retained)

### B8-D04 — Spatial group footprints and containment (Option A accepted)

**Accepted 2026-10-31:** [B8-D04 ADR](./decisions/B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md). The user explicitly added that **region boundaries are mutable current world state**. Borders can be changed by later accepted story or player-corrected assertions, without automatically rewriting canonical parent/child membership. Original A/B/C proposals below are retained for approval history.

**Question:** How should a drawn empire/city/building boundary and the accepted location parent hierarchy relate, particularly if groups overlap or their shapes change?

- **A (recommended, proposed):** A spatial group has an explicit **persistent extent/footprint**, rendered in its accepted local frame, while its **canonical parent/child containment relationship remains a separate typed, acyclic assertion**. When both are grounded, group footprint and child placements should be meaningfully coherent, but overlapping shapes or proximity must **not automatically change parent membership or invent a political/physical inclusion fact**. Explicitly committed parent or footprint corrections update only the relevant accepted fields, with deterministic projection and safe technical checks. **Trade-off:** Needs group-shape editing and cross-frame visualization decisions.
- **B (proposed):** Infer canonical parent/child location identity solely from whether a pin falls inside a drawn outline; moving any border automatically rewrites the hierarchy and all child groups. **Trade-off:** Quick map interaction but silently changes fictional relationships.
- **C (proposed):** Render groups as cosmetic, nonpersistent colored containers unrelated to location positions. **Trade-off:** Simple but contradicts pinned, meaningful group geography.

**Inherited:** B8-D01 A already establishes nested coordinate frames; this proposal refines **group-boundary and containment interaction**, not the existence of the canvas.

### B8-D05 — Cross-group routes, doors and portals (Option A accepted)

**Accepted 2026-10-31:** [B8-D05 ADR](./decisions/B8-D05%20-%20Stable%20Cross%20Frame%20Routes%20with%20Grounded%20Door%20and%20Portal%20Anchors.md). Stable keyed route endpoints, optional grounded door/portal anchors and cross-frame geometry; proximity, containment or region-border changes do not invent travel links. Original A/B/C text below is retained.

**Question:** How should a route between a city street and a room inside a building, or a portal between two distant regions, attach to different coordinate frames on the same canvas?

- **A (recommended, proposed):** Give explicitly established keyed route edges **stable endpoint location identities**, with optional grounded entrance/door/portal anchors and path geometry expressed in appropriate local frames. The map **projects endpoint coordinates through frame transforms** and renders a meaningful cross-group connection, collapsing or zooming segments as appropriate without changing canonical link identity. Door/bridge/portal properties can affect future route availability; nested containment, drawn adjacency and visual endpoint attachment never create implied travel edges. **Trade-off:** Needs coordinate projection and edge-anchor/layering rules.
- **B (proposed):** Link only direct sibling locations and automatically create implicit doorway/routes for every ancestor and nested group needed for a connected line. **Trade-off:** Fewer visible gaps but fabricates traversable connections and constrains arbitrary fictional routes.
- **C (proposed):** Treat cross-group links as purely visual lines with no stable keyed route identity or semantic meaning, even when accepted narration established the connection. **Trade-off:** Simpler rendering, but loses reliable travel topology.

**Inherited:** A route's visual separation and optional travel length remain distinct under B8-D02. This proposal does not select a final routing algorithm or travel-cost rule.

### B8-D06 — New locations whose coordinates are unknown (Option B accepted, not recommended A)

**Accepted 2026-10-31:** [B8-D06 ADR](./decisions/B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md). The user **selected B**, expressly directing **“automatically place everything on the map”** while allowing the player to move locations however they wish. This **overrides the original recommended A** and the earlier B7-D10/B8-D01/B8-D03 *unplaced until grounded* default **for initial map layout**. Generated initial coordinates become durable typed map placement with distinct **system-generated provenance**, not a false narrative claim of exact location or travel distance; deliberate player rearrangement still follows the approved pending Commit/Discard boundary. Original proposed A/B/C descriptions below remain historical, including B's original warning.

**Question:** If a story establishes a new city but not where it lies, how should the canvas represent the city without inventing exact geography?

- **A (recommended, proposed):** Keep a **first-class known location with unknown/unplaced spatial coordinates**, preserving its stable ID, accepted attributes and containment where grounded. Surface it in a clearly **non-geographic unplaced/location organizer** within the map/editor, allowing player placement by a pending explicit Commit. Any temporary preview/suggested position is visibly provisional and must never become canonical solely through auto-layout. **Trade-off:** Requires an unplaced-organizer UX that does not mislead players about distance.
- **B (proposed):** Silently assign and commit exact canonical coordinates whenever a new location is first mentioned. **Trade-off:** Every location is immediately drawable, but invented geography contaminates the accepted world.
- **C (proposed):** Hide every unplaced location entirely from the world/map editor until its coordinates become known. **Trade-off:** Cleaner canvas but the player may lose sight of otherwise established locations.

**Chronological note:** When the original options were proposed, B7-D10/B8-D01 forbade automatically generated canonical coordinates. **The user's later explicit acceptance of D06 B supersedes that narrower default for generated initial map placement**, while preserving provenance and the distinction between a system layout decision and established fiction.

**Batch 2 status (2026-10-31):** B8-D04 **A with dynamic region boundaries**, B8-D05 **A**, and B8-D06 **B with automatic persisted placement and player adjustment** are all **accepted in separate ADRs**. The latter is an explicit later exception to no-invented-canonical-map-coordinate statements. No implementation, tests, stage promotion or B8 closure approved.

## Batch 2 accepted disposition — 2026-10-31

| Decision | Explicitly approved | Current ADR |
| --- | --- | --- |
| **B8-D04** | **A**, with user clarification: **region boundaries are mutable over time** | [Mutable region footprints and distinct containment](./decisions/B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md) |
| **B8-D05** | **A** | [Stable cross-frame route endpoints, doors and portal anchors](./decisions/B8-D05%20-%20Stable%20Cross%20Frame%20Routes%20with%20Grounded%20Door%20and%20Portal%20Anchors.md) |
| **B8-D06** | **B**, **not recommended A**, with user clarification: **place new locations automatically, let players move them** | [Generated persistent initial map placement with player overrides](./decisions/B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) |

### Explicitly superseded earlier unplaced-location default

B7-D10, B8-D01, B8-D02 and B8-D03 initially argued that unknown geographic coordinates must stay unplaced and never be generated/persisted. Those statements are **preserved as earlier decision history**, but **B8-D06 B is the later governing user instruction for initial map position**: accepted new location identities receive persistent system-generated placements by default. **Generated map placement is not itself evidence that prose established exact real-world distances, a road, a parent relation or travel costs**; preserve source/provenance so the narrator cannot mistake system layout for established fiction. A later manual map-pin adjustment remains an explicit pending Commit. An existing authored pin must not be silently re-randomised.

## Batch 3 — accepted Option A for D07–D09 (original proposals retained)

### B8-D07 — How to choose stable generated first positions (Option A accepted)

**Explicitly accepted 2026-10-31:** [B8-D07 ADR](./decisions/B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md). Deterministic, parent-frame-local first placement respects known constraints and authored positions; no required extra model call. The original A/B/C text remains below for provenance.

**Question:** How should Lorebound automatically place newly established cities/rooms when their exact coordinates are not narrated, without turning the canvas into random equal-length graph layout?

- **A (recommended, proposed):** Use a **deterministic, locally scoped first-placement strategy** in the existing parent spatial frame, preserving accepted known constraints and relative scale where available; otherwise choose a coherent default with sensible spacing/collision avoidance. Save the generated coordinate and its source. Do not require an extra AI call, change other committed pins, or generate route/travel facts. The player can reposition it. **Trade-off:** Requires initial placement and constraint priority rules.
- **B (proposed):** Randomly recalculate all node locations on every reopen or new story turn, letting them move freely with the auto-layout. **Trade-off:** Easy to draw but defeats persistent geographic memory and player adjustments.
- **C (proposed):** Require a new separate generative-model request to determine every location's coordinates, even when a deterministic reasonable default would suffice. **Trade-off:** More model cost/latency and invented precision without a narrative source.

**Inherited:** D06 B already requires automatically *persisted* initial placement. This proposes the **initial placement strategy**, not a reversal to an unplaced-organizer design.

### B8-D08 — When generated placement conflicts with later grounded geography (Option A accepted)

**Explicitly accepted 2026-10-31:** [B8-D08 ADR](./decisions/B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md). Reconcile only generated-only geometry with later accepted geographical constraints; preserve deliberately player-positioned pins and do not invent an exact metric. The original alternatives remain historical.

**Question:** The system placed two cities nearby, but later accepted narration establishes they are far apart. Which spatial facts should prevail?

- **A (recommended, proposed):** Preserve **source precedence and provenance**: explicit accepted player-authored placement/constraints and grounded narration outrank purely generated initial coordinates. Only reconcile **generated-only** positions where necessary to express newer accepted spatial facts, using a deterministic compatible current assertion; never silently shift a deliberate player-positioned pin or fabricate exact distance. Where both are explicit but contradictory, preserve the user-authored/canonical facts and leave resolution to a separate future UX contract, rather than guessing. **Trade-off:** Requires provenance-aware placement reconciliation and stable edit detection.
- **B (proposed):** Treat the original generated coordinate as an immutable fact overriding later accepted story distance claims. **Trade-off:** Prevents geography from evolving with fiction.
- **C (proposed):** Automatically move every map location, including player-adjusted pins, until a mathematical layout routine judges the map consistent. **Trade-off:** Damages intentional authorial arrangements.

**Inherited:** This does not grant a simulation validator power to reject narrated travel or recalculate time/cost. It addresses **visual map consistency** following new spatial information.

### B8-D09 — When automatic placement becomes durable (Option A accepted)

**Explicitly accepted 2026-10-31:** [B8-D09 ADR](./decisions/B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md). Accepted new-location creation and its system-generated initial spatial assertion are committed together in one atomic, idempotent batch; later manual map edits still require Commit. Original A/B/C alternatives remain historical.

**Question:** A newly accepted story passage establishes a location and Lorebound automatically assigns its first position. Should those changes be committed together?

- **A (recommended, proposed):** Generate initial placement **within the existing accepted location-creation/coherent state transaction**, so stable identity, location creation and typed system-generated spatial assertion enter current canon atomically and idempotently. Undo/edit/Fork/migration replay that one coherent ordered set; failed core writes do not leave ghost pins or orphaned geography. Manual later pin edits still use the explicit player Commit workflow. **Trade-off:** Requires deterministic idempotent allocation before transaction commit.
- **B (proposed):** Commit story/location immediately, then asynchronously auto-save coordinates in a separate independent transaction whenever the canvas eventually loads. **Trade-off:** Potential missing/ghost pins and extra concurrency states.
- **C (proposed):** Keep automatic pins only in volatile UI storage and never put them in the accepted state history. **Trade-off:** Contradicts D06 B's explicit persisted placement.

**Batch 3 status (2026-10-31):** **B8-D07 A, B8-D08 A and B8-D09 A were explicitly approved** by the user and saved in individual accepted ADRs. No code, stage promotion, real passing tests or formal B8 closure is implied.

## Batch 3 accepted disposition — 2026-10-31

| Decision | User-approved option | Canonical ADR |
| --- | --- | --- |
| **B8-D07** | **A** | [Deterministic frame-local generated first positions](./decisions/B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md) |
| **B8-D08** | **A** | [Source-aware generated-placement reconciliation, preserving player pins](./decisions/B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md) |
| **B8-D09** | **A** | [Atomic location creation and first map placement](./decisions/B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md) |

The requested action was to **record approved choices and assess design closure**, **not** to close B8. The register remains `status: in-review` until distinct user closure authorisation.

## B8 architecture-design closure assessment — 2026-10-31

**Decision-set result: 9 of 9 B8 numbered decisions have explicit accepted dispositions. The architecture-design pass is ready for separate design-only closure sign-off, but is NOT formally closed.**

### Accepted decision inventory

| Decision | Explicit approval | Governing design |
| --- | --- | --- |
| **D01** | **A** | Nested durable local coordinate frames, composed parent/group transforms on one canvas |
| **D02** | **A** | Geographic separation distinct from optional grounded route-specific geometry, length/time/cost |
| **D03** | **A** | Versioned spatial assertions and explicit pending Commit/Discard for deliberate player map edits; atomic persistence |
| **D04** | **A with explicit user clarification** | Spatial region boundaries/footprints are **mutable**, can change as accepted current world-state facts; canonical containment remains separate |
| **D05** | **A** | Stable keyed cross-frame roads/doors/portal endpoints and optional grounded anchors, without implied routes |
| **D06** | **B, NOT recommended A, with explicit user clarification** | **All accepted new locations automatically receive persisted initial map coordinates**; the player can move them. This supersedes prior blanket prohibition on generated initial canonical map positions. Generated coordinates are map layout facts, not narrator-established exact distances |
| **D07** | **A** | Deterministic parent-frame-scoped initial placement, preserving established geography and avoiding mandatory extra model calls |
| **D08** | **A** | Later grounded geographical facts can reconcile **generated-only** map positions; explicitly player-positioned pins cannot be silently moved |
| **D09** | **A** | Accepted location identity, accepted creation and typed generated first placement enter one atomic/idempotent canonical transaction |

### Why the design choices can close

- **One persistent semantic spatial canvas**, not a free-floating graph layout. Locations can be nested from empire to room via local coordinate frames, with durable scale/position and dynamic region footprints. The **logical travel graph** is a separate route-connectivity overlay.
- **Automatic placement is settled:** D06 **B**, followed by D07 A/D09 A, ensures newly accepted locations receive deterministic, committed first pins; no unplaced-location approval step or asynchronous second write. D08 A gives source-aware reconciliation while protecting player positioning and respecting newly established geography.
- **Meaningful distances are settled at the conceptual level:** On-screen separation and link length can communicate geography, while grounded optional route time/cost/path geometry remains separate; proximity, changing regions and generated positioning do **not** invent routes, measured distances or fictional travel preconditions.
- **Canon and player authorial edits are safe by design:** Typed accepted spatial assertions and source/provenance share the existing current ordered event history; deliberate player edits remain pending until explicit Commit/Discard with Go/SQLite atomic version/epoch/idempotency safeguards. Generated initial coordinates accompanying accepted location creation use its **same accepted transaction**, without a second player-approval prompt.
- **No cross-pass regressions:** B6/B7's narrative-first fiction, narrator-safe IDs, B7-D03 **C** silent discard limited to ambiguous *automatic extraction candidates*, no archived old revisions, and B6-D05 conditional anatomy/equipment rule all remain binding.

### Deferred engineering and verification, not additional accepted B8 choices

1. **Concrete spatial event and frame schemas:** Exact typed coordinates, scale/units and frame transforms, dynamic polygon/border shapes, group extents/overlap rules, source tags for generated vs authored geography, migrations and renderer transforms.
2. **Initial placement and reconciliation algorithms:** Deterministic seed/tie-breaking, collision spacing, multiple simultaneous creations, parentless/fantastical locations, handling later qualitative geography, player-pin preservation and conflicts between two explicit spatial facts. No location may be fabricated from a genuinely ambiguous automatic entity extraction.
3. **Routes and canvas geometry:** Optional entrance/door/portal path anchors, route direction/parallel connections, line length vs travel length, cross-scale rendering, changing region boundaries and explicit containment.
4. **Transactional and UI handoff:** Preview/Commit/Discard for deliberate player drag/reshape, *same canonical batch* initial location+generated-coordinate writes, Go/SQLite race/idempotency safety, TypeScript deterministic replay, current-only Undo/Delete After/Fork and versioned migrations. No sidecar authoritative graph/layout database.
5. **Real verification:** Test matrix for save/reopen, migration, reproducible automatic placement, map recomputation, player overrides, later narrated geography, dynamic borders and path anchors, optional removed plugins, narrator-safe context and source-provenance integrity. **No code or passing tests are claimed.**
6. **Earlier feasibility gates and staging:** B1 real-host/integration evidence remains open; staging idea documents are still **staging** and not production-promoted. B8 design completion does not authorise implementation, release or the next pass automatically.

**Recommendation:** Request **separate explicit user sign-off** to formally close B8 **design-only** and open the next planning/architecture pass for detailed engineering integration. Do **not** create a P-B8 closure ADR, mark B8 closed, or approve future options solely from a user request to **assess** closure.

## Later proposed review topics (not yet selected)

- **B8-D10+:** Further narrated spatial references, cross-scale distance constraints, arbitrary region shape data/edits, schema upgrades, spatial projection fixtures and renderer integration are deferred. **B8-D07–D09 were subsequently explicitly accepted as Option A**; original proposal text stays for dated historical provenance.
- **B8 integration handoffs:** Versioned Go/SQLite persistence vs TypeScript reducer ownership, scene/item/route/location projection reads, narrator-safe map context, manual world edit atomicity and replay/evidence fixtures. Their exact interfaces are not yet approved and no code is implemented.
- No B8 choice may require a full geographical simulation, **misrepresent generated map coordinates as narratively established exact geography**, fabricate route lengths or travel time, move characters because pins were moved, silently invent traversable links, or retroactively reject accepted narration. **Later B8-D06 B does explicitly authorise automatic persisted initial map coordinates**, with system-generated provenance and player overrides.

## Status and decision history

- **2026-10-31:** B7 D01–D10 accepted; a prior user request only authorised a **closure assessment**, so B7 remained `in-review`.
- **2026-10-31 — Separate explicit closure and opening:** After a direct invitation to record B7 formal design-only closure and open B8, user replied **“yes proceed”**. [P-B7-01](./decisions/P-B7-01%20-%20Design%20Closure%20and%20Deferred%20Spatial%20Canvas%20Integration%20Contracts.md) closes B7 **design-only**, and this file **opens B8**. The A/B/C options for D01–D03 above are **unapproved suggestions** for later explicit review, not accepted user choices. No software changes, test results, stage promotion or B8 closure.

- **2026-10-31 — Batch 1 explicit user approvals:** User selected **B8-D01 A, B8-D02 A and B8-D03 A**, instructed independent accepted GitHub ADRs and chronological preservation, and asked to **continue B8**. Created [D01](./decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md), [D02](./decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) and [D03](./decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md). Proposed new **unapproved** D04–D06 options. B8 remains `in-review`; no implementation, tests, stage promotion or design closure.

- **2026-10-31 — Batch 2 explicit user approval:** The user selected **B8-D04 A (with dynamic region boundaries), B8-D05 A, and B8-D06 B (not recommended A)**, expressly requesting **automatic persisted first placement of locations with free player repositioning**. Three separate accepted ADRs preserve original alternatives and this approval. **B8-D06 B is an explicit later override of earlier no-generated-canonical-map-position guidance**, limited to initial system-sourced map geometry with clear provenance; not proof of narrative distance or travel routes. D04 footprints may change as ordered world facts while containment remains separate. Proposed D07–D09 as **unapproved Batch 3**; no implementation, stage promotion or B8 closure.

- **2026-10-31 — Batch 3 acceptance and closure assessment only:** User expressly selected **B8-D07 A, B8-D08 A and B8-D09 A**, requested separate Lorebound GitHub ADRs, preservation of approval history and an **assessment** of design closure. Three accepted ADRs created. All nine B8 decisions now accepted; **D06 remains specifically B** with user-requested automatic persisted placement, D04 boundaries remain dynamically mutable. Assessment says **ready for separate design-only closure sign-off**, but B8 stays `in-review`. No P-B8 closure ADR, implementation, tests or stage promotion authorised.

- **2026-10-31 — Formal design-only closure after separate explicit sign-off:** After the Batch 3 D07 A/D08 A/D09 A approvals and **9/9 closure assessment**, the assistant separately asked whether to close B8 and open B9. User answered **“yes.”** Created accepted [P-B8-01](./decisions/P-B8-01%20-%20Design%20Closure%20and%20Deferred%20Runtime%20Integration%20Contracts.md); this register is now **`closed-design-only`**. The earlier assessment's instruction not to create a closure ADR *without separate user approval* was satisfied by this later authorisation. [B9](./Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) contains only **unapproved proposals**. Original B8-D06 **B** and D04 mutable-boundary conditions remain binding. No code, tests, stage promotion or B9 selection.
