---
id: "IDEA-0002"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Freeform Player Action Modes

## Idea
Provide Do, Say, Story and Continue as distinct ways of interacting with the AI.

## Why this idea matters
Player actions, dialogue and direct prose authorship have different narrative semantics.

## Accepted direction
Lorebound will offer **all four freeform narrative interaction modes**:

- **Do:** The player describes a character action or attempt. Attempting an action does not guarantee it succeeds.
- **Say:** The player speaks in character, with narration and NPC responses determined by story context.
- **Story:** The player directly authors or steers story prose, rather than only taking an in-world character action.
- **Continue:** The narrator advances the story without new player input.

**Shared world-state validation:** All four modes use the same world-state validation pipeline when an enabled tracking/simulation subsystem is affected. Modes change input semantics and narrator prompting, **not** the authoritative game rules. Prose in Story mode is not automatically exempt from state reconciliation; exact treatment of direct author edits remains a design question.

## Proposed behaviour
Provide a mode selector and unrestricted text input for Do, Say and Story, plus a hands-off Continue control. Pass selected mode to the narrator and, when relevant, the event interpretation layer. Represent attempts separately from successfully committed world events. Model-generated state changes remain provisional until validated, regardless of input mode.

## Alternatives and trade-offs
The same composer UI may be reused across Do, Say and Story; whether modes use separate buttons, shortcuts or one menu remains open. One universal mode was an alternative, but the user accepted all four. Validation strictness and interpretation pass strategy are separate design decisions.

## Dependencies and constraints
- Depends on the eventual narrative coordinator, model prompting and optional game-state modules.
- Interpret mode intent carefully: *attempted* action, spoken words, authored narrative and autonomous continuation may all lead to different consequences.
- A roleplay model can introduce new state changes during Say, Story or Continue; no selected mode bypasses shared validation when tracking is enabled.
- Text editing historical prose is a separate idea; accepting Story input does not approve automated historical rewrites.

## Open questions
- How should Story mode's authorial assertions interact with hard game constraints when the user's direct prose specifies an impossible result?
- Should quoted speech in Do or author text in Story be recognised by content, or only by selected mode?
- Which input modes get dedicated prompt templates and keyboard shortcuts?
- How do validation errors appear without interrupting prose writing?

## Draft acceptance criteria
- [ ] A player can select and use Do, Say, Story and Continue in an adventure.
- [ ] Do input is conveyed to the narrator as an attempted action, not automatically a successful state mutation.
- [ ] Say input is conveyed as in-character dialogue, and Story input as authorial narrative instruction or text.
- [ ] Continue generates a continuation without requiring new player text.
- [ ] For every enabled tracked subsystem, proposed state changes from any mode must pass through the same validation/commit mechanism.
- [ ] An invalid action does not mutate authoritative state solely because it appeared in narration.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- **Accepted for staging/refinement**: four input modes and a shared validation path; UI details and conflict handling remain open.
- No implementation is claimed; this is not production approval.

## Decisions and review history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user** for staging: all four modes (Do, Say, Story, Continue), with shared world-state validation for enabled simulation/tracking features. Staging signifies accepted direction, **not** approval for production or implementation.
