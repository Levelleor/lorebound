---
id: "IDEA-0039"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
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
- **Foundation for undo and historical editing:** Retain relationships between events, originating story revisions and affected entities so changed earlier passages can be deterministically tracked without losing auditability. **Keep Later Turns** preserves later accepted story/outcomes even if the edited earlier passage removes their fictional premise; the player, not new AI inference, owns optional narrative/manual-state repairs. No fabricated missing item, automatic downstream prose change or inference-based reconciliation is authorised. Technical integrity of IDs, event provenance and transactions remains required; irreplayable-event representation is a Pass B design question (IDEA-0041/0042).
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

## Committed event history supports forks from arbitrary turns
- **Accepted IDEA-0011 Option A (2026-10-18):** Every committed source turn is an eligible **fork boundary**. A fork is a separate adventure with the **complete accepted ordered event prefix** and compatible canonical baseline, source-prose/revision links and material needed to reconstruct world state **through and including** that turn. Event/state changes committed **after** the boundary remain only in the original adventure and may not leak into the fork's starting state.
- **Independent provenance and ownership:** Preserve internally coherent source turn, event, revision and entity references within the fork, with a distinct adventure identity and no shared mutable events/state. A source identifier may be noted as optional provenance metadata without making the new adventure dependent on later edits, deletions or histories of the original. Exact ID copying/remapping and lineage metadata are implementation details.
- **No checkpoint restriction:** Reconstruct canonical state from the accepted baseline and incremental log, with valid optional snapshots only as acceleration, not as required fork locations. Fork creation is consistent and atomic under SQLite expected-version checks, so a concurrent source commit cannot yield a mixed-prefix or half-copied fork. Pending drafts, incomplete proposals and rejected events are excluded.

## Persist Story-authored exceptions as traceable canonical events
- **Accepted IDEA-0002 Option B (2026-10-18):** When a player explicitly writes a **Story-mode assertion** that overrides an ordinary **fictional rule** (e.g. instant movement despite an adjacent-only travel setting), the resulting accepted state change is still an **authoritative ordered event** tied to that specific player-authored Story turn/text revision. It is **not** a silently ignored narrative inconsistency, a rejected Do/Say attempt, or an LLM's unauthorised override.
- **Event validity remains strong:** Distinguish source/mode/authorial authority as needed by the eventual typed event/provenance schema, while keeping stable entity IDs, uniqueness/placement invariants, referential coherence, expected adventure version and atomic commit integrity. Do not invent routes or other fiction merely to make the event look mechanically possible. The exact metadata representation remains open.
- **Replay stable reality:** Reducers, snapshots, forks, history edits, redo and downstream context must reconstruct the authored state transition correctly. A later ordinary gameplay action still observes enabled fictional constraints **from the new accepted state**. Provisional, model-invented or rejected effects must not enter canonical history.

## Passage revision is the canonical event source
- **Accepted IDEA-0003 Option A (2026-10-18):** Events reference their stable originating story **turn/passage ID and exact accepted passage revision**. A multi-paragraph passage can support multiple events, but individual paragraphs need no canonical IDs or independent revision histories.
- Revising any paragraph of a committed passage changes the **passage revision** after confirmation. Reconciliation can then identify all potentially affected events from that passage. Correctness must not depend on perfect single-paragraph attribution.
- Stable world entity IDs, complete ordered event provenance, event replay, cross-adventure forks and full-history duplication remain unchanged. Optional finer source-span metadata is a future optimisation, never required for correct canonical reconstruction.

## Committed Undo changes active event history without a variant branch
- **User-accepted IDEA-0004 Option B (2026-10-18):** Undo of the currently active Turn N **moves the adventure's active canonical head to N-1**. All world events and other accepted effects whose activity depends on removed Turn N cease contributing to the active state, and deterministic reducers rebuild entity locations, inventory, status, relationships, memories and other supported persistent state **at the new boundary**.
- **Single active timeline:** Continuing after Undo commits an independent new Turn N **within the same adventure**; the previously active Turn N is **not selectable as an alternate response**. The append-only journal may preserve audit or supersession references needed for historic integrity, but these are **inactive and not a playable side timeline**. Exact tombstone/validity-marker vs. physical-retention policy remains a storage refinement; never treat inactive undone events as active simply because still stored.
- **Safe commit boundary:** Undo participates in the existing expected-version Go/SQLite atomic transaction and must keep accepted passage revisions, active event provenance and derived state in sync. Replaying the same active committed prefix yields the same state. Multiple Undo operations can traverse the available committed history as far as the baseline; ordinary finite editor undo limits do not apply. Generation candidates/temporary edit states are not canonical events.
- **Separate explicit forks:** Fork from any committed turn creates an independently persisted adventure when both futures need preservation; rollback alone does not create another story or response-version selector.

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
- [ ] Undo of the active Turn N excludes Turn N's event effects from current authoritative projections and produces the deterministic world state at N-1 without deleting valid earlier prefix events.
- [ ] When new Turn N is committed after rollback, old Turn N's inactive journal/audit remnants never reactivate or appear as alternate playable versions.
- [ ] Multiple committed undos are possible down to the initial baseline, checked atomically against the authoritative adventure version and distinct from transient editor undo.
- [ ] Events derived from a multi-paragraph passage retain the accepted **passage ID and revision**, not mandatory per-paragraph IDs; later paragraph edits can identify possibly affected events for reconstruction.
- [ ] A committed Story-authorial override has explicit source/turn/revision provenance and reliably replays to the same canonical world state; it does not fabricate a preceding mechanic/route.
- [ ] Unique identities and current placements remain coherent, and a failed partial proposal or unrelated AI/Continue claim cannot enter the authoritative event log as an authorial override.
- [ ] For a chosen committed Turn N, an independent fork can replay the correct event sequence and state up to N, excluding all later effects and preserving accepted source-turn/revision provenance.
- [ ] Forking never requires a special snapshot, shares no mutable event/state with source, and cannot commit a partial/mixed-version fork under concurrent modifications.
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

- 2026-10-19 — **User clarification for historical Keep Later Turns:** Keep accepted downstream text/outcomes despite possible fictional inconsistencies. Let the player voluntarily correct current inventory/other states manually. No automatic inferred key, AI repair or story rewrite; normal event identity, provenance and atomicity guarantees still hold. Treat event replay of structurally impossible records as a specific later interface contract, not a reason to overrule player authorship. Staging only.
- 2026-10-18 — **Accepted IDEA-0004 event-history rule:** User selected a deterministic **committed Undo of the current head** (Option B), with the undone turn and events inactive and state reconstructed at the previous boundary. New continuation may occur in the same adventure, with no selectable prior future. Audit/append-only preservation, if needed, is non-playable. No provisional AI candidate history. Staging only.
- 2026-10-18 — **Accepted IDEA-0003 Option A:** Canonical event-to-narrative provenance is at **turn/passage revision level** rather than at individual paragraph level. Revisions continue to support historic replay and validation. Staging only.
- 2026-10-18 — **Accepted IDEA-0002 history integration:** Explicit player Story assertions may overrule fictional mechanics but remain source-traceable validated canonical events under strong ID/provenance/version/atomic integrity rules. Reducers replay the resulting accepted world truth; Do/Say/Continue do not receive a blanket bypass. Staging only.
- 2026-10-18 — **Accepted IDEA-0011 event-history dependency:** An arbitrary committed-turn fork copies/reconstructs the full accepted event/source-provenance prefix through that turn into an independent adventure, omits later source events, and does not require checkpoints or changes to original history. Staging only.
- 2026-10-17 — **Cross-reference to explicitly accepted IDEA-0005 duplication:** An adventure duplicate has its own identity but preserves **the complete accepted story/history and reconstructible state**, including provenance, lore and durable plugin data. **Unsubmitted input and unconfirmed drafts are excluded.** Internal references must be coherent and neither adventure may share mutable canonical records. This is an in-library operation, not file import/export. Remains staging.
- 2026-10-17 — **Runtime dependency correction:** The approved IDEA-0053 direction is a **single Wails v3 headless localhost Go server**, packaged for Windows/macOS/Linux and used through the normal browser. The earlier combined WebView-desktop plus headless interpretation has been explicitly superseded. Docker is a separate, unaccepted candidate (IDEA-0065); staging status is unchanged.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Append-only event-sourced history for validated world-state changes, with source turns, stable entity IDs, event types, ordering, validation, story revisions, deterministic reconstruction and provenance compatible with undo and historical edits. Periodic snapshots allowed as an optimisation. Event invalidation, branching, schema evolution, dependencies and checkpoint policy remain open for refinement. Moved to staging, not production.
