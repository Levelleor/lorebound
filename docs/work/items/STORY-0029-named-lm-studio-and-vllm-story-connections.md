---
id: STORY-0029
type: story
status: completed
parent: PRD-0015
depends_on:
- STORY-0028
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

# Named LM Studio and vLLM Story connections

## Outcome

Named LM Studio and vLLM Story connections.

[Legacy task: DEV-004F](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-004f)

**Bounded delivery verified and merged:** [PR #26](https://github.com/Levelleor/lorebound/pull/26), confirmed on source main at `4e565762c03660a9f4ee4fe3f961a453ca060fbf`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-004F.md)

The user's separate 2026-11-14 launch authorises auditing DEV-004, selecting one bounded child, implementation, tests, independent review and one primary PR. Base: confirmed [PR #25](https://github.com/Levelleor/lorebound/pull/25) merge `72895c7365db1a2680f26957b0b60aa34910059f`, satisfying DEV-004E's approved conditional closure. After the checked hands-on handoff and named-PR finalise/merge request, the user said “ok proceed with closure” on 2026-11-14. This authorises finalising/merging this same PR without claiming the user personally ran every check.

## Remaining scope and dependency audit

At this base, actual `models.ts`, `ConnectionSettings.svelte`, `generationDiagnostics.ts` and Go `connections.go` accept only llama.cpp, native Ollama and Custom kinds. Compatible discovery, synthetic testing, completed responses and SSE are implemented, but there are no named LM Studio/vLLM profiles, defaults or setup guidance. The existing Story coordinator, direct browser transport safeguards, nonsecret SQLite settings and explicit atomic acceptance can be reused.

| Remaining DEV-004 scope | Disposition/dependencies |
| --- | --- |
| Named local servers — IDEA-0013 | **Selected: LM Studio and vLLM**, one cohesive compatible-API child. Named nonsecret profiles, defaults/guidance and existing optional discovery/test, completed/SSE narration, cancellation and diagnostics. Authentication and live-server certification remain outside this slice. |
| Live native Ollama verification | [INC-001](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/INCOMPLETE-FEATURES.md#inc-001--native-ollama-live-server-verification-outstanding) stays OPEN; no Ollama installation/model is required for this child. |
| Cloud/credentials/custom headers — IDEA-0012/0014 | Later sensitive-service/platform work, native vault/consented encrypted fallback and memory-only browser credentials. No new privileged service or inference proxy. |
| Connection/access versus generation tests — IDEA-0068 | Staged; no readiness/implementation authority. Reuse the existing explicit 32-token synthetic generation test without a new workflow or thinking override. |
| Retry preferences, style, sampling/capabilities — IDEA-0010/0014/0015/0016 | Later effective-request/settings and capability contracts. No automatic retry, extra parameters, fallback or capability probe. |
| Routing/pipelines/interpretation/repair — IDEA-0017/0018/0045/0046 | Later stage/event/subsystem contracts; only existing Story narration is supported. |
| Automatic new-turn acceptance — IDEA-0069 | Unaccepted candidate; explicit Accept remains authoritative. |
| Spatial migration — B9-D12 | **DEFERRED — NO WORK.** |

## Accepted sources and requirements

[IDEA-0013](../../product/PRD-0014-local-llm-server-connections.md) explicitly requires named LM Studio/vLLM support, permits shared compatible transport and accepts optional discovery/manual entry, cancellation and actionable failure. [IDEA-0014](../../product/PRD-0015-provider-connection-profiles-and-discovery.md) owns reusable profiles and optional direct-browser tests/discovery. [IDEA-0019](../../product/PRD-0020-streaming-cancellation-and-generation-diagnostics.md) owns provisional output, cancellation and redacted diagnostics. [B1-D05](../../decisions/ADR-0005-narrow-browser-to-go-service-surface.md) keeps inference in the browser; [B9-D06](../../decisions/ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) governs simulated evidence. The approved [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) govern the existing dialog/disclosure.

Official protocol references: [LM Studio compatible endpoints](https://lmstudio.ai/docs/developer/openai-compat), [chat](https://lmstudio.ai/docs/developer/openai-compat/chat-completions), [models](https://lmstudio.ai/docs/developer/openai-compat/models), [server/CORS settings](https://lmstudio.ai/docs/cli/serve/server-start), [vLLM compatible server](https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/) and [vLLM CORS options](https://docs.vllm.ai/en/latest/cli/serve/). Both use `/v1/models` and `/v1/chat/completions`; suggested loopback bases use ports 1234 and 8000 respectively. Actual ports, browser origins/headers and loaded model/chat-template configuration remain the player's server configuration. The application does not install/start/reconfigure servers or advise disabling authentication. An authentication-required endpoint remains unsupported until credential work is delivered.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0013/R08 | Models offers named LM Studio/vLLM types with appropriate loopback `/v1` suggestions and CORS/chat-template guidance. Type changes replace only the previous default URL, preserving other URLs. Each nonsecret kind saves/selects/reloads alongside prior profiles under existing revision/epoch guards; no schema/wire change. | `modelServers.ts`, `ConnectionSettings.svelte`, strict TS/Go kind validation; `named-servers.test.ts`; Go `TestConnectionsPersistenceConflictEpochAndCanonicalIsolation` named subtests; `check-named-servers.mjs` defaults, URL preservation and saved reload; `check-browser.mjs` exact process restart. |
| IDEA-0013/R09 | Both named types directly request selected-model completed or opt-in SSE Story narration using the compatible transport, without new provider-specific overrides. Complete normal-stop output alone becomes a proposal; streams also require `[DONE]`. Stop/failure/incomplete output retains input and leaves canon unchanged. Existing explicit Accept commits; diagnostics display the selected named server. | `models.ts`, existing `modelTransport.ts` and coordinator; `generationDiagnostics.ts`, `GenerationInspector.svelte`; `named-servers.test.ts` payload/terminal/usage contracts; `check-named-servers.mjs` completed/SSE, diagnostics, terminal gating, Stop, access failure and explicit acceptance; existing `streaming.test.ts` and browser lifecycle regressions remain in CI. |
| IDEA-0013/R10 | Optional compatible discovery sends no story and permits manual model entry after failure. Optional test sends only the entered model and existing bounded synthetic request, without llama.cpp's thinking override or settings/canonical writes. Authentication/browser-policy errors remain recoverable, redacted and without automatic proxy/retry/fallback. | `models.ts`, `modelTransport.ts`; `named-servers.test.ts` exact paths/payload/privacy; `check-named-servers.mjs` real browser discovery success/failure/manual entry, test request/isolation and authentication failure; existing connection-test and transport contracts cover timeout/cancellation/CORS/redirect safeguards. |

Paths resolve under [frontend/src/lib](../../../frontend/src/lib/), [frontend/tests](../../../frontend/tests/), [frontend/scripts](../../../frontend/scripts/) and [internal/store](../../../internal/store/). Three new affected rows bring the inventory to 157 across the same sixteen original IDEAs; this is inventory, not verified-main completion. Existing profile/streaming/diagnostic requirements gain bounded named-server coverage. Parent DEV-004 and original IDEAs remain PARTIAL; no original note is archived and three formal IDEA-0006 certifications stay unchanged.

Go only extends the permitted values in the existing nonsecret kind column. Old profiles retain their values; older frontends reject unsupported new kinds rather than interpreting them as another protocol. Canonical history, drafts, wire version 4 and database format 6 are unchanged.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
