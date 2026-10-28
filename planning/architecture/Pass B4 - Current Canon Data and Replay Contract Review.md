---
type: architecture
status: in-review
phase: "B4"
created: "2026-10-27"
updated: "2026-10-27"
tags:
  - planning/architecture
  - pass-b
  - current-canon
  - replay-contracts
---

# Pass B4 — Current Canon Data and Replay Contract Review

> **Batch 1 accepted on 2026-10-27:** B4-D01, D02 and D03 each approved **Option A** in separate ADRs. The original alternatives below remain for provenance. Batch 2 remains unapproved. B3 is closed design-only under [P-B3-01](./decisions/P-B3-01%20-%20Design%20Closure%20and%20Deferred%20Data%20Contracts.md).

## Scope and inherited decisions

After [B3-D04](./decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), there is one current passage body per logical passage and one current ordered event history per adventure, not a retained passage/event revision archive. Deterministic replay from Turn 0, Go/SQLite atomic transaction authority, expected-adventure-version and library-epoch checking, idempotent commits, pending manual edits and the composer overlay remain. The pre-B3 source documents retain original historical approval wording; do not silently treat obsolete revisions/audit expectations as current implementation requirements.

## Batch 1 — accepted Option A (original proposals retained)

### B4-D01 — Canonical event ordering when manual corrections occur between turns

**Question:** A player makes a manual inventory correction after Turn 8 and before Turn 9. Where in the replay sequence does that accepted correction belong?

- **Option A (recommended):** Maintain an explicit, durable **total ordering of all current outcome events within an adventure**. Manual correction events receive an ordered position between the surrounding story-turn events, with player-origin provenance but without inventing a story passage. Turn-level association may be retained as context, not as the event's sole ordering key. Replay strictly follows this order from Turn 0. **Trade-off:** Explicit ordering/insertion contracts must be consistent under Undo and Delete.
- **Option B:** Attach every manual correction to the most recent story turn and replay events grouped by turn only. **Trade-off:** Less ordering bookkeeping but blurs manually authored state changes and may become ambiguous near later historical edits and Undo.
- **Option C:** Keep manual corrections in a separate last-applied override table outside the event sequence. **Trade-off:** Simple editing but violates complete deterministic event-only Turn-0 reconstruction.

**Open:** Stable sort key/SQLite schema, whether existing events can be inserted before older events as part of separately approved deliberate manual corrections, and detailed handling of removed-plugin state.

### B4-D02 — Undo and truncation boundaries with independent manual corrections

**Question:** If a player commits a manual correction between Turn 8 and Turn 9, then Undo removes Turn 9 or a historical edit deletes turns after Turn 8, what happens to that correction?

- **Option A (recommended):** An accepted correction has an explicit **timeline attachment/boundary** separate from its prose origin. Corrections committed after a surviving turn and before the next story turn survive Undo of that next turn; deleting history after an earlier boundary removes **all** subsequent event effects including later independent correction events. The chosen boundary and removed event range are confirmed in the same atomic operation; no old revision archive or auto-replay of discarded events. **Trade-off:** Requires clear boundary language and tests for manual-event placement.
- **Option B:** Every committed Undo removes the last *commit* regardless of whether it is a story turn or a standalone manual correction. **Trade-off:** Uniform mechanics, but violates the existing player-facing “Undo one committed story turn” expectation.
- **Option C:** Preserve every independent manual correction through all Undo/Delete operations. **Trade-off:** Corrections can remain even after dependent turns or entities are removed, producing invalid state.

**Open:** Exact interpretation when the target passage itself has independent correction events, and how to report any structurally invalid surviving prefix. No hidden player-visible redo branch.

### B4-D03 — Consistent canonical reads and invalidation of derived projections

**Question:** How can a browser receive prose and events that correspond to the same accepted adventure version, especially when another tab commits concurrently?

- **Option A (recommended):** Go returns a **version-tagged, adventure-scoped consistent view of the current passage bodies and current ordered outcome events** from one SQLite read snapshot/transaction. Browser TypeScript reconstructs/reuses only a projection tagged with that same adventure version and library epoch. Following confirmed commit, restore or a relevant invalidation hint, refetch/rebuild as needed; never mix cached prose from version N with events from N+1. **Trade-off:** Snapshot read plumbing and occasional repeated reads; no persisted canonical world-state snapshot.
- **Option B:** Fetch prose and events independently with no common version consistency, relying on eventual cross-tab notifications. **Trade-off:** Less service plumbing but risk of inconsistent story/world views mid-commit.
- **Option C:** Go maintains authoritative mutable reconstructed world state for each tab. **Trade-off:** More server state and duplicates the browser TypeScript replay/validation architecture.

**Open:** Pagination, API methods, rendering caches, partial historical-view reads, transport errors and measurable Turn-0 replay performance.

## Decision status

- **B4-D01:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md).
- **B4-D02:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B4-D02%20-%20Undo%20and%20Truncation%20Boundaries%20for%20Independent%20Corrections.md).
- **B4-D03:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B4-D03%20-%20Consistent%20Version%20Tagged%20Canonical%20Reads.md).

## Batch 2 — proposed decisions, not approved

### B4-D04 — How should a current event's format change during application upgrades?

- **A (recommended):** Interpret supported older event schema versions through explicit deterministic TypeScript upcasters/reducers **without rewriting stored current events just to upgrade them**. On an ordinary accepted player correction, write the new current event format; on unsupported required core data, fail closed. No obsolete event archive is maintained. **Trade-off:** Maintain compatibility code for supported versions, but avoid broad risky in-place data transformations.
- **B:** Rewrite every current stored event to the latest schema as part of application upgrade, in one coordinated migration transaction. **Trade-off:** Simpler readers eventually, but larger failure/rollback surface and risk of accidental semantic changes.
- **C:** Read all old payloads using the latest reducer without explicit version handling. **Trade-off:** Fewer adapters, but accepted past outcomes might silently change meaning.

**Not approved:** indefinite backwards compatibility, exact format support policy, automatic payload migration or custom plugin migration; retain the removed-plugin exception.

### B4-D05 — How should an independent Fork copy the current adventure?

- **A (recommended):** Create a **new, independently owned adventure** from the chosen committed story-turn boundary, copying surviving current passage bodies and exactly the ordered events (including applicable manual corrections) within that boundary. Use atomic Go/SQLite storage and coherent ID/reference mapping; no reference back to mutable source adventure records. **Trade-off:** Requires a safe copy operation and ID mapping, but makes each fork independently editable.
- **B:** Fork by referencing the original adventure's live records and overlaying only later differences. **Trade-off:** Storage efficient, but risks cross-adventure mutation coupling and hidden branch complexity.
- **C:** Copy only prose and reconstructed world state at fork time, dropping historical events. **Trade-off:** Simpler, but loses future Turn-0 deterministic replay and event history.

**Not approved:** automatic historical snapshots, per-adventure import/export, or parallel in-story variant browsing.

### B4-D06 — How should invalid dependent events be handled after deliberate current-history mutations?

- **A (recommended):** Before accepting a manual event edit, history truncation, committed Undo or current-only deletion, run a **deterministic structural integrity check** of the intended resulting event sequence (TypeScript domain validation; Go storage safety). If it cannot replay safely because of a genuine missing referenced entity/invariant, **reject the proposed change with an actionable conflict**, keeping existing canon intact. Never silently change surviving events or call AI to repair. **Trade-off:** Some deliberate edits may require a second corrective action; predictable integrity.
- **B:** Automatically cascade deletes or rewrite dependent events to make the proposed mutation work. **Trade-off:** Less player work, but changes historical accepted outcomes without specific player intent.
- **C:** Commit the proposed removal regardless and show an error only later if replay fails. **Trade-off:** Fewer immediate blocks, but risks leaving the active adventure unusable.

**Clarification:** Fictional inconsistencies from **Keep Later Turns** do not count as structural failures; supported event-format incompatibility has the separately accepted B2-D08 fail-closed handling. Exact reducer/validation algorithms remain later engineering work.

### Batch 2 status

- **B4-D04:** proposed A/B/C; unapproved.
- **B4-D05:** proposed A/B/C; unapproved.
- **B4-D06:** proposed A/B/C; unapproved.

## Deferred evidence and reconciliation

B4 design review does not implement SQLite tables or TypeScript reducers, approve staged feature promotion, or verify Wails/Go/provider integrations. Continue tracking [B1 feasibility gates](./Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md) and accepted staged-idea prose superseded by B3-D04 for a later explicit, provenance-preserving reconciliation.

## Decision history

- **2026-10-27:** User explicitly signed off B3 design closure and asked to proceed with the next architecture pass. First three B4 proposals opened; **no B4 approval inferred**.

- **2026-10-27 — Batch 1 explicit approval:** User accepted **B4-D01 Option A**, **B4-D02 Option A**, and **B4-D03 Option A**, with a request to record only approved choices and continue review. Created three separate ADRs with original proposals, rejected alternatives and individual approval provenance. Proposed D04–D06 as **unaccepted Batch 2**; no implementation, release test, staging promotion or B4 closure is implied.
