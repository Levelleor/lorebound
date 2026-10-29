---
id: "IDEA-0003"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Gameplay Feature Catalogue Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Direct Editable Prose Document

## Current accepted architecture after 2026-10-28 redirection

**Current approved editor/replay semantics:** A story passage has one current structured body (B3-D04); draft edits are noncanonical and confirmation atomically replaces the current body under adventure-version checks. [B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) means **later accepted factual outcome assertions do not become invalid solely because earlier prose stops explaining them**. Keep Later Turns preserves those later events, including sparse item identities; no auto-cascading corrections, history revisions or retroactive prose rewrite. Manual state corrections still require separate explicit player Commit with composer overlay.


## Idea
Allow editing, inserting and deleting text directly inside earlier story messages.

## Why this idea matters
The storytelling surface should work like a prose editor, not an immutable chat transcript.

## Accepted direction
- Treat story content as **directly editable prose**, not immutable chat messages.
- Allow users to edit, insert, remove and rearrange text in previous turns and generated passages through the story interface.
- Preserve **stable identities and revisions at the logical story turn/passage-body level**, with their original turn/source provenance linking derived world-state events. **Individual paragraphs inside a passage do not require their own canonical IDs or revision history**.
- **Defer world-state reconciliation** while edits are in progress. Reprocess affected state only after a deliberate confirmation of the pending edits and what happens to later turns.
- For historical edits, the user may manually repair later prose or delete later turns in bulk. This does **not** approve automatic downstream prose regeneration or contradiction-flagging.

## Proposed behaviour
The player edits narrative text inline, including earlier story passages, without needing to enter a separate chatbot edit flow. Changes are drafted while editing; the editor tracks the **logical turn/passage identity and its committed revision**, rather than an ID for each paragraph. Before committing a historical edit, the user can preserve later turns or truncate them, then the system performs the necessary one-time reconstruction of surviving state and derived memories. The detailed reconstruction algorithm is handled by related planning ideas and is not selected here.

## Alternatives and trade-offs
A ProseMirror/Tiptap-style document editor and individually editable turn bodies remain possible implementation options. **Canonical revision granularity is now selected as logical turn/passage body, not individual paragraph**; the editing library, internal cursor/document model, passage-boundary manipulation and exact revision representation remain open.

## Noncanonical prose-edit drafts use the latest shared saved value
- **Explicit accepted IDEA-0005 Option B (2026-10-18):** While the player edits present or historical story prose, the pending text is a **noncanonical editing draft**, autosaved after a typing pause in the shared SQLite library. For **each logical prose-edit target**, keep **one latest successfully saved version** available across browser tabs. A new successful autosave from either tab **overwrites the previous stored draft** for the same target, without preserving previous draft histories or requiring draft conflict/merge resolution. Composer drafts and edits to other passage targets remain distinct.
- These freely replaceable drafts **do not alter accepted prose, block revision lineage, event provenance, canonical world state or history**. A confirmed edit still requires the established explicit historical-edit choice (where applicable) and **expected-version guarded atomic commit**. If another tab has advanced canon, a stale edit commit rejects with a conflict; overwritten drafts are not guaranteed to be recoverable. Any text still accessible in an open editor or latest stored draft may be used for the player's reconciliation.
- This policy concerns **player-authored draft text**, not AI-generated streaming output (IDEA-0019). Exact target identifiers and debounce intervals remain implementation details.

## Turn/passage-level stable revision identity
- **Explicit user acceptance of Option A (2026-10-18):** Each logical **story turn/passage body** has its own stable canonical identity and successive accepted revisions. A passage can contain multiple paragraphs, dialogue lines, formatting, insertions and deletions. **Paragraphs themselves are not individually versioned entities**, and do not need permanent IDs or separate canonical revision chains merely because a player edits, splits or merges paragraphs inside the same passage.
- **Editing is still freeform:** Players can directly rewrite, rearrange, remove, add or split paragraphs within a passage. Until confirmation, edits are **noncanonical latest-only drafts** scoped to the passage editing target (IDEA-0005). A confirmed change produces **a new accepted revision of the relevant passage**, not a batch of per-paragraph commits.
- **Provenance at the chosen level:** World events and derived state identify the **originating turn/passage and exact accepted revision**. The Lore Engine can identify affected events when that passage changes, without requiring perfect attribution to a single sentence or paragraph. More granular ranges/spans may be nonauthoritative processing aids, but **must not be necessary for correct reconstruction**.
- **Changing boundaries:** When prose moves **between logical passages/turns**, version the affected source/destination passages coherently and preserve event-to-source lineage. Exact rules for splitting or merging **whole passages**, allocating a new passage ID, or preserving prior revisions remain future implementation refinements. Do not mistake a paragraph break within one passage for a new canonical passage unless the editor explicitly changes passage boundaries.
- **Commit integrity:** The previously accepted explicit confirmation of historical edits, version-based rejection of stale canonical writes, atomic event/state revision updates and full-history/fork reconstruction all remain. The decision is **revision granularity**, not permission to silently mutate canon or discard provenance.

## Dependencies and constraints
- Depends on durable narrative storage, event provenance, save revisions and the historical-edit reconciliation pipeline.
- User-approved text edits must not silently mutate authoritative world state mid-typing.
- If older prose is changed, derivative summaries, memories and world events may need invalidation or recalculation after confirmation.
- State rollback/replay, confirmation UX and truncation are detailed in separate candidate ideas. This acceptance establishes the direction, not every algorithm.
- Preserve user control over continuity; do not add automatic contradiction flags or wholesale regenerated future prose as part of this idea.

## Open questions
- **Passage-level IDs selected:** How should logical **turn/passage IDs** survive moving, splitting, merging, deletion and reordering of **whole passages**? Paragraph-only edits inside a passage do not require individual paragraph IDs.
- **Resolved (2026-10-18):** Track **canonical revisions at logical story turn/passage-body level**, not individual paragraphs, document nodes or per-character ranges. Paragraph editing inside a passage remains unrestricted.
- How should pending edits be represented, autosaved and recovered after a crash?
- How should the editor communicate pending changes and when a state rebuild is needed?

## Draft acceptance criteria
- [ ] A committed multi-paragraph story turn/passage has one stable **passage identity** and accepted revision lineage; editing a paragraph in it does not require creating a canonical paragraph ID or paragraph-specific revision.
- [ ] The player can freely modify, split and reorder paragraphs inside a passage; only the appropriate **passage revision** is committed on confirmation, with any affected world events linked to that revision.
- [ ] Accepted historical edits preserve source/revision provenance and the already accepted Keep Later Turns/Delete All After Point confirmation; draft autosave and stale-commit protections remain unchanged.
- [ ] A prose editor autosaves only **one latest noncanonical draft per editing target**, which a second tab can overwrite cleanly; drafts for other targets are unaffected and earlier draft versions need not be retained.
- [ ] A successful draft autosave does not create accepted text versions, alter canonical world state or bypass expected-version conflict checking on confirmed prose edits.
- [ ] A user can place the cursor in previously generated story prose and directly edit, insert or delete narrative text.
- [ ] Changes to a surviving logical text block preserve traceable stable identity and revision/origin information.
- [ ] Editing older text does not trigger expensive AI extraction or world reconstruction on each keystroke.
- [ ] Committing a historical edit requires a clear choice to keep or truncate later turns, with the result applied only after confirmation.
- [ ] Reconciliation affects only surviving relevant history and preserves authoritative state if committing fails.
- [ ] No automatic downstream prose regeneration or contradiction-flagging feature is required by this accepted idea.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-requested direction; precise mechanics remain to be refined.
- This is **accepted for staging/refinement**, not approved for production and not implemented.

## Decisions and review history
- 2026-10-18 — **User explicitly accepted Option A, turn/passage-level revisions:** Stable canonical text IDs and revision lineage attach to **logical story turn/passage bodies**, not individual paragraphs. Paragraph editing stays freeform, and downstream event provenance links to the originating passage and exact revision. Cross-passage split/merge/move identity rules and editor implementation remain open. Staging only; no code/production changes.
- 2026-10-18 — **Accepted IDEA-0005 Option B:** All player-authored provisional prose edits use latest-only shared draft slots per editing target; later autosaves may overwrite across tabs without draft history or merging. Canonical revisions and source provenance still require validated version-checked commits. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Direct inline editing, stable text-block identities, and deferred world-state reconciliation. Moved to staging to refine the implementation details. No production approval.

- 2026-10-28 — **User-approved supersession:** Narrative-first declarative fact assertions and the revision-free current-story model now govern this document. Former contradictory original direction is historical approval context, not active implementation guidance. No stage promotion or software implementation.
