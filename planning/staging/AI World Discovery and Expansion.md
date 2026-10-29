---
id: "IDEA-0036"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# AI World Discovery and Expansion

## Current accepted narrative-first scope — 2026-10-28

**Current narrative-first world memory ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)):** AI-proposed location/lore facts remain provisional until source-grounded accepted narration or explicitly approved world-authoring establishes them. Record **declarative location/entity/route assertions**, not a mechanically validated procedural travel chain. An accepted assertion may establish an unexpected place or new physical location even when an old route/creation event is gone; its origin may remain unknown. Optional strict travel can steer **attempted** actions and provisional narration, not rewrite final accepted story; mere mention never establishes travel/discovery.


## Idea
Allow the narrator/interpreter to propose discovering named locations and graph connections as play unfolds.

## Why this idea matters
Exploration should grow a persistent world, not just prose descriptions.

## Accepted direction
- **AI-assisted persistent world expansion:** As play unfolds, the narrator or interpreter may **propose** discoveries and additions of named locations and travel connections. Validated, accepted changes become persistent world state, not one-off prose inventions.
- **Validated location creation:** The system can propose a new location with a stable ID and established details. It must check whether the place is truly new or already represented under another name, alias or description before committing.
- **Validated hierarchical placement:** New locations should be placed under an appropriate parent in the flexible hierarchy accepted as [[Hierarchical World Locations]] (IDEA-0033); parent references must be consistent and acyclic.
- **Purpose and limits of optional discovery (user clarification 2026-10-19):** Player-selected map/travel validation is a guardrail against **AI inventing inconsistent story geography**, not a way to restrict player authorship. An enabled strict travel policy may lead the coordinator to narrate an attempted blocked move, correct a mistaken door/destination, or clarify a known route rather than treating player intent as automatic success. The separate player-authored **Story** mode remains capable of establishing extraordinary outcomes with coherent event/state updates (IDEA-0002/0035); AI-only continuation cannot silently gain that authorial override.
- **Validated travel connections:** Proposals may add links between established and newly discovered places, keeping traversal edges separate from hierarchy containment links and respecting [[Configurable Travel Graph Rules]] (IDEA-0035).
- **Validated character arrival:** If the scene includes arriving at or discovering a place, the corresponding character location/presence change must be checked against the selected travel policy and accepted world state, as in [[Character Presence and Current Scene]] (IDEA-0034). Discovery alone does not teleport characters.
- **Coherent batch operations:** Where a discovery needs a location, parent, connection and arrival together, validate the coordinated operation before committing so partial failures do not leave an orphaned place, a contradictory route, or an impossible character destination. Atomic/transactional or explicitly consistent failure semantics should be refined.
- **Aliases and duplicate safeguards:** Match or resolve named locations, alternative spellings and descriptive references against existing stable locations. Never silently create duplicates when a place may already exist; retain stable IDs and aliases on renames or re-identification.
- **Explicit node discovery state, distinct from player map editing (user decision 2026-10-23):** Established locations can have a persisted **`undiscovered` or `discovered`** state. A validated narrative discovery may switch `undiscovered` to `discovered` without creating a duplicate location. **Undiscovered recorded nodes may still appear on the player's map with stored names/details available for inspection and correction**; this flag tracks in-story discovery, not authority to hide a node from its player-author world editor. The AI must not assume characters know a place merely because the player can edit it. Truly restricted content, if any, needs a separate explicit policy, not blanket `undiscovered` suppression.
- **Grounded assertions and technical checks:** The AI supplies provisional typed assertions; accepted narration or intentional player worldbuilding determines which facts become canonical, and TypeScript checks type/identity/projection representability. No AI prose automatically bypasses route restrictions or established locked access.
- **Keep expansion controls open:** Whether to offer separate settings for AI world expansion versus strict travel adjacency, how they default, and whether new places are pre-existing hidden entities or generated on encounter remain **open for refinement**, not fixed by this acceptance.
- **Separate visualisation:** The zoomable map UI and saved layout are a separately accepted **staging** feature ([[Zoomable Node Map Canvas]], IDEA-0037); neither map rendering nor enabling discovery automatically enables strict movement rules.

## Proposed behaviour
On a gameplay turn involving exploration or newly established geography, interpret proposed location creation, known-place discovery-state changes and relevant travel edges as provisional world-state operations. Resolve names/aliases to existing stable IDs where appropriate. If a place is new, propose a durable location ID, optional metadata and valid parent. For proposed links, check endpoint existence, travel policy and any established access conditions. For character arrival, verify the accepted transition independently of world discovery; do not generate a connection solely as an unvalidated pretext for otherwise illegal movement. Validate the proposed sequence or batch as a coherent unit and commit accepted world, connection and presence changes together (or fail without partial inconsistent state). Only committed locations/changes appear as recorded world state. A location **need not be fictionally discovered to have a visible editable node and recorded name on the player's map**. The AI's in-story knowledge and narration are instead filtered by accepted discovery status and context policies; discovering an existing node may update its state without causing travel.

## Alternatives and trade-offs
One approach is to allow AI-created locations on discovery; another is to predefine hidden locations that the AI can reveal when validated. Either may be useful, including hybrid worlds. Separate controls for **automatic expansion** and **travel-rule strictness** could support authored fixed settings as well as freeform exploration, but the exact settings and defaults are not decided. Automatically revealing every created place risks spoilers; tracking discovery visibility separately adds complexity but preserves exploration. Duplicate detection based on names alone can wrongly merge distinct locations or create copies of one place; alias resolution may sometimes require user clarification or an unresolved proposed event. Strict route validation and atomic changes may lead to explicit blocked expansions, but protect coherent world state.

## Player-first discovery versus route repair (2026-10-19)

- **Two separate questions:** (1) Has a new location or connection legitimately been established by the player's authored story, accepted discovery or validated worldbuilding? (2) May the active character traverse a route **now** under the selected adventure policy? Neither answer automatically implies the other.
- **AI repair is not an escape-route generator:** If *"I walk into the treasury"* would break known geography, a bounded repair should prefer a grounded outcome such as finding a locked door, recognising a doorway leads to the Great Hall, or remembering the treasury entrance is elsewhere **when those facts are actually established**. Do not fabricate a convenient connecting passage, key or unlocked door solely so ordinary strict-mode movement succeeds.
- **World expansion stays possible:** A new place or connection can still be discovered or authored where supported and coherently validated. Its evidence, identity, geography and timing must be sound, and character arrival needs independent validation. Do not over-engineer restrictions: the player may use freeform map-as-reference mode or expressly authored Story events to steer fictional reality, while integrity checks remain mandatory.
- **Deferred design:** Whether genuinely new AI-discovered paths need additional user confirmation, how strictness interacts with discovery settings, and how many bounded repairs are attempted are **not** newly decided here.

## Grounded first-scene world discovery
- **Accepted IDEA-0006 Quick Start behaviour:** A successful generated opening may propose and atomically commit **explicitly narrated** locations, characters, objects and supported world facts. A place's stable ID and minimally known type/name may be recorded when its corresponding module is enabled.
- **No undocumented lore expansion by the extractor:** Merely naming the village **Ashford** may create a location named Ashford (and its stated village type), but must **not** invent streets, surrounding settlements, political rulers, routes, shops, population, hidden regions or a history. A mentioned place is not proof of a route, reachable edge, containment hierarchy or completed movement unless the scene explicitly establishes it and validation permits it.
- **Keep missing relations unknown:** If hierarchy, coordinates, graph edges or extra fields cannot be grounded and validated, leave them unresolved/unknown rather than authoring facts to satisfy a schema. The narrator can explicitly describe new world facts in future accepted prose; extraction must not secretly add them behind the story.

## Pre-game generated world and authored Custom Opening
- **IDEA-0006:** When a player-written Custom Opening becomes canonical, relevant location/world facts may be extracted **only where explicitly established**, with ordinary identity/route/presence validation. A blank opening supplies no implicit geography, and extracting a named place must not generate unstated neighbouring regions, roads, landmarks or history.
- **Distinct accepted idea IDEA-0066:** A player may **ask AI to generate an extensive starting Lorebook/world before any story turn**. This is intentional authored worldbuilding and may introduce fictional places, history and links **as generated lore**, subject to later-defined acceptance and validation rules. It is **not** a licence for the normal fact extractor to create invisible geography whenever an entity is mentioned.
- This optional pre-play generation is separate from **discovering or expanding world details during a narrative turn**. How initial world entities and later discoveries interact remains for IDEA-0066 refinement.

## Dependencies and constraints
- Depends on accepted [[Hierarchical World Locations]] (IDEA-0033) for persistent location IDs, flexible nesting and cycle prevention.
- Depends on accepted [[Character Presence and Current Scene]] (IDEA-0034) for actual location/arrival; mentioning a distant or rumored place must not move a character there.
- Respects accepted [[Configurable Travel Graph Rules]] (IDEA-0035): connected routes and conditional restrictions are separate from containment; new graph edges or paths cannot silently bypass strict movement policy.
- World descriptions and entity references should connect with accepted [[Entity-Based Lorebook]] (IDEA-0020), without treating AI-generated prose as automatically authoritative.
- Validated model-proposed operations must follow the selected, accepted generation pipeline and deterministic validation principles (IDEA-0018).
- Batch creation, parent placement, link addition and arrival must not leave partially committed contradictory world state on failure.
- Preserve different concepts of **already existing** versus **newly created** and **`discovered`** versus **`undiscovered`**. The player's map editor may display/edit already recorded undiscovered nodes; a character or AI narrator does not thereby acquire in-fiction knowledge, access or valid travel routes. Real secrecy restrictions beyond this status need separate explicit rules.
- Unknown, incomplete and speculative location properties remain unknown until established; never fill them with invented canonical defaults.
- The separately accepted **staging** features for zoomable map UI (IDEA-0037) and mutable environmental interactions (IDEA-0038) are distinct responsibilities; accepting world discovery does not automatically make movement restrictions mandatory.

## Open questions
- How are duplicate location names, alternate spellings, aliases and incomplete descriptive references resolved without incorrectly merging distinct places?
- Should new places be generated when first described, or be hidden pre-existing entities revealed as the player explores? Can both coexist?
- What constitutes sufficient narrative/validated evidence to create or reveal a named place?
- How can a batch of locations, parents, connections and character-arrival events be validated atomically or safely rolled back?
- Under strict adjacent-only rules, when is proposing a new legitimate edge allowed, and how can the system avoid inventing a route merely to justify an invalid attempted move?
- How should hidden locations, rumored settlements and secret routes be stored, revealed and withheld from the player or from AI context?
- Should players be able to disable or scope automatic AI world expansion separately from strict travel validation, and what default should apply? **Resolved map boundary:** An `undiscovered` node is still allowed in the player-facing world editor.
- When a new named place belongs under an uncertain parent, should placement remain unresolved rather than be guessed?
- How are conflicting proposals, retractions, story edits, undo and branching reconciled with world history and known aliases?
- When and how do newly committed locations become visible in future map and context displays?

## Draft acceptance criteria
- [ ] A generated discovery can propose a durable named location or reveal an existing hidden location without silently committing it as canon.
- [ ] Proposed new locations receive stable IDs and valid parent placement, with hierarchy cycle and missing-reference checks.
- [ ] A proposed new connection references valid endpoints and is checked against the selected travel policy and relevant route constraints.
- [ ] Character arrivals and presence changes only become authoritative after valid movement/location transitions; merely revealing or mentioning a place does not move characters.
- [ ] A coordinated discovery containing multiple operations cannot leave inconsistent partial state when validation fails.
- [ ] Existing places with renamed/aliased references can be matched or marked uncertain to avoid accidental duplicate locations.
- [ ] Recorded `undiscovered` nodes can remain **visible/inspectable/editable for the player on the map**, including saved names/details, while AI in-story narration respects actual discovery knowledge. If a secret field is separately protected, do not conflate that with `undiscovered` status.
- [ ] Unsupported or malformed typed world data fails safely, while **grounded accepted** new locations/facts are recorded as assertions even if fiction lacks prior mechanics/route proof.
- [ ] Separate controls for expansion versus travel strictness, discovery-versus-creation policy and map presentation remain open for refinement.
- [ ] Proposed world expansions do not independently approve the zoomable map or mutable environmental simulation candidates.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Initially user-requested as an Inbox candidate; explicitly accepted for staging as AI-assisted persistent discovery with validated coherent world-state proposals.
- Staging is **not** production approval or evidence of implemented world expansion. Implementation details for alias resolution, hidden locations, atomicity and settings still require refinement.

## Decisions and review history

- 2026-10-23 — **User resolved A-20:** Locations can have an explicit `undiscovered` node state that later becomes `discovered`. The player can still see the node's recorded name/details and edit it in the map; the map is a player-controlled state editor, not necessarily a fog-of-war display. The engine should distinguish this from information legitimately established to characters/AI during story generation. This supersedes treating all undiscovered locations as automatically invisible to the player. Staging only.

- 2026-10-19 — **Player-first AI consistency clarification:** Travel/map rules are optional guardrails against AI continuity errors, not a restraint on player-authored Story. Invalid ordinary travel can be narratively repaired into a grounded locked-door or corrected-destination attempt; AI world expansion is not permission to invent a bypass route just to force success. Separate validated discovery remains possible; the strict policy default and discovery permissions are still deferred. Staging only.
- 2026-10-18 — **Accepted user direction cross-reference:** Custom Opening's structured world extraction uses the same stated-facts-only rule as Quick Start (IDEA-0006). Optional AI-authored **pre-turn starting world generation** is a separate accepted IDEA-0066, not spontaneous lore invention during extraction or story turns. Scope/details of the worldbuilder await later refinement; staging unchanged.
- 2026-10-17 — **Accepted IDEA-0006 source-grounding dependency:** Quick Start initial entity/location extraction automatically records supported **explicitly established** facts but may not fabricate unstated geographical connections, hidden lore, history or settlement details. Unspecified world properties remain unknown; source/revision provenance, domain validation and an atomic opening-turn commit still apply. This does not enable a separate lore-generating expansion pass. Staging only.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by requesting user:** AI-assisted discovery/expansion of persistent locations and travel links; validated proposals for location creation, parent placement, graph connections and character arrival; duplicate/alias safeguards, hidden-location awareness and coherent commits consistent with accepted travel rules. Automatic expansion controls and discovery-versus-creation details deliberately left open. Promoted the existing Inbox idea to staging for refinement only.

- 2026-10-28 — **Explicit user-approved B6-D01 reconciliation:** Narrative-first declarative events govern current behaviour; any earlier simulation-style validity statements in historical proposals/old acceptance text are subordinate. Original approval provenance retained; staging only, not implemented or promoted.
