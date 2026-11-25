---
id: ADR-0069
type: adr
status: accepted
related:
- ADR-0077
- ADR-0078
- ADR-0079
- ADR-0080
- ADR-0074
- ADR-0071
- ADR-0060
- ADR-0068
- ADR-0070
- ADR-0067
- ADR-0054
- ADR-0065
supersedes: []
---

# Provenance Aware Spatial Reconciliation of Generated Placement

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B8-D08](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md) · approved at: 2026-10-31; approved by: requesting user (explicit Batch 3 Option A approval)

## Latest B9 Batch 3 approval — 2026-10-31

The user explicitly accepted [B9-D07 B](ADR-0077-automatic-numeric-metre-conversion-of-qualitative-geography.md), [B9-D08 A](ADR-0078-event-triggered-deterministic-spatial-reconciliation-and-conflic.md), and [B9-D09 A](ADR-0079-valid-overlapping-mutable-region-geometry-without-implicit-conta.md). **D07 B expressly overrides earlier B8 advice against inferring exact geographic metres from qualitative statements**: supported relative geography converts to exact metre constraints, with stable typed frame scale; this is an engine-derived measurement, **not** an exact surveyed narrator claim. Route length/time/cost stay separately grounded, not inferred from canvas pixels. D08 A restricts deterministic atomic re-layout to relevant accepted world changes (all pins remain moveable under D04 C), preserving conflicting accepted facts and surfacing nonblocking conflicts. D09 A accepts technically valid region overlaps without implicit containment/routes/ownership updates. **B9-D10–D12 are unapproved proposals**; B9 is still in review. Earlier text below preserves dated decisions even when superseded.


## Later B9 Batch 2 operative supersession — 2026-10-31

**Later explicit override of earlier B8-D08 pin immunity (2026-10-31):** [B9-D04 C](ADR-0074-all-coordinates-eligible-for-automatic-layout.md) selects **Option C**, contrary to the B8-D08 requirement to reconcile only generated positions and never automatically move a deliberate player pin. That exclusivity and protection **no longer apply**: future technically valid, deterministic, replayable automatic layout updates may move any saved pin. No automatic-author or fixed/pinned field is to be persisted. The accepted separation of geographic pixels versus narrated distances, ordered current history, and explicit pending Commit for *direct manual edits* continue. The historical B8-D08 A approval and its trade-offs below remain as the original dated decision.


## Later B9-D01 clarification: protection without recording the author — 2026-10-31

[Accepted B9-D01 A, qualified](ADR-0071-typed-spatial-coordinates-without-ai-player-authorship-labels.md) explicitly **rejects recording a per-coordinate player-vs-AI authorship classification**. The operative portion of this earlier B8-D08 **remains**: automatically generated default positions may be reconciled to later accepted geography, whereas **deliberately protected/pinned locations may not be silently shifted**. That protection can be represented by **minimal current auto-adjustment eligibility/pin state**, not by an AI/user-authorship ledger. **B9-D04 is an unapproved subsequent proposal** to choose the precise minimal protection mechanism; no particular flag/table/class has yet been accepted. Earlier “provenance” and “player-authored” explanations below are **original decision history**, not authority for adding rejected AI-vs-player source labels. The current event stream retains minimal ordering and source association under B7-D09, which is distinct from per-coordinate authorship.



## Explicit approval and provenance

**User approval, 2026-10-31:** “Review B8 Batch 3: B8-D07: A; B8-D08: A; B8-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and assess B8 design closure.”

This accepts **B8-D08 Option A** from the [B8 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), independently of D07/D09. Original proposals remain as historical alternatives; this does not close B8 or implement a geography solver.

## Context

[B8-D06 Option B](ADR-0067-automatic-persistent-location-placement-with-player-overrides.md) makes all newly accepted locations visible at **system-generated, persisted** coordinates with source distinction from known fictional geography. [B8-D07](ADR-0068-deterministic-scoped-automatic-map-placement.md) requires deterministic, frame-local initial layout. The accepted story may later establish that two locations are far apart, or a player may have intentionally moved a city pin. The system must neither treat generated layout as inviolable fictional canon nor silently overwrite explicit player geography.

## Accepted decision — Option A

1. **Provenance matters:** Preserve distinctions among **system-generated initial map placement**, **grounded accepted narrative geographical assertions** and **explicit committed player-authored positions/constraints**. Generated initial placement is a durable map fact but **does not assert that a narrator measured exact in-world distances**.
2. **Reconcile generated-only placements with later grounded geography:** When later accepted story facts establish a relation incompatible with a generated-only initial arrangement (e.g., formerly nearby cities are explicitly far apart), adjust affected **generated-only** map placement through deterministic, supported current spatial assertion(s) to represent the newly grounded fact. Keep the result durable and replayable in current accepted history, with source/provenance that identifies the reconciliation. Preserve unrelated pins.
3. **Respect deliberate player placement:** Never silently shift a pin that a player has intentionally committed as authored geography, or override an explicitly grounded spatial assertion merely to satisfy automatic layout. Where a grounded narrative constraint conflicts with a player-authored position or two explicit facts contradict each other, **do not invent exact resolving distances or automatically move the protected pin**. Preserve accepted prose/facts and defer the *specific conflict resolution UX* to future technical design.
4. **No fabricated specificity:** “Far apart” establishes a qualitative constraint, not a mandatory precise unit or metric distance; use any supported semantic visual constraint without falsely claiming an exact lore measurement. Changing a city position doesn't automatically move characters, modify parent membership, create edges, change region borders, infer travel time or validate already accepted journeys.
5. **Replay and persistence:** Accepted reconciliation updates join the single current ordered versioned spatial event history, follow atomic/idempotent storage and deterministic current replay, and preserve historically surviving sparse IDs under Undo/Fork. No sidecar permanent graph/layout authority or independent revision archive.
6. **Uncertainty and core errors:** Unresolved optional AI extraction candidates are omitted under B7-D03 **C**, not saved as a diagnostic queue. Genuine unsafe core schema/transaction failures are reported; ambiguous source reference may not be guessed. Narrator-facing context receives grounded natural spatial facts, not generated coordinates described as established narrative observations or raw internal IDs.
7. **Changes to boundaries are separate:** The user-approved mutable region footprint assertion ([B8-D04](ADR-0065-mutable-spatial-region-footprints-separate-from-containment.md)) can independently change without automatically reparenting locations; a later accepted boundary change may be considered in visual presentation without blanket auto-shuffling of player-authored pins.

## Alternatives

- **A — ACCEPTED:** Grounded narration and deliberately authored placements take precedence over generated initial layout, with deterministic updates confined to generated-only geometry and no arbitrary override of conflicting explicit facts.
- **B — not chosen:** Generated initial coordinates always override later accepted geographical descriptions.
- **C — not chosen:** Automatically reposition every location, including deliberately player-moved pins, to satisfy a solver's preferred layout.

## Deferred engineering details

Provenance/version fields, geometric and qualitative constraint representation, conflict UI, scope of generated-only local adjustments, transform/extent effects, replay migration tests and edge/route drawing details. No full geographic simulation or runnable code approved.

## Approval history

- **2026-10-31:** D06 **B** accepted generated durable initial placement with user overrides.
- **2026-10-31:** D08 A/B/C were presented as unapproved proposals; A recommended source-priority reconciliation without damaging authored geography.
- **2026-10-31:** User expressly approved **B8-D08 A**, alongside D07 A/D09 A, and requested assessment of B8 closure only.
