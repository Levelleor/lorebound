---
id: "IDEA-0015"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Model-Capability-Aware Controls

## Idea
Disable or mark unsupported sampling options and omit them from normal requests.

## Why consider it?
Unsupported values may fail or be ignored silently.

## Rough behaviour
Track supported, unsupported, ignored and unknown parameter states; permit explicit advanced override.

## Variations and alternatives
Blindly send every parameter and trust the API, which is less reliable.

## Open questions and risks
- How are model capability definitions updated over time?

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- These are rough ideas, not approved requirements or implemented features.

## Decision history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
