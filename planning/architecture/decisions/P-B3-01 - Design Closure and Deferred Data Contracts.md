---
type: architecture-decision
status: accepted
decision_id: "P-B3-01"
phase: "B3"
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

# P-B3-01 — B3 design closure with deferred data and integration contracts

## Approval, authority and boundary

**Explicitly approved by the requesting user on 2026-10-27.** After receiving the B3 closure assessment and the question, “Would you like me to formally close B3 and begin the next architecture pass, following the same process used for B2?”, the user replied **“yes.”**

**Decision: Pass B3 (Atomic Commit and Concurrency Contracts) is formally closed at the *architecture design* level.** Approval permits opening the next architectural review; it **does not accept any future B4 proposal**, implement or verify software, promote staging ideas to production, or approve a product release.

## Accepted B3 decision register

| Decision | Current accepted rule | ADR |
| --- | --- | --- |
| **B3-D01** | Complete typed prepared canonical change committed atomically by Go/SQLite | [D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md) |
| **B3-D02** | Unique durable idempotent operation IDs; safe lost-response handling | [D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md) |
| **B3-D03** | Atomic Keep, Delete and committed Undo; **apply subsequent D04's revision-free replacement** | [D03](./B3-D03%20-%20Atomic%20Historical%20Selection%20and%20Undo.md) |
| **B3-D04** | **User-directed replacement**: one current story and ordered current accepted events; edit overwrites, delete/Undo remove, no retained narrative/event revision archive or inactive history selector | [D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) |
| **B3-D05** | Reject stale canonical commits atomically; refetch and require a new player/coordinator decision | [D05](./B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) |
| **B3-D06** | Manual world-state deviations accumulate noncanonically and only explicit player Commit makes replayable correction events | [D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md) |
| **B3-D07** | Shared semi-transparent overlay disables entire chat composer while an explicit pending commit requires approval/discard | [D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) |
| **B3-D08** | Persist noncanonical pending manual changes to SQLite across reload and recheck before approval | [D08](./B3-D08%20-%20Persistent%20Noncanonical%20Pending%20Change%20Sets.md) |
| **B3-D09** | One compatible pending batch per adventure/session editing context, no hidden queue or auto-approval | [D09](./B3-D09%20-%20Single%20Pending%20Change%20Set%20Per%20Editing%20Context.md) |
| **B3-D10** | Retain pending edits and overlay on validation, stale or uncertain commit outcome until safe resolution/discard | [D10](./B3-D10%20-%20Pending%20Commit%20Failure%20Recovery.md) |

All ten decisions received explicit approval; this is not a claim that the original alternatives were accepted. In particular, **B3-D04 supersedes its original Option A and the relevant older B2 revision/audit requirements**. Previously accepted B2 and B3 ADRs remain as an architectural **approval record in GitHub**, *not* as a requirement to preserve past passage revisions or inactive event history inside the Lorebound adventure database.

## Design completion basis

1. **Authority:** TypeScript S05/S06 prepares and gameplay-validates accepted outcomes; Go/SQLite S12 only enforces storage integrity, version/epoch and all-or-nothing durable transactions; no second Go gameplay validator.
2. **Canonical model:** One current ordered story/event history per adventure. Passage bodies are current schema-versioned structured JSON; events include current typed versioned outcome payloads and supported provenance. Full authoritative Turn-0 replay and fail-closed required-core incompatibility remain under the surviving B2 policy.
3. **Concurrency:** Adventure-version checks, library epoch and global maintenance fencing reject stale writes; commit-attempt receipts prevent uncertain-response duplicates; no ordinary exclusive single-tab lock.
4. **Player control:** Manual corrections are pending noncanonical batches until explicit Commit; full composer overlay prevents proceeding with unresolved explicit pending commits, with Approve/Commit, workflow-specific historical confirmations, and Discard.
5. **Durability/error behaviour:** Pending drafts survive reload in SQLite; compatible changes join one batch; failed/stale/indeterminate acceptance is reported without silently discarding or automatically rebasing player work.
6. **Provenance:** Individual ADRs and the dated B3 review record original options, approvals and later supersession, while avoiding acceptance of unapproved implementation details.

## Work explicitly deferred to B4 or implementation design

- Concrete current-only SQLite table and cross-language Go/TypeScript request/result schemas; event identifiers, global order, placement of independent manual corrections relative to story turns, and exact append/overwrite/delete semantics.
- Undo/rollback and historical truncation boundaries when manual state-only corrections sit before/after story turns; independent Fork, derived-cache rebuilding, and structurally invalid combinations.
- Pending manual edit draft scope across browser tabs, persistence and cleanup, post-reload stale conflicts, indefinite/unknown operation statuses, receipt/epoch interaction, and UI accessibility details.
- Whole-library backup/restore and Wails/Go service integration, host security boundaries, provider CORS/streaming, runtime/plugin loading, cross-tab races, deterministic replay and schema-compatibility tests. **No such integrated tests are recorded as passing.**
- **Source-document reconciliation:** Several accepted staging idea notes and earlier B1/B2 ADRs use outdated immutable event-audit or text-revision terminology. B3-D04 is the later accepted design authority for current architecture, but the original accepted idea approval history must not be silently overwritten. Staging stays staging until explicit stage-gate approval.
- Optional downstream AI story reevaluation stays unaccepted [Inbox IDEA-0067](../../inbox/AI-Assisted%20Downstream%20Story%20Re-Evaluation%20After%20Historical%20Edits.md).

## Alternatives considered

1. **Accepted:** Close the B3 *architectural decision set* now, with B4 data/replay contract proposals and integration/test obligations carried forward.
2. **Not selected:** Treat design closure as implementation, verification or readiness to promote all staged ideas. This would misstate project progress.
3. **Not selected:** Reopen old B2 revision-history choices automatically, despite the later explicit B3-D04 supersession. Prior approvals remain traceable; current architecture follows the later instruction.

## Traceability

[Pass B3 review and closure assessment](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md), [P-B2-01 prior design closure](./P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md), [B1 feasibility gates](../Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md), [Consolidated 12-subsystem architecture](../Consolidated%20Subsystem%20Architecture.md).

## Decision history

- **2026-10-27 — B3 D01–D03 accepted:** Atomic envelopes, idempotency, historical operation consistency.
- **2026-10-27 — B3 D04 user replacement / D05 accepted:** User removed versioned adventure-history storage; kept current replayable events and stale-write protection.
- **2026-10-27 — B3 D06–D07 accepted:** Pending correction Commit and explicit full-composer blocking overlay with approval/discard.
- **2026-10-27 — B3 D08–D10 accepted:** Durable noncanonical pending edits, one pending set, safe failure/uncertain-result handling. User requested **closure assessment**, not closure.
- **2026-10-27 — Formal closure approved:** In response to an explicit question about formal B3 design closure and proceeding to the next architecture pass, the user answered **yes**. B3 is **closed-design-only**, with no code/production promotion approved.
