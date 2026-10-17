---
id: "IDEA-0001"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-17"
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
- **Fully optional internet access for play:** After required application assets and a usable local model/runtime have been installed and configured, a player can use the application and its locally supported gameplay features without any active internet connection. A cloud AI provider is optional, not required for local play.
- **Desktop cross-platform goal:** Provide an approachable, integrated application experience on **Windows, macOS and Linux**. Players should be able to access storytelling and gameplay features from one coherent app rather than piecing together unrelated web services. Delivery/package and local-model onboarding details belong to [[Localhost Startup and Offline Mode]] (IDEA-0053) and related provider/runtime ideas.
- **Multiple independent adventures:** Let a player create and resume separate saved adventures whose canonical histories and world state do not leak across one another. This idea intentionally does **not** mandate browser-local storage, a particular database or a specific persistence engine. Evaluate storage in [[Browser-Persistent Story Database]] (IDEA-0051).
- **No built-in multi-user profiles initially:** Rely on OS/browser profiles for basic local-user separation rather than introducing application accounts. Local storage by itself is not a security boundary between people sharing an OS/browser profile.
- **Keep runtime boundaries open:** This idea sets product-level requirements and does not alter the separately accepted Tauri desktop + SvelteKit/localhost direction or decide whether Lorebound bundles/downloads/manages a local inference runtime.

## Proposed behaviour
On a supported desktop operating system, a player opens Lorebound, selects or creates an adventure and accesses the supported storytelling/gameplay features through a unified interface without a Lorebound account. Adventures persist independently in a storage implementation selected through the runtime and persistence architecture. When application assets and a compatible local model/runtime are already available, play continues without internet access. Cloud model connections remain optional.

## Alternatives and trade-offs
- Browser-only storage was part of this idea's original staging acceptance, but the requesting user later explicitly removed it as a requirement here. Native desktop, browser-local or local-server persistence remain possible pending IDEA-0051 refinement.
- Built-in local multi-user profiles remain **excluded from the initial accepted scope**; OS or browser profiles can provide basic separation. Revisit as a separate idea if required.
- Integrated player experience does not itself settle whether a model runtime is packaged within Lorebound or installed separately. That practical onboarding choice belongs to runtime/model refinement, not to the account-free requirement.

## Open questions
- If stronger local story privacy is later needed on a shared device, should it use OS/browser profiles only or a separately proposed optional feature?
- How should the first-run local-model experience meet the integrated, offline-capable product goal? Resolve packaging and runtime management under IDEA-0053/IDEA-0013 and any separately approved optional model-manager proposal.

## Dependencies and constraints
- IDEA-0053 defines desktop packaging and SvelteKit/localhost runtime support; IDEA-0051 determines persistence architecture. This idea does not choose a browser or database as the canonical storage location.
- IDEA-0013 specifies local-model connectivity. The app must be usable offline once installed with local assets and a functioning compatible model, but bundling/downloading/running models inside the application is not approved by this idea.
- Remote model accounts/API keys belong to their providers; **no Lorebound login** does not mean third-party API credentials are unnecessary when cloud models are chosen.
- Offline capability must not silently rely on remote authentication, CDN assets, remote calls or online inference during normal local gameplay.
- Account-free local saves are not automatically private from other users of the same OS/browser profile.

## Draft acceptance criteria
- [ ] Lorebound can be launched as the supported desktop application on Windows, macOS and Linux without Lorebound registration or sign-in (specific release/install mechanics are verified under IDEA-0053).
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
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Accepted for staging by the requesting user:** Single-player, localhost-first experience with no registration, application accounts, or multiplayer. Adventures stored independently in local browser storage; offline usage should be supported when using a local LLM. Exclude built-in local multi-user profiles from the initial scope. This is acceptance for refinement, **not** approval for production or a claim of implementation.
- 2026-10-17 — **Explicit refinement accepted by the requesting user:** Keep Lorebound a locally played, single-user, account-free game/application that can be played without internet if desired, with all necessary player-facing features in one simple app on **macOS, Linux and Windows**. **Remove browser-local persistence as a requirement of IDEA-0001**; storage choices belong to separate architecture refinement. This approves this idea's refined direction only, not staging-to-production promotion, a particular local-model packaging choice or implementation.
