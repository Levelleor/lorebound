---
id: "IDEA-0035"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Configurable Travel Graph Rules

## Idea
Allow strict movement rules requiring valid connections between locations.

## Why consider it?
Prevents AI teleportation when the world is meant to be spatially constrained.

## Rough behaviour
Graph edges determine legal movement; optional rules may lock doors, require permissions or restrict one hop per turn.

## Variations and alternatives
Freeform travel mode versus strict adjacent-only or valid multi-hop routing.

## Open questions and risks
- How should vague actions like 'visit the king' resolve to location IDs?

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
