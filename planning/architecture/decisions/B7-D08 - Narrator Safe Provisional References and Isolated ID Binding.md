---
type: architecture-decision
status: accepted
decision_id: "B7-D08"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B7 Batch 3 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - narrative-interpretation
  - identity-resolution
  - architecture-decision
---

# B7-D08 — Natural-language provisional references and isolated internal identity binding

## Approval and provenance

**Explicit user acceptance, 2026-10-31:** “Review B7 Batch 3: B7-D07: A; B7-D08: A; B7-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and assess B7 design closure.”

This accepts **B7-D08 Option A** from the [B7 review](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md). B7-D07 and B7-D09 were approved separately. D08 refines the **handoff protocol** and does not reopen B6-D04 or approve mandatory new models, prompts, JSON field names, implementation or B7 formal closure.

## Inherited acceptance

[B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) establishes **no engine-managed stable IDs or ID↔name mapping in any model prompt capable of generating primary roleplay prose**. The narrator uses names, descriptions and relationships; an internal resolution stage may see candidate IDs. [B6-D09](./B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md) establishes no guessed ID, and [B7-D03 Option C](./B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md) explicitly requires silent discard of unresolved **automatic extraction candidates** while preserving reporting for genuine technical failures. Existing configurable single-pass and sequential pipeline strategies and single-selected-model task routing remain accepted.

## Accepted decision — Option A

**Any task that can emit roleplay prose receives an ID-free human-language context and emits grounded natural-language provisional entity references. Lorebound binds these privately to stable IDs after generation, while an isolated non-narrating interpretation/resolution task may have candidate ID mappings.**

1. **Prose-safe references:** A combined narrator+provisional-event response may describe targets by supported natural-language reference data (e.g. name, descriptive qualifier and grounded passage evidence), **not database IDs**. Names are not assumed globally unique; the engine never trusts a prose model to assign stable IDs.
2. **Strict prompt-context separation:** The TypeScript coordinator assembles different task-specific contexts. Any request capable of writing the final roleplay passage receives no raw ID, relation key, internal primary key or ID mapping, including from Lorebook, tool output, retrieved memories, cached histories or model conversation. A non-narrating internal resolution call **may** receive relevant candidate mappings, but its prompt/structured output must never be copied back as narrator context or story prose. Using the **same selected model** for both tasks is permitted with isolated contexts.
3. **Engine-controlled binding:** After prose/provisional outputs, resolve known entities by available scene, aliases, holder, containment and established relationships. Generate canonical system IDs only for clearly grounded *new* entities. If two brass keys are genuinely indistinguishable, **do not choose one arbitrarily or create a duplicate**.
4. **Unresolved candidates silently disappear:** If a proposed automatic assertion cannot be unambiguously grounded or resolved, omit it from canonical events and **discard its candidate interpretation without notification or retaining a diagnostic backlog** (B7-D03 C). It must not block otherwise acceptable prose or unrelated grounded current assertions. This does **not** suppress parser/required-core-format failure, unsafe Go/SQLite transaction, provider failure or explicit manual-edit validation feedback.
5. **Typed core handoff:** Internal successful resolutions become validated, versioned, domain-owned typed declarative assertions under [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) and existing expected-version/library-epoch/idempotent atomic storage, without requiring fictional prerequisite checks. Exact intermediate data types and response schemas remain later implementation decisions.
6. **Model routing flexibility:** No second AI model or mandatory second inference request is introduced. Separate interpretation is **optional/configuration-dependent**; single-pass prose+natural-reference proposals remain supported. Never expose IDs in a narrator-visible prompt merely for easy event JSON.
7. **Narrator-ready world-map context:** The semantic B7-D10 spatial canvas may contribute **human-readable grounded** place/group/distance facts to narration; persistent internal coordinate/location IDs or technical graph keys need not be exposed. Do not infer missing map coordinates or route distances solely to complete an event.

## Alternatives preserved

- **A, accepted:** Natural-language provisional references from any prose-producing task, with private engine ID binding and separately isolated non-narrating candidate context when needed.
- **B, not chosen:** Supply internal stable IDs to the prose model and rely on “never print IDs” prompt text.
- **C, not chosen:** Require a distinct second AI model for every adventure, including single-pass configurations.

## Deferred details

Exact provisional-reference JSON schema; grounding passage spans; confidence/candidate selection threshold, index lookup and no-AI path; parser/adapters for weaker local models; prompt-policy tests and error types. No runtime implementation or separate model requirement is claimed.

## Decision history

- **2026-10-29:** User approved B6-D04 narrator/ID isolation, leaving concrete handoff schema unresolved.
- **2026-10-31:** User approved B7-D03 **C** for silent discard of unresolved extraction; D08 A/B/C was separately proposed, none yet approved.
- **2026-10-31:** User explicitly selected **B7-D08 A**, plus D07 A/D09 A, requesting GitHub ADRs and a **closure assessment**, not formal closure.
