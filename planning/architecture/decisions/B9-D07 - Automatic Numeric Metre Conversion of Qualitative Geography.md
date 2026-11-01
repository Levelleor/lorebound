---
type: architecture-decision
status: accepted
decision_id: "B9-D07"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 3 option selection)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - spatial-distance
---

# B9-D07 — Automatic conversion of qualitative geographic relations into exact numeric metres

## Approval, selected alternative and precedence

**Explicit user approval, 2026-10-31:** “Review B9 Batch 3: B9-D07: B; B9-D08: A; B9-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option B, contrary to recommended A.** **Automatically convert supported qualitative geographic statements into mandatory exact numeric metre values for map geometry, and interpret drawn geographic pixel separation at the current declared scale as that numeric measurement.** The earlier Option A policy of keeping qualitative expressions nonnumeric unless independently measured was **not selected**. Original alternatives and dated rationale remain in the [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md).

This is a **later explicit override** of earlier “do not invent exact metric separation from ‘far apart’” language in [B8-D08](./B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md), [B8-D02](./B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) and related B8 spatial notes **insofar as it prohibited numeric conversion of qualitative *geographic* descriptions**. The conversion knowingly assigns exact numerical precision to descriptions that did not supply it. This is a chosen trade-off, not a claim that a narrator stated a surveyed distance.

## Accepted technical direction

1. **Numeric conversion, not just visual heuristics:** Supported qualitative geographic relationships (for example “near”, “far east of”, “very distant”) are automatically interpreted as **numeric metre-based geographic constraints** rather than remaining solely qualitative renderer hints. A stable, versioned, deterministic conversion policy is needed for repeatable initial placement, future reconciliation and current-event replay. **The actual phrase-to-metre constants, unit defaults and parser rules remain deferred** and must not be silently treated as approved here.
2. **Exact metres and rendered length:** The resulting converted geographic distance is numerical in the supported map's semantic local-frame measurement system. Declared nested frame scales/transforms determine how map pixels correspond to **metres** at a given zoom. Raw viewport coordinates, unscaled screenshots or device pixel density are **not themselves** a stable measured-world reference.
3. **Interpretation versus source text:** The converted value is an **engine-derived exact map/geographic measurement**, not evidence the story explicitly used that numeric quantity. The original source may still be described naturally as “far east”. Do not invent a quoted narrator measurement or expose internal IDs to prose-producing prompts. No player/AI coordinate author label or per-pin protection state is added ([B9-D01](./B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md); [B9-D04](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md)).
4. **Keep route measurements independent:** This **changes the geographic-separation precision rule**, not the older [B8-D02](./B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) requirement that road/portal route length, journey time/cost and passability are distinct, separately grounded optional facts. Do **not** infer measured travel time, travel route length or route creation from the newly assigned straight-line metres or connector pixels. A “three days by road” relation remains a route/time assertion, not automatically an exact straight-line metre fact by itself.
5. **Deterministic canonical history:** TypeScript prepares supported derived geographic numeric assertions within the typed current-history schema; Go enforces technical version/epoch/idempotency/transaction checks and commits them atomically as appropriate. Subsequent accepted story changes follow [B9-D08 A](./B9-D08%20-%20Event%20Triggered%20Deterministic%20Spatial%20Reconciliation%20and%20Conflict%20Reporting.md). Do not mutate canon on redraw/zoom alone.
6. **Conflict handling:** If explicit geographic facts, user changes or multiple derived numeric constraints cannot be simultaneously satisfied, [B9-D08 A](./B9-D08%20-%20Event%20Triggered%20Deterministic%20Spatial%20Reconciliation%20and%20Conflict%20Reporting.md) preserves accepted facts and surfaces a nonblocking conflict. D07-B's numeric-conversion approval is **not** permission to fabricate an arbitrary extra reconciliation number beyond the specified conversion scheme or reject narrative canon.

## Original Batch 3 alternatives and trade-off

- **A — not selected (previously recommended):** Preserve qualitative relation types, with numerical separations only when explicitly grounded.
- **B — ACCEPTED:** Automatically map qualitative geography to exact metre values and treat drawn scaled geographic separation as the numeric measurement; simpler unified numeric constraints at the expense of **invented precision**.
- **C — not selected:** Keep all geographic direction/distance relationships as untyped free text.

## Deferred engineering, evidence and history

**Still to decide:** phrase-to-metre mapping, configurable scales per local frame, axes/orientation/precision, source association for transformed values without actor labels, handling conflicting or unknown phrases, numeric overflow/invalid units, renderer scale bars, version migration and mocked fixtures. **No actual numeric constants, algorithm, UI, code, test outcome, implementation gate or B9 closure is accepted by this ADR.**

- **2026-10-31:** B8 accepted meaningful geographic canvas and avoided exact fabricated metric separation from qualitative statements while keeping route costs separate.
- **2026-10-31:** B9 Batch 3 presented A (recommended), B and C as unapproved proposals.
- **2026-10-31 — explicit subsequent selection:** User approved **B9-D07 B**, overriding the geographic *precision* restriction and preserving independent route-specific measurements. D08 A/D09 A were approved separately.
