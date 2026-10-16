---
id: "IDEA-0063"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: []
related: ["[[Entity-Based Lorebook]]", "[[Conditional Lorebook Activation]]", "[[Episodic Memory Retrieval]]", "[[Token-Budgeted Context Builder and Inspector]]"]
tags:
  - planning/idea
---
# Embedding-Based Lore Retrieval and RAG Context Selection

## Idea
Automatically find and retrieve relevant Lorebook knowledge for an upcoming generation using embedding models, semantic similarity search, and retrieval-augmented generation (RAG). Inject selected supporting lore into the model context when relevant, instead of requiring the player to select every relevant entry manually.

## Why consider it?
A growing story world may contain too many entries to review for each scene. Automatic relevance retrieval could surface obscure but pertinent characters, locations, facts or connections without consuming the whole context window.

## Rough behaviour
- An optional retrieval pipeline could index Lorebook entries or sections as embeddings and compare them with the current action, scene or task to pick relevant excerpts.
- Relevant excerpts could be ranked, assembled within available context limits, and shown to the player for inspection.
- The system would need to account for changed, deleted or reclassified lore and for uncertainty/rumour labels.
- The player should retain manual context inclusion/exclusion controls under [[Entity-Based Lorebook]], rather than having semantic retrieval silently override those choices.
- This is only a rough possibility; no implementation approach, embedding model, vector store, retrieval algorithm, automation default or configuration UX has been selected.

## Variations and alternatives
- Local embedding models and a locally maintained vector index versus optional remote embedding APIs.
- Semantic search versus keyword/metadata filtering or hybrid retrieval.
- Automatic inclusion versus suggested relevant entries that the player explicitly confirms.
- Retrieve only Lorebook material or extend to events/episodic memories if [[Episodic Memory Retrieval]] is separately accepted.
- The keyword/condition rules proposed under [[Conditional Lorebook Activation]] are a distinct feature, not approval for RAG.

## Open questions and risks
- Must automatic retrieval be strictly opt-in, and should it work completely offline?
- How can RAG work with only one locally loaded generative model? Does it require a separately loaded embedding model or can embeddings be precomputed/served separately?
- How are chunks, embeddings and indexes updated when lore changes, and how are stale matches avoided?
- How do ranking, citation/provenance, relevance thresholds and token budgets interact?
- How should player-pinned or player-excluded material take precedence over automatically retrieved candidates?
- How can false positives, missing facts, contradictory sources and rumours be surfaced or corrected?
- How should model- or provider-dependent embedding costs, privacy and storage limits be handled?

## Evaluation notes
- Origin: **user**. Requested expressly as a **new, unrefined and unaccepted Inbox idea** while accepting IDEA-0020.
- Distinct from IDEA-0020's manually controlled Lorebook context inclusion, IDEA-0021's rule/keyword activation, IDEA-0023's prior-event retrieval and IDEA-0024's context budgeting/inspection.
- No acceptance, staging approval, production approval or implementation is implied.

## Decision history
- 2026-10-16 — **User-requested capture only**, not approval: "log another unrefined unaccepted idea regarding automatically selecting and pulling what needs to be in context by using embedding models and RAGs." Saved in Inbox as a candidate.
