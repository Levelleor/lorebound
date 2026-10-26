---
type: architecture-decision
status: accepted
decision_id: "B2-D05"
created: "2026-10-26"
updated: "2026-10-26"
approved_at: "2026-10-26"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
  - structured-prose
  - architecture-decision
---

# B2-D05 — Canonical structured passage documents

## Approval and provenance

**Accepted by the requesting user on 2026-10-26:** “yes, lets accept this as D05, I agree with these”, referring to the revised **data-first, single-source-of-truth structured passage document** proposal explained immediately before the acceptance. This expressly supersedes the *original unapproved B2-D05 recommendation* for a general-purpose split/merge ancestry system. D05 is **not** approval of B2-D03 (full Turn-0 replay), B2-D04 (unrepresentable event fallback), or B2-D06 (event schema evolution).

This is an approved **architecture contract**, not a production promotion or evidence of existing code.

## Motivation

Lorebound presents and edits a flowing narrative, with one logical passage/message created for each committed player submission or accepted AI response. One passage can contain multiple paragraphs, spans, hard line breaks and limited inline formatting. Its contents are often consumed by multiple systems (AI context, event provenance, editing, summaries and search). HTML/DOM nodes must not become Lorebound's underlying persisted story records, and AI prompts must not receive presentation HTML as story text.

## Accepted decision

**A passage revision has exactly one authoritative, structured, schema-versioned document body persisted as JSON in the Go-managed SQLite adventure library.** Browser editing and AI integration share that schema.

### Identity, structure and storage

- **One accepted message/response = one logical story passage/block** with stable identity and successive **immutable accepted revision IDs**. A passage may contain many paragraphs and line breaks. Accepting a generated response or player submission depends on the existing workflow's validation/commit rule; provisional generation text is not itself canon.
- The canonical content is a **small, typed rich-text document tree**, with at least paragraph, text and hard-break semantics and optionally a deliberately supported subset of inline marks (e.g. emphasis). A **ProseMirror-compatible JSON document model or equivalently narrow schema** is a suitable design; exact editor/library choice, finalized nodes and serialization syntax remain implementation design, not decided by this ADR.
- Canonical `content_json` and `content_schema_version` are stored with the accepted passage revision in the **single Go-owned SQLite library**, with stable passage ID and revision ID. Historical accepted documents are not overwritten. Active-history selection remains the separate accepted B2-D02 authority.
- **No canonical per-paragraph, per-span, DOM-node or character-range IDs** are needed; paragraph/line-break elements are internal nodes *inside* one passage. Event provenance references the **exact passage ID and accepted revision ID**, never a displayed `<p>` tag or DOM location.
- Persist **noncanonical debounced editing drafts** separately in the same SQLite library under the previously accepted latest-successful-save draft policy. Typing changes the browser's working document and optionally the draft, **not** the accepted passage revision. Confirmed revisions and any accepted event/history consequences are committed together through B1-D03's atomic expected-version/epoch-checked Go boundary.

### UI projection

- The Svelte/browser editor **loads the structured document**, edits it through a schema-aware document/editor state and renders HTML/DOM as its view. The DOM is **not** the source of truth; reading `innerHTML`, scraping `<p>` tags or persisting arbitrary HTML is **not** the canonical save/recovery path.
- Paragraphs, inline formatting and hard line breaks are represented by schema nodes/marks. Editing internal paragraphs retains the **same passage identity** and yields a new accepted revision only after confirmation. A submitted new player message or newly accepted AI response adds a **new passage**, not a new paragraph-level identity.
- An editor might render per-passage editors or one document with top-level passage nodes. Virtualisation or read-only rendering of offscreen passages is allowed. This ADR does **not** require a particular HTML structure, editor framework, separate textbox per passage, cross-passage editing behaviour or package API.

### AI and other derived consumers

- AI responses arriving as **plain text** are converted through a single explicit, deterministic `plainTextToDocument` contract into the same structured passage schema. Initial mapping can use blank-line boundaries for paragraphs and single newlines for hard breaks; exact whitespace/empty-paragraph handling and whether Markdown is deliberately parsed remain further design details.
- The AI/context systems receive a **deterministically serialized text projection** from the canonical document (e.g. `documentToModelText`), producing ordinary text with readable line breaks/paragraph separation, **not HTML markup**. Explicitly supported formatting may map to textual conventions if chosen later. Never naively interpret arbitrary model-supplied text as trusted HTML.
- Exportable plain text, context content, indices and search projections must derive from the **same accepted structured revision** through shared, well-defined serializers. Do **not** maintain HTML or independent editable plain-text copies as competing durable sources.
- Replaceable **derived caches** (for example AI-ready text keyed by immutable revision ID and serializer version) may be used for performance but have no canonical authority; they can be discarded and recreated from the accepted JSON document.

## Illustrative representations (not schema commitments)

A passage document can be represented conceptually as:

```json
{
  "type": "doc",
  "content": [
    {"type": "paragraph", "content": [{"type": "text", "text": "Mara enters the library."}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "The key is on the table."}]}
  ]
}
```

A revision record conceptually contains `passageId`, `revisionId`, `contentSchemaVersion`, `contentJson` and commit provenance. A world event references the exact `passageId/revisionId` source. Separately stored active-history selection chooses displayed/current revisions.

The canonical document can be shown as HTML paragraphs in the browser and serialized as `Mara enters the library.\n\nThe key is on the table.` for model context. The HTML and derived string do **not** become additional canonical stored copies.

## Alternatives considered

1. **Accepted:** Structured, schema-versioned JSON document in SQLite; browser DOM and AI text derived through one content contract.
2. **Not selected:** Store `innerHTML` / DOM tags as canonical story state. This would couple stored history to editor rendering, complicate content trust and leak markup into model context.
3. **Not selected for rich-text requirements:** Store plain-text string alone as authoritative while independently editing a rich-text representation. Plain text is compact and AI-friendly but does not faithfully preserve optional editor formatting.
4. **Not selected:** Persist both HTML and plain text as independently mutable, canonical content, risking representation drift.
5. **Superseded initial D05 proposal:** Require generic ancestry and reattribution for arbitrary whole-passage split/merge/reorder immediately. That problem is **deferred**, not silently approved by choosing a structured document body.

## Scope boundaries and risks

- **Still open:** exact rich-text schema and allowed marks, serializer versioning and newline/whitespace fidelity, initial editor framework, limits/sanitization for pasted content, exact SQL schema, indexing, passage-level reordering or explicit whole-passage split/merge operations, cross-passage selection UX, and event reassignment after structural edits.
- **Still accepted elsewhere:** the entire story/state library is stored in one Go-managed SQLite database; latest-only autosaved drafts remain noncanonical; domain events are versioned immutable outcomes grouped in commits (B2-D01); B2-D02 decides active revisions; historical edits trigger their established confirmation choices and deterministic replay; no Go-side second gameplay engine or model reviewer is introduced.
- **B2-D03 remains revision pending:** This ADR does not choose whether all state reconstruction runs from Turn 0 or whether accepted new turns trigger full replay.
- **No source idea promotions or implementation checks are claimed.**

## Traceability

S03 narrative editing, S05 history and revisions, S06 coordination, S07 generation, S09 context, S12 storage. [IDEA-0003](../../staging/Direct%20Editable%20Prose%20Document.md), [IDEA-0040](../../staging/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md), [IDEA-0051](../../staging/Browser-Persistent%20Story%20Database.md); [B2-D01](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md), [B2-D02](./B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md), B1-D03/B1-D05.

## Decision history

- **2026-10-25 — Initial D05 proposal (not accepted):** Stable passage IDs with explicit split/merge ancestry as the primary new architecture rule.
- **2026-10-26 — User clarification:** One submitted message or accepted AI response is a logical passage; its internal `p`, `br`, inline spans and paragraph structure are display/editing details, not independent canonical passages. Direct linkage to derived events is at passage/revision level.
- **2026-10-26 — Revised proposal explained:** Canonical structured JSON passage document in Go/SQLite; editor/DOM and model-readable text are derived projections, with one shared serializer and no second persisted content authority. Explicit whole-passage split/merge requirements deferred.
- **2026-10-26 — Explicit user approval:** Accepted revised B2-D05 architecture with the above source-of-truth and projection boundaries. No approval implied for D03, D04 or D06.
