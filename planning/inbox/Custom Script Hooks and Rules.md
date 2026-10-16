---
id: "IDEA-0058"
type: idea
status: candidate
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Custom Script Hooks and Rules

## Idea
Support user-authored scripts and hooks around input, context, output and registered game operations.

## Why consider it?
Advanced creators may wish to extend rules beyond built-in plugins.

## Rough behaviour
Expose a limited persistent state and versioned hook points, subject to permissions.

## Variations and alternatives
Declarative plugins only versus arbitrary JavaScript execution.

## Open questions and risks
- How will script isolation and persistent hook-state migrations work locally?

## Evaluation notes
- Origin: **agent**. Assistant-proposed option, not a confirmed user preference.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
