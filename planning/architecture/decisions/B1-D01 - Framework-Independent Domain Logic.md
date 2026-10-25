---
type: architecture-decision
status: accepted
decision_id: "B1-D01"
created: "2026-10-25"
updated: "2026-10-25"
approved_at: "2026-10-25"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
---

# B1-D01 — Framework-independent domain logic

## Decision status and provenance

**Accepted by the requesting user on 2026-10-25**, in the explicit first Pass B1 decision-batch reply ("B1-D01: accept"). This ADR records an architecture rule, **not** approval of any staging idea for production or authorisation to implement software. Original proposal: [Pass B1 Architecture Foundations (Draft)](../Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md), §9.

## Context

Lorebound uses SvelteKit/Svelte for UI, browser TypeScript for gameplay and replay, and Go/Wails v3 for privileged persistence and native services. Rules and reducers need to behave identically when invoked by ordinary gameplay, explicit Story authoring, typed UI actions and deterministic history reconstruction.

## Accepted decision

**Built-in domain rules, validators and state reducers should be ordinary, framework-independent TypeScript modules.**

- Do not import Svelte components/stores, Go/Wails service bindings or application browser globals inside core domain rule/reducer logic.
- Supply time, IDs, configuration, state and other environmental inputs through explicit values/interfaces as needed for deterministic behaviour.
- S10/S11 domain rules and S05 supported-state replay logic should be callable from isolated tests without a running Svelte UI or Go server.
- Application/integration modules remain free to use Svelte and Go adapters around the pure domain core.
- This describes dependency direction; it does **not** prescribe exact files, packages, public type names or a ban on all stateful application services.

## Alternatives considered

1. **Accepted:** Framework-independent TypeScript domain modules with adapters at boundaries.
2. **Not chosen:** Embed rules in Svelte stores/components or privileged Go service handlers. This would couple gameplay validity and replay to UI/runtime and encourage rule duplication.

## Consequences and limits

- **Benefits:** deterministic replay, isolated tests and consistent rule execution regardless of input source.
- **Cost:** explicit dependencies/interfaces and some adapter code.
- **Not newly decided:** exact reducer schemas, plugin isolation, whether events are replayed incrementally or from snapshots, final TypeScript package layout. These remain B2/B3/B4 detail.
- **No implementation is claimed.**

## Traceability

Related architecture owners: S05, S06, S10, S11, S04 and S12. Related accepted staging directions: IDEA-0039, IDEA-0042, IDEA-0044, IDEA-0047, IDEA-0053 and relevant domain idea notes. [Consolidated architecture](../Consolidated%20Subsystem%20Architecture.md).

## Decision history

- **2026-10-24:** B1-D01 proposed in the unapproved Pass B1 draft.
- **2026-10-25:** Requesting user explicitly accepted B1-D01 without changes. This ADR records the accepted scope; no other B1 proposal is accepted by implication.
