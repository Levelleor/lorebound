---
id: PRD-0013
type: prd
status: accepted
related:
- NOTE-0027
- PRD-0001
- NOTE-0010
- NOTE-0012
---

# Cloud LLM Provider Connectors

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0012](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Cloud%20LLM%20Provider%20Connectors.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S08**. First milestone: **M3**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Accepted direction
- **Four accepted cloud connector families (user revision, 2026-10-18):** OpenAI, Anthropic, **Google Gemini**, and **OpenRouter**. **Mistral, DeepSeek, Z.ai (GLM) and Kimi are no longer accepted as separate first-party connectors in this design**. Support through OpenRouter may be possible only when that gateway actually offers the chosen model.
- **OpenRouter's broad model scope:** Treat OpenRouter as a general multi-provider **model gateway**, allowing user-selected model IDs from its actual available catalog, not a hardcoded list of four model families. **Do not promise every model exists on OpenRouter**, or invent a separate direct first-party adapter merely because a model is named in its gateway catalog.
- Users provide their own provider-specific API credentials or other supported authentication; **Lorebound itself** remains an account-free application.
- Use a **shared model-generation adapter interface**, reusing compatible API protocols when appropriate, with provider-specific adapters for genuine protocol/capability differences.
- Support model selection, text generation, supported response streaming and actionable handling of authentication, quota, networking, invalid model IDs and other provider errors.
- Keep secrets out of adventure export/save packages, consistent with Adventure Save and Export Management (IDEA-0005).
- Model lists and optional API features are **capability-aware** and are not assumed identical for every provider.
- **Scope reduced at the user's request:** The four named cloud connectors are the **current accepted target**, not merely a first-release subset of eight still-promised native adapters. Other direct cloud connectors require a later separately accepted decision.

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

## Supporting detail

See [NOTE-0027](../knowledge/inbox/NOTE-0027-prd-0013-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
