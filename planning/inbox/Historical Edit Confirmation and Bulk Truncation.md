---
id: "IDEA-0041"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Story Editing and Event Timeline Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Historical Edit Confirmation and Bulk Truncation

## Idea
Delay expensive reconstruction until the player confirms whether later turns remain or are discarded.

## Why consider it?
No AI calls should be wasted rebuilding soon-to-be-deleted history.

## Rough behaviour
Draft older edits; offer Keep Later Turns, Delete All After Point, Continue Editing and Discard.

## Variations and alternatives
Do not introduce automatic downstream prose regeneration or contradiction-flagging in this version.

## Open questions and risks
- How should players recover after accidental truncation?

## Evaluation notes
- Origin: **user**. User-requested direction; exact mechanics remain to be reviewed.
- This note is not an implementation specification or an accepted project decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
