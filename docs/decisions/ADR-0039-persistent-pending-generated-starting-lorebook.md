---
id: ADR-0039
type: adr
status: accepted
related:
- ADR-0040
- ADR-0041
- ADR-0036
- ADR-0020
- ADR-0031
- ADR-0037
- ADR-0015
- PRD-0067
supersedes: []
---

# Persistent Pending Generated Starting Lorebook

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B5-D07](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B5-D07%20-%20Persistent%20Pending%20Generated%20Starting%20Lorebook.md) · approved at: 2026-10-28; approved by: requesting user (explicit chat approval)

## Approval and provenance

**Explicit user acceptance on 2026-10-28:** “Review B5 Batch 3: B5-D07: A; B5-D08: A; B5-D09: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history, then assess B5 closure.”

This ADR records **B5-D07 Option A**, not a generic approval of future design choices, implementation, staging promotion or formal B5 closure. Original alternatives remain in the [B5 Batch 3 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). D08 and D09 have independent ADRs.

## Context

Under [B5-D04](ADR-0036-approved-optional-ai-starting-lorebook.md), an explicitly requested AI-authored starting Lorebook is a player-reviewable **noncanonical** proposal. It becomes current Turn-0 world setup only after validation and the player's explicit Approve/Commit. A complete model-generated world may be expensive to recreate after a reload, but saving the proposal must never be mistaken for accepting canon.

## Accepted decision — Option A

**Persist the latest complete, validated-but-unapproved generated starting Lorebook proposal as an adventure-scoped noncanonical pending draft in Go-managed SQLite. Restore it after reload for review and explicit Approve/Commit or Discard.**

- **Persist only review-ready proposals:** A complete, internally valid generated proposal may be durably saved as **pending**, not as an accepted Turn-0 world, story passage, or outcome event. Partial generation, stopped requests, invalid/incomplete model responses and unrelated failed operations are **not** persisted as ready-for-approval content under this rule.
- **Reload restoration:** When the player reopens the relevant adventure, restore the saved complete pending generated-world proposal, not a new AI generation. Show its pending-commit review UI and the accepted [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md) **semi-transparent full-chat-composer overlay**; no chat typing or sending until an explicit Approve/Commit or Discard resolves the proposal.
- **Player approval remains mandatory:** Draft save, reload, UI navigation, passage to another step, or time passing cannot auto-accept the AI-created world. Only a validated explicit Commit atomically applies supported entities, links, Lorebook data and Turn-0 initial state under the approved Go/SQLite version/epoch, maintenance and idempotency contract.
- **Check against current canon:** Persist the proposal's adventure identity and relevant base version/epoch. Refetch/check current canonical state and pending operation status before Commit. Never blindly apply an old generated-world proposal against a changed adventure; require a separately defined safe review/conflict path. [B4-D08](ADR-0031-discard-stale-pending-manual-drafts.md)'s automatic discard applies to externally stale **manual world-state** drafts, **not automatically to optional AI-authored generated-world proposals**.
- **Discard and success:** Explicit Discard clears the pending generated-world proposal without altering existing Turn-0 baseline, previously committed lore or narrative. Confirmed durable success clears/reconciles the pending proposal and permits normal chat. An uncertain Commit response must first be reconciled with its original durable operation receipt, not treated as a failed generation or quietly discarded.
- **Single current story:** This proposal is a pending **draft**, not a preserved world-history revision, fork, synthetic turn or competing authoritative world projection. Turn-0 replay and ordinary gameplay must not consume unapproved content.

## Alternatives and trade-offs

1. **Option A — accepted:** Persist the complete, ready-for-review pending generated proposal as noncanonical SQLite draft. Resilient to reload, additional draft lifecycle and validation cost.
2. **Option B — rejected:** Browser-memory-only pending proposals, which can lose expensive completed world generation on refresh.
3. **Option C — rejected:** Auto-commit the pending generated world on reload, contrary to explicit player approval.

## Deferred implementation details

Exact draft storage shape, retention/cleanup, multiple interrupted requests, editable preview scope, multi-tab contention, staleness after library restore, model-budget UI, validation-stage distinction and error recovery are still detailed engineering/UI work. Do not infer the manual correction draft policy wholesale or promise implemented functionality.

## Traceability

[B5 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md); [B5-D04](ADR-0036-approved-optional-ai-starting-lorebook.md), [B5-D05](ADR-0037-preserve-baseline-on-setup-failure-and-cancellation.md), [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md), [B3-D02](ADR-0015-idempotent-canonical-commit-attempts.md), [IDEA-0066](../product/PRD-0067-ai-generated-starting-lorebook-and-world.md). Owners S02/S04/S05/S06/S09/S12.

## Decision history

- **2026-10-28 — Prior approved B5-D04:** User chose explicit approval of optional generated starting Lorebook; persistence of completed pending proposal was still open.
- **2026-10-28 — Original B5-D07 proposal:** A SQLite persistence of complete pending proposal (recommended), B memory only, C auto-approve on reload. All three initially unaccepted.
- **2026-10-28 — Explicit selection:** User accepted **B5-D07 A**, alongside separately accepted B5-D08 A and B5-D09 A; requested closure **assessment**, not formal sign-off.
