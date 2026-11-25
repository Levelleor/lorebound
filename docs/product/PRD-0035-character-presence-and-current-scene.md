---
id: PRD-0035
type: prd
status: accepted
related:
- NOTE-0042
- PRD-0001
- NOTE-0016
- NOTE-0007
- NOTE-0013
---

# Character Presence and Current Scene

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0034](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Character%20Presence%20and%20Current%20Scene.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S10**. First milestone: **M5**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Latest approved narrative-first event semantics — 2026-10-28

Under [B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md), location and scene participation are **current narrative facts** represented by ordered `SetCharacterLocation`, `SetPresence` or `Clear` assertions. Derive one current physical place/transit condition per stable character identity; prior travel-route feasibility is **not** required for a place explicitly established by accepted narration or manual correction. A character mentioned in a story, remembered, discussed or reached remotely is **not automatically present**; only grounded accepted text asserts presence. Missing earlier introduction may result in a sparse stable character record with unknown details. Optional strict travel still guides provisional Do/Say attempts but never revises accepted story.


## Accepted direction
- **Persistent per-character location:** Track each character's actual current place as a reference to a stable location ID from Hierarchical World Locations (IDEA-0033), with stable character IDs from Shared PC and NPC Character Entities (IDEA-0026). Character location is authoritative mutable state, not inferred solely from a name appearing in prose.
- **Distinct presence categories:** Distinguish characters **physically present in the active scene**, known to be **elsewhere**, **in transit**, of **unknown location**, and **remotely participating** without being physically co-located. The exact storage representation for categories and movement-in-progress requires refinement.
- **Scene participation follows real presence:** Use established co-location as the basis for determining which characters are eligible to interact in person in the current scene. A Lorebook entry, recalled incident, narration reference, character mention or conversation about a character does **not** make that character physically present.
- **Remote participation does not imply travel:** A remote character may participate in communication when a suitable method is established (e.g., telephone, radio, magic or other setting-appropriate means). They remain at their actual location or in an unknown/in-transit state; remote speech does not silently move them into the scene. Exact communication permissions and media are not yet specified.
- **No mention-based teleportation:** A change in tracked location requires an accepted **grounded SetCharacterLocation** assertion or explicit player correction, not an incidental name mention. Accepted movement assertions do **not** require fictional proof of a prior traversable path.
- **Unknown stays unknown:** If a character's whereabouts are not recorded, do not default to the player's current room, assume absence from the story/world, or invent a location. A character known to be elsewhere should not be treated as present simply because the exact place isn't displayed.
- **Separate participation from knowledge:** Characters may be known to the player or relevant to lore without participating in a scene. A character can be a remote participant, nearby observer, or physically co-located character without those concepts collapsing into one undifferentiated list.
- **Context and UI coherence:** The active scene can identify physical participants and explicitly remote participants while preserving their source location references. Only relevant current presence/state should be included in narration context, subject to Token-Budgeted Context Builder and Inspector (IDEA-0024).
- **Refinement boundaries:** Detection of characters within large venues, proximity/line-of-sight, nearby conversations and remote communication mechanics are open. Exact thresholds and whether physical presence alone entails active participation are not preselected.
- **Travel rules remain a separate accepted feature:** Exact adjacency, traversal and route-permission rules belong to independently **accepted staging** Configurable Travel Graph Rules (IDEA-0035). Its optional movement modes are not automatically mandated by accepting physical presence tracking.

## Dependencies and constraints
- Depends on accepted Shared PC and NPC Character Entities (IDEA-0026) and Hierarchical World Locations (IDEA-0033) for persistent entity/location IDs.
- Related accepted Entity-Based Lorebook (IDEA-0020) supplies descriptive information but does not itself establish where a character is physically located now. Recalling a known character must not imply presence.
- Current scene and physical-location state should be consistent with accepted authoritative event validation and pipeline rules (Configurable Generation Pipeline Strategies, IDEA-0018).
- The accepted location hierarchy represents **containment**, not proof of traversability. Optional freeform/strict adjacency and route rules were **subsequently accepted independently in staging** under Configurable Travel Graph Rules (IDEA-0035), not as a side effect of this presence idea.
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
- [ ] A definite authored Story location-change can update the correct person's location even without an ordinary allowed route, with provenance and physical scene membership synchronised.
- [ ] Merely naming someone, switching Playing As or generating unsupported AI location claims cannot authoritatively teleport them, and other characters are not moved implicitly.
- [ ] Info reflects the currently selected character's known current location (including unknown/in-transit distinctions), rather than the prior character's location.
- [ ] Changing Info/Settings tabs or `Playing As` does not move a character or create an event.
- [ ] A switch between characters at distant locations cuts the next Do/Say to the newly selected actor's established scene, without mutating any character's location or presence.
- [ ] Each character can reference their current known location by stable location ID or represent transit/unknown state, with no PC/NPC category.
- [ ] The scene distinguishes characters physically present, known elsewhere, in transit, of unknown location and remotely participating.
- [ ] Characters described in lore, named in a conversation or retrieved as memories do not thereby enter the scene or change canonical location.
- [ ] In-person scene participation derives from known compatible physical presence rather than an arbitrary mention of the character.
- [ ] A character can communicate remotely when the relevant setting rules establish a channel without becoming physically co-located.
- [ ] Changes in character location follow accepted grounded location assertions, even if prior story movement/route setup is missing; unaccepted attempts and name mentions do not mutate state.
- [ ] Missing/unknown location data are preserved rather than defaulted to the current room or turned into an unsupported definite assertion.
- [ ] Current participant and location information can be selected for narration context with explicit handling of physically present versus remote participants.
- [ ] Location hierarchy and physical co-location do not automatically bypass separate travel-graph permissions.
- [ ] Exact proximity, awareness and remote-communication implementation details remain open for refinement.

## Supporting detail

See [NOTE-0042](../knowledge/inbox/NOTE-0042-prd-0035-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
