---
id: "IDEA-0011"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
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
- **Separate from retry/undo:** Retained alternate completions in [[Retry Undo and Alternative Continuations]] (IDEA-0004) remain a within-story response-choice feature. Forking creates a new independent adventure, integrated with [[Adventure Save and Export Management]] (IDEA-0005).

This is explicitly **not** acceptance of the originally proposed in-story timeline/branch-tree interface.

## Proposed behaviour
From an explicit story-level action, a player chooses to fork the adventure (potentially from a selected prior turn or saved revision). Lorebound creates a distinct adventure record and initialises that record with the necessary prose/revisions and validated state through the fork point. The fork is independently listed in the adventure library; its future events and editing history do not affect the original. The original's existing future remains undisturbed. The storage implementation may copy source data or reuse immutable internal data safely, but the visible unit is always a separate adventure, not a sub-branch inside a story.

## Alternatives and trade-offs
**Rejected from the original assistant proposal:** A branch/tree picker inside one story, multiple story heads attached to one UI entry, and branch-specific switching mechanics within the chat. The accepted alternative is to fork into a new full adventure object. Simple whole-save duplication (IDEA-0005) is related but may not supply a chosen historical fork point. Implementation may use independent copies or safe immutable sharing internally; that is not a player-visible branching feature.

## Dependencies and constraints
- Depends on independent adventure persistence, duplication, save/export (IDEA-0005), stable narrative revision IDs (IDEA-0003/IDEA-0040), and event/state reconstruction concepts (IDEA-0039/IDEA-0042).
- A new story must never share mutable world-state objects, active turn lists, or in-progress generation state with its source story.
- If forking from an earlier turn, state and derived context must match the chosen point, not the original story's latest head.
- Preserve source-story provenance if useful, but do not require a branch-tree UI or navigation inside the story.
- Forking may require a snapshot or replay at the selected point. Do not claim any specific architecture has been implemented.
- The rule against silently rewriting later prose still applies.

## Open questions
- Should the player be able to fork from any committed turn or only named save/revision points?
- How should a point-in-history be selected without adding an in-chat branch-tree mechanic?
- Does the new adventure include earlier text and events as a self-contained copy, or can immutable internal data be safely shared?
- How are provenance and source-story attribution represented without forcing branch-specific UI?
- How should a fork behave if a chosen historical revision contains pending edits or invalid world-state changes?
- Is a separate "Fork Story" library action sufficient alongside the already accepted Duplicate feature?

## Draft acceptance criteria
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
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate** proposing manual generation branches sharing earlier history.
- 2026-10-16 — **User accepted with a major modification:** "I don't like this actually being a mechanic like that in-chat. Lets just create a new story when we branch out, which is a separate object on the storage and UI." The accepted scope is **fork to a separate story/adventure object**, not the originally suggested in-chat timeline tree. Moved to staging for refinement; no production approval.
