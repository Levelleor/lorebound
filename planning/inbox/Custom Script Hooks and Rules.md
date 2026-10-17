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
- 2026-10-16 — **Skipped for now by the requesting user**, not accepted or rejected. The accepted [[Native Gameplay Capability Registry]] (IDEA-0047) already offers a universal, permissioned typed extension mechanism, and [[Optional RPG Mechanics Plugins]] (IDEA-0055) provides modular gameplay rules using that same coordinator/state pipeline. Avoid introducing a redundant layer of arbitrary user-authored script execution and input/context/output hooks before a concrete unmet need justifies the sandboxing, replay, migration and security complexity. Retain the possibility of limited **sandboxed hooks** for future consideration if actual creator requirements arise. Keep the original idea in Inbox with `status: candidate`, unchanged provenance, and no staging or production promotion.
