---
id: PRD-0012
type: prd
status: accepted
related:
- NOTE-0026
- PRD-0001
- NOTE-0009
- NOTE-0015
---

# Manual Generation Branches

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0011](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Manual%20Generation%20Branches.md) · origin: agent; created: 2026-10-16; updated: 2026-11-06; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S02**. First milestone: **M2**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-003B scoped inventory](../work/items/STORY-0015-independent-committed-story-prefix-fork.md); [DEV-003J reload recovery](../work/items/STORY-0023-same-tab-reload-recovery-for-uncertain-fork.md) verified/merged in PR #20
- Evidence: [PR #12](https://github.com/Levelleor/lorebound/pull/12), [delivery/review](../work/items/STORY-0015-independent-committed-story-prefix-fork.md)

## Latest accepted event and narrative authority — 2026-10-28

**Current Fork/replay semantics ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md), B3-D04, B4-D05):** A fork copies the chosen **current** ordered assertion-event prefix into a separate adventure, not older passage/event revisions. Replaying a later accepted fact does not require its former fictional acquisition, route or introduction. Sparse ID fields can remain unknown. No required stored snapshots, alternate in-adventure active branches or mechanical “valid history” gate for fictional continuity.


## Accepted direction
- **Fork means new story:** When a player decides to branch away from an existing adventure, create an independently addressable story/adventure object in persistent storage. The original story remains separate and unchanged.
- **Separate UI entry:** The new story appears as its own item in the adventure/story library and is opened, edited, saved, renamed, and resumed like any other adventure.
- **No in-chat branch mechanic:** Do **not** add nested timelines, a branch graph, or branch-switching widgets inside an individual story's narrative UI.
- **State at the fork point:** Seed the new story with appropriate narrative history and coherent corresponding world state up to the chosen fork point. Subsequent prose, events, memories, and state changes belong solely to the new story.
- **No automatic downstream rewrites:** The original story's later prose and world state stay intact; creating the new story must not regenerate later turns or rewrite another story.
- **Separate from retry and committed Undo (updated IDEA-0004):** No retained selectable AI response alternatives exist within a story. Retry **replaces** an uncommitted generation; committed Undo can roll back the active head and allow a **different continuation in the same adventure**. Fork instead creates an **independent saved adventure when the player wants the original and different future both to survive**.

This is explicitly **not** acceptance of the originally proposed in-story timeline/branch-tree interface.

## Dependencies and constraints
- Depends on independent adventure persistence, duplication, save/export (IDEA-0005), stable narrative revision IDs (IDEA-0003/IDEA-0040), and event/state reconstruction concepts (IDEA-0039/IDEA-0042).
- A new story must never share mutable world-state objects, active turn lists, or in-progress generation state with its source story.
- If forking from an earlier turn, state and derived context must match the chosen point, not the original story's latest head.
- Preserve source-story provenance if useful, but do not require a branch-tree UI or navigation inside the story.
- Forking may require a snapshot or replay at the selected point. Do not claim any specific architecture has been implemented.
- The rule against silently rewriting later prose still applies.

## Open questions
- **Resolved:** Fork from **any committed story turn**, not only named save points or materialised checkpoints. Turn selection/navigation is now resolved by the 2026-11-06 per-turn icon and separate-tab decision above.
- **Resolved 2026-11-06:** The small Fork icon beneath an accepted turn selects that boundary directly, with no branch tree or selector form.
- **Resolved user-visible requirement:** The fork independently owns all accepted history, text, provenance and state **through the selected turn** with no later source turns and no shared mutable data. Whether immutable internal infrastructure may be safely shared remains a technical implementation detail.
- How are provenance and source-story attribution represented without forcing branch-specific UI?
- How should a fork handle the chosen current story-turn boundary, noncanonical pending drafts, and any **technically unprocessable** event payloads? Fictional contradictions are not fork errors.
- **Resolved 2026-11-06:** Fork uses the small icon beneath the selected accepted turn; a separate library/title form is not the selected interaction. Duplicate remains separate.

## Draft acceptance criteria
- [ ] Fork is optional for preserving multiple **separately playable adventures**, whereas committed Undo can deterministically roll back and continue in the **same** adventure, with no selectable old future left behind.
- [ ] Retrying uncommitted AI output never creates a hidden in-story branch or saved candidate gallery; no automatic fork occurs on Undo.
- [ ] A player can select **any committed source turn** (including one without a stored snapshot or named checkpoint) as the fork boundary; an uncommitted draft or provisional output cannot be selected.
- [ ] A fork at Turn N contains the source's **complete accepted prefix through N**, including validated baseline, prose/revision lineage, events/world state, Lorebook, relationships, memory and relevant persistent plugin history necessary to reconstruct the selected state; it excludes all source turns and effects after N.
- [ ] An independently addressable adventure appears in the library and its later edits, gameplay and deletion do not mutate the original or any other fork; the original's later turns remain unchanged.
- [ ] Replay from valid incremental history can reconstruct the state at a chosen fork point when no materialised checkpoint exists, and Go/SQLite never exposes a partial or mixed-version fork on a failed/concurrent copy.
- [ ] Noncanonical drafts, incomplete generations and provider credentials are excluded; forking never creates an in-story branching/timeline UI or an individual-adventure file export.
- [ ] A player can explicitly fork an existing story into a newly created, independently stored adventure.
- [ ] The fork appears as its **own entry** in the adventure library and opens like any other story.
- [ ] The original story and its later turns/state remain unchanged after forking.
- [ ] The fork begins with coherent prose and authoritative world state corresponding to its selected fork point.
- [ ] Subsequent turns, events, NPC/inventory state and edits are isolated between the source adventure and the new one.
- [ ] Players do not need an in-story branch-tree/timeline-switching UI to access or manage the fork.
- [ ] Forking does not automatically regenerate, rewrite, or remove downstream prose in the original.

## Supporting detail

See [NOTE-0026](../knowledge/inbox/NOTE-0026-prd-0012-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
