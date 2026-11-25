---
id: PRD-0002
type: prd
status: accepted
related:
- NOTE-0017
- PRD-0001
- PRD-0054
- PRD-0052
- PRD-0014
- NOTE-0012
- NOTE-0009
- NOTE-0011
---

# Single-Player Account-Free Experience

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0001](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Single-Player%20Account-Free%20Experience.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S01**. First milestone: **M1**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Accepted direction
- **Single-user and local-first:** Lorebound is a personal storytelling game/application. No mandatory Lorebound account registration, sign-in, application-level user profiles or multiplayer infrastructure.
- **Offline-capable without mandatory AI configuration (explicitly accepted):** Lorebound starts and remains usable for all locally supported **non-AI operations**, whether or not any AI provider or model is configured, reachable or currently usable. The user may create/resume and manually edit saved adventures, inspect/edit the Lorebook and world records where supported, and use database-backed manual workflows without an AI connection. **AI API requests alone depend on provider availability**: if configured, attempt the call normally; if nothing usable is configured, clearly explain the missing configuration and link/guide the user to provider setup. When application assets and a usable local model/runtime have been installed and configured, AI-assisted play can also work without internet; cloud AI remains optional.
- **Cross-platform local application:** Provide an executable on **Windows, macOS and Linux** that launches the **headless Wails v3 localhost Go server** and opens Lorebound in the normal browser, not a native WebView. Packaging and local-model onboarding belong to IDEA-0053.
- **Multiple independent adventures:** Let a player create and resume separate saved adventures whose canonical histories and world state do not leak across one another. This idea intentionally does **not** mandate browser-local storage, a particular database or a specific persistence engine. Evaluate storage in Browser-Persistent Story Database (IDEA-0051).
- **No built-in multi-user profiles or Lorebound authentication in this iteration (user clarification 2026-10-23):** Do not build Lorebound sign-in, password/account management, application-level authenticated sessions, login tokens or access-control UI. Rely on the operating system/browser's existing user context for this local single-user iteration. This simplicity **does not guarantee privacy against other software or people in the same OS user context**. Basic loopback-only serving and database/file integrity are platform safeguards, not an application authentication feature. Reconsider stricter service access only through a separate later decision.
- **Selected runtime dependency:** IDEA-0053 supersedes Tauri, native Wails windows and separate npm player hosting with a single headless Go server + normal browser. No embedded inference runtime is approved.

## Open questions
- If stronger local story privacy is later needed on a shared device, should it use OS/browser profiles only or a separately proposed optional feature?
- How should the first-run local-model experience meet the integrated, offline-capable product goal? Resolve packaging and runtime management under IDEA-0053/IDEA-0013 and any separately approved optional model-manager proposal.

## Dependencies and constraints
- IDEA-0053 now selects **Wails v3 headless localhost Go server only**, with the SvelteKit/TypeScript UI and gameplay logic in the normal browser; IDEA-0051 now selects **Go-managed filesystem SQLite** for canonical adventures. IDEA-0001 establishes account-free/offline requirements but does not independently prescribe these implementation choices.
- IDEA-0013 specifies local-model connectivity. The app must be usable offline once installed with local assets and a functioning compatible model, but bundling/downloading/running models inside the application is not approved by this idea.
- Remote model accounts/API keys belong to their providers; **no Lorebound login** does not mean third-party API credentials are unnecessary when cloud models are chosen.
- Offline capability must not silently rely on remote authentication, CDN assets, remote calls or online inference during normal local gameplay.
- Account-free local saves are not automatically private from other users of the same OS/browser profile.

## Draft acceptance criteria
- [ ] A user can close every browser tab, click the Lorebound shortcut and reopen the still-running application's correct browser URL, including on a fallback port, without needing a tray or starting a duplicate server.
- [ ] Fresh runs prefer a consistent port when free, fall back when occupied and do not promise that OS-assigned fallback ports remain the same after Quit and restart.
- [ ] Users can quit the persistent headless server from **Settings → Quit Lorebound**, without needing a tray/menu bar icon or creating an app account; closing tabs alone continues to leave the server running.
- [ ] The player may close every Lorebound browser tab and later reopen the same still-running app via its executable without losing canonical adventure data or starting another server.
- [ ] Browser close does not equal application Quit; only deliberate Quit or OS/process shutdown stops the running instance.
- [ ] Re-launching a running Lorebound executable reuses the same localhost server and browser address without starting a second competing process or requiring a Lorebound account.
- [ ] With **no configured AI profile**, the app starts and the player can create/resume adventures, manually edit/write story prose and Lorebook/character records, save and use other supported local operations **without AI connection setup**.
- [ ] When an **AI-only operation** is requested without a suitable configured model, the UI explains the requirement, offers a usable route to provider/model configuration, and does not imply that generation succeeded.
- [ ] When a suitable provider/model is configured, the app **attempts the real request** without requiring a preliminary successful connection test; ordinary API/network/provider failures yield useful feedback rather than a global application lockout.
- [ ] API failures, including interrupted generation/validation paths, leave last canonical prose/world state intact and preserve recoverable player draft input as applicable; unrelated manual saving/editing still works.
- [ ] Offline with a functioning configured **local** model supports the intended AI calls without mandatory cloud/internet access; offline with a **cloud** profile does not break unrelated offline/manual operations.
- [ ] Lorebound's headless Go executable launches the localhost server on Windows, macOS and Linux and opens play in the normal browser without Lorebound registration or sign-in (specific release/install mechanics are verified under IDEA-0053).
- [ ] A user can create, save, close, reopen and resume multiple adventures using the ultimately selected persistence mechanism, without requiring browser-local storage specifically.
- [ ] Two saved adventures do not share narrative history or world state unless deliberately duplicated, imported or otherwise copied.
- [ ] With the necessary application assets and compatible local inference runtime/model already installed and available, local play works with internet connectivity completely disabled.
- [ ] All supported core storytelling and game interactions can be accessed through the integrated Lorebound application UI, without mandatory external web services.
- [ ] No Lorebound account, multiplayer service or application-level multi-user profile is required for these flows.

## Supporting detail

See [NOTE-0017](../knowledge/inbox/NOTE-0017-prd-0002-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
