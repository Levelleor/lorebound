---
type: architecture-decision
status: accepted
decision_id: "B8-D04"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B8 Batch 2 Option A with mutable-boundary clarification)"
tags:
  - planning/architecture
  - pass-b
  - spatial-canvas
  - architecture-decision
---

# B8-D04 — Mutable spatial region footprints separate from location containment

## Explicit approval and provenance

**2026-10-31 user direction:** “Review B8 Batch 2: B8-D04: A; B8-D05: A; B8-D06: B. Notes: Note: the region boundaries could change eventually so the boundaries are also a dynamic content which is subject for change eventually. Note: we want to just automatically place everything on the map, but user should be able to move the stuff however they like if they wish. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

This ADR records **B8-D04 Option A with the user's explicit clarification that region boundaries are dynamic, mutable world content**. [B8 Batch 2 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) retains original unapproved A/B/C alternatives. B8-D05 A and D06 **B** are independently accepted. No implementation, exact geometry schema, staging promotion or B8 closure approved.

## Accepted decision: Option A, dynamic mutable boundaries

1. **Boundaries are real, persistent *mutable* geography:** A spatial group or region (empire, province, settlement, building, room, or custom place) may have a semantically meaningful, supported footprint/extent/outline in its [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) local frame. A boundary is **not fixed forever** or just a painted decoration. Later grounded accepted narration or deliberately approved player corrections may **update, resize, reshape, replace or clear** its current footprint as ordered typed current-world assertions, using the same stable region identity.
2. **Containment remains distinct:** The accepted location parent/child membership relation is a separate acyclic keyed/current assertion; a pin near a line, a boundary crossing another boundary, or a region border changing does **not alone** automatically add/remove membership or transfer cities between empires. Where the story explicitly establishes **both** changing borders and actual territorial/administrative membership, record both grounded facts with an atomic accepted batch. Do not invent political change from a graphical overlap.
3. **Multiple types of group are allowed:** Geographic boundaries, administrative jurisdiction, fictional domain territories, buildings and rooms can differ in meaning and may overlap; no universal rule that all group footprints must be non-overlapping or politically authoritative. Appropriate type-specific rules and whether a given footprint is geographical/administrative are deferred.
4. **Map coherence without fabricated facts:** Current group geometry and child placements ought to be presented coherently in the same canvas at the correct nested scale. Technical type/frame/transform validity can be enforced; hypothetical physical or narrative impossibility is not a rejection reason once accepted in fiction. Boundary changes do not rewrite past journeys/events or automatically relocate characters, change routes or move every child pin.
5. **Player edits follow the canonical boundary:** Deliberately drawing, dragging or resizing a region is a **noncanonical preview until the player's explicit Approve/Commit** (or Discard), through [B8-D03](./B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) and Go/SQLite atomic/version/epoch/idempotency safeguards. Normal viewport pan/zoom remains visual only. Story-established changes use already-approved accepted-narration workflows.
6. **Autoplacement is separate:** [B8-D06 Option B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) later permits default generated map placement. That does not by itself change a region's asserted border or canonical containment relationship. If system-generated initial group footprints are introduced, distinguish their generated map-layout provenance from story-established borders and allow player correction; precise generation strategy remains deferred.
7. **Narrator-safe and replayable:** Map IDs remain private to the engine and out of prose-producing prompts. The latest accepted supported boundary assertion determines **current** footprint, not an independently mutable saved SVG/path layer. Original earlier boundary values are not kept as a separate immutable audit history.

## Original options

- **A — accepted with user clarification:** Persist spatial footprints; keep canonical containment relations separate; allow **later explicit world-state boundary updates**.
- **B — not selected:** Infer or silently rewrite containment solely from visual polygon overlap.
- **C — not selected:** Group boundaries are cosmetic and nonpersistent, incompatible with meaningful mutable world geography.

## Engineering details still open

Polygon/outline/shape representation and holes; unions, overlapping regions and non-Euclidean areas; border change event shape; frame transforms; how automatic initial group outlines work; user boundary editing tools; consistency fixtures and migration. No actual geography engine, shape renderer or user-interface implementation is claimed.

## Traceability

[B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), [B7-D10](./B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md), [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md), [B8-D03](./B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md), [IDEA-0033](../../staging/Hierarchical%20World%20Locations.md) and [IDEA-0037](../../staging/Zoomable%20Node%20Map%20Canvas.md). Owners S04/S05/S06/S11/S12.

## Decision history

- **2026-10-31:** B7-D10 approved meaningful persistent grouped spatial canvas; exact mutable footprint meaning was deferred.
- **2026-10-31:** B8-D04 A/B/C proposed, with A recommended, **not yet approved**.
- **2026-10-31:** User selected **D04 A** and explicitly stated that region boundaries **can change over time and must be dynamic content**. They separately approved D05 A and D06 **B**, with automatic placement/player override note. No further B8 decision or implementation approved.
