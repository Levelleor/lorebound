---
id: "IDEA-0005"
type: idea
status: staging
origin: mixed
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Adventure Save and Export Management

## Idea
Create, autosave, resume, rename, duplicate, import and export separate adventures.

## Why this idea matters
Long stories need recoverable and portable saves.

## Accepted direction
- **Multiple independent adventures:** A player can create and manage multiple separate saved stories **inside one shared SQLite library database** (IDEA-0051). Adventures have stable separate identities and do not share canonical narrative/world state by default.
- **Autosave:** Preserve committed turns, narrative edits and corresponding validated world-state changes without requiring manual saves. Safely retain pending edits or otherwise protect them from accidental loss.
- **Resume:** Reopen an adventure at its last reliably saved state.
- **Rename:** Change an adventure's display name without altering its contents.
- **Duplicate:** Create an independent copy of an adventure, including the information needed to continue it separately.
- **Database import/restore (revised accepted workflow):** Importing a **whole-library SQLite snapshot** intentionally **replaces the currently active SQLite database**. It does **not** merge an adventure into the existing library. Earlier single-adventure import language has been superseded by IDEA-0051/0052.
- **Full-library backup:** Backup creates a **consistent snapshot of the complete shared SQLite database**, including every adventure, editable narrative and revisions, event history, world state, lore, memories and persistent plugin state. This is a replacement-restorable **whole-library file**. A separate previously accepted **single-adventure export** feature remains a **scope question**, not the selected database snapshot flow.
- **Confirmed deletion:** Require clear confirmation before permanently removing an adventure.
- **Credential exclusion:** Never include provider API keys, passwords, authentication tokens or similar secrets in exports.

## Proposed behaviour
Provide an adventure library with Create, Resume, Rename, Duplicate, Delete and **Backup/Restore Database** actions. Autosave narrative progress and corresponding world state consistently. **Backup** downloads a consistent SQLite snapshot of **all** adventures; **Restore/Import** deliberately **overwrites the current library DB**, rather than adding adventures from the file. Keep provider API credentials **outside the snapshotted database** so the full file can be distributed without leaking secrets. Standalone one-adventure exports, if retained, are not imported through the replacement-only backup restore path.

## Alternatives and trade-offs
**Whole-library SQLite snapshot is selected** as the full-fidelity backup file. Plain-text/Markdown story exports and the earlier standalone single-adventure export proposal are different capabilities whose continued scope is not resolved by the replacement-only restore decision. No additional merging/migration/advanced corruption-repair system is required.

## Architecture integration (2026-10-17)
- All adventures are durably stored in **one Go-managed SQLite database** for **Wails v3 headless localhost Go server delivery only**, with play through the normal browser. The SQLite library defaults to the **OS's per-user app-data directory**, with an **optional custom directory** (IDEA-0051). Browser-owned storage is not the source of truth.
- Save, resume, duplicate, **whole-database backup** and **whole-database replacement restore** operate through Wails Go persistence services. Go creates a consistent SQLite snapshot, closes or quiesces database handles for replacement, then reopens the selected DB. The frontend sends typed requests and renders outcomes; Go applies atomic save operations.
- **One active database and simple directory selection:** Under IDEA-0051, Go opens an existing library database in the chosen app-data/custom directory or creates an empty one if absent. It does **not migrate or merge** the old database on directory change. Backup snapshots the **whole active database**, and restoring that file overwrites **the whole active database**. The earlier one-adventure portable export remains subject to separate clarification; it is not a compatible import-to-library path. Credential exclusion must hold for raw database snapshots.

## Dependencies and constraints
- Depends on the **shared filesystem-backed SQLite database** via Go, with per-user OS app-data default and optional custom directory (IDEA-0051), transaction-safe storage, stable IDs and event/document revision history.
- Duplication within the shared library database must assign a distinct adventure identity, preserve necessary internal references and avoid sharing unintended mutable canonical state with the source adventure.
- Saving a narrative turn and its accepted state events must have consistent recovery semantics after interruptions.
- Whole-database SQLite snapshots must not leak provider credentials, passwords or tokens. Store such secrets **outside** the library database included in the snapshot; restoring does not automatically restore third-party secrets.
- Full-fidelity restoration may depend on optional plugins being installed and on compatible schema versions; missing extensions should be handled explicitly.
- Exported model/provider configurations may be informative even if the specified model is not available on another machine; portability does not guarantee model availability.

## Open questions
- What minimal compatible-SQLite-file checks and Go connection close/reopen behaviour should govern **whole-database replacement**, with no ID-collision merge workflow?
- Should the previously accepted **single-adventure export** remain as an independent export-only feature, given that the only accepted import/restore is whole-database replacement?
- How should autosave recover unsaved draft edits if the browser closes or storage is exhausted?
- Should deletion be immediately permanent after confirmation, or provide an optional recovery period?
- What happens when a whole-library restore references providers or plugins unavailable in the current installation? No automatic model/plugin installation is implied.

## Draft acceptance criteria
- [ ] A player can create, name, reopen and resume multiple distinct adventures.
- [ ] Committed story changes and their world-state effects are durably autosaved together.
- [ ] Pending edits have an explicit safe-recovery policy; interruptions do not corrupt the last committed save.
- [ ] Renaming an adventure preserves its story and world-state data.
- [ ] Duplicating an adventure creates an independently editable/playable copy.
- [ ] A full-fidelity **whole-library SQLite snapshot** includes all adventures and canonical history and can be restored as **complete database replacement**. Standalone single-adventure export remains a separate older proposal pending explicit retention/removal.
- [ ] Importing a compatible whole-library snapshot **replaces the active SQLite database**, with no per-adventure merge, optional automatic backup or separate library-management UI.
- [ ] The library SQLite database contains no provider API keys, passwords or tokens that would be disclosed by copying the **whole database snapshot**.
- [ ] Permanent deletion requires an unambiguous player confirmation.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **mixed**. Combines user intent with suggested implementation details.
- **Accepted for staging/refinement**: adventure management, autosave, full-fidelity backup/restore, confirmed deletion and credential exclusion.
- Technical export format, import compatibility and recovery details remain open; no implementation or production approval is claimed.

## Decisions and review history
- 2026-10-17 — **Explicit user-approved backup/import revision (dependent on IDEA-0051):** The one shared SQLite library is opened if present, created if absent; no automatic relocation, migration or multi-library management. A backup is a **whole-library SQLite snapshot**. Import/restore **overwrites the entire active database**, never merges individual adventures or resolves duplicate IDs. Advanced corruption-recovery UX is not required. Prior accepted **single-adventure export** now needs a separate retention/scope decision, while its old add-an-adventure import flow is superseded. This is staging only.
- 2026-10-17 — **Accepted IDEA-0051 storage-location dependency:** The shared library's default is the OS per-user app-data directory; a custom data directory is optional. Save/resume/import/export operate on the actively selected SQLite library without assuming it lives beside the executable. This does not approve a particular import/export file format.
- 2026-10-17 — **Accepted IDEA-0051 layout dependency:** The user chose **Option A: one SQLite database for all adventures**. This idea's separate-adventure save/duplicate/export requirements now apply to **logically isolated adventures inside that shared database**; individual exports must filter to the selected adventure. No file format, restore-collision policy or production status change is approved here.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user** for staging: multiple independent adventures, autosave, resume, rename, duplicate, import, full-fidelity export, confirmed deletion and no credential export. This acceptance authorises refinement, not production or implementation.
