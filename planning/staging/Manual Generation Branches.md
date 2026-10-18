---
id: "IDEA-0011"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Story Editing and Event Timeline Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Manual Generation Branches

## Idea
Allow a player to fork an adventure into a **new, independent story/adventure object**, rather than maintaining a branch tree or multiple active timelines inside one story's chat/editor. The fork preserves appropriate history and authoritative world state through the selected starting point, then continues independently.

## Why this idea matters
Players can explore different outcomes without losing the original version.

## Accepted direction
- **Fork means new story:** When a player decides to branch away from an existing adventure, create an independently addressable story/adventure object in persistent storage. The original story remains separate and unchanged.
- **Separate UI entry:** The new story appears as its own item in the adventure/story library and is opened, edited, saved, renamed, and resumed like any other adventure.
- **No in-chat branch mechanic:** Do **not** add nested timelines, a branch graph, or branch-switching widgets inside an individual story's narrative UI.
- **State at the fork point:** Seed the new story with appropriate narrative history and coherent corresponding world state up to the chosen fork point. Subsequent prose, events, memories, and state changes belong solely to the new story.
- **No automatic downstream rewrites:** The original story's later prose and world state stay intact; creating the new story must not regenerate later turns or rewrite another story.
- **Separate from retry and committed Undo (updated IDEA-0004):** No retained selectable AI response alternatives exist within a story. Retry **replaces** an uncommitted generation; committed Undo can roll back the active head and allow a **different continuation in the same adventure**. Fork instead creates an **independent saved adventure when the player wants the original and different future both to survive**.

This is explicitly **not** acceptance of the originally proposed in-story timeline/branch-tree interface.

## Proposed behaviour
From an explicit story-level action, a player chooses to fork the adventure (potentially from a selected prior turn or saved revision). Lorebound creates a distinct adventure record and initialises that record with the necessary prose/revisions and validated state through the fork point. The fork is independently listed in the adventure library; its future events and editing history do not affect the original. The original's existing future remains undisturbed. The storage implementation may copy source data or reuse immutable internal data safely, but the visible unit is always a separate adventure, not a sub-branch inside a story.

## Alternatives and trade-offs
**Rejected from the original assistant proposal:** A branch/tree picker inside one story, multiple story heads attached to one UI entry, and branch-specific switching mechanics within the chat. The accepted alternative is to fork into a new full adventure object. Simple whole-save duplication (IDEA-0005) is related but may not supply a chosen historical fork point. Implementation may use independent copies or safe immutable sharing internally; that is not a player-visible branching feature.

## Fork from any committed story turn
- **Explicit user choice (2026-10-18):** A player may fork an adventure at **any committed story-turn boundary**, not only named saves, manually created checkpoints, or turns with materialised snapshots. Choose an actual accepted turn in the source adventure's authoritative active history; **drafts, provisional AI output, uncommitted historical edits and rejected or invalid turns are never valid fork points**.
- **Exact committed prefix and state:** The new fork is a **separate saved adventure** with its own identity, containing the **complete accepted narrative and reconstructible canonical history from the source's beginning through and including the selected turn**. This includes applicable initial baseline/Lorebook, accepted text-revision lineage, ordered events and world state, valid relationships/entity records, context/memory and supported durable plugin data **as they stood at that boundary**. All following source turns/revisions/events/state changes belong only to the original and must **not** be copied to the fork or influence the fork's starting current state. No unsent composer text, unconfirmed prose-edit drafts, pending generations, credentials or incomplete operations cross over.
- **Independent future:** Subsequent turns, renames, edits, world/lore updates and deletions in either adventure cannot mutate the other. Internal references/provenance must be coherent in the new adventure; copying committed source data or safely sharing strictly immutable infrastructure are implementation options, but **no mutable canonical records are shared**. The source's later history remains intact, even though the fork omits it.
- **Reconstruction over mandatory snapshots:** Obtain the chosen boundary's authoritative world state by replay of committed incremental history, optionally accelerated by valid stored snapshots. **Every committed turn must remain forkable even with no snapshot at that exact point**; this selects no checkpoint cadence, special named-save feature or algorithm.
- **Safe fork creation:** Validate the chosen committed turn and source version; create the complete independent fork coherently within Go/SQLite or fail without leaving a partially copied adventure. Concurrent source changes must not produce a mixed-version copied prefix; exact transaction, version-pinning and ID remapping schemes remain implementation details.
- **Separate feature boundaries:** This is an **in-library fork**, not file export/import, an in-story branch tree, a retry-candidate selector, the historical-edit Keep/Delete workflow, or a mandatory prerequisite for committed Undo. **Undo may replace the active future within one adventure**; Fork is needed to **preserve two independent playable futures**. How to choose source turns and show attribution remains open.

## Fork preserves an alternate future; ordinary Undo does not
- **Accepted IDEA-0004 refinement (2026-10-18):** There is exactly **one active canonical story timeline per adventure**. Uncommitted response Retry discards the preceding candidate. **Committed Undo** may roll the active adventure back from Turn N to N-1 with deterministic state reconstruction and let the player **continue differently in the same adventure**, **without preserving the undone future as another selectable version**.
- **Fork is the preservation choice, not a requirement to change course:** To retain **both** an established original future and a new direction, fork from the desired **committed turn** into a **second independent adventure**, leaving the original unchanged. Forks have independently persisted Lorebook/world data. The explicit Fork action is what saves both futures; Undo alone changes the active head of the one adventure.
- No in-story response variant stack, branch graph or auto-fork on Retry/Undo. Any inactive audit records needed for historical integrity are **not playable alternate completions**; exact representation remains implementation detail.

## Dependencies and constraints
- Depends on independent adventure persistence, duplication, save/export (IDEA-0005), stable narrative revision IDs (IDEA-0003/IDEA-0040), and event/state reconstruction concepts (IDEA-0039/IDEA-0042).
- A new story must never share mutable world-state objects, active turn lists, or in-progress generation state with its source story.
- If forking from an earlier turn, state and derived context must match the chosen point, not the original story's latest head.
- Preserve source-story provenance if useful, but do not require a branch-tree UI or navigation inside the story.
- Forking may require a snapshot or replay at the selected point. Do not claim any specific architecture has been implemented.
- The rule against silently rewriting later prose still applies.

## Open questions
- **Resolved:** Fork from **any committed story turn**, not only named save points or materialised checkpoints. Exact turn selection/navigation in the UI remains for later refinement.
- How should a point-in-history be selected without adding an in-chat branch-tree mechanic?
- **Resolved user-visible requirement:** The fork independently owns all accepted history, text, provenance and state **through the selected turn** with no later source turns and no shared mutable data. Whether immutable internal infrastructure may be safely shared remains a technical implementation detail.
- How are provenance and source-story attribution represented without forcing branch-specific UI?
- How should a fork behave if a chosen historical revision contains pending edits or invalid world-state changes?
- Is a separate "Fork Story" library action sufficient alongside the already accepted Duplicate feature?

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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Original assistant proposal was revised and explicitly accepted by the user only in its **new-independent-story** form.
- The original proposed in-chat branch mechanic is **not accepted**.
- Accepted for staging/refinement only; not approved for production or implemented.

## Decisions and review history
- 2026-10-18 — **IDEA-0004 committed Undo Option B supersedes prior variant assumptions:** A normal committed Undo moves the active head back and permits another continuation **within the same adventure**; it does **not** preserve the displaced future as a selectable branch. Explicit Fork remains available from any committed turn **to keep both futures as distinct adventures**. No in-story AI variant stack or branch picker. Staging only.
- 2026-10-18 — **User explicitly selected fork-point Option A:** A **new independent adventure can fork from any committed story turn**, with the full authoritative text/history and reconstructible state through and including that turn, but none of the original's subsequent turns/effects. No mandatory named checkpoint or snapshot, drafts or provisional output; source remains intact. Correct transaction/version/ID safety and UI turn selection still need implementation refinement. This remains staging only, not code or production approval.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate** proposing manual generation branches sharing earlier history.
- 2026-10-16 — **User accepted with a major modification:** "I don't like this actually being a mechanic like that in-chat. Lets just create a new story when we branch out, which is a separate object on the storage and UI." The accepted scope is **fork to a separate story/adventure object**, not the originally suggested in-chat timeline tree. Moved to staging for refinement; no production approval.
