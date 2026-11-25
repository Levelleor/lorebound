---
id: ADR-0083
type: adr
status: accepted
related:
- ADR-0082
- ADR-0084
- NOTE-0003
- ADR-0074
- ADR-0078
- ADR-0077
- ADR-0080
- ADR-0076
- ADR-0001
supersedes: []
---

# Renderer Independent Spatial Projections and S04 Canvas Adapter

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D14](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D14%20-%20Renderer%20Independent%20Spatial%20Projections%20and%20S04%20Canvas%20Adapter.md) · approved at: 2026-10-31; approved by: requesting user (explicit B9 Batch 5 Option A approval)

## Approval

**2026-10-31 explicit user instruction:** “Review B9 Batch 5: B9-D13: defer; B9-D14: A; B9-D15: A. Additional conditions: For d13, more Info. I just want the coordinator to handle that. Whatever it decides happens but we try to make it as good as possible. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, and continue B9.”

**ACCEPTED: Option A.** Keep canonical typed spatial domain data and current TypeScript projections independent of a particular drawing/rendering library. Use an S04 map presentation adapter for rendering and interactive visual state. Original A/B/C options remain in the [B9 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md).

## Accepted boundary

1. **Domain authority is renderer-neutral:** Stable location/frame IDs, typed coordinates and geographic metre scales, nested transforms, dynamic region outlines and stable keyed route/portal anchors remain versioned current-world facts and replayable TypeScript read projections. They are not browser pixels, SVG/Canvas library nodes, graph-layout objects or Go-rendered image pixels.
2. **Presentation adapter:** S04 may use SVG, Canvas, WebGL or a library chosen **later** to implement drawing, pan/zoom, scene selection, hit-testing, visual grouping, labels and caches. This ADR makes no technology choice, does not prescribe a renderer class, and does not place gameplay rules into Svelte view components.
3. **Distinct map interaction:** Viewport gestures and highlighting do not change canon. Intentional pin movement or region/scale edits create pending noncanonical previews and follow the existing explicit manual Commit/Discard path through application/coordinator contracts, never a direct renderer-side persistence write.
4. **Automatic repositioning remains possible:** [B9-D04 C](ADR-0074-all-coordinates-eligible-for-automatic-layout.md) allows automatic movement of *any* pin, including a previously manually positioned pin. [B9-D08 A](ADR-0078-event-triggered-deterministic-spatial-reconciliation-and-conflic.md) limits this to deterministic, accepted-change-triggered canonical spatial updates. Renderer redraw, pan, zoom and reload do **not** silently commit a new layout.
5. **Typed semantic distance:** [B9-D07 B](ADR-0077-automatic-numeric-metre-conversion-of-qualitative-geography.md)/[B9-D10 A](ADR-0080-versioned-deterministic-qualitative-distance-conversion-profiles.md) own geographic metre conversion and scale meaning, not a drawing engine.
6. **Verification scope:** Follow [B9-D06 A](ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) for mocked adapter/component verification; it is not evidence a real renderer or host ran.

## Options and tradeoffs

- **A — ACCEPTED:** Renderer-neutral typed domain plus S04 display adapter. Extra adapter boundary, but no graphics-library lock-in on canonical geography.
- **B — not selected:** Treat a graph library's browser pixel nodes as canonical saved positions.
- **C — not selected:** Generate authoritative geographic imagery in Go and read back positions from its pixels.

## History and deferred matters

- **2026-10-31:** B1-D01 accepted framework-independent domain; B7/B8/B9 accepted a semantic spatial canvas, typed frames and current replay, distinct from an abstract route graph.
- **2026-10-31:** User accepted **B9-D14 A** separately from **B9-D15 A**. **B9-D13 deferred**, with a user preference for coordinator-led best-effort conflict handling, not an approved conflict policy. **B9-D12 remains deferred with no spatial migration work.**
- Still unchosen: renderer/library, visual interaction implementation, performance strategy, hit-testing API, scale-bar/overlap presentation and tests. No code, migration, tests, staging promotion or formal B9 closure approved.
