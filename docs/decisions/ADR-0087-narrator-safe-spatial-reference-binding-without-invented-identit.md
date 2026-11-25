---
id: ADR-0087
type: adr
status: accepted
related:
- ADR-0085
- ADR-0086
- NOTE-0003
- ADR-0082
- ADR-0045
- ADR-0059
- ADR-0054
- ADR-0081
- ADR-0084
supersedes: []
---

# Narrator Safe Spatial Reference Binding Without Invented Identities

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D18](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D18%20-%20Narrator%20Safe%20Spatial%20Reference%20Binding%20Without%20Invented%20Identities.md) · approved at: 2026-10-31; approved by: requesting user (explicit B9 Batch 6 Option A; D16 qualified with basic map UX and existing composer controls)

## Explicit approval

**User's explicit 2026-10-31 instruction:** “Review B9 Batch 6: B9-D16: A; B9-D17: A; B9-D18: A. Additional conditions: For d16 well support some basic functionality like planning or zooming and hovering but not anything advanced. Commit buttons remain where they were planned initially over the action text area on the primary chat field. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, keep B9-D13 deferred pending clarification, and continue B9.”

**ACCEPTED: Option A.** Prose-producing AI receives **natural fictional names, descriptions and established relationships, not raw stable engine/entity/route IDs**. After narration, browser TypeScript interpretation/binding resolves supported provisional spatial references to stable current identities where grounded. Ambiguous optional references must not be guessed, and existing names must not trigger arbitrary duplicate place creation.

## Accepted contract

1. **Narrator context stays natural:** Follow [B6-D04](ADR-0045-narrator-safe-entity-references-and-internal-identity-resolution.md) and [B7-D08](ADR-0059-narrator-safe-provisional-references-and-isolated-id-binding.md): narrator prompts express known places and entrances in natural language, with grounded descriptions; never leak database IDs, schema keys or per-coordinate author tags into prose-generating context.
2. **Distinct interpretation/binding:** The browser interpretation layer may represent provisional natural references for newly named or mentioned locations, buildings, rooms, doors and portal/region identities. Bind to existing stable current entities/typed keyed route identities using accepted contextual facts and supported ID resolution; the narrator does not author durable database IDs itself. A combined narration+extraction model call still uses natural referents; internal binding occurs afterward.
3. **No guessing when ambiguous:** Where two existing locations share a name or the description is too vague, do not choose one arbitrarily or silently create another just to satisfy a model suggestion. Under [B7-D03 C](ADR-0054-discard-unresolved-extraction-suggestions-without-diagnostics.md), ungrounded optional automatic extraction candidates are omitted without a diagnostic queue or unnecessary player interruption. Preserve otherwise accepted narrative. Required-core invalid identity/schema/transaction errors remain reportable and safely noncommittal.
4. **Stable new identities for resolved new places:** When a genuinely new location is grounded, resolve its stable identity privately and pass to [B9-D17](ADR-0086-deterministic-atomic-batch-placement-of-multiple-new-locations.md) for deterministic frame-scoped initial positions and atomic accepted creation. Supported optional entrance and portal routes retain the separately accepted [B9-D11](ADR-0081-multiple-keyed-entrances-and-cross-frame-portal-anchors.md) stable keyed relations.
5. **Domain vs storage:** TypeScript owns interpretation/replay/proposed world change sets; Go enforces technical structural/transactional integrity under [B9-D15](ADR-0084-versioned-typed-browser-go-spatial-service-contracts.md), not story name plausibility. Browser/UI does not provide a second authoritative map identity database.
6. **Verification and deferrals:** Mocked contracts can test same-name ambiguity, missing references, new aliases, established route endpoints, omitted suggestions and replay determinism; no tests have run. D12 spatial migration and D13 conflict-presentation design remain deferred.

## Original alternatives

- **A — ACCEPTED:** Natural prose names and facts, post-narration contextual TS stable-ID binding, no guessed/duplicated identities on optional ambiguous extraction.
- **B — not selected:** Include raw database IDs in prose-generating model prompts and have narration write those keys.
- **C — not selected:** Unconditionally create new locations for every ambiguous existing name.

## Approval history

- **2026-10-29/31:** B6-D04 and B7-D08 accepted narrator-safe references and internal binding; B7-D03 C accepted omission of optional ambiguous extraction.
- **2026-10-31 — Batch 6:** User explicitly accepted **D18 A**, independently of D16's basic map interaction qualification and D17 A's multi-location atomicity. No extra prompting policy, identity schema, implementation, tests, promotion, spatial migration or B9 design closure approved.
