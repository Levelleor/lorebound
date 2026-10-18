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
- **Skippable creation and no forced protagonist (explicitly accepted):** Character creation must never be a prerequisite to beginning an adventure. A new adventure may have **zero characters**, **no designated protagonist**, or **any number of equal-kind characters that can each be selected for Do/Say**. Do not silently create an unnamed player character simply because a character sheet or inventory exists. This is consistent with [[Quick Start and Custom Story Openings]] (IDEA-0006).
- **Optional `Playing As` character from Lorebook (explicitly accepted):** The adventure **Settings sidebar** contains a nullable `Playing As` selector listing established Lorebook characters. Selecting one makes that character the player actor/speaker for **Do and Say**; with none selected, **Do and Say are disabled**, while **Story and Continue remain usable**. An **Add Character** entry opens Lorebook for **manual character creation**. **Creating or saving a character never automatically assigns it to `Playing As`**, never implicitly replaces an existing selection and does not force the player back to the story. The player may add multiple characters in Lorebook before explicitly choosing one from Settings. The character shares the ordinary entity model; selection never creates a dummy avatar, moves items or changes world state.
- **Optional tracked systems:** Starting location, equipment and numerical/structured attributes can be captured as actual linked world state where their corresponding systems are enabled; otherwise they can remain narrative description. Advanced fields need not appear when their modules are disabled.

## Proposed behaviour
Offer a skippable character creator through **manual Lorebook character entry**, accepting freeform prose and optional structured fields. A completed profile creates/configures a normal character entity; valid starting possessions and location attach to **that entity**, not a global player inventory. The adventure can start with **no characters** and keep Story/Continue available. To use **Do or Say**, the player chooses an existing Lorebook character from the **Settings sidebar's `Playing As` selector**, or follows **Add Character** from its dropdown to the Lorebook to add one manually. The selected ID becomes the player actor/speaker for Do/Say without repeated confirmations. Changing selection never transfers equipment or changes established character/world facts.

## Alternatives and trade-offs
A fully freeform description and optional guided fields are complementary, not mutually exclusive; both are accepted in principle. The exact form layout and amount of guidance remain open. Mandatory classes, numerical RPG statistics and blocking creation workflows are out of the accepted scope.

## Minimal-start entry flow dependency
- IDEA-0006 explicitly accepts **blank Custom Opening**, **all Guided Setup fields skippable**, and a fallback **`Untitled Adventure`** title for unnamed adventures. Character creation must remain **fully optional** and cannot interrupt or gate any of those minimal-start paths.
- Character records and chosen fields are initialized only when the player supplies them or accepted prose/worldbuilding explicitly establishes them and validates their creation. A blank or characterless adventure stays playable: **no automatically invented protagonist, empty inventory, character sheet or other phantom entity** is needed to persist it.

## Unclassified character creation and universal eligibility
- **Explicit user decision:** **There are no permanent PC and NPC kinds** in the character creator, nor a `Playable` toggle. Each manually created or canonically established character uses the **same ordinary character record**. Any such Lorebook character can be explicitly selected via Settings `Playing As` for Do and Say.
- The creator supports making **multiple characters** in succession. It must not automatically tag any of them as the protagonist, set `Playing As`, or navigate back to the story. A character can be present in the world without ever being controlled by the player.
- Characterless adventures remain valid; Story and Continue remain available even before any characters exist. All earlier optional fields and validation rules remain intact.

## Manual character creation and the two-tab panel
- **User-accepted IDEA-0062 interface:** The same information panel has **Info** (selected character's recorded inventory, status and known location) and **Settings** (including the nullable `Playing As` dropdown). Any Lorebook character can be explicitly chosen from Settings; no PC/NPC or Playable distinction. **Do/Say are disabled without a choice**, while Story/Continue work as usual.
- The input field has a **Lorebook shortcut icon directly to its left**. `Add Character` from `Playing As` still opens **manual Lorebook creation**. The player may create multiple characters there without auto-selecting one or being sent back to the story.
- Info always reflects the user's explicitly selected character, not the latest created character. A characterless story creates no fake profile, inventory or location to populate Info. Exact empty-state presentation remains open.

## Add Character opens the same Lorebook left drawer
- **Accepted IDEA-0062 navigation:** Choosing **Add Character** in the Settings-tab `Playing As` dropdown opens the **same editable Lorebook LEFT-side drawer** that the dedicated icon immediately left of the story input opens, navigating to manual character creation there. Do not create a separate mandatory full-page character wizard.
- The Lorebook drawer opens with **two sequential phases**: the narrow leading sidebar/rail appears first from the left, then the main content comes out from behind it. **Closing fades out simply**; do not replay the opening in reverse. Exact dimensions/timings remain under UI refinement; support reduced motion and keyboard navigation.
- Players may add **multiple characters** without being forced out of the drawer or automatically assigned a `Playing As` identity. The existing selected actor, if any, remains unchanged until explicitly set in Settings. The Info/Settings two-tab panel remains a separate surface.

## Unnamed characters with stable identity and uncertain names
- **Explicit accepted Option B (2026-10-18):** **No character name is required** to create a normal Lorebook character. Even a character whose name and other properties are wholly unknown may have a persistent character entity when the player intentionally creates one or accepted story evidence establishes that someone exists. Assign an immutable stable character ID as its identity; do not force a canonical name, invented personal details, dummy protagonist or required description.
- **Canonical name versus display label:** Keep the character's **known canonical name optional** and represent a missing name as **unknown/unrecorded**, not the literal name "Unknown". The Lorebook may show a known descriptive identifier such as **The Hooded Stranger** or a user-provided convenient label, but that label is **not automatically the character's proper name or other newly established world fact**. If no useful label exists, show a neutral **UI-only fallback** such as *Unnamed Character 3* so distinct entries can still be found. Exact fallback numbering/disambiguation is not a canonical property.
- **Identity survives discovery:** If established story evidence later identifies the hooded stranger as **Elian**, update the **same stable ID's** name field, preserving all associated provenance, relationships, items, status, location, history and the selected `Playing As` reference. Do not duplicate or merge characters merely because names/labels match; resolving whether two unknown figures are one person still needs evidence and separate identity-refinement rules.
- **Preserve uncertainty:** Claims, rumours and unverified aliases such as "someone calls the stranger Elian" remain explicitly attributed/uncertain, not silently promoted into an established canonical name. An actual confirmed revelation can update the same entity without changing its identity.
- **Usable in Settings:** **Every character entity**, named or unnamed, appears in the `Playing As` list using its meaningful display label or fallback; the selection uses the **stable ID**, never the potentially changing label/name. Explicit selection enables Do/Say as normal, while adding/renaming characters never auto-selects one. Manual creation still uses the same Lorebook drawer.


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
- 2026-10-18 — **User explicitly accepted refined Option B:** Character names are **optional and can remain unknown**. Retain each character's immutable stable ID; display a description/user-facing label or neutral *Unnamed Character N* fallback separately from the established canonical name. Newly established names update the same entity; rumours/claimed names remain uncertain. Unnamed characters remain eligible for explicit `Playing As`. No invented facts, mandatory name or character creation; staging only, no implementation/promotion.
- 2026-10-18 — **Accepted IDEA-0062 Lorebook drawer integration:** Settings Add Character opens the same left-side editable Lorebook drawer as the composer-left icon, with rail-first/content-second entrance and simple fade-out exit. Manual creation may continue for multiple characters with no automatic Playing As selection or forced redirect. Staging only.
- 2026-10-18 — **Accepted IDEA-0062 two-tab interface:** Info shows data about the explicitly selected character; Settings contains `Playing As`, while a Lorebook icon beside the input offers direct access to manual entry. Creating several characters still never selects one automatically. Staging only.
- 2026-10-18 — **Explicit user-confirmed change:** Lorebound recognises **one character kind**, no PC/NPC or Playable status; every Lorebook character can be chosen for Do/Say via explicit Settings `Playing As` selection. Creating characters does not mark/select any of them automatically. Zero-character adventures remain valid. Staging only.
- 2026-10-18 — **Explicit user rejection of automatic selection after Add Character:** Lorebook can be used to add **multiple** characters. Saving a new character **must not auto-select it as `Playing As`**, change any prior selection, or force return to the story. Selection is always an explicit action in the Settings sidebar after the user chooses which character to play. Existing Do/Say selection gate and Story/Continue availability remain. Staging only.
- 2026-10-18 — **Explicit user direction on character selection:** Rather than asking which actor the player means in each Do/Say input, add a **Settings sidebar `Playing As`** selector sourced from existing Lorebook character entries, with **Add Character → Lorebook manual character entry**. **Disable Do/Say without a selection**, including zero-character stories; **Story/Continue still work**. Selecting a character does not invent or move items. Staging unchanged.
- 2026-10-18 — **Explicit user acceptance of flexible, protagonist-optional storytelling:** The player is not inherently a character. Adventures may start with **no characters**, one focal character, or multiple characters played in turn. Character creation remains skippable and must not create a placeholder hero or empty inventory. Keep independent character identities, optional focus, per-turn actors and entity-attached equipment/status/location; support characterless story-wide narration. Exact UI and ambiguous-input policy require refinement. Staging only.
- 2026-10-17 — **Accepted IDEA-0006 minimal-start alignment:** No character creation, structured player identity, attributes or starter choices are required to create a playable blank adventure or choose Quick Start. Guided Setup is skippable, and untitled stories use the ordinary `Untitled Adventure` display default. Existing optional character features remain separate staging scope.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Flexible optional character fields, freeform descriptions, no mandatory RPG classes/stats, skippable character creation, and a shared underlying entity model for players and NPCs. Moved to staging to refine specific behaviour, not to production.
