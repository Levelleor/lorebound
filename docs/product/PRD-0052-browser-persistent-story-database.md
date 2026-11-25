---
id: PRD-0052
type: prd
status: accepted
related:
- NOTE-0056
- PRD-0001
- NOTE-0011
- NOTE-0015
---

# Browser-Persistent Story Database

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0051](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Browser-Persistent%20Story%20Database.md) · origin: user; created: 2026-10-16; updated: 2026-11-01; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-01; approved by: requesting user (explicit separate IDEA-0053 and IDEA-0051 production promotion)

Primary subsystem: **S12**. First milestone: **M0**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-002A merged subsets](../work/items/STORY-0011-production-blank-adventure-creation-and-resume.md); [DEV-002B scope](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md); full inventory draft
- Evidence: [Merged PRs #4](https://github.com/Levelleor/lorebound/pull/4) / [#6](https://github.com/Levelleor/lorebound/pull/6); earlier [Gate 0](https://github.com/Levelleor/lorebound/pull/3)

## Current accepted architecture after 2026-10-28 redirection

**Current canonical storage model:** [B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md) and B3-D04 govern the Go-managed SQLite library: one current structured passage body per passage and one current **ordered declarative outcome-event history**; no retained passage/event revision archive or materialized canonical gameplay state snapshots. A fact assertion needs typed/identity/atomic integrity but not fictional source-transfer or route feasibility. Pending drafts are noncanonical. Derived character/inventory/lorebook state is computed by TypeScript replay, not a second Go gameplay engine.


## Accepted direction
- **One SQLite database for the entire library (explicitly chosen):** Use **one shared SQLite database file**, provisionally referred to as `lorebound.db`, for **all adventures** and their associated canonical narrative text, revisions, events, entities, world state and durable plugin records. The filename is illustrative; the **default parent directory is now selected** below, while the final filename and path resolution implementation remain open. Go/Wails owns reads, writes, ordinary schema updates and transactions. Do **not** create one database file per adventure or a separate `library.db` plus adventure databases.
- **One headless runtime:** Wails v3's localhost Go server serves the SvelteKit frontend to the normal browser and exposes Go persistence services. No separate native window/WebView or Node/SvelteKit SSR player server.
- **Logical adventure isolation within the shared database:** Each adventure's story and world history must remain separate through durable identity and appropriately scoped queries, writes, deletes and duplication. **A confirmed adventure deletion atomically and permanently removes that adventure plus all its dependent story, revisions/events, world state, noncanonical drafts and plugin-owned data**, leaving unrelated adventures intact. No application trash/soft-delete scheme or automatic backup is required. Schema/table shapes, referential-integrity constraints and IDs still need detailed design.
- **No browser-owned canonical saves:** Browser localStorage, IndexedDB, SQLite WASM/OPFS and browser quotas are not authoritative adventure storage. UI preferences or disposable caches may be browser-scoped without violating this decision.
- **Atomic history:** A committed turn, versioned prose and accompanying canonical events/state must be durably committed together or not at all. Concurrency control must prevent stale browser tabs or simultaneous clients from overwriting one another.
- **Exclusive maintenance lock and library generation (user decision 2026-10-23):** Backup/Restore requests enter a Go-owned **global library maintenance mode before the operation**; it blocks any new writes, even latest-wins draft autosaves, regardless of browser tab. Existing accepted writes must finish or be safely rejected before a consistent backup snapshot or destructive restore. The Go process informs connected browsers to invalidate/abort ongoing direct AI work/streaming and pause new generation/edit submissions; remote API computation may continue despite client abort but never authorizes a write. **A successful Restore or change of active library directory invalidates the previous library generation/epoch**: writes from stale tabs cannot commit merely because their per-adventure version matches the replacement's. After release, clients refresh the active library and may start new work. This administrative gate is separate from ordinary **no editor lock, optimistic canonical versions, latest draft wins** policies; no extra gameplay validation is implied.
- **Only two database transfer operations (explicitly accepted):** **Backup Database** creates a transactionally consistent SQLite snapshot of the **entire active database**, containing every adventure. **Restore Database** replaces the **entire active database** with the chosen backup. **No single-adventure export or import, merge, adventure-ID reconciliation, multiple-library management, or alternate playable save-package format** is part of this scope. Do not naively copy a live database in WAL mode. The user explicitly superseded earlier per-adventure export proposals in IDEA-0005/0052.
- **Default data directory (explicitly accepted):** Resolve Lorebound's **per-user OS application-data directory** as the normal location for the single shared SQLite library, **not** the directory containing the executable or an ephemeral working directory. Illustrative default paths: **Windows** `%APPDATA%\\Lorebound\\lorebound.db`; **macOS** `~/Library/Application Support/Lorebound/lorebound.db`; **Linux** `${XDG_DATA_HOME:-~/.local/share}/Lorebound/lorebound.db` (honour `XDG_DATA_HOME` when set). The database filename is provisional and the exact platform-specific resolution code is not yet chosen.
- **Optional user-selected data directory (explicitly accepted):** Allow a **custom directory** for the persistent SQLite library, e.g. a portable installation or alternate drive. Go resolves and accesses this path, subject to filesystem permission and safety checks; the browser must not gain arbitrary filesystem access. **When the configured directory already contains the selected Lorebound SQLite database, open/use it; when it does not, create and initialise a new empty database. Do not automatically copy/migrate/merge/replace a database from the previously configured location.** Only **one active library database per running Lorebound server** is supported; no multi-library browser, catalogue or switching/merge UI is required. The old file, if any, is simply left at its original path.
- **Companion files and minimal safety:** SQLite WAL/journal companion files can reside alongside `lorebound.db`, but they are **not separate adventure databases**. Use SQLite-supported consistent snapshot procedures; an import of a snapshot should close/reopen database access so no stale handles or WAL files corrupt the replacement. No automatic prior-library migration, extra restore copies or sophisticated corruption-recovery feature is promised. Ordinary error reporting and atomic turn commits remain required.
- **Secrets excluded from whole-file backups (revised 2026-10-19):** Provider API keys and secret headers never enter SQLite. They live in the native OS vault, or in an explicitly consented AES-256-GCM encrypted `credentials.enc` sidecar beside the active database with its independent random 256-bit master key in the private per-user OS configuration directory. The earlier plaintext sidecar is superseded. SQLite-only backups exclude the vault, ciphertext and key.
- **Go is a persistence boundary, not a parallel game engine:** The coordinator, validators and gameplay plugins remain frontend TypeScript (IDEA-0044/0047/0055). Go validates data/service requests for safety, expected versions and transaction integrity; it must not blindly permit conflicting durable writes.
- **Selected architecture is staging direction only:** This does not assert SQLite tables, a driver, an export file layout or an implemented database already exists.

## Dependencies and constraints
- User selected Wails v3 headless localhost only in Localhost Startup and Offline Mode (IDEA-0053), packaged into Windows/macOS/Linux server executables. The headless mode requires a running Go process but not Node SSR.
- Snapshots and Incremental State Rebuild (IDEA-0042), Event-Sourced World History (IDEA-0039) and Versioned Text Blocks and Revision IDs (IDEA-0040) require full durable reconstructibility at supported history points.
- Deterministic Adventure Coordinator (IDEA-0044) prepares validated results in browser-side TypeScript, but the Go/SQLite boundary must guarantee transactional, version-consistent writes and reject stale commits; server mode may have multiple tabs/clients.
- Adventure Save and Export Management (IDEA-0005) and Backups Export and Storage Quotas (IDEA-0052) remain accepted staging ideas, now **explicitly revised** to require only full-library SQLite snapshot backup and full-library replacement restore. The previous single-adventure portable export/import direction is **superseded by explicit user approval**, not an unresolved candidate.
- No browser-origin storage, external cloud database or inference process is mandatory. Sensitive model API credentials must not enter adventure saves or exports.
- This is staging refinement, not final schema implementation or production approval.

## Supporting detail

See [NOTE-0056](../knowledge/inbox/NOTE-0056-prd-0052-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
