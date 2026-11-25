---
id: PRD-0004
type: prd
status: accepted
related:
- NOTE-0019
- PRD-0001
- NOTE-0015
- NOTE-0009
---

# Direct Editable Prose Document

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0003](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Direct%20Editable%20Prose%20Document.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S03**. First milestone: **M2**. Delivery: **PARTIAL**.

- Requirement coverage: [Four affected rows; generated-passage boundary](../work/items/STORY-0019-accepted-generated-passage-editing.md); broader editing later
- Evidence: [PR #16](https://github.com/Levelleor/lorebound/pull/16), confirmed merged; authored coverage in [DEV-003G](../work/items/STORY-0020-accepted-authored-passage-editing.md) verified/merged in PR #17

## Current accepted architecture after 2026-10-28 redirection

**Current approved editor/replay semantics:** A story passage has one current structured body (B3-D04); draft edits are noncanonical and confirmation atomically replaces the current body under adventure-version checks. [B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md) means **later accepted factual outcome assertions do not become invalid solely because earlier prose stops explaining them**. Keep Later Turns preserves those later events, including sparse item identities; no auto-cascading corrections, history revisions or retroactive prose rewrite. Manual state corrections still require separate explicit player Commit with composer overlay.


## Accepted direction
- Treat story content as **directly editable prose**, not immutable chat messages.
- Allow users to edit, insert, remove and rearrange text in previous turns and generated passages through the story interface.
- Preserve **stable identities and revisions at the logical story turn/passage-body level**, with their original turn/source provenance linking derived world-state events. **Individual paragraphs inside a passage do not require their own canonical IDs or revision history**.
- **Defer world-state reconciliation** while edits are in progress. Reprocess affected state only after a deliberate confirmation of the pending edits and what happens to later turns.
- For historical edits, the user may manually repair later prose or delete later turns in bulk. This does **not** approve automatic downstream prose regeneration or contradiction-flagging.

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

## Supporting detail

See [NOTE-0019](../knowledge/inbox/NOTE-0019-prd-0004-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
