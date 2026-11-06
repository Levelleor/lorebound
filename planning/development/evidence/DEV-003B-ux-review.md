---
type: development-review
status: pass-scoped-local-review
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003B"
reviewer: "Codex /root/fork_review independent requirements/source/runtime reviewer"
baseline_commit: "f66b169ec210d3782833994c4455ad4debe51c4e"
branch: "feat/dev-003b-story-fork"
---

# DEV-003B — Independent per-turn Fork and separate-tab review

**PASS for the revised bounded implementation and independently executed local checks.** The user's 2026-11-06 correction supersedes the former dialog interaction: a small icon beneath an accepted turn directly creates its fork in a separate browser tab/window, using `fork: [source story name]`; renaming is separate. This report is the current UI review. The [first review](./DEV-003B-review.md) preserves historical source/storage evidence and the rejected form iteration; its modal checks do not certify this interface.

The scope remains simulated Story-only, zero world effects and one independently copied accepted prefix. PR #12 is unmerged; user approval to finalise/merge and exact published-head CI are still required. No full IDEA-0011/DEV-003 certification or B9-D12 work follows from this PASS.

## Requirements and source review

Reviewed the new user instruction against IDEA-0011, B4-D05, B3-D02/D04/D05, B6-D01, the [scoped requirements](../requirements/DEV-003B.md), previous independent findings and the changed code/test paths. The canonical Go/SQLite contract and its independently copied rows/receipt checks are unchanged from the first review; the revised interface preserves that boundary.

Each accepted turn renders one accessible Fork icon below both passages. Its turn ID directly pins the request; there is no turn/title form or in-story branch selector. Provisional output has no Fork action. A click synchronously reserves a separate blank tab before asynchronous work, detaches its opener and shows truthful progress. A blocked reservation reports the issue without sending a Fork request or creating an adventure. The generated lowercase title uses the source name and truncates by Unicode codepoints to the existing 160-codepoint limit; no rename functionality was added.

ForkController retains the same immutable request through uncertain outcomes, with single-flight guards across all turn icons. Success validates and reads the destination before navigating only the still-owned blank target. Source URL, accepted history and live input remain intact. If the target was closed or navigated elsewhere, success leaves it alone and exposes an ordinary Open fork link to the already-created adventure. Recovery/reopening does not copy again. Definitive stale rejection closes the waiting blank target, refreshes the source and requires a fresh icon click. Completion/refusal triggers a safe source refetch, retaining input and reconciling hints that arrived while Fork was pending.

Source disposal fences the controller and redirects an owned waiting target to the ordinary library; late results cannot replace a newer page. Target access checks handle closure/navigation without treating either as rollback of durable storage. No source operation receipts, drafts, provisional output or credentials enter the copied prefix. The parent remains incomplete and all original IDEA notes remain production-stage.

No remaining scoped implementation blocker found.

## Independently executed evidence

Linux, Node 24.14.0, Go 1.27.3-X:nodwarf5, actual Playwright Firefox, real Wails/Go and disposable SQLite only.

| Gate | Result | Actual method / observation |
| --- | --- | --- |
| TypeScript contracts/lifecycle | PASS | `PATH=/home/alex/.nvm/versions/node/v24.14.0/bin:$PATH node --test --test-isolation=none frontend/tests/*.test.ts`: 37 cases, zero failures/skips. Includes exact default title and Unicode-safe maximum. [Log](./DEV-003B/turn-review-ts-test.log). |
| Svelte/TypeScript | PASS | `npm --prefix frontend run check`: zero errors/warnings. [Log](./DEV-003B/turn-review-typecheck.log). |
| Go/SQLite | PASS | `GOCACHE=/tmp/lorebound-dev003b-go-cache CGO_ENABLED=0 go test -count=1 -tags server -json ./...`: 19 functions / 62 named subcases. Unchanged atomicity, complete-prefix/baseline, version/epoch, idempotency, corruption, rollback, concurrency and independence gates rerun. [JSON log](./DEV-003B/turn-review-go-test.jsonl). |
| Go vet | PASS | Same cache/headless settings, `go vet -tags server ./...`: exit 0, no diagnostics. |
| Real browser/bridge/SQLite/restart | PASS | `LOREBOUND_PORT=18086 LOREBOUND_ARTIFACT_DIR=/tmp/lorebound-dev003b-turn-review bash scripts/verify-host.sh`: exit 0, including all existing Story/Retry/host restrictions and fresh-process exact-history comparison. [Log](./DEV-003B/turn-review-host-smoke.log). |
| Revised Fork behavior | PASS | Clicked interior turn opens exact prefix in a separate real tab with correct name/opener isolation. Source URL/input/history remain unchanged. Both futures independently accept new turns; destination resumes from the ordinary library. |
| Recovery and failure | PASS | Simulated popup block sends no Fork request/write. A lost reply after a real durable copy recovers the same request in the existing target. Closing that target leaves one saved destination; Open fork opens it without another write. Concurrent source advance rejects without a destination/rebase, closes the waiting target and refreshes source. |
| Additional navigation races | PASS | Separate real-host probe on port 18087 held successful replies: a popup navigated by the user stayed on its chosen library page; source popstate teardown sent its owned blank target to the library and late success neither replaced pages nor duplicated the Fork. Source canon remained at two turns. [Probe log](./DEV-003B/turn-review-navigation-probe.log). Reproduction script: `/tmp/lorebound-dev003b-turn-probe.mjs`. |
| Visual/responsive/keyboard | PASS, scoped | Eight Dark/Bright checks at 390/768/1024/1440px. One 16px icon beneath each turn, visible keyboard focus, no horizontal overflow and intact docked composer/rail. Reviewer viewed Dark 390/Bright 1440 screenshots and confirmed restrained controls beneath complete turn prose. No modal/complete accessibility certification is claimed. |
| Build and publication CI | Lead build PASS; exact revised-head CI pending | Reviewer ran against the rebuilt real binary. Later inspected test-only edits improve screenshot scrolling, capture destination images and format a block. A final rare preparation-error cleanup removes obsolete title-field guidance, closes the unused placeholder and permits dismissing that pre-write error; successful/recovery paths and canonical requests are unchanged. Inspect full workflow on the exact published head before approval/merge. |
| Wider platforms/features | NOT RUN, out of scope | No live providers, Windows/macOS packaging, nonempty world/Lorebook/memory/plugin copying, rename, shared drafts, Undo/history editing or export/backup claim. B9-D12 remains deferred. |

The first revised browser run exposed an overly specific test assumption: programmatic focus after pointer interaction does not establish keyboard `:focus-visible` modality in Firefox. The fixture now uses actual Tab/Shift+Tab navigation; the rerun passes. This was a test correction, not an application behavior fix, and the failed run is not counted as PASS. Review artifacts remain in `/tmp/lorebound-dev003b-turn-review/`; the final lead captures are retained alongside these evidence records.

## Reviewed revised source identity

These nine source/test paths constitute the final application/test change from baseline. The former ForkDialog is absent; `+page.svelte` is restored to its baseline source. No schema or Go implementation changed during the UX correction.

| File | SHA-256 |
| --- | --- |
| `frontend/src/lib/fork.ts` | `9d0601a9a1e31fd003c1e54569ddd6b64b90fa87ddd2a6be04061b9b5713bf99` |
| `frontend/src/lib/StoryWorkspace.svelte` | `1ea4ec10ab85210bbe93f0bb3a265b5174d8d89791298a2b3377a8282116d48a` |
| `frontend/src/lib/host.ts` | `4d553c5a1c3ffad4b18ac44b4cd2ffd8a76d273a11a94b026781d0f52d08f82d` |
| `internal/store/fork.go` | `8424da82c1d315adb3563c525bde6a4b8d9592649f7b9442608cc42353115970` |
| `service.go` | `5b2e89a3e3a828db17d2fc2753cf322367093eac0c3bdc4a603aec59b19909bd` |
| `frontend/tests/fork.test.ts` | `3d4d644dc4e98d9c9d0d5765b3fb1f72a9e826f8ba6594f297a268e96ec32bde` |
| `internal/store/fork_test.go` | `2241f03eb18ac50bd2d2898d456a2ac8e2f28aa058a7389ea97aa0fce796cf8e` |
| `frontend/scripts/check-story-fork.mjs` | `790eb332bec1b358b48ebc3698c107d153ad6fae09b7f15ae00d2ba90e95dfbf` |
| `frontend/scripts/check-browser.mjs` | `68952985880c604c8b533d1be8c3294d91dbaf621f8bfa9d249dbd35a3cb0624` |

## Closure boundary

This review supersedes the former interface sign-off and covers the user's accepted correction within the same PR #12. Publication metadata/evidence/control reconciliation must describe this per-turn/new-tab behavior and distinguish historical form evidence. The current head requires CI; user verbal approval remains pending. Closure additions must be reviewed and checked on that same PR before merging, with no reconciliation PR or automatically started child. Main still has eight partial ideas, three formally certified atomic rows and zero complete ideas until the conditional closure is confirmed merged.
