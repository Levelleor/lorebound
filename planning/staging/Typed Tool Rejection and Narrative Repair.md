---
id: "IDEA-0046"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[World Map and Location Rules Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Typed Tool Rejection and Narrative Repair

## Idea
Reject invalid operations with structured reasons and let the narrator reflect or correct the failed action.

## Why this idea matters
An overweight pickup or illegal movement cannot be committed as success.

## Accepted direction
- **Structured typed rejection:** When a proposed world-state operation or tool action fails validation, return an intelligible, typed rejection with machine-readable reason/code and relevant context rather than only a generic failure. Actual code/schema choices remain for refinement.
- **Grounded permitted alternatives:** Where the deterministic world state and selected rules reliably identify permissible or reachable alternatives, the rejection may include these. Suggestions must not invent accessible routes, items, permissions or bypasses.
- **Narrate legitimate failed attempts:** A rejected proposal may produce a coherent in-story failure (for example a locked door remaining closed or an invalid pickup failing), provided narration accurately reflects the authoritative outcome. Invalid actions must not be described as completed successes.
- **Bounded narrative repair:** If a provisional narrative draft has already claimed an invalid action succeeded, the coordinator may request a bounded revision or correction of the prose, using the rejection and actual state. Repair can revise *provisional* output but cannot bypass validators or retroactively rewrite unrelated committed turns.
- **No contradictory final prose:** A finalised turn should not affirm a world-state outcome that deterministic validation rejected. If consistency cannot be achieved, return a clear failure instead of committing misleading prose.
- **Preserve coherent prior state:** When repairs fail or a model repeats invalid claims, leave the previously accepted canonical story and world state intact. Do not commit invalid operations, speculative side effects or an inconsistent partial turn.
- **Coordinator authority:** Integrate with the accepted [[Deterministic Adventure Coordinator]] (IDEA-0044) and [[LLM State Interpreter and Proposed Operations]] (IDEA-0045); validators determine outcomes and LLMs may only incorporate the rejection or propose bounded corrections.
- **Fit the selected generation strategy:** Under a plan-validate-narrate pipeline, send rejection information before final narration; under draft-audit-repair, revise or reject a provisional draft. Do not force a particular workflow or separate permanently loaded repair model.
- **Respect selected gameplay rules:** A claimed overweight pickup can only be rejected for carrying limits if such mechanics are enabled. Travel or access rejections must follow the current configured constraints, not imagined universal rules.
- **Detailed recovery policy remains open:** Keep reason schemas, retry limits, fallback/repair mechanisms, escalation, and exact player-facing presentation open for staging refinement.

## Proposed behaviour
Validate typed candidate operations against current authoritative state and the selected adventure rules. For a rejected operation, produce a structured result identifying the reason, relevant targets and reliably known allowable next actions when applicable. The deterministic coordinator passes the outcome to narration, which can either present the attempted action as an in-story failure or revise a provisional draft that falsely asserted success. Limit correction attempts and revalidate any changed operations. Commit only coherent prose and accepted world-state events together; if no valid, consistent result can be obtained, preserve the previous committed state and report an actionable failure. Retry budgets, exact rejection shape and presentation remain to be designed.

## Alternatives and trade-offs
A failed operation does not always require discarding a whole story turn: describing the failed attempt may be more natural, cheaper and more faithful to player intent. A draft that already asserted impossible success may instead need repair before finalisation. Attempting several revisions can increase cost and latency, while immediately aborting may be less fluid. Select reasonable bounded fallback behaviour in refinement. Structured errors support code-based handling but require consistent taxonomy and careful suppression of hidden-state spoilers; accessible alternatives should only be suggested when grounded and permitted.

## Story-authorial outcomes are not ordinary invalid gameplay attempts
- **Accepted IDEA-0002 Option B (2026-10-18):** Fictionally impossible **Do/Say attempts**, Continue narration and unsupported AI proposals still receive existing typed rule rejections and bounded narrative repair. But an **explicit player-authored Story assertion** is not a normal gameplay attempt: the coordinator may allow its authored outcome by an **authorial override of in-fiction restrictions**. Do not repair or veto the user's declared outcome merely because fictional adjacency, ability or other optional gameplay rules would reject an equivalent Do attempt.
- **Distinguish genuine errors:** Data corruption, unresolved entity references, invalid schema/unique placement, stale adventure versions and other technical/integrity failures **are not** authorially overrideable. Do not manufacture an in-world workaround just to make structured state seem valid. If a Story-authored outcome cannot be safely represented, report it truthfully without partial canonical commit. Exact focused recovery UX remains open.
- **Provenance and semantics:** Once a supported Story-authorial event is accepted and safely committed with its prose, it is not an 'invalid operation' for the purposes of rejection/repair. The event history should distinguish the player's declared authority from a mechanically permitted Do/Say outcome. The AI may narrate within that accepted reality but does not thereby acquire independent permission to invalidate rules.

## Dependencies and constraints
- Validated proposal and narration pipelines are governed by accepted [[Configurable Generation Pipeline Strategies]] (IDEA-0018), [[Deterministic Adventure Coordinator]] (IDEA-0044) and [[LLM State Interpreter and Proposed Operations]] (IDEA-0045).
- Accepted state and story turns remain coherent, with all persistent accepted mutations recorded in the complete incremental history (IDEA-0039 and IDEA-0042).
- Invalid movement respects [[Configurable Travel Graph Rules]] (IDEA-0035) and relevant location/door state (IDEA-0038); inventory restrictions may only apply where their optional rules are enabled.
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
- [ ] A Story-authored extraordinary change is not auto-rejected/repaired solely as fictional rule violation, while an equivalent Do attempted change can still be rejected and faithfully narrated as unsuccessful.
- [ ] Rejection and repair never bypass typed/identifier, storage, concurrent version or canonical atomicity checks, and AI-created additions never inherit player Story authority.
- [ ] Deterministic validators return structured typed rejection reasons for invalid world-state or tool operations.
- [ ] Where reliably known, valid alternatives reflect the actual current accessible world and enabled rules without invented routes or hidden spoilers.
- [ ] A rejected action can be represented as an in-story failed attempt without committing an impossible world-state change.
- [ ] A provisional draft that asserts an invalid success can undergo bounded repair using the validation result.
- [ ] All repaired proposals or changed world-state claims must pass validation before finalisation.
- [ ] No committed final prose asserts an outcome the game rejected as invalid.
- [ ] Unrepairable or repeated-invalid results retain the last coherent accepted world/story state and produce an understandable failure.
- [ ] Tool rejection and repair behaviour works with selected generation pipelines and can reuse one model sequentially.
- [ ] Exact rejection schema, repair budgets, fallback and user-facing presentation remain refinement questions.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with previously suggested implementation details; explicitly accepted into staging with typed rejections and repair boundaries.
- This is an accepted but **unrefined** planning direction, not production approval or an implemented feature.

## Decisions and review history
- 2026-10-18 — **Accepted IDEA-0002 interaction:** The existing typed rejection/repair path still handles impossible gameplay attempts, but explicit player-authored Story declarations may override ordinary fictional restrictions instead of being rejected. Technical integrity and version/safe commit checks remain non-negotiable; the AI does not get independent override authority. Staging only.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Structured rejection reasons for invalid proposed world-state or tool operations; known permissible/reachable alternatives; in-story failures or bounded narrative repair of inconsistent drafts; no invalid operations or contradictory final prose; retain coherent prior state if repair fails. Rejection schemas, retry limits, fallback handling and player-facing presentation remain open. Moved to staging for refinement, not production.
