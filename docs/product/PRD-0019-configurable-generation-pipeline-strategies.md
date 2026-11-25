---
id: PRD-0019
type: prd
status: accepted
related:
- NOTE-0030
- PRD-0001
- NOTE-0010
- NOTE-0008
---

# Configurable Generation Pipeline Strategies

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0018](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Configurable%20Generation%20Pipeline%20Strategies.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S07**. First milestone: **M3**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Latest accepted event and narrative authority — 2026-10-28

**Current narrative-first semantics ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** A generation strategy can use optional **pre-acceptance attempted-action guidance** and repair provisional text, but final accepted story facts become **declarative Set/Clear/Create/Remove assertions**, not procedural actions whose historic prerequisites must be proven. An accepted event may update current holder/location even if the old story did not establish acquisition, route or cause. Validation still means grounded interpretation, supported typed payloads, coherent one-current-value projections and atomic storage. No new LLM validation pass.


## Accepted direction
- **Configurable pipeline strategies:** Support a selectable **single-pass prose-and-events** strategy, **plan → validate → narrate**, and **draft → audit → repair**. These are three distinct generation workflows, not separate permanently loaded model requirements.
- **Single pass with narrator-safe references:** One model response may propose prose plus structured world-state facts **using natural-language entity references, not internal stable IDs**. After generation, the engine resolves IDs and validates grounded typed assertions; the model must not receive a private ID mapping merely to format events.
- **Plan → check → narrate:** Propose candidate results, apply optional *provisional attempted-action* rules if selected, and narrate consistent with those attempts. **When text is accepted**, record its grounded state facts as declarative assertions without later veto for missing fictional prerequisites.
- **Draft → audit → repair:** Draft a scene, examine it and its state proposals for contradictions or unsupported changes, and attempt a **bounded** repair when necessary. An LLM auditor can assist but is not an independent guarantee of correctness.
- **Authoritative deterministic validation:** Regardless of strategy, the coordinator validates proposed state operations against actual world rules. An LLM's prose or self-assessment cannot overrule deterministic constraints.
- **Bounded repair and explicit failure:** Limit retries/repair cycles to prevent loops, excessive model costs and unexplained delays. On failure or exhausted retries, communicate the problem rather than silently committing invalid events or misleading narration.
- **Single- and multi-model parity:** Every strategy can use a single selected model, including a locally loaded model serving sequential passes, or multiple task-specific models chosen through One-Model Task Routing (IDEA-0017). Neither routing setup is second-class.
- **No retroactive rewriting on strategy change:** Changing strategies affects subsequent requests, not already committed narrative turns. Do not automatically rewrite downstream history.
- **Do not preselect a universal default:** Compare quality, reliability, latency and cost with weaker local RP models and cloud models during refinement before choosing initial defaults.

## Dependencies and constraints
- Task routing and selected model(s) come from One-Model Task Routing (IDEA-0017); a strategy cannot force users to load more than one model.
- State proposals and validated outcomes integrate with **separately accepted staging ideas** IDEA-0044 (coordinator), IDEA-0045 (state interpreter), IDEA-0046 (typed rejection/repair) and IDEA-0039 (event history). Their independent acceptance is already established; **this pipeline idea does not expand their accepted scope**. As clarified in audit A-24, the selected strategy plus its established validators and bounded repair are the **only gameplay validation cycle**; do not add another independent AI review pass.
- Proposed narrative changes cannot silently mutate canonical inventory, locations, NPCs or other tracked facts before authoritative validation.
- Multi-stage calls may fail independently. A partial draft, interpretation or audit result must remain provisional until a coherent, validated commit is possible.
- Repair and retries require safeguards against infinite loops, repeated side effects and unexpectedly high provider costs.
- Strategy selection should not retroactively alter existing prose or accepted world history, consistent with accepted Direct Editable Prose Document and Retry Undo and Alternative Continuations.
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

## Supporting detail

See [NOTE-0030](../knowledge/inbox/NOTE-0030-prd-0019-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
