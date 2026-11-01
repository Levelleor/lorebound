---
type: architecture-decision
status: accepted
decision_id: "C-D07"
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

# C-D07 — Minimal real Wails/browser/Go integration evidence first

## Explicit approval and accepted contract

User explicitly selected C-D07 A, C-D08 A and C-D09 A in Pass C Batch 3, and added: “i want to make sure as soon as we verify any uncertainties we start actually implementing the final software. this round is just meant to close our questinable gaps before we start full in development”. The same instruction prohibits code, tests and staging promotion in this review.

**ACCEPTED: Option A.** Establish the smallest meaningful **real Wails v3 headless Go process startup**, ordinary browser-side SvelteKit client connectivity and one narrow typed service request/response. Record actual request/result, startup and connectivity/transport limitations. Once that works, proceed to the real SQLite transaction checks accepted under [C-D08 A](./C-D08%20-%20Real%20SQLite%20Versioned%20Commit%20Rollback%20and%20Reopen%20Proof.md). Neither a generated API binding, sample code, browser-only mock, simulated host nor product documentation alone is evidence that the host ran successfully.

**Gate relation:** [C-D05 C](./C-D05%20-%20Real%20Wails%20Go%20SQLite%20Integration%20Prerequisite.md) makes real host/SQLite integration a prerequisite before first-loop mocked/domain criteria are finalised. This design-only ADR narrows the eventual feasibility work to the minimum sufficient host check; it does **not** authorise performing that work in this review.

**Not required for this check:** full AI pipelines, real AI provider calls, character/world mechanics, inventory, complex map or completed Story-mode loop. Do not implement deferred B9-D12 spatial migrations.

**Evidence:** Mark checks **NOT RUN** until executed; when run, retain actual environment, version, invocation, response/error and limitations. A failed check identifies a blocker to resolve, not grounds for substituting mock evidence.

**Original alternatives:** B (complete product before host exchange) and C (simulated host counts as verified) were not accepted.

## Historical scope and limits

The original A/B/C alternatives and the prior C-D01–D06 acceptances are preserved in the [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md). C-D05 C's real-host-first prerequisite remains binding, as do B9-D12's deferred spatial migrations and the separate stage-promotion process. **No code, tests, migrations, staging promotion, production-ready slice or verified real-host evidence was created by accepting this decision.**
