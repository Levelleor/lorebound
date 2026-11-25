---
id: ADR-0089
type: adr
status: accepted
related:
- ADR-0088
- ADR-0080
- ADR-0087
- ADR-0054
- ADR-0063
- ADR-0078
supersedes: []
---

# Best Effort Spatial Estimates with Deterministic Default Fallback

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D20](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D20%20-%20Best%20Effort%20Spatial%20Estimates%20with%20Deterministic%20Default%20Fallback.md) · approved at: 2026-10-31; approved by: requesting user (B9 Batch 7 explicit Option A, geographic estimate qualification)

## Explicit qualified acceptance

User explicitly approved B9 Batch 7 on 2026-10-31: D19 A, D20 A, D21 A. Additional condition: “For a, worst case just allow it to guess it and if guess doesn't work just use default value. Player will fix it.” User requested only explicitly approved ADRs, preservation of history, D12 deferred without spatial migration work, D13 deferred, and continued B9 review.

**ACCEPTED: Option A, qualified.** When an optional geographic phrase is unsupported or vague but its **location and containing frame are already unambiguously resolved**, Lorebound may try a reasonable numeric geographic placement/separation **estimate**. If this does not produce a valid usable value, use the supported **deterministic default** from [B9-D19](ADR-0088-stable-default-root-frame-and-initial-geographic-scale.md). Preserve the accepted story. The player may correct the map afterward.

This is a **later explicit qualification** of the unmodified Batch 7 proposal A and [B9-D10 A](ADR-0080-versioned-deterministic-qualitative-distance-conversion-profiles.md)'s older no-guess wording for unsupported **geographic numeric placement**, not an inferred acceptance of universal arbitrary distances.

## Operative rules

1. **Identity before estimation:** Never guess which same-named existing location, door or region the narrator intended. [B9-D18](ADR-0087-narrator-safe-spatial-reference-binding-without-invented-identit.md) and [B7-D03 C](ADR-0054-discard-unresolved-extraction-suggestions-without-diagnostics.md) continue to require omitting ambiguous optional **entity/factual extraction**, without retaining a candidate queue. Do not invent routes, fictional assertions or fake stable IDs.
2. **Geographic guess allowed:** For resolved places, optionally derive a finite frame-valid semantic distance or placement from available clues/heuristics. The estimator, numeric constants and any optional use of existing model output are unspecified. No additional live AI call or live-model test is required.
3. **Fallback on failure:** Invalid, impossible, unavailable or unusable estimates fall back to a stable versioned default position/scale. Accepted prose and other grounded event assertions remain valid; a failed optional geography extraction is not a story veto.
4. **Engine value, not narrated survey:** A guessed geographic number becomes an accepted engine-derived map fact if committed, but is not represented as an exact distance explicitly measured by the narrator. Keep route time/cost separate under [B8-D02](ADR-0063-geographic-separation-distinct-from-route-travel-geometry.md).
5. **Canonical stability:** Commit a valid estimate/default atomically in current typed history; do not reroll on rendering or reopen. Later accepted event-triggered deterministic reconciliation follows [B9-D08](ADR-0078-event-triggered-deterministic-spatial-reconciliation-and-conflic.md). Core schema and Go storage errors cannot be swallowed as optional estimation failures.
6. **Manual correction:** Players may correct supported spatial facts with the already approved pending Commit overlay over the primary chat composer. D12/D13 remain deferred and no implementation/test/migration work is approved.

## Options and approval history

- **A ACCEPTED WITH QUALIFICATION:** Preserve story and grounded facts; estimate unsupported geographic placement for **resolved** entities when possible; otherwise deterministic default; no guessed identity.
- **B not selected:** One universal numeric distance for every unsupported phrase as if sourced.
- **C not selected:** Reject accepted narrative for optional unknown geography.
- **2026-10-31:** Earlier B7-D03 C and B9-D18 A forbade guessed entity binding; B9-D10 A's earlier wording forbade unsupported inferred metre numbers. Later Batch 7 user expressly allowed a geographic estimate/default, overriding **only** that latter restriction. Original proposals and approvals remain in B9 review.
