---
id: PRD-0027
type: prd
status: accepted
related:
- NOTE-0036
- PRD-0001
- NOTE-0007
- NOTE-0012
- NOTE-0016
---

# Shared PC and NPC Character Entities

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0026](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Shared%20PC%20and%20NPC%20Character%20Entities.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S10**. First milestone: **M5**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Goals

Use one universal character entity type with stable IDs; make PC/NPC control roles alter access, not identity. Playing As, presence and physical location are distinct. Derive state from accepted, grounded assertions; absent details are unknown rather than fabricated. Use supported typed entity operations first.

## Latest accepted event and narrative authority — 2026-10-28

**Current narrative-first character facts ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** A stable character ID and current location/holder/status are recorded by accepted **Set/Clear** assertions, not a mechanical move/transfer procedure that checks history. A character whose earlier introduction was removed can remain a **sparse identity** when later accepted narration still establishes them. Optional rules may guide attempted Do/Say actions; an accepted Story/Continue current-state fact must not be discarded solely for lacking a prior route or inventory prerequisite. Playing As remains a non-world-affecting perspective selection.


## Accepted direction
- **One universal character entity model (explicitly accepted):** Characters have **no PC versus NPC distinction**, no permanently player-controlled class, and **no Playable flag or role eligibility filter**. Every existing character in the adventure's Lorebook is a possible `Playing As` choice. Player interaction with a character is a temporary choice for Do/Say, not an intrinsic characteristic of the character.
- **Stable character IDs:** Every character has a durable identifier used to connect profile, inventory, equipment, anatomy, relationships, current location and other records, even when its name or details change.
- **Explicit optional `Playing As` actor selection (latest user refinement):** An adventure has **no mandatory or permanent protagonist**, but may save a **nullable, changeable selected character ID** in a Settings-sidebar `Playing As` selector populated from existing Lorebook character entities. **Do and Say use that selection as their player actor/speaker** and are disabled if it is unset. **Story and Continue always work without one** and may involve any grounded actor(s) or no actors. Switching the selected character never creates a new entity, changes their possessions/location, or rewrites history. This control's active Do/Say identity is conceptually separate from broader narrator perspective/viewpoint settings.
- **Consistent current state for every character:** Every character has the same supported **declarative state-assertion** vocabulary for location, item holder, equipment, status and relationships; optional gameplay rules may shape attempted actions, but final accepted facts are not mechanically vetoed. The player may take turns acting/speaking **as any character** without reclassifying the entity or moving its inventory.
- **Optional and lazily populated character details:** Minor characters can initially be represented by a stable ID and a few known properties. Other records and fields may be populated later as they become necessary without requiring full RPG sheets, equipment inventories or anatomy for every incidental character.
- **Unknown is not a default:** Missing or unrecorded character values must remain **unknown/not recorded** rather than silently treated as zero, empty, absent, healthy, unequipped or any other definite in-world state. Distinguish deliberately known empty values from unknown values.
- **Separate feature boundaries, with updated acceptance status:** Status sheets (IDEA-0027), automatic tracking (IDEA-0064), items (IDEA-0029), equipment (IDEA-0030), anatomy (IDEA-0031), location hierarchy (IDEA-0033) and presence (IDEA-0034) have **each been accepted separately in staging**. Their functionality was **not** approved merely through this universal character-model idea. Per-field tracking modes IDEA-0028 and optional mature-specific controls IDEA-0032 remain **unaccepted Inbox directions**.

## Dependencies and constraints
- Relates to accepted Entity-Based Lorebook (IDEA-0020), which should link durable character entities without confusing static lore with changing character state.
- Related accepted staging directions now include character sheets IDEA-0027 and automatic tracking IDEA-0064, items/equipment IDEA-0029/0030, anatomy IDEA-0031, and locations/presence IDEA-0033/0034. They were **approved independently**, not advanced by IDEA-0026 itself. Fine-grained tracking modes IDEA-0028 and mature-mode idea IDEA-0032 remain unaccepted.
- Character references must survive renames and subsequent enrichment. Deletions, merges, replacements or switching the controlled character require explicit integrity rules.
- Character detail can be incomplete. Downstream rules and narration must not invent deterministic values merely because an optional property is missing.
- A character can have a known-empty inventory/equipment/location value where genuinely established; this must not be conflated with missing information.
- Any generation-driven updates to character state must still obey separately accepted authoritative validation boundaries.

## Open questions
- How much character detail should be populated lazily, and what accepted prose or explicitly authored events should fill a new field?
- Which minimum fields are necessary to create a character entity, beyond stable ID and identification information?
- How are missing/unknown versus explicitly none, zero or empty represented in storage, APIs and interface controls?
- **User resolved Do/Say selection and post-creation behaviour:** Adventures may have zero/one/many characters; the **Settings sidebar** offers `Playing As` from actual Lorebook character entries plus an **Add Character → Lorebook manual entry** route. Creating and saving any number of characters **never implicitly sets or replaces `Playing As`**, and should **not automatically navigate away from the Lorebook**. The player explicitly chooses from the list when ready. A nullable selected ID persists as an adventure setting. **No Do/Say per-turn confirmation**; Story/Continue stay enabled. Other narrator focus/perspective UI remains for later refinement.
- How should character merge, deletion, duplicate detection, identity changes and references be handled?
- Where do profile text, appearance, relationships, inventory, anatomy, status and location records attach to the shared entity?
- When should fields be explicitly authored by the player versus inferred as a proposed AI change requiring validation?

## Supporting detail

See [NOTE-0036](../knowledge/inbox/NOTE-0036-prd-0027-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
