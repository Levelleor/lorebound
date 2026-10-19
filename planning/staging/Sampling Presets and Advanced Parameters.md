---
id: "IDEA-0016"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Gameplay Feature Catalogue Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Sampling Presets and Advanced Parameters

## Idea
Configure temperature, Top-P, Top-K, Min-P, repetition penalties, reasoning, tokens, stops, seeds and other supported settings.

## Why this idea matters
Model behaviour is highly dependent on generation settings.

## Accepted direction
- **Basic generation controls:** Offer approachable settings for common generation parameters, such as temperature, Top-P and output-token limits, only where applicable to the selected model.
- **Advanced controls:** Expose relevant additional parameters, including Top-K, Min-P, repetition/frequency/presence penalties, reasoning configuration, stop sequences, seeds and other provider/model-specific options **when supported**.
- **Reusable model-specific presets:** Save, name, select and edit generation-settings presets associated with applicable model/provider profiles.
- **Preserve preferences across switches:** When switching models or provider families, retain stored preferred values even if some are inapplicable to the newly selected model; do not silently overwrite or discard preferences.
- **Effective-request inspection:** Let the user inspect the actual set of generation parameters that Lorebound sent or will send, including translated, omitted or overridden values, with secret headers and credentials redacted.
- **Optional custom JSON:** Advanced users may configure provider-specific custom JSON parameters, with validation and explicit risk warnings where appropriate.
- **Capability-aware behaviour:** Apply the four parameter states and default omission/advanced-override policies accepted under [[Model-Capability-Aware Controls]] (IDEA-0015). A saved parameter must not be assumed to be supported or transmitted to every model.

This accepts the direction and the categories of controls. It does not establish a universal parameter list, ranges, defaults, or mapping for every model.

## Proposed behaviour
Provide a simple generation-settings panel with a separately accessible advanced area. Users can save and reuse named, model-associated presets. When a model is selected, adapt visible controls and outgoing request parameters to its known capabilities without losing incompatible saved preferences. Include a redacted effective-request view showing what was passed to the active provider, and allow optional custom JSON in advanced mode subject to validation and explicit compatibility overrides. Do not send unsanctioned, known-unsupported parameters during normal use.

## Alternatives and trade-offs
A basic-first interface with an optional advanced panel is accepted as the intended UX direction, though exact timing and presentation remain to be refined. Presets may be attached to model IDs, profiles or provider/model combinations; how inheritance/fallback works is not yet decided. Raw JSON offers flexibility for emerging model features but requires safety checks and must not bypass ordinary compatibility handling by accident.

## Technical sampling presets remain distinct from narration style
- **Scope clarification after IDEA-0010 change (2026-10-18):** The user's removal of **reusable narration-style presets** does **not** remove this idea's separately accepted **model/provider generation-parameter presets**. IDEA-0016 presets control request-side sampling values and capability-supported parameters such as temperature, Top-P, output limits and provider-specific options; they do **not** represent a saved narrative persona, author-note preset or reusable bundle of story-writing style instructions.
- Narration comes from current adventure style settings, applicable persistent author notes and any starting directions supplied by a scenario template, assembled for every AI narrative generation through IDEA-0024/0025. Model-specific technical parameter presets, where selected, influence compatible **provider request parameters** separately. Neither changes already committed story prose or canonical world state merely by selection.

## Dependencies and constraints
- The active model's parameter support is governed by [[Model-Capability-Aware Controls]] (IDEA-0015), including supported/unsupported/ignored/unknown classifications and opt-in advanced overrides.
- Provider connection profiles and local/cloud adapters determine available models and endpoint-specific parameter mappings (IDEA-0012 through IDEA-0014).
- A provider may use different names, scales or semantics for similarly named sampling controls; map only when equivalence is understood and expose actual transmitted values.
- Effective-request inspection and diagnostics must redact API keys, authentication headers, sensitive connection fields and other secrets.
- Malformed or incompatible custom JSON must produce clear feedback instead of corrupting the story or committing incomplete generations.
- Model-specific presets should remain editable/reusable if a model is temporarily unavailable or disconnected.

## Open questions
- How should presets be scoped and inherited across model IDs, provider profiles and compatible model families?
- What are safe default values and model-specific limits for each parameter?
- Which parameters can be translated between provider APIs without changing their meaning?
- How should conflicts between ordinary controls, preset values and custom JSON overrides be resolved?
- What effective-request information can be shown safely when a provider internally transforms the request?
- Can users import/export nonsecret presets independently of adventures, and what compatibility warnings are needed?

## Draft acceptance criteria
- [ ] A model sampling preset changes compatible provider-generation parameters but does not introduce a reusable narration-style or author-note preset or silently change existing adventure prose.
- [ ] A player can adjust basic supported generation parameters through a straightforward UI.
- [ ] Advanced mode can expose additional sampling, output, repetition, seed, reasoning and stop settings where supported.
- [ ] A player can save and reuse a named model-specific parameter preset.
- [ ] Switching to a model with fewer supported fields preserves stored preferences but omits unsupported parameters in ordinary requests.
- [ ] A user can inspect the effective parameters for a generation and identify omitted or overridden settings without revealing credentials or sensitive headers.
- [ ] Optional custom JSON parameters can be configured and safely validated/handled according to the active provider and IDEA-0015 override policy.
- [ ] Provider-specific mappings and incompatible/ignored/unknown values are explained rather than silently misrepresented.
- [ ] A failed request due to invalid advanced parameters does not automatically commit incomplete prose or authoritative world-state changes.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- Explicitly accepted for **staging/refinement**; parameter specifics, implementation and production approval remain outstanding.

## Decisions and review history
- 2026-10-18 — **IDEA-0010 boundary clarification:** Reusable narration-style presets were explicitly removed from accepted scope, but **technical provider/model sampling-parameter presets in IDEA-0016 remain independently accepted**. Narrative guidance comes from template starting inputs/current settings/author notes in per-turn context. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Basic and advanced sampling controls, model-specific reusable presets, preserved preferences when switching models, effective-request inspection and optional custom JSON parameters, all subject to IDEA-0015 capability rules. Moved to staging for refinement, not production.
