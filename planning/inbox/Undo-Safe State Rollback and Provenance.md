---
id: "IDEA-0043"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Undo-Safe State Rollback and Provenance

## Idea
Track source and revision for each world-state change so undo and manual edits remain coherent.

## Why consider it?
The text and authoritative state must move through history together.

## Rough behaviour
Record whether a mutation came from AI, user or plugin; undo a turn restores its event-derived state.

## Variations and alternatives
Store inverse events versus replaying from a checkpoint.

## Open questions and risks
- What takes precedence when later user overrides conflict with reconstructed AI changes?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Skipped for now by the requesting user** during the sequential idea review. This is a deferral of a decision, **not acceptance or rejection**. Retain in Inbox with `status: candidate` for possible future review; no staging promotion.
