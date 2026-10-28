---
type: architecture-decision
status: accepted
decision_id: "B5-D09"
phase: "B5"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - initialization
  - architecture-decision
---

# B5-D09 — Resume valid blank adventures without automatic generation

## Approval and provenance

**Explicit approval, 2026-10-28:** “Review B5 Batch 3: B5-D07: A; B5-D08: A; B5-D09: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history, then assess B5 closure.”

This ADR records **B5-D09 Option A** from [B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). D07 and D08 have separate ADRs. The user asked only for a closure assessment, not formal approval of closure.

## Context

A valid independent adventure identity and minimal Turn-0 baseline may be durable before any narrative turn, under [B5-D01](./B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md). Blank Custom Opening, fully skippable Guided Setup, no mandated protagonist, and optional Quick Start or generated starting Lorebook are already accepted. Saved adventures must be resumable without forcing AI authoring or hiding intentionally blank stories.

## Accepted decision — Option A

**An adventure with a valid durable Turn-0 baseline and no committed narrative turns is an ordinary saved/resumable adventure. Reopen its current blank/partially configured state without generating a first story turn automatically.**

- **Visible and resumable:** List and open valid zero-turn adventures from the ordinary shared-library save/resume experience, including stories with an empty narrative, no starting characters, and no selected Playing As identity. Keep the existing stable adventure ID and optional default display title `Untitled Adventure`.
- **Restore available noncanonical work:** On reopen, retrieve supported saved Custom Opening and other pending drafts where applicable, keeping them distinct from current canon. In particular, a complete unapproved AI-generated starting Lorebook proposal follows [B5-D07](./B5-D07%20-%20Persistent%20Pending%20Generated%20Starting%20Lorebook.md) and the approved pending-commit chat overlay; an ordinary empty adventure is not automatically a pending commit.
- **No spontaneous generation:** Do not call AI, auto-create a Turn 1, invoke an unrequested Lorebook generator, create a default protagonist, auto-select Playing As, or force a multi-step setup wizard merely because the adventure is reopened. Quick Start and optional worldbuilding require their ordinary deliberate triggers.
- **Safe existing state:** Already accepted starting setup/Lorebook facts remain current and usable before any narrative turn; an empty Turn-0 world remains valid. No empty fake passage or first-turn events are manufactured to make a blank adventure appear complete.
- **Normal follow-on:** The player may begin writing a Custom Opening, explicitly trigger Quick Start with its required brief premise, choose optional Guided Setup, or request optional worldbuilding as supported. Normal cancellation, commit, draft and version rules apply.
- **Current-only durability:** Reopening reads current canonical baseline and current accepted events through the established Go/SQLite boundary; no older passage revisions or special browser-owned canonical save format.

## Alternatives and trade-offs

1. **A — accepted:** Reopen zero-turn adventure normally, with saved setup/drafts and no automatic generation. Straightforward save/resume and no mandatory model calls.
2. **B — rejected:** Automatically generate the first story turn on reopening; forces cost and unrequested canon.
3. **C — rejected:** Hide zero-turn adventures until a first turn exists; leaves valid saved drafts difficult to recover.

## Deferred implementation details

Exact library list empty-state labels, optional setup resumption UI, partially filled forms, pending overlays for different draft types, stale library epoch after restore and last-used view persistence remain engineering/UX refinements. No executable product capability, stage promotion, or release approval is implied.

## Traceability

[B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [B5-D01](./B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md), [B5-D03](./B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md), [B5-D06](./B5-D06%20-%20Explicit%20Commit%20of%20Player%20Authored%20Custom%20Opening.md), [B5-D07](./B5-D07%20-%20Persistent%20Pending%20Generated%20Starting%20Lorebook.md), [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md). Owners S02/S03/S04/S05/S12.

## Decision history

- **2026-10-28 — Originally proposed:** A normal zero-turn adventure reopening (recommended), B forced first-turn AI generation, C hide until play begins. All initially unapproved.
- **2026-10-28 — Explicit acceptance:** User selected **B5-D09 A**, separately from B5-D07 A and B5-D08 A. No B5 design closure or implementation was approved.
