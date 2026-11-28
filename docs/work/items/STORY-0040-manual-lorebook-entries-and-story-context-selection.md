---
id: STORY-0040
type: story
status: completed
created_at: 2026-11-27
parent: PRD-0021
depends_on:
  - STORY-0031
priority: 3
related:
  - STORY-0005
  - STORY-0039
  - PRD-0025
---

# Manual Lorebook entries and Story context selection

## Outcome

Give each adventure a Lorebook for player-authored reference material. Players can explicitly save typed entries, choose which entries to use during local Story Generate and Retry, and inspect the lore text transmitted with an attempt.

This is the next bounded slice of [STORY-0005](STORY-0005-lorebook-author-notes-context-budget-and-derived-memory.md) under [PRD-0021](../../product/PRD-0021-entity-based-lorebook.md). It builds on the generation inspector and request freshness work already in the app, including the merged [author-notes slice](STORY-0039-per-adventure-author-notes-in-story-narration-guidance.md). It covers whole-entry manual selection in one adventure. Entity links, links to live world state, template instantiation, automatic activation, and broader memory and context budgeting remain follow-up scope. The [context builder requirement](../../product/PRD-0025-token-budgeted-context-builder-and-inspector.md) continues to track model-aware budgeting across context sources.

## Acceptance criteria

- An adventure starts with an empty Lorebook. Players can create, inspect and explicitly save entries for characters, places, factions, species, objects, abilities and other concepts. Each entry has a type, a display title, a freeform description and a stable identity across edits. Entries and selection survive reload and restart, remain isolated by adventure, and carry over to Fork as independent copies. Lorebook saves preserve accepted story, world state and the composer draft. Player-authored descriptions serve as narrative reference.
- The composer Lorebook icon opens an accessible, resizable left drawer with an expanded editing view. The drawer follows the accepted reveal, fade and reduced-motion behavior. Opening and closing it preserves the composer input and leaves unsaved edits uncommitted. The editor and inclusion controls work by keyboard and fit supported viewport sizes.
- Players can include or exclude whole entries through visible controls. New entries start excluded. Selection is saved per adventure and the next local Generate or Retry reads current saved entries and selections, including changes from another tab. The request includes only selected entries in a clearly labelled lore section in deterministic order, with player-facing titles, types and descriptions. Internal IDs stay out of narrator text. Preserve the existing style, author notes, accepted history and player-input flow. Stop during a read prevents late dispatch, and a failed or invalid read surfaces an actionable error with the composer input intact.
- The inspector shows which entries were requested and the exact lore text transmitted on that attempt, including an empty state. Later edits leave that attempt's snapshot intact. When request size and available capacity can be determined reliably, keep whole entries within that capacity and identify selected entries omitted for space. When capacity cannot be determined reliably, label it as unknown and surface provider-reported context overflow clearly.

## Verification plan

- Extend the Go SQLite gate to cover isolation, persistence after reopening, stable IDs, explicit saves, independent Fork copies and validation or failed writes that preserve existing data.
- Extend TypeScript tests to cover prompt order, exclusion, deterministic assembly, exact attempt snapshots and capacity or overflow states.
- Extend the browser-host gate with a real local request to a test provider for Generate and Retry, checking selected and excluded lore, exact transmitted text, fresh saves across tabs, Stop/read failure, keyboard access and drawer layout. Label test-provider evidence and any capacity limits explicitly.
- Run `agentctl verify` before marking the implementation complete.

## Notes

### N001
SQLite format 10 adds adventure-owned Lorebook entries in creation order. Entry revisions reject conflicting saves and recover identical retries. Fork copies current entries and inclusion together with the destination. Local Generate and Retry reread saved lore and capture requested entries plus the exact prompt section at browser dispatch. Current provider profiles do not supply reliable capacity and request sizing, so the inspector reports unknown capacity and recognized provider overflow is surfaced without retaining raw error text.

### N002
All seven configured verification gates passed. The browser host gate exercised real Firefox/Go/SQLite persistence, exact request and inspector text with simulated provider replies, cross-tab Retry, context overflow, failed reads and Stop. A focused run on the review build also passed in Chromium. The review server uses a separate local library with a simulated provider for hands-on verification.

### N003
The owner approved closing and merging STORY-0040 on 2026-11-28 after the review handoff. This bounded slice is complete on merge of its primary pull request into main.
