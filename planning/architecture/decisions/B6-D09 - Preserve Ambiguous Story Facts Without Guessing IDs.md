---
type: architecture-decision
status: accepted
decision_id: "B6-D09"
phase: "B6"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
  - architecture-decision
---

# B6-D09 — Commit resolved assertions; do not guess ambiguous story references

## Approval and provenance

**Explicit user approval, 2026-10-31:** “Review B6 Batch 3: B6-D08: A; B6-D09: A; B6-D10: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history, then assess B6 design closure.”

This records **B6-D09 Option A**, not D08/D10 or any future B6 decision. The [B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md) preserves the offered A/B/C alternatives. No formal closure or software implementation is approved.

## Context

[B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) already establishes that natural-language narration is mapped to engine-owned stable IDs in a separate identity layer, **never by trusting a narrator-generated internal ID**. Two brass keys may have the same display name, and accepted fiction might not tell us which key moved or whether a vaguely phrased claim establishes a new state.

A strict all-or-nothing event extractor that blocks story canon until every mention is uniquely bound would turn world tracking into an unwanted simulation/validation gate ([B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)).

## Accepted decision — Option A

**Accept the otherwise valid narrative passage and commit only the grounded state assertions whose targets and effects have been resolved unambiguously; preserve ambiguous candidate assertions as unresolved, noncanonical interpretation results rather than guessing or writing false canonical events.**

- **No arbitrary binding:** If two known brass keys could be the referent of “the key,” do not silently select the first matching ID, clone a new item, invent a holder, or use model confidence alone as a canonical identity. Use scene context, aliases, previously established possession/relationships and exact accepted prose to resolve what can be resolved.
- **Individual uncertainty isolation:** An unresolved candidate does not become a canonical typed event, and must not contaminate the projection for unrelated entities. Grounded, representable, unambiguously resolved facts **can** become accepted typed events from the same passage, in the existing coherent commit operation. This does **not** authorise partially persisting a single malformed or internally inconsistent event: all actual canonical writes remain atomic.
- **Narrative still stands:** Ambiguity, contradictory fictional descriptions or unknown referents do **not** by themselves prevent acceptance of otherwise valid prose. The tracker may temporarily represent **less** than the narrator said; that is preferable to asserting an invented identity or fact. Later explicitly committed player corrections may supply missing clarity.
- **Conflicting claims:** Where accepted text genuinely provides an unambiguous temporal sequence, normal event order can resolve later assertions as the current value. If the referent or factual outcome remains genuinely indeterminate, do not impose an arbitrary last-token or first-ID rule to manufacture one. Exact contradiction detection and display are deferred.
- **No hidden pending-commit gate:** An unresolved extraction is **not itself a prepared manual player correction**; it does not automatically trigger the chat-composer blocking overlay or require the player to approve every story fact. Existing Quick Start auto-commit, custom opening approval and pending *manual change* workflows remain governed by their previously accepted ADRs.
- **Format and IDs:** Real canonical event records still require supported typed identity/format and deterministic replay. Unknown candidate references must not be committed as malformed required-core events, bypass [B2-D08](./B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md), or leak raw stable IDs into narrator prompts.
- **Optional feedback:** An unobtrusive indication that a particular structured detail remains unresolved may help the player, but no exact prompt or disambiguation UX is selected by this decision. No compulsory extra LLM request is introduced.

## Alternatives considered

1. **A — accepted:** Commit resolved grounded facts; keep ambiguous candidates out of canon; prose remains valid. Limited world-memory coverage is preferable to a wrong identity.
2. **B — rejected:** Pick the first matching entity or arbitrary interpretation, silently storing possibly false state.
3. **C — rejected:** Reject the entire readable story until every item/reference is resolved, interrupting narration for uncertain interpretation.

## Deferred contracts

Explicit ambiguity representation (ephemeral vs persisted noncanonical interpretation hints), how to expose uncertainty in a read-only UI, true conflicting claims in one passage, optional manual disambiguation steps, interpreter-to-commit result types and source-span indexing. No mandatory new AI pass, code or tests are implied.

## Traceability

[B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md), [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B5-D08](./B5-D08%20-%20Narrative%20Only%20Unsupported%20Opening%20Facts.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md). Owners S04/S05/S06/S09/S10/S11/S12.

## Decision history

- **2026-10-29:** User accepted B6-D04 narrator-safe identity resolution and “do not guess” rule; handling of remaining per-event ambiguity was still open.
- **2026-10-31 — Unapproved D09 proposals:** A commit resolved facts but leave ambiguous individual candidates unresolved (recommended), B arbitrary binding, C reject entire passage.
- **2026-10-31 — Explicit selection:** User accepted **B6-D09 A** alongside separate D08 A and D10 A decisions. This refines ambiguity handling but does not approve a new mandatory player prompt or formally close B6.
