---
id: ADR-0093
type: adr
status: accepted
related: []
supersedes: []
---

# Basic Map Pointer Interaction Without Keyboard Controls

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D24](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D24%20-%20Basic%20Map%20Pointer%20Interaction%20Without%20Keyboard%20Controls.md) · approved at: 2026-11-01

**Accepted revised Option B, 2026-11-01.** The map supports its existing basic pointer pan, zoom, hover and selection, with **no map-specific keyboard interaction**. This does not change unrelated chat input, Settings, Lorebook or primary chat Commit/Discard controls. It does not introduce advanced map-editing features.

**History:** The earlier Batch 8 choice was *defer* with the explicit note, “No keyboard interaction for the map.” This later revised-B approval resolves that open choice; A/C were not selected. Original alternatives and the earlier deferral remain in the B9 review register.

No code, testing, spatial migration or staging promotion authorised.
