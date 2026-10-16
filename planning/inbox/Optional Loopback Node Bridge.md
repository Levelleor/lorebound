---
id: "IDEA-0054"
type: idea
status: candidate
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Local First Storage and Deployment Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Optional Loopback Node Bridge

## Idea
Provide a small optional local service for CORS proxying, API credentials and stdio MCP processes.

## Why consider it?
Some remote APIs and local tool transports cannot work directly in a browser.

## Rough behaviour
Bind to loopback, restrict origins/requests, proxy configured endpoints and launch approved MCP servers.

## Variations and alternatives
Browser-only mode for directly accessible endpoints.

## Open questions and risks
- How will credentials and permissions be stored without turning the bridge into an open proxy?

## Evaluation notes
- Origin: **agent**. Assistant-proposed option, not a confirmed user preference.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
