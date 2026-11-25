---
id: PRD-0026
type: prd
status: accepted
related:
- NOTE-0035
- PRD-0001
- NOTE-0013
- NOTE-0009
---

# Author Notes and Persistent Story Instructions

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0025](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Author%20Notes%20and%20Persistent%20Story%20Instructions.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S08**. First milestone: **M4**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Accepted direction
- **Persistent editable author notes:** Let players author and revise enduring story-writing guidance, narrative preferences and instructions without placing those instructions inside narrative prose.
- **Separate from canonical fiction and world state:** Author notes are prompts to the narrator, not historical events, Lorebook facts or mutations of game entities. Editing instructions must not retroactively rewrite saved story text or validated world state.
- **Layered instruction scopes:** Support **global** preferences across adventures, **per-adventure** directions and **optional per-scene** notes for local storytelling guidance. Players should be able to see which scopes apply to a generation.
- **Independent yet coordinated with current settings:** Custom author notes complement the adventure's current Narration Style and Perspective Controls (IDEA-0010) and any initial writing directions supplied by a reusable **scenario template** (IDEA-0008). **No narration-style preset manager** is accepted.
- **Context inclusion each narrative turn:** Without making the player restate them, include the **currently applicable persistent author notes on every AI narrative generation turn**, along with the active style settings, through Token-Budgeted Context Builder and Inspector (IDEA-0024). Show requested, selected and actually transmitted instruction context, making material omissions/capacity limits explicit. A note that could not fit must never be silently presented as if it was sent.
- **Explicit precedence constraints:** Player-authored stylistic or narrative directions must **not override validated, authoritative world-state constraints or established game outcomes**. A losing character cannot become victorious solely because a note asks the narrator never to show a loss.
- **Deterministic inclusion, not semantic conflict resolution (user decision 2026-10-23):** Assemble applicable global, adventure, optional scene, current narration-style and template-derived instructions in a **stable, predictable order** and send them to the selected model subject to actual context limits. Lorebound does **not** analyse, mediate, prioritize or automatically reconcile contradictory creative instructions. Their eventual interpretation is up to the model and player. The exact consistent ordering is an implementation detail, not a new decision on which contradictory note should win. No saved narration-style preset layer is introduced.
- **Respect single- and multi-model use:** Applicable narration/task instructions should be routed coherently with the user's model and pipeline choices; separate stage-specific prompt policies are refinement work.

## Dependencies and constraints
- Builds on accepted Narration Style and Perspective Controls (IDEA-0010), Entity-Based Lorebook (IDEA-0020) and Token-Budgeted Context Builder and Inspector (IDEA-0024), while respecting the approved planning direction for deterministic validation in Configurable Generation Pipeline Strategies (IDEA-0018).
- Author notes are player instructions, not authoritative world-state operations. A request such as "never let the protagonist lose" cannot defeat a validated defeat or committed outcome.
- Keep global, adventure and optional scene notes distinct and in stable, inspectable assembly order. No automatic cross-layer overwrites or conflict arbitration. Scene-note applicability should not silently persist beyond its intended scope.
- Different pipeline stages may require different instruction subsets. Do not blindly send creative narration notes to state-interpreter prompts if those notes would undermine structured validation.
- Model context limits and provider behaviour can change which instruction text is transmitted; inspection must distinguish requested from effective content and safely redact secrets.
- **Resolved:** Lorebound performs no semantic conflict detection/explanation or automatic precedence resolution among creative instruction layers. Only their **consistent assembly order**, applicability, provider limitations, visible omissions and hard world-state validation boundaries require normal implementation design.

## Open questions
- Which **documented deterministic concatenation order** should be implemented for applicable global, adventure, scene and current style instructions? The engine need not adjudicate contradictions regardless of order.
- Are scene-specific notes manual, automatically scoped to a defined segment, or optionally temporary until cleared?
- **Resolved boundary:** Notes steer generated prose and are sent as-is in a predictable order; they cannot bypass authoritative world-state validation, and explicit Story authorial assertions use their separate accepted path. No note-conflict solver is required.
- Should different model task roles (narrator, interpreter, summariser) receive different author-note sections?
- What limits, character/token counts or budget priorities should apply to persistent notes?
- **Out of scope after IDEA-0010 revision (2026-10-18):** No separate reusable narration-style or author-note preset manager or style-preset import/export is approved. Directly editable persistent author notes and reusable scenario-template inputs are the accepted steering mechanisms.
- **Resolved conflict policy:** Do not identify or arbitrate contradictory notes. The context inspector continues to show requested/selected/transmitted segments and material budget omissions; its layout remains an implementation choice.

## Draft acceptance criteria
- [ ] Current narration settings and applicable author notes are assembled anew for **each** AI narrative generation, reflecting edits since the prior turn, without a standalone reusable style/author-note preset system.
- [ ] A player can create, edit and persist author notes independently of story prose and world-state entity records.
- [ ] The user interface supports global and per-adventure instruction scopes, with optional scene-level notes.
- [ ] **Every AI narrative generation turn** incorporates the then-applicable persistent author-note layers and current narration settings into its requested context, without requiring the player to paste them into prose. Material context-window omissions must be surfaced and distinguished from transmitted instructions.
- [ ] The context inspector distinguishes requested, selected and actually transmitted author instructions and reports their inclusion or omission.
- [ ] Incompatible instructions cannot override validated world-state constraints or independently rewrite already committed narrative history.
- [ ] Players can inspect which applicable global, adventure, scene and style instructions were actually assembled in a **predictable fixed order**. No automatic semantic conflict detection or preference arbitration is implemented.
- [ ] Changing a note does not retroactively modify stored prose, committed game events or current authoritative state.
- [ ] Author-note text can be applied appropriately when narration and other tasks use one model or several task-specific models.

## Supporting detail

See [NOTE-0035](../knowledge/inbox/NOTE-0035-prd-0026-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
