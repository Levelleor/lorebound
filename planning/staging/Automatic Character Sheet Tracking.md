---
id: "IDEA-0064"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: []
related: ["[[Customisable Character Status Sheets]]", "[[Shared PC and NPC Character Entities]]", "[[Character State Tracking Modes]]", "[[Configurable Generation Pipeline Strategies]]"]
tags:
  - planning/idea
---
# Automatic Character Sheet Tracking

## Idea
Automatically track and update **all applicable character-sheet fields** for player characters and NPCs as the story develops, without requiring separate Disabled, Manual Only or Automatic tracking modes for different fields or modules.

## Why this idea matters
The user wants a simpler initial approach: a living character sheet that stays up to date with accepted story outcomes without the burden of configuring tracking modes for each statistic, condition, identity detail or goal.

## Accepted direction
- **Automatic tracking for the whole sheet:** For PCs and NPCs, automatically maintain **all applicable defined character-sheet fields**, including user-created custom fields, as accepted story events change them. Do not require players to configure individual state modules or field-level tracking modes.
- **Validated state changes only:** Model output may propose updates, but changes must satisfy the authoritative validation rules and remain consistent with accepted narrative outcomes and committed world-state events. An unsupported AI assertion is not a valid change by itself.
- **No routine approval prompt:** Do not require the player to approve each automatic field update one at a time. This does not waive deterministic validation or prevent the user from inspecting/correcting records.
- **Manual editing remains available:** Players continue to view, edit and correct character sheets directly even though automatic tracking is the general policy. How later automatic proposals interact with direct edits needs refinement.
- **Correct missing-value semantics:** A missing or unrecorded field remains unknown, not zero, false, empty or a guessed value. Only establish newly known values from trustworthy accepted outcomes, preserving explicitly known-empty values distinctly.
- **Consistent shared PC/NPC identity:** Use the same stable character entities and editable status-sheet structures from [[Shared PC and NPC Character Entities]] (IDEA-0026) and [[Customisable Character Status Sheets]] (IDEA-0027). Apply automatic maintenance to relevant custom fields as well as common fields.
- **Coherent failures and reversals:** Failed generations or rejected state proposals must not change saved sheets. Historical edits, undo and replay should preserve or rebuild the correct current status with traceable provenance; exact mechanism remains for refinement.
- **Single-model and multi-model compatible:** Works with accepted pipeline strategies and one generative model or multiple task-specialised models, without a required dedicated tracker model.
- **Explicitly defer complexity:** Per-field Disabled / Manual Only / Automatic modes and optional approve-each-change controls proposed in [[Character State Tracking Modes]] (IDEA-0028) are **not accepted** here; IDEA-0028 remains an independent unaccepted Inbox candidate.
- **Scope boundary:** Automatic status-sheet tracking does not independently approve the full item/inventory, equipment, anatomy or location systems, which have separate review decisions.

## Proposed behaviour
- Apply a single automatic tracking policy to the entire current character sheet, including custom fields created under [[Customisable Character Status Sheets]] (IDEA-0027), for both PCs and NPCs under [[Shared PC and NPC Character Entities]] (IDEA-0026).
- When a **committed, validated** story event changes a known character property, propose and validate the corresponding sheet update, then persist only the accepted change. Examples might include injuries, recovered stamina, changes in goals or a relationship-related status.
- Keep current values coherent with authoritative game state and accepted narrative outcomes; generated prose by itself must not silently override deterministic rules or commit contradictory changes.
- Continue to support **manual viewing and editing** of sheets from IDEA-0027; this simpler idea means AI-assisted state tracking is generally automatic, not that the player loses editing access.
- Preserve unknown versus explicitly empty/zero/false values. Do not invent a definite property or value merely because a sheet is incomplete; only populate information actually established or properly validated.
- Work with the accepted generation pipeline strategies and either one model or multiple task-specific models, without requiring a dedicated tracking model.
- No per-field or per-module tracking-mode settings and no required approve-each-change dialogue in the initial simpler direction. Keep the more configurable [[Character State Tracking Modes]] (IDEA-0028) untouched as a separate **unaccepted** idea for potential later consideration.

During or after each successful adventure turn, gather authoritative accepted changes relevant to all configured character-sheet fields. Let a generation pipeline propose typed updates where helpful, validate proposals against the current state and available field definitions, and atomically persist only consistent changes alongside the accepted outcome. The user can inspect and manually correct the resulting sheet. Keep missing fields unknown unless a supported event establishes their values. No field-by-field enable/disable modes or mandatory approval dialogs. Preserve provenance so invalidated history, undo, branches or failed requests cannot silently leave stale field values.

## Alternatives and trade-offs
- The accepted policy is **one automatic tracking mode for all applicable sheet fields**. The separate question of whether the system may propose entirely new field definitions remains open: automatic population of known fields does not automatically grant permission to invent arbitrary new schema keys.
- Apply changes immediately after validated turn completion versus batch them as part of generation commit; exact timing and failure recovery require refinement.
- Fine-grained Disabled/Manual Only/Automatic modes and optional per-change confirmations remain a separate **deferred, unaccepted** direction (IDEA-0028). There is no requirement to build these controls as part of IDEA-0064.

## Dependencies and constraints
- Uses accepted shared character entities (IDEA-0026), customisable current status sheets (IDEA-0027), and generation pipeline validation/failure boundaries (IDEA-0018).
- Every state mutation must pass validation and be supported by accepted events or deliberate player edits; freeform narrative prose cannot silently override established canonical state.
- No model or provider configuration should force a separate always-loaded model to make sheet tracking work.
- Preservation of unknown versus expressly zero/empty/false values is required.
- The system must not treat rejected, preview-only or failed generation output as committed changes; undo/edits must not leave derived sheet values contradicted by the current narrative history.
- Manual edits remain possible; precedence between deliberate manual corrections and later event-derived automatic updates must be determined.
- IDEA-0028 remains **status: candidate** in Inbox, explicitly deferred rather than accepted or rejected. No configurable tracking-mode system or approve-every-change dialogue is in the accepted scope.
- Other separate idea gates govern inventory transfers, equipment, anatomy, world map/location persistence and simulation mechanics. This acceptance covers automatic **character-sheet fields** only.

## Open questions
- How should the engine identify meaningful updates to arbitrary player-defined fields reliably while avoiding hallucinated or needless changes?
- Does "everything" cover every explicitly configured sheet field, and under what circumstances may the system suggest entirely new fields?
- How does the system reconcile a player's direct manual edit with a later AI-proposed update?
- What deterministic validation can be applied to freeform/qualitative status fields versus numeric stats?
- Should automatic tracking run on every completed generation turn or only when validated outcomes affect the character sheet?
- How will historical edits, undo and failed generation pipelines roll back or rebuild automatic sheet changes?
- Should high-impact identity or goal changes need special safeguards? The user has **not** accepted per-field tracking modes or approve-each-change controls.

## Draft acceptance criteria
- [ ] Accepted character changes update applicable configured PC and NPC status fields automatically, including user-defined custom fields, after validation.
- [ ] The player can use automated sheet tracking without setting Disabled/Manual/Automatic modes per field or module.
- [ ] Routine validated automatic updates do not require separate player confirmation for every changed value.
- [ ] Player manual editing and correction of current character-sheet values remain possible.
- [ ] A rejected, uncommitted or failed narrative generation never changes authoritative sheet values.
- [ ] Unrecorded values remain unknown, explicitly empty/zero/false are preserved distinctly, and updates do not invent unsupported character facts.
- [ ] Updates attach to stable character identities and preserve PC/NPC consistency.
- [ ] Undo and historical revision pathways can invalidate/rebuild relevant derived sheet updates without treating old outcomes as current canon.
- [ ] Tracking works with either one configured model or task-specific model routing.
- [ ] No per-field tracking mode controls, approve-each-change requirements, or unrelated full equipment/inventory/anatomy implementations are implied.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Originally requested as a simpler alternative while explicitly deferring IDEA-0028; subsequently **explicitly accepted** as a staging direction.
- Staging is not production approval or evidence of implemented character-sheet tracking.
- The tracking policy is automatic for applicable fields, but exact event extraction, schema creation, edit precedence and validation UX remain open.
- The scope is character-sheet fields, not an implicit approval of other standalone inventory, equipment, anatomy or location proposals.

## Decisions and review history
- 2026-10-16 — **User-requested capture, not acceptance.** During review of IDEA-0028, user said: "Lets just keep this idea unaccepted for now and introduce a new one, simpler one, where we just have automated tracking of character sheet for now for everything." Created as a separate candidate while IDEA-0028 remains unaccepted in Inbox.
- 2026-10-16 — **Explicitly accepted by the requesting user:** "Accept IDEA-0064 with automatic validated updates to all applicable PC and NPC character-sheet fields, including custom fields, without per-field Disabled/Manual/Automatic tracking modes or required approval for each change. Preserve manual editing, known versus unknown values, and authoritative state validation. Keep IDEA-0028 deferred and unaccepted." Promoted to staging for refinement only; IDEA-0028 remains an unaccepted Inbox candidate.
