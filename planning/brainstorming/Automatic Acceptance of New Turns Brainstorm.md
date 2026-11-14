---
type: brainstorm
status: active
mode: partner
topic: "Automatic acceptance of newly submitted messages and completed continuations"
goal: "Remove the repeated Accept step for new turns while preserving edit and other confirmation workflows."
created: "2026-11-14"
updated: "2026-11-14"
branch_of: "[[Story Editing and Event Timeline Brainstorm]]"
sources:
  - "[[DEV-004D]]"
  - "[[Freeform Player Action Modes]]"
  - "[[Retry Undo and Alternative Continuations]]"
outputs:
  - "[[Automatic Acceptance of New Turns]]"
tags:
  - planning/brainstorm
  - planning/interaction
---

# Automatic Acceptance of New Turns Brainstorm

## Goal

Remove the repeated Accept step for newly submitted messages and their completed continuations, keeping the user's explicit exclusion of edited turns and other operations.

## Context

This is a new exploration of a change to shipped interaction. Actual `StoryCoordinator.prepareCandidate` currently produces a ready candidate; `accept` separately submits its atomic append, and `StoryWorkspace.svelte` exposes Accept turn. [DEV-004D](../development/requirements/DEV-004D.md) adds diagnostics without changing that workflow. The original production notes and accepted decisions remain intact; this future request does not change current specifications or application behavior.

## Session Log

- 2026-11-14 — **Decision:** After the checked PR #24 handoff and named approval request, the user said “I approve this for closure.” This authorises finalising/merging the diagnostics PR; the behavior request below is future work.
- 2026-11-14 — **User idea:** Dislikes repeatedly approving typed/submitted turns. Requested a future task to remove the extra acceptance step for new messages and have completions feed into the story automatically, with a more chat-like experience. Cited AI Dungeon and NovelAI as the desired interaction analogy; their external behavior has not been independently verified here.
- 2026-11-14 — **Direction:** User expressly excluded edited turns and other operations. Capture one user-origin future candidate/task; do not implement it during DEV-004D closure or infer production readiness from a capture request.
- 2026-11-14 — **Insight:** Refinement must distinguish new-turn automatic acceptance from edited/history operations and resolve player-input persistence timing, failed/cancelled requests and Retry after a completion has already become canonical.
- 2026-11-14 — **Direction:** Captured [IDEA-0069](../inbox/Automatic%20Acceptance%20of%20New%20Turns.md) and a linked future-work entry in TASKS. No staging promotion, implementation launch or next-task reprioritisation follows.

## Current Threads

- Define submission/completion persistence timing and recovery without restoring the repeated new-turn confirmation step.
- Preserve existing technical validation, atomic/version/epoch/idempotency guards and incomplete-stream/cancellation safety.
- Refine Retry/regeneration once a completion is already committed; preserve edit and other confirmations.

## Decisions

- User-requested future direction: new submissions and completed continuations should flow into the story automatically without a separate Accept click.
- Edited turns and other confirmation workflows are outside the requested change.
- Only future capture/task recording is authorised here; no implementation is launched.

## Outputs

- [IDEA-0069 — Automatic Acceptance of New Turns](../inbox/Automatic%20Acceptance%20of%20New%20Turns.md): user-origin Inbox candidate, unaccepted and awaiting refinement/promotion approval; linked from [future requested work](../development/TASKS.md#future-requested-work-not-launched).

## Resume Here

The user requested new-turn automatic acceptance as future work during DEV-004D closure. IDEA-0069 is captured in Inbox; this session remains active. Refine submission/completion persistence, cancellation/failure and Retry semantics, then seek the normal acceptance/readiness approvals. Do not broaden the change to edits, Undo, Fork or other confirmations, or start implementation through the diagnostics closure.
