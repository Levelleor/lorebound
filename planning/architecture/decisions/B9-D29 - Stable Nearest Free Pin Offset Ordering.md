---
type: architecture-decision
status: accepted
decision_id: "B9-D29"
phase: "B9"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit B9 Batch 10 selection)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
---

# B9-D29 — Stable minimal offset ordering for totally overlapping pins

## Explicit approval

User's Batch 10 selections: **B9-D28 B, B9-D29 A, B9-D30 A**, with express instructions to keep D12 deferred without migration, D13 deferred pending clarification, D24 deferred without map keyboard interaction, and **not formally close B9 without separate approval**.

**ACCEPTED: Option A.** At the supported farthest zoom-out baseline, identify location markers that would be fully coincident. Process affected locations in stable entity identity order; test a small documented fixed neighbour-direction order and select the nearest technically valid free placement. Use the minimum workable displacement and deterministic tie-breaking, not a physics engine, full geometry solver, new model call, or global map rearrangement. Commit resulting supported typed coordinates only together with an eligible accepted canonical spatial-world event, atomically, replayably and idempotently. Never write merely because the user zooms, pans, reloads or redraws. Do not rewrite region footprints, route identities, containment or accepted fictional geographic facts. If impossible without violating accepted constraints, preserve those and use D08 nonblocking conflict handling; D13 UI detail remains deferred. This refines qualified D27 C, not an approval of broad polygon movements.

## Alternatives and chronological boundaries

The original A/B/C alternatives remain in the [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md). Only the option above was approved; the other alternatives remain unselected. Earlier accepted decisions and dates remain intact, subject only to the explicit later refinement documented here. This ADR approves architecture and assessment scope only, not code, tests, migration, staging promotion, or formal B9 design closure.
