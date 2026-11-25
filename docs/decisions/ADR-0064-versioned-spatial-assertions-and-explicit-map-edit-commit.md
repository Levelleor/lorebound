---
id: ADR-0064
type: adr
status: accepted
related:
- ADR-0074
- ADR-0075
- ADR-0067
- ADR-0062
- ADR-0063
- ADR-0052
- ADR-0055
- ADR-0060
- ADR-0061
- PRD-0038
supersedes: []
---

# Versioned Spatial Assertions and Explicit Map Edit Commit

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B8-D03](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) · approved at: 2026-10-31; approved by: requesting user (explicit B8 Batch 1 Option A approval)

## Subsequent B9 Batch 2 override — 2026-10-31

**Later B9-D04 C and D05 A (2026-10-31):** [B9-D04 C](ADR-0074-all-coordinates-eligible-for-automatic-layout.md) permits future deterministic accepted automatic layout to move even deliberately user-positioned pins, overriding this decision's older “never overwrite authored geography” wording. [B9-D05 A](ADR-0075-validated-local-frame-coordinates-and-mutable-region-geometry.md) validates frame-relative geometry and mutable outlines. **Direct manual map edits still require preview and explicit pending Commit/Discard**; automatic durable updates remain typed, replayable and atomic. No coordinate author or fixed-pin flag is required.


## Later accepted initial-autoplacement exception — 2026-10-31

[B8-D06 Option B](ADR-0067-automatic-persistent-location-placement-with-player-overrides.md) explicitly permits **automatic first placement and durable typed system-generated spatial assertions on new accepted location identities**, without a separate **manual player approval for every default pin**. This refines the earlier paragraph below that left new locations unplaced until grounded. Crucially the user still controls intentional map corrections: a **player drag/reposition/resize** is noncanonical until the existing **pending explicit Commit/Discard**, with no background drag writes. Automatically generated placement must share the accepted current-world event/atomic storage boundary, carry **generated origin**, and not silently overwrite authored geography or create fictional distances or routes.



## Approval and provenance

**Explicit user choice, 2026-10-31:** “Review B8 Batch 1: B8-D01: A; B8-D02: A; B8-D03: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

This accepts **B8-D03 Option A**, separately from B8-D01 A and B8-D02 A. The original alternatives remain in the [B8 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md). The approval does not settle exact JSON event formats or start implementation, staging promotion or B8 closure.

## Accepted decision — Option A

**Treat deliberate geographic pin position, group extent and applicable local-frame/scale edits as versioned, typed, current-world spatial assertions on stable location identities, under the existing ordered accepted event model and explicit player-Commit transaction. Never keep a separate independently authoritative map geometry store.**

1. **Canonical spatial properties:** When established by accepted grounded prose or explicitly committed player correction, supported spatial properties (location placement in a declared frame, relative coordinates, extent, scale/frame attribute) are **typed, versioned declarative facts**. They join the single accepted ordered event/field history under [B7-D01](ADR-0052-versioned-typed-declarative-event-envelope.md), [B7-D04](ADR-0055-typed-unknown-absence-and-clear-semantics.md) and [B7-D09](ADR-0060-minimal-event-provenance-and-deterministic-current-replay-verifi.md), not an unrelated independent authoritative map table.
2. **Deliberate player editing:** A drag/resize that **intentionally changes semantic coordinates or group geometry** produces a **noncanonical preview and pending correction**. Only explicit **Approve/Commit** writes it to canon; Discard leaves canonical positions untouched. Use the existing full-composer blocking pending-change overlay and single pending batch. Transient pointer movements and previews are not automatically persisted as canonical events.
3. **Atomic persistence:** TypeScript prepares and validates supported spatial event values and coherent frame/identity references; Go/SQLite atomically persists the accepted change with adventure version, library epoch and durable operation-ID/idempotency protections. Reject stale/unsupported/malformed technical payloads safely. Fictional absence of a prior travel explanation is never such an error.
4. **One deterministic projection:** TypeScript reduces the current accepted spatial assertions together with distinct containment and keyed route records into the world canvas. The cached geometry/index/viewport renderer may be recomputed and is **disposable**, not a second truth store. Pinned locations remain stable across replay, reopening, historical edit, Undo/Fork and supported schema migration according to the established history boundaries.
5. **No implicit effects from a pin move:** Relocating the map pin does **not** by itself relocate characters, change the location's containing parent, create/traverse a road, edit door status, modify route cost, trigger roleplay text or advance the story turn. Those require separate grounded accepted assertions or an explicit player correction.
6. **Viewport remains visual:** Pan, zoom, selected node, label-offset and uncommitted layout preview are UI presentation state only. Do not conflate viewport coordinates with semantic geographic coordinates.
7. **Sparse spatial world facts:** A location mentioned in prose but lacking grounded positions may remain unplaced/unknown. No arbitrary force-layout position is converted to fiction canon. Stable IDs are private to the engine and are not copied into roleplay narrator prompts.
8. **Only technical validation:** Enforce type, supported field/schema version, coherent non-cyclic frame/containment references and atomic transaction integrity; do **not** evaluate whether moving a city is physically plausible or whether earlier narrative travel proves an edit legal.

## Original alternatives and disposition

- **A — accepted:** Versioned typed semantic spatial properties in the existing ordered current-history model, explicit pending player Commit and atomic persistence; disposable canvas/graph read projections.
- **B — not selected:** Write each drag directly to an independent authoritative map database outside the player's approval and replay transaction boundaries.
- **C — not selected:** Keep all location coordinates as temporary per-device UI preferences, abandoning persistent fictional map semantics.

## Deferred implementation questions

Final spatial event field identifiers and payload schema; group geometry/scale validator; drag and preview gestures; partial/batch edits and undo semantics; cross-frame transform persistence; migration fixtures; renderer caches; conflict resolution for concurrent edits. No runnable code, schema or integration tests are claimed.

## Traceability

[B8 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md); [B7-D10](ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md); [B8-D01](ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md); [B8-D02](ADR-0063-geographic-separation-distinct-from-route-travel-geometry.md); [IDEA-0037](../product/PRD-0038-zoomable-node-map-canvas.md). Owners S04/S05/S06/S11/S12.

## Decision history

- **2026-10-31:** B3/B4 approved atomic, current-only, pending manual correction; B7-D10 accepted semantic pin placement and persistence but deferred its typed event/storage representation.
- **2026-10-31:** B8-D03 A/B/C proposed, initially unapproved; A recommended.
- **2026-10-31:** User explicitly selected **B8-D03 A**, alongside D01 A/D02 A; all three accepted independently, with no implementation, staging promotion or B8 closure approved.
