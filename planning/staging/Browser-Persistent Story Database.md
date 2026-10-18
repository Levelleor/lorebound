---
id: "IDEA-0051"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Local First Storage and Deployment Brainstorm]]", "[[Story Editing and Event Timeline Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Browser-Persistent Story Database

## Idea
Choose and refine **one shared filesystem-backed SQLite database for the entire Lorebound adventure library**, accessed through Wails v3/Go services, as canonical persistent storage for the headless localhost server and normal-browser frontend. The earlier browser-only/server/hybrid comparison has been superseded by the user's 2026-10-17 explicit runtime/storage decision. Exact schema, platform-specific path resolution implementation, safe custom-directory changes, migration, import/export format and performance policies remain for refinement.

## Why this idea matters
The product must reliably store substantial adventures with many story turns, revisions, entities and complete incremental changes. The selected Wails v3 headless Go localhost service provides one filesystem-backed SQLite database boundary for the normal-browser frontend. The remaining challenge is durable transactions, consistent history, migration, recovery and export/import, not deciding whether the browser or a Node/SvelteKit server owns canonical saves.

## Accepted direction
- **One SQLite database for the entire library (explicitly chosen):** Use **one shared SQLite database file**, provisionally referred to as `lorebound.db`, for **all adventures** and their associated canonical narrative text, revisions, events, entities, world state and durable plugin records. The filename is illustrative; the **default parent directory is now selected** below, while the final filename and path resolution implementation remain open. Go/Wails owns reads, writes, migrations and transactions. Do **not** create one database file per adventure or a separate `library.db` plus adventure databases.
- **One headless runtime:** Wails v3's localhost Go server serves the SvelteKit frontend to the normal browser and exposes Go persistence services. No separate native window/WebView or Node/SvelteKit SSR player server.
- **Logical adventure isolation within the shared database:** Each adventure's story and world history must remain separate through durable adventure identity and appropriately scoped queries, writes, deletes, duplication and imports. Schema/table shapes, referential-integrity constraints and IDs still need detailed design. Cross-adventure data must not leak accidentally.
- **No browser-owned canonical saves:** Browser localStorage, IndexedDB, SQLite WASM/OPFS and browser quotas are not authoritative adventure storage. UI preferences or disposable caches may be browser-scoped without violating this decision.
- **Atomic history:** A committed turn, versioned prose and accompanying canonical events/state must be durably committed together or not at all. Concurrency control must prevent stale browser tabs or simultaneous clients from overwriting one another.
- **SQLite-backed import/export:** An individual-adventure export must select **only that adventure and its complete dependent story/world history** from the shared database rather than simply copying the library database. Full-library backup/export can preserve the entire shared database with a consistency-safe snapshot or another validated format. Final container/encoding, schema versioning, migrations, integrity checks and backup procedures remain separate questions (IDEA-0005 and IDEA-0052).
- **Default data directory (explicitly accepted):** Resolve Lorebound's **per-user OS application-data directory** as the normal location for the single shared SQLite library, **not** the directory containing the executable or an ephemeral working directory. Illustrative default paths: **Windows** `%APPDATA%\\Lorebound\\lorebound.db`; **macOS** `~/Library/Application Support/Lorebound/lorebound.db`; **Linux** `${XDG_DATA_HOME:-~/.local/share}/Lorebound/lorebound.db` (honour `XDG_DATA_HOME` when set). The database filename is provisional and the exact platform-specific resolution code is not yet chosen.
- **Optional user-selected data directory (explicitly accepted):** Allow a **custom directory** for the persistent SQLite library, e.g. a portable installation or alternate drive. Go resolves and accesses this path, subject to filesystem permission and safety checks; the browser must not gain arbitrary filesystem access. The user-facing configuration mechanism, how existing data is moved/validated, and recovery if a chosen path is unavailable remain undecided.
- **Companion files and durability:** When SQLite uses WAL or similar journaling, companion files may appear beside the selected `lorebound.db`; these are **not separate adventure databases** and must be handled correctly by backup/move/shutdown mechanisms. Headless executable upgrades must leave the chosen data location intact.
- **Go is a persistence boundary, not a parallel game engine:** The coordinator, validators and gameplay plugins remain frontend TypeScript (IDEA-0044/0047/0055). Go validates data/service requests for safety, expected versions and transaction integrity; it must not blindly permit conflicting durable writes.
- **Selected architecture is staging direction only:** This does not assert SQLite tables, a driver, an export file layout or an implemented database already exists.

## Historical storage alternatives (superseded)
**Historical alternatives, superseded by explicit user choice on 2026-10-17:** Browser localStorage, IndexedDB, SQLite WASM/OPFS, SvelteKit server SQLite, hosted PostgreSQL and hybrid sync were considered while the storage direction was undecided. None are now selected as alternate canonical stores for initial Lorebound. They may be reconsidered only through a later explicit decision; the current architecture is **Go/Wails + filesystem SQLite**.

## Proposed behaviour
The player's SvelteKit/Svelte UI and browser-side TypeScript game logic request durable records through Go/Wails service bindings. Go stores adventures and all canonical state/history in a persistent local SQLite database and returns typed data to the frontend. Atomic commit operations verify the **target adventure's** expected revision, then persist that adventure's accepted text revisions/events/state records in one SQLite transaction, with a recoverable failure on conflict or disk errors. Every adventure lives in the **same physical database**, without sharing its individual canonical narrative/world state. The sole headless localhost server uses this architecture. Export/import operate over complete, validated persisted adventures via Go; their exact portable encoding remains to be decided.

## Alternatives and trade-offs
- **Selected single-file SQLite/Go:** One SQLite database simplifies library-wide enumeration, migrations, indexing and consistent full-library backups; it allows atomic multi-table updates with no separate SQL server. It increases the importance of adventure-ID scoping, database-wide failure recovery, careful concurrent readers/writers, WAL/checkpoints and space management.
- **Browser IndexedDB/OPFS and hybrid sync:** Not selected for canonical saves. Avoids a headless Go server in browser-only hosting but conflicts with the accepted single filesystem persistence model.
- **Node/SvelteKit server SQL:** Not selected because the headless web entry point is Wails v3's Go HTTP server.
- **Hosted SQL/remote multiplayer:** Not selected; app stays single-user/local-first. Remote server deployment and authentication are separate, unapproved concerns.
- **Rejected per-adventure physical databases:** Separate SQLite files per adventure plus a central `library.db` index are **not selected**. Each adventure remains a logical partition within the one database, not its own `.db` file.
- **Export design:** Copying the entire shared SQLite database is **not** an individual-adventure export. A raw live SQLite file copy may also be inconsistent (e.g., with WAL); compare safe SQLite backup/snapshot APIs for the library and a filtered, complete logical export for one adventure under IDEA-0052.

## Dependencies and constraints
- User selected Wails v3 headless localhost only in [[Localhost Startup and Offline Mode]] (IDEA-0053), packaged into Windows/macOS/Linux server executables. The headless mode requires a running Go process but not Node SSR.
- [[Snapshots and Incremental State Rebuild]] (IDEA-0042), [[Event-Sourced World History]] (IDEA-0039) and [[Versioned Text Blocks and Revision IDs]] (IDEA-0040) require full durable reconstructibility at supported history points.
- [[Deterministic Adventure Coordinator]] (IDEA-0044) prepares validated results in browser-side TypeScript, but the Go/SQLite boundary must guarantee transactional, version-consistent writes and reject stale commits; server mode may have multiple tabs/clients.
- [[Adventure Save and Export Management]] (IDEA-0005) and [[Backups Export and Storage Quotas]] (IDEA-0052) are **already accepted staging ideas** and define the later full-fidelity portability/backup requirements. Their single-adventure exports must extract correctly scoped records from the shared library; library backups must preserve the shared SQLite database consistently. Neither an export container nor the schema is selected here.
- No browser-origin storage, external cloud database or inference process is mandatory. Sensitive model API credentials must not enter adventure saves or exports.
- This is staging refinement, not final schema implementation or production approval.

## Open questions
- What precise Go path-resolution mechanism should select the accepted OS per-user app-data directory, and how will users select, validate and safely switch to a custom location?
- What SQLite driver, connection pool, WAL, busy timeout, transaction and durability settings suit **one library database** with large adventures and multiple browser tabs?
- What concurrency model or expected-revision token lets Go reject stale writes from multiple tabs/clients without duplicating TypeScript gameplay rules?
- How are schema migrations, app downgrades, corruption detection, crash recovery, backups and user-visible failures handled?
- How should one-adventure logical exports and entire-library SQLite snapshots/archives be packaged, validated, imported and reconciled with pre-existing adventure IDs?
- How do database records cover every persistent gameplay plugin field, including disabled/removed plugins, without unreplayable state?
- What benchmarks ensure history replay/queries and large write batches keep the UI responsive?

## Draft acceptance criteria
- [ ] The Wails v3 headless localhost server uses filesystem-backed SQLite via Go services and serves the game to normal browsers.
- [ ] No canonical adventure, text revision or world event requires browser localStorage/IndexedDB to survive closing, restarting or switching views.
- [ ] All accepted state mutations and story revisions are persisted durably and are fully reconstructible at supported history boundaries.
- [ ] Go commits a complete accepted turn atomically and rejects stale/conflicting writes; failed writes leave prior canonical state unchanged.
- [ ] **One shared SQLite database file** holds the adventure library; no per-adventure database files or separate library-index database are required.
- [ ] Independent adventures are logically isolated by stable identities and scoped operations; renaming, editing, deleting, importing or duplicating one does not unintentionally alter any other.
- [ ] A one-adventure export contains that adventure's complete relevant records without requiring the player to export the entire shared library.
- [ ] By default the library resides in the OS's **per-user application-data location** (Windows `%APPDATA%`, macOS `~/Library/Application Support`, Linux `XDG_DATA_HOME` or `~/.local/share`) rather than beside the executable.
- [ ] A user can select an optional **custom data directory** and continue using the shared library there without truncation, accidental duplicate libraries or silent data loss.
- [ ] SQLite data, including any required journal/WAL companion files, survives normal app upgrades and headless restarts; migration and interrupted-write recovery are tested.
- [ ] Export/import and backups preserve validated complete history, including plugin data, without secrets or accidental side-effect replay.
- [ ] Exact path resolution, custom-directory switching/migration, schema, SQLite driver, snapshot/backup method and relevant performance thresholds are resolved before promotion.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Browser-local persistence came from the original brainstorm; the user clarified an intended SvelteKit framework and requested comparison of browser, backend and optional hybrid databases, then **explicitly accepted the options-first direction for staging**.
- Earlier staging acceptance had **not** selected an engine or location; these were **subsequently decided** on 2026-10-17: Go-managed filesystem SQLite, one shared library database, and OS per-user app-data default with optional custom data directory. Synchronisation, exact implementation and production readiness remain open.

## Decisions and review history
- 2026-10-17 — **Explicit accepted IDEA-0051 location refinement:** The requesting user agreed to the OS's **per-user application-data directory as the default** for the one shared SQLite database, with a **user-selectable custom data directory** (portable installation, alternate drive, etc.). Examples: Windows `%APPDATA%\\Lorebound`, macOS `~/Library/Application Support/Lorebound`, Linux `XDG_DATA_HOME/Lorebound` (fallback `~/.local/share/Lorebound`). Companions such as SQLite WAL files may share the directory. Path-resolution implementation, safe relocation/migration and configuration UI still require refinement. The note stays in staging, not production.
- 2026-10-17 — **Explicit layout refinement accepted by the requesting user (Option A):** Use **one shared SQLite database for all adventures** within the single Wails v3 headless Go server runtime. Adventures remain **logically isolated within that file**; do not select separate `.db` files per adventure or a `library.db`/per-adventure file split. Exporting one adventure will require extracting its complete scoped data; whole-library backup needs a consistent database backup/portable export. This approves **the database organisation only**, not exact tables, the portable export format, driver, filesystem path or production promotion.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Explicit architecture refinement accepted by the requesting user:** Use Wails v3 both as desktop app and headless localhost Go browser server, with **SQLite on the host filesystem** accessed through Go services for all canonical saves and import/export. Do **not** use browser-owned storage for durable adventures; game rules and plugins remain client TypeScript. This overrides the previously undecided storage-options comparison without selecting export file format, specific SQLite driver or database schema. Staging only, not production approval.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate** initially oriented toward browser-local databases.
- 2026-10-16 — **User clarification during Inbox review, not acceptance:** Record localStorage, persistent browser storage, IndexedDB, SQLite WASM + OPFS and SvelteKit server-backed database possibilities, including an easy-to-host backend database if appropriate. The user specified **SvelteKit** as the application framework and does not want browser-only storage prematurely locked in. Expanded the candidate to compare browser-local, backend and optional hybrid models, keeping storage engine, primary source-of-truth and deployment open. **At that time**, the note remained a candidate in Inbox.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Stage IDEA-0051 as a **storage-options-first** design direction using SvelteKit, comparing browser `localStorage`, IndexedDB, SQLite WASM + OPFS, browser persistence permissions, SvelteKit server-side SQLite, hosted SQL and optionally hybrid persistence. Require deterministic **complete incremental reconstruction** and coherent transactional storage regardless of engine. **No** primary database, backend deployment, synchronisation model or hosting provider is selected. Moved to staging for further refinement; not production approval or implementation.
