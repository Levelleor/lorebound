---
type: brainstorm
status: active
mode: autonomous
topic: "Project name, licensing considerations and cross-cutting decisions"
goal: "Preserve naming candidates, code-licensing distinctions and unanswered product questions."
created: 2026-10-16
updated: 2026-10-16
sources: []
outputs: []
tags:
  - planning/brainstorm
  - planning/meta
---
# Naming Licensing and Open Questions Brainstorm

## Goal
Preserve naming candidates, code-licensing distinctions and unanswered product questions.

## Context
- Retrospective record of the discussion on 2026-10-16, not implemented functionality or an approved production specification.
- [[Lorebound Vision Brainstorm]] contains the overview. User directions and AI suggestions are distinguished below.


## Naming brainstorm
Candidate app names discussed:
- **Lorebound** — living memory/lore binding world and narrative; the GitHub repository is named `lorebound`.
- Storyloom, Aetherforge, Narralis, Fablecore, Worldweaver, Everlore, Mythos, Lorecraft, Taleform, Chronicle, Worldseed.
- Technical alternatives: NarrativeOS, LoreEngine, MythicCore, StoryKernel, RealmKit, Loreframe, Worldstate, Plotline, TaleStack, Narrative Forge.
- Atmospheric alternatives: Eidolon, Aetheryn, Veyra, Aevum, Novera, Evershade, Mythweald, Inkbound, Fablehaven, Talehaven.
- Suggested split: Lorebound as playable product and Fablecore as underlying engine, **not explicitly accepted as product strategy**.
- Names have not been checked for trademark/domain conflicts.

## GitHub licences discussed
**User concern:** prevent others from 'stealing' or commercialising the software.
- GitHub defaults described: MIT, Apache 2.0, BSD 2/3-Clause, ISC, Boost (permissive); GPLv3, AGPLv3, LGPLv3, MPL 2.0, EPL 2.0 (various forms of copyleft); CC0/Unlicense (near-public-domain dedication).
- **All Rights Reserved/no software licence:** copyright restrictions remain; users do not automatically receive permission to redistribute/modify. Conflicts with an easy downloadable, customisable community-facing project unless explicit separate permissions are granted.
- **GPLv3:** commercial forks are still allowed, subject to applicable copyleft source-sharing requirements.
- **AGPLv3:** extends source obligations to qualifying network-based interactions with modified versions, but still allows commercial use.
- **PolyForm Shield/Noncommercial:** examples of source-available (not OSI open-source) alternatives with competition or commercial-use restrictions; these may not be default GitHub licence picker choices.
- Public browser-delivered JS is inspectable; licensing is a legal permission structure, not technical copy prevention.
- **No licence was chosen in this conversation.** Verify any existing repository LICENSE separately before changing it.

## Cross-cutting architectural questions
1. Choose default narrator/state-interpreter pipeline: one-pass JSON+prose, plan-before-narrate, extract-after-narrate, or strict audit.
2. Decide what 'state truth' means for incidental details not tracked by a module.
3. Set boundaries on validation-repair loop, error UI, and commit of failed attempts.
4. Determine hierarchical location exit/entry semantics and one-edge/multi-hop travel.
5. Set the persistence stack, origin/port, backups and credential strategy.
6. Define minimum capability API and event schema before writing many mods.
7. Decide how to recover after older-history edits without costly regeneration, while honouring manual fixes.
8. Plan local-model structured-output fallback and latency expectations.
9. Define optional mature content/anatomy settings and fields.
10. Pick licence permitting desired local user freedoms while retaining desired protection.
11. Decide whether users may share custom scripts/plugins, and if so how those are installed and permissioned, without building community functionality into app.
12. Assess how provider settings and token limits will be tracked as models change.

## Research and testing possibilities
- Benchmarks across one affordable local RP model and one cloud model for event extraction correctness.
- Impossible pickup: overweight container; narrator must describe failure or adjust without corrupting state.
- Impossible travel: disconnected castle; narrator must not commit teleportation.
- NPC in another city: may be mentioned but not enter dialogue in current room.
- Earlier edit plus truncate future: no downstream repair calls.
- Historical replay with external MCP: must not re-trigger external side effects.
- Many long adventures in browser storage, backup/restore and storage quota handling.
- Anatomical transformation and removal of equipment-bearing body part.


## Session Log
- 2026-10-16 — **User request:** Suggested creative and engine-oriented project names.
- 2026-10-16 — **AI possibility:** Lorebound name and separate engine name Fablecore.
- 2026-10-16 — **User request:** Compared proprietary, source-available and GitHub default licences because of concern about others copying work.
- 2026-10-16 — **Question:** No licence selection was confirmed; no business model or fork policy fixed.

## Current Threads
- Choose product/engine naming conventions and check conflicts.
- Select licence only after defining allowed downloading, personal modification, redistribution and commercial use.
- Resolve core pipeline/persistence and plugin trust trade-offs.

## Decisions
- The repository is named Lorebound.
- No licence or split between app and engine is recorded as explicitly chosen during the discussion.

## Outputs
- None. Nothing promoted to staging or production.

## Resume Here
Confirm target licence and ownership policy separately. For product design, follow [[Lorebound Vision Brainstorm]] and the specialised notes; nothing is promoted.
