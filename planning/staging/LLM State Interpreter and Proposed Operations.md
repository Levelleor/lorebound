---
id: "IDEA-0045"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# LLM State Interpreter and Proposed Operations

## Latest accepted governing architecture — 2026-10-28

**Latest accepted 2026-10-28 interpretation contract:** [B6-D01 — narrative-first declarative outcome events](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). The interpreter proposes **source-grounded declarative facts** (Set/Clear, Create/Remove, keyed Add/Remove relationship) from **accepted narration or explicit player correction**, not procedural “TransferItem” actions that demand preconditions. It still distinguishes attempts from successful narrated outcomes: uncompleted attempts alone cannot create facts. Once prose/authorial outcome is accepted, a missing earlier item acquisition, route or creation event is a **fictional continuity issue**, not grounds to suppress the representable assertion. Stable IDs may be sparsely established; unsupported prose details remain narrative only; reject truly malformed/uninterpretable typed data.


## Idea
Use an LLM role to convert arbitrary player language or draft prose into proposed typed changes.

## Why this idea matters
Plain TypeScript cannot reliably infer meanings from unconstrained natural language.

## Accepted direction
- **LLM interpretation is a proposal role:** Use an LLM to interpret arbitrary player language and draft or generated prose into **proposed typed world-state operations**, rather than relying on plain TypeScript to understand unrestricted natural language.
- **Schema-checked proposals:** Produce operations in typed, parseable structures subject to explicit schema checks and subsequent domain validation. A valid schema alone does **not** demonstrate that the model understood the action correctly.
- **Stable entity references:** Resolve locations, characters, items and other targets to existing stable entity IDs when supported by context. Preserve unresolved, ambiguous, unknown or incomplete references instead of guessing, inventing an identity or silently creating a new entity.
- **Action meaning and certainty:** Distinguish completed actions from attempts, intentions, plans, remembered/historical descriptions, hypothetical events and figurative language. A proposed attempt must not silently become a successful canonical action.
- **Deterministic authority boundary:** Interpretation output remains provisional. The accepted [[Deterministic Adventure Coordinator]] (IDEA-0044) and domain validators alone decide whether an operation is possible and whether it becomes persistent world state. No model text or correctly shaped JSON can override authoritative rules.
- **Works with all accepted pipeline strategies:** Allow interpretation as a logical stage of the single-pass prose-and-events, plan-validate-narrate, or draft-audit-repair workflows accepted in [[Configurable Generation Pipeline Strategies]] (IDEA-0018), without requiring one universal call sequence.
- **Sequential single-model reuse:** The selected narrator model can also perform interpretation in a sequential pass. Different models may be routed by configuration, but an additional permanently loaded interpreter model is **not mandatory**.
- **Provider-flexible output strategies:** Support consideration of native function/tool calling when available and constrained JSON or equivalent structured extraction where not. Neither is mandated as the universal implementation; schema validation still applies.
- **Explicit uncertainty and failure:** Malformed outputs, omitted operations, unsupported targets, conflicting references and uncertain interpretations require safe handling. Do not turn an uncertain model guess into a committed fact.
- **Refinement choices remain open:** Detailed operation schema and entity-resolution rules, extraction reliability across local role-playing models, confidence/ambiguity handling, fallback and repair strategy, parser/tool interface and benchmarks remain to be decided before production.
- **Separately accepted error and repair responsibilities:** Typed error reasons and bounded narrator repair on rejected operations belong to separately **accepted staging** [[Typed Tool Rejection and Narrative Repair]] (IDEA-0046). The interpreter remains a proposal mechanism; accepting it alone did not constitute approval of the other idea, which has since received its own separate staging acceptance.

## Proposed behaviour
The coordinator invokes a configured LLM interpretation task on a player action, narrated event or draft. The interpreter proposes typed operations with arguments and any confidently resolvable stable entity references, while preserving when an event is only attempted, intended, historical or ambiguous. Schema validation catches malformed output and missing fields; deterministic technical validation then checks that the proposed **accepted fact assertion** is grounded, typed and replayable; optional adventure rules may inform **uncommitted action attempts**, but cannot veto a completed accepted narrative fact for missing fictional prerequisites. Only the coordinator may commit accepted world changes and corresponding story events, coherently with narration. Interpretation can use the narrator model sequentially or an optionally configured task-specific model, with function-calling and constrained-JSON strategies as alternatives to evaluate. Any incomplete, contradictory or unsupported proposal remains provisional and triggers explicit safe handling rather than silent state mutation.

## Alternatives and trade-offs
Native function/tool calling may provide provider-supported structured arguments, but not all locally hosted or role-playing-oriented models reliably support it. Constrained JSON or schema-guided text extraction can work with more providers yet may fail parsing or omit semantic changes. Either approach must pass schema checks and domain validators; correctness of the extracted meaning is a separate quality concern. Reusing one narrator model in successive tasks avoids compulsory multiple simultaneous model loads but may add latency or suffer weaker tool adherence. Dedicated interpreter model routing may be optional when desired, not a mandatory architecture.

## Architecture integration (2026-10-17)
- Interpretation and structured operation proposal logic run in the shared client-side TypeScript game runtime, not a mandatory Go inference service or Node backend. Model APIs are external and accessed from the frontend when permitted.
- Proposals remain provisional until TypeScript domain validation and coordinator agreement; Go/Wails writes only complete, revision-consistent transactions into filesystem SQLite and must protect database integrity when used by multiple browser clients.

## Source-grounded initial fact extraction
- **IDEA-0006 accepted:** After a Quick Start opening is fully generated, the interpreter may propose supported entity/world records for characters, locations, items and relationships **explicitly established in the accepted scene, player-supplied setup, or already established canonical context**. Proposals remain provisional until deterministic validation and the first-turn atomic commit.
- **Extract, do not author additional lore:** The interpretation pass is **not an independent worldbuilding request**. It must not invent background, physical descriptions, personalities, motivations, geography, item ownership, character relationships, events or numeric stats that the source never established. Assigning a necessary stable ID is technical bookkeeping, not a license to fabricate in-world details.
- **Unknown remains unknown:** Minimal entities are valid. Unstated fields remain unknown/not recorded; rumours, hypotheticals, figurative language and ambiguous reference resolution cannot be promoted to established canon. Include source turn/text-revision references so every accepted structured fact can be traced to actual narrative evidence.
- Example: "Marcus approaches, carrying a bloodstained sword" supports Marcus, an item and the **carrying** relationship; it does **not** prove Marcus owns the sword, where blood came from, or why it is stained. The same restriction applies to lore/location creation through this interpretation pathway.

## Player-authored opening extraction and pre-play worldbuilding boundary
- **IDEA-0006 extends source-grounded extraction to Custom Opening:** On committed player-authored prose, as on successfully accepted AI-generated Quick Start prose, propose only typed facts **actually stated in that passage**, explicit setup or previously accepted canonical context. An input draft is noncanonical; a blank opening supplies no facts. Do not invent unstated lore, character traits, places or relations to complete a schema.
- **Intentional generation is a separate task (accepted IDEA-0066):** A player may explicitly request AI to **author new starting Lorebook/world content before Turn 1**. That task is **worldbuilding generation**, not factual extraction. It may propose genuinely new lore under validation and eventual acceptance rules, but must not be invoked implicitly whenever normal narrative prose mentions something.
- The exact generation/review/commit process for IDEA-0066 remains a **future refinement**. It should not weaken fact provenance, unknown-state handling, deterministic checks or the separation of provisional model text from canonical facts.

## Protagonist-optional actor extraction
- **Accepted IDEA-0007/0026/0029:** The interpreting model must not assume that the player is a character, that an adventure has one permanent protagonist, or that a story turn always has a character actor. Proposed actions/events may involve **zero, one or several grounded actors**, with stable references where known.
- Keep **narrative focus separate from per-turn actor attribution**. A changed focused character is not an item transfer or location movement; any world-state operation must name the actual established target/holder. Do not use a fabricated global Player Inventory.
- With ambiguous first-person expressions such as "I draw my sword" and no grounded speaker/actor in context, do not invent a player avatar or assumed sword possession. Preserve unresolved references/ask clarification under the eventual UI policy instead of committing unsupported changes.

## Selected player actor for Do and Say
- **Explicit newer IDEA-0002/0007 decision supersedes prior first-person clarification path for Do/Say:** When the player uses **Do** or **Say**, the Settings sidebar's selected **`Playing As` Lorebook character ID** is already a defined actor/speaker, so the interpreter attributes 'I', 'my' and spoken dialogue to **that character**, without interrupting play to ask who the player is. Do/Say must be unavailable if there is no valid selection.
- Ordinary source interpretation distinguishes the selected actor from actual custody and movement facts; a focus change **does not itself** prove ownership or teleport a character. When a final accepted outcome establishes a new holder/location, emit the assertion without requiring proof of prior custody or fictional route.
- **Story and Continue** can occur without a selected character and must still interpret grounded actors if any. Those modes must not silently infer `Playing As` as the actor. If the model cannot ground an operation, leave it unresolved rather than inventing a protagonist.

## Universal character actor references
- **Latest explicitly accepted IDEA-0026 direction:** All Lorebook characters are of **one character kind**, with no PC/NPC category or Playable flag. The interpreter may receive **any existing character ID** through the Settings `Playing As` selection as the actor/speaker for Do/Say; this is an input-context attribution, not an entity type or special permission.
- Story and Continue still allow zero/multiple grounded actors without a selected `Playing As` character. An actor change cannot automatically alter historical events, current location, possession or status. All unsupported facts stay unresolved.

## Do/Say perspective cut is not movement
- **Accepted IDEA-0002/0026/0034 refinement:** The model interpreter receives the explicitly selected `Playing As` character ID for Do/Say **plus that character's currently established scene/context**. After changing from Mara in the capital to Theo in a forest, the next Do/Say is attributed to Theo **in the forest**, not to a moved Theo in the capital.
- Do **not** interpret the player changing `Playing As` as a story event, travel request, teleporter use, elapsed time, automatic co-location or inventory/ownership transfer. An actual attempted Do/Say action is interpreted separately; optional pre-narration guardrails may shape it, while a final accepted factual outcome updates the tracker declaratively rather than being retrospectively vetoed for a missing mechanical prerequisite.
- Preserve unresolved/unknown location and actor-relevant details without pulling in the previous actor's location or fabricating lore to make the new viewpoint work. Story/Continue still have their normal actor-optional semantics.

## Playing As switching is context, not movement
For Do/Say, interpret the selected character's identity and **already established scene location** as input context, including on the first turn after changing `Playing As`. A switch between distant characters is a **scene cut** and must **not be inferred as travel, teleportation, elapsed time, co-location or inventory transfer**. The next actual action can separately propose world-state operations under ordinary validation. If location is unknown, do not borrow the previous actor's scene or invent it; Story/Continue remain actor-optional.

## Playing As switching is context, not a movement proposal
- **Accepted:** On the next Do/Say after switching `Playing As`, use the selected character's stable ID and **their own established location/context**. Choosing another character never proposes travel, teleportation, time passage or inventory transfer. Actual actions in the next turn still require normal validation. Do not substitute the former actor's location when the new actor's whereabouts are unknown. `Story` and `Continue` remain actor-optional.

## Interpret direct Story declarations as player-authorised exceptions
- **Explicit accepted IDEA-0002 Option B (2026-10-18):** When a player directly writes a definite event/outcome in **Story mode**, interpretation may propose a **player-authorised authorial state change** even if ordinary fictional eligibility, travel adjacency, capability or possession prerequisites would block that same attempted action in Do/Say. The interpreter must distinguish **asserted fact** from mere attempt, hypothetical, quotation, rumour and model-invented suggestion; do not turn every mention into a world mutation.
- **No invented rationale or independent AI privilege:** Extract only consequences established by the **player's authored words**. E.g., teleporting a character across a kingdom is a location update, **not evidence of a new route, learned teleportation ability, elapsed journey or travel companions** unless those are stated. The model itself cannot claim authorial permission in Continue or invent extra exceptional operations in a Story response. Explicit player authorship must be reflected in proposed operation provenance/authority metadata, exact shape TBD.
- **Validation still matters:** The coordinator and domain validators can waive **fictional game-rule prerequisites specifically for that authorial Story operation**, but never typed schemas, resolvable IDs, cross-entity consistency, source grounding, history/revision provenance or atomic Go/SQLite storage rules. Unresolvable/unsupported changes must not silently pass as committed typed state.

## Dependencies and constraints
- Works under accepted [[Deterministic Adventure Coordinator]] (IDEA-0044): model output is a provisional proposal and cannot mutate canonical state without deterministic validation and coherent finalisation.
- Must support the configurable workflows of [[Configurable Generation Pipeline Strategies]] (IDEA-0018) and the single- or multi-model routing accepted in [[One-Model Task Routing]] (IDEA-0017).
- Entity reference resolution must use stable identities and established facts from accepted entity, inventory and location work. A mention is not evidence of physical presence, possession or successful movement.
- Validated changes must remain compatible with the accepted event-sourced and fully reconstructible state history (IDEA-0039 and IDEA-0042).
- The interpreter may suggest an operation requiring a new entity or world location, but validated creation is governed by the corresponding separately accepted rules, not by guessed identity resolution.
- Distinguish attempts, intentions, memories, hypotheticals and completed changes during extraction to prevent model hallucinations from becoming persistent consequences.
- Failure to produce meaningful or schema-valid operations is not permission to silently ignore necessary state changes and commit contradictory narration. Escalation/fallback needs refinement.
- Typed rejection and narrative repair remain a separate, **accepted staging** responsibility in [[Typed Tool Rejection and Narrative Repair]] (IDEA-0046), with detailed schemas/budgets still deferred.
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
- [ ] A change of `Playing As` alone proposes **no gameplay operations**. The next Do/Say uses the selected actor's established location/context, and any separately narrated movement must pass normal validation.- [ ] Arbitrary player or narrative prose can yield typed proposed changes with a defined and verifiable schema.
- [ ] Entity references are resolved to stable IDs only when sufficiently grounded, with ambiguity preserved or surfaced otherwise.
- [ ] Intentions, failed attempts, hypotheticals and historical recollections are not automatically committed as completed present-tense actions.
- [ ] Well-formed interpreter output remains provisional until deterministic world-state validation accepts it.
- [ ] Unsupported or impossible changes do not become authoritative merely because the model describes them.
- [ ] Parsing/schema failures, uncertain references and missing required operation data are handled without inconsistent partial commits.
- [ ] The interpretation role can execute sequentially through the selected narrator model without needing an always-loaded dedicated interpreter.
- [ ] Native function calling and constrained JSON extraction can be evaluated as alternatives without choosing one mandatory provider-specific format.
- [ ] Proposed events accepted by the coordinator remain traceable in the canonical incremental history.
- [ ] Exact operation schemas, semantic extraction benchmarks, fallback and repair behaviours remain open for staging refinement.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with earlier suggested implementation details; explicitly accepted into staging with the stated interpretation and validation boundaries.
- This remains an **unrefined accepted planning direction**, not a production-ready specification or implemented feature.

## Decisions and review history

- 2026-10-19 — **Pass A reference correction:** IDEA-0046 (typed rejections and narrative repair) is already independently accepted in staging. Earlier 'unaccepted candidate' references were historical and are superseded, not new feature acceptance.
- 2026-10-18 — **Accepted IDEA-0002 interpretation distinction:** Explicit Story-authored assertions can bypass fictional gameplay prerequisites as player-directed world facts, with source-grounded minimal typed effects and coordinator/governed safe commits. Hypotheticals, rumours, Do/Say attempts and autonomous AI claims do not receive that authority. Staging only.
- 2026-10-18 — **Explicit user acceptance:** `Playing As` switching is a narrative cut; the next Do/Say follows the chosen character in their existing circumstances. Switching causes no physical travel, time passage or item movement. Staging only.
- 2026-10-18 — **User explicitly accepted:** A `Playing As` switch is an editorial scene cut; next Do/Say follows the new character in their established place, no automatic travel/time/state effects, and Story/Continue remain independent. Staging only.
- 2026-10-18 — **User-accepted switch-as-cut semantics:** Changing `Playing As` between distant characters is a narrative cut; the next Do/Say uses the selected character's existing scene/location. The interpreter must not propose movement or invent a transition from selection alone. Staging only.
- 2026-10-18 — **Explicit user-approved universal characters:** No PC/NPC or Playable role; all Lorebook characters are available for the Settings `Playing As` actor used by Do/Say. World-state proposals remain validated. Staging unchanged.
- 2026-10-18 — **User explicitly replaced Do/Say actor clarification with selector gate:** Do and Say are unavailable until an existing Lorebook character is chosen in Settings sidebar `Playing As`; the interpreter uses that stable ID as actor/speaker, not per-turn "who is I?" prompts. Story/Continue remain characterless-capable. No global Player Inventory and no automatic avatar. Staging only.
- 2026-10-18 — **Accepted IDEA-0007/0026 actor-boundary refinement:** Fact interpretation supports zero or many actors independently of optional narrator focus and real character identities. No default player avatar, global Player Inventory or inferred actor/possession without evidence. Ambiguous referents remain unresolved. Staging only.
- 2026-10-18 — **User-confirmed expansion and separate new idea:** Strict source-only structured extraction applies to **accepted Custom Opening** as well as generated Quick Start (IDEA-0006). The new **accepted IDEA-0066** permits **explicitly requested pre-first-turn AI Lorebook worldbuilding**, which is a different generation role and must not cause hidden lore creation during ordinary extraction. Exact workflow deferred. Staging unchanged.
- 2026-10-17 — **Explicit user-approved IDEA-0006 constraint:** Automatic structured initial-world extraction is approved when supported systems are enabled, but the interpreter must **only extract source-established facts** and must **never create additional unspoken lore** while constructing location, character, item or relationship records. Preserve uncertainty and source provenance; validate proposals and atomically commit with the first opening turn. Staging only.
- 2026-10-17 — **Runtime dependency correction:** IDEA-0053 now selects Wails v3 headless localhost Go server **only**, served to the normal browser by a Windows/macOS/Linux executable. No separate native desktop WebView or npm player runtime. Docker is a distinct unaccepted candidate (IDEA-0065). No further feature approval is implied.
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** LLM interpretation of unconstrained player language and draft prose into schema-checked proposed typed operations; stable entity IDs where resolvable, explicit ambiguity, and distinctions among attempts, intentions, memories and completed acts; no authoritative state change without coordinator validation; sequential use of narrator model supported; native function calling and constrained JSON extraction both kept available for evaluation. Extraction reliability, schemas, fallback and repair details remain open. Moved to staging only, not production.

- 2026-10-28 — **Explicit user-directed supersession:** Narrative-first declarative assertions adopted by user and reconciled here under [B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). Earlier action-precondition wording is preserved only as approval history where still quoted; **the latest governing section overrides it**. No staging promotion or implementation.
