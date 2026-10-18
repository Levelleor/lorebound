---
id: "IDEA-0041"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
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
- **Keep Later Turns:** Commit the edited passage while retaining later story turns, then reconcile or rebuild only the necessary downstream authoritative state. Exact dependency/replay rules remain open; do not assume later prose becomes automatically rewritten.
- **Delete All After Point:** Commit the edited point and truncate all later turns from the *active* story timeline, with related event-derived state updated coherently. Recovery for accidental truncation remains an open design requirement rather than an invented implemented feature.
- **Continue Editing:** Return to the draft with later turns and canonical state untouched. No reconstruction or AI generation is initiated.
- **Discard:** Abandon the draft and leave the original story text, later turns and authoritative state unchanged.
- **Avoid wasted AI work:** Do not make AI calls or expensive replay/reconstruction attempts for downstream story turns that may be discarded after confirmation. Expensive work happens only once a choice is made, and only where necessary.
- **No automatic downstream prose regeneration:** Do not use acceptance of this idea to silently rewrite later passages, regenerate scenes, launch AI to fix contradictions or introduce a contradiction-flagging/review mechanism. Those are explicitly outside this version's scope.
- **Consistent provenance:** Retain stable source text/revision IDs from [[Versioned Text Blocks and Revision IDs]] (IDEA-0040) and respect the append-only authoritative event history concept from [[Event-Sourced World History]] (IDEA-0039).
- **Refinement boundaries:** Exact confirmation-screen wording, how later effects are reconciled, handling revisions/branches and the method for recovering from mistaken truncation remain open.

## Proposed behaviour
Open an older turn or text block in an isolated draft editor, preserving the saved active story and state while the player makes changes. On finishing the draft, explicitly ask whether to Keep Later Turns, Delete All After Point, Continue Editing or Discard. A discard or return to editing performs no canonical state reconstruction. On confirmed keep, preserve the later prose and safely reconcile the active state derived from the revised source history. On confirmed delete, remove subsequent turns from the active timeline and update corresponding active state. Perform no unnecessary AI calls or regeneration of later prose in this workflow. Define the underlying recovery, branch preservation, snapshot selection and state recomputation during staging refinement.

## Alternatives and trade-offs
Reconstructing after every keystroke may provide immediate preview feedback but wastes compute and risks inconsistent intermediate state. Draft-first explicit confirmation prioritises control and avoids work that will be thrown away. Keeping later turns may leave contradictory *prose* even when state is reconciled; this accepted version deliberately avoids automatic regeneration or contradiction-flagging. Truncation simplifies the active continuation but introduces accidental-data-loss risks, so reversible retention or backup mechanisms should be evaluated without presuming a chosen design.

## Persisted historical-edit drafts
- Editing an earlier passage autosaves a **noncanonical draft into SQLite** after a brief pause, preserving the last saved edit across browser restarts. No downstream rebuild, AI call, story revision or canonical world mutation occurs while typing.
- **Continue Editing** retains that draft and **Discard** abandons it. Only explicit **Keep Later Turns** or **Delete All After Point** confirmation can commit the revision and trigger appropriate world-state reconciliation.
- Draft-save errors and the exact retention/debounce interval remain for refinement.

## Historical edit choices respect multi-tab version conflicts
- **Accepted IDEA-0005 multi-tab decision (2026-10-18):** If one tab is drafting or choosing **Keep Later Turns** or **Delete All After Point** while another tab advances or edits the same adventure, the historical-edit confirmation is tied to the **authoritative adventure version it was prepared against**. Go/SQLite must reject an outdated commit rather than truncating, overwriting or reconstructing from a stale history. Other tabs may continue editing; no exclusive adventure editing lock is required.
- On conflict, preserve the unconfirmed historical prose draft and the chosen operation as an **uncommitted request**, surface the changed-adventure state and let the player explicitly review/reconcile before attempting again. No automatic deletion of newly committed downstream turns, auto-merging histories, or AI rewriting merely to resolve stale state. Exact conflict screen and rebase/retry steps remain to be refined.
- Draft autosave remains noncanonical and must not silently overwrite another tab's draft, consistent with IDEA-0005/0051. This conflict protection supplements, rather than replaces, the existing explicit historical-edit confirmation gate.

## Dependencies and constraints
- Source passages have stable IDs and versions through accepted [[Versioned Text Blocks and Revision IDs]] (IDEA-0040), so historical edits can identify affected state-changing source revisions.
- World-state projections and events follow accepted [[Event-Sourced World History]] (IDEA-0039), with active versus obsolete historical effects kept distinct.
- Snapshot and incremental replay policy is a **separate unaccepted candidate**, [[Snapshots and Incremental State Rebuild]] (IDEA-0042); the accepted workflow must not presume checkpoint intervals or a specific rebuild implementation.
- The player's unconfirmed draft must not trigger expensive reconstructive work, AI calls to regenerate downstream history or destructive mutation of saved story/world state.
- Confirming Keep Later Turns does not imply the player approved edits to later story prose. Distinguish retained text from reconstructed active state.
- Confirming Delete All After Point removes later turns from the **active** timeline; any non-destructive backups, undoability or archival policy remains to be refined.
- The system must handle cancellation, failure and retries without committing partial text/world-state changes.

## Open questions
- How should players recover after accidental truncation, and should deleted later turns be temporarily recoverable?
- How should conflicts between retained later prose and reconstructed current state be surfaced, if automatic contradiction-flagging is explicitly out of scope?
- How should retained later events depending on edited earlier facts be marked inactive, recomputed or reconciled?
- What exact boundary does Delete All After Point use when the edit is within a turn or spans multiple blocks?
- What happens if the draft is closed, interrupted or abandoned before the choice is confirmed?
- How should a failed reconstruction after confirmation behave without leaving half-committed text and state?
- Which display and warning details communicate consequences clearly without making historical editing cumbersome?
- How should selected history branches and snapshots affect recovery without preapproving those separate features?

## Draft acceptance criteria
- [ ] If one tab commits new turns or a historical revision, a second tab's stale historical-edit confirmation cannot overwrite those turns or truncate the later history; it returns a visible conflict and retains the second tab's draft.
- [ ] Both tabs remain editable, with an explicit reconciliation/retry path and no implicit replay or forced merge of the stale revision.
- [ ] A player can edit an earlier story passage in a draft without modifying the active canonical history before confirmation.
- [ ] The confirmation presents Keep Later Turns, Delete All After Point, Continue Editing and Discard as distinct operations.
- [ ] Continue Editing preserves the draft for additional changes without beginning reconstruction.
- [ ] Discard restores/retains the unchanged original active text and world state without downstream work.
- [ ] Keep Later Turns retains later prose and initiates only the necessary authoritative state reconciliation after confirmation.
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
- 2026-10-18 — **Accepted IDEA-0005 multi-tab rule:** All historical edit confirmations depend on the expected authoritative version. Conflicting older Keep Later Turns or Delete All After Point requests reject atomically, preserving newer history and the editor's unconfirmed draft. No exclusive edit lock or automatic conflict merge. Staging only.
- 2026-10-17 — **Cross-idea autosave alignment with explicit user acceptance in IDEA-0005:** SQLite persists noncanonical player drafts after short typing pauses, separate from canonical story revisions and state. Committed turns/revisions and related events remain atomic; failed generation preserves canonical state and the last saved player input. This update does not promote this idea beyond staging.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by requesting user:** Draft-first historical editing; explicit confirmation before expensive reconstruction; four choices Keep Later Turns, Delete All After Point, Continue Editing and Discard; no wasted AI calls for history that may be deleted; no automatic downstream prose regeneration or contradiction flagging in this version. Accidental-truncation recovery, downstream state reconciliation and confirmation UX left open for refinement. Moved to staging only, not production.
