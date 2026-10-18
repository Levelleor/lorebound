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
Create, autosave, resume, rename, duplicate and delete individual adventures **within one SQLite library**; provide **Backup Database** and **Restore Database** as the only file-based data transfer operations, covering all adventures together.

## Why this idea matters
Long stories need recoverable and portable saves.

## Accepted direction
- **Multiple independent adventures:** A player can create and manage multiple separate saved stories **inside one shared SQLite library database** (IDEA-0051). Adventures have stable separate identities and do not share canonical narrative/world state by default.
- **Autosave, with two distinct persistence states (explicitly accepted):** Autosave **unfinished player input and prose edits as noncanonical drafts** in the same Go-managed SQLite library after a short inactivity pause; restore those drafts when the browser/editor is reopened. Draft saves must **not** create accepted turns, canonical story revisions, world events or expensive history reconstruction. **Committed turns and confirmed story revisions** persist separately and atomically with all validated state/event changes. Do not require a manual Save button for ordinary committed progress.
- **Resume:** Reopen an adventure at its last reliably saved state.
- **Rename:** Change an adventure's display name without altering its contents.
- **Duplicate:** Create an independent copy of an adventure, including the information needed to continue it separately.
- **Database import/restore (revised accepted workflow):** Importing a **whole-library SQLite snapshot** intentionally **replaces the currently active SQLite database**. It does **not** merge an adventure into the existing library. Earlier single-adventure import language has been superseded by IDEA-0051/0052.
- **Full-library backup only:** Backup creates a **consistent SQLite snapshot of the complete shared database**, including every adventure, editable narrative and revisions, event history, world state, lore, memories and persistent plugin state. **Individual-adventure file exports are explicitly excluded**, superseding the earlier scope.
- **Confirmed deletion:** Require clear confirmation before permanently removing an adventure.
- **Credential exclusion:** Never include provider API keys, passwords, authentication tokens or similar secrets in exports.

## Proposed behaviour
Provide an adventure library with Create, Resume, Rename, Duplicate and Delete actions for individual adventures. While a player types input or edits a story passage, the frontend **debounces ordinary SQLite draft writes** through Go after a short pause, restoring persisted drafts on reopen. These **do not alter canon**. On submit or appropriate historical-edit confirmation, the TypeScript coordinator validates the requested gameplay/story change and Go atomically saves the accepted turn/revision and associated canonical event/state changes. Do not treat an incomplete generated response as committed. If generation or commit fails, preserve the previously committed story/world and keep the player's input recoverable for retry. **Backup Database** downloads a consistent SQLite snapshot of **all** adventures; **Restore Database** deliberately **replaces the entire current SQLite database**. These are the only file export/import operations; provider API credentials remain outside the snapshotted database.

## Alternatives and trade-offs
**Whole-library SQLite snapshot is the only accepted data-export format.** In-library **draft autosaving is not a backup/export format or separate database**. Saving each keystroke and making unfinished text canonical immediately are not selected; draft writes are lightweight and debounced, with an exact interval to be chosen during implementation. The earlier proposed single-adventure archive export and standalone plain-text/Markdown export are **outside this approved backup/export workflow**; supporting any new export format would need a separate future decision. No merging, automatic library migration or advanced corruption-repair system is required.

## Architecture integration (2026-10-17)
- All adventures are durably stored in **one Go-managed SQLite database** for **Wails v3 headless localhost Go server delivery only**, with play through the normal browser. The SQLite library defaults to the **OS's per-user app-data directory**, with an **optional custom directory** (IDEA-0051). Browser-owned storage is not the source of truth.
- Draft autosave, committed turn/revision saves, resume, duplication, **whole-database backup** and **whole-database replacement restore** operate through Wails Go persistence services. **Draft records are explicitly marked provisional and kept separate from canonical revision/event history**. Go creates a consistent SQLite snapshot, closes or quiesces database handles for replacement, then reopens the selected DB. The frontend sends typed requests and renders outcomes; Go applies atomic save operations.
- **One active database and simple directory selection:** Under IDEA-0051, Go opens an existing library database in the chosen app-data/custom directory or creates an empty one if absent. It does **not migrate or merge** the old database on directory change. Backup snapshots the **whole active database**, and Restore Database replaces **the whole active database**. **Per-adventure export/import is explicitly out of scope.** Credential exclusion must hold for SQLite snapshots.

## Dependencies and constraints
- Depends on the **shared filesystem-backed SQLite database** via Go, with per-user OS app-data default and optional custom directory (IDEA-0051), transaction-safe storage, stable IDs and event/document revision history.
- Duplication within the shared library database must assign a distinct adventure identity, preserve necessary internal references and avoid sharing unintended mutable canonical state with the source adventure.
- Saving a narrative turn, its accepted story revision and validated state events must be **one atomic committed operation**. An interrupted/failed model request, rejected action or failed commit **must not partially mutate canonical state**; keep the last saved player draft available for retry and show save/failure status. A few characters typed since the last debounce may remain unsaved if the process ends abruptly; do not promise synchronous per-keystroke durability.
- Whole-database SQLite snapshots must not leak provider credentials, passwords or tokens. Store such secrets **outside** the library database included in the snapshot; restoring does not automatically restore third-party secrets.
- Full-fidelity restoration may depend on optional plugins being installed and on compatible schema versions; missing extensions should be handled explicitly.
- Exported model/provider configurations may be informative even if the specified model is not available on another machine; portability does not guarantee model availability.

## Open questions
- What minimal compatible-SQLite-file checks and Go connection close/reopen behaviour should govern **whole-database replacement**, with no ID-collision merge workflow?
- How prominently should the UI explain that **Restore Database replaces every adventure** currently saved, without introducing a merge or selective restore feature?
- What debounce delay, editor focus/blur handling, draft save indicator and conflict/version policy best balance responsiveness and durability? Drafts persist in SQLite, so the last successfully saved draft can be restored after a browser restart; disk-full/write failures must be visible.
- When exactly should a completed/committed turn retire its source draft, and how should failed generation/commit and interrupted submissions retain or restore player input?
- Should deletion be immediately permanent after confirmation, or provide an optional recovery period?
- What happens when a whole-library restore references providers or plugins unavailable in the current installation? No automatic model/plugin installation is implied.

## Draft acceptance criteria
- [ ] A player can create, name, reopen and resume multiple distinct adventures.
- [ ] A completed turn or explicitly confirmed revision is **atomically committed** with every validated canonical event/state effect; partially generated, invalid or failed turns do not change authoritative story/world state.
- [ ] While typing an input or editing prose, Lorebound writes a **noncanonical draft to the shared SQLite database after a short pause**, without creating a story revision, event, tool side effect or historical state rebuild.
- [ ] Closing and reopening the browser/editor **restores the last successfully autosaved draft** independently of the last committed narrative/world state.
- [ ] Submitting/confirming a change invokes validation and atomic committed persistence; failures leave prior canon unchanged and the player's latest saved input available to retry.
- [ ] Clear draft/save status and ordinary write failures are surfaced; exact debounce interval and unsaved-last-keystrokes behaviour are refined before promotion.
- [ ] Renaming an adventure preserves its story and world-state data.
- [ ] Duplicating an adventure creates an independently editable/playable copy.
- [ ] **Backup Database** captures the **whole SQLite library**, with every adventure and canonical history; **Restore Database** replaces the complete active library. **No individual-adventure export/import** is offered.
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
- The export file format is **a consistent full SQLite snapshot**; precise Go snapshot API, basic restore compatibility and minimal file safety are unrefined. No implementation or production approval is claimed.

## Decisions and review history
- 2026-10-17 — **User explicitly accepted the two-tier autosave direction (staging refinement):** Unfinished player input and prose edits **autosave as noncanonical drafts to Go-managed SQLite after a brief inactivity pause** and restore on returning to the browser/editor. Draft saves have no canonical effect, no downstream state reconstruction and no accepted story revision. On submission/explicit confirmation, the coordinator validates and Go atomically commits the completed turn or revised prose plus every canonical state/event change; incomplete AI generation and failed requests must not partially commit, and the player's saved input must remain available to retry. Precise debounce timing, unsaved last keystrokes, draft IDs and cleanup mechanics remain implementation decisions. No staging-to-production approval.
- 2026-10-17 — **Explicit user removal of previously accepted individual-adventure exports:** The only player-facing file data-transfer actions are **Backup Database** and **Restore Database**, both involving **the complete shared SQLite database**. No adventure-scoped export/import, merge or alternate story save-file format is accepted in the current scope. Earlier historical single-adventure export acceptance is superseded, while in-library create/rename/duplicate/delete/autosave remain intact. This is staging refinement, not approval to implement.
- 2026-10-17 — **Explicit user-approved backup/import revision (dependent on IDEA-0051):** The one shared SQLite library is opened if present, created if absent; no automatic relocation, migration or multi-library management. A backup is a **whole-library SQLite snapshot**. Import/restore **overwrites the entire active database**, never merges individual adventures or resolves duplicate IDs. Advanced corruption-recovery UX is not required. Prior accepted **single-adventure export** now needs a separate retention/scope decision, while its old add-an-adventure import flow is superseded. This is staging only.
- 2026-10-17 — **Accepted IDEA-0051 storage-location dependency:** The shared library's default is the OS per-user app-data directory; a custom data directory is optional. Save/resume/import/export operate on the actively selected SQLite library without assuming it lives beside the executable. This does not approve a particular import/export file format.
- 2026-10-17 — **Accepted IDEA-0051 layout dependency:** The user chose **Option A: one SQLite database for all adventures**. This idea's separate-adventure save/duplicate/export requirements now apply to **logically isolated adventures inside that shared database**; individual exports must filter to the selected adventure. No file format, restore-collision policy or production status change is approved here.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user** for staging: multiple independent adventures, autosave, resume, rename, duplicate, import, full-fidelity export, confirmed deletion and no credential export. This acceptance authorises refinement, not production or implementation.
