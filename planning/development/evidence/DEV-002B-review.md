---
type: development-review
status: pass-scoped-review
created: "2026-11-04"
updated: "2026-11-05"
task: "DEV-002B"
reviewer: "Codex requirements_audit and final_review independent reviewers"
base_commit: "858806acc15aa54350af11535e59a8d82e73b7a5"
implementation_commit: "daaff20384d90129e8886293829fa77953a31409"
pr: "https://github.com/Levelleor/lorebound/pull/6"
---

# DEV-002B — Independent implementation review

**PASS for the bounded DEV-002B implementation after corrections, including fresh independent real browser verification.** Final-head GitHub CI and merge authorisation remain separate gates. Reviewed the uncommitted DEV-002B implementation against the original accepted requirements and [independent prerequisite audit](./DEV-002B-requirements-audit.md), rather than relying on the implementation summary. The reviewer authored no application code or tests. This report is the reviewer's only file change during implementation review.

## Scope and source assessment

Inspected new `story.ts`, `coordinator.ts`, `StoryWorkspace.svelte`, `internal/store/story.go`, their tests and browser scenario, plus the changes to library/host types, route, appearance CSS, store/service, existing tests, development controls and browser harness. This is a Story-only, explicitly simulated generation path with distinct authored/generated structured passages and zero supported world effects. It does not implement a live model, general world reducer, full Custom Opening/Quick Start, editing/Undo/Fork, durable draft autosave or spatial migrations.

The reviewed design follows C-D04/C-D06, B2-D03/D05/D08, B3-D01/D02/D04/D05, B4-D03 and the visual contract: TypeScript prepares and reconstructs, Go technically validates and commits through one SQLite transaction, current structured bodies have stable identities without revision archives, and reads hold one snapshot transaction across baseline/history/version. Wire schema 2 explicitly rejects old blank-reader clients. The additive nonspatial storage extension preserves existing blank adventures, baselines, epoch and historical creation receipt bytes.

Empty effects are valid under C-D06. Existing unknown stored effects remain present and make the browser read-only; Go rejects dependent appends. These checks do not prove supported nonempty event provenance or world-state reduction: IDEA-0039/R02/R07 and the event-association portion of IDEA-0040/R04 remain partial contract coverage. No complete IDEA is certified.

## Findings

1. **P2 — input lost during background refresh; corrected and retested.** `refresh()` leaves the coordinator idle while setting a private `refreshing` flag. The textarea remains enabled, but `setInput()` originally ignored input during that interval. Focus/cross-tab refetch overlapping typing could overwrite newly entered text with the older retained value. The correction accepts idle input changes during refetch, while generation remains blocked. The new delayed-read/intervening-edit regression passed independently.
2. **P2 — Story receipt scope broader than accepted contract; corrected and retested.** B3-D02 defines adventure-scoped logical operation identities. The initial implementation looked up Story receipts by globally unique `operation_id`, so two independent adventures using the same ID conflicted. `storyReceiptKey` now scopes Story receipts by adventure and operation identity, preserving immutable payload checks and legacy creation receipts. Independent `TestStoryOperationIDsAreAdventureScoped` passes for same-ID independent commits, replay and changed-payload rejection.
3. **Related integration correction identified by lead; source verified.** A creation retry may return its original blank snapshot after another tab has added Story turns. The route now refetches current history before opening the adventure and retains the original pending creation request if that read fails. This preserves the original receipt contract without presenting old canon as current. Browser regression evidence is owned by the lead.
4. **P2 — uncertain-save candidate label; corrected and visually verified.** The candidate label now says “Save unconfirmed” or “Saving…” in those phases, keeping “Proposed · Not saved” only for the ready candidate. Source inspection and the fresh independently generated `story-save-unconfirmed.png` confirm that an uncertain durable result no longer implies rollback or a definitely unsaved state.

## Independently executed evidence

After an execution-host restart, a fresh `/root/final_review` agent independently repeated the source audit and checks below on 2026-11-04. It authored no application code or tests. It confirmed the three corrected findings and found no new source blocker. The earlier reviewer's findings remain recorded above; lost temporary logs/screenshots were not substituted for evidence: the fresh independent full browser run completed with exit 0, including restart.

Environment: Linux; Node `24.14.0` from `/home/alex/.nvm/versions/node/v24.14.0/bin`; `CGO_ENABLED=0`; dedicated Go cache `/tmp/lorebound-dev002b-review-go-cache`. Disposable databases are created by Go tests. No user library was modified.

| Gate | Status | Actual method and observed result |
| --- | --- | --- |
| Frontend typecheck | PASS, repeated by final reviewer | `npm --prefix frontend run check`: zero errors and warnings |
| Frontend unit tests | PASS, repeated by final reviewer | `npm --prefix frontend run test:unit` passed; explicit `node --test --test-isolation=none frontend/tests/*.test.ts` independently enumerated all **16 passing cases**, including delayed refresh typing |
| Real SQLite contracts | PASS, repeated by final reviewer | `go test -count=1 -tags server -v ./...` initially and `go test -count=1 -tags server ./...` after correction using dedicated cache: **14 top-level functions**, including concurrent writes/coherent reads, rollback, restart/original receipt, invalid payloads, unsupported effects, additive-upgrade success/failure and adventure-scoped operation IDs |
| Go static checks | PASS, repeated by final reviewer | `go vet -tags server ./...` using the same dedicated cache |
| Diff whitespace | PASS | `git diff --check` |
| Build | NOT RUN by reviewer | Lead owns shared frontend/binary build to avoid concurrent artifact mutation |
| Real browser/Wails integration | **PASS, fresh independent run** | `LOREBOUND_PORT=18081 LOREBOUND_ARTIFACT_DIR=/tmp/dev002b-review-browser bash scripts/verify-host.sh`, with Node PATH above, exit 0. Actual Firefox → Wails → Go → SQLite creation, Stop/Discard, keyboard acceptance, exact reload, lost real commit reply/recovery, stale second-tab rejection/refetch and exact browser/process restart. `/tmp/dev002b-review-browser.log` records the run |
| Visual/responsive | **PASS, fresh independent run and inspection** | Browser assertions at 390/768/1024/1440px, Dark/Bright, verify header/reader/rail geometry, fixed composer, independent reader scroll, mobile view switch, overflow and keyboard focus. Independently viewed `/tmp/dev002b-review-browser/story-proposed-dark-390.png`, `story-accepted-bright-1440.png` and `story-save-unconfirmed.png`; corrected truthful unconfirmed label confirmed |
| Browser restrictions | PASS in fresh independent run | Same-origin runtime 200; hostile Origin/fetch metadata/rebound Host/WebSocket 403; cross-origin preflight 405. These are browser access restrictions, not hostile-local-process authentication |
| GitHub CI | PENDING | No final task PR/CI result reviewed at this point |
| Windows/macOS runtime | NOT RUN | No cross-platform runtime/packaging claim |

Unit coordinator storage/provider fixtures are simulated. Go contract tests use actual SQLite but do not themselves prove Wails/browser operation. The browser script's unknown-core fixture intercepts an actual HTTP read response and is correctly labelled simulated; actual stored unknown-effect preservation is separately covered by Go tests.

## PR linkage and documentation review

Implementation reviewed and independently tested is committed as `daaff20384d90129e8886293829fa77953a31409` in [PR #6](https://github.com/Levelleor/lorebound/pull/6). The final reviewer inspected the subsequent uncommitted control/evidence delta: it adds PR/commit links and changes publication status to PR OPEN / CI PENDING while preserving unmerged status and scope limits. No application, test, build or runtime source changed after the independent checks. Scoped review PASS therefore remains applicable. The lead inspected [implementation CI run 41957177037 PASS](https://github.com/Levelleor/lorebound/actions/runs/41957177037) at the reviewed implementation commit. This reviewer did not independently inspect its logs; final documentation-head CI remains a merge gate.

## Final disposition

**Scoped independent review PASS.** No unresolved source, test or visual blocker remains within this Story-only, zero-effects slice. The final reviewer reran 16 TypeScript cases, 14 Go functions (43 nested rejection/shape cases), frontend typecheck, Go vet and the complete real-browser/restart suite; inspected the resulting screenshots and the final README/development-documentation changes. It made no application or test changes.

This is review of the current feature-branch implementation, not a claim that it has merged or that any full original IDEA is complete. Nonempty world-event semantics/provenance, live providers, durable drafts and Windows/macOS operation remain outside this evidence. Final documentation-head CI remains a gate. The user authorised merging PR #6 on 2026-11-05 if no further issue is found. DEV-002C and B9-D12 remain unstarted/deferred respectively.

**Reviewer file change:** this report only. **Next action:** lead commits the reviewed PR-link documentation, confirms passing final-head CI and records its URL/commit; merge only after final-head CI passes under the user’s 2026-11-05 authorisation.

