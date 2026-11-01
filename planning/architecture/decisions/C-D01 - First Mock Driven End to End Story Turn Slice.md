---
type: architecture-decision
status: accepted
decision_id: "C-D01"
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

# C-D01 — Start with a small, complete mocked story-turn vertical slice

## User approval

**Explicit user choice (2026-11-01):** “Pass C Batch 1 review: C-D01: A; C-D02: A; C-D03: A. Record only explicitly approved Pass C decisions in Lorebound GitHub, preserve prior architecture and staging approvals, do not promote ideas or implement code, and continue reviewing Pass C in batches of three.”

**ACCEPTED: Option A.** Prioritise the **smallest complete single-adventure story-turn path**, not only isolated host plumbing and not the entire feature catalogue. Exercise a simple browser interaction, TypeScript coordinator, a mocked provider response, supported typed event preparation/reconstruction, a Go-style versioned transaction adapter and reopening/replaying accepted data. Narrow the initial mode, exact event subset, and first adapter implementation in later Pass C slice reviews.

## Binding scope and safeguards

1. **Gameplay authority:** Browser TypeScript owns story intent, validation and deterministic replay. AI stream/model output is **provisional** until accepted. Go is the exclusive durable SQLite transaction authority **when the real host is integrated**; a mock implementing its contract does not become a second canonical runtime datastore.
2. **Minimum outcome:** A coherent accepted story/history change can be represented, technically committed through the contract, refetched and deterministically reconstructed. Include a rejected/failed attempt test plan with no partial acceptance.
3. **Delivery distinction:** Mock-driven does not claim actual Wails/Go/SQLite startup or durable process-restart persistence has been demonstrated. These remain separately labelled evidence gates under C-D03.
4. **Ordering:** First story-loop priority is accepted. Exact initial UI mode and minimal typed event subset are **unapproved C-D04/C-D06 proposals**; real-host/mock boundary detail is **unapproved C-D05**.

## Alternatives and chronology

- **A accepted:** An incrementally refined, mock-driven story-turn vertical slice.
- **B not selected:** Platform-only spike as the whole initial planning target, without a story loop.
- **C not selected:** Specify/build all 52 staged ideas together before selecting an integrated slice.

- **2026-11-01:** Accepted as **Pass C Batch 1 Option A**. The other alternatives were not approved. This is planning-refinement authority, not permission to create application code, promote original staging ideas, create implemented specs or claim tests ran.
- The [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md) and [slice register](../Pass%20C%20-%20Implementation%20Slice%20Register.md) retain current review status and cross-references. Earlier Pass A/B architectural acceptances and their historical overrides remain in force.
