---
id: "IDEA-0050"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[World Map and Location Rules Brainstorm]]", "[[Characters Inventory Equipment and Anatomy Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Structured UI Game Actions

## Idea
Use direct UI actions such as map clicks and Equip buttons to generate typed commands without language parsing.

## Why this idea matters
Typed actions save LLM calls and avoid destination/entity ambiguity.

## Accepted direction
- **Optional direct gameplay UI:** Offer structured game controls for applicable actions, such as selecting map destinations or using Equip/Drop buttons, as an alternative to expressing the same operation in freeform prose.
- **Typed commands and stable references:** UI actions supply capability IDs, typed arguments and stable entity/item/location identifiers directly to the deterministic coordinator. Do not require an LLM interpretation pass merely to determine the referenced item or destination already selected by the UI.
- **One rules engine for all inputs:** UI commands enter the **same** capability registry, permissions, world-rule validation and authoritative commit pipeline as operations proposed from natural language. UI selection is not a shortcut around validation.
- **Coherent narration and state:** When an action is accepted or rejected, the coordinator ensures the resulting story prose and incrementally recorded canonical state agree. Narration may use the selected model and configured generation strategy; a typed UI action does not guarantee that narration itself is model-free.
- **Controls respect enabled systems:** Expose UI affordances only for enabled, relevant and permitted registered gameplay capabilities. If an optional plugin or system is disabled (for example inventory equipment), do not show controls dependent on that mechanic.
- **Natural-language input remains supported:** Direct controls supplement player prose, not replace it. The player can still describe travel, equipment and interactions freely through the accepted LLM interpreter when preferred.
- **No mandatory immediate execution:** Whether particular UI actions commit immediately, prepare a narrated attempt or require confirmation is intentionally open, especially for map clicks and actions that advance the narrative.
- **Scope remains unrefined:** The exact controls, layout, selection states, accessibility, confirmation flow, narration timing, costs and context-sensitive visibility rules are staging questions rather than preapproved UX designs.

## Proposed behaviour
A player selects an available UI control backed by an enabled registered capability, such as Equip on a selected inventory item or Travel to a discovered map location. The UI constructs a typed operation carrying stable entity IDs and selected arguments, bypassing the unnecessary language-to-entity extraction step. The coordinator resolves any remaining conditions, verifies permissions and rules, and finalises a coherent story/state result only for accepted effects. The chosen narration workflow can describe a successful action or a validated failure; narration generation, confirmation and when the action advances the turn remain for refinement. If the feature is disabled or not applicable, the control is not offered.

## Alternatives and trade-offs
A prose-only interface is simpler and preserves flexibility but may spend extra model calls to infer actions or resolve destinations already known from selection, sometimes ambiguously. Structured controls improve precision and can reduce inference calls, but add UI complexity and may tempt an excessive number of buttons. The accepted direction uses **both** natural language and optional contextual UI commands, with the same deterministic validators beneath them. Direct actions versus confirm/prepare actions remains undecided; different capabilities may eventually require different interaction policies.

## Architecture integration (2026-10-17)
- Svelte UI controls invoke the same browser-side TypeScript coordinator and capability registry as freeform model interpretation. Wails/Go remains an adapter for transactional SQLite persistence and necessary filesystem functions, not a parallel rules dispatcher.
- Go must reject stale/conflicting writes from desktop windows or browser tabs and protect privileged service calls; typed UI operations do not grant direct unchecked access to canonical database tables.

## Dependencies and constraints
- Routes to [[Deterministic Adventure Coordinator]] (IDEA-0044), whose validators and atomic finalisation remain authoritative; UI selection does not bypass them.
- Uses discoverable, enabled operations from [[Native Gameplay Capability Registry]] (IDEA-0047), with typed capability contracts and shared stable entity IDs.
- Complements, but need not invoke, [[LLM State Interpreter and Proposed Operations]] (IDEA-0045) when the UI already supplies typed arguments.
- Rejections and narration repair comply with [[Typed Tool Rejection and Narrative Repair]] (IDEA-0046) and the configurable generation strategies (IDEA-0018).
- All accepted UI-originated persistent changes must enter the complete incremental history in [[Snapshots and Incremental State Rebuild]] (IDEA-0042), preserving the ability to reconstruct every stored turn.
- Optional systems and plugin toggles control which commands are available. Skipped IDEA-0049 did not establish global simulation strictness profiles; do not introduce them here.
- UI context cannot invent an undiscovered reachable destination or an unavailable character/item; selection must refer to grounded, permitted entities.
- This is staging acceptance only, not a final UI specification or implementation.

## Open questions
- Should map clicks act immediately or prepare a narrated travel attempt?
- Which controls execute immediately, request confirmation or stage a proposed action pending further player input?
- Does clicking a destination consume/advance a story turn, and when is narration generated?
- Which built-in and mod-provided operations should expose contextual controls versus remaining prose-only?
- How are available controls discovered, filtered and ordered without overcrowding the interface?
- How are known but currently unreachable map destinations represented, and what error feedback follows a failed action?
- Which controls should support keyboard, touch, accessibility and confirmation/undo workflows?
- Can several UI actions be composed into one coherent proposed turn without committing partial events?
- How should UI-originated actions behave when a plugin is disabled after the controls are displayed?

## Draft acceptance criteria
- [ ] Enabled applicable capabilities can expose optional direct UI actions, including map selection and item Equip/Drop examples.
- [ ] Direct UI actions supply stable entity references and schema-checked typed operations without needing LLM parsing for references already selected.
- [ ] UI actions use the same deterministic permission/world-rule validation and coherent finalisation path as prose-proposed operations.
- [ ] Successful UI actions produce reconstructible accepted persistent changes with appropriate event provenance and consistent narration.
- [ ] Invalid actions cannot be committed solely because a button was pressed; failures are communicated coherently.
- [ ] Controls dependent on disabled or irrelevant systems are hidden/unavailable without weakening validation for enabled systems.
- [ ] A player may always choose natural-language interaction instead of an equivalent button-based action.
- [ ] Immediate execution versus preparation/confirmation, narration timing and exact UI controls remain open for staging refinement.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially assistant-proposed, and now explicitly accepted by the requesting user for staging with the stated constraints.
- This is an accepted **unrefined** idea, not production approval or evidence of implementation.

## Decisions and review history
- 2026-10-17 — **Runtime dependency correction:** The approved IDEA-0053 direction is a **single Wails v3 headless localhost Go server**, packaged for Windows/macOS/Linux and used through the normal browser. The earlier combined WebView-desktop plus headless interpretation has been explicitly superseded. Docker is a separate, unaccepted candidate (IDEA-0065); staging status is unchanged.
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Optional structured UI gameplay commands (such as map selection and Equip/Drop) using stable entity IDs and typed operations, bypassing unnecessary LLM interpretation while remaining under deterministic validation and coherent narration/state finalisation. Show controls only for enabled, applicable capabilities; preserve freeform language input. Leave immediate action versus confirmation, narration timing and specific controls open for refinement. Moved to staging, not production.
