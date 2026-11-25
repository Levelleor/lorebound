---
id: PRD-0045
type: prd
status: accepted
related:
- NOTE-0051
- PRD-0001
- NOTE-0008
- NOTE-0010
- NOTE-0012
---

# Deterministic Adventure Coordinator

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0044](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Deterministic%20Adventure%20Coordinator.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S06**. First milestone: **M1**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-002B scoped audit](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md); remaining inventory draft
- Evidence: [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md)

## Latest approved narrative-first event semantics — 2026-10-28

**Narration-first rule ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** This coordinator's first purpose is to carry accepted fiction into a faithful structured world memory for future narration. Treat accepted outcome events as typed **declarative state assertions**—not `TransferItem`, `MoveCharacter` or other procedural operations requiring old-state preconditions. A later fact may establish a sparse entity even if its earlier fictional origin was removed. Technical determinism/typing/one-current-property/atomicity and source grounding remain. Optional gameplay rules may guide an **uncommitted** Do/Say attempt and provisional narration, but must not veto the representable facts of **already accepted** story prose. Manual corrections remain pending until player Commit; Quick Start exceptions remain.


## Accepted direction
- **Deterministic non-LLM coordinator:** Use a programmatic **TypeScript** component, not an AI agent acting as the primary orchestrator, to direct interpretation, validation, tool integration, narrative generation and authoritative turn completion.
- **Clear AI and rule boundaries:** LLMs may interpret player input, propose operations, help with narrative drafts or suggest repairs, but **cannot directly override canonical world state**. The coordinator and deterministic domain validators decide whether changes may commit.
- **Orchestrate model calls:** Coordinate the configured generation strategy and task routing, passing validated results and appropriate context between stages. Support strategies accepted in Configurable Generation Pipeline Strategies (IDEA-0018) without assuming one universal call ordering.
- **Proposed typed state operations:** Gather and validate operations inferred from player input and/or narrative prose, with stable entity references where available. The concrete LLM interpreter/schema details belong to separately reviewed LLM State Interpreter and Proposed Operations (IDEA-0045).
- **Assertion batches and technical validation:** Coordinate declarative current-fact updates so entity IDs, current inventory/locations and typed event projections remain deterministic. Do not reject an accepted assertion solely because prior possession, movement route or story setup was not established. Unreadable/unsupported required event payloads must fail safely because narration sounds plausible.
- **Tool calls and side-effect control:** Schedule and check tool calls/results under explicit application control; any external side effects need appropriate validation, retry/failure safeguards and permissions. Exact tool transaction protocol is open.
- **Typed technical errors and optional pre-narration repair:** Handle unprocessable events, tool/provider failures and optional unresolved attempted-action guardrails. Bounded repair may revise only provisional narration; it may not change committed story or suppress a valid fact assertion for fictional impossibility. Retry counts and strategies are open.
- **One established validation cycle, then atomic finalisation (user clarification 2026-10-23):** Follow **only the selected IDEA-0018 generation/validation strategy plus established deterministic domain validation and bounded repair** (IDEA-0045/0046). Once that cycle succeeds, submit one coherent text/event/state transaction. **Do not introduce an additional AI reviewer, extra story-consistency pass, secondary Go gameplay evaluator or speculative acceptance gate**. Go must still enforce expected-version, authorised service access, write fencing and SQLite atomicity: these are persistence safety, **not another creative validation pass**. Failure, cancellation or invalidated attempt before commit discards all provisional changes.
- **Single-model-friendly orchestration:** Do not require several models to remain simultaneously loaded. Multiple sequential tasks may use a single configured model, or appropriately routed models when available, consistent with accepted One-Model Task Routing (IDEA-0017).
- **Attempt failure vs accepted fact:** An **uncommitted attempted action** can be narrated as blocked under selected optional rules, but once a story fact is accepted its supported state assertion must be recorded without retroactive mechanical precondition rejection. Technical unprocessable data still fails safely.
- **Open decisions:** Leave detailed stage ordering, when implicit prose implies trackable state, operation schemas, retry/repair budgets, atomicity implementation and precise orchestration UX for staging refinement. No particular default strategy is accepted here.

## Dependencies and constraints
- Works with accepted Configurable Generation Pipeline Strategies (IDEA-0018) and One-Model Task Routing (IDEA-0017); avoid a mandatory stack of simultaneously loaded models.
- All accepted persistent changes must be recorded compatibly with Event-Sourced World History (IDEA-0039) and the complete incremental reconstruction requirement in Snapshots and Incremental State Rebuild (IDEA-0042).
- Validate item transfers, character location and travel, environmental changes, and other canonical state according to their separately accepted feature rules (e.g. IDEA-0029, IDEA-0034, IDEA-0035 and IDEA-0038).
- Structured LLM interpretation of arbitrary prose is a **separately accepted staging idea** LLM State Interpreter and Proposed Operations (IDEA-0045); its concrete schemas and implementation still need refinement.
- Typed tool rejection/repair (IDEA-0046) is now also an accepted staging direction; optional external MCP connectivity (IDEA-0048) remains unaccepted. Their design/production gates remain separate.
- In-flight or failed model/tool calls must not partially commit world-state changes or misleadingly finalise a narrative turn. **Stop, Retry, any failed stage, browser tab closure or loss of the owning browser session before commit** invalidates the provisional attempt and its state proposals; active browser model fetch/streams are aborted when supported, and late output is never eligible for canon. The Go server never carries on inference for a closed browser tab. A prior successful canonical commit cannot be undone by a late cancel.
- Tool actions that cause real-world side effects need independent permissions and safe handling; the coordinator cannot assume those side effects are automatically reversible.
- Staging direction, not production approval or implemented behaviour.

## Open questions
- How should the coordinator decide whether prose implies tracked state, versus intention, hypothetical narration, memory or figurative language?
- Which typed operations, entity-resolution interfaces and schemas should connect AI interpretation to **the accepted deterministic validators**, without introducing extra independent AI or Go-side gameplay validation passes?
- Which of the accepted pipeline strategies should be the default, and how should custom strategies map onto orchestrated stages?
- How should blocked operations, partial acceptance and ambiguous entity references be communicated to the narrator and player?
- How can externally side-effecting tool calls be controlled, retried or compensated when an atomic turn cannot fully finalise?
- What retry or bounded repair policy is acceptable for latency and cost, especially with weak local role-playing models?
- Should prose be drafted before or after action validation for a given pipeline, and how is consistency enforced either way?
- What are the transaction/commit boundaries linking story revisions, event history, item/world changes and tool results?
- How should cancellations, timeouts, network/provider failures and recovery preserve exactly-once or idempotent outcomes?

## Supporting detail

See [NOTE-0051](../knowledge/inbox/NOTE-0051-prd-0045-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
