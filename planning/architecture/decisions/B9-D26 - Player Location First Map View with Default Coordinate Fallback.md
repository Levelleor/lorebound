---
type: architecture-decision
status: accepted
decision_id: "B9-D26"
phase: "B9"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit B9 Batch 9 response)"
---

# B9-D26 — Player-location-first map opening with default fallback

## Explicit acceptance

User selected B9-D25 A, B9-D26 A, B9-D27 C, clarifying: “For 26 just ensure that it is using the default location the player is in. Otherwise just show the default coordinates instead.” For D27: “locations never overlap entirely on the lowest zoom. So even if they do according to interpreter just shift them a bit to the closest side to place. That's all.”

**ACCEPTED: A, qualified.** The initial map viewport centres on the known current accepted location of the selected Playing As character, where a valid map position exists. Lorebound has no permanent protagonist; never manufacture a player character or a location. If no Playing As character is selected, or their current location/position is unknown, open at the stable default map coordinates and zoom established by B9-D19. This is a presentation-only camera choice, not a change to the character, world or map pins. It explicitly supersedes the unqualified D26-A suggestion to fit all recorded places by default. No mandatory setup or new navigation controls.

## Alternatives and approval history

Original alternatives remain unchanged in [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md). D25 B/C, D26 B/C and D27 A/B were not selected. D26's selected-character opening and D27's minimum-zoom pin-only separation explicitly narrow the respective proposed options; do not represent broad original D27 C as approved. Previously accepted B9-D08 deterministic accepted-change-only rules and B9-D09 overlapping region geometry remain binding. B9-D12 stays deferred without migration, B9-D13 deferred for coordinator handling clarification, and B9-D24 deferred with no map keyboard controls. No implementation, tests, staging promotion or B9 closure approved.
