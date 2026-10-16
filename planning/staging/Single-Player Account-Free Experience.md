---
id: "IDEA-0001"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Lorebound Vision Brainstorm]]", "[[Gameplay Feature Catalogue Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Single-Player Account-Free Experience

## Idea
Make Lorebound a single-user local-first story application without account registration or multiplayer.

## Why this idea matters
Low-friction personal use without central identity infrastructure.

## Accepted direction
- Single-user, local-first storytelling application.
- No account registration, sign-in, application user accounts, or multiplayer functionality.
- Allow several independently saved adventures in browser-local storage.
- Support localhost use and offline play when a configured local model is available.
- Do not build separate multi-user profiles inside the app for the initial version. Use separate browser profiles when isolation is needed.

## Proposed behaviour
Store each adventure independently in the user's local browser. Open the local app and select, start or resume an adventure without any account flow. A configured local model can be used without depending on cloud access.

## Alternatives and trade-offs
Built-in local multi-user profiles are **excluded from the initial accepted scope**; browser profiles can provide separation. Revisit only as a separately approved future idea.

## Open questions
- If local story privacy is later needed on a shared device, should it use browser/OS profiles only or a separate optional feature?

## Dependencies and constraints
- Browser storage choice, save formats, backups, and any migration path are covered by related inbox candidates and still require refinement.
- Remote model accounts/API keys belong to their providers; **no application login** does not mean third-party API credentials are unnecessary.
- Offline play requires locally available application assets and an operational local model endpoint.
- Account-free local saves are not automatically private from other users of the same operating-system/browser profile.

## Draft acceptance criteria
- [ ] A user can launch Lorebound on localhost without registering or signing in.
- [ ] A user can create, save, close, reopen and resume more than one independent adventure.
- [ ] Two saved adventures do not share turns or world state unless deliberately imported or copied.
- [ ] With locally available application assets and a running local LLM endpoint, gameplay works without internet access.
- [ ] No account or multiplayer server is required for these flows.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- The direction is accepted for **staging/refinement**; details remain unrefined. No production approval or implemented functionality is claimed.

## Decisions and review history
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Accepted for staging by the requesting user:** Single-player, localhost-first experience with no registration, application accounts, or multiplayer. Adventures stored independently in local browser storage; offline usage should be supported when using a local LLM. Exclude built-in local multi-user profiles from the initial scope. This is acceptance for refinement, **not** approval for production or a claim of implementation.
