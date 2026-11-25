---
id: PRD-0011
type: prd
status: accepted
related:
- NOTE-0025
- PRD-0001
- NOTE-0009
- NOTE-0010
---

# Narration Style and Perspective Controls

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0010](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Narration%20Style%20and%20Perspective%20Controls.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S08**. First milestone: **M3**. Delivery: **PARTIAL ON CONFIRMED PR #27 MERGE**.

- Requirement coverage: [Four bounded rows](../work/items/STORY-0030-current-adventure-narration-settings.md); approved conditional closure; author-note/template/context/mode integration remains later
- Evidence: [Primary PR #27](https://github.com/Levelleor/lorebound/pull/27), effective only on confirmed checked merge

## Accepted direction
- **Perspective:** Configure first-person, second-person, or third-person narration without changing the actual character/world state.
- **Tense:** Configure narrative tense (such as past or present).
- **Genre and tone:** Guide the AI toward the intended genre and emotional/writing tone.
- **Pacing:** Control narrative density and speed, for example slower descriptive storytelling or faster action-oriented narration.
- **Response length:** Offer preferences for brief or detailed generations.
- **Custom instructions:** Permit freeform user-authored writing and stylistic instructions rather than only fixed options.
- **No reusable narration-style presets (explicit user revision, 2026-10-18):** Do **not** build or require a separate saved narration-style preset library, picker, sharing/import/export, or live preset linkage. Story direction instead comes from **optional scenario-template-provided starting inputs, the adventure's current narration settings, and persistent author notes/instructions**.
- **Predictable creative instruction assembly (user decision 2026-10-23):** Combine current style settings, applicable global/adventure/scene author notes and any adventure-owned template-derived directions in a consistent documented order. Do **not** attempt to identify or resolve contradictions among creative instructions. Model adherence is best-effort; authoritative accepted world-state checks remain a separate hard boundary.
- **Future-only application:** Changing current settings or author notes influences **subsequent AI generation turns**; it does **not** automatically rewrite existing committed passages or mutate canonical world state.

Narration controls steer the model's presentation. They are not authoritative game-state mutations, and they are distinct from provider-level decoding parameters such as temperature and Top-P.

## Dependencies and constraints
- Depends on the narrator/context builder and generation model integration; the UI and prompt format remain to be refined.
- Model adherence is best-effort; a selected perspective, tone or tense cannot be guaranteed by arbitrary LLMs.
- Style preferences should not override validated game-world state rules.
- Output length may involve narrator instructions and a model-specific generation cap; sampling and API capability controls are separate planning ideas.
- Applying or editing current narration settings, applicable scenario-supplied setup or author notes must not rewrite earlier story text. **Narration-style presets are not an accepted feature**; provider sampling-parameter presets (IDEA-0016) are separate and unaffected.

## Open questions
- Which preferences are implemented entirely as prompt instructions, and which may map to provider-supported decoding or output-limit controls?
- **Resolved creative-conflict policy 2026-10-23:** Template-derived directions belong to the adventure's initial editable configuration, not a live link. Current style and author-note layers are assembled in a predictable order, without detecting or resolving contradictory instructions. The exact concatenation sequence is a technical detail; later edits to the source template must never overwrite the adventure's current values.
- Can players temporarily switch narration styles for a single continuation without changing the saved default?
- **Resolved:** Send both applicable creative preferences in a stable order and let the model interpret the tension. Lorebound does not need a conflict-repair workflow or automatic rewriting of preferences.
- **Resolved (2026-10-18):** Do **not** include narration-style preset saving, sharing, import/export or management. Optional reusable **scenario templates** (IDEA-0008) and **model sampling-parameter presets** (IDEA-0016) are distinct features.

## Draft acceptance criteria
- [ ] After changing `Playing As`, the next Do/Say adopts the chosen character's established scene even if elsewhere; no invented travel, teleportation, time advancement or movement event appears solely from changing viewpoints.
- [ ] Story/Continue remain independently steerable and narration style preferences are not rewritten by actor selection.
- [ ] A player can configure narration perspective, tense, genre, tone, pacing and desired response length for upcoming generation.
- [ ] A player can provide custom freeform narrative style instructions.
- [ ] Narration is guided by optional template-provided starting inputs, the adventure's **current** narration settings and applicable persistent author notes, **without a separate saved narration-style preset gallery or selector**.
- [ ] Every subsequent **AI narrative generation turn** assembles the then-applicable current style settings and author notes into the requested narration context; players are not required to re-enter persistent notes each turn. Material context-budget omissions are exposed, not silently treated as transmitted.
- [ ] Changes to settings or author notes affect future generation requests, not already committed passages or past world-state events.
- [ ] Changing style preferences alone does not mutate tracked character, inventory, location or other world state.
- [ ] Provider-specific controls remain separately configurable; unsupported API parameters are not implicitly required by this feature.

## Supporting detail

See [NOTE-0025](../knowledge/inbox/NOTE-0025-prd-0011-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
