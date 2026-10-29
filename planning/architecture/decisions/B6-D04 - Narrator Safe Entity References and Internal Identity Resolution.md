---
type: architecture-decision
status: accepted
decision_id: "B6-D04"
phase: "B6"
created: "2026-10-29"
updated: "2026-10-29"
approved_at: "2026-10-29"
approved_by: "requesting user (explicit request to record preceding proposed design)"
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
  - architecture-decision
  - entity-identity
---

# B6-D04 — Natural-language narration, internal stable IDs and role-isolated reference resolution

## Approval and provenance

On **2026-10-29** the user asked whether internal stable IDs given to the same model could leak into the primary roleplay passage. The assistant recommended (a) **no internal entity IDs in the narrator's prompt/story context**, (b) normal names/descriptions in narration, (c) internal resolution of narrative references to stable IDs, (d) identifier mappings only in an internal interpretation/resolution stage, and (e) ambiguity left unresolved instead of guessed or treated as a story-breaking error. The assistant explicitly proposed recording this as the next B6 identity-resolution decision, noting it was not yet approved.

The user replied **“ok, could you record some of these findings where relevant? I'd like to remember these so we don't deviate from this path in the future.”** This is explicit consent to **record the preceding direction**. This ADR accepts the **identity/narration boundary**, not an unrequested fixed number of model passes, a new mandatory AI role, a specific disambiguation UI, or approval of the still-unreviewed B6-D02/D03 alternatives.

## Purpose

Lorebound is a **narrative-first world-memory engine** ([B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)). A stable ID distinguishes two otherwise identically named items or follows one character through a rename, but that database identity is **internal implementation metadata, not a fictional name or part of the roleplay prose**.

Giving a narrator a prompt such as “Mara carries Brass Key (item_42)” creates an avoidable risk that the model will print `item_42` in its passage. Merely telling the narrator “don't print IDs” is not a sufficient architectural boundary.

## Accepted design direction

1. **Narration-facing context is ID-free:** The narrator receives only **human-readable names, descriptions, relationships and story/world facts**. Strip internal stable entity IDs, raw mapping tables, database primary keys, canonical operation IDs and technical reference tokens from **all context sections exposed to a prose-generating stage** (retrieval, Lorebook, recent scene, summaries, tools and metadata). This requirement applies to any role/stage that could emit the roleplay passage, not just a UI filter. Human-authored fictional codes/names that resemble an identifier remain valid prose; avoid incorrectly censoring creative text.
2. **Identity belongs to the engine:** Lorebound's TypeScript identity/resolution layer manages stable item/character/location IDs and their associations. The AI is free to use natural references (“Mara's brass key”, “the silver blade”, “the wooden chest”). Do **not** require the narrator to invent, remember, or copy database IDs. Canonical assertion events ultimately contain engine-resolved IDs for deterministic replay.
3. **Separate interpretation context when IDs are useful:** A **non-narrating internal resolution/interpretation request** may receive a restricted candidate ID↔name/alias/scene mapping to disambiguate references **after** prose is drafted. Its structured output is **never spliced into prose**. If one selected model handles both roles, calls must have **separately assembled task-appropriate prompt contexts**; do not carry private ID mapping text from interpretation into a later narrator request or shared model conversation/history. There is **no mandatory second model** and no new permanently loaded process.
4. **Single-pass remains supported:** The already approved one-pass prose+events strategy must **not** be removed. In a combined request that can emit narration, the model may propose **natural-language reference descriptions/aliases** as provisional structured outputs, without internal database IDs; engine-side resolution binds IDs afterward. Internal identifiers must not be included in that combined model-facing prompt merely to simplify the event JSON.
5. **Resolve with context, not names alone:** Use the accepted prose plus **scene, possession, nearby entities, aliases, known relationships and stable current entity records** to find the correct referent. Two objects called “Brass Key” can have distinct stable IDs. A renamed object keeps its identity. Where deterministic non-LLM resolution is sufficient, do not make an extra model call solely for IDs; when it is insufficient, an optional distinct interpretation stage may help narrow candidates, but **the engine owns the final binding**.
6. **New entities receive system-generated identities:** When accepted prose clearly **introduces a new trackable entity** (e.g., a blue crystal) rather than referring to an existing one, the engine allocates its stable ID within the prepared coherent acceptance workflow. The model does not allocate canonical database IDs. Preserve unknown/unwritten fields rather than inventing attributes; a later fact may establish a sparse identity under B6-D01.
7. **Ambiguity is not an excuse to invent:** If “she drops the key” could mean two tracked keys and context does not resolve which, **do not arbitrarily bind either ID** or create a duplicate just to make event extraction succeed. Preserve the fictional passage; mark that particular structured assertion as **unresolved/not committed** until resolution or later explicit player correction, subject to existing technical atomicity and required-core format rules. This is a reference-resolution uncertainty, not a mechanically illegal story event. Exact player-facing disambiguation/review UX is deferred.
8. **Keep existing commit boundaries:** Automatic acceptance of a validated Quick Start opening, explicit pending manual-correction Commit/full composer overlay, Custom Opening/AI-starting-world approval, atomic Go/SQLite transaction, expected adventure version/epoch and idempotent receipts are unchanged. Do not introduce a new universal “Approve entity identity” step or re-run AI to reinterpret old accepted narrative turns.

## Illustrative flow

- Narrator context: “Mara carries a brass key. A wooden chest is nearby.” **No `item_42`/database identifiers.**
- Prose: “Mara places the brass key inside the wooden chest.”
- Internal resolver: identify Mara's known brass key `item_42` and nearby chest `container_12` using engine-side IDs.
- Accepted outcome assertion: `SetItemHolder(item_42, container_12)`. Prose stays natural; the ID mapping remains internal.

## Alternatives and boundary rationale

- **Accepted:** Task-isolated narrator-safe context and internal ID resolution. Minimises model leakage and supports stable tracking across names/aliases.
- **Not selected:** Expose raw stable IDs in narrator context and rely on the instruction “never include IDs.” A prompt instruction does not guarantee they won't appear in prose.
- **Not selected:** Give all entity identity generation and disambiguation authority to the narrator, or use name string alone as a unique key.
- **Not decided:** Mandatory two-pass generation, always using AI for identity matching, special prompts, model temperature, exact candidate ranking algorithm, confidence threshold, UX for unresolved assertions, event field shapes and automatic redaction of user-authored fictional IDs.

## Implementation/architecture implications

- S04 context-builder and S09 Lorebook must support **narrator-safe human-language projections**, separate from internal identity maps.
- S05/S06 generation coordinator and interpreter must distinguish **prose-producing** from **non-prose internal reference-resolution** stages, even if both are routed to the same model.
- S06/S10/S11 identity/index/replay maintain stable IDs in canonical data, not in the roleplay output. A story can still omit an unresolvable structured fact under B5-D08 rather than being rejected for fictional ambiguity.
- Regression tests should check narrator prompt sections for leaked raw ID mappings, verify combined one-pass and sequential same-model operation, exercise alias/rename/two-identically-named-keys cases, and confirm ambiguous identity doesn't silently alter unrelated world state. **These are proposed future test obligations, not passing test claims.**

## Traceability

[B6 active review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [LLM State Interpreter and Proposed Operations](../../staging/LLM%20State%20Interpreter%20and%20Proposed%20Operations.md), [Token-Budgeted Context Builder and Inspector](../../staging/Token-Budgeted%20Context%20Builder%20and%20Inspector.md), [Configurable Generation Pipeline Strategies](../../staging/Configurable%20Generation%20Pipeline%20Strategies.md), [One-Model Task Routing](../../staging/One-Model%20Task%20Routing.md). Owners S04/S05/S06/S09/S10/S11; no code implemented.

## Decision history

- **2026-10-28 — B6-D01:** Narrative-first declarative facts and stable/sparse identities approved; internal name-to-ID mapping specifics were not decided.
- **2026-10-29 — Concern identified:** User noted that supplying IDs to the same model might leak them into the primary roleplay passage.
- **2026-10-29 — Proposed response:** Assistant recommended no internal IDs in narrator prompt, natural names, separate internal ID resolution, safe same-model isolation, combined one-pass compatibility, unresolved ambiguous references.
- **2026-10-29 — Explicit documentation request/approval:** User answered “ok” and asked to **record these findings wherever relevant** so future work follows them. This document records the core direction; unselected implementation details remain open.
