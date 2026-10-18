---
id: "IDEA-0002"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
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

- **Do (requires selected Playing As character):** The player describes an action or attempt **from the currently selected character's identity**. Do is unavailable if no character is selected in the adventure's settings; attempting an action never guarantees success.
- **Say (requires selected Playing As character):** The player's dialogue is attributed to the **currently selected character**. Say is unavailable if no character is selected; narration and other characters' responses still follow story context.
- **Story (always available):** The player directly authors or steers story prose, with or without any characters or designated player actor.
- **Continue (always available):** The narrator advances the story without new player input; neither characters nor a selected player actor are prerequisites.

**Shared world-state validation:** All four modes use the same world-state validation pipeline when an enabled tracking/simulation subsystem is affected. Modes change input semantics and narrator prompting, **not** the authoritative game rules. Prose in Story mode is not automatically exempt from state reconciliation; exact treatment of direct author edits remains a design question.

## Proposed behaviour
Provide a mode selector and unrestricted text input for enabled Do, Say and Story, plus a hands-off Continue control. **Do and Say are disabled until the player chooses a character in the adventure Settings sidebar's `Playing As` selector**, populated from actual Lorebook character records (IDEA-0020/0026). The dropdown's **Add Character** entry opens Lorebook manual character creation; it does not silently make an AI-created avatar. Story and Continue stay available with no characters or no selection. Pass selected mode to the narrator and, when relevant, the event interpretation layer. Represent attempts separately from successfully committed world events. Model-generated state changes remain provisional until validated, regardless of input mode.

## Alternatives and trade-offs
The same composer UI may be reused across Do, Say and Story; whether modes use separate buttons, shortcuts or one menu remains open. One universal mode was an alternative, but the user accepted all four. Validation strictness and interpretation pass strategy are separate design decisions.

## Characterless and multi-character actions
- **Accepted flexible character model with refined Do/Say gate (IDEA-0007/0026):** A story may have **zero or many characters** without a permanent protagonist. **Only Story and Continue are available with no selected `Playing As` character**. Do and Say become enabled when one existing Lorebook character is explicitly selected in the adventure's Settings sidebar. Story-wide narration can describe environmental/world events without pretending an unnamed player character caused them.
- **Explicit Do/Say actor; other turns remain flexible:** The saved `Playing As` selection supplies **the speaking/acting player character for Do and Say**, eliminating per-turn who-am-I confirmation. The generated story/events may still involve additional grounded actors. Story and Continue can have **zero, one or multiple actors** and are not forced to act as the selected character. Narrative viewpoint and actual entity/world state remain separate.
- **No ambiguous first-person confirmation in Do/Say:** Since these modes cannot be used until `Playing As` is set, a first-person Do/Say input such as "I draw my sword" uses the selected character ID as the actor (subject to ordinary possession/validation). With no selection, **disable Do/Say instead of asking the user to identify the character**. Story and Continue retain their existing source-grounded actor interpretation; never invent an unnamed protagonist or a global Player Inventory.

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
- [ ] Story and Continue can always be used, including in an entirely characterless adventure. Do and Say appear unavailable/disabled unless an actual character has been selected in the adventure Settings sidebar's `Playing As` control.
- [ ] The `Playing As` selector lists existing Lorebook character entities by name and stable ID, with an **Add Character** route that takes the player to Lorebook **manual character entry**; choosing a character enables Do/Say without needing per-turn actor confirmation.
- [ ] **Creating or saving characters does not enable Do/Say by itself, automatically assign the newly created character to `Playing As`, or return to the story.** Several Lorebook characters may be added before the user explicitly makes a choice. An existing selection is not replaced by later creation.
- [ ] Do input is attributed to the currently selected `Playing As` character as an attempted action, not automatically a successful state mutation; Say is attributed to that same character as their dialogue. Changing the selection does not move inventory or mutate character facts.
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
- 2026-10-18 — **User rejected proposed automatic actor selection/return after creating characters:** Players may add multiple Lorebook characters. Creating/saving one does not automatically set/replace `Playing As` or return to story; explicit Settings selection alone chooses the actor/speaker for Do/Say. If no character is selected those modes stay disabled. Staging unchanged.
- 2026-10-18 — **User explicitly selected Settings sidebar `Playing As` character selector instead of per-turn confirmations:** Do and Say **must be disabled unless a character is selected**. Selector choices come from existing Lorebook character entities, with **Add Character** navigating to Lorebook manual entry. Do/Say use the selected character's name/identity for speaking and actions without asking who 'I' is every turn. **Story and Continue always work without a character**. No placeholder avatar or global player inventory. Earlier suggestion that all four modes are available in characterless adventures and would ask for ambiguous Do/Say actor confirmation is **superseded**; remains staging only.
- 2026-10-18 — **Accepted IDEA-0007/0026 flexible-character integration:** Do, Say, Story and Continue must work with zero or many characters, optional narrative focus and per-turn actor identification. Actions and inventory cannot silently default to a made-up permanent protagonist; ambiguous first-person input remains unresolved or requires clarification. Staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user** for staging: all four modes (Do, Say, Story, Continue), with shared world-state validation for enabled simulation/tracking features. Staging signifies accepted direction, **not** approval for production or implementation.
