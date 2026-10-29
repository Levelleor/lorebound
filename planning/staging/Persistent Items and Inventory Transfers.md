---
id: "IDEA-0029"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Persistent Items and Inventory Transfers

## Latest accepted governing architecture — 2026-10-28

The latest approved engine purpose is **faithful fictional-world tracking for narration**, not a conservation-law transfer simulator ([B6-D01 — narrative-first declarative outcome events](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)). The inventory should be a **projection of each item's last accepted SetItemHolder/SetItemLocation assertion**. A “Transfer” button or Do/Say attempt can remain a user-facing intent, but a grounded accepted story or manual correction records **where the item is now**, without requiring proof the old holder had it. Later assertions override earlier placement. One stable item ID, at most one current placement; unknown owner/holder remains unknown. Sparse identity is valid when an old introduction event is deleted. Do not reject current canon for missing fictional inventory prerequisites.


## Idea
Give items unique IDs and support movement among characters, containers and locations.

## Why this idea matters
Item trading and possession must remain coherent for every character over time.

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

## Proposed behaviour
Represent persistent items by unique immutable IDs with current placement/holder references, plus optional separate ownership information when relevant. **Possession follows the actual entity, not the player's current narrative focus**. In a multi-protagonist adventure, Mara's sword stays with Mara when the player switches to Theo; in a characterless story, an item can be at an established place or container without inventing a carrier. When accepted narrative or player correction establishes an item's new holder/location, emit a deterministic **SetItemHolder/Location** assertion for its stable ID; derive inventory and equipment views from the current assertions, with no source-transfer precondition. Provide traceable links to source events and resolve conflicts explicitly. An unsupported AI claim or failed state proposal must not silently invent a duplicate item or mutate possession. Underlying authoritative state remains the reference for narration and prompt context. Item stackability, storage capacities and detailed rules are open to refinement.

## Alternatives and trade-offs
Unique instance IDs improve continuity and item histories but can add bookkeeping, particularly for interchangeable consumables; stacks or quantity-based collections remain design options. Tracking physical holder and ownership separately can support trades, gifts, theft and lending, but a complete legal/claim system would be unnecessary for many stories. Capacity/encumbrance may provide mechanical gameplay constraints where desired but are not required for narrative-focused adventures; whether or how they are introduced should be decided during refinement. Immediate location references versus nested container hierarchies and their performance/safety trade-offs are likewise undecided.

## Playing As never transfers items
- **Accepted `Playing As` selector decision (IDEA-0002/0026):** Choosing an existing Lorebook character in Settings enables Do/Say from that character's perspective; the selection **never transfers, duplicates or reassigns any item**, equipment or ownership. The item holder remains its actual stable character/container/location ID.
- Do/Say attempts such as "I draw my sword" identify the selected **actor**; optional pre-narration gameplay rules may shape an unresolved attempt, but a **final accepted story assertion** about the sword's location must be recorded even if the old tracker lacked a proven source holder. The player does not get a universal inventory simply by switching characters.
- With no character selected, **Do and Say are disabled**, but Story/Continue can still affect appropriately validated items in a characterless world. The selector's **Add Character** route leads to Lorebook manual creation, not item/character auto-generation.

## Uniform inventory for any Lorebook character
- **Latest accepted IDEA-0026 direction:** There is **one universal character type**, with no permanent PC/NPC or Playable distinction. Every Lorebook character may be selected as `Playing As`. Their item custody, ownership and history are attached to the stable character ID, not the player's selection.
- Switching `Playing As` never transfers an item, grants possession or creates a global player inventory. Validation of Do/Say actions still checks the selected character's actual state. Characters never selected by the player use the **same** inventory rules.

## Distant character cuts keep inventories attached to holders
- **Accepted `Playing As` scene-cut refinement (IDEA-0026/0034):** Selecting Theo in a forest after acting as Mara in the capital means the next Do/Say follows Theo where he is, while **Mara retains all her existing possessions**. No travel or inventory change is produced by the cut.
- Optional action-attempt guardrails can consult current custody; once narrative establishes a new item holder, the accepted assertion supersedes the previous tracked holder. Neither the old actor's gear nor scene-local objects become available simply because the player switches perspective. Item histories, placement and ownership remain independent of the current Do/Say actor.

## Actor scene cuts leave item possession unchanged
- **Accepted:** Switching `Playing As` between characters in distant scenes changes which character the **next Do/Say** follows. No item travels or changes hands because of a perspective switch. Inventory/ownership/accessible items remain attached to their established character, container or location. A subsequently **accepted** new holder is recorded declaratively regardless of old source possession; only technical representation/transaction safety remains mandatory.

## Selected-character inventory in the Info tab
- **Accepted IDEA-0062 layout:** The **Info** tab in the shared Info/Settings panel shows the **actual inventory/possessions of the explicitly selected `Playing As` character** when inventory tracking is enabled. **Settings** contains the Lorebook-backed actor selector. Other characters' possessions are still inspectable by opening Lorebook directly from the **icon immediately left of the story input**.
- Changing selection changes **which character's real inventory is displayed**, not the holder/owner of an item. A missing inventory record is **unknown**, not proof of empty pockets; a known-empty inventory is only shown as empty when established. Nothing is auto-created for characterless adventures.
- Showing inventory in Info does not grant new transfer/ownership rights or commit any event; actual item changes remain separately validated and persisted.

## Story author can declare inventory outcomes without violating unique-item state
- **Accepted IDEA-0002 Option B (2026-10-18):** A player writing a **definite Story-mode outcome** may author an exceptional creation, possession or transfer event even if the ordinary **in-fiction availability or access prerequisites** for a Do/Say pickup/transfer would fail. The Lore Engine should record the actual player-authored outcome rather than block imagination solely on simulation restrictions, and subsequent world/inventory behaviour uses the resulting canonical state.
- **Never duplicate state by accident:** Authorial freedom does **not** allow a single uniquely identified item to be simultaneously located in incompatible holders/places, break stable entity IDs, fail referential integrity or leave half-committed inventory. If Story says an item appears in someone's hand, update the **correct item's holder** coherently or, only where explicitly warranted by the text, create a **new distinct item identity** using established creation rules. Do not invent an unmentioned theft, travel path or explanatory spell.
- **Normal action rules unchanged:** Do/Say attempts and autonomous AI/Continue claims still use ordinary rules for possession, accessibility and transfers. A Story-authored world fact still requires safe typed event validation and atomic SQLite storage.

## Dependencies and constraints
- Uses independently accepted [[Shared PC and NPC Character Entities]] (IDEA-0026) and **accepted staging** [[Hierarchical World Locations]] (IDEA-0033) for character/location identity and custody references. The two were accepted separately and remain distinct data responsibilities.
- Item create/move/delete actions must be validated against committed canonical state and must not follow uncommitted, rejected or failed narrative generation as if authoritative.
- Equipment state from separately **accepted staging** [[Slot-Based Equipment and Body Diagram]] (IDEA-0030) refers to the **same item identities**. IDEA-0030 was approved independently, not by the original item-tracking approval. Validated automatic equipment adjustments when anatomy changes are now accepted via IDEA-0030/0031.
- The event and historical-edit/version systems (IDEA-0039 onward) remain separately gated; item tracking should be designed with undo, branch, revision and rollback safety in mind without claiming those systems already exist.
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
- [ ] Changing `Playing As` between characters in distant locations never duplicates, teleports, swaps or transfers their items; Do/Say inventory actions still target and validate the selected character's actual accessible items.- [ ] Tracked unique item instances have durable IDs that survive renames and transfers.
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Originally a user-requested candidate; explicit acceptance applies to persistent item IDs, validated transfers and coherent placement/holder distinctions.
- Accepted into **staging for refinement only**, not production. The precise model for stacking, capacity, item categories and ownership rules remains undecided; no implementation is claimed.

## Decisions and review history

- 2026-10-23 — **Pass A batch 4 reference correction:** IDEA-0030 equipment and IDEA-0033 world hierarchy are separately accepted staging features, not outstanding unaccepted candidates. Item IDs, custody uniqueness and independent approval gates unchanged.
- 2026-10-18 — **Accepted IDEA-0002 authorial inventory distinction:** A player-written Story declaration can establish an extraordinary possession/transfer while keeping unique item identity and placement coherent; normal Do/Say/Continue actions still obey fictional restrictions. No unvalidated partial state. Staging only.
- 2026-10-18 — **Explicitly accepted selected-character Info display:** The Info tab in a two-tab Info/Settings panel presents the selected character's **existing inventory**, while Settings holds `Playing As` and Lorebook is available at the composer-left icon. Switching only changes presentation, not custody. Staging only.
- 2026-10-18 — **Explicit user acceptance:** `Playing As` switching is a narrative cut; the next Do/Say follows the chosen character in their existing circumstances. Switching causes no physical travel, time passage or item movement. Staging only.
- 2026-10-18 — **Accepted scene-cut/inventory independence:** Next Do/Say follows the new `Playing As` actor's established whereabouts, not the previous actor's location or possessions. Selection itself performs no travel or item transfer; staging unchanged.
- 2026-10-18 — **Accepted universal-character dependency:** One character kind, every Lorebook character eligible for `Playing As`; no PC/NPC or Playable tag. All item ownership/custody remains entity-based, never transferred by selection. Staging only.
- 2026-10-18 — **Accepted IDEA-0002 actor selector dependency:** The Settings `Playing As` selection supplies the actor for Do/Say and gates their availability but has no inventory/ownership transfer effects. Item custody stays attached to actual entities; unselected adventures use Story/Continue. Staging unchanged.
- 2026-10-18 — **Accepted flexible-character inventory clarification:** The player is **not** an inventory-owning entity. Tracked items belong in actual character custody, containers or world locations; narrative focus/acting-character changes must not transfer inventory. Characterless and ensemble-cast stories are supported without a global Player Inventory or a mandatory dummy character. Existing identity, holder-versus-owner and validation rules still apply. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Persistent unique item IDs; validated creation, pickup, drop, storage and transfers between characters, containers and locations; coherent current possession/placement; separating current holder from ownership when needed; prevention of duplicate/impossible item states. Encumbrance, capacity, stacking and detailed inventory mechanics deliberately left open for refinement. Moved to staging, not production.

- 2026-10-28 — **Explicit user-directed supersession:** Narrative-first declarative assertions adopted by user and reconciled here under [B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). Earlier action-precondition wording is preserved only as approval history where still quoted; **the latest governing section overrides it**. No staging promotion or implementation.
