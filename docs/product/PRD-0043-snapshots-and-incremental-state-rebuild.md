---
id: PRD-0043
type: prd
status: accepted
related:
- NOTE-0050
- PRD-0001
- NOTE-0015
- NOTE-0011
---

# Snapshots and Incremental State Rebuild

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0042](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Snapshots%20and%20Incremental%20State%20Rebuild.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S05**. First milestone: **M2**. Delivery: **PARTIAL**.

- Requirement coverage: [R01 partial Story-only reconstruction coverage](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003E.md#affected-idea-0042-reconstruction-requirement); nonempty world/derived/module coverage remains later
- Evidence: [Merged PR #15](https://github.com/Levelleor/lorebound/pull/15)

## Current accepted architecture after 2026-10-28 redirection

**Latest accepted reconstruction model:** [B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md), B2-D03 and B3-D04 govern. Store **one current replayable event sequence**, **no persisted checkpoints/snapshots and no passage/event revision archive**. In-memory projections/caches may accelerate reads but are not canonical. Replay **declarative Set/Clear/Create/Remove/keyed relation assertions** in order from Turn 0; do not resimulate ability, custody transfer, route feasibility or prior fiction. Missing old item introduction may yield sparse identity with unknown details, not a fatal dependency. Historic Keep retains later accepted facts.


## Accepted direction
- **Complete incremental state coverage:** Every accepted persistent mutation needs durable representation in the appropriate canonical incremental record or versioned source: characters, items, equipment, anatomy, locations, routes, environment, lore/knowledge, story text/revisions and other state the adventure actually persists. There must be no mutable canonical fields whose historical changes disappear from replay.
- **Full reconstruction at arbitrary supported points:** A valid initial baseline plus ordered accepted changes and text revisions must reconstruct complete authoritative **core and available/supported module** state at any supported turn/revision, not merely selected events. **Removed plugin-specific historical state is an explicit later user-approved exception** and does not require migration or legacy plugin execution.
- **Rebuild from the edit boundary without inference:** Once a player confirms a change at Turn 47, keep unaffected prior history intact and obtain the valid prior state, then use **stored accepted changes and revisions**, not fresh AI inference, for necessary deterministic replay. If they choose **Keep Later Turns**, preserve the later story and its accepted recorded outcomes even where the revised earlier fiction no longer logically explains them; the player may manually correct missing state (e.g., a key), but the engine must not manufacture that correction, rewrite the later prose or charge for AI continuity repair. Referential/transaction integrity still applies. Specific handling of truly unrepresentable dependent events remains for the foundational event contract.
- **How earlier state is recovered:** When immediate preceding state is not available, derive it using prior incremental changes, optionally accelerated by a valid older checkpoint. An arbitrary state's instant availability is an optimisation, not guaranteed merely by storing deltas.
- **No event coverage gaps in supported active domains:** All persistent core and currently supported capability changes require recorded, deterministic reconstruction from accepted authoritative information. Where a result originally depended on an AI call, retain the accepted output; replay must not rerun AI to invent a different past. **Explicit user-approved exception (2026-10-19):** After a plugin is removed, Lorebound may continue without reconstructing or migrating that unavailable plugin's historical custom state. Do not delete prior story passages or unrelated canonical records; preserve core transaction/identity integrity. Removed plugin rules/context no longer participate in new play, and narrative behaviour may change unpredictably.
- **Derived data coherence:** Invalidate or rebuild affected summaries, materialised projections, caches and downstream dependencies, while retaining unaffected data when provably safe.
- **History edit gate:** Defer reconstruction until explicit edit confirmation as accepted in Historical Edit Confirmation and Bulk Truncation (IDEA-0041); do not automatically rewrite later story prose.
- **Optional snapshots:** Checkpoints may improve performance, but are not required for correctness, cannot substitute for complete incremental history and must be tied to a valid source revision.

## Dependencies and constraints
- Accepted Event-Sourced World History (IDEA-0039) supplies ordered validated state-changing events; this clarification requires them and any accompanying versioned records to cover **all** canonical persistent changes, not a manually selected subset.
- Accepted Versioned Text Blocks and Revision IDs (IDEA-0040) supplies story-text lineage and revision references needed for full adventure reconstruction.
- Accepted Historical Edit Confirmation and Bulk Truncation (IDEA-0041) requires draft-first confirmation before replay or reconstruction; keeping later prose does not approve automatic AI regeneration.
- Complete reconstruction must not depend on an optional snapshot being present.
- Rebuild and cache invalidation must respect revisions and accepted event provenance; invalidated source events cannot keep influencing current state.
- The user's earlier clarification was recorded during Inbox review, **followed by explicit acceptance into staging on 2026-10-16**.

## Open questions
- When is an older snapshot still valid after a multi-block edit?
- Which persistent data classes are part of a fully reconstructible adventure state, and how is the coverage contract enforced as features are added?
- How do the event stream, versioned story prose and baseline jointly establish state at any turn boundary?
- Should the engine retain cheap per-turn materialised versions or reconstruct them on demand from incremental changes?
- **Player-choice boundary resolved:** Under Keep Later Turns, fictional continuity gaps are the player's responsibility and do not trigger inference or automatic repair. How should the event reducer safely retain already accepted later outcomes if the edited earlier records make a particular operation technically unrepresentable without violating stable identities or data integrity?
- How can tests compare arbitrary point-in-time reconstruction against the authoritative live state and detect any missing recorded mutation?
- How are summaries, knowledge/retrieval projections and other derived caches invalidated accurately after editing?
- How should snapshot frequency, storage format and dependency tracking be optimised without making correctness rely on checkpoints?

## Draft acceptance criteria
- [ ] After Undo of committed Turn N the active story, events, lore/inventory/location and derived state match deterministic replay of the surviving prefix through N-1.
- [ ] Repeated Undo traverses committed turns down to baseline independently of finite temporary editor history, and no stale checkpoint/summary from removed turns survives as active truth.
- [ ] A new continuation from the rolled-back head remains the single active timeline of that adventure, with no inactive response selectable as an alternative.
- [ ] A confirmed paragraph edit creates a new **passage revision**, and dependent state can be reconstructed correctly through passage-level provenance without stable paragraph IDs or paragraph-specific snapshots.
- [ ] A confirmed passage edit **overwrites its one current structured passage body**, retaining its stable passage ID. Replay current events without creating prior passage revisions or requiring paragraph-level IDs.
- [ ] Derived state remains consistent with accepted passage/event provenance following historical edits, forks and duplication even when finer span-level tracking is absent.
- [ ] All committed turns remain eligible fork points, including turns with no materialised snapshot; replay produces the same authoritative state at the boundary.
- [ ] The fork's accepted prefix reconstructs through the selected turn only and remains independently mutable; no later source event, stale checkpoint or provisional draft influences the fork.
- [ ] Replaying **current accepted assertion records** reconstructs all supported core and active-module current state from Turn 0, **without old passage revisions or requiring removed plugin-specific legacy state**.
- [ ] No accepted persistent mutation is stored only in an unreplayable materialised projection or an unlogged mutable field.
- [ ] A confirmed edit at Turn 47 can invalidate in-memory derived state; reconstruct from current ordered assertions (Turn 0 when necessary), **without relying on persisted checkpoints or historical revisions**.
- [ ] The output of historical reconstruction agrees with deterministic replay of the same valid event/text-revision history.
- [ ] AI generation is never required merely to replay previously accepted outcomes.
- [ ] Affected summaries, snapshots and projections are invalidated or refreshed, but unmodified pre-edit history remains valid.
- [ ] Checkpoints are optional accelerators and may never be the sole way to rebuild a complete state.
- [ ] Reconstruction is deferred until the player's confirmation; no automatic rewriting of later prose.

- [ ] Reconstructed canonical state includes all **supported** persistent adventure data, not just curated world events; once a plugin is removed, its unavailable custom state is exempt from compatibility replay.
- [ ] Reconstructing the same selected revision and event history twice produces the same state, regardless of whether optional checkpoints were used.
- [ ] The previous valid turn-boundary state can be reused for a confirmed historical edit; no unchanged prior history is unnecessarily rebuilt when that state is available.
- [ ] Any future **core or supported active-module** persistent field/entity supports versioning, incremental event capture and arbitrary-turn reconstruction. Absent plugins need not be reinstalled or migrated.

## Supporting detail

See [NOTE-0050](../knowledge/inbox/NOTE-0050-prd-0043-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
