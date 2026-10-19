---
id: "IDEA-0024"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Memory Lorebook and Context Brainstorm]]", "[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Token-Budgeted Context Builder and Inspector

## Idea
Allocate context among instructions, scene, lore, state, memories and recent prose, and let the player inspect it.

## Why this idea matters
Overlong prompts harm model quality and can exceed limits.

## Accepted direction
- **Token-budgeted context assembly:** Build the generation prompt from instructions, current scene and authoritative state, relevant Lorebook entries, recent narrative prose, long-term summaries, and retrieved episodic memories while respecting a finite input-token budget.
- **Model-aware capacity:** Account for the selected model/endpoint's known context limit and reserve space for expected output, required wrappers, tool/response framing or other overhead where applicable. Distinguish reliable known limits from estimates.
- **Configurable priorities:** Allow different sources or categories of information to have priorities or allocations. Preserve essential instructions and authoritative state over lower-priority optional background while clearly reporting any material omission.
- **Three inspectable stages of inclusion:** Explicitly distinguish **requested** material (player/automatic retrieval wants included), **selected** material (the builder chooses within its budget), and **actually transmitted** content (the final provider request after provider-specific transformations and omissions). Do not claim a piece of lore was sent merely because it was requested or initially selected.
- **Context inspector and provenance:** Enable the player to inspect the relevant prompt/context contents and their source entries, story passages, summary/retrieval origin, priorities and estimated or observed token costs where possible. Redact credentials and sensitive connection information.
- **Omission explanations:** Show what was excluded, clipped or shortened and why, including context exhaustion, lower priority, explicit user exclusion, invalid/stale data and model-specific restrictions.
- **Manual include/exclude controls:** Respect player-pinned and explicitly excluded Lorebook or memory material from [[Entity-Based Lorebook]] (IDEA-0020) and related manual selection flows. Never automatically override a deliberate exclusion. If a requested/pinned inclusion cannot fit, report the conflict instead of silently treating it as transmitted.
- **Broad retrieval remains possible:** Searching all available committed story history (indexed or direct scan if efficient) remains a valid avenue under [[Episodic Memory Retrieval]] (IDEA-0023). **The retrieval search scope and the final AI prompt size are separate:** Lorebound may search the entire local archive, then inject only the most relevant source excerpts into the context budget. Do not preclude wide-history search due to a small generation context window.
- **No fixed allocation policy yet:** Exact budget divisions, clipping strategy, tokenizer integrations, cost/performance trade-offs and priority defaults remain open for refinement.
- **No implicit embeddings approval:** Semantic retrieval/RAG is tracked separately as unaccepted [[Embedding-Based Lore Retrieval and RAG Context Selection]] (IDEA-0063).

## Proposed behaviour
For each generation, resolve the active model's known input capacity, output reservation and any required overhead; build a list of candidate context sections from user requests, the current scene, canonical world state, recent prose, chosen Lorebook entries, summaries and recalled incidents. Apply manual exclusions and forced/pinned requests, then prioritize and size compatible content without silently dropping critical state. Present an inspectable trail of requested, selected, omitted/truncated, and final transmitted context including source IDs and model-aware token estimates. Permit broad all-history retrieval as an upstream candidate-selection operation where performance justifies it, while transmitting only budget-fitting relevant excerpts. Respect provider transformations and reveal the actual effective request where technically observable, redacting secrets.

## Alternatives and trade-offs
Automatic priority-based selection can reduce repetitive setup, while manual inclusion/exclusion gives players reliable control over important lore and memories. A wholly manual context list may become burdensome on long stories; an opaque fully automatic assembler may hide why facts were missed. The accepted direction combines manual override, automated budget assembly, and a transparent inspector. Budgeting can be based on provider token counters, locally available tokenizers or approximate estimators, with confidence made visible. Fixed category quotas, dynamically allocated shares and hierarchical trimming are alternatives for later comparison.

## Include current story settings and author notes on each AI narrative turn
- **Accepted IDEA-0010 user change (2026-10-18):** Each AI **narrative generation turn** resolves the adventure's **currently applicable narration settings** and **persistent author notes** (IDEA-0025) as request-context instruction sources. These may have started as **scenario-template input** (IDEA-0008), but are now adventure-owned/current values, not a live reference to a separate style preset. Players do not need to restate persistent writing guidance in every prompt.
- **Every turn, budget honestly:** Include applicable notes/settings in the context selection and assemble what can actually be sent subject to model size, required world-state context and existing priority policies. An omitted/truncated note is **reported explicitly** in the context inspector or generation feedback, not silently presented as if the model received it. The exact priority and fallback when required instructions exceed available capacity remain for further refinement; this decision does not pretend unlimited model context.
- **Authority remains clear:** Narration notes/settings guide **presentation** and may not replace current canonical world state or turn a speculative note into a factual event. User-authored Story-mode state changes still use their separately accepted authorial commit path (IDEA-0002), not an unchecked model instruction.
- **No style preset source:** No separate named narration-style preset selection/serialization, inheritance or import/export is in accepted scope. Technical model sampling presets (IDEA-0016) remain provider request parameters, outside the narration-context instruction layer.

## Dependencies and constraints
- Builds on accepted [[Entity-Based Lorebook]] (IDEA-0020), [[Conditional Lorebook Activation]] (IDEA-0021), [[Automatic Long-Term Story Summaries]] (IDEA-0022) and [[Episodic Memory Retrieval]] (IDEA-0023).
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- Explicitly accepted for **staging/refinement**, not production or implementation. Algorithmic and tokenizer details remain to be evaluated.

## Decisions and review history
- 2026-10-18 — **Accepted IDEA-0010/0025 instruction-context refinement:** Every AI narrative turn assembles current narration settings and applicable persistent author notes, including directions originally provided by an optional scenario template. No reusable narration-style preset manager. Respect finite context budgets and clearly expose material omissions. Staging only.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Token-budgeted context assembly, model-aware capacity limits, priorities, requested/selected/actually-transmitted inspector, omission explanations, source references, manual inclusion/exclusion, and preserving broad full-history retrieval as an upstream option while only relevant excerpts enter the final prompt. Moved to staging for refinement only, not production.
