---
id: PRD-0054
type: prd
status: accepted
related:
- NOTE-0058
- PRD-0001
- NOTE-0011
- NOTE-0012
---

# Localhost Startup and Offline Mode

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0053](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Localhost%20Startup%20and%20Offline%20Mode.md) · origin: user; created: 2026-10-16; updated: 2026-11-01; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-01; approved by: requesting user (explicit separate IDEA-0053 and IDEA-0051 production promotion)

Primary subsystem: **S01**. First milestone: **M0**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-002A merged subsets](../work/items/STORY-0011-production-blank-adventure-creation-and-resume.md); [DEV-002B scope](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md); full inventory draft
- Evidence: [Merged PRs #4](https://github.com/Levelleor/lorebound/pull/4) / [#6](https://github.com/Levelleor/lorebound/pull/6); earlier [Gate 0](https://github.com/Levelleor/lorebound/pull/3)

## Accepted direction
- **Exactly one selected player runtime:** Use **Wails v3 headless/server mode only**. A locally launched Go process serves Lorebound to the system browser over HTTP. Do **not** produce a separate Wails native-window/WebView desktop interface or require a parallel desktop UI.
- **Cross-platform delivery:** Package the headless Go server as standalone launchable executables/installers for **Windows, macOS and Linux**. These are platform-specific server binaries, not GUI-shell builds. On startup, select/announce a safe localhost URL and open the system browser by default (with a displayed fallback if browser launch fails).
- **Shared client-side application:** SvelteKit compiles to static/client-rendered assets. Svelte handles the player UI; independent TypeScript modules in the **same browser JavaScript application** own gameplay rules, the deterministic coordinator, registered gameplay plugins and external AI provider adapters. No separate game-engine service or Go gameplay implementation.
- **Headless Go service boundary:** Wails v3 hosts the frontend and provides typed access to Go services. Go handles SQLite, filesystem, imports/exports, atomic transactions and other genuinely privileged operations. Its HTTP/server role is **not** SvelteKit SSR or a Node backend.
- **One active filesystem SQLite database:** Store the entire adventure library in **one Go-managed SQLite database file** (IDEA-0051), by default under the per-user OS app-data directory and optionally in a custom directory. **If the database exists in the configured location, use it; if not, create an empty one.** Do not automatically migrate, merge or maintain alternative libraries when the location changes. Adventures remain logically separate *inside the one database*.
- **Only full-library Backup Database / Restore Database:** Go creates a **consistent snapshot of the entire active SQLite database** for backup; restore **replaces that whole database** instead of merging. **Per-adventure exports and imports are explicitly excluded**, superseding the former IDEA-0005/0052 proposal.
- **Go-owned backup/restore maintenance mode (user decision 2026-10-23):** Before either requested database operation, Go must **fence all library writes across every browser tab**, ask connected browsers to abort and invalidate their direct provider calls and streams, and quiesce existing accepted SQL transactions. Browser cooperation is best effort, and external model services might continue computation, but **any abandoned generation is ineligible for commit**, and all writes remain blocked at Go regardless of other tabs. After a successful Restore or database-directory change, require a **fresh active-library epoch/session** before accepting subsequent writes, even if adventure version numbers happen to match. Backup exits maintenance after its consistent snapshot; canceled attempts never automatically resume. This is not a global gameplay-validation pass or a second Go model transport.
- **External AI connections, direct browser-only (accepted IDEA-0012 Option B, 2026-10-18):** Frontend TypeScript directly requests local/cloud model APIs from the **ordinary browser**. **Do not implement a Go/Node AI HTTP transport proxy or fallback**. Browser CORS, HTTPS/mixed content, network permissions and client-accessible credentials are provider/endpoint compatibility constraints. Users may configure supported browser-compatible endpoints or gateways explicitly.
- **Narrow Go credential retrieval without Go AI transport (updated A-27 2026-10-23):** At startup or active model-profile selection, browser TypeScript retrieves saved active-profile credentials from a limited loopback Go credential service, **without implementing a separate Lorebound authentication/session system in the initial iteration**. Browser memory temporarily caches the usable token for direct provider requests; changes and deletions synchronise back to Go, which remains the persistent OS-vault/encrypted-sidecar owner. Never persist plaintext tokens to browser `localStorage`, `sessionStorage` or IndexedDB; nonsecret profile settings may use browser caching. Service access must resist unauthorized local sites/clients, CSRF and DNS rebinding, and handle cross-tab refresh. The credentials service **does not proxy AI requests**; the model HTTP traffic still originates from browser TypeScript.
- **No player npm runtime:** npm/Node can be used as **development/build tooling for SvelteKit**, but a separate `npm start`/Node-hosted localhost product is **not** a supported delivery path. Players need only the packaged Go server, a browser and any separately configured local model runtime.
- **Docker separated:** Docker/Compose distribution is **not included in IDEA-0053's accepted scope**. The separate Inbox candidate Optional Docker Distribution (IDEA-0065) is **unaccepted**. It must not complicate or become necessary for the native executable route.
- **Simple local iteration; no application authentication feature (2026-10-23):** Bind the server to loopback only, expose narrow Go filesystem/SQLite/credential methods and retain transaction/expected-version safety. **Do not design or build a Lorebound login, account, authenticated-session/token framework or authentication UI** in this iteration. Basic Host/Origin/CSRF filtering of browser-origin requests is a limited low-level precaution, **not proof that arbitrary local processes cannot reach privileged endpoints**. Advanced local-client identity/authentication hardening is deferred; do not describe secret access as secure or production-hardened without testing. Keep model streaming responsive and Go independent from AI transport.
- **Planning status:** This is accepted **staging architecture only**, not implementation or production approval. Wails v3 stability, server binding/security, browser launching, ordinary SQLite transaction/snapshot correctness and performance remain to be validated; **advanced corruption-recovery workflows are not required**.

## Dependencies and constraints
- IDEA-0001 requires single-player, account-free offline-capable operation on Windows/macOS/Linux with an independently available compatible local AI runtime. "One simple app" now means a **headless Go server + normal browser**, not a native GUI window.
- IDEA-0051 selects **one active filesystem SQLite database**, opened if present or created if missing, with consistent **whole-library snapshot backups** and **complete replacement restores**. IDEA-0005/0052 now **explicitly exclude individual-adventure file exports/imports**; only Backup Database and Restore Database are offered.
- IDEA-0044/0047/0055 retain browser-side TypeScript coordinator and gameplay plugins; Go provides transactional safety and privilege boundaries, **not** duplicate game logic. Untrusted/local browser clients must not write arbitrary canonical records.
- IDEA-0039/0040/0042 require exact revision/event provenance and full replayable history, with consistent atomic durable commits across potentially multiple browser tabs.
- IDEA-0012/0013 maintain external local/cloud model API support; CORS, secrets, streaming and provider adapters remain for their own refinement. Neither Wails nor SQLite bundles inference.
- A **static frontend build** is served by Wails v3's headless Go HTTP server, not an independent SvelteKit SSR or npm product process.
- Default localhost-only binding, defence against unwanted browser-origin requests and CSRF/DNS rebinding, a coherent lock/single-instance policy, recovery after crashes, and browser startup fallbacks are required considerations.
- Docker/Compose remains a **separate unaccepted idea** and is not an accepted requirement for IDEA-0053.

## Supporting detail

See [NOTE-0058](../knowledge/inbox/NOTE-0058-prd-0054-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
