---
id: NOTE-0068
type: note
status: inbox
created_at: 2026-11-28
source: PRD-0025
related: []
---

# Estimated token usage in the Story context inspector

## Discovery

The first Story context budgeting slice uses configurable per-section character limits with Low, Medium, and High presets. Track estimated token usage as a follow-up for the existing Generation Inspector.

Show the approximate token count for the assembled Story prompt and compare it with the active model's context limit when a reliable limit is available. Show per-section contributions where possible, make the estimate and any unknown provider overhead visible, and include an output allowance in the comparison when it is known. If the model limit is unknown, show the estimate without a capacity percentage or fit claim.

Evaluate a local estimate first. Where a provider offers chat-aware tokenization, such as vLLM's /tokenize endpoint, consider an on-demand measurement of the assembled prompt and show its source. Keep provider tokenization outside the Generate and Retry path and avoid repeated provider calls to decide which Lorebook entries fit.

## Classification

Planning follow-up for the Story context inspector under PRD-0025.
