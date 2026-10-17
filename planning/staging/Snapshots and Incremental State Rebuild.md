---
id: "IDEA-0042"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Snapshots and Incremental State Rebuild

## Idea
Maintain **complete, incrementally saved canonical state** so the entire adventure/world state can be reconstructed at any story turn or revision. After a confirmed historical edit, rebuild from the earliest affected point, using an already available valid preceding state or rebuilding that preceding state from incremental history as needed. Periodic snapshots/checkpoints are optional accelerators, **not the definition or prerequisite of incremental saves**.

## Why this idea matters
Historical editing must reconstruct the **entire persisted story/world state correctly**, not just a subset of notable events. Incremental saving avoids copying whole world snapshots every turn while retaining every change needed to recover state anywhere in history. Large adventures also need to avoid replaying unchanged history unnecessarily.

## Accepted direction
- **Complete incremental state coverage:** Every accepted persistent mutation needs durable representation in the appropriate canonical incremental record or versioned source: characters, items, equipment, anatomy, locations, routes, environment, lore/knowledge, story text/revisions and other state the adventure actually persists. There must be no mutable canonical fields whose historical changes disappear from replay.
- **Full reconstruction at arbitrary points:** A valid initial baseline plus ordered accepted changes and text revisions must be sufficient to reconstruct the **complete** authoritative adventure/world state at any supported turn/revision, not merely replay some events.
- **Rebuild from the edit boundary:** Once a player confirms a change at Turn 47, keep unaffected prior history intact, obtain the valid state immediately before Turn 47, then reconcile/replay affected changes from that point onward. If that preceding state is already materialised, use it directly.
- **How earlier state is recovered:** When immediate preceding state is not available, derive it using prior incremental changes, optionally accelerated by a valid older checkpoint. An arbitrary state's instant availability is an optimisation, not guaranteed merely by storing deltas.
- **No event coverage gaps:** All persistent state changes must be deterministically reproducible from stored authoritative information. Where a result originally depended on an AI call, preserve its **accepted output/change**; replay must not rerun AI to invent a different past.
- **Derived data coherence:** Invalidate or rebuild affected summaries, materialised projections, caches and downstream dependencies, while retaining unaffected data when provably safe.
- **History edit gate:** Defer reconstruction until explicit edit confirmation as accepted in [[Historical Edit Confirmation and Bulk Truncation]] (IDEA-0041); do not automatically rewrite later story prose.
- **Optional snapshots:** Checkpoints may improve performance, but are not required for correctness, cannot substitute for complete incremental history and must be tied to a valid source revision.

## Proposed behaviour
Store the initial canonical baseline and each accepted incremental change (including versioned story edits and all supported world-state categories). Keep or reconstruct complete state at a selected turn boundary. Following confirmed historical changes, reuse a valid preceding state if available and recompute dependent state from the earliest affected boundary. Optional materialised snapshots are caches for accelerating that process, not the primary mechanism. Validate the resulting full state against replay from the same accepted history.

## Alternatives and trade-offs
A complete per-turn stored state may allow fast random access but duplicates unchanged data; complete incremental deltas preserve reconstructibility more compactly. Structural-sharing versions, recent-state caches, and optional periodic or adaptive checkpoints can accelerate arbitrary-time access and reconstruction. Every 25–100 turns was merely an experimental snapshot suggestion and is **not a required interval**. Select storage and replay optimisations only after correctness and total persistent-state coverage are established.

## Dependencies and constraints
- Accepted [[Event-Sourced World History]] (IDEA-0039) supplies ordered validated state-changing events; this clarification requires them and any accompanying versioned records to cover **all** canonical persistent changes, not a manually selected subset.
- Accepted [[Versioned Text Blocks and Revision IDs]] (IDEA-0040) supplies story-text lineage and revision references needed for full adventure reconstruction.
- Accepted [[Historical Edit Confirmation and Bulk Truncation]] (IDEA-0041) requires draft-first confirmation before replay or reconstruction; keeping later prose does not approve automatic AI regeneration.
- Complete reconstruction must not depend on an optional snapshot being present.
- Rebuild and cache invalidation must respect revisions and accepted event provenance; invalidated source events cannot keep influencing current state.
- The user's earlier clarification was recorded during Inbox review, **followed by explicit acceptance into staging on 2026-10-16**.

## Open questions
- When is an older snapshot still valid after a multi-block edit?
- Which persistent data classes are part of a fully reconstructible adventure state, and how is the coverage contract enforced as features are added?
- How do the event stream, versioned story prose and baseline jointly establish state at any turn boundary?
- Should the engine retain cheap per-turn materialised versions or reconstruct them on demand from incremental changes?
- How are dependent later events handled if an edited earlier event is no longer valid, without inventing new AI outputs?
- How can tests compare arbitrary point-in-time reconstruction against the authoritative live state and detect any missing recorded mutation?
- How are summaries, knowledge/retrieval projections and other derived caches invalidated accurately after editing?
- How should snapshot frequency, storage format and dependency tracking be optimised without making correctness rely on checkpoints?

## Draft acceptance criteria
- [ ] Replaying canonical incremental records from a known baseline reconstructs every persisted world-state category and applicable story revision at an arbitrary supported point.
- [ ] No accepted persistent mutation is stored only in an unreplayable materialised projection or an unlogged mutable field.
- [ ] A confirmed edit at Turn 47 can reuse valid state through Turn 46 and recompute only what is necessary afterward, with older replay/checkpoints only if the prior state is unavailable.
- [ ] The output of historical reconstruction agrees with deterministic replay of the same valid event/text-revision history.
- [ ] AI generation is never required merely to replay previously accepted outcomes.
- [ ] Affected summaries, snapshots and projections are invalidated or refreshed, but unmodified pre-edit history remains valid.
- [ ] Checkpoints are optional accelerators and may never be the sole way to rebuild a complete state.
- [ ] Reconstruction is deferred until the player's confirmation; no automatic rewriting of later prose.

- [ ] The complete canonical state reconstructed at any supported turn includes all persistent adventure data, not just a curated subset of world events.
- [ ] Reconstructing the same selected revision and event history twice produces the same state, regardless of whether optional checkpoints were used.
- [ ] The previous valid turn-boundary state can be reused for a confirmed historical edit; no unchanged prior history is unnecessarily rebuilt when that state is available.
- [ ] Any future persistent field or entity feature must support versioning/event capture, replay and arbitrary-turn state reconstruction.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. The original checkpoint-oriented candidate was refined in Inbox after the requesting user's explicit clarification prioritising **complete incremental saves and complete reconstruction**, and the revised scope was then explicitly accepted for staging.
- This remains a **staging direction requiring refinement**, not a production specification or an implemented capability.

## Decisions and review history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **User clarification during review (not acceptance):** Incremental saving must record all canonical persistent state changes, enabling full reconstruction of the adventure/world at any point; the goal is not partial event replay plus mandatory older checkpoints. The candidate now puts complete incremental coverage and rebuilding from the affected edit boundary first, with snapshots only as optional speed-ups. At that point the note remained unaccepted in Inbox.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Complete incremental recording of **all** persistent adventure and world-state changes; deterministic reconstruction of **full canonical state at any turn**; efficient rebuilding from the earliest affected point after confirmed historical edits, with reuse of valid preceding state; checkpoints permitted only as optional performance accelerators. Storage structures, dependency algorithms, checkpoint cadence and detailed invalidation rules remain open. Promoted to staging for refinement, not production.
