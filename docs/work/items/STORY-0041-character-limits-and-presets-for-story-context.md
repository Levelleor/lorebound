---
id: STORY-0041
type: story
status: completed
created_at: 2026-11-28
parent: PRD-0025
depends_on:
  - STORY-0040
priority: 3
related: []
---

# Character limits and presets for Story context

## Outcome

Give players control over the amount of text in each section of a local Story prompt through character limits saved on each model profile. Ship Low, Medium and High presets and let players customize their current values directly.

This is a bounded slice of [STORY-0005](STORY-0005-lorebook-author-notes-context-budget-and-derived-memory.md) that builds on [manual Lorebook selection](STORY-0040-manual-lorebook-entries-and-story-context-selection.md). Apply the same character-based rules across local providers. Estimated token usage and optional provider measurement are tracked in [NOTE-0068](../../knowledge/inbox/NOTE-0068-estimated-token-usage-in-the-story-context-inspector.md).

## Acceptance criteria

- Each local model profile can store character limits for author notes, accepted history, Lorebook and player input. Low, Medium and High provide fixed bundles of increasing prompt sizes. The settings show the exact current values and let the player edit each one. Existing profiles keep their current generation behavior until a preset is selected.
- Editing any limit on a built-in preset immediately switches the active choice to Custom, copies all values from the preset and applies the changed value. Editing another field updates the same Custom settings. Each valid edit takes effect and persists without a separate Save action. Reloading retains the active choice and current values. Selecting a built-in preset replaces the current values with that preset's bundle. The profile keeps only its current choice and values, with no preset history or previous Custom values.
- Local Story Generate and Retry use the current saved profile and Lorebook selections. Count Unicode code points in each rendered section, including its headings and separators, and enforce each section's own limit. Send the fixed system instructions and narration style in full. Apply the character limits locally on every supported provider.
- Keep the newest accepted history by trimming from the oldest end, preserving the reading order of what remains. Consider manually included Lorebook entries in their existing order. Include only whole entries, skipping any entry that would exceed its section limit and continuing to consider later entries. Preserve saved history and Lorebook selections.
- If the author notes or player input exceed their section limit, stop before sending a generation request. Show the affected section, its character count and its limit. Retain the full text and let the player edit it or raise the limit.
- The inspector shows the attempt's per-section character counts and limits, identifies any trimmed history or skipped Lorebook entries, and shows the exact Lorebook text sent. Subsequent edits leave the attempt record intact. Label preset sizes in characters and continue to surface provider-reported context overflow.

## Verification plan

- Verify profile isolation, migration from profiles without limits, persistence after reload and the Low/Medium/High to Custom transition. Exercise immediate updates, rapid successive edits, reset to a built-in preset and using the latest saved values on Generate and Retry.
- Verify Unicode counts, exact-fit boundaries, section formatting overhead, oldest-first history trimming, whole-entry Lorebook fitting and retention of over-limit player input and author notes.
- Extend the browser-host checks to exercise the preset controls and inspect the actual request and Generation Inspector. Confirm the over-limit error prevents dispatch, later edits preserve the attempt snapshot and provider overflow still surfaces.
- Run the applicable gates through `agentctl verify` before marking implementation complete.

## Notes

### N001
Implemented per-model Story character limits through the existing revision-checked profile service. SQLite format 11 adds one optional current-settings column. Low, Medium and High define four editable limits; editing switches to Custom and serializes live saves. Prompt assembly counts Unicode code points, keeps recent history, fits whole Lorebook entries in order, and blocks oversized author notes or player input before dispatch. The inspector captures counts, omissions and transmitted lore per attempt.

### N002
All seven configured gates passed, with the browser-host gate rerun after correcting test route cleanup. The 225s gate verified real Firefox/Go/SQLite preset saves, rapid edits, exact outbound prompt, blocked dispatch, cross-tab Retry, overflow and full host restart. The focused preset exercise also passed in Chromium. Provider replies were simulated. Verification used installed Node 24.22.3.

### N003
The owner approved closing and merging STORY-0041 on 2026-11-28 after reviewing the app. This slice is complete on merge of its primary pull request into main.
