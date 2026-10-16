---
id: "IDEA-0040"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Versioned Text Blocks and Revision IDs

## Idea
Assign stable IDs and revisions to editable prose blocks and link derived state changes to them.

## Why consider it?
Historical editing must identify precisely which facts may be invalidated.

## Rough behaviour
Store block lineage across edits and provenance of model-generated turns.

## Variations and alternatives
Paragraph blocks or turn-body range tracking.

## Open questions and risks
- How should split/merge edits retain event provenance?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
