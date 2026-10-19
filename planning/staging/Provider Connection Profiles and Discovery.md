---
id: "IDEA-0014"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-18"
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

## Architecture integration (2026-10-17)
- Provider profiles are consumed by client-side TypeScript AI adapters in the Wails v3 headless localhost server runtime, played through the normal browser. Provider credentials and custom headers require explicit secure storage/handling design distinct from SQLite adventure-save data.
- **No Go provider transport fallback (IDEA-0012 Option B, accepted 2026-10-18):** A Go service might ultimately be involved in **local at-rest credential handling if separately approved**, but **it may not perform AI provider network calls or proxy/relay AI HTTP requests**. Browser-side TypeScript must construct and send all AI requests directly. The exact key storage design is still open; browser JavaScript needs access to any key sent to a cloud API, so do not imply absolute browser-side secrecy. Browser storage is not the canonical adventure database. Multi-tab and localhost service security remain important.

## On-demand AI setup and gracefully failed requests
- **Accepted IDEA-0001 refinement:** A usable Lorebound app and adventure library never depend on a saved provider connection. When a user attempts an AI-only operation without a suitable configured profile/model, display a clear reason and route them into these connection/model settings. Manual story editing, Lorebook maintenance, saving and other non-model features continue normally.
- A saved/selected connection profile is **not proof of availability**, but is sufficient to **attempt the requested AI API call**. Do not require a successful Test Connection check or assume a periodically checked health status before every request. Handle actual reachability, authentication, model selection, quota and transport failures as **per-request recoverable errors**; leave the saved profile editable and preserve uncommitted input/last accepted story.
- Explicit Test Connection and optional model discovery remain useful diagnostics, not an application startup gate. No implicit provider choice or model auto-installation is approved.

## Browser-only connections for four cloud providers and retained local servers
- **Accepted IDEA-0012 scope (2026-10-18):** Offer provider profiles for **OpenAI, Anthropic, Google Gemini, OpenRouter**, and the named **Ollama, LM Studio, vLLM and llama.cpp** local servers plus compatible custom endpoint/server profiles. **Mistral, DeepSeek, Z.ai/GLM and Kimi no longer have promised native cloud-profile/adapter types**. When OpenRouter offers one of those vendors' models, it remains an **OpenRouter model ID**.
- **All AI networking is browser-origin:** The TypeScript client must send model discovery, connection tests, completions/generation and streaming **directly to the selected endpoint**, subject to the browser's CORS, private-network, mixed-content and credential/header policies. **No Go/Node transport proxy** is in accepted scope. Failed browser access is a normal recoverable provider failure and may require a deliberately configured browser-compatible gateway or permitted CORS setup.
- **Credentials require accurate boundaries:** A browser-sent API token is necessarily available to browser execution while the request is made. Keep secrets outside the canonical SQLite adventure/library backup, world context, story prompts and diagnostics, but do not claim a Go transport or credential-forwarding backchannel hides them. At-rest storage/access boundaries and treatment of untrusted custom endpoints/gateways remain unresolved security-design work.
- **Model selection:** OpenRouter is deliberately a multi-provider gateway for its **actual catalog**, not a universal guarantee of every model. Manual model-ID entry and optional discovery still work for browser-accessible endpoints; a test cannot assume a successful model list proves a generation endpoint or headers will work.

## Dependencies and constraints
- Builds on accepted [[Cloud LLM Provider Connectors]] (IDEA-0012) and [[Local LLM Server Connections]] (IDEA-0013), including explicit llama.cpp support.
- Provider auth, model enumeration, error types and supported response formats differ; connection tests should identify their limits rather than claim universal validation.
- A saved profile must not leak API keys, bearer tokens or secret headers through adventure exports, prompts, diagnostic logs or UI previews.
- Retry semantics must avoid duplicating accepted narrative turns, side-effecting tools, or authoritative world-state changes; requests with unknown success must be handled carefully.
- Browser CORS/private-network/mixed-content policies apply to **both local and cloud AI endpoints**. All model discovery, Test Connection requests, generation and streaming run **from the actual browser origin**, not an alternate server-side privileged network path; testing should reflect real request reachability and fail with actionable guidance. Users may configure a compatible endpoint/gateway themselves, not receive an automatically provisioned proxy.
- Profiles can name an unavailable model or endpoint without silently mutating saved story content.

## Open questions
- How should custom gateways and dynamically listed models be identified, cached and refreshed?
- What is the secure local credential-storage design in an account-free, browser-first application?
- What distinguishes a lightweight connectivity probe from an actual test-generation call, and what costs could a cloud test incur?
- Which errors should be eligible for automatic retry, and how can attempts remain idempotent and safe?
- What timeout and retry defaults should be applied to generation, discovery and connectivity tests?
- How should a profile handle multiple endpoint URLs or provider-specific authentication schemes?

## Draft acceptance criteria
- [ ] Connection tests, discovery and generation originate directly in browser TypeScript and surface CORS/private-network/API security failures without silently invoking a Go/Node proxy.
- [ ] The provider choices include the four reduced cloud families plus all four named local servers and configurable compatible endpoints, without promising other direct cloud integrations.
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
- 2026-10-18 — **Accepted IDEA-0012/0013 provider/networking revision:** Four native cloud profiles (OpenAI, Anthropic, Gemini and OpenRouter gateway), all four local servers and custom compatible endpoints remain. Every AI HTTP request, including tests/discovery, is browser-origin with **no Go/Node proxy fallback**. Browser-access issues require user-configured CORS/compatible gateway. Secret-at-rest design remains open but server-side AI credential forwarding/networking is not approved. Staging only.
- 2026-10-18 — **Accepted IDEA-0001 integration:** No AI profile is required to use Lorebound. When AI is requested but unconfigured, provide clear setup guidance; when a model is configured, attempt the API and report actual failures without globally disabling local/manual features or overwriting canon. No mandatory prior connection test. Staging only.
- 2026-10-17 — **Runtime dependency correction:** IDEA-0053 now selects Wails v3 headless localhost Go server **only**, served to the normal browser by a Windows/macOS/Linux executable. No separate native desktop WebView or npm player runtime. Docker is a distinct unaccepted candidate (IDEA-0065). No further feature approval is implied.
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Multiple saved connection profiles, configurable endpoints, credentials and headers, timeout and retry settings, optional model discovery, manual model ID entry, and connection testing. Credentials and other secrets must be excluded from adventure exports. Moved to staging for refinement, not to production.
