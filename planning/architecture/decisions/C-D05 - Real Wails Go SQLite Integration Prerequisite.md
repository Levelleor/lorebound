---
type: architecture-decision
status: accepted
decision_id: "C-D05"
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit Pass C Batch 2 choice)"
---

# C-D05 — Real host integration prerequisite before first story-loop mocks

## Explicit user approval

User selected **C-D04 A, C-D05 C, C-D06 A** and required recording only accepted choices, preservation of staging/architecture history, no implementation or promotion, and continuation in batches of three.

**ACCEPTED: C.** **Literal Option C accepted, contrary to recommended A:** completed, genuinely verified Wails v3 headless Go and SQLite integration is a prerequisite **before defining the first story-loop mock/domain acceptance criteria**. The immediate dependency sequence therefore starts with a real host/storage feasibility and integration gate, and only subsequently refines/exercises the mock-driven complete Story-mode slice. A proposed typed interface can still be discussed for planning and is not a second canonical browser store, but the mocked story-loop design cannot be treated as implementation-ready or its domain acceptance criteria final until the real-host gate is evidenced. This later explicit sequencing decision overrides any Batch 1 C-D01/C-D03 suggestion that the first story-loop mock can proceed before real integration; C-D01's end goal of a complete mock-tested story turn and C-D03's honest test-evidence distinctions remain accepted. **This is an architectural ordering gate, not user approval to write Go, SQLite, Svelte or tests now.** No actual Wails/SQLite execution or feasibility result has been evidenced.

## Alternatives and chronological authority

A (mock adapter first, real host later) was recommended but not selected; B (browser-local second canonical store) was not selected. Live-model scenario tests remain nonmandatory; C requires real host integration, not live AI calls.

The original Batch 2 proposal text and earlier Batch 1 decisions remain in [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md). This decision neither promotes any of the 52 accepted staging ideas nor creates implemented specs, code or test evidence. B9-D12 spatial migrations remain deferred without work.
