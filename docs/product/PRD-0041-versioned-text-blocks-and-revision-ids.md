---
id: PRD-0041
type: prd
status: accepted
related:
- NOTE-0048
- PRD-0001
- NOTE-0015
---

# Versioned Text Blocks and Revision IDs

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0040](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S05**. First milestone: **M1**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-002B scoped audit](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md); remaining inventory draft
- Evidence: [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md)

## Current accepted architecture after 2026-10-28 redirection

**Superseded original feature assumptions:** Under B3-D04 and [B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md), this note's old proposal to retain accepted **passage revision IDs/history** is **not current Lorebound architecture**. Keep a stable logical passage ID and **only its latest/current structured body**; confirmation overwrites it. Current typed outcome assertions track accepted facts with total event order; a later fact does not require a surviving earlier fictional cause or introduction. The document title, original scope, alternatives and user approval history remain intact for provenance; they do **not** authorise a revision archive. Event **schema versions** and adventure concurrency counter remain, distinct from old passage revision copies.


## Accepted direction
- **Stable identity for editable prose:** Assign durable IDs to continuing story text blocks so inserting, reordering or editing prose does not automatically lose a block's identity.
- **Distinct revisions:** Record separate revision identifiers for different versions of a text block. Revising text does not silently overwrite which precise prior version established an event.
- **Traceable generation provenance:** Link generated story turns and their source text revision(s) to the circumstances and inputs relevant to derived world-state events, with exact metadata granularity to be refined.
- **Event-to-text provenance:** Validated state-change events from accepted Event-Sourced World History (IDEA-0039) can refer to the exact originating block ID, revision and turn, not just an ambiguous substring or current text.
- **Editing lineage:** Preserve meaningful relationships between original and edited blocks, including when historical prose changes. A later revision must not silently inherit facts that were supported only by superseded text.
- **Historical consistency:** When an earlier passage is changed, its provenance should make downstream affected events identifiable for review, invalidation or state reconstruction under separately accepted/refined historical-edit rules. Do not approve automatic downstream prose regeneration merely by accepting block revision IDs.
- **Granularity selected (user acceptance, 2026-10-18):** Canonical IDs and accepted revisions apply to logical story **turn/passage bodies**, not individual paragraphs or source ranges. Exact editor and storage representation remain open.
- **Whole-passage split and merge still open:** Changes to paragraphs within one passage revise the same passage without paragraph IDs. Moving, splitting or merging whole passages must keep coherent source references; exact ID and ancestry rules remain open.
- **No production or implementation approval:** This acceptance moves the original candidate to staging for design and evaluation only.

## Dependencies and constraints
- Works with accepted Event-Sourced World History (IDEA-0039), whose event records need stable source turn and revision references.
- **Current acceptance status:** Historical Edit Confirmation and Bulk Truncation (IDEA-0041) and Snapshots and Incremental State Rebuild (IDEA-0042) are **independently accepted in staging**. Their workflows and reconstruction boundaries are not newly approved by this revision-ID idea. The separate Undo-Safe State Rollback and Provenance (IDEA-0043) candidate remains **unaccepted in Inbox**; accepted canonical Undo is already covered by IDEA-0004.
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

## Supporting detail

See [NOTE-0048](../knowledge/inbox/NOTE-0048-prd-0041-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
