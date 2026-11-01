---
type: architecture
status: closed-design-only
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
tags:
  - planning/architecture
  - pass-b
  - event-representation
  - narrative-interpretation
---

# Pass B7 — Event Representation and Narrative Interpretation Contract Review

> **FORMALLY CLOSED AT DESIGN LEVEL, 2026-10-31, after distinct user authorisation.** [P-B7-01 closure ADR](./decisions/P-B7-01%20-%20Design%20Closure%20and%20Deferred%20Spatial%20Canvas%20Integration%20Contracts.md) records that after the ten-decision **assessment** and a direct question about closure and B8 opening, the user answered **“yes proceed.”** The [B8 spatial canvas and integration review](./Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) is **open only, with D01–D03 unapproved**. The assessment and pre-closure wording retained below are **historical snapshots**, not present review status. B7 closure makes no code, integration-test, staging-promotion or implementation-readiness claim.



> **OPENED FOR REVIEW ONLY, 2026-10-31.** [P-B6-01](./decisions/P-B6-01%20-%20Design%20Closure%20and%20Deferred%20Event%20Representation%20Contracts.md) formally closes B6 **at design level** after explicit separate user approval. **All ten B7 numbered decisions D01–D10 now have explicit accepted dispositions on 2026-10-31**: D01/D02 A, D03 **C**, D04–D09 A, and D10 an **explicit later user-directed spatial-canvas correction**. Original proposal alternatives remain below as history. **Later explicit B7-D10 correction: the player-facing world map is a persistent, coordinate-pinned, semantically scaled spatial canvas with meaningful grouped places and link lengths.** D06's graph describes route *connectivity only* and must not arbitrarily arrange geography. **B7-D10 is accepted by direct user instruction; Batch 3 D07–D09 was subsequently explicitly approved as Option A.** B7 has been **assessed for design closure only**, not formally closed. No implementation, tests or stage promotion is implied.

## Scope and purpose

**B6 settled what events *mean*:** Lorebound is a narration-first world-memory engine. Grounded current-fiction assertions use typed Set/Clear/Create/Remove and keyed relations. They do **not** require proof that earlier fictional possession, route or cause made the outcome possible. One current ordered history replays from Turn 0; later assertions win for their own current fields; sparse IDs/unknowns are legitimate. It is not an RPG simulation engine.

**B7 refines how to encode and route those facts** across S05 Canonical History/Reconstruction, S06 Coordination/Capabilities, S07 Interpretation, S09 Lore/Context, S10 Characters/Items, S11 World and S12 Go/SQLite. It must not reopen B6 or commit to an implementation-ready schema prematurely.

### Binding inherited contracts

1. [B3-D04](./decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md): one current story/current ordered event history, not a retained passage/event revision archive or inactive audit stream.
2. [B4-D01](./decisions/B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md): manual corrections may have independent positions between turns.
3. [B4-D04](./decisions/B4-D04%20-%20Coordinated%20Migration%20of%20Current%20Event%20Schemas.md) and [B4-D07](./decisions/B4-D07%20-%20Fail%20Safe%20Atomic%20Event%20Migration.md): current supported event formats migrate in a coordinated atomic upgrade; required-core unreadable records fail safely. No unconditional backwards-upcaster archive.
4. [B6-D01](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B6-D08](./decisions/B6-D08%20-%20Distinct%20Unknown%20Absent%20and%20Known%20Current%20Facts.md) and [B6-D10](./decisions/B6-D10%20-%20Entity%20Removal%20Distinct%20from%20Property%20Clearing.md): declarative assertions, unknown distinct from explicit absence, lifecycle removal distinct from property clearing; no fictional causality gate or automatic cascade.
5. [B6-D04](./decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) and [B6-D09](./decisions/B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md): narrator gets no internal IDs; engine binds natural-language references separately; unresolved extractions remain noncanonical while valid prose and other grounded facts may commit.
6. [B6-D02](./decisions/B6-D02%20-%20One%20Item%20Identity%20and%20Declarative%20Equipment%20Placement.md), [B6-D03](./decisions/B6-D03%20-%20Grounded%20Declarative%20Location%20and%20Scene%20Presence.md), [B6-D05](./decisions/B6-D05%20-%20Conditional%20Anatomy%20Linked%20Equipment%20Detachment.md), [B6-D06](./decisions/B6-D06%20-%20Flexible%20Declarative%20Character%20Status%20Assertions.md), [B6-D07](./decisions/B6-D07%20-%20Declarative%20Mutable%20World%20Location%20and%20Route%20Facts.md): one item placement, grounded character presence, **implemented structured anatomy prerequisite** for automatic equipment clearing, flexible status and mutable world facts.
7. [B2-D08](./decisions/B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md) plus staged [IDEA-0047](../staging/Native%20Gameplay%20Capability%20Registry.md): unsupported **required core** event is unsafe to skip; removed/disabled **optional plugin-specific** state is a distinct accepted exception. Never require reinstalling removed plugins to continue story.
8. B3 atomic Go/SQLite version/epoch/idempotency, explicit player-Commit overlay for manual corrections; B5 validated Quick Start auto-commit and separately approved optional worldbuilding. All remain unchanged.

## Batch 1 — accepted options (original proposals retained)

### B7-D01 — Encoding typed world assertions in durable events (Option A accepted)

**Accepted 2026-10-31:** [B7-D01 ADR](./decisions/B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md). The original unapproved A/B/C text below remains to preserve the proposal history; Option A is now binding.

**Question:** How should a durable event represent a grounded update to an item holder, character status, place, route, or new/removed entity without becoming a game-mechanics command?

- **A (recommended, proposed):** A **versioned typed event envelope** (durable event identity, sequence position, source/provenance, declaring domain/owner and discriminated operation kind) with **small declarative operations** and domain-registered, type-checked payloads/field definitions. Examples are conceptual `Set(entityId, fieldKey, value)`, `Clear(entityId, fieldKey)`, `Create/RemoveEntity` and keyed relation `Add/Remove`, with special field semantics supplied by the domain. A latest-value reducer deterministically projects current facts. **Trade-off:** Requires a precise domain/type registry but preserves small, clear core and safe migrations.
- **B (proposed):** Store arbitrarily nested unversioned JSON patch objects with freely chosen property names and no stable typed field registry. **Trade-off:** Flexible initially, difficult to migrate/replay or distinguish unknown, none and incorrectly typed data.
- **C (proposed):** Persist procedural domain action commands such as `TransferItem(from,to)`, `WalkAlongRoute`, `EquipWithPreconditions` and rerun action-legality checks on replay. **Trade-off:** Encodes RPG causality that B6 deliberately rejected.

**Not a choice of exact JSON/SQLite layout:** Accepting an envelope approach would not independently approve a field catalogue, extra model pass, mandatory world entities, Go rules engine or complete schema.

### B7-D02 — Core versus optional module event ownership (Option A accepted)

**Accepted 2026-10-31:** [B7-D02 ADR](./decisions/B7-D02%20-%20Core%20and%20Optional%20Plugin%20Event%20Ownership.md). The accepted option maintains both required-core fail-closed replay and the removed-plugin optional-state exception.

**Question:** How can typed event schemas and reducers support built-in world records and separately installed optional capabilities without violating the accepted removed-plugin exception?

- **A (recommended, proposed):** Namespace/identify event domain and supported payload version in the typed envelope. **Required core** types must have an available supported reducer/migration or safely fail replay. **Optional plugin-owned** event effects are separated so that disabling/removing their plugin does **not** require interpretation, migration, reinstallation or replay of its unavailable custom effects; preserve current prose, core data, and safely readable event bytes without pretending missing plugin world state is reconstructed. Shared/core facts previously committed as core assertions still replay independently. **Trade-off:** Requires explicit domain ownership and boundary testing.
- **B (proposed):** Flatten all plugin and core effects into undifferentiated event JSON without indicating whether absent functionality is required or optional. **Trade-off:** Difficult to identify safe skip/disable boundaries.
- **C (proposed):** Require every historical optional plugin to remain installed and runnable for any adventure replay. **Trade-off:** Simpler full replay but directly contradicts the accepted plugin-removal contract.

This decision may refine schema ownership but cannot overturn existing core fail-closed or removed-plugin policy.

### B7-D03 — Lifecycle of ambiguous, noncanonical extracted facts (Option C accepted)

**Accepted 2026-10-31:** [B7-D03 ADR](./decisions/B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md). **The user selected C, not recommended A.** Genuinely unresolved automatic extraction candidates are discarded **without notification, storage, deferred inspection or a forced approval gate**. Other grounded accepted facts and prose still commit; malformed required-core events and real storage failures must not be silently ignored. The original options below remain historical alternatives.

**Question:** When the accepted story is saved but one potential item/entity assertion cannot be resolved, should Lorebound retain a *hint* about that omitted structured fact, and for how long?

- **A (recommended, proposed):** Keep unresolved interpretation candidates as **transient noncanonical diagnostics** associated with the current generation/result, potentially shown unobtrusively for that session. Do not write them to canonical event history, create a mandatory pending-manual batch or block the composer. If later player action explicitly makes a correction, it follows the already accepted manual-Commit workflow. **Trade-off:** Minimal storage/UX complexity, but diagnostics may be lost on reload.
- **B (proposed):** Persist unresolved candidate interpretations in a **separate optional noncanonical SQLite diagnostic store** (not canonical events or mandatory pending manual drafts), allowing inspection after reload. **Trade-off:** Better continuity of uncertainty but extra retention, pruning, provenance and stale-edit rules.
- **C (proposed):** Silently discard unresolved candidates immediately without offering inspection or later indication that some structured facts could not be tracked. **Trade-off:** Simplest behaviour, but little transparency for the player.

**Existing B6-D09 approval stands regardless of choice:** Commit only resolved grounded assertions and the otherwise valid accepted narrative together; never guess an ID, reject all prose merely for ambiguity or persist a malformed required-core event. No new general approval overlay.

## Batch 1 disposition — accepted 2026-10-31

| Decision | Approved | Current authority |
| --- | --- | --- |
| B7-D01 | **A** | [Typed event envelope and declarative payloads](./decisions/B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) |
| B7-D02 | **A** | [Required core vs optional plugin event ownership](./decisions/B7-D02%20-%20Core%20and%20Optional%20Plugin%20Event%20Ownership.md) |
| B7-D03 | **C, contrary to the original A recommendation** | [Immediate silent discard of ambiguous automatic extraction candidates](./decisions/B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md) |

Original proposals and dates remain intact. No D04–D06 approval or B7 closure inferred.

## Batch 2 — accepted Option A for D04–D06 (original proposals retained)

### B7-D04 — Typed representation of unknown, explicit absence and clearing (accepted Option A)

**Approved 2026-10-31:** [B7-D04 ADR](./decisions/B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md). Original A/B/C alternatives retained.

**Question:** How should a versioned declarative event/field schema represent B6-D08's distinction between no known value, an explicit assertion of absence and a known value, without overloading JavaScript `null` and truthiness?

- **A (recommended, proposed):** Use a **field-defined tagged value semantics**: each supported property has a registered value type and explicit result meanings for **unknown/unrecorded**, **known absence/none** (when applicable), and **known value**. `Set` carries a validated typed result; `Clear` intentionally restores a declared unset/unknown state, not arbitrary false/zero/absence. Domain-specific fields can define their exact tags and display text. Do not silently coerce missing, `null`, `false` or `0` into one state. **Trade-off:** A little schema boilerplate for unambiguous replay/migrations.
- **B (proposed):** Use untagged JSON `null` both for unknown and explicitly absent, letting the UI infer intent by convention. **Trade-off:** Small payload, but loses the previously accepted distinction.
- **C (proposed):** Treat a `Clear` as “the last earlier value becomes current again,” effectively restoring history on every clear rather than representing a new current assertion. **Trade-off:** Different semantics depending on old events and surprising for narrative correction.

**Existing B6-D08 is binding:** This proposal is about an encoding discipline, not whether unknown and absent should be different.

### B7-D05 — Encoding entity removal and later re-establishment (accepted Option A)

**Approved 2026-10-31:** [B7-D05 ADR](./decisions/B7-D05%20-%20Event%20Ordered%20Entity%20Lifecycle%20and%20Reestablishment.md). Original A/B/C alternatives retained.

**Question:** How should the typed reducer remember an item/character/place that the story says was destroyed/removed, yet still allow later accepted narration to re-establish the same stable identity?

- **A (recommended, proposed):** Record **an explicit current lifecycle assertion** (`RemoveEntity`/equivalent) on the existing stable ID, interpreted by the shared ordered reducer. A later grounded `Create/Restore/Set`-style fact about the **same unambiguously resolved ID** may establish its current active status again, preserving any missing details as unknown. No independent authoritative tombstone database, name-based ID guessing, cascade deletion or retrospective survival check. **Trade-off:** Needs exact lifecycle fields and replay rules, but stays within one canon.
- **B (proposed):** Physically erase the stable ID and all related current events on `RemoveEntity`. **Trade-off:** Simple active listing, but contradicts B6-D10's surviving-reference semantics.
- **C (proposed):** Track lifecycle in a separate permanent removal ledger outside the ordered event stream, and have it override later story assertions. **Trade-off:** Extra state source can contradict accepted future narration.

**Existing B6-D10 is binding:** RemoveEntity differs from clearing holder/location; do not infer that similarly named items are the same identity.

### B7-D06 — Keyed relationship assertions and deterministic replay (accepted Option A)

**Approved 2026-10-31:** [B7-D06 ADR](./decisions/B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md). The user initially asked whether the map was a graph object. **A later explicit correction [B7-D10](./decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) establishes the user-facing map is instead a semantic spatial canvas:** persisted location coordinates, same-surface nested groups, meaningful distance/scale and non-arbitrary link lengths. **D06's graph remains only a logical derived topology** from explicit accepted routes; containment grouping is distinct, and neither a JavaScript `Graph` class nor a concrete spatial storage/coordinate scheme was selected. Original D06 proposals remain as historical text.

**Question:** How should added/removed relationships (route connections, named associations or ownership claims) work when the same fact is repeated, contradicted or changes during the story?

- **A (recommended, proposed):** Represent each supported relation by a **typed keyed identity** including domain/relation type and endpoint or relation-target identity. Apply `AddRelation`/`RemoveRelation` as **idempotent current assertions** in the same total order: the latest assertion for that specific relation key decides whether the relation currently holds. Allow sparse typed endpoints whose fictional introduction may be missing, rather than demanding old story prerequisites. **Trade-off:** Requires exact key, direction and cardinality definitions, but avoids duplicate edges and replay ambiguity.
- **B (proposed):** Append repeated unkeyed relationship objects indefinitely and infer the current graph from their array order/wording. **Trade-off:** Duplicates and ambiguous removals.
- **C (proposed):** Validate every added route/relationship against all mechanically plausible earlier travel or ownership transitions and reject outcomes lacking proof. **Trade-off:** Contradicts narrative-first B6-D01.

**Batch 2 status, 2026-10-31:** **B7-D04 A**, **B7-D05 A** and **B7-D06 A** accepted in three separate ADRs. The D06 map/graph clarification refers to already accepted IDEA-0033/0035 logical topology. **No actual `Graph` object/storage layout, implementation, tests, stage promotion or B7 closure is approved.**

## Batch 2 accepted disposition — 2026-10-31

| Decision | Approved | Current authority |
| --- | --- | --- |
| B7-D04 | **A** | [Typed unknown/absence/Clear result semantics](./decisions/B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md) |
| B7-D05 | **A** | [Ordered entity lifecycle and re-establishment](./decisions/B7-D05%20-%20Event%20Ordered%20Entity%20Lifecycle%20and%20Reestablishment.md) |
| B7-D06 | **A** | [Keyed relations and derived travel graph](./decisions/B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md) |

**Current reading after later B7-D10:** D06's **graph** is only a **logical current route-relationship projection**: stable IDs as route endpoints and current explicit Add/Remove route links. The **actual map is a saved semantic spatial canvas**; pinned coordinates/group footprints and meaningful relative scale are independent world-map facts that determine geographic positioning. This refinement was expressly approved by the user after D06; do not substitute arbitrary graph auto-layout.

## Later user-directed map correction — B7-D10 ACCEPTED (2026-10-31)

**Approval:** The user explicitly stated, *“locations should be rather a canvas, not a graph”*, directed that location coordinates be **pinned and persist**, that **the same canvas** spatially group empires, cities, buildings and rooms, and that **connection lengths/positions meaningfully express distance/world scale**. The user requested that this be the **actual definition, not just the graph**. This direction is now accepted in [B7-D10](./decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md), as a chronological refinement of approved B7-D06 rather than an option selection for D07–D09.

The accepted **user-facing map** is a **single pannable/zoomable persistent semantic spatial canvas** with stable location identities, durable placed coordinates, nested spatial groups/extents and distance-sensitive visual geometry. The **logical travel graph** remains **a separate overlay/view of explicit route connectivity**; the acyclic containment hierarchy provides group relationships, not assumed routes. Graph auto-layout is **not** authoritative positioning and cannot rearrange pinned geography. Panning/zooming is visual-only; deliberately moving a pin changes *saved semantic map placement*, subject to existing world-edit approval, without automatically relocating characters or altering routes/containment. Unknown coordinates are not invented from narrative mentions.

**Preserved open implementation choices:** Exact coordinate system and scale units, multi-level transforms, spatial region boundaries, route shape/path vs straight-line distance, schema and map rendering technology. **D07–D09 were subsequently accepted as Option A**; their initial proposal status is preserved in the chronological original text. No implementation, staging promotion or formal B7 closure.

## Batch 3 — accepted Option A for D07–D09 (original proposals retained)

### B7-D07 — Handling domain field/type schema changes over application upgrades (Option A accepted)

**Explicit acceptance 2026-10-31:** [B7-D07 ADR](./decisions/B7-D07%20-%20Versioned%20Field%20Registry%20and%20Atomic%20Meaning%20Preserving%20Event%20Migrations.md). Original A/B/C alternatives below remain historical; this refines **B4-D04 Option B**, not an unapproved switch to perpetual upcasters.

**Question:** A built-in custom status field or core event payload changes type/shape in a later app version. What preserves the meaning of the currently stored event history?

- **A (recommended, proposed):** A **versioned field/type registry with deterministic migration transformations** for supported current events. At upgrade, perform the previously accepted coordinated atomic conversion of the current stored records, preserving the meaning of explicit unknown/absent/known values and keyed relation identities. Unsupported required-core conversions fail safely without partial state; removed optional plugin-owned data retains its separate exception. **Trade-off:** Requires conversion fixtures and schema-version discipline.
- **B (proposed):** Reinterpret existing stored event payloads using whichever field definitions happen to be loaded now. **Trade-off:** Faster but could silently change old accepted facts.
- **C (proposed):** Always let every field's old format coexist indefinitely and upcast lazily without migrating current stored events. **Trade-off:** Supports old data but conflicts with the previously accepted coordinated current-record upgrade direction under B4-D04.

**Boundary:** B4-D04 already approved the coordinated migration strategy. D07 would specify how the B7 typed field registry participates, rather than reversing that earlier decision.

### B7-D08 — Narrator-to-interpreter reference protocol (Option A accepted)

**Explicit acceptance 2026-10-31:** [B7-D08 ADR](./decisions/B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md). The narrator uses grounded natural-language provisional references; private engine ID binding and an isolated non-narrating stage are allowed. **Single-pass, same-model routing and B7-D03 C silent omission of ambiguous candidate interpretations remain binding.**

**Question:** In a configurable single-pass or multi-stage generation pipeline, what provisional reference form should the narrator/interpreter use before the engine binds stable IDs?

- **A (recommended, proposed):** **Natural-language provisional references** (name, description and passage grounding) in **any request that may emit roleplay prose**. The engine binds them against a private candidate map afterward. Only a **separately isolated, non-narrating** interpretation context may see internal stable IDs. If references cannot be grounded, silently omit those candidate assertions under B7-D03 C without blocking otherwise valid prose. The same selected model may serve both roles. **Trade-off:** Needs a small typed provisional-result boundary and careful prompt isolation.
- **B (proposed):** Give the combined prose+event model internal entity IDs and depend on “do not print IDs” instructions. **Trade-off:** Easier event JSON but risks leaking engine identifiers in story prose.
- **C (proposed):** Require every adventure to run a separate second AI model for event/ID interpretation, even where the user's single-pass configuration is sufficient. **Trade-off:** Additional latency/cost and contradicts the accepted optional routing design.

**Boundary:** B6-D04 already established no IDs in narrator prompts. This would refine the output/hand-off protocol and validation, not reopen that approval.

### B7-D09 — Provenance and replay verification (Option A accepted)

**Explicit acceptance 2026-10-31:** [B7-D09 ADR](./decisions/B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md). Durable minimal current accepted story/manual-correction provenance and total ordering, with deterministic replay/Undo/Fork/migration regression obligations. **Does not resurrect an immutable revision archive** or claim real tests passed.

**Question:** How should an accepted event identify the story passage or manual correction establishing it, and how can the engine verify replay produces the same current state after Undo, Keep Later Turns, Fork or migration?

- **A (recommended, proposed):** Store **minimal durable origin/provenance and total-order metadata** on canonical accepted events (story-passage association or independent committed manual correction), without maintaining old immutable passage revision archives. Specify deterministic replay and schema-migration regression fixtures over current history, including deletions leaving sparse IDs and one-item/one-location projections. **Trade-off:** More metadata and test cases, but reproducible state and diagnosable implementation errors.
- **B (proposed):** Persist only event payloads and rely on prose/name inference later to recover their origin and ordering. **Trade-off:** Fragile Undo/Fork and source grounding.
- **C (proposed):** Restore a complete immutable revision/audit archive for all old passage and event versions merely to track provenance. **Trade-off:** Reverses the accepted current-only B3-D04 model.

**Batch 3 status (2026-10-31):** **B7-D07 A, B7-D08 A and B7-D09 A explicitly accepted** in separate GitHub ADRs. Exact type/schema/coordinate representations, code, tests, stage promotion and **formal B7 design closure** are not thereby approved.

## Batch 3 accepted disposition — 2026-10-31

| Decision | Explicitly approved | Accepted record |
| --- | --- | --- |
| B7-D07 | **A** | [Versioned field registry and atomic meaning-preserving current-event migrations](./decisions/B7-D07%20-%20Versioned%20Field%20Registry%20and%20Atomic%20Meaning%20Preserving%20Event%20Migrations.md) |
| B7-D08 | **A** | [Narrator-safe provisional names and isolated internal ID binding](./decisions/B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md) |
| B7-D09 | **A** | [Minimal source provenance and deterministic current replay verification](./decisions/B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md) |

The user's request was to **record approvals and assess** closure, **not to create a formal B7 closure ADR**. This review remains `status: in-review` until distinct explicit closure authorisation.

## B7 architecture-design closure assessment — 2026-10-31

**Decision-set status: 10 of 10 B7 numbered decisions have explicit accepted dispositions. Architecture design is ready for a separate design-only closure sign-off, provided the deferred engineering contracts are carried forward and not misrepresented as implemented. No formal closure has yet been approved.**

| Decision | Current accepted authority |
| --- | --- |
| **D01** | **A:** versioned typed declarative event envelope and domain payloads |
| **D02** | **A:** required core vs optional plugin-owned effect/reducer boundary |
| **D03** | **C, contrary to prior recommended A:** silently discard unresolved *automatic* extraction suggestions, but not genuine technical/transaction failures |
| **D04** | **A:** field-typed unknown, explicit absence and known values; Clear means unset, not restoration of an older value |
| **D05** | **A:** event-ordered RemoveEntity/re-establish of unambiguously identified stable identity |
| **D06** | **A:** typed keyed Add/Remove relations and a **derived logical route graph**, **not** the entire geographic map |
| **D07** | **A:** versioned typed field registry, coordinated meaning-preserving atomic migration of current records under B4-D04 **Option B** |
| **D08** | **A:** narrator-safe grounded provisional natural references; private post-generation ID binding, same-model and single-pass strategies preserved |
| **D09** | **A:** minimal current event source provenance and total order, with deterministic replay/regression obligations but no revision archive |
| **D10** | **Explicit user-directed spatial map refinement, not a D10 A/B/C choice:** **one persistent coordinate-pinned, semantically scaled canvas** with nested empires/cities/buildings/rooms and distance-sensitive route visuals. The travel graph remains a separate overlay/topology |

### Why design-only closure is reasonable

1. **Semantics and representation are aligned.** B6's narrative-first current assertions are now associated with typed/versioned event/field ownership, field value semantics, lifecycle, keyed relations and replay/provenance. A later accepted story fact does not require a mechanically valid earlier fictional cause.
2. **Narrator identity privacy is explicit.** A model that can emit RP prose never sees private ID mappings. The engine resolves provisional natural references; ambiguous automatic candidates are **discarded without hints or persistence**, while real technical failures remain reportable.
3. **Optional capabilities and migrations remain coherent.** Required-core records fail safely if unsupported, optional removed-plugin effects need not be reconstructed, and supported current formats are converted via B4's coordinated atomic upgrade approach.
4. **World map is correctly defined.** **D10's semantic spatial canvas supersedes any reading of D06 as an arbitrary graph layout.** Spatial pins, meaningful relative scale and nested group geography persist. Connectivity and containment remain distinct. Canvas position is not a travel/route assertion.
5. **Accepted current-only history remains authoritative.** Events carry only minimal source and order metadata; no undeclared immutable passage/event revisions or second canonical map/graph state is introduced.

### Deferred interface and verification contracts: NOT approvals and NOT implemented

- **Concrete typed JSON/event union, schema registry and migrations:** field/tag schemas, unknown/known-absent value encoding, lifecycle restore details, relation-key shapes/cardinality, replay order, plugin namespace/version handling, TypeScript reducer/Go transport/SQLite representation.
- **Persistent geographic canvas engineering:** explicit spatial coordinate system and units, nested group frame transforms, meaningful visual/route distances, region footprints, unplaced-node UX, user map-pin editing flow and replay/migration of current map-position assertions; **arbitrary layout must not change pinned semantics**. These are **substantive follow-up implementation interface details** introduced by D10, not permission to omit the accepted spatial canvas.
- **Identity resolution and LLM adapters:** no-ID narrator prompt construction, single-pass provisional result schema, isolated same-model non-narrator interpretation, type/grounding checks, no silent swallowing of real errors.
- **Real acceptance tests and integration:** replay after Undo/Delete After/Keep Later Turns/Fork, sparse references, status/items/locations/route projections, semantic map persistence, removed plugins, incompatible core events, migration rollback, Go/SQLite atomicity/idempotency/version and epoch fences, manual pending Commit/full-composer overlay. **No runtime tests are asserted to have passed.**
- **Other historic gates:** B1 real-host feasibility and cross-module integration evidence remains outstanding. No code implementation, staging-to-production promotion, production approval, release readiness or B8 opening follows from this assessment alone.

**Assessment/recommendation:** **B7 is ready for explicit separate design-only closure approval**. That closure should carry the above engineering contracts into a later technical/design pass or implementation planning, particularly the **B7-D10 persistent spatial-canvas representation**. Do not auto-create a P-B7 closure ADR, mark B7 `closed`, or open the next pass solely because the user asked to **assess** B7 closure.

## Subsequent potential review subjects (unapproved)

- **B7-D10 is accepted by explicit user correction** as the persistent semantic spatial canvas design; do not reuse its ID for a later proposal. **B7-D11+:** exact spatial coordinate reference/group transforms, route/link geometry, graph-index/cache layout, type/field migration fixtures, model-specific structured output and adapter/error handling remain **unapproved engineering refinements**, not secretly approved extra decisions. **D07–D09 are accepted Option A**, but B7 itself awaits separate formal design closure approval.
- All concrete table structures, payload JSON schemas, UI, handlers, library migration tests and plugin loading behaviour remain unimplemented unless separately authorised in later implementation work.

## Review status and decision history

- **2026-10-31 — Opened only:** User explicitly approved **formal B6 design closure and opening the next architecture pass** after the B6 closure assessment (“Sounds good proceed”). The accepted authority is recorded in [P-B6-01](./decisions/P-B6-01%20-%20Design%20Closure%20and%20Deferred%20Event%20Representation%20Contracts.md). Opening **B7** is permitted, but **none of B7-D01/D02/D03 is accepted**. This register proposes A/B/C alternatives for subsequent explicit user review; it does not implement code or promote staged ideas.

- **2026-10-31 — Batch 1 explicit approval:** User selected **B7-D01 A, B7-D02 A, B7-D03 C** (not D03's recommended A), asking to record only accepted ADRs and continue B7. Created three accepted ADRs. **Unresolved interpretation suggestions are silently discarded**, not retained in a session/SQLite diagnostic store; true technical failures remain reportable. Batch 2 D04–D06 proposed, **unapproved**, with no code, promotion or B7 closure.

- **2026-10-31 — Batch 2 explicit acceptance and map clarification:** User selected **B7-D04 A, B7-D05 A, B7-D06 A** and asked whether the map should be recorded as a graph object. Three accepted ADRs created. D06 records the previously accepted **logical travel graph** (location nodes, explicit route edges) separately from the parent/child containment hierarchy, with graph derived from event replay; **no concrete `Graph` class/object, graph library, table, or directionality chosen**. Batch 3 D07–D09 options proposed but **unapproved**. No code, tests, stage promotion or B7 closure.

- **2026-10-31 — Later explicit B7 map definition correction:** User clarified that locations must be **persistently pinned on a meaningful spatial canvas**, with nested groups for empires/cities/buildings/rooms and link lengths reflecting world distances, **rather than a map defined only as a graph**. Accepted [B7-D10](./decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) as a new user-directed chronological refinement to D06 and IDEA-0037; updated relevant current architecture and staging docs. D07–D09 remain unapproved proposals; no concrete graph class, coordinate units, implementation or stage promotion accepted.

- **2026-10-31 — Batch 3 explicit approvals and assessment only:** User approved **B7-D07 A, B7-D08 A and B7-D09 A**, instructing separate accepted GitHub ADRs, approval history preservation and an **assessment** of B7 design closure. Three individual ADRs created. **Ten of ten B7 decisions now accepted** (D03 C, D10 an explicit spatial-canvas correction), and design-only closure assessed ready for **separate sign-off**; no P-B7 closure ADR or status change, no stage promotion/implementation/testing claim, and B7-D10 map-coordinate engineering remains deferred.

- **2026-10-31 — Formal design-only closure after separate approval:** Following completion of accepted B7-D01–D10 and the review's earlier **assessment only**, the assistant explicitly asked whether to **formally close B7 and proceed to B8**, and the user replied **“yes proceed.”** [P-B7-01](./decisions/P-B7-01%20-%20Design%20Closure%20and%20Deferred%20Spatial%20Canvas%20Integration%20Contracts.md) records the separate sign-off. This B7 review is now **closed-design-only**. The earlier `in-review`/“no closure yet” language within the preserved assessment accurately described that preceding point in time. [B8](./Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) has only **unapproved proposals**. No implemented schemas, tests, promotion or stage change are implied.
