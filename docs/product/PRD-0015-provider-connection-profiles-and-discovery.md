---
id: PRD-0015
type: prd
status: accepted
related:
- NOTE-0029
- PRD-0001
- NOTE-0010
---

# Provider Connection Profiles and Discovery

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0014](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Provider%20Connection%20Profiles%20and%20Discovery.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S08**. First milestone: **M3**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-004A R01–R03](../work/items/STORY-0024-direct-browser-local-story-narration.md) merged; [DEV-004C R04–R06](../work/items/STORY-0026-explicit-local-connection-testing.md) verified on confirmed PR #23 merge; [DEV-004H](../work/items/STORY-0031-fresh-saved-model-selection-for-generate-retry.md) fresh request selection verified within scope on confirmed PR #28 merge; broader scope remains later
- Evidence: [PR #21](https://github.com/Levelleor/lorebound/pull/21), confirmed merged; [PR #23](https://github.com/Levelleor/lorebound/pull/23) confirmed merged; provenance/final CI in PR

## Goals

Save reusable provider profiles with named base URL, selected model and timeout; discovery/testing are optional, not proof or gates. Keep Go persistence to fixed nonsecret metadata; credential support requires reviewed OS storage/fallback and memory-only browser use. Resolve current saved profile at each attempt, capture it immutably and do not silently fall back. Named local adapters are delivered without implying cloud support, live compatibility or completed credential/retry preferences.

## Accepted direction
- **Multiple saved profiles:** A user can save, name, edit, select and reuse more than one cloud or local AI provider connection without repeating setup for each adventure.
- **Configurable endpoints:** Each profile can specify a provider/server type and a base URL or custom endpoint, including local/LAN servers and compatible gateways.
- **Credentials and headers with accepted persistence policy (updated 2026-10-19):** Support **multiple independent secrets** per provider connection profile, including API keys and secret custom headers. Use the native OS credential vault by default through a cross-platform Go keyring adapter. When unavailable, allow only an **explicitly consented, passwordless AES-256-GCM encrypted credential sidecar** beside the active SQLite library, with a **separately stored random master key** in the user's private OS configuration directory. The earlier plaintext sidecar fallback is superseded and not in the accepted design. Secrets are never canonical adventure content.
- **Two-way Go/browser credential synchronisation with temporary memory cache (A-27 simplification 2026-10-23):** Go's approved OS vault/encrypted-sidecar credential store remains the persistent authority for multiple secret values per profile. On startup/profile selection, the browser retrieves saved active-profile credentials through **narrow Go loopback methods with no additional Lorebound login/session-authentication system in this iteration** and hold usable values in **in-memory TypeScript state** for direct browser-to-provider AI requests. Adding, changing or deleting a credential must synchronise it back to Go; only treat the edit as persisted after Go confirms the operation, and invalidate/refresh any stale in-memory copy as needed (including other tabs). **Never place raw API tokens or secret headers in browser `localStorage`, `sessionStorage`, IndexedDB, application logs, diagnostics or adventure SQLite records**; nonsecret profile identifiers/settings can be cached there. Closing/reloading a page clears the ephemeral memory copy; the next session retrieves its saved secret from Go again. This is bidirectional **storage synchronisation**, not a Go AI HTTP proxy. Authorised retrieval and cross-tab notifications/security details remain for implementation refinement.
- **Timeouts and retries:** Offer configurable request timeout and retry preferences. Exact defaults, safe retry boundaries and error-classification policy are for later refinement.
- **Optional model discovery:** Query a provider/server's model listing when supported, and present the available model IDs or choices.
- **Manual model ID:** Allow entry and selection of a model identifier even if model discovery is unsupported or fails.
- **Connection testing:** Provide an explicit test that helps diagnose unavailable endpoints, authentication failures, invalid model identifiers or other connection errors.
- **No credential backup/export:** Whole-library SQLite snapshot backups **exclude all credential values** by keeping them outside the database. Neither the OS vault, encrypted sidecar nor separate master-key file is bundled by Backup Database. Manual copying/syncing of the data directory can include encrypted credentials; copying or compromising both the ciphertext and master key reveals them and must be warned about.
- **No discovery prerequisite:** Manual profiles remain usable without a successful model-list response.

## Dependencies and constraints
- Builds on accepted Cloud LLM Provider Connectors (IDEA-0012) and Local LLM Server Connections (IDEA-0013), including explicit llama.cpp support.
- Provider auth, model enumeration, error types and supported response formats differ; connection tests should identify their limits rather than claim universal validation.
- A saved profile must not leak API keys, bearer tokens or secret headers through adventure exports, prompts, diagnostic logs or UI previews.
- Retry semantics must avoid duplicating accepted narrative turns, side-effecting tools, or authoritative world-state changes; requests with unknown success must be handled carefully.
- Browser CORS/private-network/mixed-content policies apply to **both local and cloud AI endpoints**. All model discovery, Test Connection requests, generation and streaming run **from the actual browser origin**, not an alternate server-side privileged network path; testing should reflect real request reachability and fail with actionable guidance. Users may configure a compatible endpoint/gateway themselves, not receive an automatically provisioned proxy.
- Profiles can name an unavailable model or endpoint without silently mutating saved story content.

## Open questions
- How should custom gateways and dynamically listed models be identified, cached and refreshed?
- **Credential architecture and A-27 simplified iteration (updated 2026-10-23):** OS vault first or consented encrypted sidecar with independent master key. Browser uses **memory-only** cached active-profile secrets from narrow Go loopback methods and writes edits/deletes back to Go; no raw tokens in localStorage/sessionStorage/IndexedDB. **No Lorebound session/login authentication feature in this iteration.** Keyring/platform unlock, local file permissions, cross-tab refresh, secret redaction and honest failure reporting remain; stronger credential-endpoint authentication/security design is deferred and not an initial milestone.
- What distinguishes a lightweight connectivity probe from an actual test-generation call, and what costs could a cloud test incur?
- Which errors should be eligible for automatic retry, and how can attempts remain idempotent and safe?
- What timeout and retry defaults should be applied to generation, discovery and connectivity tests?
- How should a profile handle multiple endpoint URLs or provider-specific authentication schemes?

## Supporting detail

See [NOTE-0029](../knowledge/inbox/NOTE-0029-prd-0015-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
