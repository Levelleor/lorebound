---
type: design
status: approved-visual-direction
phase: "C"
created: "2026-11-03"
updated: "2026-11-06"
source: "User-supplied lorebound-design-only-kit(1).zip / UX_INTERACTION_MAP.md"
tags:
  - planning/design
  - interaction-states
  - visual-design
---

# Lorebound — UI Interaction and State Mapping

This is the **visual and user-feedback companion** to the [approved Command Citadel visual contract](./Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md), transcribed/adapted from the uploaded kit's `UX_INTERACTION_MAP.md` and design specification. It is **not an independent amendment to previously accepted story, transaction, map or capability behaviour**. Apply the visual language to functions **as they are actually implemented**; do not fake interactions or data to fill demo surfaces.

## Primary interaction surfaces

| Surface/control | Intended immediate visual feedback | Underlying Lorebound behaviour/limitation |
| --- | --- | --- |
| Header Settings | centred 80%-black backdrop, compact modal, gold active Appearance/Model tab | Escape/X close, focus managed; show only settings that genuinely exist |
| Appearance / interface theme | selected Dark, Bright or Midnight segment; entire app palette changes immediately | UI preference only, not a canonical story event |
| Comfortable/Compact | section/reading density changes in place | Compact ~14px general type, tighter 16px section gaps |
| Reading ink | Default/Parchment, Sepia, High contrast, Sage segment; prose and preview change | Theme-specific alternate ink, especially Bright |
| Reading font | Cormorant, Literata, IBM Plex Sans or Atkinson selection | Prose changes, control labels remain IBM Plex Sans |
| Reading size | slider 15–28px; main prose and preview update | Default 21px, line-height 1.625 |
| Appearance reset | restores visible defaults immediately | No separate Apply; session persistence only if implemented |
| Narrow Story/World view switch | 2px gold underline moves; one full-width content surface appears | Only at width <1024px, Story default |
| Right-rail tabs | selected tab gold-underlined, inactive tabs muted | Scene/Items/Lore/Context content, only currently supported features |
| Playing As selector | current actor highlighted in rail and other selectors; current marker/text | Only grounded existing character; Do/Say unavailable without a selected actor |
| Composer mode selection | one gold/glowing selected mode; different concise hint; other modes muted | Do/Say/Story/Continue are eventual modes; Story is first Pass C slice, not evidence all modes work |
| Advanced/steering toggle | compact outlined shelf expands above composer; open icon gold | Do not introduce model features only to reproduce visual demo |
| Composer input | three-line bordered field; Story may use 18px serif; Do/Say 14px sans | Ctrl/Cmd+Enter where supported, visible hint and named send action; default disabled states grounded in actual capabilities |
| Continue mode | replaces typing with calm dashed explanatory box | No text entry required; availability follows implemented mode semantics |
| Send/start | 36px gold primary circular control transitions to red-outlined Stop during actual generation | Pending narrative text is noncanonical; never auto-accept solely because UI says Send |
| Generating indicator | pale-blue pulse + optional 1px blinking blue caret | Progress must represent an actual generation state, not simulated connectivity |
| Candidate/provisional result | 1px blue dashed outline, 5% blue tint, blue proposed pills and proposed label | Only display accepted-turn/Retry/Discard actions as supported by authoritative pending/commit workflow |
| Accept candidate | pending visual becomes normal editorial story, green confirmed chips | Only **after** valid authoritative Go/SQLite atomic commit; errors preserve pending state and clear status |
| Retry | provisional styling restarts for new attempt, old canon unchanged | Retry may not silently accept or mutate accepted text |
| Discard candidate | blue temporary block disappears | Existing canonical passages/facts unchanged |
| Stop | stop control disappears and progress ceases | Cancellation must be real/accurately reported; no claim rollback without evidence |
| Fork accepted turn (user correction 2026-11-06) | Small fork icon beneath each accepted turn; visible focus and accessible turn-specific name | Clicking pins that turn and opens its copied prefix in a separate browser tab/window, default `fork: [source name]`; source tab/input retained; no selector/title form, branch tree or automatic rename. Pending/recovery feedback stays by the initiating turn. |
| Edit committed prose | 2px gold left marker and muted editing state; small status banner may appear | Noncanonical draft; actual confirmation through accepted shared composer overlay, guarded by expected version |
| Discard/confirm edit | pending visual clears or becomes accepted, with truthful status | No extra map-local Commit bar; historical Keep Later/Truncate decisions as separately approved |
| Lorebook search | compact list filters immediately, subtle row hover | Search only supported recorded fields; no fabricated results |
| Lorebook add/edit | centred ≤672px structured form, uppercase labels, thin borders, 2px focus ring | Form is a draft until Save; Cancel/X/Escape never commits |
| Conditional fields | segmentation highlights and dependent fields appear/disappear | Actual accepted entity schema and permissions control visibility |
| Related-item chip remove | pill disappears from draft, layout wraps on narrow widths | Removal not canonical until accepted |
| Context budget tab | 12px monospace count, 8px stacked bar, simple legend | Show real measured totals; source demo's numbers are illustrative |
| Map viewer | same typography/tokens, simple pointer pan/zoom/hover/select | No map-specific keyboard interaction (B9-D24 revised B); no visible scale bar (B9-D22 C) |
| Map correction | familiar selected/pending state and **existing composer Commit/Discard overlay** | No new map-local confirm toolbar or unintended canonical change on redraw |

## Source visual-state legend

| State | Visual standard | Independent non-colour cue |
| --- | --- | --- |
| Primary / selected | antique gold fill or 2px active underline, limited glow | clear selected label/position |
| Hover | quiet secondary tint and brighter text | appropriate cursor and text semantics |
| Keyboard focus | 2px gold focus ring | visible location and accessible name |
| Inactive | subdued text, no glow | not currently active |
| Disabled | ~35% opacity for modes; ~50% for fields | native disabled semantics or equivalent |
| Provisional / draft | dashed pale-blue line and faint blue fill | small proposed label, in-progress icon |
| Confirmed | ordinary parchment editorial surface, green outline/check chip | check glyph and committed label |
| Current context | subtle accent row, gold marker | readable `YOU`/selected text |
| Stop / destructive | restrained red outline/icon | Stop/Cancel text or accessible name |
| Background/save status | quiet grey icon/text or 6px dot | factually accurate condition, not hardcoded `Saved` or `Connected` |

## State defaults and adaptation

The design-kit demonstration opened on a fictional story at a later turn with **Do mode** and an active character. **Do not copy those sample story names, people or status fixtures.** Lorebound's first implementation slice is **Story mode** under accepted C-D04 A; Do/Say must be disabled until supported and an actual Playing As character is selected. The kit's apparent progression and form operations were demo patterns and do not prove working storage/generation.

Recommended presentation defaults **when features exist**: Dark, Comfortable, default parchment ink, Cormorant, 21px prose; Story panel selected below 1024px; Scene selected in right rail; Appearance selected in Settings. A selected setting should be visually consistent across any control exposing the same setting.

### Conflict-resolution table: style vs accepted application semantics

| Reference demo pattern | Binding Lorebound interpretation |
| --- | --- |
| Provisional Accept/Retry/Discard row and message about Send accepting a prior turn | User-approved turn lifecycle and technical commit rules govern; don't silently approve pending changes |
| Editing-status banner with editing confirmation controls | An optional **status** banner is fine, but [B3-D07](../architecture/decisions/B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) requires the **shared composer Commit/Discard overlay** for pending manual map/world corrections; no separate map bar |
| Source default mode Do / source demo's active character | Actual Story-mode-first C-D04 slice starts without mandatory Playing As; Do/Say require selected character when implemented |
| General accessibility and keyboard focus | Preserve for story, navigation, composer and dialogs; **not** a new keyboard gesture interface for map canvas under [B9-D24 revised B](../architecture/decisions/B9-D24%20-%20Basic%20Map%20Pointer%20Interaction%20Without%20Keyboard%20Controls.md) |
| Example geography/world panel | Follow accepted typed spatial canvas and no visible scale indicator; do not introduce renderer/solver or migrations |
| Fixture `Saved`, `Connected`, context tokens | Only show actual persisted/connected/measured state; if unavailable use neutral truthful state or omit |
| Source model/pipeline/strictness shelf | Style those controls **when** their production ideas are implemented; no extra live AI reviewer, Go model proxy or forced provider fallback |
| Source full app with all tabs/modes | 52 production ideas are **approved for planning**, not built. Build visual shell incrementally and show truthful unavailable/empty states |

## Future visual QA (not yet executed)

At **390px, 768px, 1024px and 1440px**, verify Dark and Bright at minimum. Capture browser screenshots and record **PASS / FAIL / NOT RUN** for shell geometry, scroll zones, type, colour, responsive switch, docked composer, candidate/confirmed differentiation, dialog focus/Escape, keyboard controls outside map, disabled states, current-context consistency, truthfulness of status labels and non-overflow. Track intentional deviations from the [visual contract](./Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md). Do not claim this reference was rendered or tested simply because the Markdown/CSS was committed.

**Authority:** User-approved 2026-11-03 visual style from uploaded design-only kit. B1–B9/C domain and persistence approvals remain operative. **Deferred B9-D12 spatial migration stays deferred.**
