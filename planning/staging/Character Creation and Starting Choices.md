---
id: "IDEA-0007"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
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
- **Skippable creation and no forced protagonist (explicitly accepted):** Character creation must never be a prerequisite to beginning an adventure. A new adventure may have **zero characters**, **no designated protagonist**, or **several potential playable characters**. Do not silently create an unnamed player character simply because a character sheet or inventory exists. This is consistent with [[Quick Start and Custom Story Openings]] (IDEA-0006).
- **Optional `Playing As` character from Lorebook (explicitly accepted):** The adventure **Settings sidebar** contains a nullable `Playing As` selector listing established Lorebook characters. Selecting one makes that character the player actor/speaker for **Do and Say**; with none selected, **Do and Say are disabled**, while **Story and Continue remain usable**. An **Add Character** entry opens Lorebook for **manual character creation**. **Creating or saving a character never automatically assigns it to `Playing As`**, never implicitly replaces an existing selection and does not force the player back to the story. The player may add multiple characters in Lorebook before explicitly choosing one from Settings. The character shares the ordinary entity model; selection never creates a dummy avatar, moves items or changes world state.
- **Optional tracked systems:** Starting location, equipment and numerical/structured attributes can be captured as actual linked world state where their corresponding systems are enabled; otherwise they can remain narrative description. Advanced fields need not appear when their modules are disabled.

## Proposed behaviour
Offer a skippable character creator through **manual Lorebook character entry**, accepting freeform prose and optional structured fields. A completed profile creates/configures a normal character entity; valid starting possessions and location attach to **that entity**, not a global player inventory. The adventure can start with **no characters** and keep Story/Continue available. To use **Do or Say**, the player chooses an existing Lorebook character from the **Settings sidebar's `Playing As` selector**, or follows **Add Character** from its dropdown to the Lorebook to add one manually. The selected ID becomes the player actor/speaker for Do/Say without repeated confirmations. Changing selection never transfers equipment or changes established character/world facts.

## Alternatives and trade-offs
A fully freeform description and optional guided fields are complementary, not mutually exclusive; both are accepted in principle. The exact form layout and amount of guidance remain open. Mandatory classes, numerical RPG statistics and blocking creation workflows are out of the accepted scope.

## Minimal-start entry flow dependency
- IDEA-0006 explicitly accepts **blank Custom Opening**, **all Guided Setup fields skippable**, and a fallback **`Untitled Adventure`** title for unnamed adventures. Character creation must remain **fully optional** and cannot interrupt or gate any of those minimal-start paths.
- Character records and chosen fields are initialized only when the player supplies them or accepted prose/worldbuilding explicitly establishes them and validates their creation. A blank or characterless adventure stays playable: **no automatically invented protagonist, empty inventory, character sheet or other phantom entity** is needed to persist it.

## Dependencies and constraints
- Depends on the shared character model, character sheet, lorebook and optional world/inventory modules that are covered by other individual idea notes.
- A character created without numerical stats or a fully defined species must remain valid.
- Structured starting inventory/location facts, when tracked, should reference actual entity IDs and be validated; descriptive-only fields must not silently create unsupported game objects.
- A story started with no explicit character setup must still be playable without an account or character-creation gate.
- Nothing in this acceptance mandates RPG combat, class/level progression, or a particular UI toolkit.

## Open questions
- Which fields are available by default and which belong to optional modules?
- **Resolved:** When character creation is skipped, **do not create a default player character**. The adventure may have no current focus and no character entities until the story establishes them.
- How should a freeform background be reconciled with structured choices if they conflict?
- **Resolved:** Players can create/edit multiple characters through Lorebook manual entry, and **character creation does not auto-select the new character or force navigation back to the story**. The player chooses the wanted character explicitly through Settings sidebar `Playing As`, regardless of creation order. Do/Say require a valid selection and then use it without per-turn confirmation; Story/Continue need none. Exact navigation for voluntarily leaving the Lorebook remains a UI detail.
- How should starting equipment and a starting location be handled when their tracking modules are disabled?

## Draft acceptance criteria
- [ ] A new adventure can start with **zero character entities, no designated player character and no completed character-creation fields**, while retaining valid narrative and non-character world tracking.
- [ ] A player can optionally enter a freeform character description and save it with their adventure.
- [ ] Character creation accepts unusual/nonstandard species, roles and backgrounds without mandatory predefined classes.
- [ ] Numerical RPG statistics, classes and levels are optional, not required for ordinary story play.
- [ ] When structured tracking modules are enabled, starting locations and possessions can be linked to actual validated world/inventory state.
- [ ] All characters use the **same schema**; an **optional** focus/reference may identify the currently followed character, with no mandated protagonist and no permanent player/NPC entity split.
- [ ] An adventure supports zero, one or multiple playable characters over time; focus can be unset or changed independently of which characters act in each turn, without altering character inventory or world state.
- [ ] The Settings sidebar offers a `Playing As` selector populated from available existing Lorebook characters and an **Add Character** dropdown option that navigates to Lorebook **manual character entry**.
- [ ] The player may create **several characters consecutively** in the Lorebook. Saving any character does **not auto-select it**, replace a previously selected `Playing As` character, or force a return to the story; only an explicit player selection changes `Playing As`.
- [ ] The selection is optional for adventure creation and saved per adventure; **Do/Say are disabled without it** and use that chosen character when enabled. Story/Continue stay available for characterless narratives. No per-action confirmation prompt.
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
- 2026-10-18 — **Explicit user rejection of automatic selection after Add Character:** Lorebook can be used to add **multiple** characters. Saving a new character **must not auto-select it as `Playing As`**, change any prior selection, or force return to the story. Selection is always an explicit action in the Settings sidebar after the user chooses which character to play. Existing Do/Say selection gate and Story/Continue availability remain. Staging only.
- 2026-10-18 — **Explicit user direction on character selection:** Rather than asking which actor the player means in each Do/Say input, add a **Settings sidebar `Playing As`** selector sourced from existing Lorebook character entries, with **Add Character → Lorebook manual character entry**. **Disable Do/Say without a selection**, including zero-character stories; **Story/Continue still work**. Selecting a character does not invent or move items. Staging unchanged.
- 2026-10-18 — **Explicit user acceptance of flexible, protagonist-optional storytelling:** The player is not inherently a character. Adventures may start with **no characters**, one focal character, or multiple characters played in turn. Character creation remains skippable and must not create a placeholder hero or empty inventory. Keep independent character identities, optional focus, per-turn actors and entity-attached equipment/status/location; support characterless story-wide narration. Exact UI and ambiguous-input policy require refinement. Staging only.
- 2026-10-17 — **Accepted IDEA-0006 minimal-start alignment:** No character creation, structured player identity, attributes or starter choices are required to create a playable blank adventure or choose Quick Start. Guided Setup is skippable, and untitled stories use the ordinary `Untitled Adventure` display default. Existing optional character features remain separate staging scope.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Flexible optional character fields, freeform descriptions, no mandatory RPG classes/stats, skippable character creation, and a shared underlying entity model for players and NPCs. Moved to staging to refine specific behaviour, not to production.
