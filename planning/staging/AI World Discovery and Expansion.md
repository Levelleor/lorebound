---
id: "IDEA-0036"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# AI World Discovery and Expansion

## Idea
Allow the narrator/interpreter to propose discovering named locations and graph connections as play unfolds.

## Why this idea matters
Exploration should grow a persistent world, not just prose descriptions.

## Accepted direction
- **AI-assisted persistent world expansion:** As play unfolds, the narrator or interpreter may **propose** discoveries and additions of named locations and travel connections. Validated, accepted changes become persistent world state, not one-off prose inventions.
- **Validated location creation:** The system can propose a new location with a stable ID and established details. It must check whether the place is truly new or already represented under another name, alias or description before committing.
- **Validated hierarchical placement:** New locations should be placed under an appropriate parent in the flexible hierarchy accepted as [[Hierarchical World Locations]] (IDEA-0033); parent references must be consistent and acyclic.
- **Validated travel connections:** Proposals may add links between established and newly discovered places, keeping traversal edges separate from hierarchy containment links and respecting [[Configurable Travel Graph Rules]] (IDEA-0035).
- **Validated character arrival:** If the scene includes arriving at or discovering a place, the corresponding character location/presence change must be checked against the selected travel policy and accepted world state, as in [[Character Presence and Current Scene]] (IDEA-0034). Discovery alone does not teleport characters.
- **Coherent batch operations:** Where a discovery needs a location, parent, connection and arrival together, validate the coordinated operation before committing so partial failures do not leave an orphaned place, a contradictory route, or an impossible character destination. Atomic/transactional or explicitly consistent failure semantics should be refined.
- **Aliases and duplicate safeguards:** Match or resolve named locations, alternative spellings and descriptive references against existing stable locations. Never silently create duplicates when a place may already exist; retain stable IDs and aliases on renames or re-identification.
- **Hidden and undiscovered places:** Distinguish what is established in the world from what the player has actually discovered or is permitted to see. Mentioning a secret or rumored place need not reveal its exact location, all its properties or a map node.
- **Authoritative validation first:** The AI supplies candidate events; deterministic rules and accepted canonical state decide which world, graph and location changes may be committed. No AI prose automatically bypasses route restrictions or established locked access.
- **Keep expansion controls open:** Whether to offer separate settings for AI world expansion versus strict travel adjacency, how they default, and whether new places are pre-existing hidden entities or generated on encounter remain **open for refinement**, not fixed by this acceptance.
- **Separate visualisation:** A zoomable map UI and saved layout are a separate candidate, [[Zoomable Node Map Canvas]] (IDEA-0037), not automatically accepted with discovery.

## Proposed behaviour
On a gameplay turn involving exploration or newly established geography, interpret the proposed new or newly revealed places and relevant travel edges as structured, provisional world-state operations. Resolve names/aliases to existing stable IDs where appropriate. If a place is new, propose a durable location ID, optional metadata and valid parent. For proposed links, check endpoint existence, travel policy and any established access conditions. For character arrival, verify the accepted transition independently of world discovery; do not generate a connection solely as an unvalidated pretext for otherwise illegal movement. Validate the proposed sequence or batch as a coherent unit and commit accepted world, connection and presence changes together (or fail without partial inconsistent state). Only after commit should newly visible locations appear in persistent world views and context, and only to the extent established and disclosed in the story.

## Alternatives and trade-offs
One approach is to allow AI-created locations on discovery; another is to predefine hidden locations that the AI can reveal when validated. Either may be useful, including hybrid worlds. Separate controls for **automatic expansion** and **travel-rule strictness** could support authored fixed settings as well as freeform exploration, but the exact settings and defaults are not decided. Automatically revealing every created place risks spoilers; tracking discovery visibility separately adds complexity but preserves exploration. Duplicate detection based on names alone can wrongly merge distinct locations or create copies of one place; alias resolution may sometimes require user clarification or an unresolved proposed event. Strict route validation and atomic changes may lead to explicit blocked expansions, but protect coherent world state.

## Dependencies and constraints
- Depends on accepted [[Hierarchical World Locations]] (IDEA-0033) for persistent location IDs, flexible nesting and cycle prevention.
- Depends on accepted [[Character Presence and Current Scene]] (IDEA-0034) for actual location/arrival; mentioning a distant or rumored place must not move a character there.
- Respects accepted [[Configurable Travel Graph Rules]] (IDEA-0035): connected routes and conditional restrictions are separate from containment; new graph edges or paths cannot silently bypass strict movement policy.
- World descriptions and entity references should connect with accepted [[Entity-Based Lorebook]] (IDEA-0020), without treating AI-generated prose as automatically authoritative.
- Validated model-proposed operations must follow the selected, accepted generation pipeline and deterministic validation principles (IDEA-0018).
- Batch creation, parent placement, link addition and arrival must not leave partially committed contradictory world state on failure.
- Preserve different concepts of **already existing** versus **newly created** locations and **known/revealed** versus **secret/undiscovered** locations. Discovery does not always imply creation or access.
- Unknown, incomplete and speculative location properties remain unknown until established; never fill them with invented canonical defaults.
- The separate zoomable map UI (IDEA-0037) and mutable environmental interactions (IDEA-0038) are not automatically accepted through this idea.

## Open questions
- How are duplicate location names, alternate spellings, aliases and incomplete descriptive references resolved without incorrectly merging distinct places?
- Should new places be generated when first described, or be hidden pre-existing entities revealed as the player explores? Can both coexist?
- What constitutes sufficient narrative/validated evidence to create or reveal a named place?
- How can a batch of locations, parents, connections and character-arrival events be validated atomically or safely rolled back?
- Under strict adjacent-only rules, when is proposing a new legitimate edge allowed, and how can the system avoid inventing a route merely to justify an invalid attempted move?
- How should hidden locations, rumored settlements and secret routes be stored, revealed and withheld from the player or from AI context?
- Should players be able to disable or scope automatic AI world expansion separately from strict travel validation, and what default should apply?
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
- [ ] Secret or previously undiscovered world entities need not become immediately visible to the player or model context merely because they are stored.
- [ ] Authoritative game-state validation may reject unsafe or impossible AI-proposed world expansion without letting generated prose override it.
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
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by requesting user:** AI-assisted discovery/expansion of persistent locations and travel links; validated proposals for location creation, parent placement, graph connections and character arrival; duplicate/alias safeguards, hidden-location awareness and coherent commits consistent with accepted travel rules. Automatic expansion controls and discovery-versus-creation details deliberately left open. Promoted the existing Inbox idea to staging for refinement only.
