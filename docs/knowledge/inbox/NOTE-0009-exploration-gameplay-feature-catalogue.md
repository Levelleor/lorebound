---
id: NOTE-0009
type: note
status: inbox
source: PRD-0001
related:
- PRD-0059
- PRD-0058
- PRD-0010
- PRD-0057
- PRD-0063
- PRD-0006
- PRD-0026
- PRD-0008
- PRD-0004
- PRD-0003
- PRD-0012
- PRD-0011
- PRD-0056
- PRD-0007
- PRD-0005
- PRD-0009
- PRD-0017
- PRD-0002
---

# Exploration: Gameplay Feature Catalogue

## Discovery

Exploratory history, not project authority. Original session status: **active**. Accepted requirements and decisions take precedence; candidate suggestions remain non-authorizing.

[Pinned source working notes and dated session log](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/brainstorming/Gameplay%20Feature%20Catalogue%20Brainstorm.md)

## Goal
Preserve the complete game-oriented feature wishlist and separate baseline from optional enhancements.

## Context
- Retrospective record of the discussion on 2026-10-16, not implemented functionality or an approved production specification.
- Lorebound Vision Brainstorm contains the overview. User directions and AI suggestions are distinguished below.


## Core interactive adventure
- Free-text player actions; **Do**, **Say**, **Story**, **Continue** modes, plus provider-specific command handling where useful.
- AI acts as narrator/game master for scenes, environments, dialogue, NPCs and consequences.
- Edit player input and AI output directly, including older messages, inline prose, paragraph insertion.
- Retry/regenerate the current response, undo/redo, choose among generated alternatives; avoid implying automatic later-story rewrites.
- First/second/third-person narration choices, generation length, tone, writing style and genre.
- Quick start, opening scenario, freely custom scenario, AI-assisted introduction and choices.
- Character creator: name, species, role/class, biography, starting location, traits, optional stats and custom fields.
- Scenario placeholders/variables, multiple-choice setup, reusable scenario templates/world presets.
- Separate story adventures, load/resume, rename, duplicate and exports; autosave.

## Rich prose authoring
- NovelAI-style text document rather than fixed message bubbles.
- Selection-based generation, rewrite/expand/shorten, alternate continuations, optional branching generation history.
- Author's note and storytelling instructions.
- Presets and advanced sampling controls, token/context inspector and stop sequences.
- Experimental phrase bias/token ban features only if model supports them.
- Clear difference between direct author edits and narratively generated turns.

## Stateful optional gameplay
- Main character and NPC sheets, equipment display and inventory.
- Conditions, stamina, health, relationships, quests, reputation, travel, injuries and custom attributes as optional systems.
- Configurable body-part/anatomy structure, transformations/prosthetics, and mature anatomical fields.
- World hierarchy with interactive zoomable graph, location discovery and meaningful travel edges.
- Optional strict simulation rules for spatial adjacency, capacity limits and equipment compatibility.
- AI can propose state changes; application validates and returns feedback.
- Independent toggles/manual/automatic state tracking for game subsystems.
- No assumption that inventory/dice/combat/quests are standard mandatory AI Dungeon/NovelAI features; these were augmentation ideas.

## Context / memory features
- Permanent context, scenario rules, lore for PCs/NPCs/places/factions/objects, keyword and condition activation.
- Current scene, current known states, recent history, summaries, optional long-term episodic retrieval.
- AI-assisted lore generation, manual correction, context budget inspector.
- Optional task-specific model assignments, while supporting one local model.

## Optional or later gameplay-facing features
- Image generation / 'See' mode; context-based visual prompts; item/anatomy/slot illustrative assets.
- Text-to-speech playback and voice choices.
- Custom gameplay scripts / hooks for input/context/output, persisted plugin state.
- MCP and native tool/mod ecosystem for inventory, combat, magic, economy, survival, world effects, quests.
- More advanced generation branch tree, visual story choices, optional deterministic RPG/dice mechanics.
- UI layout customisation, keyboard shortcuts, accessibility and importer/exporter compatibility.
- Token-use/cost stats, local model status, task routing and debug tooling.

## Explicit exclusions / deferrals
- Multiplayer.
- User authentication/accounts.
- Community sharing, ratings, publishing and social discovery.
- Mandatory full RPG mechanics.
- Automatically rewriting downstream prose after a historical edit and contradiction-flagging UX for preserved text, for this version.
- Requiring multiple simultaneously resident AI models.
- Image-first gameplay; the baseline is textual.

## Candidate phased implementation (AI proposal, not approved roadmap)
**Phase 1:** run a local/cloud model, action modes, prose editor, story saves, simple memory/lore, context and model settings.
**Phase 2:** event log, NPC/character sheets, equipment/inventory, anatomy, map/hierarchy and controlled travel; history reconstruction.
**Phase 3:** robust agent coordinator, multi-tool validation, full context retrieval, native plugin API/MCP, advanced maps/authoring, optional assets and voice.
Dependency ordering may change: stable IDs and events should be architected early, even if user-facing features arrive later.

## Fidelity caveat
This is a design wishlist inspired by the products discussed, **not** a current verified feature parity matrix of those commercial platforms.


## Current Threads
- Prioritise baseline against engine/plugin foundations.
- Clarify exact modes to launch and how direct prose authoring differs from action messages.
- Decide baseline UI layout with story, sheets, lore, map and history panels.

## Decisions
- Single-player gameplay, text-first output and editable history are explicit requirements.
- Multiplayer/community features are excluded from this exploration.
- Optional voice/images and full RPG features are not established near-term commitments.

## Classification

Historical exploration; related product records contain approval and implementation boundaries.
