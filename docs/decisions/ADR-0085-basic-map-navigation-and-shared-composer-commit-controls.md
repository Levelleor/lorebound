---
id: ADR-0085
type: adr
status: accepted
related:
- ADR-0086
- ADR-0087
- NOTE-0003
- ADR-0082
- ADR-0019
- ADR-0020
- PRD-0038
- ADR-0083
- ADR-0074
- ADR-0078
- ADR-0061
- ADR-0064
supersedes: []
---

# Basic Map Navigation and Shared Composer Commit Controls

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D16](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D16%20-%20Basic%20Map%20Navigation%20and%20Shared%20Composer%20Commit%20Controls.md) · approved at: 2026-10-31; approved by: requesting user (explicit B9 Batch 6 Option A; D16 qualified with basic map UX and existing composer controls)

## Explicit approval and qualification

**User's explicit 2026-10-31 instruction:** “Review B9 Batch 6: B9-D16: A; B9-D17: A; B9-D18: A. Additional conditions: For d16 well support some basic functionality like planning or zooming and hovering but not anything advanced. Commit buttons remain where they were planned initially over the action text area on the primary chat field. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, keep B9-D13 deferred pending clarification, and continue B9.”

**ACCEPTED: Option A, with an express scope/UI placement qualification.** The first map interaction surface is **basic**, not an advanced cartography/diagram editor: straightforward **panning** (the user's “planning” interpreted as panning in the pan/zoom/hover context), zooming, hovering and already accepted selection/inspection, with only modest supporting navigation controls. Do not infer that the user approved complex mapping toolbars, advanced region drawing, multi-tool editing workflows, GIS operations, custom conflict-resolution UI or a new map-local Commit bar.

**The existing pending-commit controls remain at the primary chat/action composer**, positioned **over its action text-input area as part of the existing chat-composer overlay**, not duplicated on the map. The original [B3-D06 bottom-area Commit prompt](ADR-0019-pending-manual-state-corrections-and-explicit-commit.md) was refined by [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md): the *entire* primary chat composer is covered by a semi-transparent “Uncommitted changes” panel, disables typing and Send, and provides accessible Approve/Commit and Discard controls **on/above that overlay**. This latest B9 choice **specifies the intended position relative to the primary action text area**, and retains that shared composer-blocking pattern. It does not relocate Commit controls to the map or introduce another approval stage.

## Operative contract

1. **Simple map gestures:** Pan/zoom, hover, select and inspect are presentation/inspection intents. Hover may expose grounded existing place information; selecting a recorded node can inspect its known details, even if in-story discovery is unknown, as established in [IDEA-0037](../product/PRD-0038-zoomable-node-map-canvas.md). None of these changes world geography, triggers travel, starts narration, advances a turn or itself requires Commit.
2. **No feature expansion by implication:** Option A recognises a separation between noncanonical previews and deliberate semantic map edits, but does **not** require shipping an elaborate visual editor, advanced polygon drawing, route drafting, group manipulation, sophisticated multi-select or cartography controls in the basic initial experience. Earlier architecture still permits deliberate coordinate/location/region corrections through appropriate world-state editing controls; their precise first-release affordances are **not** settled by D16.
3. **Deliberate edits stay pending:** Where basic supported manual coordinate or other spatial correction controls are offered, the UI produces a **noncanonical pending change set**. Only explicit approval via the existing primary-chat composer overlay triggers TypeScript coordinator preparation and Go atomic commit. The player may Discard; transient gestures and previews never silently become canonical.
4. **One existing Commit location:** The Commit/Discard interaction stays in the **shared primary chat composer over the action text area**, consistent with the full-composer blocking B3-D07 overlay for all workflows already requiring pending acceptance. Keep those controls accessible *above* the disabled composer, not trapped beneath it. Preserve specialized historical prose-edit confirmations under the same shared overlay, rather than reducing them to an indiscriminate generic Commit.
5. **Renderer boundary:** The [B9-D14 A](ADR-0083-renderer-independent-spatial-projections-and-s04-canvas-adapter.md) S04 adapter handles basic map presentation/gestures, while S06/the domain rules and Go manage intended state changes and persistence. Neither map hover nor rendering may write SQLite.
6. **Automatic geography is separate:** [B9-D04 C](ADR-0074-all-coordinates-eligible-for-automatic-layout.md) and [B9-D08 A](ADR-0078-event-triggered-deterministic-spatial-reconciliation-and-conflic.md) still allow deterministic, relevant-event-triggered automatic map repositioning, including previously manually placed pins, but **not** in response to panning, zooming or hover.
7. **No D12/D13 promotion:** Spatial migration D12 remains **deferred with no work**. Conflict presentation D13 is **deferred**, with a stated coordinator-led best-effort preference but no selected detailed policy. Map interaction approval does not resolve either.

## Original alternatives and selected scope

- **A — ACCEPTED WITH QUALIFICATION:** Distinguish simple presentation gestures from pending approved semantic edits; **basic map navigation only**, Commit/Discard **over the primary chat action-input composer**, no advanced toolset implied.
- **B — not selected:** Canonically write every pan, zoom, selection or transient pointer move.
- **C — not selected:** Make the world map wholly passive, preventing any supported deliberate world-map correction.

## Dated approval history and limits

- **2026-10-27:** B3-D06 explicitly accepted pending manual corrections and a bottom-area Commit button. Later B3-D07 specifically selected a **semi-transparent full chat-composer overlay** with accessible Commit/Discard and blocked input.
- **2026-10-31:** B7-D10/B8-D03 accepted a persistent semantic canvas, map inspection, and manual world-edit Commit; B9-D14 accepted renderer-neutral presentation.
- **2026-10-31 — Batch 6 explicit:** The user accepted **D16 A**, qualifying the first map UI to basic **pan, zoom, hover** and insisting that existing Commit controls stay **over the action text area on the primary chat field**. D17 A and D18 A were approved separately. This does **not** authorise expanded editor UI, implementation, migration, tests, staging promotion or B9 closure.
