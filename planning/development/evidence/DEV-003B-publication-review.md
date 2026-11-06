---
type: development-review
status: pass-scoped-publication-review
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003B"
reviewer: "Codex /root/fork_revision_check independent replacement reviewer"
branch: "feat/dev-003b-story-fork"
---

# DEV-003B — Final revised source and browser-fixture review

**PASS for the final local revision, subject to exact published-head CI and the user's verbal approval before closure/merge of PR #12.** This supplements the [revised independent UX review](./DEV-003B-ux-review.md). The previous reviewer finished application/source, unit, SQLite, real-browser/restart and navigation-race verification before reaching an account limit during an additional capture probe. This replacement review completes the final test-fixture, artifact and publication-document checks; it does not claim merged main.

## Source identity and final fixture

Independently compared all nine recorded source/test hashes in the revised review against the working tree. **Eight match exactly**, including `fork.ts`, `StoryWorkspace.svelte`, the host adapter, Go Fork/service, both unit-test files and the main browser runner. No application or canonical-storage source changed after that review. The removed `ForkDialog` remains absent and `+page.svelte` has no net change from the baseline.

Only `frontend/scripts/check-story-fork.mjs` changed. Its final SHA-256 is **`719c5853146f85dbd3e195a807f36081928af8adbe55cbe8d6ea1477c9ae5c32`**. Reviewed changes retain the prefix/name/source-isolation, popup block, same-request recovery, closed-target reopening and stale-rejection assertions. They bound intercepted-response/new-page waits, add failure diagnostics and two destination screenshots, and explicitly foreground each tab before screenshots and input. The earlier disabled-Generate capture run attempted to type into a background tab; matching ordinary foreground interaction fixes that fixture without changing application behavior or weakening assertions. Failed/stalled attempts are not counted as PASS.

## Independently executed final probe

**PASS:** actual Firefox → Wails → Go → a disposable SQLite library on port18088, using the final tracked `exerciseFork` fixture. The probe creates three accepted source turns, executes all revised Fork checks, captures eight source-icon theme/width images and two destination images, independently continues both adventures, and exits0. [Exact probe output](./DEV-003B/turn-publication-probe.log). Reproduction wrapper: `/tmp/lorebound-dev003b-publication-probe.mjs`; artifacts: `/tmp/lorebound-dev003b-publication-probe/`. The disposable host was stopped and its library removed afterward.

The probe verifies the selected interior prefix and automatic `fork: [source name]` title in a separate tab with detached opener; source URL/input/history preservation; popup block with no write; lost-success response recovered through the unchanged request in the same target; closed target reopened without recopy; independent continuation/library resume; and stale-source rejection/refetch without automatic rebase. Viewed the independent Dark390 source image and Bright1440 destination image: the small icon sits beneath the complete accepted turn, the new tab has the expected name/history and the ordinary composer, and there is no selector/title form.

Separately inspected the final lead [full-suite log](./DEV-003B/turn-host-smoke.log): all prior Story/Retry/host restrictions pass, the revised Fork fixture passes, and a fresh browser after exact host restart reopens all histories. The earlier independent review's37 TS cases, Go19 functions/62 nested cases, typecheck/vet and full restart/navigation probes remain applicable to their unchanged reviewed source. This replacement reviewer did not independently repeat those entire suites; the focused final real-host probe above was independently executed.

## Documents and closure boundary

Reviewed NOW/TASKS/FEATURES, scope/evidence/reconciliation and current-versus-historical review wording. Current requirements describe the per-turn icon, separate tab, automatic lowercase name and Unicode-safe160-codepoint limit, with renaming separate. The old modal source/screenshots/CI are explicitly historical. Local evidence/control links resolve, diff whitespace checks pass, main remains eight partial original ideas/zero complete and three certified IDEA-0006 rows, and prepared closure is conditional on the same checked PR reaching main. No idea is archived, no next child starts and B9-D12 remains deferred.

**No remaining scoped local source/test/document blocker.** Revised publication CI has not been observed by this review and must pass on its exact head. The latest “proceed” continues the correction; it does not supply the still-pending named finalise/merge approval. All work, subsequent closure additions and final checks stay in primary PR #12; no separate reconciliation PR is needed.
