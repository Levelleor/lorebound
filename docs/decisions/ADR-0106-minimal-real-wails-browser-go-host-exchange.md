---
id: ADR-0106
type: adr
status: accepted
related:
- ADR-0107
- ADR-0108
- ADR-0104
- NOTE-0003
- ADR-0100
supersedes: []
---

# Minimal Real Wails Browser Go Host Exchange

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source C-D07](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/C-D07%20-%20Minimal%20Real%20Wails%20Browser%20Go%20Host%20Exchange.md) · approved at: 2026-11-01; approved by: requesting user (explicit Pass C Batch 3 choice)

## Explicit approval and accepted contract

User explicitly selected C-D07 A, C-D08 A and C-D09 A in Pass C Batch 3, and added: “i want to make sure as soon as we verify any uncertainties we start actually implementing the final software. this round is just meant to close our questinable gaps before we start full in development”. The same instruction prohibits code, tests and staging promotion in this review.

**ACCEPTED: Option A.** Establish the smallest meaningful **real Wails v3 headless Go process startup**, ordinary browser-side SvelteKit client connectivity and one narrow typed service request/response. Record actual request/result, startup and connectivity/transport limitations. Once that works, proceed to the real SQLite transaction checks accepted under [C-D08 A](ADR-0107-real-sqlite-versioned-commit-rollback-and-reopen-proof.md). Neither a generated API binding, sample code, browser-only mock, simulated host nor product documentation alone is evidence that the host ran successfully.

**Gate relation:** [C-D05 C](ADR-0104-real-wails-go-sqlite-integration-prerequisite.md) makes real host/SQLite integration a prerequisite before first-loop mocked/domain criteria are finalised. This design-only ADR narrows the eventual feasibility work to the minimum sufficient host check; it does **not** authorise performing that work in this review.

**Not required for this check:** full AI pipelines, real AI provider calls, character/world mechanics, inventory, complex map or completed Story-mode loop. Do not implement deferred B9-D12 spatial migrations.

**Evidence:** Mark checks **NOT RUN** until executed; when run, retain actual environment, version, invocation, response/error and limitations. A failed check identifies a blocker to resolve, not grounds for substituting mock evidence.

**Original alternatives:** B (complete product before host exchange) and C (simulated host counts as verified) were not accepted.

## Historical scope and limits

The original A/B/C alternatives and the prior C-D01–D06 acceptances are preserved in the [Pass C kickoff](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md). C-D05 C's real-host-first prerequisite remains binding, as do B9-D12's deferred spatial migrations and the separate stage-promotion process. **No code, tests, migrations, staging promotion, production-ready slice or verified real-host evidence was created by accepting this decision.**
