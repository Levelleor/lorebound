# Gate 0 developer setup

Gate 0 is a reusable technical host and SQLite foundation. It stores only a test record; no story features or player library exist yet.

Requirements: Go 1.27+, Node 24+, npm, and an ordinary browser. The player process is the Go binary. Node is only build and test tooling. The dependency versions are pinned in `go.mod`/`go.sum` and `frontend/package-lock.json`.

From the repository root:

```sh
bash scripts/build-gate0.sh
bash scripts/run-gate0.sh
```

Open `http://127.0.0.1:8080` in a browser. The host binds only to `127.0.0.1`; the script uses the ignored `.gate0/gate0.db` test database. To use a different port, set `GATE0_PORT`. Do not point `-data-dir` at an existing player library. The host refuses a non-loopback `WAILS_SERVER_HOST` override.

Repeat the checks:

```sh
CGO_ENABLED=0 go test -tags server -v ./...
GATE0_PORT=18080 bash scripts/verify-host.sh
```

The host check needs `curl`, Playwright's Firefox binary (`cd frontend && npx playwright install firefox`), and a free port. It creates and removes its own temporary database. The native desktop build is outside this server-only scope; use the `server` tag for Go builds and tests. `frontend/node_modules`, `frontend/build`, `bin` and `.gate0` are generated and ignored by Git.
