---
type: architecture-decision
status: accepted
decision_id: "C-D08"
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit Pass C Batch 3 choice)"
tags:
  - planning/architecture
  - pass-c
  - architecture-decision
---

# C-D08 — Real Go-owned SQLite transaction and durability demonstration

## Explicit approval and accepted contract

User explicitly selected C-D07 A, C-D08 A and C-D09 A in Pass C Batch 3, and added: “i want to make sure as soon as we verify any uncertainties we start actually implementing the final software. this round is just meant to close our questinable gaps before we start full in development”. The same instruction prohibits code, tests and staging promotion in this review.

**ACCEPTED: Option A.** Use an isolated disposable test library/database under the **actual Go-owned SQLite integration** to demonstrate a supported **versioned, idempotent atomic write**, readback, deliberate failure with no partial persisted changes and durability after closing and reopening the database/host. Capture actual results and errors, not assumptions. The technical envelope should exercise expected adventure version, library epoch and operation identity as applicable to the minimum supported contract; detailed schema/SQL implementation is not decided by this ADR.

**Relation to C-D05 and D07:** A successful file open, mock, isolated SQL statement unrelated to the Go service contract or compilation alone **does not satisfy** the real-integration prerequisite. C-D07's host/browser-Go service exchange and this real transaction demonstration together establish the minimum *candidate evidence package*, subject to review under [C-D09 A](./C-D09%20-%20Evidence Based Host Gate and Immediate Development Handoff.md).

**Isolation and restrictions:** No production adventure/library data, no migrations of spatial events/schemas under deferred B9-D12, no compulsory full lore/inventory/world/map schema and no live-model calls. The test data and transaction scope can be intentionally minimal.

**Evidence label:** **NOT RUN** until actual execution. Verify independently failure/rollback, readback and reopen persistence; record attempted operations, observations, failures and known platform gaps.

**Original alternatives:** B (successful SQLite file open alone) and C (full world schema integrated before any transaction check) were not accepted.

## Historical scope and limits

The original A/B/C alternatives and the prior C-D01–D06 acceptances are preserved in the [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md). C-D05 C's real-host-first prerequisite remains binding, as do B9-D12's deferred spatial migrations and the separate stage-promotion process. **No code, tests, migrations, staging promotion, production-ready slice or verified real-host evidence was created by accepting this decision.**
