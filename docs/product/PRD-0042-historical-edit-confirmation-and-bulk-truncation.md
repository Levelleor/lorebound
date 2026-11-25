---
id: PRD-0042
type: prd
status: accepted
related:
- NOTE-0049
- PRD-0001
- NOTE-0015
- NOTE-0012
---

# Historical Edit Confirmation and Bulk Truncation

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0041](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S03**. First milestone: **M2**. Delivery: **PARTIAL**.

- Requirement coverage: [Five affected rows](../work/items/STORY-0019-accepted-generated-passage-editing.md); zero-effects generated-passage boundary
- Evidence: [PR #16](https://github.com/Levelleor/lorebound/pull/16), confirmed merged; authored coverage in [DEV-003G](../work/items/STORY-0020-accepted-authored-passage-editing.md) verified/merged in PR #17

## Current accepted architecture after 2026-10-28 redirection

**Latest current-canon historical edit policy:** [B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md) plus B3-D04/B4-D02. **Keep Later Turns** retains later accepted declarative state assertions even if a historical edit removes their earlier fictional cause, an item introduction, a former holder, or a movement route. Such later assertions may maintain sparse identities with missing details unknown. **Do not reject them, suspend them, cascade-delete them or invent AI narrative repair** merely because of missing simulated prerequisites. Delete All After Point removes the selected current suffix; Undo removes its approved story-turn boundary, both atomically. One current passage body and event sequence, no immutable revision archive. Technical unprocessable/unsafe data still fails.


## Accepted direction
- **Draft-first historical editing:** Editing an older story passage begins as a draft. Do not mutate the canonical story or trigger expensive reconstruction of downstream world state while the player is still editing.
- **Explicit post-edit confirmation:** Before committing a historical change and reconstructing affected state, offer four distinct actions: **Keep Later Turns**, **Delete All After Point**, **Continue Editing**, and **Discard**.
- **Keep Later Turns, with player-owned continuity (explicit user clarification 2026-10-19):** Confirm the edited passage and preserve subsequent canonical passages and their recorded outcomes. This is the player's deliberate choice to keep the later story **even when its narrative logic no longer follows from the revised earlier text**. Do **not** require AI inference, pay for automatic downstream repairs, insert missing items/facts or automatically rewrite later turns to justify them. The player may directly correct inventory or other applicable records as necessary (for example, manually insert the silver key if the kept later scene uses it). **Choosing Keep does not itself add the key or any other missing state.** Passage/revision provenance and technically safe deterministic bookkeeping remain required; exact handling of later event payloads that cannot be replayed under fundamental data-integrity constraints is a Pass B contract, not an excuse to force an AI continuity repair.
- **Delete All After Point:** Commit the edited point and truncate all later turns from the *active* story timeline, with related event-derived state updated coherently. Recovery for accidental truncation remains an open design requirement rather than an invented implemented feature.
- **Continue Editing:** Return to the draft with later turns and canonical state untouched. No reconstruction or AI generation is initiated.
- **Discard:** Abandon the draft and leave the original story text, later turns and authoritative state unchanged.
- **Avoid wasted AI work:** Do not make AI calls or expensive replay/reconstruction attempts for downstream story turns that may be discarded after confirmation. Expensive work happens only once a choice is made, and only where necessary.
- **No automatic downstream prose regeneration:** Do not use acceptance of this idea to silently rewrite later passages, regenerate scenes, launch AI to fix contradictions or introduce a contradiction-flagging/review mechanism. Those are explicitly outside this version's scope.
- **Consistent provenance:** Retain stable source text/revision IDs from Versioned Text Blocks and Revision IDs (IDEA-0040) and respect the append-only authoritative event history concept from Event-Sourced World History (IDEA-0039).
- **Refinement boundaries:** Exact confirmation-screen wording, how later effects are reconciled, handling revisions/branches and the method for recovering from mistaken truncation remain open.

## Dependencies and constraints
- Source passages have stable IDs and versions through accepted Versioned Text Blocks and Revision IDs (IDEA-0040), so historical edits can identify affected state-changing source revisions.
- World-state projections and events follow accepted Event-Sourced World History (IDEA-0039), with active versus obsolete historical effects kept distinct.
- Snapshot and incremental replay policy is separately **accepted in staging** under Snapshots and Incremental State Rebuild (IDEA-0042); its specific checkpoint intervals and replay algorithms remain unrefined. Its later acceptance does not require AI story repair for Keep Later Turns.
- The player's unconfirmed draft must not trigger expensive reconstructive work, AI calls to regenerate downstream history or destructive mutation of saved story/world state.
- Confirming Keep Later Turns does not imply the player approved edits to later story prose. Distinguish retained text from reconstructed active state.
- Confirming Delete All After Point removes later turns from the **active** timeline; any non-destructive backups, undoability or archival policy remains to be refined.
- The system must handle cancellation, failure and retries without committing partial text/world-state changes.

## Open questions
- How should players recover after accidental truncation, and should deleted later turns be temporarily recoverable?
- **Resolved player responsibility:** Keeping later turns intentionally tolerates narrative discrepancies and does not require automatic contradiction detection, AI repair or an inferred inventory fix. What minimal, nonblocking technical failure message is appropriate if a retained event cannot satisfy structural integrity during deterministic history processing?
- How should retained later events depending on edited earlier facts be marked inactive, recomputed or reconciled?
- What exact boundary does Delete All After Point use when the edit is within a turn or spans multiple blocks?
- What happens if the draft is closed, interrupted or abandoned before the choice is confirmed?
- How should a failed reconstruction after confirmation behave without leaving half-committed text and state?
- Which display and warning details communicate consequences clearly without making historical editing cumbersome?
- How should selected history branches and snapshots affect recovery without preapproving those separate features?

## Draft acceptance criteria
- [ ] Repeated Undo can roll back the latest committed turn and state to earlier boundaries in the **same adventure** without the historical-text-edit confirmation gate being automatically applied to every individual head rollback.
- [ ] Editing an old passage while later turns remain active still requires explicit Keep/Delete/Continue Editing/Discard confirmation; Undo cannot bypass version/atomicity safety or preserve removed turns as selectable variants.
- [ ] Confirming a paragraph edit to an earlier passage creates a **new canonical passage revision** after Keep/Delete selection and reconciles dependent events; no paragraph ID or revision history is required.
- [ ] Editing one paragraph of an earlier committed passage does not create paragraph-specific canonical IDs. Confirmed edits create a **new passage revision** after the chosen Keep/Delete gate, with consistent corresponding state replay.
- [ ] Rejecting or discarding a draft leaves the accepted passage revision and all dependent canonical events unchanged; passage edits cannot bypass stale-version atomicity.
- [ ] Autosaving an unconfirmed historical prose edit from another tab may **replace the shared saved draft** for that same target; earlier drafts need not be recoverable or conflict-gated, and other draft targets remain distinct.
- [ ] A last-saved draft, however, cannot bypass explicit Keep Later Turns/Delete All After Point approval or stale-version rejection for actual canonical history edits.
- [ ] If one tab commits new turns or a historical revision, a second tab's stale historical-edit confirmation cannot overwrite those turns or truncate the later history; it returns a visible conflict and keeps available any text still present in the live tab or latest shared draft, **without guaranteeing superseded draft recovery**.
- [ ] Both tabs remain editable, with an explicit reconciliation/retry path and no implicit replay or forced merge of the stale revision.
- [ ] A player can edit an earlier story passage in a draft without modifying the active canonical history before confirmation.
- [ ] The confirmation presents Keep Later Turns, Delete All After Point, Continue Editing and Discard as distinct operations.
- [ ] Continue Editing preserves the draft for additional changes without beginning reconstruction.
- [ ] Discard restores/retains the unchanged original active text and world state without downstream work.
- [ ] Keep Later Turns retains later prose and recorded outcomes, without AI inference, mandatory contradiction repair, or automatic insertion of missing state. Players may use deliberate manual edits for continuity, while revisions/events still respect technical atomicity and identity checks.
- [ ] Delete All After Point truncates later turns from active history only after explicit confirmation and updates derived active state consistently.
- [ ] No speculative downstream AI regeneration or contradiction-flagging is introduced as part of this idea.
- [ ] Repeated typing or unconfirmed changes do not trigger expensive reconstruction or avoidable AI calls.
- [ ] Failure or cancellation does not leave partially committed historical edits and corrupted active world state.
- [ ] Recovery from accidental truncation, confirmation UX and reconciliation mechanics are refinement decisions, not assumed implemented behaviour.

## Supporting detail

See [NOTE-0049](../knowledge/inbox/NOTE-0049-prd-0042-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
