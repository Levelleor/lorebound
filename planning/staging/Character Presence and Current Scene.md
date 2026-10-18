---
id: "IDEA-0034"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Memory Lorebook and Context Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Character Presence and Current Scene

## Idea
Attach all characters to actual places and distinguish those physically present from distant known characters.

## Why this idea matters
A character may be mentioned in lore without materialising into the current scene.

## Accepted direction
- **Persistent per-character location:** Track each character's actual current place as a reference to a stable location ID from [[Hierarchical World Locations]] (IDEA-0033), with stable character IDs from [[Shared PC and NPC Character Entities]] (IDEA-0026). Character location is authoritative mutable state, not inferred solely from a name appearing in prose.
- **Distinct presence categories:** Distinguish characters **physically present in the active scene**, known to be **elsewhere**, **in transit**, of **unknown location**, and **remotely participating** without being physically co-located. The exact storage representation for categories and movement-in-progress requires refinement.
- **Scene participation follows real presence:** Use established co-location as the basis for determining which characters are eligible to interact in person in the current scene. A Lorebook entry, recalled incident, narration reference, character mention or conversation about a character does **not** make that character physically present.
- **Remote participation does not imply travel:** A remote character may participate in communication when a suitable method is established (e.g., telephone, radio, magic or other setting-appropriate means). They remain at their actual location or in an unknown/in-transit state; remote speech does not silently move them into the scene. Exact communication permissions and media are not yet specified.
- **No silent teleportation:** A change in canonical physical character location must arise from an accepted, validated movement or equivalent location-changing event, not incidental narration, a context entry or a character being named.
- **Unknown stays unknown:** If a character's whereabouts are not recorded, do not default to the player's current room, assume absence from the story/world, or invent a location. A character known to be elsewhere should not be treated as present simply because the exact place isn't displayed.
- **Separate participation from knowledge:** Characters may be known to the player or relevant to lore without participating in a scene. A character can be a remote participant, nearby observer, or physically co-located character without those concepts collapsing into one undifferentiated list.
- **Context and UI coherence:** The active scene can identify physical participants and explicitly remote participants while preserving their source location references. Only relevant current presence/state should be included in narration context, subject to [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024).
- **Refinement boundaries:** Detection of characters within large venues, proximity/line-of-sight, nearby conversations and remote communication mechanics are open. Exact thresholds and whether physical presence alone entails active participation are not preselected.
- **Travel rules remain independent:** Exact graph adjacency, traversal limitations and route permission rules belong to separately unaccepted [[Configurable Travel Graph Rules]] (IDEA-0035), not to this acceptance.

## Proposed behaviour
Maintain location and presence information for each durable character, linked to the current scene's actual location. When a validated event moves a character, update their canonical location or in-transit status without losing character identity. Derive a proposed in-person participant list from currently known co-located characters; retain separately known distant, transit and unknown characters, and permit an explicit remote-participant role only when the setting permits a remote communication channel. A named character in Lorebook or a spoken reference remains absent unless their presence or travel is actually established. Make these distinctions clear to the player and narration pipeline. Preserve unknown whereabouts rather than making default assumptions, and do not commit generated location changes before validation.

## Alternatives and trade-offs
Scene membership could be inferred solely from exact shared location IDs, or refined using spatial subdivisions, visibility, proximity and active interaction flags. Exact co-location is a simple starting point, but large venues and moving multi-room vehicles may require additional nuance. The accepted direction distinguishes **remote communication** from **physical presence**; whether magical or technological links exist and how their permissions work depends on later setting rules. Pure narrative mention-based appearance is not accepted, because it can accidentally teleport important characters. Maintaining separate location and active conversation/presence views may add bookkeeping but protects continuity.

## Source-grounded opening presence
- **Accepted IDEA-0006 initial tracking:** A generated Quick Start opening can establish character presence and current place **only when the scene explicitly states physical context or arrival and the event passes domain validation**. A character being named in dialogue, lore or rumours never implies current physical presence.
- Keep any unstated exact room, distance, travel path and character whereabouts **unknown**, rather than inferring co-location, teleportation or a route to complete a structured record. "Outside the village of Ashford" does not establish the character as inside Ashford, nor any specific street/building or travel edge.
- Link accepted presence facts to their opening text/revision and commit only with the corresponding canonical narrative turn. Unconfirmed/generated previews do not mutate presence.

## Protagonist-optional scene and actor separation
- **Accepted IDEA-0007/0026 refinement:** A scene may contain **no characters**, and an adventure may have **no character designated as the player's protagonist**. Existing presence/location tracking applies to whatever characters are actually established; it must not create a dummy participant or assume someone is physically present just because the player can narrate the scene.
- A narrative **focus** (if selected) is distinct from physical presence and the **acting character(s) for a turn**. Switching focus between multiple characters must not teleport them, imply co-location or change their possessions; events with zero actors can still update locations, environment or other validated world facts.
- Where actor/presence is unknown, preserve uncertainty rather than assuming the focused character was present or performed the action. Exact multiperspective UI remains open.

## Player control is unrelated to physical presence
- **Accepted IDEA-0026:** All characters are one kind, any of them may be selected in Settings `Playing As`, and there is no PC/NPC or Playable distinction. Selection changes who speaks/acts in subsequent Do/Say input, **not** where that character is located or who physically participates in the current scene.
- Characterless scenes remain valid; co-location, travel and interaction restrictions still follow validated world state and not temporary selection.

## Selected-character scene cuts do not change presence
The **next Do/Say after a `Playing As` switch** follows the selected character **at their existing canonical location**, even when the former actor is elsewhere. This is a scene/viewpoint cut, not travel or teleportation: **no movement event, new route, elapsed journey/time, change of physical presence or co-location** is caused merely by changing selection. A real move on a later Do/Say still requires standard validation. Unknown whereabouts remain unknown, not silently copied from the previously followed actor. `Story` and `Continue` can follow another subject or world events.

## Selected character location in the Info tab
- **Explicit IDEA-0062 presentation acceptance:** The shared information panel has **Info/Settings tabs**. **Info** displays the selected `Playing As` character's **established current location and known relevant state** where tracking is enabled, alongside their inventory and status from related systems. **Settings** holds the selector; Lorebook is reached directly through the icon left of the input field.
- As the player switches `Playing As`, Info follows **the newly chosen character's known location**, consistent with the accepted scene-cut rule. It does not relocate either character or reinterpret the current scene. Unknown/in-transit/elsewhere statuses remain truthful instead of inheriting the previous actor's location. With no selected character, no protagonist or location is fabricated.
- Presenting a location is not a navigation/travel command and cannot bypass normal movement validation.

## Dependencies and constraints
- Depends on accepted [[Shared PC and NPC Character Entities]] (IDEA-0026) and [[Hierarchical World Locations]] (IDEA-0033) for persistent entity/location IDs.
- Related accepted [[Entity-Based Lorebook]] (IDEA-0020) supplies descriptive information but does not itself establish where a character is physically located now. Recalling a known character must not imply presence.
- Current scene and physical-location state should be consistent with accepted authoritative event validation and pipeline rules ([[Configurable Generation Pipeline Strategies]], IDEA-0018).
- The accepted location hierarchy represents **containment**, not proof that two spaces are directly traversable. Strict adjacency and route rules are independently proposed in [[Configurable Travel Graph Rules]] (IDEA-0035), still unaccepted.
- Presence cannot be invented due to named references in narrative, summaries, memories, Lorebook retrieval or model prompt context. In-person participation requires a physically consistent location/event basis.
- A remote conversation or contact channel must not mutate physical location or count as co-location.
- Unknown locations, missing attendance facts and in-transit states must remain meaningfully distinct where represented; no silent default to the current scene.
- If an event is rejected or a generation fails, location and participant state must not reflect its speculative movement.
- Proximity in large spaces, hearing range, line of sight, remote communication channel validation, travelling within moving locations and specific presence thresholds are not finalised.

## Open questions
- How are large venues and nearby-but-not-co-located characters handled?
- When does being physically co-located make a character an active scene participant versus merely a present bystander?
- How are characters on the boundary of nested locations or in mobile/vehicle interiors represented?
- How should transit be represented when a journey spans multiple story turns or the precise route is unknown?
- What UI distinguishes known elsewhere, whereabouts unknown, in transit, physically present and remotely participating?
- How should remote communication work, including magical or technological channels, interruptions and requirements, without creating a second physical location?
- When do hearing, visibility and reachability matter independently of co-location?
- How should manual corrections, undo or historical changes update the current participant and location lists?
- When should current physical or remote participants be included in model context, and how should omitted/uncertain presence be shown?
- How can scene-change and travel events update multiple party members without inadvertently moving absent characters?

## Draft acceptance criteria
- [ ] Info reflects the currently selected character's known current location (including unknown/in-transit distinctions), rather than the prior character's location.
- [ ] Changing Info/Settings tabs or `Playing As` does not move a character or create an event.
- [ ] A switch between characters at distant locations cuts the next Do/Say to the newly selected actor's established scene, without mutating any character's location or presence.
- [ ] Each character can reference their current known location by stable location ID or represent transit/unknown state, with no PC/NPC category.
- [ ] The scene distinguishes characters physically present, known elsewhere, in transit, of unknown location and remotely participating.
- [ ] Characters described in lore, named in a conversation or retrieved as memories do not thereby enter the scene or change canonical location.
- [ ] In-person scene participation derives from known compatible physical presence rather than an arbitrary mention of the character.
- [ ] A character can communicate remotely when the relevant setting rules establish a channel without becoming physically co-located.
- [ ] Changes in character location require accepted valid movement/location events; rejected or provisional generated events do not silently teleport or move characters.
- [ ] Missing/unknown location data are preserved rather than defaulted to the current room or turned into an unsupported definite assertion.
- [ ] Current participant and location information can be selected for narration context with explicit handling of physically present versus remote participants.
- [ ] Location hierarchy and physical co-location do not automatically bypass separate travel-graph permissions.
- [ ] Exact proximity, awareness and remote-communication implementation details remain open for refinement.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Originally user-requested direction, explicitly accepted for staging with separate physical, remote, transit, elsewhere and unknown presence distinctions.
- This note represents an **accepted but unrefined staging direction**, not production approval or implemented feature evidence.

## Decisions and review history
- 2026-10-18 — **Accepted Info/Settings panel dependency:** Info shows the explicit `Playing As` character's established current location, while Settings contains the actor selector. Lorebook opens from the icon left of the input field. Changing selection is only a viewpoint/display cut, not travel. Staging only.
- 2026-10-18 — **User explicitly accepted:** Switching `Playing As` between distant characters is a **narrative cut**. The next Do/Say uses the newly chosen character's established scene/location, with no travel, teleportation, time passage, inventory/state transfer or extra confirmation. Story/Continue remain independent. Staging only.
- 2026-10-18 — **Accepted character-unification dependency:** All Lorebook characters are eligible for `Playing As`, without PC/NPC or Playable distinction. Changing selection does not teleport characters or alter scene presence. Staging only.
- 2026-10-18 — **Accepted IDEA-0007/0026 multi-protagonist/characterless rule:** Scene and character-presence systems work with zero characters and no default protagonist. Narrative focus, per-turn actors and actual physical presence remain separate; changing focus never teleports characters or moves their items. Staging only.
- 2026-10-17 — **Accepted IDEA-0006 source-grounding dependency:** Initial presence/location extraction may store only **explicitly stated, validated** facts in the generated opening; do not invent an unstated room, route, character arrival or physical co-location. Unspecified whereabouts remain unknown and source provenance is retained. Staging only.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Persistent character location and current-scene presence linked to stable character and location IDs; distinct physical presence, elsewhere, in-transit, unknown and remote participation; in-person participation grounded in actual location rather than mere mentions; no silent teleportation. Large-space proximity, communication mechanics and detailed presence rules remain for refinement. Moved to staging, not production.
