---
type: architecture
status: in-review
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

> **OPENED FOR REVIEW ONLY, 2026-10-31.** [P-B6-01](./decisions/P-B6-01%20-%20Design%20Closure%20and%20Deferred%20Event%20Representation%20Contracts.md) formally closes B6 **at design level** after explicit separate user approval. **All B7-D01–D03 alternatives below are proposed and unapproved.** No implementation, tests, stage promotion, B7 selection or B7 design closure is implied.

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

## Batch 1 — proposals, NOT approved

### B7-D01 — Encoding typed world assertions in durable events

**Question:** How should a durable event represent a grounded update to an item holder, character status, place, route, or new/removed entity without becoming a game-mechanics command?

- **A (recommended, proposed):** A **versioned typed event envelope** (durable event identity, sequence position, source/provenance, declaring domain/owner and discriminated operation kind) with **small declarative operations** and domain-registered, type-checked payloads/field definitions. Examples are conceptual `Set(entityId, fieldKey, value)`, `Clear(entityId, fieldKey)`, `Create/RemoveEntity` and keyed relation `Add/Remove`, with special field semantics supplied by the domain. A latest-value reducer deterministically projects current facts. **Trade-off:** Requires a precise domain/type registry but preserves small, clear core and safe migrations.
- **B (proposed):** Store arbitrarily nested unversioned JSON patch objects with freely chosen property names and no stable typed field registry. **Trade-off:** Flexible initially, difficult to migrate/replay or distinguish unknown, none and incorrectly typed data.
- **C (proposed):** Persist procedural domain action commands such as `TransferItem(from,to)`, `WalkAlongRoute`, `EquipWithPreconditions` and rerun action-legality checks on replay. **Trade-off:** Encodes RPG causality that B6 deliberately rejected.

**Not a choice of exact JSON/SQLite layout:** Accepting an envelope approach would not independently approve a field catalogue, extra model pass, mandatory world entities, Go rules engine or complete schema.

### B7-D02 — Core versus optional module event ownership

**Question:** How can typed event schemas and reducers support built-in world records and separately installed optional capabilities without violating the accepted removed-plugin exception?

- **A (recommended, proposed):** Namespace/identify event domain and supported payload version in the typed envelope. **Required core** types must have an available supported reducer/migration or safely fail replay. **Optional plugin-owned** event effects are separated so that disabling/removing their plugin does **not** require interpretation, migration, reinstallation or replay of its unavailable custom effects; preserve current prose, core data, and safely readable event bytes without pretending missing plugin world state is reconstructed. Shared/core facts previously committed as core assertions still replay independently. **Trade-off:** Requires explicit domain ownership and boundary testing.
- **B (proposed):** Flatten all plugin and core effects into undifferentiated event JSON without indicating whether absent functionality is required or optional. **Trade-off:** Difficult to identify safe skip/disable boundaries.
- **C (proposed):** Require every historical optional plugin to remain installed and runnable for any adventure replay. **Trade-off:** Simpler full replay but directly contradicts the accepted plugin-removal contract.

This decision may refine schema ownership but cannot overturn existing core fail-closed or removed-plugin policy.

### B7-D03 — Lifecycle of ambiguous, noncanonical extracted facts

**Question:** When the accepted story is saved but one potential item/entity assertion cannot be resolved, should Lorebound retain a *hint* about that omitted structured fact, and for how long?

- **A (recommended, proposed):** Keep unresolved interpretation candidates as **transient noncanonical diagnostics** associated with the current generation/result, potentially shown unobtrusively for that session. Do not write them to canonical event history, create a mandatory pending-manual batch or block the composer. If later player action explicitly makes a correction, it follows the already accepted manual-Commit workflow. **Trade-off:** Minimal storage/UX complexity, but diagnostics may be lost on reload.
- **B (proposed):** Persist unresolved candidate interpretations in a **separate optional noncanonical SQLite diagnostic store** (not canonical events or mandatory pending manual drafts), allowing inspection after reload. **Trade-off:** Better continuity of uncertainty but extra retention, pruning, provenance and stale-edit rules.
- **C (proposed):** Silently discard unresolved candidates immediately without offering inspection or later indication that some structured facts could not be tracked. **Trade-off:** Simplest behaviour, but little transparency for the player.

**Existing B6-D09 approval stands regardless of choice:** Commit only resolved grounded assertions and the otherwise valid accepted narrative together; never guess an ID, reject all prose merely for ambiguity or persist a malformed required-core event. No new general approval overlay.

## Subsequent potential review subjects (unapproved)

- **B7-D04+:** precise typed encoding for unknown vs known-absent vs cleared field values; entity removal/reintroduction and sparse identity; keyed relation ordering; field-schema changes and upgrade migrations; deterministic replay examples and provenance; ID-safe narrator/interpreter response protocol and model-specific schema limitations.
- All concrete table structures, payload JSON schemas, UI, handlers, library migration tests and plugin loading behaviour remain unimplemented unless separately authorised in later implementation work.

## Review status and decision history

- **2026-10-31 — Opened only:** User explicitly approved **formal B6 design closure and opening the next architecture pass** after the B6 closure assessment (“Sounds good proceed”). The accepted authority is recorded in [P-B6-01](./decisions/P-B6-01%20-%20Design%20Closure%20and%20Deferred%20Event%20Representation%20Contracts.md). Opening **B7** is permitted, but **none of B7-D01/D02/D03 is accepted**. This register proposes A/B/C alternatives for subsequent explicit user review; it does not implement code or promote staged ideas.
