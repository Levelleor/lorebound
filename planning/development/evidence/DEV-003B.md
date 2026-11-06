---
type: development-evidence
status: implemented-unmerged
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003B"
---

# DEV-003B — Independent committed Story-prefix Fork evidence

**Implementation and independent review PASS locally; [PR #12](https://github.com/Levelleor/lorebound/pull/12) OPEN; publication CI pending at record write. Unmerged work does not change verified-main counts.** Scope: [requirements](../requirements/DEV-003B.md), IDEA-0011/R01–R08 bounded to currently supported Story-only zero-effects history. No full original IDEA certification or archival. Merge/finalisation requires the user's verbal approval of the primary PR.

## Result and ownership

An explicit **Fork story** action opens a focus-managed dialog listing accepted turns. Create copies exactly the complete current prefix through the selected turn and its Turn-0 baseline into a distinct adventure, then opens a coherent current read. It appears independently in the ordinary library. Source/fork future appends are isolated. Unsent input/provisional candidates and source operation receipts are not copied. The UI blocks Fork during generating/pending/saving/uncertain/read-only Story states.

TypeScript prepares the immutable request and validates the returned prefix/replays current history. Go validates the technical format, source version/epoch and history and atomically copies independent SQLite rows with a lightweight receipt. Adventure-scoped stable turn/passage IDs are preserved; no new schema or migration is needed. A stale request is rejected with no destination and requires closing/refetching and deliberate new confirmation. An uncertain result locks request/IDs; Recover fork repeats that request, resolves the original receipt and refetches the destination's current state. Disposed async work cannot navigate to a late result.

## Executed lead gates

Linux, Node 24.14.0, Go 1.27.3-X:nodwarf5, Playwright Firefox; disposable libraries only. Node is under `/home/alex/.nvm/versions/node/v24.14.0/bin`; Go uses `CGO_ENABLED=0` and server build tags. No live model or user library is involved.

| Gate | Result | Exact command / evidence |
| --- | --- | --- |
| Svelte/TS | PASS: zero errors/warnings | `npm --prefix frontend run check`; [log](./DEV-003B/frontend-check.log) |
| Frontend build | PASS | `npm --prefix frontend run build`; [log](./DEV-003B/frontend-build.log) |
| Real host build | PASS | `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-dev003b-go-cache go build -tags server -o bin/lorebound .` |
| TypeScript contracts/lifecycle | PASS: 36 cases, including six Fork cases | `node --test --test-isolation=none frontend/tests/*.test.ts`; [log](./DEV-003B/ts-test.log) |
| Real Go/SQLite | PASS: 19 functions / 62 named nested cases | `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-dev003b-go-cache go test -count=1 -tags server -v ./...`; [log](./DEV-003B/go-test.log) |
| Go static checks | PASS | `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-dev003b-go-cache go vet -tags server ./...` |
| Real browser/bridge/SQLite and restart | PASS | `LOREBOUND_PORT=18085 LOREBOUND_ARTIFACT_DIR=/tmp/lorebound-dev003b-lead bash scripts/verify-host.sh`; [log](./DEV-003B/host-smoke.log) |
| Visual/responsive | PASS: 390/768/1024/1440, Dark/Bright | Eight [Fork images](./DEV-003B/); lead inspected Dark 390 and Bright 1440, automation checks bounds, 90vh maximum and keyboard wrap. Existing shell/reader/composer regressions rerun. |
| Host restrictions | PASS | Same-origin runtime; cross-origin runtime, fetch metadata, preflight, Host and WebSocket rejection in the real host suite |
| Independent review | PASS for bounded scope | Reviewer `/root/fork_review` independently audited accepted requirements/source, reran units/Go/typecheck/real browser/restart and held-request focus probe; [report and final source hashes](./DEV-003B-review.md) |
| PR final-head CI | NOT RUN (result not yet observed at record write) | [PR #12 checks](https://github.com/Levelleor/lorebound/pull/12/checks); implementation source `085e53fb3fe6207e3cc506947f217b036b78399c`. Actual current-head result must be inspected before closure/merge. |
| Windows/macOS/live models | NOT RUN (outside bounded scope) | No packaging or provider claim |

## Integrity and recovery coverage

- Real SQLite: first/interior/latest turn; complete structured prefix, baseline and stable references; source unchanged; independent future appends to both adventures; close/reopen exact reads. Copied records and receipts are independent.
- Reject stale/wrong/empty epoch, malformed/old wire, unsafe version, baseline/missing/provisional/passage boundary, missing/same source, existing destination, invalid IDs/title and operation payload misuse. Cross-kind append/Fork/creation operation reuse is rejected within the source adventure. Source corruption/nonempty unsupported effects fail closed.
- Inject failure after copy and before receipt: no destination or receipt survives; the same request can then succeed. Concurrent identical Fork/source append yields one exact prefix or stale rejection, never a partial/mixed copy. Receipt recovery after source and destination advance returns original result; epoch is checked before receipt.
- TypeScript simulated storage fixtures: frozen same-request lost-response recovery, destination-current refetch, failed/mismatched read and receipt, stale/epoch rejection without rebase, single flight and disposal. These are mock tests, distinct from real SQLite/browser proof.
- Real Firefox: keyboard dialog focus/Escape/restoration; Fork unavailable for provisional work; select interior boundary; screenshot eight sizes/themes; interrupt only the response after real SQLite copy; exact same-request recovery and one library entry; accepted prefix contains no unsent input; ordinary library resume and independent subsequent Story acceptance; concurrent source advance rejects Fork, then explicit close/refetch shows current turns. The full existing Story/Retry/recovery/security suite and fresh-process exact-history comparison pass.

## Findings corrected and limits

The first storage draft used separate kind namespaces; independent review required sharing the adventure-scoped operation namespace so Fork/append cannot reuse one logical ID. First real UI run found focus was lost when immediate refresh disabled the action; close now refreshes before restoring focus. The next run exposed native-only Firefox focus wrap failing the required keyboard cycle; an explicit forward/reverse Tab boundary loop now passes. Reviewer additionally held the real copy response and found all-disabled saving focus could leave the dialog; phase updates now focus the dialog during saving, Recover during uncertainty and Cancel after rejection, with disposed/stale-update guards. The final real suite verifies held-request Tab/Shift+Tab containment and Recover focus. Failed runs are not counted as passing evidence. The default Go cache rejected writes; `/tmp` cache was used for successful lead build/test/vet runs.

Full world events, Lorebook/entities/relationships, memory, plugin data and rename/edit/delete integration remain later features; unsupported state is rejected rather than silently copied incompletely. Shared durable drafts, editor undo, committed Undo, historical edits, export/backup, live models and packaging remain outside this child. **B9-D12 remains DEFERRED — NO WORK.** Three formally certified IDEA-0006 rows and zero whole-IDEA completions remain unchanged.
