---
type: architecture-decision
status: accepted
decision_id: "B1-D06"
created: "2026-10-25"
updated: "2026-10-28"
approved_at: "2026-10-25"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
---

# B1-D06 — Browser TypeScript event replay

## Subsequent accepted architectural supersession — 2026-10-28

**CURRENT AUTHORITY:** [B6-D01 — Narrative-first declarative outcome events](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), together with [B3-D04 — Single current history](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), supersedes earlier simulation-style event preconditions and prior immutable passage/event audit assumptions in this ADR. The engine primarily **tracks the fictional facts established by accepted narration and player corrections**. Events are ordered typed **Create/Remove, Set/Clear and keyed relation Add/Remove assertions**, not procedural transfers or movement operations that must prove historic source possession, prior introduction, prior route or fictional causality. A later accepted reference may construct a **sparse stable identity** when its old introduction has been removed; unspecified fields remain unknown. Preserve technical typed/supported-format, deterministic folding, version/epoch, atomic transaction and one-current-property safety. Only a **technically unprocessable** event fails closed; narrative contradiction does not. The original earlier approval and alternatives below are **historical provenance**, not permission to reinstate rejected prerequisites or old revision archives. Actual implementation remains unapproved.



## Decision status and provenance

**Accepted by the requesting user on 2026-10-25**, in the explicit second Pass B1 decision batch ("B1-D06: accept", followed by "Agreed on all"). Original proposal: [Pass B1 Architecture Foundations review](../Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md). This is an architectural runtime allocation, not an implementation approval.

## Context

Lorebound uses an append-only record of accepted operations and revisions and reconstructs the current state from a selected active history. Core rule/reducer logic is independent of Svelte/Wails by accepted [B1-D01](./B1-D01%20-%20Framework-Independent%20Domain%20Logic.md). Go/SQLite owns durable storage but does not run a second gameplay engine.

## Accepted decision

**The S05 deterministic history replay/reconstruction logic executes in browser TypeScript using framework-independent domain reducers.**

- Go/SQLite retains authoritative baselines, history, events, active-history selection and optionally persisted derived checkpoints. It supplies the relevant recorded data to S05 through the accepted narrow service boundary.
- S05 uses the **same supported TypeScript event/reducer semantics** as normal domain logic for reconstruction, respecting deterministic order, accepted revisions and active-head selection.
- Go does **not** duplicate gameplay-specific event reducers or reconstruct world rules through a second Go engine. Its responsibility is consistent reads, atomic persistence, version/epoch integrity and library maintenance.
- Optional snapshots/checkpoints and paginated history can **accelerate** replay, but snapshots are derived and cannot replace missing authoritative history for supported records.
- Replay does **not** rerun model generation or irreversible external side effects.
- The previously accepted **removed/disabled plugin exception remains**: if plugin-specific reducers are unavailable, continuing play does not require migration, emulation, historical custom-state reconstruction or reinstalling that plugin. Preserve recorded prose/history non-destructively where feasible and maintain core data integrity.

## Alternatives considered

1. **Accepted:** S05 pure TypeScript reducers in the browser with Go-provided durable history/checkpoints.
2. **Not chosen:** Gameplay event replay implemented solely in Go, requiring another rules/reducer implementation.
3. **Not chosen:** Independently maintained full gameplay replay implementations in both TypeScript and Go.

## Consequences and limits

- **Benefits:** consistent gameplay/replay semantics, isolated TypeScript tests and no duplicated Go rules engine.
- **Trade-off:** browser-side processing and history transfer require careful performance strategy for long adventures; derived checkpoints and incremental reconstruction can help.
- **Not newly decided:** event shapes/schema versions, checkpoint cadence, paginating APIs, cross-version migration policy, invalid historical-event representation, exact reconstruction algorithms or handling technically unrepresentable retained events in Keep Later Turns. These remain B2/B3 design.
- **No implementation or replay test result is claimed.**

## Traceability

Logical owners S05, S06, S10, S11 and S12; staging IDEA-0039, IDEA-0040, IDEA-0041, IDEA-0042, IDEA-0044, IDEA-0047, IDEA-0051, IDEA-0055. Pass A audit A-06, A-07 and A-10. [Consolidated architecture](../Consolidated%20Subsystem%20Architecture.md).


## Decision history

- **2026-10-24:** B1-D06 proposed in Pass B1 draft, unapproved.
- **2026-10-25:** Requesting user explicitly accepted B1-D06 without modification. This ADR records only that decision.
