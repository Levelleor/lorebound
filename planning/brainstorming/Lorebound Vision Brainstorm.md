---
type: brainstorm
status: active
mode: autonomous
topic: "Overall product vision and brainstorm index"
goal: "Preserve the product concept, boundaries, choices, and links to all domain brainstorms."
created: 2026-10-16
updated: 2026-10-16
sources: []
outputs: []
tags:
  - planning/brainstorm
  - planning/vision
---
# Lorebound Vision Brainstorm

## Goal
Preserve the product concept, boundaries, choices, and links to all domain brainstorms.

## Context
- Retrospective consolidation of the project-design conversation through 2026-10-16. This records wishes, proposals, trade-offs, and open questions; it is **not** an implementation specification or approval to ship.
- Repository guidance: [[Start Here]] (in the planning vault) and the repository AGENTS.md. No application functionality is asserted as implemented.
- Terminology: **User direction** = explicitly expressed preference; **AI possibility** = suggested but not selected; **Open** = requires a design decision.

## Product hypothesis
Lorebound is envisioned as a **single-user, text-first AI interactive fiction and roleplay application** combining AI Dungeon-style freeform gameplay with NovelAI-style editable prose, structured context control, persistent world state, and an extensible game capability system. It should accommodate creative RP without making a tabletop-style RPG compulsory.

The narrator generates literature; the deterministic engine owns accepted world facts; a coordinator reconciles proposed operations with narrative output. One locally loaded model must be a first-class configuration. Do not assume strict simulation can be made infallible.

## User directions expressed in conversation
- **Exclude multiplayer and account authentication.** The app is local-first and usable via localhost.
- **Support cloud and locally hosted LLMs**, specifically Gemini, OpenAI, Anthropic, OpenRouter, Mistral, DeepSeek, GLM, Kimi, plus configurable local endpoints.
- **Expose model sampling and generation controls** with awareness of model-specific support.
- **Keep story, memory, character state, equipment, world state, and narrative history separate**, while assembling relevant portions into LLM context.
- **Every character, not only the player, has persistent state, inventory, equipment and (optionally) anatomy.**
- **Add a world/location graph and zoomable nested map**; NPCs have actual locations and should not materialise uninvited in the current scene.
- **Allow text edits anywhere in prior prose.** For this version, players fix continuity themselves or delete later turns in bulk. Do NOT add automatic continuation regeneration or contradiction-flagging flows.
- **Do not rebuild immediately on each historical edit.** Ask the player to apply edits and choose whether to keep or truncate later turns first.
- **Support mature-story toggles and optional detailed anatomy**, while general injuries/transformations do not require the mature toggle.
- **Keep game changes validated**. The interpreter may propose mutations; the engine commits only valid events and reports rejection reasons.
- **Minimise concurrently hosted local models.** The same model can perform narration and structured interpretation in successive calls.
- **Write these ideas into brainstorming only**, not implementation-ready requirements.

## Topic index
- [[Story Editing and Event Timeline Brainstorm]]: editable narrative, draft revisions, event sourcing, checkpoints and bulk deletion.
- [[LLM Providers and Generation Brainstorm]]: remote/local providers, model settings, task profiles, prompt strategies.
- [[Coordinator Tools and MCP Brainstorm]]: validation, narrator/interpreter split, plugin actions, error loops.
- [[World Map and Location Rules Brainstorm]]: hierarchy, travel graph, NPC presence, zoom canvas.
- [[Characters Inventory Equipment and Anatomy Brainstorm]]: sheets, inventory ownership, anatomy, mature options.
- [[Memory Lorebook and Context Brainstorm]]: summaries, memories, lore activation, context allocation.
- [[Local First Storage and Deployment Brainstorm]]: browser storage, OPFS/SQLite, backups, localhost, optional bridge.
- [[Gameplay Feature Catalogue Brainstorm]]: detailed AI Dungeon/NovelAI-inspired capabilities and tentative roadmap.
- [[Naming Licensing and Open Questions Brainstorm]]: naming ideas, licensing implications and cross-cutting questions.

## Proposed architectural boundaries (AI possibilities, not decisions)
1. **Story editor** owns editable blocks, author revisions and generation history.
2. **Timeline/event store** owns valid historical state transitions, branches/checkpoints and replay.
3. **Entity/world services** own characters, objects, locations, relationships, anatomy, equipment and possession.
4. **Memory/context builder** creates model inputs from recent prose, summaries, lore and current state.
5. **LLM adapter/router** selects cloud or local models, handles parameters and streaming.
6. **Adventure coordinator** orchestrates interpretation, validation, tool results, narration, corrections and commit.
7. **Capability/plugin registry** standardises game operations; an MCP adapter can expose external tools.
8. **Persistence and UI** remain browser-led with an optional local transport/credential bridge.

## Out of scope or deferred
- Multiplayer and user authentication are excluded.
- Automated narrative continuation regeneration after editing older text, and automatic contradiction repair for preserved later turns, were explicitly removed from the near-term direction.
- Native image-based gameplay is not required for the text-first core. Optional anatomy slot art, story images, TTS and richer content are future candidates.
- A full deterministic combat/RPG ruleset is optional, not a prerequisite.
- No licence has been selected in this brainstorm; repo licensing must be reviewed independently.

## Product risks
- Narrative prose can assert an event that a deterministic tool rejects.
- An interpreter can miss implied changes even with valid JSON outputs.
- One-model support avoids extra VRAM but not additional inference latency.
- Early story edits can affect summaries, map discoveries, item ownership and NPC whereabouts far downstream.
- Browser data loss and direct API CORS/security constraints must be designed around.
- Extensible mods can disagree unless all authoritative state changes use shared contracts.


## Session Log
- 2026-10-16 — **User idea:** Recreate the essential single-player AI Dungeon and NovelAI experience.
- 2026-10-16 — **User direction:** Drop multiplayer/auth; add extensive local/remote model choice and configurable parameters.
- 2026-10-16 — **User idea:** Add persistent character, equipment, anatomy, NPC and world/location state.
- 2026-10-16 — **User direction:** Keep historical edit handling simple: manually fix later prose or truncate it; defer reconstruction until confirmation.
- 2026-10-16 — **User idea:** Allow gameplay extensions and MCP tools, while keeping local one-model hosting viable.
- 2026-10-16 — **AI possibility:** Event sourcing, deterministic coordinator, tool validation, plug-in registry, local browser storage, optional Node bridge.
- 2026-10-16 — **Question:** Which narrative/planning/verification strategy balances freeform RP and consistency best?

## Current Threads
- Choose the minimal product slice and the initial narration-validation protocol.
- Decide how strict state tracking should be by default and how many LLM calls a turn can tolerate.
- Choose portable local storage/backups and an optional bridge boundary.
- Determine how proposed plugin capabilities and schemas evolve safely.

## Decisions
- The user explicitly rejected multiplayer and application authentication.
- The user explicitly requested local and public/cloud LLM support with model configuration.
- The user explicitly chose an editable narrative with no automated downstream prose regeneration/contradiction system in this version.
- The user expressly favoured character/equipment/world state, including NPC state and mod-friendly tool validation.
- The name **Lorebound** is reflected in the created repository; earlier naming alternatives are archived as ideas, not marked selected by a formal vote.
- These are conversational directions, **not** staging/production approval.

## Outputs
- None. No idea has been promoted to staging or production by this documentation request.

## Resume Here
Review [[Coordinator Tools and MCP Brainstorm]] and [[World Map and Location Rules Brainstorm]] together, then select a single-model baseline and a minimal commit protocol. No staged ideas yet.
