---
id: "IDEA-0047"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Native Gameplay Capability Registry

## Idea
Let mods register discoverable validated operations against a shared entity/world state.

## Why consider it?
New mechanics should integrate without teaching every RP model each implementation detail.

## Rough behaviour
Contracts describe ID, schemas, permissions, validate, prepare and event-producing execution.

## Variations and alternatives
Hard-code all game tools or make MCP itself the engine boundary.

## Open questions and risks
- How are plugin schemas versioned, permissions assigned and modules unloaded?

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
