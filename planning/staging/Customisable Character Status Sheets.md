---
id: "IDEA-0027"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Memory Lorebook and Context Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Customisable Character Status Sheets

## Idea
Store editable current stats, conditions, identity details, goals and status for every character.

## Why this idea matters
Narrator context benefits from accurate current character state.

## Accepted direction
- **Editable, customisable status sheets for every character:** Every character uses the same optional status data linked to a stable, unclassified character entity ([[Shared PC and NPC Character Entities]], IDEA-0026). There is **no PC/NPC or Playable kind**, and no requirement to populate every character's sheet.
- **Arbitrary player-defined fields:** Support custom fields covering stats, conditions, identity details, goals and mutable current character status rather than imposing a fixed RPG-only sheet.
- **Flexible applicability:** Different adventures or characters may need different categories and field sets. A simple conversational adventure must not be forced to track numerical health, mana or other irrelevant attributes.
- **Optional typed fields and validation:** Allow a future schema to distinguish relevant value types (for example numbers, text, booleans, options, references or other structured fields) and apply suitable validation. Exactly which types, constraints and templates are supported remains open for refinement.
- **Player editability:** Players can inspect and change current status-sheet values in a clear interface, with updates respecting the authoritative game-state model rather than rewriting prose or stale Lorebook descriptions.
- **Unknown is not empty:** Unrecorded/missing values must remain unknown, not automatically zero, false, empty, healthy, uninjured or another asserted state; explicitly recorded empty/none values are distinguishable from missing data.
- **Optional context inclusion:** Expose selection controls so relevant *current* status values may be included in generation context through [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024); the context inspector should show requested, selected and transmitted material. Do not blindly include every possible custom field.
- **Acceptance history and later resolution:** This idea originally approved the **editable sheet model only**, not automatic status mutation. Later accepted [[Automatic Character Sheet Tracking]] (IDEA-0064) explicitly authorises **validated automatic tracking of all applicable defined fields** alongside manual editing; it supersedes the earlier unresolved automatic-update question. Player-confirmed valid manual corrections are authoritative historical state changes, and automatic tracking must subsequently use current committed values rather than stale inferred data. Fine-grained Disabled/Manual Only/Automatic modes in [[Character State Tracking Modes]] (IDEA-0028) remain **unaccepted**.

## Proposed behaviour
Provide per-character editable fields and optional typed definitions for current status, identity, conditions, goals and numeric or qualitative statistics. Let sparse character records remain sparse until information is genuinely established. Store mutable values on the linked authoritative character-status record rather than creating copies of live state in Lorebook prose. Allow players to choose which recorded fields are eligible for AI context; surface omitted fields and preserve distinctions between unknown, explicitly empty and known values. Keep how automatic updates work independent of the status sheet data model until IDEA-0028 is reviewed.

## Alternatives and trade-offs
A universal predefined RPG sheet can make validation and UI simpler but forces genre-specific assumptions on stories where the metrics don't fit. A flexible key/value sheet works across genres but may sacrifice type safety and user experience unless typed values and optional templates are provided. The accepted approach favours flexible player-defined fields with optional typing and validation; exact type catalogues, presets, reusable schemas and field inheritance remain refinement choices.

## Status belongs to actual characters, not narrative focus
- **Accepted IDEA-0007/0026 flexible character control:** Character status sheets are attached only to **real, established character IDs**, irrespective of whether the character is currently focused, one of several acted-through characters, or another character. No player-global character status sheet or invented default protagonist is required.
- Stories with **zero characters** can exist and track non-character world state without generating a placeholder sheet. A focus switch changes which existing record the interface may show; it must not mutate status values, inventories or other canonical character details.
- Sparse character information stays unknown until explicitly established and validated, consistent with existing no-invented-lore rules.

## Uniform character sheet regardless of player selection
- **Explicit IDEA-0026 refinement:** Every Lorebook character is eligible for `Playing As` without PC/NPC or Playable classification. A status sheet belongs to its stable character ID, independent of how often the player chooses to act as that character.
- The selected actor may change without altering any status field, inventory or historical event. Sparse characters and characterless adventures remain valid; no default protagonist sheet is required.

## Selected-character status in the Info tab
- **User-accepted IDEA-0062 layout:** The shared information panel contains **Info** and **Settings** tabs. For a valid explicit `Playing As` character, the **Info** tab shows the current authoritative **tracked status** (alongside that character's inventory and known location from their own systems). The **Settings** tab includes the `Playing As` character selector. The Lorebook remains directly accessible using its icon **left of the story input field**.
- Switching `Playing As` changes **which existing character's status is displayed**, not the data itself, and never activates automatic status mutation. Fields remain unknown when unrecorded, instead of being populated with fabricated stats or a false empty state. With no actor selected, the exact Info empty-state display remains an interface refinement.
- Full status editing and advanced field views may still live in the character's Lorebook record, without promising a specific editor inside Info.

## Dependencies and constraints
- Depends on accepted [[Shared PC and NPC Character Entities]] (IDEA-0026) for stable identity and one unclassified character type.
- Coordinates with accepted [[Entity-Based Lorebook]] (IDEA-0020) to avoid conflicting copies of current status in persistent lore.
- For model-context inclusion, honour player selection and size/priority rules in accepted [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024).
- This decision does **not** accept or implement IDEA-0028's automatic character-state tracking modes, nor any specific RPG mechanics, equipment or anatomy schema.
- Preserve type information and the semantic difference between missing, unknown and explicitly empty/zero/false values when editing, exporting and constructing prompts.
- Field changes must follow the adventure's authoritative persistence and validation boundaries, especially when a schema is edited after characters already contain values.
- Do not treat presentation-only derived figures as independently authoritative unless validated and stored appropriately.

## Open questions
- What field types and validation should user-defined schemas support?
- Should fields belong to the adventure's shared character schema, a reusable template, an individual character, or a combination?
- How do custom field definitions and stored values evolve if a player renames or deletes a field?
- How should a field with a known empty value differ from one that has never been populated, in both storage and display?
- Which status values should default to being visible or included in AI context, and should players choose per-character, per-field, per-adventure or per-request?
- How should freeform fields coexist with structured references and future mechanics (e.g., conditions, goals and equipment)?
- What controls prevent invalid manual edits without imposing an unwanted universal RPG system?
- How should manually committed current-value corrections and later automatic proposals be represented and reconciled without stale overwrites? General automatic tracking is now accepted through IDEA-0064; per-field modes in IDEA-0028 remain unaccepted.

## Draft acceptance criteria
- [ ] The Info tab shows the explicitly chosen `Playing As` character's recorded status fields where enabled, and updates when the selection changes without changing stored status values.
- [ ] Unknown/unrecorded fields remain unknown; no placeholder status sheet is created for characterless adventures.
- [ ] Every character can have editable status sheets linked to their durable universal character identity.
- [ ] A player can create and modify arbitrary character fields for stats, conditions, identity, goals and current state.
- [ ] An adventure can use its own fields rather than being forced to use one fixed RPG character sheet.
- [ ] Where chosen, typed fields validate values according to defined types and constraints, without inventing defaults for unspecified fields.
- [ ] Sparse characters can omit optional status fields without requiring false or empty data values.
- [ ] Missing or unrecorded values remain distinguishable from explicitly known empty, zero or false values.
- [ ] The player can select current status fields to include or exclude from model context, and inspect what was actually transmitted.
- [ ] Live status values do not silently become duplicated authoritative facts in Lorebook text.
- [ ] Accepting the sheet does not enable automatic AI mutation of status values without a separately approved tracking policy.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Originally a user-requested candidate, now explicitly accepted by the requesting user for staging.
- Accepted direction remains unrefined and is neither production-approved nor implemented. Exact schema and automatic-update behaviour remain open.

## Decisions and review history

- 2026-10-19 — **Cross-idea resolution accepted by user:** This original sheet-model idea did not by itself approve automation, but subsequent IDEA-0064 did. Valid manual corrections enter canonical state/history and later validated automatic updates start from the latest committed state. Do not reopen the separate unaccepted IDEA-0028 tracking modes. No production approval.
- 2026-10-18 — **Accepted IDEA-0062 info-panel refinement:** Info tab surfaces existing status for the explicit `Playing As` character, while the Settings tab provides character selection. Lorebook is accessible via the icon left of the composer input. No selection or presentation change mutates stats. Staging only.
- 2026-10-18 — **Accepted universal-character dependency:** One character type, optional sheets for all, no PC/NPC or Playable categories and no status changes merely because `Playing As` changes. Staging only.
- 2026-10-18 — **Accepted character-control dependency:** An adventure may have no characters or no main character, while status and inventory remain anchored to actual character entity IDs. Multi-character focus/actor switches do not modify status records or create dummy player sheets. Staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Editable, customisable status sheets for PCs and NPCs; arbitrary fields for stats, conditions, identity, goals and current state; optional inclusion of current values in generation context; optional typed fields and validation; preservation of unknown values versus explicitly empty ones. Exact schema and automatic state-update rules remain for refinement and IDEA-0028. Moved to staging, not production.
