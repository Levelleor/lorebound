---
id: "IDEA-0039"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Lorebound Vision Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Event-Sourced World History

## Latest accepted governing architecture — 2026-10-28

This **latest explicit user-approved architecture** replaces the earlier append-only/immutable event-audit and action-simulation wording in the original staged history below. [B6-D01 — narrative-first declarative outcome events](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) makes the tracker a **narration/context aid**: keep **one current ordered replayable set of typed state assertions** (Create/Remove entity, Set/Clear property, keyed Add/Remove relationship), **not procedural transfer/move commands with prior-possession or fictional-causality checks**. The latest assertion establishes current facts even when earlier fictional setup is deleted; a missing introduction yields a sparse identity with unknown details. Keep Later Turns may retain contradictions. Replay rejects only actually unprocessable/technically inconsistent event data, never merely unsupported prior fictional action. No historical passage/event revision archive or checkpoint persistence; manual corrections still require explicit player Commit.


## Idea
Persist one current ordered series of accepted declarative state assertions without duplicating world state every turn.

## Why this idea matters
Makes undo, historical reconstruction and multi-entity consistency possible.

## Accepted direction
- **Current-only ordered assertion events (2026-10-28 supersession):** Record accepted facts as ordered typed Set/Clear, Create/Remove and keyed Add/Remove outcome assertions. Current history is replayable from Turn 0; prior passage/event revisions and inactive audit records are **not** retained. Assertions need no fictional transfer/source/route precondition.
- **Traceable current event records:** Each committed assertion has stable affected IDs, event type, durable order, schema version, source provenance (optional passage ID or independent manual origin), and appropriate technical acceptance information; **no old passage revision IDs**. Exact event ID, schema and payload shapes require refinement.
- **Deterministic current-state reconstruction:** A defined reducer/projection can apply the active valid event sequence to rebuild character, item, location, equipment, environmental and other supported canonical state consistently.
- **One current story/event history:** Editing overwrites the current passage body; Undo/Delete remove the selected current event suffix as approved; Keep retains later accepted assertions even when earlier origin disappears. No branch-aware selector or inactive event archive.
- **History edits and replay:** Current accepted events have stable IDs, ordered positions and optional current source-turn provenance; **Keep Later Turns** retains later assertions without their former fictional premise. A later reference can establish a sparse item/character/location identity with unknown missing attributes. Do not rewrite prose or invent causal steps. Undo/Delete remove current events at the approved boundary, with atomicity and deterministic replay.
- **Projection coherence, not simulated feasibility:** Apply state assertions deterministically; each item's currently recorded physical placement is a single derived value shared by inventory/equipment/location views. Do **not** reject a location or holder assertion merely because an earlier route, source holder or fictional origin is absent. Unsupported/malformed typed core payloads remain failures.
- **Validation boundary:** Failed, rejected or uncommitted AI-proposed operations must not enter the active authoritative history as accepted world-state changes. Diagnostic/proposed operations may be recorded separately if refined later.
- **No persisted checkpoints:** Reconstruct the current world from the Turn-0 baseline and ordered current assertions; derived in-memory projections/caches are not competing canonical records. Full replay remains available.
- **Storage and schema future-proofing:** Record enough version/provenance information for safe replay and later migrations without committing today to a fixed schema-versioning or dependency-resolution mechanism.
- **Not a shipped implementation:** This note records an accepted staging direction and does not approve production or claim an event system exists.

## Proposed behaviour
After accepting a supported narrative fact or explicit player correction, commit the corresponding **declarative outcome assertion** with stable IDs, optional source turn and total order, without simulation-style prior-state prerequisites. State projections replay the **one current ordered assertion stream** to derive current locations, possessions, status and other facts. When earlier prose is edited, Keep retains later assertions even if prior fictional causes vanish; Delete/Undo remove only the selected current suffix, with no inactive audit or branching history. Use **in-memory** derived caches if helpful, not persisted checkpoints; full replay from Turn 0 remains authoritative.

## Alternatives and trade-offs
Full world snapshots each turn can be simpler for point-in-time reads but duplicate unchanged data and weaken per-change provenance. Event sourcing gives ordered, explainable world changes and revision reconstruction at the cost of deterministic reducers, migration discipline and complex historical invalidation. The later approved Turn-0 replay design **does not persist checkpoints**. Cached in-memory derived projections may be discarded and rebuilt.

## Architecture integration (2026-10-17)
- The **current ordered outcome assertions and current passage bodies** persist through **Go-managed filesystem SQLite** (IDEA-0051). The **TypeScript client-side** coordinator (IDEA-0044) interprets grounded accepted facts and applies deterministic typed assertion/format checks, not broad mechanical event-precondition rejection.
- Go is responsible for **atomic writes, expected-revision/concurrency checks and durable data consistency** when applying a prepared accepted turn, including from multiple headless browser tabs. This does not create an independent Go narrative/gameplay rule engine.
- Events should carry stable IDs and schema/provenance metadata sufficient for full replay and safe SQLite-backed export/import.

## Full-history adventure duplication dependency
- The **current** adventure story/event history can be duplicated independently, including current passage bodies and ordered typed assertions through the chosen boundary. The copy does not contain overwritten passage revision archives.
- The new adventure must have an independent identity, with event/entity/turn references coherent **inside its own copy** and no mutable coupling to the original. Exact internal identifier remapping remains a schema design detail.
- Pending unsubmitted player input and unconfirmed prose-edit drafts are not copied. Duplication performs no new AI inference, historical event reenactment or external side effects.

## Committed event history supports forks from arbitrary turns
- **Accepted IDEA-0011 Option A (2026-10-18):** Every committed source turn is an eligible **fork boundary**. A fork is a separate adventure with the **complete current accepted ordered event prefix** and compatible canonical baseline, current source-passage links and material needed to reconstruct world state **through and including** that turn. Event/state changes committed **after** the boundary remain only in the original adventure and may not leak into the fork's starting state.
- **Independent provenance and ownership:** Preserve internally coherent source turn, event, revision and entity references within the fork, with a distinct adventure identity and no shared mutable events/state. A source identifier may be noted as optional provenance metadata without making the new adventure dependent on later edits, deletions or histories of the original. Exact ID copying/remapping and lineage metadata are implementation details.
- **No persisted checkpoints:** Reconstruct state from the Turn-0 baseline and current ordered assertions; fork points need not have snapshots. Fork creation is consistent and atomic under SQLite expected-version checks, so a concurrent source commit cannot yield a mixed-prefix or half-copied fork. Pending drafts, incomplete proposals and rejected events are excluded.

## Persist Story-authored exceptions as traceable canonical events
- **Accepted IDEA-0002 Option B (2026-10-18):** When a player explicitly writes a **Story-mode assertion** that overrides an ordinary **fictional rule** (e.g. instant movement despite an adjacent-only travel setting), the resulting accepted state change is still an **authoritative ordered event** tied to that specific player-authored Story turn/text revision. It is **not** a silently ignored narrative inconsistency, a rejected Do/Say attempt, or an LLM's unauthorised override.
- **Event validity remains strong:** Distinguish source/mode/authorial authority as needed by the eventual typed event/provenance schema, while keeping stable entity IDs, uniqueness/placement invariants, referential coherence, expected adventure version and atomic commit integrity. Do not invent routes or other fiction merely to make the event look mechanically possible. The exact metadata representation remains open.
- **Replay established current facts:** Reducers, Fork, history edits and downstream context reconstruct the surviving declarative assertions correctly; fictional historical prerequisites are not replay gates. A later ordinary gameplay action still observes enabled fictional constraints **from the new accepted state**. Provisional, model-invented or rejected effects must not enter canonical history.

## Passage source provenance (earlier passage-revision rule superseded)
- **Current replacement of original IDEA-0003 Option A:** Events may reference a stable originating **current turn/passage ID** or an independent manual-correction origin; **no exact accepted passage revision is retained**. A multi-paragraph passage can support multiple events, but individual paragraphs need no canonical IDs or independent revision histories.
- Confirming a historical edit **overwrites the current structured passage body** at the same passage ID, without retaining an earlier accepted passage revision. Reconciliation can then identify all potentially affected events from that passage. Correctness must not depend on perfect single-paragraph attribution.
- Stable world entity IDs, complete ordered event provenance, event replay, cross-adventure forks and full-history duplication remain unchanged. Optional finer source-span metadata is a future optimisation, never required for correct canonical reconstruction.

## Committed Undo changes active event history without a variant branch
- **User-accepted IDEA-0004 Option B (2026-10-18):** Undo of the currently active Turn N **moves the adventure's active canonical head to N-1**. All world events and other accepted effects whose activity depends on removed Turn N cease contributing to the active state, and deterministic reducers rebuild entity locations, inventory, status, relationships, memories and other supported persistent state **at the new boundary**.
- **One current history:** Continuing after Undo creates a new current Turn N, but the undone turn and its applicable events were removed from current canon and **are not stored as an inactive audit/redo branch**. Deleted earlier fictional setup does not invalidate later assertions left by Keep.
- **Safe commit boundary:** Undo participates in the expected-version Go/SQLite atomic transaction, keeping current passage bodies, current event provenance and derived projections in sync. Replaying the same active committed prefix yields the same state. Multiple Undo operations can traverse the available committed history as far as the baseline; ordinary finite editor undo limits do not apply. Generation candidates/temporary edit states are not canonical events.
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

- 2026-10-28 — **Explicit user-directed supersession:** Narrative-first declarative assertions adopted by user and reconciled here under [B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). Earlier action-precondition wording is preserved only as approval history where still quoted; **the latest governing section overrides it**. No staging promotion or implementation.
