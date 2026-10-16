---
id: "IDEA-0019"
type: idea
status: candidate
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Streaming Cancellation and Generation Diagnostics

## Idea
Stream output, cancel requests and inspect inference settings, errors, usage and timing.

## Why consider it?
Long local inference needs responsive feedback.

## Rough behaviour
Distinguish provisional streamed text from fully validated committed narration.

## Variations and alternatives
Display drafts early or wait until final validation.

## Open questions and risks
- How should cancellation clean up proposed but uncommitted events?

## Evaluation notes
- Origin: **agent**. Assistant-proposed option, not a confirmed user preference.
- These are rough ideas, not approved requirements or implemented features.

## Decision history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
