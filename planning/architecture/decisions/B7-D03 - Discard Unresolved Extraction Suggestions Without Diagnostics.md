---
type: architecture-decision
status: accepted
decision_id: "B7-D03"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B7 Batch 1 Option C approval)"
tags:
  - planning/architecture
  - pass-b
  - interpretation
  - architecture-decision
---

# B7-D03 — Discard unresolved interpretation suggestions without user-facing diagnostics

## Approval and provenance

**Explicit 2026-10-31 user selection:** “Review B7 Batch 1: B7-D01: A; B7-D02: A; B7-D03: C. Record only explicitly accepted choices as Lorebound GitHub ADRs, preserve approval history, and continue B7.”

The user explicitly selected **Option C, not the previously recommended Option A**. This ADR accepts the simplest **noncanonical ambiguity-candidate lifecycle**. Original A/B/C options are retained in the [B7 review](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md) without converting Option A's recommendation into an approval.

## Inherited constraints

[B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) already prohibits guessing an entity ID or presenting raw IDs to the narrator. [B6-D09](./B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md) accepts otherwise valid prose and only unambiguously grounded structured assertions, keeping unresolved candidates **out of canonical history**. The older B6-D09 discussion left optional diagnostics and their retention as an undecided follow-up. B7-D03 **supersedes that optional diagnostic proposal** for unresolved automatic extraction candidates, not the non-guessing or source-grounding constraints.

## Accepted decision — Option C

**When an automatic interpretation proposes a state change but cannot unambiguously ground its entity target or factual meaning, omit the candidate from the canonical accepted event batch and discard that candidate as soon as resolution fails. Do not save, retain, display, flag, or otherwise surface a dedicated unresolved-extraction hint to the player.**

- **No persistent/transient candidate backlog:** Do not put ambiguous candidates in canonical events, pending manual changes, SQLite diagnostics, a session-local unresolved suggestions list, a future reprocessing queue, or UI notifications. The candidate is simply not accepted as a world-state fact.
- **No extra user interruption:** Ambiguous extraction does not trigger an approval overlay, clarification prompt, warning badge, toast or compulsory separate model request. The valid story passage and **other grounded, resolved assertions** follow their existing atomic commit workflow.
- **Do not guess to avoid discarding:** Do not bind one of two identically named brass keys arbitrarily, infer missing fictional facts or invent entity IDs merely to keep a fuller event list. The resulting world tracker can legitimately know less than the accepted narrative.
- **Player-driven correction remains possible:** If a player later edits inventory/status/Lorebook to express the intended fact, it follows the already accepted explicit pending manual Commit. The application does not secretly preserve an unresolved extraction candidate as a draft.
- **No retrospectively derived events:** Later narration or a manual correction may provide new accepted facts in normal chronological order; do not automatically go back to re-interpret or backfill earlier discarded suggestions. Historical Undo/Fork still process only committed current events/passage bodies.
- **Strict technical error boundary preserved:** **Silent discard applies only to genuinely uncertain optional interpretation candidates.** It does **not** authorise swallowing malformed required-core event records, a failed canonical database transaction, unsupported required event version/schema, invalid migration, explicit player-edit validation failure, or provider/pipeline error. Those remain subject to existing fail-safe behaviour and actionable reporting. It also does not delete legitimate committed state/prose.
- **Narration prompt privacy:** Stable IDs remain internal and are never exposed to prose-producing model prompts. The decision does not select a new model routing policy or require extra LLM passes.

## Alternatives and trade-offs

- **A — not accepted:** Keep ambiguous candidates transiently and optionally show unobtrusive diagnostics. More transparency, but unwanted retained/unresolved suggestion complexity.
- **B — not accepted:** Store noncanonical unresolved suggestions in separate SQLite diagnostics for later inspection. Persistent retention and pruning burden.
- **C — accepted:** **Immediately discard ambiguous automatic interpretation candidates without notification or later inspection.** Simplifies narration flow, at the cost of lower visibility into untracked details.

## Scope boundary and deferred engineering

The precise internal implementation of a *temporary* candidate during evaluation, the runtime result type for successful vs unresolved proposed assertions, identity resolution algorithms and real integration tests remain engineering questions. “Discard immediately” means **nothing is retained or surfaced once the candidate is determined unresolved**, not that a parser is forbidden to hold a value while checking it. Player-authored pending manual changes are not automatic ambiguous candidates and must not be silently dropped under this rule.

## Decision history

- **2026-10-29:** B6-D04 forbade arbitrary stable-ID guessing, while leaving optional ambiguity feedback undecided.
- **2026-10-31:** B6-D09 accepted canonical facts-only handling; its optional diagnostic suggestion remained open.
- **2026-10-31 — B7 Batch 1 proposed:** A session-transient optional diagnostics (recommended), B optional persisted diagnostics, C silent discard without a hint.
- **2026-10-31 — Explicit acceptance:** User selected **B7-D03 C**, expressly overriding the suggested A. D01 A and D02 A were separate approvals. No implementation, stage promotion or B7 closure approved.
