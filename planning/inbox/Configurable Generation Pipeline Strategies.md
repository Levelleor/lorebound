---
id: "IDEA-0018"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Configurable Generation Pipeline Strategies

## Idea
Compare one-pass prose+events, plan-validate-narrate and draft-audit strategies.

## Why consider it?
RP narrators can invent untracked state changes; a second pass is not a complete guarantee.

## Rough behaviour
Coordinator selects stages, validates proposed events and limits repair retries.

## Variations and alternatives
Single-pass is faster; auditing costs more calls.

## Open questions and risks
- Which approach works best with weak local RP models?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- These are rough ideas, not approved requirements or implemented features.

## Decision history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
