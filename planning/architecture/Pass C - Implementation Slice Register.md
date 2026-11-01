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
| **C-SL-01** | Basic adventure entry and one provisional → accepted story turn with deterministic reconstruction | S02, S03, S05, S06, S07, S12 | IDEA-0002, IDEA-0006, IDEA-0039, IDEA-0044, IDEA-0045, IDEA-0051 | [C-D01 A](./decisions/C-D01%20-%20First%20Mock%20Driven%20End%20to%20End%20Story%20Turn%20Slice.md); selected initial mode, minimal event subset, adapter detail remain C-D04–D06 proposals | **proposed** |
| **C-SL-02** | Typed current-event/replay and Go commit contract foundation | S05, S06, S12 | IDEA-0039, IDEA-0042, IDEA-0044, IDEA-0051 | Versioned expected-head, epoch and idempotent transaction envelope; pure TS deterministic reducers; **no B9-D12 spatial migration** | **proposed** |
| **C-SL-03** | Provider/provisional attempt boundary and basic streaming/cancel | S07, S08, S06 | IDEA-0012, IDEA-0013, IDEA-0019, IDEA-0044, IDEA-0045 | Browser direct provider calls, mock-first tests; no mandatory live model, Go model proxy or automatic provider fallback | **proposed** |
| **C-SL-04** | Host bootstrap and real browser/Go storage feasibility | S01, S12 | IDEA-0051, IDEA-0053 | Separate real-host evidence gate. Mock tests are not Wails/SQLite proof; no code has run | **proposed** |
| **C-SL-05** | Draft, Undo/Retry/Fork and history-edit recovery | S03, S05, S06, S12 | IDEA-0003, IDEA-0004, IDEA-0039, IDEA-0041 | Accepted current-only narrative-first replay and original composer Commit rules | **proposed** |

**Register coverage:** Five entries are deliberately **starter candidates**, not an exhaustive mapping of 52 ideas. The full track-level coverage belongs to the [Pass C kickoff](./Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md), and all 52 original IDEA primary owners remain in the [Subsystem Mapping Register](./Subsystem%20Mapping%20Register.md). Add or refine entries only as the review reaches them.

## Required packet for a reviewed slice

Stable slice label; existing IDEA IDs and original note paths; B1–B9/C ADR links; subsystem authority; observable boundary; typed input/output and draft/canon semantics; dependencies/non-goals; normal and failure/retry/history cases; objectively checkable acceptance criteria; planned mock/unit/contract tests with `NOT RUN` label; separate host feasibility as applicable; exact user approval and explicitly separate staging → production decision.

## Batch 1 accepted decisions (not slice acceptance)

- [C-D01 A](./decisions/C-D01%20-%20First%20Mock%20Driven%20End%20to%20End%20Story%20Turn%20Slice.md): prioriti​se minimal mocked complete story turn as a review target.
- [C-D02 A](./decisions/C-D02%20-%20Traceable%20Slice%20Register%20With%20Original%20Idea%20Identity.md): register with preserved `IDEA-` identities.
- [C-D03 A](./decisions/C-D03%20-%20Mocked%20Contract%20Criteria%20With%20Separate%20Real%20Host%20Gates.md): planned mock/unit/contract criteria, separate real-host feasibility gates, no invented test passes.

**No slice itself, production promotion, code, tests or implemented spec was accepted by these three decisions.**

## Next unapproved review: Pass C Batch 2

- **C-D04:** Narrow initial story action mode and first observable user workflow.
- **C-D05:** Define mocked transaction adapter and where real host evidence is separately required.
- **C-D06:** Minimal supported canonical event/replay payload for the first story loop.

All three are **unapproved proposals** at this point.

## Deferred design scope

B9-D12 remains deferred: **no spatial schema/event migration work**. B9-D13 B and D24 revised B remain accepted. Original Pass A/B approvals and chronology are preserved.
