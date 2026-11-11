---
type: development-requirements
status: verified-on-confirmed-merge
created: "2026-11-09"
updated: "2026-11-10"
task: "DEV-004B"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004B — Provisional local Story streaming

The user's separate 2026-11-09 launch authorises auditing DEV-004, selecting one bounded child, implementation/tests, independent review and one primary PR. After the checked hands-on handoff and explicit named-PR approval request, the user approved finalising/merging PR #22 on 2026-11-10: “looks good lets close it up and kill the servers”. Base: confirmed [PR #21](https://github.com/Levelleor/lorebound/pull/21) merge `3e37f2dcd9d2f6018990a33579b44d87ee3cfe7f`; its checked final head/tree and closure are confirmed in that PR.

## Remaining DEV-004 scope and dependency audit

At the confirmed PR #21 base, actual `models.ts`, `StoryCoordinator`, `StoryWorkspace.svelte`, `ConnectionSettings.svelte` and Go connection storage implement DEV-004A's completed local Story narration, optional discovery, shared nonsecret profiles and explicit acceptance. That base does not implement streaming, cloud credentials, other named adapters or interpretation. DEV-003's [remaining dependencies](./DEV-003.md#remaining-scope-audit--2026-11-08) remain open.

| Remaining accepted scope | Prerequisites / disposition |
| --- | --- |
| Local incremental prose, cancellation and incomplete-stream rejection — IDEA-0013/0019 | Existing browser transport and coordinator attempt fences are available. **Selected child DEV-004B:** opt-in compatible SSE for current llama.cpp/Custom profiles, preserving deliberate completed-response mode. |
| Ollama, LM Studio and vLLM-specific adapters — IDEA-0013 | Separate protocol/capability and real-browser compatibility work; unselected. Custom compatibility is not certification of these named targets. |
| Cloud providers and profile secrets/headers — IDEA-0012/0014 | Narrow credential service review, OS vault/consented encrypted fallback, memory-only browser access and platform verification remain prerequisites. No sensitive Go methods are added here. |
| Connection tests, retry preferences and broader model diagnostics — IDEA-0014/0019 | Separate bounded implementation; no health-test prerequisite or automatic fallback/retry. Usage, timing and effective-parameter inspection remain later. |
| Style, capability and sampling controls — IDEA-0010/0015/0016 | Accepted controls need provider-capability/settings contracts; unselected. A streaming checkbox does not certify capability detection. |
| Task routing, configurable pipelines and interpretation/repair — IDEA-0017/0018/0045/0046 | Explicit stage contracts and supported typed event/subsystem owners remain prerequisites. This child retains the Story-only zero-effects acceptance boundary. |
| Spatial migration — B9-D12 | **DEFERRED — NO WORK.** |

## Accepted sources and bounded acceptance

[IDEA-0019](../../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) accepts incremental provisional prose, complete-attempt invalidation on Stop/failure/Retry/tab abandonment, truthful lifecycle status and redacted errors. Its 2026-10-23 clarification explicitly discards unfinished AI output rather than promising recovery. [IDEA-0013](../../production/Local%20LLM%20Server%20Connections.md) accepts supported streaming, direct browser requests and recoverable stream failures. [IDEA-0014](../../production/Provider%20Connection%20Profiles%20and%20Discovery.md) retains optional discovery/manual model choice; this slice does not change its stored profile contract.

[B1-D05](../../architecture/decisions/B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) forbids an inference proxy; [B9-D06](../../architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) requires honest fixture/integration labels. The approved [visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) supplies blue dashed provisional treatment and accessible docked Stop. Protocol references: [llama.cpp server](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md) and [WHATWG SSE framing](https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation). This is a completed single-choice text subset, not universal compatible-API certification.

New stable IDs below extend DEV-004A's existing affected inventory without certifying a whole IDEA.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0013/R04 | Existing llama.cpp/Custom profiles can deliberately request streamed or completed Story prose. Streaming is an unchecked session-only control for local connections; the selected mode/profile is captured for the request. No probe, automatic retry, proxy or response-mode fallback is introduced. | `models.ts` generateLocal/requestValue; `+page.svelte` narrate; `StoryWorkspace.svelte`; `streaming.test.ts`; `check-streaming.mjs` mode/direct-request assertions. |
| IDEA-0019/R03 | Valid text deltas display incrementally in a labelled provisional region while input and acceptance stay blocked. Preview text never enters canonical projections, SQLite drafts or recovery journals. | `StoryCoordinator` preview/prepareCandidate; `StoryWorkspace.svelte`; `streaming.test.ts` preview/accept guard; `check-streaming.mjs` actual in-flight display/canonical isolation. |
| IDEA-0019/R04 | Only one complete normal-stop text response with a framed completion marker can become an accept-ready proposal. EOF/disconnect, timeout, invalid UTF-8/JSON/framing, tool/refusal/error responses, unsupported choices/finish reasons and size violations discard the attempt, retain player input and preserve canon. | `models.ts` readContinuationStream; `streaming.test.ts` framing/failure/stalled-body cases; `check-streaming.mjs` interrupted/tool/malformed/length failures. |
| IDEA-0019/R05 | Stop, superseding Retry and navigation/reload/tab closure invalidate all preview and candidate output and abort the browser request/body where possible. Obsolete callbacks cannot overwrite a newer attempt; a completed proposal still needs explicit Accept. No AI preview recovery or remote-computation termination guarantee. | Coordinator sequence/live/stop/dispose; workspace pagehide; `streaming.test.ts` late callbacks and body abort; `check-streaming.mjs` Retry/Stop/navigation/reload/close. |
| IDEA-0019/R06 | Waiting, streaming, complete proposal, stopped and failed states use truthful labels with active profile/model. Errors contain no raw provider body. Streamed prose renders as text, wraps and leaves keyboard-accessible Stop visible at the four approved widths in Dark/Bright. | Workspace provisional/stream-option; `models.ts` errors; `streaming.test.ts` redaction; `check-streaming.mjs` responsive captures/control assertions. |

Paths resolve under [frontend/src](../../../frontend/src/), [frontend/tests](../../../frontend/tests/) and [frontend/scripts](../../../frontend/scripts/). Existing explicit acceptance, stale/version/epoch/idempotency/recovery and Go atomic commits remain the durable authority. No database/schema/wire change is needed.

## Verification and review boundary

[Primary PR #22](https://github.com/Levelleor/lorebound/pull/22) owns implementation, evidence, controls and eventual closure. [Application CI](https://github.com/Levelleor/lorebound/actions/runs/42644499354) PASS at `08f2e4232518c0b9089f041a5f64a811a61d513b`, including named TypeScript cases, Go/SQLite contracts, real Firefox streamed HTTP/failure/recovery and exact process reopen. Focused local stream/provider/coordinator tests, Svelte typecheck/build and Firefox streaming checks also passed. The unit command explicitly disables process isolation so this environment executes and reports named cases rather than only file-level child-process wrappers. Independent source/coverage/security/documentation review and all eight Dark/Bright CI-capture reviews PASS, with no blocking findings. No full suite was repeated for review and no verified-main claim is made.

CI uses simulated compatible HTTP responses with actual Linux Firefox → Wails → Go → SQLite. A separate agent-operated live smoke test PASS on the same application source using llama.cpp `0.6.0-dev` build 11429 (`d812350493`), `Qwen3-4B-Q4_K_M.gguf`, ROCm0 with 28 GPU layers/8192 context, and Linux Firefox. Actual browser discovery, incremental preview before acceptance, normal completion, explicit Accept, exact reload and a second-stream Stop worked in a disposable library; credentials/referrer were omitted. This limited configuration does not establish universal provider/model/browser interoperability, Windows/macOS packaging or full accessibility certification.

The checked local review host at port 8086 served application head `08f2e42` with separate persistent `.local/review/dev004b`, using the live loopback provider on port 18085. The app/provider were rechecked on 2026-11-10; **Streaming review** then had one accepted turn, that live profile selected and empty input. The PR/chat supplied the checked URL, checkbox/Generate/Accept/Stop demo and relaunch command. The user accepted the handoff and authorised closure without claiming they personally ran every test. Review/test hosts and the agent-launched provider are now stopped as requested; all persistent review libraries are preserved.

Other accepted provider/diagnostic/pipeline/world work remains open. The PR owns final-head checks, user disposition and eventual conditional closure; no separate reconciliation record or automatic next child follows.

## Conditional single-PR closure

The user authorised finalising/merging PR #22 after its checked review handoff. [Readiness-head CI](https://github.com/Levelleor/lorebound/actions/runs/42918156481) PASS at `03b8308fac614cfee901d6a279b103bb538283a4`, including the complete application/browser/restart rerun. Independent readiness-documentation review PASS; the application source is unchanged from reviewed head `08f2e42`.

This prepared closure becomes effective only after independent closure review, applicable final-head checks and confirmed merge of that same PR. Then DEV-004B is VERIFIED within its five affected requirements; parent DEV-004 and IDEA-0013/0019 remain PARTIAL. Counts remain sixteen partial / 36 without merged feature-level evidence / zero complete originals, with 145 inventoried rows and three formal IDEA-0006 certifications unchanged. No whole-IDEA archival or further certification follows. B9-D12 stays deferred. Exactly one next task is DEV-004 audit/selection after a separate launch; this closure starts no next child.

Actual merge/head/tree provenance and final CI belong in PR #22/final handoff. No routine post-merge repository write, separate reconciliation PR or automatic next slice follows.
