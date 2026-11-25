---
id: ADR-0075
type: adr
status: accepted
related:
- ADR-0074
- ADR-0076
- ADR-0065
- ADR-0072
- ADR-0062
- ADR-0071
supersedes: []
---

# Validated Local Frame Coordinates and Mutable Region Geometry

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D05](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md) · approved at: 2026-10-31; approved by: requesting user (explicit B9 Batch 2 option selection)

## Explicit approval

**Explicit 2026-10-31 instruction:** “Review B9 Batch 2: B9-D04: C; B9-D05: A; B9-D06: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option A.** This refines, without reopening, the accepted nested-frame semantic canvas and mutable region outlines. The original A/B/C alternatives are retained in the [B9 Batch 2 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md).

## Operative typed representation

1. **Typed and versioned spatial records:** Model location/frame references with stable IDs, finite validated local coordinates and supported frame-scale/transform properties, in the existing current ordered versioned event/field registry. No untyped canvas blobs or canonical viewport pixels.
2. **Frames and transforms:** Place each supported entity relative to its declared local frame; compose coherent parent frame transforms for the visual world canvas. Validate finite numerics, supported transform representation and reference consistency (including no transform/containment cycles). Exact units, coordinate axes, orientation convention and type-level serialization remain implementation design.
3. **Mutable outlines:** Support validated type-specific extents, region boundary/outline points or paths and changes to current shape facts. Shape edits join accepted current history and replay. Regions may overlap; geometry alone never establishes or alters containment, territorial membership or accessibility ([B8-D04](ADR-0065-mutable-spatial-region-footprints-separate-from-containment.md)). Exact polygon winding/holes/non-Euclidean support remains deferred.
4. **Distinct path and route facts:** Optional grounded route anchors/path geometry may use frame-relative typed values. Topological route relations and measured travel distance/time stay separate facts; never infer them from straight-line canvas pixels.
5. **Storage and editing:** TypeScript prepares current typed spatial assertions and projections. Go enforces technical envelope/reference/version/integrity constraints and atomically commits current history under [B9-D02](ADR-0072-typescript-prepared-events-and-go-sqlite-atomic-commit-authority.md). Explicit manual edits use the existing pending Commit; automatic coordinate changes obey [B9-D04 C](ADR-0074-all-coordinates-eligible-for-automatic-layout.md), without any saved intentional-pin immunity.
6. **History and compatibility:** Supported current-event migrations preserve spatial meaning; unsupported/malformed core schema fails safely. UI pan/zoom, label placement and renderer caches are not the canonical spatial representation. No per-coordinate AI/player authorship metadata is required.

## Original options and trade-off

- **A — ACCEPTED:** Domain-owned finite typed local-frame coordinates/transforms plus mutable shapes, technical validation and versioning; some extra implementation complexity for replay and geometry consistency.
- **B — not selected:** Flat global pixel coordinates without nested frames.
- **C — not selected:** Mandatory Earth latitude/longitude and fixed real-world scale for every location.

## Deferred engineering details

Numeric precision and units, axes and orientation, transform convention, polygon/outlines/holes, type-specific shapes, migration mechanics, render library, and validation fixtures. No code or passing tests claimed.

## Approval history

- **2026-10-31:** B8-D01 nested local frames and B8-D04 mutable region shapes accepted; B9-D01 qualified A approved versioned spatial types without player/AI author labels.
- **2026-10-31 — explicit approval:** User selected **B9-D05 A** in Batch 2 alongside D04 C/D06 A; no B9 closure or implementation approved.
