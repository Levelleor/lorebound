---
type: development-evidence
status: implemented-unmerged
created: "2026-11-03"
updated: "2026-11-03"
task: "DEV-002A"
---

# DEV-002A — Production adventure creation and resume

The user explicitly redirected this launch from DEV-001 to the first bounded production replacement. This child replaces the Gate 0 test UI/service/schema with actual blank adventure creation/list/resume. It does not deliver generated Story turns or complete any whole IDEA. No merge is authorised.

Base main: `79263d647698b86c821badd0194e8299aea23105`. Branch: `feat/dev-002a-adventure-foundation`. PR: [#4](https://github.com/Levelleor/lorebound/pull/4), open draft. Implementation reviewed at `7abe54f050eedabc2a0891f88057274ff0d9b271`. CI: initial validation failed; corrected workflow awaiting rerun. Main remains the earlier Gate 0 baseline until an authorised merge and reconciliation.

## Scoped requirement traceability

The [parent draft](../requirements/DEV-002.md) preserves 95 proposed atomic records for seven IDEAs; its entire inventory is not yet independently certified. This child specifically implements:

| Accepted source / requirement | Actual source / test evidence | Scope and status |
| --- | --- | --- |
| IDEA-0006/R01; [B5-D01](../../architecture/decisions/B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md): unnamed, characterless, model-free independent blank adventure | `frontend/src/lib/library.ts:prepareCreate`, `LibraryService.Create`, `TestAdventureDurabilityAndIsolation`, browser keyboard blank-creation case | IMPLEMENTED / UNMERGED; no fake turn or world defaults |
| IDEA-0006/R02; B5-D01: identity and minimal baseline atomically durable | `internal/store/store.go:create`, `TestCreationFailuresLeaveNoPartialAdventure`, `TestStorageFailureAndCancelledRequest` | IMPLEMENTED / UNMERGED; failed receipt rolls back with adventure |
| IDEA-0006/R03; [B5-D09](../../architecture/decisions/B5-D09%20-%20Resume%20Blank%20Adventures%20Without%20Automatic%20Generation.md): visible/resumable zero-turn stories | `List`, `Read`, URL stable adventure selection; browser/process restart tests | IMPLEMENTED / UNMERGED; no automatic AI or opening |
| IDEA-0051/R01/R04/R06/R07/R08 subsets; B3-D02/B4-D03: shared SQLite, idempotency, coherent read and technical integrity | `TestConcurrentDuplicateCreationAndEpochFencing`, `TestReadsAndUnsupportedLibraryFailClosed`, real bridge/browser tests | PARTIAL: adventure creation/read only; passage/event commits, expected-version edits, restore and full library lifecycle remain later |
| IDEA-0053/R01–R05 subsets: headless Wails, narrow Go services, local-only operation and browser restrictions | server build, real Firefox, hostile Origin/Host/preflight/WebSocket checks | PARTIAL: no launcher handoff/auto-open/Quit/packaging or hostile-local-process authentication claim |
| Command Citadel VIS-01–07/09, for implemented surfaces | `appearance.css`, actual screenshot/geometry checks at 390/768/1024/1440 | Entry/blank reader/empty rail only; no fake functional composer or settings |

No row is marked VERIFIED before passing CI, independent review and merge. Requirements for generated prose, passages/events, stale canonical edits and replay belong to later children.

## Executed evidence

Local environment: Linux `7.2.11-arch1-1` x86_64; Go `1.27.3-X:nodwarf5`; Node `24.14.0`; npm `11.9.0`; real Playwright Firefox. Node was explicitly added to PATH. Go checks use a disposable writable build cache (`GOCACHE=/tmp/lorebound-dev002a-go-cache`). All test databases are temporary and no player library is used.

| Gate | Status | Actual command / observed result |
| --- | --- | --- |
| Frontend check | PASS | `npm --prefix frontend run check`: zero errors/warnings |
| Static frontend / server build | PASS | `npm --prefix frontend run build`; `CGO_ENABLED=0 go build -tags server -o bin/lorebound .` |
| TypeScript contract | PASS | `npm --prefix frontend run test:unit`: defaults/empty baseline and invalid host-response cases |
| Go static / real SQLite tests | PASS | `CGO_ENABLED=0 go vet -tags server ./...`; `CGO_ENABLED=0 go test -count=1 -tags server -v ./...`: five test functions plus ten invalid/conflict cases |
| Real Wails/browser/Go/SQLite | PASS | `LOREBOUND_ARTIFACT_DIR=/tmp/dev002a-browser-evidence bash scripts/verify-host.sh`: keyboard creation, browser reload, exact two-adventure state across process restart |
| Failure / recovery | PASS | Real commit with simulated HTTP success-response loss, same-request Retry after library refresh, wrong-epoch rejection; SQL rollback/read-only/cancel/retry and eight concurrent duplicate requests |
| Visual / responsive | PASS for implemented surfaces | Real Firefox screenshots in Dark/Bright test states at four widths; 48px header, max 672px reader, 320px desktop rail and no horizontal overflow; mobile Story/World switch |
| Browser-request restrictions | PASS | Same-origin 200; hostile Origin/fetch metadata/Host/WebSocket 403; preflight 405 |
| GitHub Actions | FAIL (initial validation); corrected rerun pending | [Initial run](https://github.com/Levelleor/lorebound/actions/runs/41772890446) had no jobs; invalid job-level runner context corrected |
| Independent review | PASS (source/local scope) | [Independent report](./DEV-002A-review.md): reran storage/frontend/build/browser on port 18081; both regressions, restart and screenshots pass; CI remains separate |
| Windows/macOS runtime/packaging | NOT RUN | No cross-platform runtime claim |
| Live AI / spatial migrations | N/A | No provider or spatial functionality in this child |

## Review and limits

- Reviewer found uncertain-create Retry disappearing after refresh and stale responses overriding newer navigation. Both are corrected; browser regressions cover the exact triggers. Final lead browser rerun passes both regressions; independent source/local sign-off is recorded in the linked report.
- Initial response-loss fixture did not interrupt the runtime's exported method, so its run failed waiting for an error. The fixture now lets the actual HTTP request commit and aborts only the response; no mocked database replaces the real integration.
- Screenshots use the approved local font fallback stacks when Cormorant/IBM Plex are unavailable. Bright root tokens are exercised directly; there is no appearance-settings control yet. The source's unchanged warm gradient is retained across themes.
- Production default data path and optional `-data-dir` are implemented; complete single-instance launcher/port fallback/browser opening/Quit and Windows/macOS verification remain future host work. No Gate 0 database is migrated or erased.
- Library creation has no existing adventure version to overwrite; uniqueness and epoch/idempotency guards apply. Expected-version passage/history edits are expressly not certified by this creation-only slice.
- B9-D12 remains DEFERRED with no spatial migration design/code/tests. Original 52 IDEAs remain production notes; none is archived as fully implemented.

## Retained visual evidence

Real Firefox captures from the final passing local run: [desktop adventure](./DEV-002A/adventure-dark-1440.png), [mobile adventure](./DEV-002A/adventure-dark-390.png), [Bright mobile adventure](./DEV-002A/adventure-bright-390.png), [mobile library](./DEV-002A/library-dark-390.png). All four widths and both test themes are also emitted by the CI artifact recipe.

Final local browser command exited 0, including `PASS: delayed adventure read cannot override newer Back navigation` and `PASS: fresh browser after process restart resumes both exact zero-turn adventure identities`. Independent reviewer inspected the retained visual states and reran the full browser suite separately with exit 0.
