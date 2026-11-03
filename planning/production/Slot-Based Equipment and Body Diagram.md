---
id: "IDEA-0030"
type: idea
status: production
origin: user
created: "2026-10-16"
updated: "2026-11-03"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
approved_at: "2026-11-03"
approved_by: "requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)"
source_brainstorms: ["[[Characters Inventory Equipment and Anatomy Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Slot-Based Equipment and Body Diagram

## Current production approval — 2026-11-03

**Explicit user approval:** On 2026-11-03 the requesting user asked to promote **all remaining accepted Lorebound staging ideas** into production, including IDEA-0030. This same original idea note was moved to `planning/production/`, preserving its ID, previously accepted scope and historical decisions. **Production means approved for implementation planning, not already implemented or verified.** Later accepted B1–B9/Pass C decisions govern where older proposals differ. No application implementation, testing, spatial migration or implemented spec follows from this promotion. Previous “staging only” statements are dated history.

## Later accepted B6-D05 limit on anatomy-driven unequipping — 2026-10-31

[B6-D05](../architecture/decisions/B6-D05%20-%20Conditional%20Anatomy%20Linked%20Equipment%20Detachment.md) specifies that **anatomy-linked automatic clearing exists only when real structured body-part identities and their equipment-slot links have actually been implemented and are active**. No such automatic clearing may be inferred from a mere narrative description of a lost arm or an optional free-form anatomy field. Until the feature is available, the tracked bracelet assignment stays as it was unless accepted prose explicitly unequips it or the player commits a correction. If the feature is implemented and an assignment is provably incompatible with a now-lost part, clear that item/slot assertion; **its new physical placement stays unknown unless the story establishes a destination**. Preserve one item identity and no invented effects. Earlier unqualified automatic-consequence language is subordinate to this explicit user clarification.



## Latest approved narrative-first event semantics — 2026-10-28

**Latest assertion model ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)):** Inventory and equipment are views of **one item ID**, using current holder/location and slot/property assertions. An accepted `SetItemHolder/SetEquippedSlot` does not have to prove a previous legal transfer. A new assertion supersedes previous slot/holder data; at most one current physical placement for a given item is projected. Accepted anatomy changes may still include a **grounded** consequent unequip/move of that same item, but the tracker must not rewrite earlier events, create duplicate gear or invent a destination. Unknown disposition remains unknown.


## Idea
Show each character's worn/held equipment by body slot with text labels and a small anatomy diagram.

## Why this idea matters
Makes equipped gear legible and available to AI context.

## Accepted direction
- **Equipment slots and body schematic:** Provide each character with an inspectable equipment view, showing worn and held items by body slot and a **simple, functional body-slot diagram** with text labels.
- **Supported slot concepts:** Include left/right hands, head, torso, feet, accessories, clothing/equipment layers and **custom slots**. This is a conceptual capability set, not a final fixed universal slot catalogue.
- **Equipment distinct from possession:** Track actively worn/held/equipped gear separately from **carried inventory**, while referring to the same persistent unique item IDs accepted in [[Persistent Items and Inventory Transfers]] (IDEA-0029). An item cannot be treated as equipped and stored in an incompatible remote location simultaneously.
- **Declarative equip/unequip placement:** Record grounded `Set/Clear` assertions for an item's current slot/holder; project inventory and equipment consistently from one stable ID. Do not reject a **committed fictional outcome** because prior possession or a past equip action is missing. Malformed/unaccepted proposals do not change canon.
- **Flexible for nonstandard anatomy:** The slots and diagram must be extensible enough to represent characters with different bodies or unusual available appendages; do not hardcode a mandatory two-armed human template for every character.
- **Layering support:** Represent worn items sharing a body region in appropriate layers rather than assuming only one possible item per location. Actual ordering and compatibility rules remain for refinement.
- **AI context visibility:** Relevant current equipment/slot state should be available to the narrator via the context builder when selected; distinguish equipped from merely carried gear and respect token-budget/manual context controls.
- **Feature-conditional anatomy effects (later B6-D05 user clarification):** Automatically clear an equipped assignment **only if actual supported structured anatomy and slot-to-body-part links exist and are active**, and the accepted change establishes incompatibility. The mere presence of free-text anatomical prose does not trigger it. If a new holder/location is grounded, record it using the same item ID; otherwise keep new placement unknown, not silently dropped. Without the feature, retain the assignment until the accepted story explicitly changes it or a player correction is committed. The earlier 2026-10-23 permission to automatically adjust grounded equipment remains but is conditioned by this later decision.
- **Other mechanics remain open:** Exact slot catalogue, layering, two-handed item semantics and equipment incompatibility rules remain to refine.
- **Art is optional and separate:** Start with a legible schematic. Generated character images or illustrated equipment portraits are not required or approved as part of this acceptance.
- **Separate feature scopes:** [[Configurable Anatomy and Transformations]] (IDEA-0031) is **already independently accepted in staging** and now permits validated equipment consequences from anatomy changes. [[Optional Story Images and Equipment Art]] (IDEA-0057) remains **unaccepted in Inbox**; images are not necessary.

## Proposed behaviour
For each character, expose a labelled schematic and equipment-slot list whose slots can be customised or extended. Bind equipped item instances to stable IDs from the inventory/item model. The equipped assignment indicates how a physically possessed item is worn or held without creating a second copy of it. Allow the user or validated gameplay outcomes to equip, unequip or transfer items, and keep both the character's equipment view and underlying item holder/placement consistent. Support layered occupancy where the later-defined rules allow it. Build the equipment context from current accepted state, not guessed narration. Keep anatomical fit, stacking, two-handed rules and advanced art as refinement or separately gated decisions.

## Alternatives and trade-offs
A text-labelled, static diagram is inexpensive, understandable and does not require an image model. A responsive anatomy-aware interactive diagram would support unusual character bodies but adds UI and state complexity, so the exact rendering approach remains open. Fixed common slots can simplify the first interface but must remain extensible for custom/nonstandard anatomy. Dedicated equipment images are optional future scope, not a prerequisite. Layering allows flexible outfits but requires deterministic handling of slot occupancy and conflicts after the rules are defined.

## All characters share the same optional equipment model
- **Explicit IDEA-0026 refinement:** There is **one character kind** without PC/NPC or Playable role distinctions. Every character can have the same optional equipment/body-slot records. Choosing them via `Playing As` does not move items, change equipment or give any special mechanical rights.

## Dependencies and constraints
- Stable item instance IDs and validated possession transfers derive from accepted [[Persistent Items and Inventory Transfers]] (IDEA-0029); shared character references from [[Shared PC and NPC Character Entities]] (IDEA-0026).
- The diagram must remain useful without accepting or implementing the separate detailed anatomy-and-transformation feature [[Configurable Anatomy and Transformations]] (IDEA-0031).
- Equipping does not clone an item: a new accepted holder/slot assertion updates the **single current projection** for its ID, replacing incompatible earlier placement without requiring a proof of previous custody.
- Current gear is authoritative mutable state, not merely a descriptive paragraph. AI-generated or provisional text cannot independently establish a new equip event without validation.
- Slot compatibility and destination-selection algorithms remain open. The broader policy to permit **automatic validated relocation after anatomy changes** is settled; no artificial requirement for player-by-player unequip steps.
- Story images/equipment artwork and image-generation dependencies are separate, unaccepted future decisions. A simple text-backed diagram remains sufficient for this accepted direction.
- Equipment data made available in AI context follows model-aware budgeting and the requested/selected/transmitted distinctions of accepted [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024).

## Open questions
- How do common slots and user-defined custom slots relate to individual character anatomy and distinct species?
- Which slots and layer categories should be available initially, and how should players add/remove/rearrange them?
- Can items be equipped across multiple slots, such as two-handed weapons, and what conflict checks are required?
- How should clothing layers, accessories and worn/held item positions interact with inventory and item possession?
- **Resolved policy 2026-10-23:** The validator may move/reassign gear attached to a changed body feature. Which valid disposition is chosen when alternatives exist or none is grounded still needs implementation design.
- How should incompatible equipment be handled: reject an attempted equip, move item back to inventory, mark unresolved or allow a special exception?
- What minimal schematic is readable on mobile and supports both typical and unusual body configurations?
- Can manually edited equipment assignments be reconciled with automatically validated gameplay events and historical undo/revision?
- Which equipment fields/slot states are important enough to include in AI generation context?

## Draft acceptance criteria
- [ ] Each relevant character can have an equipment view with body-slot names and a simple legible diagram or labelled schematic, with no PC/NPC or Playable filtering.
- [ ] The model supports left/right hands, head, torso, feet, accessories, clothing layers and custom slots without forcing a universal fixed human-only topology.
- [ ] Equipped and held item records reference the same durable unique item instances as the inventory/possession system, without duplicated objects.
- [ ] The UI clearly distinguishes worn/held/equipped items from items only carried in inventory.
- [ ] Validated equip, unequip, drop and transfer operations update authoritative item placement and equipment assignment coherently.
- [ ] Impossible duplicate assignments or contradictory item placements are prevented; rejected events do not mutate saved equipment.
- [ ] More than one garment/item may occupy a body region when the configured layering rules allow it.
- [ ] Equipment slot definitions can be extended to characters with nonstandard bodies without requiring the detailed anatomy feature to be approved first.
- [ ] The context builder can include selected up-to-date equipment assignments and accurately display whether they were actually transmitted.
- [ ] Anatomy-triggered automatic equipment adjustment is permitted where validated, preserving coherent item custody/history. Exact destination logic remains open. Anatomy IDEA-0031 is separately accepted in staging; optional generated equipment artwork IDEA-0057 is unaccepted.

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

- 2026-10-23 — **User resolved A-18:** Let validation automatically move/reassign gear whose hand or attached body part was removed, without an obligatory separate player fix. Preserve unique item identity and atomic coherent location/equipment state; do not invent a destination where none is established. Detailed rules remain a technical refinement. IDEA-0031 is separately accepted in staging.
- 2026-10-18 — **Accepted character-unification dependency:** Equipment applies to all characters equally, with no PC/NPC/Playable split and no change merely from `Playing As` selection. Staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Slot-based equipment with a simple body-slot diagram; left/right hands, head, torso, feet, accessories, clothing layers and custom slots; separation of equipped from carried inventory; coherent validated equip/unequip/transfer linked to unique item IDs; and flexibility for nonstandard anatomy. Exact slots, two-handed/incompatibility mechanics, artwork and full anatomy transformations deliberately deferred to refinement or separate decisions. Moved to staging only.

- 2026-10-28 — **User-directed architecture supersession:** Explicitly adopted narrative-first declarative state assertions, replacing simulation-style event preconditions; see [B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). Prior contrary statements remain only as original decision history; not current operative guidance. Still staging; no implementation/promotion.

- **2026-10-31 — Explicit later B6-D05 user condition:** Do not automatically remove a bracelet's equipment assignment after an anatomy change unless genuine structured anatomy/arm/hand and binding-to-slot feature is implemented; no inferred destination, and no stage promotion or implementation.

## Stage transition history — 2026-11-03

- **2026-11-03:** Requesting user explicitly approved promotion of all remaining 50 accepted `IDEA-` notes from staging to production. Original `IDEA-0030` identity, existing `accepted_at` and prior accepted/superseded alternatives retained. The new `approved_at` is the promotion date; **no implementation verification or spec archival** occurred.
