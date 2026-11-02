---
type: architecture
status: verified-gate-0
created: "2026-11-01"
updated: "2026-11-01"
tags:
  - planning/architecture
  - pass-c
  - implementation-evidence
---

# Gate 0 execution evidence

This records the separately authorised minimum host/storage implementation against [the Gate 0 packet](Pass%20C%20-%20Gate%200%20Host%20Verification%20Authorisation%20Packet%20%28Proposed%29.md). It verifies a disposable technical test record, not the full production requirements of IDEA-0053 or IDEA-0051. Both original notes remain in `planning/production/`; the other 50 original ideas remain in staging. No current application spec or spatial migration was created.

## Environment and commands

- Host: Arch Linux, x86_64, kernel 7.2.11-arch1-1.
- Go: `go1.27.3-X:nodwarf5 linux/amd64`; Wails module `github.com/wailsapp/wails/v3 v3.1.0`, actual Wails log `mode=server` and `-tags=server`.
- Node `v24.14.0`, npm `11.9.0`; SvelteKit `3.1.1`; Vite `8.3.5`.
- SQLite: pure Go `modernc.org/sqlite v1.61.1`, embedded SQLite engine `3.54.1` (measured by `SELECT sqlite_version()`).
- Browser: Playwright `1.64.1` Firefox `157.0` headless, real browser process. The system Firefox 159.0 one-shot screenshot ran too early to establish client rendering, so the wait-based Playwright check is the browser evidence.
- Build: `npm --prefix frontend ci`, `npm --prefix frontend run check`, `npm --prefix frontend run build`, `CGO_ENABLED=0 go build -tags server -o bin/lorebound-gate0 .`.
- Launch: `./bin/lorebound-gate0 -data-dir .gate0 -port 18080` (manual live test); repeatable verification launches the same binary with an isolated temporary `-data-dir`.
- Tests: `CGO_ENABLED=0 go test -tags server -v ./...`; `PATH=/home/alex/.nvm/versions/node/v24.14.0/bin:$PATH bash scripts/verify-host.sh` on this host.

## Results

| ID | Result | Method | Observed evidence |
| --- | --- | --- | --- |
| G0-01 | PASS | `CGO_ENABLED=0 go build -tags server`; launch binary; `ss -ltn` | Wails v3.1.0 logged `Server mode enabled` and `Server mode starting address=127.0.0.1:18080`; listener only at `127.0.0.1:18080`. |
| G0-02 | PASS | `npm run build`; `curl` plus real Firefox page load | SvelteKit static adapter wrote `frontend/build`; Wails returned HTTP 200 for `/`, `/_app/immutable/...` assets and `/wails/runtime.js`; browser loaded the UI. |
| G0-03 | PASS | `npm --prefix frontend run test:browser` within `scripts/verify-host.sh` | Browser displayed `Connected to Lorebound Gate 0 (schema 1)` from a Wails `Ping` call; its `Read` and `Commit` calls saved and displayed `Record version 1: browser-committed`. |
| G0-04 | PASS | `ss` and `scripts/verify-host.sh` | Loopback-only listener; same-origin runtime returned 200; hostile Origin, cross-site fetch metadata, rebound Host and cross-origin WebSocket returned 403; hostile preflight returned 405. |
| G0-05 | PASS | Real `modernc.org/sqlite` `go test -tags server -v ./...`; browser test | Transaction committed/read back `version=1 value="committed"`; browser write/read also succeeded. |
| G0-06 | PASS | Same Go test | Duplicate returned replay without a second increment; reused ID with changed request returned `operation_id_conflict`; stale version returned `stale_version`; wrong epoch returned `wrong_epoch`. |
| G0-07 | PASS | Same Go test with injected failure after SQL update and before operation insert/commit | Transaction error left `version=1 value="committed"`; no partial updated value was visible. |
| G0-08 | PASS | Same Go test, closing and reopening the database file | `reopen: epoch=<same> version=1 value="committed"`; browser reload also read its prior commit. |

Critical output excerpts from the successful runs:

```text
same-origin runtime: HTTP 200
{"name":"Lorebound Gate 0","schemaVersion":1}
cross-origin runtime: HTTP 403
cross-site fetch metadata: HTTP 403
cross-origin preflight: HTTP 405
rebound Host: HTTP 403
cross-origin WebSocket: HTTP 403
browser service response: Connected to Lorebound Gate 0 (schema 1)
browser commit: Record version 1: browser-committed
browser reload: Record version 1: browser-committed
operation ID reuse rejected: operation_id_conflict
stale version rejected: stale_version
wrong epoch rejected: wrong_epoch
rollback: version=1 value="committed"
reopen: epoch=e5c8268c2d32493e90ee7edd8b66af5c version=1 value="committed"
```

`WAILS_SERVER_HOST=0.0.0.0 ./bin/lorebound-gate0 -data-dir /tmp/lorebound-gate0-override -port 18080` exited before listening with `WAILS_SERVER_HOST must remain 127.0.0.1`. A plain `go test ./...` tried the unsupported desktop/WebView build and failed because this host lacks `webkitgtk-6.0`; the required `CGO_ENABLED=0 go test -tags server -v ./...` passed. This is not a failure of the selected server-mode runtime.

`npm ci` reported four low-severity advisories in build/test dependencies; `npm audit --omit=dev --json` reported zero runtime dependency advisories. Node packages are absent from the player executable.

## Limits and next dependency

The default Wails origin/Host policy rejects the tested hostile browser requests, but local clients that omit browser headers can call the narrow test-record service. This Gate 0 process has no credentials, arbitrary file access, story library or AI transport endpoint. The policy has not been proven against hostile local processes or every CSRF/DNS-rebinding variant; harden and retest the boundary before adding sensitive privileged methods. Cross-platform packaging, default browser opening, complete library schema, backup/restore and Story mode remain later work. The next planning action is a narrow Story-mode slice readiness review with the exact original staging ideas and separate promotion/development approvals.
