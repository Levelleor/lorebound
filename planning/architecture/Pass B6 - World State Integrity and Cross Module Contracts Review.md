---
type: architecture
status: in-review
phase: "B6"
created: "2026-10-28"
updated: "2026-10-31"
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
---

# Pass B6 — World State Integrity and Cross-Module Contracts Review

> **All ten B6 architectural decisions D01–D10 have explicit accepted dispositions as of 2026-10-31.** D01 and D04 were user-directed approvals; D02/D03 and D06–D10 selected revised Option A; D05 selected Option A **with an actually implemented structured anatomy/slot prerequisite**. This is a design-closure assessment, not a formal closure. [P-B5-01](./decisions/P-B5-01%20-%20Design%20Closure%20and%20Deferred%20World%20Integrity%20Contracts.md) formally closed B5 at design level. Batch 2 D05–D07 and Batch 3 D08–D10 received separate explicit user approvals; original options remain in this review as decision provenance. Formal B6 design closure still requires separate user authorisation. No implementation, tests or staging-to-production promotion. The accepted declarative-event ADR overrides the earlier unapproved D01 alternatives.

## Scope and inherited decisions

B3/B4 establish a single current ordered replayable event history, deterministic browser TypeScript replay from Turn 0, atomic Go/SQLite persistence and explicit player approval for pending manual corrections. **B6-D01 now narrows preflight to technical representability, not game-simulation prerequisites or story continuity.** B5 establishes valid blank starts and grounded fact extraction. Staged IDEA-0026/0029/0030/0031/0033/0034/0035/0038/0064 establish stable entity IDs, single physical item placement, character presence, spatial hierarchy vs traversal, Story authorial overrides, and allowed automatic equipment consequences of accepted anatomy changes. This pass chooses **precise boundary contracts**, not whether to re-accept those underlying staged features.

## Accepted overriding principle — B6-D01 (2026-10-28)

[Accepted ADR: Narrative-first declarative outcome events](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) is a **user-directed replacement** of the initial unapproved B6-D01 Option A/B/C. World-state tracking exists primarily to help storytelling and context: accepted facts become **replayable Set/Clear, Create/Remove and keyed Add/Remove assertions**, **not mechanically preconditioned commands**. No source-holder check is needed to set a key's current holder; if a historical introduction disappears but a later accepted event refers to an entity, construct/use a sparse stable identity with unknown missing details rather than reject later canon. “Technically invalid” means malformed/unrepresentable/non-deterministic event data or unsafe atomic storage, **not a fictional contradiction**. Previously accepted strict action-attempt guardrails may shape *uncommitted* Do/Say narration but do not veto accepted authorial story facts. This supersedes the broad interpretation of B4-D06 preflight and earlier dependency rejection language.

## Accepted B6-D04 — Narrator-safe identity boundary (2026-10-29)

[Accepted ADR](./decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md): **Never put internal stable entity IDs or raw ID↔name mapping tables in the model context for a prose-producing narrator stage.** The user raised the risk that a model could copy such IDs into the roleplay passage; then expressly asked to record the recommended separation so the project would not drift.

- Narration context uses ordinary entity names, descriptions and relationships; internal IDs are not fictional details.
- After prose creation, the TypeScript interpreter/resolver uses scene/custody/alias context to map references onto existing engine-generated stable IDs. For clearly introduced new entities, the engine allocates IDs; the model is not the canonical ID allocator.
- A **non-narrating** internal interpretation request may receive an ID mapping, but even when the **same selected model** runs both tasks, narrator and interpreter **prompt contexts are isolated**, not reused indiscriminately.
- The accepted **single-pass prose+events** mode remains available by proposing natural-language references for later engine-side ID binding. No mandatory second model/pass.
- If two identically named objects cannot be disambiguated, **do not guess or fabricate an entity ID**; the particular structured assertion remains unresolved, while accepted narrative prose can stand.
- Preserve the already accepted narrator/interpretation routing, world-event replay, atomicity, explicit pending manual Commit, and other existing approval boundaries. Exact ambiguity UX, resolver algorithms and event schema are engineering follow-up work.

**Approval scope:** B6-D04 records the user's requested protection against ID leakage. **D02/D03 were later accepted separately as revised Option A.** This is not evidence of implemented prompt isolation, an entity resolver or tests.

## Batch 1 continuation — approved revised Option A for D02/D03

### B6-D02 — Inventory/equipment as one projected placement (accepted Option A)

**Accepted on 2026-10-30:** [B6-D02 ADR](./decisions/B6-D02%20-%20One%20Item%20Identity%20and%20Declarative%20Equipment%20Placement.md). Original alternative descriptions below retained for provenance.

**Question:** How should we derive inventory and equipment from assertion events without inventing a game simulation?

- **A (recommended, proposed):** Treat an item's **current holder/place** as the latest supported `SetItemHolder` / `ClearItemHolder` assertion on its stable ID; derive character/container inventory views and compatible equipment assignments from that same ID. An equipment change uses typed assertions referring to the same item, not a second copy. A later assertion replaces earlier location even if prior possession/origin wasn't known. Unknown/none remain distinct; stable IDs and representable single current placement still apply.
- **B (proposed):** Maintain independent item copies in inventory and equipment and reconcile them later, increasing projection divergence.
- **C (proposed):** Keep equipment solely as untracked prose, losing useful structured current item context.

This is about representation detail, not whether a fictional “transfer” is legally possible. [B6-D01](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) already accepts the general declarative model; only further interface/schema details await approval.

### B6-D03 — Location and presence as assertions from established facts (accepted Option A)

**Accepted on 2026-10-30:** [B6-D03 ADR](./decisions/B6-D03%20-%20Grounded%20Declarative%20Location%20and%20Scene%20Presence.md). Original alternative descriptions below retained for provenance.

**Question:** How should a character's location and scene presence be tracked without assuming mentions imply arrival or requiring historical travel proof?

- **A (recommended, proposed):** On accepted narration/explicit player correction, emit `SetCharacterLocation` / `SetPresence` assertions for **actually established** changes on stable IDs, even if earlier accepted history lacks a route or prior movement. A mention, recalled interaction or remote conversation alone does not establish arrival. Selected strict travel mechanics may **guide/deny an uncommitted ordinary action attempt** before the narrator finalises outcomes, but cannot retroactively veto a structurally representable **already accepted** narrative fact.
- **B (proposed):** Infer arrival from any narrative mention, creating incorrect current location.
- **C (proposed):** Keep independent conflicting location/presence copies without common current projection.

### Current status (2026-10-30)

- **B6-D01:** **Accepted as user-directed narrative-first replacement**, not the original proposed D01 A/B/C.
- **B6-D02:** **Accepted revised A**, [ADR](./decisions/B6-D02%20-%20One%20Item%20Identity%20and%20Declarative%20Equipment%20Placement.md).
- **B6-D03:** **Accepted revised A**, [ADR](./decisions/B6-D03%20-%20Grounded%20Declarative%20Location%20and%20Scene%20Presence.md).
- **B6-D04:** **Accepted user-directed narrator/identity separation**, [ADR](./decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md).

## Batch 2 — accepted selections (original proposals retained)

All three questions refine the already approved narration-first assertion model without imposing simulated history prerequisites.

### B6-D05 — Anatomy changes and unknown equipment destinations (A accepted with condition)

**Approved 2026-10-31:** [B6-D05 ADR](./decisions/B6-D05%20-%20Conditional%20Anatomy%20Linked%20Equipment%20Detachment.md). Automatic removal of a bracelet or weapon from an affected limb is permitted **only when structured anatomy and the actual slot-to-body-part dependency are implemented and active**. Free-form narrative anatomy alone cannot trigger removal. If real structured incompatibility exists, clear the slot but do not invent an item destination; otherwise retain the assignment unless accepted narration or player Commit directly changes it. The original A/B/C proposal text below predates this condition.

**Question:** Accepted narration establishes that a character lost an arm while an item had been equipped on it, but never says where the item went.

- **A (recommended):** Assert the anatomy change and clear the incompatible equipped-slot relationship for that same stable item. **If the new physical placement is not grounded, leave it unknown/unresolved**, not in an invented pocket or on the floor. If narration *does* establish a valid new placement, the already approved automatic, grounded equipment-consequence assertions may update the same item in the same accepted batch. No duplicate item or rewrite of past narrative. **Trade-off:** More unknowns, but no invented fiction.
- **B:** Retain the visibly incompatible equipment slot until player manually fixes it. **Trade-off:** Less automatic handling, but misleading current gear views.
- **C:** Automatically drop the item into the character's room or inventory even if no destination was stated. **Trade-off:** Tidy-looking UI, but fabricates lore.

This refines the earlier accepted grounded equipment-disposition exception; it is not a test of whether a transformation was mechanically possible.

### B6-D06 — Arbitrary character status and sheet fields (A accepted)

**Approved 2026-10-31:** [B6-D06 ADR](./decisions/B6-D06%20-%20Flexible%20Declarative%20Character%20Status%20Assertions.md). Original alternatives retained.

**Question:** How do we track a character's health, mood, conditions, goals and custom fields without enforcing an RPG game engine?

- **A (recommended):** Store supported named/typed current field values on one stable character identity using replayable **Set/Clear assertions**. Last accepted assertion wins. Distinguish unknown/unset from explicit zero, false or empty. Do not infer unmentioned stats or require a prior mechanic. Manual edits stay pending until explicit player Commit. **Trade-off:** Needs a flexible field schema and typed-value handling.
- **B:** Require fixed numerical RPG attributes and legal action/stat transitions. **Trade-off:** Simpler for simulation-oriented games, but conflicts with Lorebound's narrative-first purpose.
- **C:** Keep all status fields as freeform prose only, with no structured current values. **Trade-off:** Simpler storage but weaker narration context and sheet editing.

### B6-D07 — Doors, routes and other mutable location facts (A accepted)

**Approved 2026-10-31:** [B6-D07 ADR](./decisions/B6-D07%20-%20Declarative%20Mutable%20World%20Location%20and%20Route%20Facts.md). Original alternatives retained.

**Question:** What happens when accepted narration establishes that a door opens, a bridge collapses or a route is revealed?

- **A (recommended):** Record grounded **current property/relationship assertions** on stable entities (door state, route status or keyed Add/Remove route). Later assertions replace earlier current facts, informing future map and travel context. Do **not** require proof of a key, prior path or mechanically legal transition, and do not invalidate previously accepted travel. **Trade-off:** Typed route/property projection work, with useful continuing world memory.
- **B:** Re-evaluate and rewrite older journeys whenever routes change. **Trade-off:** Retroactive simulation that alters accepted fiction.
- **C:** Show these changes as cosmetic map annotations without replayable world-state facts. **Trade-off:** Simpler, but the narrator may lose important established details.

**Batch 2 status (2026-10-31):** D05 **A with real-anatomy implementation condition**, D06 **A**, D07 **A** accepted separately. No implementation, staging promotion, integration testing, or formal B6 closure approved.

## Batch 3 — accepted Option A (original proposals retained)

These remaining details refine declarative replay and referent uncertainty. They do not add simulation-style feasibility checks.

### B6-D08 — Unknown, explicit absence and current field clearing (accepted Option A)

**Explicitly accepted 2026-10-31:** [B6-D08 ADR](./decisions/B6-D08%20-%20Distinct%20Unknown%20Absent%20and%20Known%20Current%20Facts.md). Original options below remain for provenance.

**Question:** How should a projection distinguish a fact that was never established from a fact explicitly established as absent?

- **A (recommended):** Represent **unknown/unrecorded**, **explicitly absent/none** and **known value** distinctly where the field supports those meanings. A typed Set/Clear assertion updates the field without inventing a default or turning an unknown into zero/false. Use field-specific semantics consistently for item holders, locations, character status and environment. **Trade-off:** Requires careful per-field typing and UI labels.

- **B:** Treat every unknown or cleared value as explicit absence. **Trade-off:** Simple but invents negative facts.

- **C:** Force every field to have a model-generated value. **Trade-off:** Complete-looking records but unreliable narration context.

### B6-D09 — Handling ambiguous or contradictory references within accepted prose (accepted Option A)

**Explicitly accepted 2026-10-31:** [B6-D09 ADR](./decisions/B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md). Original alternatives below remain for provenance. Only resolved grounded events enter the coherent canon; unresolved candidates do not become malformed core events or a mandatory new player approval gate.

**Question:** Two brass keys have the same name, or the passage does not clearly establish which key moved. What becomes structured state?

- **A (recommended):** Commit the resolved, grounded assertions and accept the story prose; leave **individual ambiguous candidates unresolved and noncanonical**, never guessing an item ID or creating a duplicate. Optional uncertainty indicators may explain missing tracked details. **Trade-off:** The tracker may temporarily know less than the prose.

- **B:** Bind the first same-name ID or arbitrarily pick an interpretation. **Trade-off:** Fewer unknowns but silent mistakes.

- **C:** Reject all otherwise accepted story prose until every candidate is resolved. **Trade-off:** Interrupts narration over ordinary ambiguity.

**Inherited:** B6-D04 already forbids guessing entity IDs. This proposal only refines what to commit and how the user sees uncertainty.

### B6-D10 — Removing entities versus clearing their properties (accepted Option A)

**Explicitly accepted 2026-10-31:** [B6-D10 ADR](./decisions/B6-D10%20-%20Entity%20Removal%20Distinct%20from%20Property%20Clearing.md). Original alternatives below remain for provenance. Stable identity continuity must be resolved rather than guessed.

**Question:** How do we distinguish a key that was explicitly destroyed from one whose current holder became unknown?

- **A (recommended):** Keep separate **RemoveEntity** and **ClearProperty** meanings. A grounded entity removal marks the ID as currently removed/inactive; clearing an item's holder only means that placement is unknown/unset. A later accepted assertion may re-establish a previously removed stable identity without inventing a historical explanation or cascading edits to accepted events. **Trade-off:** Small explicit lifecycle/tombstone representation.

- **B:** Delete the ID and cascade-delete all surviving events that reference it. **Trade-off:** Simpler active rows but rewrites current accepted history.

- **C:** Treat unknown placement and entity destruction as the same kind of removal. **Trade-off:** Fewer event types but misleading world memory.

**Batch 3 status (2026-10-31):** **B6-D08 A**, **B6-D09 A** and **B6-D10 A** explicitly accepted in separate ADRs. No implementation, staging promotion or formal B6 design closure is implied.

## B6 design closure assessment — 2026-10-31

**All ten B6 numbered architecture decisions D01–D10 are accepted. B6 is ready for a separate explicit, design-only closure decision, but has NOT been formally closed.** The requesting user asked for an assessment, not a closure sign-off.

| Decision | Accepted disposition |
| --- | --- |
| **D01** | User-directed **narrative-first declarative events** replacement; original D01 A/B/C not accepted |
| **D02** | **Revised A:** single item identity; inventory/equipment derive from latest placement assertion |
| **D03** | **Revised A:** established character location/presence only, no route-history proof |
| **D04** | User-directed **narrator-safe internal ID separation**; no mandatory second model |
| **D05** | **A with explicit condition:** automated anatomy/equipment detachment **only with implemented and enabled structured body-part-to-slot linkage**; unknown destination remains unknown |
| **D06** | **A:** optional typed flexible character status Set/Clear assertions |
| **D07** | **A:** grounded current door, route and mutable environment assertions |
| **D08** | **A:** distinct unknown/unrecorded, explicit absence/none and known value |
| **D09** | **A:** resolved grounded facts committed; ambiguous candidates stay noncanonical while story may stand |
| **D10** | **A:** RemoveEntity distinct from ClearProperty; no cascade rewriting or guessed identity resurrection |

### Why the design decision set can close

- **Product purpose aligned:** Story/narration memory is primary; events assert accepted world facts and do not enforce retrospective fictional possession, travel or causal preconditions.
- **Identity and uncertainty:** Engine-managed stable IDs stay out of narrator prompts; unknown, absence and ambiguous references are not guessed or used to invalidate prose.
- **Current world views:** One physical item identity/current placement, character presence, optional flexible status, and environment conditions project deterministically from one current ordered assertion history. Later accepted facts may survive historical edits with sparse identities.
- **Player approval and durability:** Manual corrections use pending noncanonical batches and explicit Commit/full-composer overlay. Go/SQLite preserves all-or-nothing current-only canon, version/epoch fencing and idempotent retry. Typed unsupported **core** event formats still fail safely.
- **Feature conditionality preserved:** D05 does **not** assume anatomy with real hand/arm references exists. Without implemented structured anatomy/equipment links, no automatic detachment arises merely from prose. Lorebound is not required to implement full anatomical simulation.

### Outstanding engineering contracts and verification, not new accepted B6 choices

- Concrete versioned event schemas and TypeScript reducers for Set/Clear/Create/Remove and keyed relationships, explicit unknown/absence value encoding, entity lifecycle/tombstone and sparse identity semantics, and deterministic ordering/replay fixtures.
- Reference resolver confidence/candidate matching, ambiguous extraction representation and optional feedback UI; safe handling of contradictions without leaking IDs or introducing mandatory model passes.
- Real conditional anatomy/slot feature detection and item placement projections; custom status field types; physical/remote presence; door/route property and hierarchy integration.
- Pending manual-draft overlay, coherent prose/event acceptance, browser/Go Wails integration, SQLite migration/restore, concurrency/idempotency, plugin boundaries and cross-module end-to-end tests. **No passing integration tests or implemented functionality are claimed.**
- Preserve original ADR and staged idea approval history while reconciling further superseded simulation-first/revision-archive descriptions through separately approved planning gates. No production staging promotion or release authorisation.
- The still open **B1 feasibility evidence gates** are not waived by B6 design readiness.

**Recommended disposition:** Request explicit user approval to close B6 **at design level only** and then open the next planning/architecture pass. Do not automatically create a P-B6 closure ADR or mark this review closed merely from a request to assess closure.

## Initial B6 proposals — retained for decision provenance, now superseded

The following original opening text remains solely to show what was proposed before the user's explicit redirection. **It is not current policy or an approved B6 choice.**

<details>
<summary>Original 2026-10-28 B6 Batch 1 proposals (not accepted)</summary>

### Original Batch 1

#### B6-D01 — Resolving references to renamed or removed entities

**Question:** A place, character or item changes its display name, or the player proposes removing an entity that surviving accepted events still reference. How should current canonical identity be handled?

- **A (recommended):** Use immutable stable entity IDs for relationships and events; names, labels and descriptions can change without changing identity. Before accepting an entity removal, validate the resulting current event graph and **reject genuinely dangling required references** with an actionable conflict. Allow valid deliberate deletions when their required dependencies are also explicitly handled. Never invent replacement identities, silently reassign references or rewrite surviving accepted outcomes. **Trade-off:** Explicit corrective work for dependent deletions, reliable replay.
- **B:** Retarget references to another entity with a matching name whenever the original is renamed/deleted. **Trade-off:** Convenient but can silently bind events to the wrong identity.
- **C:** Delete or invalidate all dependent entity records/events automatically. **Trade-off:** Fewer prompts, but unapproved cascading canonical changes.

**Inherited:** B4-D06 already rejects structural invalidity; this question refines identity/reference behaviour across character/item/location domains, not a new blanket ban on editing.

#### B6-D02 — One item, one physical placement across inventory and equipment

**Question:** How should a sword move among a character's inventory, equipped hand, a container and a room without duplicate records?

- **A (recommended):** Give each tracked item a stable ID and one consistent physical custody/placement in the reconstructed state. Equipment slots refer to that **same item**, not a second copy; equipped vs carried remains distinguishable. Validate all moves/equip/unequip actions as coherent **one-batch outcome events**, atomically committing all affected custody/slot relationships. **Ownership claims** remain distinct from actual possession, and unknown location/owner stays unknown. **Trade-off:** Cross-module consistency checking, but no duplicated items.
- **B:** Let inventory, equipment and world locations each maintain independent item copies and reconcile later. **Trade-off:** Easier subsystem-local code but risks mismatched or duplicated items.
- **C:** Treat equipment as descriptive text only, with no reference to tracked item IDs. **Trade-off:** Easier initial schema, but inconsistent with supported equipment/inventory semantics.

**Inherited exception:** Accepted anatomy transformations may automatically unequip/relocate the **same item** to a *grounded valid* placement as part of a validated outcome; this is not a general licence to rewrite unrelated existing history.

#### B6-D03 — Character presence, locations and travel transitions

**Question:** When the narrator says a character has moved, how does Lorebound keep scene presence and physical position consistent without assuming the move from a name mention?

- **A (recommended):** Commit a validated movement/presence outcome referencing actual stable character/location IDs; update a character's authoritative current location, transit status and scene co-presence consistently through the existing ordered event system. **Mention, memory, lore and remote conversation do not imply arrival.** Apply the adventure's selected freeform/strict/valid-multi-hop travel rules to ordinary attempts, preserving the previously accepted explicit player-Story authorial override while still checking technical structural coherence. **Trade-off:** Some domain-specific validation logic, avoids accidental teleportation.
- **B:** Treat any mention of a character in current scene prose as proof the character is physically present. **Trade-off:** Easy extraction, but makes remembered/remote characters teleport.
- **C:** Store narrative scene presence and character location independently without reconciliation. **Trade-off:** Flexible but permits contradictory authoritative physical states.

**Inherited:** A location's hierarchical parent does not create a traversable connection automatically; unknown location is not an assumed current scene.

### Original review status

- **B6-D01:** proposed A/B/C, unapproved.
- **B6-D02:** proposed A/B/C, unapproved.
- **B6-D03:** proposed A/B/C, unapproved.

Further B6 batches can refine anatomy-equipment disposition when no grounded location exists, flexible character status data and dynamic environment/route changes. Exact schemas, error UX and integration tests remain separate engineering contracts. No stage promotion or runtime features are claimed.



</details>

## Decision history

- **2026-10-28 — Opening only:** Following formal B5 design closure, opened B6 Batch 1 as three unapproved options. No B6 selection inferred from the approval of B5 closure.

- **2026-10-28 — Explicit user-directed architectural replacement:** User approved narrative-first declarative Set/Clear and keyed Add/Remove event assertions and requested reconciliation of meaningful active documents. Created [B6-D01 accepted ADR](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md); original B6-D01 A/B/C proposals remain unapproved history. D02/D03 were revised as **new unapproved** questions consistent with accepted purpose.

- **2026-10-29 — Explicit identity/narration separation:** User flagged possible leakage of system stable IDs into roleplay text if fed to the same model, then asked the recommended solution to be recorded for future work. Accepted [B6-D04](./decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md). Internal IDs stay out of prose-producing prompts; engine-side resolution, context isolation and one-pass compatibility remain. D02/D03 still unapproved.

- **2026-10-30 — Explicit batch 1 continuation acceptance:** User approved **B6-D02 A** and **B6-D03 A** from the revised narrative-first options. Two separate ADRs capture the approvals with original proposal history. D01 and D04 remain accepted. Proposed D05–D07 as **unapproved Batch 2**, without stage promotion, implementation or B6 closure.

- **2026-10-31 — Batch 2 accepted:** User approved **B6-D05 A with real structured-anatomy prerequisite, B6-D06 A and B6-D07 A**. ADRs recorded separately. The D05 qualification also appears in anatomy/equipment staging and B6-D02. D08-D10 remain unapproved proposals. No implementation/stage promotion or B6 closure.

- **2026-10-31 — Batch 3 accepted, closure assessed only:** User expressly selected **B6-D08 A, B6-D09 A, B6-D10 A** with instructions to record only approved ADRs, preserve approval history and **assess**, not perform, formal B6 closure. Three accepted ADRs created. Ten numbered B6 decisions resolved (D01/D04 user-directed, D05 qualified A). Design assessed **ready for separate sign-off**, engineering/integration/staging gates still open, B6 review status remains **in-review**.
