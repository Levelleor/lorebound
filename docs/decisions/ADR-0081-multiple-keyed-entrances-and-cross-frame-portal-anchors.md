---
id: ADR-0081
type: adr
status: accepted
related:
- ADR-0080
- NOTE-0003
- ADR-0066
- ADR-0057
- ADR-0062
- ADR-0075
- ADR-0077
supersedes: []
---

# Multiple Keyed Entrances and Cross Frame Portal Anchors

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D11](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D11%20-%20Multiple%20Keyed%20Entrances%20and%20Cross%20Frame%20Portal%20Anchors.md) · approved at: 2026-10-31; approved by: requesting user (explicit B9 Batch 4 Option A selection)

## Explicit approval

**User instruction, 2026-10-31:** “Review B9 Batch 4: B9-D10: A; B9-D11: A; B9-D12: defer. Additional conditions: For d12 do nothing. We don't want to do migration yet for these. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option A.** A location may have multiple optional stable keyed entrance/door/portal anchors and multiple separately identified grounded route associations, with each anchor placed relative to its supported local coordinate frame. Missing entrance facts remain unknown, not automatically created.

## Operative architecture

1. **Multiple stable identities:** A single location or region may expose several distinct entrances, doors, gates or portal anchors, each with a stable supported identity and an optional local-frame coordinate/attachment. Multiple keyed routes may connect the same pair of places without collapsing them into one edge.
2. **Grounded connectivity:** Actual route, doorway, portal endpoint and travel availability remain governed by accepted typed keyed relation assertions under [B8-D05](ADR-0066-stable-cross-frame-routes-with-grounded-door-and-portal-anchors.md) and [B7-D06](ADR-0057-typed-keyed-relations-and-derived-world-travel-graph.md). Geometry, region overlap, nearest points or an apparent line crossing **do not invent passable edges**.
3. **Cross-frame transforms:** Stable anchors and optional route-specific geometry use validated [B8-D01](ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md)/[B9-D05](ADR-0075-validated-local-frame-coordinates-and-mutable-region-geometry.md) local frame references and composed transforms for a unified canvas. Display scale/collapse may simplify drawing without changing the canonical keyed endpoints or relations.
4. **Separately meaningful routes:** A winding road, portal or door may have its own optional grounded path, cost, travel length, time or status, independent of geographic straight-line separation and numeric map conversion under B9-D07/D10. No implicit character movement from map pin or region edits.
5. **Atomic edits and projection:** Stable anchor/route assertions join the accepted ordered typed current-world event model; TypeScript derives the visual graph and Go ensures version/epoch/operation-safe atomic persistence. No second authoritative map/route database.
6. **No spatial migration authorised:** This approval specifies logical identity/multiplicity only. **B9-D12 remains deferred at the user's express request: do nothing on migration for these spatial contracts yet**. Exact anchor payloads, validation, UI and upgrade support are not decided or implemented.

## Alternatives and chronology

- **A — ACCEPTED:** Multiple stable keyed typed optional anchors/entrances and independently keyed grounded cross-frame routes.
- **B — not selected:** Exactly one permanent entrance and one route per pair of locations.
- **C — not selected:** Infer doors, portals or traversable routes from intersecting lines/boundaries.

- **2026-10-31:** B8-D05 A already accepted optional grounded cross-frame route anchors; anchor multiplicity/encoding was deferred.
- **2026-10-31 — B9 Batch 4:** User explicitly chose **D11 A**, alongside D10 A. **D12 deferred with “do nothing” on spatial migration**. No implementation, schema choice, tests, chapter closure or staging promotion follows.
