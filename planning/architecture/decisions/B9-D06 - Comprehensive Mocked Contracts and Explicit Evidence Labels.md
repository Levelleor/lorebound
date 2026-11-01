---
type: architecture-decision
status: accepted
decision_id: "B9-D06"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 2 option selection)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - verification
---

# B9-D06 — Comprehensive mocked contracts with explicitly limited evidence labels

## Explicit approval

**Explicit 2026-10-31 instruction:** “Review B9 Batch 2: B9-D04: C; B9-D05: A; B9-D06: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option A.** Elaborates [B9-D03 B](./B9-D03%20-%20Mock%20Based%20Component%20Verification%20Without%20Live%20AI%20Scenarios.md), **not** the originally recommended live-host test approach. The original alternatives remain in the [B9 Batch 2 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md).

## Mock-based verification contract

1. **All application boundaries:** Create future versioned, deterministic fixtures around UI/components, TypeScript interpreter, typed event preparation and validation, world projection/replay, nested spatial frames and region geometry, AI provider contracts, Go service methods, SQLite-adapter contracts and migrations, with mocks/stubs for external dependencies. Test real pure functions and isolated components where available; mock external processes/services, not the logic under test.
2. **Success and failure:** Cover normal success, malformed and ambiguous model responses, provider failures/cancellation, retry/idempotency, expected-version/epoch conflicts, maintenance/restore rejection, transaction rollback simulation, schema incompatibilities, missing optional plugin state and history edits/Undo/Fork. Assert canonical vs pending-draft separation.
3. **Spatial regressions:** Cover deterministic first placement and same-transaction location+coordinate preparation, changing region borders, overlapping regions without containment changes, multi-frame transforms and route anchors, grounded distance versus rendered pixels, and **B9-D04 C** (automatic relocation is permitted even after a prior explicitly committed manual move). **Do not retain the formerly accepted “player pin never moves” test oracle** after the explicit D04 C override.
4. **AI never launched:** No test executes a real cloud/local AI model as an acceptance requirement. Use controlled response/error fixtures, not live story-generation scenarios. No mandatory full integrated Wails/Go/SQLite host suite is added to the B9 mock contract.
5. **Precise reporting:** CI and review results must say e.g. **“Mocked component/contract tests passed”** only when actually run and observed. Never report **“SQLite transactions verified”, “Wails host verified”, “real AI scenario passed”** on mocked evidence. This ADR records plans and acceptance criteria, **not a passing result**.
6. **Separate feasibility evidence remains:** Existing [B1 feasibility review](../Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md) and historic real-host validation gates remain tracked separately, with no waiver or alteration implied by this acceptance. Any later reconciliation requires its own explicit decision.

## Alternatives and trade-off

- **A — ACCEPTED:** Broad deterministic mocked fixtures across all app parts, positive and negative paths, explicit mock-only evidence labels; additional fixture effort, reliable evidence only for simulated conditions.
- **B — not selected:** Happy-path mocks only.
- **C — not selected:** Require real AI launches and an integrated live host as the B9 mocked-suite gate.

## Deferred engineering details

Test frameworks, fixture runner, exact coverage targets, mock Go/SQLite adapters, migrations, CI layout and separate B1 feasibility reconciliation. No tests executed, implementation authorised or staging promotion.

## Approval history

- **2026-10-31:** B9-D03 B explicitly selected mocks for all app parts without launching live AI models, while retaining a separate B1 feasibility evidence backlog.
- **2026-10-31 — explicit approval:** User selected **B9-D06 A**; this specifies the mocked suite's breadth and evidence language, not a change to D03 B.
