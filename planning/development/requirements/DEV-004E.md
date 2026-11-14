---
type: development-requirements
status: ready-for-user-review
created: "2026-11-14"
updated: "2026-11-14"
task: "DEV-004E"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004E — Native Ollama Story connections

The user's separate 2026-11-14 launch (and “proceed”) authorises auditing DEV-004, selecting one bounded child, implementation, tests, independent review and one primary PR. Base: confirmed [PR #24](https://github.com/Levelleor/lorebound/pull/24) merge `2fc74e8`, satisfying DEV-004D's approved conditional closure. Finalise/merge approval is still required after the named-PR hands-on handoff.

## Remaining scope and dependency audit

Actual `models.ts`, `ConnectionSettings.svelte`, `StoryCoordinator`, diagnostics and Go profile storage at that base support only llama.cpp/Custom compatible requests, SSE, optional discovery/test and session diagnostics. They do not implement Ollama's native `/api/tags`, `/api/chat` or NDJSON. The current Story-only zero-effects coordinator, explicit acceptance, drafts, recovery and atomic SQLite commit can be reused without new world events or privileged services.

| Remaining DEV-004 scope | Disposition/dependencies |
| --- | --- |
| Named local adapters — IDEA-0013 | **Selected: native Ollama only**, including saved nonsecret profiles, manual/optional discovery, existing synthetic connection test, completed/streamed Story narration and optional reported usage. LM Studio/vLLM remain later; Custom compatibility is not certification. |
| Cloud/credentials/custom headers — IDEA-0012/0014 | Later: sensitive-service review, OS vault/consented encrypted fallback, memory-only browser access and platform checks. No new credential service or inference proxy. |
| Connection/access versus generation tests — IDEA-0068 | Staged, not production-ready or launched. Existing explicit synthetic test behavior is adapted to native Ollama; no new test workflow or capability probe. |
| Retry preferences, style, sampling/capabilities — IDEA-0010/0014/0015/0016 | Later effective-request/settings and capability contracts. No automatic retry, fallback, thinking override or generation parameter controls. |
| Routing/pipelines/interpretation/repair — IDEA-0017/0018/0045/0046 | Later stage and supported event/subsystem contracts. Existing Story narration only. |
| Automatic new-turn acceptance — IDEA-0069 | Unaccepted future candidate; explicit Accept remains. |
| Spatial migration — B9-D12 | **DEFERRED — NO WORK.** |

## Accepted sources and bounded requirements

[IDEA-0013](../../production/Local%20LLM%20Server%20Connections.md) accepts named Ollama support, protocol adaptation, local one-model use, discovery/manual entry, cancellation and actionable failure. [IDEA-0014](../../production/Provider%20Connection%20Profiles%20and%20Discovery.md) accepts reusable profiles and optional direct-browser testing/discovery. [IDEA-0019](../../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) accepts provisional streams, cancellation and redacted diagnostics. [B1-D05](../../architecture/decisions/B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) keeps inference in the browser; [B9-D06](../../architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) governs evidence limits. The approved [visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) govern existing dialog/disclosure/responsive behavior.

Protocol sources: official [chat](https://docs.ollama.com/api/chat), [model list](https://docs.ollama.com/api/tags), [NDJSON streaming](https://docs.ollama.com/api/streaming) and [origin configuration](https://docs.ollama.com/faq). The explicit Ollama choice uses an API base ending in `/api` (default `http://127.0.0.1:11434/api`), appending `tags` or `chat`. Existing llama.cpp/Custom paths stay compatible. Switching types changes a known default URL only; a player-edited URL is retained. No protocol auto-detection or server installation/reconfiguration occurs.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0013/R05 | A named native Ollama profile saves/selects/reloads alongside existing profiles under existing revision/epoch guards. Completed Story requests directly POST selected model, messages and explicit `stream:false` to `/api/chat`. Only nonempty bounded assistant prose with `done:true` and `done_reason:stop` becomes a proposal; explicit Accept remains the only canonical write. | `models.ts`, `modelTransport.ts`, `ollama.ts`, `ConnectionSettings.svelte`; `ollama.test.ts` captured configuration/completed/error cases; Go `TestConnectionsPersistenceConflictEpochAndCanonicalIsolation` llama.cpp/Ollama subtests; `check-ollama.mjs` profile/reload/Retry/accept and canon isolation. |
| IDEA-0013/R06 | Opt-in native `application/x-ndjson` handles fragmented UTF-8/CRLF and terminal content, requiring `done:true` with normal `stop`; EOF without completion, length limits, malformed/oversized output and nonempty tools fail without accept-ready output. Thinking is never prose. Stop, timeout/navigation and existing sequence fences discard provisional output and retain input/canon, with no retry/fallback. Optional `prompt_eval_count`/`eval_count` map to input/output usage only after validated completion; totals remain unavailable. | `ollama.ts` native reader; `ollama.test.ts` byte splits, no-final-newline, malformed/tool/thinking/usage/abort/timeout cases; `check-ollama.mjs` real HTTP preview, terminal gating, errors, CORS/404, Stop/timeout/navigation and diagnostics clearing. Existing streaming/diagnostics coordinator regressions remain in CI. |
| IDEA-0013/R07 | Optional native discovery GETs `/api/tags` and lists validated unique model names without sending story; manual entry works after failure. Existing explicit connection test sends only “Reply with OK.” to `/api/chat` with `stream:false` and `options.num_predict:32`, reports complete/limited success and keeps settings/canon unchanged. No health gate, model download, capability probe, thinking override, credentials, redirects, cookies/referrer or Go proxy. UI identifies `/api` and origin requirements. | `ollama.ts` discovery/test; shared transport safeguards; `ollama.test.ts` paths/payloads/privacy/failures; `check-ollama.mjs` manual entry, discovery, complete/limited/error tests and direct-browser request assertions; existing connection-test lifecycle regressions exercise the unchanged UI owner. |

Paths resolve under [frontend/src/lib](../../../frontend/src/lib/), [frontend/tests](../../../frontend/tests/), [frontend/scripts](../../../frontend/scripts/) and [internal/store](../../../internal/store/). Existing IDEA-0014/R01–R06 and IDEA-0019/R07–R09 gain bounded Ollama coverage; no new whole-IDEA completion is claimed. Three new affected rows bring the inventory to 154 across the same sixteen original IDEAs. All originals remain in production.

Go only extends the permitted nonsecret profile kind. The existing text column needs no database migration or wire/shape change. Older frontends reject unsupported profile kinds rather than interpreting native profiles as compatible endpoints. New code accepts existing profiles without altering them. Canonical storage/contracts remain unchanged.

## Verification and handoff

[Primary PR #25](https://github.com/Levelleor/lorebound/pull/25) owns implementation, evidence, controls and eventual conditional closure. [Application CI](https://github.com/Levelleor/lorebound/actions/runs/43651970773) PASS at `0cece952cc7fa0e62d76c12670c0c279a5ca0a8f`: build/typecheck, TypeScript contracts, Go/SQLite, actual Firefox direct HTTP/lifecycle/native protocol and exact process restart. Focused local provider/stream/diagnostics contracts, typecheck/build, connection persistence checks and the native Firefox exercise also passed; no full local suite was repeated. Independent accepted-source/implementation/coverage/security/control review PASS with no blockers. The reviewer found an initial capture-position gap; the test now scrolls diagnostics into view and resets dialog scroll. Independent final source/coverage/security/control/evidence review and inspection of all sixteen actual affected CI captures PASS: Dark/Bright at 390/768/1024/1440, with native settings, diagnostics and docked acceptance controls readable/usable. No blockers remain. Documentation-only readiness updates reuse this application evidence with applicable final-head repository checks. CI uses simulated Ollama replies with actual Linux Firefox HTTP/CORS/cancellation and Go/SQLite, including exact process restart; no installed/live Ollama inference or universal server/model compatibility is established. Cloud/authentication, other OS packaging and full accessibility remain unverified. No merge or next child is authorised by implementation readiness.


The [checked local review adventure](http://127.0.0.1:8086/?adventure=30a22957-9e1e-4d54-b54c-5aa4fbe97c9c) serves application source `0cece95`; its served JS/CSS were compared with the current build. It uses a separate persistent `.local/review/dev004e` library, with a **Simulated Ollama review** profile and retained input. The clearly labelled protocol fixture on loopback port 18086 returns fixed completed/streamed prose; no live inference is running. Agent-operated completed proposal/discard and streamed Stop checks PASS, with canon unchanged. The chat/PR owns the Generate → details → Accept/Discard, streamed Stop and optional Models walkthrough. Review app/fixture remain running; prior review/user libraries are preserved. Relaunch the application with `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004e"`; the temporary fixture is a separate process, not installed product functionality. A real configured Ollama uses its own `/api` endpoint/model.

## Closure boundary

The [incomplete-feature register](../INCOMPLETE-FEATURES.md#inc-001--native-ollama-live-server-verification-outstanding) records the outstanding live Ollama verification separately from the implemented native adapter and the broader provider obligations. This addition follows the user's review feedback; it is not finalise/merge approval.

Ready for hands-on feedback; **no verbal finalise/merge approval has been given**. Any eventual closure stays conditional on the user's approval of this named PR, routine same-branch reconciliation, independent closure review, applicable final-head checks and confirmed merge. DEV-004 and original IDEAs remain PARTIAL; no original is archived. IDEA-0068 remains staged, IDEA-0069 unaccepted and B9-D12 deferred. Exactly one next task remains DEV-004 audit/selection only after this child closes and a separate user launch. No reconciliation PR or automatic next child follows.
