---
type: architecture
status: closed-design-only
phase: "B1"
created: "2026-10-25"
updated: "2026-10-25"
tags:
  - planning/architecture
  - pass-b
  - feasibility
  - review
---

# Pass B1 — Feasibility Evidence and Closure Review

> **B1 design formally closed on 2026-10-25 by explicit user decisions [P-B1-01](./decisions/P-B1-01%20-%20Trusted%20Locally%20Installed%20Plugins.md) and [P-B1-02](./decisions/P-B1-02%20-%20Design%20Closure%20with%20Deferred%20Integration%20Gates.md).** The selected initial plugin policy is **trusted locally installed executable plugins with explicit player trust**. B1 architectural feasibility research is complete, but **no Lorebound Wails/Go build, provider-authenticated browser run, or integrated end-to-end test has passed**. Such checks remain mandatory implementation/release verification gates, not accepted functionality. The six B1-D01–D06 ADRs remain accepted and unchanged.

## Scope and evidence standard

Sources: [Pass B1 foundations](./Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md), [consolidated 12-subsystem architecture](./Consolidated%20Subsystem%20Architecture.md), [Pass A closure audit](./Pass%20A%20Closure%20Audit.md) and their linked accepted staging ideas. No staging idea was promoted, no feature was implemented and no user secrets/accounts were accessed.

Evidence labels:

- **Documented:** current upstream maintainers' documentation explains the mechanism or constraints; not an executed Lorebound test.
- **Third-party observed:** another project's dated measurements, not Lorebound verification and subject to change.
- **Mechanism exercised:** an isolated runnable experiment demonstrates underlying semantics, not Lorebound/Wails/Go integration.
- **Unverified:** actual user-facing production behaviour or integration has not been exercised.
- **Decision pending:** material product trust/scope policy requires the requesting user's explicit choice.

## Executive gate matrix

| Gate | Evidence found / exercised | Research disposition | Still needed before implementation/release claims |
| --- | --- | --- | --- |
| **F-B1-01 Wails server** | Maintainers document `-tags server`, ordinary-browser assets, Go bindings, multi-tab WebSocket events, shutdown, platform builds and same-origin checks. Wails v3 **beta.34** appeared **2026-10-20**; beta.31 requires **Go 1.26+**. | **Documented feasible; integration not tested.** | Pin/test a beta with Go 1.26+, build embedded static SvelteKit assets, bound loopback startup, browser service call/event, shutdown, platform builds. |
| **F-B1-02 Provider browser connectivity** | Official browser support/CORS configuration plus dated independent CORS checks for all four cloud connectors; local-server CORS settings documented. | **Conditional, endpoint-specific; unverified live in Lorebound.** | Test OPTIONS **and** successful authenticated request and errors from actual Lorebound localhost origin; stream, abort and discovery for every named adapter and chosen endpoint. |
| **F-B1-03 Loopback service/credentials** | Current Wails server docs describe same-origin runtime calls, Host checks, WebSocket origin protection; non-browser calls without browser headers still accepted. Vendor SDKs warn keys in browser code are extractable. | **Risk characterised, not security verified.** | Threat-model and test loopback/Host/Origin/CSRF/DNS-rebinding, secret method exposure and in-memory copy handling in real app; disclose hostile-local-client and browser-extension limits. |
| **F-B1-04 Cross-tab/version/epoch** | Isolated Python SQLite exercise passed concurrent version conflict, no partial write, after-restore epoch tests. | **SQLite mechanism exercised; Wails multi-tab integration untested.** | Go service integration with two browser tabs, missed WebSocket notice, cancelled/late attempts, stale epoch after restore. |
| **F-B1-05 Backup/restore/maintenance** | Same exercise passed rollback, WAL-aware SQLite online backup, blocking both canonical/draft writes, restore/reopen and epoch rejection. SQLite's own docs support online backup. | **SQLite mechanism exercised; Go maintenance/WAL replace hardening untested.** | Go transaction+maintenance lock; safe real WAL lifecycle, backup destination errors, same-disk/different-disk restore, shutdown/recovery and OS-specific file access. |
| **F-B1-06 Plugin trust** | Browser-side modules in one same-origin application share execution privileges unless specifically isolated. Permission metadata is not a sandbox. | **Product decision required.** | User chooses trusted local executable module policy versus security isolation scope. Separate module loading/versioning details can follow later. |

## F-B1-01: Headless Wails feasibility

Current official references:

- [Wails v3 server-build guide](https://v3.wails.io/guides/server-build/) documents **ordinary browser** hosting, embedded frontend assets, Go `application.Service` bindings, WebSocket back-to-browser events, each tab named `browser-N`, `-tags server` build, pure Go/no CGO headless mode and loopback `Host` configuration.
- [Wails v3 changelog](https://v3.wails.io/changelog/) identifies **v3.0.0-beta.34 (2026-10-20)**, and records **Go 1.26 minimum introduced by beta.31 (2026-10-18)**, plus security hardening in that release for runtime POST/Origin and loopback Host headers.
- [Wails v3 status](https://v3.wails.io/status/) still identifies v3 as **beta**. The roadmap's toolchain statement may lag the more recent changelog; use the pinned version's `go.mod` and changelog as operative requirements.

Critical findings:

1. The server mode is a first-class documented build path, not a hypothetical use of desktop WebViews.
2. `ServerOptions.Host` must remain loopback; **do not** inadvertently override it with `WAILS_SERVER_HOST=0.0.0.0`.
3. The server-mode `/wails/runtime` uses same-origin/Host checks; no permissive `WebSocketAllowAllOrigins`. It is designed for the frontend to be served **by the same Wails server**, not a production cross-origin static host.
4. The current runtime **accepts non-browser requests missing `Origin` and `Sec-Fetch-Site`**, according to the official guide; this is consistent with the previously disclosed absence of authenticated local-process protection.
5. Packaging, port selection and system-browser launch require actual platform checks; native window-dependent APIs and GUI dialogs are unavailable in headless mode.
6. **Execution blocker here:** isolated execution environment has **Go 1.23.2**, no cached Wails package and no external DNS for downloading Go/Wails dependencies; a real current Wails `-tags server` build cannot be performed. Do **not** record the build, JS bindings or events as passed.

**Disposition:** viable selected design at documentation level; **runtime integration proof outstanding**, not a reason to substitute the accepted host framework without a failing test.

## F-B1-02: Browser-to-provider compatibility

Browser HTTP/CORS must be evaluated per origin **and per endpoint**, including successful responses, auth failures, streaming and optional preflight headers. Failure of a browser-origin request must be surfaced to the user; the accepted architecture does **not** permit transparent Go/Node inference proxy or automatic alternative-model fallback.

### Four accepted cloud connectors

| Provider | Current evidence | Confidence/constraint |
| --- | --- | --- |
| **OpenAI** | Official [SDK docs](https://developers.openai.com/api/reference/typescript) permit `dangerouslyAllowBrowser`; [OpenAI API guidance](https://developers.openai.com/api/reference/overview) advises **not** to expose API keys in browser/app code. Independent [OpenPencil browser CORS tests](https://github.com/open-pencil/open-pencil/blob/master/packages/docs/programmable/byok-provider-compatibility.md) reported `ACAO: *` for OpenAI on **2026-07-30**. | **Browser technically plausible**, but vendor credential warning is material. Live Lorebound authenticated test missing. |
| **Anthropic** | [Official TypeScript SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript) supports browser use with `dangerouslyAllowBrowser: true`; [official release notes](https://platform.claude.com/docs/en/release-notes/overview) document API CORS headers. Dated independent test reports required `anthropic-dangerous-direct-browser-access: true` header. | **Browser technically supported with explicit opt-in**, but credentials remain inspectable to browser-running code. Live test missing. |
| **Gemini** | [Google Gemini API-key guidance](https://ai.google.dev/gemini-api/docs/api-key) recommends a backend proxy for production key secrecy and warns not to expose keys client-side. Independent 2026-07-30 test reports Google API echoes browser origin. | **Browser plausible**, vendor security advice conflicts with any promise of server-only key secrecy. Live test missing. |
| **OpenRouter** | [Official API docs](https://openrouter.ai/docs/api_reference/overview) document request interfaces but do not give a dependable cross-origin guarantee in reviewed pages. Independent 2026-07-30 test reports `ACAO: *`. | **Third-party observed browser compatibility only**; treat endpoint/stream/error-path validation as open. |

The [OpenPencil 2026-07-30 BYOK report](https://github.com/open-pencil/open-pencil/blob/master/packages/docs/programmable/byok-provider-compatibility.md) is **not official/provider certification** and warns that preflight results, successful calls and error CORS headers can differ. Do not silently convert that report into a Lorebound pass.

### Four accepted local endpoint families

| Local runtime | Official documented browser-origin behaviour | Required Lorebound handling |
| --- | --- | --- |
| **Ollama** | [Ollama FAQ](https://docs.ollama.com/faq) documents allowed loopback origins and `OLLAMA_ORIGINS` for additional sources. | Verify the exact browser host spelling/port and endpoint; guide user to configure permitted origins if necessary. |
| **LM Studio** | [LM Studio server settings](https://lmstudio.ai/docs/developer/core/server/settings) provide explicit **Enable CORS** switch; [CLI docs](https://beta.lmstudio.ai/docs/cli/server-start) describe `--cors` option, disabled by default when omitted. | Detect/report disabled CORS and provide clear setup guidance; do not switch to Go transport. |
| **vLLM** | Current [vLLM CLI docs](https://docs.vllm.ai/en/latest/cli/serve/) specify `--allowed-origins` and **default `[]`**, i.e. cross-origin access disabled. Older vLLM releases documented a `*` default; version matters. | Require explicit permitted localhost browser origins; test optional authentication and all relevant streaming endpoints. |
| **llama.cpp** | [Official llama-server README](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md) documents `--cors-origins`, allowed methods/headers and defaults, including an origin-reflection default. | Support explicitly configured origin policy; recommend restricting CORS to the application localhost origin rather than broad allow-all. |

**Credentials:** Under accepted A-04/A-27, Go persists credentials at rest, but browser TypeScript must retrieve active API keys for direct provider calls. A **memory-only cache limits persistence but cannot make the token secret from the browser execution context, extensions, injected scripts or other hostile same-origin code**. This is an explicit accepted architectural trade-off, not a new security feature. Recommend per-provider restricted keys, spend caps, rotation and honest warnings. Never log or persist plaintext credentials in SQLite or browser storage.

**Actual tests:** No valid provider API keys or model servers were available for this review. External DNS was unavailable to the executable sandbox. A synthetic Chromium local-CORS check was attempted but **timed out without a result**; it is **not** a pass. No preflight, authenticated success, streaming or abort behaviour has been verified here against real providers.

**Disposition:** **conditional feasibility**, with a standard compatibility-test matrix required once a runnable application and test credentials/servers exist.

## F-B1-03: Loopback Go service and credential exposure

Reviewed [current Wails server documentation](https://v3.wails.io/guides/server-build/):

- Server-mode `/wails/runtime` only accepts `POST`, and browser-origin requests from an unapproved origin are rejected. WebSocket origin checks are enabled by default. Loopback-bound servers reject non-permitted `Host` headers, reducing DNS rebinding risk.
- **These checks do not authenticate a local executable.** HTTP clients that omit browser-origin metadata are accepted, and a local process may forge headers. Do not claim protection from arbitrary local clients.
- Wails may be used behind reverse proxies, but Lorebound's selected build should **not** add cross-origin proxy exceptions or bind on all interfaces by default.
- Browser JavaScript receives active API secrets under the accepted direct transport design; a malicious browser extension or same-origin loaded untrusted plugin could access sensitive application facilities.
- For any privileged Go method, constrain accepted arguments, reject unexpected filesystem paths/methods, preserve server-owned state-changing transaction constraints and keep response/error logging secret-free. An app login/session framework remains **out of scope by A-27**.

**Disposition:** risk boundary **characterised**, but not penetration-tested. Ordinary Host/Origin request filtering and narrow methods can be used as baseline protections without presenting them as proven hostile-local-client security.

### Editorial reconciliation of prior `auth` language

The consolidated architecture's §5 phrase “Go/SQLite enforces atomicity, **auth** and stale-version conflicts” is incompatible with the intended absence of Lorebound application authentication in A-27. Its **clarified scope** should read: “Go/SQLite enforces **atomicity, structural/storage integrity, maintenance fencing, expected-version and library-epoch checks, and limited request filtering; it does not perform a second gameplay-validation pass or implement a Lorebound login/session-authentication system**.” This changes documentation wording, not accepted feature scope or implemented capability.

## F-B1-04 / F-B1-05: Executed SQLite mechanism exercise

**Exercise run 2026-10-25:** isolated Python `sqlite3` against **SQLite 3.46.1** in a temporary directory, with WAL mode, two independent connections, shared application-level maintenance/epoch checks and SQLite transactions. **11 out of 11 checks passed**:

| # | Check | Result |
| --- | --- | --- |
| 1 | Two concurrent writers both expect version 42: only one commits, the other receives stale-version result | Pass |
| 2 | Exactly one winner's passage and event written atomically | Pass |
| 3 | Forced foreign-key failure after passage insert rolls back **both prose and events and version bump** | Pass |
| 4 | Application-held maintenance gate rejects canonical change writes | Pass |
| 5 | Same maintenance gate rejects latest-value draft writes | Pass |
| 6 | SQLite online backup captures committed data in WAL mode and destination passes integrity check | Pass |
| 7 | Writes resume once backup gate is released | Pass |
| 8 | Original database advances independently after snapshot | Pass |
| 9 | Restored full snapshot reflects prior version, with SQLite integrity check OK | Pass |
| 10 | Old library epoch rejected **even though restored adventure version matches old expected version** | Pass |
| 11 | New epoch permits a fresh post-restore commit | Pass |

Actual output reported competing write outcomes **`committed`** and **`stale_version`**, a **`rolled_back_integrity_error`** on the forced bad event, old-epoch rejection as **`stale_epoch`**, and successful fresh-epoch commit.

**Scope limits:** The maintenance gate and epoch in this exercise were test-harness logic, **not tested Go/Wails services**. It did not test actual browser tabs, WebSocket misses, fetch abortion, permissioned file pickers, cross-platform filesystem replacement, power failure or crash recovery. The test's restore closed database connections, removed WAL/SHM companions and replaced the file in a controlled temporary directory. **Do not generalise that simplistic companion-file cleanup to arbitrary production states.** SQLite [WAL documentation](https://www.sqlite.org/wal.html) warns committed frames in hot WAL files are part of durable database state; the safe real implementation must quiesce/close/checkpoint correctly using SQLite's supported procedures before replacement.

Official [SQLite Online Backup API](https://www.sqlite.org/backup.html) provides the consistent snapshot mechanism without naive raw copying of the live main database file.

**Disposition:** the core **SQLite approach is mechanically demonstrated**; go-backed service/concurrency/maintenance implementation still requires integration tests. No fabricated game-level or server-level test success is claimed.

## F-B1-06: Plugin trust decision, approved trusted-code policy

The accepted IDEA-0047/0055 provides typed capability registration and optional mechanics without an automatic external/MCP integration. It has **not** determined whether plugin executables must be isolated from hostile third-party code.

### Decision P-B1-01 — Initial plugin trust policy

| Option | Scope and consequence |
| --- | --- |
| **A. Trusted locally installed plugins (recommended)** | Initially permit optional core/installed TypeScript mechanics **only when the player explicitly trusts the code**. Treat them as privileged executable application extensions. Registry permission descriptions still scope gameplay operations, **not** arbitrary hostile-JavaScript isolation. Warn that malicious extensions can access what the browser process can access, including in-memory provider keys. Defer sandboxed untrusted-plugin support to separately accepted security design. |
| **B. Sandboxed untrusted third-party plugins at initial launch** | Treat installed plugins as hostile by default; require a designed worker/isolated-origin/process mediation boundary with capabilities, credential isolation, code loading policy and tests. This is **significant new architectural/security work** and cannot be asserted to exist by using registry permissions. |
| **C. Defer executable external plugins initially** | Keep the accepted optional mechanics architecture and capability-registry interface, but only ship built-in mechanics until a later separately approved third-party loading/security policy. **This modifies sequencing, not the original acceptance that optional mods belong to the envisioned product**. |

**Accepted 2026-10-25:** The user explicitly selected **A**, trusted locally installed executable plugins with explicit player trust and risk disclosure. See [P-B1-01 ADR](./decisions/P-B1-01%20-%20Trusted%20Locally%20Installed%20Plugins.md). Sandboxed untrusted plugins are **not approved** for this initial scope, and neither registry permission metadata nor Go service filtering can guarantee containment of malicious same-origin executable plugin code. Implementation/UX details remain later design and verification work.

## Closure determination — approved 2026-10-25

- **B1 architectural decision review: CLOSED FOR DESIGN.** User approved six B1-D01–D06 ADRs on 2026-10-25, then explicitly chose initial **trusted executable plugins (P-B1-01 option A)** and **design-only closure with mandatory later integration smoke testing (P-B1-02 option A)**.
- **Research: COMPLETE at documented/mechanism level.** Wails server and browser-provider paths are researched, isolated SQLite exercise passed 11 checks, and local security limitations are characterised.
- **Live integrated runtime proof: NOT COMPLETE.** F-B1-01–F-B1-05 retain their researched status, not a pass. F-B1-06's **policy choice is accepted**, but implementation-specific plugin risk controls are not verified. No Wails binary or authenticated live provider integration was tested.
- **Deferred, mandatory gates:** Before individual features can be claimed implemented/verified or released, run and record the applicable Wails/browser provider/localhost/Go-SQLite/trusted-plugin integration checks listed below. Failure requiring a changed product architecture returns for explicit approval.
- **No collateral approval:** This sign-off does not move any of the 52 staged ideas to production or specs, authorise code implementation from staging, add account/session authentication, proxy inference through Go, or introduce another AI validation gate.

See [P-B1-01](./decisions/P-B1-01%20-%20Trusted%20Locally%20Installed%20Plugins.md) and [P-B1-02](./decisions/P-B1-02%20-%20Design%20Closure%20with%20Deferred%20Integration%20Gates.md). The next architecture design pass may proceed under these constraints.

## Suggested acceptance criteria for a later integrated smoke pass

1. Pin a current Wails server beta and matching Go toolchain; build/run `-tags server` with embedded static SvelteKit and one Go method and event. Verify loopback-only bind, no accidental all-interface environment override, browser refresh, second tab and shutdown on Windows/macOS/Linux test runners as applicable.
2. From actual localhost app origin, for each of 4 cloud and 4 local adapter families test CORS preflight **plus** a successful credentialed completion, browser streaming, abort on cancel, meaningful error on denied origin, and discovery when supported. Use opted-in test credentials with spending limits; don't check keys into Git.
3. Exercise Host/Origin/DNS-rebinding-like requests to the Wails runtime, non-browser local client exposure and vault/sidecar secret methods. Report residual hostile-local-client risk explicitly rather than claiming authenticated local access.
4. Exercise competing Go commits, missed tab event, stale draft, maintenance lock and library-epoch rejection from two real tabs.
5. Exercise online SQLite snapshot including WAL writes, cancelled backup, permission/space failure, full-library destructive restore with quiesced handles, and post-restore stale tab. No partial canonical writes.
6. Verify selected plugin trust policy/permission messaging and ensure model secrets cannot be casually exposed by unintended logs or untrusted third-party code under the chosen model.

## Change history

- **2026-10-25:** Initial evidence review produced from current upstream documentation, independent dated CORS tests and an isolated SQLite mechanism exercise. No application was implemented or staging approval inferred; user input pending for plugin trust and closure risk disposition.

- **2026-10-25 — Explicit user B1 closure:** User replied `1 A` (trusted installed plugins) and `2 A` (close B1 at design level while carrying mandatory live integration checks). Recorded as P-B1-01 and P-B1-02 ADRs. Research statuses and no-live-integration limitations remain unchanged.
