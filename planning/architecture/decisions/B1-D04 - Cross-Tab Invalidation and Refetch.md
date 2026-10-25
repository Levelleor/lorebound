---
type: architecture-decision
status: accepted
decision_id: "B1-D04"
created: "2026-10-25"
updated: "2026-10-25"
approved_at: "2026-10-25"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
---

# B1-D04 — Cross-tab invalidation and refetch

## Decision status and provenance

**Accepted by the requesting user on 2026-10-25**, in the explicit second Pass B1 decision batch ("B1-D04: accept", followed by "Agreed on all"). The proposal and alternatives were presented in the [Pass B1 Architecture Foundations review](../Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md). This is an **architecture decision**, not an approval of implementation or a staging-to-production promotion.

## Context

Multiple ordinary-browser tabs may show or edit the same adventure without an exclusive editing lease. Go/SQLite owns canonical commits and expected-version conflict checks (accepted [B1-D03](./B1-D03%20-%20Gameplay%20and%20Durable%20Commit%20Authority.md)). Different tabs can display an older read model, and cross-tab communication may be delayed, reordered or missed.

## Accepted decision

**Cross-tab change notifications are invalidation hints; each tab refetches authoritative state/version from Go before relying on updated data.**

- When an accepted commit changes an adventure or relevant library state, the host may signal the change to other browser tabs; clients treat it as a reason to refresh, **not as the committed state itself**.
- The Go/SQLite transaction result and server-held adventure version/library epoch remain authoritative. Even if a notification is missed, a stale canonical write must fail the server's expected-version/epoch checks, not silently merge or partially commit.
- Do not introduce an authoritative mutable state bus between tabs, client-side consensus or an ordinary exclusive edit lease.
- Respect accepted **noncanonical draft** semantics separately: a shared, latest-successfully-saved value per logical target with last-write-wins across tabs; draft saves do not bypass maintenance fencing or produce canonical events.

## Alternatives considered

1. **Accepted:** Invalidation notification followed by authoritative refetch.
2. **Not chosen:** Distribute authoritative state deltas between tabs and assume ordering/delivery guarantees. Although this may save reads, missed or reordered messages complicate correctness.
3. **Not chosen:** Exclusive single-tab editing lock. This conflicts with the accepted normal multi-tab optimistic-concurrency model.

## Consequences and limits

- **Benefits:** one authoritative storage/version source, simpler client synchronisation, resilience to missed notices, no new collaboration engine.
- **Trade-off:** a tab may briefly display stale data until it refetches; extra reads can occur.
- **Not newly decided:** notification transport, event names, reconnection policy, refresh granularity, UI conflict messages or exact read API. These remain later interface/implementation design.
- **No application code, tests or operational validation are claimed.**

## Traceability

Logical owners S01 (host), S04 (presentation), S05 (history), S06 (coordinator) and S12 (storage). Accepted idea directions: IDEA-0003, IDEA-0005, IDEA-0044, IDEA-0051, IDEA-0053. Pass A audit A-21, A-22, A-23 and A-25. [Consolidated architecture](../Consolidated%20Subsystem%20Architecture.md).

## Decision history

- **2026-10-24:** B1-D04 proposed in Pass B1 draft, unapproved.
- **2026-10-25:** Requesting user explicitly accepted B1-D04 without modification. This ADR records only that decision.
