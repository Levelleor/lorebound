---
id: "IDEA-0060"
type: idea
status: candidate
origin: mixed
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Naming Licensing and Open Questions Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Project Licensing and Redistribution Policy

## Idea
Document and consistently apply **Lorebound's existing GNU General Public License version 3 (GPLv3)** to its source-code, local download and distribution workflows, rather than choosing a new proprietary, source-available or alternative open-source licence. The repository already has a root `LICENSE` containing the GPLv3 text, and GitHub identifies the repository licence as `gpl-3.0`. The user reaffirmed that Lorebound is an **open-source software project** and recalled having already selected GPLv3.

## Why consider it?
Local npm/source installation, a Tauri desktop application, possible additional Docker releases and third-party mods create practical questions about conveying and complying with the **existing** GPLv3 licence. The original candidate explored limiting unauthorised reuse and commercial redistribution, but **GPLv3 permits commercial use and redistribution under its conditions**; it cannot be used simultaneously with added general prohibitions on commercial or competing uses while still presenting the same covered software as GPLv3-licensed. The appropriate next step is to clarify documentation, compliance and separate asset/brand terms, not reopen the already made licence selection by default.

## Current repository fact (verified 2026-10-16)
- `LICENSE` at repository root contains the **GNU General Public License, Version 3, 29 June 2007** text.
- GitHub reports the repo licence as `GNU General Public License v3.0` with licence key `gpl-3.0` and SPDX-like identifier `GPL-3.0`.
- This verifies the existing license text and repository detection, **not** a reviewed determination of whether project-specific notices say `GPL-3.0-only` versus `GPL-3.0-or-later`. Check per-file or other notices before declaring that choice.
- This is a description of existing repository content, **not** a new human approval or a change to the licence file.

## Possible behaviour to refine
- Ensure README, contribution instructions, source downloads, official Tauri release packages and any eventual Docker images accurately identify the project licence and provide the corresponding required notices/source access for distribution.
- Clarify whether official branding, trademarks, images, assets, documentation and third-party content have separate usage terms, without purporting to revoke GPL permissions for GPL-covered code.
- Document the distinction between making compatible mods/plugins, distributing modifications to GPL-covered code, and incorporating or linking third-party components; obtain appropriate legal guidance for nuanced plugin/copyleft-boundary questions.
- Inventory dependencies, build outputs and optional AI models, which may each have their own licences and redistribution restrictions.
- Decide whether and how to communicate contribution licensing and attribution expectations, compatible with the existing GPLv3 terms.
- Keep the licence file unchanged unless a later explicit project decision and appropriate rights review require otherwise.

## Variations and alternatives
- **Continue with existing GPLv3 (current state):** Default and user-confirmed project direction. Maintains open-source freedoms, including commercial redistribution subject to its terms.
- **Different licences (historical brainstorm alternatives only):** GPL/AGPL comparison, all-rights-reserved, custom source-available permissions or reserving commercial reuse appeared in the original brainstorm and note. These are **not** current selections and should not be represented as parallel options without a new explicit reconsideration.
- If the project owner separately wants exclusive branding or asset permissions, explore appropriately scoped notices that do not contradict the GPLv3 licensing of covered software.

## Open questions and risks
- Which files and assets are intended to be GPLv3-covered, and which (if any) use separately documented terms?
- Are there project-specific notices clarifying `GPL-3.0-only` versus `GPL-3.0-or-later`? The existence of the GPLv3 licence text alone should not settle this nuance without checking the actual notices.
- What source distribution, licence inclusion and attribution procedures should accompany Tauri releases, npm/source distribution and any future Docker image?
- How should contributor rights and plugin distribution boundaries be described accurately, with legal review where warranted?
- Are dependencies, models, media and packaging components all compatible with intended redistribution?
- How should branding and official-project identity be distinguished from GPL-covered code rights?

## Evaluation notes
- Origin: **mixed**. The first candidate combined user objectives and speculative alternative licences.
- **User clarification (2026-10-16):** The user states this is an open-source software project and believes GPLv3 was already chosen. GitHub repository inspection confirms that a GPLv3 `LICENSE` file already exists and is detected by GitHub.
- This candidate is now about documenting and operationalising the **existing** licensing choice, **not** proposing a change or asking the user to choose GPLv3 again.
- This note remains an unaccepted Inbox candidate and is not a production-ready policy or legal opinion.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**, originally comparing GPL/AGPL, all-rights-reserved and source-available alternatives.
- 2026-10-16 — **User clarification, not an Inbox-to-staging acceptance:** "This is an oss project, I think I already went with gpl3." Inspected the repository and confirmed the root `LICENSE` contains GNU GPLv3 and GitHub detects `gpl-3.0`. Updated this candidate to respect the already established open-source GPLv3 choice. At that point the note was retained as a candidate pending explicit acceptance or skip, with no change to the existing licence.
- 2026-10-16 — **Skipped for now by the requesting user.** Lorebound is already an open-source GPLv3 project with a root `LICENSE`, so a separate licence-selection or redistribution-policy planning decision is unnecessary at this time. Keep the existing GPLv3 file **unchanged**, preserve this note and its original provenance in Inbox with `status: candidate` (neither accepted nor rejected), and proceed to IDEA-0061. Future release-notice, contributor, dependency or distribution-compliance questions may be revisited without reopening the existing GPLv3 selection.
