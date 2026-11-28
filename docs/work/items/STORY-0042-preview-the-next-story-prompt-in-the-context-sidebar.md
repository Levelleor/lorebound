---
id: STORY-0042
type: story
status: completed
created_at: 2026-11-28
parent: PRD-0025
depends_on:
  - STORY-0041
priority: 3
related: []
---

# Preview the next Story prompt in the Context sidebar

## Outcome

Give players a live preview of the next local Story prompt in the right sidebar before they send. Use the supplied Command Citadel Context tab screenshot as the layout reference. The Context tab shows a Next prompt heading, a right-aligned token readout, a compact stacked bar, a color-keyed breakdown and a reply allowance line when the allowance is known.

This is a bounded slice of [STORY-0005](STORY-0005-lorebook-author-notes-context-budget-and-derived-memory.md) and applies [the Command Citadel design direction](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md). The sidebar is the primary home for the preview proposed in [NOTE-0068](../../knowledge/inbox/NOTE-0068-estimated-token-usage-in-the-story-context-inspector.md). Generation details continues to show what happened on a specific attempt.

## Acceptance criteria

- Open Context from the existing right sidebar on desktop and from World on narrow screens. Follow the reference treatment with an outline icon, gold active underline, monospace values, an 8px segmented bar and a compact legend. Scene and Context are operable with keyboard and pointer, and the labels and values communicate the breakdown independently of color.
- Show the preview before the first generation. Refresh it as the current draft, accepted history, saved style or notes, selected Lorebook entries, model or character limits change. Use the same local Story prompt assembly and character-limit rules as generation. Show trimmed history, skipped lore and any input or author-notes limit that blocks dispatch directly in the tab.
- Label the total and section values as estimates. Use System & style, Author notes, Lorebook, Recent story and Player input for the supported sources. Include a row for a source when it contributes text. Scene & state and Memory summaries belong in the breakdown once they contribute to prompt assembly. Derive the total and segments from the same preview and keep preview calculation local.
- With a reliably known model context limit, show estimated input against that limit and show any known reply allowance in the remaining space calculation. When the limit is unknown, show the estimated input and a stack representing the mix of prompt sections. Label unknown capacity, unknown reply allowance and unmeasured provider overhead where relevant. Show a clear unavailable state when no local model is selected. The screenshot numbers illustrate layout.

## Verification plan

- Test preview and request assembly against the same fixtures, including blank and populated drafts, selected lore, history trimming and blocked input. Check that the breakdown adds up and handles known and unknown capacity and reply allowance.
- Exercise the Context tab before generation in the browser-host gate. Change the draft, lore selection and model limits, then compare the updated preview with the assembled request. Verify that switching between adventures shows the current adventure’s preview and that later edits preserve the attempt record in Generation details.
- Review the panel against the supplied screenshot at desktop and mobile widths in Dark and Bright. Verify keyboard navigation, visible focus, readable labels and the existing Story and World switch. Run the configured gates with agentctl verify before marking implementation complete.

## Notes

### N001
Implemented the live Context sidebar with a shared local prompt builder, section token estimates, and visible omission and character-limit feedback. Model profiles can optionally store the server context limit and a reply planning allowance in SQLite format 12. The estimator rounds rendered UTF-8 bytes at four bytes per token per section and leaves provider overhead unmeasured. Focused Chromium checks covered the sidebar against requests with simulated replies, cross-tab saves, adventure isolation, and the corrected Story and World switch.

### N002
All seven configured agentctl verification gates passed on the final implementation using installed Node 24.22.3. The browser-host gate took 229 seconds and verified the real Firefox/Go/SQLite integration with simulated model replies, the Context preview and model settings, the narration form across library replacement, and exact restart persistence. Focused Firefox and Chromium checks and visual review covered the mobile and desktop sidebar.

### N003
The owner asked to close STORY-0042 and merge its primary pull request on 2026-11-28. The story is complete on merge of the Context sidebar pull request into main.
