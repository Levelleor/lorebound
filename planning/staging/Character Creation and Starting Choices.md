---
id: "IDEA-0007"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Characters Inventory Equipment and Anatomy Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Character Creation and Starting Choices

## Idea
Provide character creation with identity, species, role, background and starting conditions.

## Why this idea matters
The controlled character should have context without compulsory RPG rules.

## Accepted direction
- **Flexible, optional fields:** Support character identity, name, species, occupation/role, background, appearance, traits, starting conditions and other user-defined descriptive fields without prescribing fixed categories.
- **Freeform descriptions:** Players may describe unusual characters in natural language without being constrained to a predefined race, class or set of statistics.
- **No mandatory RPG rules:** Do not require classes, levels, numerical attributes or combat statistics to create or play a character.
- **Skippable creation:** Character creation must never be a prerequisite to beginning an adventure, consistent with [[Quick Start and Custom Story Openings]] (IDEA-0006).
- **Shared entity model:** The player-controlled character and NPCs use the same underlying character entity schema, rather than different incompatible schemas. The distinction is which entity the player controls.
- **Optional tracked systems:** Starting location, equipment and numerical/structured attributes can be captured as actual linked world state where their corresponding systems are enabled; otherwise they can remain narrative description. Advanced fields need not appear when their modules are disabled.

## Proposed behaviour
Offer a skippable character creator accepting both freeform prose and optional structured fields. A completed character profile creates or configures a normal character entity that can be referenced in the story. When configured, scenario choices may populate a known starting location, possessions, relationships or conditions, subject to shared world-state validation. The player can start a story without filling in a character sheet.

## Alternatives and trade-offs
A fully freeform description and optional guided fields are complementary, not mutually exclusive; both are accepted in principle. The exact form layout and amount of guidance remain open. Mandatory classes, numerical RPG statistics and blocking creation workflows are out of the accepted scope.

## Dependencies and constraints
- Depends on the shared character model, character sheet, lorebook and optional world/inventory modules that are covered by other individual idea notes.
- A character created without numerical stats or a fully defined species must remain valid.
- Structured starting inventory/location facts, when tracked, should reference actual entity IDs and be validated; descriptive-only fields must not silently create unsupported game objects.
- A story started with no explicit character setup must still be playable without an account or character-creation gate.
- Nothing in this acceptance mandates RPG combat, class/level progression, or a particular UI toolkit.

## Open questions
- Which fields are available by default and which belong to optional modules?
- What does the initial player-controlled character contain when creation is skipped?
- How should a freeform background be reconciled with structured choices if they conflict?
- Can players edit their character later and switch the controlled character?
- How should starting equipment and a starting location be handled when their tracking modules are disabled?

## Draft acceptance criteria
- [ ] A new adventure can start without completing any character creation fields.
- [ ] A player can optionally enter a freeform character description and save it with their adventure.
- [ ] Character creation accepts unusual/nonstandard species, roles and backgrounds without mandatory predefined classes.
- [ ] Numerical RPG statistics, classes and levels are optional, not required for ordinary story play.
- [ ] When structured tracking modules are enabled, starting locations and possessions can be linked to actual validated world/inventory state.
- [ ] Player and NPC character records use a shared entity schema, distinguished by the player-control reference rather than incompatible record types.
- [ ] Disabling advanced modules does not block character creation or starting the story.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intentions with suggested implementation details.
- This direction has been explicitly accepted for **staging/refinement**, not approved for production or implemented.

## Decisions and review history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Flexible optional character fields, freeform descriptions, no mandatory RPG classes/stats, skippable character creation, and a shared underlying entity model for players and NPCs. Moved to staging to refine specific behaviour, not to production.
