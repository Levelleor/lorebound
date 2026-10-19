---
id: "IDEA-0052"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Backups Export and Storage Quotas

## Idea
Provide **simple whole-database SQLite snapshot backup and replacement-only restore/import**, with filesystem space feedback and ordinary database consistency, for Lorebound's single active Go-managed library under its headless localhost server. No library manager, merge restore or advanced corruption-repair system is required.

## Why this idea matters
Running out of disk space, database corruption, interrupted Go server writes, failed schema migrations or loss of the host computer could destroy long-running adventures. Players need durable, portable ways to preserve and restore **entire reconstructible stories**, not just their latest prose or a cached projection, without coupling the backup format to whichever database engine is eventually chosen.

## Accepted direction
- **Selected whole-library backup/restore:** A player can **save a transactionally consistent snapshot of the entire active SQLite database**, then **import that snapshot to overwrite the current active database in full** through Go/Wails services. **No merge, append, ID collision resolution, selective adventure import or multi-library manager** is part of this import flow.
- **No individual-adventure exports (explicitly accepted):** The user has **superseded** the older IDEA-0005/0052 direction to export one adventure. **Every backup/export is a complete SQLite database snapshot**, and **every import/restore replaces the whole database**. There is no selected per-adventure file import/export, merge or additional archive format.
- **Snapshot contents:** The backup contains **everything persisted in the active SQLite library database**, including all adventures and their accepted revisions/events/world/plugin history. Use a SQLite-consistent backup/snapshot mechanism appropriate for active WAL/transactions; the exact API and backup file naming remain open. Store provider API secrets **outside the snapshotted database** to honour the earlier exclusion requirement.
- **Replacement-only import:** The player deliberately selects a database snapshot to import. Go closes or quiesces relevant active SQLite connections, performs **whole-library replacement rather than record import/merge**, and reopens the database; only minimal SQLite/file safety and compatible-file/error checks are required. Do not promise extensive migration, reconciliation or app-managed recovery of corrupt data.
- **Preserve complete historical reconstructibility:** Exports and restores must retain the full persistent story and world-state history accepted in [[Snapshots and Incremental State Rebuild]] (IDEA-0042), not only the latest world snapshot. Historical restoration must not rerun AI-generated outcomes or external side effects.
- **Intentional overwrite:** Import/restore is an **explicit destructive replacement operation**: existing active library contents are replaced, not combined. No automatic pre-import backup, merging, rollback archive or conflict-resolution interface is required. Implement basic SQLite connection/file replacement safeguards to avoid predictable application-induced file corruption.
- **Storage usage and quota awareness:** Provide meaningful estimation of usage and relevant quota/retention constraints, including warnings and recoverable handling as storage becomes constrained. Do not assume browser quota APIs or server quota reporting always return exact available capacity.
- **No browser persistence workflow:** Browser persistent-storage APIs are irrelevant to the canonical host-filesystem SQLite database and are **not** part of this accepted backup flow.
- **Optional automatic snapshots:** A scheduled snapshot mechanism could be considered separately, but the approved required behaviour is **manual whole-database snapshot backup**. No automatic migration, repair, backup cadence, retention or storage-permission request is currently selected.
- **Narrow remaining choices:** The **file type is a full SQLite snapshot** and the restore operation is **unconditional whole-database replacement by the selected import action**; no merge/conflict resolution. Implementation details for safe snapshotting, close/reopen, basic file compatibility/error handling, download destination and any future optional automation remain open. No extensive recovery or migration workflow is required.

## Proposed behaviour
The player can use **Backup Database** to download a consistent snapshot of the entire active SQLite library and **Restore Database** to replace the complete active library with a chosen snapshot. **No single-adventure export exists in the accepted scope.** A complete backup must contain all canonical persistent story revisions, entities, initial baselines, accepted incremental changes and supporting references necessary for deterministic reconstruction. Lorebound reports available storage-usage estimates and applicable warnings for the selected storage backend, and handles exceeded quotas or interrupted writes without silently dropping committed data. Automatic backup scheduling is not currently required; SQLite remains the source of truth at the configured filesystem location.

## Alternatives and trade-offs
A user-requested SQLite snapshot is a simple full-library backup and preserves the data stored in the database. The trade-off is intentional: importing it **replaces** any newer/current library data, and the application does not merge snapshots or provide advanced recovery after corruption. Copying an active SQLite file directly may omit WAL state, so use a consistent SQLite backup operation; simple close/reopen and replacement precautions are still required to avoid damage caused by unsafe application file operations.

## Architecture integration (2026-10-17)
- The accepted runtime/storage architecture is **Wails v3 headless localhost Go server + filesystem SQLite**. Backups, quota/space warnings, exports and restores must work with persistent local files and managed database connections, not browser-origin quotas or IndexedDB.
- Go backs up the **single active SQLite database** using a **consistent SQLite snapshot** and **replaces** the entire database on restore. A raw live database file copy is not assumed to be consistent. **Individual-adventure exports/imports have been explicitly removed from scope.**
- **Selected data location:** The shared SQLite library defaults to the OS's per-user application-data directory, with an optional custom directory (IDEA-0051). In either directory, **open the existing library file or create a new one if absent**. Changing the configured directory does not migrate data. Browser download/upload is solely how players move **whole-database backup/restore snapshots**; Go handles the actual file safely.

## SQLite snapshot backups intentionally exclude external credential stores
- **Accepted IDEA-0014 storage decision (2026-10-18):** Secrets for multiple cloud/local provider profiles persist **outside** the canonical SQLite database in the system's OS credential vault by default. If secure storage cannot be used, after a visible plaintext warning and opt-in, an **unencrypted companion file beside the currently active database** may contain opted-in credential values. Nonsecret connection profile metadata/references may remain in SQLite.
- **Existing Backup Database contract preserved:** An application-generated backup contains **one consistent complete SQLite database snapshot**. It does **not** copy the plaintext credential companion file or OS vault, even if the companion is next to the source SQLite file. **Do not add sidecar packaging, automatic secret export, multiple-file archives or encrypted backups** as implied functionality.
- **Honest portability/security:** Restoring the snapshot to another machine, OS account or library directory may leave provider profiles **without their secrets**, requiring re-entry. A player who manually backs up, copies, synchronizes or shares the **entire parent folder** may unintentionally include the unencrypted companion file. Warn clearly that the sidecar is unencrypted and outside the managed Backup Database operation.
- **OS permission hardening and user choice:** Before first plaintext sidecar write, warn about the path and risk, offer OS keyring unlock/setup help and obtain explicit consent. Owner-only permissions/safe creation reduce casual exposure but are **not encryption**; an unsafe directory should cause an explained failure rather than a hidden insecure write. Secret backend/file details remain in IDEA-0014/0051.

## Dependencies and constraints
- [[Browser-Persistent Story Database]] (IDEA-0051) now selects **Go-managed filesystem SQLite** as canonical storage. Export/backup design must support this explicitly rather than treating browser/hosted alternatives as equally selected.
- [[Snapshots and Incremental State Rebuild]] (IDEA-0042) requires **complete incremental history** and deterministic world reconstruction at supported turn boundaries. Import/export must preserve all canonical persistent changes and story revision lineage.
- Restores must not replay historical external side effects, regenerate earlier AI decisions or introduce a partial accepted story/world-state transaction; preserve compatibility with accepted event history and coordinator finalisation (IDEA-0039, IDEA-0044).
- Browser-origin quotas and browser filesystem permissions do not govern canonical saves; headless browser clients reach Go's filesystem/database service. Browser upload/download permissions still matter for importing or exporting a file interactively.
- Go/SQLite backup tools and durability guarantees depend on correctly configured host data directories and safe database snapshot/transaction procedures. A raw database file copy does not automatically constitute a consistent portable archive.
- Imported snapshots must be treated as untrusted files and minimally checked for valid/compatible SQLite content before replacing a live library; advanced data migrations, historical repair and complex import reconciliation are **not** required by this decision.
- This is an accepted staging direction requiring refinement, not production approval or an implemented capability.

## Open questions
- What backup location and cadence should the always-present local Go server support?
- The required whole-library snapshot captures **everything persisted in SQLite**; separately stored files are outside the raw database snapshot unless a new explicit decision brings them into scope. No per-adventure export/archive work is required.
- Which supported SQLite snapshot API/file convention produces a consistent **whole-database backup**, including active WAL-mode transactions?
- What minimal SQLite compatibility check suffices to open a user-selected snapshot for replacement without attempting historical AI regeneration or external side effects?
- How should Go close/replace/reopen the **entire active SQLite database** on restore and reject incompatible/corrupt snapshot files without creating a new library or trying to merge adventure IDs?
- How can a crash, partial import, full disk or expired permission be handled without corrupting existing adventures?
- If optional scheduled snapshots are later added, where should they live and how should disk space be managed? No cadence or extra backup copies are required today.
- Should any future scheduled backups or encryption be considered separately? Neither is selected by the current simple manual snapshot/restore decision.
- If an imported whole-library snapshot has an incompatible schema/version, should the application simply report failure? Sophisticated legacy import conversion is not a selected requirement.
- Which filesystem capacity, SQLite size and snapshot-space estimates are useful for minimal error/warning messages in the headless localhost runtime?
- Which messages and recovery paths should appear if quota is exhausted, the database becomes unavailable or an export fails?

## Draft acceptance criteria
- [ ] Backup Database produces a consistent SQLite-only snapshot containing all adventure data and nonsecret profile references but **no credential values, OS-vault secrets or plaintext sidecar**.
- [ ] A restored SQLite snapshot can show a previously configured profile with **missing credentials**, and the user can re-enter secrets without relying on credential backup.
- [ ] The UI warns that separately copying the full library directory may include the plaintext credential sidecar, unlike the app's managed SQLite snapshot.
- [ ] **Backup Database** creates one **consistent full-library SQLite snapshot**, including every adventure and all canonical revision/event/plugin history. **No per-adventure backup/export operation** is present.
- [ ] The **one shared SQLite library database** can be backed up/exported consistently from either the default OS app-data directory or an optional custom data directory, including required metadata and all adventures' relationships.
- [ ] Import/restore **overwrites the entire active SQLite library** after minimal compatible-file checks and safe database handle management; it does not merge existing adventures.
- [ ] Imports do not attempt to reconcile individual adventure ID collisions or merge records; invalid or unreadable files fail with a useful error rather than being treated as additional libraries.
- [ ] A restored adventure can deterministically reconstruct its complete persisted canonical world/story state at applicable supported turns without new AI generation or replayed external side effects.
- [ ] The only player-facing file operations are **Backup Database** and **Restore Database**, both acting on the **entire SQLite library** through Go. No individual-adventure import/export workflow is required.
- [ ] Storage usage and relevant quota/retention risks are surfaced with appropriate warnings and recoverable failures.
- [ ] Automatic backups, special retention, advanced corruption-repair and browser persistence grants are **not mandatory features**. Ordinary SQLite transactional writes and consistent snapshots still apply.
- [ ] Exact Go snapshot/restore API details, minimal SQLite file checks, backup destination and disk-space reporting remain for refinement; **record merging and restore-conflict resolution are not required**.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with earlier suggested implementation details; explicitly accepted for staging with storage-independent backup, portability, validation and quota-awareness scope.
- This is an **accepted but unrefined planning direction**, not approval of a particular backup mechanism or evidence of implementation.

## Decisions and review history
- 2026-10-18 — **Accepted IDEA-0014 credential exclusion:** OS keyring stores profile secrets by default; optional warned/consented plaintext sidecar lives beside the active SQLite file, but **never** inside the database or managed whole-library SQLite snapshot. Copying the directory separately may reveal keys; database-only restore may require re-entry. Staging only.
- 2026-10-17 — **Explicit user-confirmed scope removal:** **Do not offer single-adventure export or import.** Every backup/export is a **consistent snapshot of the one complete SQLite database**, and Restore Database **replaces** the entire active database. Only **Backup Database** and **Restore Database** are accepted player file-transfer commands. Prior per-adventure archival ideas remain in history as explicitly superseded. Keep minimal SQLite/WAL consistency and credential exclusion. Staging only.
- 2026-10-17 — **Explicit user-accepted simplification superseding prior optional workflows:** A backup is a **consistent snapshot of the entire one active SQLite database**. **Import/restore overwrites the entire active DB**, not merging or importing one adventure. Changing data directory simply uses an existing DB if present or creates an empty one if not, with no automatic migration, library switching/merging or sophisticated corruption recovery. Retain minimal SQLite connection and snapshot consistency precautions. This supersedes earlier merge/duplicate-ID restore requirements and highlights the prior **single-adventure export** acceptance as a separate scope question, not a secretly implemented alternative. Staging only.
- 2026-10-17 — **Accepted IDEA-0051 location dependency:** The one shared SQLite database defaults to OS per-user app-data, with an optional custom directory. Backup/export operations must identify the active location, protect consistent SQLite/WAL state and remain valid when the application binary is upgraded. This note does **not** yet decide backup destination, schedule or format.
- 2026-10-17 — **Accepted IDEA-0051 layout dependency:** The user explicitly selected **one SQLite database containing all adventures (Option A)**. Full-library backup must cover that database consistently; single-adventure export must extract complete filtered records without including unrelated adventures. Exact export format, backup APIs, migration and restore semantics remain open.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Storage-independent backup, import/export, restore validation and storage usage/quota awareness for browser-local or potential SvelteKit backend data; portable single-adventure and full-library exports including complete incremental world state and story history; evaluate optional browser persistence requests and automatic backups where permitted. Backup format, location, cadence, retention, migration, restore conflicts and precise quota UI remain open. Promoted to staging for refinement only, not production.
