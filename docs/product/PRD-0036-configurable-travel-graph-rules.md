---
id: PRD-0036
type: prd
status: accepted
related:
- NOTE-0043
- PRD-0001
- NOTE-0016
- NOTE-0008
---

# Configurable Travel Graph Rules

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0035](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Configurable%20Travel%20Graph%20Rules.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S11**. First milestone: **M6**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Latest approved narrative-first event semantics — 2026-10-28

**Narration-first supersession ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Strict travel modes remain **optional guardrails for ordinary unresolved Do/Say attempts or provisional AI narration**, not proof obligations for **accepted** world assertions. The tracker records `SetCharacterLocation(character, destination)` when accepted story/player authorship establishes arrival, even if no older recorded route or movement event justified it. A mere mention, memory or remote call does **not** establish arrival; location identity may be sparse and its unknown fields left unknown. Current physical location is a single derived property; hierarchy does not imply a traversable edge. Do not rewrite or veto previously accepted prose to enforce strict geography.


## Accepted direction
- **Configurable travel-graph rules:** Let an adventure select how strictly travel between locations is constrained by explicit route connections, instead of enforcing a single travel policy for every story.
- **Player-first purpose of travel guardrails (user clarification 2026-10-19):** The optional movement/route system exists to help the **AI honour the player's chosen story and established geography**, not to police what the player is allowed to imagine or author. In a freeform adventure the map can remain a **reference/visualisation only**, without enforced pathfinding. In a strict adventure, ordinary Do/Say **attempts** and AI/Continue-generated movements should be checked and, when inconsistent, narrated or lightly revised into a coherent outcome. Explicit **player-authored Story** assertions retain their existing authorial override under IDEA-0002; technical identity/history/atomic-integrity checks still apply. Do not impose unnecessary gameplay bureaucracy, route invention or mandatory player confirmations just to satisfy a mechanical restriction.
- **Three supported policy directions:** Provide **freeform travel**, **strict adjacent-only movement**, and **valid multi-hop routing**. Exact UI, defaults, and edge-case policies remain for refinement.
- **Separate spatial canvas, containment and travel topology:** The **persistent coordinate canvas** places and spatially groups locations with meaningful scale (B7-D10); hierarchy describes which locations contain others; explicit graph edges describe possible traversal. **Do not infer passable edges** merely from coordinate closeness, shared parents or common ancestors.
- **Strict-mode attempted-action guidance (latest scope):** When strict policy is selected, evaluate unresolved Do/Say travel **attempts before narrative acceptance**, allowing coherent failed attempts or bounded provisional narration refinement. An **accepted** player/AI story fact asserting a character's new place is represented by a `SetCharacterLocation` event even without a retained route/earlier movement; no retroactive veto of established story.
- **Adjacent-only attempted movement:** A strict option can guide an **uncommitted travel attempt** to known directly traversable edges, without refusing a later **accepted** location assertion for lacking recorded path history.
- **Multi-hop attempt routing:** Another strict option can guide unresolved attempted travel along several known route edges. After final narration establishes a destination, record its present location declaratively even if an older causal route is absent. Timing/narration remain future refinements.
- **Optional conditional connections:** Route edges may carry access conditions such as locked doors, keys, permissions, blocked passages or other setting-specific constraints. An adventure may also impose optional movement granularity, for example a one-hop-per-turn limit.
- **Coherent character presence:** Only **actually established accepted arrival** or explicit correction yields a typed location/presence assertion. Incidental mention, remote contact and uncompleted travel attempts do not. A missing fictional path doesn't invalidate a final accepted location assertion.
- **Provisional travel obstacles:** When selected strict rules show an **attempted**, not completed, action is blocked, guide pre-acceptance narration accordingly without inventing bypasses. When canon **already establishes** arrival, record its present location rather than suppressing it on mechanical grounds.
- **Freeform does not mean state corruption:** The freeform policy relaxes adjacency restrictions for narrative movement but still requires coherent location identities, accepted state transitions and validation appropriate to the selected adventure. It is not license for unvalidated world-state mutations.
- **Deliberate open decisions:** The spatial canvas's semantic pinned coordinate persistence, grouping and scale are **now accepted in B7-D10**. Still do **not** preselect default travel mode, exact graph-edge schema, permission/key evaluator, coordinate system/units, path-distance metric, vague-destination resolution, travel-time model or mandatory travel limits.

## Dependencies and constraints
- Requires stable location IDs and a containment hierarchy from accepted Hierarchical World Locations (IDEA-0033), while preserving the distinction between hierarchy and route edges.
- Validated travel should update accepted Character Presence and Current Scene (IDEA-0034) state and avoid automatically relocating remote or absent NPCs.
- All travel proposals and world-state events must respect accepted deterministic validation and failure-handling principles from Configurable Generation Pipeline Strategies (IDEA-0018).
- The existence of a parent, sibling or ancestor relation is never alone proof of a traversable graph connection under a strict policy.
- Optional edge restrictions should be applied to the current authoritative status of doors, permissions, keys or routes; speculative narration cannot independently unlock access or invent a connection.
- In strict modes, failed, rejected or unresolvable travel requests must not change the character's canonical destination or silently create routes to justify movement.
- Freeform policy can relax graph constraints without bypassing the separate persistence and validation requirements for changes to canonical location.
- AI-driven creation of new places and connections is a separately accepted **staging** direction: AI World Discovery and Expansion (IDEA-0036). Mutable environmental restrictions such as destroyed bridges and locked doors are covered by separately accepted staged IDEA-0038. Neither feature gives autonomous AI authority to bypass the current travel rules.
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

## Supporting detail

See [NOTE-0043](../knowledge/inbox/NOTE-0043-prd-0036-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
