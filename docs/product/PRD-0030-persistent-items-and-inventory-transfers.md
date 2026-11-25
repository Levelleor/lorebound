---
id: PRD-0030
type: prd
status: accepted
related:
- NOTE-0038
- PRD-0001
- NOTE-0007
- NOTE-0008
---

# Persistent Items and Inventory Transfers

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0029](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Persistent%20Items%20and%20Inventory%20Transfers.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S11**. First milestone: **M5**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Latest accepted governing architecture — 2026-10-28

The latest approved engine purpose is **faithful fictional-world tracking for narration**, not a conservation-law transfer simulator ([B6-D01 — narrative-first declarative outcome events](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)). The inventory should be a **projection of each item's last accepted SetItemHolder/SetItemLocation assertion**. A “Transfer” button or Do/Say attempt can remain a user-facing intent, but a grounded accepted story or manual correction records **where the item is now**, without requiring proof the old holder had it. Later assertions override earlier placement. One stable item ID, at most one current placement; unknown owner/holder remains unknown. Sparse identity is valid when an old introduction event is deleted. Do not reject current canon for missing fictional inventory prerequisites.


## Accepted direction
- **Persistent unique item identities:** Each individual tracked item has a durable item ID separate from its displayed name or type. An item retains that ID through changes of possession, storage, location, name or descriptive properties.
- **Declarative item assertions:** Support Create/Remove Item, Set/Clear ItemHolder/Location and related property assertions. Pickup, drop, store and transfer are **UI/narrative verbs** whose accepted effect records the item's latest grounded holder/place; do **not** require a procedurally validated prior source inventory. Typed representability and atomic commit still apply.
- **Consistent current possession and placement:** Track where an item currently resides and who currently holds/carries it, as appropriate. Avoid two simultaneous incompatible physical placements or inventories claiming the same unique item.
- **Holder is not necessarily owner:** Distinguish current possession/physical custody from ownership or claims of ownership **when needed**. A thief may possess an item while someone else retains an ownership claim. Exact ownership mechanics or legal rules remain open.
- **One item, one current projection:** Inventory and equipment derive from the same stable item ID and last accepted placement assertion. A new current holder overrides an earlier holder even when source custody was unknown or narratively impossible; do not create duplicate independent item copies. Reject malformed/unrepresentable data, not fictional impossibility.
- **Entity-based custody, never a global player inventory (explicitly accepted):** Item holders are actual **character IDs**, **container IDs** or **world locations** as applicable; all characters use identical possession/transfer rules whether currently controlled or not. **Do not create a separate global Player Inventory or move items on change of narrative focus.** An adventure with no characters may still track items at locations/in containers, and a character with no established possessions need not have a fictitious empty inventory. Preserve unknown holder/ownership semantics.
- **Preserve uncertainty:** Unknown location, holder or ownership is not proof that an item is absent, unowned or at a particular default location. Distinguish unknown data from established none/empty values.
- **No mandatory RPG carrying rules:** Encumbrance, capacity restrictions, item stacking and more detailed inventory mechanics are **not decided** by this acceptance; leave them as optional directions for staging refinement.
- **Other modules remain separately gated:** Character equipment slots/body diagrams (IDEA-0030) and the full world location model (IDEA-0033 onward) are distinct candidates. Accepted item tracking does not by itself approve their detailed UX, schema or mechanics.

## Dependencies and constraints
- Uses independently accepted Shared PC and NPC Character Entities (IDEA-0026) and **accepted staging** Hierarchical World Locations (IDEA-0033) for character/location identity and custody references. The two were accepted separately and remain distinct data responsibilities.
- Item creation, current-holder and removal **assertions** must be grounded in **accepted** narration or explicit player Commit; uncommitted/failed generation never changes canon. Do not require procedural source-state preconditions for an accepted assertion.
- Equipment state from separately **accepted staging** Slot-Based Equipment and Body Diagram (IDEA-0030) refers to the **same item identities**. IDEA-0030 was approved independently, not by the original item-tracking approval. Validated automatic equipment adjustments when anatomy changes are now accepted via IDEA-0030/0031.
- Item events follow the **approved single-current-history**, current event ordering, Undo/truncation and independent Fork contracts; no previous-passage revision archive or inactive branch is maintained.
- Avoid the same uniquely identified item appearing simultaneously in two incompatible inventories or locations. A nested container can be physically held and have contents, but rules for containment, stacking and cycles need refinement.
- A player's manual corrections should not be silently reversed by conflicting speculative AI proposals; provenance and conflict resolution need refinement.
- Unknown placement, unknown ownership and known-unowned must remain distinguishable where represented.
- Encumbrance, weight/capacity limits, quantity stacking and specialised inventory UI/rules are not mandatory accepted scope.

## Open questions
- How are newly narrated items introduced without duplicates when a model refers to an existing unnamed or renamed object?
- What item types need instance IDs, and how should fungible quantities or stacks be represented?
- What are the validation rules for nested containers, transfers of containers with contents and containment cycles?
- How are misplaced, destroyed, consumed, merged or transformed items handled without losing provenance?
- When should the system record physical custody separately from legal ownership or disputed claims?
- How should manual item edits, inventory transfers and narrative outcomes be reconciled transactionally?
- How are undo, historical prose revisions, branches and failed generation requests reflected in item placement?
- Should encumbrance, carrying capacity or container limits exist at all, and under what optional modes?
- How do item location/holder references work when character or location entities are deleted, merged or renamed?

## Draft acceptance criteria
- [ ] Story-authored exceptional transfer/creation may bypass fictional accessibility rules while preserving unique item placement and correct source/provenance.
- [ ] Equivalent Do/Say attempts remain constrained by possession/access rules; Story cannot cause duplicated canonical unique-item IDs or partial storage commits.
- [ ] The Info tab displays the selected `Playing As` character's real known inventory when enabled, updates on selection, and never shows the previous actor's items as the new actor's possessions.
- [ ] Missing inventory data is not presented as a definite empty inventory; the Info tab does not change item state.
- [ ] Changing `Playing As` never moves items; optional Do/Say attempted-action checks may consult current holder, while accepted item placement facts are set declaratively.
- [ ] Tracked unique item instances have durable IDs that survive renames and transfers.
- [ ] A player or validated gameplay event can create, pick up, drop, store and transfer items between characters, containers and world locations where those entities exist.
- [ ] A single accepted `SetItemHolder/Location` assertion supersedes prior physical placement; all inventory/equipment views refer to the same item ID, not copied objects.
- [ ] A later accepted holder assertion succeeds without proof of prior possession; malformed required event data and non-deterministic current placement are rejected, without duplicating a unique item.
- [ ] The system can represent current holder or location separately from ownership/claim information where needed.
- [ ] Missing item placement or owner information is not silently converted into an invented definite state.
- [ ] Failed, rejected or uncommitted generation proposals do not mutate persistent item placement.
- [ ] Character inventories/possession link to **stable character IDs**, and items may reside in containers/locations independent of characters. Changing focus between several characters **does not reassign items** or create a global player-owned inventory.
- [ ] Characterless adventures can track world items/containers/locations without creating a default character; missing inventory details are **unknown**, not automatically empty.
- [ ] Encumbrance, capacity and stack/quantity mechanics are not imposed by default simply because item tracking exists.
- [ ] Equipment/body-slot design and detailed world-location systems remain separate decisions.

## Supporting detail

See [NOTE-0038](../knowledge/inbox/NOTE-0038-prd-0030-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
