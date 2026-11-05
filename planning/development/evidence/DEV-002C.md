---
type: development-evidence
status: local-pass-ci-pending-unmerged
created: "2026-11-05"
updated: "2026-11-05"
task: "DEV-002C"
branch: "feat/dev-002c-story-integration"
base_commit: "899678ad80adc2489ccd84502688a2e8357d6474"
---

# DEV-002C — Story-loop integration and parent verification

**Local implementation, full required runtime checks and independent review PASS; CI pending, unmerged.** User explicitly authorised “Launch DEV-002C” on 2026-11-05. [Parent requirement reconciliation](./DEV-002C-requirements.md), [independent review](./DEV-002C-review.md), [task control](../TASKS.md#dev-002c--story-loop-integration-and-parent-verification). Publication reference will be recorded once created. Main remains `899678ad80adc2489ccd84502688a2e8357d6474`, merged DEV-002A/B plus PR #7 documentation.

## Behavior and source changes

Cross-tab/focus notifications used to be discarded while generation, candidate review, a save or another refresh was in progress. A tab could therefore remain on old history after Stop/Discard. The coordinator now retains a coalesced refresh request and performs an authoritative read at the next safe idle boundary. A hint arriving during a read causes a following coherent read. Input remains editable during refresh; Generate is visibly disabled and the header says “Refreshing…”. Pending candidates and uncertain commit payloads remain unchanged.

Background `requestRefresh()` and deliberate blocked-state `refresh()` have distinct purposes. An automatic hint cannot unlock a technical rejection or erase its explanation; the player uses Reload. Stale-conflict recovery serializes its internal refetch so a focus hint cannot replace its sequence and hide the conflict. Later reads preserve the visible conflict and retained player text until a new decision. Notifications never become canonical state, never silently regenerate/rebase/resubmit and never bypass Go version/epoch checks.

Changes are limited to the browser coordinator/Story workspace, targeted tests, task evidence and the user-requested persistent development-style preference. New/directly affected TypeScript follows the personal-development-style skill, including Allman braces and readable control flow. Go storage/schema/wire contracts are unchanged. No new gameplay capability, dependency or spatial migration is introduced.

## Executed verification

Linux x86_64; Node 24.14.0, Go 1.27.3, Playwright Firefox from the locked dependency. Node PATH: `/home/alex/.nvm/versions/node/v24.14.0/bin`; writable lead Go cache `/tmp/lorebound-dev002c-go-cache`. Real host runs used isolated temporary libraries (lead port 18080, reviewer 18081); no user database or live AI. The simulated continuation remains the existing fixed fixture.

| Gate | Result | Actual method and retained evidence |
| --- | --- | --- |
| Build/typecheck | PASS | `bash scripts/build.sh`: locked frontend install, Svelte check 0 errors/warnings, static build, real `CGO_ENABLED=0 go build -tags server`; [output](./DEV-002C/build.log). Reviewer independently ran typecheck. |
| TypeScript unit | PASS, 23 individual cases | `node --test --test-isolation=none frontend/tests/*.test.ts`; [output](./DEV-002C/typescript-tests.log). Seven DEV-002C regressions plus existing 16. Provider/storage unit fixtures are simulated. |
| Real SQLite contracts | PASS, 14 top-level functions / 43 subcases | `CGO_ENABLED=0 go test -count=1 -tags server -v ./...`; [output](./DEV-002C/sqlite-tests.log). Atomic rollback, identity, malformed payload, concurrent reads/writes, receipt/epoch and durable reopen retained. Lead/reviewer `go vet -tags server ./...` passed. |
| Real Wails/Go/SQLite and Firefox | PASS | `LOREBOUND_ARTIFACT_DIR=/tmp/dev002c-browser-evidence bash scripts/verify-host.sh`; [final lead output](./DEV-002C/browser.log). Real UI, host and durable writes; HTTP fault interception is explicitly labelled. |
| Failure/recovery | PASS | Stop/Discard/navigation/tab-close leave canon untouched; consecutive other-tab commits during delayed read drain to newest history; failed post-commit Read retries identical request; lost receipt recovered after newer commit; failed stale-conflict read blocks then deliberate Reload recovers retained text. Reviewer-found conflict/refetch and technical-rejection diagnostic races have deterministic unit regressions. |
| Browser/process persistence | PASS | Close the last tab with a provisional candidate, reopen to exact accepted history; then stop/restart host and fresh browser compares exact full library/snapshots. Other adventure remains unchanged. |
| Visual/responsive/accessibility | PASS, implemented scope | Existing real 390/768/1024/1440 Dark/Bright geometry, no-overflow and keyboard acceptance; new keyboard Discard, disabled Generate while refreshing and recovery states. Lead/reviewer inspected screenshots. Reduced-motion CSS is source-inspected; full appearance settings/accessibility audit remain later. |
| Security/platform | PASS / NOT RUN | Real Host/Origin/fetch-metadata/preflight/WebSocket rejections; safe literal prose and no external requests across all opened tabs. Windows/macOS runtime/packaging NOT RUN; host restrictions are not hostile-local-process authentication. |
| Independent review | PASS, scoped | [Report](./DEV-002C-review.md); independent 23 TS cases, typecheck, Go tests/vet and separate full browser/restart [output](./DEV-002C/independent-browser.log). Two initial source findings corrected. |
| GitHub CI | PENDING | Required final-head build/unit/SQLite/browser/restart workflow will be linked after publication. No CI PASS inferred from local results. |

Screenshots: [mobile pending keyboard focus](./DEV-002C/story-proposed-dark-390.png), [Bright desktop proposal](./DEV-002C/story-proposed-bright-1440.png), [input retained after queued refresh](./DEV-002C/story-refresh-retained-input.png), [post-commit read failure](./DEV-002C/story-post-commit-read-failure.png), [failed conflict reload](./DEV-002C/story-conflict-read-failure.png). Full width/theme set is produced in CI artifacts. Named font fallback and full appearance-control limits remain unchanged.

## Findings, evidence history and parent gate

The initial unit run exposed an older test assuming Discard did not trigger a queued read; it now waits for that asynchronous work. Initial browser execution hit sandbox loopback EPERM and was rerun through the normal reviewed escalation. Git's host SSH configuration permission error was resolved by using the existing SSH identity with `ssh -F /dev/null`. Temporary agent usage limits interrupted review; resumed review and actual passing checks, not the interrupted attempts, support this report. The first full browser pass preceded reviewer fixes; the final lead and independent passes above use the corrected source.

All 57 parent rows mentioning First now have explicit evidence/disposition. The 38 Later-only rows remain assigned to later tasks. Nonempty event-envelope/source/reducer obligations remain PARTIAL, including IDEA-0039/R02/R07 and IDEA-0040/R04. C-D06 permits the bounded zero-effects Story parent to close after its applicable gates, without certifying those broader event features. Formal merged per-row count remains three IDEA-0006 rows; seven whole ideas remain PARTIAL and zero are complete. No original IDEA was archived or promoted into implemented specs.

**Remaining gate:** final-head CI and separate merge authorisation. DEV-002/DEV-002C are not VERIFIED & MERGED until the PR actually lands. DEV-003 is only the subsequent candidate, never started by this launch. Live providers, other modes, nonempty world effects, full history editing/drafts, Quick Start, backup/restore, full host lifecycle and B9-D12 spatial migration remain outside scope.
