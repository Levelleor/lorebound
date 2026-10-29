---
type: architecture-decision
status: accepted
decision_id: "B1-D03"
created: "2026-10-25"
updated: "2026-10-28"
approved_at: "2026-10-25"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
---

# B1-D03 — Gameplay and durable commit authority

## Subsequent accepted architectural supersession — 2026-10-28

**CURRENT AUTHORITY:** [B6-D01 — Narrative-first declarative outcome events](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), together with [B3-D04 — Single current history](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), supersedes earlier simulation-style event preconditions and prior immutable passage/event audit assumptions in this ADR. The engine primarily **tracks the fictional facts established by accepted narration and player corrections**. Events are ordered typed **Create/Remove, Set/Clear and keyed relation Add/Remove assertions**, not procedural transfers or movement operations that must prove historic source possession, prior introduction, prior route or fictional causality. A later accepted reference may construct a **sparse stable identity** when its old introduction has been removed; unspecified fields remain unknown. Preserve technical typed/supported-format, deterministic folding, version/epoch, atomic transaction and one-current-property safety. Only a **technically unprocessable** event fails closed; narrative contradiction does not. The original earlier approval and alternatives below are **historical provenance**, not permission to reinstate rejected prerequisites or old revision archives. Actual implementation remains unapproved.



## Decision status and provenance

**Accepted by the requesting user on 2026-10-25**, in the explicit first Pass B1 decision-batch reply ("B1-D03: accept"). Original proposal: [Pass B1 Architecture Foundations (Draft)](../Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md), §9. This approval refines the already accepted browser-coordinator / Go-SQLite responsibility division; it does not approve implementation.

## Context

Lorebound validates proposals in browser TypeScript but stores the authoritative adventure library in Go-managed SQLite. Multiple browser tabs can work from stale adventure revisions, and restoring a library must invalidate old writes. These risks cannot be resolved by browser validation or cross-tab notifications alone.

## Accepted decision

**Gameplay acceptance and durable commit acceptance are separate responsibilities.**

- **Browser TypeScript, S06:** Decides whether proposed operations/prose changes are acceptable under already approved player-authority, capabilities and domain validation rules. S05 prepares associated revision/history/provenance consequences.
- **Go/SQLite, S12:** Solely decides whether a fully prepared, previously gameplay-validated change set can be **durably and atomically committed**. Enforce expected-adventure-version checks, server-verified library epoch, global maintenance fence, transaction constraints and storage integrity; return success only after a complete commit.
- Reject stale/conflicting/maintenance-blocked transactions **without partial canonical prose, event or state writes**. Browser-side validity alone never means a commit succeeded.
- Go **must not** introduce another AI/gameplay/narrative validation stage or duplicate the TypeScript world-rule engine.
- After successful commit, other tabs may refresh; their notifications are not themselves proof that a transaction succeeded. Exact cross-tab notification semantics remain **B1-D04, still unapproved**.

## Example

Tabs A and B each read adventure revision 42. Tab A commits a fully validated change first and advances the adventure to 43. Tab B's prepared change still expects revision 42. Go rejects Tab B's attempt atomically; it cannot silently merge into revision 43 or partially append an event. Its proposed action must be revisited against fresh accepted state before a new commit attempt.

## Alternatives considered

1. **Accepted:** S06 gameplay acceptance with S12/Go atomic and optimistic-concurrency authority.
2. **Not chosen:** Browser-side state/write success treated as canon without server-authoritative commit.
3. **Not chosen:** Reimplement all gameplay-rule validation in Go, creating conflicting game authorities.

## Consequences and trust limitation

- **Benefits:** one gameplay rule engine; atomic narrative/state history; robust stale-tab and maintenance guards; deterministic durable revisions.
- **Cost:** prepared change-set and version/epoch contracts require careful B2/B3 design and conflict handling.
- **Explicit limitation:** Browser-side gameplay validation is an application architecture boundary, **not a hostile-client security guarantee**. Under accepted A-27 scope, Lorebound has no application login/authenticated-session framework. Basic localhost/Host/Origin filtering and server-side structural checks do not establish protection against arbitrary malicious local callers. Go's storage integrity checks are not an additional fictional/gameplay reviewer.
- **Not newly decided:** exact SQLite schema, request endpoints, idempotency mechanism, diff/event envelope and retry UX.
- **No implementation or verified security behaviour is claimed.**

## Traceability

Related owners: S06, S05, S12, S01 and S02; underlying ideas IDEA-0044, IDEA-0039, IDEA-0040, IDEA-0041, IDEA-0051, IDEA-0052 and IDEA-0053. Pass A audit: A-22, A-23, A-24, A-25, A-27. [Consolidated architecture](../Consolidated%20Subsystem%20Architecture.md).


## Decision history

- **2026-10-24:** B1-D03 proposed in the unapproved Pass B1 draft.
- **2026-10-25:** Requesting user explicitly accepted B1-D03 without changes, including the disclosed trust/security distinction. B1-D04 cross-tab semantics remain a separate pending decision.
