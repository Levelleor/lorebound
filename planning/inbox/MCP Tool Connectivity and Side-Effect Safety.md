---
id: "IDEA-0048"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# MCP Tool Connectivity and Side-Effect Safety

## Idea
Support optional MCP tools and external integrations alongside native game capabilities.

## Why consider it?
Future mods may fetch external information or provide additional actions.

## Rough behaviour
Separate read-only, transactional game and external side-effect tools; never rerun side effects during timeline replay.

## Variations and alternatives
Browser HTTP MCP where permitted; local stdio MCP through optional bridge.

## Open questions and risks
- How should external confirmation, authentication, failures and irreversible effects work?

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
