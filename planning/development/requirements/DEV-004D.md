---
type: development-requirements
status: in-progress
created: "2026-11-14"
updated: "2026-11-14"
task: "DEV-004D"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004D — Local generation diagnostics

The user's separate 2026-11-14 launch authorises auditing DEV-004, selecting and implementing one bounded child, testing, independent review and one primary PR. Base: confirmed [PR #23](https://github.com/Levelleor/lorebound/pull/23) merge `bed467ac991a34a0acc157dc6b188584a102e546`, satisfying DEV-004C's approved conditional closure. Finalising/merging this child's named PR still requires verbal approval after the hands-on handoff.

## Remaining requirements and dependency audit

Actual `models.ts`, `ConnectionSettings.svelte`, `StoryCoordinator`, `StoryWorkspace.svelte` and Go connection storage implement optional discovery/testing, shared nonsecret llama.cpp/Custom profiles, completed and streamed Story requests, provisional output and explicit acceptance. They do not expose observed generation timing or provider-reported usage. The [DEV-003 remaining dependency boundary](./DEV-003.md#remaining-scope-audit--2026-11-08) remains applicable.

| Remaining DEV-004 scope | Dependencies and disposition |
| --- | --- |
| Inspectable model/request settings, observed timing and optional usage — IDEA-0019 | Existing browser transport/coordinator can supply these without new settings, persistence or service methods. **Selected DEV-004D:** one session-only latest-attempt disclosure for current completed/streamed local Story narration. |
| Other named local adapters — IDEA-0013 | Separate protocol/capability and browser-interoperability work. Custom compatibility does not certify Ollama, LM Studio or vLLM. Unselected. |
| Cloud providers, credentials/custom headers — IDEA-0012/0014 | Narrow sensitive-service review, OS vault/consented encrypted fallback, memory-only browser access and platform checks remain prerequisites. Unselected. |
| Separate connection/access and generation tests — IDEA-0068 | Accepted in staging, not production-ready or launched. Existing connection testing remains unchanged. |
| Retry preferences, style/sampling and capability controls — IDEA-0010/0014/0015/0016 | Need effective-request/settings and provider-capability contracts. Inspector reports only current request fields and unknown server defaults; no automatic probes, retries or new sampling controls. |
| Routing, configurable pipelines, interpretation and repair — IDEA-0017/0018/0045/0046 | Need explicit stage contracts and supported typed event/subsystem ownership. Only existing Story narration is labelled here; zero-effects boundary remains. |
| Spatial migration — B9-D12 | **DEFERRED — NO WORK.** |

## Accepted sources and bounded requirements

[IDEA-0019](../../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) accepts inspectable provider/model, relevant request settings, observed request/stage timing, available usage and redacted diagnostics. [IDEA-0013](../../production/Local%20LLM%20Server%20Connections.md) and [IDEA-0014](../../production/Provider%20Connection%20Profiles%20and%20Discovery.md) retain direct browser networking, optional discovery/testing and explicit profile selection. [B1-D05](../../architecture/decisions/B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) forbids an inference proxy; [B9-D06](../../architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) governs evidence labels. The approved [visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) govern disclosure/focus/responsive treatment.

Protocol reference: [official llama.cpp server](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md). Only compatible `usage.prompt_tokens`, `completion_tokens` and `total_tokens` are considered. No `stream_options`, extra probe or request parameter is added to obtain usage. Reported counts are informational; values are never summed, reconciled or used to validate prose. Valid usage is exposed only after a complete validated response; failed/incomplete/stopped attempts have no retained usage. Browser elapsed time runs from generation invocation through validation, failure or Stop, rather than claiming model compute time or time to first token. No schema, wire, credential, Go service or durable diagnostic record is added.

Three new affected rows extend the existing inventory; no whole-IDEA certification follows.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0019/R07 | A collapsed keyboard-accessible Generation details disclosure captures the requested profile name/server type/model, response mode, timeout and Story narration stage for the latest local attempt. It distinguishes these actual request fields from unknown server-effective defaults/routing, and measures total browser elapsed milliseconds at normal completion, failure or Stop. | `generationDiagnostics.ts`; `models.ts` generateLocal; `coordinator.ts` prepareCandidate/finishedDiagnostics/stop; `GenerationInspector.svelte`; `generation-diagnostics.test.ts` captured configuration/timing/timeout; `check-streaming.mjs` actual Firefox labels, mode and keyboard disclosure. |
| IDEA-0019/R08 | Completed JSON or valid terminal SSE may report nonnegative safe integer input/output/total token fields, including zero and partial reports. Missing/malformed fields remain unavailable, with no token/cost estimates or inferred totals. Missing/invalid usage does not invalidate otherwise valid prose; usage cannot make an incomplete stream accept-ready. No extra request is sent or stream option added. | `models.ts` readUsage/readContinuationStream/generateLocal; unit completed/terminal/usage-only, malformed/partial/zero/oversized and missing-DONE cases; browser streamed usage and completed-mode unavailable feedback. |
| IDEA-0019/R09 | Diagnostics are latest-attempt session state only: Retry replaces them; Stop is immediately terminal; late callbacks after Stop/Retry/disposal cannot overwrite them; reload/navigation/new workspace clears them; Simulation produces no provider report. They contain only selected nonsecret fields/numeric counters, with no URLs, headers, raw provider bodies, prompts, response prose or story identities. Canon, drafts, settings and explicit acceptance remain unchanged. Four approved widths in Dark/Bright keep the inspector readable and docked acceptance/Stop usable. | Coordinator observer fences and session state; unit replacement/late callbacks/disposal/Simulation/whitelist cases; `check-streaming.mjs` actual HTTP, unchanged canon, Stop/failure/reload/navigation/close and eight diagnostic captures; existing provider/storage/restart CI. |

Paths resolve under [frontend/src/lib](../../../frontend/src/lib/), [frontend/tests](../../../frontend/tests/) and [frontend/scripts](../../../frontend/scripts/). The existing browser workflow runs the expanded streaming exercise; fixtures simulate provider responses while Firefox/Go/SQLite remain real. Other accepted obligations and original IDEA completion counts stay unchanged.

## Verification and handoff

Implementation is in progress on `feat/dev-004d-generation-diagnostics`. Focused local provider/stream/diagnostic unit checks, Svelte typecheck and frontend build PASS. Primary PR, applicable CI, independent final source/coverage/capture review and hands-on review handoff are pending. No merged-main or live-provider result is claimed. Hosted fixtures do not establish live-server interoperability, other operating systems or full accessibility certification.
