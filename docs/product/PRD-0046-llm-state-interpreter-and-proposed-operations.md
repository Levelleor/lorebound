---
id: PRD-0046
type: prd
status: accepted
related:
- NOTE-0052
- PRD-0001
- NOTE-0008
- NOTE-0010
---

# LLM State Interpreter and Proposed Operations

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0045](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/LLM%20State%20Interpreter%20and%20Proposed%20Operations.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S07**. First milestone: **M3**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Latest accepted governing architecture — 2026-10-28

**Latest accepted 2026-10-28 interpretation contract:** [B6-D01 — narrative-first declarative outcome events](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md). The interpreter proposes **source-grounded declarative facts** (Set/Clear, Create/Remove, keyed Add/Remove relationship) from **accepted narration or explicit player correction**, not procedural “TransferItem” actions that demand preconditions. It still distinguishes attempts from successful narrated outcomes: uncompleted attempts alone cannot create facts. Once prose/authorial outcome is accepted, a missing earlier item acquisition, route or creation event is a **fictional continuity issue**, not grounds to suppress the representable assertion. Stable IDs may be sparsely established; unsupported prose details remain narrative only; reject truly malformed/uninterpretable typed data.


## Accepted direction
- **LLM interpretation is a proposal role:** Use an LLM to interpret arbitrary player language and draft or generated prose into **proposed typed world-state operations**, rather than relying on plain TypeScript to understand unrestricted natural language.
- **Schema-checked fact proposals:** Produce declarative fact assertions in typed, parseable structures subject to grounding, schema and deterministic projection checks; no procedural prior-possession/route prerequisites. A valid schema alone does **not** demonstrate that the model understood the action correctly.
- **Engine-owned stable entity resolution:** Prose-facing model context uses natural names/descriptions, **not internal IDs**. A separate internal resolver may use candidate IDs and aliases to bind grounded names to stable identities, using scene, holder and relationships. The system allocates IDs for clearly new entities; preserve ambiguous/unresolved references instead of guessing, cloning identities or blocking otherwise valid prose.
- **Action meaning and certainty:** Distinguish completed actions from attempts, intentions, plans, remembered/historical descriptions, hypothetical events and figurative language. A proposed attempt must not silently become a successful canonical action.
- **Deterministic assertion authority boundary:** Interpretation output remains provisional. The coordinator accepts **grounded facts established by final prose or explicit player input** and verifies typed event representability; it does not ask whether the fictional action was *possible* under prior state. Optional rules may guide unresolved attempted actions before narration. A valid JSON shape alone is not evidence that the claimed fact was actually established.
- **Works with all accepted pipeline strategies:** Allow interpretation as a logical stage of the single-pass prose-and-events, plan-validate-narrate, or draft-audit-repair workflows accepted in Configurable Generation Pipeline Strategies (IDEA-0018), without requiring one universal call sequence.
- **Sequential single-model reuse:** The selected narrator model can also perform interpretation in a sequential pass. Different models may be routed by configuration, but an additional permanently loaded interpreter model is **not mandatory**.
- **Provider-flexible output strategies:** Support consideration of native function/tool calling when available and constrained JSON or equivalent structured extraction where not. Neither is mandated as the universal implementation; schema validation still applies.
- **Explicit uncertainty and failure:** Malformed outputs, omitted operations, unsupported targets, conflicting references and uncertain interpretations require safe handling. Do not turn an uncertain model guess into a committed fact.
- **Refinement choices remain open:** Detailed operation schema and entity-resolution rules, extraction reliability across local role-playing models, confidence/ambiguity handling, fallback and repair strategy, parser/tool interface and benchmarks remain to be decided before production.
- **Separately accepted error and repair responsibilities:** Typed error reasons and bounded narrator repair on rejected operations belong to separately **accepted staging** Typed Tool Rejection and Narrative Repair (IDEA-0046). The interpreter remains a proposal mechanism; accepting it alone did not constitute approval of the other idea, which has since received its own separate staging acceptance.

## Dependencies and constraints
- Works under accepted Deterministic Adventure Coordinator (IDEA-0044): model output is a provisional proposal and cannot mutate canonical state without deterministic validation and coherent finalisation.
- Must support the configurable workflows of Configurable Generation Pipeline Strategies (IDEA-0018) and the single- or multi-model routing accepted in One-Model Task Routing (IDEA-0017).
- Entity reference resolution must use stable identities and established facts from accepted entity, inventory and location work. A mention is not evidence of physical presence, possession or successful movement.
- Validated changes must remain compatible with the accepted event-sourced and fully reconstructible state history (IDEA-0039 and IDEA-0042).
- The interpreter may suggest an operation requiring a new entity or world location, but validated creation is governed by the corresponding separately accepted rules, not by guessed identity resolution.
- Distinguish attempts, intentions, memories, hypotheticals and completed changes during extraction to prevent model hallucinations from becoming persistent consequences.
- Failure to produce meaningful or schema-valid operations is not permission to silently ignore necessary state changes and commit contradictory narration. Escalation/fallback needs refinement.
- Typed rejection and narrative repair remain a separate, **accepted staging** responsibility in Typed Tool Rejection and Narrative Repair (IDEA-0046), with detailed schemas/budgets still deferred.
- This is staging acceptance for refinement only, not approval for production or evidence of implementation.

## Open questions
- How reliable is extraction on RP models not trained for tool usage, especially weaker local models?
- Which operation types and payload schemas are required across different tracked entity categories?
- How should the interpreter distinguish action attempts from completions, memories or figurative prose?
- How are entity aliases, competing references and unknown targets represented without fabricated IDs?
- What happens when the model misses an important change, outputs duplicate operations or confuses operation order?
- When does the coordinator ask for clarification versus retry or fallback to a different extraction strategy?
- How should the system assess semantic correctness beyond JSON-schema validity?
- What prompt/context information is needed to resolve references without leaking hidden locations or lore?
- How should different pipeline strategies coordinate interpretation passes without requiring more than one loaded model?
- Which provider capabilities determine function-call, structured-output or constrained-JSON selection?
- How should quality, latency, tool adherence and cost be evaluated across local RP and cloud models?

## Draft acceptance criteria
- [ ] A clearly established authored Story teleport may yield a properly sourced authorial location change despite strict ordinary movement rules, without an invented route/spell.
- [ ] Equivalent Do attempts and unsupported AI/Continue inventions remain subject to gameplay rules; model proposals never directly commit or bypass referential/schema integrity.
- [ ] Merely changing `Playing As` proposes no world-state operations; the next Do/Say is grounded in that actor's established location and state.
- [ ] A change of `Playing As` alone produces **no world event**. Any subsequently **accepted** grounded movement is tracked through a declarative location assertion; optional attempted-action guardrails apply only before acceptance.
- [ ] Arbitrary player or narrative prose can yield typed proposed changes with a defined and verifiable schema.
- [ ] Entity references are resolved to stable IDs only when sufficiently grounded; **discard unresolved automatic candidates silently** under B7-D03 C rather than retaining/surfacing an ambiguity list.
- [ ] Intentions, failed attempts, hypotheticals and historical recollections are not automatically committed as completed present-tense actions.
- [ ] Well-formed interpreter output remains provisional until deterministic world-state validation accepts it.
- [ ] Unsupported or impossible changes do not become authoritative merely because the model describes them.
- [ ] Parsing/schema failures, uncertain references and missing required operation data are handled without inconsistent partial commits.
- [ ] The interpretation role can execute sequentially through the selected narrator model without needing an always-loaded dedicated interpreter.
- [ ] Native function calling and constrained JSON extraction can be evaluated as alternatives without choosing one mandatory provider-specific format.
- [ ] Proposed events accepted by the coordinator remain traceable in the canonical incremental history.
- [ ] Exact operation schemas, semantic extraction benchmarks, fallback and repair behaviours remain open for staging refinement.

## Supporting detail

See [NOTE-0052](../knowledge/inbox/NOTE-0052-prd-0046-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
