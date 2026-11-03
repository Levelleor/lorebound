# Lorebound Architecture

For **current implementation progress**, use the [Development Control Centre](planning/development/README.md) and especially the single [NOW next-task/status page](planning/development/NOW.md) and [52-feature verification ledger](planning/development/FEATURES.md). This architecture entry point defines the app; those documents track actual development and evidence.

**The current single-reference description of Lorebound's entire planned application, subsystem architecture and feature catalogue is:**

**[Lorebound — System Architecture Overview](planning/architecture/Lorebound%20-%20System%20Architecture%20Overview.md)**

Read that document first. It explains the product's player experience, all 52 approved features, twelve subsystem boundaries, browser TypeScript ↔ Wails headless Go ↔ SQLite architecture, AI workflow, acceptance/replay, map, visual design and the verified-versus-planned implementation status.

For detailed implementation rules, follow its links to accepted architecture decisions, individual production ideas, the design kit and actual code/tests. The earlier [Consolidated Subsystem Architecture](planning/architecture/Consolidated%20Subsystem%20Architecture.md) retains valuable *historical consolidation and dated decision context*, but should **not** be read as the most recent operative summary where later B1–B9 or Pass C decisions supersede it.

**Current limits (2026-11-03):** Gate 0 Wails/Go/SQLite foundation is implemented with real integration evidence, but the 52 production-stage feature ideas are not all implemented. The user has explicitly deferred B9-D12 spatial event/schema migration.
