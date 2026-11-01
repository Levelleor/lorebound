---
type: architecture-decision
status: accepted
decision_id: "B9-D28"
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

# B9-D28 — Immediately recenter open map when Playing As selection changes

## Explicit approval

User's Batch 10 selections: **B9-D28 B, B9-D29 A, B9-D30 A**, with express instructions to keep D12 deferred without migration, D13 deferred pending clarification, D24 deferred without map keyboard interaction, and **not formally close B9 without separate approval**.

**ACCEPTED: Option B.** When the user changes Playing As in Settings while the map is open, immediately centre the map on the newly selected character's known accepted current location. If no selected character or mappable current position is available, use the stable default viewport coordinates under D26. Do not snap on ordinary movement/current-location changes, which is alternative C rather than the selected B. Recentring changes only disposable pan/zoom view state, never canonical geography, characters, story turns, or events. Preserve D25 temporary view, D26 initial location priority, no map keyboard interaction under deferred D24. This deliberately supersedes the originally recommended D28 A policy of leaving an already open map undisturbed.

## Alternatives and chronological boundaries

The original A/B/C alternatives remain in the [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md). Only the option above was approved; the other alternatives remain unselected. Earlier accepted decisions and dates remain intact, subject only to the explicit later refinement documented here. This ADR approves architecture and assessment scope only, not code, tests, migration, staging promotion, or formal B9 design closure.
