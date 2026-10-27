---
type: architecture
status: in-review
phase: "B3"
created: "2026-10-27"
updated: "2026-10-27"
tags:
  - planning/architecture
  - pass-b
  - transaction-contracts
---
# Pass B3 — Atomic Commit and Concurrency Contracts (Review)

> **Review proposals only, not accepted ADRs.** B2 was formally closed at design level on 2026-10-27 by [P-B2-01](./decisions/P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md). This document stages the first three B3 questions for explicit user decision; it approves none of them.

## Scope and inherited authority

S05 canonical history and S06 gameplay validation execute in browser TypeScript; Go S12 owns the single SQLite library and durable transaction acceptance, expected adventure version, library epoch and global maintenance fence. No second Go gameplay rule engine, browser-generic SQL, model proxy or unapproved AI review stage. B2-D01–D06/D08 define immutable outcome events, structured passage JSON, single active history, full Turn-0 reconstruction and fail-closed unsupported required core events. Current historical-edit behaviour: Keep Later Turns preserves edited passage events and retained future events; Delete All After Point removes later passages/events from active canon; drafts are not canon.

## B3 Batch 1 — proposed, not approved

### B3-D01 — Prepared canonical commit envelope and narrow Go service

**Option A (recommended):** One typed prepared canonical-commit request containing adventure identity, expected adventure version, library epoch, operation kind (new accepted passage, confirmed historical revision Keep/Delete, committed Undo, validated manual correction, etc.), immutable structured passage revisions/events as applicable, explicit active-history selection changes, provenance, and a unique attempt/operation identity. Go validates shape/IDs/references/storage integrity and applies **all** relevant durable changes in one SQLite transaction, or none. S05/S06 alone perform gameplay/narrative acceptance before request. Go responds with durable version/commit result, never with independent partial successes. Read/draft/backup/restore services remain distinct task-oriented operations. Exact field types, SQL schema, and Go method names remain future contract work.

**Option B:** Multiple separate browser calls for prose, events and active-history changes with client-orchestrated compensation. Easier endpoints but violates atomicity under tab closure, network failure and concurrency.

**Option C:** One generic transaction/SQL endpoint accepting arbitrary writes. Flexible but undermines narrow service/security boundaries and storage invariants.

### B3-D02 — Canonical attempt idempotency and stale/unknown outcomes

**Option A (recommended):** A client-generated unique logical commit/attempt ID, scoped to the adventure and bound to its immutable prepared payload, is durably recorded with successful commit. Repeated identical requests with the same ID return the original committed result without applying it twice; same ID/different payload is rejected. A new ID with a stale expected version or library epoch is rejected. After timeout/uncertain transport outcome, the client queries/refetches authoritative status/version and only retries the *same immutable request* when safe; never blindly regenerates/commits a second turn. Go checks maintenance fencing and expected-version/epoch atomically. This is a persistence-level idempotency key, **not** a player-facing generation variant.

**Option B:** Only optimistic version checking; retries after uncertain responses can be difficult to distinguish from new attempts, and user-facing status may be ambiguous.

**Option C:** Lock the adventure to one tab until every generation/commit finishes. Simpler concurrency but violates accepted no-exclusive-lock multi-tab direction.

**Clarification for later:** Exact retention horizon for attempt receipts, in-flight cancellation semantics, request payload fingerprint algorithm, and backup/restore epoch interaction need separate engineering detail. Cancellation cannot undo an already durable accepted commit.

### B3-D03 — Historical-edit and Undo atomic selection changes

**Option A (recommended):** Model confirmed Keep, Delete All After Point and committed Undo as explicit typed *selection changes* in the same atomic canonical transaction as any new accepted passage revision and associated changes. S05 computes a proposed selected history and validates applicable structural event/state changes against the expected current version; S12 checks storage consistency and commits new revisions/selection together. **Keep** retains existing accepted events of edited passage and all later active passages/events; **Delete** removes all later passages/events from active selection; **Undo** rewinds the active head by one committed turn. Inactive immutable records remain audit history, not selectable redo branches. Continue Editing/Discard are noncanonical. After success, clients reconstruct/invalidate projections from selected history as necessary; failed or stale requests leave canon untouched.

**Option B:** Mutate passage revisions, event membership and head separately with compensating cleanup. Less complex individual updates but risks mixed prose/state and partial truncation.

**Option C:** Physically delete all superseded historical records and reconstruct only from surviving rows. May reduce storage but breaks accepted immutable audit provenance and removes historical traceability.

**Open:** exact selection SQL representation, delete-boundary inclusive/exclusive semantics, stale-draft UX, safe recovery from mistaken truncation, and what specific manual correction operations are available. These are not implied approved.

## Review status

- **B3-D01:** Proposed Option A, unapproved.
- **B3-D02:** Proposed Option A, unapproved.
- **B3-D03:** Proposed Option A, unapproved.

## Decision history

- **2026-10-27:** B2 formally closed by explicit user approval. B3 first three decisions prepared for user review; no acceptance or implementation yet.
