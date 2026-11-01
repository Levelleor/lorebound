---
type: architecture-decision
status: accepted
decision_id: "C-D09"
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

# C-D09 — Evidence-based host gate and prompt transition to final development

## Explicit approval and accepted contract

User explicitly selected C-D07 A, C-D08 A and C-D09 A in Pass C Batch 3, and added: “i want to make sure as soon as we verify any uncertainties we start actually implementing the final software. this round is just meant to close our questinable gaps before we start full in development”. The same instruction prohibits code, tests and staging promotion in this review.

**ACCEPTED: Option A, with the user's explicit delivery-speed condition.** Treat the real-host integration prerequisite as met **only after actual observed and documented Wails/Go/browser and SQLite evidence** under C-D07/C-D08. Then promptly bring forward the **separate implementation-readiness and staging→production review** for the smallest complete Story-mode story-loop slice, retaining typed event/version contracts and mock-based domain tests. **Do not turn Pass C into an indefinite architecture discussion after material uncertainties are verified.**

**User delivery intent:** The purpose of this round is **closing questionable technical gaps immediately before full development**. Once the remaining material *blocking* uncertainties have evidence or a consciously approved bounded resolution, prefer **transition into implementation of the final software** over speculative refinements, complex prototypes or new long planning phases. This is a priority and handoff instruction, **not** permission to implement during this Batch 3 review.

**Gate sequencing without contradiction:** C-D05 C means verify real host/SQLite integration **before finalising story-loop mock/domain acceptance criteria**. C-D01 A and C-D03 A still favour a complete story loop and mocked tests after that prerequisite. Immediately after real evidence, present a concise readiness packet: verified findings and remaining blockers; proposed first development slices; affected original staged IDEA files; minimal acceptance criteria; and **explicit requests for authorisation to promote relevant original staging notes and implement application code**. Do not wait for the entire 52-idea catalogue to be fully designed or implemented before proposing the first development approval.

**No automatic promotions:** This selection is **not itself** approval to move ideas into production, create implemented specs, start host/source implementation, run checks, or accept any unverified result. The separate promotion gate remains as established by C-D02 and planning rules. If a material blocker persists, surface it clearly and only resolve that blocker before repeating the readiness assessment.

**Original alternatives:** B (auto-promote all related ideas merely after a ping) and C (wait for full product before revisiting the story slice) were not accepted.

## Historical scope and limits

The original A/B/C alternatives and the prior C-D01–D06 acceptances are preserved in the [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md). C-D05 C's real-host-first prerequisite remains binding, as do B9-D12's deferred spatial migrations and the separate stage-promotion process. **No code, tests, migrations, staging promotion, production-ready slice or verified real-host evidence was created by accepting this decision.**
