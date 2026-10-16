---
id: "IDEA-0046"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[World Map and Location Rules Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Typed Tool Rejection and Narrative Repair

## Idea
Reject invalid operations with structured reasons and let the narrator reflect or correct the failed action.

## Why consider it?
An overweight pickup or illegal movement cannot be committed as success.

## Rough behaviour
Validate candidate operations; return codes/reachable alternatives; bounded repair before committing final prose.

## Variations and alternatives
Failure can become an in-story failed attempt rather than forcing a rewrite.

## Open questions and risks
- How to respond if a model repeats invalid claims after two attempts?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
