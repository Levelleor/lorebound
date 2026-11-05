---
type: development-evidence
status: locally-verified-unmerged
created: "2026-11-04"
updated: "2026-11-04"
task: "DEV-002B"
branch: "feat/dev-002b-story-turn"
base_commit: "858806acc15aa54350af11535e59a8d82e73b7a5"
---

# DEV-002B — First provisional and accepted Story turn

**Local implementation and independent verification PASS; branch UNMERGED, final-head CI pending.** The user explicitly authorised DEV-002B on 2026-11-04. This is one bounded task, not a full IDEA completion or DEV-002C launch. [Prerequisite audit](./DEV-002B-requirements-audit.md), [independent review](./DEV-002B-review.md), [task acceptance](../TASKS.md#dev-002b--first-provisional-and-accepted-story-turn-next) and [parent inventory](../requirements/DEV-002.md).

## Implemented scope and contracts

The actual app accepts characterless multiline Story input, runs a visibly **simulated deterministic fixed continuation**, displays both authored/generated passages provisionally, and supports Stop, Discard and explicit Accept. Only acceptance calls the real Wails `LibraryService.Commit` and atomically saves the ordered turn, two distinct structured passages, empty event batch, version and receipt. It does not call a live AI model or claim generative quality.

TypeScript owns structured document preparation, candidate lifecycle and pure reconstruction from the durable empty Turn-0 baseline/current turns. Paragraphs, text and hard breaks roundtrip; literal HTML stays text. Go owns technical schema/identity/order/reference/version/epoch validation and the SQLite transaction. Reads include baseline, current passages/events and version in one transaction. There are no revision archives, persisted replay checkpoints, fabricated entities or competing world store.

Story receipts use an adventure-scoped operation key and immutable request fingerprint. Identical retry returns the original result even after later commits; altered payload reuse rejects. A receipt is followed by a current authoritative read. Uncertain writes retain the original request and block new submissions until recovery. Stale/version or epoch conflicts refetch and retain live authored input for a fresh decision, with no automatic rebase/resubmit. Idle focus/BroadcastChannel hints refetch without treating messages as canon or swallowing typing. Disposed/stopped generation ignores late results; cancellation cannot undo an already durable write.

Wire version **2** intentionally rejects old blank-only readers. Baseline version remains **1**. The atomic **nonspatial** database v1→v2 extension adds Story tables while preserving existing blank adventures, baseline, epoch and creation receipts. Unsupported libraries are not replaced. B9-D12 spatial migration remains deferred.

## Requirement traceability and evidence limits

Rows below are **branch-scoped tested behaviour**, not newly VERIFIED main requirements. Exactly three earlier IDEA-0006 rows remain verified on merged main; the 95-row parent inventory retains broader unreviewed/Later obligations.

| Requirements | Tested scope | Source / executed evidence |
| --- | --- | --- |
| IDEA-0002/R01–R03; IDEA-0044/R01–R03/R10–R12 | Characterless Story, explicit simulated generation and acceptance, natural-prose provider input, no fictional veto or network | `coordinator.ts`; named lifecycle/unit cases; real `check-story.mjs` generation/discard/accept flow; R10–R12 are first-slice boundary subsets only |
| IDEA-0002/R04–R07 | Multiline docked Story composer, accessible send/Stop/Accept/Discard, truthful blue/green states, four-width Dark/Bright geometry/focus | `StoryWorkspace.svelte`, `appearance.css`; browser screenshots and assertions |
| IDEA-0040/R01–R03; R04 source subset | Distinct stable authored/generated passage IDs in one turn; structured current JSON, paragraph/hard-break roundtrip and safe text rendering | `story.ts`, `story.go`; structured-document unit cases; `TestStoryAtomicDurabilityAndOriginalReceipt`; browser exact reopen |
| IDEA-0039/R01/R03–R06; R02/R07 contract subset | Ordered current zero-effects history; pure reconstruction; provisional isolation; unknown core effects block writes and preserve readable prose | Pure replay/cancellation tests; `TestUnknownStoredEventsPreserveReadableHistoryAndBlockAppend`; simulated incompatible-read browser fixture |
| IDEA-0044/R04/R05/R07–R09 | Failure/cancellation, late replies, stale/epoch refetch, unchanged uncertain retry, coherent current state, refresh typing | Named coordinator unit cases; real lost-response and two-tab browser scenarios; corrected delayed-refresh test |
| IDEA-0051/R01–R08 | Adventure isolation, typed one-call append, real transaction/receipt rollback, scoped idempotency, stale races, coherent read, reopen | `internal/store/story_test.go` (9 new top-level functions); actual Firefox/Wails/Go/SQLite browser/restart |
| IDEA-0006/R04/R09/R11 and IDEA-0053/R01–R05/R10/R15 subsets | Baseline protection/no invented actor, host/storage authority, no provider prerequisite, tab/process persistence, browser restrictions and responsive controls | Existing blank tests retained; Story suite; actual Host/Origin/preflight/WebSocket checks; no full host lifecycle/platform claim |

**No supported nonempty world-event reducer is implemented.** `EventEnvelope` defines the future typed boundary and stored unknown effects are retained for safe failure, but this slice accepts only `events: []`. Empty arrays cannot prove supported world-event roundtrip, reduction or source association: IDEA-0039/R02/R07 and the event-association part of IDEA-0040/R04 remain partial. Optional-plugin compatibility is not implemented. No whole IDEA is archived or fully VERIFIED.

## Executed verification

Linux, Node **24.14.0**, Go **1.27.3**, real Playwright Firefox; Node added to PATH. Lead cache `/tmp/lorebound-dev002b-go-cache`, reviewer cache `/tmp/lorebound-dev002b-review-go-cache`. All databases were temporary. No user library or live model was used. The execution host restarted during verification; the incomplete pending run was not counted, and the final build/browser/restart run was repeated successfully afterward.

| Gate | Result | Actual method / evidence |
| --- | --- | --- |
| Build/typecheck | PASS | `npm --prefix frontend run build`, `npm --prefix frontend run check` (0 errors/warnings), `CGO_ENABLED=0 go build -tags server -o bin/lorebound .`; `go vet -tags server ./...` |
| TypeScript unit | PASS, 16 cases | `node --test --test-isolation=none frontend/tests/*.test.ts`; [retained output](./DEV-002B/typescript-tests.log). Provider/storage fixtures explicitly simulated |
| SQLite contracts | PASS, 14 top-level functions / 43 subcases | `CGO_ENABLED=0 go test -count=1 -tags server -v ./...`; [retained output](./DEV-002B/sqlite-tests.log). Includes rollback, original receipt, concurrent writes/read consistency, malformed payloads, old-client rejection, upgrade success/failure and scoped IDs |
| Real Wails/Go/SQLite + browser | PASS | `LOREBOUND_ARTIFACT_DIR=/tmp/dev002b-browser-evidence bash scripts/verify-host.sh`; [lead output](./DEV-002B/browser.log), disposable port 18080 |
| Failure/recovery | PASS | Real commit followed by deliberately dropped response, same-payload recovery with no duplicate; two real browser tabs reject stale acceptance; Stop/Discard preserve durable state. Provider failure and abort-ignoring late replies are unit fixtures |
| Browser/process restart | PASS | Fresh browser after host restart compares exact library identity, versions, both passage documents/IDs/order and empty effects; unrelated blank adventure remains blank |
| Visual/responsive | PASS, scoped | Real 390/768/1024/1440 Dark/Bright screenshots; 48px header, ≤672px reader, 320px rail, fixed composer, no horizontal overflow, mobile view switch and keyboard focus/acceptance |
| Security/platform | PASS / NOT RUN | Origin/Host/fetch-metadata/preflight/WebSocket rejection and literal-HTML-as-text pass; Windows/macOS runtime and packaging NOT RUN |
| Independent review | PASS, scoped | [Source/test review](./DEV-002B-review.md), fresh independent unit/Go/check/vet; separate real browser run on port 18081; [independent output](./DEV-002B/independent-browser.log) |
| GitHub CI | PENDING | Inspect final task PR head before merge; local passing evidence is not CI evidence |

Representative screenshots: [mobile proposed/focus](./DEV-002B/story-proposed-dark-390.png), [desktop proposed](./DEV-002B/story-proposed-dark-1440.png), [mobile accepted](./DEV-002B/story-accepted-dark-390.png), [Bright desktop accepted](./DEV-002B/story-accepted-bright-1440.png), [uncertain save](./DEV-002B/story-save-unconfirmed.png), [stale-tab conflict](./DEV-002B/story-conflict.png). Full width/theme matrix is generated by the CI artifact workflow. Approved font fallback stacks remain in use; the full appearance-settings UI is later work.

## Review corrections and limitations

Independent review identified and verified corrections for input lost during background refresh, globally scoped Story operation IDs and a misleading “Not saved” label during uncertain saves. The lead also made creation receipt recovery refetch current history. The first browser pass exposed a test-only focus-visible assumption; actual Tab/Shift+Tab now exercises keyboard focus. An ineffective runtime-method replacement fixture was replaced with explicit HTTP interception and a fixture-hit assertion. The final complete run passed.

Live providers, streaming configuration, nonempty world effects, map, Do/Say/Continue, candidate Retry, Undo/Fork/history editing, durable drafts, full Quick Start, backup/restore and platform lifecycle remain outside this task. Unsaved input/candidates are not promised to survive tab closure. The simulated response is a fixed fixture. Document bounds are technical (20,000 codepoints per passage, 1,000 paragraphs, 2,000 inline nodes), not a complete editor feature. **No spatial migration work.**

**Next action:** publish/review the feature PR and verify its final-head CI. Merge requires separate user authorisation; DEV-002C has not started.
