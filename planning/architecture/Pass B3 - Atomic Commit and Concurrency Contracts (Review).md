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

> **B3 Batch 1 approved on 2026-10-27:** D01, D02 and D03 each accepted **Option A** in separate ADRs. Original alternatives below are preserved for approval history. Batch 2: **D04 user-directed revision-free replacement accepted; D05 Option A accepted; D06 Option A accepted with explicit pending manual Commit gate**. B2 was closed at design level under [P-B2-01](./decisions/P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md).

## Scope and inherited authority

S05 canonical history and S06 gameplay validation execute in browser TypeScript; Go S12 owns the single SQLite library and durable transaction acceptance, expected adventure version, library epoch and global maintenance fence. No second Go gameplay rule engine, browser-generic SQL, model proxy or unapproved AI review stage. B2-D01–D06/D08 define immutable outcome events, structured passage JSON, single active history, full Turn-0 reconstruction and fail-closed unsupported required core events. Current historical-edit behaviour: Keep Later Turns preserves edited passage events and retained future events; Delete All After Point removes later passages/events from active canon; drafts are not canon.

## B3 Batch 1 — accepted Option A on 2026-10-27 (original proposal preserved)

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

- **B3-D01:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md).
- **B3-D02:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md).
- **B3-D03:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B3-D03%20-%20Atomic%20Historical%20Selection%20and%20Undo.md).

## B3 Batch 2 — original proposals (all three resolved; D04 replaced, D06 refined)

The next three questions refine implementation-facing behaviour without reopening B1/B2 decisions. **These options are not ADRs until explicitly accepted.**

### B3-D04 — Active-history selection persistence and read consistency

**Question:** How should Go store and return the one active canon for an adventure without accidentally exposing old inactive audit records as current state?

- **A (recommended):** Store **explicit, durable, adventure-scoped selected passage-revision and event-membership records plus a selected head/order**. Read a coherent, version-tagged active-history view from a single consistent SQLite read transaction. S05 deterministically reconstructs world state from the selected events; Go does not run the gameplay reducer. Historical inactive revisions/events stay queryable only as audit, not as playable alternatives. **Trade-off:** Additional membership data and referential/ordering checks; easiest to audit.
- **B:** Store only an active-head pointer and derive membership from immutable history and revision ancestry on every read. **Trade-off:** Smaller selection data, but ambiguous membership for retained events of rewritten passages and for manual corrections; derivation becomes more complex and may require hidden rules.
- **C:** Persist a mutable materialised current-world-state record as the primary authority for reads, with events treated mainly as audit. **Trade-off:** Faster reads, but conflicts with the B2 Turn-0 authoritative reconstruction and creates two competing canonical state representations.

**Not settled by this question:** Exact SQLite table layout, ID representation, schema migration and query indexes.

### B3-D05 — Handling stale browser tabs and conflicting canonical submissions

**Question:** When a tab tries to commit against an outdated adventure version, should the app try to merge/rebase it automatically?

- **A (recommended):** **Reject the stale canonical attempt atomically, refetch authoritative adventure/version/epoch and require a fresh player/coordinator decision** before any new attempt. Preserve uncommitted input/draft when still available. Cross-tab notifications are invalidation hints, not source-of-truth updates. Never auto-apply stale history edits or delete newer turns. **Trade-off:** Player may need to retry/review; strongest predictability and aligns with B1-D04.
- **B:** Automatically rebase prepared canonical changes against the latest history, rerun relevant deterministic checks and attempt commit without a new player confirmation. **Trade-off:** Fewer interruptions, but changes the premise of a previously accepted proposal and is risky for Delete/Undo/manual state edits.
- **C:** Queue stale attempts in Go and serialise them in arrival order regardless of their original expected versions. **Trade-off:** Simpler optimistic caller UX but violates expected-version acceptance and may apply a story action to a different canon than intended.

**Not settled:** Specific conflict dialog text, autosave debounce, cross-tab notification transport or request cancellation implementation. Same-operation idempotency under D02 remains distinct from retrying a rejected stale request.

### B3-D06 — Validated manual state corrections and dependent event integrity

**Question:** When a player explicitly changes an existing world-state fact (e.g. inventory or entity identity), how should the change enter accepted history if later active events depend on it?

- **A (recommended):** Treat the player's correction as a **new, validated, provenance-bearing canonical outcome** in a B3-D01 atomic commit. S05/S06 preflight its impact against applicable structural invariants and selected event dependencies. If the change would leave an unrepresentable active state, **reject/report the conflicting correction** for player revision instead of silently altering other accepted events. **Trade-off:** May require the player to resolve dependencies explicitly; keeps original accepted history and gameplay state deterministic.
- **B:** Automatically cascade through dependent active events, rewriting their effects or deactivating them until the correction can apply. **Trade-off:** Less player effort but contradicts the accepted non-suspension/no-unapproved-auto-repair history policy and obscures player intent.
- **C:** Mutate the current world-state projection directly without recording a new outcome event. **Trade-off:** Quick to implement but breaks deterministic replay and audit provenance.

**Not settled:** Concrete correction command types, whether event-removal is a separate approved action, conflict presentation, or specific reducer/dependency algorithms. This is **not** permission for AI to rewrite downstream prose; [IDEA-0067](../inbox/AI-Assisted%20Downstream%20Story%20Re-Evaluation%20After%20Historical%20Edits.md) remains unaccepted.

## Batch 2 review status

- **B3-D04:** **Accepted revised user-directed no-revisions model, 2026-10-27** (original A/B/C superseded, not chosen). [ADR](./decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md).
- **B3-D05:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md).
- **B3-D06:** **Accepted Option A with explicit player Commit gate, 2026-10-27.** Manual world-state changes accumulate in a pending noncanonical change set; only a visible bottom-area **Commit** action validates and atomically records replayable correction events. Blocking the chat composer is **tentative and unapproved**. [ADR](./decisions/B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md).

## Current direction superseding original Batch 2 D04 options

The user explicitly rejected retaining passage/event revision archives and confirmed a **single mutable current story and current ordered events**. Confirmed passage edits overwrite their current body; Keep retains existing current events; Delete/Undo remove affected current passages/events atomically. Stable passage/event IDs, structured JSON, event-format versions, Turn-0 deterministic replay, adventure-version optimistic concurrency, library epoch, typed atomic commits and operation-ID receipts remain. Old B2/B3 ADRs retain approval provenance but the superseded immutable audit/selection requirements no longer direct new design. **D06 is now accepted with an explicit manual Commit gate** and reconciled with the current-only model; its original alternatives above remain for approval history.

## Decision history

- **2026-10-27:** B2 formally closed by explicit user approval. B3 first three decisions prepared for user review; no acceptance or implementation yet.

- **2026-10-27:** Requesting user explicitly selected **B3-D01: A, B3-D02: A, B3-D03: A**. Created separate accepted ADRs for all three and preserved original alternatives. Prepared **B3-D04 through B3-D06 as unapproved Batch 2 proposals**; no implementation, staging promotion or approval of the new proposals implied.

- **2026-10-27 — B3-D04 replacement and B3-D05 approval:** User explicitly confirmed no retained passage/event revisions or immutable audit selection, superseding the original B3-D04 Option A proposal and relevant B2/B3 design assumptions; separately approved **B3-D05 Option A**. Recorded [D04](./decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) and [D05](./decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) as accepted ADRs. **D06 not accepted.**

- **2026-10-27 — B3-D06 explicit approval with refinement:** User accepted manual correction outcome events (Option A), **but only after edits are staged as a pending change set and the player presses a visible bottom-area Commit button**. Automatic state commits from editing controls are not approved. User tentatively suggested blocking the chat box while changes are pending; this UX lock remains a separate unapproved choice. [B3-D06 ADR](./decisions/B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md).
