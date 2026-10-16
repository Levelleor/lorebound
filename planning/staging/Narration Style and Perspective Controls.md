---
id: "IDEA-0010"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Narration Style and Perspective Controls

## Idea
Control viewpoint, tense, genre, tone, pacing and response length.

## Why this idea matters
Different stories need different narrator behaviour.

## Accepted direction
- **Perspective:** Configure first-person, second-person, or third-person narration without changing the actual character/world state.
- **Tense:** Configure narrative tense (such as past or present).
- **Genre and tone:** Guide the AI toward the intended genre and emotional/writing tone.
- **Pacing:** Control narrative density and speed, for example slower descriptive storytelling or faster action-oriented narration.
- **Response length:** Offer preferences for brief or detailed generations.
- **Custom instructions:** Permit freeform user-authored writing and stylistic instructions rather than only fixed options.
- **Reusable narration presets:** Save and reselect combinations of these style instructions and controls.
- **Future-only application:** Changes to narration settings influence future generated prose; switching presets does **not** automatically revise or regenerate existing passages.

Narration controls steer the model's presentation. They are not authoritative game-state mutations, and they are distinct from provider-level decoding parameters such as temperature and Top-P.

## Proposed behaviour
Expose optional narration preferences and a freeform instruction field for each adventure, along with a way to save and apply reusable style presets. Assemble the currently selected preferences into the narrator's instructions for subsequent generation requests, without retroactively altering existing document blocks. Keep story events, equipment, NPC locations and other authoritative state unchanged merely because narration settings are updated.

## Alternatives and trade-offs
A single author-note text field is flexible but harder to reuse and discover; dedicated controls are more approachable but can be overly prescriptive. The accepted direction supports both custom writing instructions and configurable options. Their exact UI layout, and whether controls are global defaults, per-adventure defaults, or temporary overrides, remain open.

## Dependencies and constraints
- Depends on the narrator/context builder and generation model integration; the UI and prompt format remain to be refined.
- Model adherence is best-effort; a selected perspective, tone or tense cannot be guaranteed by arbitrary LLMs.
- Style preferences should not override validated game-world state rules.
- Output length may involve narrator instructions and a model-specific generation cap; sampling and API capability controls are separate planning ideas.
- Applying or modifying a preset must not trigger automatic rewriting of earlier story text.

## Open questions
- Which preferences are implemented entirely as prompt instructions, and which may map to provider-supported decoding or output-limit controls?
- What is the precedence between a preset, per-adventure style overrides, and custom writing instructions?
- Can players temporarily switch narration styles for a single continuation without changing the saved default?
- How should conflicting preferences such as short responses plus elaborate descriptive pacing be handled?
- Should preset sharing/import-export be included in this feature or handled elsewhere?

## Draft acceptance criteria
- [ ] A player can configure narration perspective, tense, genre, tone, pacing and desired response length for upcoming generation.
- [ ] A player can provide custom freeform narrative style instructions.
- [ ] A player can save a named narration preset and reuse it in an adventure.
- [ ] Changes to narration settings affect future generation prompts, not previously saved narrative passages.
- [ ] Changing style preferences alone does not mutate tracked character, inventory, location or other world state.
- [ ] Provider-specific controls remain separately configurable; unsupported API parameters are not implicitly required by this feature.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant proposal, subsequently explicitly selected by the requesting user.
- Accepted for staging and refinement only; this does not mean that controls have been implemented or approved for production.

## Decisions and review history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Configurable perspective, tense, genre, tone, pacing, response length, custom writing instructions and reusable narration presets. These changes affect future narration without rewriting existing prose. Moved to staging for refinement, not production.
