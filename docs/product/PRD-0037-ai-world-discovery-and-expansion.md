---
id: PRD-0037
type: prd
status: accepted
related:
- NOTE-0044
- PRD-0001
- NOTE-0016
- NOTE-0008
---

# AI World Discovery and Expansion

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0036](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/AI%20World%20Discovery%20and%20Expansion.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S11**. First milestone: **M6**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Current accepted narrative-first scope — 2026-10-28

**Current narrative-first world memory ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** AI-proposed location/lore facts remain provisional until source-grounded accepted narration or explicitly approved world-authoring establishes them. Record **declarative location/entity/route assertions**, not a mechanically validated procedural travel chain. An accepted assertion may establish an unexpected place or new physical location even when an old route/creation event is gone; its origin may remain unknown. Optional strict travel can steer **attempted** actions and provisional narration, not rewrite final accepted story; mere mention never establishes travel/discovery.


## Accepted direction
- **AI-assisted persistent world expansion:** As play unfolds, the narrator or interpreter may **propose** discoveries and additions of named locations and travel connections. Validated, accepted changes become persistent world state, not one-off prose inventions.
- **Validated location creation:** The system can propose a new location with a stable ID and established details. It must check whether the place is truly new or already represented under another name, alias or description before committing.
- **Validated hierarchical placement:** New locations should be placed under an appropriate parent in the flexible hierarchy accepted as Hierarchical World Locations (IDEA-0033); parent references must be consistent and acyclic.
- **Purpose and limits of optional discovery (user clarification 2026-10-19):** Player-selected map/travel validation is a guardrail against **AI inventing inconsistent story geography**, not a way to restrict player authorship. An enabled strict travel policy may lead the coordinator to narrate an attempted blocked move, correct a mistaken door/destination, or clarify a known route rather than treating player intent as automatic success. The separate player-authored **Story** mode remains capable of establishing extraordinary outcomes with coherent event/state updates (IDEA-0002/0035); AI-only continuation cannot silently gain that authorial override.
- **Validated travel connections:** Proposals may add links between established and newly discovered places, keeping traversal edges separate from hierarchy containment links and respecting Configurable Travel Graph Rules (IDEA-0035).
- **Validated character arrival:** If the scene includes arriving at or discovering a place, the corresponding character location/presence change must be checked against the selected travel policy and accepted world state, as in Character Presence and Current Scene (IDEA-0034). Discovery alone does not teleport characters.
- **Coherent batch operations:** Where a discovery needs a location, parent, connection and arrival together, validate the coordinated operation before committing so partial failures do not leave an orphaned place, a contradictory route, or an impossible character destination. Atomic/transactional or explicitly consistent failure semantics should be refined.
- **Aliases and duplicate safeguards:** Match or resolve named locations, alternative spellings and descriptive references against existing stable locations. Never silently create duplicates when a place may already exist; retain stable IDs and aliases on renames or re-identification.
- **Explicit node discovery state, distinct from player map editing (user decision 2026-10-23):** Established locations can have a persisted **`undiscovered` or `discovered`** state. A validated narrative discovery may switch `undiscovered` to `discovered` without creating a duplicate location. **Undiscovered recorded nodes may still appear on the player's map with stored names/details available for inspection and correction**; this flag tracks in-story discovery, not authority to hide a node from its player-author world editor. The AI must not assume characters know a place merely because the player can edit it. Truly restricted content, if any, needs a separate explicit policy, not blanket `undiscovered` suppression.
- **Grounded assertions and technical checks:** The AI supplies provisional typed assertions; accepted narration or intentional player worldbuilding determines which facts become canonical, and TypeScript checks type/identity/projection representability. No AI prose automatically bypasses route restrictions or established locked access.
- **Keep expansion controls open:** Whether to offer separate settings for AI world expansion versus strict travel adjacency, how they default, and whether new places are pre-existing hidden entities or generated on encounter remain **open for refinement**, not fixed by this acceptance.
- **Separate visualisation:** The zoomable map UI and saved layout are a separately accepted **staging** feature (Zoomable Node Map Canvas, IDEA-0037); neither map rendering nor enabling discovery automatically enables strict movement rules.

## Dependencies and constraints
- Depends on accepted Hierarchical World Locations (IDEA-0033) for persistent location IDs, flexible nesting and cycle prevention.
- Depends on accepted Character Presence and Current Scene (IDEA-0034) for actual location/arrival; mentioning a distant or rumored place must not move a character there.
- Respects accepted Configurable Travel Graph Rules (IDEA-0035): connected routes and conditional restrictions are separate from containment; new graph edges or paths cannot silently bypass strict movement policy.
- World descriptions and entity references should connect with accepted Entity-Based Lorebook (IDEA-0020), without treating AI-generated prose as automatically authoritative.
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

## Supporting detail

See [NOTE-0044](../knowledge/inbox/NOTE-0044-prd-0037-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
