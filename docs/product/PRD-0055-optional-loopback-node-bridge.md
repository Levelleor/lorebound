---
id: PRD-0055
type: prd
status: proposed
related:
- PRD-0001
- NOTE-0011
- NOTE-0008
- NOTE-0010
---

# Optional Loopback Node Bridge

## Problem

Preserved for product evaluation only.

## Source and delivery status

[Pinned source IDEA-0054](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/inbox/Optional%20Loopback%20Node%20Bridge.md) · origin: agent; created: 2026-10-16; updated: 2026-10-16

**Captured candidate; no approval to implement.**

## Goals and acceptance details

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
- 2026-10-16 — **Skipped for now by the requesting user**, neither accepted nor rejected. The accepted Localhost Startup and Offline Mode (IDEA-0053) already provides Tauri desktop native integration and SvelteKit npm/localhost server-side integration paths for operations outside ordinary browser capabilities. Avoid a redundant **standalone Node bridge** for CORS, credentials or local processes when those paths suffice. Keep future optional interoperability possible through the **universal, protocol-neutral capability contracts** in accepted Native Gameplay Capability Registry (IDEA-0047), without implementing or mandating a separate bridge or resurrecting skipped MCP connectivity (IDEA-0048). Keep this note in Inbox as `status: candidate` for possible later review if a distinct unmet deployment need arises.
