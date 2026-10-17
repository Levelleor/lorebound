---
id: "IDEA-0064"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: []
related: ["[[Customisable Character Status Sheets]]", "[[Shared PC and NPC Character Entities]]", "[[Character State Tracking Modes]]", "[[Configurable Generation Pipeline Strategies]]"]
tags:
  - planning/idea
---
# Automatic Character Sheet Tracking

## Idea
Automatically track and update **all applicable character-sheet fields** for player characters and NPCs as the story develops, without requiring separate Disabled, Manual Only or Automatic tracking modes for different fields or modules.

## Why consider it?
The user wants a simpler initial approach: a living character sheet that stays up to date with accepted story outcomes without the burden of configuring tracking modes for each statistic, condition, identity detail or goal.

## Rough behaviour
- Apply a single automatic tracking policy to the entire current character sheet, including custom fields created under [[Customisable Character Status Sheets]] (IDEA-0027), for both PCs and NPCs under [[Shared PC and NPC Character Entities]] (IDEA-0026).
- When a **committed, validated** story event changes a known character property, propose and validate the corresponding sheet update, then persist only the accepted change. Examples might include injuries, recovered stamina, changes in goals or a relationship-related status.
- Keep current values coherent with authoritative game state and accepted narrative outcomes; generated prose by itself must not silently override deterministic rules or commit contradictory changes.
- Continue to support **manual viewing and editing** of sheets from IDEA-0027; this simpler idea means AI-assisted state tracking is generally automatic, not that the player loses editing access.
- Preserve unknown versus explicitly empty/zero/false values. Do not invent a definite property or value merely because a sheet is incomplete; only populate information actually established or properly validated.
- Work with the accepted generation pipeline strategies and either one model or multiple task-specific models, without requiring a dedicated tracking model.
- No per-field or per-module tracking-mode settings and no required approve-each-change dialogue in the initial simpler direction. Keep the more configurable [[Character State Tracking Modes]] (IDEA-0028) untouched as a separate **unaccepted** idea for potential later consideration.

## Variations and alternatives
- A single automatic policy for all existing/defined fields versus also allowing proposed creation of previously absent custom fields when a newly established fact warrants one. The latter needs rules to prevent runaway field creation.
- Apply changes immediately after validated turn completion versus batch them as part of generation commit; exact timing and failure recovery require refinement.
- The deferred IDEA-0028 would allow fine-grained Disabled/Manual Only/Automatic choices and optional confirmations if that flexibility is wanted later. It is **not approved or replaced** by this candidate.

## Open questions and risks
- How should the engine identify meaningful updates to arbitrary player-defined fields reliably while avoiding hallucinated or needless changes?
- Does "everything" cover every explicitly configured sheet field, and under what circumstances may the system suggest entirely new fields?
- How does the system reconcile a player's direct manual edit with a later AI-proposed update?
- What deterministic validation can be applied to freeform/qualitative status fields versus numeric stats?
- Should automatic tracking run on every completed generation turn or only when validated outcomes affect the character sheet?
- How will historical edits, undo and failed generation pipelines roll back or rebuild automatic sheet changes?
- Should high-impact identity or goal changes need special safeguards? The user has **not** accepted per-field tracking modes or approve-each-change controls.

## Evaluation notes
- Origin: **user**. Expressly requested as a **new, simpler idea** in place of deciding IDEA-0028 for now.
- This note is an **unaccepted Inbox candidate**. Capturing it does not approve automatic tracking or advance it to staging.
- Status-sheet editing itself is already an accepted direction (IDEA-0027); this candidate separately asks for automatically keeping **all applicable** sheet fields up to date.
- The scope is character-sheet fields, not an implicit approval of other standalone inventory, equipment, anatomy or location proposals.

## Decision history
- 2026-10-16 — **User-requested capture, not acceptance.** During review of IDEA-0028, user said: "Lets just keep this idea unaccepted for now and introduce a new one, simpler one, where we just have automated tracking of character sheet for now for everything." Created as a separate candidate while IDEA-0028 remains unaccepted in Inbox.
