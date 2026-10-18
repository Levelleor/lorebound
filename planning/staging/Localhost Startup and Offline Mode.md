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
Deliver the **same Lorebound application** as a user-friendly **Wails v3 native desktop application** on Windows, macOS and Linux, and as a **Wails v3 headless Go server** playable in a regular browser through localhost. Use a **statically built SvelteKit/Svelte frontend** whose independent TypeScript game engine, coordinator, AI provider clients and native/gameplay plugin logic execute in the browser or embedded WebView. Go provides **filesystem-backed SQLite persistence**, transactional save/import/export operations and necessary native services through Wails bindings; it does not become a second gameplay engine or an embedded AI inference runtime. Keep local offline gameplay, separate adventures, and a lightweight responsive user experience. Browser-owned data storage is **not** the canonical save location.

## Why this idea matters
Most use is expected to be local, without TLS configuration, hosted-account management or mandatory cloud services. Git/npm startup suits developers, but requiring players to clone a repository, manage Node versions, install dependencies and troubleshoot terminal commands creates unnecessary friction. Docker can simplify repeatable self-hosted installation but still requires Docker and knowledge of ports, volumes and model access. Native installers or prebuilt launchers could improve accessibility for people who just want to open Lorebound and play. The preferred path should be chosen with beginner setup, updates, data safety and ongoing maintenance in mind.

## Accepted direction
- **Wails v3, replacing Tauri:** Use Wails v3 (Go) for the desktop wrapper and headless server build, targeting **Windows, macOS and Linux**. Tauri/Rust is no longer the selected native integration framework.
- **Two player entry points, one implementation:** Support (a) an installable Wails desktop application and (b) a Wails v3 **headless server** hosting the same frontend and exposing the same Go services to a normal browser on localhost. The headless build is a Go HTTP server, **not a Node or SvelteKit SSR server**. No mandatory separate SvelteKit Node backend.
- **SvelteKit is UI, not server authority:** Build the SvelteKit/Svelte frontend as static/client-rendered assets suitable for Wails. The Svelte UI and shared TypeScript game engine coexist in the same JavaScript application, including the coordinator, domain rules, provider adapters and registered native/gameplay plugin execution. This does not require a separate JS engine process or published engine package.
- **Go owns persistent disk access:** Persist adventures, story text/revisions, canonical events, world state, module-owned state and related durable data in **SQLite database files on the host computer's filesystem** through Go/Wails services. SQLite is embedded; no separately installed SQL server is needed. Browser localStorage, IndexedDB or origin storage are **not** canonical adventure storage.
- **SQLite-backed portable saves:** Use SQLite as the durable basis for save operations and for **import/export** of adventures. Exact portable file/archive layout, integrity checks, migration and backup protocols are refined in IDEA-0005/IDEA-0051/IDEA-0052; a raw database copy is not automatically considered a safe portable export.
- **External AI integration:** No bundled inference runtime or model. The TypeScript/frontend provider layer sends API requests to independently run local models and optional cloud APIs; provider-specific formats, streaming, CORS and safe credential/transport handling require refinement in provider ideas. Go proxying is not an obligatory generation architecture.
- **Minimal privileged boundary:** Go implements file and database access, coherent atomic transactions, import/export and other necessary native functions. The deterministic coordinator and plugin gameplay rules remain TypeScript and are not silently duplicated as a Go game engine.
- **Responsive, lightweight operation:** Avoid needless server processes, redundant runtimes and UI-blocking work; preserve a responsive story editor and smooth interaction through suitable async/batched work. Concrete performance targets remain open.
- **Local-only default and safety:** The headless HTTP server binds to localhost by default; external network exposure, browser session isolation and API authorization require their own explicit decisions. Go service methods must validate inputs and enforce atomicity even though the gameplay coordinator lives client-side.
- **Preserve planning gates:** This is the accepted architectural direction for staging. Wails v3 version stability, production packaging, specific Go SQLite driver, exact frontend adapter, auth/IPC hardening and data migrations still require refinement and verification before production approval.

## Possible startup and distribution paths (original options, evaluated under selected priorities)
Historical alternatives considered earlier in staging; **the following is no longer an equal-options selection exercise**:

- **Selected:** Wails v3 native desktop installation for Windows, macOS and Linux.
- **Selected:** Wails v3 headless/localhost server build, with the same statically built Svelte UI and Go services accessible through a browser.
- **Selected:** SQLite files managed by Go on the computer/server filesystem, not canonical browser storage.
- **Not selected:** Tauri/Rust as the native wrapper, a mandatory Node/SvelteKit SSR backend, a separate SQL server, or bundled local inference/model execution.
- **Potential additional distribution only:** Docker/Compose and other packaging formats may be considered separately; they are not additional mandatory product runtimes.

## Proposed behaviour
Both the desktop Wails app and the headless Wails localhost server embed/serve the same static SvelteKit build. Its client-side TypeScript modules render the story, orchestrate generation, interpret proposed world events, validate gameplay rules, execute enabled client-side gameplay capabilities and prepare coherent accepted changes. Go services expose narrowly scoped persistence operations: reading/writing adventures, SQLite-backed atomic commits, full-fidelity import/export, backups and local filesystem access. A save operation must commit corresponding story revisions and canonical state/event changes together, or not at all. The database resides in the host's persistent app-data or configured data directory, including in headless mode. External AI APIs are called using suitable frontend transports, with CORS and secure credentials handled as separate provider/runtime requirements. Keep lengthy generation/rebuild/retrieval tasks from blocking interactive UI.

## Alternatives and trade-offs
- **Tauri + Rust plugins (superseded):** Technically capable, but Go/Wails is preferred for the native boundary. Do not preserve Tauri as a competing selected runtime.
- **SvelteKit SSR/Node sidecar (not selected):** Adds another server process and runtime without a currently identified need for server-rendered pages or Node-only application services.
- **Browser-owned IndexedDB saves (not selected as canonical):** Would complicate parity with Wails's native/headless persistent SQLite requirements. Ephemeral frontend caches and local UI preferences may still use appropriate browser facilities without becoming the source of truth.
- **Go-based gameplay engine (not selected):** Go will implement secure, transactional persistence and native services, while TypeScript owns deterministic gameplay and extensions.
- **One Go-backed browser/desktop service surface:** Simplifies persistence parity, but a headless server must run for the browser deployment. An offline *static-only* webpage without Wails/Go is not a required distribution.
- **Wails v3 maturity:** Use the selected v3 architecture while checking version stability, packaging compatibility and headless security in a focused implementation proof.

## Dependencies and constraints
- IDEA-0001 requires fully optional internet access for play when a configured external local model is available; Windows/macOS/Linux support and account-free use remain binding.
- IDEA-0051 selects **SQLite on the machine's filesystem via Go** for canonical adventure persistence in both Wails runtime modes; IDEA-0005 and IDEA-0052 refine complete import/export, database integrity and backups.
- IDEA-0044/IDEA-0047/IDEA-0055 retain **TypeScript client-side** coordinator, domain rules and gameplay plugins. Client-side processing does not give an arbitrary browser caller permission to write unchecked or conflicting durable history: Go's service boundary must enforce transaction, revision/concurrency and exposed-method protections.
- IDEA-0039/IDEA-0040/IDEA-0042 require complete incremental reconstructibility, consistent revisions and atomic persistence for every accepted durable mutation.
- IDEA-0012/IDEA-0013 establish external cloud/local AI provider integration; browser CORS, API credentials, streaming and possible alternate transports remain provider-specific concerns and must not force an unapproved bundled inference engine.
- Wails v3's headless server is a **Go server**, not SvelteKit SSR. Use static frontend assets and Wails's browser transport for registered Go service calls.
- Default headless host must remain loopback-only; network exposure, session isolation, permissions and CSRF/origin safeguards must be reviewed before any external binding.
- Docker/Compose is an optional future distribution, not a selected release promise. Optional MCP/loopback bridge candidates remain unaccepted.

## Open questions
- Which Wails v3 build/version constraints and exact SvelteKit static build configuration reliably support desktop and headless modes across target operating systems?
- What are the supported minimum Windows/macOS/Linux versions and packaging/signing/update paths?
- Which SQLite driver, app-data location, database layout, WAL/checkpoint policy, schema migrations and backup/import/export strategy should be selected under IDEA-0051/IDEA-0052?
- How will Wails Go service calls validate input and ensure atomic commits and stale-revision rejection when gameplay validation happens in the browser, particularly with two browser tabs or windows?
- Should headless mode ever allow LAN access? What explicit authentication/origin/permission controls would be required before that is approved?
- Which frontend model HTTP requests work across CORS policies, and when would an optional Go transport or credential boundary be justified?
- Which forms of gameplay plugins can safely run in the browser/WebView, and what permissions are needed for optional native effects or third-party code?
- What performance targets and profiling benchmarks ensure large adventures and background model generation do not freeze the interface?
- What happens when the SQLite database is locked, unavailable, corrupted or incompatible, or when the filesystem runs out of space?
- How should installed local AI server availability and first-run configuration be presented without bundling an inference engine?

## Draft acceptance criteria
- [ ] A packaged Wails v3 desktop build opens the same Lorebound static SvelteKit frontend on Windows, macOS and Linux.
- [ ] A production Wails v3 headless Go server build serves the same application in a normal browser on localhost without opening a native window or needing Node SSR.
- [ ] Both modes use the same client-side TypeScript coordinator, game rules, capability registry and enabled browser-executed gameplay plugins, without a second Go engine implementation.
- [ ] Both modes use Go service bindings to read/write a filesystem SQLite database; canonical adventures and events do not depend on browser localStorage/IndexedDB.
- [ ] A coherent story turn, versioned prose and all its accepted event/state changes commit atomically; interrupted or stale concurrent requests do not produce partial history.
- [ ] Save, restore, import and export use SQLite-backed persistent data with validated, portable, full-history results and no accidental credential inclusion.
- [ ] A compatible external local model supports normal gameplay with internet disabled, while cloud APIs remain optional.
- [ ] The headless server uses localhost binding by default and prevents untrusted origins/clients from invoking privileged data-changing methods.
- [ ] Long-running gameplay tasks keep the frontend interactive; meaningful performance cases are measured before shipping.
- [ ] The architecture's Wails v3 maturity, Go SQLite driver, cross-platform builds, upgrade paths and security are verified before implementation is called complete.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- 2026-10-16: Initial acceptance chose Tauri plus npm/SvelteKit localhost. That earlier direction has been **explicitly superseded** by the user's 2026-10-17 Wails v3 decision recorded below.
- 2026-10-17: User explicitly selected Wails v3 desktop + headless Go browser server, statically built SvelteKit UI, browser-side TypeScript game logic/plugins, external AI APIs, and Go-owned filesystem SQLite saves/import/export. Frontend performance and a simple responsive app are explicit quality requirements. This is staging refinement, not production approval or implemented behaviour.

## Decisions and review history
- 2026-10-17 — **Explicit refinement accepted by the requesting user:** Replace the earlier Tauri/sidecar evaluation with **Wails v3** for both packaged cross-platform desktop and **headless localhost Go server/browser** delivery. Use a **static SvelteKit/Svelte frontend with an entirely client-side TypeScript gameplay coordinator, rules and gameplay plugins**. The frontend handles provider API integrations; **Go/Wails owns SQLite persistence on the host filesystem**, including save and import/export operations. No canonical adventure data in browser storage, no embedded AI runtime or Node SSR requirement; prioritise lightweight responsive play. This approves the IDEA-0053 architectural direction **within staging only**, without selecting file export format, native driver, security scheme or release mechanics.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**, originally focused on GitHub clone/npm startup, a stable HTTP localhost origin and offline local-model use.
- 2026-10-16 — **User-requested Inbox refinement (not acceptance at that time):** Ease of installation must consider ordinary, nontechnical players. In addition to source/npm installation, investigate a published Docker image and other low-friction startup routes such as Compose, downloadable prebuilt local releases or desktop installers. Preserve the SvelteKit/local-offline direction, avoid premature delivery-method selection, and account for safe persistent data and model access.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Support **Tauri as the primary installation/startup method for ordinary players** alongside a straightforward **SvelteKit npm install/start localhost route**, sharing one application UI/gameplay core with platform-specific data/OS/model adapters. Keep **Docker and similar packaging as potential additional options** for evaluation rather than automatically mandatory deliverables. Preserve local/offline play and safe persistent story data. Moved the same note from Inbox to staging for refinement, not production.
- 2026-10-17 — **Refinement decision accepted by the requesting user:** Choose **external AI execution** rather than packaging/hosting an AI model as part of Lorebound; offer integration with multiple local/cloud API styles. Target a cohesive offline-capable application on Windows, macOS and Linux (consistent with IDEA-0001). The user additionally **proposed for evaluation**, but did not yet approve, a Tauri-managed complete SvelteKit frontend/backend server to minimise Rust backend development. Keep the sidecar/server packaging architecture open pending comparison and approval. This is **not** approval to move IDEA-0053 to production.
