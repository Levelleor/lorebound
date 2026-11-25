---
id: STORY-0036
type: story
status: pending
parent: PRD-0011
depends_on:
- STORY-0030
priority: 3
related:
- PRD-0011
- STORY-0005
- STORY-0008
- STORY-0009
blocked: true
---

# Narration guidance: remaining context and mode integration

## Outcome

Track this open gap without changing the merged status of the bounded slice.

[Pinned source INC-005](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/INCOMPLETE-FEATURES.md)

## Scope and boundaries

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — integration**; DEV-004G has approved conditional closure in [PR #27](https://github.com/Levelleor/lorebound/pull/27); this integration gap stays open after confirmed checked merge. |
| Implemented | Current adventure style controls/custom instructions, future-only guidance for existing local Story Generate/Retry, separate revision/epoch-fenced metadata and requested-guidance inspection. Fork copies current saved settings independently. |
| Unfinished | Persistent global/adventure/scene author-note layers, scenario-template starting directions, measured context-budget/omission inspection and future narration modes are not integrated. Model adherence is best-effort and context capacity is unknown. |
| Practical effect | Current supported Story narration sends selected style guidance in full. It adds no author-note manager, style presets, token-capacity guarantee or automatic rewrite of accepted prose. Simulation ignores style. |
| Source / evidence | [DEV-004G requirements/limits](STORY-0030-current-adventure-narration-settings.md); [prompt assembly](../../../frontend/src/lib/narration.ts); [composer settings shelf](../../../frontend/src/lib/NarrationSettings.svelte); [browser contracts](../../../frontend/scripts/check-narration.mjs). The primary PR owns current CI/actual-capture readiness and user-review disposition. |
| Resolution | Separately authorise and verify owning context/author-note/template/mode slices, integrate their inputs in the accepted deterministic order and preserve future-only behavior. Do not infer whole-IDEA completion from the current controls. |
| Dependencies / boundary | IDEA-0010/0024/0025 and DEV-005/008/009; later provider/mode integration. No automatic next child or change to staged/unaccepted ideas and B9-D12 deferral. |

## Risks and blockers

Depends on accepted context budget, author-note, template and later mode slices.
