---
type: architecture-decision
status: accepted
decision_id: "B9-D19"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (B9 Batch 7 explicit Option A, geographic estimate qualification)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - spatial-root-frame
---

# B9-D19 — Stable default root frame and initial geographic scale

## Explicit approval and qualification

User explicitly approved B9 Batch 7 on 2026-10-31: D19 A, D20 A, D21 A. Additional condition: “For a, worst case just allow it to guess it and if guess doesn't work just use default value. Player will fix it.” User requested only explicitly approved ADRs, preservation of history, D12 deferred without spatial migration work, D13 deferred, and continued B9 review.

**ACCEPTED: Option A.** Provide a stable supported root local coordinate frame and declared default scale/profile for each adventure world map. Automatically position new resolved locations deterministically, without requiring the player to configure a geographic projection. In sparse geography, a technically valid best-effort estimate **may be tried first**; if it fails, use a stable deterministic default. The player can correct spatial facts later using the existing shared pending Commit/Discard controls over the main chat input.

## Operative rules

1. Root frame identity/scale remains independent of browser viewport/window pixels and can contain nested local frames under [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md).
2. Supported qualitative geography uses [B9-D10 A](./B9-D10%20-%20Versioned%20Deterministic%20Qualitative%20Distance%20Conversion%20Profiles.md). For unknown/unsupported scale or initial arrangement, choose a valid best-effort estimate when useful, **otherwise the declared deterministic default**. Specific values, mapping rules and algorithms remain deferred.
3. Persist chosen positions as typed accepted events atomically with accepted locations per [B9-D17](./B9-D17%20-%20Deterministic%20Atomic%20Batch%20Placement%20of%20Multiple%20New%20Locations.md); never reroll on pan/zoom/reload/ordinary replay.
4. Estimated/default geographic metres are engine map values, not exact surveyed narrator facts, route travel metrics, newly invented roads or implicit containment. Do not guess ambiguous entity IDs under [B9-D18](./B9-D18%20-%20Narrator%20Safe%20Spatial%20Reference%20Binding%20Without%20Invented%20Identities.md).
5. Deliberate player correction still requires the established shared composer pending Commit/Discard and Go atomic technical acceptance; no map-specific Commit UI.
6. D12 spatial migration stays deferred with no work; D13 conflict handling stays deferred pending clarification. No implementation, tests, stage promotion or B9 closure approved.

## Original alternatives and history

- **A ACCEPTED:** Stable default root local frame and scale, with the user's estimate-then-default qualification.
- **B not selected:** Permanent map scale derived from initial viewport pixels.
- **C not selected:** Require manual coordinate setup before any location exists.
- **2026-10-31:** B8-D06 B accepted automatic initial locations; B9-D07/D10 accepted numeric conversions. Later Batch 7 user explicitly accepted D19 A, alongside D20 A and D21 A, permitting a useful estimate then default with later player adjustment. Original alternatives remain in the B9 review.
