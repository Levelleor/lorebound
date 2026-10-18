---
id: "IDEA-0061"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-17"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Naming Licensing and Open Questions Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Lorebound Branding and Engine Split

## Idea
Keep **Lorebound** as the single project and application identity. The user has clarified that its internal game-engine/backend component can simply be called **Lorebound Backend**, without a second branded product, package identity or independent public project. The originally proposed separate engine name **Fablecore** is not selected.

## Why this idea matters
Lorebound's reusable coordinator, state persistence and native capability logic should be easy to distinguish architecturally from its UI and runtime adapters without introducing unnecessary branding, naming, documentation or release overhead. A straightforward internal label conveys this distinction.

## Accepted direction
- **One public project and application brand:** Use **Lorebound** for the project, repository, application and player-facing product. Do not create a second public engine brand.
- **Internal descriptive label:** Call the shared modular engine/backend functionality **Lorebound Backend**, when naming that internal architectural component is useful. This is a descriptive name, not a separate independently branded product.
- **No mandatory split or separate distribution:** Do not require a second repository, separately published engine package, service, deployment target, versioning scheme or independent release workflow just because a backend layer exists.
- **Preserve modular architecture:** Keep gameplay coordination, capability registration, state/history operations and runtime-specific adapters appropriately separated so they can be reused by the accepted Tauri desktop and SvelteKit npm/localhost routes (IDEA-0053), without duplicating an engine.
- **Name does not imply server topology:** Tauri may use native adapters; SvelteKit's npm/localhost workflow may use server routes. The term *Backend* does not require Tauri to run an extra Node process or require SvelteKit to share an identical runtime.
- **Reconsideration only if justified later:** External packaging and a separate engine identity could be discussed later only upon a concrete reuse requirement and a new explicit decision. Neither *Fablecore* nor any alternate engine brand is selected.

## Proposed behaviour
- Use **Lorebound** for the overall application, repository and user-facing brand.
- Use **Lorebound Backend** as a plain descriptive name for the shared backend/engine-related functionality where the distinction is useful. This naming preference does **not** mandate a separate repository, independently distributed package, network server or release process.
- Preserve the accepted modular shared SvelteKit/Tauri application and universal capability architecture. Tauri may use native adapters while npm/localhost may use SvelteKit server routes; the label *backend* does not imply both must run an extra local server.
- Consider independently publishing/rebranding the engine only if an actual reuse case emerges and the user makes a separate decision.

## Alternatives and trade-offs
- **Preferred user naming:** One Lorebound project, with the internal descriptive label **Lorebound Backend**.
- **Original assistant-proposed alternative (not selected):** A distinct reusable engine brand such as *Fablecore*, potentially with separate distribution if future reuse justifies it.

## Dependencies and constraints
- [[Localhost Startup and Offline Mode]] (IDEA-0053) now selects **Wails v3 desktop and headless localhost Go server builds**, sharing a statically built SvelteKit/Svelte UI and **browser-side TypeScript coordinator/gameplay engine**. Go service bindings support native access and filesystem SQLite, not a second game-engine implementation.
- [[Native Gameplay Capability Registry]] (IDEA-0047), [[Deterministic Adventure Coordinator]] (IDEA-0044) and [[Snapshots and Incremental State Rebuild]] (IDEA-0042) establish modular shared engine responsibilities, independent of external branding.
- The external runtime/storage decision now selects **Go/Wails v3 + filesystem SQLite** in IDEA-0053/0051. This branding note does not itself decide repo/package layout or create a separately hosted/published engine.
- This note is **accepted for staging refinement**, not production-approved or implemented.

## Open questions
- What internal module/package boundaries best separate the shared coordinator and canonical state logic from Tauri native integrations and SvelteKit server integrations?
- Which repository layout or code/package names should use the descriptive label *Lorebound Backend*, if any?
- Do future users of the engine justify separate publishing or packaging? No separate brand or distribution is currently requested.
- The original trademark/domain availability and branding overhead question applies only if a distinct public brand is reconsidered later.

## Draft acceptance criteria
- [ ] Official player-facing naming consistently identifies the application and overall project as **Lorebound**.
- [ ] Internal architecture and planning may refer to shared engine/backend functionality as **Lorebound Backend**, without introducing *Fablecore* or a second public brand.
- [ ] Normal Tauri and SvelteKit/npm workflows do not need a separately published engine package, repository or mandatory extra server simply because the backend is internally named.
- [ ] Shared coordinator, rules, capability contracts and persistent history can remain modular across supported runtime adapters.
- [ ] Exact package names, module boundaries, folder layout and potential future distribution details stay open for refinement.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. The separate-engine-brand proposal originated with the assistant. The user has expressly preferred **Lorebound Backend** over a new engine brand.
- The requesting user later **explicitly accepted** the revised one-brand, Lorebound Backend naming direction for staging, not the original separate-brand proposal.
- This staging acceptance does not approve or implement any second engine brand, repository split or separately distributed backend.

## Decisions and review history
- 2026-10-17 — **Cross-reference alignment:** IDEA-0053 now selects Wails v3 desktop/headless and client-side TypeScript game logic; IDEA-0051 selects Go-managed filesystem SQLite. The descriptive internal label "Lorebound Backend" does not imply a standalone server, Go gameplay engine or externally released package. No change to this idea\'s accepted naming scope.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**, considering a separately branded engine such as Fablecore.
- 2026-10-17 — **User clarification (not staging acceptance):** "We'll just call it lorebound backend." Record the internal descriptive name **Lorebound Backend**; do not establish a second public engine brand or imply a separate repository, service or package. The note remained in Inbox pending a final review decision.
- 2026-10-17 — **Explicitly accepted by the requesting user:** Keep **Lorebound** as the single project and application brand and use **Lorebound Backend** as the descriptive internal engine/backend name, with no separate engine brand, repository or mandatory independent distribution. Move this same note to staging for refinement only, not production.
