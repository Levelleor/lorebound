---
type: architecture
status: closed-design-only
phase: "B4"
created: "2026-10-27"
updated: "2026-10-28"
tags:
  - planning/architecture
  - pass-b
  - current-canon
  - replay-contracts
---

# Pass B4 — Current Canon Data and Replay Contract Review

## Current narrative-first architectural authority — 2026-10-28

**Post-closure user-approved supersession (2026-10-28):** [B6-D01](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) replaces the broad “reject a surviving later event if earlier item/character creation was removed” interpretation of B4-D06. Replay is **declarative and narrative-first**: a later grounded assertion may reconstruct a sparse identity and update its current holder/location with prior fiction unknown. Only malformed/unsupported core data, non-deterministic projection and unsafe commits fail. **The original B4 proposals and approvals below are preserved as history**, not a requirement to reject mechanical contradictions; B4 remains design-closed.


> **Formally closed at design level on 2026-10-28 by explicit user approval.** [P-B4-01 closure ADR](./decisions/P-B4-01%20-%20Design%20Closure%20and%20Deferred%20Initialization%20Contracts.md). Nine decisions accepted with B4-D04 **B** and B4-D08 **B**, all other D01–D09 **A**. No code, verification or staging promotion approved.

> **Batch 1 accepted on 2026-10-27:** B4-D01, D02 and D03 each approved **Option A** in separate ADRs. The original alternatives below remain for provenance. Batch 2 accepted: **D04 Option B**, **D05 Option A**, **D06 Option A**. Batch 3 approved: **D07 A, D08 B, D09 A**. Closure assessment below; formal sign-off remains pending. B3 is closed design-only under [P-B3-01](./decisions/P-B3-01%20-%20Design%20Closure%20and%20Deferred%20Data%20Contracts.md).

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

## Batch 2 — accepted (original alternatives retained)

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

- **A (original 2026-10-27 proposal, partly superseded):** Preflight deterministic structural integrity and reject failures. **Current B6-D01 scope:** only unrepresentable/unsupported typed event data and unsafe current projections fail; deletion of an earlier entity introduction is **not** grounds to reject later grounded assertions, which can use a sparse stable identity. Never silently change surviving events or call AI to repair. **Trade-off:** Some deliberate edits may require a second corrective action; predictable integrity.
- **B:** Automatically cascade deletes or rewrite dependent events to make the proposed mutation work. **Trade-off:** Less player work, but changes historical accepted outcomes without specific player intent.
- **C:** Commit the proposed removal regardless and show an error only later if replay fails. **Trade-off:** Fewer immediate blocks, but risks leaving the active adventure unusable.

**Clarification:** Fictional inconsistencies from **Keep Later Turns** do not count as structural failures; supported event-format incompatibility has the separately accepted B2-D08 fail-closed handling. Exact reducer/validation algorithms remain later engineering work.

### Batch 2 status

- **B4-D04:** **Accepted Option B, 2026-10-27.** [ADR](./decisions/B4-D04%20-%20Coordinated%20Migration%20of%20Current%20Event%20Schemas.md). Supersedes B2-D06's earlier no-bulk-rewrite default for supported current events; preserves deterministic outcome safety and removed-plugin exception.
- **B4-D05:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md).
- **B4-D06:** **Accepted Option A, 2026-10-27.** [ADR](./decisions/B4-D06%20-%20Preflight%20Structural%20Integrity%20of%20Current%20History%20Mutations.md).

## Batch 3 — accepted decisions (original proposals preserved)

### B4-D07 — Upgrade failure or unsupported event format

- **A (recommended):** Treat library schema/event migration as an all-or-nothing fenced operation. If a required current core event cannot be converted safely, stop that upgrade without partially rewriting accepted data; provide actionable diagnostics and a safe retry after compatible software or supported repair. Do not silently delete unsupported events. **Trade-off:** Some upgrades remain blocked until compatibility is available, but preserve canon.
- **B:** Upgrade convertible adventures but leave others at mixed per-adventure event formats. **Trade-off:** Greater partial usability, but creates long-lived mixed-schema complexity in the shared SQLite library.
- **C:** Drop unknown event fields/types or substitute neutral effects and finish upgrade. **Trade-off:** Seems convenient but risks silent corruption.

### B4-D08 — How should the pending manual draft react to a changed adventure?

- **A (recommended):** Keep the noncanonical pending proposal for inspection, mark it **stale** when its base adventure version/library epoch no longer matches, and preserve the full composer overlay until the player deliberately reviews and reapplies or discards it. Never auto-rebase or auto-commit. **Trade-off:** Some additional review UI, consistent with B3-D05/D08/D10.
- **B:** Automatically discard a pending draft when another tab commits. **Trade-off:** Less conflict UI, but player work is lost.
- **C:** Automatically apply the proposed edits against the new current world state. **Trade-off:** Easier immediate continuation, but risks silently changing intent or references.

### B4-D09 — How should pending manual corrections behave across tabs?

- **A (recommended):** Treat the latest saved pending **noncanonical** change set for the same adventure/editing context as a shared last-successful-save draft in SQLite. Other tabs may replace the draft; make the player recheck what is pending on restore/focus, and guard every canonical Commit against its expected adventure version. No exclusive tab lock or revision history. **Trade-off:** Consistent with accepted latest-only prose draft behaviour, but an unsaved/overwritten prior draft cannot be recovered.
- **B:** Retain a separate persistent pending manual batch for each browser tab. **Trade-off:** Preserves individual work, but adds duplicate pending sets, tab identity, and conflicts.
- **C:** Give a tab an exclusive editing lease whenever pending manual changes exist. **Trade-off:** Prevents some overlap, but conflicts with the accepted multi-tab/no-exclusive-edit-lock direction.

**Batch 3 accepted 2026-10-28:** [D07 A — atomic failed migration](./decisions/B4-D07%20-%20Fail%20Safe%20Atomic%20Event%20Migration.md); [D08 B — discard externally stale uncommitted manual drafts](./decisions/B4-D08%20-%20Discard%20Stale%20Pending%20Manual%20Drafts.md); [D09 A — shared latest pending draft](./decisions/B4-D09%20-%20Shared%20Latest%20Pending%20Draft%20Without%20Tab%20Locks.md). The user's preference is normal single-tab use, with minimal safety if additional tabs occur; **no exclusive lock**. D08 B takes precedence over B3-D08/D10 only for drafts proven obsolete due to another context's canonical advance. Uncertain prior commits still require B3-D02 receipt resolution.

## B4 design closure assessment — 2026-10-28

**B4 was formally closed at the design level on 2026-10-28 by a subsequent explicit user approval**, recorded as [P-B4-01](./decisions/P-B4-01%20-%20Design%20Closure%20and%20Deferred%20Initialization%20Contracts.md). Nine of nine B4 architectural questions have accepted dispositions; this assessment originally preceded formal sign-off. Decisions D01–D03 are A/A/A; D04–D06 are B/A/A; D07–D09 are A/B/A.

### Current combined design
- One current-only story/event history per adventure, with stable event order and story-boundary attachment for independent manual corrections. Deterministic TypeScript replay from Turn 0; consistent, version-tagged Go/SQLite reads.
- Coordinated format upgrades **rewrite the currently stored supported event payloads** safely and atomically (D04 B), fail without partial data modification on unsupported required core records (D07 A), and preserve the removed-plugin exception. Explicit event-schema versions and meaning-preserving conversion rules remain.
- Fork atomically copies the selected current history prefix as an independent adventure. Structural preflight rejects truly invalid event-history changes; fictional inconsistency under Keep Later Turns remains allowed.
- Explicit manual Commit, pending composer overlay and current-only correction events remain. Pending drafts persist as noncanonical SQLite values until resolved. **D08 B expressly permits discarding a previously uncommitted manual draft after verified external canonical advance**, superseding B3-D08/D10 stale-draft preservation *in that case*. Uncertain commit outcomes first need durable idempotency/status resolution and cannot be mistaken for merely stale drafts. D09 A selects latest-successfully-saved shared drafts, without tab locks or multiple queued branches. Single-tab is the expected use case; accidental second-tab use must not corrupt canon.

### Deferred contracts and verification
- Actual Go/SQLite table layout, migration schema+payload transaction, compatibility/conversion fixtures, failure/retry after crash, old/new binary and backup/restore compatibility. No integrated upgrade test has been run.
- Exact event ordering keys, correction boundaries on target turn, Undo/truncation edge cases, Fork ID mapping, dependency preflight API, plugin-state ownership and browser projection invalidation.
- Cross-tab draft-save races, latest-only shared draft lifecycle, confirmed external staleness detection, pending overlay accessibility and uncertain-response status. These are engineering resilience concerns, **not** reasons to build a sophisticated multi-tab collaboration feature.
- Original staging sources and older B1/B2 decision text contain superseded immutable revision/append-only assumptions. Preserve provenance while reconciling those documents **under a separately approved stage gate** before production implementation.
- All B1 deferred integration gates (real Wails/Go, browser provider connectivity, global library maintenance/restore and epoch, multi-tab canonical safety, plugin loading and backup) remain unverified.
- Optional AI-assisted downstream story re-evaluation stays unaccepted Inbox IDEA-0067, not part of current replay.

**Not implied:** New code, production-ready design, staging promotion, comprehensive migration recovery tooling, automatic backups, or application release approval.

## Deferred evidence and reconciliation

B4 design review does not implement SQLite tables or TypeScript reducers, approve staged feature promotion, or verify Wails/Go/provider integrations. Continue tracking [B1 feasibility gates](./Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md) and accepted staged-idea prose superseded by B3-D04 for a later explicit, provenance-preserving reconciliation.

## Decision history

- **2026-10-27:** User explicitly signed off B3 design closure and asked to proceed with the next architecture pass. First three B4 proposals opened; **no B4 approval inferred**.

- **2026-10-27 — Batch 1 explicit approval:** User accepted **B4-D01 Option A**, **B4-D02 Option A**, and **B4-D03 Option A**, with a request to record only approved choices and continue review. Created three separate ADRs with original proposals, rejected alternatives and individual approval provenance. Proposed D04–D06 as **unaccepted Batch 2**; no implementation, release test, staging promotion or B4 closure is implied.

- **2026-10-27 — Batch 2 explicit approval:** User selected **B4-D04 Option B** (coordinated upgrade-time migration of current event records), **B4-D05 Option A** (independent atomic Fork), **B4-D06 Option A** (preflight and reject structural replay conflicts). Separate ADRs record each decision and earlier options. D04 supersedes the prior B2-D06 in-place historical-interpretation default for supported current-event upgrades, **not** its deterministic compatibility safeguards. D07–D09 are unapproved Batch 3 proposals; no implementation or B4 closure implied.

- **2026-10-28 — Batch 3 acceptance and closure assessment:** User chose **B4-D07 A, B4-D08 B, B4-D09 A**, clarifying that normal use should be single-tab without overengineering multi-tab UX, while accidental extra tabs must not break canonical safety. Three separate ADRs capture the choices. D08 B narrowly supersedes earlier B3 pending-draft preservation after an externally verified canonical advance, but does not discard uncertain/in-flight commit proposals. Assessed B4 design **ready for formal closure**; no user authorization to mark it closed yet.

- **2026-10-28 — Formal closure:** After receiving the nine-of-nine closure assessment, the requesting user answered **“yes”** to formal B4 design closure and opening the next architecture pass. [P-B4-01](./decisions/P-B4-01%20-%20Design%20Closure%20and%20Deferred%20Initialization%20Contracts.md) preserves the closure authority and deferred integration gates. No next-pass decision, implementation or staging-to-production promotion was approved.
