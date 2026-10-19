---
id: "IDEA-0012"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Cloud LLM Provider Connectors

## Idea
Support **four directly browser-accessible cloud connector families**: OpenAI, Anthropic, Google Gemini and **OpenRouter as a multi-provider model gateway**. The formerly accepted Mistral, DeepSeek, Z.ai/GLM and Kimi first-party connectors have been **removed from the current accepted scope** (2026-10-18).

## Why this idea matters
Avoid reliance on one commercial provider.

## Accepted direction
- **Four accepted cloud connector families (user revision, 2026-10-18):** OpenAI, Anthropic, **Google Gemini**, and **OpenRouter**. **Mistral, DeepSeek, Z.ai (GLM) and Kimi are no longer accepted as separate first-party connectors in this design**. Support through OpenRouter may be possible only when that gateway actually offers the chosen model.
- **OpenRouter's broad model scope:** Treat OpenRouter as a general multi-provider **model gateway**, allowing user-selected model IDs from its actual available catalog, not a hardcoded list of four model families. **Do not promise every model exists on OpenRouter**, or invent a separate direct first-party adapter merely because a model is named in its gateway catalog.
- Users provide their own provider-specific API credentials or other supported authentication; **Lorebound itself** remains an account-free application.
- Use a **shared model-generation adapter interface**, reusing compatible API protocols when appropriate, with provider-specific adapters for genuine protocol/capability differences.
- Support model selection, text generation, supported response streaming and actionable handling of authentication, quota, networking, invalid model IDs and other provider errors.
- Keep secrets out of adventure export/save packages, consistent with [[Adventure Save and Export Management]] (IDEA-0005).
- Model lists and optional API features are **capability-aware** and are not assumed identical for every provider.
- **Scope reduced at the user's request:** The four named cloud connectors are the **current accepted target**, not merely a first-release subset of eight still-promised native adapters. Other direct cloud connectors require a later separately accepted decision.

## Proposed behaviour
Expose configurable browser-side connection profiles for **OpenAI, Anthropic, Google Gemini and OpenRouter**. A shared generation interface accepts the selected model, instructions/messages and supported generation parameters; each provider adapter converts these into the relevant browser request, streaming response, usage data and errors. OpenRouter is model-agnostic within its **actual accessible catalog**, not an unconditional promise of every model. If a user accesses another model family through a configured OpenRouter endpoint, that does not add a native direct adapter for the underlying model provider. Keep credentials out of story saves/backups and prompts; browser exposure and credential lifecycle must be explicit security concerns.

## Alternatives and trade-offs
Use compatible browser-accessible endpoints when their actual protocol and model capabilities permit, and dedicated browser TypeScript adapters for meaningful API differences. If a listed provider does not allow calls from the Lorebound browser origin, **it is unavailable via that endpoint** until the player selects a browser-compatible endpoint/gateway; no automatic Go proxy or hidden backend workaround is part of the accepted design. The four-provider set is the current accepted scope; model catalogs/capabilities change independently.

## Architecture integration (2026-10-17)
- Keep provider-specific API clients and response handling in frontend TypeScript, used in the single Wails v3 headless localhost server/normal-browser runtime.
- **Option B, browser-only AI network transport (2026-10-18):** All provider AI requests, including generated text, streaming, model discovery and connection tests, must be sent **directly by the browser-side TypeScript adapter** to the configured model API. **No Go/Wails/Node proxy or server-side AI HTTP fallback** is accepted. Provider CORS, HTTPS/mixed-content, private-network restrictions, streaming support and credentials passed by the browser may make a connection unusable; report this accurately and support a user-configured **browser-compatible gateway or endpoint** instead.
- Wails/Go SQLite stores canonical adventures; cloud credentials must be kept out of game saves and imports/exports.

## Four accepted cloud providers and browser-only transport
- **Explicit user scope revision (2026-10-18):** Support **OpenAI**, **Anthropic**, **Google Gemini** and **OpenRouter** as the **only currently accepted direct cloud API connector families**. Direct first-party integrations for **Mistral**, **DeepSeek**, **Z.ai/GLM** and **Kimi** are deliberately removed from the accepted feature set for simplicity. They may be proposed later, but must not linger as promised follow-on adapters in this accepted design.
- **OpenRouter is a gateway, not a claim of universal model availability:** A single configured OpenRouter profile can route requests to any **user-selectable model actually offered/available to that connection**, potentially from multiple underlying providers. The gateway's catalog, account entitlements, protocols and browser access govern what works. This does not require or guarantee a native adapter for any underlying vendor.
- **Accepted networking Option B:** **All AI-related HTTP requests originate in the ordinary browser**, from the frontend TypeScript API adapters, including model listing, connection tests, generation and streaming. Do not add an in-process Go model transport, a Go loopback proxy, a Node backend proxy or a hidden cross-origin bypass.
- **Browser restrictions are a supported failure outcome:** CORS preflight/header limits, browser private-network permissions, mixed-content restrictions or provider API policies can prevent an otherwise valid account/model from being used. **Do not promise direct compatibility for all four providers**. Give an actionable error and allow a player-configured **browser-compatible gateway/endpoint**, subject to safe URL and credential-handling policies. No proxy is automatically provisioned by Lorebound.
- **Credential boundary:** API keys required by a direct browser request are accessible within the user's browser execution context and may have greater exposure than credentials kept exclusively server-side. Protect storage to the extent feasible, never place credentials into prompts, persistent story content, diagnostics or whole-library backups, and **do not claim browser-only direct requests can hide secrets from the browser**. Exact secure at-rest profile credential storage and trusted gateway recommendations still need refinement.
- **Local AI unchanged:** IDEA-0013 continues to accept Ollama, LM Studio, vLLM, llama.cpp/llama-server and user-configured compatible endpoints. The **same browser-only network restriction** applies to their HTTP APIs; the local server must allow the browser origin/private-network access where required.

## Dependencies and constraints
- Dependent on persistent connection profiles, secure secret handling, provider/model discovery and generation-pipeline integration, covered in separate candidate ideas.
- Cloud requests need third-party service credentials and network connectivity even though Lorebound has no own login.
- Streaming, context windows, tool calling, structured responses, sampling controls and price/usage reporting may vary significantly across provider/model combinations.
- Avoid logging or exporting raw credentials. Secrets must not enter narrative prompts or adventure backup data.
- Direct first-party connectors for **Mistral, DeepSeek, Z.ai/GLM and Kimi are excluded from current accepted scope**. Any of their models accessible through OpenRouter are handled as **OpenRouter model IDs**, not as proof that a direct vendor endpoint works from the browser.
- Failed/cancelled API requests should not silently create an accepted narrative turn or authoritative world-state mutation.

## Open questions
- Which provider-specific features and API differences demand native adapters instead of a shared compatible transport?
- How should provider connection secrets be stored and entered without an app account?
- Should model discovery be automated, manually configurable or both, per provider?
- Which default parameters, streaming formats and error diagnostics can be shared safely?
- **Superseded:** A native Z.ai/GLM connector is no longer in the accepted four-cloud-provider set; no regional Z.ai endpoint design is required now.
- **Resolved (2026-10-18):** The current accepted direct cloud connectors are OpenAI, Anthropic, Google Gemini and OpenRouter only. Which individual gateway models and endpoints are **actually browser-accessible** is runtime/model-specific.

## Draft acceptance criteria
- [ ] An otherwise valid endpoint blocked by browser CORS/origin/private-network restrictions fails visibly without Go/Node proxy fallback, unintended canonical state changes or false claims of provider support; a configured browser-compatible alternative may be selected.
- [ ] A player can configure a direct browser-side connection to each of the **four accepted cloud connector families**: OpenAI, Anthropic, Google Gemini and OpenRouter, **when that selected endpoint permits browser requests**, without any Go/Node AI proxy.
- [ ] The supported first-party connector list contains **only those four cloud families**. OpenRouter can target **model IDs it actually exposes**, including gateway-listed third-party models, without implying native direct connectors to their vendors or guaranteed access to every model.
- [ ] A connection can authenticate with user-provided credentials and choose a compatible model.
- [ ] Supported providers can generate narrator text via Lorebound's common model interface.
- [ ] Streaming works for supported providers/models, and unsupported features are disabled or explained.
- [ ] Provider failures are reported clearly without persisting incomplete generations as valid story turns.
- [ ] Browser-based requests never leak provider credentials into story context, diagnostics or whole-library SQLite backups; handle browser-exposed tokens and header limitations explicitly rather than claiming server-side secrecy.
- [ ] Acceptance of the provider list is not represented as proof that adapters have been implemented.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-requested direction, including an explicit correction that GLM is associated with Z.ai.
- **Accepted for staging/refinement**, not approved for production and not implemented.

## Decisions and review history
- 2026-10-18 — **User explicitly chose Option B and narrowed cloud scope:** All AI HTTP requests must go **directly from browser TypeScript**; **no Go/Node transport proxy/fallback**. Provider endpoints that reject browser CORS/private-network/mixed-content requirements may not work without a user-configured browser-compatible gateway. Keep **OpenAI, Anthropic, Google Gemini, and OpenRouter as a broad actual-catalog gateway** as the four accepted cloud integrations; remove separate Mistral, DeepSeek, Z.ai/GLM and Kimi first-party connectors from accepted scope. All four local inference server integrations stay accepted. This supersedes the October 16 eight-provider list and any proposed Go proxy. Staging only, no code/production promotion.
- 2026-10-17 — **Runtime dependency correction:** IDEA-0053 now selects Wails v3 headless localhost Go server **only**, served to the normal browser by a Windows/macOS/Linux executable. No separate native desktop WebView or npm player runtime. Docker is a distinct unaccepted candidate (IDEA-0065). No further feature approval is implied.
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user**, with a correction: "glm is z.ai I think". Verified with Z.ai's official site and recorded the connector as **Z.ai (GLM)**. Accepted Gemini, OpenAI, Anthropic, OpenRouter, Mistral, DeepSeek, Z.ai/GLM and Kimi, with shared adapters, user-provided credentials, generation, model selection, supported streaming, error handling and no credential export. Moved to staging for refinement only.
