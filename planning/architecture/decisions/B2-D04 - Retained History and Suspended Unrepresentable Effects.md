---
type: architecture-decision
status: accepted
decision_id: "B2-D04"
created: "2026-10-26"
updated: "2026-10-26"
approved_at: "2026-10-26"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
  - architecture-decision
---

# B2-D04 — Retained history and suspended unrepresentable effects

## Approval and provenance

**Accepted by the requesting user on 2026-10-26**: “For D04 lets go with A,” selecting the recommended option from the second Pass B2 decision batch. The user also approved B2-D06 option A and confirmed that B2-D05 was **already accepted separately** as [Canonical Structured Passage Documents](./B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md). This ADR records **D04 only**, without modifying B2-D05 or treating B2-D03 as approved.

This is an accepted architecture rule, not proof of code, implementation approval or a staging-to-production promotion.

## Context

IDEA-0041 and A-06 explicitly permit players to revise an earlier story passage and choose **Keep Later Turns** even if later narrative/outcomes no longer follow from the changed fiction. The player, not a model or automatic repair system, owns fictional continuity repairs. B2-D01 records immutable accepted outcome events; B2-D02 keeps one active selection over immutable history.

A narrowly different issue occurs when a retained later outcome cannot be **structurally represented** under the edited active history. Example: a retained transfer of item ID `key-7` now refers to a missing entity after an earlier item-creation event is no longer active. The problem is referential/structural integrity, **not merely implausible storytelling**.

## Accepted decision: Option A

**Preserve the later accepted story and the original outcome/audit event records; deterministically suspend only the state effects that cannot be safely applied to the reconstructed state.**

- Distinguish **fictional discontinuity** (permitted by Keep Later Turns) from **actual technical nonrepresentability** (invalid required IDs, incompatible unique placement/containment, unsupported or structurally incoherent core state). Do not suspend an event solely because its fiction is surprising or no longer explained.
- Preserve the original **immutable** accepted event, payload, order, exact source passage/revision and original successful acceptance provenance. It remains historical fact about what was previously accepted; it must **not** falsely appear as an effect currently applied to active world state.
- For the **current selected active history and reconstructed state**, record or compute a deterministic, auditable **unapplied/suspended effect status with a concrete structural reason**. Display a clear, nonblocking technical indication so the player knows what state effect is missing without inventing an AI contradiction-warning or story-repair workflow.
- Continue replaying other **independently representable** accepted effects when safe. If a later effect also requires an unavailable prerequisite, it too must be handled deterministically instead of silently applying invalid data. Never partially apply a multi-entity event or compromise stable IDs/unique custody and referential integrity.
- Never fabricate missing items, people, facts or event outcomes; never rerun AI, rewrite later prose, invoke a second gameplay-review stage or automatically repair the story.
- A player can issue a **separate, explicit, validated and historied manual correction** that can make the world state representable. Whether previously suspended effects become eligible for deterministic replay after such a correction, and the exact UI/action for reinstatement, remain later contract details; no surprise automatic state-changing repair is approved.
- The history-selection change and any persisted suspension/derived-state metadata must be committed or invalidated coherently under the accepted Go atomic expected-version/library-epoch rules. The active projection must never report a suspended transfer as applied.
- The separate approved removed-plugin exception remains: absent plugin-specific historical state need not be reconstructed/migrated.

## Alternatives considered

1. **Option A, accepted:** Retain later prose and events; visibly suspend only structurally unrepresentable effects in the current reconstructed state.
2. **Option B, not selected:** Reject the entire confirmed Keep Later Turns operation whenever a later effect cannot currently replay. This blocks already approved authorial freedom for avoidable structural edge cases.
3. **Option C, not eligible under existing acceptance:** Automatically invent missing prerequisites or infer repairs with AI.

## Consequences and unresolved engineering details

- **Benefits:** preserves user-selected later story and accepted historical provenance, without corrupting current canonical state or inferring compensating facts.
- **Costs:** needs explicit status/provenance for unapplied effects, deterministic dependency/error propagation and informative user messaging.
- **Still open:** status encoding (persisted vs reproducibly derived), dependency traversal, exactly when a subsequent explicit manual edit permits reapplication, bulk-event granularity, and consistent Go commit envelope/validation (B2/B3).
- **Not settled:** the B2-D03 replay-from-Turn-0 policy; it is a separately revised proposal and is **not accepted** by D04.

## Traceability

Related owners S03, S05, S06, S10, S11, S12. Sources: [IDEA-0039](../../staging/Event-Sourced%20World%20History.md), [IDEA-0041](../../staging/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md), [IDEA-0042](../../staging/Snapshots%20and%20Incremental%20State%20Rebuild.md), [B2-D01](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md), [B2-D02](./B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md), [B2-D05](./B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md), Pass A A-06 and A-10.

## Decision history

- **2026-10-25:** D04 proposed for review: choose an integrity-preserving deterministic fallback for technically unrepresentable retained later events, not fictional continuity disagreements.
- **2026-10-26:** User explicitly approved **D04 Option A**. No additional AI repairs, stage promotion or implementation were approved.
