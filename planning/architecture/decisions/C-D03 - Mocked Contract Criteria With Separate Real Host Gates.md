---
type: architecture-decision
status: accepted
decision_id: "C-D03"
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit Pass C Batch 1 Option A)"
tags:
  - planning/architecture
  - pass-c
  - slice-refinement
  - architecture-decision
---

# C-D03 — Use mock-based acceptance criteria without misrepresenting host evidence

## User approval

**Explicit user choice (2026-11-01):** “Pass C Batch 1 review: C-D01: A; C-D02: A; C-D03: A. Record only explicitly approved Pass C decisions in Lorebound GitHub, preserve prior architecture and staging approvals, do not promote ideas or implement code, and continue reviewing Pass C in batches of three.”

**ACCEPTED: Option A.** For each proposed implementation slice, define **pure logic, mocked external-boundary and contract-test acceptance criteria**, covering normal behaviour, failures, retries, concurrency and history changes as applicable. Mark every proposed or unexecuted test **NOT RUN**. Keep separate later evidence gates for real Wails v3 headless Go, SQLite storage, browser runtime/provider constraints and relevant OS/security/backup operations, without requiring live-model scenario suites to complete Pass C refinement.

## Binding scope and safeguards

1. **Mocks do not establish durable host integration:** A mock Go-style adapter may demonstrate structural contracts and coordinator behaviour, not database durability, cross-tab correctness in the actual host or Wails startup.
2. **Future evidence matrix:** Distinguish `planned/not run`, `mocked test passed/failed` (only after execution), and `real host/browser/SQLite verified` (only after actual execution). If a test has not run, claim nothing about success.
3. **Failure coverage:** Expected-version/library epoch/idempotency errors, provider CORS/cancellation, deferred drafts, Undo/Fork/history replay, and transaction rollback should be addressed by the slices that own them, not all force-fit into the first tiny story-loop slice.
4. **No accidental new runtime requirement:** B9-D03 B and B9-D06 A remain the accepted mock-testing approach and require truthful reporting. Separate host feasibility checks are not cancelled; live AI model scenarios are **not mandatory** for architectural refinement or basic mocked contract coverage.
5. **Approval gates:** Design/test cases are not executed tests or implementation permission. Do not promote staging ideas or create specs from test plans.

## Alternatives and chronology

- **A accepted:** Mock/unit/contract criteria per slice, honest labels and separate real-host feasibility/integration evidence gates.
- **B not selected:** Treat successful mock tests as proof real Wails/SQLite/browser/provider integration worked.
- **C not selected:** Require actual live AI model scenario suites before a slice can even be planned.

- **2026-11-01:** Accepted as **Pass C Batch 1 Option A**. The other alternatives were not approved. This is planning-refinement authority, not permission to create application code, promote original staging ideas, create implemented specs or claim tests ran.
- The [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md) and [slice register](../Pass%20C%20-%20Implementation%20Slice%20Register.md) retain current review status and cross-references. Earlier Pass A/B architectural acceptances and their historical overrides remain in force.
