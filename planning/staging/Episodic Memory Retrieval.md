---
id: "IDEA-0023"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Memory Lorebook and Context Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Episodic Memory Retrieval

## Latest accepted event and narrative authority — 2026-10-28

**Current replay/context contract ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)):** Retrieval is a **story-memory aid**, not a game-precondition proof. Current world facts come from replaying accepted state assertions, while memories may contain fictional contradictions after an earlier edit; do not “invalidate” a later accepted fact because its earlier cause is absent. Current-only passage/event history (B3-D04) has **no retained passage revisions**; invalidate/rebuild memory indexes for overwritten/deleted current text.


## Idea
Retrieve detailed old incidents when they become relevant again.

## Why this idea matters
Summaries can omit small but important earlier events.

## Accepted direction
- **Retrieve specific old incidents:** When relevant to a new turn, Lorebound can surface details from previously committed story passages, dialogue, actions and discoveries that longer summaries may have omitted.
- **Source-of-truth passages:** Retrieval should point to original accepted narrative/event material, not assume a generated summary or event tag is itself authoritative. Show or retain scene/turn IDs, source passage references and revision provenance.
- **Useful indexing without a second model:** Consider incrementally maintained full-text and known-entity indexes plus scene/turn/revision references as a lightweight baseline that can run locally without an embedding model, cloud service or second loaded LLM. Store references to underlying passages rather than copying entire narrative history into a new source of truth.
- **Relevance-sensitive queries:** Candidate lookup may use current action/scene terms, stable entity IDs, rare phrases, metadata or explicit player references to the past. Avoid blindly treating every common word or every character occurrence as a useful memory match; query construction and ranking remain *open choices*, not a commitment to BM25 or a specific technique.
- **Preserve whole-history retrieval as a real option:** **Do not restrict retrieval to a small recent window, a short predefined candidate list or only known entity matches.** Evaluate searching across **all available committed story history** (via an index or, if efficient enough, exhaustive scan) on each appropriate retrieval pass. Wide-history lookup may yield more useful context at a smaller **generation-context token cost** because only relevant excerpts are sent to the model. Evaluate actual retrieval latency, CPU/memory use and recall rather than assuming a narrow query is always better.
- **Selective context injection:** The retrieval process may examine all history locally while passing only a small number of useful passages/excerpts into the generation context. **Scanning stored history is not the same as sending the whole history to the LLM.** Avoid gratuitous context pollution and expose what was selected and from where.
- **Edit/revision safety:** If older prose is revised, deleted, truncated or undone, reindex or invalidate affected memory references. Obsolete excerpts should not appear as up-to-date story truth.
- **Flexible retrieval methods:** Try combinations of full-text ranking, entity links, structured event metadata, time/history scope and optional more sophisticated methods; no single mandatory query-building, BM25, vector-store or retrieval algorithm is approved at this stage.
- **RAG is separately gated:** Embedding/semantic retrieval remains a separately unaccepted candidate [[Embedding-Based Lore Retrieval and RAG Context Selection]] (IDEA-0063). The accepted episodic memory capability must be viable without requiring embeddings or another model.
- **No fabricated recall:** When no sufficiently relevant historical incident can be located, return no retrieved excerpt (or show uncertainty) instead of inventing remembered events or presenting arbitrary matches as facts.

## Proposed behaviour
Associate committed scenes or passages with stable source IDs, revision IDs, searchable text and entity references where known. Retrieve candidate original passages from the entire available history when useful, using a local searchable index or direct historical scan depending on measured story size, latency and resource use. Query terms can be weighted by distinctiveness and current scene intent, but the design must not prematurely require exact keyword overlap or a particular BM25 implementation. Optionally take more selective paths for performance when benchmarks support that choice. Rank and inspect candidate matches, trim to the relevant excerpts, and pass only selected memory within the context budget. Maintain revision-aware index invalidation on old edits, and do not force a second LLM or embedding model.

## Alternatives and trade-offs
A text and entity inverted index can efficiently search **across the entire adventure** without rereading every document or requiring an AI model; scoring can consider rarity, term proximity, source entities and context. A direct full-history scan is another plausible approach when the story database is small or scanning is sufficiently cheap. Narrow retrieval based on explicit entities or targeted queries may be faster, but can miss vague references and old details that lack obvious search terms. More sophisticated semantic retrieval might improve paraphrase matching later, but is not a prerequisite and belongs to unaccepted IDEA-0063. The best approach should be decided using measurable recall, false positives, retrieval latency, index maintenance and **total generation-context tokens**, not a blanket assumption that smaller search scope is better.

## Dependencies and constraints
- The underlying chronological narrative and accepted events remain canonical; retrieval, optional tags and context selection are derived aids, not authoritative world-state modifications.
- Stable scene/turn/source-revision tracking and edit invalidation coordinate with **separately accepted staging** [[Automatic Long-Term Story Summaries]] (IDEA-0022), [[Versioned Text Blocks and Revision IDs]] (IDEA-0040) and [[Event-Sourced World History]] (IDEA-0039). Their accepted scope is **not implemented merely because staging approved it**, and cached memories remain derived rather than authoritative.
- Must work with one local/cloud model, with no mandatory embedding model or additional inference call for indexing or lookup.
- RAG/vector embeddings in [[Embedding-Based Lore Retrieval and RAG Context Selection]] (IDEA-0063) remain unaccepted. Accepting this concept does not promote that candidate.
- Relevant excerpts are subject to context-budget policies, player lore selection and the separately **accepted staging** [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024). Its model-budget settings and algorithms still require refinement.
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant-proposed candidate, explicitly accepted after discussing query-building limitations and broader history search with the requesting user.
- Accepted into **staging for refinement only**. No particular ranking/query algorithm or benchmark result has been approved or demonstrated.

## Decisions and review history

- 2026-10-23 — **Pass A final chronology correction:** IDEA-0039/0040 and IDEA-0022 are separately accepted in staging, not unaccepted candidates or implemented components. Preserve independent gates and the unaccepted IDEA-0063 RAG candidate.

- 2026-10-19 — **Pass A reference correction:** IDEA-0024 (token-budgeted context and inspector) is accepted independently in staging, not merely an unaccepted proposal. Embedding-based RAG IDEA-0063 remains unaccepted; no new feature approval.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — After reviewing limitations of BM25 query-term selection, the requesting user **explicitly accepted** episodic memory retrieval and added: "lets not ignore a possibility that we may want to search across all history in case that would be quick enough for us to have more useful context for smaller price (context window)." Thus leave query/ranking open, evaluate broad searches of all committed history (indexed or exhaustive) against targeted lookup, and transmit only useful excerpts to save context. IDEA-0063 embeddings/RAG remains a separate **unaccepted** Inbox idea. Moved to staging, not production.

- 2026-10-28 — Explicit user-approved narrative-first declaration in B6-D01 governs any older contradictory mechanical/simulation prose in this staged note. Original decision provenance preserved; no implementation or stage promotion.
