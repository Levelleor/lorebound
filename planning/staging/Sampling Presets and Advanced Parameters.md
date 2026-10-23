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
- **One shared active generation-settings entry (user clarification 2026-10-23):** Persist one current set of preferred sampling/advanced parameter values **independent of provider, model and task**. A provider/model switch does not create, select, or restore a separate settings record. Named reusable **technical sampling presets** remain a separately accepted, explicitly player-selected convenience: applying one writes its values into the same current settings entry, rather than maintaining automatically model-associated active preferences. No auto-application of different presets on model switches.
- **Dynamically reevaluate on every switch:** On switching provider/model, the browser recomputes supported, unsupported, ignored and unknown controls from the new capability information (IDEA-0015), **toggles/disables unsupported fields** and derives the outgoing effective parameter set. **Do not overwrite the single saved current preferences** when an option becomes unsupported; retain it for a later compatible model. Known-unsupported parameters are omitted from ordinary requests.
- **Effective-request inspection:** Let the user inspect the actual set of generation parameters that Lorebound sent or will send, including translated, omitted or overridden values, with secret headers and credentials redacted.
- **Optional custom JSON:** Advanced users may configure provider-specific custom JSON parameters, with validation and explicit risk warnings where appropriate.
- **Capability-aware behaviour:** Apply the four parameter states and default omission/advanced-override policies accepted under [[Model-Capability-Aware Controls]] (IDEA-0015). A saved parameter must not be assumed to be supported or transmitted to every model.

This accepts the direction and the categories of controls. It does not establish a universal parameter list, ranges, defaults, or mapping for every model.

## Proposed behaviour
Provide a simple generation-settings panel with a separately accessible advanced area. Users use one shared active sampling-settings record across all models and providers. They may explicitly save/select named technical presets, but switching providers/models never automatically selects another preset. On each switch, frontend controls and effective request parameters are reevaluated against the selected model's capabilities; unsupported controls become unavailable without deleting their saved values. Include a redacted effective-request view showing what was passed to the active provider, and allow optional custom JSON in advanced mode subject to validation and explicit compatibility overrides. Do not send unsanctioned, known-unsupported parameters during normal use.

## Alternatives and trade-offs
A basic-first interface with an optional advanced panel is accepted as the intended UX direction, though exact timing and presentation remain to be refined. **Superseded on 2026-10-23:** No provider/model-attached current settings, preset inheritance, or model-switch preset fallback. The active settings entry is shared; named technical presets are explicitly applied by the player when wanted. Raw JSON offers flexibility for emerging model features but requires safety checks and must not bypass ordinary compatibility handling by accident.

## Technical sampling presets remain distinct from narration style
- **Scope clarification after IDEA-0010 change (2026-10-18):** The user's removal of **reusable narration-style presets** does **not** remove this idea's separately accepted **model/provider generation-parameter presets**. IDEA-0016 presets control request-side sampling values and capability-supported parameters such as temperature, Top-P, output limits and provider-specific options; they do **not** represent a saved narrative persona, author-note preset or reusable bundle of story-writing style instructions.
- Narration comes from current adventure style settings, applicable persistent author notes and any starting directions supplied by a scenario template, assembled for every AI narrative generation through IDEA-0024/0025. Model-specific technical parameter presets, where selected, influence compatible **provider request parameters** separately. Neither changes already committed story prose or canonical world state merely by selection.

## Dependencies and constraints
- The active model's parameter support is governed by [[Model-Capability-Aware Controls]] (IDEA-0015), including supported/unsupported/ignored/unknown classifications and opt-in advanced overrides.
- Provider connection profiles and local/cloud adapters determine available models and endpoint-specific parameter mappings (IDEA-0012 through IDEA-0014).
- A provider may use different names, scales or semantics for similarly named sampling controls; map only when equivalence is understood and expose actual transmitted values.
- Effective-request inspection and diagnostics must redact API keys, authentication headers, sensitive connection fields and other secrets.
- Malformed or incompatible custom JSON must produce clear feedback instead of corrupting the story or committing incomplete generations.
- Explicitly saved technical presets may be viewed/edited without depending on a connected model, but no preset is automatically associated with or restored upon selecting a model. The active saved preferences remain a single shared entry.

## Open questions
- **Resolved active storage scope:** One shared current generation-settings entry across providers/models/tasks; named technical presets, if used, are explicitly player-selected, with no model-bound inheritance or automatic switch behaviour. The exact UI for saving/selecting such presets remains implementation refinement.
- What are safe default values and model-specific limits for each parameter?
- Which parameters can be translated between provider APIs without changing their meaning?
- How should conflicts between ordinary controls, preset values and custom JSON overrides be resolved?
- What effective-request information can be shown safely when a provider internally transforms the request?
- Can users import/export nonsecret presets independently of adventures, and what compatibility warnings are needed?

## Draft acceptance criteria
- [ ] A model sampling preset changes compatible provider-generation parameters but does not introduce a reusable narration-style or author-note preset or silently change existing adventure prose.
- [ ] A player can adjust basic supported generation parameters through a straightforward UI.
- [ ] Advanced mode can expose additional sampling, output, repetition, seed, reasoning and stop settings where supported.
- [ ] A player can explicitly save/apply a named technical sampling preset to the **one shared active settings entry**, without automatic per-model/provider activation.
- [ ] Switching models/providers immediately reevaluates and disables/annotates unsupported frontend controls and omits unsupported values in the **effective request**, preserving one shared saved current-settings record unchanged.
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

- 2026-10-23 — **User resolved A-13:** A single saved current generation-parameter settings entry applies across providers/models/tasks. On model/provider switch, frontend reevaluates capabilities, disables/annotates unsupported controls and omits incompatible fields from ordinary requests without overwriting preferences. Earlier automatic model/profile-associated sampling preset scope is superseded. Explicitly selected named technical presets remain distinct from a per-provider settings store and from rejected narration-style presets. Staging only.
- 2026-10-18 — **IDEA-0010 boundary clarification:** Reusable narration-style presets were explicitly removed from accepted scope, but **technical provider/model sampling-parameter presets in IDEA-0016 remain independently accepted**. Narrative guidance comes from template starting inputs/current settings/author notes in per-turn context. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Basic and advanced sampling controls, model-specific reusable presets, preserved preferences when switching models, effective-request inspection and optional custom JSON parameters, all subject to IDEA-0015 capability rules. Moved to staging for refinement, not production.
