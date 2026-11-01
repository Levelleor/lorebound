---
type: architecture-decision
status: accepted
decision_id: "B9-D17"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 6 Option A; D16 qualified with basic map UX and existing composer controls)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - atomic-location-placement
---

# B9-D17 — Deterministic atomic creation and initial placement of multiple new locations

## Explicit approval

**User's explicit 2026-10-31 instruction:** “Review B9 Batch 6: B9-D16: A; B9-D17: A; B9-D18: A. Additional conditions: For d16 well support some basic functionality like planning or zooming and hovering but not anything advanced. Commit buttons remain where they were planned initially over the action text area on the primary chat field. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, keep B9-D13 deferred pending clarification, and continue B9.”

**ACCEPTED: Option A.** When one supported accepted narrative/world change establishes **several distinct, grounded and resolved new location identities**, prepare their first coordinates deterministically and commit **all applicable new identities and first positions in the single accepted atomic story/world transaction**, with coherent idempotent retries. The original alternatives remain in the [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md).

## Operative contract

1. **Resolve entities before placement:** TypeScript contextual interpretation and ID binding must distinguish genuine newly accepted locations from existing identities and ambiguous optional extraction. Do not create duplicate identities to satisfy an unsupported guess, and do not silently invent routes or narrative facts.
2. **Stable ordered multi-location layout:** Scope each new location to its supported containing frame and relevant accepted spatial constraints. Choose stable location ordering and deterministic relative positions, considering simultaneous sibling placement as a batch when useful, under [B8-D07](./B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md) and [B9-D10](./B9-D10%20-%20Versioned%20Deterministic%20Qualitative%20Distance%20Conversion%20Profiles.md). Exact ordering keys, collision/spacing rules and conversion constants remain deferred.
3. **Single canonical commit:** Bundle the accepted passage/outcome events, each supported new location identity, its automatically chosen **typed first coordinate**, and necessary supported related facts into **the same prepared atomic transaction**. [B8-D09](./B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md) forbids committed orphan identities or ghost pins, and [B9-D02](./B9-D02%20-%20TypeScript%20Prepared%20Events%20and%20Go%20SQLite%20Atomic%20Commit%20Authority.md)/[B9-D15](./B9-D15%20-%20Versioned%20Typed%20Browser%20Go%20Spatial%20Service%20Contracts.md) provide the TypeScript-prepared/Go-technical atomicity contract.
4. **Idempotency and replay:** Same prepared attempt ID cannot create duplicates or produce different positions on retry; expected version/epoch fencing rejects stale conflicting attempts. Accepted current history deterministically reconstructs all locations and positions across supported replay, Undo and Fork without new AI calls.
5. **Ambiguous optional extraction:** Follow [B7-D03 C](./B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md) and [B7-D08 A](./B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md). Unresolved optional automatic location suggestions are omitted rather than inventing a stable ID; genuine required-core technical violations remain reportable. A valid accepted story need not be rejected solely because a nonessential extraction could not be grounded.
6. **Preserve semantic separations:** Generated initial map metres are not explicit road travel time/cost or evidence of routes/containment not separately asserted. Later permitted automatic updates to any pin still follow [B9-D04 C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) and event-triggered [B9-D08 A](./B9-D08%20-%20Event%20Triggered%20Deterministic%20Spatial%20Reconciliation%20and%20Conflict%20Reporting.md).
7. **No migration or implementation work implied:** D12 remains deferred with **no spatial migration**; mock suite constraints are unaffected. Exact event payload/SQLite layout and code remain unapproved.

## Alternatives

- **A — ACCEPTED:** Stable, frame-scoped batch initial placement and one atomic accepted story/world commit.
- **B — not selected:** Commit each new identity and position separately, risking partly accepted story history.
- **C — not selected:** Regenerate unsaved random positions whenever a map renders/opens.

## History

- **2026-10-31:** B8-D09 accepted atomic location+initial coordinate for a resolved accepted new location. B9-D02 and D15 accepted a versioned typed cross-runtime commit boundary.
- **2026-10-31 — Batch 6:** User explicitly accepted **D17 A**, separately from qualified D16 A and D18 A. This decision extends existing atomicity to multiple co-created locations in one accepted batch and does not approve tests, code, stage promotion, migration or B9 closure.
