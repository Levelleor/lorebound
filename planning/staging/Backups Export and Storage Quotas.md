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
Provide robust SQLite-backed backup, restore, validated import/export, disk-space estimation and storage integrity for Lorebound adventures using Go-managed filesystem persistence in the one Wails v3 headless localhost server runtime.

## Why this idea matters
Running out of disk space, database corruption, interrupted Go server writes, failed schema migrations or loss of the host computer could destroy long-running adventures. Players need durable, portable ways to preserve and restore **entire reconstructible stories**, not just their latest prose or a cached projection, without coupling the backup format to whichever database engine is eventually chosen.

## Accepted direction
- **Go/SQLite-backed backup and restore:** Provide user-accessible export, import and restore for the selected filesystem SQLite persistence, through the same Go/Wails service surface in headless localhost browser mode.
- **Single-adventure portable export:** Extract a selected adventure's complete story turns, text revisions, baseline, accepted event/state changes, stable references and durable plugin data **from the shared SQLite library**, without including unrelated adventures. Its portable container format remains open.
- **Full-library portable export/backup:** Export **all adventures from the single shared SQLite database** with portable metadata/settings/assets as appropriate. A SQLite snapshot/backup API may suit a full-library backup but must be consistent with active WAL/transactions; exact format and included non-adventure settings remain open.
- **Validated import and restore:** Check incoming backup schema/version, integrity, completeness, required dependencies and ability to reconstruct accepted state before making imported data authoritative. Exact import format, migrations and conflict resolution remain open.
- **Preserve complete historical reconstructibility:** Exports and restores must retain the full persistent story and world-state history accepted in [[Snapshots and Incremental State Rebuild]] (IDEA-0042), not only the latest world snapshot. Historical restoration must not rerun AI-generated outcomes or external side effects.
- **Safe restore boundary:** Restores and library imports must not silently corrupt or overwrite existing accepted adventures. Duplicate identities, naming collisions, interrupted restores, format incompatibilities and rollback options need explicit design.
- **Storage usage and quota awareness:** Provide meaningful estimation of usage and relevant quota/retention constraints, including warnings and recoverable handling as storage becomes constrained. Do not assume browser quota APIs or server quota reporting always return exact available capacity.
- **Optional browser persistence request:** Evaluate browsers' persistent-storage APIs as a mitigation against automatic eviction where supported and granted. A successful request is **not** an independent backup and cannot prevent user-cleared data or device loss.
- **Optional automatic backups:** Evaluate filesystem-based automation when browser APIs and user permissions allow, or backend-managed backups where hosting supports them. This accepts evaluation of automatic backup mechanisms, **not** an unconditional ability to write local files silently or a prescribed schedule.
- **Open policy and engineering choices:** Keep format, location, encryption/access-control design, backup cadence, retention, migrations, overwrite/conflict resolution, automatic backup policies, provider-specific tooling and precise quota UI open for staging refinement.

## Proposed behaviour
The player can request a portable backup of a single adventure or their full library and later import or restore it through a validation path. A complete backup must contain all canonical persistent story revisions, entities, initial baselines, accepted incremental changes and supporting references necessary for deterministic reconstruction. Lorebound reports available storage-usage estimates and applicable warnings for the selected storage backend, and handles exceeded quotas or interrupted writes without silently dropping committed data. Browser persistence requests and automatic local/backend backups can be offered where supported and approved; the selected database and hosting configuration determine feasible implementation details.

## Alternatives and trade-offs
Manual downloadable exports let a browser user move complete SQLite-backed adventures but depend on the player remembering to create them. Automatic filesystem backups may reduce loss risks on supported browsers after explicit permissions, yet are limited by browser security and availability. SvelteKit server deployments may enable scheduled database snapshots or backups, but hosted storage persistence, cost, access control and retention vary by provider. A portable archive format may cost more engineering work than a raw database dump while improving restoration across browsers, versions and engines. Browser storage persistence requests mitigate certain evictions but are neither backups nor a guarantee against loss. The exact combination remains open.

## Architecture integration (2026-10-17)
- The accepted runtime/storage architecture is **Wails v3 headless localhost Go server + filesystem SQLite**. Backups, quota/space warnings, exports and restores must work with persistent local files and managed database connections, not browser-origin quotas or IndexedDB.
- Go must safely back up the **one shared SQLite library database** and validate complete history, revisions and module-owned state. A **single-adventure export cannot simply copy the entire database**; it must select one adventure and required dependencies. Whether whole-library portable output is a safe SQLite snapshot, logical archive or both remains under review.
- Headless mode's writable data location must survive restart and packaging changes; browser uploads/downloads are only a transport for moving export/import files, never canonical storage.

## Dependencies and constraints
- [[Browser-Persistent Story Database]] (IDEA-0051) now selects **Go-managed filesystem SQLite** as canonical storage. Export/backup design must support this explicitly rather than treating browser/hosted alternatives as equally selected.
- [[Snapshots and Incremental State Rebuild]] (IDEA-0042) requires **complete incremental history** and deterministic world reconstruction at supported turn boundaries. Import/export must preserve all canonical persistent changes and story revision lineage.
- Restores must not replay historical external side effects, regenerate earlier AI decisions or introduce a partial accepted story/world-state transaction; preserve compatibility with accepted event history and coordinator finalisation (IDEA-0039, IDEA-0044).
- Browser-origin quotas and browser filesystem permissions do not govern canonical saves; headless browser clients reach Go's filesystem/database service. Browser upload/download permissions still matter for importing or exporting a file interactively.
- Go/SQLite backup tools and durability guarantees depend on correctly configured host data directories and safe database snapshot/transaction procedures. A raw database file copy does not automatically constitute a consistent portable archive.
- Imported data is untrusted until validated; required security/migration policies remain undecided.
- This is an accepted staging direction requiring refinement, not production approval or an implemented capability.

## Open questions
- What backup location and cadence should the always-present local Go server support?
- Which adventure assets, settings, generated images or plugin-specific data belong in single-adventure versus full-library exports?
- What portable archive manifest/schema/versioning and integrity checks are appropriate across different database engines?
- How can restore validation verify completeness and reconstructibility without executing historical external commands or AI calls?
- How should imports into the **shared SQLite database** handle duplicate adventure IDs, existing library records, branching/revision conflicts and restores without clobbering other adventures?
- How can a crash, partial import, full disk or expired permission be handled without corrupting existing adventures?
- Where should optional automatic backups live on the host filesystem, and how should Go manage permissions and disk use?
- What defaults, backup frequency, retention rules, optional encryption or privacy protections should apply?
- How should old backup formats and plugin-specific events migrate if an older adventure is imported years later?
- Which filesystem capacity, SQLite page count, WAL size and backup-space estimates are reliable enough for actionable warnings in desktop and headless modes?
- Which messages and recovery paths should appear if quota is exhausted, the database becomes unavailable or an export fails?

## Draft acceptance criteria
- [ ] A single adventure can be exported in a portable form that preserves all canonical persistent state/history and relevant narrative revision data.
- [ ] The **one shared SQLite library database** can be backed up/exported consistently, including required metadata and all adventures' relationships.
- [ ] An imported backup is validated for format/version, completeness, integrity and safe reconstruction before it becomes authoritative.
- [ ] Import failures, collisions or incomplete archives do not silently overwrite or corrupt existing accepted adventures.
- [ ] A restored adventure can deterministically reconstruct its complete persisted canonical world/story state at applicable supported turns without new AI generation or replayed external side effects.
- [ ] Backup/import/export functionality uses the selected filesystem SQLite via Go and preserves full history safely.
- [ ] Storage usage and relevant quota/retention risks are surfaced with appropriate warnings and recoverable failures.
- [ ] Automatic filesystem backups, cadence and retention are optional and unresolved; browser persistent-storage grants do not affect canonical filesystem SQLite.
- [ ] The exact archive format, destination, cadence, retention, version migrations, restore conflicts and quota UI remain for further refinement.

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
- 2026-10-17 — **Accepted IDEA-0051 layout dependency:** The user explicitly selected **one SQLite database containing all adventures (Option A)**. Full-library backup must cover that database consistently; single-adventure export must extract complete filtered records without including unrelated adventures. Exact export format, backup APIs, migration and restore semantics remain open.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Storage-independent backup, import/export, restore validation and storage usage/quota awareness for browser-local or potential SvelteKit backend data; portable single-adventure and full-library exports including complete incremental world state and story history; evaluate optional browser persistence requests and automatic backups where permitted. Backup format, location, cadence, retention, migration, restore conflicts and precise quota UI remain open. Promoted to staging for refinement only, not production.
