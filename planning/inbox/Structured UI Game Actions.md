---
id: "IDEA-0050"
type: idea
status: candidate
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[World Map and Location Rules Brainstorm]]", "[[Characters Inventory Equipment and Anatomy Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Structured UI Game Actions

## Idea
Use direct UI actions such as map clicks and Equip buttons to generate typed commands without language parsing.

## Why consider it?
Typed actions save LLM calls and avoid destination/entity ambiguity.

## Rough behaviour
Pass stable IDs to deterministic validators, then have the narrator describe outcomes.

## Variations and alternatives
Keep all input as prose; simpler UI but less efficient.

## Open questions and risks
- Should map clicks act immediately or prepare a narrated travel attempt?

## Evaluation notes
- Origin: **agent**. Assistant-proposed option, not a confirmed user preference.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
