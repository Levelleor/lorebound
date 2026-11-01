---
type: architecture-decision
status: accepted
decision_id: "B9-D25"
phase: "B9"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit B9 Batch 9 response)"
---

# B9-D25 — Disposable pan and zoom viewport state

## Explicit acceptance

User selected B9-D25 A, B9-D26 A, B9-D27 C, clarifying: “For 26 just ensure that it is using the default location the player is in. Otherwise just show the default coordinates instead.” For D27: “locations never overlap entirely on the lowest zoom. So even if they do according to interpreter just shift them a bit to the closest side to place. That's all.”

**ACCEPTED: A.** Pan and zoom are temporary S04 presentation state, never canonical story or map events. No separate durable preferences subsystem. On map open/reopen, use the initial view selected by B9-D26: the chosen Playing As character's known accepted current location, or default coordinates. No stored zoom restoration promise. Pan, zoom, hover and reopen must not modify saved geography or invoke model calls. Existing player map corrections continue through the shared primary chat composer Commit/Discard overlay. D12, D13 and D24 remain deferred.

## Alternatives and approval history

Original alternatives remain unchanged in [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md). D25 B/C, D26 B/C and D27 A/B were not selected. D26's selected-character opening and D27's minimum-zoom pin-only separation explicitly narrow the respective proposed options; do not represent broad original D27 C as approved. Previously accepted B9-D08 deterministic accepted-change-only rules and B9-D09 overlapping region geometry remain binding. B9-D12 stays deferred without migration, B9-D13 deferred for coordinator handling clarification, and B9-D24 deferred with no map keyboard controls. No implementation, tests, staging promotion or B9 closure approved.
