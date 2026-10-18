---
id: "IDEA-0053"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Local First Storage and Deployment Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Localhost Startup and Offline Mode

## Idea
Distribute Lorebound as **one cross-platform headless localhost application**, using a **Wails v3 Go server** packaged as prebuilt executables for Windows, macOS and Linux. Launching Lorebound starts a loopback-only HTTP server and (by default) opens the player's **ordinary system browser**. Wails serves a static/client-rendered SvelteKit/Svelte UI; the TypeScript gameplay engine, coordinator, enabled gameplay plugins and AI API adapters run alongside it **in that browser**, not in a native WebView or Node/SvelteKit backend. Go/Wails services provide filesystem-backed SQLite persistence, coherent transactions, saves, import/export and other necessary privileged operations. SQLite files are durable on the host computer; browser storage is not the canonical save location. Preserve offline local-model play, responsive interactions and simple installation.

## Why this idea matters
Lorebound should feel like a simple local application without requiring players to manage Node, npm, Docker, SQL servers or native WebView runtimes. One Go executable can serve the UI and its Go services on localhost, while players use their preferred browser. The same headless application can be packaged for Windows, macOS and Linux. Durable filesystem SQLite and a lightweight TypeScript frontend support long-running adventures and offline play after external local-model setup. Docker is **not** part of this approved runtime scope; evaluate container packaging as a separate, unaccepted idea.

## Accepted direction
- **Exactly one selected player runtime:** Use **Wails v3 headless/server mode only**. A locally launched Go process serves Lorebound to the system browser over HTTP. Do **not** produce a separate Wails native-window/WebView desktop interface or require a parallel desktop UI.
- **Cross-platform delivery:** Package the headless Go server as standalone launchable executables/installers for **Windows, macOS and Linux**. These are platform-specific server binaries, not GUI-shell builds. On startup, select/announce a safe localhost URL and open the system browser by default (with a displayed fallback if browser launch fails).
- **Shared client-side application:** SvelteKit compiles to static/client-rendered assets. Svelte handles the player UI; independent TypeScript modules in the **same browser JavaScript application** own gameplay rules, the deterministic coordinator, registered gameplay plugins and external AI provider adapters. No separate game-engine service or Go gameplay implementation.
- **Headless Go service boundary:** Wails v3 hosts the frontend and provides typed access to Go services. Go handles SQLite, filesystem, imports/exports, atomic transactions and other genuinely privileged operations. Its HTTP/server role is **not** SvelteKit SSR or a Node backend.
- **Filesystem SQLite:** Store canonical adventure saves, text revisions, accepted world events, entities and durable plugin state in Go-managed SQLite database files on the host filesystem. Do not rely on browser localStorage, IndexedDB or origin storage for canonical adventures.
- **Portable persistence:** Support SQLite-backed save, import and export through Go. The actual per-adventure vs shared-database layout and safe export/archive/snapshot format remain open under IDEA-0051, IDEA-0005 and IDEA-0052.
- **External AI connections:** Frontend TypeScript connects to separately managed local or cloud model APIs. No bundled inference runtime or mandatory Go model proxy. Browser CORS, credentials and secure transport remain provider-specific integration questions.
- **No player npm runtime:** npm/Node can be used as **development/build tooling for SvelteKit**, but a separate `npm start`/Node-hosted localhost product is **not** a supported delivery path. Players need only the packaged Go server, a browser and any separately configured local model runtime.
- **Docker separated:** Docker/Compose distribution is **not included in IDEA-0053's accepted scope**; consider it later as a **separate, unaccepted candidate**. It must not complicate or become necessary for the native executable route.
- **Fast, local and safe:** The server binds to loopback only by default. Restrict browser-to-Go privileges and protect against DNS rebinding, CSRF and unexpected local clients. Handle multiple browser tabs with expected-revision checks/transaction integrity; keep long model generation and replay from freezing the UI.
- **Planning status:** This is accepted **staging architecture only**, not an implementation or production approval. Wails v3 stability, the server binding/session scheme, binary distribution/browser launching, Go SQLite details and recovery/performance tests remain to be validated.

## Possible startup and distribution paths (original options, evaluated under selected priorities)
This records the **current accepted choice**, superseding earlier Tauri/npm and dual Wails desktop/headless comparisons:

- **Selected:** Wails v3 **headless Go server** only, compiled into launchable Windows/macOS/Linux binaries, serving the same static SvelteKit app to a regular local browser.
- **Selected:** Durable host-filesystem SQLite accessed via Go services, with browser-side TypeScript gameplay and AI clients.
- **Not selected:** Native WebView/Wails desktop window, Tauri/Rust desktop packaging, a separate npm/Node player launch, SvelteKit SSR/Node sidecar, separate SQL server or bundled AI model/inference runtime.
- **Separately deferred:** Docker/Compose containerisation, not a second currently accepted distribution mode. A distinct Inbox candidate may address it later.

## Proposed behaviour
A player launches the packaged Lorebound Go executable. It starts a **loopback-bound Wails v3 headless server**, ensures only the intended local application assets and authorised service methods are accessible, and by default opens the system browser to its localhost URL. No Wails-native window or WebView is opened. The browser runs the SvelteKit/Svelte UI and TypeScript coordinator, gameplay rules, plugin modules, context preparation and model API integrations. On durable operations, the browser calls narrow Go services that read/write a SQLite file in a persistent local data directory, validating input and applying one atomic transaction for related story revisions and state/events. Import/export likewise uses Go and the canonical SQLite data. An active server is required while playing; closing a browser tab does not inherently stop the Go process. Exact lifecycle, port conflicts, tab concurrency and shutdown behaviour need refinement.

## Alternatives and trade-offs
- **Wails v3 native desktop-window mode (explicitly superseded):** Uses an embedded WebView, but adds a GUI delivery surface that the user does not want. Do not silently restore it.
- **Tauri/Rust:** Previously considered for desktop wrapping; not selected.
- **SvelteKit `npm start`/Node server:** Previously approved as a parallel startup method, now superseded. Node/npm remain optional source-build/development prerequisites, **not** player runtime dependencies.
- **Plain Go `net/http` + embedded frontend:** Could produce a similar headless binary, but the user has specifically chosen Wails v3 for its server mode and JS-to-Go service facilities. Reconsidering that choice would require a separate decision.
- **Browser-owned persistence:** Not selected for canonical adventures; Go-managed filesystem SQLite remains mandatory.
- **Docker/Compose:** A separate, unaccepted distribution idea. It may reuse the headless binary later but is out of scope for this refinement.
- **Browser model networking:** CORS, API-key custody and local-model origins impose constraints on ordinary `fetch()`, and may eventually justify a selective native transport. No blanket Go AI proxy is yet approved.
- **Headless-only constraints:** Requires the server process to remain running; startup/shutdown, loopback port, browser opening, permissions, filesystem access and safe multi-tab concurrency are now core product concerns.

## Dependencies and constraints
- IDEA-0001 requires single-player, account-free offline-capable operation on Windows/macOS/Linux with an independently available compatible local AI runtime. "One simple app" now means a **headless Go server + normal browser**, not a native GUI window.
- IDEA-0051 selects filesystem-backed SQLite via Go for the **one supported Wails v3 headless runtime**; IDEA-0005/0052 address portable save operations and backups.
- IDEA-0044/0047/0055 retain browser-side TypeScript coordinator and gameplay plugins; Go provides transactional safety and privilege boundaries, **not** duplicate game logic. Untrusted/local browser clients must not write arbitrary canonical records.
- IDEA-0039/0040/0042 require exact revision/event provenance and full replayable history, with consistent atomic durable commits across potentially multiple browser tabs.
- IDEA-0012/0013 maintain external local/cloud model API support; CORS, secrets, streaming and provider adapters remain for their own refinement. Neither Wails nor SQLite bundles inference.
- A **static frontend build** is served by Wails v3's headless Go HTTP server, not an independent SvelteKit SSR or npm product process.
- Default localhost-only binding, defence against unwanted browser-origin requests and CSRF/DNS rebinding, a coherent lock/single-instance policy, recovery after crashes, and browser startup fallbacks are required considerations.
- Docker/Compose remains a **separate unaccepted idea** and is not an accepted requirement for IDEA-0053.

## Open questions
- Which Wails v3 beta/stable version and server-build APIs are reliable for a **headless-only**, standalone Windows/macOS/Linux binary without WebView/GUI dependencies?
- How should the executable choose a loopback port, open a browser, announce the URL if opening fails, avoid starting duplicate servers, and stop cleanly?
- How can the localhost service safely restrict origins/hosts, CSRF, DNS rebinding and unintended privileged API access, especially from other local applications/websites?
- How should multiple tabs, browser restarts, stale-version conflicts and a running server after browser closure be handled?
- What Go SQLite driver, schema/data directory, WAL/transaction/checkpoint, migrations and consistent import/export/backup procedures are appropriate?
- What should happen when the filesystem is read-only/full, the SQLite database is locked/corrupt, or the launcher cannot bind localhost?
- How will local/cloud AI API calls work with browser CORS, provider credentials and network restrictions? Is an **optional** Go HTTP transport necessary for any provider?
- Which plugin capabilities may run in a normal browser and which, if any, legitimately need restricted Go service methods?
- How should an installation/update preserve durable SQLite files, and which Linux distributions/OS versions should the server binaries support?
- What latency, memory and UI responsiveness targets are suitable for large adventures, model streaming and world-history rebuilds?

## Draft acceptance criteria
- [ ] One standalone Wails v3 **headless Go server** binary can be launched on each supported Windows/macOS/Linux target, with no native GUI/WebView and no Node runtime requirement for players.
- [ ] Launching the executable serves the same static SvelteKit interface over loopback and normally opens the user's system browser; browser-launch failure has a usable URL fallback.
- [ ] Gameplay rules, coordinator, registered gameplay plugins and provider integrations execute in the browser-side TypeScript application, without a separate native game engine.
- [ ] The browser reads/writes all canonical adventure data through Go services and persistent filesystem SQLite, not browser origin storage.
- [ ] Accepted story revisions, all canonical world-event effects and associated history commit atomically and reject stale/concurrent writes safely.
- [ ] Import/export and backups preserve complete valid adventure history and never leak API credentials; the exact portable file format is refined separately.
- [ ] The server is loopback-only by default with tested protections against untrusted web origins, requests and unauthorised privileged calls.
- [ ] Internet-disabled play works with local assets and a separately configured compatible local AI runtime.
- [ ] Closing/reopening the browser does not erase an adventure; clear server lifecycle, single-instance behaviour and failure recovery are defined.
- [ ] Story interaction remains responsive during long generation, persistence and state replay tasks; performance is measured in relevant scenarios.
- [ ] Docker, native WebView builds and an npm-hosted player runtime are not required for the accepted first distribution.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- 2026-10-16: Earlier accepted direction used Tauri desktop + npm localhost; superseded by later user choices.
- 2026-10-17: The user selected Wails v3 desktop + headless and Go/SQLite (previous refinement), then **explicitly corrected that choice to headless only**. Previous dual-mode notes and historical decisions are retained below to preserve provenance.
- 2026-10-17: Current direction is one Wails v3 Go headless server serving a static SvelteKit UI to the ordinary browser, with frontend TypeScript gameplay/plugins/AI clients, Go-managed SQLite and no native GUI or separately supported npm player process. Docker is deferred to a distinct unaccepted idea.

## Decisions and review history
- 2026-10-17 — **Explicit user-approved correction to IDEA-0053 (staging only):** Select **Wails v3 headless Go server mode as the only player runtime**. Distribute executable server binaries for Windows/macOS/Linux; launch the ordinary browser for the SvelteKit UI. **No Wails native window/WebView, no separate npm-hosted/Node player runtime**. Browser TypeScript retains UI, coordinator, gameplay plugins and AI API calls, while Go handles filesystem SQLite and import/export. Treat Docker as a **separate unaccepted idea**, not an included delivery path. This supersedes, but does not erase, the prior dual Wails desktop/headless agreement; IDEA-0051 file organisation, export format, network hardening and shipping details remain open.
- 2026-10-17 — **Explicit refinement accepted by the requesting user:** Replace the earlier Tauri/sidecar evaluation with **Wails v3** for both packaged cross-platform desktop and **headless localhost Go server/browser** delivery. Use a **static SvelteKit/Svelte frontend with an entirely client-side TypeScript gameplay coordinator, rules and gameplay plugins**. The frontend handles provider API integrations; **Go/Wails owns SQLite persistence on the host filesystem**, including save and import/export operations. No canonical adventure data in browser storage, no embedded AI runtime or Node SSR requirement; prioritise lightweight responsive play. This approves the IDEA-0053 architectural direction **within staging only**, without selecting file export format, native driver, security scheme or release mechanics.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**, originally focused on GitHub clone/npm startup, a stable HTTP localhost origin and offline local-model use.
- 2026-10-16 — **User-requested Inbox refinement (not acceptance at that time):** Ease of installation must consider ordinary, nontechnical players. In addition to source/npm installation, investigate a published Docker image and other low-friction startup routes such as Compose, downloadable prebuilt local releases or desktop installers. Preserve the SvelteKit/local-offline direction, avoid premature delivery-method selection, and account for safe persistent data and model access.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Support **Tauri as the primary installation/startup method for ordinary players** alongside a straightforward **SvelteKit npm install/start localhost route**, sharing one application UI/gameplay core with platform-specific data/OS/model adapters. Keep **Docker and similar packaging as potential additional options** for evaluation rather than automatically mandatory deliverables. Preserve local/offline play and safe persistent story data. Moved the same note from Inbox to staging for refinement, not production.
- 2026-10-17 — **Refinement decision accepted by the requesting user:** Choose **external AI execution** rather than packaging/hosting an AI model as part of Lorebound; offer integration with multiple local/cloud API styles. Target a cohesive offline-capable application on Windows, macOS and Linux (consistent with IDEA-0001). The user additionally **proposed for evaluation**, but did not yet approve, a Tauri-managed complete SvelteKit frontend/backend server to minimise Rust backend development. Keep the sidecar/server packaging architecture open pending comparison and approval. This is **not** approval to move IDEA-0053 to production.
