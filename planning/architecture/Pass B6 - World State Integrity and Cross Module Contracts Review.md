---
type: architecture
status: in-review
phase: "B6"
created: "2026-10-28"
updated: "2026-10-28"
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
---

# Pass B6 — World State Integrity and Cross-Module Contracts Review

> **Proposals only, not accepted.** [P-B5-01](./decisions/P-B5-01%20-%20Design%20Closure%20and%20Deferred%20World%20Integrity%20Contracts.md) formally closed B5 at design level. The next Pass B6 decisions below are unapproved pending separate user review. No implementation, tests, staging-to-production promotion, or accepted B6 ADRs.

## Scope and inherited decisions

B3/B4 establish a single current ordered replayable event history, deterministic browser TypeScript validation/replay from Turn 0, atomic Go/SQLite persistence, explicit player approval for pending manual corrections, and preflight structural validity without AI auto-cascades. B5 establishes valid blank starts and grounded fact extraction. Staged IDEA-0026/0029/0030/0031/0033/0034/0035/0038/0064 establish stable entity IDs, single physical item placement, character presence, spatial hierarchy vs traversal, Story authorial overrides, and allowed automatic equipment consequences of accepted anatomy changes. This pass chooses **precise boundary contracts**, not whether to re-accept those underlying staged features.

## Batch 1 — proposed, unapproved

### B6-D01 — Resolving references to renamed or removed entities

**Question:** A place, character or item changes its display name, or the player proposes removing an entity that surviving accepted events still reference. How should current canonical identity be handled?

- **A (recommended):** Use immutable stable entity IDs for relationships and events; names, labels and descriptions can change without changing identity. Before accepting an entity removal, validate the resulting current event graph and **reject genuinely dangling required references** with an actionable conflict. Allow valid deliberate deletions when their required dependencies are also explicitly handled. Never invent replacement identities, silently reassign references or rewrite surviving accepted outcomes. **Trade-off:** Explicit corrective work for dependent deletions, reliable replay.
- **B:** Retarget references to another entity with a matching name whenever the original is renamed/deleted. **Trade-off:** Convenient but can silently bind events to the wrong identity.
- **C:** Delete or invalidate all dependent entity records/events automatically. **Trade-off:** Fewer prompts, but unapproved cascading canonical changes.

**Inherited:** B4-D06 already rejects structural invalidity; this question refines identity/reference behaviour across character/item/location domains, not a new blanket ban on editing.

### B6-D02 — One item, one physical placement across inventory and equipment

**Question:** How should a sword move among a character's inventory, equipped hand, a container and a room without duplicate records?

- **A (recommended):** Give each tracked item a stable ID and one consistent physical custody/placement in the reconstructed state. Equipment slots refer to that **same item**, not a second copy; equipped vs carried remains distinguishable. Validate all moves/equip/unequip actions as coherent **one-batch outcome events**, atomically committing all affected custody/slot relationships. **Ownership claims** remain distinct from actual possession, and unknown location/owner stays unknown. **Trade-off:** Cross-module consistency checking, but no duplicated items.
- **B:** Let inventory, equipment and world locations each maintain independent item copies and reconcile later. **Trade-off:** Easier subsystem-local code but risks mismatched or duplicated items.
- **C:** Treat equipment as descriptive text only, with no reference to tracked item IDs. **Trade-off:** Easier initial schema, but inconsistent with supported equipment/inventory semantics.

**Inherited exception:** Accepted anatomy transformations may automatically unequip/relocate the **same item** to a *grounded valid* placement as part of a validated outcome; this is not a general licence to rewrite unrelated existing history.

### B6-D03 — Character presence, locations and travel transitions

**Question:** When the narrator says a character has moved, how does Lorebound keep scene presence and physical position consistent without assuming the move from a name mention?

- **A (recommended):** Commit a validated movement/presence outcome referencing actual stable character/location IDs; update a character's authoritative current location, transit status and scene co-presence consistently through the existing ordered event system. **Mention, memory, lore and remote conversation do not imply arrival.** Apply the adventure's selected freeform/strict/valid-multi-hop travel rules to ordinary attempts, preserving the previously accepted explicit player-Story authorial override while still checking technical structural coherence. **Trade-off:** Some domain-specific validation logic, avoids accidental teleportation.
- **B:** Treat any mention of a character in current scene prose as proof the character is physically present. **Trade-off:** Easy extraction, but makes remembered/remote characters teleport.
- **C:** Store narrative scene presence and character location independently without reconciliation. **Trade-off:** Flexible but permits contradictory authoritative physical states.

**Inherited:** A location's hierarchical parent does not create a traversable connection automatically; unknown location is not an assumed current scene.

## Review status

- **B6-D01:** proposed A/B/C, unapproved.
- **B6-D02:** proposed A/B/C, unapproved.
- **B6-D03:** proposed A/B/C, unapproved.

Further B6 batches can refine anatomy-equipment disposition when no grounded location exists, flexible character status data and dynamic environment/route changes. Exact schemas, error UX and integration tests remain separate engineering contracts. No stage promotion or runtime features are claimed.

## Decision history

- **2026-10-28 — Opening only:** Following formal B5 design closure, opened B6 Batch 1 as three unapproved options. No B6 selection inferred from the approval of B5 closure.
