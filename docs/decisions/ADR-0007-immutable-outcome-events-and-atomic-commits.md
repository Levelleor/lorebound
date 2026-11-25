---
id: ADR-0007
type: adr
status: accepted
related:
- ADR-0042
- ADR-0017
- ADR-0008
- ADR-0009
- PRD-0040
- ADR-0003
- PRD-0041
- PRD-0043
- PRD-0045
- ADR-0001
- ADR-0006
supersedes: []
---

# Immutable Outcome Events and Atomic Commits

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B2-D01](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md) · approved at: 2026-10-25; approved by: requesting user (explicit chat approval)

Partially superseded by [ADR-0017](ADR-0017-single-current-history-without-revisions.md).

## Subsequent accepted architectural supersession — 2026-10-28

**CURRENT AUTHORITY:** [B6-D01 — Narrative-first declarative outcome events](ADR-0042-narrative-first-declarative-outcome-events.md), together with [B3-D04 — Single current history](ADR-0017-single-current-history-without-revisions.md), supersedes earlier simulation-style event preconditions and prior immutable passage/event audit assumptions in this ADR. The engine primarily **tracks the fictional facts established by accepted narration and player corrections**. Events are ordered typed **Create/Remove, Set/Clear and keyed relation Add/Remove assertions**, not procedural transfers or movement operations that must prove historic source possession, prior introduction, prior route or fictional causality. A later accepted reference may construct a **sparse stable identity** when its old introduction has been removed; unspecified fields remain unknown. Preserve technical typed/supported-format, deterministic folding, version/epoch, atomic transaction and one-current-property safety. Only a **technically unprocessable** event fails closed; narrative contradiction does not. The original earlier approval and alternatives below are **historical provenance**, not permission to reinstate rejected prerequisites or old revision archives. Actual implementation remains unapproved.



## Decision status and provenance

**Accepted by the requesting user on 2026-10-25** in B2 Batch 1: `B2-D01: accept`. The user separately accepted B2-D02 but requested **revision** of B2-D03. This ADR accepts **only D01**. It refines previously accepted IDEA-0039/0040/0042 directions and is **not** permission to implement from staging or promote any idea.

## Context

The accepted system records validated world-state mutations as immutable, append-only history and tracks story revisions at logical turn/passage level. An AI interpretation or player command cannot be the source of truth for what actually happened: later reconstruction cannot rerun an AI response, chance operation, rule evaluation or external effect.

## Accepted decision

**Model canonical state changes as structured, immutable, versioned *outcome events*, associated with an atomic durable commit.**

- An accepted event identifies itself and has a deterministically defined ordering, an event type and format/schema version, affected stable entity references, sufficient accepted outcome data for its supported deterministic reducer, and explicit origin/provenance.
- Provenance ties an event to the applicable committed passage ID and exact revision where relevant. **Manual canonical corrections and other non-narrative changes** also carry an identifiable source and durable audit provenance; do not invent a passage when no passage caused the event.
- An **atomic commit** groups the relevant accepted passage revisions, events and active-history consequences into one all-or-nothing Go/SQLite transaction, preserving B1-D03's expected-adventure-version and library-epoch requirements.
- Accepted outcome payloads represent the *result* of validation. A replay reducer applies those outcomes; it does **not** re-execute AI calls, reroll random decisions or re-check the past as if it were a new gameplay action.
- Existing events are not mutated to rewrite history; later accepted revisions/active selections may supersede their contribution to active canon without destroying historical records.
- No canonical state mutation in a supported core/installed-module domain may exist solely in a mutable projection outside covered accepted history. Explicitly retain the previously approved removed-plugin historical replay exception.

## Considered alternatives

1. **Accepted:** Typed/structured outcome events with immutable provenance and atomic commit grouping.
2. **Not selected:** Persisting only attempted *commands* and rerunning domain rule resolution on replay, potentially altering accepted outcomes under later rules or randomness.
3. **Not selected:** Duplicating complete world state as the sole canonical record each turn, losing distinct event/provenance auditability and making the event/history contract ambiguous.

## Consequences and design still open

- **Benefits:** deterministic traceability, reproducibility, clear editing provenance, separation between gameplay proposal and accepted outcome.
- **Costs:** event shapes need schemas/version compatibility, and grouped multi-entity outcomes need deterministic reducer semantics.
- **Open:** concrete event IDs/fields, exact event granularity, compound event representation, serializer/SQLite schemas, event migration rules, provenance for moved/split passages, and technically unrepresentable retained later outcomes (future B2 decisions).
- **Not approved by this ADR:** B2-D03 checkpoint or baseline-only replay policy. B2-D03 was marked **revise** in the same user reply.

## Traceability

Subsystems S05, S06, S10, S11, S12. Sources [IDEA-0039](../product/PRD-0040-event-sourced-world-history.md), [IDEA-0040](../product/PRD-0041-versioned-text-blocks-and-revision-ids.md), [IDEA-0042](../product/PRD-0043-snapshots-and-incremental-state-rebuild.md), [IDEA-0044](../product/PRD-0045-deterministic-adventure-coordinator.md); B1-D01, B1-D03 and B1-D06.


## Decision history

- **2026-10-25:** Proposed in the B2 first decision batch: immutable structured accepted outcome events with exact source and atomic grouping.
- **2026-10-25:** User explicitly approved `B2-D01: accept`, with no stated conditions. No implementation or staging-to-production promotion occurred.
