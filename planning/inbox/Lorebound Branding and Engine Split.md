---
id: "IDEA-0061"
type: idea
status: candidate
origin: agent
created: "2026-10-16"
updated: "2026-10-17"
source_brainstorms: ["[[Naming Licensing and Open Questions Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Lorebound Branding and Engine Split

## Idea
Keep **Lorebound** as the single project and application identity. The user has clarified that its internal game-engine/backend component can simply be called **Lorebound Backend**, without a second branded product, package identity or independent public project. The originally proposed separate engine name **Fablecore** is not selected.

## Why consider it?
Lorebound's reusable coordinator, state persistence and native capability logic should be easy to distinguish architecturally from its UI and runtime adapters without introducing unnecessary branding, naming, documentation or release overhead. A straightforward internal label conveys this distinction.

## Rough behaviour
- Use **Lorebound** for the overall application, repository and user-facing brand.
- Use **Lorebound Backend** as a plain descriptive name for the shared backend/engine-related functionality where the distinction is useful. This naming preference does **not** mandate a separate repository, independently distributed package, network server or release process.
- Preserve the accepted modular shared SvelteKit/Tauri application and universal capability architecture. Tauri may use native adapters while npm/localhost may use SvelteKit server routes; the label *backend* does not imply both must run an extra local server.
- Consider independently publishing/rebranding the engine only if an actual reuse case emerges and the user makes a separate decision.

## Variations and alternatives
- **Preferred user naming:** One Lorebound project, with the internal descriptive label **Lorebound Backend**.
- **Original assistant-proposed alternative (not selected):** A distinct reusable engine brand such as *Fablecore*, potentially with separate distribution if future reuse justifies it.

## Open questions and risks
- What internal module/package boundaries best separate the shared coordinator and canonical state logic from Tauri native integrations and SvelteKit server integrations?
- Which repository layout or code/package names should use the descriptive label *Lorebound Backend*, if any?
- Do future users of the engine justify separate publishing or packaging? No separate brand or distribution is currently requested.
- The original trademark/domain availability and branding overhead question applies only if a distinct public brand is reconsidered later.

## Evaluation notes
- Origin: **agent**. The separate-engine-brand proposal originated with the assistant. The user has expressly preferred **Lorebound Backend** over a new engine brand.
- This captures a **user naming clarification**, not acceptance of the original separate-brand proposal or an implementation approval.
- The candidate remains in Inbox pending an explicit Accept/Skip/Reject decision; no engine repository split or second brand has been approved.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**, considering a separately branded engine such as Fablecore.
- 2026-10-17 — **User clarification (not staging acceptance):** "We'll just call it lorebound backend." Record the internal descriptive name **Lorebound Backend**; do not establish a second public engine brand or imply a separate repository, service or package. Keep the note as `status: candidate` for a final review decision.
