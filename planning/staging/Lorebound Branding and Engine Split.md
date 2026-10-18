---
id: "IDEA-0061"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-17"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Naming Licensing and Open Questions Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Lorebound Branding and Lore Engine Scope

## Idea
Keep **Lorebound** as the single application and project identity. Call the application's **non-UI functionality collectively the Lore Engine**, replacing the previous internal label *Lorebound Backend*. The Lore Engine is an **architectural umbrella**, not a separately branded app, runtime, independent package or server. The older proposal *Fablecore* is not selected.

## Why this idea matters
The current architecture deliberately runs much of its gameplay logic **inside the normal browser's TypeScript application**, alongside the Svelte UI. Calling all of that a "backend" is misleading. **Lore Engine** distinguishes what the app *does* from how the UI *presents it* without pretending that gameplay logic runs in a separate backend process.

## Accepted direction
- **One product identity:** The overall application, repository and public-facing product remain **Lorebound**. **Lore Engine** is a descriptive internal name, not a second public brand or separately distributed product.
- **UI versus Lore Engine (explicit user acceptance, 2026-10-18):** Conceptually divide Lorebound into the **UI** and **the rest of its non-UI functionality called the Lore Engine**. The latter includes the browser-resident TypeScript gameplay coordinator, rules/validators, capabilities/plugins, generation/context operations and their integration with persisted state, plus **supporting Wails/Go headless server, privileged platform/persistence services and SQLite access**. Distinguish these *responsibilities* without requiring one programming language or one process for the umbrella.
- **Browser-side gameplay logic remains in the frontend runtime:** The SvelteKit/Svelte **UI** and TypeScript game logic coexist in the same normal-browser application. The gameplay coordinator, capability execution and rules are **TypeScript**, not moved to Go by this rename.
- **Go has its own defined supporting role:** The Wails v3 headless Go server serves the UI, controls filesystem/SQLite and privileged services and enforces transaction/service boundaries. Being included under the conceptual **Lore Engine** umbrella does **not** make Go a duplicate gameplay authority or imply a separate 'engine server'.
- **No mandatory repository/package/service split:** The conceptual UI/engine distinction does **not** require two repositories, deployed processes for UI versus engine, published modules, independent release/version schemes or a new product brand. Exact folder and module boundaries remain open.
- **Prior naming superseded:** *Lorebound Backend* was an **earlier accepted name**, now replaced for current design terminology by **Lore Engine**. Keep it only as clearly labelled historical context, not as the name used for the current architecture. *Fablecore* remains unselected.

## Proposed behaviour
Documentation and future code design call the user-facing interface the **Lorebound UI** and its collectively non-UI responsibilities the **Lore Engine**. Within that umbrella, refer precisely to **browser-side TypeScript gameplay/coordinator modules** and **Go/Wails host/persistence services** whenever a runtime boundary matters. Keep one headless Go server, ordinary browser UI and one Go-owned SQLite library per the accepted IDEA-0053/0051 architecture. No new daemon, RPC hop, Go gameplay port or published package follows from terminology.

## Alternatives and trade-offs
- **Accepted current name:** **Lore Engine** for Lorebound's non-UI functionality across the existing TypeScript gameplay and supporting Go/platform layers.
- **Superseded internal name:** **Lorebound Backend** suggested all non-UI logic was server-side, which conflicts with the selected client-side TypeScript gameplay architecture.
- **Unselected separate brand:** A second public engine identity such as *Fablecore* would add naming and distribution overhead without an approved independent product requirement.
- **Narrow TypeScript-only label (not chosen):** Calling only the browser-side gameplay code Lore Engine would leave out the user's accepted 'UI versus the rest' umbrella. This does not remove the need to distinguish gameplay authority from Go service responsibilities.

## Dependencies and constraints
- [[Localhost Startup and Offline Mode]] (IDEA-0053) determines the **headless Wails v3 Go server**, normal browser and statically built SvelteKit UI; 'Lore Engine' does not change these runtime decisions.
- [[Deterministic Adventure Coordinator]] (IDEA-0044), [[Native Gameplay Capability Registry]] (IDEA-0047) and [[Snapshots and Incremental State Rebuild]] (IDEA-0042) define browser-side gameplay and reconstruction responsibilities.
- [[Browser-Persistent Story Database]] (IDEA-0051) defines Go-managed SQLite persistence and the service boundary. The conceptual engine label does not relax transactional version checks or change which layer can perform privileged filesystem operations.
- The exact module/folder naming, contracts across browser/Go services and any future external packaging remain for implementation design and separate approval. This document is **staging**, not code or production approval.

## Open questions
- Which module and API boundaries best distinguish the browser's **UI**, browser-side **Lore Engine gameplay modules** and **Lore Engine support through Go platform/persistence services**?
- Which directory/package identifiers, if any, should literally use `lore-engine` versus implementation-specific names? No package split is implied by acceptance.
- If a genuine external reuse case emerges, should engine publishing or a separate identity be proposed? No independent distribution is currently accepted.

## Draft acceptance criteria
- [ ] The product and repository remain named **Lorebound**, with **Lore Engine** used as its current collective **non-UI architectural label**.
- [ ] Design documents distinguish the **Svelte UI** from **TypeScript game logic in the same browser application**, and identify **Wails/Go persistence and platform services** as supporting non-UI responsibilities under the conceptual umbrella without moving gameplay execution into Go.
- [ ] No second runtime, independent game server, repository, public product, branded engine package or separately published artifact is required merely by adopting the label.
- [ ] Older `Lorebound Backend` usage is identified as **superseded** rather than a current competing name; `Fablecore` remains an unselected historical idea.
- [ ] The established Wails headless architecture, single SQLite library and module/transaction authority boundaries stay intact; implementation-specific folder layout remains open.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. The separate-engine-brand proposal originated with the assistant. The user formerly accepted **Lorebound Backend** as a descriptive name and has now explicitly replaced it with **Lore Engine**.
- The requesting user explicitly approved **Lore Engine** for all non-UI functionality, while preserving the existing browser-side TypeScript gameplay and supporting Go/SQLite roles. The former **Lorebound Backend** name is superseded.
- This staging acceptance does not approve or implement a second product brand, repository/package split, separate game process or independently distributed engine.

## Decisions and review history
- 2026-10-18 — **Explicit user rename and option-A scope acceptance:** **Rename the internal 'Lorebound Backend' label to 'Lore Engine'**, because the gameplay coordinator and rules run within the browser/frontend runtime rather than a separate backend. Define **Lore Engine** as the conceptual **non-UI side of Lorebound**, encompassing browser-side TypeScript game coordination/capabilities and supporting Go/Wails platform and SQLite services, while keeping their distinct execution/authority boundaries. The old internal name is superseded; Lorebound remains the only app/public brand. No second runtime, package, repo, service or production promotion.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Cross-reference alignment:** IDEA-0053 now selects Wails v3 desktop/headless and client-side TypeScript game logic; IDEA-0051 selects Go-managed filesystem SQLite. The descriptive internal label "Lorebound Backend" does not imply a standalone server, Go gameplay engine or externally released package. No change to this idea\'s accepted naming scope.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**, considering a separately branded engine such as Fablecore.
- 2026-10-17 — **User clarification (not staging acceptance):** "We'll just call it lorebound backend." Record the internal descriptive name **Lorebound Backend**; do not establish a second public engine brand or imply a separate repository, service or package. The note remained in Inbox pending a final review decision.
- 2026-10-17 — **Explicitly accepted by the requesting user:** Keep **Lorebound** as the single project and application brand and use **Lorebound Backend** as the descriptive internal engine/backend name, with no separate engine brand, repository or mandatory independent distribution. Move this same note to staging for refinement only, not production.
