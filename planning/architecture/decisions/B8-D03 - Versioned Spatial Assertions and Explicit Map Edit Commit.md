---
type: architecture-decision
status: accepted
decision_id: "B8-D03"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B8 Batch 1 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - spatial-persistence
  - architecture-decision
---

# B8-D03 — Typed durable spatial assertions and explicit atomic map-edit Commit

## Subsequent B9 Batch 2 override — 2026-10-31

**Later B9-D04 C and D05 A (2026-10-31):** [B9-D04 C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) permits future deterministic accepted automatic layout to move even deliberately user-positioned pins, overriding this decision's older “never overwrite authored geography” wording. [B9-D05 A](./B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md) validates frame-relative geometry and mutable outlines. **Direct manual map edits still require preview and explicit pending Commit/Discard**; automatic durable updates remain typed, replayable and atomic. No coordinate author or fixed-pin flag is required.


## Later accepted initial-autoplacement exception — 2026-10-31

[B8-D06 Option B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) explicitly permits **automatic first placement and durable typed system-generated spatial assertions on new accepted location identities**, without a separate **manual player approval for every default pin**. This refines the earlier paragraph below that left new locations unplaced until grounded. Crucially the user still controls intentional map corrections: a **player drag/reposition/resize** is noncanonical until the existing **pending explicit Commit/Discard**, with no background drag writes. Automatically generated placement must share the accepted current-world event/atomic storage boundary, carry **generated origin**, and not silently overwrite authored geography or create fictional distances or routes.



## Approval and provenance

**Explicit user choice, 2026-10-31:** “Review B8 Batch 1: B8-D01: A; B8-D02: A; B8-D03: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

This accepts **B8-D03 Option A**, separately from B8-D01 A and B8-D02 A. The original alternatives remain in the [B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md). The approval does not settle exact JSON event formats or start implementation, staging promotion or B8 closure.

## Accepted decision — Option A

**Treat deliberate geographic pin position, group extent and applicable local-frame/scale edits as versioned, typed, current-world spatial assertions on stable location identities, under the existing ordered accepted event model and explicit player-Commit transaction. Never keep a separate independently authoritative map geometry store.**

1. **Canonical spatial properties:** When established by accepted grounded prose or explicitly committed player correction, supported spatial properties (location placement in a declared frame, relative coordinates, extent, scale/frame attribute) are **typed, versioned declarative facts**. They join the single accepted ordered event/field history under [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md), [B7-D04](./B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md) and [B7-D09](./B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md), not an unrelated independent authoritative map table.
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

[B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md); [B7-D10](./B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md); [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md); [B8-D02](./B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md); [IDEA-0037](../../staging/Zoomable%20Node%20Map%20Canvas.md). Owners S04/S05/S06/S11/S12.

## Decision history

- **2026-10-31:** B3/B4 approved atomic, current-only, pending manual correction; B7-D10 accepted semantic pin placement and persistence but deferred its typed event/storage representation.
- **2026-10-31:** B8-D03 A/B/C proposed, initially unapproved; A recommended.
- **2026-10-31:** User explicitly selected **B8-D03 A**, alongside D01 A/D02 A; all three accepted independently, with no implementation, staging promotion or B8 closure approved.
