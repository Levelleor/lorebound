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
# Unified Character Entities (historical file: Shared PC and NPC Character Entities)

## Idea
Use one unified character model for every character in an adventure, with a nullable per-adventure `Playing As` reference for temporary player actions; **no permanent PC/NPC or Playable classification**.

## Why this idea matters
All characters can move, own items and change state.

## Accepted direction
- **One universal character entity model (explicitly accepted):** Characters have **no PC versus NPC distinction**, no permanently player-controlled class, and **no Playable flag or role eligibility filter**. Every existing character in the adventure's Lorebook is a possible `Playing As` choice. Player interaction with a character is a temporary choice for Do/Say, not an intrinsic characteristic of the character.
- **Stable character IDs:** Every character has a durable identifier used to connect profile, inventory, equipment, anatomy, relationships, current location and other records, even when its name or details change.
- **Explicit optional `Playing As` actor selection (latest user refinement):** An adventure has **no mandatory or permanent protagonist**, but may save a **nullable, changeable selected character ID** in a Settings-sidebar `Playing As` selector populated from existing Lorebook character entities. **Do and Say use that selection as their player actor/speaker** and are disabled if it is unset. **Story and Continue always work without one** and may involve any grounded actor(s) or no actors. Switching the selected character never creates a new entity, changes their possessions/location, or rewrites history. This control's active Do/Say identity is conceptually separate from broader narrator perspective/viewpoint settings.
- **Consistent mechanics for every character:** Every character can move, hold/transfer items, wear equipment, form relationships and change persistent state through the same systems, subject to game rules. The player may take turns acting/speaking **as any character** without reclassifying the entity or moving its inventory.
- **Optional and lazily populated character details:** Minor characters can initially be represented by a stable ID and a few known properties. Other records and fields may be populated later as they become necessary without requiring full RPG sheets, equipment inventories or anatomy for every incidental character.
- **Unknown is not a default:** Missing or unrecorded character values must remain **unknown/not recorded** rather than silently treated as zero, empty, absent, healthy, unequipped or any other definite in-world state. Distinguish deliberately known empty values from unknown values.
- **Separate feature boundaries:** The specific form and tracking policies for status sheets, inventory, equipment, anatomy and locations are separate candidates, not automatically accepted by this character-model decision.

## Proposed behaviour
Persist **all characters in one unclassified entity registry** keyed by immutable IDs, **but permit an adventure with no characters**. Save a **nullable per-adventure `Playing As` character ID** that references one of the actual Lorebook-backed character entities when selected. **Do/Say are disabled while that reference is unset**; Story/Continue and world events still work without a character. Changing `Playing As` assigns the player actor/speaker for subsequent Do/Say turns, not inventory, equipment, world-state or historical turns. Do **not** invent an unnamed protagonist or empty character sheet. Other narrative turns may refer to **zero, one or multiple actors** regardless of selection. Character detail can be progressively added in linked profile, inventory, equipment, anatomy, relationship, status and location records as known. Players and application/game events should be able to refer to any character consistently, even if initially little is known about a character. A missing value remains unknown, while an explicit empty/none value means the corresponding fact has actually been established. Avoid inferring unwritten details during context assembly.

## Alternatives and trade-offs
Separate permanent PC/NPC or Playable categories are now **explicitly out of scope**; they would add arbitrary restrictions on which characters can be played and complicate entity identity. Requiring equally complete records for everyone would add unnecessary generation and storage work. The accepted solution combines a **uniform identity/data model** with **optional or lazily filled details**. The precise typed record relationships, defaults for UI display and lazy-population policy still require refinement.

## No invented character details on initial extraction
- **Accepted IDEA-0006:** A successfully validated Quick Start opening can automatically register an explicitly named or otherwise clearly established character with a stable ID and **only details stated in the scene or already established in canon**. Do not manufacture an age, species, personality, appearance, motive, past experiences, statistics or private relationship just to fill a profile.
- A minimal character is sufficient. For example, "your old friend Marcus approaches" establishes a character and the stated old-friend relationship, **not** a detailed shared childhood history. "Marcus carries a bloodstained sword" does **not** establish Marcus as its owner or reveal whose blood it is.
- Interpreter-proposed initial character facts retain source provenance and must pass deterministic validation before the opening and world records commit atomically. Unknown properties stay unknown, not made-up defaults.

## One character kind; any Lorebook character may be played
- **Latest user-accepted refinement (2026-10-18):** There is **no conceptual player-character versus NPC split** in Lorebound. All characters are characters in the shared entity registry; the player can choose to speak or act as **any one of them** on a given series of Do/Say turns.
- The adventure Settings sidebar's **`Playing As` dropdown lists every actual character entity in the adventure's Lorebook**, with no role-based eligibility, `isNpc`, `isPlayerCharacter`, `Playable`, special ownership or first-character filter. The saved selection is merely a **nullable character-ID reference** determining the actor/speaker for upcoming Do/Say input; it **does not change the character's type, permissions, past, world state, relationships or possessions**.
- **No characters → no selection:** Story and Continue still work; Do and Say are disabled until the player explicitly selects a character. `Add Character` opens Lorebook manual entry; adding many characters never auto-selects one.
- Historical references to `PC`/`NPC` in this file's name and previous decisions are **legacy vocabulary**, not active entity categories. **Retain the filename** to preserve existing wiki links and review history; updated behavioural text supersedes those old distinctions.
- Precise dropdown ordering/search and any separate narration perspective UI remain to refine; do not add a Playable eligibility flag.

## Playing As is a scene cut, not character movement
- **User-confirmed refinement (2026-10-18):** When the player explicitly changes Settings `Playing As` from one Lorebook character to another, the **next Do or Say is narrated from the newly selected character's already established situation and current location**. This is a **cut between simultaneous/elsewhere character perspectives in the ongoing story**, not an in-world journey between those characters.
- Selecting Theo while Mara remains in the capital and Theo is in the forest means the next Do/Say follows Theo **in the forest**. Mara's position and state remain unchanged. No character is moved, transported, reclassified or placed alongside the previous actor. No automatic time lapse, travel event, graph edge or route-validation request is created **by selection alone**.
- The selected actor's inventory, status, whereabouts, knowledge and valid action constraints remain their **own existing records**. If a specific location is not established, preserve it as unknown; **never borrow the previous actor's scene or invent a destination** to render the cut.
- **Story and Continue stay actor-independent** and may narrate another established character, multiple characters or environmental/world events. The UI presentation of scene transitions is open; no mandatory confirmation or narrated journey is required.

## Switching Playing As cuts to the selected character's scene
When `Playing As` changes, the **next Do/Say follows the new character at their already established location and circumstances**, even if the previously played character is far away. Example: switching from Mara in the capital to Theo in the forest cuts to Theo **in the forest**, without transporting either character. Selection creates **no movement, travel route, elapsed journey/time, inventory transfer, world-state event or altered past**. The chosen character's own location, equipment, status and existing context are used; an unknown location remains unknown, never inherited from the previous character. Story/Continue stay independent; no switching confirmation or narrated journey is needed.

## Selected-character Info and Settings tabs
- **Accepted IDEA-0062 panel layout:** The character information panel has **Info** and **Settings** tabs. **Settings** includes the explicit adventure `Playing As` selector listing all Lorebook characters; **Info** presents the **currently selected character's existing inventory, tracked status and known current location**, using references to authoritative records. Switching the selected actor updates Info without moving characters, transferring items, modifying statuses or changing history.
- A new character added in Lorebook is not auto-selected and therefore must **not silently replace** the character displayed in Info. In a characterless story or when `Playing As` is unset, no phantom protagonist, inventory or fabricated status/location may be displayed. The exact Info empty-state UI is still for later refinement.
- All other Lorebook characters remain individually inspectable by opening the Lorebook via the **icon to the left of the story input field**. The selected actor's scene-cut behaviour and Do/Say gating are unchanged.

## Optional character names with labels distinct from identity
- **Accepted IDEA-0007 Option B (2026-10-18):** A character's immutable **stable ID** is the persistent identity. **Name is optional**, and unrecorded name means **unknown** rather than an explicit invented value. A character can be created or identified from limited story evidence without assigning an unsupported name, species, background or biography.
- **Display is not canonical identity:** Lorebook and Settings can present a descriptive label such as *The Hooded Stranger* (where warranted or user-supplied) or a neutral *Unnamed Character N* UI fallback. These are **display identifiers, not established personal names**. Use ID-based references internally to prevent rename/label changes from disconnecting status, item records, history, relationships, character selection or narration attribution.
- **Uncertain information stays uncertain:** An unverified reported name/alias must remain attributed as a claim or possibility; it is not confirmed canon solely for convenience. When evidence establishes the actual name, update the same character record without replacing its ID. Do not assume that two unnamed figures are identical merely because their labels look alike.
- **Universal selection unchanged:** All existing characters, including those with no known name, are eligible for explicit `Playing As` selection via **display labels tied to stable IDs**. No unnamed-character filter, automatic protagonist selection or change in Do/Say/Story/Continue rules.


## Dependencies and constraints
- Relates to accepted [[Entity-Based Lorebook]] (IDEA-0020), which should link durable character entities without confusing static lore with changing character state.
- The next separate candidates include status sheet fields and tracking (IDEA-0027, IDEA-0028), items and equipment (IDEA-0029, IDEA-0030), anatomy (IDEA-0031, IDEA-0032) and locations/presence (IDEA-0033, IDEA-0034). This approval does not advance any of those candidates.
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

## Draft acceptance criteria
- [ ] Character records may exist with an immutable stable ID and **unknown/absent name** and no mandatory other descriptive fields; no fabricated default identity facts are stored.
- [ ] The interface can distinguish unnamed characters with descriptive or neutral UI labels without treating those labels or unverified aliases as established names.
- [ ] A later established name updates the same entity and preserves attached world data, source history and any `Playing As` reference; unnamed entities remain eligible for selection.
- [ ] **Info** tab displays the selected character's known inventory, tracked status and location, where applicable; **Settings** tab contains `Playing As` selection from all Lorebook characters.
- [ ] Switching `Playing As` updates the information display but does not mutate any character record, item placement, location, event or past turn.
- [ ] Switching `Playing As` between two distant characters makes the next Do/Say follow the selected character at their **existing location**, without travel, teleportation, time passage, inventory transfer or a world-state event.
- [ ] After switching `Playing As` from Mara (capital) to Theo (forest), the next Do/Say follows Theo at his **established forest location**; neither character's location, possessions, status or event history changes merely due to selection.
- [ ] Switching `Playing As` produces **no travel event, elapsed travel time, new graph edge or automatic time passage**, and does not require actor/transition confirmation; real narrated movement remains subject to ordinary validation.
- [ ] If the new actor's location is unknown, the system does not inherit the old scene or fabricate a location; Story/Continue remain actor-independent.- [ ] **Every character** uses one common identity/schema with stable IDs, and **no PC/NPC kind, playable designation or permanent-control category** is required or used to filter selection.
- [ ] An adventure with **no characters and no `Playing As` selection** is valid and can use Story/Continue but **not Do/Say**. `Playing As` references only a valid existing Lorebook character ID for that adventure and can be changed/unset without modifying inventory/world state.
- [ ] All characters link to the same types of profile, inventory, equipment, anatomy, relationships, status and location records when those features become available, with no category-specific rules.
- [ ] A minor character may have incomplete optional details without requiring a fully populated sheet or attached unused records.
- [ ] Adding details later preserves the same durable character ID and existing relationships/references.
- [ ] Missing values remain unknown/not recorded and are not silently converted to asserted zero, empty or other in-world facts.
- [ ] Explicitly established empty values can be distinguished from unrecorded/missing fields.
- [ ] Switching or clearing character focus does not duplicate, delete or rewrite any character, item placement, equipment or world state.
- [ ] Do/Say use the selected character as player actor/speaker; Story/Continue can have **zero, one or multiple** grounded actors independent of `Playing As`. No per-turn Do/Say actor confirmation or fabricated protagonist is required.
- [ ] The Settings sidebar lists existing Lorebook characters and routes **Add Character** to manual Lorebook character creation; missing/deleted selection cannot refer to a nonexistent actor.
- [ ] **Creating or saving a Lorebook character never changes the selected `Playing As` ID or automatically returns to the story.** Several new characters can be created before the player selects one explicitly.
- [ ] Authoritative validation prevents proposed character state changes from becoming canonical without the required checks.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. The initially accepted shared PC/NPC architecture has been **superseded by the user's explicit choice of one unclassified character model** with no intrinsic playable/NPC distinction; stable identities and sparse details remain accepted.
- Staging means accepted for refinement, not production-approved or implemented.

## Decisions and review history
- 2026-10-18 — **Accepted IDEA-0007 unnamed-character refinement:** Name is optional/unknown; stable ID holds identity. Character labels and generic fallback are display-only, and claimed aliases remain uncertain. Later name revelation enriches the same entity; unnamed characters appear in `Playing As` by ID. No PC/NPC kinds or invented backstories. Staging only.
- 2026-10-18 — **User-accepted info/settings UI refinement:** Two-tab information panel, with **Info reflecting selected character's real inventory/status/location** and **Settings containing `Playing As`**. Lorebook has a direct icon at the left of the input field. Characterless stories and unselected actors do not receive invented display data. Staging only.
- 2026-10-18 — **User explicitly accepted:** Switching `Playing As` between distant characters is a **narrative cut**. The next Do/Say uses the newly chosen character's established scene/location, with no travel, teleportation, time passage, inventory/state transfer or extra confirmation. Story/Continue remain independent. Staging only.
- 2026-10-18 — **Explicit user acceptance of cross-character scene-cut semantics:** Changing `Playing As` is **only a narrative viewpoint/actor cut**; the **next Do/Say follows the selected character at their existing location and circumstances**, even when other characters are far away. No travel, teleportation, time passage, inventory/status transfer, special confirmation or history rewrite occurs by selecting a different character. Story/Continue remain freeform. Staging only.
- 2026-10-18 — **Explicit user-confirmed supersession of PC/NPC distinction:** There are **no PC or NPC categories and no Playable flag**. Every character is identical in kind and **selectable in `Playing As`**, because the player may temporarily take turns acting/speaking for any character. `Playing As` remains optional and selection is explicit, never automatic upon creation. Characterless stories continue with Story/Continue and no invented character. File name preserved for stable wiki references. Staging only, no implementation/promotion.
- 2026-10-18 — **Explicit latest refinement:** Adding one or multiple Lorebook characters is independent of `Playing As`. Saving a new character does **not automatically select it, replace an existing choice, or return to the story**; the player explicitly picks their character later. This supersedes the assistant's proposed auto-selection/return shortcut. Staging unchanged.
- 2026-10-18 — **Latest explicit user choice superseding ambiguous-actor clarification proposal:** A **nullable, per-adventure `Playing As` selection in the Settings sidebar** refers to an existing Lorebook character (chosen from a list; Add Character navigates to manual Lorebook entry). **Do and Say require that selection and use it as their actor/speaker**. Story/Continue need no selection. This refines earlier optional focus/multiple-character acceptance; no obligatory protagonist or global inventory. Staging only.
- 2026-10-18 — **Explicit user acceptance updating former single-PC-pointer interpretation:** Maintain one universal character entity model, but **no permanent or compulsory protagonist**. Permit zero or many playable characters over an adventure and optional/changeable focus, distinct from the actual actors of a turn. Characterless stories and non-character world events remain valid. Neither player identity nor inventories are stored as a fake default character. Staging only.
- 2026-10-17 — **Accepted IDEA-0006 minimal fact extraction dependency:** In supported Quick Start openings, register characters and relationships only where **explicitly grounded in accepted narration or player setup**. Preserve missing fields as unknown; don't populate invented biographies, traits, motives, equipment ownership or other unspoken lore. Atomic validated first-turn commit; staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** One shared character entity model for PCs and NPCs, stable character IDs, a separate pointer to the player-controlled character, common links to profile, inventory, equipment, anatomy, relationships and location, and optional/lazily populated NPC details. Preserve unknown values without inventing defaults. Moved to staging for refinement only, not production.
