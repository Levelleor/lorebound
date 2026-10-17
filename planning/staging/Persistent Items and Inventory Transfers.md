---
id: "IDEA-0029"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Persistent Items and Inventory Transfers

## Idea
Give items unique IDs and support movement among characters, containers and locations.

## Why this idea matters
NPC trading and possession must remain coherent over time.

## Accepted direction
- **Persistent unique item identities:** Each individual tracked item has a durable item ID separate from its displayed name or type. An item retains that ID through changes of possession, storage, location, name or descriptive properties.
- **Validated lifecycle and movement events:** Support item creation, pickup, drop, storage and transfers between characters, containers and world locations. New items or transfers are committed only after validation against the existing authoritative state.
- **Consistent current possession and placement:** Track where an item currently resides and who currently holds/carries it, as appropriate. Avoid two simultaneous incompatible physical placements or inventories claiming the same unique item.
- **Holder is not necessarily owner:** Distinguish current possession/physical custody from ownership or claims of ownership **when needed**. A thief may possess an item while someone else retains an ownership claim. Exact ownership mechanics or legal rules remain open.
- **Prevent duplicates and impossible changes:** Reject or reconcile attempts to recreate the same unique item accidentally, transfer an item from someone who does not have it, place the same unique item in multiple incompatible locations or perform unsupported transitions.
- **Shared PC/NPC and world references:** Item movements may reference stable character IDs from [[Shared PC and NPC Character Entities]] (IDEA-0026), container IDs and world locations. Both PCs and NPCs can use consistent possession/transfer rules.
- **Preserve uncertainty:** Unknown location, holder or ownership is not proof that an item is absent, unowned or at a particular default location. Distinguish unknown data from established none/empty values.
- **No mandatory RPG carrying rules:** Encumbrance, capacity restrictions, item stacking and more detailed inventory mechanics are **not decided** by this acceptance; leave them as optional directions for staging refinement.
- **Other modules remain separately gated:** Character equipment slots/body diagrams (IDEA-0030) and the full world location model (IDEA-0033 onward) are distinct candidates. Accepted item tracking does not by itself approve their detailed UX, schema or mechanics.

## Proposed behaviour
Represent persistent items by unique immutable IDs with current placement/holder references, plus optional separate ownership information when relevant. When a validated narrative/gameplay event creates, picks up, stores, drops or transfers an item, apply the operation to canonical item/location/inventory state so the item moves rather than being duplicated. Provide traceable links to source events and resolve conflicts explicitly. An unsupported AI claim or failed state proposal must not silently invent a duplicate item or mutate possession. Underlying authoritative state remains the reference for narration and prompt context. Item stackability, storage capacities and detailed rules are open to refinement.

## Alternatives and trade-offs
Unique instance IDs improve continuity and item histories but can add bookkeeping, particularly for interchangeable consumables; stacks or quantity-based collections remain design options. Tracking physical holder and ownership separately can support trades, gifts, theft and lending, but a complete legal/claim system would be unnecessary for many stories. Capacity/encumbrance may provide mechanical gameplay constraints where desired but are not required for narrative-focused adventures; whether or how they are introduced should be decided during refinement. Immediate location references versus nested container hierarchies and their performance/safety trade-offs are likewise undecided.

## Dependencies and constraints
- Uses accepted [[Shared PC and NPC Character Entities]] (IDEA-0026) for durable character ownership/custody references; integrates with future world-location data without presuming that separate candidate is approved.
- Item create/move/delete actions must be validated against committed canonical state and must not follow uncommitted, rejected or failed narrative generation as if authoritative.
- Equipment state from unaccepted [[Slot-Based Equipment and Body Diagram]] (IDEA-0030) may later refer to the same item identities, but slot layout/equip rules have not been accepted here.
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
- [ ] Tracked unique item instances have durable IDs that survive renames and transfers.
- [ ] A player or validated gameplay event can create, pick up, drop, store and transfer items between characters, containers and world locations where those entities exist.
- [ ] A transfer removes an item from its prior incompatible placement before establishing its new placement; an individual instance is not simultaneously owned by multiple inventories as the same physical object.
- [ ] Invalid transfers, unsupported creation or contradictory concurrent item placements are rejected or resolved without silently duplicating unique items.
- [ ] The system can represent current holder or location separately from ownership/claim information where needed.
- [ ] Missing item placement or owner information is not silently converted into an invented definite state.
- [ ] Failed, rejected or uncommitted generation proposals do not mutate persistent item placement.
- [ ] PC and NPC inventory/possession references use stable shared character identities.
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
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Persistent unique item IDs; validated creation, pickup, drop, storage and transfers between characters, containers and locations; coherent current possession/placement; separating current holder from ownership when needed; prevention of duplicate/impossible item states. Encumbrance, capacity, stacking and detailed inventory mechanics deliberately left open for refinement. Moved to staging, not production.
