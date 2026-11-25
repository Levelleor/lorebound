---
id: PRD-0006
type: prd
status: accepted
related:
- NOTE-0021
- PRD-0001
- NOTE-0009
- NOTE-0011
---

# Adventure Save and Export Management

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0005](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Adventure%20Save%20and%20Export%20Management.md) · origin: mixed; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S02**. First milestone: **M7**. Delivery: **PARTIAL**.

- Requirement coverage: [Seven scoped draft requirements](../work/items/STORY-0016-shared-latest-story-composer-draft.md); [DEV-003F generated-passage drafts](../work/items/STORY-0019-accepted-generated-passage-editing.md) verified/merged in PR #16; authored drafts verified/merged in DEV-003G PR #17; other modes and full library lifecycle remain later
- Evidence: [PR #13](https://github.com/Levelleor/lorebound/pull/13), confirmed merged

## Goals

Create, list and reopen independent named or untitled adventures. Use stable identity, latest noncanonical input and passage drafts, and safe independent Forks. Provide deliberate rename/delete/duplicate/export and supported restore with epoch fencing and no overwriting or leaking across saves. Blank creation/resume, draft and Fork coverage is bounded; the full lifecycle is open.

## Current accepted architecture after 2026-10-28 redirection

**Latest current-only adventure save semantics:** [B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md), B3-D04 and B4-D05. An adventure stores one current passage/event history as **declarative fact assertions** and deterministic Turn-0 replay; forks/duplicates copy that **current** history prefix independently, not a lineage of old narrative revisions. Do not reject a saved assertion for lack of prior fictional custody, route or item-introduction proof; sparse IDs are allowed. Preserve whole-library SQLite backup/restore and atomicity; staging never implies a shipped export/import feature.


## Accepted direction
- **Multiple independent adventures:** A player can create and manage multiple separate saved stories **inside one shared SQLite library database** (IDEA-0051). Adventures have stable separate identities and do not share canonical narrative/world state by default.
- **Autosave, with two distinct persistence states (explicitly accepted):** Autosave **unfinished player input and prose edits as noncanonical drafts** in the same Go-managed SQLite library after a short inactivity pause; restore those drafts when the browser/editor is reopened. Draft saves must **not** create accepted turns, canonical story revisions, world events or expensive history reconstruction. **Committed turns and confirmed story revisions** persist separately and atomically with all validated state/event changes. Do not require a manual Save button for ordinary committed progress.
- **Resume:** Reopen an adventure at its last reliably saved state.
- **Rename:** Change an adventure's display name without altering its contents.
- **Full-history duplication (explicitly accepted):** Duplicating an adventure creates a **new, independent adventure** with its own adventure identity and an exact copy of the **entire committed history up to the duplication point**, not just the latest turn or current world state. Preserve every accepted story turn, versioned prose and revision lineage, event/state change, baseline, entity, lore/knowledge, memory/summary data, relevant nonsecret configuration and persistent plugin/module state necessary to reconstruct/play the duplicate. All copied references and provenance must remain coherent within the new adventure. **Do not copy unfinished player input or unconfirmed prose-edit drafts**, nor provider credentials. Both adventures continue independently after duplication.
- **Database import/restore (revised accepted workflow):** Importing a **whole-library SQLite snapshot** intentionally **replaces the currently active SQLite database**. It does **not** merge an adventure into the existing library. Earlier single-adventure import language has been superseded by IDEA-0051/0052.
- **Full-library backup only:** Backup creates a **consistent SQLite snapshot of the complete shared database**, including every adventure, editable narrative and revisions, event history, world state, lore, memories and persistent plugin state. **Individual-adventure file exports are explicitly excluded**, superseding the earlier scope.
- **Maintenance boundary for backup/restore (2026-10-23):** The Go service enters an **exclusive library write fence** before either operation, quiesces accepted transactions and requests all connected browsers to cancel direct AI requests/streams, without needing all tabs to cooperate for write safety. During maintenance neither canonical writes nor draft autosaves can mutate the library. Restore replaces the whole database and invalidates old library sessions/epochs; a stale tab cannot write even if a restored adventure revision equals the old one. Backup resumes normal operations after a consistent snapshot, but canceled AI attempts remain discarded. This is a storage-maintenance protocol, not an ordinary multi-tab editing lock, a fresh narrative validation pass or a new backup format.
- **Confirmed permanent deletion (explicitly accepted):** After a clear user confirmation, permanently delete **only the selected adventure** and its associated story turns, text revisions, accepted events/world state, entity records, lore/memory, saved drafts, plugin-owned records and other adventure-scoped SQLite data. Perform the related deletes as **one atomic SQLite transaction** so failures cannot leave half-deleted data. **No recycle bin, soft delete, undo window, delayed cleanup or automatic pre-deletion backup** is required; other adventures and the shared database remain intact. A previously created **whole-database snapshot** is the only planned recovery route, and restoring it replaces the entire current library.
- **Credential exclusion:** Never include provider API keys, passwords, authentication tokens or similar secrets in exports.

## Dependencies and constraints
- Depends on the **shared filesystem-backed SQLite database** via Go, with per-user OS app-data default and optional custom directory (IDEA-0051), transaction-safe storage, stable IDs and event/document revision history.
- Duplication **within the same shared SQLite database** must create a **distinct adventure identity**, copy complete accepted canonical story/revision/event/state and relevant lore/plugin history, and preserve coherent **internal source/event/entity/revision references** in the copy. The exact ID-remapping strategy (new identifiers versus correctly scoped existing identifiers) is an implementation choice; never allow copied records to point to mutable source-adventure data inadvertently. **Do not carry over pending noncanonical drafts**. Use a coherent atomic copy operation so a failure does not leave a partially populated duplicate.
- Saving a narrative turn, its accepted story revision and validated state events must be **one atomic committed operation**. An interrupted/failed model request, rejected action or failed commit **must not partially mutate canonical state**; keep the last saved player draft available for retry and show save/failure status. A few characters typed since the last debounce may remain unsaved if the process ends abruptly; do not promise synchronous per-keystroke durability.
- Whole-database SQLite snapshots must not leak provider credentials, passwords or tokens. Store such secrets **outside** the library database included in the snapshot; restoring does not automatically restore third-party secrets.
- Full-fidelity restoration may depend on optional plugins being installed and on compatible schema versions; missing extensions should be handled explicitly.
- Exported model/provider configurations may be informative even if the specified model is not available on another machine; portability does not guarantee model availability.

## Open questions
- What minimal compatible-SQLite checks and Go connection close/reopen procedure should govern whole-database replacement? **Accepted additional safety:** before Backup/Restore, enforce Go-wide write fencing and request browser model aborts; on Restore, invalidate old library session epochs without any multi-tab coordination requirement.
- How prominently should the UI explain that **Restore Database replaces every adventure** currently saved, without introducing a merge or selective restore feature?
- **Canonical multi-tab policy resolved:** Use expected-version optimistic concurrency for **canonical commits**, not exclusive editor locks. For **drafts**, use one replaceable saved draft per logical editing target. What short debounce interval, editor focus/blur handling, draft save indicator, stale-canonical-work reconciliation UX, and draft-retirement behaviour on successful commit are needed? The **latest successfully stored draft per target**, not earlier overwritten drafts, is recoverable; disk-full/write failures must be visible.
- When exactly should a completed/committed turn retire its source draft, and how should failed generation/commit and interrupted submissions retain or restore player input?
- **Resolved:** Deletion is **permanent immediately after confirmation** with **no** trash, retention period, or automatic backup. Which concise confirmation wording and Go/SQLite adventure-scoped deletion API should be used remains a UI/implementation detail.
- What happens when a whole-library restore references providers or plugins unavailable in the current installation? No automatic model/plugin installation is implied.

## Supporting detail

See [NOTE-0021](../knowledge/inbox/NOTE-0021-prd-0006-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
