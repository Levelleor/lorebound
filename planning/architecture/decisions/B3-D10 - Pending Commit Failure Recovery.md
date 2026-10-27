---
type: architecture-decision
status: accepted
decision_id: "B3-D10"
phase: "B3"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - transaction-contracts
  - architecture-decision
---

# B3-D10 — Pending commit rejection, uncertain outcome and recovery

## Approval and provenance

**Explicitly accepted Option A on 2026-10-27** in the user message: “Review B3 Batch 3: B3-D08: A; B3-D09: A; B3-D10: A. Record only accepted decisions in Lorebound GitHub ADRs, preserve approval history, then assess B3 closure.”

This ADR records **only B3-D10 Option A**. The approved proposal was presented in the [B3 review document](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md).

## Context

An explicit pending manual correction Commit can fail due to invalid world-state dependencies, a stale adventure version, global maintenance, or transport timeout. Automatically discarding player edits would lose work. Blindly retrying/rebasing could mutate unintended canon or duplicate accepted events. [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D05](./B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md), and [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) establish the required guards.

## Accepted decision — Option A

**Retain pending edits and the blocking chat-composer overlay during failed, rejected or uncertain approval until the player deliberately resolves the proposal or its prior commit is confirmed.**

- **Validation/structural failure:** Display an actionable error identifying the invalid change or constraint; preserve the pending draft and allow the player to edit it, try a fresh validated Commit or Discard. Do not mutate canonical world state.
- **Stale adventure version/library epoch:** Refetch current authoritative state/version/epoch; show what became stale; require player review and intentional re-preparation/reapplication of relevant changes before a **new** Commit. No automatic merge or rebasing, and no stale deletion of newly committed turns.
- **Uncertain transport/timeout:** Do **not** label the operation failed, committed or safe to retry merely because its response was lost. Resolve by querying/refetching Go's durable status using the original [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md) operation ID and payload. If safe to resubmit, reuse the **same immutable prepared request/ID**, not a new or regenerated correction. A confirmed success clears the pending set and updates the canonical view; an unresolved outcome keeps the overlay and proposal in place.
- **Discard:** When no prior commit outcome remains unresolved, explicit Discard clears the noncanonical pending change set without changing canon. If a Commit may already have succeeded, Discard cannot roll back that durable transaction; the system must first resolve the result or explain the appropriate separately accepted Undo process. No misleading “discard undoes commit” guarantee.
- **Overlay:** [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) covers the whole composer and prevents typing/submitting while the change set is still pending, rejected or uncertain; approved success or deliberate safe Discard releases the block. Failed validation must not dismiss it automatically.
- **Preservation:** The proposal remains noncanonical, persisted as [B3-D08](./B3-D08%20-%20Persistent%20Noncanonical%20Pending%20Change%20Sets.md) directs. Do not silently discard or convert a pending draft into a new accepted event through error-handling automation.
- **Scope:** The rule applies to the pending-commit workflows already covered by the shared D07 overlay, with any workflow-specific choices preserved (e.g., historical Keep Later Turns/Delete All After Point). It does not create an extra approval gate for ordinary already-accepted automatic finalisation.

## Alternatives considered

1. **Option A — accepted:** Keep pending work and require transparent, deliberate recovery. Higher UI/error-handling work, no silent player-data loss, unvalidated writes or duplicate commits.
2. **Option B — rejected:** Clear all pending changes whenever Commit fails. Simpler but destroys work.
3. **Option C — rejected:** Automatically rebase or resubmit a stale/failed change against new canon. Bypasses the accepted fresh-decision and expected-version contract.

## Deferred details and trade-offs

Concrete typed error/result enums, operation-status API, maintenance progress display, how to settle an indeterminate request if its status cannot be fetched, overlap of concurrent tabs, accessible focus/announcement and exact persistence cleanup timing are still engineering/UI work. All implementations must preserve atomicity, player-origin replay events and library isolation; no code or tests are claimed.

## Traceability

[B3 review](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md), [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D05](./B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md), [B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md), [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md), [B3-D08](./B3-D08%20-%20Persistent%20Noncanonical%20Pending%20Change%20Sets.md). Owners S04, S05, S06, S12.

## Decision history

- **2026-10-27 — Originally unapproved Batch 3:** Presented A (preserve pending proposal/error UI), B (discard on failure), and C (auto-rebase/resubmit).
- **2026-10-27 — Explicit approval:** User selected **B3-D10: A**. Approval includes validation errors, stale-version rejection, and lost-response resolution through durable operation IDs; no B3 closure approval or implementation is implied.
