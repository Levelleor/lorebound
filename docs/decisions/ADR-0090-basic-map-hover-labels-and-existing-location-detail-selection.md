---
id: ADR-0090
type: adr
status: accepted
related:
- PRD-0038
- ADR-0085
supersedes: []
---

# Basic Map Hover Labels and Existing Location Detail Selection

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D21](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D21%20-%20Basic%20Map%20Hover%20Labels%20and%20Existing%20Location%20Detail%20Selection.md) · approved at: 2026-10-31; approved by: requesting user (B9 Batch 7 explicit Option A, geographic estimate qualification)

## Explicit approval

User explicitly approved B9 Batch 7 on 2026-10-31: D19 A, D20 A, D21 A. Additional condition: “For a, worst case just allow it to guess it and if guess doesn't work just use default value. Player will fix it.” User requested only explicitly approved ADRs, preservation of history, D12 deferred without spatial migration work, D13 deferred, and continued B9 review.

**ACCEPTED: Option A.** In the first basic map UI, hovering a recorded location shows a small tooltip/label with its known name and minimal already-known status if helpful. Selecting it opens or focuses the **existing** recorded location detail view, not a new advanced GIS editor.

## Operative rules

1. Hover, selection and basic inspection are transient read-only presentation state: no narrative turn, AI call, character travel or canonical map write.
2. Selection can inspect established recorded places, including places marked undiscovered, under [IDEA-0037](../product/PRD-0038-zoomable-node-map-canvas.md). Only their current known facts/relations are shown; no invented details.
3. [B9-D16 qualified A](ADR-0085-basic-map-navigation-and-shared-composer-commit-controls.md) still limits initial features to pan, zoom, hover and simple selection/inspection, without complex editing panels.
4. Any available deliberate world-map correction uses the existing pending shared composer **Commit/Discard above the primary chat action text field**, never a separate map-local Commit button. Hover/selection do not themselves create pending changes.
5. Read from typed TypeScript projections through the S04 drawing adapter; no independent map database. The user's estimate/default condition for D19/D20 concerns **geography**, not creating new tooltip content.

## Original alternatives and history

- **A ACCEPTED:** Simple known-name tooltip and selection to existing recorded location details.
- **B not selected:** Full GIS/route-editing inspection on hover.
- **C not selected:** No place information from hover or selection.
- **2026-10-31:** B9-D16 selected a basic map. Batch 7 user explicitly selected D21 A with separately approved D19/D20 geographic fallback qualification. No code, tests, migration, staging promotion or B9 design closure follows; D12/D13 remain deferred.
