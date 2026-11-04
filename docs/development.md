# Lorebound development

The current production slice creates and resumes independent blank adventures in a Go-owned SQLite library. The former Gate 0 test-record service and screen have been replaced. Story writing/generation, rename/delete, backup/restore and full host lifecycle are later slices; see [the task record](../planning/development/TASKS.md#dev-002a--production-blank-adventure-creation-and-resume).

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

The smoke script requires curl, Node, Firefox and a free loopback port (`LOREBOUND_PORT`, default 18080). It refuses an occupied port and creates/removes its own temporary library, never the default user library. It verifies rejected cross-origin/rebound requests, real browser creation/resume, exact persisted IDs across host restart, a simulated lost response after an actual SQLite commit, safe identical-request recovery, and a delayed-read navigation race. It saves responsive screenshots at 390/768/1024/1440px in Dark/Bright test states. Bright styling is exercised through the root appearance attribute; a player-facing appearance selector is not implemented yet. Font stacks use the approved serif/sans/mono fallbacks when the named fonts are not installed; no external font fetch is required.

The [Verify workflow](../.github/workflows/verify.yml) runs these commands for pull requests and main pushes on Ubuntu 24.04, with pinned runtime/action versions, read-only repository permission and bounded jobs. Missing browser dependencies or a failed check fail the job. Logs/screenshots are retained for seven days in `headless-verification-<attempt>`; databases are not uploaded. A recipe is not a passing result: actual evidence is recorded in [DEV-002A](../planning/development/evidence/DEV-002A.md).

The database contains the library epoch, adventure identity/title/version, an empty versioned Turn-0 baseline and idempotent creation receipts. The baseline is not a story passage or a replay checkpoint. TypeScript prepares IDs/defaults; Go checks technical constraints and commits adventure/baseline/receipt atomically. Reusing an operation ID with changed payload fails, and a receipt from an old epoch cannot bypass the epoch guard. No existing library schema is migrated, especially no deferred B9-D12 spatial migration.
