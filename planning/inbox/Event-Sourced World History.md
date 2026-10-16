---
id: "IDEA-0039"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Lorebound Vision Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Event-Sourced World History

## Idea
Persist accepted changes as append-only events rather than duplicating full world state every turn.

## Why consider it?
Makes undo, historical reconstruction and multi-entity consistency possible.

## Rough behaviour
Events include source turn, entity, type, order, validation and revision; reducers reconstruct active state.

## Variations and alternatives
Full state snapshots every turn are simpler but larger.

## Open questions and risks
- How should schema versions and event dependencies evolve?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
