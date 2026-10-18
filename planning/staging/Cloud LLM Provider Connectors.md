---
id: "IDEA-0012"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Cloud LLM Provider Connectors

## Idea
Support cloud APIs for Gemini, OpenAI, Anthropic, OpenRouter, Mistral, DeepSeek, **Z.ai (GLM models)**, and Kimi. GLM is the model family from Z.ai (formerly Zhipu AI), not a ninth independent provider separate from Z.ai.

## Why this idea matters
Avoid reliance on one commercial provider.

## Accepted direction
- Support **eight cloud provider families**: Google Gemini, OpenAI, Anthropic, OpenRouter, Mistral, DeepSeek, **Z.ai (GLM family)**, and Kimi.
- **Provider-name clarification requested by the user:** GLM models are offered through **Z.ai**. Label the connector `Z.ai (GLM)` or similar instead of implying "GLM" is an unrelated company/provider. Official reference: https://z.ai/model-api and https://docs.z.ai/.
- Users provide their own provider-specific API credentials or other supported authentication; **Lorebound itself** remains an account-free application.
- Use a **shared model-generation adapter interface**, reusing compatible API protocols when appropriate, with provider-specific adapters for genuine protocol/capability differences.
- Support model selection, text generation, supported response streaming and actionable handling of authentication, quota, networking, invalid model IDs and other provider errors.
- Keep secrets out of adventure export/save packages, consistent with [[Adventure Save and Export Management]] (IDEA-0005).
- Model lists and optional API features are **capability-aware** and are not assumed identical for every provider.
- Implementation priority/order can be refined without removing the accepted long-term provider list.

## Proposed behaviour
Expose configurable provider connections. A shared generation interface accepts the selected model, narrator instructions/messages and supported generation parameters; the provider adapter converts these into the appropriate request and interprets returned text, streams, usage information and errors. Keep authentication data in appropriately protected local connection settings, not story exports. For the GLM family, configure the Z.ai service and distinguish its actual endpoint/credential environment as needed instead of pretending it is a separate GLM vendor.

## Alternatives and trade-offs
Use compatible endpoints for providers where this meets requirements, and native adapters where request/streaming/tool/capability differences demand them. Implementation may ship providers incrementally; priority and fallbacks are refinement decisions, not grounds to remove accepted providers. Provider names and current model availability should be read from each provider's live documentation.

## Architecture integration (2026-10-17)
- Keep provider-specific API clients and response handling in frontend TypeScript, shared by Wails desktop and headless localhost browser runtime.
- Browser network transport must account for provider CORS, streaming, failures and credential exposure; a selective Go transport or credential service is an optional future refinement, not a mandatory Node/backend pipeline.
- Wails/Go SQLite stores canonical adventures; cloud credentials must be kept out of game saves and imports/exports.

## Dependencies and constraints
- Dependent on persistent connection profiles, secure secret handling, provider/model discovery and generation-pipeline integration, covered in separate candidate ideas.
- Cloud requests need third-party service credentials and network connectivity even though Lorebound has no own login.
- Streaming, context windows, tool calling, structured responses, sampling controls and price/usage reporting may vary significantly across provider/model combinations.
- Avoid logging or exporting raw credentials. Secrets must not enter narrative prompts or adventure backup data.
- Display Z.ai as the provider and GLM as its model family; regional/legacy Zhipu BigModel endpoints may differ and require separate configuration/refinement if supported.
- Failed/cancelled API requests should not silently create an accepted narrative turn or authoritative world-state mutation.

## Open questions
- Which provider-specific features and API differences demand native adapters instead of a shared compatible transport?
- How should provider connection secrets be stored and entered without an app account?
- Should model discovery be automated, manually configurable or both, per provider?
- Which default parameters, streaming formats and error diagnostics can be shared safely?
- Do Z.ai's regional or legacy endpoints require separate connection profile options?
- Which providers should be available in the initial playable release versus later phases?

## Draft acceptance criteria
- [ ] A player can configure a connection to each accepted provider family: Gemini, OpenAI, Anthropic, OpenRouter, Mistral, DeepSeek, Z.ai (GLM) and Kimi.
- [ ] The GLM family is presented under the Z.ai provider name rather than as a distinct ninth vendor.
- [ ] A connection can authenticate with user-provided credentials and choose a compatible model.
- [ ] Supported providers can generate narrator text via Lorebound's common model interface.
- [ ] Streaming works for supported providers/models, and unsupported features are disabled or explained.
- [ ] Provider failures are reported clearly without persisting incomplete generations as valid story turns.
- [ ] Credential values are not included in full-fidelity adventure exports or AI story context.
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
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user**, with a correction: "glm is z.ai I think". Verified with Z.ai's official site and recorded the connector as **Z.ai (GLM)**. Accepted Gemini, OpenAI, Anthropic, OpenRouter, Mistral, DeepSeek, Z.ai/GLM and Kimi, with shared adapters, user-provided credentials, generation, model selection, supported streaming, error handling and no credential export. Moved to staging for refinement only.
