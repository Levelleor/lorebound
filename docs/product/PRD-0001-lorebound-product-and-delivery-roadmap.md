---
id: PRD-0001
type: prd
status: accepted
related:
- STORY-0002
- STORY-0003
- STORY-0004
- STORY-0005
- STORY-0006
- STORY-0007
- STORY-0008
- STORY-0009
- STORY-0010
- STORY-0032
- STORY-0033
- STORY-0034
- STORY-0035
- STORY-0036
- STORY-0037
- STORY-0001
- ADR-0122
- NOTE-0003
---

# Lorebound product and delivery roadmap

## Problem

Lorebound is a local, single-player, account-free workspace for a player to write an interactive story with AI assistance while keeping the story consistent across edits and long-running sessions. The player owns the narrative; optional mechanics support, not veto, accepted fiction.

## Goals

- Provide a complete Story loop first: review AI proposals, accept explicitly, persist ordered structured prose atomically, reopen and recover safely.
- Add provider/model settings and generation pipeline, Lorebook/context and memory, shared characters and state, semantic world map, library/backup/template lifecycle, and optional RPG capabilities in dependency order.
- Implement the approved Command Citadel look while keeping functional authority with accepted product and architecture records. Exclude unsupported demo behaviors and deferred spatial migrations.

## Acceptance criteria and roadmap

| Milestone | Scope and disposition at import |
| --- | --- |
| M0 | Real host/SQLite proof and initial browser validation: [STORY-0001](../work/items/STORY-0001-prove-the-production-host-and-sqlite-foundation.md). The disposable proof UI is no longer current. |
| M1 | Blank entry and bounded simulated Story-only, zero-effects loop verified in [STORY-0002](../work/items/STORY-0002-first-complete-accepted-story-mode-turn-in-real-host-sqlite.md); full opens, other modes, tracking and platform lifecycle remain later. |
| M2 | Retry/Undo/Fork/history editing and scoped recovery delivered; the broad [STORY-0003](../work/items/STORY-0003-retry-drafts-undo-fork-and-current-history-prose-editing.md) scope remains partial. |
| M3 | Browser-side model adapters, profiles, narration/streaming, pipeline and interpretation: [STORY-0004](../work/items/STORY-0004-direct-browser-cloud-local-models-profiles-streaming-pipelines-a.md) partially delivered. No follow-up implementation authorized. |
| M4 | Lorebook, author notes, derived memory/context budget: [STORY-0005](../work/items/STORY-0005-lorebook-author-notes-context-budget-and-derived-memory.md). |
| M5 | Universal characters, Playing As, scenes, status, inventory and equipment: [STORY-0006](../work/items/STORY-0006-universal-characters-playing-as-status-anatomy-items-and-equipme.md). |
| M6 | Location grouping, routes, discovery and semantically scaled map: [STORY-0007](../work/items/STORY-0007-locations-containment-routes-discovery-simple-grounded-map.md). |
| M7 | Adventure library, templates and safe backup/restore: [STORY-0008](../work/items/STORY-0008-adventure-library-operations-templates-starting-world-and-backup.md). |
| M8 | Structured actions, optional mechanics, full visual/accessibility and release audit: [STORY-0009](../work/items/STORY-0009-structured-actions-optional-capabilities-full-command-citadel-ui.md) and [STORY-0010](../work/items/STORY-0010-end-to-end-product-verification-platform-release-audit-and-outst.md). |

Scope approval does not certify implementation. At the pinned source, 52 original feature scopes were accepted: 17 partial, 35 without merged feature-level evidence and none wholly verified. The legacy traceability inventory held 161 rows; only IDEA-0006/R01–R03 were formally certified. Preserve the atomic identifiers when evaluating remaining criteria. IDEA-0068 was accepted only for refinement; IDEA-0069 and the other captured candidates were not accepted. Each requirement below has its own record and scoped evidence.

[Pinned source architecture overview](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Lorebound%20-%20System%20Architecture%20Overview.md) · [Pinned source coverage snapshot](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/FEATURES.md)
