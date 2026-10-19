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
Automatically track and update **all applicable character-sheet fields** for every character as the story develops, without requiring separate Disabled, Manual Only or Automatic tracking modes for different fields or modules.

## Why this idea matters
The user wants a simpler initial approach: a living character sheet that stays up to date with accepted story outcomes without the burden of configuring tracking modes for each statistic, condition, identity detail or goal.

## Accepted direction
- **Automatic tracking for the whole sheet:** For every character, automatically maintain **all applicable defined character-sheet fields**, including user-created custom fields, as accepted story events change them. Do not require players to configure individual state modules or field-level tracking modes.
- **Validated state changes only:** Model output may propose updates, but changes must satisfy the authoritative validation rules and remain consistent with accepted narrative outcomes and committed world-state events. An unsupported AI assertion is not a valid change by itself.
- **No routine approval prompt:** Do not require the player to approve each automatic field update one at a time. This does not waive deterministic validation or prevent the user from inspecting/correcting records.
- **Manual corrections are authoritative and historied (user acceptance 2026-10-19):** Players may directly correct defined character-sheet values. When confirmed, a valid manual correction is an **authoritative canonical state mutation with durable history and provenance**, not merely a UI preference or temporary exception. Later automatic updates evaluate the **latest accepted state**, including that correction, and must not replace it with an older AI assumption or stale proposal. A genuinely new validated story event may still change the value later; manual input is not a permanent immunity lock. Resolve concurrent/stale updates using the common transaction/version checks.
- **Correct missing-value semantics:** A missing or unrecorded field remains unknown, not zero, false, empty or a guessed value. Only establish newly known values from trustworthy accepted outcomes, preserving explicitly known-empty values distinctly.
- **Consistent universal character identity:** Use the same stable unclassified character entities and editable status-sheet structures from [[Shared PC and NPC Character Entities]] (IDEA-0026) and [[Customisable Character Status Sheets]] (IDEA-0027). Apply automatic maintenance to relevant custom fields as well as common fields.
- **Coherent failures and reversals:** Failed generations or rejected state proposals must not change saved sheets. Historical edits, undo and replay should preserve or rebuild the correct current status with traceable provenance; exact mechanism remains for refinement.
- **Single-model and multi-model compatible:** Works with accepted pipeline strategies and one generative model or multiple task-specialised models, without a required dedicated tracker model.
- **Explicitly defer complexity:** Per-field Disabled / Manual Only / Automatic modes and optional approve-each-change controls proposed in [[Character State Tracking Modes]] (IDEA-0028) are **not accepted** here; IDEA-0028 remains an independent unaccepted Inbox candidate.
- **Scope boundary:** Automatic status-sheet tracking does not independently approve the full item/inventory, equipment, anatomy or location systems, which have separate review decisions.

## Proposed behaviour
- Apply a single automatic tracking policy to the entire current character sheet, including custom fields created under [[Customisable Character Status Sheets]] (IDEA-0027), for every character under [[Shared PC and NPC Character Entities]] (IDEA-0026), whether selected as `Playing As` or not.
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

## Authoritative manual corrections and subsequent automatic updates (2026-10-19)

- A player's accepted direct edit is a validated canonical change, captured in the same replayable provenance/history contract as any other persistent character-sheet mutation.
- An AI-proposed change must be evaluated relative to the **current committed character value and version**, not the model's stale recollection or an earlier snapshot. Example: after the player corrects a known Health value from 80 to 95, a later valid 10-point injury must be calculated from 95, **not** an earlier 80, assuming the adventure actually uses those numeric mechanics.
- A later established event can legitimately change the corrected value. This is **not** a permanent manual-over-auto priority that prevents future story development; it is a rule against overwriting authoritative facts with stale assumptions.
- No new per-field tracking modes or individual approve-every-update confirmations are implied. Event representation, conflict messages and the treatment of ambiguous qualitative changes remain design refinements.

## Automatic tracking for any character
- **Latest accepted IDEA-0026 decision:** There is no permanent PC/NPC or Playable classification. Automatic tracking applies to the actual character entities affected by validated events, whether or not the player has ever selected them for Do/Say.
- Selecting a different character merely changes who the player speaks/acts as; it cannot automatically alter status fields or make another character's events target the selected one.

## Dependencies and constraints
- Uses accepted shared character entities (IDEA-0026), customisable current status sheets (IDEA-0027), and generation pipeline validation/failure boundaries (IDEA-0018).
- Every state mutation must pass validation and be supported by accepted events or deliberate player edits; freeform narrative prose cannot silently override established canonical state.
- No model or provider configuration should force a separate always-loaded model to make sheet tracking work.
- Preservation of unknown versus expressly zero/empty/false values is required.
- The system must not treat rejected, preview-only or failed generation output as committed changes; undo/edits must not leave derived sheet values contradicted by the current narrative history.
- Manual corrections, once validly committed, have authoritative historical provenance and are included in the current state for all subsequent automatic change proposals. The implementation must reject stale proposals or reconcile against the latest accepted version. The exact event schemas and conflict/error presentation remain to be designed.
- IDEA-0028 remains **status: candidate** in Inbox, explicitly deferred rather than accepted or rejected. No configurable tracking-mode system or approve-every-change dialogue is in the accepted scope.
- Other separate idea gates govern inventory transfers, equipment, anatomy, world map/location persistence and simulation mechanics. This acceptance covers automatic **character-sheet fields** only.

## Open questions
- How should the engine identify meaningful updates to arbitrary player-defined fields reliably while avoiding hallucinated or needless changes?
- Does "everything" cover every explicitly configured sheet field, and under what circumstances may the system suggest entirely new fields?
- Which event/revision/version checks guarantee that an automatic update uses the most recent authoritative manually corrected value, and how are concurrent or ambiguous changes surfaced?
- What deterministic validation can be applied to freeform/qualitative status fields versus numeric stats?
- Should automatic tracking run on every completed generation turn or only when validated outcomes affect the character sheet?
- How will historical edits, undo and failed generation pipelines roll back or rebuild automatic sheet changes?
- Should high-impact identity or goal changes need special safeguards? The user has **not** accepted per-field tracking modes or approve-each-change controls.

## Draft acceptance criteria
- [ ] Accepted character changes update applicable status fields for any character automatically, including user-defined custom fields, after validation.
- [ ] The player can use automated sheet tracking without setting Disabled/Manual/Automatic modes per field or module.
- [ ] Routine validated automatic updates do not require separate player confirmation for every changed value.
- [ ] Player manual editing and correction of current character-sheet values remain possible.
- [ ] A rejected, uncommitted or failed narrative generation never changes authoritative sheet values.
- [ ] Unrecorded values remain unknown, explicitly empty/zero/false are preserved distinctly, and updates do not invent unsupported character facts.
- [ ] Updates attach to stable unclassified character identities consistently, regardless of `Playing As` selection.
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

- 2026-10-19 — **User explicitly accepted manual-correction precedence:** Player-confirmed, valid character-sheet corrections are authoritative canonical state changes with durable history/provenance. Subsequent automatic tracking must use the latest accepted state and must not overwrite a correction using stale model assumptions. Future genuinely established events can still modify those values. IDEA-0028 remains unaccepted; exact transaction/reconciliation interfaces remain open. Staging clarification only.
- 2026-10-18 — **Accepted universal-character dependency:** Auto-tracking uses one unclassified character model with no PC/NPC or Playable tags. Temporary `Playing As` does not change an entity's status. Staging only.
- 2026-10-16 — **User-requested capture, not acceptance.** During review of IDEA-0028, user said: "Lets just keep this idea unaccepted for now and introduce a new one, simpler one, where we just have automated tracking of character sheet for now for everything." Created as a separate candidate while IDEA-0028 remains unaccepted in Inbox.
- 2026-10-16 — **Explicitly accepted by the requesting user:** "Accept IDEA-0064 with automatic validated updates to all applicable PC and NPC character-sheet fields, including custom fields, without per-field Disabled/Manual/Automatic tracking modes or required approval for each change. Preserve manual editing, known versus unknown values, and authoritative state validation. Keep IDEA-0028 deferred and unaccepted." Promoted to staging for refinement only; IDEA-0028 remains an unaccepted Inbox candidate.
