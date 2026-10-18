---
id: "IDEA-0020"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Memory Lorebook and Context Brainstorm]]", "[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Entity-Based Lorebook

## Idea
Store lore about all characters, settlements, world regions, factions, species, objects and abilities.

## Why this idea matters
World knowledge must outlive any individual prose passage.

## Accepted direction
- **Entity-based Lorebook:** Store and edit persistent lore entries for all characters, settlements, world regions, factions, species, objects, abilities and other relevant concepts.
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
- The interpreter must **not enrich a referenced entity with lore that has not been stated**. A named village is not a populated settlement history; a named character is not an automatically invented biography. Missing fields stay unknown. Explicit rumours or character beliefs remain labelled as such rather than rewritten as established world facts.
- Each automatically created or updated fact should retain a source/story-revision reference and follow the normal distinction between stable Lorebook knowledge and mutable live character/location/item state. A later explicit narrative addition or player edit can establish additional facts normally.

## Optional generated world before Turn 1 versus strict extraction
- **Accepted IDEA-0006 refinement:** Once a player-written **Custom Opening** is committed, enabled interpreter/Lorebook integrations should register/link **only source-supported facts** from that prose, just as for an AI-generated Quick Start opening. A draft or blank opening does not establish new world facts. Never fill in character backstories, locations, relationships or other unwritten lore under the guise of extraction.
- **New separate accepted staging idea IDEA-0066:** On explicit player request, an AI **may author a substantial initial Lorebook/world before Turn 1**, so a new adventure can start already populated. This is an **intentional worldbuilding task**, not a change to the source-grounded interpreter's semantics. Generated lore must still distinguish established facts, rumours and dynamic present-time state; exact workflow, breadth, player review and commit policy remain for later refinement.
- The worldbuilder is **optional** and does not make world generation mandatory for blank Custom Opening, normal Quick Start or guided creation. Its output belongs to that adventure's persistent Lorebook inside the existing database; it is not a new import/export feature.

## Lorebook-backed Playing As character selection
- **Explicit IDEA-0002/0007/0026 user decision:** An adventure's **Settings sidebar** includes a nullable `Playing As` selector populated by **ALL character entities in this adventure's Lorebook, without PC/NPC or Playable categories**. Display character names but use stable IDs for the selected reference. Selecting a character **does not create one** or alter character attributes, inventory, location, lore or history.
- The selector/dropdown includes an **Add Character** action that **navigates to the Lorebook's manual character-entry interface**. The player can create **one or several characters**, staying in the Lorebook until they choose to navigate elsewhere. Saving a new character **does not set or override** `Playing As` and **does not automatically return to the story**. Choosing the character to act/speak as remains a separate explicit action in Settings. Do not invent a protagonist or trigger AI character creation in place of manual entry.
- If the Lorebook contains **no characters**, there is no valid `Playing As` option. **Do and Say are disabled**, while Story and Continue remain available for a fully characterless narrative. Creating one or several characters merely **adds them as available choices**; the player explicitly selects one when ready. No creation-triggered selection, automatic return to story or implicit change to an already selected actor. Exact manual navigation affordances remain a UI detail.

## All Lorebook characters are potential player actors
- **Explicit user-approved universal eligibility:** The Lorebook is the single list of actual characters. **Every character entry** is a choice for the adventure's `Playing As` setting, regardless of whether the player has ever acted for that character. There is **no `NPC` role, permanent `PC` role, `Playable` flag, special protagonist class or eligibility filter**.
- `Playing As` changes only the actor/speaker attributed to subsequent Do/Say turns. It never transforms character identity, relocates characters, transfers equipment, creates lore or changes story history. Story/Continue remain independent.
- The **Add Character** route enables manual creation of several characters before choosing any one explicitly. No character is auto-selected on save, and the player need not leave the Lorebook after creating one.

## Direct-access Lorebook icon next to story input
- **Explicitly accepted UI refinement (IDEA-0062):** The story composer has a **dedicated Lorebook icon immediately to the left of its input field**. It opens the editable Lorebook directly because lore and entity records are accessed and updated frequently during play. The Lorebook is **not** squeezed into the information panel's Info/Settings tabs as a required third tab. The **left-drawer presentation is now accepted**; precise width/expanded-layout styling remains open.
- **Settings retains `Playing As`:** The information panel's **Settings** tab holds the existing character selector, which lists **every** character entity in this adventure's Lorebook. Its **Add Character** option still navigates to manual Lorebook entry. Players may create several characters without auto-selecting or automatically returning to the story.
- Opening Lorebook and editing its UI do not automatically change the selected player actor; actual canonical lore/world edits still follow normal validation/persistence rules.

## Lorebook opens as an animated left drawer
- **Accepted entry/placement (IDEA-0062):** The dedicated Lorebook icon **immediately left of the story input field** opens the **editable Lorebook as a LEFT-side drawer**, instead of using a separate mandatory full-page view or an Info/Settings tab. Keep the story visible where screen space allows. The drawer can be **resized**, and the user can **expand it for detailed editing**; exact layout and widths remain future interface refinements.
- **User-specified asymmetric transitions:** **Opening has two sequential phases**, first the narrow drawer **sidebar/rail slides out from the left**, then the **main Lorebook body comes out from behind that rail**. **Closing uses one simple fade-out** of the drawer, not a reverse two-stage slide. Do not silently substitute a generic single slide or symmetrical exit animation. Respect reduced-motion settings and keyboard/focus/accessibility requirements per IDEA-0062; precise durations and easing remain open.
- **Same authoritative Lorebook:** Navigating to it from the composer shortcut or the **Add Character** option in Settings reaches the same editable entity records; it must not create duplicate character data or automatically set `Playing As`. Players may create multiple characters without a forced redirect back to story.
- Drawer open/close/size is **presentation state**, not a canonical Lorebook fact, adventure event, character/item/location mutation or implicit acceptance of an edit. Editor drafts and canonical updates follow their already accepted boundaries.

## Unknown character names and noncanonical labels
- **Explicit accepted IDEA-0007 Option B (2026-10-18):** A Lorebook character record can be created/maintained with **no known proper name or other required profile facts**. Its **stable character entity ID** is authoritative identity. Represent the missing canonical name as **unknown/not recorded**, distinct from the text "Unknown" and from a consciously established name.
- **Presentation label separate from name:** Use an optional description or user-supplied label (e.g. *The Hooded Stranger*) to identify the record in Lorebook lists, or a neutral *Unnamed Character N* UI placeholder when none exists. **Neither label is automatically promoted into canonical character-name lore.** Labels/fallbacks may change; persistent links use stable IDs.
- **Grounded later discovery and uncertainty:** When accepted evidence reveals a name, amend the **existing** character entry/field while maintaining its relationships, history and stable ID. A rumour, character belief, uncertain alias or attribution such as "called Elian by another character" remains explicitly uncertain and sourced, not quietly promoted to an established name. Do not merge two characters just because similar descriptions appear, or invent missing biography to fill a sheet.
- **Every character selectable:** `Playing As` lists **all** character entities, named or unnamed, using readable display labels keyed by IDs. Selecting an unnamed character is allowed and does not add a name, select a permanent protagonist or create story/world mutations.


## Manual lore descriptions do not require semantic matching to structured fields
- **Accepted IDEA-0007 clarification (2026-10-18):** When a player manually authors a **character's freeform Lorebook description/background** alongside structured attributes, **do not require the application to parse the prose and cross-check that it semantically agrees with the structured fields**. A human/elf disagreement between description and Species can be retained without blocking character save, inventing a precedence rule, or automatically rewriting either representation.
- **Preserve other boundaries:** This is not a general exemption from canonical integrity or deterministic gameplay validation. Typed field schemas and entity references remain valid; actual committed world-state actions still obey coordinator/Go transaction safeguards. Separately accepted *source-grounded extraction from narrative openings* continues to validate proposed facts rather than treating manually typed prose as a mandatory structured-field synchronisation protocol.
- **No implied facts:** Do not use a display label, unknown name or freeform phrasing to silently fill structured fields, promote rumours or manufacture lore. Any later manual correction is deliberate; no compulsory AI contradiction detector or resolution interface is required.


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
- 2026-10-18 — **IDEA-0007 user decision dependency:** Manual freeform character descriptions do not require automated semantic comparison with typed Lorebook fields; neither representation silently overrides or corrects the other. Existing stable IDs, schema checks, source-grounded narrative extraction and canonical gameplay validation remain in force. Staging only.
- 2026-10-18 — **Accepted IDEA-0007 Option B:** Lorebook characters can have unknown proper names and only a stable identity; descriptive or generic UI labels are noncanonical name substitutes for display, not invented facts. Later grounded name revelation updates the same entity, unverified names stay uncertain, and all entries remain selectable as `Playing As`. Staging only.
- 2026-10-18 — **Explicit user acceptance of Lorebook drawer:** From the icon left of the story input, open the Lorebook in a **resizable LEFT-side drawer** (expandable for detailed editing). Opening animation is **two-stage: leading sidebar first, full drawer from behind it second**. Closing uses **simple fade-out**, not reversed opening. Preserve reduced-motion accessibility, editable Lorebook semantics and the separate Info/Settings panel. Staging only; exact timing and dimensions remain open.
- 2026-10-18 — **User-accepted Lorebook navigation placement:** Place a direct Lorebook icon **to the left of the story input field** because lore changes frequently. The nearby information panel has **Info/Settings tabs**, with `Playing As` under Settings, not Lorebook as a required tab. Staging only.
- 2026-10-18 — **Explicit user decision:** The Lorebook's `Playing As` options include **every existing character**, with no PC/NPC distinction or Playable tag. Players may temporarily act as anyone by selecting their character in Settings. Manual character creation never auto-selects. This supersedes any previous implication of a permanent player versus NPC category. Staging unchanged.
- 2026-10-18 — **User accepted manual choice after adding characters, rejecting automatic assignment:** The Lorebook may host creation of several characters in succession. **Saving one does not auto-select it as `Playing As` or force a story return**, and does not disturb a previously chosen actor. Only an explicit Settings selection chooses who Do/Say use. Staging unchanged.
- 2026-10-18 — **Explicit user-approved Settings/Lorebook link:** The `Playing As` character selector reads actual Lorebook character entities; `Add Character` in its dropdown navigates to **manual Lorebook character creation**. The selection is required for Do/Say but not Story/Continue. No characters means no selectable actor, not a fabricated player hero. Remains staging.
- 2026-10-18 — **Two user-confirmed planning dependencies:** Apply strict **no-extra-lore fact extraction** to committed player-authored Custom Opening prose (IDEA-0006). Separately, the user explicitly accepted **IDEA-0066**, an optional AI request that may deliberately **invent and populate a starting Lorebook before the first story turn**. The two mechanisms must remain distinct; the new idea's generation/approval specifics are deferred. Staging unchanged.
- 2026-10-17 — **Explicitly accepted IDEA-0006 constraint:** First-scene extraction may build minimal world and Lorebook records **only from facts actually expressed in accepted prose or player setup**, with source provenance and certainty preserved. No unspoken worldbuilding or NPC/place backstory is generated by the extraction step. Unknown properties remain unknown; staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Entity-based Lorebook with typed editable entries, entity links, separation of persistent lore from mutable state, distinguishing reliable facts from rumours/beliefs, **and manual selection of what Lorebook content gets included in generation context**. Requested a separate **unaccepted** Inbox idea for automatic embedding-model/RAG selection; this acceptance does not extend to that additional idea. Moved to staging, not production.
