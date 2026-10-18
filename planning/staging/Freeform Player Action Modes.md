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
- **Explicit Do/Say actor; other turns remain flexible:** The saved `Playing As` selection supplies **the speaking/acting character for Do and Say**, eliminating per-turn who-am-I confirmation. The generated story/events may still involve additional grounded actors. Story and Continue can have **zero, one or multiple actors** and are not forced to act as the selected character. Narrative viewpoint and actual entity/world state remain separate.
- **No ambiguous first-person confirmation in Do/Say:** Since these modes cannot be used until `Playing As` is set, a first-person Do/Say input such as "I draw my sword" uses the selected character ID as the actor (subject to ordinary possession/validation). With no selection, **disable Do/Say instead of asking the user to identify the character**. Story and Continue retain their existing source-grounded actor interpretation; never invent an unnamed protagonist or a global Player Inventory.

## Every character is eligible for Playing As
- **Explicit user decision:** Lorebound has **one kind of character**. There is **no permanent player character, NPC classification or Playable tag**. Any actual character in the adventure's Lorebook can be selected in the Settings sidebar `Playing As` dropdown for Do/Say, even if the story previously treated them as another participant.
- Selecting a character is a **temporary role in the player's next Do/Say inputs**, not a change in the character's fundamental identity or story state. Actor/speaker attribution uses the chosen stable ID, and normal gameplay validation still applies.
- Story/Continue require no selection, including a world without characters. Creation in Lorebook remains independent of `Playing As` and **never auto-selects** the new character. Do not add a designation step or screen asking whether someone is an NPC or playable.

## Do and Say follow the selected character's own scene
- **Explicitly accepted scene-cut behaviour:** After the player chooses a different established character in Settings `Playing As`, their **next Do or Say** uses that character as actor/speaker and starts in **that character's last established physical location and narrative situation**, not the previous Do/Say actor's scene. The switch is a **narrative cut**, with no need for a transition action, journey, in-world time passage or repeated identity confirmation.
- All other characters retain their canonical location, possessions and history. A switch **does not move** either character or bypass ordinary validation if the subsequent Do/Say action itself proposes movement or another state change.
- **Story and Continue** are not automatically forced to use the `Playing As` viewpoint and remain available when none is selected. If the actor's exact location is unknown, keep it unknown instead of placing them at the last viewed character's location.

## Do and Say follow the selected character's established scene
After selecting any Lorebook character in `Playing As`, **the next Do/Say takes place from that character's own established scene**, not the previously selected actor's location. Switching is a narrative cut, **not an in-world move**, and needs neither actor confirmation nor travel narration. Subsequent narrated movement is validated normally. `Story` and `Continue` remain independent and usable without a selected character; unknown whereabouts are not invented.

## Composer Lorebook shortcut and Settings tab
- **Accepted IDEA-0062 layout refinement:** The information panel includes **Info** and **Settings** tabs. The already accepted Lorebook-backed **`Playing As` selector sits in the Settings tab**; Do/Say still require an explicit choice of any existing character. A prior reference to a 'Settings sidebar' refers to this tab in the shared info/settings panel, not a separate mandatory sidebar.
- The composer provides a **Lorebook icon immediately to the left of the story input field**. It opens the editable Lorebook directly for frequent consultation and updates. It is **not** an alternative Do/Say actor shortcut or a required third information-panel tab. Lorebook manual **Add Character** flow and no-auto-selection policy remain unchanged.
- Switching panel tabs or opening Lorebook never submits an input, accepts a story turn or changes canonical state. Keyboard accessibility and responsive presentation follow IDEA-0062.

## Composer Lorebook button opens the left drawer
- **Accepted IDEA-0062 drawer behaviour:** The Lorebook icon immediately **LEFT of the story input** opens the Lorebook as a **resizable left-side drawer** (with an optional expanded workspace), rather than as a third Info/Settings tab. It follows the user-specified **two-phase entrance**: the narrow sidebar/rail first, then the larger Lorebook body reveals from behind it. Closing is a **simple fade-out** rather than a two-stage reverse. Durations and exact visual treatment remain open; support reduced-motion preferences.
- This is a **navigation/editor affordance**, not another action mode. Opening or closing the drawer does not submit the composer text or alter the selected `Playing As` actor. The **Info/Settings** tabs stay distinct and Do/Say remain gated on an explicitly selected character; Story/Continue stay available in characterless adventures.
- The drawer exposes normal Lorebook editing, including multiple manual character creations. It must not imply automatic selection of the latest created character. Restore sensible input focus when closing where appropriate; opening/closing is noncanonical.

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
- [ ] The story input has a Lorebook icon immediately to its left that opens a **LEFT-side drawer**; **sidebar/rail first, main content from behind it second** on entrance, with simple **fade-out** on close and reduced-motion support.
- [ ] Opening/closing the Lorebook drawer does not submit Do/Say/Story text, change action modes, or change `Playing As` automatically.
- [ ] A dedicated, keyboard-accessible Lorebook icon sits immediately left of the input field and opens Lorebook directly.
- [ ] The **Settings** tab in the two-tab information panel contains `Playing As`; **Info** shows the explicitly selected character's authoritative information, while Do/Say still require selection and Story/Continue do not.
- [ ] With Mara in the capital and Theo in a forest, changing `Playing As` to Theo makes the next Do/Say follow Theo **in the forest** without relocating anyone or moving items.
- [ ] If Mara is at the capital and Theo in a forest, choosing Theo in `Playing As` makes the next Do/Say **Theo's action or speech from his forest scene**, without modifying Mara's or Theo's established location/state.
- [ ] A switch needs no user confirmation or narrated travel; subsequent world-affecting actions still receive their normal validation.
- [ ] Story/Continue are not constrained to the chosen Do/Say actor, and a new actor with unknown whereabouts is not teleported to the previous scene.
- [ ] Story and Continue can always be used, including in an entirely characterless adventure. Do and Say appear unavailable/disabled unless an actual character has been selected in the adventure Settings sidebar's `Playing As` control.
- [ ] The `Playing As` selector lists **every existing character in the adventure's Lorebook** by name and stable ID, **without PC/NPC or Playable filtering**, with an **Add Character** route to Lorebook **manual character entry**; explicitly choosing any character enables Do/Say without per-turn actor confirmation.
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
- 2026-10-18 — **Accepted IDEA-0062 composer refinement:** The composer-left Lorebook icon opens a resizable drawer from the **left edge**, animated **sidebar first, main body from behind second**; closing is a **simple fade-out**. Lorebook remains an editor rather than action mode and does not auto-select a character. Accessible reduced-motion support. Staging only.
- 2026-10-18 — **Explicit user acceptance (IDEA-0062):** Use **Info** and **Settings** tabs together in the information panel, place the `Playing As` selector under Settings, and provide a **Lorebook icon immediately left of the story input** for frequent access. Nothing auto-selects a character or commits world state. Staging only.
- 2026-10-18 — **User explicitly accepted:** Switching `Playing As` between distant characters is a **narrative cut**. The next Do/Say uses the newly chosen character's established scene/location, with no travel, teleportation, time passage, inventory/state transfer or extra confirmation. Story/Continue remain independent. Staging only.
- 2026-10-18 — **Explicit user acceptance of narrative-cut switching:** Changing Settings `Playing As` between characters, even distant ones, causes the **next Do/Say to follow the newly chosen character at their already established scene/location**. No travel, teleportation, time passage or transfer of world state is caused by selection; Story/Continue remain actor-independent. Staging only.
- 2026-10-18 — **User explicitly accepted universal character eligibility:** Every Lorebook character appears in `Playing As`; there is **no PC/NPC type** and no Playable designation. The player simply takes Do/Say turns as whichever existing character they explicitly select. Unselected Do/Say stay disabled; Story/Continue and manual multiple-character creation stay unchanged. Staging only.
- 2026-10-18 — **User rejected proposed automatic actor selection/return after creating characters:** Players may add multiple Lorebook characters. Creating/saving one does not automatically set/replace `Playing As` or return to story; explicit Settings selection alone chooses the actor/speaker for Do/Say. If no character is selected those modes stay disabled. Staging unchanged.
- 2026-10-18 — **User explicitly selected Settings sidebar `Playing As` character selector instead of per-turn confirmations:** Do and Say **must be disabled unless a character is selected**. Selector choices come from existing Lorebook character entities, with **Add Character** navigating to Lorebook manual entry. Do/Say use the selected character's name/identity for speaking and actions without asking who 'I' is every turn. **Story and Continue always work without a character**. No placeholder avatar or global player inventory. Earlier suggestion that all four modes are available in characterless adventures and would ask for ambiguous Do/Say actor confirmation is **superseded**; remains staging only.
- 2026-10-18 — **Accepted IDEA-0007/0026 flexible-character integration:** Do, Say, Story and Continue must work with zero or many characters, optional narrative focus and per-turn actor identification. Actions and inventory cannot silently default to a made-up permanent protagonist; ambiguous first-person input remains unresolved or requires clarification. Staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user** for staging: all four modes (Do, Say, Story, Continue), with shared world-state validation for enabled simulation/tracking features. Staging signifies accepted direction, **not** approval for production or implementation.
