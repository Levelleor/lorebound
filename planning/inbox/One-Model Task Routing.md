---
id: "IDEA-0017"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Lorebound Vision Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# One-Model Task Routing

## Idea
Run narration, interpretation and summaries sequentially on one loaded local model while allowing optional task-specific models.

## Why consider it?
Users may only have enough memory for one LLM.

## Rough behaviour
Treat tasks as separate prompts/profiles routed to the same endpoint by default.

## Variations and alternatives
Dedicated planner model is optional, never mandatory.

## Open questions and risks
- How much latency is acceptable for extra passes?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- These are rough ideas, not approved requirements or implemented features.

## Decision history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
