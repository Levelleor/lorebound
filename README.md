# Lorebound

**Try the current checkout:** run `bash scripts/dev.sh`, then open [http://127.0.0.1:8080](http://127.0.0.1:8080). It rebuilds and uses a separate persistent review library; stop with Ctrl+C. [Setup and options](docs/development.md).

**Development status and next task:** [NOW](planning/development/NOW.md) · [development workflow](planning/development/README.md) · [feature coverage](planning/development/FEATURES.md) · [task queue](planning/development/TASKS.md). These own current work, verified scope and remaining implementation. CI owns repeatable checks and execution output; planning keeps decisions and concise PR/run links.

**Read the full [System Architecture Overview](planning/architecture/Lorebound%20-%20System%20Architecture%20Overview.md)** for a self-contained explanation of the player experience, all 52 approved features, twelve subsystem boundaries, AI/Go/SQLite data flows, design style and real implementation status. A short root [ARCHITECTURE.md](ARCHITECTURE.md) also points there. This is the **current architectural entry point**, unlike chronological historical review documents.

**UI design direction:** The finished application is intended to follow the user's approved [Command Citadel visual design reference](planning/design/README.md): warm charcoal/parchment/gold literary reading workspace, compact side rail, docked composer, source OKLCH tokens and responsive layout. The current adventure entry/resume surfaces apply these visual tokens and layout; the Story-only reader and docked composer are added in DEV-002B. Accepted B1–B9/Pass C functionality still governs behaviour.

**Planning update, 2026-11-03:** All 52 explicitly accepted idea notes now reside in `planning/production/`, with no staging notes remaining. [Promotion register](planning/architecture/Pass%20C%20-%20All%20Accepted%20Ideas%20Production%20Promotion%20Register.md). This is implementation readiness, **not completed features or specs**. Gate 0 supplied the verified technical foundation. DEV-002A replaced its test-record surface with real adventure creation/resume; DEV-002B adds the first Story-turn path; merge and verification state are tracked in NOW. Full gameplay remains future development. B9-D12 spatial migrations remain deferred.

**World map design:** The player-facing map is a **persistent, semantically scaled spatial canvas** with saved location pins and nested grouping for empires, cities, buildings and rooms. Relative distances and link lengths should make the fictional world's size understandable. Explicit travel connections also form a logical graph, but the graph does **not** determine the positions or scale of the map. This is an accepted design refinement, **not an implemented feature**. See [B7-D10](planning/architecture/decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md).



> **The player creates the story. The AI helps keep it consistent.**

Lorebound is a project for player-led, AI-assisted interactive storytelling. Its guiding principle is simple: **the player's imagination comes first.**

**World-state events are a memory of accepted fiction, not a simulation gate.** Lorebound records replayable, declarative facts such as “the key is now in the chest” or “Mara is now in the tower.” It does not require proof that a previous event put the key in Mara's inventory or made travel mechanically possible. If the earlier story changes, later established facts can remain, with unknown origin/details left unknown. Typed event formats, stable IDs, consistent current projections and atomic saving still matter. Optional mechanics can help shape attempted actions before a story turn is accepted, without rewriting or vetoing accepted prose. See the [current narrative-first architecture decision](planning/architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md).

Gameplay rules, maps, and world-state tracking are optional tools to help the AI respect the world and premise the player has established. They are not meant to limit what the player can create. Use a map as a reference, enable movement rules for tighter continuity, or tell a story freely. The goal is to support the player's choices while keeping the narrative and its recorded state coherent.

## Project status

Merged main supports blank adventure creation/resume and Story input with explicitly simulated generation, provisional review, acceptance/discard and durable structured history through the real Wails/Go/SQLite application. A small Fork icon beneath each accepted turn also opens an independently copied prefix in a separate browser tab/window, default `fork: [source name]`, preserving the source and its input. Safe recovery, isolated continuation and restart have [scoped evidence](planning/development/evidence/DEV-003B.md). The simulated continuation is a fixed fixture, not a live model. World tracking, map, other input modes and history editing remain later work. See [development setup](docs/development.md), [DEV-002B evidence](planning/development/evidence/DEV-002B.md), and [NOW](planning/development/NOW.md) for tested scope and current development status.

## Planning

The project's Obsidian-compatible planning vault lives in [planning/](planning/Start%20Here.md).

Ideas progress from **brainstorming → inbox (unaccepted candidates) → staging → production → implemented specs**.
See [AGENTS.md](AGENTS.md) for agent rules and [planning/Start Here.md](planning/Start%20Here.md) for the human workflow.
