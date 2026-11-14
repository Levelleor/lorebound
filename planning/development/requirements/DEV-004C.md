---
type: development-requirements
status: in-progress-user-feedback
created: "2026-11-11"
updated: "2026-11-14"
task: "DEV-004C"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004C — Explicit local connection testing

The user's separate 2026-11-11 launch authorises auditing DEV-004, selecting and implementing one bounded child, tests, independent review and one primary PR. Finalise/merge approval must follow the hands-on handoff for that named PR. Base: confirmed [PR #22](https://github.com/Levelleor/lorebound/pull/22) merge `b6c9c79de0b51564a3007a0a946f5e5242d746e8`, satisfying DEV-004B's approved conditional closure.

## Remaining requirements and dependency audit

Actual `models.ts`, `ConnectionSettings.svelte`, `StoryCoordinator`, `StoryWorkspace.svelte` and Go connection storage at the base implement saved nonsecret llama.cpp/Custom profiles, optional model discovery, direct completed/streamed Story requests and explicit acceptance. Settings have no connection-test action. Discovery expressly does not test narration. The [DEV-003 dependency audit](./DEV-003.md#remaining-scope-audit--2026-11-08) remains applicable.

| Remaining DEV-004 scope | Dependencies and disposition |
| --- | --- |
| Explicit connection test — IDEA-0014 | Existing browser transport, timeouts and modal lifecycle suffice. **Selected DEV-004C:** a small synthetic completed request using entered URL/model/timeout, temporary truthful results and cancellation. No saved profile or discovery prerequisite. |
| Ollama, LM Studio, vLLM-specific adapters — IDEA-0013 | Separate protocol/capability and real-browser interoperability work. Unselected; Custom compatibility is not named-target certification. |
| Cloud providers, credentials and custom headers — IDEA-0012/0014 | Narrow sensitive-service review, OS vault/consented encrypted fallback, memory-only browser copies and platform checks remain prerequisites. Unselected. |
| Retry preferences and broader usage/timing/effective-setting diagnostics — IDEA-0014/0019 | Error classification and safe replay/settings contracts remain separate work. Existing configurable timeout is retained; no automatic retry or health gate. |
| Style, capability and sampling controls — IDEA-0010/0015/0016 | Need effective-request/settings and provider-capability contracts. A successful short test does not establish these capabilities. Unselected. |
| Task routing, configurable pipelines, interpretation and repair — IDEA-0017/0018/0045/0046 | Need explicit stage contracts and supported typed event/subsystem ownership. Story-only zero-effects boundary remains. Unselected. |
| Spatial migration — B9-D12 | **DEFERRED — NO WORK.** |

## Accepted sources and bounded requirements

[IDEA-0014](../../production/Provider%20Connection%20Profiles%20and%20Discovery.md) accepts explicit connection tests and manual model IDs, with tests/discovery optional and no availability gate before generation. [IDEA-0013](../../production/Local%20LLM%20Server%20Connections.md) requires direct browser requests and recoverable errors. [IDEA-0019](../../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) requires truthful states, redacted errors and abandoned-attempt invalidation. [B1-D05](../../architecture/decisions/B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) forbids a Go inference proxy; [B9-D06](../../architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) governs evidence labels. The approved [visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) govern modal feedback/focus and responsive checks.

Protocol reference: [official llama.cpp server](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md). The short test requests `/chat/completions`, `stream: false`, `max_tokens: 32` and one constant user message, “Reply with OK.” Following the user's 2026-11-14 hands-on feedback, llama.cpp test requests send `chat_template_kwargs: { enable_thinking: false }` from browser TypeScript; Custom requests and Story generation retain their defaults. There is no server configuration change or automatic second attempt. The test validates the reply without displaying or retaining provider text. A normal-stop nonempty text response or valid token-limited reply is explicitly labelled **Connection successful**, with the limit disclosed where reached, including models producing no final text in that budget. Success establishes only that the entered request received a compatible response. It does not establish server model routing, full narration, streaming, model capability or future availability. The documented llama.cpp `/health` endpoint could establish loaded-server readiness, but would not exercise this selected chat/model request; it does not replace the accepted explicit connection test here. This is a test-depth refinement, not a change to Story proposal validation.

Three new affected rows extend the existing inventory; no whole-IDEA certification follows.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0014/R04 | Test connection deliberately sends one bounded synthetic request directly to the entered llama.cpp/Custom endpoint/model using its timeout, with no discovery or saved-profile prerequisite. It sends no story/input/history/private adventure or passage IDs, omits credentials/referrer, rejects redirects and never saves/selects a profile, draft or canonical turn. | `models.ts` testConnection/requestValue; `ConnectionSettings.svelte`; `connection-test.test.ts` captured request/configuration; `check-connection-test.mjs` actual direct HTTP and unchanged Go settings/draft/canon. |
| IDEA-0014/R05 | Results label valid complete and token-limited replies as connection success, disclose reached limits and distinguish pending, stopped and failed states. Browser llama.cpp test requests ask to disable thinking; Custom requests and Story generation retain provider defaults. Results are temporary and clear on edits, selection, reload or closing settings. Stop/timeout/Escape/page abandonment abort the browser request/body where possible and fence obsolete callbacks. A test is optional and never gates manual saving or later generation. | Settings test/stopTest/selectProfile/pagehide; JSON-reader cancellation; unit request/defaults/stalled-body/late reply cases; browser success/limit labels and per-kind request bodies, Stop/Escape/reload, edits, failed-test save; existing `check-models.mjs` generation without tests. |
| IDEA-0014/R06 | Invalid fields, HTTP access/model/rate/server errors, browser-network restrictions, malformed/oversized/unsupported replies and timeout yield actionable redacted feedback. Raw response bodies and transport exceptions never appear in results or persistent data. No automatic retry, proxy or fallback occurs. Controls and feedback remain keyboard accessible and fit the four approved widths in Dark/Bright. | `models.ts` validation/readJson/requestValue; unit response/failure cases; browser HTTP/CORS/redirect/timeout and responsive/focus/capture assertions. |

Paths resolve under [frontend/src/lib](../../../frontend/src/lib/), [frontend/tests](../../../frontend/tests/) and [frontend/scripts](../../../frontend/scripts/). CI includes the new browser exercise through `check-browser.mjs`, reusing the existing host/SQLite/restart workflow. No schema, wire, Go service or credential change is needed. Other accepted scope and deferrals remain open.

## Verification and handoff

[Primary PR #23](https://github.com/Levelleor/lorebound/pull/23) owns implementation, CI, independent review, hands-on demo and eventual conditional closure on `feat/dev-004c-connection-test`. Provider fixtures are simulated; real Linux Firefox/Go/SQLite integration does not certify live servers, universal compatible APIs, other operating systems or full accessibility. No merge approval or verified-main claim is made.

[Earlier application CI](https://github.com/Levelleor/lorebound/actions/runs/43056644894) attempt 2 PASS at `27a0eeec468e989c2542839203f1ab0928aaeef1`, with independent source/coverage/security/control and all nine affected CI-capture reviews PASS. This is pre-feedback evidence; it does not verify the subsequent request/wording change. Fresh applicable CI and review are being prepared for the client fix. No full local suite is repeated for routine review.

A separate live Linux Firefox check used llama.cpp `0.6.0-dev`, build 11429 (`d812350493`), `Qwen3-4B-Q4_K_M.gguf`, ROCm0 with 28 GPU layers/8192 context and loopback port 18085. Discovery and a synthetic-only request PASS; the server reached the short token limit and the UI reported that limitation without saving settings or canon. Credentials/cookies/referrer were omitted. An invalid-model rejection was **not established live**: this single-model configuration answered an unknown model ID with HTTP 200 and the loaded model. The test establishes a response to the entered request, not server routing fidelity or future availability; simulated 404 fixtures cover the application's rejection feedback. No universal provider/model/browser/OS support follows.

The [local review adventure](http://127.0.0.1:8086/?adventure=fe32e057-197a-4f3b-895b-e284cdca5fa5) was rechecked on 2026-11-14, serving application source `27a0eee`: **Connection testing review** has no accepted turns, empty input and saved **Local Qwen3 review** profile. App/provider run on loopback 8086/18085; `.local/review/dev004c` persists separately from prior review/user libraries. The PR/chat supplies the test/edit/failure/Stop walkthrough and `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004c"` relaunch command; Ctrl+C stops a foreground relaunch. Ask the agent to stop current review servers. The user has not yet accepted this handoff or approved finalising/merging PR #23. Ready is not verified main. Closure stays in this PR and remains conditional on subsequent approval, review, final-head checks and confirmed merge; no automatic next child follows.
