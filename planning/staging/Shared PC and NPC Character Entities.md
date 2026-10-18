---
id: "IDEA-0026"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Lorebound Vision Brainstorm]]", "[[World Map and Location Rules Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Shared PC and NPC Character Entities

## Idea
Use one character schema for protagonists and NPCs, with a pointer to the player-controlled character.

## Why this idea matters
All characters can move, own items and change state.

## Accepted direction
- **One shared character entity model:** Player characters (PCs) and non-player characters (NPCs) use the same fundamental character schema and data relationships. Being player-controlled is not a separate incompatible entity type.
- **Stable character IDs:** Every character has a durable identifier used to connect profile, inventory, equipment, anatomy, relationships, current location and other records, even when its name or details change.
- **Optional, changeable character focus (explicitly accepted):** There is **no mandatory single player-controlled character**. A story may contain **zero, one or many** characters through whom the player acts. If a focus/reference is stored, it is **nullable and changeable**, independent of character identity and of the actual actor(s) in a turn; a focus change must not duplicate a character, alter world facts or transfer possessions. The player can instead use story-wide narration with **no focus**.
- **Consistent shared mechanics regardless of playability:** Every existing character can move, hold/transfer items, wear equipment, form relationships and change persistent state through the same underlying systems, subject to game rules. A player may act through a different character without reassigning their inventory or changing persistent character type.
- **Optional and lazily populated character details:** Minor NPCs can initially be represented by a stable ID and a few known properties. Other records and fields may be populated later as they become necessary without requiring full RPG sheets, equipment inventories or anatomy for every incidental character.
- **Unknown is not a default:** Missing or unrecorded character values must remain **unknown/not recorded** rather than silently treated as zero, empty, absent, healthy, unequipped or any other definite in-world state. Distinguish deliberately known empty values from unknown values.
- **Separate feature boundaries:** The specific form and tracking policies for status sheets, inventory, equipment, anatomy and locations are separate candidates, not automatically accepted by this character-model decision.

## Proposed behaviour
Persist characters in a shared entity registry keyed by immutable IDs, **but permit an adventure with no characters**. If a character is currently in focus, store/reference its existing entity identity; otherwise keep focus **unset**. Do **not** invent an unnamed protagonist or an empty character sheet merely to make the model valid. A given turn may refer to **zero, one or multiple acting characters**, independently of focus. Character detail can be progressively added in linked profile, inventory, equipment, anatomy, relationship, status and location records as known. Players and application/game events should be able to refer to any character consistently, even if initially little is known about an NPC. A missing value remains unknown, while an explicit empty/none value means the corresponding fact has actually been established. Avoid inferring unwritten details during context assembly.

## Alternatives and trade-offs
Separate PC and NPC schemas might simplify highly specialised UI but make interaction, inventory transfer and identity preservation more brittle. Requiring equally complete records for everyone would add unnecessary generation and storage work. The accepted solution combines a **uniform identity/data model** with **optional or lazily filled details**. The precise typed record relationships, defaults for UI display and lazy-population policy still require refinement.

## No invented NPC details on initial extraction
- **Accepted IDEA-0006:** A successfully validated Quick Start opening can automatically register an explicitly named or otherwise clearly established NPC with a stable ID and **only details stated in the scene or already established in canon**. Do not manufacture an age, species, personality, appearance, motive, past experiences, statistics or private relationship just to fill a profile.
- A minimal character is sufficient. For example, "your old friend Marcus approaches" establishes a character and the stated old-friend relationship, **not** a detailed shared childhood history. "Marcus carries a bloodstained sword" does **not** establish Marcus as its owner or reveal whose blood it is.
- Interpreter-proposed initial character facts retain source provenance and must pass deterministic validation before the opening and world records commit atomically. Unknown properties stay unknown, not made-up defaults.

## Dependencies and constraints
- Relates to accepted [[Entity-Based Lorebook]] (IDEA-0020), which should link durable character entities without confusing static lore with changing character state.
- The next separate candidates include status sheet fields and tracking (IDEA-0027, IDEA-0028), items and equipment (IDEA-0029, IDEA-0030), anatomy (IDEA-0031, IDEA-0032) and locations/presence (IDEA-0033, IDEA-0034). This approval does not advance any of those candidates.
- Character references must survive renames and subsequent enrichment. Deletions, merges, replacements or switching the controlled character require explicit integrity rules.
- Character detail can be incomplete. Downstream rules and narration must not invent deterministic values merely because an optional property is missing.
- A character can have a known-empty inventory/equipment/location value where genuinely established; this must not be conflated with missing information.
- Any generation-driven updates to character state must still obey separately accepted authoritative validation boundaries.

## Open questions
- How much NPC detail should be populated lazily, and what prompts or events should cause a new field to be filled?
- Which minimum fields are necessary to create a character entity, beyond stable ID and identification information?
- How are missing/unknown versus explicitly none, zero or empty represented in storage, APIs and interface controls?
- **Resolved in principle:** An adventure may have **zero, one or multiple playable characters**, with focus changing or unset. Exact UI and focus persistence, plus per-turn actor attribution in ambiguous narration, remain for refinement.
- How should character merge, deletion, duplicate detection, identity changes and references be handled?
- Where do profile text, appearance, relationships, inventory, anatomy, status and location records attach to the shared entity?
- When should fields be explicitly authored by the player versus inferred as a proposed AI change requiring validation?

## Draft acceptance criteria
- [ ] Both player characters and NPCs can be stored and referenced through one common entity identity/schema with stable IDs.
- [ ] An adventure with **no characters and no active focus** is valid. Where a focus exists, it references an established character and can change/unset without duplicating entities or modifying inventory/world state.
- [ ] PCs and NPCs can link to the same kinds of profile, inventory, equipment, anatomy, relationships, status and location records when those features become available.
- [ ] A minor NPC may have incomplete optional details without requiring a fully populated character sheet or unused attached records.
- [ ] Adding details later preserves the same durable character ID and existing relationships/references.
- [ ] Missing values remain unknown/not recorded and are not silently converted to asserted zero, empty or other in-world facts.
- [ ] Explicitly established empty values can be distinguished from unrecorded/missing fields.
- [ ] Switching or clearing character focus does not duplicate, delete or rewrite any character, item placement, equipment or world state.
- [ ] Individual story turns can have **zero, one or multiple actual actors** independent of optional focus; characterless events and world changes do not require a made-up character.
- [ ] Authoritative validation prevents proposed character state changes from becoming canonical without the required checks.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-requested direction, expressly accepted for staging with stable character identities and optional lazily populated NPC details.
- Staging means accepted for refinement, not production-approved or implemented.

## Decisions and review history
- 2026-10-18 — **Explicit user acceptance updating former single-PC-pointer interpretation:** Maintain one universal character entity model, but **no permanent or compulsory protagonist**. Permit zero or many playable characters over an adventure and optional/changeable focus, distinct from the actual actors of a turn. Characterless stories and non-character world events remain valid. Neither player identity nor inventories are stored as a fake default character. Staging only.
- 2026-10-17 — **Accepted IDEA-0006 minimal fact extraction dependency:** In supported Quick Start openings, register characters and relationships only where **explicitly grounded in accepted narration or player setup**. Preserve missing fields as unknown; don't populate invented biographies, traits, motives, equipment ownership or other unspoken lore. Atomic validated first-turn commit; staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** One shared character entity model for PCs and NPCs, stable character IDs, a separate pointer to the player-controlled character, common links to profile, inventory, equipment, anatomy, relationships and location, and optional/lazily populated NPC details. Preserve unknown values without inventing defaults. Moved to staging for refinement only, not production.
