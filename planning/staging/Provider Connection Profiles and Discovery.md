---
id: "IDEA-0014"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Provider Connection Profiles and Discovery

## Idea
Save and test several connections and discover provider models when possible.

## Why this idea matters
Avoid repetitive setup and opaque connection failures.

## Accepted direction
- **Multiple saved profiles:** A user can save, name, edit, select and reuse more than one cloud or local AI provider connection without repeating setup for each adventure.
- **Configurable endpoints:** Each profile can specify a provider/server type and a base URL or custom endpoint, including local/LAN servers and compatible gateways.
- **Credentials and headers with accepted persistence policy (2026-10-18):** Support **multiple independent secrets** for multiple provider connection profiles and any necessary secret headers. Prefer **native OS credential vault storage** through a cross-platform Go keyring library; when that fails, offer **only an explicitly consented, warned plaintext companion file** in the active library database directory. Secret values are never canonical adventure content.
- **Timeouts and retries:** Offer configurable request timeout and retry preferences. Exact defaults, safe retry boundaries and error-classification policy are for later refinement.
- **Optional model discovery:** Query a provider/server's model listing when supported, and present the available model IDs or choices.
- **Manual model ID:** Allow entry and selection of a model identifier even if model discovery is unsupported or fails.
- **Connection testing:** Provide an explicit test that helps diagnose unavailable endpoints, authentication failures, invalid model identifiers or other connection errors.
- **No credential backup/export:** Whole-library SQLite snapshot backups **exclude all credential values** by keeping them outside the database. A separately stored plaintext companion file is **not automatically bundled into Backup Database**; copying/syncing that file or its containing directory manually can expose secrets, and must be warned about.
- **No discovery prerequisite:** Manual profiles remain usable without a successful model-list response.

## Proposed behaviour
Expose a reusable connection manager for cloud APIs and user-hosted local endpoints. A profile records its name, provider type, URL, selected model, optional nonsecret headers and other preferences; credentials and secret header values must be kept separately or otherwise protected and excluded from adventure exports. A player can select a profile, optionally discover models, enter an ID manually, and invoke Test Connection to receive actionable feedback. Timeout and retry controls are configurable but must avoid unsafe replay of generation or state-committing operations.

## Alternatives and trade-offs
Automatic model discovery makes well-supported APIs easier to use but may be unavailable, incomplete or unreliable, especially for custom gateways and local servers. Manual-only configuration is flexible but error-prone. The accepted approach includes both optional discovery and manual entry. **Credential storage preference/fallback and multiple-key handling are now accepted**: native OS vault first; explicit consent before plaintext companion storage. Exact keyring package/version, secure filesystem APIs, unlock integration, connection test depth and automatic retry policies still need engineering verification.

## Architecture integration (2026-10-17)
- Provider profiles are consumed by client-side TypeScript AI adapters in the Wails v3 headless localhost server runtime, played through the normal browser. **Go owns at-rest OS-vault/plaintext-fallback credential operations and narrow authorised reads**; the browser receives each required credential only when needed for its own direct API call. The SQLite library holds **only nonsecret provider settings, stable profile IDs and credential storage references/status**, never plaintext API keys or secret header values.
- **Credential storage through Go, but no Go provider transport (IDEA-0012 Option B):** Go may store, retrieve and remove secrets via OS keyring or explicit plaintext companion file, but **may not make or proxy/relay AI provider network calls**. Browser-side TypeScript constructs and sends all AI requests directly and necessarily handles keys during those requests. Protect the authenticated/authorised loopback credential-access surface against arbitrary web origins, DNS rebinding and CSRF; do not claim browser-only handling hides keys from that browser's JS, extensions or compromised UI.

## On-demand AI setup and gracefully failed requests
- **Accepted IDEA-0001 refinement:** A usable Lorebound app and adventure library never depend on a saved provider connection. When a user attempts an AI-only operation without a suitable configured profile/model, display a clear reason and route them into these connection/model settings. Manual story editing, Lorebook maintenance, saving and other non-model features continue normally.
- A saved/selected connection profile is **not proof of availability**, but is sufficient to **attempt the requested AI API call**. Do not require a successful Test Connection check or assume a periodically checked health status before every request. Handle actual reachability, authentication, model selection, quota and transport failures as **per-request recoverable errors**; leave the saved profile editable and preserve uncommitted input/last accepted story.
- Explicit Test Connection and optional model discovery remain useful diagnostics, not an application startup gate. No implicit provider choice or model auto-installation is approved.

## Browser-only connections for four cloud providers and retained local servers
- **Accepted IDEA-0012 scope (2026-10-18):** Offer provider profiles for **OpenAI, Anthropic, Google Gemini, OpenRouter**, and the named **Ollama, LM Studio, vLLM and llama.cpp** local servers plus compatible custom endpoint/server profiles. **Mistral, DeepSeek, Z.ai/GLM and Kimi no longer have promised native cloud-profile/adapter types**. When OpenRouter offers one of those vendors' models, it remains an **OpenRouter model ID**.
- **All AI networking is browser-origin:** The TypeScript client must send model discovery, connection tests, completions/generation and streaming **directly to the selected endpoint**, subject to the browser's CORS, private-network, mixed-content and credential/header policies. **No Go/Node transport proxy** is in accepted scope. Failed browser access is a normal recoverable provider failure and may require a deliberately configured browser-compatible gateway or permitted CORS setup.
- **Credentials require accurate boundaries:** A browser-sent API token is necessarily available to browser execution while the request is made. Keep secrets outside the canonical SQLite adventure/library backup, world context, story prompts and diagnostics, but do not claim a Go transport or credential-forwarding backchannel hides them. At-rest storage/access boundaries and treatment of untrusted custom endpoints/gateways remain unresolved security-design work.
- **Model selection:** OpenRouter is deliberately a multi-provider gateway for its **actual catalog**, not a universal guarantee of every model. Manual model-ID entry and optional discovery still work for browser-accessible endpoints; a test cannot assume a successful model list proves a generation endpoint or headers will work.

## OS keyring first, explicit plaintext companion fallback
- **Explicit user-selected direction (2026-10-18):** Use a **cross-platform Go OS credential-store wrapper** as the default for **all secrets across all provider profiles**: Windows Credential Manager, macOS Keychain and supported Linux desktop Secret Service/KWallet arrangements. The `99designs/keyring` API family (or a maintained compatible implementation) is an implementation candidate, **not a promise that one library works on all Linux environments**. If using a multi-backend keyring library, whitelist actual native secure-vault backends: **never silently allow a file/backend or transient insecure storage strategy instead of the expected native vault**. Exact dependency/version and provider-specific backend selection require cross-platform tests. The Go host only handles storage; **AI HTTP requests still originate in browser-side TypeScript**.
- **Multiple secrets, correct identity:** Persist **distinct per-connection-profile credential entries**, identified by stable opaque profile ID plus secret kind (API token, authentication field or secret custom header), **not merely one global key per cloud provider**. Allow multiple OpenAI/OpenRouter/etc. profiles and different keys without overwriting one another. Support saving, replacing/rotating, retrieving and removing each independently. Database-backed profile metadata may hold **nonsecret references and an explicit storage-location indicator**, not the credential's value.
- **Locked native vault:** When a vault exists but is locked, **attempt the OS/service's normal unlock flow first**. On macOS Keychain or Linux Secret Service this **may** produce a native authentication prompt through the OS/desktop service. **Do not guarantee a pop-up**: Wails runs headless with no native application window, Windows Credential Manager need not prompt on every access, and Linux may lack an interactive unlocked keyring or prompt-capable desktop session. If native unlocking cannot proceed or is cancelled, report **locked/unavailable/access-denied distinctly**, and show actionable resolution tips (log into/unlock the keychain, start/configure GNOME Keyring/KWallet/Secret Service, retry). **Never collect an OS login password in a generic Lorebound web form** or automatically downgrade merely because unlock was cancelled. Whether an OS dialog can be invoked from the headless process requires platform validation.
- **User-approved plaintext fallback:** If secure storage is unavailable or cannot be unlocked, offer an **optional unencrypted credential sidecar file in the parent directory of the currently active Go-managed SQLite library**, including when that directory was user-selected. **Before any plaintext write**, display a prominent explicit warning naming the actual file path and risk (keys readable by others with filesystem access, malware, folder sync/backups or shared/removable drives), accompanied by a practical fix for secure storage. Provide clear **Use plaintext anyway** / **Cancel or retry secure storage** choice; **no implicit opt-in or fallback on a mere read error**. Do not create a plaintext file if consent is declined.
- **Best-effort file protection is not encryption:** When plaintext is selected, create/manage the sidecar securely with OS-appropriate restrictive owner-only permissions (e.g. POSIX mode `0600`, restrictive Windows ACLs), safe atomic file replacement and safeguards against unwanted symlinks/path traversal, insecure shared/custom directories and accidental secret logging. If the app cannot enforce safe access controls or trustworthy paths, **fail clearly rather than writing anyway**. Warn again when storage changes to a plaintext location or when reusing an existing plaintext file; show which profiles currently use the plaintext fallback.
- **Recovery without key loss:** Changing a stored profile to OS-vault storage must **verify a successful secure write before removing the plaintext copy**. Avoid automatic secret duplication/migration and secrets left behind in stale files where possible; exact cleanup and overwrite semantics remain for further engineering design. If vault read fails later, do not silently read/create a plaintext substitute without the user's prior explicit choice for that stored item.
- **SQLite and backups remain clean:** The canonical SQLite database may record **nonsecret profile metadata and references** only; **all secret values live outside it** in the OS vault or opt-in sidecar. Backup Database continues to export **only a consistent snapshot of the SQLite file**, never the sidecar or OS vault. Copying/syncing the whole data directory is a different, potentially secret-exposing manual operation and requires a warning. After database-only restore to another OS/user, missing credentials must be reported for re-entry rather than misrepresented as present; keyring references may not resolve.
- **Browser-origin security still matters:** The frontend's authenticated Lorebound origin may request **only the needed credential for its provider call** through narrowly scoped Go service methods. Protect against CSRF, DNS rebinding and unauthorised local-client secret retrieval. Since requests are made by browser TypeScript, the credential is visible to that browser execution environment in use; no claim of end-to-end browser secrecy or server-side proxying. No automatic external gateway credential forwarding.

## Dependencies and constraints
- Builds on accepted [[Cloud LLM Provider Connectors]] (IDEA-0012) and [[Local LLM Server Connections]] (IDEA-0013), including explicit llama.cpp support.
- Provider auth, model enumeration, error types and supported response formats differ; connection tests should identify their limits rather than claim universal validation.
- A saved profile must not leak API keys, bearer tokens or secret headers through adventure exports, prompts, diagnostic logs or UI previews.
- Retry semantics must avoid duplicating accepted narrative turns, side-effecting tools, or authoritative world-state changes; requests with unknown success must be handled carefully.
- Browser CORS/private-network/mixed-content policies apply to **both local and cloud AI endpoints**. All model discovery, Test Connection requests, generation and streaming run **from the actual browser origin**, not an alternate server-side privileged network path; testing should reflect real request reachability and fail with actionable guidance. Users may configure a compatible endpoint/gateway themselves, not receive an automatically provisioned proxy.
- Profiles can name an unavailable model or endpoint without silently mutating saved story content.

## Open questions
- How should custom gateways and dynamically listed models be identified, cached and refreshed?
- **Resolved architecture (2026-10-18):** Prefer a cross-platform Go adapter to the OS credential store; when inaccessible, after actionable unlock/resolution guidance and **explicit pre-write warning/consent**, permit an unencrypted separate companion file beside the currently active SQLite library. Exact Go keyring implementation, OS-prompt UX, hardened file handling and migrations between stores still need implementation testing.
- What distinguishes a lightweight connectivity probe from an actual test-generation call, and what costs could a cloud test incur?
- Which errors should be eligible for automatic retry, and how can attempts remain idempotent and safe?
- What timeout and retry defaults should be applied to generation, discovery and connectivity tests?
- How should a profile handle multiple endpoint URLs or provider-specific authentication schemes?

## Draft acceptance criteria
- [ ] Multiple independently named provider profiles can each store, retrieve, rotate and delete their own API key and supported secret headers without colliding or using one global provider-wide credential.
- [ ] On Windows/macOS/supported Linux desktops Go tries a native OS keyring first; a locked vault uses native unlocking where available or produces an actionable failure. No blanket promise of a Linux/Windows prompt or web form for OS login passwords.
- [ ] An unavailable/locked vault never triggers an **automatic plaintext write**; the UI shows location-specific risk, resolution tips and a deliberate Use plaintext anyway/Cancel choice **before creating or updating an unencrypted companion credential file** beside the active SQLite library.
- [ ] The plaintext fallback is distinct from the SQLite database, uses strongest practical owner-only permissions and safe writes, rejects unsafe paths, and is labelled in Settings as unencrypted even after later launches.
- [ ] Backup Database snapshots exclude secret values and the sidecar, though manually copying the whole data directory may expose that file. Restoring SQLite alone reports missing credentials rather than inventing their recovery.
- [ ] Browser-side TypeScript remains the sole initiator of AI HTTP requests; credential reads use an authorised narrow Go service, not a hidden AI transport or unrestricted secret-list endpoint.
- [ ] Connection tests, discovery and generation originate directly in browser TypeScript and surface CORS/private-network/API security failures without silently invoking a Go/Node proxy.
- [ ] The provider choices include the four reduced cloud families plus all four named local servers and configurable compatible endpoints, without promising other direct cloud integrations.
- [ ] A user can create, edit, name, save, select and reuse several independent provider connection profiles.
- [ ] Profiles support custom base URLs, model IDs, credentials/authentication, optional headers, timeouts and configurable retry preferences where relevant.
- [ ] Supported providers/servers may expose discoverable models, which the UI can list without requiring discovery on every connection.
- [ ] A user can enter a model ID manually even when discovery fails or is unsupported.
- [ ] An explicit connection-test action provides useful feedback on at least reachability/authentication and, when supported, model validity.
- [ ] Failed connection tests or unsafe retries do not commit narrative output or game-world state.
- [ ] Credentials, access tokens and secret header values are excluded from **whole-SQLite-library backup snapshots**, canonical story/entity rows, prompt context and logs. Separately stored plaintext credentials are not automatically collected by the app's Backup Database action.
- [ ] A configured compatible endpoint remains usable without a model-discovery API.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant-proposed option, subsequently explicitly accepted by the user.
- Accepted for staging and refinement only; not approved for production or implemented.

## Decisions and review history
- 2026-10-18 — **User accepted OS keyring + warned plaintext fallback for multiple provider keys:** Prefer OS-native credential vault through cross-platform Go keyring interface; on unavailable/locked vault attempt platform unlock, show actionable guidance and require **explicit pre-write informed consent** before storing any secret as plaintext in a companion file beside the active SQLite library. Multiple secrets indexed by profile ID and kind, not one app-wide key. No credentials in canonical SQLite or its whole-DB snapshots, including custom-directory databases. Restricted file permissions, honest non-encryption warning, native prompt variability and authorised browser-to-Go secret access required; browser TypeScript alone sends provider HTTP requests. Implementation library pin/prompt specifics remain staging refinement, not code/production approval.
- 2026-10-18 — **Accepted IDEA-0012/0013 provider/networking revision:** Four native cloud profiles (OpenAI, Anthropic, Gemini and OpenRouter gateway), all four local servers and custom compatible endpoints remain. Every AI HTTP request, including tests/discovery, is browser-origin with **no Go/Node proxy fallback**. Browser-access issues require user-configured CORS/compatible gateway. Secret-at-rest design remains open but server-side AI credential forwarding/networking is not approved. Staging only.
- 2026-10-18 — **Accepted IDEA-0001 integration:** No AI profile is required to use Lorebound. When AI is requested but unconfigured, provide clear setup guidance; when a model is configured, attempt the API and report actual failures without globally disabling local/manual features or overwriting canon. No mandatory prior connection test. Staging only.
- 2026-10-17 — **Runtime dependency correction:** IDEA-0053 now selects Wails v3 headless localhost Go server **only**, served to the normal browser by a Windows/macOS/Linux executable. No separate native desktop WebView or npm player runtime. Docker is a distinct unaccepted candidate (IDEA-0065). No further feature approval is implied.
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Multiple saved connection profiles, configurable endpoints, credentials and headers, timeout and retry settings, optional model discovery, manual model ID entry, and connection testing. Credentials and other secrets must be excluded from adventure exports. Moved to staging for refinement, not to production.
