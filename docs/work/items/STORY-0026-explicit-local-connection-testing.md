---
id: STORY-0026
type: story
status: completed
parent: PRD-0015
depends_on:
- STORY-0024
priority: 3
related:
- PRD-0069
- PRD-0015
- PRD-0014
- PRD-0013
- PRD-0011
- PRD-0018
- PRD-0020
- PRD-0007
- STORY-0004
---

# Explicit local connection testing

## Outcome

Explicit local connection testing.

[Legacy task: DEV-004C](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-004c)

**Bounded delivery verified and merged:** [PR #23](https://github.com/Levelleor/lorebound/pull/23), confirmed on source main at `bed467ac991a34a0acc157dc6b188584a102e546`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-004C.md)

The user's separate 2026-11-11 launch authorises auditing DEV-004, selecting and implementing one bounded child, tests, independent review and one primary PR. After the checked handoff, feedback and named-PR approval request, the user authorised finalising/merging current PR #23 on 2026-11-14: “im done with the current task as well lets close it now.” Base: confirmed [PR #22](https://github.com/Levelleor/lorebound/pull/22) merge `b6c9c79de0b51564a3007a0a946f5e5242d746e8`, satisfying DEV-004B's approved conditional closure.

## Remaining requirements and dependency audit

Actual `models.ts`, `ConnectionSettings.svelte`, `StoryCoordinator`, `StoryWorkspace.svelte` and Go connection storage at the base implement saved nonsecret llama.cpp/Custom profiles, optional model discovery, direct completed/streamed Story requests and explicit acceptance. Settings have no connection-test action. Discovery expressly does not test narration. The [DEV-003 dependency audit](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003.md#remaining-scope-audit--2026-11-08) remains applicable.

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

[IDEA-0014](../../product/PRD-0015-provider-connection-profiles-and-discovery.md) accepts explicit connection tests and manual model IDs, with tests/discovery optional and no availability gate before generation. [IDEA-0013](../../product/PRD-0014-local-llm-server-connections.md) requires direct browser requests and recoverable errors. [IDEA-0019](../../product/PRD-0020-streaming-cancellation-and-generation-diagnostics.md) requires truthful states, redacted errors and abandoned-attempt invalidation. [B1-D05](../../decisions/ADR-0005-narrow-browser-to-go-service-surface.md) forbids a Go inference proxy; [B9-D06](../../decisions/ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) governs evidence labels. The approved [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) govern modal feedback/focus and responsive checks.

Protocol reference: [official llama.cpp server](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md). The short test requests `/chat/completions`, `stream: false`, `max_tokens: 32` and one constant user message, “Reply with OK.” Following the user's 2026-11-14 hands-on feedback, llama.cpp test requests send `chat_template_kwargs: { enable_thinking: false }` from browser TypeScript; Custom requests and Story generation retain their defaults. There is no server configuration change or automatic second attempt. The test validates the reply without displaying or retaining provider text. A normal-stop nonempty text response or valid token-limited reply is explicitly labelled **Connection successful**, with the limit disclosed where reached, including models producing no final text in that budget. Success establishes only that the entered request received a compatible response. It does not establish server model routing, full narration, streaming, model capability or future availability. The documented llama.cpp `/health` endpoint could establish loaded-server readiness, but would not exercise this selected chat/model request; it does not replace the accepted explicit connection test here. This is a test-depth refinement, not a change to Story proposal validation.

Three new affected rows extend the existing inventory; no whole-IDEA certification follows.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0014/R04 | Test connection deliberately sends one bounded synthetic request directly to the entered llama.cpp/Custom endpoint/model using its timeout, with no discovery or saved-profile prerequisite. It sends no story/input/history/private adventure or passage IDs, omits credentials/referrer, rejects redirects and never saves/selects a profile, draft or canonical turn. | `models.ts` testConnection/requestValue; `ConnectionSettings.svelte`; `connection-test.test.ts` captured request/configuration; `check-connection-test.mjs` actual direct HTTP and unchanged Go settings/draft/canon. |
| IDEA-0014/R05 | Results label valid complete and token-limited replies as connection success, disclose reached limits and distinguish pending, stopped and failed states. Browser llama.cpp test requests ask to disable thinking; Custom requests and Story generation retain provider defaults. Results are temporary and clear on edits, selection, reload or closing settings. Stop/timeout/Escape/page abandonment abort the browser request/body where possible and fence obsolete callbacks. A test is optional and never gates manual saving or later generation. | Settings test/stopTest/selectProfile/pagehide; JSON-reader cancellation; unit request/defaults/stalled-body/late reply cases; browser success/limit labels and per-kind request bodies, Stop/Escape/reload, edits, failed-test save; existing `check-models.mjs` generation without tests. |
| IDEA-0014/R06 | Invalid fields, HTTP access/model/rate/server errors, browser-network restrictions, malformed/oversized/unsupported replies and timeout yield actionable redacted feedback. Raw response bodies and transport exceptions never appear in results or persistent data. No automatic retry, proxy or fallback occurs. Controls and feedback remain keyboard accessible and fit the four approved widths in Dark/Bright. | `models.ts` validation/readJson/requestValue; unit response/failure cases; browser HTTP/CORS/redirect/timeout and responsive/focus/capture assertions. |

Paths resolve under [frontend/src/lib](../../../frontend/src/lib/), [frontend/tests](../../../frontend/tests/) and [frontend/scripts](../../../frontend/scripts/). CI includes the new browser exercise through `check-browser.mjs`, reusing the existing host/SQLite/restart workflow. No schema, wire, Go service or credential change is needed. Other accepted scope and deferrals remain open.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
