---
id: "IDEA-0033"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[World Map and Location Rules Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Hierarchical World Locations

## Idea
Organise places into nested worlds, regions, settlements, buildings and rooms.

## Why consider it?
Allows a rich setting with intuitive zoom levels and local scene context.

## Rough behaviour
Each location has stable ID, name, parent, description and children; hierarchy differs from travel links.

## Variations and alternatives
Strict type hierarchy or fully flexible location containers.

## Open questions and risks
- How should a parent/child transition work when there is no direct connection?

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
