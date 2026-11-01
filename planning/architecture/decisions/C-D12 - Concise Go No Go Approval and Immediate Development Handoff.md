---
type: architecture-decision
status: accepted
decision_id: "C-D12"
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

# C-D12 — One concise readiness gate, then start final software development

## Explicit approval

The user explicitly selected **C-D10 A, C-D11 A, C-D12 A** in Pass C Batch 4, adding: **“I'd like to proceed to closing any dependencies as early as possible and starting actual implementation. Seems like our planning is taking pretty long that deadlines are pressing.”** In the same message, the user instructed: **“Do not implement code, run tests or promote staging ideas in this review.”**

**ACCEPTED: Option A.** After material host/storage risks have been verified and reviewed, bring forward **one concise go/no-go implementation-readiness packet** showing verified evidence, any remaining truly blocking issues, the smallest next final-software slices, and **the exact original staging IDEA notes** proposed for implementation-ready promotion. Obtain **separate explicit human approval** for each requested staging→production movement and the actual development start, then **begin incremental development promptly**. Do not insist on an additional lengthy architecture round, a rewrite of a throwaway prototype, or complete up-front design of all 52 accepted ideas.

### Practical near-term dependency

To meet [C-D05 C](./C-D05%20-%20Real%20Wails%20Go%20SQLite%20Integration%20Prerequisite.md) promptly, the next step is a **separate, narrow execution/promotion authorisation**, because actual Wails/Go/browser and SQLite integration **cannot be verified without building and running some real code**. The initial proposed candidates are existing **IDEA-0053** (`planning/staging/Localhost Startup and Offline Mode.md`) and **IDEA-0051** (`planning/staging/Browser-Persistent Story Database.md`), only for the minimum host/storage foundation and technical checks. Neither is promoted by this ADR, and the remaining 50 staged ideas stay unchanged. The scope packet is [Pass C Gate 0 proposed handoff](../Pass%20C%20-%20Gate%200%20Host%20Verification%20Authorisation%20Packet%20%28Proposed%29.md).

Once real evidence is available, report **PASS/FAIL/NOT RUN** honestly, address any material failure and seek the narrowest approval needed to continue the Story-mode first slice. Do not misrepresent planning acceptance as a tested implementation.

## Unselected alternatives and limits

- **A accepted:** Focused human approval, then prompt iterative final-software development.
- **B not accepted:** Promote all 52 ideas automatically after a single service ping.
- **C not accepted:** Continue indefinite planning after genuine prerequisites are satisfied.

**Critical naming distinction:** **C-D12** is this accepted development-handoff decision; **B9-D12** is an *unrelated deferred spatial migration decision*. **No spatial migration work is authorised.** The first-IDEA promotion and execution permissions remain pending, **not implied** by the user's acceptance of C-D12. Original alternatives remain in the [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md).
