---
type: architecture-decision
status: accepted
decision_id: "B9-D20"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (B9 Batch 7 explicit Option A, geographic estimate qualification)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - spatial-fallback
---

# B9-D20 — Best-effort geographic estimate and deterministic fallback

## Explicit qualified acceptance

User explicitly approved B9 Batch 7 on 2026-10-31: D19 A, D20 A, D21 A. Additional condition: “For a, worst case just allow it to guess it and if guess doesn't work just use default value. Player will fix it.” User requested only explicitly approved ADRs, preservation of history, D12 deferred without spatial migration work, D13 deferred, and continued B9 review.

**ACCEPTED: Option A, qualified.** When an optional geographic phrase is unsupported or vague but its **location and containing frame are already unambiguously resolved**, Lorebound may try a reasonable numeric geographic placement/separation **estimate**. If this does not produce a valid usable value, use the supported **deterministic default** from [B9-D19](./B9-D19%20-%20Stable%20Default%20Root%20Frame%20and%20Initial%20Geographic%20Scale.md). Preserve the accepted story. The player may correct the map afterward.

This is a **later explicit qualification** of the unmodified Batch 7 proposal A and [B9-D10 A](./B9-D10%20-%20Versioned%20Deterministic%20Qualitative%20Distance%20Conversion%20Profiles.md)'s older no-guess wording for unsupported **geographic numeric placement**, not an inferred acceptance of universal arbitrary distances.

## Operative rules

1. **Identity before estimation:** Never guess which same-named existing location, door or region the narrator intended. [B9-D18](./B9-D18%20-%20Narrator%20Safe%20Spatial%20Reference%20Binding%20Without%20Invented%20Identities.md) and [B7-D03 C](./B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md) continue to require omitting ambiguous optional **entity/factual extraction**, without retaining a candidate queue. Do not invent routes, fictional assertions or fake stable IDs.
2. **Geographic guess allowed:** For resolved places, optionally derive a finite frame-valid semantic distance or placement from available clues/heuristics. The estimator, numeric constants and any optional use of existing model output are unspecified. No additional live AI call or live-model test is required.
3. **Fallback on failure:** Invalid, impossible, unavailable or unusable estimates fall back to a stable versioned default position/scale. Accepted prose and other grounded event assertions remain valid; a failed optional geography extraction is not a story veto.
4. **Engine value, not narrated survey:** A guessed geographic number becomes an accepted engine-derived map fact if committed, but is not represented as an exact distance explicitly measured by the narrator. Keep route time/cost separate under [B8-D02](./B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md).
5. **Canonical stability:** Commit a valid estimate/default atomically in current typed history; do not reroll on rendering or reopen. Later accepted event-triggered deterministic reconciliation follows [B9-D08](./B9-D08%20-%20Event%20Triggered%20Deterministic%20Spatial%20Reconciliation%20and%20Conflict%20Reporting.md). Core schema and Go storage errors cannot be swallowed as optional estimation failures.
6. **Manual correction:** Players may correct supported spatial facts with the already approved pending Commit overlay over the primary chat composer. D12/D13 remain deferred and no implementation/test/migration work is approved.

## Options and approval history

- **A ACCEPTED WITH QUALIFICATION:** Preserve story and grounded facts; estimate unsupported geographic placement for **resolved** entities when possible; otherwise deterministic default; no guessed identity.
- **B not selected:** One universal numeric distance for every unsupported phrase as if sourced.
- **C not selected:** Reject accepted narrative for optional unknown geography.
- **2026-10-31:** Earlier B7-D03 C and B9-D18 A forbade guessed entity binding; B9-D10 A's earlier wording forbade unsupported inferred metre numbers. Later Batch 7 user expressly allowed a geographic estimate/default, overriding **only** that latter restriction. Original proposals and approvals remain in B9 review.
