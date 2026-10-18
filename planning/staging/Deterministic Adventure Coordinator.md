---
id: "IDEA-0044"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Deterministic Adventure Coordinator

## Idea
Use a non-LLM TypeScript coordinator to orchestrate interpretation, world validation and narrative generation.

## Why this idea matters
Avoid requiring multiple loaded AI models or letting narration directly rewrite data.

## Accepted direction
- **Deterministic non-LLM coordinator:** Use a programmatic **TypeScript** component, not an AI agent acting as the primary orchestrator, to direct interpretation, validation, tool integration, narrative generation and authoritative turn completion.
- **Clear AI and rule boundaries:** LLMs may interpret player input, propose operations, help with narrative drafts or suggest repairs, but **cannot directly override canonical world state**. The coordinator and deterministic domain validators decide whether changes may commit.
- **Orchestrate model calls:** Coordinate the configured generation strategy and task routing, passing validated results and appropriate context between stages. Support strategies accepted in [[Configurable Generation Pipeline Strategies]] (IDEA-0018) without assuming one universal call ordering.
- **Proposed typed state operations:** Gather and validate operations inferred from player input and/or narrative prose, with stable entity references where available. The concrete LLM interpreter/schema details belong to separately reviewed [[LLM State Interpreter and Proposed Operations]] (IDEA-0045).
- **Action batches and validation:** Coordinate multi-entity changes and applicable world constraints so accepted state, inventory, locations and travel rules remain coherent. Invalid or unsupported operations must not be silently accepted because narration sounds plausible.
- **Tool calls and side-effect control:** Schedule and check tool calls/results under explicit application control; any external side effects need appropriate validation, retry/failure safeguards and permissions. Exact tool transaction protocol is open.
- **Typed errors and bounded repair:** Handle validation failures, rejected operations, unavailable tools, model errors and repair attempts. A repair workflow can produce revised provisional proposals, but not silently bypass a validator. Retry counts and strategies are open.
- **Coherent atomic turn finalisation:** Make story text and all accepted associated state changes authoritative together, or leave the previously committed turn/state intact on failure. The exact persistence/transaction mechanism remains to be refined.
- **Single-model-friendly orchestration:** Do not require several models to remain simultaneously loaded. Multiple sequential tasks may use a single configured model, or appropriately routed models when available, consistent with accepted [[One-Model Task Routing]] (IDEA-0017).
- **Explicit failure rather than fictional success:** When an attempted state change cannot be validated or repaired, preserve canonical state and provide an understandable failed/blocked outcome rather than quietly narrating a successful invalid action.
- **Open decisions:** Leave detailed stage ordering, when implicit prose implies trackable state, operation schemas, retry/repair budgets, atomicity implementation and precise orchestration UX for staging refinement. No particular default strategy is accepted here.

## Proposed behaviour
A deterministic TypeScript coordinator receives a proposed player action or narrative task, selects the configured generation workflow, coordinates any appropriate model or tool calls, and collects provisional narrative and/or typed world-state proposals. It resolves appropriate entity references, validates proposed changes against established state and rules, and may request bounded repairs when operations or prose conflict with authoritative outcomes. Only a coherent validated result becomes an atomic accepted story turn with all corresponding persistent mutations/event history. Rejected or failed tasks leave the existing state unchanged, with an explicit recoverable outcome. The coordinator should support single-model sequential interpretation and narration instead of requiring a separate always-loaded model for each step; exact workflow and failure mechanism require refinement.

## Alternatives and trade-offs
An AI agent directing arbitrary tool calls offers flexibility but introduces unpredictable control flow, side effects and difficult-to-audit authority. The accepted **programmatic TypeScript coordinator** provides an explicit central control and testability at the expense of designing routing, validators and repair policy. Distinct pipeline strategies can trade model-call cost, latency and reliability, and can share a single model sequentially or use task-specific models. This direction does not mandate one pipeline ordering or fixed tool orchestration framework.

## Architecture integration (2026-10-17)
- The accepted coordinator and gameplay rules execute as **TypeScript in the shared SvelteKit/Svelte client** in both Wails v3 desktop and headless browser modes, without a parallel Go gameplay engine.
- The coordinator submits **prepared, validated turn commits** through Go/Wails services to filesystem SQLite. Go must enforce transactional write integrity, expected-revision concurrency and input safety; client-side validation alone is not a security boundary when a local HTTP server serves multiple browser clients.
- Enabled gameplay plugins/capabilities run in the same client TypeScript runtime where possible, with Go reserved for privileged persistence/OS operations. Scheduling expensive model/rebuild work must not freeze the story interface.
- External AI models are accessed through frontend TypeScript providers; CORS, credentials and any necessary alternate network transport are separate provider questions.

## Dependencies and constraints
- Works with accepted [[Configurable Generation Pipeline Strategies]] (IDEA-0018) and [[One-Model Task Routing]] (IDEA-0017); avoid a mandatory stack of simultaneously loaded models.
- All accepted persistent changes must be recorded compatibly with [[Event-Sourced World History]] (IDEA-0039) and the complete incremental reconstruction requirement in [[Snapshots and Incremental State Rebuild]] (IDEA-0042).
- Validate item transfers, character location and travel, environmental changes, and other canonical state according to their separately accepted feature rules (e.g. IDEA-0029, IDEA-0034, IDEA-0035 and IDEA-0038).
- Structured LLM interpretation of arbitrary prose is a **separately accepted staging idea** [[LLM State Interpreter and Proposed Operations]] (IDEA-0045); its concrete schemas and implementation still need refinement.
- Typed tool rejection/repair (IDEA-0046) is now also an accepted staging direction; optional external MCP connectivity (IDEA-0048) remains unaccepted. Their design/production gates remain separate.
- In-flight or failed model/tool calls must not partially commit world-state changes or misleadingly finalise a narrative turn.
- Tool actions that cause real-world side effects need independent permissions and safe handling; the coordinator cannot assume those side effects are automatically reversible.
- Staging direction, not production approval or implemented behaviour.

## Open questions
- How should the coordinator decide whether prose implies tracked state, versus intention, hypothetical narration, memory or figurative language?
- Which typed operations, entity-resolution interfaces and schemas should connect AI interpretation to deterministic validators?
- Which of the accepted pipeline strategies should be the default, and how should custom strategies map onto orchestrated stages?
- How should blocked operations, partial acceptance and ambiguous entity references be communicated to the narrator and player?
- How can externally side-effecting tool calls be controlled, retried or compensated when an atomic turn cannot fully finalise?
- What retry or bounded repair policy is acceptable for latency and cost, especially with weak local role-playing models?
- Should prose be drafted before or after action validation for a given pipeline, and how is consistency enforced either way?
- What are the transaction/commit boundaries linking story revisions, event history, item/world changes and tool results?
- How should cancellations, timeouts, network/provider failures and recovery preserve exactly-once or idempotent outcomes?

## Draft acceptance criteria
- [ ] A deterministic non-LLM TypeScript coordinator drives turn orchestration rather than delegating authoritative workflow control to an agent.
- [ ] Model output and drafted prose may propose state changes but cannot directly commit or override persisted canonical records.
- [ ] Proposed operations are evaluated by deterministic world/domain validators using established state.
- [ ] The coordinator supports the accepted configurable pipeline strategies while allowing a single model to run sequential tasks without multiple simultaneously loaded models.
- [ ] Tool results, rejected actions and model failures are surfaced to the coordinator and handled without accidental authoritative state mutation.
- [ ] Invalid or unrepairable changes do not produce misleadingly successful finalised narration or partial canonical updates.
- [ ] Successful turns finalise story prose and accepted state changes coherently and preserve event provenance/incremental reconstructibility.
- [ ] Repairs/retries are bounded with explicit failure handling; exact budgets remain undecided.
- [ ] The detailed stage ordering, implicit state extraction and transaction implementation remain open to staging refinement.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with earlier suggested implementation details and has now been explicitly accepted into staging.
- This is an accepted **unrefined direction**, not approval for production or evidence of implementation.

## Decisions and review history
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Deterministic, non-LLM TypeScript coordinator for AI interpretation, proposed operations, validators, tools, errors/repair, generation and coherent atomic turn finalisation; AI may propose but may not override canonical state; no mandatory multiple simultaneously loaded models. Exact call ordering, implicit-state detection, retries, repair and transaction mechanics are open. Promoted to staging for refinement only, not production.
