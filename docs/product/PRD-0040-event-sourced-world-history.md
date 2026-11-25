---
id: PRD-0040
type: prd
status: accepted
related:
- NOTE-0047
- PRD-0001
- NOTE-0015
- NOTE-0012
- NOTE-0008
---

# Event-Sourced World History

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0039](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Event-Sourced%20World%20History.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S05**. First milestone: **M1**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-002B scoped audit](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md); remaining inventory draft
- Evidence: [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md)

## Later accepted event envelope and ambiguity policy — 2026-10-31

[B7-D01](../decisions/ADR-0052-versioned-typed-declarative-event-envelope.md) requires a **versioned typed canonical event envelope** with total order, grounded provenance, domain owner, operation discriminator and type-checked declarative payloads. [B7-D02](../decisions/ADR-0053-core-and-optional-plugin-event-ownership.md) distinguishes required-core supported reducers from unavailable optional plugin-owned state and preserves the earlier removed-plugin exception. **[B7-D03 Option C](../decisions/ADR-0054-discard-unresolved-extraction-suggestions-without-diagnostics.md) forbids retaining or showing unresolved *automatic interpretation candidates*:** they are not canonical events, not noncanonical pending drafts and **not diagnostics stored for later inspection**. Omit such candidates from a supported story acceptance and discard immediately while committing any other grounded resolved assertions, subject to the existing atomic Go/SQLite boundary. This narrow choice does **not** suppress technical parser, required-core replay, migration or transaction failures. Earlier openness to recording diagnostic proposed operations below does **not** authorise retaining ambiguous extraction hints.



## Latest accepted governing architecture — 2026-10-28

This **latest explicit user-approved architecture** replaces the earlier append-only/immutable event-audit and action-simulation wording in the original staged history below. [B6-D01 — narrative-first declarative outcome events](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md) makes the tracker a **narration/context aid**: keep **one current ordered replayable set of typed state assertions** (Create/Remove entity, Set/Clear property, keyed Add/Remove relationship), **not procedural transfer/move commands with prior-possession or fictional-causality checks**. The latest assertion establishes current facts even when earlier fictional setup is deleted; a missing introduction yields a sparse identity with unknown details. Keep Later Turns may retain contradictions. Replay rejects only actually unprocessable/technically inconsistent event data, never merely unsupported prior fictional action. No historical passage/event revision archive or checkpoint persistence; manual corrections still require explicit player Commit.


## Accepted direction
- **Current-only ordered assertion events (2026-10-28 supersession):** Record accepted facts as ordered typed Set/Clear, Create/Remove and keyed Add/Remove outcome assertions. Current history is replayable from Turn 0; prior passage/event revisions and inactive audit records are **not** retained. Assertions need no fictional transfer/source/route precondition.
- **Traceable current event records:** Each committed assertion has stable affected IDs, event type, durable order, schema version, source provenance (optional passage ID or independent manual origin), and appropriate technical acceptance information; **no old passage revision IDs**. Exact event ID, schema and payload shapes require refinement.
- **Deterministic current-state reconstruction:** A defined reducer/projection can apply the active valid event sequence to rebuild character, item, location, equipment, environmental and other supported canonical state consistently.
- **One current story/event history:** Editing overwrites the current passage body; Undo/Delete remove the selected current event suffix as approved; Keep retains later accepted assertions even when earlier origin disappears. No branch-aware selector or inactive event archive.
- **History edits and replay:** Current accepted events have stable IDs, ordered positions and optional current source-turn provenance; **Keep Later Turns** retains later assertions without their former fictional premise. A later reference can establish a sparse item/character/location identity with unknown missing attributes. Do not rewrite prose or invent causal steps. Undo/Delete remove current events at the approved boundary, with atomicity and deterministic replay.
- **Projection coherence, not simulated feasibility:** Apply state assertions deterministically; each item's currently recorded physical placement is a single derived value shared by inventory/equipment/location views. Do **not** reject a location or holder assertion merely because an earlier route, source holder or fictional origin is absent. Unsupported/malformed typed core payloads remain failures.
- **Validation boundary (B7-D03 C):** Failed, rejected or uncommitted AI-proposed operations must not enter active canonical history. **Genuinely ambiguous automatic extraction suggestions are immediately discarded without a separate diagnostic/pending record or UI notice**. Ordinary technical errors, provider failures and explicit pending manual edits retain their independent reporting/commit workflows.
- **No persisted checkpoints:** Reconstruct the current world from the Turn-0 baseline and ordered current assertions; derived in-memory projections/caches are not competing canonical records. Full replay remains available.
- **Storage and schema future-proofing:** Record enough version/provenance information for safe replay and later migrations without committing today to a fixed schema-versioning or dependency-resolution mechanism.
- **Not a shipped implementation:** This note records an accepted staging direction and does not approve production or claim an event system exists.

## Dependencies and constraints
- Integrates with accepted persistent character entities (IDEA-0026), inventory and items (IDEA-0029), locations, travel and presence (IDEA-0033 through IDEA-0036), and mutable environmental state (Persistent Location State and Travel Interactions, IDEA-0038).
- Uses accepted generation/validation boundaries (IDEA-0018): an AI-produced description or proposed operation must not become an authoritative event before validation.
- Depends on the **accepted staging direction** Versioned Text Blocks and Revision IDs (IDEA-0040) for stable story-turn and revision relationships.
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

## Supporting detail

See [NOTE-0047](../knowledge/inbox/NOTE-0047-prd-0040-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
