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
Choose and refine **filesystem-backed SQLite**, accessed exclusively through Wails v3/Go services, as Lorebound's canonical adventure database for the single packaged headless Go localhost server and normal-browser play. The earlier browser-only/server/hybrid comparison has been superseded by the user's 2026-10-17 explicit runtime/storage decision. Exact database schema, file locations, migration, import/export format and performance policies remain for refinement.

## Why this idea matters
The product must reliably store substantial adventures with many story turns, revisions, entities and complete incremental changes. The selected Wails v3 headless Go localhost service provides one filesystem-backed SQLite database boundary for the normal-browser frontend. The remaining challenge is durable transactions, consistent history, migration, recovery and export/import, not deciding whether the browser or a Node/SvelteKit server owns canonical saves.

## Accepted direction
- **SQLite selected:** Canonical saves, story text/revisions, world-state events, entity records and durable plugin data use SQLite database files persisted on the computer's filesystem. Go/Wails owns reads, writes, migrations and transactions.
- **One headless runtime:** Wails v3's localhost Go server serves the SvelteKit frontend to the normal browser and exposes Go persistence services. No separate native window/WebView or Node/SvelteKit SSR player server.
- **No browser-owned canonical saves:** Browser localStorage, IndexedDB, SQLite WASM/OPFS and browser quotas are not authoritative adventure storage. UI preferences or disposable caches may be browser-scoped without violating this decision.
- **Atomic history:** A committed turn, versioned prose and accompanying canonical events/state must be durably committed together or not at all. Concurrency control must prevent stale browser tabs or simultaneous clients from overwriting one another.
- **SQLite-backed import/export:** Saves and portable import/export derive from SQLite-backed authoritative records; final archive/database snapshot format, schema versioning, migrations, data integrity, file locking and backup consistency remain separate review questions (IDEA-0005 and IDEA-0052).
- **Filesystem durability:** Store data in a user-appropriate persistent directory independent of app binaries, working directories or ephemeral packaging locations. Headless executable configuration and upgrade/migration handling must be refined.
- **Go is a persistence boundary, not a parallel game engine:** The coordinator, validators and gameplay plugins remain frontend TypeScript (IDEA-0044/0047/0055). Go validates data/service requests for safety, expected versions and transaction integrity; it must not blindly permit conflicting durable writes.
- **Selected architecture is staging direction only:** This does not assert SQLite tables, a driver, an export file layout or an implemented database already exists.

## Storage options to evaluate (accepted for comparison; no engine selected)
**Historical alternatives, superseded by explicit user choice on 2026-10-17:** Browser localStorage, IndexedDB, SQLite WASM/OPFS, SvelteKit server SQLite, hosted PostgreSQL and hybrid sync were considered while the storage direction was undecided. None are now selected as alternate canonical stores for initial Lorebound. They may be reconsidered only through a later explicit decision; the current architecture is **Go/Wails + filesystem SQLite**.

## Proposed behaviour
The player's SvelteKit/Svelte UI and browser-side TypeScript game logic request durable records through Go/Wails service bindings. Go stores adventures and all canonical state/history in a persistent local SQLite database and returns typed data to the frontend. Atomic commit operations verify the expected adventure revision, then persist accepted text revisions/events/state records in one SQLite transaction, with a recoverable failure on conflict or disk errors. The sole headless localhost server uses this architecture. Export/import operate over complete, validated persisted adventures via Go; their exact portable encoding remains to be decided.

## Alternatives and trade-offs
- **Selected SQLite/Go:** Small embedded SQL engine, no separate SQL server or runtime, strong transactional support and native local disk storage. Requires careful multi-tab concurrency, schema evolution, migrations, WAL/backups and native service boundaries.
- **Browser IndexedDB/OPFS and hybrid sync:** Not selected for canonical saves. Avoids a headless Go server in browser-only hosting but conflicts with the accepted single filesystem persistence model.
- **Node/SvelteKit server SQL:** Not selected because the headless web entry point is Wails v3's Go HTTP server.
- **Hosted SQL/remote multiplayer:** Not selected; app stays single-user/local-first. Remote server deployment and authentication are separate, unapproved concerns.
- **Export design:** A raw live SQLite file copy may be inconsistent (e.g., with WAL) and must not be assumed to equal a validated portable backup. Compare safe snapshot/backup APIs with logical export archive strategies under IDEA-0052.

## Dependencies and constraints
- User selected Wails v3 headless localhost only in [[Localhost Startup and Offline Mode]] (IDEA-0053), packaged into Windows/macOS/Linux server executables. The headless mode requires a running Go process but not Node SSR.
- [[Snapshots and Incremental State Rebuild]] (IDEA-0042), [[Event-Sourced World History]] (IDEA-0039) and [[Versioned Text Blocks and Revision IDs]] (IDEA-0040) require full durable reconstructibility at supported history points.
- [[Deterministic Adventure Coordinator]] (IDEA-0044) prepares validated results in browser-side TypeScript, but the Go/SQLite boundary must guarantee transactional, version-consistent writes and reject stale commits; server mode may have multiple tabs/clients.
- [[Adventure Save and Export Management]] (IDEA-0005) and [[Backups Export and Storage Quotas]] (IDEA-0052) are **already accepted staging ideas** and define the later full-fidelity portability/backup requirements. Neither an export container nor the schema is selected here.
- No browser-origin storage, external cloud database or inference process is mandatory. Sensitive model API credentials must not enter adventure saves or exports.
- This is staging refinement, not final schema implementation or production approval.

## Open questions
- Where should persistent SQLite files live when the headless server runs, and how is the location configured safely?
- What SQLite driver, connection pool, WAL, busy timeout, transaction and durability settings suit large single-player adventures and multiple browser windows?
- What concurrency model or expected-revision token lets Go reject stale writes from multiple tabs/clients without duplicating TypeScript gameplay rules?
- How are schema migrations, app downgrades, corruption detection, crash recovery, backups and user-visible failures handled?
- Should portable export be a SQLite snapshot, a logical archive or both, and what validation protects imports from incompatible or malicious data?
- How do database records cover every persistent gameplay plugin field, including disabled/removed plugins, without unreplayable state?
- What benchmarks ensure history replay/queries and large write batches keep the UI responsive?

## Draft acceptance criteria
- [ ] The Wails v3 headless localhost server uses filesystem-backed SQLite via Go services and serves the game to normal browsers.
- [ ] No canonical adventure, text revision or world event requires browser localStorage/IndexedDB to survive closing, restarting or switching views.
- [ ] All accepted state mutations and story revisions are persisted durably and are fully reconstructible at supported history boundaries.
- [ ] Go commits a complete accepted turn atomically and rejects stale/conflicting writes; failed writes leave prior canonical state unchanged.
- [ ] Independent saved adventures remain isolated within the chosen database layout.
- [ ] SQLite data survives normal app upgrades and headless restarts; migration and interrupted-write recovery are tested.
- [ ] Export/import and backups preserve validated complete history, including plugin data, without secrets or accidental side-effect replay.
- [ ] File location, schema, SQLite driver, snapshot/backup method and relevant performance thresholds are resolved before promotion.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Browser-local persistence came from the original brainstorm; the user clarified an intended SvelteKit framework and requested comparison of browser, backend and optional hybrid databases, then **explicitly accepted the options-first direction for staging**.
- Staging acceptance does **not** choose an engine, database location, synchronisation approach, hosting provider or implemented design.

## Decisions and review history
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Explicit architecture refinement accepted by the requesting user:** Use Wails v3 both as desktop app and headless localhost Go browser server, with **SQLite on the host filesystem** accessed through Go services for all canonical saves and import/export. Do **not** use browser-owned storage for durable adventures; game rules and plugins remain client TypeScript. This overrides the previously undecided storage-options comparison without selecting export file format, specific SQLite driver or database schema. Staging only, not production approval.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate** initially oriented toward browser-local databases.
- 2026-10-16 — **User clarification during Inbox review, not acceptance:** Record localStorage, persistent browser storage, IndexedDB, SQLite WASM + OPFS and SvelteKit server-backed database possibilities, including an easy-to-host backend database if appropriate. The user specified **SvelteKit** as the application framework and does not want browser-only storage prematurely locked in. Expanded the candidate to compare browser-local, backend and optional hybrid models, keeping storage engine, primary source-of-truth and deployment open. **At that time**, the note remained a candidate in Inbox.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Stage IDEA-0051 as a **storage-options-first** design direction using SvelteKit, comparing browser `localStorage`, IndexedDB, SQLite WASM + OPFS, browser persistence permissions, SvelteKit server-side SQLite, hosted SQL and optionally hybrid persistence. Require deterministic **complete incremental reconstruction** and coherent transactional storage regardless of engine. **No** primary database, backend deployment, synchronisation model or hosting provider is selected. Moved to staging for further refinement; not production approval or implementation.
