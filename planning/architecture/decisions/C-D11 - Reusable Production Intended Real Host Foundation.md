---
type: architecture-decision
status: accepted
decision_id: "C-D11"
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

# C-D11 — Build a reusable production-intended host foundation, not a throwaway prototype

## Explicit approval

The user explicitly selected **C-D10 A, C-D11 A, C-D12 A** in Pass C Batch 4, adding: **“I'd like to proceed to closing any dependencies as early as possible and starting actual implementation. Seems like our planning is taking pretty long that deadlines are pressing.”** In the same message, the user instructed: **“Do not implement code, run tests or promote staging ideas in this review.”**

**ACCEPTED: Option A.** **After separate approval to implement**, make the minimum real Wails v3 headless Go/browser and Go-owned SQLite verification foundation **part of the intended final product** wherever technically sound. Use appropriately narrow, maintainable service and transaction boundaries and the accepted architecture so proven work can be extended directly into the Story-mode application. Only create a disposable spike if an uncertainty cannot be tested adequately within the real application foundation; record exactly why it must be discarded.

The order remains [C-D05 C](./C-D05%20-%20Real%20Wails%20Go%20SQLite%20Integration%20Prerequisite.md): verify actual host and SQLite before finalising first story-loop mocked/domain acceptance criteria. [C-D07 A](./C-D07%20-%20Minimal%20Real%20Wails%20Browser%20Go%20Host%20Exchange.md) and [C-D08 A](./C-D08%20-%20Real%20SQLite%20Versioned%20Commit%20Rollback%20and%20Reopen%20Proof.md) define narrow evidence. Production-intended means **reusable design intent**, not production-released or verified runtime.

**Limit the initial build:** Only the host/client exchange and isolated atomic SQLite contract demonstration needed to close current blockers; not full story modes, map, lore, credentials, all world schemas or deferred B9-D12 spatial migrations. Preserve browser-owned direct AI HTTP, TS domain authority and Go technical storage authority.

## Unselected alternatives and limits

- **A accepted:** A reusable minimal real host/storage foundation once development is authorised.
- **B not accepted:** Automatically throw away a successful feasibility foundation and rewrite it.
- **C not accepted:** Implement every staged feature before checking the host.

[Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md) preserves original alternatives. This ADR is **not itself permission to create application code or run feasibility tests in the current review**, nor approval to move IDEA notes into production.
