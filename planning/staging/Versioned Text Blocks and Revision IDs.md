---
id: "IDEA-0040"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Versioned Text Blocks and Revision IDs

## Idea
Assign stable IDs and revisions to editable prose blocks and link derived state changes to them.

## Why this idea matters
Historical editing must identify precisely which facts may be invalidated.

## Accepted direction
- **Stable identity for editable prose:** Assign durable IDs to continuing story text blocks so inserting, reordering or editing prose does not automatically lose a block's identity.
- **Distinct revisions:** Record separate revision identifiers for different versions of a text block. Revising text does not silently overwrite which precise prior version established an event.
- **Traceable generation provenance:** Link generated story turns and their source text revision(s) to the circumstances and inputs relevant to derived world-state events, with exact metadata granularity to be refined.
- **Event-to-text provenance:** Validated state-change events from accepted [[Event-Sourced World History]] (IDEA-0039) can refer to the exact originating block ID, revision and turn, not just an ambiguous substring or current text.
- **Editing lineage:** Preserve meaningful relationships between original and edited blocks, including when historical prose changes. A later revision must not silently inherit facts that were supported only by superseded text.
- **Historical consistency:** When an earlier passage is changed, its provenance should make downstream affected events identifiable for review, invalidation or state reconstruction under separately accepted/refined historical-edit rules. Do not approve automatic downstream prose regeneration merely by accepting block revision IDs.
- **Granularity selected (user acceptance, 2026-10-18):** Canonical IDs and accepted revisions apply to logical story **turn/passage bodies**, not individual paragraphs or source ranges. Exact editor and storage representation remain open.
- **Whole-passage split and merge still open:** Changes to paragraphs within one passage revise the same passage without paragraph IDs. Moving, splitting or merging whole passages must keep coherent source references; exact ID and ancestry rules remain open.
- **No production or implementation approval:** This acceptance moves the original candidate to staging for design and evaluation only.

## Proposed behaviour
Represent editable prose using stable **story turn/passage identities** and versioned passage bodies. On confirmation of edits within a passage, create a new revision for that passage, preserving prior revisions. Validated events link to the source passage/turn and exact committed revision. This allows downstream reconciliation without treating individual paragraphs as canonical entities. Moving or dividing whole passages still requires future identity/lineage rules.

## Alternatives and trade-offs
**Selected:** Turn/passage-level IDs and revision history offer adequate canonical provenance with less bookkeeping. Paragraph-level IDs might enable finer event attribution but are **not selected**. Changing one paragraph may require reconsidering events attributed to that passage; this is acceptable to preserve simpler stable history. Exact editor internals and optional nonauthoritative source spans remain open.

## Architecture integration (2026-10-17)
- Accepted story text blocks and revisions persist in host-filesystem SQLite via Wails/Go services. Browser editing drafts/memory are not canonical saved history.
- In both headless localhost/normal-browser mode, the shared client-side TypeScript engine tracks block/revision provenance; Go atomically commits validated revisions and related accepted events, rejecting stale revisions.
- Export/import must preserve precise revision ancestry and identifiers; choosing the archive format remains a separate storage/backup refinement.

## Draft autosave and accepted revisions
- Player-authored, unfinished prose is autosaved after a brief idle pause into the **same SQLite library**, but is **noncanonical**. A saved draft is not an accepted revision, source of event provenance, or reason to rebuild world state.
- Only confirmation creates a canonical text revision, atomically with accepted related state changes. Draft IDs/cleanup rules remain implementation details.
- On return to the browser/editor, restore **only the last successfully saved shared draft for that logical editing target**; drafts overwritten by another tab are not retained. The exact debounce interval and draft-target key design remain open.

## Full-history duplication and revision provenance
- Duplicating an adventure under IDEA-0005 retains the **whole accepted story and text-revision lineage**, not just the latest rendered prose. All event-to-turn, block-to-revision and related provenance links remain coherent in the new adventure so both copies can be edited and reconstructed independently.
- The new adventure identity is distinct; precise block/revision ID copying versus remapping depends on their chosen scope. Avoid pointers from the duplicate to mutable records owned by the source adventure.
- **Do not duplicate unconfirmed editing drafts** or unsent player input; those are noncanonical and stay with the original adventure.

## Concurrent edits cannot overwrite accepted revisions
- **Accepted IDEA-0005 user decision (2026-10-18):** Multiple tabs can propose edits to the same adventure. A confirmed text revision and its state/event provenance must commit against the **expected authoritative adventure version** checked by Go/SQLite. If Tab A commits first, a conflicting Tab B revision prepared from earlier state is **rejected**, not used to overwrite, reassign or silently rebase A's recorded revision lineage and event sources.
- Local unconfirmed text edits remain **noncanonical drafts** even when another tab commits a revision. A stale **canonical edit commit** is rejected visibly, protecting accepted lineage and state. For the **same draft target**, however, the user's later explicit Option B permits a successful autosave from another tab to **replace the saved draft without conflict checking**. Only the last saved shared draft is recoverable, though an open tab may still have text in memory. Draft keying, debounce and conflict-display details for actual canonical commits remain open.
- This does not require exclusive editing locks, automatic prose merging, per-keystroke canonical revisions, or a particular block-granularity conflict algorithm. Earlier accepted historical-edit confirmation and downstream reconstruction rules continue to apply.

## Last-saved draft text is replaceable, accepted revisions are not
- **User-approved IDEA-0005 Option B (2026-10-18):** An unconfirmed prose edit, whether current or historical, is a **noncanonical draft** with **one latest saved content value per logical editing target** in SQLite. Successful autosaves from any browser tab can replace the saved draft for that target. No draft-specific lock, version-conflict rejection, independent per-tab draft history or earlier-draft recovery is required. **Different prose blocks/targets** do not clobber each other, and composer drafts remain separate.
- This relaxed policy **must not** overwrite a **canonical versioned text block**, its accepted revision ID or event provenance. A **confirmed** prose edit is a distinct expected-version checked atomic operation and rejects if another tab advanced the authoritative adventure. Canonical lineage must remain reconstructible regardless of which provisional draft autosave happened most recently.
- A stale committing tab may still offer any text present in its live editor or latest shared saved draft for user-led reconciliation, but cannot promise retrieval of drafts already overwritten by other tabs.

## Fork preserves accepted text revisions through any chosen turn
- **Accepted IDEA-0011 Option A (2026-10-18):** A player may fork at **any accepted/committed story-turn boundary**. The new adventure receives a coherent, reconstructible copy of **the accepted narrative/text-revision lineage through that boundary**, linked correctly to its own accepted event/state provenance. Later source turns, later-only revisions and their derived effects are **not part of the new fork**.
- **No transient material:** Pending prose-edit drafts, unsent composer messages, model streaming previews, validation-rejected results and any other uncommitted changes are not eligible fork points or copied canonical revisions. A named checkpoint or special snapshot is not needed; accepted versioned turn history identifies boundaries.
- **Independent revision identity:** Maintain proper in-fork block/revision/event links with no mutable reference back to the original adventure. Changes to future text in either story cannot rewrite the other's history. Exact ID remapping versus safe immutable storage is an implementation choice, not an in-story branch UI requirement.

## Selected passage-level revision granularity
- **Explicit acceptance of IDEA-0003 Option A (2026-10-18):** Give each logical **story turn/passage** one stable source identity and a sequence of accepted revisions. A passage may contain many paragraphs, and players may freely edit, rearrange, split or merge those paragraphs without assigning them separate canonical IDs.
- **Link world events at passage level:** Every accepted derived event keeps a reference to its originating passage/turn and exact revision. No required per-paragraph history or sentence-level event attribution. If an earlier passage changes, identify affected events from that passage's revision for subsequent confirmation and state reconciliation.
- **Cross-passage work remains a refinement:** A new whole passage needs a stable ID; moving text between passages, splitting a passage into multiple passages or joining passages must retain coherent source/revision provenance. Exact ID allocation, event attribution and editor data structures remain undecided.
- **No change to commit gates:** Autosaved in-progress prose is noncanonical and latest-only per editing target. Confirmed historical edits use the accepted Keep Later Turns / Delete All After Point choices, expected-version checks and atomic Go/SQLite writes. Full-history duplication and arbitrary-turn forking preserve the passage revision lineage.

## Committed Undo retires active passage provenance without variants
- **Accepted IDEA-0004 committed Undo Option B (2026-10-18):** Undo of the active committed Turn N makes that turn/passage revision and its event dependencies **inactive in the current adventure timeline** and moves the active head to N-1, while keeping the exact surviving source passage IDs/revisions and their provenance reconstructible. Repeatable Undo can traverse to the available committed baseline; this is separate from the short temporary editor undo stack.
- **New continuation, same adventure:** Committing a new turn after rollback creates the next active passage/event lineage in **the same adventure**. Old undone passages must **not appear as selectable response alternatives, parallel heads or automatic canonical Redo candidates**. Any internal inactive audit/source records are strictly non-playable bookkeeping, not a hidden version gallery.
- **Existing historical-edit rule remains:** An earlier passage edited **while later turns stay active** still uses the IDEA-0041 Keep Later Turns/Delete All After Point confirmation and re-evaluation. Undo of the **current active head** is a rollback operation, not a freeform historical prose revision. All canonical changes remain expected-version guarded and atomic. Provisional Retry replaces AI candidate text and never creates a canonical passage revision until that candidate is actually accepted.

## Dependencies and constraints
- Works with accepted [[Event-Sourced World History]] (IDEA-0039), whose event records need stable source turn and revision references.
- Historical editing confirmation and deletion UX belong to separate unaccepted [[Historical Edit Confirmation and Bulk Truncation]] (IDEA-0041). Checkpoint design and undo safety are independently unaccepted (IDEA-0042, IDEA-0043).
- Existing validated events retain traceable origin even when their text source is changed or no longer active.
- A new text revision is not automatically proof that old world-state changes remain valid; any invalidation/replay must respect the event-sourcing and authoritative-state validation boundaries.
- Generated prose and user-authored edits must remain distinguishable where provenance requires it.
- Do not automatically regenerate downstream prose. The selected canonical revision unit is a story **turn/passage**, not individual paragraphs; exact rich-text editor implementation remains open.

## Open questions
- How should split/merge edits retain event provenance and stable lineage?
- **Resolved:** Canonical source identity is a logical story turn/passage body, not individual paragraphs or persistent text ranges.
- How should inserts, deletions, reordering, copy/paste and moving text between turns affect lineage?
- Can one event depend on multiple source blocks or revisions, and how are such dependencies represented?
- Which model-generation metadata is useful and safe to keep as source provenance?
- What constitutes a new revision, and should drafts have revision IDs before confirmation?
- How should historical edits be inspected without prematurely replaying or regenerating later story turns?
- How can old source references remain resolvable after truncation, undo or branch selection?

## Draft acceptance criteria
- [ ] Undo of the current committed turn deactivates that turn's active text/event lineage and deterministically returns to the previous committed passage/state without losing source provenance of the remaining prefix.
- [ ] A new accepted passage after Undo extends the same adventure with no selectable old response variants; historical text editing still uses explicit confirmation and version checks.
- [ ] Each story turn/passage body has a stable canonical ID and accepted revision lineage; edits inside its paragraphs create a new passage revision only on confirmation, never individual paragraph revisions.
- [ ] World events identify the originating turn/passage and exact committed revision, enabling downstream reconstruction without paragraph-level IDs.
- [ ] Forking at any committed Turn N preserves accepted block/revision/source-event links and history through N only; later turns and unconfirmed drafts are excluded.
- [ ] Text edits to the new adventure remain independent of the source and work without a required named checkpoint or snapshot.
- [ ] A prose edit's noncanonical saved draft can be replaced by a newer successful save from another tab for the **same editing target**, without overwriting accepted revisions, authoritatively changing event provenance or retaining older draft copies.
- [ ] Concurrent edits that originate from stale adventure versions cannot overwrite accepted block revisions or misattribute event provenance; rejected edits retain their uncommitted text for reconciliation.
- [ ] A later successful autosave from another tab **may replace the stored noncanonical draft** for the same narrative editing target without a draft conflict or preserved prior draft version; different targets remain distinct. Canonical revision IDs are created only after successful validation and accepted commit.
- [ ] Editable story text retains stable block identities through ordinary revisions and non-destructive reordering.
- [ ] Different versions of the same continuing block have distinct revision IDs and retrievable lineage.
- [ ] Generated story turns and accepted world-state events can identify the exact source text revision(s) from which they derive.
- [ ] Changing an earlier passage permits identification of its derived events without relying on fuzzy text matching.
- [ ] Superseded text revisions and their event provenance are not silently rewritten to point at newer text.
- [ ] The system can represent lineage following complex edits without losing references, with exact split/merge policy to be refined.
- [ ] Versioning supports future historical reconstruction without mandating automatic downstream prose regeneration.
- [ ] The granularity of text blocks and exact split/merge semantics remain open pending refinement.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with previously suggested implementation details; explicitly accepted for staging only.
- Design remains unrefined, not production-approved or implemented.

## Decisions and review history
- 2026-10-18 — **Accepted IDEA-0004 turn/revision dependency:** Committed Undo moves the active narrative head backward and deactivates the undone turn's canonical effects while retaining sound provenance and expected-version atomic consistency. The same adventure may continue with a new active turn, without a response-alternative stack. Staging only.
- 2026-10-18 — **User explicitly chose Option A:** Canonical narrative revision identity is at **turn/passage** level rather than per paragraph. Paragraphs remain freely editable; events retain turn/passage revision provenance. Whole-passage split/merge rules remain open, and existing historical confirmation and atomic write safety apply. Staging only.
- 2026-10-18 — **Accepted IDEA-0011 revision dependency:** A manually created separate adventure fork may start at any committed turn and must retain the complete accepted text-revision lineage/provenance through that point, while excluding later and uncommitted revisions. No shared mutable source links or in-chat branch UI. Staging only.
- 2026-10-18 — **IDEA-0005 Option B explicitly accepted:** Provisional composer and narrative-edit drafts are **latest-only shared per logical target**, and newer autosaves can replace earlier stored drafts across tabs without draft version checks or history. This supersedes the prior draft nonclobber wording; **accepted text revisions, provenance and world state remain protected by canonical expected-version conflict checks**. Staging only.
- 2026-10-18 — **Accepted IDEA-0005 conflict dependency:** Concurrent tabs may edit the same adventure, but stale expected-version canonical text commits are rejected atomically. Preserve accepted revision lineage/provenance and the other tab's uncommitted work; draft save conflict policy remains open, with no silent cross-tab overwrite. Staging only.
- 2026-10-17 — **Cross-reference to explicitly accepted IDEA-0005 duplication:** An adventure duplicate has its own identity but preserves **the complete accepted story/history and reconstructible state**, including provenance, lore and durable plugin data. **Unsubmitted input and unconfirmed drafts are excluded.** Internal references must be coherent and neither adventure may share mutable canonical records. This is an in-library operation, not file import/export. Remains staging.
- 2026-10-17 — **Cross-idea autosave alignment with explicit user acceptance in IDEA-0005:** SQLite persists noncanonical player drafts after short typing pauses, separate from canonical story revisions and state. Committed turns/revisions and related events remain atomic; failed generation preserves canonical state and the last saved player input. This update does not promote this idea beyond staging.
- 2026-10-17 — **Runtime dependency correction:** The approved IDEA-0053 direction is a **single Wails v3 headless localhost Go server**, packaged for Windows/macOS/Linux and used through the normal browser. The earlier combined WebView-desktop plus headless interpretation has been explicitly superseded. Docker is a separate, unaccepted candidate (IDEA-0065); staging status is unchanged.
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Stable IDs and revision IDs for editable story blocks; provenance connecting source text revisions, generated turns and derived validated world-state events; preservation of edit lineage. Paragraph versus turn-range granularity and split/merge provenance rules deliberately left for refinement. Promoted from Inbox to staging, not production.
