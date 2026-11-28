---
id: STORY-0005
type: story
status: pending
parent: PRD-0025
depends_on:
- STORY-0002
priority: 3
related:
- PRD-0021
- PRD-0026
- STORY-0004
- STORY-0039
blocked: false
---

# Lorebook, author notes, context budget and derived memory

## Outcome

Lorebook, author notes, context budget and derived memory.

[Legacy task: DEV-005](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-005)

Original disposition: QUEUED.

## Scope and boundaries

Source dependency/constraints: DEV-002; DEV-004 interfaces.

Primary coverage: IDEA-0020–IDEA-0025.

## Acceptance criteria

Use the owning accepted requirements and their objective criteria when a bounded scope is selected. This broad queue entry has no separate full acceptance contract.

## Verification plan and evidence

No implementation or verification was recorded for this queued roadmap item.

## Risks and blockers

Re-evaluated 2026-11-11 and no longer blocked: the named DEV-004 provider-context interface this entry waited on is delivered. Local Story narration now assembles and transmits layered instruction context in one place ([`frontend/src/lib/models.ts`](../../../frontend/src/lib/models.ts) `generateLocal` system message, [`narration.ts`](../../../frontend/src/lib/narration.ts) `narrationInstructions`), the in-flight attempt is captured and inspectable ([`generationDiagnostics.ts`](../../../frontend/src/lib/generationDiagnostics.ts), [`GenerationInspector.svelte`](../../../frontend/src/lib/GenerationInspector.svelte)), and per-adventure guidance metadata already persists through Go/SQLite with epoch and revision fencing ([`internal/store/narration.go`](../../../internal/store/narration.go)). Those interfaces, delivered through [STORY-0024](STORY-0024-direct-browser-local-story-narration.md)–[STORY-0031](STORY-0031-fresh-saved-model-selection-for-generate-retry.md), are the prerequisite this entry recorded.

Remaining risk is scope size, not a missing dependency. This tracker stays broad; delivery proceeds through bounded children. First authorized child: [STORY-0039](STORY-0039-per-adventure-author-notes-in-story-narration-guidance.md) (per-adventure author notes and transmitted-text inspection). Lorebook entries and manual context selection ([PRD-0021](../../product/PRD-0021-entity-based-lorebook.md)), conditional activation, summaries and episodic memory, and token-budget measurement ([PRD-0025](../../product/PRD-0025-token-budgeted-context-builder-and-inspector.md)) remain undelivered and unselected.

## Notes

### N001
Blocker re-evaluated 2026-11-11: the named DEV-004 provider-context interface is delivered (models.ts generateLocal layered system message with narrationInstructions ordering, generationDiagnostics + GenerationInspector transmitted-attempt capture, Go narration_settings epoch/revision fencing from STORY-0024..STORY-0031). blocked set false. Delivery continues through bounded child STORY-0039 (per-adventure author notes + transmitted-text inspection); Lorebook, conditional activation, summaries, episodic memory and token-budget measurement remain unselected.

### N002
The owner selected the Context sidebar as the primary surface for the next-prompt token preview, following the supplied Command Citadel screenshot. [STORY-0042](STORY-0042-preview-the-next-story-prompt-in-the-context-sidebar.md) records this bounded follow-up to completed [STORY-0040](STORY-0040-manual-lorebook-entries-and-story-context-selection.md) and [STORY-0041](STORY-0041-character-limits-and-presets-for-story-context.md).
