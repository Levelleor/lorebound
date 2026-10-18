---
id: "IDEA-0042"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
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

## Architecture integration (2026-10-17)
- All canonical incremental history and revision records are persisted in **filesystem SQLite through Wails/Go services**. Browser-memory projections and caches are derived; they are not durable authoritative saves.
- The **client-side TypeScript** reducer/coordinator can reconstruct state from saved events and revisions. Go supplies ordered, version-consistent records and atomically commits accepted changes; exact snapshot layouts and replay caching remain for refinement.
- Multiple browser windows in headless mode must not silently publish stale projections or overwrite newly committed history. Versioning/revision checks and rebuild invalidation must be designed.

## Duplicated adventure reconstruction
- IDEA-0005's accepted **full-history duplication** copies the new adventure's complete committed baseline, ordered incremental event history, accepted prose revisions, relevant lore and persistent plugin data, sufficient to reconstruct the duplicate at every supported historical turn, not simply the newest materialised projection.
- If derived snapshots, summaries and caches are copied, they must remain valid for the duplicate's independent identity and history; otherwise they can be recomputed. Their existence is not required for correctness.
- Pending input and noncanonical editing drafts are **excluded** from duplication; copying must not invoke AI or reproduce external side effects.

## Reconstruct any committed turn as an independent fork baseline
- **Accepted IDEA-0011 Option A (2026-10-18):** Every **committed story-turn boundary** can be selected for a new independently saved adventure fork. Reconstruct the **authoritative world state and related canonical history through the chosen turn**, using the saved baseline plus complete accepted incremental events/revisions. A snapshot at that exact turn is **not necessary**: valid older checkpoints may accelerate replay but cannot restrict eligibility.
- **All-history prefix fidelity:** Preserve the complete committed narrative, revision ancestry, canonical entity/Lorebook records, validated event provenance and relevant persistent module context up to the chosen turn, excluding source turns and derived effects after it. Do not reconstruct the fork at the source's current latest state when an earlier turn was selected, and do not treat pending drafts, provisional AI output or invalid proposed state as accepted fork material.
- **Source version and isolation:** Read a consistent revision/version of source data while reconstructing and creating the fork. New adventure has independent mutable canonical state; the original's following turns/world remain untouched. Invalid/outdated snapshots cannot override the canonical incremental history, and a partial rebuild/copy must not be persisted as a complete fork. Exact replay/cache/snapshot algorithm stays open.

## State reconstruction uses passage-level provenance
- **Accepted IDEA-0003 Option A (2026-10-18):** Track accepted editable narrative at the **logical turn/passage revision** level, not per paragraph. An event's source records the committed passage ID and revision, and changing a paragraph within it may invalidate or require re-evaluation of **events sourced from that passage** after the historical-edit confirmation gate.
- **Correctness before fine-grained optimisation:** Reconstruct from the appropriate preceding validated state/history boundary and replay supported accepted event/revision records; no need to maintain separate paragraph source IDs or paragraph-specific snapshots. Optional finer change detection or cached comparisons must not bypass correct passage-level invalidation or leave unsupported effects active.
- **Existing reconstruction guarantees unchanged:** Every committed turn remains reconstructible/forkable from complete incremental history even without a nearby snapshot. Drafts do not trigger replay, and expected-version atomic commits remain required for accepted revisions/world updates. Whole-passage movement/split/merge lineage is still an implementation refinement.

## Rebuild affected state from passage-level narrative revisions
- **Accepted IDEA-0003 Option A (2026-10-18):** Canonical story text is versioned at logical **turn/passage body** level, not by paragraph. World events identify their **source passage/turn ID and exact accepted revision**. An accepted change to one paragraph can require re-evaluation of the events attributed to its **passage**.
- Reconstruct from the appropriate accepted state boundary using complete incremental history and valid optional checkpoints. Paragraph-specific IDs, revisions or snapshots are **not prerequisites for correctness**. Optimising away work when a change cannot affect particular events is optional, not a reason to retain invalid effects.
- Drafts are noncanonical and don't trigger replay before confirmation; stale-version checks, atomic writes, full-history duplication and arbitrary-turn forks remain as accepted. Exact whole-passage split/merge/move lineage stays open.

## Reconstruct committed Undo to the immediately previous active turn
- **Accepted IDEA-0004 Option B (2026-10-18):** A **committed Undo** moves the active story head from Turn N to **Turn N-1** and reconstructs **all authoritative state and derived context at that boundary** using the accepted baseline plus surviving active incremental history, optionally with a valid checkpoint. No AI generation or alternate-text switching is required for state replay.
- **Repeatability:** The player may undo the committed head repeatedly to older active turns, limited by the available committed history and initial baseline, **not** by the finite temporary editor undo stack. Once a new turn is committed from that earlier head, it becomes the sole active future within that adventure. The old future cannot remain a selectable narrative variant.
- **State coverage:** Invalidate snapshots, summaries, memory retrieval projections, state caches and any other derived records that depended on undone events. An older snapshot is usable only if its source prefix is still active/valid. A rollback fails atomically if reconstruction/version validation cannot complete, leaving prior canon intact rather than half-reverting the story.
- **Source/version consistency:** Go/SQLite rejects stale committed Undo requests using the existing optimistic expected-version check. The coordinator and reducers use an authoritative consistent event/text-revision prefix. Inactive records retained for append-only audit do not contribute to reconstructed reality and are not a redo/branch mechanism.
- **Other operations unchanged:** Arbitrary-turn Fork remains a distinct independent-adventure copy. Confirmed historical prose edits retaining later turns use the separate Keep Later Turns/Delete All After Point gate. Transient editing undo has its own bounded memory and is not authoritative state reconstruction.

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
- [ ] After Undo of committed Turn N the active story, events, lore/inventory/location and derived state match deterministic replay of the surviving prefix through N-1.
- [ ] Repeated Undo traverses committed turns down to baseline independently of finite temporary editor history, and no stale checkpoint/summary from removed turns survives as active truth.
- [ ] A new continuation from the rolled-back head remains the single active timeline of that adventure, with no inactive response selectable as an alternative.
- [ ] A confirmed paragraph edit creates a new **passage revision**, and dependent state can be reconstructed correctly through passage-level provenance without stable paragraph IDs or paragraph-specific snapshots.
- [ ] A confirmed modification of one paragraph produces a new accepted **passage revision** and correct dependent state replay without requiring paragraph-level IDs or snapshots.
- [ ] Derived state remains consistent with accepted passage/event provenance following historical edits, forks and duplication even when finer span-level tracking is absent.
- [ ] All committed turns remain eligible fork points, including turns with no materialised snapshot; replay produces the same authoritative state at the boundary.
- [ ] The fork's accepted prefix reconstructs through the selected turn only and remains independently mutable; no later source event, stale checkpoint or provisional draft influences the fork.
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
- 2026-10-18 — **Accepted IDEA-0004 reconstruction dependency:** Committed Undo atomically changes the canonical head and rebuilds world state at the preceding committed turn, repeatedly as needed, without a small editor undo-depth limit. Derived caches are invalidated. No old-future variant stack or new adventure is implied. Staging only.
- 2026-10-18 — **Accepted IDEA-0003 revision granularity dependency:** Source IDs and revisions for reconstruction attach to story turn/passage bodies rather than paragraphs. Event invalidation follows accepted passage provenance; drafts remain noncanonical. Staging only.
- 2026-10-18 — **Accepted IDEA-0003 dependency:** Reconstruction and invalidation use stable **turn/passage revision provenance**, not per-paragraph canonical revisions; editing prose within a passage is still fully allowed, with confirmed passage-level reconciliation. Staging only.
- 2026-10-18 — **Accepted IDEA-0011 dependency:** Players can fork from any committed turn, so full accepted incremental state/history must reconstruct that turn without requiring a named checkpoint or snapshot. Save an independent fork with complete prefix and no subsequent source effects; correct revision/version handling remains required. Staging only.
- 2026-10-17 — **Cross-reference to explicitly accepted IDEA-0005 duplication:** An adventure duplicate has its own identity but preserves **the complete accepted story/history and reconstructible state**, including provenance, lore and durable plugin data. **Unsubmitted input and unconfirmed drafts are excluded.** Internal references must be coherent and neither adventure may share mutable canonical records. This is an in-library operation, not file import/export. Remains staging.
- 2026-10-17 — **Runtime dependency correction:** The approved IDEA-0053 direction is a **single Wails v3 headless localhost Go server**, packaged for Windows/macOS/Linux and used through the normal browser. The earlier combined WebView-desktop plus headless interpretation has been explicitly superseded. Docker is a separate, unaccepted candidate (IDEA-0065); staging status is unchanged.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **User clarification during review (not acceptance):** Incremental saving must record all canonical persistent state changes, enabling full reconstruction of the adventure/world at any point; the goal is not partial event replay plus mandatory older checkpoints. The candidate now puts complete incremental coverage and rebuilding from the affected edit boundary first, with snapshots only as optional speed-ups. At that point the note remained unaccepted in Inbox.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Complete incremental recording of **all** persistent adventure and world-state changes; deterministic reconstruction of **full canonical state at any turn**; efficient rebuilding from the earliest affected point after confirmed historical edits, with reuse of valid preceding state; checkpoints permitted only as optional performance accelerators. Storage structures, dependency algorithms, checkpoint cadence and detailed invalidation rules remain open. Promoted to staging for refinement, not production.
