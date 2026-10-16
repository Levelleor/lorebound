---
type: brainstorm
status: active
mode: autonomous
topic: "Lorebook, context assembly, long-term memory and summaries"
goal: "Maintain continuity without sending complete adventure history every turn."
created: 2026-10-16
updated: 2026-10-16
sources: []
outputs: []
tags:
  - planning/brainstorm
  - planning/memory
---
# Memory Lorebook and Context Brainstorm

## Goal
Maintain continuity without sending complete adventure history every turn.

## Context
- Retrospective record of the discussion on 2026-10-16, not implemented functionality or an approved production specification.
- [[Lorebound Vision Brainstorm]] contains the overview. User directions and AI suggestions are distinguished below.


## Distinct sources of context
1. Permanent story instructions, world rules, author note and writing preferences.
2. Current scene: location, nearby characters/objects and valid exits.
3. Character/NPC sheets: current stats, conditions, equipment, anatomy where toggled on, and relevant relationships.
4. Lorebook: stable character biographies, species, settings, factions, locations, objects, abilities and histories.
5. Recent prose/turns, selectively preserved verbatim.
6. Summaries of older story arcs.
7. Retrieved episodic memories/earlier events, possibly using embedding similarity.
8. Validated current world state, travel constraints and relevant tool capability descriptions.

## Lorebook
- Multiple entry types, particularly **NPCs and player characters** in addition to world/place/item entries.
- Stable entity IDs and links to mutable character/location/item records. Do not duplicate a character's current inventory in biography.
- Keyword, alias and optional conditional activation. Potential activation by current location, present character, relationship, explicit mention or semantic relevance.
- User-editable entries, optional AI-assisted generation, import/export, grouped entry organisation, prioritisation and placement.
- Model should be able to *refer to* remote characters as background but not treat them as physically present.
- Configurable activation budget, disabled entry options and manual priority overrides.

## Summarisation
- Save full historical text on disk regardless of prompt window.
- Run dedicated summarisation task (which can reuse **one locally loaded model**) when reaching a token/story-length threshold, rather than at every turn.
- Hierarchical summaries (scene, chapter, adventure) and episodic memories are possible future optimisations.
- Summaries are derived caches with provenance of their source blocks, time range and model/profile; they must be invalidated/rebuilt after relevant old edits.
- Summariser should distinguish rumours, intentions, failed attempts and completed events so it does not canonise false outcomes.

## Prompt/context builder
- Track token budgets for instructions, author note, recent history, scene/world state, lore, summaries, tool constraints and generation headroom.
- Select lore based on keywords/entity IDs/scene relevance, and do not add every character every turn.
- Support per-adventure and per-model context presets, actual model context limit and overhead estimation.
- Context inspector exposes actual prompt sections, which entries activated, estimated tokens and omissions.
- Leave disabled optional tracking systems entirely out of model context.
- Prompt-order/priority should be configurable, but advanced fine control can be deferred.

## Distinctions and tradeoffs
- **Authoritative events** determine accepted factual changes; summaries and prose are not themselves authoritative inventory/location truth.
- Narration may freely describe objects and details without structured events in casual mode; strict tracking entails more interpretation.
- Embedding retrieval is optional; keyword/event-index retrieval offers a cheap offline baseline.
- Automatic story-card generation may require extra inference and editing safeguards.
- Context size, local processing speed and recency/relevance compete for the same token budget.

## Further ideas discussed
- Reusable scenario world presets and character templates.
- Separate models for narration, summary, memory extraction (optional), with one-model fallback.
- User can inspect and manually correct generated summary and lore entries.


## Session Log
- 2026-10-16 — **User direction:** Separate information and perform summarisation independently for consistency.
- 2026-10-16 — **User idea:** Include character/equipment sheets in context, configurable as disabled.
- 2026-10-16 — **User direction:** Lorebook includes all characters, not merely player and abstract world entries.
- 2026-10-16 — **AI possibility:** Activate scene-specific lore, summarise old turns, retrieve relevant events and inspect prompt budget.

## Current Threads
- Choose summarisation thresholds and invalidation strategy.
- Compare keyword vs semantic retrieval in local-first baseline.
- Define conflict precedence across narrative, lore, state and manually edited data.

## Decisions
- Independent summary and character/equipment/world information are user-favoured.
- Lorebook includes NPC biographies and locations, connected to their current state.

## Outputs
- None. Nothing promoted to staging or production.

## Resume Here
Sketch a full prompt assembled at an inn with nearby NPCs, absent NPC background knowledge, inventory constraints and an old chapter summary.
