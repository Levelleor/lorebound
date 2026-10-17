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
Make SvelteKit-based Lorebound easy for ordinary players to obtain, install, launch and update using a **Tauri desktop application as the primary player-facing distribution**, while also **supporting a straightforward GitHub/npm install-and-start workflow** that runs the same application on localhost. Keep a published Docker image, Docker Compose and other packaging approaches as **potential options to evaluate**, not presently required release targets. Reuse the same story interface, game coordinator, capability registry and rules as much as possible, with environment-specific adapters for storage and native access. Preserve local/offline play with installed models and complete persistent adventures.

## Why this idea matters
Most use is expected to be local, without TLS configuration, hosted-account management or mandatory cloud services. Git/npm startup suits developers, but requiring players to clone a repository, manage Node versions, install dependencies and troubleshoot terminal commands creates unnecessary friction. Docker can simplify repeatable self-hosted installation but still requires Docker and knowledge of ports, volumes and model access. Native installers or prebuilt launchers could improve accessibility for people who just want to open Lorebound and play. The preferred path should be chosen with beginner setup, updates, data safety and ongoing maintenance in mind.

## Accepted direction
- **Primary player-facing method: Tauri desktop:** Target a downloadable Tauri desktop app for ordinary players so they can install or open Lorebound without cloning a repository, installing Node dependencies or running development commands. The exact platform targets, installer/portable builds, update system and release sequence are refinement choices.
- **Supported source/npm install-and-start:** Preserve a developer-friendly SvelteKit route: clone/download the project, install npm packages, run documented development or local production startup scripts and open Lorebound on a predictable HTTP localhost origin. Do not require the desktop installation to run this route.
- **One shared Lorebound application:** Share Svelte components, storytelling UI, TypeScript coordinator, gameplay rules, capability registry and domain logic between Tauri and normal SvelteKit browser/localhost modes wherever technically practical, avoiding separate competing engines or duplicated gameplay implementations.
- **Environment adapters instead of assuming one runtime:** Hide persistence, file access, local model discovery and OS integrations behind clear interfaces. A Tauri frontend does not automatically run SvelteKit server endpoints inside the desktop app, so avoid building shared gameplay logic that depends exclusively on SvelteKit server-only modules. Evaluate desktop-friendly storage/native handlers and SvelteKit server-backed storage independently, consistent with accepted IDEA-0051.
- **Docker is a potential additional distribution:** Record versioned Docker image and optional Compose as self-hosting alternatives worth evaluating; they are **not mandated** by this acceptance. Any future Docker route should use persistent external volumes, clear port mappings and suitable access to local-model runtimes.
- **Other convenience options remain exploratory:** Portable launcher builds, PWA, hosted deployment templates and other installers may be considered, but Tauri is the selected primary desktop direction, not just one equal alternative. Do not commit to Electron or redundant desktop shells.
- **Local/offline-capable operation and external inference (2026-10-17 refinement):** Lorebound is the app/game, **not a bundled AI model or inference engine**. Support multiple model-provider/API styles and integrations, including independently installed local model servers and optional remote/cloud APIs. Local gameplay must not require a Lorebound account, internet connectivity or cloud inference once application assets and a compatible local model server are available. Initial app installation and separately installed model/runtime setup may need network access. Built-in model downloading or hosting is **not required** by this idea.
- **Save data must survive delivery changes:** Protect full incremental story history and backups across upgrades, restarts, reinstallations and changes in app packaging. Browser-origin/port changes must not silently orphan browser-local stories. Desktop and server storage layouts are still undecided.
- **Desktop OS scope:** The player-facing desktop experience targets **Windows, macOS and Linux**, as clarified in IDEA-0001 on 2026-10-17. Exact build targets, installer formats and release sequencing need refinement.
- **Backend packaging under active evaluation:** Investigate bundling a SvelteKit/TypeScript server as a Tauri-managed sidecar, alongside the conventional static Tauri frontend/native adapter approach. Tauri does not natively embed an SSR/SvelteKit server, so such a design would require a separately packaged executable, process lifecycle management, localhost transport hardening and cross-platform build validation. **No sidecar architecture or SvelteKit adapter is yet approved.**
- **Keep release mechanics open:** Do not prematurely choose Tauri Rust command APIs, database engine, SvelteKit adapter, port, model runtime integration, signing, autoupdate implementation or a Docker delivery commitment.

## Possible startup and distribution paths (original options, evaluated under selected priorities)
- **Developer/source workflow:** Clone GitHub, install npm dependencies, run documented SvelteKit scripts and open a predictable HTTP localhost origin. Preserve this as a supported option for contributors and technical users.
- **Published Docker image:** Evaluate downloadable, versioned container images as an alternative to installing Node packages on the host. Provide documented port mapping, persistent database/data volumes and access to configured local or container-accessible model runtimes. Docker itself must be installed; a container is **not inherently a one-click solution**.
- **Optional Docker Compose configuration:** Evaluate a minimal Compose file for players hosting the app, especially if a chosen database, local model service or persistent storage needs configuration. Avoid requiring Compose or extra containers when simpler deployment is adequate.
- **Prebuilt self-contained local release:** Consider a downloadable platform-specific executable, launcher or bundled local web server (and a shortcut to open the browser) that avoids manual npm installation. Check actual feasibility with SvelteKit's selected adapter and database backend.
- **Desktop installer/packaged app:** Evaluate Windows/macOS/Linux installers or portable desktop builds using a suitable shell/runtime (for example Electron or Tauri **as alternatives**, not accepted dependencies). The app could present the SvelteKit experience without asking ordinary players to start a development server manually. Evaluate installed backend compatibility, local model discovery, auto-updates, signing and distribution costs.
- **PWA / installed web shortcut:** Keep as a limited option where appropriate; a PWA install by itself does **not** bundle a required server, AI model, model runtime or persistent backend. Offline support depends on actual caching/storage architecture.
- **Optional hosted deployment or guided one-click self-host template:** Could be evaluated if ease of access later warrants it, but do not turn cloud hosting, sign-in or remote model inference into a requirement for local play.

## Proposed behaviour
The same SvelteKit user interface and shared Lorebound gameplay core are delivered through two accepted entry points: a Tauri desktop application for ordinary players and a documented npm install/start route for developers and people preferring a localhost browser. A desktop-specific bridge/storage adapter handles any functionality unavailable to a static or client-rendered Tauri frontend; a SvelteKit server adapter can supply appropriate backend behaviour to the browser route. Both reach the same coordinator and world-state rules and preserve canonical persistent data in an appropriate durable location. After the player has installed the app and necessary local model weights/runtime, offline-capable gameplay does not rely on remote services. A Docker image/Compose distribution may be added after evaluation, without becoming a new game engine or a mandatory service for either accepted route. Port/origin stability, application data migration, installation, update and recovery steps are refined before production.

## Alternatives and trade-offs
- **npm only:** Lowest initial maintainer overhead and highly transparent for contributors, but unfriendly to players who are unfamiliar with terminals and dependency versions.
- **Docker/Docker Compose:** Repeatable deployment and easy version pinning for technical players or self-hosters; requires Docker setup, volume management, port permissions and careful host model/GPU connectivity.
- **Tauri (selected primary desktop method):** Better potential nontechnical onboarding with a shared web UI, but requires native builds, Rust/Tauri integration for privileged functions, OS security/signing, updates and data migration. A SvelteKit static/SPA frontend in Tauri does not directly include the usual SvelteKit server runtime; use explicit platform adapters.
- **Alternative non-Tauri executable or desktop installer:** Other native launchers or Electron could provide different packaging properties but are not approved competing primary distributions.
- **PWA:** Convenient entry point for browser installations, but does not automatically solve server-side services or local AI model runtimes.
- **Hosted app:** Simplifies first launch for players but changes cost, privacy, online dependencies and account expectations; remains optional, not a replacement for accepted local/offline use.
- **Multiple entry points (accepted):** Tauri primary and SvelteKit npm/localhost are both target modes, sharing the same app codebase and gameplay behaviour. Additional packaging methods should only be added if their maintenance and player benefits justify them.

## Dependencies and constraints
- **SvelteKit** is the intended application framework from accepted [[Browser-Persistent Story Database]] (IDEA-0051). A Tauri build may require a client-side/static adapter and native handlers, while npm/localhost may use normal SvelteKit server endpoints. The actual build arrangements and persistence adapters must be refined; **one shared application does not imply identical hosting runtimes**.
- Tauri is the **accepted primary player-facing distribution direction**, npm/localhost is **also accepted**, and Docker/Compose remains a **potential optional distribution**, not required or implemented.
- Must preserve complete incremental history and coherent persistence (IDEA-0042 and IDEA-0051) no matter which distribution/startup method is used.
- Backups/export/restore and storage data safety are accepted for refinement in [[Backups Export and Storage Quotas]] (IDEA-0052). Docker volumes and desktop app data directories must not make losing data on updates likely.
- The optional local bridge idea [[Optional Loopback Node Bridge]] (IDEA-0054) remains separately unaccepted; easier launch options do not implicitly approve a generic bridge or MCP tooling.
- Preserve an offline-capable local-model experience without mandatory remote inference, hosted accounts or cloud services. External AI servers/providers, not a bundled inference engine, provide model execution; allow different API styles and provider adapters. Different packaging choices may need separate paths to discover/access installed local model runtimes.
- Investigate whether a bundled TypeScript/SvelteKit Node-compatible server running as a Tauri sidecar can reuse the npm/localhost backend without excessive native code. Keep this an **unresolved architectural option**, not a selected implementation. Compare it with a static SvelteKit frontend plus backend service/native adapter, considering HTTP security, application/server lifecycle, package size and cross-platform distribution.
- This is **staging** approval of the above direction, not production readiness or an implemented Tauri build. Docker and other release channels have not received an implementation commitment.

## Open questions
- How should origin/port migration protect existing browser data?
- Which beginner-friendly option achieves genuinely minimal setup on Windows, macOS and Linux while remaining realistically maintainable?
- What is the minimal Tauri packaging and onboarding experience for players, and which OS targets must be supported initially?
- Should Docker image/Compose become an additional formally supported self-hosting distribution after evaluation, or remain optional?
- How can SvelteKit's browser/localhost server functions and Tauri's desktop runtime use **one shared UI/coordinator/gameplay core** without duplicate architectures?
- Should the Tauri app bundle and manage a complete SvelteKit/Node-compatible backend sidecar (including the UI), or serve a static SvelteKit SPA and use an API-only sidecar/native adapter? What is the smallest workable cross-platform spike to validate the choice?
- Which platform-agnostic APIs and desktop/server adapters are required for persistent storage, file access, local-model discovery and native capabilities?
- How are persistent stories stored outside an ephemeral Docker container, and how are their paths, permissions, backup and upgrades managed?
- Can a container access a locally installed model server securely and reliably, including CPU/GPU and cross-platform networking differences?
- How do we provide reliable offline startup after all necessary application/model assets have been installed?
- Should a launcher open a browser tab, use a desktop shell, or offer both?
- How will signing, installer/update distribution, version pinning and security patches be maintained?
- Can upgrades or reinstallations retain the same stable URL/origin or migrate browser-owned state safely?
- What exact onboarding steps are feasible for first-time model configuration and optional storage location selection?
- What should happen if a required local model runtime is unavailable or the expected port is already occupied?

## Draft acceptance criteria
- [ ] Tauri desktop is the primary player-facing deployment target, enabling ordinary players to install and launch Lorebound without having to clone GitHub or install npm dependencies.
- [ ] A documented npm install/start workflow runs the SvelteKit application through a predictable localhost address independently of Tauri.
- [ ] The two accepted modes share SvelteKit UI, coordinator, capability contracts, game rules and core state-history behaviour, with scoped environment-specific adapters where needed.
- [ ] The Tauri app does not assume it can execute SvelteKit server endpoints without an explicitly designed server or adapter.
- [ ] Both modes can use independently hosted/local-model APIs and saved adventures without mandatory cloud accounts or remote inference after required installation/download, and do not require the app to install or embed a model runtime.
- [ ] Backend-hosting approaches, including a Tauri-managed SvelteKit/TypeScript sidecar, are evaluated before choosing the desktop packaging/runtime architecture.
- [ ] Adventures and their full incremental state histories remain protected across app upgrades, installation changes and runtime-specific data directories.
- [ ] Browser-origin/port changes are either avoided or accompanied by a safe data migration/recovery plan when browser-origin storage is involved.
- [ ] Docker images/Compose remain documented for evaluation as a possible optional self-hosting distribution, not a present mandatory build target.
- [ ] Installer format, OS rollout, application signing, update mechanisms, storage engine and production SvelteKit adapter are resolved in later staging refinement rather than invented as existing implementation.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. The original localhost/npm direction, subsequent ease-of-installation request and final preference for a **Tauri-primary plus npm install/start** architecture were specified and accepted by the requesting user.
- Docker and Compose are retained as possible later distribution options, not selected implementation requirements. The requesting user explicitly selected external AI runtimes/APIs over bundling or managing inference inside Lorebound. Full SvelteKit backend sidecar hosting is a **question under investigation**, not a committed design. This remains staging only, not production approval or implementation.

## Decisions and review history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**, originally focused on GitHub clone/npm startup, a stable HTTP localhost origin and offline local-model use.
- 2026-10-16 — **User-requested Inbox refinement (not acceptance at that time):** Ease of installation must consider ordinary, nontechnical players. In addition to source/npm installation, investigate a published Docker image and other low-friction startup routes such as Compose, downloadable prebuilt local releases or desktop installers. Preserve the SvelteKit/local-offline direction, avoid premature delivery-method selection, and account for safe persistent data and model access.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Support **Tauri as the primary installation/startup method for ordinary players** alongside a straightforward **SvelteKit npm install/start localhost route**, sharing one application UI/gameplay core with platform-specific data/OS/model adapters. Keep **Docker and similar packaging as potential additional options** for evaluation rather than automatically mandatory deliverables. Preserve local/offline play and safe persistent story data. Moved the same note from Inbox to staging for refinement, not production.
- 2026-10-17 — **Refinement decision accepted by the requesting user:** Choose **external AI execution** rather than packaging/hosting an AI model as part of Lorebound; offer integration with multiple local/cloud API styles. Target a cohesive offline-capable application on Windows, macOS and Linux (consistent with IDEA-0001). The user additionally **proposed for evaluation**, but did not yet approve, a Tauri-managed complete SvelteKit frontend/backend server to minimise Rust backend development. Keep the sidecar/server packaging architecture open pending comparison and approval. This is **not** approval to move IDEA-0053 to production.
