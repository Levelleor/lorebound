---
id: "IDEA-0013"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Local LLM Server Connections

## Idea
Connect to Ollama, LM Studio, vLLM and manually configured local/network model servers.

## Why consider it?
One locally served model must be sufficient for play.

## Rough behaviour
Profiles store endpoint, model ID and optional authentication/headers.

## Variations and alternatives
Host inference externally now, add a built-in model manager later.

## Open questions and risks
- Which server transports need dedicated support?

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- These are rough ideas, not approved requirements or implemented features.

## Decision history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
