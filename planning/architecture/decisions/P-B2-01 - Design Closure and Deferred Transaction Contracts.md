---
type: architecture-decision
status: accepted
decision_id: "P-B2-01"
phase: "B2"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - design-closure
---

# P-B2-01 — B2 design closure with deferred transaction and integration contracts

## Closure authority and scope

**Approved by the requesting user on 2026-10-27**, in response to the explicit question “Would you like me to formally close B2 and proceed with the first three B3 architectural decisions?”: **“yes, lets proceed with that.”**

**Decision: Pass B2's *canonical-history architecture review* is formally closed at the design level.** This is **not implementation readiness, build/test acceptance, repository staging promotion, release approval, or blanket acceptance of any pending B3 proposal**.

## Accepted B2 decision inventory

| Number | Decision | Status and authority |
| --- | --- | --- |
| **B2-D01** | Immutable structured accepted outcome events in atomic commit groups | [Accepted ADR](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md) |
| **B2-D02** | Immutable audit history with one selected active canon per adventure | [Accepted ADR](./B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md) |
| **B2-D03** | Deterministic Turn-0 TypeScript reconstruction when rebuilding; normal new-turn incremental projection allowed; no persisted snapshots/checkpoints | [Accepted revised ADR](./B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md) |
| **B2-D04** | Keep Later Turns preserves existing events of edited passage and all retained later events; Delete All After Point removes later passages/events from **active** canon; explicit incompatible state changes rejected | [Accepted, later clarified ADR](./B2-D04%20-%20Retained%20History%20and%20Suspended%20Unrepresentable%20Effects.md) |
| **B2-D05** | Single canonical schema-versioned structured JSON passage document per immutable revision in Go/SQLite | [Accepted revised ADR](./B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md) |
| **B2-D06** | Event schema versioning and deterministic supported-format compatibility | [Accepted ADR](./B2-D06%20-%20Versioned%20Event%20Contracts%20and%20Deterministic%20Compatibility.md) |
| **B2-D07** | Reactivating suspended effects | **Withdrawn, never accepted.** D04 user clarification makes the ordinary suspension scenario inapplicable. No additional ADR. |
| **B2-D08** | Fail closed for unsupported required core events, without corrupting historical storage or blocking unrelated adventures | [Accepted ADR](./B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md) |

The later, explicitly approved **D04 clarification supersedes its original D04 Option A suspension workflow**; the earlier approval and reasons are retained in that ADR's decision history. The **D05 structured-document approval replaces the unaccepted initial split/merge ancestry proposal**, not vice versa.

## B2 completion criteria — design-level only

1. Individual decisions have explicit approval/provenance or withdrawal.
2. Core boundaries compose: TypeScript S05/S06 gameplay and deterministic history selection; Go/SQLite S12 durable, epoch- and expected-version-checked atomic commits; versioned passage JSON and typed immutable accepted events; single active canon; no second AI validator or Go gameplay engine.
3. The human-approved historical-edit semantics distinguish **Keep Later Turns** from **Delete All After Point** without automatically reinterpreting prose or changing events under Keep.
4. Unsupported *required core* history fails closed for the affected adventure, while the separately accepted removed-plugin exception remains.
5. The design-level review register and ADR approval history remain intact. B2 closure does **not** require claiming implemented schema/tests.

## Deferred B3 and later contract work

**Architectural transaction details requiring separate review/approval:**

- Exact typed Go-facing atomic commit envelope/operation variants and ownership split between S05/S06 and S12; precise SQLite/event/structured-passage schemas.
- Optimistic concurrency, expected adventure version/library epoch, request idempotency and uncertain commit outcomes, cancelled/late AI attempts, maintenance fence and stale tabs.
- Confirmed historical revisions/Keep/Delete/Undo transaction boundaries, deterministic preflight, ordered active-history changes, obsolete derived data and recovery/error behaviour.
- Manual world/event edit dependency checks and structural-conflict feedback.
- Typed historical core replay compatibility failures, reliable adventure-scoped read-only diagnostics and module availability exception.
- Passage structured JSON editors/serializers, passage-level split/merge/reorder semantics if pursued, plus normal UI and performance details.
- Runtime/module integration, release gating and end-to-end tests.

**Mandatory deferred feasibility/integration gates from B1** remain open: real Wails v3/Go loopback build, browser-to-provider authenticated CORS/stream abort, Go+SQLite transaction and global maintenance, multi-tab invalidation/conflicts and library epoch after restore, actual browser module/plugin loading, cross-platform safe backup/restore and secret-boundary verification. Isolated mechanism research or design documents cannot substitute for these tests.

**No staging/production promotion:** the 52 accepted staged ideas remain in staging pending their separate gates. Optional downstream AI story reevaluation after earlier edits remains **unaccepted [Inbox IDEA-0067](../../inbox/AI-Assisted%20Downstream%20Story%20Re-Evaluation%20After%20Historical%20Edits.md)**. No new background continuity repair or historical reinterpretation is approved.

## Alternatives and rationale

- **Accepted:** close the B2 canonical-history decision set as *design-only*, carrying executable transaction/API engineering and feasibility checks forward.
- **Not chosen:** require a full working Wails/SQLite/browser build as a prerequisite to documenting B2 design closure. That would conflate architectural agreement with implementation proof.
- **Not chosen:** silently promote all staged feature documents to production or assume B3 choices are accepted because B2 is closed.

## Traceability

[Pass B2 Decision Review](../Pass%20B2%20-%20Canonical%20History%20Decision%20Review.md), [B1 design-only closure and feasibility](../Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md), [B1 foundations](../Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md), [Consolidated Architecture](../Consolidated%20Subsystem%20Architecture.md), and sources IDEA-0039/0040/0041/0042/0044/0051.

## Decision history

- **2026-10-25–27:** Reviewed and documented B2-D01 through B2-D08 in sequential batches; D03 and D05 revised before acceptance, D04 narrowed after explicit human correction, D07 withdrawn, D08 accepted as fail-closed.
- **2026-10-27:** User explicitly authorised **formal B2 design-level closure** and proceeding to first three B3 architecture proposals. This closes the B2 design review, not product implementation or testing.
