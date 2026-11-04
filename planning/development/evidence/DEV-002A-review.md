---
type: development-review
status: pass-local-ci-pending
created: "2026-11-03"
updated: "2026-11-03"
task: "DEV-002A"
reviewer: "Codex independent_review agent"
reviewed_commit: "7abe54f050eedabc2a0891f88057274ff0d9b271"
---

# DEV-002A independent review

**Independent source and local verification: PASS for the bounded blank-adventure creation/list/resume slice. No unresolved blocking source findings. GitHub Actions was not yet available when this report was written; passing PR CI and applicable merge authorisation remain separate gates.** No complete IDEA or merged-main behaviour is certified by this report.

## Requirements reviewed

Review began from the accepted task and original requirements, not the implementation summary: IDEA-0006 accepted blank/unnamed/no-required-protagonist creation; B5-D01 atomic durable minimal Turn-0 baseline; B5-D09 ordinary visible/resumable zero-turn adventures with no spontaneous generation; IDEA-0051 shared Go-owned SQLite and transaction/isolation boundaries; IDEA-0053 Wails headless ordinary-browser/local-operation boundaries; B3-D02 operation identity and original-result retry; applicable B4-D03 coherent reads; Command Citadel VIS-01–07/09 for implemented surfaces.

The child implements IDEA-0006/R01–R03 and bounded storage/host subsets, not generated Story turns, full editing/replay, Quick Start, provider calls, lifecycle/packaging or backup/restore. The 95-row parent inventory remains explicitly draft/unreviewed as a complete inventory. B9-D12 spatial migration remains deferred with no work. No revision archive, second canonical browser datastore, Go fiction engine, AI proxy or fictitious passage/world content was added.

## Findings and corrections

1. **P2, corrected:** After uncertain creation, a successful library refresh cleared the error while retaining the pending request. This hid Retry and left both title and Start disabled. Recovery now remains visible while a pending request exists, and the header says Creation unconfirmed. The real-browser regression loses only the response after the actual Go/SQLite commit, refreshes the library, then retries unchanged and verifies exactly two adventures.
2. **P2, corrected:** `openAdventure` and `createAdventure` initially applied delayed results after a newer Back navigation because only `load` checked the navigation sequence. All three now share sequence guards before changing current view/address/error/busy state. The real-browser delayed-Read regression confirms Back remains at the library after the older read resolves.
3. **Documentation, corrected:** Deleted Gate 0 launch commands were still presented as current setup. `docs/development.md` now documents the actual runtime/checks; the historical setup page links forward while retaining the Gate 0 evidence link.

No further blocking correctness issue was found in final source. Source remained unchanged during independent browser verification. The working tree was clean at reviewed commit `7abe54f050eedabc2a0891f88057274ff0d9b271`.

## Independent executed evidence

Environment: Linux amd64; Node 24.14.0 at `/home/alex/.nvm/versions/node/v24.14.0/bin`; Go 1.27.3-X:nodwarf5; real Playwright Firefox. Go cache `/tmp/lorebound-dev002a-review-go-cache`; all storage/browser libraries disposable.

| Gate | Status | Actual command/method and observed result |
| --- | --- | --- |
| Frontend typecheck | PASS | `npm --prefix frontend run check`, rerun after UI fixes: 0 errors, 0 warnings |
| TypeScript contract tests | PASS | `npm --prefix frontend run test:unit`; library test file passed with default/blank-baseline and malformed-response cases |
| Real SQLite/storage tests | PASS | `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-dev002a-review-go-cache go test -count=1 -tags server -v ./...`; all five test functions and ten invalid/conflict subcases passed |
| Go static/build | PASS | `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-dev002a-review-go-cache go vet -tags server ./...` and `go build -tags server -o /tmp/lorebound-dev002a-review .` with the same environment |
| Real Wails/browser/Go/SQLite | PASS | `PATH=/home/alex/.nvm/versions/node/v24.14.0/bin:$PATH LOREBOUND_PORT=18081 LOREBOUND_ARTIFACT_DIR=/tmp/dev002a-review-browser bash scripts/verify-host.sh`; exit 0 |
| Browser failure/recovery | PASS | The same independent run passed keyboard blank creation/reload, actual durable commit with simulated lost response, refresh plus unchanged retry without duplication, delayed read across Back, wrong epoch rejection, and fresh browser/process restart with exact two-adventure identity/library data |
| Browser-request restrictions | PASS | Same-origin 200; hostile Origin/fetch metadata/Host/WebSocket 403; preflight 405. These do not authenticate arbitrary hostile local processes |
| Visual/responsive | PASS for implemented surfaces | Independent Firefox produced 12 screenshots: adventure Dark/Bright at 390/768/1024/1440 and library Dark at all four widths. Geometry/no-overflow and mobile Story/World checks passed. Inspected actual desktop/mobile/bright/library images, including independent dark-390 image; no layout/content blocker found |
| Traceability/source integrity | PASS for child scope | 52 unique feature rows exactly match 52 production IDEA IDs; reviewed local Markdown links resolve; `git diff --check` clean; statuses distinguish branch work from main |
| GitHub Actions | NOT RUN by reviewer at report time | PR/CI result must be linked and inspected before claiming mandatory CI completion |
| Windows/macOS runtime/packaging | NOT RUN | No platform verification claim |
| Live AI / spatial migrations | N/A | Outside this child; no provider or spatial work |

Initial sandbox execution refused the loopback probe with `EPERM`; the authorised escalation reran the same script against port 18081 and passed. The refusal was not reported as a product failure or a PASS. Independent screenshots and host logs are under `/tmp/dev002a-review-browser`; databases were removed by the smoke-script cleanup.

## Limits and next action

The named fonts are not bundled; specified local fallback stacks are used when absent. Bright tokens were exercised through a test root attribute, not a shipped appearance control. The source-prescribed warm gradient is retained in Bright. A real story composer, generation, passages/events/replay, rename/delete, durable pending drafts, default-browser launching, instance handoff, port fallback, Settings Quit, cross-platform runtime and full IDEA certification remain later work.

**Recommended next action:** inspect the PR's actual CI results for reviewed source, resolve any failure, then record the PR/evidence in the control files. Do not merge without the required authorisation or start DEV-002B in this launch.

Changed repository files by reviewer: **none**. This report was written only to `/tmp/dev002a-independent-review.md` for lead integration.

## Follow-up review — CI artifact-context correction

Reviewed commit `2496367d2603a83d8f57c2d267dbca2dbc37397e` against the implementation review above. **Workflow/source delta review: PASS; actual CI execution remains pending.** No product source changed and no full test rerun was necessary for this workflow/documentation-only delta.

The job-level artifact variable now uses the literal `/tmp/lorebound-evidence` on the declared Ubuntu runner. The upload action reads that same value through step-level `env.LOREBOUND_ARTIFACT_DIR`. This removes the unavailable job-env `runner` context while preserving the same log/screenshot collection behavior. Independently checked [GitHub's context-availability table](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability): job-level `env` excludes `runner`, and step `with` permits `env`.

The evidence and trackers link open PR #4, retain the initial failed-validation run, and distinguish local/source review PASS from corrected CI pending and unmerged main. Local Markdown link checks for NOW, TASKS, FEATURES, JOURNAL and both DEV-002A evidence/review files all passed; `git diff --check` was clean. One minor handoff cleanup remains for the lead's final tracker update: NOW's Exact next action still says to implement/open the PR even though PR #4 exists; replace it with the actual remaining CI/merge-authorisation action once CI resolves.

Repository files changed by reviewer: **none**. This follow-up does not assert GitHub CI PASS and does not authorise merge or DEV-002B.


## Post-merge provenance note — 2026-11-04 (lead annotation)

The preceding reviewer reports remain historical and retain their original attribution. GitHub now confirms PR #4 merged at `fac5521bfbe7cd63ea3c7b85108b7d1865b678b9`. The lead inspected [final-head CI](https://github.com/Levelleor/lorebound/actions/runs/41838612434), including job steps/logs, for `473a957797ce8ad339435c04aad39592e61525d1`; all required steps passed. The merged tree equals that final head. This annotation does not claim the original reviewer ran later CI.

A fresh independent `/root/merge_audit` agent inspected original IDEA-0006/B5-D01/B5-D09 requirements, source/test coverage, prior review and Git provenance. It supports exactly IDEA-0006/R01–R03 as VERIFIED, with three partial ideas and no whole-IDEA completion. No runtime checks were rerun in that audit. Its documentation-diff review and the lead's reconciliation evidence are recorded in [DEV-002A reconciliation](./DEV-002A-reconciliation.md).
