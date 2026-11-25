---
id: PRD-0053
type: prd
status: accepted
related:
- NOTE-0057
- PRD-0001
- NOTE-0011
---

# Backups Export and Storage Quotas

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0052](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Backups%20Export%20and%20Storage%20Quotas.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S12**. First milestone: **M7**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Accepted direction
- **Selected whole-library backup/restore:** A player can **save a transactionally consistent snapshot of the entire active SQLite database**, then **import that snapshot to overwrite the current active database in full** through Go/Wails services. **No merge, append, ID collision resolution, selective adventure import or multi-library manager** is part of this import flow.
- **Exclusive Go maintenance gate for Backup and Restore (user decision 2026-10-23):** Before starting either requested database operation, the **single Go server establishes an exclusive library-maintenance gate that fences all writes to the active library, including canonical turns, manual edits and autosaved drafts**, across every browser client. Notify connected browsers to **stop and invalidate all current AI generation/streaming** and block new generation/edits during maintenance; they attempt to abort their direct provider fetches, which may still run remotely. Do **not** depend on every tab acknowledging the signal for safety: Go's own write gate must protect the database even if a tab is frozen, closed or unaware. Wait for already accepted SQLite transactions to settle safely before snapshot/replacement. A stopped or late AI response can never commit after the fence. This is an administrative storage lock, **not** a new AI/gameplay validation pass or ordinary editing lock.
- **No individual-adventure exports (explicitly accepted):** The user has **superseded** the older IDEA-0005/0052 direction to export one adventure. **Every backup/export is a complete SQLite database snapshot**, and **every import/restore replaces the whole database**. There is no selected per-adventure file import/export, merge or additional archive format.
- **Snapshot contents:** The backup contains **everything persisted in the active SQLite library database**, including all adventures and their accepted revisions/events/world/plugin history. Use a SQLite-consistent backup/snapshot mechanism appropriate for active WAL/transactions; the exact API and backup file naming remain open. Store provider API secrets **outside the snapshotted database** to honour the earlier exclusion requirement.
- **Replacement-only import with session invalidation:** The player deliberately selects a database snapshot to import. Under the exclusive maintenance fence, Go quiesces/closes SQLite connections and replaces **the whole library** rather than merging records, then reopens it. On **successful Restore** (and on a separate active library-directory change), increment/replace the **active library identity/epoch** so every old tab, generation and stale write must refresh its active library context before any new commit, **even if an adventure version number matches**. This is a server-enforced gate, not an optional tab handshake or a two-tab coordination UI. For non-destructive Backup, after a consistent snapshot completes, release maintenance and allow only fresh AI attempts to begin; aborted work is not resumed. Fail safely if an operation cannot complete; never expose a half-replaced database for new writes. The exact lock/notification/epoch mechanism is Pass B design, without extensive migrations or repair tools.
- **Preserve complete historical reconstructibility:** Exports and restores must retain the full persistent story and world-state history accepted in Snapshots and Incremental State Rebuild (IDEA-0042), not only the latest world snapshot. Historical restoration must not rerun AI-generated outcomes or external side effects.
- **Intentional overwrite:** Import/restore is an **explicit destructive replacement operation**: existing active library contents are replaced, not combined. No automatic pre-import backup, merging, rollback archive or conflict-resolution interface is required. Implement basic SQLite connection/file replacement safeguards to avoid predictable application-induced file corruption.
- **Storage usage and quota awareness:** Provide meaningful estimation of usage and relevant quota/retention constraints, including warnings and recoverable handling as storage becomes constrained. Do not assume browser quota APIs or server quota reporting always return exact available capacity.
- **No browser persistence workflow:** Browser persistent-storage APIs are irrelevant to canonical host-filesystem SQLite. Frontend browsers **cooperate** with maintenance by aborting direct AI requests where supported, but Go's exclusive write fence guarantees that an uncooperative or disconnected tab cannot mutate the library during Backup/Restore. This requires no Go model HTTP proxy.
- **Optional automatic snapshots:** A scheduled snapshot mechanism could be considered separately, but the approved required behaviour is **manual whole-database snapshot backup**. No automatic migration, repair, backup cadence, retention or storage-permission request is currently selected.
- **Narrow remaining choices:** The **file type is a full SQLite snapshot** and the restore operation is **unconditional whole-database replacement by the selected import action**; no merge/conflict resolution. Implementation details for safe snapshotting, close/reopen, basic file compatibility/error handling, download destination and any future optional automation remain open. No extensive recovery or migration workflow is required.

## Dependencies and constraints
- Browser-Persistent Story Database (IDEA-0051) now selects **Go-managed filesystem SQLite** as canonical storage. Export/backup design must support this explicitly rather than treating browser/hosted alternatives as equally selected.
- Snapshots and Incremental State Rebuild (IDEA-0042) requires **complete incremental history** and deterministic world reconstruction at supported turn boundaries. Import/export must preserve all canonical persistent changes and story revision lineage.
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
- How should Go implement an **exclusive cross-client maintenance/write gate**, notify tabs to abort direct AI streams, quiesce existing SQL transactions, and close/replace/reopen the library? On successful restore a new **library epoch** must invalidate old sessions and writes even when adventure versions coincide; choose the simplest suitable protocol.
- How can a crash, partial import, full disk or expired permission be handled without corrupting existing adventures?
- If optional scheduled snapshots are later added, where should they live and how should disk space be managed? No cadence or extra backup copies are required today.
- Should any future scheduled backups or encryption be considered separately? Neither is selected by the current simple manual snapshot/restore decision.
- If an imported whole-library snapshot has an incompatible schema/version, should the application simply report failure? Sophisticated legacy import conversion is not a selected requirement.
- Which filesystem capacity, SQLite size and snapshot-space estimates are useful for minimal error/warning messages in the headless localhost runtime?
- Which messages and recovery paths should appear if quota is exhausted, the database becomes unavailable or an export fails?

## Supporting detail

See [NOTE-0057](../knowledge/inbox/NOTE-0057-prd-0053-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
