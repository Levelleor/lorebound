---
id: PRD-0031
type: prd
status: accepted
related:
- NOTE-0039
- PRD-0001
- NOTE-0007
---

# Slot-Based Equipment and Body Diagram

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0030](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Slot-Based%20Equipment%20and%20Body%20Diagram.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S11**. First milestone: **M5**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Later accepted B6-D05 limit on anatomy-driven unequipping — 2026-10-31

[B6-D05](../decisions/ADR-0046-conditional-anatomy-linked-equipment-detachment.md) specifies that **anatomy-linked automatic clearing exists only when real structured body-part identities and their equipment-slot links have actually been implemented and are active**. No such automatic clearing may be inferred from a mere narrative description of a lost arm or an optional free-form anatomy field. Until the feature is available, the tracked bracelet assignment stays as it was unless accepted prose explicitly unequips it or the player commits a correction. If the feature is implemented and an assignment is provably incompatible with a now-lost part, clear that item/slot assertion; **its new physical placement stays unknown unless the story establishes a destination**. Preserve one item identity and no invented effects. Earlier unqualified automatic-consequence language is subordinate to this explicit user clarification.



## Latest approved narrative-first event semantics — 2026-10-28

**Latest assertion model ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Inventory and equipment are views of **one item ID**, using current holder/location and slot/property assertions. An accepted `SetItemHolder/SetEquippedSlot` does not have to prove a previous legal transfer. A new assertion supersedes previous slot/holder data; at most one current physical placement for a given item is projected. Accepted anatomy changes may still include a **grounded** consequent unequip/move of that same item, but the tracker must not rewrite earlier events, create duplicate gear or invent a destination. Unknown disposition remains unknown.


## Accepted direction
- **Equipment slots and body schematic:** Provide each character with an inspectable equipment view, showing worn and held items by body slot and a **simple, functional body-slot diagram** with text labels.
- **Supported slot concepts:** Include left/right hands, head, torso, feet, accessories, clothing/equipment layers and **custom slots**. This is a conceptual capability set, not a final fixed universal slot catalogue.
- **Equipment distinct from possession:** Track actively worn/held/equipped gear separately from **carried inventory**, while referring to the same persistent unique item IDs accepted in Persistent Items and Inventory Transfers (IDEA-0029). An item cannot be treated as equipped and stored in an incompatible remote location simultaneously.
- **Declarative equip/unequip placement:** Record grounded `Set/Clear` assertions for an item's current slot/holder; project inventory and equipment consistently from one stable ID. Do not reject a **committed fictional outcome** because prior possession or a past equip action is missing. Malformed/unaccepted proposals do not change canon.
- **Flexible for nonstandard anatomy:** The slots and diagram must be extensible enough to represent characters with different bodies or unusual available appendages; do not hardcode a mandatory two-armed human template for every character.
- **Layering support:** Represent worn items sharing a body region in appropriate layers rather than assuming only one possible item per location. Actual ordering and compatibility rules remain for refinement.
- **AI context visibility:** Relevant current equipment/slot state should be available to the narrator via the context builder when selected; distinguish equipped from merely carried gear and respect token-budget/manual context controls.
- **Feature-conditional anatomy effects (later B6-D05 user clarification):** Automatically clear an equipped assignment **only if actual supported structured anatomy and slot-to-body-part links exist and are active**, and the accepted change establishes incompatibility. The mere presence of free-text anatomical prose does not trigger it. If a new holder/location is grounded, record it using the same item ID; otherwise keep new placement unknown, not silently dropped. Without the feature, retain the assignment until the accepted story explicitly changes it or a player correction is committed. The earlier 2026-10-23 permission to automatically adjust grounded equipment remains but is conditioned by this later decision.
- **Other mechanics remain open:** Exact slot catalogue, layering, two-handed item semantics and equipment incompatibility rules remain to refine.
- **Art is optional and separate:** Start with a legible schematic. Generated character images or illustrated equipment portraits are not required or approved as part of this acceptance.
- **Separate feature scopes:** Configurable Anatomy and Transformations (IDEA-0031) is **already independently accepted in staging** and now permits validated equipment consequences from anatomy changes. Optional Story Images and Equipment Art (IDEA-0057) remains **unaccepted in Inbox**; images are not necessary.

## Dependencies and constraints
- Stable item instance IDs and validated possession transfers derive from accepted Persistent Items and Inventory Transfers (IDEA-0029); shared character references from Shared PC and NPC Character Entities (IDEA-0026).
- The diagram must remain useful without accepting or implementing the separate detailed anatomy-and-transformation feature Configurable Anatomy and Transformations (IDEA-0031).
- Equipping does not clone an item: a new accepted holder/slot assertion updates the **single current projection** for its ID, replacing incompatible earlier placement without requiring a proof of previous custody.
- Current gear is authoritative mutable state, not merely a descriptive paragraph. AI-generated or provisional text cannot independently establish a new equip event without validation.
- Slot compatibility and destination-selection algorithms remain open. The broader policy to permit **automatic validated relocation after anatomy changes** is settled; no artificial requirement for player-by-player unequip steps.
- Story images/equipment artwork and image-generation dependencies are separate, unaccepted future decisions. A simple text-backed diagram remains sufficient for this accepted direction.
- Equipment data made available in AI context follows model-aware budgeting and the requested/selected/transmitted distinctions of accepted Token-Budgeted Context Builder and Inspector (IDEA-0024).

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

## Supporting detail

See [NOTE-0039](../knowledge/inbox/NOTE-0039-prd-0031-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
