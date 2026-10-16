---
id: "IDEA-0005"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Adventure Save and Export Management

## Idea
Create, autosave, resume, rename, duplicate, import and export separate adventures.

## Why consider it?
Long stories need recoverable and portable saves.

## Rough behaviour
Keep story revisions, entities, model profiles and events together, excluding API credentials.

## Variations and alternatives
Portable JSON, SQLite export or plain text.

## Open questions and risks
- How should imports reconcile schema versions and installed plugin dependencies?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- These are rough ideas, not approved requirements or implemented features.

## Decision history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
