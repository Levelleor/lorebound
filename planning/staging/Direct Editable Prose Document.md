---
id: "IDEA-0003"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Gameplay Feature Catalogue Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Direct Editable Prose Document

## Idea
Allow editing, inserting and deleting text directly inside earlier story messages.

## Why this idea matters
The storytelling surface should work like a prose editor, not an immutable chat transcript.

## Accepted direction
- Treat story content as **directly editable prose**, not immutable chat messages.
- Allow users to edit, insert, remove and rearrange text in previous turns and generated passages through the story interface.
- Preserve **stable text-block identities** and original turn/revision provenance so changes can be linked to derived world-state events.
- **Defer world-state reconciliation** while edits are in progress. Reprocess affected state only after a deliberate confirmation of the pending edits and what happens to later turns.
- For historical edits, the user may manually repair later prose or delete later turns in bulk. This does **not** approve automatic downstream prose regeneration or contradiction-flagging.

## Proposed behaviour
The player edits narrative text inline, including earlier story passages, without needing to enter a separate chatbot edit flow. Changes are drafted while editing; the editor tracks revised block IDs and their origin. Before committing a historical edit, the user can preserve later turns or truncate them, then the system performs the necessary one-time reconstruction of surviving state and derived memories. The detailed reconstruction algorithm is handled by related planning ideas and is not selected here.

## Alternatives and trade-offs
A ProseMirror/Tiptap-style document editor and individually editable turn bodies are viable implementation options. The library, editing granularity and exact revision representation remain open; neither alternative is accepted by this decision.

## Noncanonical prose-edit drafts use the latest shared saved value
- **Explicit accepted IDEA-0005 Option B (2026-10-18):** While the player edits present or historical story prose, the pending text is a **noncanonical editing draft**, autosaved after a typing pause in the shared SQLite library. For **each logical prose-edit target**, keep **one latest successfully saved version** available across browser tabs. A new successful autosave from either tab **overwrites the previous stored draft** for the same target, without preserving previous draft histories or requiring draft conflict/merge resolution. Composer drafts and edits to other passage targets remain distinct.
- These freely replaceable drafts **do not alter accepted prose, block revision lineage, event provenance, canonical world state or history**. A confirmed edit still requires the established explicit historical-edit choice (where applicable) and **expected-version guarded atomic commit**. If another tab has advanced canon, a stale edit commit rejects with a conflict; overwritten drafts are not guaranteed to be recoverable. Any text still accessible in an open editor or latest stored draft may be used for the player's reconciliation.
- This policy concerns **player-authored draft text**, not AI-generated streaming output (IDEA-0019). Exact target identifiers and debounce intervals remain implementation details.

## Dependencies and constraints
- Depends on durable narrative storage, event provenance, save revisions and the historical-edit reconciliation pipeline.
- User-approved text edits must not silently mutate authoritative world state mid-typing.
- If older prose is changed, derivative summaries, memories and world events may need invalidation or recalculation after confirmation.
- State rollback/replay, confirmation UX and truncation are detailed in separate candidate ideas. This acceptance establishes the direction, not every algorithm.
- Preserve user control over continuity; do not add automatic contradiction flags or wholesale regenerated future prose as part of this idea.

## Open questions
- How should stable block IDs survive split, merge, deletion and reorder operations?
- What is the optimal unit of tracked edit: turn, paragraph, document node or change range?
- How should pending edits be represented, autosaved and recovered after a crash?
- How should the editor communicate pending changes and when a state rebuild is needed?

## Draft acceptance criteria
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
- 2026-10-18 — **Accepted IDEA-0005 Option B:** All player-authored provisional prose edits use latest-only shared draft slots per editing target; later autosaves may overwrite across tabs without draft history or merging. Canonical revisions and source provenance still require validated version-checked commits. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Direct inline editing, stable text-block identities, and deferred world-state reconciliation. Moved to staging to refine the implementation details. No production approval.
