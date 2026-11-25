---
id: ADR-0080
type: adr
status: accepted
related:
- ADR-0081
- NOTE-0003
- ADR-0077
- ADR-0062
- ADR-0075
- ADR-0063
- ADR-0078
supersedes: []
---

# Versioned Deterministic Qualitative Distance Conversion Profiles

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D10](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D10%20-%20Versioned%20Deterministic%20Qualitative%20Distance%20Conversion%20Profiles.md) · approved at: 2026-10-31; approved by: requesting user (explicit B9 Batch 4 Option A selection)

## Explicit approval

**User instruction, 2026-10-31:** “Review B9 Batch 4: B9-D10: A; B9-D11: A; B9-D12: defer. Additional conditions: For d12 do nothing. We don't want to do migration yet for these. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option A.** Select a supported, documented, **versioned and deterministic conversion table or profile** for converting qualitative geographic relations into exact finite metre constraints. This is the mechanism for previously approved [B9-D07 Option B](ADR-0077-automatic-numeric-metre-conversion-of-qualitative-geography.md). It does **not** settle any actual phrase-to-metre constants, input parser, calibration default, or code.

## Operative architecture

1. **Deterministic supported phrases:** For each supported qualitative relation (for example, nearby, far, very far, north of), resolve the relevant local-frame type/scale, declared units and a stable versioned conversion profile to produce typed numeric metre constraints. Direction and distance are distinct inputs where supported. Conversion never depends on non-reproducible random values, current screen zoom or an unrecorded model reroll.
2. **Version and semantic stability:** Preserve enough applicable profile/version information or equivalent deterministic rule meaning in *current supported canonical data* so replay, Undo/Fork and reopening interpret accepted numeric geographic constraints consistently. The exact representation remains an engineering choice; this is **not approval to implement data migrations now**.
3. **Local-frame scale:** Respect accepted [B8-D01 nested coordinate frames](ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md) and [B9-D05 validated geometry](ADR-0075-validated-local-frame-coordinates-and-mutable-region-geometry.md). A room-scale phrase and a continent-scale phrase need not share an arbitrary global multiplier. Real viewport pixels, device pixel ratio and transient pan/zoom are not durable metre-scale inputs.
4. **Technical validation:** Validate supported finite values, unit/scale consistency and frame references. For unsupported or ambiguous phrases do **not** manufacture a silently guessed distance or report a model assertion as the narrator's explicitly measured number. The exact unsupported-input handling is deferred, subject to existing optional-extraction ambiguity rules.
5. **Canonical vs narrated meaning:** The derived number is an *engine numeric geographic constraint*, not a verbatim narrative survey. No coordinate player/AI author labels or fixed/pinned state are introduced. Road/portal length, duration, cost and connectivity remain separately grounded route facts under [B8-D02](ADR-0063-geographic-separation-distinct-from-route-travel-geometry.md).
6. **Commit and conflict path:** When accepted spatial changes require new numeric geography or adjusted coordinates, use [B9-D08](ADR-0078-event-triggered-deterministic-spatial-reconciliation-and-conflic.md)'s relevant-change trigger and atomic current-history commitment, not every redraw. Preserve irreconcilable accepted facts and report nonblocking conflict.

## Earlier alternatives, approval history and scope

- **A — ACCEPTED:** Versioned deterministic conversion table/profile, calibrated by supported local-frame units and scales; repeatable typed metre constraints.
- **B — not selected:** Universal hardcoded multiplier for all world scales.
- **C — not selected:** Ask AI to invent a new exact distance whenever the map renders.

- **2026-10-31:** B9-D07 B established automatic exact numeric metre conversion from qualitative geography, deliberately overriding earlier anti-fabricated-precision guidance. No numeric constants were selected.
- **2026-10-31 — B9 Batch 4:** User expressly selected **B9-D10 A** and independently **B9-D11 A**; **B9-D12 was explicitly deferred with no migration work authorised for these spatial contracts**. This ADR is not a migration instruction.
- **Still deferred:** Numeric lookup table, supported phrases, phrase ambiguity rules, frame-specific calibration, field types, mapper implementation, migration strategy and tests. No code/tests, release or staging approval.
