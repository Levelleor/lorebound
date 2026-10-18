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
- **Import:** Restore an adventure from a supported export/backup file.
- **Full-fidelity export:** Preserve the editable narrative, revisions, accepted event history, characters, inventories, maps, lore, memories/summaries, relevant configuration and any necessary supported plugin data to reconstruct a playable adventure. Exact format is not selected here.
- **Confirmed deletion:** Require clear confirmation before permanently removing an adventure.
- **Credential exclusion:** Never include provider API keys, passwords, authentication tokens or similar secrets in exports.

## Proposed behaviour
Provide an adventure library with Create, Resume, Rename, Duplicate, Import, Export and Delete actions. Autosave narrative progress and corresponding game state consistently, including safe handling of draft edits and interrupted writes. Treat the exported save as a restorable adventure package, not just a plain-text story. Include model/provider selections and nonsecret settings if relevant, but exclude credentials and reconnect secrets locally after import.

## Alternatives and trade-offs
Portable JSON archives and SQLite-based export are possibilities for full-fidelity saves; neither is chosen yet. A plain-text or Markdown story export may be offered additionally for reading/sharing, but cannot replace the full playable-state export. Autosave frequency, backup retention and recovery design remain open.

## Architecture integration (2026-10-17)
- All adventures are durably stored in **Go-managed SQLite on the computer's filesystem** for **Wails v3 headless localhost Go server delivery only**, with play through the normal browser. Browser-owned storage is not the source of truth.
- Save, resume, duplicate, import and export must operate through Wails Go persistence services. The TypeScript frontend sends typed requests and renders outcomes; Go applies atomic database operations.
- **One shared SQLite library database is selected** (IDEA-0051). Exporting one adventure must extract just that adventure's complete history, relevant relationships and durable plugin state, rather than exporting all other adventures. The precise portable archive format is **not yet decided**; preserve revisions/event history, stable IDs, migrations, import validation and credential exclusion.

## Dependencies and constraints
- Depends on filesystem-backed SQLite via Go, transaction-safe storage, stable IDs and event/document revision history.
- Duplication within the shared library database must assign a distinct adventure identity, preserve necessary internal references and avoid sharing unintended mutable canonical state with the source adventure.
- Saving a narrative turn and its accepted state events must have consistent recovery semantics after interruptions.
- Export/import must not leak provider credentials, local authentication details or secrets stored in provider profiles.
- Full-fidelity restoration may depend on optional plugins being installed and on compatible schema versions; missing extensions should be handled explicitly.
- Exported model/provider configurations may be informative even if the specified model is not available on another machine; portability does not guarantee model availability.

## Open questions
- How should imports reconcile schema versions, ID collisions and missing or incompatible plugins?
- Which portable format and archive schema should represent a fully restorable adventure?
- How should autosave recover unsaved draft edits if the browser closes or storage is exhausted?
- Should deletion be immediately permanent after confirmation, or provide an optional recovery period?
- What should happen when an imported save references an unavailable provider or local model?

## Draft acceptance criteria
- [ ] A player can create, name, reopen and resume multiple distinct adventures.
- [ ] Committed story changes and their world-state effects are durably autosaved together.
- [ ] Pending edits have an explicit safe-recovery policy; interruptions do not corrupt the last committed save.
- [ ] Renaming an adventure preserves its story and world-state data.
- [ ] Duplicating an adventure creates an independently editable/playable copy.
- [ ] A full-fidelity **single-adventure export** extracts only the target adventure's supported narrative, state, history and dependencies from the **shared SQLite library database**, without exporting unrelated adventures.
- [ ] Importing a valid compatible export restores an independently resumable adventure.
- [ ] Exports never contain provider API keys, passwords, tokens or other stored credentials.
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
- 2026-10-17 — **Accepted IDEA-0051 layout dependency:** The user chose **Option A: one SQLite database for all adventures**. This idea's separate-adventure save/duplicate/export requirements now apply to **logically isolated adventures inside that shared database**; individual exports must filter to the selected adventure. No file format, restore-collision policy or production status change is approved here.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user** for staging: multiple independent adventures, autosave, resume, rename, duplicate, import, full-fidelity export, confirmed deletion and no credential export. This acceptance authorises refinement, not production or implementation.
