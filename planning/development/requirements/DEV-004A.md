---
type: development-requirements
status: verified-on-confirmed-merge
created: "2026-11-08"
updated: "2026-11-09"
task: "DEV-004A"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004A — Direct browser local Story narration

After the [DEV-003 audit](./DEV-003.md#remaining-scope-audit--2026-11-08), the user explicitly authorised **“Proceed with a bounded DEV-004 child”**. This selects one first local narration child, implementation/tests, independent review and one primary PR. After the checked hands-on handoff and explicit named-PR approval request, the user authorised closure of PR #21 on 2026-11-09: “otherwise proceed with closure”. Base: confirmed PR #20 merge `6f74134b6dd72228040939f9cfba22f12699ecd9`.

## Accepted sources and dependencies

[IDEA-0013](../../production/Local%20LLM%20Server%20Connections.md) accepts named llama.cpp and custom compatible endpoints, manual model selection, direct browser networking and recoverable failures. [IDEA-0014](../../production/Provider%20Connection%20Profiles%20and%20Discovery.md) accepts shared saved profiles, optional discovery/testing, no discovery prerequisite and Go-owned nonsecret SQLite settings. [IDEA-0019](../../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) owns abort/attempt invalidation and truthful diagnostics. IDEA-0012's later browser-only decision forbids a Go/Node inference proxy. [B1-D05](../../architecture/decisions/B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) and [B9-D06](../../architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) govern service scope and evidence labels. Existing StoryCoordinator/Go Commit supplies explicit acceptance, stale/epoch/idempotency recovery and current-only canon.

The [official llama.cpp server reference](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md) documents `/v1/models` and `/v1/chat/completions`. This child supports the completed text response subset, not universal interoperability with every template/model/server release.

## Bounded acceptance and affected inventory

These new stable rows inventory only affected clauses; none certifies a complete IDEA. Whole-IDEA inventory remains incomplete.

| ID | Observable acceptance in this child | Maintained source/tests |
| --- | --- | --- |
| IDEA-0013/R01 | Discovery and narration go directly from browser TypeScript to the deliberately selected endpoint, with no Go/Node proxy, automatic endpoint choice, redirect or fallback. Omit cookies/referrer; reject URL credentials/query/fragment and unsupported schemes. | `models.ts` endpointUrl/requestJson; `models.test.ts` fixed shape/discovery; `check-models.mjs` direct HTTP headers/CORS/redirect cases. |
| IDEA-0013/R02 | Named llama.cpp and Custom compatible profiles can generate one completed Story continuation using a manual model ID. Only validated nonempty text becomes a proposal; explicit acceptance alone reaches existing atomic canon. | `models.ts` generateLocal; `+page.svelte` narrate; `StoryCoordinator`; `models.test.ts` proposal/acceptance; `check-models.mjs` manual/Retry/Accept. |
| IDEA-0013/R03 | Network/browser-policy/HTTP/timeout/malformed/incomplete/tool responses leave canon unchanged and available input intact. Discovery failure does not prevent a deliberate generation request. | `models.ts` bounded readJson/requestJson; `models.test.ts` malformed/oversized/timeout cases; `check-models.mjs` partial/auth/redirect/CORS/timeout and unchanged canon/input. |
| IDEA-0014/R01 | Save/edit/delete multiple independently named stable profiles and select Simulation or one local profile. Metadata persists across browser/process restart and is shared across adventures without changing their versions/history/drafts/receipts. | `connections.go` transaction; `ConnectionSettings.svelte`; `connections_test.go` persistence/canonical isolation; `check-models.mjs` multiple profiles/deletion and `check-browser.mjs` exact process reopen. |
| IDEA-0014/R02 | Model discovery is explicit and optional. Manual IDs remain editable after failure; discovery never sends story text or generates. Report only what the probe established. | `ConnectionSettings.svelte` discover; `models.ts` discoverModels; `models.test.ts` no-prose probe; `check-models.mjs` failed discovery/manual ID then successful discovery. |
| IDEA-0014/R03 | Narrow epoch-fenced Go settings operations persist only fixed nonsecret fields. Stale settings do not silently overwrite newer settings; failed/unconfirmed writes are visible. No credential/header values, provider responses or prompts enter profile storage. | `service.go` narrow methods; `connections.go` fixed fields/epoch/revision; `connections_test.go` validation/rollback/idempotent retry; `check-models.mjs` stale-save retained form. |
| IDEA-0019/R01 | Timeout/Stop/navigation abort browser requests and invalidate obsolete attempts. Retry replaces the old proposal immediately; changing settings cannot retarget an in-flight attempt. No partial result can commit. | `models.ts` abort/time limits and captured profile; `StoryCoordinator` attempt fences; `models.test.ts` late result/profile mutation; `check-models.mjs` Stop/navigation/Escape during discovery. |
| IDEA-0019/R02 | Display truthful active source/model, waiting/completed/error states and redacted actionable errors. Explicit Simulation remains visibly simulated; local failure never substitutes its prose. | `+page.svelte` source selection; `StoryWorkspace.svelte` labels; `models.ts` redacted errors; `check-models.mjs` local failure/deleted profile/explicit Simulation and Dark/Bright captures. |

Source/test references above resolve under [frontend/src](../../../frontend/src/), [frontend/tests](../../../frontend/tests/), [frontend/scripts](../../../frontend/scripts/), [internal/store](../../../internal/store/) and the root [service](../../../service.go). These are maintained coverage targets; the primary PR/CI records execution and readiness.

## Security and remaining scope

Browser HTTP is subject to actual CORS/private-network/mixed-content rules. Fixed-field nonsecret profiles accept HTTP(S) base URLs without userinfo, query or fragment. Browser requests omit cookies and referrer, reject redirects, and bound response size/time. Errors never display raw provider bodies or transport exceptions. User-selected endpoints receive story prose only on deliberate generation; discovery sends no prose. Host/Origin filtering does not authenticate hostile local processes. No sensitive credential service is introduced.

Additive nonspatial database format 6 stores profile metadata/settings; existing canonical wire version 4 remains unchanged. Upgrades preserve existing library identity, baseline, prose, drafts and receipts; older binaries reject the newer database. B9-D12 remains **DEFERRED — NO WORK**.

Ollama/LM Studio/vLLM-specific support, cloud adapters, credentials/custom headers and their OS-vault/consented encrypted fallback, streaming/usage diagnostics, configurable retries/sampling/pipelines/interpretation, other modes and nonempty effects remain later accepted obligations. Simulation is an explicit choice; it is never a fallback for a selected local profile. CI uses simulated compatible HTTP servers/responses with real browser/Go/SQLite execution. A separate local live-model smoke test is described below; neither proves universal interoperability or cross-platform packaging.

## Verification and handoff

[Primary PR #21](https://github.com/Levelleor/lorebound/pull/21) owns implementation, evidence, controls and closure. [Readiness application CI](https://github.com/Levelleor/lorebound/actions/runs/42635258985) passed at `38d56a809950e2a77d27122c07dfcfe5fc71bad7`, including named TypeScript contracts, actual Go/SQLite upgrades and real Firefox/HTTP/CORS/recovery/process reopen. Independent source/coverage/security/documentation review and all nine final Dark/Bright/responsive captures PASS after strict enum validation, long source-label wrapping and mobile header spacing were corrected. The PR owns final-head checks and actual merge provenance; reviewed application CI is reused for documentation-only closure.

The owner supplied and authorised a [local llama.cpp testing recipe](../README.md#local-llamacpp-testing). A separate agent-operated live integration smoke test PASS on the same application revision using llama.cpp `0.6.0-dev` build 11429 (`d812350493`), `Qwen3-4B-Q4_K_M.gguf`, ROCm0 with 28 GPU layers/8192 context, and Linux Firefox. Actual browser discovery, completed narration, Retry replacement, explicit acceptance, exact browser reload and saved selection worked through the Go/SQLite host; no credentials/referrer were sent. The app used a disposable library and a separate loopback provider port. This is a limited live-model result, distinct from simulated CI fixtures; other server/model/browser/OS combinations, packaging and full accessibility certification remain unverified. Temporary output stays outside planning.

The checked preview/demo used separate persistent `.local/review/dev004a` at port 8086. Review/test hosts and the agent-launched provider are stopped; review data is preserved. Relaunch with `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004a"`; Ctrl+C stops it. The PR/chat handoff supplied manual-profile/discovery, proposal/Accept and failed-request flows. The user's closure approval accepts that handoff without claiming they personally ran every automated or live check.

## Conditional single-PR closure

The user authorised finalising/merging PR #21 after its checked review handoff. This closure becomes effective only after independent closure review, applicable final-head checks and confirmed merge of that same PR. Then DEV-004A is VERIFIED within the eight bounded affected requirements above; parent DEV-004 and IDEA-0013/0014/0019 remain PARTIAL. Feature totals become sixteen partial / 36 without feature-level evidence / zero complete; 140 inventoried rows and three formal IDEA-0006 certifications remain unchanged. No extra whole-row/whole-IDEA certification or archival follows.

All remaining accepted provider/credential/streaming/world scope and B9-D12 deferral remain visible. Exactly one next task is DEV-004 selection after a separate launch. Actual merge/head/tree provenance and final CI belong in PR #21/final handoff; no routine post-merge repository write, separate reconciliation PR or automatic next child.
