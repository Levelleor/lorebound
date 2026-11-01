---
type: architecture
status: review-open
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
tags:
  - planning/architecture
  - pass-c
  - slice-register
---

# Pass C — Implementation Slice Register

**Accepted register policy:** [C-D02 A](./decisions/C-D02%20-%20Traceable%20Slice%20Register%20With%20Original%20Idea%20Identity.md). This is a traceability and review register, **not** a production queue or evidence that code exists. Original 52 human-accepted IDEA files remain in staging; no new IDEA identities are created here.

## Status vocabulary

- `proposed`: Candidate implementation slice for Pass C review, **not approved**.
- `refining`: Explicitly selected design direction under further review, **not implementation-approved**.
- `reviewed-contract`: Specific slice requirements reviewed, but **does not mean** its original IDEA files were approved to production.
- `production-ready`: Only when the relevant **original staging IDEA file(s)** have separately received human readiness approval and have been moved to production; a slice does not confer this status automatically.
- Tests and host checks stay `NOT RUN` unless actually performed and evidenced.

## Initial candidates, not accepted implementation slices

| ID | Slice / player-observable boundary | Primary owners | Example accepted IDEA references | Dependencies / constraints | Status |
| --- | --- | --- | --- | --- | --- |
| **C-SL-01** | Basic adventure entry and one provisional → accepted story turn with deterministic reconstruction | S02, S03, S05, S06, S07, S12 | IDEA-0002, IDEA-0006, IDEA-0039, IDEA-0044, IDEA-0045, IDEA-0051 | [C-D01 A](./decisions/C-D01%20-%20First%20Mock%20Driven%20End%20to%20End%20Story%20Turn%20Slice.md); C-D04 A Story-mode first; C-D06 A minimal accepted history; **C-D05 C requires real Wails/Go/SQLite evidence before mock/domain story-loop acceptance criteria are finalised** | **proposed** |
| **C-SL-02** | Typed current-event/replay and Go commit contract foundation | S05, S06, S12 | IDEA-0039, IDEA-0042, IDEA-0044, IDEA-0051 | Versioned expected-head, epoch and idempotent transaction envelope; pure TS deterministic reducers; **no B9-D12 spatial migration** | **proposed** |
| **C-SL-03** | Provider/provisional attempt boundary and basic streaming/cancel | S07, S08, S06 | IDEA-0012, IDEA-0013, IDEA-0019, IDEA-0044, IDEA-0045 | Browser direct provider calls, mock-first tests; no mandatory live model, Go model proxy or automatic provider fallback | **proposed** |
| **C-SL-04** | Host bootstrap and real browser/Go storage feasibility | S01, S12 | IDEA-0051, IDEA-0053 | **C-D05 C makes real Wails/Go/SQLite proof a prerequisite to first story-loop mock/domain acceptance criteria**; the minimal host and SQLite checks are now accepted under C-D07 A/C-D08 A, but **NOT RUN**; development handoff is governed by C-D09 A and still needs separate approvals | **proposed** |
| **C-SL-05** | Draft, Undo/Retry/Fork and history-edit recovery | S03, S05, S06, S12 | IDEA-0003, IDEA-0004, IDEA-0039, IDEA-0041 | Accepted current-only narrative-first replay and original composer Commit rules | **proposed** |

**Register coverage:** Five entries are deliberately **starter candidates**, not an exhaustive mapping of 52 ideas. The full track-level coverage belongs to the [Pass C kickoff](./Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md), and all 52 original IDEA primary owners remain in the [Subsystem Mapping Register](./Subsystem%20Mapping%20Register.md). Add or refine entries only as the review reaches them.

## Required packet for a reviewed slice

Stable slice label; existing IDEA IDs and original note paths; B1–B9/C ADR links; subsystem authority; observable boundary; typed input/output and draft/canon semantics; dependencies/non-goals; normal and failure/retry/history cases; objectively checkable acceptance criteria; planned mock/unit/contract tests with `NOT RUN` label; separate host feasibility as applicable; exact user approval and explicitly separate staging → production decision.

## Batch 1 accepted decisions (not slice acceptance)

- [C-D01 A](./decisions/C-D01%20-%20First%20Mock%20Driven%20End%20to%20End%20Story%20Turn%20Slice.md): prioriti​se minimal mocked complete story turn as a review target.
- [C-D02 A](./decisions/C-D02%20-%20Traceable%20Slice%20Register%20With%20Original%20Idea%20Identity.md): register with preserved `IDEA-` identities.
- [C-D03 A](./decisions/C-D03%20-%20Mocked%20Contract%20Criteria%20With%20Separate%20Real%20Host%20Gates.md): planned mock/unit/contract criteria, separate real-host feasibility gates, no invented test passes.

**No slice itself, production promotion, code, tests or implemented spec was accepted by these three decisions.**

## Batch 2 explicitly accepted

- [C-D04 A](./decisions/C-D04%20-%20Story%20Mode%20First%20Complete%20Turn.md): Story mode is the first integrated action; others later.
- [C-D05 C](./decisions/C-D05%20-%20Real%20Wails%20Go%20SQLite%20Integration%20Prerequisite.md): **real Wails headless Go and SQLite integration must be demonstrated before defining first-loop mocked/domain acceptance criteria**. Contrary to proposed mock-first order, but C-D01/C-D03 end goals remain.
- [C-D06 A](./decisions/C-D06%20-%20Minimal%20Versioned%20Accepted%20Story%20History%20Payload.md): stable adventure/passages, accepted text and typed ordered events; empty effects allowed. Detailed mock criteria await host gate.

These are design decisions, not acceptance of any C-SL entry or an instruction to write code.

## Batch 3 explicitly accepted: host-proof gate and prompt software-development handoff

- [C-D07 A](./decisions/C-D07%20-%20Minimal%20Real%20Wails%20Browser%20Go%20Host%20Exchange.md): smallest **real** Wails v3 headless Go startup, browser connection and typed request/response, then SQLite. **NOT RUN**.
- [C-D08 A](./decisions/C-D08%20-%20Real%20SQLite%20Versioned%20Commit%20Rollback%20and%20Reopen%20Proof.md): **real** isolated Go SQLite versioned/idempotent write/readback, failure rollback and restart/reopen durability. **NOT RUN**.
- [C-D09 A](./decisions/C-D09%20-%20Evidence%20Based%20Host%20Gate%20and%20Immediate%20Development%20Handoff.md): evaluate **actual** evidence and promptly submit the **separate minimal development-readiness and staging→production promotion request**, rather than prolonging speculative planning. **No promotion or implementation authorised by this decision alone**.

**User delivery priority, 2026-11-01:** “as soon as we verify any uncertainties we start actually implementing the final software. this round is just meant to close our questinable gaps before we start full in development”. Pass C should focus on genuinely blocking uncertainties. Begin incremental **final-product** implementation following the separate required approval, not a throwaway mock application or full-all-features-at-once attempt.

**Dependency order:** Real host/browser service check + Go SQLite transaction evidence (C-SL-04, **NOT RUN**) → separate readiness/development authorisation → refine Story-mode acceptance criteria and mock tests for C-SL-01 under C-D05 C → implement the final product iteratively. Nothing in this register is an implementation authorisation.

## Batch 4 proposed, NOT approved

- **C-D10:** Limit pre-development delay to documented material blocking uncertainties, rather than speculative future design.
- **C-D11:** Consider reusable production-intended real host feasibility work rather than mandatory throwaway prototypes, **only after separately authorised implementation**.
- **C-D12:** Define the focused development kickoff/explicit original-IDEA promotion approval when material evidence is ready. **This C-D12 is not B9-D12 spatial migration.**

All three are proposals, not accepted slice contracts or automatic promotions.

## Deferred design scope

B9-D12 remains deferred: **no spatial schema/event migration work**. B9-D13 B and D24 revised B remain accepted. Original Pass A/B approvals and chronology are preserved.
