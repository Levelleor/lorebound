---
type: architecture-decision
status: accepted
decision_id: "B3-D04"
phase: "B3"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
supersedes_in_part:
  - B2-D01
  - B2-D02
  - B2-D04
  - B2-D05
  - B2-D06
  - B2-D08
  - B3-D01
  - B3-D03
tags:
  - planning/architecture
  - pass-b
  - transaction-contracts
  - architecture-decision
---

# B3-D04 — One current story and event history; no retained revisions

## Approval and provenance

**Explicitly accepted by the requesting user on 2026-10-27:** “Yes, lets get rid of revisions entirely, I don't think we need them. And for D05 lets go with option A.”

This confirms the preceding explicit question: **“Do you want Lorebound to keep only the current story and its current events, permanently overwriting or deleting older versions when the player edits history?”** The user answered **yes**. The preceding explanation specified that Keep Later Turns preserves existing events, Delete All After Point deletes later passages/events, and committed Undo removes the last turn/events. **B3-D05 Option A was separately accepted in the same user message.**

**This is a user-directed replacement of the original B3-D04 alternatives, not acceptance of the original D04 Option A.** The earlier proposal of explicit durable selected revision/event membership and inactive immutable audit records is superseded. The original proposal, the older B2 approvals and the later supersession must remain documented in decision histories, but old canonical versions need not be stored inside the *application's adventure library*.

## Current accepted architecture

**Each adventure stores one current, ordered canonical sequence of passage bodies and their current accepted outcome events. Do not maintain an application-level archive of prior passage revisions, prior event versions, inactive canon selections or historical redo branches.**

1. **Current passage only.** A logical turn/passage keeps a stable identity and one current schema-versioned structured JSON body in Go-managed SQLite. Confirmed edits **replace** that passage body; no passage revision ID, passage-revision table, ancestry graph or retained previous body is required. Internal paragraph/markup structure is not a separate passage. Browser DOM/HTML and model-readable text remain derived from the current structured body.
2. **Current events only.** Keep one ordered, replayable collection of current accepted typed outcome events, with stable IDs, schema/format versions, relevant entity references, ordering and source **passage/turn ID** where applicable. No immutable append-only audit archive of events or retained superseded payloads is required. Canonical event changes/removal, when separately authorised and validated, can replace/delete current event records **atomically**. This does not authorise an unreviewed automatic event-rewrite algorithm.
3. **Keep Later Turns.** On confirmed edit of an earlier passage, overwrite that passage's body, **leave all existing current events associated with that passage and all later passages/events unchanged**, and retain later text, even if fictional logic no longer agrees. Events may refer to the passage ID but not to a nonexistent old revision. No AI repair, reroll or automatic event reinterpretation.
4. **Delete All After Point.** On confirmed edit, overwrite the chosen passage and **delete all later passages and their events from current canon** in the same atomic transaction. Preserve the edited passage's own current events unless explicitly corrected. No separate inactive audit selection/branch.
5. **Committed Undo.** Remove the last available committed story turn and its events from current canon atomically; repeatable back to the Turn-0 baseline. No canonical redo or hidden alternate futures. Exact handling of state-only corrections adjacent to story-turn Undo is deferred.
6. **Replay and invariants.** Deterministic reconstruction applies the **current ordered event sequence from Turn 0**, with normal new-turn incremental projection allowed under B2-D03. No AI inference, random rerolls or external effects during replay. Unsupported required core events still fail closed under B2-D08. The removed-plugin exception remains.
7. **Atomicity and concurrency.** Canonical edits, event changes and deletions use the single typed B3-D01 Go/SQLite transaction with expected **adventure version**, server-verified library epoch and global maintenance fencing. B3-D02 durable operation-ID receipts still prevent duplicate submissions. **The adventure version counter is a concurrency token, not a history of saved prose revisions.**
8. **Schema versions are not passage revisions.** Retain explicit event payload format versions (B2-D06) and structured passage JSON schema versions (B2-D05) for compatibility. A schema version identifies how to parse a record, not a past copy of a player's story.
9. **Drafts and forks.** Autosaved editing drafts remain separate and noncanonical, with previously accepted latest-successfully-saved/last-write-wins semantics. Duplicate/Fork creates an independent copy of the **current** selected adventure history (or requested surviving prefix) with coherent IDs and replayable events, not superseded passage/event versions.
10. **Recovery limitation.** Once a canonical edit, Delete or committed Undo succeeds, overwritten/deleted old adventure content is **not recoverable through a revision archive**. Whole-library backup/restore remains the only previously approved backup route; such backups may contain earlier library states. Do not claim secure forensic erasure of SQLite pages, backups or external copies. Mistaken-deletion recovery beyond whole-library restore requires a new decision.

## Explicit supersession of older accepted architecture

This later approval **overrides** older requirements for immutable append-only event audit, retained passage revision IDs/bodies, inactive event/revision selection tables and provenance to a specific obsolete passage revision:

- **B2-D01:** Typed outcome events and atomic commits **remain**; immutability/append-only retention and old-revision provenance are **superseded**.
- **B2-D02:** One current canon and independent Fork **remain**; immutable audit history and explicit active-selection of old revisions/events are **superseded**.
- **B2-D03:** Full deterministic Turn-0 reconstruction **remains**, now from current ordered events; no persisted checkpoints.
- **B2-D04:** Keep/Truncate user semantics and no AI repair **remain**; old revision-specific provenance and retained inactive audit **are superseded**.
- **B2-D05:** One structured JSON body per passage and derived projections **remain**; one immutable JSON document **per revision** is **superseded**.
- **B2-D06:** Event type/schema version and deterministic compatibility **remain**; requirement to retain every prior immutable payload is **superseded**. This decision does not choose an automatic bulk event migration policy.
- **B2-D08:** Fail-closed unsupported required core events and safe read-only diagnostics **remain**; on failure preserve **current** durable data without modification, not an obsolete revision archive.
- **B3-D01:** One typed, atomic prepared commit **remains**, but its envelope carries current passage/event inserts, replacements and deletions instead of immutable historical revision/selection writes.
- **B3-D02:** Operation-ID idempotency receipts and expected adventure version/library epoch **remain unchanged**; receipts are transaction bookkeeping, not playable revisions.
- **B3-D03:** Atomic Keep/Delete/Undo **remains**, but operations update/delete current canon directly rather than selecting from immutable inactive history.

The earlier approvals and their original rationale remain visible in their respective ADRs and [B2 closure history](./P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md). The B2 design-only closure happened before this subsequent amendment and is not erased.

## Alternatives and trade-offs

1. **Accepted — user-directed simpler model:** One current story and event list; confirmed edits overwrite, truncation/Undo delete. **Benefit:** fewer data structures and no revision-selection model. **Cost:** no built-in recovery of superseded passages/events or old-version audit.
2. **Original B3-D04 A — superseded before acceptance:** Explicit active passage-revision and event-membership selection with inactive immutable audit. Not accepted.
3. **Original B3-D04 B — not selected:** Store only active-head pointer and derive historical membership from immutable revisions.
4. **Original B3-D04 C — not selected:** Treat mutable materialised world state as primary authority rather than replayable outcome events.

## Open contracts and non-approvals

- **B3-D06 remains unapproved:** Whether a manual correction edits/deletes existing current events or appends a new correction event, how to validate dependencies, and what event types may be edited require explicit review. This ADR does not permit arbitrary projection-only state mutations.
- Concrete SQLite tables, request schemas, transaction ordering, ID reuse rules, draft/conflict UI, undo of non-story corrections and safe recovery UX remain implementation/design refinement.
- No code was changed, no runtime behaviour or integration tests verified, and no staging-to-production promotion was authorised.

## Decision history

- **2026-10-27 — Initial unapproved B3-D04 proposal:** Options A (explicit active revision/event selection), B (derive from immutable history) and C (mutable world-state primary authority) presented.
- **2026-10-27 — User objection:** Asked why revisions were needed and proposed simply overwriting events and other content. Assistant explained the earlier archive was optional and asked whether to keep only the current story/events with permanent overwrites/deletions.
- **2026-10-27 — Explicit replacement approval:** User answered **yes** and requested removal of revisions entirely. Adopted this simpler current-canon architecture **instead of** B3-D04 Option A; prior B2/B3 approval histories are preserved in documentation, not in adventure history storage.
