---
id: PRD-0051
type: prd
status: accepted
related:
- NOTE-0055
- PRD-0001
- NOTE-0008
- NOTE-0016
- NOTE-0007
---

# Structured UI Game Actions

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0050](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Structured%20UI%20Game%20Actions.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S03**. First milestone: **M8**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Current accepted narrative-first scope — 2026-10-28

**Current semantics ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** A structured UI click can express an **intent** (such as “Transfer Sword”), but canonical world history records **accepted declarative outcomes** (such as `SetItemHolder(sword, chest)`) rather than requiring a source-holder precondition. UI and prose use the same typed representable event/atomic commit boundary. Optional action mechanics may guide an uncommitted attempted action, but no interface may veto a coherent already accepted narrative fact because its earlier fictional cause is missing.


## Accepted direction
- **Optional direct gameplay UI, excluding map travel (user decision 2026-10-23):** Offer structured controls for appropriate enabled actions, such as **Equip/Drop**, as alternatives to their prose equivalents. **The location map does not provide travel or player-action commands.** Clicking a map node only inspects/focuses it; deliberate map **add/edit/correct location** tools are authoritative *world editing*, not Do/Say movement.
- **Typed commands and stable references:** UI actions supply capability IDs, typed arguments and stable entity/item/location identifiers directly to the deterministic coordinator. Do not require an LLM interpretation pass merely to determine the referenced item or destination already selected by the UI.
- **One declarative result pipeline for all inputs:** UI commands and prose can express different intentions, but accepted results enter the same grounded typed **state-assertion** and atomic commit pipeline. Optional permission/world-rule checks apply to provisional attempts or external side effects, **not to the historical feasibility of already accepted story facts**. UI selection is not a shortcut around validation.
- **Coherent narration and state:** When an action is accepted or rejected, the coordinator ensures the resulting story prose and incrementally recorded canonical state agree. Narration may use the selected model and configured generation strategy; a typed UI action does not guarantee that narration itself is model-free.
- **Controls respect enabled systems:** Expose UI affordances only for enabled, relevant and permitted registered gameplay capabilities. If an optional plugin or system is disabled (for example inventory equipment), do not show controls dependent on that mechanic.
- **Natural-language input remains supported:** Direct controls supplement player prose, not replace it. The player can still describe travel, equipment and interactions freely through the accepted LLM interpreter when preferred.
- **Gameplay button execution remains open outside the map:** Exact immediate/prepare/confirmation and narration behavior for optional nonmap action controls (such as Equip/Drop) is still unrefined. **Resolved:** No map click starts a gameplay action, movement, narration turn or travel attempt.
- **Scope remains unrefined for nonmap controls:** Exact applicable buttons, accessibility, confirmation, narration timing, costs and filtering remain staging questions. The map is a separate world view/editor under IDEA-0037, **not** an action picker; editing recorded locations uses the validated world-state update boundary.

## Dependencies and constraints
- Routes to Deterministic Adventure Coordinator (IDEA-0044), whose validators and atomic finalisation remain authoritative; UI selection does not bypass them.
- Uses discoverable, enabled operations from Native Gameplay Capability Registry (IDEA-0047), with typed capability contracts and shared stable entity IDs.
- Complements, but need not invoke, LLM State Interpreter and Proposed Operations (IDEA-0045) when the UI already supplies typed arguments.
- Rejections and narration repair comply with Typed Tool Rejection and Narrative Repair (IDEA-0046) and the configurable generation strategies (IDEA-0018).
- All accepted UI-originated persistent changes must enter the complete incremental history in Snapshots and Incremental State Rebuild (IDEA-0042), preserving the ability to reconstruct every stored turn.
- Optional systems and plugin toggles control which commands are available. Skipped IDEA-0049 did not establish global simulation strictness profiles; do not introduce them here.
- Optional nonmap typed UI gameplay actions must reference grounded entities and enabled permissions. Map inspection/selection never expresses travel, while deliberate map editing of even `undiscovered` recorded locations may change valid world data (IDEA-0037); **discovery status is not the player's map-editor access gate**.
- This is staging acceptance only, not a final UI specification or implementation.

## Open questions
- **Resolved 2026-10-23:** Map clicks never prepare, execute or narrate travel; they select/inspect a node, and explicit editing tools add/correct recorded world locations.
- Which controls execute immediately, request confirmation or stage a proposed action pending further player input?
- **Resolved 2026-10-23:** Clicking a map node never advances a story turn and does not trigger AI narration. Other nonmap action controls may have separately refined turn/narration behavior.
- Which built-in and mod-provided operations should expose contextual controls versus remaining prose-only?
- How are available controls discovered, filtered and ordered without overcrowding the interface?
- What visual information should the *map editor* show for reachable/unreachable or `undiscovered` locations without making them gameplay action buttons? No failed travel command results from selecting a node.
- Which controls should support keyboard, touch, accessibility and confirmation/undo workflows?
- Can several UI actions be composed into one coherent proposed turn without committing partial events?
- How should UI-originated actions behave when a plugin is disabled after the controls are displayed?

## Draft acceptance criteria
- [ ] Enabled applicable capabilities can expose optional direct UI **gameplay** actions such as item Equip/Drop. Map selection is **not** such a gameplay action and does not cause travel; explicit map editing is a different validated world-state editing control.
- [ ] Direct UI actions supply stable entity references and schema-checked typed operations without needing LLM parsing for references already selected.
- [ ] UI actions use the same deterministic permission/world-rule validation and coherent finalisation path as prose-proposed operations.
- [ ] Successful UI actions produce reconstructible accepted persistent changes with appropriate event provenance and consistent narration.
- [ ] Invalid actions cannot be committed solely because a button was pressed; failures are communicated coherently.
- [ ] Controls dependent on disabled or irrelevant systems are hidden/unavailable without weakening validation for enabled systems.
- [ ] A player may always choose natural-language interaction instead of an equivalent button-based action.
- [ ] Execution/confirmation/narration specifics remain open for **nonmap** gameplay buttons; map node selection never constitutes a game action or story turn.

## Supporting detail

See [NOTE-0055](../knowledge/inbox/NOTE-0055-prd-0051-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
