---
id: "IDEA-0018"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Configurable Generation Pipeline Strategies

## Idea
Compare one-pass prose+events, plan-validate-narrate and draft-audit strategies.

## Why this idea matters
RP narrators can invent untracked state changes; a second pass is not a complete guarantee.

## Accepted direction
- **Configurable pipeline strategies:** Support a selectable **single-pass prose-and-events** strategy, **plan → validate → narrate**, and **draft → audit → repair**. These are three distinct generation workflows, not separate permanently loaded model requirements.
- **Single pass:** One model response may propose both narrative prose and structured world-state events. Generated events must still pass deterministic validation before becoming authoritative.
- **Plan → validate → narrate:** Propose intended game events, validate or reject them against the current authoritative state, and only then generate narrative prose consistent with the validated outcome.
- **Draft → audit → repair:** Draft a scene, examine it and its state proposals for contradictions or unsupported changes, and attempt a **bounded** repair when necessary. An LLM auditor can assist but is not an independent guarantee of correctness.
- **Authoritative deterministic validation:** Regardless of strategy, the coordinator validates proposed state operations against actual world rules. An LLM's prose or self-assessment cannot overrule deterministic constraints.
- **Bounded repair and explicit failure:** Limit retries/repair cycles to prevent loops, excessive model costs and unexplained delays. On failure or exhausted retries, communicate the problem rather than silently committing invalid events or misleading narration.
- **Single- and multi-model parity:** Every strategy can use a single selected model, including a locally loaded model serving sequential passes, or multiple task-specific models chosen through [[One-Model Task Routing]] (IDEA-0017). Neither routing setup is second-class.
- **No retroactive rewriting on strategy change:** Changing strategies affects subsequent requests, not already committed narrative turns. Do not automatically rewrite downstream history.
- **Do not preselect a universal default:** Compare quality, reliability, latency and cost with weaker local RP models and cloud models during refinement before choosing initial defaults.

## Proposed behaviour
The coordinator builds a generation plan from the selected pipeline strategy and user-selected task routing. It collects AI-proposed prose and/or structured events, checks operations against game rules, applies only validated accepted changes, and ensures the committed narrative has a coherent relationship with accepted state. In multi-stage strategies it may invoke different configured models per stage, or run several prompts sequentially through one model. Repair is limited to a configurable or otherwise explicit bounded budget; if validation cannot be completed safely, preserve previously committed story and state and report a recoverable generation failure. The UI may show provisional text, but it must not be confused with committed canonical prose.

## Alternatives and trade-offs
Single-pass typically has fewer inference requests and lower latency, but its combined prose/state result may need more careful validation and correction. Plan-validate-narrate improves ordering of authoritative state checks at the cost of extra calls and potentially constrained prose. Draft-audit-repair preserves a creative first draft but has uncertain quality gains and repair latency/cost. All three are accepted alternatives; none is guaranteed best, and LLM self-auditing does not supersede deterministic validation. The exact stage schemas, retry policy, default choice and instrumentation need refinement.

## Dependencies and constraints
- Task routing and selected model(s) come from [[One-Model Task Routing]] (IDEA-0017); a strategy cannot force users to load more than one model.
- State proposals and validation must eventually integrate with the coordinator, structured operations, typed rejection and event/state provenance (see IDEA-0044, IDEA-0045, IDEA-0046 and IDEA-0039 candidates). Those ideas are separate and not implicitly approved here.
- Proposed narrative changes cannot silently mutate canonical inventory, locations, NPCs or other tracked facts before authoritative validation.
- Multi-stage calls may fail independently. A partial draft, interpretation or audit result must remain provisional until a coherent, validated commit is possible.
- Repair and retries require safeguards against infinite loops, repeated side effects and unexpectedly high provider costs.
- Strategy selection should not retroactively alter existing prose or accepted world history, consistent with accepted [[Direct Editable Prose Document]] and [[Retry Undo and Alternative Continuations]].
- Streaming display/cancellation and diagnostics are a separate idea (IDEA-0019); their integration should preserve the difference between preview text and a committed turn.

## Open questions
- Which strategy produces the best balance of consistency, narrative quality, latency and cost across weak local models and cloud models?
- What exactly counts as a validated outcome or an auditable discrepancy in each pipeline?
- How are structured events represented when a provider/model cannot produce reliable JSON or tool calls?
- How many repair attempts should be allowed by default, and is the limit user-configurable?
- What should happen when prose and state proposals cannot be reconciled: discard, present a draft for review, or offer controlled retry?
- When is the story text committed relative to event validation, and how are failures recovered without split-brain state?
- Should users select pipelines per adventure, per model profile, globally or per individual request?

## Draft acceptance criteria
- [ ] A player can select single-pass prose+events, plan-validate-narrate or draft-audit-repair for future generation.
- [ ] Single-pass generation still validates its proposed world-state events before they become authoritative.
- [ ] Plan-validate-narrate validates proposed operations before constructing the final scene.
- [ ] Draft-audit-repair runs bounded consistency checks/repair without treating an LLM audit as authoritative validation.
- [ ] All strategies can use either one model repeatedly or configured task-specific models, without requiring multiple loaded local models.
- [ ] Failed, rejected or exhausted repair sequences do not silently persist invalid world-state changes as canon.
- [ ] Strategy switching does not rewrite previously saved passages or committed events.
- [ ] Tests during refinement compare reliability, latency and narrative quality across relevant local and cloud configurations.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- Accepted for **staging/refinement** only. Deterministic validators, pipeline implementations and production approval have not been claimed.

## Decisions and review history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Configurable single-pass prose/events, plan-validate-narrate and draft-audit-repair strategies; authoritative deterministic state validation; bounded repair attempts; and compatibility with equally first-class single-model and multi-model routing. Accepted for staging refinement only, not production or implementation.
