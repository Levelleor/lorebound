---
id: "IDEA-0015"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Model-Capability-Aware Controls

## Idea
Disable or mark unsupported sampling options and omit them from normal requests.

## Why this idea matters
Unsupported values may fail or be ignored silently.

## Accepted direction
- **Four capability states:** For each relevant provider/model/endpoint generation parameter, distinguish **supported**, **unsupported**, **ignored** and **unknown** rather than making a binary assumption.
- **Supported:** Enable ordinary controls and transmit configured values when relevant.
- **Unsupported:** Disable or clearly mark the ordinary control; **omit the parameter from normal generation requests**, even if the user has an old saved preset value.
- **Ignored:** Explain that an endpoint may accept the parameter without applying it; do not present that value as reliably effective.
- **Unknown:** Clearly mark unverified capability rather than claiming supported behaviour, and apply a conservative default policy to be refined.
- **Advanced overrides:** Permit a deliberate, visibly warned expert override to try experimental or unsupported/unverified values for a selected connection/model. Never silently enable overrides for all providers.
- **Context-aware UI and requests with one shared settings entry (2026-10-23):** The frontend dynamically reevaluates control availability and actual outgoing parameters whenever provider/model changes. Unsupported controls are visibly disabled/annotated and omitted in ordinary requests, while the **same single saved current parameter settings entry** remains unchanged across switches. Do not create per-provider/model copies of current values.
- **Distinguish intent from effect:** Show or otherwise explain when a preferred setting is omitted, ignored, or overridden so the player can understand what was actually sent.

These are accepted planning requirements; the sources of capability metadata, defaults for unknown/ignored settings, and probe rules are still open.

## Proposed behaviour
Track parameter capability against the active provider/model profile using the four states above. Display disabled or annotated controls for values known not to work, and omit unsupported parameters from ordinary outgoing requests. When a user deliberately opts into an advanced override, include the requested experimental field only for the chosen scope and warn about errors or no-op behaviour. Preserve the single shared saved parameter-preferences entry separately from each request's derived effective parameters. Explicitly saved technical presets, if selected by the user, write into this same entry rather than being applied automatically per model. Offer a way to inspect the actual parameter set used by a request, subject to safe redaction of secrets.

## Alternatives and trade-offs
Blindly sending every configured value risks hard API errors and silent no-ops, and is not the accepted normal behaviour. A fixed conservative intersection of settings is simpler but hides valid model-specific features. Capability-aware controls with an opt-in advanced override provide flexibility while keeping ordinary requests predictable. Automatic capability probing versus curated metadata and user-maintained profiles remains a refinement choice.

## Dependencies and constraints
- Depends on cloud/local model adapters ([[Cloud LLM Provider Connectors]], [[Local LLM Server Connections]]) and [[Provider Connection Profiles and Discovery]].
- Sampling and other generation settings are separately planned in [[Sampling Presets and Advanced Parameters]] (IDEA-0016); this idea governs whether a control is offered/sent, not the full parameter catalogue or preset UI.
- Endpoint/API versions, model variants and gateway transformations can change capabilities; defaults must be conservative when support has not been verified.
- A parameter may be accepted syntactically but ignored semantically. Do not equate HTTP success with confirmed effect.
- Advanced overrides must be explicit and scoped, and an API failure from an unsupported override must not commit incomplete narrative output or world-state changes.
- Request previews and diagnostics must redact API credentials, authentication headers and other secrets.
- A preserved setting in the **single shared current parameter record** does not imply transmission to every model. Derive supported controls/effective parameters anew on provider/model switch and redact secrets in inspections.

## Open questions
- How are model capability definitions sourced, versioned, updated and invalidated over time?
- Are capabilities keyed to provider family, endpoint variant, specific model IDs, API versions, or all four?
- What defaults should apply to `unknown` and `ignored` settings during ordinary requests?
- Can automatic testing reliably distinguish unsupported from silently ignored settings without unwanted generation cost?
- How should advanced overrides be scoped: individual request, model, connection profile or saved preset?
- How will the UI explain skipped fields and show the effective request without exposing secrets?

## Draft acceptance criteria
- [ ] The application represents supported, unsupported, ignored and unknown status distinctly for a parameter on the active model/endpoint.
- [ ] A supported parameter can be configured and included in the effective request when applicable.
- [ ] Known-unsupported parameters are disabled/labelled and omitted from **normal** requests.
- [ ] Ignored or unverified values are identified to the user instead of misrepresented as effective.
- [ ] Explicit expert overrides can attempt experimental/unsupported settings for a selected scope with a clear warning.
- [ ] A parameter override or failure for one model does not silently affect other profiles or commit incomplete story/world-state data.
- [ ] Model/provider switching reevaluates the frontend controls and request parameters against current capabilities while retaining **one unchanged shared saved current-settings entry**, with no automatic model-scoped preference switch.
- [ ] An effective-request view or diagnostic explains omitted/overridden parameters without revealing secrets.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- Accepted by the requesting user for **staging/refinement**, not production or implementation.

## Decisions and review history

- 2026-10-23 — **User clarified A-13:** Active sampling/advanced parameter preferences are one saved entry across models/providers/tasks. The frontend dynamically toggles unsupported controls when switching models and omits known-unsupported settings from ordinary effective requests. Capability states, warnings and explicit expert overrides remain as accepted. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Four parameter states (supported, unsupported, ignored, unknown); capability-aware controls; omission of unsupported values from normal requests; and explicit advanced overrides for experimental settings. Moved to staging for refinement, not production.
