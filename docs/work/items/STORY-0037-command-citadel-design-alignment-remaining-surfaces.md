---
id: STORY-0037
type: story
status: pending
parent: PRD-0063
depends_on:
- STORY-0030
priority: 3
related:
- PRD-0069
- PRD-0070
- PRD-0063
- STORY-0009
- ADR-0122
blocked: true
---

# Command Citadel design alignment: remaining surfaces

## Outcome

Track this open gap without changing the merged status of the bounded slice.

[Pinned source INC-006](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/INCOMPLETE-FEATURES.md)

## Scope and boundaries

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — functional/verification**; source-level comparison requested by the user. Existing Story/narration corrections have approved conditional closure in [PR #27](https://github.com/Levelleor/lorebound/pull/27); the remaining design scope stays open after confirmed checked merge. |
| Implemented | The bounded delivery adapts the current Story reader/composer, gold action/steering controls, Cormorant Garamond/Plex typography and local font delivery. Its full-height story scrollbar and fixed attached narration section keep the input/story position stable as explicitly requested; narration gains scrolling only when needed; long drafts scroll inside the capped native Story textarea while surrounding controls stay fixed, preserving all text. The owning PR records passing current application CI/actual-capture review and approved conditional closure. |
| Unfinished | Appearance UI and additional reading fonts/presets; broader header/navigation/icon alignment; supported world-rail tabs/rows/sticky headers; consistent library/model-dialog form treatment; complete accessibility, zoom and other-OS visual verification. Detailed dispositions below keep cosmetic gaps separate from absent capabilities. |
| Practical effect | The bounded Story workspace can follow the reference without claiming the whole application or demo capabilities are implemented. Other surfaces still differ, and players cannot yet select the reference’s appearance options. |
| Source / evidence | Directly inspected [Workspace.tsx](https://github.com/Levelleor/lorebound-command-citadel/blob/0be367d3886e803207e1bc582cca4fb8fc50ac8c/src/components/lorebound/Workspace.tsx), [Dialogs.tsx](https://github.com/Levelleor/lorebound-command-citadel/blob/0be367d3886e803207e1bc582cca4fb8fc50ac8c/src/components/lorebound/Dialogs.tsx), [styles.css](https://github.com/Levelleor/lorebound-command-citadel/blob/0be367d3886e803207e1bc582cca4fb8fc50ac8c/src/styles.css) and font-loading root; compared actual [Story](../../../frontend/src/lib/StoryWorkspace.svelte), [appearance](../../../frontend/src/lib/appearance.css), [entry/rail](../../../frontend/src/routes/%2Bpage.svelte) and [model dialog](../../../frontend/src/lib/ConnectionSettings.svelte). [Visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) owns approved direction; [DEV-004G](STORY-0030-current-adventure-narration-settings.md) owns this slice. |
| Resolution | Separately authorise bounded DEV-009 or owning-feature slices, implement supported surfaces and review actual responsive/theme/state captures against the pinned source. Retain current behavior contracts and truthful disabled/empty states. |
| Dependencies / boundary | User requested logging the remaining review/fixes, not executing them now. No new next task, IDEA completion, appearance persistence contract, domain capability or separate reconciliation PR follows. IDEA-0068 stays staged, IDEA-0069 unaccepted and B9-D12 deferred. |

| Remaining design area | Observed gap / later disposition |
| --- | --- |
| Appearance and fonts | `SettingsDialog` offers Dark/Bright/Midnight, density, ink, font alternatives and 15–28px size/preview/reset. Current app has no appearance selector; only Dark/Bright styling and the default bundled families are exercised. The shared hard-coded dark radial backdrop also leaves a brown-gray patch in Bright and reduces supporting-text contrast; make the gradient theme-aware in the later appearance pass. Deliver supported preferences under DEV-009/IDEA-0062; bundle Literata/Atkinson with licenses when that slice needs them. |
| Header and navigation | Reference has outline book/settings/location icons, a compact outlined settings button and responsive breadcrumbs. Current header uses text glyphs, a Models action and no tracked location. Align existing header controls in a later cosmetic slice; breadcrumbs require real location ownership, never sample data. |
| World rail | Reference has sticky icon-over-label tabs and compact Scene/Items/Lore/Context contents. Current rail is a truthful static empty-world placeholder with text tab labels. Cosmetic rail alignment belongs with supported tab behavior; character, inventory, Lorebook and measured token widgets depend on DEV-005/006/007 and remain absent. |
| Library and dialogs | Library has no complete equivalent in the demo; model forms have richer real validation/recovery requirements than its stub. Review spacing, title sizes, icon use, focus, disabled states and native controls when those surfaces are selected. Keep actual security/metadata semantics. |
| Story states and accessibility | This slice covers current Story/narration geometry, typography and captures. Later comprehensive review still needs high zoom, screen readers, long/localised labels, touch keyboards, additional platforms and supported world-event chips. Keep explicit Accept/Edit/Undo/Fork/recovery; do not copy demo auto-accept or immediate canonical editing. |

## Risks and blockers

Remaining visual review/fixes were logged, not launched. Requires a separately authorized bounded owning-feature slice.
