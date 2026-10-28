---
type: architecture-decision
status: accepted
decision_id: "B4-D07"
phase: "B4"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
---

# B4-D07 — Fail-safe atomic event migration

## Approval
User explicitly selected **B4-D07 Option A** on 2026-10-28 in the B4 Batch 3 response (D07 A, D08 B, D09 A). Alternatives and the original proposal are preserved in the [B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md). No implementation or B4 closure was approved.

## Accepted decision — Option A
Migration of the shared library's current supported core event formats is **fenced and all-or-nothing**. If a required current core event cannot be safely converted, stop the upgrade without publishing partial schema or event changes. Preserve the existing durable library and its current events unchanged, report actionable incompatibility details, and permit a safe retry with compatible software or separately approved recovery. Do not silently skip, delete, neutralize, guess, or rewrite unsupported effects.

This refines [B4-D04](./B4-D04%20-%20Coordinated%20Migration%20of%20Current%20Event%20Schemas.md) Option B. Conversion is deterministic and meaning-preserving; event identities, ordering, references and player/story provenance survive. Go/SQLite controls maintenance/write fencing and transaction atomicity; browser TypeScript retains gameplay/replay authority. The previously accepted removed-plugin custom-state exception remains intact. No retained story revision/event archive is introduced.

## Alternatives
- **A — accepted:** Atomic migration, fail safely and report incompatible required core data.
- **B — not chosen:** Mixed per-adventure upgraded/old core formats in one shared library, increasing long-lived complexity.
- **C — rejected:** Drop unknown events or replace them with no-ops, risking silent state corruption.

## Deferred details
Exact database migration transaction, conversion runner location, crash recovery, backup/version compatibility, unsupported-format diagnostics and regression tests require engineering review. No runnable migration, automatic backup or stage promotion is implied.

## Decision history
- **2026-10-27:** Proposed Options A/B/C in B4 Batch 3, not accepted.
- **2026-10-28:** User explicitly accepted **D07 A**, while separately choosing D08 B and D09 A. Formal B4 closure was requested as an assessment only.
