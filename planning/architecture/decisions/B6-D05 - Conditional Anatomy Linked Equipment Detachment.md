---
type: architecture-decision
status: accepted
decision_id: "B6-D05"
phase: "B6"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Option A approval with conditional clarification)"
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
  - architecture-decision
---

# B6-D05 — Conditional equipment detachment for implemented anatomical slots

## Explicit approval and qualification

**User approval, 2026-10-31:** “Review B6 Batch 2: B6-D05: A; B6-D06: A; B6-D07: A. Notes: for d05. we'll remove the bracelet assignment only if we implement that feature where we have the anatomy where hands or arms are real. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B6 review.”

The approved disposition is **B6-D05 Option A with a binding implementation condition**. The original unqualified A/B/C alternatives remain in the [B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md) as pre-approval proposal history; this subsequent explicit user qualification controls the design.

## Context

Lorebound is a narrative-first world-memory tracker, not a simulation engine ([B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)). Equipment and inventory are derived from a single item identity and current assertions ([B6-D02](./B6-D02%20-%20One%20Item%20Identity%20and%20Declarative%20Equipment%20Placement.md)). Previously staged [IDEA-0031](../../staging/Configurable%20Anatomy%20and%20Transformations.md) and [IDEA-0030](../../staging/Slot-Based%20Equipment%20and%20Body%20Diagram.md) allow custom anatomy and optional grounded equipment consequences; however, free-form textual anatomy does **not** itself guarantee that physical limbs and equipment slots are actual connected, implemented structured records.

## Accepted decision — qualified Option A

**Only when the applicable structured anatomy and equipment-slot integration has actually been implemented, enabled and linked for this character, may an accepted change to a tracked arm/hand or other body part automatically clear an equipment assignment known to depend on that part.**

1. **Feature prerequisite is mandatory:** Do not automatically clear a bracelet/weapon's slot merely because narration mentions an injured/missing limb, or because optional free-text anatomy fields exist. The app must have actual supported, active structured anatomy body-part identities **and** a real binding from the equipment slot to the affected body part, sufficient to establish the current assignment as incompatible. Until then, keep the tracked equipment assignment **unchanged** (unless the accepted narration or an explicit committed player edit separately establishes unequipping). Free-form story description stays valid prose and can be captured in supported fields without pretending it enables anatomical equipment constraints.
2. **When the prerequisite is satisfied:** On a grounded accepted anatomical change that removes/disables a tracked part required by a currently equipped item, derive a matching `ClearEquippedSlot`/equivalent **current assertion** for the **same stable item ID**, in a coherent accepted outcome batch. Do not require proof that the character could plausibly undergo the transformation, and do not rewrite past events/prose.
3. **Destination must not be invented:** Clearing the slot **does not automatically mean the bracelet fell to the floor, went into a pocket or was transferred to a chest**. If the accepted story establishes a new holder/place, a grounded `SetItemHolder` or `SetItemLocation` assertion records it. Otherwise the **precise resulting physical placement/disposition remains unknown/unresolved**; the system does not infer a new destination from a missing limb. Do not clone/delete the item merely to tidy equipment views.
4. **No universal anatomy requirement:** Adventures may use freely defined textual anatomy or no anatomy/equipment mechanics at all. A story may include any body plan without the app representing real hands/arms as structured objects. Do not force such a feature or reject accepted narrative because it is absent.
5. **Safe boundaries:** Deterministic typed coherence and atomic Go/SQLite version/epoch and idempotency protections remain mandatory where actual consequential assertions are generated. Manual player state edits still require the explicit pending-Commit overlay; accepted story outcomes keep their previously accepted commit paths. Stable IDs stay out of narrator-facing model prompts under B6-D04.

## Examples

- **No implemented body-to-slot mapping:** Story says Mara loses an arm. The bracelet remains listed as equipped in the *structured tracker* unless the prose expressly states it came off or the player corrects it. This may be incomplete or narratively contradictory but is **not a technical event failure**.
- **Implemented arm+slot relation:** The same accepted story establishes loss of the arm. The app knows the bracelet is equipped on that arm. The corresponding equipment-slot assertion is cleared. If the story never says where the bracelet went, leave its new disposition **unknown**; do not set `location = ground`.

## Alternatives and history

- **Original A (modified and accepted):** Clear incompatible equipment assignment; unknown destination remains unknown. **Condition added by user:** Only if structured, linked anatomy/arm/hand functionality is actually implemented. No general automated detachment from prose-only anatomy.
- **B (not selected):** Always retain an invalid assignment despite implemented and known incompatible slot relationship.
- **C (rejected):** Guess item destination from context and automatically put it in a room/container.

## Deferred details

Actual body/slot feature availability flags, custom morphology compatibility, layered equipment, event representation, equipment assignment deletion vs projection invalidation, and uncertain placement UI require later engineering design. The accepted feature remains **staging/design**, not a claim that real anatomy/limb equipment integration exists. No broader physical simulation, implementation or staging-to-production promotion is authorised.

## Traceability

[B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B6-D02](./B6-D02%20-%20One%20Item%20Identity%20and%20Declarative%20Equipment%20Placement.md), [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md), [IDEA-0031](../../staging/Configurable%20Anatomy%20and%20Transformations.md), [IDEA-0030](../../staging/Slot-Based%20Equipment%20and%20Body%20Diagram.md). Owners S05/S06/S10/S11/S12.

## Decision history

- **2026-10-23:** Existing staged anatomy/equipment decisions permitted *grounded*, automatic equipment consequences after an accepted anatomy change, without defining whether anatomy-linked equipment was implemented.
- **2026-10-28:** B6-D01 accepted narrative-first assertions, preventing broad simulated feasibility rejections.
- **2026-10-30:** B6 Batch 2 initially proposed A (auto-clear incompatible equipment slot; unknown destination), B (retain slot), C (invent destination). No choice accepted at presentation time.
- **2026-10-31:** User expressly selected **D05 A with condition** that real anatomy/hands/arms and attached equipment relations be **implemented before automatic clearing**. D06 A and D07 A were separately approved. This later explicit condition takes precedence over broad unconditional wording; no implementation or later B6 approval inferred.
