---
id: PRD-0047
type: prd
status: accepted
related:
- NOTE-0053
- PRD-0001
- NOTE-0008
- NOTE-0016
---

# Typed Tool Rejection and Narrative Repair

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0046](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Typed%20Tool%20Rejection%20and%20Narrative%20Repair.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S06**. First milestone: **M3**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Latest accepted governing architecture — 2026-10-28

**Later accepted scope:** [B6-D01 — narrative-first declarative outcome events](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md). Typed rejection and bounded repair remain useful for **malformed/unrepresentable events, failed tool/provider operations, or optional pre-acceptance Do/Say action simulations**, but must **not** reject **already accepted story narration** because a key's former acquisition, item's source holder, movement route or causal setup is absent. A grounded accepted state assertion records the latest fact; the previous narrative can remain inconsistent. Only **provisional** AI text can be repaired by selected guardrails; never rewrite accepted prose to satisfy a mechanical validator. The original restrictive examples below are historical, subordinate to this current scope.


## Accepted direction
- **Structured typed rejection:** When a proposed world-state operation or tool action fails validation, return an intelligible, typed rejection with machine-readable reason/code and relevant context rather than only a generic failure. Actual code/schema choices remain for refinement.
- **Grounded permitted alternatives:** Where the deterministic world state and selected rules reliably identify permissible or reachable alternatives, the rejection may include these. Suggestions must not invent accessible routes, items, permissions or bypasses.
- **Player-first bounded refinement (user clarification 2026-10-19):** Rejection/repair protects the integrity of **AI narration for the player's chosen premise**, rather than policing what the player may author. Where a selected movement rule finds a contradiction in a Do/Say or AI-proposed success, aim for a coherent in-story result with modest bounded repair, not unnecessary blocking or a fictitious loophole. Freeform play may turn off route enforcement while retaining the map as reference; direct user Story authorship has its already accepted separate authority (IDEA-0002).
- **Narrate legitimate failed attempts:** A rejected proposal may produce a coherent in-story failure (for example a locked door remaining closed or an invalid pickup failing), provided narration accurately reflects the authoritative outcome. Invalid actions must not be described as completed successes.
- **Bounded narrative repair:** If a provisional narrative draft has already claimed an invalid action succeeded, the coordinator may request a bounded revision or correction of the prose, using the rejection and actual state. Repair can revise *provisional* output but cannot bypass validators or retroactively rewrite unrelated committed turns.
- **Accepted narration is not rejected for simulated impossibility:** Provisional AI output may be refined to honor optional action rules, but once an authorial/story outcome is accepted, valid grounded assertions track that outcome even if earlier fiction contradicts it. Fail safely for malformed/technically unrepresentable data only.
- **Preserve coherent prior state:** When repairs fail or a model repeats invalid claims, leave the previously accepted canonical story and world state intact. Do not commit invalid operations, speculative side effects or an inconsistent partial turn.
- **Coordinator authority:** Integrate with the accepted Deterministic Adventure Coordinator (IDEA-0044) and LLM State Interpreter and Proposed Operations (IDEA-0045); validators determine outcomes and LLMs may only incorporate the rejection or propose bounded corrections.
- **Fit the selected generation strategy:** Under a plan-validate-narrate pipeline, send rejection information before final narration; under draft-audit-repair, revise or reject a provisional draft. Do not force a particular workflow or separate permanently loaded repair model.
- **Respect selected gameplay rules:** A claimed overweight pickup can only be rejected for carrying limits if such mechanics are enabled. Travel or access rejections must follow the current configured constraints, not imagined universal rules.
- **Detailed recovery policy remains open:** Keep reason schemas, retry limits, fallback/repair mechanisms, escalation, and exact player-facing presentation open for staging refinement.

## Dependencies and constraints
- Validated proposal and narration pipelines are governed by accepted Configurable Generation Pipeline Strategies (IDEA-0018), Deterministic Adventure Coordinator (IDEA-0044) and LLM State Interpreter and Proposed Operations (IDEA-0045).
- Accepted state and story turns remain coherent, with all persistent accepted mutations recorded in the complete incremental history (IDEA-0039 and IDEA-0042).
- Invalid movement respects Configurable Travel Graph Rules (IDEA-0035) and relevant location/door state (IDEA-0038); inventory restrictions may only apply where their optional rules are enabled.
- Any suggested alternative route or permissible action must be grounded in known player-accessible state and must not reveal undiscovered places or hidden permissions without justification.
- Rejected tool calls may have different side-effect semantics; irreversible external effects and their compensation require separate MCP/tool-safety refinement (IDEA-0048 remains unaccepted).
- Failure and repair do not grant an LLM the authority to override deterministic validation; provisional prose must not be mistaken for committed story history.
- Do not mandate a second simultaneously loaded AI model for repairs.
- This is staging acceptance, not production approval or an implemented feature.

## Open questions
- How should the coordinator respond when a model repeatedly asserts invalid outcomes after two attempts, or another bounded repair budget?
- Which machine-readable rejection codes, contexts and alternatives should domain validators return?
- How should validation errors be disclosed without spoiling hidden locations, secret door states or unknown inventory facts?
- When should a rejection become an in-story failed attempt rather than an abort-and-retry or prose revision?
- How can a bounded revision guarantee consistency when weak local models keep repeating the same contradiction?
- How should multiple operations in a batch be accepted, rejected or repaired while preserving atomic finalisation?
- How do runtime provider failures or side-effecting external tool errors differ from ordinary in-world invalid actions?
- What default fallback and player-facing explanation should appear when prose and world state cannot be reconciled?
- How can validation- and repair-loop behaviour be tested across different configured generation pipelines and model sizes?

## Draft acceptance criteria
- [ ] A player-authored Story fact is accepted declaratively; optional strict rules can guide a **provisional attempted Do/Continue outcome**, but any final accepted narration's supported fact is still tracked without historical feasibility proof.
- [ ] Rejection and repair never bypass typed/identifier, storage, concurrent version or canonical atomicity checks, and AI-created additions never inherit player Story authority.
- [ ] Deterministic validators return structured typed rejection reasons for invalid world-state or tool operations.
- [ ] Where reliably known, valid alternatives reflect the actual current accessible world and enabled rules without invented routes or hidden spoilers.
- [ ] A rejected action can be represented as an in-story failed attempt without committing an impossible world-state change.
- [ ] A provisional draft that asserts an invalid success can undergo bounded repair using the validation result.
- [ ] All repaired proposals or changed world-state claims must pass validation before finalisation.
- [ ] Accepted final prose may establish a fact whose fictional prerequisite is missing; replayable assertions track it. Only **unprocessable** payloads or unsafe atomic writes block canon.
- [ ] Unrepairable or repeated-invalid results retain the last coherent accepted world/story state and produce an understandable failure.
- [ ] Tool rejection and repair behaviour works with selected generation pipelines and can reuse one model sequentially.
- [ ] Exact rejection schema, repair budgets, fallback and user-facing presentation remain refinement questions.

## Supporting detail

See [NOTE-0053](../knowledge/inbox/NOTE-0053-prd-0047-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
