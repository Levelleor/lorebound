---
type: architecture
status: closed-design-only
phase: "B2"
created: "2026-10-25"
updated: "2026-10-27"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
---
# Pass B2 — Canonical History Decision Review

> **Formally closed at design level on 2026-10-27 by explicit user approval.** [P-B2-01 closure ADR](./decisions/P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md). Seven accepted decisions (D01–D06, D08), D07 withdrawn; D04's later user-approved clarification supersedes its original suspension workflow. This is **not** implementation, testing, staging promotion or release approval.

## Scope and authority

This note tracks architectural review only. [B1 design closure](./Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md) and [Pass A audit](./Pass%20A%20Closure%20Audit.md) remain authoritative for established scope. All 52 accepted ideas remain staging. Only individually accepted decisions become ADRs, and technical details not yet accepted remain proposals.

## Batch 1 — explicit user decisions, 2026-10-25

| Decision | Review status | Authoritative source |
| --- | --- | --- |
| **B2-D01** Structured immutable outcome events grouped by atomic commits | **Accepted** | [B2-D01 ADR](./decisions/B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md) |
| **B2-D02** Immutable audit/history and one explicit active-history selection per adventure | **Accepted** | [B2-D02 ADR](./decisions/B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md) |
| **B2-D03** Turn-0 replay for authoritative reconstruction; normal incremental new-turn updates allowed, no persisted checkpoints | **Accepted 2026-10-26 (revised Option A)** | [B2-D03 ADR](./decisions/B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md) |

### B2-D03 revision and subsequent acceptance history

**Originally revised proposal (subsequently accepted with the clarification below):** Reconstruct the relevant authoritative core and supported installed-module world state from the validated Turn-0 baseline, applying the **entire selected ordered event history from its beginning up to the desired active turn**, on each required authoritative reconstruction. Do not use persisted materialised snapshot/checkpoint acceleration or a historical replay-from-intermediate-state fast path. Story passage revisions/selection remain separate but authoritative inputs. No AI calls, random rerolls or irreversible external effects during replay. The missing/removed-plugin exception remains.

**Resolved by the explicit 2026-10-26 Option A approval:** “Every time” should mean **every authoritative reconstruction request** (opening an adventure, viewing a requested historical state, restoring after a canonical historical edit, or rebuilding after another state-changing commit), not every Svelte render, mouse interaction or passive read. An already computed in-memory projection may be used to display the exact same committed version without becoming a competing persisted canonical record. **Normal new turns may incrementally apply newly accepted events to an already valid state projection**, while any required authoritative reconstruction starts at Turn 0. No persisted checkpoints. This maintains the distinction between full-rebuild *policy* and ordinary nonauthoritative UI presentation caches.

**Trade-off:** Maximum conceptual simplicity and easy end-to-end correctness checks, but time/memory costs grow with adventure history length; performance limits should be made visible in tests. No checkpoint acceleration should be introduced without another explicit design review after acceptance.

The older IDEA-0042 staging direction allows *optional* snapshots but does not mandate their implementation, so the revised proposal stays consistent with it. No source idea has been edited for this pending review.

## Batch 2 — questions proposed for review, not yet accepted

- **B2-D04: ACCEPTED 2026-10-26; clarified later the same date.** [B2-D04 ADR](./decisions/B2-D04%20-%20Retained%20History%20and%20Suspended%20Unrepresentable%20Effects.md). **Keep Later Turns** retains both the edited passage's already accepted linked events **and** all subsequent passages/events, even when revised prose contradicts them. **Delete All After Point** removes subsequent passage/events from **active selection** (not required physical deletion of immutable audit); event effects of edited passage remain unless explicitly changed. The old suspension example was superseded by explicit user clarification.
- **B2-D05: ACCEPTED 2026-10-26.** [B2-D05 ADR](./decisions/B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md). One message/AI response creates one stable logical passage, and each accepted revision stores a **single schema-versioned structured JSON document in Go/SQLite**. Browser HTML/DOM is a view; model text is deterministic serialized output; noncanonical drafts are separate; events reference passage/revision IDs. **The original split/merge lineage proposal is superseded**, and explicit whole-passage split/merge semantics remain open rather than approved.
- **B2-D06: ACCEPTED 2026-10-26.** [B2-D06 ADR](./decisions/B2-D06%20-%20Versioned%20Event%20Contracts%20and%20Deterministic%20Compatibility.md). Explicit immutable event schema versions and deterministic compatibility handling for supported core/installed modules, preserving removed-plugin exception and reporting unrecognised core formats.

**B2-D04, B2-D05 and B2-D06 are accepted and recorded separately.** The original D05 split/merge ancestry proposal remains superseded by the independently approved structured passage document contract. **B2-D03 was subsequently approved on 2026-10-26 as revised Option A.** No staging ideas are promoted.

## Batch 3 — final decisions and closure assessment (2026-10-27)

| Decision | Review outcome | Source |
| --- | --- | --- |
| **B2-D07** Suspended event reinstatement | **Withdrawn as unnecessary; never accepted.** Later human clarification of D04 means Keep preserves existing accepted events (including those from the edited passage), while Delete All After Point excludes later passage/events from active canon. There is no ordinary automatic suspension/reinstatement feature. | [B2-D04 revised ADR](./decisions/B2-D04%20-%20Retained%20History%20and%20Suspended%20Unrepresentable%20Effects.md) |
| **B2-D08** Unsupported required core event replay | **Accepted, Option A, 2026-10-27.** Stop unsafe authoritative reconstruction/commits for affected adventure, preserve immutable history, allow safe read-only narrative diagnostics where feasible and leave unrelated adventures usable. | [B2-D08 ADR](./decisions/B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md) |

### B2 design closure assessment

**Assessment: the eight numbered review questions have reached a documented disposition**, not eight independent approvals: B2-D01 through D06 and D08 are accepted; D07 was deliberately withdrawn when the factual assumption underlying suspension was corrected. The accepted D04 clarification is authoritative over its initial suspended-effect proposal.

**Formally closed at design level on 2026-10-27** following explicit user approval. The closure authority is [P-B2-01](./decisions/P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md). No runnable game, schema integration, API contract, tests or staging-to-production promotion is claimed.

**Co-design contracts still for B3 and later refinement**, not reasons to invent further B2 product decisions:

- Exact event and passage JSON/SQL shapes, active-history membership and ordering, source revision provenance and commit envelope.
- Atomically selecting/truncating active history under expected adventure version/library epoch, Undo, independent Fork, multi-tab stale conflicts, failure/cancellation and backup maintenance fencing.
- Explicit event/state edit dependency and preflight integrity checks, together with non-destructive treatment of immutable audit history.
- Typed core-event-format compatibility errors, adventure-scoped fail-closed read-only response, and covered replay fixtures; continue honoring missing/removed-plugin exception.
- Exact structured passage editor schema/serialization, source links, whole-passage split/merge/reorder behaviour (not approved by D05).
- Full Turn-0 replay performance testing; no persisted replay checkpoints under D03.
- Integration gates deferred under [B1 design-only signoff](./Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md).

**Scope expressly excluded:** speculative AI-driven downstream re-evaluation after historical editing remains [unaccepted Inbox IDEA-0067](../inbox/AI-Assisted%20Downstream%20Story%20Re-Evaluation%20After%20Historical%20Edits.md), not part of selected replay. Any later acceptance follows separate idea gates.

## Decision history

- **2026-10-25:** User accepted B2-D01 and B2-D02, requested B2-D03 revision towards full Turn-0 rebuilding. Accepted choices stored in individual ADRs; D03 remains under review. Batch 2 topics listed for later human decision.

- **2026-10-26:** User explicitly accepted the **revised D05** proposal, replacing original ancestry-first recommendation with **structured, schema-versioned passage JSON as the sole canonical content**. Recorded [B2-D05 ADR](./decisions/B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md). D03 remains revision pending; D04 and D06 remain unapproved. No implementation or production promotion.

- **2026-10-26:** User confirmed D05 was already separately approved in the repository and selected **D04 Option A** and **D06 Option A**. Confirmed the prior B2-D05 structured-document ADR without altering it; recorded two new ADRs for D04 and D06. D03 remains revised/unapproved.

- **2026-10-26 — Revised D03 accepted:** User explicitly selected **B2-D03 Option A**, full Turn-0 replay when authoritative reconstruction is needed, while allowing incremental updates for normal new turns; no persisted checkpoints. Recorded [ADR](./decisions/B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md). User requested further explanation of **B2-D07**, so D07 and D08 remain unapproved.

- **2026-10-26 — Final historical-edit clarification:** Requesting user confirmed that **Keep Later Turns leaves all pre-existing selected events intact**, including those originally sourced from the revised passage, while **Delete All After Point removes all subsequent passage/event effects from active canon**. Confirmed that replay is deterministic reconstruction from recorded events, not AI re-evaluation. Previously approved B2-D04 Option A suspension semantics were narrowed/superseded in the D04 ADR with history preserved; suggested B2-D07 suspended-event reinstatement is **no longer needed** for ordinary history editing, and **B2-D08 remains unapproved**. Separately requested future downstream semantic evaluation/repair stored as **unaccepted Inbox IDEA-0067**; no stage promotion or model repair step approved.

- **2026-10-27 — D08 explicit acceptance and B2 closure assessment:** User selected **B2-D08 Option A** and requested recording plus closure review. Added [D08 ADR](./decisions/B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md), preserved D07's withdrawn status and D04's superseded original suspension decision. Seven ADRs accepted (D01–D06 and D08); **B2 ready for human design-level sign-off**, but not yet formally closed by the user; remaining B3 implementation/interface contracts explicitly listed above.

- **2026-10-27 — Formal design-only closure:** User explicitly approved closing B2 and proceeding to the first three B3 architectural decisions. [P-B2-01 closure ADR](./decisions/P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md) records closure, scope, deferred engineering and unexecuted integration gates. No B3 decision has been approved or implemented by this sign-off.
