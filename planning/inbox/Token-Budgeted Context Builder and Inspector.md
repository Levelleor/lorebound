---
id: "IDEA-0024"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Memory Lorebook and Context Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Token-Budgeted Context Builder and Inspector

## Idea
Allocate context among instructions, scene, lore, state, memories and recent prose, and let the player inspect it.

## Why consider it?
Overlong prompts harm model quality and can exceed limits.

## Rough behaviour
Show selected entries, priorities, estimated tokens and what was omitted.

## Variations and alternatives
Automatic selection with optional manual override.

## Open questions and risks
- How to estimate token use accurately for heterogeneous models?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- These are rough ideas, not approved requirements or implemented features.

## Decision history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
