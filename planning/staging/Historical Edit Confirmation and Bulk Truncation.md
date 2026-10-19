---
id: "IDEA-0041"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Historical Edit Confirmation and Bulk Truncation

## Idea
Delay expensive reconstruction until the player confirms whether later turns remain or are discarded.

## Why this idea matters
No AI calls should be wasted rebuilding soon-to-be-deleted history.

## Accepted direction
- **Draft-first historical editing:** Editing an older story passage begins as a draft. Do not mutate the canonical story or trigger expensive reconstruction of downstream world state while the player is still editing.
- **Explicit post-edit confirmation:** Before committing a historical change and reconstructing affected state, offer four distinct actions: **Keep Later Turns**, **Delete All After Point**, **Continue Editing**, and **Discard**.
- **Keep Later Turns, with player-owned continuity (explicit user clarification 2026-10-19):** Confirm the edited passage and preserve subsequent canonical passages and their recorded outcomes. This is the player's deliberate choice to keep the later story **even when its narrative logic no longer follows from the revised earlier text**. Do **not** require AI inference, pay for automatic downstream repairs, insert missing items/facts or automatically rewrite later turns to justify them. The player may directly correct inventory or other applicable records as necessary (for example, manually insert the silver key if the kept later scene uses it). **Choosing Keep does not itself add the key or any other missing state.** Passage/revision provenance and technically safe deterministic bookkeeping remain required; exact handling of later event payloads that cannot be replayed under fundamental data-integrity constraints is a Pass B contract, not an excuse to force an AI continuity repair.
- **Delete All After Point:** Commit the edited point and truncate all later turns from the *active* story timeline, with related event-derived state updated coherently. Recovery for accidental truncation remains an open design requirement rather than an invented implemented feature.
- **Continue Editing:** Return to the draft with later turns and canonical state untouched. No reconstruction or AI generation is initiated.
- **Discard:** Abandon the draft and leave the original story text, later turns and authoritative state unchanged.
- **Avoid wasted AI work:** Do not make AI calls or expensive replay/reconstruction attempts for downstream story turns that may be discarded after confirmation. Expensive work happens only once a choice is made, and only where necessary.
- **No automatic downstream prose regeneration:** Do not use acceptance of this idea to silently rewrite later passages, regenerate scenes, launch AI to fix contradictions or introduce a contradiction-flagging/review mechanism. Those are explicitly outside this version's scope.
- **Consistent provenance:** Retain stable source text/revision IDs from [[Versioned Text Blocks and Revision IDs]] (IDEA-0040) and respect the append-only authoritative event history concept from [[Event-Sourced World History]] (IDEA-0039).
- **Refinement boundaries:** Exact confirmation-screen wording, how later effects are reconciled, handling revisions/branches and the method for recovering from mistaken truncation remain open.

## Proposed behaviour
Open an older turn or text block in an isolated draft editor, preserving the saved active story and state while the player makes changes. On finishing the draft, explicitly ask whether to Keep Later Turns, Delete All After Point, Continue Editing or Discard. A discard or return to editing performs no canonical state reconstruction. On confirmed keep, preserve later prose and recorded accepted outcomes even when they no longer fictionally follow from an earlier edit. Do not call AI, fabricate an inventory item or force narrative correction. The player can manually reconcile any unwanted continuity gap; perform only necessary deterministic provenance/state bookkeeping and technical integrity checks. On confirmed delete, remove subsequent turns from the active timeline and update corresponding active state. Perform no unnecessary AI calls or regeneration of later prose in this workflow. Define the underlying recovery, branch preservation, snapshot selection and state recomputation during staging refinement.

## Alternatives and trade-offs
Reconstructing after every keystroke may provide immediate preview feedback but wastes compute and risks inconsistent intermediate state. Draft-first explicit confirmation prioritises control and avoids work that will be thrown away. Keeping later turns may leave contradictory *prose* even when state is reconciled; this accepted version deliberately avoids automatic regeneration or contradiction-flagging. Truncation simplifies the active continuation but introduces accidental-data-loss risks, so reversible retention or backup mechanisms should be evaluated without presuming a chosen design.

## Persisted historical-edit drafts
- Editing an earlier passage autosaves a **noncanonical draft into SQLite** after a brief pause, preserving the last saved edit across browser restarts. No downstream rebuild, AI call, story revision or canonical world mutation occurs while typing.
- **Continue Editing** retains that draft and **Discard** abandons it. Only explicit **Keep Later Turns** or **Delete All After Point** confirmation can commit the revision and trigger appropriate world-state reconciliation.
- Draft-save errors and the exact retention/debounce interval remain for refinement.

## Historical edit choices respect multi-tab version conflicts
- **Accepted IDEA-0005 multi-tab decision (2026-10-18):** If one tab is drafting or choosing **Keep Later Turns** or **Delete All After Point** while another tab advances or edits the same adventure, the historical-edit confirmation is tied to the **authoritative adventure version it was prepared against**. Go/SQLite must reject an outdated commit rather than truncating, overwriting or reconstructing from a stale history. Other tabs may continue editing; no exclusive adventure editing lock is required.
- On a **stale canonical confirmation**, do not execute the uncommitted Keep/Delete request; surface the newer adventure state and let the player review/reconcile before trying again. The unconfirmed prose text remains available **while retained by its open editor or in the latest shared saved draft slot**, but **earlier drafts may have been overwritten by another tab** under the user's later Option B; do not promise their recovery. No automatic deletion of newer downstream turns, auto-merging histories or AI rewriting to resolve stale state. Exact conflict/retry UX remains open.
- **Newer IDEA-0005 draft-only decision supersedes the nonclobber requirement:** A debounced **noncanonical historical-edit draft** can be cleanly **replaced by the last successfully saved draft from any tab editing the same target**, with no draft version check or preserved prior draft. This **does not** remove the explicit historical-edit confirmation gate or strict expected-version conflict protection when a historical change is actually committed.

## Replaceable historical-edit drafts versus protected history
- **Explicit accepted IDEA-0005 Option B (2026-10-18):** Unconfirmed changes to a historical passage remain **noncanonical drafts**; for each logical historical-edit target keep **one shared last-successfully-saved draft** in SQLite. A tab autosaving later can replace the earlier saved draft for that same target **without a merge, conflict notification, per-tab draft copy or draft history**. Previous saved draft content may be lost. Other targets, such as the composer or a different passage, have their own draft slot.
- **Only after confirmation can history change:** The **Keep Later Turns** and **Delete All After Point** choices remain required, and their resulting **canonical revision/history/state** transaction must match the expected authoritative adventure version. If another tab has already advanced the adventure, the stale confirmation is **rejected with no truncation, accepted revision or world-state mutation** regardless of successful draft autosaves. The player can work with text still in the live editor or latest shared slot if available; older overwritten drafts are not recoverable by requirement.
- **Continue Editing** retains the **current latest draft** for that target, not an archive of earlier overwritten versions. **Discard** removes the draft for the applicable target without changing canon. Exact cleanup/debounce and stale-confirmation UX remain open.

## Historical prose confirmation acts on a turn or passage revision
- **Accepted IDEA-0003 Option A (2026-10-18):** An unconfirmed edit to one or more **paragraphs within a logical story turn/passage body** remains a noncanonical passage-scoped draft. Only after the already accepted **Keep Later Turns** or **Delete All After Point** confirmation does that passage acquire a new **canonical passage revision** and the relevant derived event/state history get reconsidered. No canonical IDs or revisions are required for each paragraph.
- **Dependent events:** Because world-event provenance identifies an **accepted source turn/passage revision**, any derived events from the revised passage may require review/invalidation/replay; do not assume events from the unchanged paragraphs automatically remain valid solely because their text was untouched. Exact targeted optimisation remains optional.
- **Other edit semantics remain open:** The handling of **whole-passage** splits, merges, moving content to another turn, and downstream provenance reassignment needs future refinement. Existing stale-version protection, latest-only draft autosave, explicit historical-edit choices and no automatic downstream prose regeneration remain unchanged.

## Confirm historical edits as passage revisions
- **User accepted IDEA-0003 Option A (2026-10-18):** Editing any paragraphs inside an earlier logical story turn/passage remains a **noncanonical passage-scoped draft**. The required **Keep Later Turns** or **Delete All After Point** confirmation creates the next **accepted passage revision**, not individual paragraph revisions.
- Historical state reconciliation uses **source turn/passage ID and accepted revision** to identify potentially affected world events. A changed paragraph can require reconsidering all dependent events from that passage; no paragraph-specific stable IDs are needed.
- Existing latest-only draft autosaving, expected-version conflict checks, coherent all-or-nothing SQLite writes, and no automatic downstream prose rewriting remain unchanged. Identity rules for moving/splitting/merging **whole passages** remain open.

## Undo of the active head differs from editing historical prose
- **Accepted IDEA-0004 committed Undo Option B (2026-10-18):** A user may issue repeatable **committed Undo of the current active story head**: from Turn N to N-1, invalidating the undone turn's active world/event effects and reconstructing the canonical state at that earlier committed boundary. The player may continue with a different next turn **in the same adventure**. The old undone future is not a selectable alternative version.
- **Do not conflate operations:** Undo of the latest active turn is **not** the same as editing an earlier passage while keeping existing later turns. The four-step **Keep Later Turns / Delete All After Point / Continue Editing / Discard** confirmation remains required when changing **older** prose with later committed turns. Repeated latest-head Undo is a distinct canonical rollback, not a hidden prose edit requiring automatic downstream AI rewriting.
- **Safe rollback:** A committed Undo must be version-checked and atomic in Go/SQLite, keep stable source IDs and accepted history coherent, and invalidate/rebuild dependent state. Failed/conflicting Undo preserves the prior head. The natural limit is the first committed story boundary/initial baseline, not the finite temporary editor undo stack. Accidental bulk truncation recovery and any additional multi-turn Undo confirmation remain open, rather than a promised variant selector or redo archive.
- **Fork if preserving future:** Explicitly fork before divergence when the player wants the current full story and an alternative continuation to remain playable as **two separate adventures** (IDEA-0011). Undo alone intentionally replaces the active future of one adventure.

## Dependencies and constraints
- Source passages have stable IDs and versions through accepted [[Versioned Text Blocks and Revision IDs]] (IDEA-0040), so historical edits can identify affected state-changing source revisions.
- World-state projections and events follow accepted [[Event-Sourced World History]] (IDEA-0039), with active versus obsolete historical effects kept distinct.
- Snapshot and incremental replay policy is separately **accepted in staging** under [[Snapshots and Incremental State Rebuild]] (IDEA-0042); its specific checkpoint intervals and replay algorithms remain unrefined. Its later acceptance does not require AI story repair for Keep Later Turns.
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Explicitly accepted for staging, including all four confirmation choices and the avoidance of wasteful reconstruction.
- Staging is not production approval or evidence of any implementation. Truncation recovery, reconciliation and detailed UX require refinement.

## Decisions and review history

- 2026-10-19 — **User accepted player-owned continuity after Keep Later Turns:** The player who keeps later turns accepts responsibility for repairing story inconsistencies, such as manually adding a missing key to inventory. No AI inference, mandatory consistency repair, automatic key insertion or unwarranted blocking solely for fictional contradictions. Keep accepted later prose and recorded outcomes as authored, with no fabricated compensating state. Technical transaction/provenance safety remains required; exact replay treatment of an unrepresentable later event is deferred. Staging only.
- 2026-10-18 — **Accepted IDEA-0004 relationship:** Canonical Undo rolls back an adventure's latest head turn and reconstructs state; it can be repeated independent of bounded transient editor undo. Historical edits with later turns still use the explicit Keep/Delete confirmation. A rolled-back future is not selectable within the same adventure; Fork preserves another future in a separate saved adventure when desired. Staging only.
- 2026-10-18 — **IDEA-0003 Option A accepted:** Historical prose revisions use **logical turn/passage-level identities**, not per-paragraph canonical IDs. Continue to confirm and reconcile state for a revised passage; whole-passage split/move/merge details remain open. Staging only.
- 2026-10-18 — **Accepted IDEA-0003 granular-edit dependency:** Story text and provenance are versioned by **turn/passage**, not paragraph. Historical paragraph edits remain noncanonical until confirmation, then update a passage revision with appropriate event/state reconciliation. Whole-passage split/merge policy remains open. Staging only.
- 2026-10-18 — **User accepted draft Option B for all player-authored drafts:** Historical prose-edit drafts use **one latest saved value per editing target**, freely overwritten by a later successful autosave even across tabs, with no retained older drafts or conflict notification required. This supersedes the older draft nonclobber condition; **historical edit confirmation and expected-version checked canonical/truncation transactions are unchanged**. Staging only.
- 2026-10-18 — **Accepted IDEA-0005 multi-tab rule:** All historical edit confirmations depend on the expected authoritative version. Conflicting older Keep Later Turns or Delete All After Point requests reject atomically, preserving newer history and the editor's unconfirmed draft. No exclusive edit lock or automatic conflict merge. Staging only.
- 2026-10-17 — **Cross-idea autosave alignment with explicit user acceptance in IDEA-0005:** SQLite persists noncanonical player drafts after short typing pauses, separate from canonical story revisions and state. Committed turns/revisions and related events remain atomic; failed generation preserves canonical state and the last saved player input. This update does not promote this idea beyond staging.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by requesting user:** Draft-first historical editing; explicit confirmation before expensive reconstruction; four choices Keep Later Turns, Delete All After Point, Continue Editing and Discard; no wasted AI calls for history that may be deleted; no automatic downstream prose regeneration or contradiction flagging in this version. Accidental-truncation recovery, downstream state reconciliation and confirmation UX left open for refinement. Moved to staging only, not production.
