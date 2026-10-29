---
id: "IDEA-0018"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-29"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Configurable Generation Pipeline Strategies

## Role-isolated entity references across all generation strategies — 2026-10-29

[B6-D04 — narrator-safe entity identities](../architecture/decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) applies to **all accepted pipeline variants**. Any model request that can emit primary roleplay prose receives an **ID-free, human-readable prompt**, even in **single-pass prose+events** mode. In single-pass mode, proposed structured events use natural-language references; the engine binds stable IDs after generation. In separate interpretation/audit mode, a **non-narrating** request may receive ID↔name candidate mappings, but its structured response and prompt cannot bleed into the narrator's passage/context. The **same selected model** may run both requests sequentially with isolated prompts—this does **not** require a second model, force a new model call for every turn, or change chosen pipeline strategies. Model-facing technical metadata is never itself an accepted story fact.



## Latest accepted event and narrative authority — 2026-10-28

**Current narrative-first semantics ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)):** A generation strategy can use optional **pre-acceptance attempted-action guidance** and repair provisional text, but final accepted story facts become **declarative Set/Clear/Create/Remove assertions**, not procedural actions whose historic prerequisites must be proven. An accepted event may update current holder/location even if the old story did not establish acquisition, route or cause. Validation still means grounded interpretation, supported typed payloads, coherent one-current-value projections and atomic storage. No new LLM validation pass.


## Idea
Compare one-pass prose+events, plan-validate-narrate and draft-audit strategies.

## Why this idea matters
RP narrators can invent untracked state changes; a second pass is not a complete guarantee.

## Accepted direction
- **Configurable pipeline strategies:** Support a selectable **single-pass prose-and-events** strategy, **plan → validate → narrate**, and **draft → audit → repair**. These are three distinct generation workflows, not separate permanently loaded model requirements.
- **Single pass with narrator-safe references:** One model response may propose prose plus structured world-state facts **using natural-language entity references, not internal stable IDs**. After generation, the engine resolves IDs and validates grounded typed assertions; the model must not receive a private ID mapping merely to format events.
- **Plan → check → narrate:** Propose candidate results, apply optional *provisional attempted-action* rules if selected, and narrate consistent with those attempts. **When text is accepted**, record its grounded state facts as declarative assertions without later veto for missing fictional prerequisites.
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

## Architecture integration (2026-10-17)
- The TypeScript browser-side coordinator executes selectable pipelines inside the shared SvelteKit frontend in the Wails v3 headless localhost server runtime, played through the normal browser; no mandatory Go narration engine or Node SSR process.
- Pipeline stages produce provisional text/state until a single transaction is committed by the Go SQLite service. Long-running model calls and repair attempts should not freeze UI updates.

## Quick Start opening generation integration
- **IDEA-0006 Option A accepted:** A Quick Start AI opening uses the selected generation strategy like other narrative turns. Only after all required stages succeed and any initial state operations pass deterministic validation does the coordinator **automatically commit the opening and corresponding accepted events together**.
- There is **no mandatory player review** of a successfully generated first scene. A pipeline failure, cancellation or exhaustion of bounded repair preserves the uncommitted initial state and allows a retry instead of saving a partial opening.
- This decision does **not** select a default generation strategy, alter one-model/multi-model routing, or override explicit user confirmation for later historical edits.

## Grounded extraction in any opening pipeline
- **IDEA-0006 Option A with explicit user constraint:** Whichever accepted pipeline strategy generates a Quick Start opening, it must gather and validate supported structured initial-world facts from **what the opening text actually says, explicitly provided setup, and established canonical context**, then commit those facts together with the first turn.
- An interpretation/audit/repair stage must **not add unwritten biographies, locations, routes, item provenance, relationships or hidden lore** merely to populate required fields. Missing details remain unknown; source grounding is required beyond a well-formed JSON schema.
- There is no new mandatory second model or worldbuilding pass. Reconcile any contradiction using the normal bounded validation/repair/failure workflow, not an invented unspoken fact. Automatic first-turn finalisation and provisional streaming rules remain unchanged.

## Dependencies and constraints
- Task routing and selected model(s) come from [[One-Model Task Routing]] (IDEA-0017); a strategy cannot force users to load more than one model.
- State proposals and validated outcomes integrate with **separately accepted staging ideas** IDEA-0044 (coordinator), IDEA-0045 (state interpreter), IDEA-0046 (typed rejection/repair) and IDEA-0039 (event history). Their independent acceptance is already established; **this pipeline idea does not expand their accepted scope**. As clarified in audit A-24, the selected strategy plus its established validators and bounded repair are the **only gameplay validation cycle**; do not add another independent AI review pass.
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

- 2026-10-23 — **Pass A cross-reference correction (A-30):** IDEA-0044/0045/0046/0039 are separately accepted in staging, not candidate ideas. A-24 preserves only the already accepted validation stages of the selected pipeline, with no additional AI review pass. No stage promotion.
- 2026-10-17 — **Accepted IDEA-0006 source-grounding dependency:** Regardless of configured generation strategy, first-turn structured extraction may persist only **source-supported** initial facts, never additional unwritten worldbuilding lore. Commit accepted text/events atomically after validation; unknowns remain unknown. Staging unchanged.
- 2026-10-17 — **Accepted IDEA-0006 opening dependency:** Every selected generation strategy must support automatic **first-scene finalisation after successful full validation** for Quick Start, with atomic Go/SQLite commit and no manual scene-review gate. Failed/partial/invalid output is not canonical. No strategy default is selected; staging unchanged.
- 2026-10-17 — **Runtime dependency correction:** IDEA-0053 now selects Wails v3 headless localhost Go server **only**, served to the normal browser by a Windows/macOS/Linux executable. No separate native desktop WebView or npm player runtime. Docker is a distinct unaccepted candidate (IDEA-0065). No further feature approval is implied.
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Configurable single-pass prose/events, plan-validate-narrate and draft-audit-repair strategies; authoritative deterministic state validation; bounded repair attempts; and compatibility with equally first-class single-model and multi-model routing. Accepted for staging refinement only, not production or implementation.

- 2026-10-28 — Explicit user-approved narrative-first declaration in B6-D01 governs any older contradictory mechanical/simulation prose in this staged note. Original decision provenance preserved; no implementation or stage promotion.

- **2026-10-29 — Later user-requested documentation refinement:** [B6-D04](../architecture/decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) protects prose-producing narrator contexts from internal IDs while keeping internal reference resolution, same-model role reuse and single-pass generation. Earlier approvals preserved; no implementation asserted.
