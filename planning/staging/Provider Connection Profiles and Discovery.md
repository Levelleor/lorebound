---
id: "IDEA-0014"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Provider Connection Profiles and Discovery

## Idea
Save and test several connections and discover provider models when possible.

## Why this idea matters
Avoid repetitive setup and opaque connection failures.

## Accepted direction
- **Multiple saved profiles:** A user can save, name, edit, select and reuse more than one cloud or local AI provider connection without repeating setup for each adventure.
- **Configurable endpoints:** Each profile can specify a provider/server type and a base URL or custom endpoint, including local/LAN servers and compatible gateways.
- **Credentials and headers:** Support provider keys or other applicable authentication and optional custom headers. Treat secret values as connection-level secrets, not adventure content.
- **Timeouts and retries:** Offer configurable request timeout and retry preferences. Exact defaults, safe retry boundaries and error-classification policy are for later refinement.
- **Optional model discovery:** Query a provider/server's model listing when supported, and present the available model IDs or choices.
- **Manual model ID:** Allow entry and selection of a model identifier even if model discovery is unsupported or fails.
- **Connection testing:** Provide an explicit test that helps diagnose unavailable endpoints, authentication failures, invalid model identifiers or other connection errors.
- **No credential export:** Adventure save/export/import must not contain provider credentials, secret custom headers or access tokens, consistent with [[Adventure Save and Export Management]] (IDEA-0005).
- **No discovery prerequisite:** Manual profiles remain usable without a successful model-list response.

## Proposed behaviour
Expose a reusable connection manager for cloud APIs and user-hosted local endpoints. A profile records its name, provider type, URL, selected model, optional nonsecret headers and other preferences; credentials and secret header values must be kept separately or otherwise protected and excluded from adventure exports. A player can select a profile, optionally discover models, enter an ID manually, and invoke Test Connection to receive actionable feedback. Timeout and retry controls are configurable but must avoid unsafe replay of generation or state-committing operations.

## Alternatives and trade-offs
Automatic model discovery makes well-supported APIs easier to use but may be unavailable, incomplete or unreliable, especially for custom gateways and local servers. Manual-only configuration is flexible but error-prone. The accepted approach includes **both** optional discovery and manual entry. Precise credential storage technology, defaults, connection test depth and automatic retry policies remain open.

## Dependencies and constraints
- Builds on accepted [[Cloud LLM Provider Connectors]] (IDEA-0012) and [[Local LLM Server Connections]] (IDEA-0013), including explicit llama.cpp support.
- Provider auth, model enumeration, error types and supported response formats differ; connection tests should identify their limits rather than claim universal validation.
- A saved profile must not leak API keys, bearer tokens or secret headers through adventure exports, prompts, diagnostic logs or UI previews.
- Retry semantics must avoid duplicating accepted narrative turns, side-effecting tools, or authoritative world-state changes; requests with unknown success must be handled carefully.
- Localhost/LAN access can be restricted by browser CORS and private-network rules; testing needs to report such restrictions clearly.
- Profiles can name an unavailable model or endpoint without silently mutating saved story content.

## Open questions
- How should custom gateways and dynamically listed models be identified, cached and refreshed?
- What is the secure local credential-storage design in an account-free, browser-first application?
- What distinguishes a lightweight connectivity probe from an actual test-generation call, and what costs could a cloud test incur?
- Which errors should be eligible for automatic retry, and how can attempts remain idempotent and safe?
- What timeout and retry defaults should be applied to generation, discovery and connectivity tests?
- How should a profile handle multiple endpoint URLs or provider-specific authentication schemes?

## Draft acceptance criteria
- [ ] A user can create, edit, name, save, select and reuse several independent provider connection profiles.
- [ ] Profiles support custom base URLs, model IDs, credentials/authentication, optional headers, timeouts and configurable retry preferences where relevant.
- [ ] Supported providers/servers may expose discoverable models, which the UI can list without requiring discovery on every connection.
- [ ] A user can enter a model ID manually even when discovery fails or is unsupported.
- [ ] An explicit connection-test action provides useful feedback on at least reachability/authentication and, when supported, model validity.
- [ ] Failed connection tests or unsafe retries do not commit narrative output or game-world state.
- [ ] Credentials, access tokens and secret header values are excluded from adventure exports and story prompts.
- [ ] A configured compatible endpoint remains usable without a model-discovery API.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant-proposed option, subsequently explicitly accepted by the user.
- Accepted for staging and refinement only; not approved for production or implemented.

## Decisions and review history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Multiple saved connection profiles, configurable endpoints, credentials and headers, timeout and retry settings, optional model discovery, manual model ID entry, and connection testing. Credentials and other secrets must be excluded from adventure exports. Moved to staging for refinement, not to production.
