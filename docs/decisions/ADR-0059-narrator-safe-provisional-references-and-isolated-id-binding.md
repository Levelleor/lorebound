---
id: ADR-0059
type: adr
status: accepted
related:
- ADR-0058
- ADR-0060
- ADR-0045
- ADR-0050
- ADR-0054
- ADR-0052
- ADR-0061
supersedes: []
---

# Narrator Safe Provisional References and Isolated ID Binding

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B7-D08](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md) · approved at: 2026-10-31; approved by: requesting user (explicit B7 Batch 3 Option A approval)

## Approval and provenance

**Explicit user acceptance, 2026-10-31:** “Review B7 Batch 3: B7-D07: A; B7-D08: A; B7-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and assess B7 design closure.”

This accepts **B7-D08 Option A** from the [B7 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md). B7-D07 and B7-D09 were approved separately. D08 refines the **handoff protocol** and does not reopen B6-D04 or approve mandatory new models, prompts, JSON field names, implementation or B7 formal closure.

## Inherited acceptance

[B6-D04](ADR-0045-narrator-safe-entity-references-and-internal-identity-resolution.md) establishes **no engine-managed stable IDs or ID↔name mapping in any model prompt capable of generating primary roleplay prose**. The narrator uses names, descriptions and relationships; an internal resolution stage may see candidate IDs. [B6-D09](ADR-0050-preserve-ambiguous-story-facts-without-guessing-ids.md) establishes no guessed ID, and [B7-D03 Option C](ADR-0054-discard-unresolved-extraction-suggestions-without-diagnostics.md) explicitly requires silent discard of unresolved **automatic extraction candidates** while preserving reporting for genuine technical failures. Existing configurable single-pass and sequential pipeline strategies and single-selected-model task routing remain accepted.

## Accepted decision — Option A

**Any task that can emit roleplay prose receives an ID-free human-language context and emits grounded natural-language provisional entity references. Lorebound binds these privately to stable IDs after generation, while an isolated non-narrating interpretation/resolution task may have candidate ID mappings.**

1. **Prose-safe references:** A combined narrator+provisional-event response may describe targets by supported natural-language reference data (e.g. name, descriptive qualifier and grounded passage evidence), **not database IDs**. Names are not assumed globally unique; the engine never trusts a prose model to assign stable IDs.
2. **Strict prompt-context separation:** The TypeScript coordinator assembles different task-specific contexts. Any request capable of writing the final roleplay passage receives no raw ID, relation key, internal primary key or ID mapping, including from Lorebook, tool output, retrieved memories, cached histories or model conversation. A non-narrating internal resolution call **may** receive relevant candidate mappings, but its prompt/structured output must never be copied back as narrator context or story prose. Using the **same selected model** for both tasks is permitted with isolated contexts.
3. **Engine-controlled binding:** After prose/provisional outputs, resolve known entities by available scene, aliases, holder, containment and established relationships. Generate canonical system IDs only for clearly grounded *new* entities. If two brass keys are genuinely indistinguishable, **do not choose one arbitrarily or create a duplicate**.
4. **Unresolved candidates silently disappear:** If a proposed automatic assertion cannot be unambiguously grounded or resolved, omit it from canonical events and **discard its candidate interpretation without notification or retaining a diagnostic backlog** (B7-D03 C). It must not block otherwise acceptable prose or unrelated grounded current assertions. This does **not** suppress parser/required-core-format failure, unsafe Go/SQLite transaction, provider failure or explicit manual-edit validation feedback.
5. **Typed core handoff:** Internal successful resolutions become validated, versioned, domain-owned typed declarative assertions under [B7-D01](ADR-0052-versioned-typed-declarative-event-envelope.md) and existing expected-version/library-epoch/idempotent atomic storage, without requiring fictional prerequisite checks. Exact intermediate data types and response schemas remain later implementation decisions.
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
