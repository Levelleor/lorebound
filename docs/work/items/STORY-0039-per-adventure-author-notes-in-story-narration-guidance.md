---
id: STORY-0039
type: story
status: implemented
parent: PRD-0026
depends_on:
- STORY-0031
priority: 2
related:
- PRD-0026
- PRD-0025
- PRD-0021
- PRD-0020
- STORY-0005
- STORY-0030
- STORY-0031
---

# Per-adventure author notes in Story narration guidance

## Outcome

Persist one optional freeform author-notes field per adventure and send it on every local Story Generate/Retry as separate narration guidance, in a documented fixed order after the current narration settings, with the transmitted text inspectable.

This is the first bounded slice of [STORY-0005](STORY-0005-lorebook-author-notes-context-budget-and-derived-memory.md) and of accepted [IDEA-0025 / PRD-0026](../../product/PRD-0026-author-notes-and-persistent-story-instructions.md). Broader IDEA-0025 delivery is not inferred: global notes, scene-scoped notes, scenario-template directions, different per-task-role instruction sections and the token-budgeted context builder/inspector (IDEA-0024) remain out of this slice.

## Scope and boundaries

| Field | Detail |
| --- | --- |
| In scope | One optional per-adventure author-notes text field: persisted in the Go/SQLite library, editable in the existing narration shelf, sent on every local Story Generate/Retry as its own guidance section, and shown in the existing generation inspector as the text actually transmitted. |
| Out of scope | Global and scene-scoped note layers, template-derived starting directions, Lorebook entries, memory/summary context selection, token-budget measurement/selection reporting, extra pipeline roles, note-conflict arbitration, narration-style preset management. |
| Authority | Notes steer generated prose only. They are not turns, passages, Lorebook facts or world-state operations, and they cannot create, overwrite or relax any authoritative state. |
| Precedent | Deliberately mirrors the accepted current-adventure narration-settings slice ([STORY-0030](STORY-0030-current-adventure-narration-settings.md)): separate per-adventure metadata row, own monotonic revision, epoch fencing, browser read/save, database format upgrade and independent Fork copy. |

## Acceptance criteria

| ID | Observable acceptance | Evidence expected |
| --- | --- | --- |
| IDEA-0025/R01 (saved notes) | Each adventure can store one optional author-notes string (freeform, up to 4000 Unicode code points, valid UTF-8). It persists per adventure across browser and process restart; a new adventure defaults to empty. Saving notes creates no accepted turn, passage, story revision, world event or draft, and leaves the adventure snapshot, version and composer draft unchanged. Ordinary narration style remains separately stored and separately revisable. | Go store read/save pairs with a dedicated revision; additive SQLite format upgrade; browser check that saving notes leaves the story snapshot and composer input unchanged. |
| IDEA-0025/R02 (every narration turn) | Every local Story Generate and Retry reads the then-current persisted notes immediately before building the request, so a cross-tab change applies to the next attempt. Nonempty notes are transmitted as their own labelled section, in one documented deterministic order that places them after the current narration settings and before accepted history; empty notes add no text at all. Notes never alter accepted history, provider decoding parameters or the retry/pipeline selection. | Prompt-assembly unit tests for both empty and populated notes on all five supported local server kinds, completed and streamed; browser check inspecting the real request body. |
| IDEA-0025/R03 (inspectable transmission) | The in-flight generation diagnostic captures the exact notes text sent with that attempt and the inspector shows it in a clearly labelled author-notes section, distinct from style guidance, including an explicit empty state when none were sent. A captured attempt keeps its snapshot when notes are edited later. No token count, capacity, budget or "fits the context" claim is displayed or invented. | Inspector component and diagnostics contract; browser check of populated, empty and edited-after-attempt states. |
| IDEA-0025/R04 (validation, fencing, fork) | Save and read use a monotonically increasing per-adventure revision with optimistic concurrency: a stale expected revision is rejected with a visible non-destructive error that retains the player's text and allows an identical retry without consuming a revision, while an identical-value save is an idempotent success. Epoch mismatch and unknown adventure are rejected. Strict validation rejects unknown fields, non-strings, invalid Unicode and oversized text in both Go and TypeScript. Unreadable or invalid notes fail visibly before provider submission and leave the player's input intact; Stop during a notes read prevents late submission. An atomic Fork copies the source adventure's current notes into independently owned metadata and later edits in either adventure never affect the other. The additive format-7→8 upgrade preserves existing canon, drafts, profiles and epoch, and a failed upgrade rolls back. | Go store tests for strict validation, conflict/idempotent retry, epoch and not-found, upgrade/rollback and fork independence; TypeScript validation tests; browser checks for conflict retention, read failure and Stop. |
| IDEA-0025/R05 (scope honesty) | The delivered surface shows only a current-adventure author-notes field and its transmitted text. No global-notes, scene-notes, template-direction, preset-library, priority-ordering or automatic conflict-resolution control is presented as available, and no document or UI claims IDEA-0025, IDEA-0024 or IDEA-0021 is fully delivered. | UI label/wording review plus documentation update that records this bounded slice and the remaining IDEA-0025 scope. |

## Verification plan

- Preserve every registered gate in `.agentctl/checks.yaml`; add gates rather than weaken them.
- `gate-06-go-sqlite` covers the new store read/save/upgrade/fork tests.
- `gate-04-typescript-unit` covers prompt-assembly order and validation tests.
- `gate-07-browser-host` covers the shelf save/reload, real request body, inspector transmission and unchanged-story behaviour, and must be extended for the notes surface.
- Do not claim provider-side adherence, token capacity, or unimplemented note layers as verified.

## Risks and blockers

None outstanding for this bounded slice. Remaining IDEA-0025 scope (global/scene layers, template directions, per-role instruction sections) and IDEA-0024 token-budget measurement stay with [STORY-0005](STORY-0005-lorebook-author-notes-context-budget-and-derived-memory.md) and [STORY-0036](STORY-0036-narration-guidance-remaining-context-and-mode-integration.md).

## Notes

### N001
Implemented STORY-0039 bounded author-notes slice: Go/SQLite format 8 adds author_notes (per-adventure revision/epoch, 4000 code-point UTF-8 validation, idempotent identical save, fork copy), service ReadAuthorNotes/SaveAuthorNotes, TS authorNotes validation/guidance, narrator prompt order style-then-notes-then-history, generation diagnostics + inspector section, and the Author notes field in the existing narration shelf. Added Go/TS/browser tests and extended process-restart state; docs record the bounded IDEA-0025 slice and remaining global/scene/template/per-role/token-budget scope.

### N002
Discovery: the new author-notes browser check brings the normal Firefox/Chromium suite to ~215s inside gate-07's 300s timeout. Also, a Svelte <details open={error}> attribute reset closed the notes disclosure on reactive summary updates; switched to bind:open with a notesOpen flag. Existing upgrade-simulation tests (undo/narration/draft/connections/authored-edit) drop newer tables when downgrading user_version, so they now drop author_notes and the expected table count is 10.

### N003
Evidence at implementation handoff: agentctl verify exit 0 with all 7 gates passing, including the new Go author-notes tests, TS author-notes prompt/validation tests, browser request/inspector/conflict/read-failure/Stop checks and exact process-restart notes state. Task was deliberately not marked complete and no PR was created.

### N004
Review accepted in round 1: STORY-0039 is satisfied in the working tree. R01/R04: `internal/store/author_notes.go` adds a per-adventure `author_notes` table with its own monotonic revision, epoch/not-found fencing, strict JSON/field/UTF-8/4000-code-point validation, idempotent identical-value saves, and format-8 additive upgrade; `author_notes_test.go` covers isolation from story/draft/narration, reopen persistence, invalid wire shapes, injected-failure rollback, v7→v8 upgrade/rollback preserving canon, drafts, profiles and epoch, and atomic Fork copy with independent later edits (`fork.go` copies notes inside the same transaction). Narration style remains a separate table with its own revision, and unchanged-style saves add no revision. R02/R03: `models.ts` composes one deterministic system message — base prompt, narration style guidance, then the labelled author-notes section — before the separate accepted-history message and player input; empty/whitespace notes add nothing and no decoding parameters change. `GenerationDetails.authorNotes` captures the exact notes snapshot per attempt, and `GenerationInspector.svelte` shows a distinct "Author notes" section with an explicit empty state and no token/capacity claims. `authorNotes.test.ts` covers all five local server kinds (completed and streamed), ordering, body keys, captured snapshots, empty/absent notes, and pre-provider rejection; `check-author-notes.mjs` exercises the real shelf save/reload, unchanged canon/version/composer draft, real request body order, empty/edited-after-attempt inspector states, stale-conflict and uncertain-save retention, read-failure/invalid-notes fencing, Stop during the notes read, Retry freshness and responsive layouts. R05: UI wording and `docs/development.md` explicitly record the bounded current-adventure slice and leave global/scene notes, template directions, per-role sections, arbitration and IDEA-0024 token budgeting undelivered. Gate 01–07 receipts pass, including the new author-notes browser exercise.
