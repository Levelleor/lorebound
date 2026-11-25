---
id: STORY-0028
type: story
status: completed
parent: PRD-0015
depends_on:
- STORY-0027
- STORY-0026
priority: 3
related:
- PRD-0069
- PRD-0070
- PRD-0014
- PRD-0013
- PRD-0011
- PRD-0018
- PRD-0015
- PRD-0020
- PRD-0007
- STORY-0004
---

# Native Ollama Story connections

## Outcome

Native Ollama Story connections.

[Legacy task: DEV-004E](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-004e)

**Bounded delivery verified and merged:** [PR #25](https://github.com/Levelleor/lorebound/pull/25), confirmed on source main at `72895c7365db1a2680f26957b0b60aa34910059f`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-004E.md)

The user's separate 2026-11-14 launch (and “proceed”) authorises auditing DEV-004, selecting one bounded child, implementation, tests, independent review and one primary PR. Base: confirmed [PR #24](https://github.com/Levelleor/lorebound/pull/24) merge `2fc74e8`, satisfying DEV-004D's approved conditional closure. After the checked hands-on handoff, documentation feedback and named-PR finalise/merge request, the user authorised closure on 2026-11-14: “alright, lest close this task now”. This authorises finalising/merging this same PR without claiming the user personally ran every check.

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

[IDEA-0013](../../product/PRD-0014-local-llm-server-connections.md) accepts named Ollama support, protocol adaptation, local one-model use, discovery/manual entry, cancellation and actionable failure. [IDEA-0014](../../product/PRD-0015-provider-connection-profiles-and-discovery.md) accepts reusable profiles and optional direct-browser testing/discovery. [IDEA-0019](../../product/PRD-0020-streaming-cancellation-and-generation-diagnostics.md) accepts provisional streams, cancellation and redacted diagnostics. [B1-D05](../../decisions/ADR-0005-narrow-browser-to-go-service-surface.md) keeps inference in the browser; [B9-D06](../../decisions/ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) governs evidence limits. The approved [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) govern existing dialog/disclosure/responsive behavior.

Protocol sources: official [chat](https://docs.ollama.com/api/chat), [model list](https://docs.ollama.com/api/tags), [NDJSON streaming](https://docs.ollama.com/api/streaming) and [origin configuration](https://docs.ollama.com/faq). The explicit Ollama choice uses an API base ending in `/api` (default `http://127.0.0.1:11434/api`), appending `tags` or `chat`. Existing llama.cpp/Custom paths stay compatible. Switching types changes a known default URL only; a player-edited URL is retained. No protocol auto-detection or server installation/reconfiguration occurs.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0013/R05 | A named native Ollama profile saves/selects/reloads alongside existing profiles under existing revision/epoch guards. Completed Story requests directly POST selected model, messages and explicit `stream:false` to `/api/chat`. Only nonempty bounded assistant prose with `done:true` and `done_reason:stop` becomes a proposal; explicit Accept remains the only canonical write. | `models.ts`, `modelTransport.ts`, `ollama.ts`, `ConnectionSettings.svelte`; `ollama.test.ts` captured configuration/completed/error cases; Go `TestConnectionsPersistenceConflictEpochAndCanonicalIsolation` llama.cpp/Ollama subtests; `check-ollama.mjs` profile/reload/Retry/accept and canon isolation. |
| IDEA-0013/R06 | Opt-in native `application/x-ndjson` handles fragmented UTF-8/CRLF and terminal content, requiring `done:true` with normal `stop`; EOF without completion, length limits, malformed/oversized output and nonempty tools fail without accept-ready output. Thinking is never prose. Stop, timeout/navigation and existing sequence fences discard provisional output and retain input/canon, with no retry/fallback. Optional `prompt_eval_count`/`eval_count` map to input/output usage only after validated completion; totals remain unavailable. | `ollama.ts` native reader; `ollama.test.ts` byte splits, no-final-newline, malformed/tool/thinking/usage/abort/timeout cases; `check-ollama.mjs` real HTTP preview, terminal gating, errors, CORS/404, Stop/timeout/navigation and diagnostics clearing. Existing streaming/diagnostics coordinator regressions remain in CI. |
| IDEA-0013/R07 | Optional native discovery GETs `/api/tags` and lists validated unique model names without sending story; manual entry works after failure. Existing explicit connection test sends only “Reply with OK.” to `/api/chat` with `stream:false` and `options.num_predict:32`, reports complete/limited success and keeps settings/canon unchanged. No health gate, model download, capability probe, thinking override, credentials, redirects, cookies/referrer or Go proxy. UI identifies `/api` and origin requirements. | `ollama.ts` discovery/test; shared transport safeguards; `ollama.test.ts` paths/payloads/privacy/failures; `check-ollama.mjs` manual entry, discovery, complete/limited/error tests and direct-browser request assertions; existing connection-test lifecycle regressions exercise the unchanged UI owner. |

Paths resolve under [frontend/src/lib](../../../frontend/src/lib/), [frontend/tests](../../../frontend/tests/), [frontend/scripts](../../../frontend/scripts/) and [internal/store](../../../internal/store/). Existing IDEA-0014/R01–R06 and IDEA-0019/R07–R09 gain bounded Ollama coverage; no new whole-IDEA completion is claimed. Three new affected rows bring the inventory to 154 across the same sixteen original IDEAs. All originals remain in production.

Go only extends the permitted nonsecret profile kind. The existing text column needs no database migration or wire/shape change. Older frontends reject unsupported profile kinds rather than interpreting native profiles as compatible endpoints. New code accepts existing profiles without altering them. Canonical storage/contracts remain unchanged.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
