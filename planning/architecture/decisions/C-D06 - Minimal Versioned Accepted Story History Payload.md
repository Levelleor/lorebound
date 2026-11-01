---
type: architecture-decision
status: accepted
decision_id: "C-D06"
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit Pass C Batch 2 choice)"
---

# C-D06 — Minimal versioned accepted story history

## Explicit user approval

User selected **C-D04 A, C-D05 C, C-D06 A** and required recording only accepted choices, preservation of staging/architecture history, no implementation or promotion, and continuation in batches of three.

**ACCEPTED: A.** For the first complete story-turn slice preserve stable adventure identity, accepted passage/turn identity and ordering, accepted story prose, a minimal typed current-event/source envelope and technical version metadata sufficient for deterministic replay and refetch. An empty supported world-effect batch is valid if prose establishes no trackable world fact. Do not fabricate map, character or inventory facts to populate an empty batch. Technical atomic acceptance remains with Go; TypeScript owns deterministic reconstruction. Exact serialized fields, event schema implementation and migrations are future slice refinements. Under C-D05 C these story-loop mock/domain acceptance criteria are **scope guidance, not finalised for execution until the real Wails/SQLite integration prerequisite has been met**.

## Alternatives and chronological authority

B demanded complete character/item/map/lore schemas in the first turn, and C unversioned prose only; neither was selected.

The original Batch 2 proposal text and earlier Batch 1 decisions remain in [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md). This decision neither promotes any of the 52 accepted staging ideas nor creates implemented specs, code or test evidence. B9-D12 spatial migrations remain deferred without work.
