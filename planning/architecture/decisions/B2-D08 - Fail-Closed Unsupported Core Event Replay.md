---
type: architecture-decision
status: accepted
decision_id: "B2-D08"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
  - architecture-decision
---

# B2-D08 — Fail-closed handling of unsupported core events

## Approval and provenance

**Explicitly accepted by the requesting user on 2026-10-27:** “B2-D08: Accept Option A. Record the decision in the Lorebound GitHub ADRs, preserve approval history, and then assess B2 closure.”

The approved option was **A: Stop unsafe reconstruction of affected authoritative state; preserve stored history and enable safe recovery**. This is an architectural failure policy, not implemented software, tested compatibility or approval of any new recovery feature.

## Context

[B2-D01](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md) stores immutable, typed, accepted outcome events. [B2-D06](./B2-D06%20-%20Versioned%20Event%20Contracts%20and%20Deterministic%20Compatibility.md) requires explicit event-format versions and deterministic TypeScript compatibility handling for supported historical core events. [B2-D03](./B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md) reconstructs from the Turn-0 baseline and active selected history, without persisted replay checkpoints.

If reconstruction encounters an **unsupported required core event type/version**, an invalid payload or an event for which no safe deterministic interpretation exists, the engine cannot establish authoritative state after that point. A later event may depend on the unrecognised change, so simply skipping it may silently corrupt inventory, identities, locations or other world invariants.

This is a software/data-compatibility failure, **not** a fictional contradiction induced by an author choosing Keep Later Turns. The latter intentionally preserves previously accepted events, even if revised prose disagrees ([B2-D04](./B2-D04%20-%20Retained%20History%20and%20Suspended%20Unrepresentable%20Effects.md)).

## Accepted decision — Option A

**Fail closed for the affected adventure's authoritative world-state reconstruction and dependent canonical writes when a required core event cannot be deterministically interpreted.**

- Stop that attempted authoritative replay at the first unsupported/invalid **required core** event; **do not** silently skip it, invent its meaning, emit a partial authoritative projection, or continue accepting canonical gameplay commits against an incomplete reconstructed state.
- Preserve all existing durable passage revisions, historical events, active-history selection, original event payloads and audit provenance **unchanged**. A failed read/replay is not permission to delete or rewrite accepted history.
- Report an actionable, non-technical-player-readable error and diagnostic information such as adventure, relevant turn/commit, event identifier/type and schema version where safely available. Do not expose provider secrets or unnecessarily dump sensitive content.
- Scope this failure to the **affected adventure** (or narrower state view where safely independent); do **not** treat one adventure's incompatible core event as requiring a global freeze of otherwise healthy independent adventures within the same SQLite library.
- Permit safe **read-only access to stored narrative records and diagnostic information when they can be read independently and correctly**. Do not present partial/recovered world state as valid canon. Safe read-only access is conditional on data/schema readability, not a promise of universal recovery.
- Recovery may consist of installing software with a compatible interpreter or following a separately defined safe data-repair/recovery procedure. The current approved backup scheme only supports **whole-library SQLite backup/restore**, not per-adventure file import or an invented repair tool. Do not automatically rewrite history or run a model to repair the record.
- Keep the separately accepted **removed/disabled optional plugin** exception: an absent plugin does **not** require replay/migration of its unavailable custom historical state. An **unsupported required core** event is materially different from intentionally unsupported removed-plugin state.
- Successful deterministic compatibility handling under B2-D06 takes precedence. This D08 policy is for genuine required-core incompatibility that cannot be handled safely.

## Alternatives considered

1. **Option A, accepted:** Stop unsafe authoritative reconstruction/writes for affected adventure; preserve data and expose diagnostics/safe recovery paths.
2. **Option B, not chosen:** Publish or continue with partial world state, warnings or speculative skipping of required core events. This risks compounding downstream mistakes and would need a separately designed degraded-state authority model.

## Consequences and open implementation details

- **Benefit:** Preserves accepted history and avoids new commits derived from state whose completeness cannot be established.
- **Cost:** The affected adventure may be temporarily unavailable for gameplay until a compatible interpreter or approved recovery route exists.
- **Open engineering detail:** Exact typed replay errors, affected-adventure isolation, projection invalidation, read-only UI details, compatibility fixtures/migration procedures and observability tests belong to B2/B3 refinement and eventual approved implementation.
- **Not approved:** A new cross-adventure repair service, per-adventure import, automatic data migration, app-wide shutdown for unrelated adventures, or any production promotion.

## Traceability

Logical owners S05, S06, S10, S11, S12. Relevant sources: [IDEA-0039](../../staging/Event-Sourced%20World%20History.md), [IDEA-0042](../../staging/Snapshots%20and%20Incremental%20State%20Rebuild.md); B1-D03/B1-D06; B2-D01, B2-D02, B2-D03, B2-D04, B2-D05 and B2-D06. Pass A A-07 and A-10.

## Decision history

- **2026-10-26:** B2-D08 offered as two alternatives after the B2 event-version and historical-edit decisions: **A** fail closed, preserving history/recovery; **B** attempt partially reconstructed state with degraded warnings. The proposal was explicitly unapproved at that time.
- **2026-10-27:** Requesting user explicitly accepted **Option A** and instructed GitHub ADR recording and a B2 closure assessment. The approval does not imply actual tests or implementation.
