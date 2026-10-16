---
id: "IDEA-0051"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Local First Storage and Deployment Brainstorm]]", "[[Story Editing and Event Timeline Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Browser-Persistent Story Database

## Idea
Persist many long adventures in browser-local storage rather than depend on an external database.

## Why consider it?
The product should run locally with substantial stories and entities.

## Rough behaviour
Evaluate SQLite WASM + OPFS or IndexedDB with worker-based access and transactional updates.

## Variations and alternatives
Store JSON files or a small local Node database.

## Open questions and risks
- What are quota, performance and compatibility limits on target browsers?

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
