---
id: "IDEA-0039"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Lorebound Vision Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Event-Sourced World History

## Idea
Persist accepted changes as append-only events rather than duplicating full world state every turn.

## Why this idea matters
Makes undo, historical reconstruction and multi-entity consistency possible.

## Accepted direction
- **Append-only history of accepted state changes:** Record validated, committed changes to persistent world state as ordered events instead of duplicating the entire world record for every story turn. Preserve historical events and their provenance even when current story revisions later supersede their effects.
- **Traceable event records:** Each committed event identifies its source story turn and/or text revision, affected stable entity IDs, event type, deterministic ordering, and the relevant validation/acceptance information. Exact event ID, schema and payload shapes require refinement.
- **Deterministic current-state reconstruction:** A defined reducer/projection can apply the active valid event sequence to rebuild character, item, location, equipment, environmental and other supported canonical state consistently.
- **History and current truth are distinct:** Append-only recording does not require obsolete events to stay active in the current story. The system must support eventual invalidation, supersession or branch-aware selection of events derived from revised/undone narrative, with precise algorithms still open.
- **Foundation for undo and historical editing:** Retain relationships between events, originating story revisions and affected entities so changed earlier passages can be reconciled with later state without losing auditability. Detailed edit/undo policy is separately considered in ideas IDEA-0040 onward.
- **Cross-entity coherence:** Events affecting multiple connected entities must be validated and applied consistently; replay cannot generate duplicated items, contradictory character positions, or impossible travel outcomes.
- **Validation boundary:** Failed, rejected or uncommitted AI-proposed operations must not enter the active authoritative history as accepted world-state changes. Diagnostic/proposed operations may be recorded separately if refined later.
- **Optional periodic snapshots:** Permit materialised state snapshots or checkpoints to accelerate restoration/replay. They are optimisations derived from authoritative accepted history, not independent competing sources of truth. Frequency and invalidation policies are left open.
- **Storage and schema future-proofing:** Record enough version/provenance information for safe replay and later migrations without committing today to a fixed schema-versioning or dependency-resolution mechanism.
- **Not a shipped implementation:** This note records an accepted staging direction and does not approve production or claim an event system exists.

## Proposed behaviour
After the generation pipeline has validated a world-state operation, persist its accepted event and associated source turn/story revision in authoritative history in the defined order. State projections/reducers apply only events belonging to the selected valid history to reconstruct current locations, possessions, status and other records. When earlier prose is edited or undone, preserve historical traceability while allowing invalidated event effects to be excluded or reconciled; exact branching and dependency policies remain for refinement. Use optional snapshots/checkpoints to reduce replay work, ensuring a checkpoint cannot remain authoritative after its supporting event history has changed.

## Alternatives and trade-offs
Full world snapshots each turn can be simpler for point-in-time reads but duplicate unchanged data and weaken per-change provenance. Event sourcing gives ordered, explainable world changes and revision reconstruction at the cost of deterministic reducers, migration discipline and complex historical invalidation. A **hybrid event log plus periodic derived snapshots** is allowed as a performance optimisation, but its checkpoint cadence and replay algorithm are deliberately undecided.

## Architecture integration (2026-10-17)
- The authoritative event journal and necessary associated story revisions now persist through **Go-managed filesystem SQLite** (IDEA-0051). The **TypeScript client-side** coordinator and rule validators (IDEA-0044) still determine which provisional actions are accepted.
- Go is responsible for **atomic writes, expected-revision/concurrency checks and durable data consistency** when applying a prepared accepted turn, including from multiple headless browser tabs. This does not create an independent Go narrative/gameplay rule engine.
- Events should carry stable IDs and schema/provenance metadata sufficient for full replay and safe SQLite-backed export/import.

## Full-history adventure duplication dependency
- IDEA-0005 now accepts **duplicating an entire committed adventure history**, not merely cloning current world state. The duplicate preserves all accepted events in order, their source turns and text-revision provenance, and any data needed to replay its history at prior turn boundaries.
- The new adventure must have an independent identity, with event/entity/turn/revision references coherent **inside its own copy** and no mutable coupling to the original. Exact internal identifier remapping remains a schema design detail.
- Pending unsubmitted player input and unconfirmed prose-edit drafts are not copied. Duplication performs no new AI inference, historical event reenactment or external side effects.

## Dependencies and constraints
- Integrates with accepted persistent character entities (IDEA-0026), inventory and items (IDEA-0029), locations, travel and presence (IDEA-0033 through IDEA-0036), and mutable environmental state ([[Persistent Location State and Travel Interactions]], IDEA-0038).
- Uses accepted generation/validation boundaries (IDEA-0018): an AI-produced description or proposed operation must not become an authoritative event before validation.
- Depends on the **accepted staging direction** [[Versioned Text Blocks and Revision IDs]] (IDEA-0040) for stable story-turn and revision relationships.
- Historical edits (IDEA-0041) and snapshots/incremental rebuild (IDEA-0042) have since entered staging; rollback candidate IDEA-0043 remains unaccepted. Their original separate acceptance decisions remain distinct.
- Event provenance, ordering and versioning must permit deterministic reconstruction. Unknown facts cannot become asserted values simply because a reducer needs a default.
- A snapshot is a derived cache or checkpoint, never an independent source of truth that contradicts its underlying accepted event sequence.
- Preserve historical audit records while ensuring invalidated events do not keep mutating the currently selected canon.

## Open questions
- How should schema versions and event dependencies evolve across story revisions and feature additions?
- How should invalidated historical events be represented without breaking append-only audit history?
- What rules select which events are active in a revised or branched story?
- Which event payloads and reducer interfaces make state reconstruction deterministic across migrations?
- How should linked changes to several entities be recorded and applied atomically?
- How do deliberate manual edits coexist with generated accepted events during replay and reconstruction?
- When should periodic snapshots be created, invalidated or rebuilt to avoid expensive full replay?
- What audit information is useful while avoiding unnecessary sensitive or excessive generation logs?

## Draft acceptance criteria
- [ ] Every accepted world-state change can be represented as an ordered committed event with source turn, relevant entity IDs, type, validation provenance and revision reference.
- [ ] Reapplying the same valid event history through deterministic reducers yields the same authoritative world state.
- [ ] Rejected, failed or merely proposed changes do not affect the active accepted world-state projection.
- [ ] Current world state distinguishes active valid event effects from retained but invalidated historical event records.
- [ ] Events related to multiple items, characters and locations replay without introducing contradictory canonical states.
- [ ] Event provenance supports identifying changes affected when a source story turn is edited, revised or undone.
- [ ] Optional derived snapshots can accelerate reconstruction without overriding the event history or producing stale projections.
- [ ] Event schema evolution, branching, event invalidation policy and snapshot intervals remain staging refinement decisions.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with earlier suggested implementation details, now explicitly accepted for staging.
- This is **accepted for refinement**, not approved for production or implemented; event invalidation, branching and migration remain open.

## Decisions and review history
- 2026-10-17 — **Cross-reference to explicitly accepted IDEA-0005 duplication:** An adventure duplicate has its own identity but preserves **the complete accepted story/history and reconstructible state**, including provenance, lore and durable plugin data. **Unsubmitted input and unconfirmed drafts are excluded.** Internal references must be coherent and neither adventure may share mutable canonical records. This is an in-library operation, not file import/export. Remains staging.
- 2026-10-17 — **Runtime dependency correction:** The approved IDEA-0053 direction is a **single Wails v3 headless localhost Go server**, packaged for Windows/macOS/Linux and used through the normal browser. The earlier combined WebView-desktop plus headless interpretation has been explicitly superseded. Docker is a separate, unaccepted candidate (IDEA-0065); staging status is unchanged.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Append-only event-sourced history for validated world-state changes, with source turns, stable entity IDs, event types, ordering, validation, story revisions, deterministic reconstruction and provenance compatible with undo and historical edits. Periodic snapshots allowed as an optimisation. Event invalidation, branching, schema evolution, dependencies and checkpoint policy remain open for refinement. Moved to staging, not production.
