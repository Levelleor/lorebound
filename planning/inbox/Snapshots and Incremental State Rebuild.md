---
id: "IDEA-0042"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Snapshots and Incremental State Rebuild

## Idea
Replay only affected events from the latest valid checkpoint following historical edits.

## Why consider it?
Full-history rebuilds can become costly in very long adventures.

## Rough behaviour
Store periodic materialised snapshots and invalidate summaries/projections derived from edited or deleted turns.

## Variations and alternatives
Every 25 to 100 turns as an experimental interval versus adaptive checkpoints.

## Open questions and risks
- When is an older snapshot still valid after a multi-block edit?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
