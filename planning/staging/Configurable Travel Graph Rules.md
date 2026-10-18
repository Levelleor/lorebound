---
id: "IDEA-0035"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Configurable Travel Graph Rules

## Idea
Allow strict movement rules requiring valid connections between locations.

## Why this idea matters
Prevents AI teleportation when the world is meant to be spatially constrained.

## Accepted direction
- **Configurable travel-graph rules:** Let an adventure select how strictly travel between locations is constrained by explicit route connections, instead of enforcing a single travel policy for every story.
- **Three supported policy directions:** Provide **freeform travel**, **strict adjacent-only movement**, and **valid multi-hop routing**. Exact UI, defaults, and edge-case policies remain for refinement.
- **Separate graph from containment:** Location parent/child hierarchy from [[Hierarchical World Locations]] (IDEA-0033) describes where locations reside. Travel connections represent **possible traversal** and must not be inferred automatically from shared parents or common ancestors.
- **Strict mode validation:** When a strict policy is active, a proposed location change must satisfy the applicable route/adjacency and movement restrictions before becoming authoritative. Inaccessible destinations cannot be reached merely by narrator prose, a player request, or an unsupported AI-proposed event.
- **Adjacent-only movement:** A strict option may require each validated movement to cross only a directly available graph edge rather than skipping intermediate places in one turn.
- **Multi-hop legal routing:** Another strict option allows travel across multiple connected places when a valid permitted path exists; actual route resolution, elapsed time, narrative treatment and intermediate event handling remain open.
- **Optional conditional connections:** Route edges may carry access conditions such as locked doors, keys, permissions, blocked passages or other setting-specific constraints. An adventure may also impose optional movement granularity, for example a one-hop-per-turn limit.
- **Coherent character presence:** Movement events update persistent character position/state under [[Character Presence and Current Scene]] (IDEA-0034) only if their outcome is accepted and validated; rejected movements do not silently teleport characters into a new scene.
- **Narrative obstacles stay visible:** If travel is blocked under strict rules, the generation pipeline should preserve canonical location and give the player an understandable indication of the obstacle rather than inventing a bypass or silently altering the travel graph.
- **Freeform does not mean state corruption:** The freeform policy relaxes adjacency restrictions for narrative movement but still requires coherent location identities, accepted state transitions and validation appropriate to the selected adventure. It is not license for unvalidated world-state mutations.
- **Deliberate open decisions:** Do **not** preselect the default travel mode, exact graph-edge schema, permission/key evaluator, vague-destination resolution, travel-time model, or mandatory travel limits without further refinement.

## Proposed behaviour
Maintain travel connections between durable location IDs separately from parent/child nesting. Offer a configurable per-adventure travel validation policy. For strict adjacent-only movement, require a traversable direct edge for each accepted location transition. For valid multi-hop travel, resolve a permitted sequence of traversable edges, checking any enabled conditions before committing the destination and appropriate intermediate outcomes. For freeform travel, permit narrative movement without requiring an existing graph path while still preserving consistent, validated character/location state. Treat a conditional edge such as a locked door or restricted passage as unavailable until its established access conditions are satisfied. Make blocked or ambiguous moves explicit rather than pretending they succeeded.

## Alternatives and trade-offs
All three travel policy directions are **accepted as configurable alternatives**, with no chosen universal default. Freeform movement permits lightweight storytelling but provides weaker spatial constraints. Strict adjacent-only mode gives tight turn-by-turn geography at the cost of potentially cumbersome traversal. Valid multi-hop routing makes longer journeys convenient while preserving known connections, but demands more pathfinding, conditional-edge validation and explicit rules for the time or consequences between intermediate locations. One-hop restrictions, access rules and path narration are optional refinements rather than mandatory simulation mechanics.

## Narrative character cuts are not travel
- **Latest accepted IDEA-0026/0034 integration:** Switching Settings `Playing As` among Lorebook characters who occupy different places is **not a character movement operation**. The next Do/Say simply follows the selected actor **where they already are**. **Do not require a travel edge, route, elapsed journey or travel-policy check** merely to switch whose actions the player supplies.
- Existing freeform/strict travel rules **still apply** if that actor's subsequent Do/Say action attempts real movement; this is **not an exception permitting in-world teleportation**. Switching cannot create secret connections, relocate characters or merge their scenes. Characterless Story/Continue still work.


## Playing As scene cut is not travel
- **Accepted:** Changing `Playing As` between characters at different established locations is a narrative cut, not a movement event. The next Do/Say follows the selected character where they already are. No travel graph edge, journey time, route validation or teleportation is needed for the switch itself, including under strict travel rules. A subsequent actual movement action still undergoes the normal configured travel-policy validation.

## Player-authored Story can establish travel exceptions under strict policies
- **Explicit accepted IDEA-0002 Option B (2026-10-18):** Even when the adventure enables **strict adjacent-only** or **multi-hop permitted-path** travel, a player can use **Story mode** to directly assert an extraordinary outcome, e.g. that a character **instantaneously appears on the far side of the kingdom**. Treat this as the player's **authorial location-change event**, not a graph-traversal *attempt*, so no invented connection, path, key, permission, elapsed travel time or spell is required merely to satisfy normal path restrictions.
- **Existing gameplay restrictions preserved:** Actual attempted travel in **Do/Say** and unsolicited narration in **Continue/AI** are still constrained by the selected policy; choosing Story is the explicit authorial permission, not a setting change to make all future travel freeform. Subsequent ordinary movement uses the updated character location and still follows strict routing rules.
- **Location/history safety:** Resolve correct existing character and destination identities or create genuinely stated entities only through accepted validated entity-creation rules. Update relevant character presence/location coherently with stable IDs, event provenance and atomic revisions; do not teleport companions or duplicate items just to reconcile the story. Unknown destinations or ambiguous subjects remain unresolved until safely clarified, rather than guessed. This does not change the configured graph or its edges without explicit player-authored facts.

## Dependencies and constraints
- Requires stable location IDs and a containment hierarchy from accepted [[Hierarchical World Locations]] (IDEA-0033), while preserving the distinction between hierarchy and route edges.
- Validated travel should update accepted [[Character Presence and Current Scene]] (IDEA-0034) state and avoid automatically relocating remote or absent NPCs.
- All travel proposals and world-state events must respect accepted deterministic validation and failure-handling principles from [[Configurable Generation Pipeline Strategies]] (IDEA-0018).
- The existence of a parent, sibling or ancestor relation is never alone proof of a traversable graph connection under a strict policy.
- Optional edge restrictions should be applied to the current authoritative status of doors, permissions, keys or routes; speculative narration cannot independently unlock access or invent a connection.
- In strict modes, failed, rejected or unresolvable travel requests must not change the character's canonical destination or silently create routes to justify movement.
- Freeform policy can relax graph constraints without bypassing the separate persistence and validation requirements for changes to canonical location.
- AI-driven creation of new places and connections is a separate, still-unaccepted proposal: [[AI World Discovery and Expansion]] (IDEA-0036). Mutable environmental restrictions such as destroyed bridges and locked doors may intersect with IDEA-0038, also separately unaccepted.
- Movement granularity, travel time, connection directionality, route conditions and default policy remain open rather than preselected.

## Open questions
- How should vague actions like "visit the king" resolve to stable location IDs while respecting ambiguous targets and actual character presence?
- Which policy should be the starting default for a new adventure, and can policy change safely mid-story?
- What graph-edge attributes are needed: directionality, connection type, cost/distance, access requirements and current availability?
- In strict adjacent-only mode, can a nonmovement action take place in the same turn, and how is one-hop-per-turn enforced?
- In legal multi-hop mode, must intermediate stops be represented as events, elapsed time or scene changes?
- How should secret paths, temporarily blocked routes, moving vehicles, teleportation abilities and other exceptional traversal be validated?
- If a route exists but a door is locked, how is that result communicated to the player and narrator without mutating world state?
- When and how can a player manually add or correct travel edges, especially if AI narration previously invented one?
- What are the rules for turning strict navigation on after a history written in freeform mode?
- What prevents allowed multi-hop movement from implicitly moving unaccompanied NPCs or duplicated world items?

## Draft acceptance criteria
- [ ] Under strict adjacent-only travel, an unambiguous Story-authored instant relocation updates the correct character's actual location without requiring/creating a traversable route; the exact same movement attempted via Do remains subject to path validation.
- [ ] Story exceptions are sourced to the player's declared prose and do not change graph mode, move unmentioned companions or bypass atomic/entity-reference integrity.
- [ ] Under any configured travel policy, switching `Playing As` between distant characters never fails for lack of a route, triggers movement events or changes locations. Any **real movement** in a subsequent action is checked under the selected travel policy.- [ ] An adventure can use freeform, strict adjacent-only or valid multi-hop travel policy without requiring one universal default.
- [ ] Travel graph connections use stable location identities and remain distinct from containment parent/child links.
- [ ] In adjacent-only mode, a move to a location without a valid directly traversable edge is rejected or handled as blocked without moving the character.
- [ ] In valid multi-hop mode, a route succeeds only when the required edge sequence is connected and each applicable restriction is satisfied.
- [ ] Optional locked doors, access permissions and enabled one-hop limits can prevent otherwise graph-connected movements when applicable.
- [ ] In freeform mode, traversal need not follow a predefined graph path but any resulting authoritative character-location change is still consistent and validated.
- [ ] A failed, uncommitted or rejected movement does not alter saved character location or silently invent an enabling route.
- [ ] Blocked or ambiguous movement is exposed so the player understands why travel did not complete.
- [ ] Previously accepted parent/child containment does not itself grant passable travel links.
- [ ] AI world expansion and environment mutation remain separate planning ideas not implicitly accepted here.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Originally a user-requested candidate, now explicitly accepted for staging with configurable strict/freeform modes and separate traversal links.
- **Staging means accepted for refinement, not production-approved or implemented.** The default policy, route solver, conditional-edge schema and user experience need review.

## Decisions and review history
- 2026-10-18 — **Accepted IDEA-0002 travel exception:** Explicit player Story events may establish an otherwise disallowed relocation without pretending a route/travel ability exists. Strict routing still governs ordinary Do/Say actions and AI/Continue outcomes; source-grounded references and canonical safety remain required. Staging only.
- 2026-10-18 — **Explicit user acceptance:** Switching to a distant character is not travel. Next Do/Say follows their established scene, and actual later movement still validates as normal. Staging only.
- 2026-10-18 — **Accepted scene-cut dependency:** `Playing As` switching is a narrative cut and not travel, so no route or movement validation is triggered by switching between far-apart characters. Actual travel still follows normal selected policy. Staging only.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Configurable travel graph separately from the location hierarchy, supporting freeform movement, strict adjacent-only movement and valid multi-hop routes; validated location changes and optional conditional edges such as locked doors, permissions and one-hop limits; no invalid travel under strict rules. Default policy, route resolution and precise restrictions remain open. Moved to staging for refinement only.
