---
id: PRD-0028
type: prd
status: accepted
related:
- NOTE-0037
- PRD-0001
- NOTE-0007
- NOTE-0013
---

# Customisable Character Status Sheets

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0027](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Customisable%20Character%20Status%20Sheets.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S10**. First milestone: **M5**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Later accepted narrative-first world-memory rule — 2026-10-28

**Updated semantics ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Typed status fields are **current narrative assertions** with last-set/clear semantics. A status may be set from accepted story or manual correction without proving a prior game mechanic inflicted it. Unknown/unset remains distinct from zero/none; do not auto-complete unspecified fields. Manual edits require the approved pending-Commit overlay and atomic replayable assertions; no automatic permission or state-precondition veto for final accepted facts.


## Accepted direction
- **Editable, customisable status sheets for every character:** Every character uses the same optional status data linked to a stable, unclassified character entity (Shared PC and NPC Character Entities, IDEA-0026). There is **no PC/NPC or Playable kind**, and no requirement to populate every character's sheet.
- **Arbitrary player-defined fields:** Support custom fields covering stats, conditions, identity details, goals and mutable current character status rather than imposing a fixed RPG-only sheet.
- **Flexible applicability:** Different adventures or characters may need different categories and field sets. A simple conversational adventure must not be forced to track numerical health, mana or other irrelevant attributes.
- **Optional typed fields and validation:** Allow a future schema to distinguish relevant value types (for example numbers, text, booleans, options, references or other structured fields) and apply suitable validation. Exactly which types, constraints and templates are supported remains open for refinement.
- **Player editability:** Players can inspect and change current status-sheet values in a clear interface, with updates respecting the authoritative game-state model rather than rewriting prose or stale Lorebook descriptions.
- **Unknown is not empty:** Unrecorded/missing values must remain unknown, not automatically zero, false, empty, healthy, uninjured or another asserted state; explicitly recorded empty/none values are distinguishable from missing data.
- **Optional context inclusion:** Expose selection controls so relevant *current* status values may be included in generation context through Token-Budgeted Context Builder and Inspector (IDEA-0024); the context inspector should show requested, selected and transmitted material. Do not blindly include every possible custom field.
- **Acceptance history and later resolution:** This idea originally approved the **editable sheet model only**, not automatic status mutation. Later accepted Automatic Character Sheet Tracking (IDEA-0064) explicitly authorises **validated automatic tracking of all applicable defined fields** alongside manual editing; it supersedes the earlier unresolved automatic-update question. Player-confirmed valid manual corrections are authoritative historical state changes, and automatic tracking must subsequently use current committed values rather than stale inferred data. Fine-grained Disabled/Manual Only/Automatic modes in Character State Tracking Modes (IDEA-0028) remain **unaccepted**.

## Dependencies and constraints
- Depends on accepted Shared PC and NPC Character Entities (IDEA-0026) for stable identity and one unclassified character type.
- Coordinates with accepted Entity-Based Lorebook (IDEA-0020) to avoid conflicting copies of current status in persistent lore.
- For model-context inclusion, honour player selection and size/priority rules in accepted Token-Budgeted Context Builder and Inspector (IDEA-0024).
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

## Supporting detail

See [NOTE-0037](../knowledge/inbox/NOTE-0037-prd-0028-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
