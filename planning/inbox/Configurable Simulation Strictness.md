---
id: "IDEA-0049"
type: idea
status: candidate
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Configurable Simulation Strictness

## Idea
Offer freeform, balanced and strict validation policies per story.

## Why consider it?
Creative fiction and rule-bound simulation tolerate different levels of structure and latency.

## Rough behaviour
Set tracking/validation intensity, repair behaviour and call budgets by profile.

## Variations and alternatives
Choose one universal mode initially for simplicity.

## Open questions and risks
- How much narrative drift is acceptable in freeform mode?

## Evaluation notes
- Origin: **agent**. Assistant-proposed option, not a confirmed user preference.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Skipped for now by the requesting user** during sequential review, **not accepted or rejected**. Instead of global Freeform/Balanced/Strict profiles, prefer **per-feature or per-plugin enable/disable toggles** for now: a player who wants looser gameplay can disable optional systems such as inventory rather than weaken validation throughout the adventure. Enabled mechanics must continue to obey their ordinary rules, and any persistent state changes must remain compatible with complete incremental history. This is a rationale for skipping the separate strictness-profile candidate, not production approval for a toggle UI or an implementation design. Keep IDEA-0049 in Inbox as `status: candidate` for future review.
