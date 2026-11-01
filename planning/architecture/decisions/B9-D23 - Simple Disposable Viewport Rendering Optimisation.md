---
type: architecture-decision
status: accepted
decision_id: "B9-D23"
phase: "B9"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit B9 Batch 8 option selection)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - map-render-performance
---

# B9-D23 — Keep viewport rendering simple and disposable

## Explicit approval and qualification

**Explicit user selection:** “Review B9 Batch 8: B9-D22: C; B9-D23: A; B9-D24: defer. Additional conditions: For d23 just make a note that shoulbw as easy as possible and not introduce any advanced d it's. No keyboard interaction for the map. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, keep B9-D13 deferred pending clarification, and continue B9.”

**ACCEPTED: Option A, with a strict simplicity condition.** Render a basic pan/zoom/hover spatial map from disposable, viewport-relevant TypeScript projections rather than forcing all world objects into the visible scene. **Use the simplest implementation that is adequate**. Do not impose advanced indexing frameworks, complex level-of-detail engines, elaborate culling pipelines, WebGL, worker infrastructure or optimisation subsystems until measured map size/performance warrants them.

The user's note contains transcription errors (“shoulbw ... advanced d it's”), preserved verbatim above; the unambiguous intent is to **keep D23 as easy as possible and avoid advanced features**. This ADR records that, not an invented detailed technical framework.

## Accepted design

1. **Start simple:** Draw the currently relevant visible locations and routes using the existing [B9-D14 A](./B9-D14%20-%20Renderer%20Independent%20Spatial%20Projections%20and%20S04%20Canvas%20Adapter.md) renderer-neutral data and basic [B9-D16 qualified A](./B9-D16%20-%20Basic%20Map%20Navigation%20and%20Shared%20Composer%20Commit%20Controls.md) UI. Conventional view clipping, pan/zoom transforms or a small visible-items filter are sufficient if responsive.
2. **Optional lightweight improvements:** Simplify hidden/small detail by zoom level or skip clearly offscreen objects **only if needed**. Spatial indexes and more elaborate memoisation are permissible future engineering optimisations, **not required first-iteration work or a mandate to adopt special libraries**.
3. **Rendering is noncanonical:** Transient culling/selection/draw caches are projections, not persisted story or geography. The map must **never rewrite canonical location positions to make rendering faster**. B9-D08 A still restricts legitimate automatic canonical map reconciliation to supported accepted world changes.
4. **No artificial world cap:** Renderer performance alone is not a reason to impose a tiny fixed number of canonically stored adventure locations. Design gracefully for larger worlds without speculative complexity.
5. **Tests and scope:** When later implemented, test basic rendering/projection behaviour with the [B9-D06 A](./B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) mocked contract approach; this approval is **not evidence of performance testing** or actual UI implementation.
6. **Independent deferrals:** D24 **deferred**; explicit user request **no map keyboard interaction** is a scope instruction, not approval of D24 B or removal of other unrelated accessibility requirements. D12 still deferred with no spatial migration work; D13 still deferred awaiting coordinator-conflict clarification.

## Alternatives and approval history

- **A — ACCEPTED WITH SIMPLICITY QUALIFICATION:** Disposable viewport-relevant render projection and optional culling/simplification when beneficial. Do not overengineer.
- **B — not selected:** Mass rewrite canonical coordinates on slow redraw.
- **C — not selected:** Arbitrary small canonical location cap.
- **2026-11-01:** User accepted D23 A and stressed maximum simplicity, selected D22 C and deferred D24 with “No keyboard interaction for the map.” This does not authorise a new advanced renderer or implementation.
