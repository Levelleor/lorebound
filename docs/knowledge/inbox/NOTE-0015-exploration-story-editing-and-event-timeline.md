---
id: NOTE-0015
type: note
status: inbox
source: PRD-0001
related:
- PRD-0010
- PRD-0044
- PRD-0023
- PRD-0052
- PRD-0004
- PRD-0040
- PRD-0042
- PRD-0012
- PRD-0005
- PRD-0043
- PRD-0041
---

# Exploration: Story Editing and Event Timeline

## Discovery

Exploratory history, not project authority. Original session status: **active**. Accepted requirements and decisions take precedence; candidate suggestions remain non-authorizing.

[Pinned source working notes and dated session log](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/brainstorming/Story%20Editing%20and%20Event%20Timeline%20Brainstorm.md)

## Goal
Design NovelAI-like inline editing without expensive unnecessary reprocessing or duplicating all game state.

## Context
- Retrospective consolidation of the project-design conversation through 2026-10-16. This records wishes, proposals, trade-offs, and open questions; it is **not** an implementation specification or approval to ship.
- Repository guidance: Start Here (in the planning vault) and the repository AGENTS.md. No application functionality is asserted as implemented.
- Terminology: **User direction** = explicitly expressed preference; **AI possibility** = suggested but not selected; **Open** = requires a design decision.

## Editable narrative
- Prose is an editable document, not an immutable chain of chat messages. Players can insert, remove or modify text within earlier messages, paragraphs or turns.
- Give logical text blocks stable IDs, version IDs and original generation/turn provenance; support selection, direct edits, undo/redo, retry/regenerate *current* output, and ordinary Continue / Do / Say / Story action modes.
- Editor and world state are distinct: changing canvas coordinates is UI layout, changing a character's location is a world event.
- Maintain full raw history even when only a recent window reaches the narrator.

## Explicitly simplified historical edit UX (user direction)
1. Editing old prose enters a **pending edit session**; preserve draft changes, but do not run LLM extraction or state replay on every keystroke.
2. The player may edit several earlier blocks, correct future prose manually, or select/truncate all future turns.
3. Before any rebuild, present a clear choice: **Keep later turns** or **Delete later turns after this point**, plus Continue Editing / Discard Changes.
4. After selection, identify earliest impacted surviving block, choose the correct preceding state checkpoint, rebuild only the surviving suffix, then save the active revision.
5. Keeping later turns means the user owns continuity fixes. **No automatic contradiction flagging or later prose regeneration in this version.**
6. Truncation should avoid parsing, summarising, or repairing turns that are being removed. Remove from the *active* timeline; optional recoverable history/garbage collection policy remains open.
7. Multiple pending edits commit together, ideally transactionally with associated accepted world events and refreshed projections.

## Event-sourced world state (AI possibility user supported)
Store *events/deltas*, not full copies of every character per turn. Examples:
~~~json
{"type":"item.transferred","itemId":"sword-1","from":"kaelen","to":"elara","originBlockId":"block-42"}
{"type":"character.moved","characterId":"elara","from":"town-square","to":"silver-inn"}
{"type":"location.discovered","locationId":"hidden-cave","parentId":"forest"}
~~~
- Every event has stable ID, event schema/version, actor/source, originating block/turn, ordering, revision or branch association, status and optional validation metadata.
- Deterministic reducers replay accepted events into materialised views (character sheet, inventory, equipment, map, scene, NPC position).
- Periodic snapshots/checkpoints speed up reconstruction. Suggested interval **25–100 turns** is an experiment, not decided.
- Story summaries, embeddings and extracted memories are *derived projections* and can be rebuilt, invalidated or refreshed after edits.
- Use a branch/head pointer or revision graph for undo/truncation; preserve original events as appropriate for recovery without affecting active world truth.
- Manual sheet edits also create events (with user override/provenance), rather than silently replacing the source of truth.

## Tricky cases to solve
- Old edit deletes the event that created an item, but later turns transfer or equip it.
- Undoing a generated turn must undo its world events; otherwise prose and inventory diverge.
- Player deletes later turns with summaries already calculated from them.
- Several simultaneous draft edits affect the same event; re-extraction must not duplicate it.
- Failed reconstruction, malformed interpreter output, storage quota exhaustion and cancellation must not corrupt the previous committed adventure.
- An external MCP tool's side effects must not be rerun during event replay.

## Alternatives considered, now deferred
- Regenerate continuation from edited text in a new branch.
- Automatic narrative contradiction detection and repair after retroactive edits.
Both were explicitly excluded from the current version, though the event format may avoid precluding them forever.


## Current Threads
- Pick block granularity and text-document history representation.
- Specify checkpoint invalidation, schema migrations and crash-safe reconstruction.
- Decide whether truncated history stays recoverable and for how long.
- Decide how manual corrections outrank older AI-extracted facts.

## Decisions
- Historical edits are allowed directly in prior prose.
- Current version retains manual continuity management, optional bulk deletion, and deliberate confirmation before reprocessing.
- No automatic continuation replacement or automatic contradiction-flagging flow.

## Classification

Historical exploration; related product records contain approval and implementation boundaries.
