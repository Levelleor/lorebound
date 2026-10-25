---
type: architecture-decision
status: accepted
decision_id: "B1-D02"
created: "2026-10-25"
updated: "2026-10-25"
approved_at: "2026-10-25"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
---

# B1-D02 — Coordinator and service dependency direction

## Decision status and provenance

**Accepted by the requesting user on 2026-10-25**, in the explicit first Pass B1 decision-batch reply ("B1-D02: accept"). Original proposal: [Pass B1 Architecture Foundations (Draft)](../Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md), §9. This approval is architectural only.

## Context

AI generation requires selected world/context data; gameplay coordination requires provisional AI output; domain rules and history must be invoked by the coordinator. Direct mutual imports create cycles and invite AI providers, plugins and UI features to assume independent canonical authority.

## Accepted decision

**S06 remains the single deterministic gameplay authority.** Dependencies between S06, S07 AI workflows and domain/history services will be assembled using explicit service contracts and thin application composition/orchestration rather than circular module imports.

- S07 owns execution of the **already accepted configurable generation strategies**, request stages and provisional responses. AI workflows **return data/proposals**, never commit canonical history or domain state.
- S06 owns gameplay permission checks, domain validation, dispatch, canonical acceptance decisions and preparation/finalisation of approved changes, using S10/S11 rules and S05 history services.
- A thin application-level composition boundary wires services and invokes the selected workflow without becoming another gameplay engine, another model reviewer or a new logical subsystem.
- UI and external model/provider adapters do not bypass S06 to mutate canon.
- The exact invocation sequence can differ under already accepted pipeline strategies; no new AI validation stage is authorised.

## Alternatives considered

1. **Accepted:** Explicit dependency contracts and application composition, with S06 as gameplay authority and S07 providing provisional generation.
2. **Not chosen:** Mutual direct imports or AI/plugin-owned commits, creating cycles and incompatible authorities.
3. **Not chosen:** A second independent orchestration engine/review gate duplicating S06 or generation strategies.

## Consequences and limits

- **Benefits:** extensions remain replaceable; AI failure/cancellation cannot make authoritative writes; testable contracts reduce coupling.
- **Cost:** a small amount of wiring/contract code and careful distinction between generation-stage orchestration and gameplay coordination.
- **Not newly decided:** specific APIs, exact phase ordering, type definitions, plugin sandbox, or B2/B3 commit payloads.
- **No implementation is claimed.**

## Traceability

Related owners: S06, S07, S09, S10, S11, S05, with S03/S04 inputs and S12 persistence. Related staged directions: IDEA-0018, IDEA-0019, IDEA-0044, IDEA-0045, IDEA-0046, IDEA-0047 and IDEA-0055. [Consolidated architecture](../Consolidated%20Subsystem%20Architecture.md).

## Decision history

- **2026-10-24:** B1-D02 proposed in the unapproved Pass B1 draft.
- **2026-10-25:** Requesting user explicitly accepted B1-D02 without changes, including the previously presented constraint that application orchestration remain thin and introduce no extra AI validation stage.
