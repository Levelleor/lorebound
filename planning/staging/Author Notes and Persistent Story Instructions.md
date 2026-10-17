---
id: "IDEA-0025"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
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
- **Independent yet coordinated with style controls:** Custom author notes complement [[Narration Style and Perspective Controls]] (IDEA-0010) and may clarify creative direction beyond a preset style or perspective choice.
- **Context integration and transparency:** Include applicable notes as separately identifiable instructions in the generation context under [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024), with inspector visibility into requested, selected and actually transmitted instructions. Explain any omissions or inability to fit instructions within the active model's context budget.
- **Explicit precedence constraints:** Player-authored stylistic or narrative directions must **not override validated, authoritative world-state constraints or established game outcomes**. A losing character cannot become victorious solely because a note asks the narrator never to show a loss.
- **Conflicts are inspectable:** Handle clashes between global, adventure and scene notes, chosen style controls, provider/model requirements and hard world rules explicitly. The exact override/merge precedence among compatible author-note layers is not yet decided.
- **Respect single- and multi-model use:** Applicable narration/task instructions should be routed coherently with the user's model and pipeline choices; separate stage-specific prompt policies are refinement work.

## Proposed behaviour
Offer editable global, adventure and optional scene-level author-note fields, separate from the prose editor and persistent Lorebook. Resolve which scopes apply to the active generation; compose them into clearly attributed instruction segments while preserving hard validation constraints and observing context limits. Let players inspect which instructions the context builder requested, selected, omitted and actually transmitted. When scene notes are temporary, show their scope and let the user update or clear them without rewriting existing story history.

## Alternatives and trade-offs
A single instruction field is simpler but can force players to repeat shared preferences and mix global rules with adventure-local or scene-specific direction. The accepted direction uses layered global, adventure and optional scene scopes, though precise inheritance and override UX remain open. An explicit instruction inspector adds clarity but consumes UI space and may expose complicated prompt conflicts that need understandable presentation.

## Dependencies and constraints
- Builds on accepted [[Narration Style and Perspective Controls]] (IDEA-0010), [[Entity-Based Lorebook]] (IDEA-0020) and [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024), while respecting the approved planning direction for deterministic validation in [[Configurable Generation Pipeline Strategies]] (IDEA-0018).
- Author notes are player instructions, not authoritative world-state operations. A request such as "never let the protagonist lose" cannot defeat a validated defeat or committed outcome.
- Global preferences should not silently overwrite per-adventure decisions; scene notes should have explicit scope and not linger invisibly.
- Different pipeline stages may require different instruction subsets. Do not blindly send creative narration notes to state-interpreter prompts if those notes would undermine structured validation.
- Model context limits and provider behaviour can change which instruction text is transmitted; inspection must distinguish requested from effective content and safely redact secrets.
- Prompt priority semantics and how conflicting instructions are explained need refinement before production approval.

## Open questions
- In what order do global, adventure and scene-level author notes combine when they conflict?
- Are scene-specific notes manual, automatically scoped to a defined segment, or optionally temporary until cleared?
- How should instruction notes interact with hard validated world constraints, creative controls and player direct actions?
- Should different model task roles (narrator, interpreter, summariser) receive different author-note sections?
- What limits, character/token counts or budget priorities should apply to persistent notes?
- Can players save, copy or export global note presets independently of adventures?
- How should users view conflicts or omissions in the effective context without overwhelming the ordinary writing UI?

## Draft acceptance criteria
- [ ] A player can create, edit and persist author notes independently of story prose and world-state entity records.
- [ ] The user interface supports global and per-adventure instruction scopes, with optional scene-level notes.
- [ ] A future generation can receive applicable author-note layers through the context builder without requiring the player to paste them into narrative prose.
- [ ] The context inspector distinguishes requested, selected and actually transmitted author instructions and reports their inclusion or omission.
- [ ] Incompatible instructions cannot override validated world-state constraints or independently rewrite already committed narrative history.
- [ ] Players can inspect or control how global, adventure and scene scopes apply to the current generation.
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
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Persistent editable author notes and story instructions separate from narrative prose; layered global/adventure/optional scene scopes; inclusion in model context with inspector visibility; and clear precedence that does not override authoritative world-state constraints. Moved to staging for refinement, not production.
