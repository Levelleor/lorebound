# Lorebound

**Planning update, 2026-11-03:** All 52 explicitly accepted idea notes now reside in `planning/production/`, with no staging notes remaining. [Promotion register](planning/architecture/Pass%20C%20-%20All%20Accepted%20Ideas%20Production%20Promotion%20Register.md). This is implementation readiness, **not completed features or specs**. Gate 0 host/SQLite is the only documented implemented technical foundation, while full gameplay remains future development. B9-D12 spatial migrations remain deferred.

**World map design:** The player-facing map is a **persistent, semantically scaled spatial canvas** with saved location pins and nested grouping for empires, cities, buildings and rooms. Relative distances and link lengths should make the fictional world's size understandable. Explicit travel connections also form a logical graph, but the graph does **not** determine the positions or scale of the map. This is an accepted design refinement, **not an implemented feature**. See [B7-D10](planning/architecture/decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md).



> **The player creates the story. The AI helps keep it consistent.**

Lorebound is a project for player-led, AI-assisted interactive storytelling. Its guiding principle is simple: **the player's imagination comes first.**

**World-state events are a memory of accepted fiction, not a simulation gate.** Lorebound records replayable, declarative facts such as “the key is now in the chest” or “Mara is now in the tower.” It does not require proof that a previous event put the key in Mara's inventory or made travel mechanically possible. If the earlier story changes, later established facts can remain, with unknown origin/details left unknown. Typed event formats, stable IDs, consistent current projections and atomic saving still matter. Optional mechanics can help shape attempted actions before a story turn is accepted, without rewriting or vetoing accepted prose. See the [current narrative-first architecture decision](planning/architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md).

Gameplay rules, maps, and world-state tracking are optional tools to help the AI respect the world and premise the player has established. They are not meant to limit what the player can create. Use a map as a reference, enable movement rules for tighter continuity, or tell a story freely. The goal is to support the player's choices while keeping the narrative and its recorded state coherent.

## Project status

Lorebound has a verified Gate 0 host and test-record SQLite foundation. Story, map and gameplay features remain design goals, not implemented features. See [Gate 0 developer setup](docs/gate0-development.md) and [execution evidence](planning/architecture/Gate%200%20Execution%20Evidence.md).

## Planning

The project's Obsidian-compatible planning vault lives in [planning/](planning/Start%20Here.md).

Ideas progress from **brainstorming → inbox (unaccepted candidates) → staging → production → implemented specs**.
See [AGENTS.md](AGENTS.md) for agent rules and [planning/Start Here.md](planning/Start%20Here.md) for the human workflow.
