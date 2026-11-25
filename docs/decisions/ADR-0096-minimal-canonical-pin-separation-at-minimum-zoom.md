---
id: ADR-0096
type: adr
status: accepted
related:
- ADR-0074
- ADR-0079
- ADR-0078
- ADR-0098
supersedes: []
---

# Minimal Canonical Pin Separation at Minimum Zoom

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D27](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D27%20-%20Minimal%20Canonical%20Pin%20Separation%20at%20Minimum%20Zoom.md) · approved at: 2026-11-01; approved by: requesting user (explicit qualified C in Batch 9)

## Original explicit approval and qualification

The user chose **B9-D27 C** in Batch 9, with this restriction: “locations never overlap entirely on the lowest zoom. So even if they do according to interpreter just shift them a bit to the closest side to place. That's all.”

**ACCEPTED: Option C, narrowly qualified.** At the supported farthest zoom-out, location markers should not completely overlap. When a supported accepted spatial update would create fully coincident marker positions, prepare a minimal, deterministic movement toward the nearest clear side. Commit the corrected typed coordinate as part of the accepted, version/epoch/idempotency-safe atomic event batch, not on renderer zoom, pan or redraw. Player-edited locations are not inherently exempt under B9-D04 C.

This is not a general re-layout licence. Do not move region boundaries, rewrite fictional distances/route/containment, create travel, change character locations, or require a sophisticated layout solver. Existing overlapping region geometry stays valid under B9-D09. If supported constraints cannot be satisfied safely, preserve story facts and follow B9-D08's nonblocking conflict boundary.

## Later approved refinement, not retroactive change

**2026-11-01, Batch 10:** User explicitly approved **B9-D29 A**, a stable, minimal nearest-free offset strategy for fully overlapping markers, using consistent location order and tie-breaking. See [B9-D29](ADR-0098-stable-nearest-free-pin-offset-ordering.md). This refines D27's already accepted behaviour, rather than authorising broad original C.

The [B9 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) retains original A/B/C proposals and approvals. D12 remains deferred without migration, D13 deferred pending coordinator conflict clarification and D24 deferred without map keyboard interactions. No code, tests, staging promotion or formal B9 closure.
