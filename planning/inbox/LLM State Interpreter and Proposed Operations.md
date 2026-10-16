---
id: "IDEA-0045"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# LLM State Interpreter and Proposed Operations

## Idea
Use an LLM role to convert arbitrary player language or draft prose into proposed typed changes.

## Why consider it?
Plain TypeScript cannot reliably infer meanings from unconstrained natural language.

## Rough behaviour
Request schema-checked operations with resolved entity references; reuse narrator model sequentially if necessary.

## Variations and alternatives
Native function calling where available versus constrained JSON extraction.

## Open questions and risks
- How reliable is extraction on RP models not trained for tool usage?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
