---
type: architecture-decision
status: accepted
decision_id: "C-D10"
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit Pass C Batch 4 Option A)"
tags:
  - planning/architecture
  - pass-c
  - architecture-decision
---

# C-D10 — Resolve only material blockers before developing the final software

## Explicit approval

The user explicitly selected **C-D10 A, C-D11 A, C-D12 A** in Pass C Batch 4, adding: **“I'd like to proceed to closing any dependencies as early as possible and starting actual implementation. Seems like our planning is taking pretty long that deadlines are pressing.”** In the same message, the user instructed: **“Do not implement code, run tests or promote staging ideas in this review.”**

**ACCEPTED: Option A.** Use a **short evidence-backed material-blocker list** rather than attempt to settle every potential later implementation detail. Delay a specific slice only for an unresolved uncertainty that could materially undermine the selected runtime, canonical data integrity, safety of the technical service boundary, or the first complete story turn. If a concern is verified, safely bounded or explicitly classified as nonblocking for the immediate slice, **do not prolong Pass C by reopening already accepted B1–B9 design contracts**.

This explicitly implements the user's urgency condition: **close dependencies as early as possible**. Treat as material for the immediate Gate 0 the real Wails v3 headless browser/Go service and actual Go SQLite transactional durability evidence under [C-D05 C](./C-D05%20-%20Real%20Wails%20Go%20SQLite%20Integration%20Prerequisite.md), [C-D07 A](./C-D07%20-%20Minimal%20Real%20Wails%20Browser%20Go%20Host%20Exchange.md) and [C-D08 A](./C-D08%20-%20Real%20SQLite%20Versioned%20Commit%20Rollback%20and%20Reopen%20Proof.md). Other concerns should be noted, not automatically treated as blockers for unrelated slices.

**No silent shortcut:** C-D10 A does not mean ignoring genuine failures, claiming a mock demonstrates a real host, or dismissing missing evidence. It does not authorise executing checks in this review. The actual blockers are **NOT YET VERIFIED**.

## Unselected alternatives and limits

- **A accepted:** Resolve the minimum genuinely consequential blockers and move toward development.
- **B not accepted:** Finish every possible UI/plugin/provider/performance design question before coding.
- **C not accepted:** Ignore genuine critical host/storage risks.

[Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md) retains the original proposed choices. No application code, tests, staging promotion or implemented specs are approved by this decision. Deferred B9-D12 spatial migrations remain out of scope.
