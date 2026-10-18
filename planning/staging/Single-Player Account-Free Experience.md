---
id: "IDEA-0001"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Lorebound Vision Brainstorm]]", "[[Gameplay Feature Catalogue Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: ["[[Localhost Startup and Offline Mode]]", "[[Browser-Persistent Story Database]]", "[[Local LLM Server Connections]]"]
tags:
  - planning/idea
---
# Single-Player Account-Free Experience

## Idea
Make Lorebound a locally played, single-user, offline-capable storytelling application without account registration or multiplayer, available for Windows, macOS and Linux.

## Why this idea matters
A straightforward, self-contained player experience that keeps the necessary storytelling and gameplay features together, without mandatory online services or central identity infrastructure.

## Accepted direction
- **Single-user and local-first:** Lorebound is a personal storytelling game/application. No mandatory Lorebound account registration, sign-in, application-level user profiles or multiplayer infrastructure.
- **Offline-capable without mandatory AI configuration (explicitly accepted):** Lorebound starts and remains usable for all locally supported **non-AI operations**, whether or not any AI provider or model is configured, reachable or currently usable. The user may create/resume and manually edit saved adventures, inspect/edit the Lorebook and world records where supported, and use database-backed manual workflows without an AI connection. **AI API requests alone depend on provider availability**: if configured, attempt the call normally; if nothing usable is configured, clearly explain the missing configuration and link/guide the user to provider setup. When application assets and a usable local model/runtime have been installed and configured, AI-assisted play can also work without internet; cloud AI remains optional.
- **Cross-platform local application:** Provide an executable on **Windows, macOS and Linux** that launches the **headless Wails v3 localhost Go server** and opens Lorebound in the normal browser, not a native WebView. Packaging and local-model onboarding belong to IDEA-0053.
- **Multiple independent adventures:** Let a player create and resume separate saved adventures whose canonical histories and world state do not leak across one another. This idea intentionally does **not** mandate browser-local storage, a particular database or a specific persistence engine. Evaluate storage in [[Browser-Persistent Story Database]] (IDEA-0051).
- **No built-in multi-user profiles initially:** Rely on OS/browser profiles for basic local-user separation rather than introducing application accounts. Local storage by itself is not a security boundary between people sharing an OS/browser profile.
- **Selected runtime dependency:** IDEA-0053 supersedes Tauri, native Wails windows and separate npm player hosting with a single headless Go server + normal browser. No embedded inference runtime is approved.

## Proposed behaviour
On a supported desktop operating system, a player opens Lorebound, selects or creates an adventure and accesses the supported storytelling/gameplay features through a unified interface without a Lorebound account. Adventures persist independently in a storage implementation selected through the runtime and persistence architecture. When application assets and a compatible local model/runtime are already available, play continues without internet access. Cloud model connections remain optional.

## Alternatives and trade-offs
- Browser-only storage was part of this idea's original staging acceptance, but the requesting user later explicitly removed it as a requirement here. Canonical persistent data is now Go-managed filesystem SQLite (IDEA-0051).
- Built-in local multi-user profiles remain **excluded from the initial accepted scope**; OS or browser profiles can provide basic separation. Revisit as a separate idea if required.
- Integrated player experience does not itself settle whether a model runtime is packaged within Lorebound or installed separately. That practical onboarding choice belongs to runtime/model refinement, not to the account-free requirement.

## Open questions
- If stronger local story privacy is later needed on a shared device, should it use OS/browser profiles only or a separately proposed optional feature?
- How should the first-run local-model experience meet the integrated, offline-capable product goal? Resolve packaging and runtime management under IDEA-0053/IDEA-0013 and any separately approved optional model-manager proposal.

## AI absence and API failure are nonblocking (2026-10-18 acceptance)
- **The app/library are never gated on a successful AI connection:** Launch the Wails headless application, enter the ordinary browser UI and use locally supported manual workflows **even with zero configured profiles, an offline/disconnected local model server, invalid cloud credentials, or a temporarily unavailable provider**. Do not require a successful setup wizard, automatic model download or an AI handshake before showing the adventure library.
- **Only AI-dependent operations need an AI call:** Request AI generation/continuation, a provider-powered interpretation, an explicitly requested AI-generated starting Lorebook, or other model-powered tasks through the configured adapter when requested and when appropriate for that workflow. Keep basic adventure library management, manual prose entry/editing, Lorebook entry/character editing, settings, backups and database persistence independently operable. Do not silently disable non-AI operations because one configured model is unreachable.
- **No usable model configured:** For an AI-specific action, show a clear, contextual explanation and a direct route to the existing **Provider Connection Profiles and Discovery** settings (IDEA-0014), for creating/selecting a local or cloud profile and supported model. Do not pretend an AI generation ran, invent output or require the user to abandon their saved draft.
- **A configured model is attempted, not presumed available:** If a suitable profile/model is configured, **try the actual AI API call**. The adapter handles normal failures (unreachable server, CORS/transport problem, missing/invalid credentials, unsupported/missing model, provider/quota errors, timeouts, interrupted streams). Report actionable feedback and allow the user to reconfigure and retry. Do not block the whole app in advance solely because the profile has not been recently tested or a speculative health check failed.
- **No partial canon on API errors:** Where an AI task would generate a narrative turn or propose structured world changes, a failed/unusable/incomplete request cannot commit any partial canonical prose, events or world state. Preserve the last accepted history and the player's autosaved draft for retry (IDEA-0005/0019). The fact that an optional automatic extractor cannot run must not make opening a blank, AI-free Custom Opening impossible; exact fallback for player-authored prose fact extraction is separately refined under IDEA-0006/0045.
- **Offline distinction:** **Without internet** does not imply **without AI** if a configured external local model server is available on loopback/LAN. Conversely, a cloud profile can be configured but offline; its API request fails gracefully while the rest of the app remains usable.
- **No new architecture:** Maintain the accepted Wails v3 headless Go server and static normal-browser UI (IDEA-0053), shared Go SQLite persistence (IDEA-0051), frontend TypeScript adapters, and credential protection. This acceptance does not add built-in model inference, compulsory downloads, background provider monitoring or an automatically chosen fallback provider.

## Dependencies and constraints
- IDEA-0053 now selects **Wails v3 headless localhost Go server only**, with the SvelteKit/TypeScript UI and gameplay logic in the normal browser; IDEA-0051 now selects **Go-managed filesystem SQLite** for canonical adventures. IDEA-0001 establishes account-free/offline requirements but does not independently prescribe these implementation choices.
- IDEA-0013 specifies local-model connectivity. The app must be usable offline once installed with local assets and a functioning compatible model, but bundling/downloading/running models inside the application is not approved by this idea.
- Remote model accounts/API keys belong to their providers; **no Lorebound login** does not mean third-party API credentials are unnecessary when cloud models are chosen.
- Offline capability must not silently rely on remote authentication, CDN assets, remote calls or online inference during normal local gameplay.
- Account-free local saves are not automatically private from other users of the same OS/browser profile.

## Draft acceptance criteria
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- The direction is accepted for **staging/refinement**. The 2026-10-17 refinement confirms offline-capable local play on Windows/macOS/Linux and intentionally removes browser-only persistence from this idea. Runtime-specific details remain for related ideas. No production approval or implemented functionality is claimed.

## Decisions and review history
- 2026-10-18 — **Explicit user selection of Option A, clarified:** Lorebound does **not** require any AI configuration or working connection to launch or use manual adventure/Lorebook/database features. **Only calls requiring an AI API** depend on provider availability: if a suitable model is configured, **attempt the call** and handle real errors; if none is configured, **indicate this clearly and guide the player to connection/model setup**. Failed AI operations cannot damage accepted story/world state or lock out unrelated functions. Separate local-offline model support remains as previously accepted. No implementation/production approval.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-17 — **Cross-reference alignment:** Follow-on accepted runtime/storage refinements selected Wails v3 desktop/headless, browser-side TypeScript game logic and filesystem SQLite behind Go services (IDEA-0053/0051). Account-free and offline-first scope stays unchanged. The earlier 2026-10-17 decision not to impose browser-local storage from IDEA-0001 remains intact.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Accepted for staging by the requesting user:** Single-player, localhost-first experience with no registration, application accounts, or multiplayer. Adventures stored independently in local browser storage; offline usage should be supported when using a local LLM. Exclude built-in local multi-user profiles from the initial scope. This is acceptance for refinement, **not** approval for production or a claim of implementation.
- 2026-10-17 — **Explicit refinement accepted by the requesting user:** Keep Lorebound a locally played, single-user, account-free game/application that can be played without internet if desired, with all necessary player-facing features in one simple app on **macOS, Linux and Windows**. **Remove browser-local persistence as a requirement of IDEA-0001**; storage choices belong to separate architecture refinement. This approves this idea's refined direction only, not staging-to-production promotion, a particular local-model packaging choice or implementation.
