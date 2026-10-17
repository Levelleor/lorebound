---
id: "IDEA-0030"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Characters Inventory Equipment and Anatomy Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Slot-Based Equipment and Body Diagram

## Idea
Show each character's worn/held equipment by body slot with text labels and a small anatomy diagram.

## Why this idea matters
Makes equipped gear legible and available to AI context.

## Accepted direction
- **Equipment slots and body schematic:** Provide each character with an inspectable equipment view, showing worn and held items by body slot and a **simple, functional body-slot diagram** with text labels.
- **Supported slot concepts:** Include left/right hands, head, torso, feet, accessories, clothing/equipment layers and **custom slots**. This is a conceptual capability set, not a final fixed universal slot catalogue.
- **Equipment distinct from possession:** Track actively worn/held/equipped gear separately from **carried inventory**, while referring to the same persistent unique item IDs accepted in [[Persistent Items and Inventory Transfers]] (IDEA-0029). An item cannot be treated as equipped and stored in an incompatible remote location simultaneously.
- **Validated equip/unequip/transfer:** Assigning or removing an item from a slot, moving it into carried inventory, dropping or transferring it to another character/container/location must be checked against authoritative item and character state. Failed or rejected proposals do not change equipment.
- **Flexible for nonstandard anatomy:** The slots and diagram must be extensible enough to represent characters with different bodies or unusual available appendages; do not hardcode a mandatory two-armed human template for every character.
- **Layering support:** Represent worn items sharing a body region in appropriate layers rather than assuming only one possible item per location. Actual ordering and compatibility rules remain for refinement.
- **AI context visibility:** Relevant current equipment/slot state should be available to the narrator via the context builder when selected; distinguish equipped from merely carried gear and respect token-budget/manual context controls.
- **Keep mechanical rules open:** Exact slot definitions, two-handed item semantics, equip conflicts/incompatibilities, allowed combinations, consequences of limb loss and detailed anatomy changes are **not yet decided**.
- **Art is optional and separate:** Start with a legible schematic. Generated character images or illustrated equipment portraits are not required or approved as part of this acceptance.
- **Respect independent approval gates:** [[Configurable Anatomy and Transformations]] (IDEA-0031) and [[Optional Story Images and Equipment Art]] (IDEA-0057) remain separate unaccepted candidates; this idea accepts *compatibility with* variable anatomy, not a complete transformation system.

## Proposed behaviour
For each character, expose a labelled schematic and equipment-slot list whose slots can be customised or extended. Bind equipped item instances to stable IDs from the inventory/item model. The equipped assignment indicates how a physically possessed item is worn or held without creating a second copy of it. Allow the user or validated gameplay outcomes to equip, unequip or transfer items, and keep both the character's equipment view and underlying item holder/placement consistent. Support layered occupancy where the later-defined rules allow it. Build the equipment context from current accepted state, not guessed narration. Keep anatomical fit, stacking, two-handed rules and advanced art as refinement or separately gated decisions.

## Alternatives and trade-offs
A text-labelled, static diagram is inexpensive, understandable and does not require an image model. A responsive anatomy-aware interactive diagram would support unusual character bodies but adds UI and state complexity, so the exact rendering approach remains open. Fixed common slots can simplify the first interface but must remain extensible for custom/nonstandard anatomy. Dedicated equipment images are optional future scope, not a prerequisite. Layering allows flexible outfits but requires deterministic handling of slot occupancy and conflicts after the rules are defined.

## Dependencies and constraints
- Stable item instance IDs and validated possession transfers derive from accepted [[Persistent Items and Inventory Transfers]] (IDEA-0029); shared character references from [[Shared PC and NPC Character Entities]] (IDEA-0026).
- The diagram must remain useful without accepting or implementing the separate detailed anatomy-and-transformation feature [[Configurable Anatomy and Transformations]] (IDEA-0031).
- Equipping cannot silently make a duplicate item or allow simultaneous incompatible physical placements. Removing or transferring an equipped object should make its prior equipment assignment consistent with its new placement.
- Current gear is authoritative mutable state, not merely a descriptive paragraph. AI-generated or provisional text cannot independently establish a new equip event without validation.
- The exact slot rules, limb compatibility, two-hand rules and response to body transformations remain open rather than assumed approved by this concept.
- Story images/equipment artwork and image-generation dependencies are separate, unaccepted future decisions. A simple text-backed diagram remains sufficient for this accepted direction.
- Equipment data made available in AI context follows model-aware budgeting and the requested/selected/transmitted distinctions of accepted [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024).

## Open questions
- How do common slots and user-defined custom slots relate to individual character anatomy and distinct species?
- Which slots and layer categories should be available initially, and how should players add/remove/rearrange them?
- Can items be equipped across multiple slots, such as two-handed weapons, and what conflict checks are required?
- How should clothing layers, accessories and worn/held item positions interact with inventory and item possession?
- What happens to equipment when a character loses a limb, gains an appendage or undergoes a temporary transformation? This intersects with separate IDEA-0031.
- How should incompatible equipment be handled: reject an attempted equip, move item back to inventory, mark unresolved or allow a special exception?
- What minimal schematic is readable on mobile and supports both typical and unusual body configurations?
- Can manually edited equipment assignments be reconciled with automatically validated gameplay events and historical undo/revision?
- Which equipment fields/slot states are important enough to include in AI generation context?

## Draft acceptance criteria
- [ ] Each relevant PC or NPC can have an equipment view with body-slot names and a simple legible diagram or labelled schematic.
- [ ] The model supports left/right hands, head, torso, feet, accessories, clothing layers and custom slots without forcing a universal fixed human-only topology.
- [ ] Equipped and held item records reference the same durable unique item instances as the inventory/possession system, without duplicated objects.
- [ ] The UI clearly distinguishes worn/held/equipped items from items only carried in inventory.
- [ ] Validated equip, unequip, drop and transfer operations update authoritative item placement and equipment assignment coherently.
- [ ] Impossible duplicate assignments or contradictory item placements are prevented; rejected events do not mutate saved equipment.
- [ ] More than one garment/item may occupy a body region when the configured layering rules allow it.
- [ ] Equipment slot definitions can be extended to characters with nonstandard bodies without requiring the detailed anatomy feature to be approved first.
- [ ] The context builder can include selected up-to-date equipment assignments and accurately display whether they were actually transmitted.
- [ ] Exact two-handed/incompatibility logic, full anatomy transformations and AI-generated artwork remain outside the approved scope until separately refined or accepted.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-origin equipment concept, explicitly accepted for staging with body-slot flexibility and item-consistent validated transitions.
- Staging is **not** approval for production or proof of implementation; the slot schema and compatibility algorithm still need refinement.

## Decisions and review history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Slot-based equipment with a simple body-slot diagram; left/right hands, head, torso, feet, accessories, clothing layers and custom slots; separation of equipped from carried inventory; coherent validated equip/unequip/transfer linked to unique item IDs; and flexibility for nonstandard anatomy. Exact slots, two-handed/incompatibility mechanics, artwork and full anatomy transformations deliberately deferred to refinement or separate decisions. Moved to staging only.
