---
id: "IDEA-0044"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Deterministic Adventure Coordinator

## Idea
Use a non-LLM TypeScript coordinator to orchestrate interpretation, world validation and narrative generation.

## Why consider it?
Avoid requiring multiple loaded AI models or letting narration directly rewrite data.

## Rough behaviour
Manage model calls, action batches, tool results, repair and atomic finalisation.

## Variations and alternatives
AI 'agent' acts as orchestrator versus programmatic coordinator.

## Open questions and risks
- How should the coordinator decide whether prose implies tracked state?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
