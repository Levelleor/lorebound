---
id: "IDEA-0038"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Persistent Location State and Travel Interactions

## Idea
Store mutable facts about places, routes, doors, containers and traversal.

## Why consider it?
Scenes should remember locked doors, depleted chests and destroyed structures.

## Rough behaviour
Location changes become validated events, with updated connected routes and scene descriptions.

## Variations and alternatives
Introduce basic locations first; add environmental rules with plugins.

## Open questions and risks
- How does a changed or destroyed route affect planned movement?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
