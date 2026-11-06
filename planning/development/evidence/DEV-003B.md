---
type: development-evidence
status: verified-bounded-on-confirmed-merge
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003B"
---

# DEV-003B — Independent committed Story-prefix Fork evidence

**PR #12 closure condition:** The post-merge status below is effective only when [PR #12](https://github.com/Levelleor/lorebound/pull/12) is confirmed merged with its checked final head. Before that confirmation, verified main remains `f66b169ec210d3782833994c4455ad4debe51c4e`, with eight partial ideas, zero complete ideas and three formally certified IDEA-0006 rows. The user approved finalising and merging this same PR on 2026-11-06: “yes finish the task”. No later child is authorised.

**DEV-003B is VERIFIED within the bounded Story-only simulated zero-effects scope under that merge condition.** Revised implementation head `f86dec286538e3c029536e77162477a4f4946b2a` passed [readiness CI](https://github.com/Levelleor/lorebound/actions/runs/42243295778), [revised independent source/runtime review](./DEV-003B-ux-review.md) and [final publication review](./DEV-003B-publication-review.md). The current turn-icon/separate-tab flow is the user-approved correction. Final closure additions stay in the same primary PR, with reviewed final-head CI and actual merge provenance recorded there and in the handoff. This is not full-IDEA certification.

## Current interaction and behavior

Each accepted turn has a small accessible fork icon beneath its passages, with a turn-specific label/tooltip and visible keyboard focus. Clicking directly selects that turn, creates the complete supported prefix/baseline and opens it as an independent adventure in a separate browser tab/window. **No turn selector/title form.** The default title is lowercase `fork: [source name]`, truncated by Unicode codepoints to the existing 160-codepoint storage limit. Renaming remains separate future work. The original URL, accepted history and unsent input stay intact.

The browser reserves a blank tab synchronously within the click before awaiting storage, then detaches its opener and shows progress/library access. Blocked pop-ups make no Fork request or write. All source turn actions and in-app navigation are locked while copy/recovery is unresolved. Recover repeats the same immutable operation and target, without another tab or destination. A closed or independently navigated target is not overwritten: a confirmed result provides an ordinary Open fork link with no additional copy. A rejected stale source is refetched and requires a fresh deliberate icon click; completion also safely refreshes source history while preserving input. Disposed work cannot redirect a newer page.

Go/SQLite copy, validation, source-version/epoch fencing and lightweight original-result receipt are unchanged from the independently reviewed storage implementation. Separate adventure-scoped rows preserve stable turn/passage IDs; no mutable records, source receipts, unsent input or provisional state are shared. The database schema is unchanged. TypeScript validates the complete returned prefix and replays the destination's current history.

## Executed gates

Linux; Node 24.14.0 at `/home/alex/.nvm/versions/node/v24.14.0/bin`; Go 1.27.3-X:nodwarf5 with `CGO_ENABLED=0`, server tags and writable `/tmp` cache; Playwright Firefox. Every library is disposable; model output remains explicitly simulated.

| Gate | Result | Command / evidence |
| --- | --- | --- |
| Svelte/TypeScript | PASS: zero errors/warnings | `npm --prefix frontend run check`; [revised log](./DEV-003B/turn-frontend-check.log) |
| Frontend and real host builds | PASS | `npm --prefix frontend run build`; `CGO_ENABLED=0 GOCACHE=/tmp/lorebound-dev003b-go-cache go build -tags server -o bin/lorebound .`; [frontend log](./DEV-003B/turn-frontend-build.log) |
| TS contracts/lifecycle | PASS: 37 cases | `node --test --test-isolation=none frontend/tests/*.test.ts`; [revised log](./DEV-003B/turn-ts-test.log); includes default naming and Unicode-safe truncation |
| Real Go/SQLite and vet | PASS for unchanged storage | Original lead and independent runs: 19 functions/62 named nested cases; [Go log](./DEV-003B/go-test.log), [independent JSON](./DEV-003B/review-go-test.jsonl). Revised exact-head CI reruns them. |
| Revised real browser/bridge/SQLite/restart | PASS | `LOREBOUND_PORT=18085 LOREBOUND_ARTIFACT_DIR=/tmp/lorebound-dev003b-turn-lead bash scripts/verify-host.sh`; [revised log](./DEV-003B/turn-host-smoke.log) |
| Revised visual/responsive | PASS, bounded | Eight Dark/Bright 390/768/1024/1440 checks of turn-icon placement, keyboard focus and no overflow; [Dark390](./DEV-003B/turn-fork-dark-390.png), [Bright1440](./DEV-003B/turn-fork-bright-1440.png). Lead inspects both. [Dark destination](./DEV-003B/turn-fork-created-dark-390.png) and [Bright destination](./DEV-003B/turn-fork-created-bright-1440.png) show copied history/default name. |
| Failure/recovery | PASS | Actual copied response is lost/held; same-request recovery, source/input preservation, blocked popup no write, closed target reopen no recopy, stale rejection/refetch, independent future acceptance and library resume |
| Host restrictions and existing regressions | PASS | Real same-origin/cross-origin/metadata/Host/WebSocket checks and full existing Story/Retry/recovery/teardown suite; exact process restart compares every adventure/history |
| Independent revised UI review | PASS, bounded | [Revised review](./DEV-003B-ux-review.md); prior storage evidence applies to unchanged source |
| Revised implementation-head CI | PASS | [Run42243295778](https://github.com/Levelleor/lorebound/actions/runs/42243295778), head `f86dec286538e3c029536e77162477a4f4946b2a`; actual logs confirm all required gates. [Artifacts](https://github.com/Levelleor/lorebound/actions/runs/42243295778/artifacts/13516322428). Final closure-head CI must also pass and is recorded in PR #12. |
| Other platforms/live providers | NOT RUN, outside child | Linux Firefox only; no provider/packaging/full accessibility certification |

## Historical first-iteration evidence

[First review](./DEV-003B-review.md), `fork-*.png`, initial build/test/host logs and [CI42233542070](https://github.com/Levelleor/lorebound/actions/runs/42233542070) cover the **superseded dialog iteration** at head `3d8bbb5a987b5dd17c896a79fe3469d98c7aca4d`. They do not certify the new UI. Their Go/SQLite integrity findings remain applicable to unchanged storage. Former modal focus corrections are historical, not claims about a current modal. The first revised screenshot fixture used programmatic focus after pointer input; it was corrected to use actual Tab/Shift+Tab before checking keyboard focus visibility.

Storage integrity remains: first/interior/latest accepted boundary; complete exact prefix/baseline; both futures isolated after reopen; reject missing/provisional/invalid/stale/epoch/cross-kind operation misuse and corrupt/unsupported history; injected copy/receipt failure rolls back destination and receipt; concurrent writes yield an exact copy or stale rejection; original receipt recovery precedes source revalidation but follows epoch checks. [Scope](../requirements/DEV-003B.md).

Full world effects, Lorebook/entities, memory/plugin data and rename/edit/delete integration remain later. Shared drafts, editor undo, committed Undo, historical edits, backup/export and packaging are outside this child. **B9-D12 DEFERRED — NO WORK.** No full original IDEA is complete or archived; formal atomic certification remains three IDEA-0006 rows. Verbal finalise/merge approval is recorded; closure remains conditional on confirmed checked-head merge of this same PR.

Final artifact-capture follow-through: new two-tab screenshots exposed a fixture issue when it typed into the background destination after capture. The final fixture foregrounds each tab before capture/input and bounds custom waits/captures; full lead browser/host/restart verification then passed with all ten new images. Application source was unchanged during this testing correction. [Final publication review](./DEV-003B-publication-review.md) covers its test delta and source identity; the first reviewer completed the revised app/runtime review before hitting an account usage limit during the extra capture probe.
