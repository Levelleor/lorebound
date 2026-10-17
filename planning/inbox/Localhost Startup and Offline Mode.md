---
id: "IDEA-0053"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Local First Storage and Deployment Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Localhost Startup and Offline Mode

## Idea
Make **SvelteKit-based Lorebound easy for ordinary players to obtain, install, launch and update**, while preserving the developer-friendly original route of cloning GitHub, installing packages, starting the app with npm and opening its localhost URL. **Evaluate a maintained Docker image / optional Docker Compose setup and easier packaged/installer-based or prebuilt options** so a command line and manual dependency installation need not be the only path for nontechnical players. The app should still support local/offline play with installed models and the chosen persistent storage architecture. No single distribution method has been selected or promised yet.

## Why consider it?
Most use is expected to be local, without TLS configuration, hosted-account management or mandatory cloud services. Git/npm startup suits developers, but requiring players to clone a repository, manage Node versions, install dependencies and troubleshoot terminal commands creates unnecessary friction. Docker can simplify repeatable self-hosted installation but still requires Docker and knowledge of ports, volumes and model access. Native installers or prebuilt launchers could improve accessibility for people who just want to open Lorebound and play. The preferred path should be chosen with beginner setup, updates, data safety and ongoing maintenance in mind.

## Possible startup and distribution paths (for comparison, not yet accepted)
- **Developer/source workflow:** Clone GitHub, install npm dependencies, run documented SvelteKit scripts and open a predictable HTTP localhost origin. Preserve this as a supported option for contributors and technical users.
- **Published Docker image:** Evaluate downloadable, versioned container images as an alternative to installing Node packages on the host. Provide documented port mapping, persistent database/data volumes and access to configured local or container-accessible model runtimes. Docker itself must be installed; a container is **not inherently a one-click solution**.
- **Optional Docker Compose configuration:** Evaluate a minimal Compose file for players hosting the app, especially if a chosen database, local model service or persistent storage needs configuration. Avoid requiring Compose or extra containers when simpler deployment is adequate.
- **Prebuilt self-contained local release:** Consider a downloadable platform-specific executable, launcher or bundled local web server (and a shortcut to open the browser) that avoids manual npm installation. Check actual feasibility with SvelteKit's selected adapter and database backend.
- **Desktop installer/packaged app:** Evaluate Windows/macOS/Linux installers or portable desktop builds using a suitable shell/runtime (for example Electron or Tauri **as alternatives**, not accepted dependencies). The app could present the SvelteKit experience without asking ordinary players to start a development server manually. Evaluate installed backend compatibility, local model discovery, auto-updates, signing and distribution costs.
- **PWA / installed web shortcut:** Keep as a limited option where appropriate; a PWA install by itself does **not** bundle a required server, AI model, model runtime or persistent backend. Offline support depends on actual caching/storage architecture.
- **Optional hosted deployment or guided one-click self-host template:** Could be evaluated if ease of access later warrants it, but do not turn cloud hosting, sign-in or remote model inference into a requirement for local play.

## Rough behaviour
Prefer a straightforward, documented launch experience for each ultimately supported path. For locally run browser interfaces, use a stable, predictable localhost URL/port or provide safe data migration for origin changes. For container/installer distributions, preserve the player's story database and backup/export paths across upgrades, reinstalls, shutdowns and image/container replacement; do not bury canonical data inside ephemeral container layers. Local play using installed local models and story data should function without requiring live remote AI or cloud authentication. First-time installation or model download may require internet; offline means usable afterward for the supported local configuration. Exact startup commands, ports, release tooling, updater, and packaging remain undecided.

## Variations and alternatives
- **npm only:** Lowest initial maintainer overhead and highly transparent for contributors, but unfriendly to players who are unfamiliar with terminals and dependency versions.
- **Docker/Docker Compose:** Repeatable deployment and easy version pinning for technical players or self-hosters; requires Docker setup, volume management, port permissions and careful host model/GPU connectivity.
- **Prebuilt executable or desktop installer:** Better potential nontechnical onboarding, but platform builds, runtime bundling, OS security prompts/signing, local data migration, updates and support have ongoing costs.
- **PWA:** Convenient entry point for browser installations, but does not automatically solve server-side services or local AI model runtimes.
- **Hosted app:** Simplifies first launch for players but changes cost, privacy, online dependencies and account expectations; remains optional, not a replacement for accepted local/offline use.
- **Multiple entry points:** We can offer npm for development and one or more easier releases for players, sharing the same SvelteKit codebase, coordinator, canonical data and feature behavior. The exact supported set should be selected only after feasibility and maintainability evaluation.

## Dependencies and constraints
- **SvelteKit** is the intended application framework from accepted [[Browser-Persistent Story Database]] (IDEA-0051). The precise server adapter, backend database and hosting architecture are still open.
- Must preserve complete incremental history and coherent persistence (IDEA-0042 and IDEA-0051) no matter which distribution/startup method is used.
- Backups/export/restore and storage data safety are accepted for refinement in [[Backups Export and Storage Quotas]] (IDEA-0052). Docker volumes and desktop app data directories must not make losing data on updates likely.
- The optional local bridge idea [[Optional Loopback Node Bridge]] (IDEA-0054) remains separately unaccepted; easier launch options do not implicitly approve a generic bridge or MCP tooling.
- Preserve an offline-capable local-model experience without mandatory remote inference, hosted accounts or cloud services. Different packaging choices may need separate paths to discover/access installed local model runtimes.
- Neither Docker nor desktop packaging is accepted for implementation yet; the candidate remains in Inbox.

## Open questions and risks
- How should origin/port migration protect existing browser data?
- Which beginner-friendly option achieves genuinely minimal setup on Windows, macOS and Linux while remaining realistically maintainable?
- Should we target a prebuilt portable local launcher, full desktop installer, Docker image, Docker Compose, or a smaller subset in addition to npm?
- How can SvelteKit's selected adapter and eventual browser/server/hybrid database be packaged without duplicate architectures?
- How are persistent stories stored outside an ephemeral Docker container, and how are their paths, permissions, backup and upgrades managed?
- Can a container access a locally installed model server securely and reliably, including CPU/GPU and cross-platform networking differences?
- How do we provide reliable offline startup after all necessary application/model assets have been installed?
- Should a launcher open a browser tab, use a desktop shell, or offer both?
- How will signing, installer/update distribution, version pinning and security patches be maintained?
- Can upgrades or reinstallations retain the same stable URL/origin or migrate browser-owned state safely?
- What exact onboarding steps are feasible for first-time model configuration and optional storage location selection?
- What should happen if a required local model runtime is unavailable or the expected port is already occupied?

## Evaluation notes
- Origin: **user**. The original localhost/npm direction came from user requirements, and the requesting user subsequently asked to add Docker images and other more approachable installation/startup options for ordinary users.
- These are options and a usability preference **recorded for review**, not a selected release plan, implementation specification or accepted staging decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**, originally focused on GitHub clone/npm startup, a stable HTTP localhost origin and offline local-model use.
- 2026-10-16 — **User-requested Inbox refinement (not acceptance):** Ease of installation must consider ordinary, nontechnical players. In addition to source/npm installation, investigate a published Docker image and other low-friction startup routes such as Compose, downloadable prebuilt local releases or desktop installers. Preserve the SvelteKit/local-offline direction, avoid premature delivery-method selection, and account for safe persistent data and model access. The idea remains an unaccepted candidate pending the user's decision.
