---
type: architecture-decision
status: accepted
decision_id: "B9-D03"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Batch 1 Option B, mocked tests for all app parts; no launched AI scenario tests)"
tags:
  - planning/architecture
  - pass-b
  - verification
  - architecture-decision
---

# B9-D03 — Mocked application tests without launching AI models or requiring live-AI scenarios

## Explicit approval, selected option and qualification

**2026-10-31 user message:** “Review B9 Batch 1: B9-D01: A; B9-D02: A; B9-D03: B. Notes: for D01 I don't think the distinction between player-authored and ai-authored should be accounted for. just store the credentials. For D03 we will have mocked tests for all parts of the app, we will not have scenario tests where AI model is acutally launched which is why I chose B. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**B9-D03 Option B is ACCEPTED, not earlier recommended A.** The user expressly chose **mocked tests for all parts of the application** and **no scenario tests that actually launch a live AI model**. This is an explicit reduction in the B9 verification strategy from the original recommended A's real Go/SQLite integration-path scenario corpus. The [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) retains the original proposal and its alternatives, including the warning about the evidence limits of mocks. No tests are represented as run or passed.

## Accepted Option B

1. **Mocks cover every application subsystem:** Test TypeScript event proposal/normalization and replay, spatial frame transforms, generated first placement, authored-pin protection, mutable borders, cross-frame route anchors, manual draft Commit/Discard flow, scene/inventory projections, browser-to-Go service contracts, Go-side domain and persistence control paths, expected-version/epoch/idempotency safety and migration behaviour using **mocked or controlled replacement dependencies as appropriate**. Coverage of the entire application architecture is the goal, not merely a few visual UI tests.
2. **No real AI launch:** All tests of narration, extraction, provisional references, ambiguity handling, model errors and tool/provider responses use **deterministic mocked AI/model responses**. Never require making external model network calls or starting a real local AI model just to run a test. The user does **not** want end-to-end *live-model* story scenarios.
3. **No mandatory full-host real-service scenario suite in B9:** Choosing B instead of A means this B9 verification design does **not** mandate a shared end-to-end scenario runner that executes through an actual integrated Wails/Go/SQLite host as the pass's acceptance criterion. Mocked backend/service behavior is the chosen basis for routine application contract tests. Tests may exercise real isolated pure domain functions and reducers when convenient, with dependencies mocked at boundaries, but live-host operation is not a prerequisite for a passing **B9 mocked-test suite**.
4. **What mocked tests can establish:** Their results can support conclusions about the **specified behavior under the simulated inputs**, including deterministic reducers, input validation, error mapping, UI state, retry logic and IPC interface expectations. They **cannot establish** that a real Wails host, filesystem database, SQLite WAL/transaction behavior or upgraded library physically works. Do not label mocked pass results “verified actual SQLite persistence” or “real-host integration tested.”
5. **Earlier B1 real-host evidence gate remains visible:** [P-B1-02](./P-B1-02%20-%20Design%20Closure%20with%20Deferred%20Integration%20Gates.md) and the [B1 feasibility evidence review](../Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md) still contain their separate historic real-host feasibility/evidence requirements. **The user has not explicitly asked to close B1 or amend that separate gate in this message.** The distinction between **mock-sufficient B9 routine verification** and any still-open **B1 integration feasibility gate** must remain explicit. A later decision may reconcile the evidence boundaries, rather than silently claiming mock tests prove host operation or requiring a launched AI model.
6. **Test scenarios are not forbidden as pure fixtures:** A deterministic mocked input/output case can still represent a story, Undo, Fork, generated coordinate correction, route change or schema migration; what is not approved is a requirement to **launch an AI model** or execute a full live host scenario just to test it. Mocked scenario fixtures are still ordinary unit/component/contract tests, not evidence of a model actually running.
7. **No game mechanics as technical test:** Model mocks and test fixtures should not impose fictional causality checks on accepted narration. Maintain current-only history, narrator ID exclusion, required-core failure safety and the explicit player edit boundary from earlier passes.

## Original alternatives and disposition

- **A — not selected:** Shared deterministic fixture corpus *plus real integrated Go/SQLite host evidence* as B9's verification acceptance requirement. The user explicitly prefers mocks and no launched model tests.
- **B — ACCEPTED:** Mock-based tests for **all app parts**, including synthetic/mock backend responses as the selected B9 verification strategy; no real AI model launch or mandatory real-host end-to-end scenario requirement in this pass.
- **C — not selected:** Visual screenshot/manual map inspection alone as sufficient evidence.

## Trade-off explicitly recorded

Mocks are faster, repeatable and avoid model cost/environment dependence, but **can miss real host, filesystem, SQLite crash/recovery or migration integration defects**. This is a known testing limitation, not a claim those systems function correctly.

## Deferred details

Mock interface/contracts, fixtures, test framework, Go mock DB strategy, component/UI test harness, migration simulators, coverage thresholds, behavior expectations, pipeline/CI runner and separate earlier B1 evidence gate reconciliation. No tests created or executed here.

## Decision history

- **2026-10-31:** B9 original Option A recommended deterministic fixtures and actual Go/SQLite host tests; B offered mocks with explicit limitations.
- **2026-10-31:** User explicitly selected **D03 B**, specifying **mocked tests for all app parts** and **no live AI model scenario tests**, alongside D01 **qualified A** and D02 A. This ADR records that separate approval without conflating mock success with real host proof.
