---
id: NOTE-0010
type: note
status: inbox
source: PRD-0001
related:
- PRD-0050
- PRD-0060
- PRD-0055
- PRD-0023
- PRD-0013
- PRD-0019
- PRD-0045
- PRD-0046
- PRD-0014
- PRD-0016
- PRD-0011
- PRD-0018
- PRD-0015
- PRD-0017
- PRD-0020
- PRD-0025
- PRD-0069
---

# Exploration: LLM Providers and Generation

## Discovery

Exploratory history, not project authority. Original session status: **active**. Accepted requirements and decisions take precedence; candidate suggestions remain non-authorizing.

[Pinned source working notes and dated session log](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/brainstorming/LLM%20Providers%20and%20Generation%20Brainstorm.md)

## Goal
Support many AI providers with model-aware settings while remaining practical with one locally hosted model.

## Context
- Retrospective consolidation of the project-design conversation through 2026-10-16. This records wishes, proposals, trade-offs, and open questions; it is **not** an implementation specification or approval to ship.
- Repository guidance: Start Here (in the planning vault) and the repository AGENTS.md. No application functionality is asserted as implemented.
- Terminology: **User direction** = explicitly expressed preference; **AI possibility** = suggested but not selected; **Open** = requires a design decision.

## User-requested provider coverage
- Cloud/API: **Gemini, OpenAI, Anthropic, OpenRouter, Mistral, DeepSeek, GLM and Kimi**.
- Local or network-hosted: **Ollama, LM Studio, vLLM, custom OpenAI-compatible servers**, plus possible native local adapters.
- Separate **provider connection** (base URL, credentials, headers, timeout, availability) from **model profile** (model ID, generation settings, capabilities) and **task profile** (what job uses which model).
- Support multiple connections per provider, manual IDs when model-list discovery fails, connection testing, streaming/cancellation, errors/retries, and offline-only operation using configured local endpoints.
- No application account/login. Remote provider API keys can still be required.

## Unified provider adapter (proposed)
- Native adapters where provider features differ; OpenAI-compatible adapter for suitable endpoints.
- API versions, model metadata and effective capabilities can vary, especially when routed through OpenRouter or local proxy.
- Support prompt-system formats, streaming responses, structured/JSON mode where available, tools/function calling where available, token accounting and prompt caching where supported.
- Retain raw provider response/error information in diagnostics without including secrets.

## Model controls
Temperature, Top-P, Top-K, Min-P (where available), repetition/frequency/presence penalties, output token limit, effective context size, reasoning effort/budget, stop sequences, random seed, streaming, caching and optional custom request parameters. Support presets and model-specific defaults.
- **Supported:** normal controls, send.
- **Unsupported/ignored:** grey out with explanation, omit.
- **Unknown:** optional advanced override, allow explicit send and surface errors.
- Retain a disabled setting when switching models so it can be restored later; show the **actual request parameters sent**.
- Sending unsupported parameters blindly can fail requests or produce unclear behaviour. Do not rely on silent provider ignoring.
- Provider/model capability lookup and override policy remains a design task.

## One model must be enough (user concern)
- **Narrator** and **Interpreter** are logical jobs. Both can be successive calls against the **same single loaded local model**; no requirement for distinct models in VRAM.
- A deterministic TypeScript Coordinator and Rules Engine are *not* AI models.
- Optional task routes: narration, summarisation, character/state extraction, lore extraction, repair. A single inherited profile is the easy default, separate assignments are an advanced option.
- Additional inference passes cost latency and tokens even if they use the same model.
- RP-specific models may be poor at function calling or producing complete structured JSON.

## Generation strategies discussed (unresolved choice)
1. **Single pass:** narrator outputs prose plus proposed structured changes; validate, retry/repair on failure. Fast, but model may omit implied changes.
2. **Plan → Validate → Narrate:** interpret player's freeform action as proposed events first, validate, then narrate the result. ~2 calls normally. Narrator can still invent unplanned changes.
3. **Plan → Validate → Narrate → Audit:** inspect final prose for state changes, validate/repair. More consistent but more latency; still fallible.
4. **Narrate → Extract → Validate → Repair:** preserves spontaneous RP but invalid events need targeted rewrite.
5. **Light/freeform vs balanced vs strict simulation:** choose a per-story policy; strict mode validates all tracked events, while casual mode may allow narrative details without structured representation.
No option guarantees that every implicit state change is extracted.

## Prompt and output tooling
- Do, Say, Story, Continue, inline generation, Retry, edit and rewrite; control generation length, POV, style, tone, instruction bias and stop behaviour.
- Keep model instructions, permanent story rules, player intent, local scene, relevant lore, character sheets and recent history in separate prompt segments.
- Provide a context inspector, token budget viewer, diagnostics, cost/usage statistics where providers report them, and presets.
- Structured responses may use provider JSON schema or constrained generation; fallback parser and error handling are required.

## Optimisation ideas
- Structured UI actions (click destination/equip) already contain IDs; validate them without semantic extraction.
- Natural-language action interpretation still normally needs a model, since player phrasing is unlimited.
- Keep planning/extraction prompts concise; limit output to proposed events.
- Use deterministic logic for alias/entity resolution where unambiguous; ask an LLM only when needed.
- Avoid unnecessary state extraction when tracking modules are disabled; investigate skip heuristics separately.


## Current Threads
- Test model compliance on RP-specific local models and measure omissions, correction rates and latency.
- Decide default strategy and strictness mode.
- Maintain accurate provider/model capability metadata as APIs evolve.
- Determine fallback when a local model cannot reliably emit structured output.
- Refine IDEA-0068: what can each provider's basic connection/access check establish without inference, and what belongs in a separate optional generation test?

## Decisions
- Local and remote model coverage and settings are explicit user requirements.
- Unsupported controls should be handled clearly, with preference toward greyed-out/omitted behaviour still subject to exact UI design.
- One locally loaded model should be a viable configuration.
- 2026-11-14 — The user explicitly accepted IDEA-0068 into staging: separate provider-appropriate connection/access testing from optional generation testing. Exact provider checks and behavior still need refinement; production readiness, implementation and merge approval remain separate.

## Classification

Historical exploration; related product records contain approval and implementation boundaries.
