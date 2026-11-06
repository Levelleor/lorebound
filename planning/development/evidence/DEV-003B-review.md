---
type: development-review
status: historical-ui-review
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003B"
reviewer: "Codex /root/fork_review independent requirements/source/runtime reviewer"
baseline_commit: "f66b169ec210d3782833994c4455ad4debe51c4e"
branch: "feat/dev-003b-story-fork"
---

# DEV-003B — Independent committed-prefix Fork review

> **Historical first-iteration UI review.** The user rejected the dialog interaction after this review, before merge approval. Go/SQLite and unchanged controller integrity findings remain evidence for their reviewed source, but modal/visual checks below do not certify the current per-turn icon/separate-tab UI. See [revised UX review](./DEV-003B-ux-review.md) for the current interface and source identity. Preserve this report as chronological evidence.

**PASS for the bounded local implementation and independently executed checks.** This is Story-only, simulated generation and zero world effects. It is not full IDEA-0011/DEV-003 certification, merged-main verification, publication CI or permission to merge. The user's verbal approval of the named primary PR and the final-head checks/closure review remain required.

## Accepted-source and implementation audit

Independently read [IDEA-0011](../../production/Manual%20Generation%20Branches.md), related IDEA-0004/0039/0051 contracts, [B4-D05](../../architecture/decisions/B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md), B3-D02/D04/D05, B6-D01, current development controls, architecture and visual contracts. Reviewed the changed source and tests against those requirements, including omitted and negative cases rather than treating the implementer's tests as the specification.

The dependency selection is sound: current adventure-scoped persistence, structured passage identity and replay suffice to copy the complete supported Story state. Full Duplicate/export, committed Undo and unbuilt world modules need not precede this child. Their wider Fork obligations remain unimplemented. No new schema or B9-D12 work occurs.

Go validates the request, library epoch, source version and supported current history in one transaction. It copies independently owned baseline/turn/passage rows through a real committed boundary, leaving source history intact. Stable turn/passage IDs are safely scoped by adventure. The lightweight receipt shares the source adventure's append-operation namespace, rejects changed/cross-kind reuse and recovers an identical committed request before checking subsequently advanced source history; epoch validation comes first. Failed copy/receipt work rolls back without a destination. No source receipts, unsent text or provisional state are copied.

TypeScript captures immutable source intent, serialises submissions, retains the same request after an uncertain response, validates the receipt and destination prefix, and reads the destination's current head before opening it. Stale/epoch rejection requires close/refetch and a fresh explicit choice. Disposal prevents a late result from navigating. UI guards pending generation/accept/save work, offers accepted turn boundaries in one story-level dialog and opens the destination as an ordinary independently listed adventure.

## Findings and corrections

No remaining scoped implementation blocker found. Corrections made during review:

- The first receipt namespace allowed Fork/append operation-ID reuse within one source adventure. Both operations now share the existing scoped key, with creation-receipt protection; both directions pass real SQLite tests.
- Immediate post-close refresh disabled the Fork action and lost restored focus. The implementation now completes refresh before restoring focus, with a heading fallback when blocked. Independent Firefox execution reproduced the original failure and passed the correction.
- Native-only Tab wrapping did not satisfy the required modal keyboard cycle in Firefox. Explicit forward/reverse boundary handling now passes.
- An extra independent probe held a real Fork request and found that disabling all controls moved focus to BODY, bypassing the dialog's Tab handler. Phase-aware focus now targets the dialog while saving, Recover during uncertainty and Cancel after rejection, guarded against disposal/stale updates. The same probe now reports DIALOG before and after Tab/Shift+Tab; the full browser suite also holds a real committed response and verifies this behavior.
- Dialog height now respects the 90vh visual bound. New/directly affected TypeScript blocks use the required Allman style; final named event-handler extraction preserves behavior.

## Independently executed checks

| Gate | Result | Method / actual observation |
| --- | --- | --- |
| TypeScript contracts/lifecycle | PASS | `PATH=/home/alex/.nvm/versions/node/v24.14.0/bin:$PATH node --test --test-isolation=none frontend/tests/*.test.ts`: 36 individual cases, zero failures/skips. Repeated after final style edits. [Log](./DEV-003B/review-ts-test.log). |
| Svelte/TypeScript check | PASS | `npm --prefix frontend run check`: zero errors/warnings on corrected focus implementation. Lead also checked the final equivalent named handlers. [Log](./DEV-003B/review-typecheck.log). |
| Go/SQLite contracts | PASS | `GOCACHE=/tmp/lorebound-dev003b-go-cache CGO_ENABLED=0 go test -count=1 -tags server -json ./...`: 19 test functions / 62 named subcases. First/interior/latest boundary, complete prefix/baseline, both futures, restart, stale/epoch/format/identity/unsupported-history rejection, rollback, concurrent source writes and receipt recovery. [JSON log](./DEV-003B/review-go-test.jsonl). |
| Go static checks | PASS | `GOCACHE=/tmp/lorebound-dev003b-go-cache CGO_ENABLED=0 go vet -tags server ./...`: exit 0, no diagnostics. |
| Real Firefox/Wails/Go/SQLite and exact restart | PASS | Separate port 18086 and disposable database; `LOREBOUND_ARTIFACT_DIR=/tmp/lorebound-dev003b-review bash scripts/verify-host.sh`: exit 0. Complete existing suite plus Fork and a fresh browser after exact host restart. [Log](./DEV-003B/review-host-smoke.log). |
| Failure/recovery/concurrency | PASS | Real lost-success response recovers the identical Fork once; source/fork independently append; stale source rejects without destination or automatic rebase; close/refetch exposes current accepted boundaries. Existing Story Retry, save recovery, stale-tab, late-read and teardown regressions pass. |
| Visual/responsive/accessibility | PASS, scoped | Eight Dark/Bright checks at 390/768/1024/1440px; dialog bounds/keyboard wrap, Escape/restoration, saving/recovery focus, no overflow. Reviewer viewed Dark 390 and Bright 1440 screenshots: readable content, visible gold focus, reachable controls and consistent shell. No complete accessibility/font/settings certification. |
| Host restrictions | PASS | Same-origin runtime succeeds; cross-origin runtime/fetch metadata/Host/WebSocket rejected, cross-origin preflight rejected. No claim to authenticate arbitrary hostile local processes. |
| Diff/controls/scope review | PASS, scoped | No whitespace errors. Requirement inventory is 115 recorded rows across nine IDEAs, including eight scoped/unmerged IDEA-0011 rows. Verified main retains eight partial ideas, three formally certified IDEA-0006 rows and zero complete ideas. Production/archive stages and B9-D12 deferral preserved. |
| Build / published final-head CI | Lead build PASS; publication CI NOT RUN | Reviewer used the lead's rebuilt real host. Last changes after the passing full runtime run were inspected formatting and equivalent named event handlers; exact published-head CI must rerun the full workflow. |
| Platforms / live models | NOT RUN, outside child | Linux Firefox only. No Windows/macOS packaging, live provider, nonempty world effects, drafts, Undo/history edits, export/backup or broader lifecycle claim. |

The first Go command encountered the sandbox's read-only default cache; approved cache access and the later `/tmp` cache run passed. Early Firefox runs that exposed focus defects are not counted as passing evidence. All databases were disposable. Original additional focus reproduction: `/tmp/lorebound-dev003b-review-saving-focus.mjs`; corrected before/Tab/Shift+Tab output: [log](./DEV-003B/review-saving-focus.log). Review screenshots and full host artifacts remain under `/tmp/lorebound-dev003b-review/`; matching lead artifacts are retained in this evidence directory.

## Reviewed final source identity

These hashes cover the final source/test files after the equivalent style/handler changes. Publication and final closure must preserve or re-review this source, inspect actual CI and keep all records in the same primary PR.

| File | SHA-256 |
| --- | --- |
| `frontend/src/lib/fork.ts` | `34a56ee87f4fe1a91b5e1cb5b500206de5a7b576f6f322ac5213c648ce761190` |
| `frontend/src/lib/ForkDialog.svelte` | `c0f04fbe4b2484545aa975f75213381ac33d9c27f86cd2ea33b7452772ba7bc6` |
| `frontend/src/lib/StoryWorkspace.svelte` | `feba5e1ab9b890141dffb169afd48fb1fb2031a1b37f3d780e3a160321ee7253` |
| `frontend/src/routes/+page.svelte` | `b838519918b80416855c2fb1d50772778aa33e69c4e05718e46b3281bc8acd73` |
| `frontend/src/lib/host.ts` | `4d553c5a1c3ffad4b18ac44b4cd2ffd8a76d273a11a94b026781d0f52d08f82d` |
| `internal/store/fork.go` | `8424da82c1d315adb3563c525bde6a4b8d9592649f7b9442608cc42353115970` |
| `service.go` | `5b2e89a3e3a828db17d2fc2753cf322367093eac0c3bdc4a603aec59b19909bd` |
| `frontend/tests/fork.test.ts` | `e22d254155b4cb36010f933f2f0bfa35e7d1ef3acbaaec8c58edc1548fb6d86a` |
| `internal/store/fork_test.go` | `2241f03eb18ac50bd2d2898d456a2ac8e2f28aa058a7389ea97aa0fce796cf8e` |
| `frontend/scripts/check-story-fork.mjs` | `53423d73687dbd9768160c6e281e39610350534ad1b17d28f70c8d7c93a7793e` |
| `frontend/scripts/check-browser.mjs` | `68952985880c604c8b533d1be8c3294d91dbaf621f8bfa9d249dbd35a3cb0624` |

## Publication and closure boundary

Current review covers local implementation, evidence and scoped controls. It does not assert that a PR or CI run exists. User verbal approval is pending; final conditional closure additions, the named PR description and exact-head CI must be reviewed before merging that same PR. No separate reconciliation PR or automatic next child is authorised. Full IDEA-0011 remains incomplete; the new eight rows do not increase the formal whole-row certification count.
