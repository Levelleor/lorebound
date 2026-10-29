---
type: architecture-decision
status: accepted
decision_id: "B3-D01"
phase: "B3"
created: "2026-10-27"
updated: "2026-10-28"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - transaction-contracts
  - architecture-decision
---

# B3-D01 — Prepared atomic canonical commit envelope

## Later accepted narrative-first event semantics — 2026-10-28

**Current governing architecture:** [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). Persistent world events primarily **remember the world as established by accepted narration and explicit player corrections**. They are **declarative, typed current-fact assertions** (Set/Clear, Create/Remove, keyed relation Add/Remove), not transfer/movement procedures whose fictional source state must be proven. Order and the latest supported assertion determine current projected holder, location, status and relationships. A historical edit may remove the introduction of an item or character without making later established facts invalid; sparse stable identity and unknown former details are permitted. Retain deterministic representability, technically valid types/IDs, one projected physical placement per item, transactional atomicity, version checks and required-core format failures. **No old story/event revisions**, no automatic AI repair, no extra manual Quick Start approval. This later choice supersedes broad simulation-style validation phrasing in original approval history below, without rescinding its unrelated accepted design.



## Approval and provenance

**Accepted Option A by the requesting user on 2026-10-27** in the explicit B3 Batch 1 reply: `B3-D01: A`, `B3-D02: A`, `B3-D03: A`. The request was to record only explicitly accepted choices as GitHub ADRs, preserve approval history and present Batch 2. Source proposal: [Pass B3 review](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md). This ADR records **D01 only**, not blanket acceptance of future B3 decisions or implementation.

## Context

B1-D03 separates browser TypeScript S05/S06 gameplay acceptance from Go/SQLite S12 durable commit acceptance. B1-D05 restricts the browser-to-Go interface to task-oriented operations. B2-D01/D02/D05 require immutable typed outcome events, versioned passage revisions and one active history selection. A single accepted operation may affect all of them; partial success is forbidden.

## Accepted decision — Option A

**The browser submits one typed, complete, prepared canonical-commit request for each logical canonical change, and Go accepts or rejects the entire transaction atomically.**

- The envelope identifies the target adventure, **expected adventure version**, **current library epoch**, **canonical operation kind**, **unique logical operation/attempt identity**, and the operation's complete prepared durable changes.
- Depending on operation kind, the payload includes new immutable schema-versioned structured passage revisions, accepted outcome events, explicit changes to the active-history selection/head, and appropriate origin/provenance. Do not fabricate passage origins for manual corrections.
- **S06 TypeScript** decides gameplay and narrative validity using the already accepted generation/validation cycle; **S05 TypeScript** prepares history/event/selection consequences. Go **does not** rerun AI, decide fictional logic or become a parallel gameplay engine.
- **S12 Go/SQLite** enforces permitted request shape, stable IDs and referential/storage constraints, expected adventure version, library epoch, global maintenance fencing and transactional integrity. All required changes either durably commit together or leave canon unchanged. Success is returned only for a complete durable commit.
- Canonical prose, event and active-history writes are **not** exposed as independently successful public service calls. Ordinary reads, noncanonical draft autosaves, whole-library backup/restore, host lifecycle and credential services remain separate narrow task-oriented operations.
- A prepared commit is a **previously validated accepted outcome proposal**, not a command to rerun randomness, provider requests or game validation inside Go.
- The operation identity's durable replay/idempotency semantics are decided separately by [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md).

## Alternatives considered

1. **A — Accepted:** Single typed canonical envelope and one atomic durable transaction. Requires a carefully defined cross-language contract but prevents partial canonical success.
2. **B — Rejected:** Multiple separate browser calls for prose/events/selection plus compensating cleanup. Mid-sequence failures could leave inconsistent canon.
3. **C — Rejected:** Generic browser-supplied SQL or unrestricted transaction surface. Violates the narrow privileged service boundary and weakens storage invariants.

## Consequences and deferred details

Exact Go/Wails binding names, TypeScript types, envelope variants, SQLite table/column definitions, event granularity, commit ordering and serialization are **not approved by this ADR**. Storage-integrity checks are not a security guarantee against hostile local callers or trusted local plugins. No implementation or integration testing is claimed.

## Traceability

[B3 Batch 1 proposal](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md); [B1-D03](./B1-D03%20-%20Gameplay%20and%20Durable%20Commit%20Authority.md), [B1-D05](./B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md), [B2-D01](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md), [B2-D02](./B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md), [B2-D05](./B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md), [P-B2-01](./P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md). Owners S05, S06, S12.

## Decision history

- **2026-10-27 — Proposed, unapproved:** B3 Batch 1 presented Option A (one prepared typed atomic envelope), B (separate writes) and C (generic transaction/SQL endpoint).
- **2026-10-27 — Explicit approval:** User selected **B3-D01: A**. D02 and D03 were approved independently in the same message. No B3 Batch 2 proposal, code or staging promotion was approved.
