---
type: development-requirements
status: verified-on-confirmed-merge
created: "2026-11-14"
updated: "2026-11-14"
task: "DEV-004D"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004D — Local generation diagnostics

The user's separate 2026-11-14 launch authorises auditing DEV-004, selecting and implementing one bounded child, testing, independent review and one primary PR. Base: confirmed [PR #23](https://github.com/Levelleor/lorebound/pull/23) merge `bed467ac991a34a0acc157dc6b188584a102e546`, satisfying DEV-004C's approved conditional closure. After the checked review handoff and explicit named-PR finalise/merge request, the user authorised closure on 2026-11-14: “I approve this for closure.” This authorises finalising/merging PR #24 without claiming the user personally ran every automated check.

## Remaining requirements and dependency audit

At the confirmed PR #23 base, actual `models.ts`, `ConnectionSettings.svelte`, `StoryCoordinator`, `StoryWorkspace.svelte` and Go connection storage implemented optional discovery/testing, shared nonsecret llama.cpp/Custom profiles, completed and streamed Story requests, provisional output and explicit acceptance. They did not expose observed generation timing or provider-reported usage. The [DEV-003 remaining dependency boundary](./DEV-003.md#remaining-scope-audit--2026-11-08) remains applicable.

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

[Primary PR #24](https://github.com/Levelleor/lorebound/pull/24) owns implementation, evidence, controls and eventual conditional closure on `feat/dev-004d-generation-diagnostics`. [Application CI](https://github.com/Levelleor/lorebound/actions/runs/43626800597) PASS at `b3e8e10de8dcf52a4ea1644aae7b51aee5171c7a`: build/typecheck, named TypeScript contracts, Go/SQLite, actual Linux Firefox direct HTTP/lifecycle/diagnostics and exact process restart. Focused local provider/stream/diagnostic checks and the browser exercise also passed; no full local suite was repeated for review. Independent final source/accepted-scope/coverage/security/control review PASS with no remaining blockers; failure-usage retention and Bright contrast findings were fixed. All eight actual affected CI captures (Dark/Bright at 390/768/1024/1440) PASS independent visual review, including readability, wrapping and docked controls. Documentation-only readiness updates reuse that application evidence with applicable final-head repository checks.

A separate agent-operated live Linux Firefox smoke check PASS using llama.cpp 0.6.0-dev build 11429 (`d812350493`), Qwen3-4B-Q4_K_M.gguf, ROCm0 with 28 GPU layers/8192 context and loopback port 18085. Completed-response usage matched the provider's actual reported fields; explicit Accept/reload, subsequent streamed Stop, unchanged one-turn canon and cleared-on-reload diagnostics worked. The input used Qwen3's `/no_think` text instruction; no new API parameter was sent. This is a limited completed-usage/streamed-cancellation configuration check, not live terminal-stream-usage or universal interoperability certification. Hosted CI's provider replies remain simulated. Other OS packaging and full accessibility are unverified.

The [review adventure used for the checked handoff](http://127.0.0.1:8086/?adventure=311f696a-19f2-4b6e-ae63-cf5cdbf77502) served the exact frontend JavaScript/CSS for application source `b3e8e10`, with its own persistent `.local/review/dev004d` library, one accepted turn, Local Qwen3 review selected and retained input after Stop. Agent-launched review app/provider are stopped, with both loopback ports confirmed closed; all persistent review/user data is preserved. The PR/chat owns the Generate → Generation details, Retry, Stop and reload walkthrough. Relaunch from the repository root with `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004d"`; Ctrl+C stops a foreground launch. Prior review/user libraries remain preserved.

## Conditional single-PR closure

After the checked handoff, user feedback and named-PR approval request, the user said “I approve this for closure” on 2026-11-14. [Complete readiness CI](https://github.com/Levelleor/lorebound/actions/runs/43627518411) PASS at `e7cf1e56aaafbc1dfc6401f15056c02390e7624a`; independent readiness-documentation review PASS. Application source is unchanged from reviewed `b3e8e10`. Applicable final-head repository checks and independent closure review are still required before merge; the reviewed application evidence is reused for this documentation-only closure.

Prepared closure becomes effective only after independent closure review, applicable final-head checks and confirmed merge of this same PR. Then DEV-004D is VERIFIED within IDEA-0019/R07–R09; parent DEV-004 and affected original IDEAs remain PARTIAL. Counts stay sixteen partial / 36 without merged feature-level evidence / zero complete original IDEAs, 151 inventoried rows and three formal IDEA-0006 certifications. All 52 original notes remain in production; none is archived.

The user separately requested a future task to automatically accept newly submitted messages/completed continuations, expressly excluding edited turns and other operations. [IDEA-0069](../../inbox/Automatic%20Acceptance%20of%20New%20Turns.md) and its active brainstorm capture that user-origin request, with a linked future-work entry in TASKS. This records a candidate task, not staging acceptance, production readiness or an implementation launch. Existing confirmation behavior is unchanged in this PR. IDEA-0068 stays staged; other provider/credential/settings/pipeline/world obligations and B9-D12 deferral remain open.

Exactly one next task is DEV-004 audit/selection after confirmed closure and a separate user launch. Actual merge/head/tree provenance and final CI belong in PR #24/final handoff. No routine post-merge repository write, separate reconciliation PR or automatic next slice follows.
