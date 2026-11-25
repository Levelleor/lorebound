---
id: PRD-0025
type: prd
status: accepted
related:
- NOTE-0034
- PRD-0001
- NOTE-0013
- NOTE-0010
---

# Token-Budgeted Context Builder and Inspector

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0024](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Token-Budgeted%20Context%20Builder%20and%20Inspector.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S09**. First milestone: **M4**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Goals

Build context deterministically from pinned instructions, recent accepted prose and eligible Lorebook/memory/state. Measure actual token budgets, apply clear priorities, make omissions inspectable, and never invent counts or pretend context capacity is known. Current style guidance is not measured context integration.

## Latest accepted event and narrative authority — 2026-10-28

**Current narrative-first context semantics ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Include current **derived state assertions** to aid consistent narration; their job is to **remember the accepted story**, not to retroactively judge it. Earlier accepted events or prose might no longer explain a later item/location fact after historical editing; the latest factual assertion still governs current tracked state. Older retrieved narrative can be labelled contextual/inconsistent but not promoted into overwrite authority. Do not require mechanically “legal” causal chains to include a fact in context.


## Accepted direction
- **Token-budgeted narrator-safe context assembly:** Build prose-generation prompts from instructions, current scene and authoritative state, Lorebook names/descriptions, recent prose, summaries and retrieved memories **without internal stable IDs or raw identity mappings**; retain a separate restricted internal mapping for non-narrating resolution. Respect the selected model's token budget.
- **Model-aware capacity:** Account for the selected model/endpoint's known context limit and reserve space for expected output, required wrappers, tool/response framing or other overhead where applicable. Distinguish reliable known limits from estimates.
- **Configurable priorities:** Allow different sources or categories of information to have priorities or allocations. Preserve essential instructions and authoritative state over lower-priority optional background while clearly reporting any material omission.
- **Three inspectable stages of inclusion:** Explicitly distinguish **requested** material (player/automatic retrieval wants included), **selected** material (the builder chooses within its budget), and **actually transmitted** content (the final provider request after provider-specific transformations and omissions). Do not claim a piece of lore was sent merely because it was requested or initially selected.
- **Context inspector and provenance:** Enable the player to inspect the relevant prompt/context contents and their source entries, story passages, summary/retrieval origin, priorities and estimated or observed token costs where possible. Redact credentials and sensitive connection information.
- **Omission explanations:** Show what was excluded, clipped or shortened and why, including context exhaustion, lower priority, explicit user exclusion, invalid/stale data and model-specific restrictions.
- **Manual include/exclude controls:** Respect player-pinned and explicitly excluded Lorebook or memory material from Entity-Based Lorebook (IDEA-0020) and related manual selection flows. Never automatically override a deliberate exclusion. If a requested/pinned inclusion cannot fit, report the conflict instead of silently treating it as transmitted.
- **Broad retrieval remains possible:** Searching all available committed story history (indexed or direct scan if efficient) remains a valid avenue under Episodic Memory Retrieval (IDEA-0023). **The retrieval search scope and the final AI prompt size are separate:** Lorebound may search the entire local archive, then inject only the most relevant source excerpts into the context budget. Do not preclude wide-history search due to a small generation context window.
- **No fixed allocation policy yet:** Exact budget divisions, clipping strategy, tokenizer integrations, cost/performance trade-offs and priority defaults remain open for refinement.
- **No implicit embeddings approval:** Semantic retrieval/RAG is tracked separately as unaccepted Embedding-Based Lore Retrieval and RAG Context Selection (IDEA-0063).

## Dependencies and constraints
- Builds on accepted Entity-Based Lorebook (IDEA-0020), Conditional Lorebook Activation (IDEA-0021), Automatic Long-Term Story Summaries (IDEA-0022) and Episodic Memory Retrieval (IDEA-0023).
- Depends on connector/model profiles, generation pipeline strategy and model capability information (IDEA-0012 to IDEA-0019) to identify context limits, output reservations, wrapper overhead and final provider request behaviour.
- The canonical world state is authoritative; retrieved or summarised narratives must not override validated state, and obsolete/invalidated history must not re-enter effective context as established fact.
- Manual exclusion takes precedence over automatic inclusion; attempted user-pinned inclusion must be reported when technical capacity makes it impossible, with a policy for resolving hard conflicts still to be refined.
- A broad local search over all committed history does **not** mean sending all of that history to the model. Compare full-history and narrower search for recall, local retrieval latency and context-token savings without promising cost reductions before evidence.
- Providers may tokenize differently or hide internal overhead. Token counts and actual transmitted prompts must distinguish exact measurable values, estimates and information unavailable through provider APIs.
- Context previews, request inspection and logs must never leak API keys, tokens, secret headers or sensitive connection details.
- This idea does not independently approve embeddings or semantic RAG (unaccepted IDEA-0063), or imply any current implementation.

## Open questions
- How accurately can token usage be counted for heterogeneous local/cloud models and provider-specific request templates?
- What should be the precedence for system/safety constraints, game rules, current validated state, player-pinned items and optional background lore?
- What happens if several explicitly pinned entries cannot all fit within the available input budget?
- Should priorities, reservations and category quotas be set globally, per adventure, per task, or per generation?
- How are over-budget entries trimmed, summarized, split or rejected without changing their meaning?
- How should the inspector compare requested, selected and transmitted content when the provider applies hidden templates or transformations?
- How can source links and revision IDs make every automatically included memory or lore segment inspectable and traceable?
- What UI best explains confidence in token estimates and estimated savings without making false claims?
- How should all-history retrieval and context assembly coordinate to maximize recall while minimizing prompt size and latency?

## Draft acceptance criteria
- [ ] For every AI narration turn, the context builder includes the applicable current adventure style settings and persistent author-note instructions in the candidate/effective request context without a separate narration-style preset source or repeated player text entry.
- [ ] The inspector distinguishes instructions requested from those actually sent, surfacing capacity-driven omission/truncation rather than falsely asserting that absent notes were delivered.
- [ ] Context is assembled from appropriate instructions, current scene/state, recent prose, Lorebook, summaries and retrieved memories against a configurable or model-derived budget.
- [ ] The builder accounts for model-specific context limits, output-token reservation and relevant request overhead as far as reliably known.
- [ ] Players can inspect **requested**, **selected**, **omitted/truncated** and **actually transmitted** context material, with clear distinctions among them.
- [ ] Included or excluded entries show source references and explanations for selection, priority and omission where available.
- [ ] Explicit player exclusions are honoured, and impossible pinned inclusions produce visible warnings rather than silent omissions.
- [ ] Canonical world-state/instruction material is not silently supplanted by lower-priority, derived or stale memories.
- [ ] Broad all-history retrieval remains compatible with selective final context inclusion; the complete searchable corpus is not automatically sent to the LLM.
- [ ] Token displays distinguish measured counts, estimates and values unknown for the active provider.
- [ ] Context previews and diagnostics redact credentials and other secret connection details.
- [ ] The token-budgeting design can work without an embedding model or RAG implementation.

## Supporting detail

See [NOTE-0034](../knowledge/inbox/NOTE-0034-prd-0025-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
