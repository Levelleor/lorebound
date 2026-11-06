# Lorebound development

Merged main extends blank adventure creation/resume with a bounded Story-only path: type prose, generate a visibly simulated continuation, then explicitly accept or discard it. The continuation is a deterministic fixed fixture; no AI provider is connected. Acceptance saves two structured passages together in the Go-owned SQLite library. Rename/delete, live providers, world tracking, history edits, backup/restore and full host lifecycle remain later slices; see [DEV-002B](../planning/development/TASKS.md#dev-002b--first-provisional-and-accepted-story-turn-merged) and [NOW](../planning/development/NOW.md) for merged evidence and current task status.

Use Go 1.27.3 (`go.mod`), Node from [.nvmrc](../.nvmrc) and npm for development. Node is not a player runtime dependency. Dependencies are locked in `go.sum` and `frontend/package-lock.json`.

From the repository root, build the current checkout and launch a review session with one command:

```sh
bash scripts/dev.sh
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080). The command installs locked frontend dependencies, checks/builds the frontend and Go host, and runs that build in the foreground. Stop with Ctrl+C. It uses **`.local/review/lorebound.db`**, an ignored review library separate from the regular app-data library. Review stories survive stopping/restarting; the launcher never clears or seeds them. Re-running the command rebuilds current source. If Node/npm are absent from PATH, it also checks the usual NVM installation for the version in `.nvmrc`; missing Go/Node/npm must be installed first.

For a different port, run `bash scripts/dev.sh -port 8081`. Host arguments pass through, including an explicit `-data-dir /chosen/directory` override. The browser is opened manually; automatic browser launch and hot reload are not part of this command. Git Bash or another Bash environment is needed to use these development scripts on Windows.

For everyday use of an **already built binary** with the regular library, use `bash scripts/run.sh` from the repository root. That lower-level command does not rebuild. The host binds only to `127.0.0.1` and defaults to `Lorebound/lorebound.db` under Windows AppData, macOS Application Support, or Linux `${XDG_DATA_HOME:-~/.local/share}`. Changing `-data-dir` selects an existing-or-empty library; it never copies or migrates the previous one. No Gate 0 test database is imported.

Before merge approval, the agent provides a checked running URL or this single launch command and a short walkthrough tailored to the change. The walkthrough states actions, expected results and limitations; user feedback precedes finalise/merge approval. CI handles automated checks separately.

The current host is launched/stopped from the terminal. Automatic browser launching, second-launch handoff, port fallback and Settings → Quit are still future work. Host/Origin restrictions are browser-request precautions, not authentication of arbitrary local processes. No credentials or provider traffic are introduced by this slice.

The [Verify workflow](../.github/workflows/verify.yml) owns repeatable verification for pull requests and main pushes. It checks Markdown file links and rejects generated planning output. Application/tooling changes also run the build, typecheck, unit, real SQLite, Firefox/host/recovery and exact restart suite on Ubuntu 24.04. Documentation-only changes run repository checks; manual workflow dispatch runs the full suite.

Use focused local checks for development/debugging, or this recipe when reproducing the full CI suite. Routine implementation/review/closure does not require every agent to repeat it locally:

```sh
bash scripts/build.sh
python3 scripts/check_repository.py
npm --prefix frontend run test:unit
CGO_ENABLED=0 go vet -tags server ./...
CGO_ENABLED=0 go test -count=1 -tags server -v ./...
(cd frontend && npx --no-install playwright install --with-deps firefox)
bash scripts/verify-host.sh
```

Build the frontend before Go checks because the binary embeds `frontend/build`. On systems with Firefox's libraries already installed, `npx --no-install playwright install firefox` suffices; `--with-deps` may need package-manager permission. Use `-tags server`; native WebView/desktop packaging is outside this application architecture.

The smoke script requires curl, Node, Firefox and a free loopback port (`LOREBOUND_PORT`, default 18080). It refuses an occupied port and creates/removes its own temporary library, never the default user library. It verifies rejected cross-origin/rebound requests, real browser creation/resume, Story Stop/Discard/acceptance, exact structured histories across browser/process restart, simulated lost responses after actual SQLite creation/Story commits, identical-request recovery, two-tab stale-write rejection and a delayed-read navigation race. An intercepted incompatible-history response separately exercises the read-only UI; Go tests verify actual stored unsupported effects. It saves responsive screenshots at 390/768/1024/1440px in Dark/Bright test states. Bright styling is exercised through the root appearance attribute; a player-facing appearance selector is not implemented yet. Font stacks use the approved serif/sans/mono fallbacks when the named fonts are not installed; no external font fetch is required.

Console output stays in Actions job logs. `browser-diagnostics-<attempt>` retains browser captures and failed-host diagnostics for seven days; its upload paths exclude databases. Missing browser dependencies or a failed check fail the job. A recipe is not a passing result: link the actual run and reviewed revision in the PR, with a brief result and limitations. Reuse that result during review instead of duplicating a local suite or copying logs into planning. For a specific local investigation, `LOREBOUND_ARTIFACT_DIR=/tmp/lorebound-artifacts` retains captures and failure diagnostics outside the repository; without it, the smoke script removes its temporary output and library.

The database retains the library epoch, adventure identity/title/version and an empty versioned Turn-0 baseline. Schema 2 adds ordered turns and distinct authored/generated passages with one current structured JSON body each. Paragraph/text/hard-break nodes serialize deterministically; each passage supports up to 20,000 Unicode codepoints (including line/paragraph separators), 1,000 paragraphs and 2,000 inline nodes. Input is not HTML or Markdown. Empty world-effect batches are valid; this slice accepts no nonempty effects. Unknown stored effects preserve readable prose but block further writes.

The current checkout uses wire version 3 and database format 4; the baseline remains version 1. Wire v3 rejects old tabs, and the transactional metadata-only v3→v4 database upgrade fences older binaries that equate concurrency versions with turn counts. Existing baselines, prose, drafts, epoch and receipt rows remain unchanged; old wire-v2 operations are rejected rather than silently upgraded. Opening a DEV-002A schema-1 library atomically adds the nonspatial Story tables, preserving existing adventures, baselines, epoch and original creation receipts. Unsupported libraries fail without replacement. **B9-D12 spatial migration remains deferred.** No old passage revisions or replay checkpoints are stored.

TypeScript prepares the complete turn and reconstructs current history. `LibraryService.Commit` technically validates IDs/order/documents, expected version and epoch before one SQLite transaction saves the turn, passages, version and receipt. Story operation IDs are scoped to an adventure. Identical retry returns the original result even after later commits; changed payload reuse rejects. The browser then refetches current canon. A save with an uncertain outcome blocks new submissions until recovery; a stale submission refetches and retains live authored input for a fresh decision.

DEV-003C adds a separate shared latest Story composer draft in the current checkout. Input autosaves after 600 ms of inactivity; saved input restores on reopen without accepting a turn. Clearing input saves an empty value. Status distinguishes a saved draft from accepted story and offers Retry draft after failure. Generated candidates remain ephemeral, and final unsaved keystrokes can be lost. Acceptance consumes matching saved input atomically; different latest input survives. This uses an additive nonspatial database v2→v3 upgrade, preserving history/identity/receipts; older binaries reject the newer format. [DEV-003C requirements](../planning/development/requirements/DEV-003C.md) and [NOW](../planning/development/NOW.md) own verification and merge status.

Merged DEV-002C PR #8 extends the verification harness with consecutive cross-tab commits during a delayed read, retained input, deferred refresh after Discard, failed post-commit reads, recovery after newer accepted history, failed conflict reload and last-tab closure. Its coordinator queues background hints until safe idle; blocked errors require deliberate Reload. Generate is disabled during authoritative refresh while input remains editable. See [DEV-002C evidence](../planning/development/evidence/DEV-002C.md) for merged verification evidence and the queued next task.

DEV-003E replaces the custom input Undo/Redo from PR #14 with **Undo turn N** below the latest accepted turn. Click it, review the named boundary in the composer overlay, then Confirm Undo or Cancel/Escape. Confirmation permanently removes both passages of that turn, reconstructs the surviving supported history and preserves unfinished input. Repeated Undo reaches the initial baseline; generate/accept can then continue with a different next turn in the same adventure. There is no canonical Redo/archive; Fork first to keep the original future. Ordinary textarea editing and latest draft autosave remain.

Adventure versions are monotonic concurrency tokens, independent of current turn count; Undo increments the version while removing a turn. Append and Undo use the same atomic Go/SQLite Commit/receipt path, guarded by expected version and library epoch. Recover Undo retries the identical operation after an uncertain result, including if another context has already continued. Original append/Fork receipt recovery reads current canon after later Undo without restoring removed content. Nonempty world effects and independent correction/module replay remain unsupported; this covers the complete existing Story-only zero-effects state. [Scope and verification status](../planning/development/requirements/DEV-003E.md), [current review handoff](../planning/development/NOW.md).
