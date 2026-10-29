---
id: "IDEA-0022"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Memory Lorebook and Context Brainstorm]]", "[[Story Editing and Event Timeline Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Automatic Long-Term Story Summaries

## Latest accepted event and narrative authority — 2026-10-28

**Current narration-first memory semantics ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)):** Summaries reflect **accepted story prose and the present declarative world tracker**; they may acknowledge fictional contradictions left by historical edits. Do not turn the old absence of a possession/travel event into a reason to call a later accepted fact invalid. Rebuild from **current** story passages and event assertions after editing, not retained passage revision histories. Drafts and rejected model proposals are not canonical.


## Idea
Independently summarise older history into persistent, rebuildable memory.

## Why this idea matters
Long stories exceed model context windows.

## Accepted direction
- **Automatic long-term summaries:** Generate persistent compact memories of older, accepted narrative history so adventures can remain coherent when their full prose exceeds an AI model's context capacity.
- **Source provenance:** For each summary, record the source turn/scene ranges and relevant source revision identifiers, so readers can trace the memory back to the original material.
- **Historical-edit invalidation:** If an earlier scene, action, prose passage or other source record materially changes, mark dependent summaries stale/invalid as appropriate; don't keep silently supplying outdated memories.
- **Rebuildable memory:** Recreate invalidated summaries from the revised authoritative story history, with refresh/rebuild status visible as appropriate.
- **Fidelity to canon:** Summaries must distinguish what actually happened from failed attempts, hypothetical prose, discarded drafts, rumours and uncommitted generations. Verified world-state data is authoritative; a summary cannot independently invent or override world facts.
- **Full history retained:** Summaries are a derived context aid, not a destructive replacement for underlying saved narrative prose and committed state/events.
- **One-model and multi-model parity:** Summary generation can reuse the single configured local/cloud model or a dedicated task-specific model, as chosen through [[One-Model Task Routing]] (IDEA-0017). A dedicated summariser model is never mandatory.
- **Summary architecture remains open:** Rolling accumulated summaries, hierarchical scene/chapter/arc summaries or a hybrid are possible; the user deliberately left this choice for staging refinement.
- **Separate scope for retrieval and context:** Choosing which past summaries enter a model prompt belongs to other ideas. IDEA-0023 (episodic retrieval) and IDEA-0024 (token-budgeted context) were **later accepted independently in staging**; their detailed algorithms remain unrefined. This summary idea does **not** approve embeddings/RAG (IDEA-0063), which remains unaccepted.

## Proposed behaviour
As a story grows, a configured summarisation step creates summaries from accepted, versioned story material, with explicit source ranges and revision references. Persist summaries as derived records, distinct from original narrative and authoritative state. When a player revises or truncates older text or associated events, invalidate the affected derived summaries and allow automatic or user-initiated regeneration from the updated sources. Supply only current, suitably selected summaries as context memory. Summarisation may run through the primary model or a separately assigned compatible model; maintain clear generation/validation failure handling and never commit an unverified summary as a new world-state fact.

## Alternatives and trade-offs
A rolling summary is straightforward and relatively cheap to maintain but may accumulate omissions or drift after repeated compression. Hierarchical scene/chapter/arc summaries can improve traceability and selective rebuilding but introduce indexing and update complexity. A hybrid is possible. The user explicitly **did not choose** between rolling and hierarchical summaries at acceptance; select the approach only after refinement. Automatic generation timing, summary length and editability also remain open.

## Dependencies and constraints
- Needs a reliable link between committed prose, accepted actions, canonical events and revision identifiers. The specific event/version infrastructure in IDEA-0039 through IDEA-0043 and the coordinator in IDEA-0044 remain separately gated proposals; this accepted direction does not approve those notes.
- Must work when a single local model handles narration, interpretation and summarisation sequentially, and when tasks are distributed among cloud/local models, consistent with IDEA-0017.
- Summary output is derived material. It must not take precedence over the current authoritative world state, and stale summaries must not be passed as current facts after relevant historical edits.
- Rebuilds or retries should avoid race conditions and duplicated effects when the story is concurrently revised.
- A summary that fails to generate or verify should not destroy its underlying story source, corrupt committed events, or masquerade as a valid up-to-date summary.
- Context-budget and per-request selection integrate with the separately **accepted staging** IDEA-0024 (context budget/inspector) and IDEA-0023 (episodic retrieval). This summary idea alone does not define their algorithms, interfaces or release readiness. Semantic RAG IDEA-0063 remains **unaccepted**.

## Open questions
- How will the summariser avoid promoting failed player actions, rejected state proposals and uncommitted drafts into established facts?
- What exact source identifiers and revision dependency graph are needed to invalidate only affected summaries after historical edits?
- Should rebuilding be automatic, scheduled during idle time, user-controlled, or a mixture?
- How should conflicting old prose and validated world state be presented and resolved before summarisation?
- Which architecture, rolling, hierarchical or hybrid, gives the best fidelity, rebuild cost and prompt efficiency?
- How should players inspect, correct, pin or replace a summary without losing a clear source trail?
- How many levels or spans of summaries should be generated, and how are quality, timing and model usage reported?
- What are sensible fallbacks when a summary model is unavailable or the context budget is too small?

## Draft acceptance criteria
- [ ] Older committed story history can be summarised into persistent memory without removing the full underlying prose and accepted events.
- [ ] Each summary records sufficient source turn/scene ranges and revision identifiers for later traceability and invalidation.
- [ ] Editing or truncating a source passage invalidates/rebuilds affected summaries rather than silently reusing stale memories.
- [ ] Stale, invalid or failed summaries are not represented as current authoritative context.
- [ ] Summaries distinguish actual accepted outcomes from unsuccessful attempts, provisional generations and in-world rumours where relevant.
- [ ] Canonical character, item and location state cannot be changed solely by a summarisation result.
- [ ] Summarisation works with one configured local/cloud model or separately assigned task-specific models.
- [ ] The choice between rolling, hierarchical and hybrid summary structures remains a refinement decision, not a settled implementation requirement.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-requested feature direction, explicitly accepted for staging with source provenance, historical-edit invalidation and model-routing flexibility.
- Staging is for refinement; this does not grant production approval or claim implementation.

## Decisions and review history

- 2026-10-19 — **Pass A audit reference correction:** IDEA-0023 and IDEA-0024 were accepted as separate staging ideas after the original summary note. Their detailed functionality is not automatically in IDEA-0022; IDEA-0063 RAG remains unaccepted. No new approval.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Automatic persistent long-term story summaries, source turn/revision tracking, invalidation and rebuilding after historical edits, consistency with authoritative narrative and world state, support for either one model or dedicated task-specific models. Rolling versus hierarchical summaries deliberately left open for refinement. Moved to staging only, not production.

- 2026-10-28 — Explicit user-approved narrative-first declaration in B6-D01 governs any older contradictory mechanical/simulation prose in this staged note. Original decision provenance preserved; no implementation or stage promotion.
