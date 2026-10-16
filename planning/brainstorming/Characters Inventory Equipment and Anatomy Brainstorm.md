---
type: brainstorm
status: active
mode: autonomous
topic: "Characters, ownership, equipment, anatomy and mature story options"
goal: "Capture shared PC/NPC state and optional physical inventory systems."
created: 2026-10-16
updated: 2026-10-16
sources: []
outputs: []
tags:
  - planning/brainstorm
  - planning/characters
---
# Characters Inventory Equipment and Anatomy Brainstorm

## Goal
Capture shared PC/NPC state and optional physical inventory systems.

## Context
- Retrospective record of the discussion on 2026-10-16, not implemented functionality or an approved production specification.
- [[Lorebound Vision Brainstorm]] contains the overview. User directions and AI suggestions are distinguished below.


## Character model
**User direction:** all characters, including NPCs and player, get the same core character state. Adventure references the controlled character ID, but player/NPC are not different schema types.
- Basic identity, name, aliases, personality, background, appearance, affiliations, relationships, location, goals, conditions, custom attributes and links to Lorebook.
- Physical/mental health, exhaustion, mana/stamina, rank/level etc. are configurable fields, not mandatory RPG mechanics.
- Auto/manual/disabled state tracking per module; explicit manual editing always possible.
- State tracking runs as validated proposals, not unconstrained AI overwrites. AI can update NPC equipment and transfer inventory between entities.
- Differentiate relatively stable **biography/lore** from changeable **current state** while referencing both from one character ID.

## Ownership and inventory
- An **item** has persistent ID, description, attributes, weight/size where enabled, conditions, and optionally custom lore or magical properties.
- Ownership/possession, container membership, equipped placement and world placement must not be conflated. Item can be in bag, chest, NPC inventory, ground, worn/equipped.
- Transfers should be represented by one atomic ownership/location change, not duplicate item copies.
- Optional capacity/encumbrance plugin validates weight, volume, slots, or bulk.
- Tool calls can propose spawn, pickup, transfer, drop, equip, unequip, destroy, repair, trade, place in container, etc.
- Failure reason is returned to narrator/coordinator; false pickup/transfer should not be committed.

## Equipment sheet
- Every character has optional equipment sheet with body slots and textual equipment labels/descriptions.
- Visual concept: simple silhouette/body-part diagram; click head/torso/arms/hands/waist/legs/feet/accessories and inspect editable text. The game remains primarily text based; placeholder anatomy images can be introduced later.
- Custom slots, left/right differentiation, layering, prosthetics, occupancy constraints (e.g. two-handed sword), broken/missing equipment, independent toggles.
- Equipped items and carried inventory are different states.
- Map anatomy/capability to slot availability: a missing hand may invalidate a hand slot; a suitable prosthetic can restore it.

## Anatomy state and mature profiles
**User direction:** track actual body parts; support anatomical transformations, changed gender-related details, dismemberment, prosthetics and optional reproductive organs for mature scenarios.
- Configurable species/body schema supporting humanoid and fantastical anatomy; individual parts have presence, condition, injuries, modifications and relationships.
- Gender identity, physical sex characteristics, body structure and reproductive anatomy are distinct attributes. One does not automatically overwrite others.
- General anatomy, injury and transformations are useful outside mature content and should have their own toggle.
- **Mature story (18+)** setting can enable a detailed optional reproductive anatomy extension; keep it off by default and exclude disabled fields from auto tracking and context.
- Exact mature/NSFW labelling, content boundaries and per-story migration when switching toggle are open.
- State changes are validated and event-sourced; multiple characters can be changed in one narrative event, subject to module constraints.
- Character sheet is also AI memory: compact current status can be fed into context independently from long-term biographies.

## Example structures (illustrative, not decided)
~~~ts
interface Character {
  id: string;
  name: string;
  loreEntryId?: string;
  currentLocationId?: string;
  identity: Record<string, unknown>;
  anatomy: AnatomyState;
  attributes: Record<string, unknown>;
  conditions: Condition[];
  inventoryId: string;
  equipmentId: string;
  customFields: Record<string, unknown>;
}
~~~

## Failure modes
- An NPC incorrectly materialises in the current location, gives an item they do not own, or re-equips an item they already transferred.
- Narrator announces a physical transformation but interpreter omits its tracked changes.
- Manual item correction conflicts with earlier AI extraction.
- Removing a body part must affect dependent equipment slots without deleting the item silently.
- An item or character can have unknown whereabouts without being assigned an invented location.


## Session Log
- 2026-10-16 — **User idea:** Optional always-current character sheet with live equipment placement; text-first body-slot illustration.
- 2026-10-16 — **User direction:** Every NPC needs the same profile, inventory and equipment as the player; items can transfer between characters.
- 2026-10-16 — **User idea:** Store body parts including reproductive anatomy in optionally mature-rated stories, transformations and missing limbs.
- 2026-10-16 — **AI possibility:** Share entity schemas, keep anatomy and equipment separately configurable, enforce ownership and slot compatibility.

## Current Threads
- Define flexible anatomy schema and body-slot linkage.
- Clarify all item possession states and how containers/ownership work.
- Choose default fields, editable UI and automated tracking toggle defaults.
- Decide what mature-mode switching does to previously stored anatomy data.

## Decisions
- User expressly requested shared character state for NPCs and player.
- User expressly requested optional anatomy/reproductive details and an editable equipment display.
- Details of rigid gameplay rules and maturity labels remain open.

## Outputs
- None. Nothing promoted to staging or production.

## Resume Here
Prototype two NPCs trading an equipped weapon while the player is in another location, and a transformation that changes available equipment slots.
