---
type: architecture
status: in-review
phase: "B2"
created: "2026-10-25"
updated: "2026-10-26"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
---
# Pass B2 — Canonical History Decision Review

## Scope and authority

This note tracks architectural review only. [B1 design closure](./Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md) and [Pass A audit](./Pass%20A%20Closure%20Audit.md) remain authoritative for established scope. All 52 accepted ideas remain staging. Only individually accepted decisions become ADRs, and technical details not yet accepted remain proposals.

## Batch 1 — explicit user decisions, 2026-10-25

| Decision | Review status | Authoritative source |
| --- | --- | --- |
| **B2-D01** Structured immutable outcome events grouped by atomic commits | **Accepted** | [B2-D01 ADR](./decisions/B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md) |
| **B2-D02** Immutable audit/history and one explicit active-history selection per adventure | **Accepted** | [B2-D02 ADR](./decisions/B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md) |
| **B2-D03** Reconstructing current/historical state | **Revision requested; not accepted** | User: "**For d03 let's actually keep it simple and rebuild the entire state every time from 0 turn**." This supersedes the assistant's proposed checkpoint-accelerated approach **as the user's preference for further review**, not an accepted ADR. |

### B2-D03 revised design for next approval

**Proposed, not yet accepted:** Reconstruct the relevant authoritative core and supported installed-module world state from the validated Turn-0 baseline, applying the **entire selected ordered event history from its beginning up to the desired active turn**, on each required authoritative reconstruction. Do not use persisted materialised snapshot/checkpoint acceleration or a historical replay-from-intermediate-state fast path. Story passage revisions/selection remain separate but authoritative inputs. No AI calls, random rerolls or irreversible external effects during replay. The missing/removed-plugin exception remains.

**Clarification for later approval:** “Every time” should mean **every authoritative reconstruction request** (opening an adventure, viewing a requested historical state, restoring after a canonical historical edit, or rebuilding after another state-changing commit), not every Svelte render, mouse interaction or passive read. An already computed in-memory projection may be used to display the exact same committed version without becoming a competing persisted canonical record. **Whether new turns must force a complete replay from Turn 0, rather than incrementally applying their newly accepted events, must be confirmed in D03 review**; the literal user wording suggests full replay, but is recorded as a question rather than silently adding a stronger decision. This maintains the distinction between full-rebuild *policy* and ordinary nonauthoritative UI presentation caches.

**Trade-off:** Maximum conceptual simplicity and easy end-to-end correctness checks, but time/memory costs grow with adventure history length; performance limits should be made visible in tests. No checkpoint acceleration should be introduced without another explicit design review after acceptance.

The older IDEA-0042 staging direction allows *optional* snapshots but does not mandate their implementation, so the revised proposal stays consistent with it. No source idea has been edited for this pending review.

## Batch 2 — questions proposed for review, not yet accepted

- **B2-D04:** How to represent retained later outcomes when an earlier edited passage removes a technically necessary entity/reference. Suggested alternatives: deterministic integrity-preserving suspended event effect with explicit visible status (preferred for preserving later story/outcome audit), atomic rejection of entire Keep operation, or synthetic repair (disallowed by Pass A's no-inference repair rule). Needs careful distinction between fictional contradictions and unrepresentable data.
- **B2-D05: ACCEPTED 2026-10-26.** [B2-D05 ADR](./decisions/B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md). One message/AI response creates one stable logical passage, and each accepted revision stores a **single schema-versioned structured JSON document in Go/SQLite**. Browser HTML/DOM is a view; model text is deterministic serialized output; noncanonical drafts are separate; events reference passage/revision IDs. **The original split/merge lineage proposal is superseded**, and explicit whole-passage split/merge semantics remain open rather than approved.
- **B2-D06:** Event schema/reducer evolution. Suggested approach: versioned event schemas with deterministic pure reducers and explicitly versioned compatibility/upcast handling for *supported core/installed modules*, without enforcing plugin-removal migration/replay. Reject unsupported ambiguous payloads rather than silently reinterpreting them.

**D04 and D06 remain proposed and unapproved; D05 is explicitly approved by the requesting user.** No staging ideas are promoted.

## Decision history

- **2026-10-25:** User accepted B2-D01 and B2-D02, requested B2-D03 revision towards full Turn-0 rebuilding. Accepted choices stored in individual ADRs; D03 remains under review. Batch 2 topics listed for later human decision.

- **2026-10-26:** User explicitly accepted the **revised D05** proposal, replacing original ancestry-first recommendation with **structured, schema-versioned passage JSON as the sole canonical content**. Recorded [B2-D05 ADR](./decisions/B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md). D03 remains revision pending; D04 and D06 remain unapproved. No implementation or production promotion.
