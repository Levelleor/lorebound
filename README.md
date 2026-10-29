# Lorebound

> **The player creates the story. The AI helps keep it consistent.**

Lorebound is a project for player-led, AI-assisted interactive storytelling. Its guiding principle is simple: **the player's imagination comes first.**

**World-state events are a memory of accepted fiction, not a simulation gate.** Lorebound records replayable, declarative facts such as “the key is now in the chest” or “Mara is now in the tower.” It does not require proof that a previous event put the key in Mara's inventory or made travel mechanically possible. If the earlier story changes, later established facts can remain, with unknown origin/details left unknown. Typed event formats, stable IDs, consistent current projections and atomic saving still matter. Optional mechanics can help shape attempted actions before a story turn is accepted, without rewriting or vetoing accepted prose. See the [current narrative-first architecture decision](planning/architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md).

Gameplay rules, maps, and world-state tracking are optional tools to help the AI respect the world and premise the player has established. They are not meant to limit what the player can create. Use a map as a reference, enable movement rules for tighter continuity, or tell a story freely. The goal is to support the player's choices while keeping the narrative and its recorded state coherent.

## Project status

Lorebound is currently in the planning and architecture phase. These are design goals, not claims of implemented features.

## Planning

The project's Obsidian-compatible planning vault lives in [planning/](planning/Start%20Here.md).

Ideas progress from **brainstorming → inbox (unaccepted candidates) → staging → production → implemented specs**.
See [AGENTS.md](AGENTS.md) for agent rules and [planning/Start Here.md](planning/Start%20Here.md) for the human workflow.
