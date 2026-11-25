---
id: PRD-0003
type: prd
status: accepted
related:
- NOTE-0018
- PRD-0001
- NOTE-0009
- NOTE-0012
---

# Freeform Player Action Modes

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0002](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Freeform%20Player%20Action%20Modes.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S03**. First milestone: **M1**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-002B scoped audit](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md); remaining inventory draft
- Evidence: [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md)

## Goals

Support Story, Do, Say and Continue as distinct input modes. Story permits multiline player-authored prose with no actor or mechanics. Do/Say require an existing selected Playing As character, not necessarily in physical scene; do not infer travel from actor change. Provisional and explicitly accepted turns are distinct. The bounded verified slice is simulated Story only.

## Current accepted narrative-first scope — 2026-10-28

**Latest user-approved narrative-first interpretation:** [B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md) applies to **all accepted final story outcomes**, not only player Story-mode authorial overrides. Do/Say/Continue may use optional gameplay rules to guide **uncommitted action attempts** or provisional AI wording; once a fact is actually established in accepted narration, record the corresponding declarative state assertion without requiring proof of a mechanically plausible prior history. Story's stronger authorial override still applies; a mere attempted action does not assert a successful world change. Technical formats, stable IDs and atomicity remain mandatory.


## Accepted direction
Lorebound will offer **all four freeform narrative interaction modes**:

- **Do (requires selected Playing As character):** The player describes an action or attempt **from the currently selected character's identity**. Do is unavailable if no character is selected in the adventure's settings; attempting an action never guarantees success.
- **Say (requires selected Playing As character):** The player's dialogue is attributed to the **currently selected character**. Say is unavailable if no character is selected; narration and other characters' responses still follow story context.
- **Story (always available):** The player directly authors or steers story prose, with or without any characters or designated player actor.
- **Continue (always available):** The narrator advances the story without new player input; neither characters nor a selected player actor are prerequisites.

**Player-authorial Story exception (explicitly accepted 2026-10-18):** All four modes share the same **canonical state coherence, schema, stable-ID, revision, transaction and persistence-integrity safeguards**. However, **Story mode's player-authored assertions may deliberately override in-fiction simulation restrictions** (such as a strict travel graph or ordinary ability/possession prerequisites). Treat clearly stated Story outcomes as authorial declarations rather than attempted actions to be rejected for fictional impossibility. This does **not** excuse partial/contradictory saved state, grant the AI autonomous rule-breaking power, or change Do/Say's ordinary gameplay constraints. Continue's autonomous narration also does not acquire a blanket player-authorial override.

## Dependencies and constraints
- Depends on the eventual narrative coordinator, model prompting and optional game-state modules.
- Interpret mode intent carefully: *attempted* action, spoken words, authored narrative and autonomous continuation may all lead to different consequences.
- **Story mode exception:** A player explicitly authoring an outcome may override **fictional simulation restrictions**, while all resulting persistent updates must still pass **structural/referential, expected-revision, history/provenance and atomic consistency checks**. This privilege is not automatically granted to model-invented events, Do/Say attempted actions or Continue narration. Other modes still follow ordinary enabled gameplay constraints.
- Text editing historical prose is a separate idea; accepting Story input does not approve automated historical rewrites.

## Open questions
- **Resolved (2026-10-18):** In **Story**, deliberate player-authored assertions override in-fiction game/simulation constraints rather than being blocked as impossible. Maintain coherent validated stored state; exactly how to display unsupported/ambiguous authorial effects remains for future implementation refinement.
- Should quoted speech in Do or author text in Story be recognised by content, or only by selected mode?
- Which input modes get dedicated prompt templates and keyboard shortcuts?
- How do validation errors appear without interrupting prose writing?

## Draft acceptance criteria
- [ ] With strict adjacent-only travel enabled, a **player-authored Story declaration** that a known character is now on the other side of the kingdom is accepted as an authorial outcome, with the character's authoritative location changed coherently and provenance recorded **without inventing a route or spell**; no unrelated characters/items move.
- [ ] Optional strict rules can reject or narrate an **uncommitted Do attempt** and guide provisional Continue output. But if final accepted narration actually establishes the result, emit its **grounded declarative state assertion** rather than withholding recorded state for lack of prior mechanical prerequisites.
- [ ] Story authorship may relax fictional movement/eligibility rules but cannot bypass entity/reference integrity, concurrent version guards, accepted history lineage or atomic persistence. A failure leaves canon unchanged, not half-updated.
- [ ] Editing earlier Story prose still requires the previously accepted historical-edit confirmation/rebuild workflow.
- [ ] An unnamed/unknown-name Lorebook character appears in `Playing As` with a non-invented descriptive or neutral fallback label; selecting it enables Do/Say bound to the immutable character ID.
- [ ] Renaming/revealing the character's name does not change selection, history, location, possessions or action attribution; labels are not treated as canonical character names.
- [ ] The story input has a Lorebook icon immediately to its left that opens a **LEFT-side drawer**; **sidebar/rail first, main content from behind it second** on entrance, with simple **fade-out** on close and reduced-motion support.
- [ ] Opening/closing the Lorebook drawer does not submit Do/Say/Story text, change action modes, or change `Playing As` automatically.
- [ ] A dedicated, keyboard-accessible Lorebook icon sits immediately left of the input field and opens Lorebook directly.
- [ ] The **Settings** tab in the two-tab information panel contains `Playing As`; **Info** shows the explicitly selected character's authoritative information, while Do/Say still require selection and Story/Continue do not.
- [ ] With Mara in the capital and Theo in a forest, changing `Playing As` to Theo makes the next Do/Say follow Theo **in the forest** without relocating anyone or moving items.
- [ ] If Mara is at the capital and Theo in a forest, choosing Theo in `Playing As` makes the next Do/Say **Theo's action or speech from his forest scene**, without modifying Mara's or Theo's established location/state.
- [ ] A switch needs no user confirmation or narrated travel; subsequent world-affecting actions still receive their normal validation.
- [ ] Story/Continue are not constrained to the chosen Do/Say actor, and a new actor with unknown whereabouts is not teleported to the previous scene.
- [ ] Story and Continue can always be used, including in an entirely characterless adventure. Do and Say appear unavailable/disabled unless an actual character has been selected in the adventure Settings sidebar's `Playing As` control.
- [ ] The `Playing As` selector lists **every existing character in the adventure's Lorebook** with a descriptive/neutral **display label backed by stable ID**, even when canonical name is unknown, **without PC/NPC or Playable filtering**, with an **Add Character** route to Lorebook manual entry; choosing a character explicitly enables Do/Say without per-turn actor confirmation.
- [ ] **Creating or saving characters does not enable Do/Say by itself, automatically assign the newly created character to `Playing As`, or return to the story.** Several Lorebook characters may be added before the user explicitly makes a choice. An existing selection is not replaced by later creation.
- [ ] Do input is attributed to the currently selected `Playing As` character as an attempted action, not automatically a successful state mutation; Say is attributed to that same character as their dialogue. Changing the selection does not move inventory or mutate character facts.
- [ ] Say input is conveyed as in-character dialogue, and Story input as authorial narrative instruction or text.
- [ ] Continue generates a continuation without requiring new player text.
- [ ] All modes use the **same safe canonical validation and atomic commit boundary**, but deliberate **player-authored Story outcomes may override ordinary in-fiction mechanics**. Do/Say attempted actions and autonomous Continue/model claims retain normal fictional rule validation.
- [ ] An invalid action does not mutate authoritative state solely because it appeared in narration.

## Supporting detail

See [NOTE-0018](../knowledge/inbox/NOTE-0018-prd-0003-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
