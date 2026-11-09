---
type: development-requirements
status: implemented-unverified
created: "2026-11-08"
updated: "2026-11-09"
task: "DEV-004A"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004A — Direct browser local Story narration

After the [DEV-003 audit](./DEV-003.md#remaining-scope-audit--2026-11-08), the user explicitly authorised **“Proceed with a bounded DEV-004 child”**. This selects one first local narration child, implementation/tests, independent review and one primary PR. Finalising/merging that named PR still requires verbal approval after a hands-on handoff. Base: confirmed PR #20 merge `6f74134b6dd72228040939f9cfba22f12699ecd9`.

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

Ollama/LM Studio/vLLM-specific support, cloud adapters, credentials/custom headers and their OS-vault/consented encrypted fallback, streaming/usage diagnostics, configurable retries/sampling/pipelines/interpretation, other modes and nonempty effects remain later accepted obligations. Simulation is an explicit choice; it is never a fallback for a selected local profile. Tests use simulated compatible HTTP servers/responses with real browser/Go/SQLite execution; no live llama.cpp model or cross-platform packaging claim follows.

## Verification and handoff

[Primary PR #21](https://github.com/Levelleor/lorebound/pull/21) owns implementation, evidence, controls and eventual closure. [Full application CI](https://github.com/Levelleor/lorebound/actions/runs/42633647500) passed at `edc54d4`, including named TypeScript contracts, actual Go/SQLite upgrades and real Firefox/HTTP/CORS/recovery/process reopen. Independent source/coverage/documentation review passed after strict enum validation was corrected; eight Dark/Bright settings captures were reviewed. A responsive follow-up wraps long profile/model labels and preserves mobile header spacing, with maintained browser regression coverage. The PR owns the latest checked revision, follow-up CI and final review disposition; results are not verified-main truth before merge.

The checked local preview uses the separate persistent `.local/review/dev004a` library at [http://127.0.0.1:8086](http://127.0.0.1:8086). Relaunch with `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004a"`; Ctrl+C stops it. The PR/chat handoff supplies the manual-profile/discovery, proposal/Accept and failed-request demo. A real server must allow that browser origin. Provider prose in automated checks is simulated; live llama.cpp interoperability, other browser/OS combinations and full accessibility certification remain unverified.

**Awaiting user review and verbal approval to finalise and merge PR #21.** Closure details will be prepared on this branch only after that approval and stay conditional on confirmed merge. No next child starts through closure; no separate reconciliation PR or whole-IDEA archival.
