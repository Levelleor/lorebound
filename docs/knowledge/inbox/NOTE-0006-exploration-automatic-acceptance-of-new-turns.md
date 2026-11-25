---
id: NOTE-0006
type: note
status: inbox
source: PRD-0001
related:
- PRD-0070
---

# Exploration: Automatic Acceptance of New Turns

## Discovery

Exploratory history, not project authority. Original session status: **active**. Accepted requirements and decisions take precedence; candidate suggestions remain non-authorizing.

[Pinned source working notes and dated session log](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/brainstorming/Automatic%20Acceptance%20of%20New%20Turns%20Brainstorm.md)

## Goal

Remove the repeated Accept step for newly submitted messages and their completed continuations, keeping the user's explicit exclusion of edited turns and other operations.

## Context

This is a new exploration of a change to shipped interaction. Actual `StoryCoordinator.prepareCandidate` currently produces a ready candidate; `accept` separately submits its atomic append, and `StoryWorkspace.svelte` exposes Accept turn. [DEV-004D](../../work/items/STORY-0027-local-generation-diagnostics.md) adds diagnostics without changing that workflow. The original production notes and accepted decisions remain intact; this future request does not change current specifications or application behavior.

## Current Threads

- Define submission/completion persistence timing and recovery without restoring the repeated new-turn confirmation step.
- Preserve existing technical validation, atomic/version/epoch/idempotency guards and incomplete-stream/cancellation safety.
- Refine Retry/regeneration once a completion is already committed; preserve edit and other confirmations.

## Decisions

- User-requested future direction: new submissions and completed continuations should flow into the story automatically without a separate Accept click.
- Edited turns and other confirmation workflows are outside the requested change.
- Only future capture/task recording is authorised here; no implementation is launched.

## Classification

Historical exploration; related product records contain approval and implementation boundaries.
