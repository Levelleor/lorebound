---
id: "IDEA-0069"
type: idea
status: candidate
origin: user
created: "2026-11-14"
updated: "2026-11-14"
source_brainstorms:
  - "[[Automatic Acceptance of New Turns Brainstorm]]"
related:
  - "[[Freeform Player Action Modes]]"
  - "[[Retry Undo and Alternative Continuations]]"
  - "[[Streaming Cancellation and Generation Diagnostics]]"
tags:
  - planning/idea
  - planning/interaction
  - future-task
---

# Automatic Acceptance of New Turns

## Idea

Remove the repeated Accept turn step for newly submitted messages and their completed continuations. The user wants a more chat-like flow where submission leads into the story and the completion feeds into it automatically, citing AI Dungeon and NovelAI as the intended experience. These are user-supplied analogies, not researched compatibility claims.

This request explicitly excludes **edited turns and other operations**: keep their separate confirmation workflows. Record this as future work; do not implement it in the diagnostics closure.

## Why consider it?

During the PR #24 review, the user found repeated approval of new submitted turns frustrating. Actual `StoryCoordinator.prepareCandidate` currently waits in ready state and `StoryWorkspace.svelte` requires Accept turn before the coordinator's separate `accept` commit. [DEV-004D](../development/requirements/DEV-004D.md) only adds diagnostics; it does not change this behavior.

## Rough behaviour

- **User-requested:** newly submitted messages and completed continuations enter the story without a separate Accept click each time.
- **User-excluded:** edited turns and other operations keep their existing confirmation behavior. This is not a request to remove all application or development/merge approvals.
- **Existing integrity constraints to preserve during refinement:** technical validation, coherent atomic prose/events, version/epoch/idempotency checks, redacted failures and abandonment of incomplete/cancelled model output remain necessary.
- Keep this as a future task until refined and separately approved for implementation readiness and launch.

## Variations and alternatives

The user requested removal of repeated new-turn acceptance, rather than merely restyling the button. Whether player input becomes durable at submission or together with its validated completion remains unresolved; neither choice is inferred here. No optional-review toggle or broader confirmation removal has been selected.

## Open questions and risks

- When is player-authored input committed relative to generation, and what survives a provider failure or Stop?
- How should Retry/regeneration work after a new completion is already committed, while edits and other confirmations remain unchanged?
- How will automatic commit recover uncertain writes without duplicate turns or accepting late output after cancellation/navigation?
- Which current confirmation requirements and UI tests need a later explicit superseding decision? Preserve C-D04’s canonical atomic transaction boundary while removing the extra new-turn UI confirmation.

## Evaluation notes

User-origin request from the PR #24 hands-on/closure discussion. The user approved closing diagnostics and requested recording this future behavior separately. [The active brainstorm](../brainstorming/Automatic%20Acceptance%20of%20New%20Turns%20Brainstorm.md) owns exploration; [TASKS](../development/TASKS.md#future-requested-work-not-launched) links the future request. Existing accepted ADRs, original IDEA histories and current application behavior remain unchanged. No feature completion, staging acceptance, production readiness or execution authority is inferred from capturing the task.

## Decision history

- **2026-11-14 — User request:** “I want to add a task for future to remove this behavior and just autoaccept turns that were submitted new.” Explicitly excluded edited turns and other operations and asked for completions to feed into the story in a more chat-like flow.
- **2026-11-14 — Capture:** Recorded as user-origin IDEA-0069 in Inbox and linked future requested work, preserving the narrower scope. Candidate remains unaccepted; no implementation is launched. The separate approval to close PR #24 governs only that diagnostics task.
