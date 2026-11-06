---
type: development-evidence
status: local-checks-pass-unmerged
created: "2026-11-05"
updated: "2026-11-05"
task: "DEV-003A"
branch: "feat/dev-003a-provisional-retry"
baseline_commit: "34f25a0fa841827b0b4486106e411c9d28bad2ab"
---

# DEV-003A — Provisional Story Retry evidence

**Lead checks and independent review PASS; publication in progress, unmerged.** This extends the existing simulated Story-only, zero-world-effects loop with replacement of the current provisional candidate. It does not complete DEV-003, IDEA-0004, durable drafts, committed Undo/Fork or historical editing. [Accepted-source audit and stable requirement IDs](../requirements/DEV-003.md); [independent review](./DEV-003A-review.md). Main remains at the previous seven partial ideas and three formally certified atomic rows.

## What changed

`frontend/src/lib/coordinator.ts` adds a ready-candidate-only `retry()` operation and shares candidate preparation with initial generation. Preparation advances the attempt sequence, aborts any preceding request and clears the old candidate before processing a replacement. Errors preserve input and canon; Stop/disposal fence late results. Only a live validated candidate may Accept. Saving and uncertain receipt recovery cannot be replaced by generation Retry; stale version/epoch still rejects atomically and refetches without automatic resubmission.

`frontend/src/lib/StoryWorkspace.svelte` puts Retry in the existing Accept/Discard overlay, disabled during saving/uncertainty. Keyboard focus moves to Stop during replacement, then to Accept or retained input. The simulation deliberately returns the same prose; Retry creates a new candidate identity, not an invented provider or promised textual variation. No Go, SQLite schema, persisted variant archive or wire contract changed.

## Executed checks — Linux, Node 24.14.0, Go 1.27.3

All host tests use their own disposable SQLite directory. No user adventure library is accessed. Environment and exact observed outputs are retained in [DEV-003A](./DEV-003A/).

| Gate | Result | Actual command / evidence |
| --- | --- | --- |
| Typecheck | PASS | `npm --prefix frontend run check`: zero errors/warnings. [Log](./DEV-003A/typecheck.log). |
| Production frontend/host build | PASS | `npm --prefix frontend run build`; `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-go-cache go build -tags server -o bin/lorebound .`. [Frontend log](./DEV-003A/frontend-build.log); real binary used below. |
| TypeScript contracts | PASS | `node --test --test-isolation=none frontend/tests/*.test.ts`: 30 individual cases (23 prior + 7 Retry), zero failures/skips. [Log](./DEV-003A/typescript-tests.log). Generator/storage fixtures are simulated. |
| SQLite contracts | PASS | `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-go-cache go test -count=1 -tags server -v ./...`: 14 functions, 43 subcases. Actual SQLite. [Log](./DEV-003A/sqlite-tests.log). |
| Go static checks | PASS | `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-go-cache go vet -tags server ./...`, exit 0. [Log](./DEV-003A/go-vet.log). |
| Real host/browser/reopen | PASS | `LOREBOUND_PORT=18083 LOREBOUND_ARTIFACT_DIR=/tmp/lorebound-dev-003a-evidence bash scripts/verify-host.sh`, exit 0. Real Firefox → Wails → Go → SQLite, exact history after host/browser restart. [Log](./DEV-003A/host-smoke.log). |
| Failure/concurrency | PASS, scoped | Unit replacement failure/malformed output, abort-ignoring resolve/reject after Stop, disposal, refresh and version/epoch guards; browser Stop/reload, stale cross-tab replacement, lost real save response and identical request recovery. No live provider failure is claimed. |
| Visual/responsive/keyboard | PASS, scoped | Eight actual proposed-state captures at 390/768/1024/1440 in Dark/Bright. Asserted 48px header, ≤672px reader, 320px desktop rail, docked composer, no overflow and visible keyboard Retry; inspected 390 Dark/1440 Bright images. |
| Host security | PASS, scoped | Same-origin runtime succeeds; cross-origin runtime/WS, cross-site fetch, rebound Host and cross-origin preflight denied by existing host checks. No new privileged service. |
| Independent review | PASS, scoped | [Review](./DEV-003A-review.md): accepted-source/diff audit, 30 units and separate complete real-host run. [Independent runtime log](./DEV-003A/independent-host-smoke.log). |
| Publication CI / merge | PENDING / NOT MERGED | User authorised publication on 2026-11-05; actual PR/CI results will be linked after execution. |
| Windows/macOS / live AI | NOT RUN | No packaging/provider changes; outside this bounded Linux simulated slice. |

## Requirement-to-evidence map

- **IDEA-0004/R01–R02, bounded zero-effects portion:** unit immediate invalidation/repeated replacement/latest-only acceptance; `check-story-retry.mjs` and `check-story.mjs` assert replacement IDs differ, old IDs are absent from real SQLite, and only the last candidate survives acceptance/reload/exact process reopen. No nonempty event reducer claim.
- **R03–R04:** replacement errors/invalid output preserve committed history and input; Stop fences late resolve/reject even after a newer candidate is ready; disposal publishes no late state. Actual keyboard Retry immediately removes the prior proposed section, Stop retains input, and page reload abandons the in-flight replacement without writing or pretending durable draft recovery.
- **R05:** calls during saving/uncertain/blocked/refreshing/idle cannot replace a candidate. Unit and real-browser lost-response recovery reuse the identical request. Retrying a stale tab remains based on the earlier snapshot and is atomically rejected/refetched on acceptance, with input and conflict feedback retained.
- **R06–R12 and broader parent obligations:** later/unimplemented as enumerated in the audit. No full IDEA archival or formal main certification.

## Reproduction and limits

On this machine prepend `/home/alex/.nvm/versions/node/v24.14.0/bin` to PATH. Installed pinned frontend dependencies were reused. The sandboxed default Node process-isolation run reported only file wrappers; the recorded no-isolation command explicitly enumerated all 30 cases. Initial Go test/vet attempts omitted the repository's `CGO_ENABLED=0` setting and failed on unavailable WebKit development packages; corrected headless commands above passed. The sandbox blocked loopback binding, so the authorised disposable-host run used an approved escalation.

Screenshots: [390 Dark](./DEV-003A/story-proposed-dark-390.png), [768 Dark](./DEV-003A/story-proposed-dark-768.png), [1024 Dark](./DEV-003A/story-proposed-dark-1024.png), [1440 Dark](./DEV-003A/story-proposed-dark-1440.png), [390 Bright](./DEV-003A/story-proposed-bright-390.png), [768 Bright](./DEV-003A/story-proposed-bright-768.png), [1024 Bright](./DEV-003A/story-proposed-bright-1024.png), [1440 Bright](./DEV-003A/story-proposed-bright-1440.png). These verify the scoped Retry surface, not full product visual/accessibility conformance. Bright retains the existing source-contract gradient; no appearance redesign was attempted.

B9-D12 remains deferred. Reviewed source identity is recorded in the independent report. Publication is authorised; CI evidence and exact published commit will be recorded after execution. This remains an unmerged implementation claim.
