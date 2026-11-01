---
type: architecture-decision
status: accepted
decision_id: "B9-D14"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 5 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - spatial-rendering
---

# B9-D14 — Renderer-independent typed spatial projections and S04 canvas adapter

## Approval

**2026-10-31 explicit user instruction:** “Review B9 Batch 5: B9-D13: defer; B9-D14: A; B9-D15: A. Additional conditions: For d13, more Info. I just want the coordinator to handle that. Whatever it decides happens but we try to make it as good as possible. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, and continue B9.”

**ACCEPTED: Option A.** Keep canonical typed spatial domain data and current TypeScript projections independent of a particular drawing/rendering library. Use an S04 map presentation adapter for rendering and interactive visual state. Original A/B/C options remain in the [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md).

## Accepted boundary

1. **Domain authority is renderer-neutral:** Stable location/frame IDs, typed coordinates and geographic metre scales, nested transforms, dynamic region outlines and stable keyed route/portal anchors remain versioned current-world facts and replayable TypeScript read projections. They are not browser pixels, SVG/Canvas library nodes, graph-layout objects or Go-rendered image pixels.
2. **Presentation adapter:** S04 may use SVG, Canvas, WebGL or a library chosen **later** to implement drawing, pan/zoom, scene selection, hit-testing, visual grouping, labels and caches. This ADR makes no technology choice, does not prescribe a renderer class, and does not place gameplay rules into Svelte view components.
3. **Distinct map interaction:** Viewport gestures and highlighting do not change canon. Intentional pin movement or region/scale edits create pending noncanonical previews and follow the existing explicit manual Commit/Discard path through application/coordinator contracts, never a direct renderer-side persistence write.
4. **Automatic repositioning remains possible:** [B9-D04 C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) allows automatic movement of *any* pin, including a previously manually positioned pin. [B9-D08 A](./B9-D08%20-%20Event%20Triggered%20Deterministic%20Spatial%20Reconciliation%20and%20Conflict%20Reporting.md) limits this to deterministic, accepted-change-triggered canonical spatial updates. Renderer redraw, pan, zoom and reload do **not** silently commit a new layout.
5. **Typed semantic distance:** [B9-D07 B](./B9-D07%20-%20Automatic%20Numeric%20Metre%20Conversion%20of%20Qualitative%20Geography.md)/[B9-D10 A](./B9-D10%20-%20Versioned%20Deterministic%20Qualitative%20Distance%20Conversion%20Profiles.md) own geographic metre conversion and scale meaning, not a drawing engine.
6. **Verification scope:** Follow [B9-D06 A](./B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) for mocked adapter/component verification; it is not evidence a real renderer or host ran.

## Options and tradeoffs

- **A — ACCEPTED:** Renderer-neutral typed domain plus S04 display adapter. Extra adapter boundary, but no graphics-library lock-in on canonical geography.
- **B — not selected:** Treat a graph library's browser pixel nodes as canonical saved positions.
- **C — not selected:** Generate authoritative geographic imagery in Go and read back positions from its pixels.

## History and deferred matters

- **2026-10-31:** B1-D01 accepted framework-independent domain; B7/B8/B9 accepted a semantic spatial canvas, typed frames and current replay, distinct from an abstract route graph.
- **2026-10-31:** User accepted **B9-D14 A** separately from **B9-D15 A**. **B9-D13 deferred**, with a user preference for coordinator-led best-effort conflict handling, not an approved conflict policy. **B9-D12 remains deferred with no spatial migration work.**
- Still unchosen: renderer/library, visual interaction implementation, performance strategy, hit-testing API, scale-bar/overlap presentation and tests. No code, migration, tests, staging promotion or formal B9 closure approved.
