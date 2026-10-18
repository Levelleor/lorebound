---
id: "IDEA-0020"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Memory Lorebook and Context Brainstorm]]", "[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Entity-Based Lorebook

## Idea
Store lore about PCs, NPCs, settlements, world regions, factions, species, objects and abilities.

## Why this idea matters
World knowledge must outlive any individual prose passage.

## Accepted direction
- **Entity-based Lorebook:** Store and edit persistent lore entries for player characters, NPCs, settlements, world regions, factions, species, objects, abilities and other relevant concepts.
- **Typed entries and flexible lore text:** Distinguish entry/entity types while allowing player-authored freeform descriptions and structured fields where useful.
- **Stable links between entities:** Lore entries may refer to related characters, locations, items and concepts through durable entity identifiers, not just copied prose.
- **Separate stable knowledge from mutable state:** Link to live character/location/item world-state records instead of duplicating changeable facts as permanently authoritative Lorebook text. A change in the game world's current state should not cause stale Lorebook text to override it.
- **Facts versus beliefs:** Allow representing established world facts distinctly from rumours, hypotheses and beliefs attributed to particular characters or sources. The exact knowledge/reliability schema remains for refinement.
- **Explicit player control of lore injected into AI context:** Players must be able to **select what Lorebook material enters the generation context**. At minimum allow manual entry-level inclusion/exclusion (and consider field/section-level control), plus a visible indication of the resulting selection. A player should be able to deliberately include useful lore or keep unrelated lore out without relying solely on automatic triggers.
- **No automatic semantic retrieval accepted here:** This note covers the Lorebook and manual selection. Keyword/conditional inclusion ([[Conditional Lorebook Activation]], IDEA-0021) and **embedding-based retrieval/RAG** ([[Embedding-Based Lore Retrieval and RAG Context Selection]], IDEA-0063) are distinct unaccepted candidates requiring their own approvals.
- **Context-size constraints:** Manual inclusion requests remain subject to the selected model's context limit. If selected lore cannot fit, show an understandable warning/omission rather than silently pretending it was passed to the model.

## Proposed behaviour
Provide an editable Lorebook with typed entries, relationships, stable IDs and optional source/certainty labels. Assemble requested lore and up-to-date authoritative state separately when preparing an AI generation. Expose manual controls for choosing Lorebook entries (and potentially sections) to supply to the context builder and a view of what has actually been included or omitted. Avoid having duplicated, stale Lorebook descriptions overwrite mutable live game state. Neither automatic activation nor an embedding model is required by this accepted feature.

## Alternatives and trade-offs
A combination of entry types and editable freeform lore supports both structured relationships and expressive descriptions. Entry-level manual context toggles are the accepted baseline; section-level granularity and how selections persist are open refinements. Automatically selecting lore using keyword/condition triggers or semantic embeddings could complement the manual controls, but these are **not** part of the current acceptance.

## No invented lore during initial extraction
- **IDEA-0006 explicitly accepted:** A successful Quick Start opening can populate/link **minimal typed Lorebook/character/location/item facts supported by its actual words**, when the applicable systems are enabled and the source passes validation.
- The interpreter must **not enrich a referenced entity with lore that has not been stated**. A named village is not a populated settlement history; a named NPC is not an automatically invented biography. Missing fields stay unknown. Explicit rumours or character beliefs remain labelled as such rather than rewritten as established world facts.
- Each automatically created or updated fact should retain a source/story-revision reference and follow the normal distinction between stable Lorebook knowledge and mutable live character/location/item state. A later explicit narrative addition or player edit can establish additional facts normally.

## Dependencies and constraints
- Lorebook entries should refer to authoritative entities in the future character, location and inventory systems; this idea does not approve those separate features by itself.
- Dynamic state such as current location, ownership, inventory, alive/dead state and relationships must not be treated as immutable Lorebook fact.
- The context builder ([[Token-Budgeted Context Builder and Inspector]], IDEA-0024) should respect explicit inclusion/exclusion requests while handling model token/context limits transparently; that candidate is not accepted here.
- Selective Lorebook inclusion is **manual** under this decision. Automatic keyword-based activation (IDEA-0021) and embeddings/RAG selection (IDEA-0063) remain independent unaccepted ideas.
- Lorebook beliefs and rumours should not be indistinguishable from verified state when instructions are built for the narrator.

## Open questions
- How should rumours, uncertain facts and character-specific beliefs be represented and attributed?
- What Lorebook entry types and structured fields are initially useful without being overly rigid?
- What should entry links do when a referenced entity is renamed, moved, removed or revised?
- Should manual context selection be per-adventure, per-scene, per-request, or a combination?
- Should players select individual fields/paragraphs or only whole Lorebook entries at first?
- How should selected material, token consumption and context-limit omissions be shown?
- What precedence should manual inclusion and exclusion take if optional automatic Lorebook activation or RAG is accepted later?

## Draft acceptance criteria
- [ ] A player can create, edit, inspect and link typed Lorebook entries for characters, places, factions, species, objects and abilities.
- [ ] Lorebook entries can link to stable character/location/item entities without treating their current mutable state as frozen lore.
- [ ] The system can distinguish established facts from rumours or attributed character beliefs in an inspectable manner.
- [ ] A player can explicitly choose which Lorebook entries to include in AI generation context and which to exclude.
- [ ] Generation context reflects the chosen manual Lorebook inclusion/exclusion, and the interface shows what was actually included.
- [ ] If selected lore does not fit the available context budget, the player is informed of omitted/trimmed material.
- [ ] Changing lore inclusion preferences does not independently alter the underlying authoritative world state.
- [ ] Semantic embedding retrieval or RAG is not required for the manual Lorebook feature to work.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-requested Lorebook direction, explicitly accepted with manual context inclusion controls.
- Accepted into **staging for refinement only**. Automatic embeddings-based RAG retrieval is intentionally recorded separately as a fresh unaccepted Inbox candidate.

## Decisions and review history
- 2026-10-17 — **Explicitly accepted IDEA-0006 constraint:** First-scene extraction may build minimal world and Lorebook records **only from facts actually expressed in accepted prose or player setup**, with source provenance and certainty preserved. No unspoken worldbuilding or NPC/place backstory is generated by the extraction step. Unknown properties remain unknown; staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Entity-based Lorebook with typed editable entries, entity links, separation of persistent lore from mutable state, distinguishing reliable facts from rumours/beliefs, **and manual selection of what Lorebook content gets included in generation context**. Requested a separate **unaccepted** Inbox idea for automatic embedding-model/RAG selection; this acceptance does not extend to that additional idea. Moved to staging, not production.
