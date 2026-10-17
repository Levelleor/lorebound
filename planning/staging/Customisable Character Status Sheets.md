---
id: "IDEA-0027"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
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
- **Editable, customisable status sheets for every character:** Player characters and NPCs both use status data attached to their stable, shared character entities ([[Shared PC and NPC Character Entities]], IDEA-0026), without forcing every character to have a fully populated sheet.
- **Arbitrary player-defined fields:** Support custom fields covering stats, conditions, identity details, goals and mutable current character status rather than imposing a fixed RPG-only sheet.
- **Flexible applicability:** Different adventures or characters may need different categories and field sets. A simple conversational adventure must not be forced to track numerical health, mana or other irrelevant attributes.
- **Optional typed fields and validation:** Allow a future schema to distinguish relevant value types (for example numbers, text, booleans, options, references or other structured fields) and apply suitable validation. Exactly which types, constraints and templates are supported remains open for refinement.
- **Player editability:** Players can inspect and change current status-sheet values in a clear interface, with updates respecting the authoritative game-state model rather than rewriting prose or stale Lorebook descriptions.
- **Unknown is not empty:** Unrecorded/missing values must remain unknown, not automatically zero, false, empty, healthy, uninjured or another asserted state; explicitly recorded empty/none values are distinguishable from missing data.
- **Optional context inclusion:** Expose selection controls so relevant *current* status values may be included in generation context through [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024); the context inspector should show requested, selected and transmitted material. Do not blindly include every possible custom field.
- **Do not preapprove automatic state mutation:** Rules for manual-only, disabled or AI-assisted validated updates are reserved for separate unaccepted [[Character State Tracking Modes]] (IDEA-0028). Accepting the editable data model alone does not grant the AI permission to change status fields automatically.

## Proposed behaviour
Provide per-character editable fields and optional typed definitions for current status, identity, conditions, goals and numeric or qualitative statistics. Let sparse NPC records remain sparse until information is genuinely established. Store mutable values on the linked authoritative character-status record rather than creating copies of live state in Lorebook prose. Allow players to choose which recorded fields are eligible for AI context; surface omitted fields and preserve distinctions between unknown, explicitly empty and known values. Keep how automatic updates work independent of the status sheet data model until IDEA-0028 is reviewed.

## Alternatives and trade-offs
A universal predefined RPG sheet can make validation and UI simpler but forces genre-specific assumptions on stories where the metrics don't fit. A flexible key/value sheet works across genres but may sacrifice type safety and user experience unless typed values and optional templates are provided. The accepted approach favours flexible player-defined fields with optional typing and validation; exact type catalogues, presets, reusable schemas and field inheritance remain refinement choices.

## Dependencies and constraints
- Depends on accepted [[Shared PC and NPC Character Entities]] (IDEA-0026) for stable identity and shared PC/NPC support.
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
- Which updates are manual, disabled or automatically proposed and validated? This is expressly for separately evaluated IDEA-0028.

## Draft acceptance criteria
- [ ] Both PCs and NPCs can have editable status sheets linked to their durable shared character identity.
- [ ] A player can create and modify arbitrary character fields for stats, conditions, identity, goals and current state.
- [ ] An adventure can use its own fields rather than being forced to use one fixed RPG character sheet.
- [ ] Where chosen, typed fields validate values according to defined types and constraints, without inventing defaults for unspecified fields.
- [ ] Sparse NPCs can omit optional status fields without requiring false or empty data values.
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
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Editable, customisable status sheets for PCs and NPCs; arbitrary fields for stats, conditions, identity, goals and current state; optional inclusion of current values in generation context; optional typed fields and validation; preservation of unknown values versus explicitly empty ones. Exact schema and automatic state-update rules remain for refinement and IDEA-0028. Moved to staging, not production.
