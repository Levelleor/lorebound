# Lorebound development

This branch extends blank adventure creation/resume with a bounded Story-only path: type prose, generate a visibly simulated continuation, then explicitly accept or discard it. The continuation is a deterministic fixed fixture; no AI provider is connected. Acceptance saves two structured passages together in the Go-owned SQLite library. Rename/delete, live providers, world tracking, history edits, backup/restore and full host lifecycle remain later slices; see [DEV-002B](../planning/development/TASKS.md#dev-002b--first-provisional-and-accepted-story-turn-next) and [NOW](../planning/development/NOW.md) for branch versus merged status.

Use Go 1.27.3 (`go.mod`), Node 24.14.0 and npm for development. Node is not a player runtime dependency. Dependencies are locked in `go.sum` and `frontend/package-lock.json`.

```sh
bash scripts/build.sh
bash scripts/run.sh
```

Open `http://127.0.0.1:8080`. The Wails server binds only to `127.0.0.1`. By default it opens or creates `Lorebound/lorebound.db` under the per-user application-data directory: Windows AppData, macOS Application Support, or Linux `${XDG_DATA_HOME:-~/.local/share}`. `-data-dir /chosen/directory` selects a different existing-or-empty library; it never copies or migrates the previous library. `-port 18080` changes the listening port. No Gate 0 test database is imported.

The current host is launched/stopped from the terminal. Automatic browser launching, second-launch handoff, port fallback and Settings → Quit are still future work. Host/Origin restrictions are browser-request precautions, not authentication of arbitrary local processes. No credentials or provider traffic are introduced by this slice.

Run checks from the repository root:

```sh
bash scripts/build.sh
npm --prefix frontend run test:unit
CGO_ENABLED=0 go vet -tags server ./...
CGO_ENABLED=0 go test -count=1 -tags server -v ./...
(cd frontend && npx --no-install playwright install --with-deps firefox)
LOREBOUND_ARTIFACT_DIR=/tmp/lorebound-evidence bash scripts/verify-host.sh
```

Build the frontend before Go checks because the binary embeds `frontend/build`. On systems with Firefox's libraries already installed, `npx --no-install playwright install firefox` suffices; `--with-deps` may need package-manager permission. Use `-tags server`; native WebView/desktop packaging is outside this application architecture.

The smoke script requires curl, Node, Firefox and a free loopback port (`LOREBOUND_PORT`, default 18080). It refuses an occupied port and creates/removes its own temporary library, never the default user library. It verifies rejected cross-origin/rebound requests, real browser creation/resume, Story Stop/Discard/acceptance, exact structured histories across browser/process restart, simulated lost responses after actual SQLite creation/Story commits, identical-request recovery, two-tab stale-write rejection and a delayed-read navigation race. An intercepted incompatible-history response separately exercises the read-only UI; Go tests verify actual stored unsupported effects. It saves responsive screenshots at 390/768/1024/1440px in Dark/Bright test states. Bright styling is exercised through the root appearance attribute; a player-facing appearance selector is not implemented yet. Font stacks use the approved serif/sans/mono fallbacks when the named fonts are not installed; no external font fetch is required.

The [Verify workflow](../.github/workflows/verify.yml) runs these commands for pull requests and main pushes on Ubuntu 24.04, with pinned runtime/action versions, read-only repository permission and bounded jobs. Missing browser dependencies or a failed check fail the job. Logs/screenshots are retained for seven days in `headless-verification-<attempt>`; databases are not uploaded. A recipe is not a passing result: actual evidence is recorded in [DEV-002B](../planning/development/evidence/DEV-002B.md).

The database retains the library epoch, adventure identity/title/version and an empty versioned Turn-0 baseline. Schema 2 adds ordered turns and distinct authored/generated passages with one current structured JSON body each. Paragraph/text/hard-break nodes serialize deterministically; each passage supports up to 20,000 Unicode codepoints (including line/paragraph separators), 1,000 paragraphs and 2,000 inline nodes. Input is not HTML or Markdown. Empty world-effect batches are valid; this slice accepts no nonempty effects. Unknown stored effects preserve readable prose but block further writes.

Wire version 2 rejects older clients; the baseline remains version 1. Opening a DEV-002A schema-1 library atomically adds the nonspatial Story tables, preserving existing adventures, baselines, epoch and original creation receipts. Unsupported libraries fail without replacement. **B9-D12 spatial migration remains deferred.** No old passage revisions or replay checkpoints are stored.

TypeScript prepares the complete turn and reconstructs current history. `LibraryService.Commit` technically validates IDs/order/documents, expected version and epoch before one SQLite transaction saves the turn, passages, version and receipt. Story operation IDs are scoped to an adventure. Identical retry returns the original result even after later commits; changed payload reuse rejects. The browser then refetches current canon. A save with an uncertain outcome blocks new submissions until recovery; a stale submission refetches and retains live authored input for a fresh decision. Only accepted history survives closing the browser; unsaved text and provisional candidates are not durable drafts.
