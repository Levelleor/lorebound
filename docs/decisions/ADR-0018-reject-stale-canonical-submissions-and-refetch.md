---
id: ADR-0018
type: adr
status: accepted
related:
- ADR-0017
- ADR-0019
- ADR-0003
- ADR-0004
- ADR-0015
supersedes: []
---

# Reject Stale Canonical Submissions and Refetch

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B3-D05](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) · approved at: 2026-10-27; approved by: requesting user (explicit chat approval)

## Approval and provenance

**Explicitly accepted Option A by the requesting user on 2026-10-27:** “Yes, lets get rid of revisions entirely, I don't think we need them. **And for D05 lets go with option A.**”

This accepts **B3-D05 Option A** from [B3 Batch 2 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md), separately from the same message's user-directed replacement of B3-D04. **B3-D06 was not approved.** This is architecture, not code, staging promotion or integration evidence.

## Context

Ordinary browser tabs can prepare canonical operations against the same adventure. One tab may commit first while another holds an older edit or generation proposal. B1-D03 gives Go/SQLite expected-adventure-version and library-epoch authority; B1-D04 makes cross-tab notifications invalidation hints, not canon. B3-D02 separately makes identical committed-operation retries idempotent. Under B3-D04's newer current-only history, a stale write could **overwrite or delete current passages/events**, so stale protection is especially important.

## Accepted decision — Option A

**Reject any new canonical commit prepared against a stale adventure version or library epoch, without mutating canon; refetch authoritative state and require a fresh user/coordinator decision before a new attempt.**

- Go/SQLite compares the expected adventure version and server-held library epoch under its maintenance fence in the same atomic transaction. A mismatch rejects the **entire** request; no partial prose, event, deletion, Undo or world-state effect is accepted.
- The client refetches current authoritative adventure/version/epoch and surfaces the conflict. It does **not** silently merge, rebase, re-run the original AI proposal as if it were still valid, overwrite newer passages or truncate turns committed by another tab.
- Preserve uncommitted player text or the latest successfully saved shared noncanonical draft **when still available**; do not promise recovery of drafts overwritten by another tab under existing last-write-wins semantics.
- The player/coordinator must make a **fresh decision based on current canon** before submitting a newly prepared canonical operation. A fresh attempt uses a new operation identity; a retry of the *same* already committed operation is instead governed by B3-D02 receipt semantics.
- Cross-tab invalidation/refetch may reduce the frequency of stale attempts, but missed notices cannot weaken the expected-version check.
- Do not introduce an exclusive adventure editing lock or a second Go gameplay validation engine.

## Alternatives considered

1. **A — Accepted:** Atomic stale rejection, refetch and deliberate fresh decision. **Trade-off:** occasional retry/review, reliable protection of current canon.
2. **B — Rejected:** Automatically rebase stale canonical operations and resubmit without fresh player confirmation. Could silently change the meaning of edits, Undo and Delete.
3. **C — Rejected:** Queue stale requests and apply in arrival order despite expected-version mismatches. Would accept changes against an unintended story state.

## Deferred engineering details

Exact error codes, UI conflict message, draft retention/debounce, notification transport, handling a lost success response under B3-D02 and maintenance/restore testing remain for contract refinement. **Adventure version counters are concurrency tokens, not historical passage revisions.** No implementation or tests are claimed.

## Traceability

[B3 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md); [B3-D02](ADR-0015-idempotent-canonical-commit-attempts.md), [B3-D04](ADR-0017-single-current-history-without-revisions.md), [B1-D03](ADR-0003-gameplay-and-durable-commit-authority.md), [B1-D04](ADR-0004-cross-tab-invalidation-and-refetch.md). Owners S01, S05, S06, S12.

## Decision history

- **2026-10-27 — Proposed, unapproved:** B3-D05 options A (reject/refetch/fresh decision), B (automatic rebase) and C (queue stale writes) presented.
- **2026-10-27 — Explicit approval:** User selected **B3-D05 Option A** in the same reply that replaced the B3-D04 revision/audit model. B3-D06 remains unapproved.
