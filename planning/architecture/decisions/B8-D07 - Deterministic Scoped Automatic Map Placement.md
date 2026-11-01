---
type: architecture-decision
status: accepted
decision_id: "B8-D07"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Batch 3 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - spatial-canvas
  - architecture-decision
---

# B8-D07 — Deterministic, scoped automatic initial map placement

## Explicit approval and provenance

**User approval, 2026-10-31:** “Review B8 Batch 3: B8-D07: A; B8-D08: A; B8-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and assess B8 design closure.”

This accepts **B8-D07 Option A**, not a mandatory AI location-placement call, random graph relayout, or broader implementation authorisation. The [B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) preserves the original A/B/C proposals. D08 and D09 have their own approvals; B8 closure is assessed only, not approved.

## Context

[B7-D10](./B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) requires a persistent meaningful spatial canvas. [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) uses nested local frames, and [B8-D06 Option B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) **explicitly supersedes earlier unplaced-until-grounded defaults**: each accepted newly created location receives an automatically generated, persisted initial map coordinate, with player repositioning. Generated placement is not an asserted measured distance in the story.

## Accepted decision — Option A

1. **Deterministic first placement:** On creation/acceptance of a *resolved, genuinely new* location, choose an initial location position with a deterministic algorithm scoped to its applicable supported containing local coordinate frame. The same accepted placement inputs/operation must not generate a different saved location on idempotent retries or replay. The first accepted generated location map fact is persisted, not recomputed on every render.
2. **Prefer grounded constraints:** Respect known applicable parent frame, authored place positions, region size/scale, grounded directional and relative-distance facts where supported. Without such facts use coherent default spacing/visual overlap avoidance **without pretending generated coordinates are narrator-established precise geography**.
3. **Do not move existing authored geography:** Placement of a new location must not silently regenerate the position of existing locations, especially player-adjusted or explicitly established pins. Do not re-layout an entire map when a new node appears.
4. **Generated provenance:** Tag generated initial coordinate as **system-sourced map placement**, distinct from accepted narrative relative/absolute spatial assertions and player-authored coordinate corrections. [B8-D08](./B8-D08%20-%20Provenance Aware Spatial Reconciliation of Generated Placement.md) defines when later grounded geography may displace only generated-only positions. An unrelated new location is no reason to change pins already committed.
5. **No invented world mechanics:** Automatic map layout does not commit roads, keys, journeys, region membership, character locations, measured route time/cost, a graph edge, or a fictional event explaining the placement. Explicit containment and travel topology remain separate.
6. **No mandatory new AI call:** The initial placement strategy does not require a second model invocation or a distinct model. Optional grounded context may inform deterministic placement, while exact layout algorithm, constraint weighting, random-seed strategy (if any) and bounds remain implementation questions.
7. **Player override and technical safety:** The player can move generated locations intentionally and Commit using the existing pending manual edit workflow. Initial placement participates in the coherent supported technical transaction of [B8-D09](./B8-D09%20-%20Atomic Canonical Location Creation and Initial Placement.md); malformed core data/technical write failures remain reportable, not silently discarded like optional ambiguous extraction candidates.

## Alternatives and status

- **A — ACCEPTED:** Deterministic frame-local, provenance-aware initial placement, preserving existing positions and optional grounded constraints, without extra required AI.
- **B — not chosen:** Randomly reshuffle existing placements every time the canvas opens or a story turn is accepted.
- **C — not chosen:** Require a separate generative model call for each location coordinate even when a deterministic default suffices.

## Deferred engineering details

Actual collision/spacing algorithm, placement order, coordinate-space bounds, initial size/scale defaults, world maps without known parent frames, deterministic tie-breaker/seeding, optional local model hints, batch placement and integration tests. No code or test results are claimed.

## Approval history

- **2026-10-31:** B8-D06 **B**, contrary to recommended A, approved automatic *durable* initial location placement and player repositioning.
- **2026-10-31:** B8-D07 A/B/C were proposed unapproved; A recommended a deterministic scoped algorithm.
- **2026-10-31:** User explicitly approved **B8-D07 A**, separately **D08 A** and **D09 A**, asking only for a **closure assessment**, not formal B8 closure.
