---
id: PRD-0024
type: prd
status: accepted
related:
- NOTE-0033
- PRD-0001
- NOTE-0013
---

# Episodic Memory Retrieval

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0023](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Episodic%20Memory%20Retrieval.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S09**. First milestone: **M4**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Latest accepted event and narrative authority — 2026-10-28

**Current replay/context contract ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Retrieval is a **story-memory aid**, not a game-precondition proof. Current world facts come from replaying accepted state assertions, while memories may contain fictional contradictions after an earlier edit; do not “invalidate” a later accepted fact because its earlier cause is absent. Current-only passage/event history (B3-D04) has **no retained passage revisions**; invalidate/rebuild memory indexes for overwritten/deleted current text.


## Accepted direction
- **Retrieve specific old incidents:** When relevant to a new turn, Lorebound can surface details from previously committed story passages, dialogue, actions and discoveries that longer summaries may have omitted.
- **Source-of-truth passages:** Retrieval should point to original accepted narrative/event material, not assume a generated summary or event tag is itself authoritative. Show or retain scene/turn IDs, source passage references and revision provenance.
- **Useful indexing without a second model:** Consider incrementally maintained full-text and known-entity indexes plus scene/turn/revision references as a lightweight baseline that can run locally without an embedding model, cloud service or second loaded LLM. Store references to underlying passages rather than copying entire narrative history into a new source of truth.
- **Relevance-sensitive queries:** Candidate lookup may use current action/scene terms, stable entity IDs, rare phrases, metadata or explicit player references to the past. Avoid blindly treating every common word or every character occurrence as a useful memory match; query construction and ranking remain *open choices*, not a commitment to BM25 or a specific technique.
- **Preserve whole-history retrieval as a real option:** **Do not restrict retrieval to a small recent window, a short predefined candidate list or only known entity matches.** Evaluate searching across **all available committed story history** (via an index or, if efficient enough, exhaustive scan) on each appropriate retrieval pass. Wide-history lookup may yield more useful context at a smaller **generation-context token cost** because only relevant excerpts are sent to the model. Evaluate actual retrieval latency, CPU/memory use and recall rather than assuming a narrow query is always better.
- **Selective context injection:** The retrieval process may examine all history locally while passing only a small number of useful passages/excerpts into the generation context. **Scanning stored history is not the same as sending the whole history to the LLM.** Avoid gratuitous context pollution and expose what was selected and from where.
- **Edit/revision safety:** If older prose is revised, deleted, truncated or undone, reindex or invalidate affected memory references. Obsolete excerpts should not appear as up-to-date story truth.
- **Flexible retrieval methods:** Try combinations of full-text ranking, entity links, structured event metadata, time/history scope and optional more sophisticated methods; no single mandatory query-building, BM25, vector-store or retrieval algorithm is approved at this stage.
- **RAG is separately gated:** Embedding/semantic retrieval remains a separately unaccepted candidate Embedding-Based Lore Retrieval and RAG Context Selection (IDEA-0063). The accepted episodic memory capability must be viable without requiring embeddings or another model.
- **No fabricated recall:** When no sufficiently relevant historical incident can be located, return no retrieved excerpt (or show uncertainty) instead of inventing remembered events or presenting arbitrary matches as facts.

## Dependencies and constraints
- The underlying chronological narrative and accepted events remain canonical; retrieval, optional tags and context selection are derived aids, not authoritative world-state modifications.
- Stable scene/turn/source-revision tracking and edit invalidation coordinate with **separately accepted staging** Automatic Long-Term Story Summaries (IDEA-0022), Versioned Text Blocks and Revision IDs (IDEA-0040) and Event-Sourced World History (IDEA-0039). Their accepted scope is **not implemented merely because staging approved it**, and cached memories remain derived rather than authoritative.
- Must work with one local/cloud model, with no mandatory embedding model or additional inference call for indexing or lookup.
- RAG/vector embeddings in Embedding-Based Lore Retrieval and RAG Context Selection (IDEA-0063) remain unaccepted. Accepting this concept does not promote that candidate.
- Relevant excerpts are subject to context-budget policies, player lore selection and the separately **accepted staging** Token-Budgeted Context Builder and Inspector (IDEA-0024). Its model-budget settings and algorithms still require refinement.
- Searching all committed history is a supported **design avenue to evaluate**, not a guarantee that every retrieval pass will always perform a full exhaustive scan regardless of resource cost.
- Retrieval should avoid sending vast story history to cloud providers when local selection and a smaller final context will do. Never claim reduced model-token cost without measurement.

## Open questions
- When should retrieval run automatically, and when should it wait for a strong past-reference signal or user request?
- How should the system identify meaningful query anchors from a verbose action without drowning in frequent terms or matching thousands of character mentions?
- What is the relevance strategy when the current text indirectly references a past event using different wording?
- How do full-history inverted-index search, exhaustive scanning, structured-event lookup and narrower targeted queries compare in actual recall, latency, CPU/RAM and context-token savings?
- At what story size should a full scan give way to an index, and can broad retrieval remain responsive for very long adventures?
- What passage chunking, event granularity, score thresholds and maximum excerpts should be used?
- How should indexes be invalidated/rebuilt after historical edits, truncation, branches and revisions?
- Can structured event metadata be derived reliably without mistaking speculative or failed actions for accepted history?
- How should memory previews, sources, omissions and user pin/exclude preferences interact with future context controls?

## Draft acceptance criteria
- [ ] The application can retrieve relevant **original committed passages** about old incidents beyond the model's current prose window, with stable source scene/turn links.
- [ ] The feature can operate with one already-configured model and local text/entity indexing, with no mandatory embeddings or separate inference model.
- [ ] Known entity references, full text and source revisions can be used to find and attribute past incidents without relying only on a global narrative summary.
- [ ] Design tests include retrieval candidates from **the entire available committed story history**, not only a hard-coded recent window; a full scan and an all-history indexed search are evaluated as options.
- [ ] Retrieved passages are selectively added to generation context, instead of automatically sending the entire searchable corpus to the LLM.
- [ ] Retrieval ranking and query-building are measured for irrelevant common words, frequently occurring characters, distant old incidents and paraphrased references.
- [ ] Edits, deletions or truncations of older passages invalidate/reindex affected retrieval records so stale incidents are not presented as accepted canon.
- [ ] No irrelevant or low-confidence passage is silently promoted to an authoritative fact.
- [ ] Performance evaluation accounts for total search latency, index maintenance, memory/CPU use, recall/precision and generation-context token cost.
- [ ] Embedding-driven semantic RAG remains an independent approval decision (IDEA-0063).

## Supporting detail

See [NOTE-0033](../knowledge/inbox/NOTE-0033-prd-0024-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
