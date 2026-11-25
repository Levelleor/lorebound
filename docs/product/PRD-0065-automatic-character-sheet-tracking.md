---
id: PRD-0065
type: prd
status: accepted
related:
- NOTE-0061
- PRD-0001
- PRD-0028
- PRD-0027
- PRD-0029
- PRD-0019
---

# Automatic Character Sheet Tracking

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0064](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Automatic%20Character%20Sheet%20Tracking.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S10**. First milestone: **M5**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Later accepted narrative-first world-memory rule — 2026-10-28

**Narrative-first tracking ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Automatic fields reflect **the latest grounded accepted story facts** as declarative `Set/Clear` field assertions, not a simulator verifying whether character status changes were mechanically possible. Subsequent valid authored/player assertions replace earlier current field values without requiring a fictional causal chain. Manual sheet corrections remain noncanonical pending changes until **explicit player Commit**, not an autosave; technical type/projection/atomic checks still apply. Do not auto-invent unknown stats.


## Accepted direction
- **Automatic tracking for the whole sheet:** For every character, automatically maintain **all applicable defined character-sheet fields**, including user-created custom fields, as accepted story events change them. Do not require players to configure individual state modules or field-level tracking modes.
- **Grounded accepted state assertions:** Model output can propose field updates; only facts established by accepted narration or explicit player corrections become typed current-field assertions. Check payload validity and deterministic projection, **not prior gameplay feasibility**; unsupported/uncertain claims remain prose/unknown.
- **No routine approval prompt:** Do not require the player to approve each automatic field update one at a time. This does not waive deterministic validation or prevent the user from inspecting/correcting records.
- **Manual corrections are authoritative and historied (user acceptance 2026-10-19):** Players may directly correct defined character-sheet values. When confirmed, a valid manual correction is an **authoritative canonical state mutation with durable history and provenance**, not merely a UI preference or temporary exception. Later automatic updates evaluate the **latest accepted state**, including that correction, and must not replace it with an older AI assumption or stale proposal. A genuinely new validated story event may still change the value later; manual input is not a permanent immunity lock. Resolve concurrent/stale updates using the common transaction/version checks.
- **Correct missing-value semantics:** A missing or unrecorded field remains unknown, not zero, false, empty or a guessed value. Only establish newly known values from trustworthy accepted outcomes, preserving explicitly known-empty values distinctly.
- **Consistent universal character identity:** Use the same stable unclassified character entities and editable status-sheet structures from Shared PC and NPC Character Entities (IDEA-0026) and Customisable Character Status Sheets (IDEA-0027). Apply automatic maintenance to relevant custom fields as well as common fields.
- **Coherent failures and reversals:** Failed generations or rejected state proposals must not change saved sheets. Historical edits, undo and replay should preserve or rebuild the correct current status with traceable provenance; exact mechanism remains for refinement.
- **Single-model and multi-model compatible:** Works with accepted pipeline strategies and one generative model or multiple task-specialised models, without a required dedicated tracker model.
- **Explicitly defer complexity:** Per-field Disabled / Manual Only / Automatic modes and optional approve-each-change controls proposed in Character State Tracking Modes (IDEA-0028) are **not accepted** here; IDEA-0028 remains an independent unaccepted Inbox candidate.
- **Scope boundary:** Automatic status-sheet tracking does not independently approve the full item/inventory, equipment, anatomy or location systems, which have separate review decisions.

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

## Supporting detail

See [NOTE-0061](../knowledge/inbox/NOTE-0061-prd-0065-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
