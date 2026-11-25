---
id: STORY-0027
type: story
status: completed
parent: PRD-0015
depends_on:
- STORY-0025
priority: 3
related:
- PRD-0069
- PRD-0020
- PRD-0014
- PRD-0013
- PRD-0011
- PRD-0018
- PRD-0015
- PRD-0007
- PRD-0070
- STORY-0004
---

# Local generation diagnostics

## Outcome

Local generation diagnostics.

[Legacy task: DEV-004D](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-004d)

**Bounded delivery verified and merged:** [PR #24](https://github.com/Levelleor/lorebound/pull/24), confirmed on source main at `2fc74e87ada0b471e00e32add9cef2c78275b59d`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-004D.md)

The user's separate 2026-11-14 launch authorises auditing DEV-004, selecting and implementing one bounded child, testing, independent review and one primary PR. Base: confirmed [PR #23](https://github.com/Levelleor/lorebound/pull/23) merge `bed467ac991a34a0acc157dc6b188584a102e546`, satisfying DEV-004C's approved conditional closure. After the checked review handoff and explicit named-PR finalise/merge request, the user authorised closure on 2026-11-14: “I approve this for closure.” This authorises finalising/merging PR #24 without claiming the user personally ran every automated check.

## Remaining requirements and dependency audit

At the confirmed PR #23 base, actual `models.ts`, `ConnectionSettings.svelte`, `StoryCoordinator`, `StoryWorkspace.svelte` and Go connection storage implemented optional discovery/testing, shared nonsecret llama.cpp/Custom profiles, completed and streamed Story requests, provisional output and explicit acceptance. They did not expose observed generation timing or provider-reported usage. The [DEV-003 remaining dependency boundary](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003.md#remaining-scope-audit--2026-11-08) remains applicable.

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

[IDEA-0019](../../product/PRD-0020-streaming-cancellation-and-generation-diagnostics.md) accepts inspectable provider/model, relevant request settings, observed request/stage timing, available usage and redacted diagnostics. [IDEA-0013](../../product/PRD-0014-local-llm-server-connections.md) and [IDEA-0014](../../product/PRD-0015-provider-connection-profiles-and-discovery.md) retain direct browser networking, optional discovery/testing and explicit profile selection. [B1-D05](../../decisions/ADR-0005-narrow-browser-to-go-service-surface.md) forbids an inference proxy; [B9-D06](../../decisions/ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) governs evidence labels. The approved [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) govern disclosure/focus/responsive treatment.

Protocol reference: [official llama.cpp server](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md). Only compatible `usage.prompt_tokens`, `completion_tokens` and `total_tokens` are considered. No `stream_options`, extra probe or request parameter is added to obtain usage. Reported counts are informational; values are never summed, reconciled or used to validate prose. Valid usage is exposed only after a complete validated response; failed/incomplete/stopped attempts have no retained usage. Browser elapsed time runs from generation invocation through validation, failure or Stop, rather than claiming model compute time or time to first token. No schema, wire, credential, Go service or durable diagnostic record is added.

Three new affected rows extend the existing inventory; no whole-IDEA certification follows.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0019/R07 | A collapsed keyboard-accessible Generation details disclosure captures the requested profile name/server type/model, response mode, timeout and Story narration stage for the latest local attempt. It distinguishes these actual request fields from unknown server-effective defaults/routing, and measures total browser elapsed milliseconds at normal completion, failure or Stop. | `generationDiagnostics.ts`; `models.ts` generateLocal; `coordinator.ts` prepareCandidate/finishedDiagnostics/stop; `GenerationInspector.svelte`; `generation-diagnostics.test.ts` captured configuration/timing/timeout; `check-streaming.mjs` actual Firefox labels, mode and keyboard disclosure. |
| IDEA-0019/R08 | Completed JSON or valid terminal SSE may report nonnegative safe integer input/output/total token fields, including zero and partial reports. Missing/malformed fields remain unavailable, with no token/cost estimates or inferred totals. Missing/invalid usage does not invalidate otherwise valid prose; usage cannot make an incomplete stream accept-ready. No extra request is sent or stream option added. | `models.ts` readUsage/readContinuationStream/generateLocal; unit completed/terminal/usage-only, malformed/partial/zero/oversized and missing-DONE cases; browser streamed usage and completed-mode unavailable feedback. |
| IDEA-0019/R09 | Diagnostics are latest-attempt session state only: Retry replaces them; Stop is immediately terminal; late callbacks after Stop/Retry/disposal cannot overwrite them; reload/navigation/new workspace clears them; Simulation produces no provider report. They contain only selected nonsecret fields/numeric counters, with no URLs, headers, raw provider bodies, prompts, response prose or story identities. Canon, drafts, settings and explicit acceptance remain unchanged. Four approved widths in Dark/Bright keep the inspector readable and docked acceptance/Stop usable. | Coordinator observer fences and session state; unit replacement/late callbacks/disposal/Simulation/whitelist cases; `check-streaming.mjs` actual HTTP, unchanged canon, Stop/failure/reload/navigation/close and eight diagnostic captures; existing provider/storage/restart CI. |

Paths resolve under [frontend/src/lib](../../../frontend/src/lib/), [frontend/tests](../../../frontend/tests/) and [frontend/scripts](../../../frontend/scripts/). The existing browser workflow runs the expanded streaming exercise; fixtures simulate provider responses while Firefox/Go/SQLite remain real. Other accepted obligations and original IDEA completion counts stay unchanged.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
