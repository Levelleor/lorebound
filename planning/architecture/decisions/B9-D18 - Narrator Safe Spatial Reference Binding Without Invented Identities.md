---
type: architecture-decision
status: accepted
decision_id: "B9-D18"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 6 Option A; D16 qualified with basic map UX and existing composer controls)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - spatial-identity
---

# B9-D18 — Narrator-safe spatial reference binding without fabricated or duplicated identities

## Explicit approval

**User's explicit 2026-10-31 instruction:** “Review B9 Batch 6: B9-D16: A; B9-D17: A; B9-D18: A. Additional conditions: For d16 well support some basic functionality like planning or zooming and hovering but not anything advanced. Commit buttons remain where they were planned initially over the action text area on the primary chat field. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, keep B9-D13 deferred pending clarification, and continue B9.”

**ACCEPTED: Option A.** Prose-producing AI receives **natural fictional names, descriptions and established relationships, not raw stable engine/entity/route IDs**. After narration, browser TypeScript interpretation/binding resolves supported provisional spatial references to stable current identities where grounded. Ambiguous optional references must not be guessed, and existing names must not trigger arbitrary duplicate place creation.

## Accepted contract

1. **Narrator context stays natural:** Follow [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) and [B7-D08](./B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md): narrator prompts express known places and entrances in natural language, with grounded descriptions; never leak database IDs, schema keys or per-coordinate author tags into prose-generating context.
2. **Distinct interpretation/binding:** The browser interpretation layer may represent provisional natural references for newly named or mentioned locations, buildings, rooms, doors and portal/region identities. Bind to existing stable current entities/typed keyed route identities using accepted contextual facts and supported ID resolution; the narrator does not author durable database IDs itself. A combined narration+extraction model call still uses natural referents; internal binding occurs afterward.
3. **No guessing when ambiguous:** Where two existing locations share a name or the description is too vague, do not choose one arbitrarily or silently create another just to satisfy a model suggestion. Under [B7-D03 C](./B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md), ungrounded optional automatic extraction candidates are omitted without a diagnostic queue or unnecessary player interruption. Preserve otherwise accepted narrative. Required-core invalid identity/schema/transaction errors remain reportable and safely noncommittal.
4. **Stable new identities for resolved new places:** When a genuinely new location is grounded, resolve its stable identity privately and pass to [B9-D17](./B9-D17%20-%20Deterministic%20Atomic%20Batch%20Placement%20of%20Multiple%20New%20Locations.md) for deterministic frame-scoped initial positions and atomic accepted creation. Supported optional entrance and portal routes retain the separately accepted [B9-D11](./B9-D11%20-%20Multiple%20Keyed%20Entrances%20and%20Cross%20Frame%20Portal%20Anchors.md) stable keyed relations.
5. **Domain vs storage:** TypeScript owns interpretation/replay/proposed world change sets; Go enforces technical structural/transactional integrity under [B9-D15](./B9-D15%20-%20Versioned%20Typed%20Browser%20Go%20Spatial%20Service%20Contracts.md), not story name plausibility. Browser/UI does not provide a second authoritative map identity database.
6. **Verification and deferrals:** Mocked contracts can test same-name ambiguity, missing references, new aliases, established route endpoints, omitted suggestions and replay determinism; no tests have run. D12 spatial migration and D13 conflict-presentation design remain deferred.

## Original alternatives

- **A — ACCEPTED:** Natural prose names and facts, post-narration contextual TS stable-ID binding, no guessed/duplicated identities on optional ambiguous extraction.
- **B — not selected:** Include raw database IDs in prose-generating model prompts and have narration write those keys.
- **C — not selected:** Unconditionally create new locations for every ambiguous existing name.

## Approval history

- **2026-10-29/31:** B6-D04 and B7-D08 accepted narrator-safe references and internal binding; B7-D03 C accepted omission of optional ambiguous extraction.
- **2026-10-31 — Batch 6:** User explicitly accepted **D18 A**, independently of D16's basic map interaction qualification and D17 A's multi-location atomicity. No extra prompting policy, identity schema, implementation, tests, promotion, spatial migration or B9 design closure approved.
