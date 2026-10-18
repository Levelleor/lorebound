---
id: "IDEA-0010"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Narration Style and Perspective Controls

## Idea
Control viewpoint, tense, genre, tone, pacing and response length.

## Why this idea matters
Different stories need different narrator behaviour.

## Accepted direction
- **Perspective:** Configure first-person, second-person, or third-person narration without changing the actual character/world state.
- **Tense:** Configure narrative tense (such as past or present).
- **Genre and tone:** Guide the AI toward the intended genre and emotional/writing tone.
- **Pacing:** Control narrative density and speed, for example slower descriptive storytelling or faster action-oriented narration.
- **Response length:** Offer preferences for brief or detailed generations.
- **Custom instructions:** Permit freeform user-authored writing and stylistic instructions rather than only fixed options.
- **Reusable narration presets:** Save and reselect combinations of these style instructions and controls.
- **Future-only application:** Changes to narration settings influence future generated prose; switching presets does **not** automatically revise or regenerate existing passages.

Narration controls steer the model's presentation. They are not authoritative game-state mutations, and they are distinct from provider-level decoding parameters such as temperature and Top-P.

## Proposed behaviour
Expose optional narration preferences and a freeform instruction field for each adventure, along with a way to save and apply reusable style presets. Assemble the currently selected preferences into the narrator's instructions for subsequent generation requests, without retroactively altering existing document blocks. Keep story events, equipment, character locations and other authoritative state unchanged merely because narration settings are updated.

## Alternatives and trade-offs
A single author-note text field is flexible but harder to reuse and discover; dedicated controls are more approachable but can be overly prescriptive. The accepted direction supports both custom writing instructions and configurable options. Their exact UI layout, and whether controls are global defaults, per-adventure defaults, or temporary overrides, remain open.

## Perspective without a mandatory protagonist
- **Accepted IDEA-0007/0026 flexibility:** First-, second- or third-person narration settings and optional character focus must **not require a permanently defined player-character entity**. Lorebound supports stories with **no characters**, no single protagonist or an ensemble cast.
- Focusing on a different established character changes the narrator's viewpoint/context **without changing their persistent location, inventory, status or identity**. A turn can feature a different actor or multiple actors regardless of narrative focus. Perspective preferences must not fabricate an unstated character or turn an ambiguous first-person sentence into a fact.
- Specific viewpoint/focus controls and persistence are implementation details for later refinement.

## Do/Say identity selector versus writing perspective
- **Accepted IDEA-0002/0026 interaction rule:** The adventure Settings sidebar's **`Playing As`** selector chooses an existing Lorebook character who acts/speaks in **Do/Say**. Those modes are **disabled without a valid selection**; Story/Continue work regardless of character count or selected identity.
- **Do/Say actor identity is distinct from narration style.** A third-person narration preference does not change who acts in Do/Say; a selected character does not force Story/Continue to narrate exclusively from that character's perspective. Whether a separate narrator-focus control is useful remains an open UI refinement.
- Switching `Playing As` does not change recorded inventory, location, status or history; it only changes the actor/speaker of subsequent Do/Say input.

## Narration perspective versus universal character choice
- **Accepted IDEA-0026:** All characters in the Lorebook are equally eligible for Settings `Playing As`; there is no permanent PC/NPC kind or Playable designation. Temporary choice of Do/Say actor is **separate from prose tense/viewpoint/style**, and does not reclassify, teleport or alter any character's inventory/status.
- Story and Continue remain actor-independent; narrative perspective can still be story-wide with no character. Exact narrator focus UI remains a future refinement.

## Cut to Playing As character on next Do or Say
- **Accepted 2026-10-18 character-cut decision:** Changing Settings `Playing As` can switch the focus of the **next Do/Say scene** across distant locations to the chosen character's **own established circumstances**. This is a storytelling camera cut, not an in-world move. The narrator should not invent a journey, teleport the character, advance time automatically, or merge different actors' surroundings to connect scenes.
- `Playing As` determines whose Do/Say actions and speech are being provided, **not** an automatic mutation of their location/inventory or a requirement that all narration always follows that person. Independent first/second/third-person prose-style preferences still apply, with Story/Continue free to follow other subjects.
- What visual indicator or transition prose (if any) denotes a cut remains a separate UI/stylistic refinement; **no mandatory switching confirmation** is required.

## Scene cuts when Playing As changes
- **Accepted:** The next Do/Say after switching `Playing As` follows the selected character at their **existing established location**, however distant from the prior character. Narration may cut directly between scenes; it must not invent travel, teleportation, time lapse or shared location because of selection. `Story` and `Continue` remain independent. Narration tense/style is unchanged by selection.

## Dependencies and constraints
- Depends on the narrator/context builder and generation model integration; the UI and prompt format remain to be refined.
- Model adherence is best-effort; a selected perspective, tone or tense cannot be guaranteed by arbitrary LLMs.
- Style preferences should not override validated game-world state rules.
- Output length may involve narrator instructions and a model-specific generation cap; sampling and API capability controls are separate planning ideas.
- Applying or modifying a preset must not trigger automatic rewriting of earlier story text.

## Open questions
- Which preferences are implemented entirely as prompt instructions, and which may map to provider-supported decoding or output-limit controls?
- What is the precedence between a preset, per-adventure style overrides, and custom writing instructions?
- Can players temporarily switch narration styles for a single continuation without changing the saved default?
- How should conflicting preferences such as short responses plus elaborate descriptive pacing be handled?
- Should preset sharing/import-export be included in this feature or handled elsewhere?

## Draft acceptance criteria
- [ ] After changing `Playing As`, the next Do/Say adopts the chosen character's established scene even if elsewhere; no invented travel, teleportation, time advancement or movement event appears solely from changing viewpoints.
- [ ] Story/Continue remain independently steerable and narration style preferences are not rewritten by actor selection.- [ ] A player can configure narration perspective, tense, genre, tone, pacing and desired response length for upcoming generation.
- [ ] A player can provide custom freeform narrative style instructions.
- [ ] A player can save a named narration preset and reuse it in an adventure.
- [ ] Changes to narration settings affect future generation prompts, not previously saved narrative passages.
- [ ] Changing style preferences alone does not mutate tracked character, inventory, location or other world state.
- [ ] Provider-specific controls remain separately configurable; unsupported API parameters are not implicitly required by this feature.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant proposal, subsequently explicitly selected by the requesting user.
- Accepted for staging and refinement only; this does not mean that controls have been implemented or approved for production.

## Decisions and review history
- 2026-10-18 — **Explicit user acceptance:** `Playing As` switching is a narrative cut; the next Do/Say follows the chosen character in their existing circumstances. Switching causes no physical travel, time passage or item movement. Staging only.
- 2026-10-18 — **User-approved viewpoint cut:** Changing `Playing As` makes next Do/Say follow that character where they already are, even across distant scenes. No travel/teleportation/time lapse, actor confirmation, or world-state transfer results from selection. Story/Continue and narration-style settings remain independent. Staging only.
- 2026-10-18 — **Accepted character-unification dependency:** No PC/NPC or Playable category; any Lorebook character may be used as Do/Say actor, without changing narration-style settings or canonical world state. Staging unchanged.
- 2026-10-18 — **Accepted Do/Say identity selector dependency:** Settings `Playing As` is an explicit Lorebook-backed actor/speaker control for Do and Say (disabled if unset), separate from prose perspective/tense/style options. Story/Continue remain available characterless. Staging unchanged.
- 2026-10-18 — **Accepted flexible-character integration:** Narrative perspective/focus may be unset or change among existing characters while zero-character and ensemble-cast adventures remain supported. Focus is a presentation/context choice and not a canonical action, location or inventory transfer. Staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Configurable perspective, tense, genre, tone, pacing, response length, custom writing instructions and reusable narration presets. These changes affect future narration without rewriting existing prose. Moved to staging for refinement, not production.
