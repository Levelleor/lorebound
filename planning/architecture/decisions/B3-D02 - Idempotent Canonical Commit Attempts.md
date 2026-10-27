---
type: architecture-decision
status: accepted
decision_id: "B3-D02"
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

# B3-D02 — Idempotent canonical commit attempts

## Approval and provenance

**Accepted Option A by the requesting user on 2026-10-27:** `B3-D02: A` in the explicit B3 Batch 1 decision message. B3-D01 and B3-D03 were separately accepted in the same reply. This ADR records only D02; no implementation, integration testing or approval of later options is implied.

## Context

Go may durably commit a canonical operation but its browser caller may time out or lose the response. Retrying without a durable attempt identity can duplicate a story turn, manual correction or history-selection change. Optimistic adventure version checks protect against stale writes but alone cannot reliably tell a client whether *its own* prior attempt succeeded.

## Accepted decision — Option A

**Each logical prepared canonical commit has a unique, client-generated, adventure-scoped operation/attempt ID, durably associated with its immutable prepared request and the accepted result.**

- Successful Go/SQLite commit atomically records an idempotency receipt with the canonical change. The receipt identifies the same logical request and its committed result.
- **Same operation ID + identical immutable prepared payload:** A repeated request resolves to the **original committed result**, without applying the change again. The receipt is not a second canonical commit.
- **Same operation ID + different payload:** Reject as operation-identity misuse; never silently substitute a new passage/event/selection under a reused ID.
- **New operation ID + stale expected adventure version or library epoch:** Reject without canonical mutation. No automatic merge, history overwrite or silent regeneration.
- **Uncertain network outcome:** Client queries/refetches authoritative commit status/adventure version; if retrying, it retries the **same unchanged prepared request** only when safe, not a freshly generated second turn with a different identity.
- **Go checks** expected adventure version, server-verified library epoch and maintenance fencing atomically for new writes. A receipt for an already committed request is not permission to create a new write during maintenance or after restoring a different library generation. Details of receipt lookup and epoch scoping remain engineering work.
- A cancelled/abandoned generation candidate cannot silently become an accepted new turn through late model output. Once a commit is already durable, cancellation does **not** roll it back; ordinary committed Undo is a separate canonical action.
- This is **storage-level idempotency**, not a new user-facing alternate-continuation, AI retry history, exclusive editing lock or account/session feature.

## Alternatives considered

1. **A — Accepted:** Durable operation identity and original-result receipts. Additional storage/protocol complexity buys safe retries and clear outcome resolution.
2. **B — Rejected:** Optimistic version checking alone. May reject duplicates but does not reliably disambiguate a lost success response.
3. **C — Rejected:** Exclusive one-tab adventure lock. Conflicts with accepted multi-tab editing and still cannot eliminate all uncertain outcomes.

## Deferred engineering details

Exact request fingerprint/canonical serialization, uniqueness constraints, receipt retention/pruning policy, status query, safe retry procedure, library-restore epoch behaviour, in-flight cancellation ordering and test fixtures remain for B3 contract refinement. **Do not infer a specific TTL or promise that an abandoned in-flight request can be forcibly undone.** No code or testing is claimed.

## Traceability

[B3 Batch 1 proposal](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md); [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md), [B1-D03](./B1-D03%20-%20Gameplay%20and%20Durable%20Commit%20Authority.md), [B1-D04](./B1-D04%20-%20Cross-Tab%20Invalidation%20and%20Refetch.md), [B2-D01](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md). Owners S05, S06, S12, S01.

## Decision history

- **2026-10-27 — Proposed, unapproved:** B3 Batch 1 presented Option A (durable idempotent operation IDs), B (version checks alone) and C (single-tab lock).
- **2026-10-27 — Explicit approval:** User selected **B3-D02: A**. No receipt TTL, API shape, code, Batch 2 decision or staging promotion was approved.
