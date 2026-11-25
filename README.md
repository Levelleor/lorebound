# Lorebound

> **The player creates the story. The AI helps keep it consistent.**

Lorebound is a local, single-player workspace for player-led interactive storytelling. Optional maps, gameplay rules and world-state tracking help the AI respect the player's established fiction without limiting what the player can create.

World-state events are a memory of accepted fiction, not a simulation gate. Replayable facts record what is true now, even when the earlier story did not explain how it happened. Typed events, stable IDs, consistent projections and atomic saving still matter. Optional mechanics can shape attempted actions before acceptance, but do not veto or rewrite accepted prose.

**Try the current checkout:** run `bash scripts/dev.sh`, then open [http://127.0.0.1:8080](http://127.0.0.1:8080). This rebuilds the app and uses a separate persistent review library; stop with Ctrl+C. See [development setup and current behavior](docs/development.md).

**Development:** [project context](docs/project.md) · [conventions](docs/conventions.md) · [product and roadmap](docs/product/README.md) · [architecture decisions](docs/decisions/README.md). Use `agentctl work list`, `agentctl knowledge list` and `agentctl verify`; [AGENTS.md](AGENTS.md) is the operating protocol.
