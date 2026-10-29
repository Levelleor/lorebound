---
id: "IDEA-0017"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-29"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Lorebound Vision Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# One-Model Task Routing

## Narrator/identity privacy regardless of model routing — 2026-10-29

[B6-D04 — narrator-safe entity identities](../architecture/decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) refines **prompt boundaries, not model-selection policy**. Narrator and interpreter can use the **same single loaded model**, or different selected models, but receive separately assembled **role-appropriate contexts**. Any call that may produce a roleplay passage sees human-language world descriptions **without internal ID mappings**. A non-narrating interpreter may receive candidate IDs strictly for resolving references into structured engine-owned records; do not preserve that internal mapping in a later narrator prompt/conversation. A combined single-pass prose+events strategy remains permitted with natural-language reference proposals bound to IDs by the engine after generation. No mandatory second model, second pass or automatic model fallback is added.



## Idea
Route narration, state interpretation and summaries to freely selected models. **Using one model and using several models are equally normal, first-class configurations.** A single locally loaded model must remain sufficient, but multi-model assignments must be straightforward, not hidden in an expert-only mode.

## Why this idea matters
Players have different resources and preferences: some can run only one locally loaded model, while others want to assign different cloud or local models to writing, interpretation and memory tasks. Neither workflow should be penalised by the application design.

## Accepted direction
- **First-class single- and multi-model use:** Treat running all tasks with a single model and selecting multiple models for different tasks as equally supported normal workflows. Do not portray multi-model use as an unusual, advanced-only or secondary capability.
- **Task-specific routing:** Let players choose the model for each supported task, initially narration/writing, state interpretation and summarisation. Preserve task-appropriate instructions. **Sampling parameter preferences are one shared current settings entry**, not separate saved values for individual models/providers/tasks; resolve compatible effective parameters for whichever task model is active (IDEA-0015/0016).
- **One provider, multiple models:** Multiple task roles can select distinct models through the **same** provider account or connection profile, such as three models from one OpenRouter connection, without requiring separate API credentials or provider accounts.
- **Multiple providers or endpoints:** Task roles can also select models from different provider connections, mixing cloud APIs and locally served models where configured.
- **One-model sufficiency:** A player with only one loaded local model can route all tasks to that same model, in sequence if needed, without mandatory auxiliary models, extra accounts or loaded instances.
- **Simple configuration without automatic fallback (user decision 2026-10-23):** Unassigned tasks may use a configured primary model. Explicit task assignments remain ordinarily accessible. When the selected model/provider request fails, **fail that interaction and report the error**. Do not automatically substitute another model, silently reroute to another connection, or pretend the failed stage succeeded. A new attempt is an explicit player action. This does not prohibit the separately accepted bounded narrative validation/repair workflow when a model request has succeeded.
- **Routing specificity:** Select a **connection/profile and model ID** for each role, not just a provider/endpoint, so two task roles can use different models exposed by one provider.
- **No premature pipeline commitment:** The number, order and necessity of AI passes, and how to coordinate/validate them, are covered separately by [[Configurable Generation Pipeline Strategies]] (IDEA-0018). Supporting multiple models does not imply every task must always run.

## Proposed behaviour
Expose task routing for narration/writing, structured interpretation and summaries. A role can use an explicitly selected connection/profile + model ID; otherwise it can inherit the configured primary model. These roles can all resolve to one running local model or to several different models, including several available under one cloud provider connection. Apply task-specific prompts and suitable generation parameters to the resolved model. Use the ordinary cloud/local connector and capability handling pathways for each request. A task's requested model being unavailable or a provider/model request failing must **fail the interaction with an understandable error**, preserving previously committed state and recoverable input. **No automatic alternative-model fallback** is allowed. A player may intentionally change the model or retry as a new action.

## Alternatives and trade-offs
A single-model setup saves hardware memory and setup effort but may incur latency for sequential passes. Multi-model routing permits task specialisation, independent model/provider selections, and potentially different cloud costs, but adds connection, capability, latency and error-handling considerations. **Neither is considered the inferior or advanced-only workflow.** A dedicated planning/state model is available as a user choice, never a prerequisite. The original "one-model" title remains for idea continuity but must not be read as preferring one model over several.

## Dependencies and constraints
- Uses accepted cloud/local connector support ([[Cloud LLM Provider Connectors]], [[Local LLM Server Connections]]), saved connections ([[Provider Connection Profiles and Discovery]]), and capability/preset rules ([[Model-Capability-Aware Controls]], [[Sampling Presets and Advanced Parameters]]).
- A connection profile can serve multiple model IDs. Routing must not require duplicating the same provider connection, key or endpoint to select separate models for different roles.
- Each role must resolve to a valid accessible model and respect the model's supported features and context limits.
- No baseline mode may demand two or more simultaneously loaded local models. If the same local model is shared, tasks can be scheduled sequentially.
- Changes to task assignments must not rewrite existing story prose or mutate authoritative state by themselves.
- The exact pipeline passes, model calls, costs and validation/retries remain separate concerns; do not claim implementation.
- **Illustrative user scenarios:** One OpenRouter connection with one model for all tasks, or different OpenRouter models for narration/interpretation/summaries; likewise an OpenAI connection using user-described “Sol” for writing and “Luna” for other tasks, subject to actual provider/model availability. These are examples of role selection, not verified model catalog entries.

## Open questions
- Which task roles should be individually configurable beyond narration, interpretation and summaries?
- Should routing be set globally, per adventure, or both, and what is the precedence?
- **Resolved 2026-10-23:** A failed model/provider request fails the interaction; no fallback to another model. Precise error wording, cleanup and any user-initiated retry UX are implementation details.
- **Resolved active settings scope 2026-10-23:** Keep one shared current sampling-settings entry, reevaluated against the model/provider used by each task. Different models can have different effective capabilities without storing automatic per-model or per-provider parameter values. Manually selected named presets remain a separate user action, not auto-switching.
- How should cost, total latency and per-task model usage be shown across multiple cloud requests?
- Which tasks can share a prompt or be omitted entirely under each pipeline strategy?

## Draft acceptance criteria
- [ ] A user can perform all core model-dependent tasks with **one** available local or cloud model, without requiring another model.
- [ ] A user can assign **different** compatible models to narration, interpretation and summarisation through a normal configuration interface.
- [ ] Several task roles can use distinct model IDs through **one saved provider connection** without duplicating its API key.
- [ ] Task roles can use models from separate provider connections, including both local and cloud endpoints.
- [ ] An unset task assignment may inherit a primary model, while explicit role assignments remain visible and respected.
- [ ] A chosen local single-model configuration does not cause additional models to load automatically.
- [ ] Unavailable or incompatible assigned models and failed provider responses end the interaction with a clear error; no automatic fallback to other providers/models or canonical partial commit.
- [ ] Model assignment changes by themselves do not alter existing prose, character/world state or earlier committed events.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- Explicit user correction: multi-model routing is a **normal equal first-class** workflow, not merely an exceptional expert override.
- Accepted for staging/refinement only, with no production approval or implementation claimed.

## Decisions and review history

- 2026-10-23 — **User resolved A-12 and A-13:** A failed selected-model/provider request fails the interaction, with no alternate model fallback. Ordinary task assignments remain selectable but do not retry on a different model automatically. Sampling parameter preferences use one shared saved current-settings entry, not separate per-provider/model/task values; effective request compatibility is reevaluated on model switch. Bounded validation/narrative repair after a successful response is a separate accepted concern. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Accepted with user clarification:** "the idea of using other models is just as normal here as just using 1 model". The user specifically described one or several models through one OpenRouter connection, or different models through an OpenAI provider connection for writing versus other tasks. The accepted direction makes single-model sufficiency and flexible multi-model task routing **equally first-class**. Moved to staging for refinement, not approved for production.

- **2026-10-29 — Later user-requested documentation refinement:** [B6-D04](../architecture/decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) protects prose-producing narrator contexts from internal IDs while keeping internal reference resolution, same-model role reuse and single-pass generation. Earlier approvals preserved; no implementation asserted.
