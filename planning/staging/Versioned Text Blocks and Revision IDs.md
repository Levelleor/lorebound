---
id: "IDEA-0040"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-17"
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
- **No fixed text granularity yet:** Whether IDs attach to paragraphs, turn-body ranges or another stable editor representation remains for refinement.
- **Split and merge semantics remain open:** Preserve traceability across split/merge operations, but do not preselect how identities, ranges, event links or new revision ancestry are reassigned.
- **No production or implementation approval:** This acceptance moves the original candidate to staging for design and evaluation only.

## Proposed behaviour
Represent editable story prose through stable source identifiers and versioned text. When a player edits a block, create or track a new revision while retaining references to prior revisions. Validated generated events link to the source turn and exact text revision(s) supporting their effects. An editor or reconstruction system can then identify the events whose evidence changed, rather than relying on matching raw text after edits. Maintain generation provenance and block lineage without assuming paragraph-level blocks, turn-level ranges or a particular split/merge algorithm.

## Alternatives and trade-offs
Paragraph-level IDs can make specific event provenance precise, but require careful handling of splits, merges and reordering. Stable turn identities with ranges may simplify editing structures but ranges can drift after substantial changes. Either approach should support durable links and revisions; neither is preselected. Storing lineage adds bookkeeping but supports accurate world-state invalidation. Future optimisation can avoid revisiting unaffected text or events, provided correctness is preserved.

## Architecture integration (2026-10-17)
- Accepted story text blocks and revisions persist in host-filesystem SQLite via Wails/Go services. Browser editing drafts/memory are not canonical saved history.
- In both desktop and headless browser modes, the shared client-side TypeScript engine tracks block/revision provenance; Go atomically commits validated revisions and related accepted events, rejecting stale revisions.
- Export/import must preserve precise revision ancestry and identifiers; choosing the archive format remains a separate storage/backup refinement.

## Dependencies and constraints
- Works with accepted [[Event-Sourced World History]] (IDEA-0039), whose event records need stable source turn and revision references.
- Historical editing confirmation and deletion UX belong to separate unaccepted [[Historical Edit Confirmation and Bulk Truncation]] (IDEA-0041). Checkpoint design and undo safety are independently unaccepted (IDEA-0042, IDEA-0043).
- Existing validated events retain traceable origin even when their text source is changed or no longer active.
- A new text revision is not automatically proof that old world-state changes remain valid; any invalidation/replay must respect the event-sourcing and authoritative-state validation boundaries.
- Generated prose and user-authored edits must remain distinguishable where provenance requires it.
- Do not commit to automatic regeneration of downstream prose or to a mandatory paragraph-versus-turn-range strategy.

## Open questions
- How should split/merge edits retain event provenance and stable lineage?
- Should canonical block identity refer to individual paragraphs, larger turn bodies or persistent text ranges?
- How should inserts, deletions, reordering, copy/paste and moving text between turns affect lineage?
- Can one event depend on multiple source blocks or revisions, and how are such dependencies represented?
- Which model-generation metadata is useful and safe to keep as source provenance?
- What constitutes a new revision, and should drafts have revision IDs before confirmation?
- How should historical edits be inspected without prematurely replaying or regenerating later story turns?
- How can old source references remain resolvable after truncation, undo or branch selection?

## Draft acceptance criteria
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
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Stable IDs and revision IDs for editable story blocks; provenance connecting source text revisions, generated turns and derived validated world-state events; preservation of edit lineage. Paragraph versus turn-range granularity and split/merge provenance rules deliberately left for refinement. Promoted from Inbox to staging, not production.
