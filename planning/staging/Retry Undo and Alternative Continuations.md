---
id: "IDEA-0004"
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
# Retry Undo and Alternative Continuations

## Idea
Support response retry, undo/redo and a choice of alternative generated continuations.

## Why this idea matters
Players can refine undesired AI turns while retaining their story.

## Accepted direction
- **Retry:** Generate another response to the selected prompt, starting with support for the most recent generation.
- **Undo:** Revert an accepted narrative action or generated turn and its corresponding committed world-state changes.
- **Redo:** Restore an undone change when still applicable and no incompatible later action has replaced it.
- **Retained alternatives:** Keep prior generated continuations so the player can switch among available versions rather than lose a result on every retry.
- **State alignment:** Narrative versions and proposed/accepted world-state events must remain linked. Only the selected active version determines authoritative state.
- **No automatic downstream rewrites:** Switching, undoing or retrying a response must not silently regenerate subsequent story prose. Handling old turns with existing later history stays a separate refinement concern.

## Proposed behaviour
Track candidate generated responses and the state proposals associated with each. When the player chooses a version, validate its effects and apply that version as the active story continuation. Undo returns to a previous narrative/event state; redo restores the undone version where still valid. Unselected variants remain available for comparison but do not contribute their effects to the active world.

## Alternatives and trade-offs
Simple retry without retaining old candidates is easier to implement, but does not satisfy the accepted retained-alternatives feature. A full arbitrary-history branching editor is not accepted here and remains separately discussable. Persistence and exact retention limits are still open.

## Dependencies and constraints
- Depends on the editable narrative document and stable block IDs ([[Direct Editable Prose Document]]), plus event provenance, versioned state commits and undo-safe replay.
- Rejected or inactive narrative variants must not leave inventory, location, NPC condition or other world-state changes behind.
- Redo must respect divergence: a new conflicting action can invalidate the redo path.
- Failed validation cannot turn provisional narrative into an authoritative event merely because a response is selected.
- The experience must not automatically rewrite all later prose when an older version changes.

## Open questions
- Should saved alternatives be available only for the newest turn, or also for old turns whose downstream state now depends on them?
- What happens if the user chooses an old variant while later turns exist: reject, require truncation, or offer explicit manual continuity editing?
- Should variants be stored indefinitely, or capped by count, size or user preference?
- How do undo/redo and manual text revisions share a single coherent history?

## Draft acceptance criteria
- [ ] A player can retry a selected generation and receive a distinct candidate without losing the original.
- [ ] The player can switch among retained candidate continuations for a supported turn.
- [ ] Exactly one selected version's validated events contribute to authoritative state at a time.
- [ ] Undoing a turn also reverts that turn's associated authoritative state changes.
- [ ] Redo restores a valid undone narrative/state version; incompatible divergence is handled explicitly.
- [ ] Inactive variants do not leak inventory, location or other game effects into the active adventure.
- [ ] Neither retry nor undo/redo silently regenerates later story prose.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant suggestion, subsequently explicitly accepted by the user.
- The direction is accepted for **staging and refinement**, not approved for production or implemented.

## Decisions and review history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user**: Retry, Undo, Redo and retained alternative continuations, linked to corresponding world-state events, with no automatic downstream rewrites. Promoted to staging for refinement, not to production.
