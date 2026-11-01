---
type: architecture-decision
status: accepted
decision_id: "B8-D08"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Batch 3 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - spatial-canvas
  - provenance
  - architecture-decision
---

# B8-D08 — Provenance-aware reconciliation of generated map positions with accepted geography

## Later B9 Batch 2 operative supersession — 2026-10-31

**Later explicit override of earlier B8-D08 pin immunity (2026-10-31):** [B9-D04 C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) selects **Option C**, contrary to the B8-D08 requirement to reconcile only generated positions and never automatically move a deliberate player pin. That exclusivity and protection **no longer apply**: future technically valid, deterministic, replayable automatic layout updates may move any saved pin. No automatic-author or fixed/pinned field is to be persisted. The accepted separation of geographic pixels versus narrated distances, ordered current history, and explicit pending Commit for *direct manual edits* continue. The historical B8-D08 A approval and its trade-offs below remain as the original dated decision.


## Later B9-D01 clarification: protection without recording the author — 2026-10-31

[Accepted B9-D01 A, qualified](./B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md) explicitly **rejects recording a per-coordinate player-vs-AI authorship classification**. The operative portion of this earlier B8-D08 **remains**: automatically generated default positions may be reconciled to later accepted geography, whereas **deliberately protected/pinned locations may not be silently shifted**. That protection can be represented by **minimal current auto-adjustment eligibility/pin state**, not by an AI/user-authorship ledger. **B9-D04 is an unapproved subsequent proposal** to choose the precise minimal protection mechanism; no particular flag/table/class has yet been accepted. Earlier “provenance” and “player-authored” explanations below are **original decision history**, not authority for adding rejected AI-vs-player source labels. The current event stream retains minimal ordering and source association under B7-D09, which is distinct from per-coordinate authorship.



## Explicit approval and provenance

**User approval, 2026-10-31:** “Review B8 Batch 3: B8-D07: A; B8-D08: A; B8-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and assess B8 design closure.”

This accepts **B8-D08 Option A** from the [B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), independently of D07/D09. Original proposals remain as historical alternatives; this does not close B8 or implement a geography solver.

## Context

[B8-D06 Option B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) makes all newly accepted locations visible at **system-generated, persisted** coordinates with source distinction from known fictional geography. [B8-D07](./B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md) requires deterministic, frame-local initial layout. The accepted story may later establish that two locations are far apart, or a player may have intentionally moved a city pin. The system must neither treat generated layout as inviolable fictional canon nor silently overwrite explicit player geography.

## Accepted decision — Option A

1. **Provenance matters:** Preserve distinctions among **system-generated initial map placement**, **grounded accepted narrative geographical assertions** and **explicit committed player-authored positions/constraints**. Generated initial placement is a durable map fact but **does not assert that a narrator measured exact in-world distances**.
2. **Reconcile generated-only placements with later grounded geography:** When later accepted story facts establish a relation incompatible with a generated-only initial arrangement (e.g., formerly nearby cities are explicitly far apart), adjust affected **generated-only** map placement through deterministic, supported current spatial assertion(s) to represent the newly grounded fact. Keep the result durable and replayable in current accepted history, with source/provenance that identifies the reconciliation. Preserve unrelated pins.
3. **Respect deliberate player placement:** Never silently shift a pin that a player has intentionally committed as authored geography, or override an explicitly grounded spatial assertion merely to satisfy automatic layout. Where a grounded narrative constraint conflicts with a player-authored position or two explicit facts contradict each other, **do not invent exact resolving distances or automatically move the protected pin**. Preserve accepted prose/facts and defer the *specific conflict resolution UX* to future technical design.
4. **No fabricated specificity:** “Far apart” establishes a qualitative constraint, not a mandatory precise unit or metric distance; use any supported semantic visual constraint without falsely claiming an exact lore measurement. Changing a city position doesn't automatically move characters, modify parent membership, create edges, change region borders, infer travel time or validate already accepted journeys.
5. **Replay and persistence:** Accepted reconciliation updates join the single current ordered versioned spatial event history, follow atomic/idempotent storage and deterministic current replay, and preserve historically surviving sparse IDs under Undo/Fork. No sidecar permanent graph/layout authority or independent revision archive.
6. **Uncertainty and core errors:** Unresolved optional AI extraction candidates are omitted under B7-D03 **C**, not saved as a diagnostic queue. Genuine unsafe core schema/transaction failures are reported; ambiguous source reference may not be guessed. Narrator-facing context receives grounded natural spatial facts, not generated coordinates described as established narrative observations or raw internal IDs.
7. **Changes to boundaries are separate:** The user-approved mutable region footprint assertion ([B8-D04](./B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md)) can independently change without automatically reparenting locations; a later accepted boundary change may be considered in visual presentation without blanket auto-shuffling of player-authored pins.

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
