---
id: "IDEA-0025"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Memory Lorebook and Context Brainstorm]]", "[[Gameplay Feature Catalogue Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Author Notes and Persistent Story Instructions

## Idea
Provide stable author notes, story rules and narrative style instructions separate from prose.

## Why this idea matters
Players need persistent steering of the narrator.

## Accepted direction
- **Persistent editable author notes:** Let players author and revise enduring story-writing guidance, narrative preferences and instructions without placing those instructions inside narrative prose.
- **Separate from canonical fiction and world state:** Author notes are prompts to the narrator, not historical events, Lorebook facts or mutations of game entities. Editing instructions must not retroactively rewrite saved story text or validated world state.
- **Layered instruction scopes:** Support **global** preferences across adventures, **per-adventure** directions and **optional per-scene** notes for local storytelling guidance. Players should be able to see which scopes apply to a generation.
- **Independent yet coordinated with current settings:** Custom author notes complement the adventure's current [[Narration Style and Perspective Controls]] (IDEA-0010) and any initial writing directions supplied by a reusable **scenario template** (IDEA-0008). **No narration-style preset manager** is accepted.
- **Context inclusion each narrative turn:** Without making the player restate them, include the **currently applicable persistent author notes on every AI narrative generation turn**, along with the active style settings, through [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024). Show requested, selected and actually transmitted instruction context, making material omissions/capacity limits explicit. A note that could not fit must never be silently presented as if it was sent.
- **Explicit precedence constraints:** Player-authored stylistic or narrative directions must **not override validated, authoritative world-state constraints or established game outcomes**. A losing character cannot become victorious solely because a note asks the narrator never to show a loss.
- **Deterministic inclusion, not semantic conflict resolution (user decision 2026-10-23):** Assemble applicable global, adventure, optional scene, current narration-style and template-derived instructions in a **stable, predictable order** and send them to the selected model subject to actual context limits. Lorebound does **not** analyse, mediate, prioritize or automatically reconcile contradictory creative instructions. Their eventual interpretation is up to the model and player. The exact consistent ordering is an implementation detail, not a new decision on which contradictory note should win. No saved narration-style preset layer is introduced.
- **Respect single- and multi-model use:** Applicable narration/task instructions should be routed coherently with the user's model and pipeline choices; separate stage-specific prompt policies are refinement work.

## Proposed behaviour
Offer editable global, adventure and optional scene-level author-note fields, separate from story prose and the persistent Lorebook. Determine which scopes apply, **concatenate them and current story-style instructions in a documented deterministic order**, and respect hard validation boundaries and finite context. Do not attempt to infer which conflicting creative instruction should prevail or use an AI conflict-resolution pass. Let players inspect which instructions the context builder requested, selected, omitted and actually transmitted. When scene notes are temporary, show their scope and let the user update or clear them without rewriting existing story history.

## Alternatives and trade-offs
A single instruction field is simpler but can force players to repeat shared preferences and mix global rules with adventure-local or scene-specific direction. The accepted direction uses layered global, adventure and optional scene scopes, though precise inheritance and override UX remain open. The existing context inspector reveals which instructions were selected and sent, but **no separate semantic conflict report or resolution UI is required**. Contradictory creative notes may produce variable model adherence, which the user accepts.

## Persistent steering on every generation turn, without style presets
- **Accepted IDEA-0010 user revision (2026-10-18):** The player steers ongoing narration through **template-provided initial inputs when a scenario template was used**, **current narration settings**, and **editable persistent author notes**. There is **no saved narration-style preset gallery** to copy/apply or keep synchronized. Scenario templates are optional and do not become an account-level style manager.
- **Once written, notes are reused automatically:** Resolve applicable global, adventure and optional scene-scoped author notes and supply them to the context builder **on every AI-generated narrative turn**, along with the current effective narration controls. Do not require the player to repeatedly paste a note into the story input. Editing a note affects future prompt assembly only and does not revise past prose or canonical world facts.
- **Preserve transparent context limits:** Prioritize material active instructions as appropriate alongside authoritative world-state constraints. IDEA-0024 still enforces finite model context budgets and reports what was actually transmitted; if relevant note text cannot be included, communicate that fact rather than silently dropping it while claiming continuity. Exact precedence/budget-resolution UX remains open.
- **Authorship boundary:** Author notes and creative style instructions influence model behaviour; they are **not accepted world-state events** or a way for the AI to bypass canonical validation. Player-written Story mode declarations may separately establish world changes under IDEA-0002; that does not transform author notes into unrestricted world-edit commands.

## Dependencies and constraints
- Builds on accepted [[Narration Style and Perspective Controls]] (IDEA-0010), [[Entity-Based Lorebook]] (IDEA-0020) and [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024), while respecting the approved planning direction for deterministic validation in [[Configurable Generation Pipeline Strategies]] (IDEA-0018).
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Originally an assistant-proposed option, explicitly accepted by the requesting user for staging.
- Staging is an unrefined, human-accepted direction, not approval for production or evidence of implementation.

## Decisions and review history

- 2026-10-23 — **User resolved A-15:** When author notes, style settings and template-provided instructions contradict, Lorebound does **not** attempt to resolve them. It consistently orders the applicable instruction layers, sends what fits to the model and leaves semantic adherence to the model/player. Exact deterministic order is a minor implementation choice, not precedence logic. Previously accepted context inclusion/omission transparency and hard canonical world validation remain intact. Staging only.
- 2026-10-18 — **User revised IDEA-0010:** Removed narration-style presets from accepted features. Story steering comes from optional scenario-template initial instructions, current narration settings and persistent author notes, automatically included as relevant context on every AI narrative turn with transparent budget limitations. No author-note/style-preset manager or extra repeated player input is required. Original layered note scopes and canonical-state safeguards remain. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Persistent editable author notes and story instructions separate from narrative prose; layered global/adventure/optional scene scopes; inclusion in model context with inspector visibility; and clear precedence that does not override authoritative world-state constraints. Moved to staging for refinement, not production.
