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

> **Proposal only.** B3 is formally closed at design level under [P-B3-01](./decisions/P-B3-01%20-%20Design%20Closure%20and%20Deferred%20Data%20Contracts.md); **no B4 decision has been accepted**. Each numbered question below requires distinct human approval.

## Scope and inherited decisions

After [B3-D04](./decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), there is one current passage body per logical passage and one current ordered event history per adventure, not a retained passage/event revision archive. Deterministic replay from Turn 0, Go/SQLite atomic transaction authority, expected-adventure-version and library-epoch checking, idempotent commits, pending manual edits and the composer overlay remain. The pre-B3 source documents retain original historical approval wording; do not silently treat obsolete revisions/audit expectations as current implementation requirements.

## Batch 1 — proposed decisions, not accepted

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

- **B4-D01:** proposed A/B/C; unapproved.
- **B4-D02:** proposed A/B/C; unapproved.
- **B4-D03:** proposed A/B/C; unapproved.

## Deferred evidence and reconciliation

B4 design review does not implement SQLite tables or TypeScript reducers, approve staged feature promotion, or verify Wails/Go/provider integrations. Continue tracking [B1 feasibility gates](./Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md) and accepted staged-idea prose superseded by B3-D04 for a later explicit, provenance-preserving reconciliation.

## Decision history

- **2026-10-27:** User explicitly signed off B3 design closure and asked to proceed with the next architecture pass. First three B4 proposals opened; **no B4 approval inferred**.
