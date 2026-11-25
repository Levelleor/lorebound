---
id: ADR-0091
type: adr
status: accepted
related:
- ADR-0092
- ADR-0093
- NOTE-0003
- ADR-0082
- ADR-0077
- ADR-0080
- ADR-0088
supersedes: []
---

# No Visible Geographic Scale Indicator

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D22](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D22%20-%20No%20Visible%20Geographic%20Scale%20Indicator.md) · approved at: 2026-11-01; approved by: requesting user (explicit B9 Batch 8 option selection)

## Explicit approval

**Explicit user selection:** “Review B9 Batch 8: B9-D22: C; B9-D23: A; B9-D24: defer. Additional conditions: For d23 just make a note that shoulbw as easy as possible and not introduce any advanced d it's. No keyboard interaction for the map. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, keep B9-D13 deferred pending clarification, and continue B9.”

**ACCEPTED: Option C, contrary to recommended A.** The basic world-map UI does **not** need to display a distance scale bar, numerical metres-per-pixel indicator or similar visual scale reference, even when internal typed geographic metres are available. This is a **presentation** choice, not removal of the [B9-D07 B](ADR-0077-automatic-numeric-metre-conversion-of-qualitative-geography.md), [B9-D10 A](ADR-0080-versioned-deterministic-qualitative-distance-conversion-profiles.md), [B9-D19 A](ADR-0088-stable-default-root-frame-and-initial-geographic-scale.md) numeric geographic/frame-scale contracts.

## Accepted effect

1. **No scale UI:** Omit optional scale-bar overlays, distance rulers, surveying/calibration widgets and hover metre readouts from the basic map. D16's basic pan, zoom, hover and simple inspection remain.
2. **Internal meaning stays:** Persist canonical typed coordinates, transforms, semantic metres and default/derived scales for deterministic replay and placement. Omission of a *visible* scale indicator does not convert the semantic map back into arbitrary pixels or remove meaningful relative positions.
3. **Independent routes and facts:** Do not infer road travel times, route lengths or newly established narrator survey measurements from rendered pixels or absence of a scale bar.
4. **No adjacent approvals:** D23 A is separately approved with a simple-performance qualification; D24 is **deferred** and the user independently requested **no map keyboard interaction at present**. Do not create a D24 ADR or pretend a keyboard option was approved.
5. **No implementation/promotion:** This is a design-only presentation decision. B9-D12 migration stays deferred with no work; B9-D13 conflict presentation stays deferred pending coordinator clarification.

## Original options and history

- **A — not selected (previously recommended):** Small optional scale indicator.
- **B — not selected:** Full GIS measuring/calibration suite.
- **C — ACCEPTED:** No visible scale guidance even when semantic metres exist.
- **2026-11-01:** User explicitly selected B9-D22 C and B9-D23 A, deferred D24 and disallowed map keyboard interaction for now. The original B9 review options remain as dated proposal history.
