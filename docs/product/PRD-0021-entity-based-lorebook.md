---
id: PRD-0021
type: prd
status: accepted
related:
- NOTE-0032
- PRD-0001
- NOTE-0013
- NOTE-0007
- NOTE-0012
---

# Entity-Based Lorebook

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0020](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Entity-Based%20Lorebook.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S09**. First milestone: **M4**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Current accepted narrative-first scope — 2026-10-28

**Latest overarching authority ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** The Lorebook tracks **the story's accepted current facts for later narration**, not simulation-law proofs. Entity name/status/location/ownership/current relations may be asserted as typed `Set/Clear` or keyed relationship changes, with one stable ID and unknown fields preserved. If an earlier creation event disappears but a later accepted passage establishes that entity, retain a sparse record rather than veto its appearance. Contradictory descriptions can coexist as prose; only malformed/non-deterministic structured data or unsafe commits are fatal. Player Lorebook edits remain pending until explicit Commit where applicable.


## Accepted direction
- **Entity-based Lorebook:** Store and edit persistent lore entries for all characters, settlements, world regions, factions, species, objects, abilities and other relevant concepts.
- **Typed entries and flexible lore text:** Distinguish entry/entity types while allowing player-authored freeform descriptions and structured fields where useful.
- **Stable links between entities:** Lore entries may refer to related characters, locations, items and concepts through durable entity identifiers, not just copied prose.
- **Separate stable knowledge from mutable state:** Link to live character/location/item world-state records instead of duplicating changeable facts as permanently authoritative Lorebook text. A change in the game world's current state should not cause stale Lorebook text to override it.
- **Facts versus beliefs:** Allow representing established world facts distinctly from rumours, hypotheses and beliefs attributed to particular characters or sources. The exact knowledge/reliability schema remains for refinement.
- **Explicit player control of lore injected into AI context:** Players must be able to **select what Lorebook material enters the generation context**. At minimum allow manual entry-level inclusion/exclusion (and consider field/section-level control), plus a visible indication of the resulting selection. A player should be able to deliberately include useful lore or keep unrelated lore out without relying solely on automatic triggers.
- **Separate activation and semantic retrieval approvals (current status):** This idea establishes Lorebook entries and manual selection; the independent Conditional Lorebook Activation (IDEA-0021) has **since been accepted in staging** for optional rules/keyword-based inclusion, with explicit manual exclusions taking precedence. **Embedding-based retrieval/RAG** (Embedding-Based Lore Retrieval and RAG Context Selection, IDEA-0063) remains **unaccepted in Inbox**. Neither distinct capability is silently approved by this Lorebook note alone.
- **Context-size constraints:** Manual inclusion requests remain subject to the selected model's context limit. If selected lore cannot fit, show an understandable warning/omission rather than silently pretending it was passed to the model.

## Dependencies and constraints
- Lorebook entries should refer to authoritative entities in the future character, location and inventory systems; this idea does not approve those separate features by itself.
- Dynamic state such as current location, ownership, inventory, alive/dead state and relationships must not be treated as immutable Lorebook fact.
- The separately **accepted staging** context builder (Token-Budgeted Context Builder and Inspector, IDEA-0024) respects explicit Lorebook include/exclude requests and communicates token/context limits. It has its own scope and refinement gate; its later acceptance does not expand this individual Lorebook idea retroactively.
- Manual Lorebook control originates in this idea; optional keyword/rules activation in **accepted staging** IDEA-0021 is a separate compatible capability. Embedding/RAG selection (IDEA-0063) is still unaccepted. Manual exclusions take precedence over automatic activation and context budgets may cause explicitly reported omissions.
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
- [ ] Reusing one scenario template yields different adventures with **separately owned Lorebook entries** and coherently scoped relationships; no changes to the template or other instantiated adventures mutate existing entries.
- [ ] Template instantiation preserves known/unknown/claimed character facts and doesn't manufacture missing names, relations or background merely to populate an entity copy.
- [ ] Players can save a character's freeform description alongside individually valid but semantically inconsistent structured attributes **without a semantic conflict popup or automatic field/prose rewriting**.
- [ ] Structural references and authoritative world-state/commit checks remain enforced; this exception does not weaken AI-generated operation validation or erase known-versus-unknown distinctions.
- [ ] Lorebook supports a character with no recorded canonical name, identified by stable ID and a descriptive/neutral display label that does not assert unestablished facts.
- [ ] Rumoured or claimed names remain distinct from established canonical names, while later verified names update the same stable character entity.
- [ ] Unnamed characters remain accessible and individually selectable in the Lorebook-backed `Playing As` list.
- [ ] The composer-left Lorebook icon opens the editable Lorebook as a **left-edge resizable drawer** with an option for an expanded editing workspace.
- [ ] Its opening animation first reveals the **leading sidebar/rail**, then reveals **main content from behind it**; closing uses a **simple fade-out** and respects reduced-motion accessibility.
- [ ] Opening/closing the drawer does not change `Playing As`, create a gameplay turn, discard drafts or implicitly commit lore edits. `Add Character` opens the same Lorebook manual entry and does not auto-select a character.
- [ ] A dedicated Lorebook icon immediately left of the story input opens Lorebook directly without routing through Info/Settings tabs.
- [ ] Lorebook remains the authoritative editable place for character records used in Settings `Playing As`; creating a character there does not auto-select it or close the view.
- [ ] A player can create, edit, inspect and link typed Lorebook entries for characters, places, factions, species, objects and abilities.
- [ ] Lorebook entries can link to stable character/location/item entities without treating their current mutable state as frozen lore.
- [ ] The system can distinguish established facts from rumours or attributed character beliefs in an inspectable manner.
- [ ] A player can explicitly choose which Lorebook entries to include in AI generation context and which to exclude.
- [ ] Generation context reflects the chosen manual Lorebook inclusion/exclusion, and the interface shows what was actually included.
- [ ] If selected lore does not fit the available context budget, the player is informed of omitted/trimmed material.
- [ ] Changing lore inclusion preferences does not independently alter the underlying authoritative world state.
- [ ] Semantic embedding retrieval or RAG is not required for the manual Lorebook feature to work.

## Supporting detail

See [NOTE-0032](../knowledge/inbox/NOTE-0032-prd-0021-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
