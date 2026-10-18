---
id: "IDEA-0044"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
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
- The accepted coordinator and gameplay rules execute as **TypeScript in the shared SvelteKit/Svelte client** in Wails v3 headless localhost mode, played in the normal browser, without a parallel Go gameplay engine.
- The coordinator submits **prepared, validated turn commits** through Go/Wails services to filesystem SQLite. Go must enforce transactional write integrity, expected-revision concurrency and input safety; client-side validation alone is not a security boundary when a local HTTP server serves multiple browser clients.
- Enabled gameplay plugins/capabilities run in the same client TypeScript runtime where possible, with Go reserved for privileged persistence/OS operations. Scheduling expensive model/rebuild work must not freeze the story interface.
- External AI models are accessed through frontend TypeScript providers; CORS, credentials and any necessary alternate network transport are separate provider questions.

## Draft and committed turn separation
- Player-authored input is autosaved as a **noncanonical SQLite draft** after typing pauses, through Go. Draft saving is not a gameplay turn and invokes no world-state validator or irreversible side effect.
- On submit/confirmation the browser-side TypeScript coordinator validates the result and asks Go/SQLite to commit **the complete accepted story turn/revision with all associated validated state changes atomically**.
- Failed/cancelled model requests, validation or commit must leave last accepted canon intact; preserve the player's last successfully saved draft for retry. Incomplete AI output is not automatically canonical.

## Automatic Quick Start opening finalisation
- **Quick Start (IDEA-0006) is an exception to any proposed manual review of a generated first scene:** once the configured AI generation pipeline completes successfully, the browser-side TypeScript coordinator validates the proposed initial world-state operations, then **automatically submits one coherent opening-turn commit** to Go/SQLite, without a separate user Accept/Review step.
- **Failure means no first-turn commit:** incomplete generation, cancellation, invalid proposals, exhausted repair or failed persistence must leave the first scene and its proposed world state **noncanonical**. A retry can be offered. There must never be a committed opening without its accepted associated state/events, or vice versa.
- **Unchanged:** Player edits to earlier committed prose still require the explicit historical-edit confirmation from IDEA-0041. Automatic Quick Start finalisation does not auto-confirm history edits or make provisional streamed tokens canonical.

## Grounded opening fact tracking
- **Explicit IDEA-0006 selection:** On a successful Quick Start scene, the coordinator collects interpreter-proposed **source-grounded** entities and facts for available character, location, item and relationship systems, validates them with ordinary domain rules, and commits accepted supported changes **atomically with the automatically accepted first narrative turn**.
- Treat the accepted prose/player setup and previously established canonical records as the **evidence boundary**. The interpreter must not create unspoken lore, unexplained graph routes, hidden character backgrounds, item ownership, numeric fields or invented relations to flesh out records. Unknown/ambiguous facts remain unknown; where an essential unsupported or contradictory operation cannot validate, follow normal rejection/repair/failure behaviour rather than silently accepting hallucinated state.
- This is **not a separate AI worldbuilding pass**. Source text/revision references should support traceability, and no extraction-side effect may become canonical before first-turn finalisation. A future narrator may establish *new* facts explicitly in later committed prose.

## Custom Opening fact extraction versus explicit lore authoring
- **Accepted IDEA-0006:** When the player **commits their own Custom Opening**, supported world facts explicitly established in that prose (or setup/prior canon) are validated and persisted coherently with the opening, just as for AI Quick Start. An unsaved or unconfirmed draft cannot change world state. Strict extraction **must not invent backstories, lore or facts absent from the source**.
- **Separately accepted IDEA-0066:** On **explicit request at adventure creation**, the coordinator may orchestrate AI worldbuilding that creates a rich starting Lorebook **before a first narrative turn**. This operation is **creative generation of new lore**, deliberately separate from story fact interpretation, and is **not itself a played turn**. Validate supported records and persist via the existing Go/SQLite boundary; precise orchestration, consistency/failure and approval/commit semantics remain undecided.
- No new compulsory model, Go gameplay engine, separate persistence store or unwanted manual scene-review gate is implied by this staged idea.

## Actor attribution independent of focus
- **Explicitly accepted protagonist-optional adventure model (IDEA-0007/0026/0029):** Turn interpretation and validation must permit **zero, one or several acting characters**, independent of an optional current narrative focus. Story-wide events can change appropriate canonical world state without inventing a character actor.
- **Stable identities, actual custody:** Attribute each proposed action to the specific established actor(s) where known. Validate item transfers/inventory effects against the **actual character, container or location records**, never an implied global player inventory or the last focused character merely because focus changed.
- **Do/Say identity is always explicit:** As resolved by the newer Settings `Playing As` decision, Do and Say are **disabled** if no actual character is selected; when enabled, the selected ID determines the acting/speaking character. No repeated actor confirmation is used. All inventory, action and outcome validation remains required; Story and Continue still allow no actor.
- Focus selection only changes narrator/UI context; on its own it causes **no character movement, ownership change or canonical world-state mutation**.

## Explicit Do/Say actor from Playing As selection
- **Accepted UI/actor refinement (IDEA-0002/0007/0026):** Do and Say cannot be submitted **unless a valid `Playing As` character is explicitly selected in the adventure Settings sidebar**. The selected existing Lorebook character ID is the **player actor for Do**, and **speaker for Say**. There is **no per-turn "which character are you?" confirmation**; first-person actions and speech are grounded by the selected ID. Their proposed world effects still require ordinary deterministic validation.
- **Story/Continue remain actor-optional:** They are enabled in characterless adventures; their generated events may have zero, one or several actually grounded actors. The `Playing As` setting does not automatically reattribute Story/Continue events or make a character physically present in a scene.
- The selector may change between turns without renaming/duplicating a character or transferring items, equipment, location or canonical state. Do/Say requests must not implicitly proceed if the selected ID is absent/deleted/stale. The exact frontend disabling/race handling is an implementation detail rather than a new user confirmation.

## Universal character actors with no PC/NPC kinds
- **Explicit latest IDEA-0026 acceptance:** All Lorebook characters are the **same kind** and all are eligible for temporary `Playing As` selection; there is no permanent PC, NPC or Playable designation. The selected stable character ID supplies the Do/Say actor/speaker, not an entity-type change or elevated permission.
- Story/Continue may describe world and character events involving any real characters or none, independently of `Playing As`. Choosing a different actor does not alter inventory, location, status or prior-turn attribution. No extra player identity is created in the game world.

## Character switch does not issue world-state operations
- **Explicit IDEA-0002/0026/0034 refinement:** Selecting a different valid Lorebook character via Settings `Playing As` supplies the **actor/speaker** and their **current established scene context** to the **next Do/Say**. The coordinator must construct that request from the newly chosen character's canonical identity, location and relevant circumstances, **not reuse the previous actor's scene/inventory** as if they travelled together.
- The selection itself is a non-world-state **narrative cut** and **must not produce movement, travel-validation, inventory-transfer, presence, elapsed-time or other world events**, nor mutate history. No extra confirmation/transition narration is needed. An actual new Do/Say action can still propose events and must pass the configured validators.
- If the selected character's location is uncertain, preserve uncertainty rather than fabricating geography. Story and Continue remain able to narrate other grounded actors or world events without being bound to the chosen Do/Say character. Respect generation cancellation/atomic commit rules as before.

## Scene cut after Playing As change
- **User-accepted:** The next Do/Say after selecting a different character uses that character's **own established location and circumstances**, even if the last actor is far away. The coordinator must not reuse the previous actor's scene.
- Changing the selection is **not a world event, travel, elapsed time, inventory transfer or story turn**. Real actions proposed during the subsequent Do/Say are validated normally. An unknown location remains unknown; Story/Continue remain unrestricted by `Playing As`.

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
- [ ] Switching `Playing As` cuts the next Do/Say to the chosen actor's existing scene with no automatic movement, time or inventory event.
- [ ] The coordinator binds the selected character and their established location as context for the next Do/Say, even if the previous actor is elsewhere; changing selection alone produces **no canonical events or history changes**.
- [ ] A subsequent Do/Say movement/action passes normal validation independently; a viewpoint switch itself is never treated as travel or character teleportation.- [ ] A deterministic non-LLM TypeScript coordinator drives turn orchestration rather than delegating authoritative workflow control to an agent.
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
- 2026-10-18 — **Explicit user acceptance:** Switching between distant `Playing As` characters is a narrative cut for the next Do/Say, never travel or world-state mutation. Staging only.
- 2026-10-18 — **Explicit user acceptance of character cuts:** A `Playing As` change is not a gameplay action. The next Do/Say follows the selected character at their known location/context; no auto travel, teleportation, elapsed time or transfer occurs, while actual subsequent actions still validate. Story/Continue stay independent. Staging only.
- 2026-10-18 — **User accepted one universal character kind:** The coordinator has no PC/NPC or Playable entity eligibility restrictions. Any Lorebook character may be selected for Do/Say. Historical ambiguous Do/Say clarification proposal superseded by the explicit selector gate; staging only.
- 2026-10-18 — **Explicit user correction to prior ambiguity proposal:** Use a persistent per-adventure Settings sidebar `Playing As` reference to a Lorebook character for every Do/Say actor/speaker, not recurring per-action identity confirmation. Disable those modes with no valid selection. Story and Continue still work without characters. `Add Character` opens Lorebook manual entry; item custody remains entity-based. Staging unchanged.
- 2026-10-18 — **Explicitly accepted character-control refinement:** Coordinator handles characterless world events and multi-actor turns; the player need not be a character. Narrative focus is optional and distinct from acting-character attribution. Item and character changes target actual stable entities; missing actors cannot be invented to justify an action. Unchanged atomic validated-turn boundary; staging only.
- 2026-10-18 — **Accepted staging refinements from requesting user:** Strict fact-only extraction applies to player-authored committed Custom Openings as well as Quick Start. A separate, **optional pre-Turn-1 AI Lorebook generation request** is accepted as IDEA-0066; unlike extraction, it intentionally authors lore but must still follow normal validation/persistence boundaries. Its execution/approval details are not yet selected. Staging unchanged.
- 2026-10-17 — **Explicitly approved IDEA-0006 grounding refinement:** Automatically track supported first-scene structured facts as part of validated first-turn commit, but **never generate unstated lore** about introduced entities. Only source-supported facts are eligible; unknowns/rumours remain marked appropriately; preserve provenance and atomicity. This adds no separate model/server or mandatory confirmation step. Staging unchanged.
- 2026-10-17 — **Accepted IDEA-0006 automatic opening dependency:** The first successfully completed, validated AI opening auto-commits as a coherent canonical turn with accepted initial state changes, **without user review**; failed/cancelled/invalid generations do not commit. This is distinct from historical-edit confirmation. Staging remains unchanged.
- 2026-10-17 — **Cross-idea autosave alignment with explicit user acceptance in IDEA-0005:** SQLite persists noncanonical player drafts after short typing pauses, separate from canonical story revisions and state. Committed turns/revisions and related events remain atomic; failed generation preserves canonical state and the last saved player input. This update does not promote this idea beyond staging.
- 2026-10-17 — **Runtime dependency correction:** The approved IDEA-0053 direction is a **single Wails v3 headless localhost Go server**, packaged for Windows/macOS/Linux and used through the normal browser. The earlier combined WebView-desktop plus headless interpretation has been explicitly superseded. Docker is a separate, unaccepted candidate (IDEA-0065); staging status is unchanged.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Deterministic, non-LLM TypeScript coordinator for AI interpretation, proposed operations, validators, tools, errors/repair, generation and coherent atomic turn finalisation; AI may propose but may not override canonical state; no mandatory multiple simultaneously loaded models. Exact call ordering, implicit-state detection, retries, repair and transaction mechanics are open. Promoted to staging for refinement only, not production.
