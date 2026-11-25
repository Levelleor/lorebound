---
id: PRD-0008
type: prd
status: accepted
related:
- NOTE-0023
- PRD-0001
- NOTE-0009
- NOTE-0007
---

# Character Creation and Starting Choices

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0007](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Character%20Creation%20and%20Starting%20Choices.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S10**. First milestone: **M5**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Accepted direction
- **Flexible, optional fields:** Support character identity, name, species, occupation/role, background, appearance, traits, starting conditions and other user-defined descriptive fields without prescribing fixed categories.
- **Freeform descriptions:** Players may describe unusual characters in natural language without being constrained to a predefined race, class or set of statistics.
- **No mandatory RPG rules:** Do not require classes, levels, numerical attributes or combat statistics to create or play a character.
- **Skippable creation and no forced protagonist (explicitly accepted):** Character creation must never be a prerequisite to beginning an adventure. A new adventure may have **zero characters**, **no designated protagonist**, or **any number of equal-kind characters that can each be selected for Do/Say**. Do not silently create an unnamed player character simply because a character sheet or inventory exists. This is consistent with Quick Start and Custom Story Openings (IDEA-0006).
- **Optional `Playing As` character from Lorebook (explicitly accepted):** The adventure **Settings sidebar** contains a nullable `Playing As` selector listing established Lorebook characters. Selecting one makes that character the player actor/speaker for **Do and Say**; with none selected, **Do and Say are disabled**, while **Story and Continue remain usable**. An **Add Character** entry opens Lorebook for **manual character creation**. **Creating or saving a character never automatically assigns it to `Playing As`**, never implicitly replaces an existing selection and does not force the player back to the story. The player may add multiple characters in Lorebook before explicitly choosing one from Settings. The character shares the ordinary entity model; selection never creates a dummy avatar, moves items or changes world state.
- **Optional tracked systems:** Starting location, equipment and numerical/structured attributes can be captured as actual linked world state where their corresponding systems are enabled; otherwise they can remain narrative description. Advanced fields need not appear when their modules are disabled.

## Dependencies and constraints
- Depends on the shared character model, character sheet, lorebook and optional world/inventory modules that are covered by other individual idea notes.
- A character created without numerical stats or a fully defined species must remain valid.
- Structured starting inventory/location facts, when tracked, should reference actual entity IDs and be validated; descriptive-only fields must not silently create unsupported game objects.
- A story started with no explicit character setup must still be playable without an account or character-creation gate.
- Nothing in this acceptance mandates RPG combat, class/level progression, or a particular UI toolkit.

## Open questions
- Which fields are available by default and which belong to optional modules?
- **Resolved:** When character creation is skipped, **do not create a default player character**. The adventure may have no current focus and no character entities until the story establishes them.
- **Resolved:** No automated semantic reconciliation or mandatory comparison between a manually authored freeform background and structured character choices. Save independently valid inputs as entered; do not impose precedence or a blocking confirmation.
- **Resolved:** Players can create/edit multiple characters through Lorebook manual entry, and **character creation does not auto-select the new character or force navigation back to the story**. The player chooses the wanted character explicitly through Settings sidebar `Playing As`, regardless of creation order. Do/Say require a valid selection and then use it without per-turn confirmation; Story/Continue need none. Exact navigation for voluntarily leaving the Lorebook remains a UI detail.
- How should starting equipment and a starting location be handled when their tracking modules are disabled?

## Draft acceptance criteria
- [ ] A manually authored background saying 'human merchant' and a separately entered Species value 'Elf' **can be saved without automatic semantic comparison, a forced correction dialog or an AI arbitration step**, provided each field passes its own applicable structural validation.
- [ ] Saving that combination does not automatically rewrite the prose or the structured field, establish additional facts, or invent an unstated precedence rule.
- [ ] Ordinary typed reference/field integrity, expected-version canonical writes and gameplay-operation checks still apply independently of this no-cross-check policy.
- [ ] A player can explicitly create a Lorebook character with **no supplied name, description, species or other filled-in profile field**; its stable ID exists and its canonical name remains unknown, without fabricated facts.
- [ ] A character with unknown name can show a descriptive label or a neutral disambiguated unnamed-character UI fallback, which is **never treated as the canonical personal name**.
- [ ] Establishing a name later changes the existing character record while preserving stable ID, relationships, state, provenance and any `Playing As` reference; merely claimed names remain uncertain.
- [ ] Unnamed characters appear in Settings `Playing As` and are selectable by stable ID, with no special PC/NPC eligibility restriction or automatic selection.
- [ ] Newly created characters are available in the Settings tab's `Playing As` list but are **never selected automatically**; the Info tab follows the actual saved selection.
- [ ] Lorebook can be opened from the icon left of the input field as well as via Add Character navigation.
- [ ] A new adventure can start with **zero character entities, no designated player character and no completed character-creation fields**, while retaining valid narrative and non-character world tracking.
- [ ] A player can optionally enter a freeform character description and save it with their adventure.
- [ ] Character creation accepts unusual/nonstandard species, roles and backgrounds without mandatory predefined classes.
- [ ] Numerical RPG statistics, classes and levels are optional, not required for ordinary story play.
- [ ] When structured tracking modules are enabled, starting locations and possessions can be linked to actual validated world/inventory state.
- [ ] All characters use **one unclassified schema** without PC/NPC or Playable categories; a nullable `Playing As` reference may indicate which existing character the user acts/speaks as for Do/Say.
- [ ] An adventure supports **zero or any number of characters**, all eligible for explicit `Playing As` selection, which can be changed or unset without altering character inventory, identity or world state.
- [ ] The Settings sidebar offers a `Playing As` selector populated from available existing Lorebook characters and an **Add Character** dropdown option that navigates to Lorebook **manual character entry**.
- [ ] The player may create **several characters consecutively** in the Lorebook. Saving any character does **not auto-select it**, replace a previously selected `Playing As` character, or force a return to the story; only an explicit player selection changes `Playing As`.
- [ ] The selection is optional for adventure creation and saved per adventure; **Do/Say are disabled without it** and use that chosen character when enabled. Story/Continue stay available for characterless narratives. No per-action confirmation prompt.
- [ ] Disabling advanced modules does not block character creation or starting the story.

## Supporting detail

See [NOTE-0023](../knowledge/inbox/NOTE-0023-prd-0008-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
