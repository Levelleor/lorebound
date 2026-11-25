---
id: PRD-0069
type: prd
status: proposed
related:
- PRD-0001
- PRD-0015
- PRD-0013
- PRD-0014
- PRD-0016
- NOTE-0010
---

# Separate Provider Connection and Generation Tests

## Problem

Preserved for product evaluation only.

## Source and delivery status

[Pinned source IDEA-0068](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/staging/Separate%20Provider%20Connection%20and%20Generation%20Tests.md) · origin: mixed; created: 2026-11-14; updated: 2026-11-14; accepted at: 2026-11-14; accepted by: requesting user (explicit chat: accepted idea)

**Accepted for refinement only, not implementation-ready.**

## Goals and acceptance details

## Idea

Separate a basic **Test connection** action from an optional **Test generation** action. Each provider adapter chooses an appropriate connection/access check rather than relying on one universal prompt, response string or reasoning-disable parameter.

The user explicitly accepted this idea on 2026-11-14 with “accepted idea”. It is now in staging for refinement, preserving the same ID, original capture and provenance. Production readiness and implementation launch remain separate decisions.

## Accepted direction

- Separate basic connection/access testing from optional generation testing.
- Each provider adapter chooses appropriate checks for its API and capabilities, including custom endpoints, instead of treating one provider-specific approach as universal.
- Connection success must not depend on the literal answer `OK` or universal support for disabling reasoning. Results should distinguish what a connection check establishes from actual generation support.

## Why consider it?

During review of [DEV-004C](../work/items/STORY-0026-explicit-local-connection-testing.md), a reasoning model exhausted the short synthetic generation budget before returning final text. This made the connection feedback confusing despite a working endpoint. The user questioned a llama.cpp-specific workaround and asked how a general connection test would work with their own endpoints or cloud providers such as Gemini.

Separating the checks could make the result's meaning clearer and avoid unnecessary inference merely to establish basic access. A server health response, authentication check, model listing and successful generation establish different things.

## Rough behaviour — for later refinement

- **Test connection:** the selected provider adapter uses supported API checks for reachability, access/authentication and model availability where those can actually be established. Report what was checked and what remains unknown; a public health response alone does not prove authenticated model access or generation support.
- **Test generation:** a separate explicit action makes a small inference request using the selected provider/model and reports its outcome. Potential inference cost and limits should be understandable before invocation.
- Neither test depends on the literal answer `OK`, or on every model supporting a particular no-thinking option. Provider-specific capability handling belongs to its adapter.
- Keep requests in browser TypeScript under the accepted direct-networking boundary. Tests do not change story canon, silently choose providers, or become prerequisites for ordinary manual work.

These details are a working outline, not accepted implementation criteria. Existing provider/credential work and explicit testing/discovery choices still need to be respected.

## Variations and alternatives

- Provider health/readiness or model-metadata requests, where suitable, for the basic check.
- A minimal inference probe when a provider has no useful non-generating check; whether this needs a separate explicit action remains open.
- Present connectivity/access/model/generation results separately so partial evidence is useful without overstating success.

## Open questions and risks

- Which non-generating checks exist for each accepted cloud/local provider, and what does each establish about credentials and the selected model?
- What should Test connection report when health/model discovery is unsupported, while manual model IDs and generation may still work?
- How should custom compatible endpoints select a check without assuming llama.cpp-specific routes or parameters?
- What small request budgets, reasoning/capability handling and cancellation semantics suit optional generation tests?
- How should this refine the existing accepted connection-testing scope without claiming health proves generation or server model-routing fidelity?

## Evaluation notes

Related accepted scope is owned by [IDEA-0014](PRD-0015-provider-connection-profiles-and-discovery.md), including its open question about lightweight probes versus generation calls. This accepted idea refines that distinction; it does not replace the original note, add new provider promises or declare Gemini/credential support implemented. It originated during review of [PR #23](https://github.com/Levelleor/lorebound/pull/23), which remains a separate development matter. Acceptance into staging changes no application behavior or merge authority.

## Decision history

- **2026-11-14 — User concern:** requested a frontend connection test that works reliably across their own APIs/providers and suggested a health check as an alternative to asking for `OK`.
- **2026-11-14 — AI possibility:** proposed provider-appropriate basic connection/access testing separately from optional generation testing, without a universal reasoning-disable requirement.
- **2026-11-14 — User direction:** “yeah, I agree with that. Lets ensure we log that for future as an idea”. Agreement with the direction and future capture are recorded; no staging promotion, implementation-readiness, implementation launch or PR merge approval was requested. Candidate remains unaccepted in Inbox pending those separate gates.
- **2026-11-14 — Explicit acceptance:** User replied “accepted idea”. Moved this same IDEA-0068 note from Inbox to staging, retaining ID, origin, source brainstorm and capture history. Accepted for refinement; no production-readiness approval, implementation launch or PR merge approval follows.
