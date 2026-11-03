---
type: design
status: approved-visual-direction
phase: "C"
created: "2026-11-03"
updated: "2026-11-03"
source: "User-supplied lorebound-design-only-kit(1).zip"
source_reference: "Levelleor/lorebound-command-citadel@0be367d3886e803207e1bc582cca4fb8fc50ac8c"
tags:
  - planning/design
  - visual-design
  - interface
  - pass-c
---

# Lorebound — Command Citadel Visual Design Contract

## Approval, precedence and provenance

**User's explicit design direction (2026-11-03):** “please add the design style for the app as well into the planning documentation. I'd like the app to look as per the design document”.

**Visual direction APPROVED for Lorebound:** implement the look and feel of the uploaded **`lorebound-design-only-kit(1).zip`** as the application-wide **visual reference**. The kit comprises `README.md`, `ALL_IN_ONE.md`, `RECREATION_PROMPT.md`, `UX_INTERACTION_MAP.md`, `design-tokens.json` and `palette-and-presets.css`. Its stated provenance is source inspection of `Levelleor/lorebound-command-citadel` at revision `0be367d3886e803207e1bc582cca4fb8fc50ac8c`, **not** pixel-measured screenshot verification. Example story names, fictional people, token counts, generated content and Saved/Connected badges in that kit are illustrative, **not test evidence or obligatory fixtures**.

**Scope:** This note establishes the **visual contract** for the actual Lorebound app, including layout, spacing, responsive behaviour, typography, appearance, component styling and state signalling. The companion [UI interaction and state mapping](./Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) explains how its visual gestures correspond to the accepted product. The [portable CSS palette](./palette-and-presets.css) preserves source palette values and appearance presets. The uploaded kit remains the originating full design document; this note makes the operative visual requirements accessible to agents reviewing the GitHub planning vault.

**Authority boundary:** Where the demo design describes **behaviour** that contradicts accepted Lorebound B1–B9, Pass C or production-idea contracts, **those existing functional decisions win**, while the visual treatment remains the intended design. This design acceptance is **not approval to implement a particular feature or library**, to revise canonical data models, to execute tests, to run AI, to change architectural decisions or to start **deferred B9-D12 spatial migrations**. Use Wails v3 headless Go + ordinary-browser SvelteKit architecture already in place; the kit itself prescribes no framework.

## VIS-01: Visual identity and character

A **restrained, literary desktop writing console**: a parchment-and-brass archive atmosphere presented with precise modern editing controls. Primary content reads like a book; surrounding UI is compact serious software.

- **Default atmosphere:** warm near-black charcoal; brown/stone quiet surfaces; parchment text; gold selected/primary actions; pale blue provisional work; desaturated green committed work; muted red cancellation/destruction.
- **Background:** solid warm near-black with **one faint warm top-centred radial gradient**, `radial-gradient(ellipse at 50% -10%, oklch(0.24 0.03 65 / 0.9), transparent 60%)`. Avoid noisy textures, large illustrations, decorative medieval borders and marketing hero imagery.
- **Structure:** flat continuous planes separated by **1px low-contrast lines**, not floating-card SaaS grids. Small restrained rounding, disciplined density, soft hovers and minimal elevation. Only selected primary/mode actions warrant the deliberate gold glow.
- **Hierarchy:** editorial prose and scene titles dominate; compact control surfaces, metadata and utility labels recede. Accent colour always has meaning rather than decoration.
- **Icons:** lightweight outline strokes (book, pin, cloud, settings, people, package, layers, quill, check, arrows). Icon meaning determines choice, not the exact icon library. No large raster illustrations or character portrait dependence.

**Visual priority order from uploaded kit:** layout proportions → type → semantic palette/background → provisional/confirmed differentiation → controls/density → responsive transformations → subtle animation/accessibility.

## VIS-02: Required desktop composition

Use a **full viewport height** application shell, a top utility header and a work area under it; the primary reader and context rail **scroll separately**. The composer remains docked below the reader, inside the main column, never scrolled away with the story.

| Surface | Design reference requirement |
| --- | --- |
| Header | **48px** full width, 16px horizontal padding and major-group spacing, 1px bottom border |
| Brand | 16px gold outlined book + 8px gap + **20px** semibold serif Lorebound wordmark, wide tracking |
| Header secondary | small location breadcrumb with muted 14px pin/12px chevrons; current segment brighter; truthful Saved/status; outlined Settings action |
| Main area | flexible remainder of viewport width, **no horizontal page overflow** |
| Editorial reading column | centred **max 672px outer width including its internal padding**, 40px top/bottom and 40px wide side padding |
| Context rail | **320px** wide for desktop, continuous darker `--sidebar` surface, 1px left divider |
| Context rail tabs | sticky four equal icon-over-label tabs, ~16px icons/11px labels, **2px gold active underline** |
| Context rail body | **20px** padding; compact metadata, rows and simple lists; independently scrollable |
| Composer | bottom docked *inside main column*, 1px top rule, ~80%-opaque card fill, gentle blur, 16px padding; centred max-672px interior |
| Dialog | dark ~80%-black backdrop, centred, 1px outline, 24px inner padding, restrained 6px corners, own scroll; **max 90vh** |
| Settings dialog | **576px max width**; structured Lore/record editor **672px max width** |

The main article is **not** a grid of cards. Committed passages are vertically stacked editorial sections, typically **32px** apart (**16px** in compact density). The title area has an uppercase micro overline, centred **36px** parchment serif title, ~8px overline/title separation and ~40px gap before passages.

### Reference anatomy

```text
┌──────────────────────────────────────────────────────────┐
│ 48px  BOOK Lorebound   location breadcrumbs   Saved ⚙   │
├──────────────────────────────────────┬───────────────────┤
│ scrollable STORY READER              │ 320px DARKER RAIL │
│ centred editorial content ≤672px     │ Scene Items Lore  │
│                                      │ Context (tabs)    │
│ passages / confirmed event chips     │ own scroll        │
│ provisional dashed blue candidate    │ compact metadata  │
├──────────────────────────────────────┤                   │
│ optional editing-status strip        │                   │
├──────────────────────────────────────┤                   │
│ DOCKED COMPOSER + shared controls    │                   │
└──────────────────────────────────────┴───────────────────┘
```

## VIS-03: Responsive transitions (source values)

| Viewport | Expected behaviour |
| --- | --- |
| **≥1024px** | Main/story and continuous 320px right rail side by side; independent scroll; no Story/World toggle |
| **<1024px** | **Mutually exclusive Story/World selector directly below header**, default Story; 2px gold selected underline; the selected surface fills width |
| **<768px** | Hide location breadcrumb rather than truncate it; retain brand and right-side actions |
| **<640px** | Settings icon remains with accessible name but text label hides; article side padding **24px**; composer modes may wrap; two-column dialog forms become one |
| **all sizes** | article stays centred and ≤672px; composer stays docked, rail does not create horizontal overflow, dialogs ≤90vh |

**Density:** Comfortable is default; Compact tightens general body to ~14px, article top padding to **24px** and section gaps to **16px** without making key actions unusable. Responsiveness must not hide critical pending Commit/Discard feedback.

## VIS-04: Exact core palette and semantics

Use **OKLCH** as supplied, not guessed hex conversions. Full base and alternate theme variables are in [`palette-and-presets.css`](./palette-and-presets.css).

| Role | Exact value | Meaning |
| --- | --- | --- |
| `--background` | `oklch(0.17 0.012 60)` | warm near-black reader |
| `--foreground` | `oklch(0.9 0.025 80)` | main interface type |
| `--card` | `oklch(0.205 0.014 60)` | composer and quiet raised panel |
| `--primary` | `oklch(0.76 0.12 70)` | antique gold/selected/primary |
| `--primary-foreground` | `oklch(0.18 0.02 60)` | dark ink on gold |
| `--muted-foreground` | `oklch(0.64 0.025 75)` | subdued metadata |
| `--border` / `--input` | `oklch(0.3 0.015 60)` | 1px quiet outlines |
| `--parchment` | `oklch(0.93 0.03 82)` | story headings and brand |
| `--ink` | `oklch(0.86 0.03 80)` | normal editorial reading |
| `--provisional` | `oklch(0.72 0.09 210)` | blue pending proposal |
| `--success` | `oklch(0.72 0.12 150)` | green committed confirmation |
| `--destructive` | `oklch(0.62 0.17 28)` | red stop/destructive |
| `--sidebar` | `oklch(0.145 0.01 60)` | continuous darker right rail |
| `--sidebar-border` | `oklch(0.26 0.014 60)` | rail separators |

Further exact tokens: `--popover`, `--secondary`, `--accent`, foreground companions, input ring, sidebar accents, chart colours and alternate themes are defined in the portable CSS.

**State semantics:** gold = active/primary; pale blue dashed = proposed/uncommitted; desaturated green check = confirmed; muted red = stop/destructive; muted grey = unavailable/neutral. **Never convey acceptance using colour alone.** Pair colour with labels/icons/text.

## VIS-05: Typography and sizing

| Text role | Font and design sizing |
| --- | --- |
| Editorial prose | **Cormorant Garamond**, Georgia/serif fallback, **21px** default, **1.625** line-height; user adjustable **15–28px** |
| Brand | Cormorant Garamond, **20px**, semibold, wide tracking |
| Main story title | Cormorant Garamond, **36px**, medium, parchment |
| Sidebar scene heading | Cormorant Garamond, **20px** |
| Modal title | Cormorant Garamond, **24px** |
| Interface controls / nav / input | **IBM Plex Sans**, generally **14px** |
| Metadata and chips | IBM Plex Sans, typically **11–12px** |
| Uppercase micro label | IBM Plex Sans **10.88px**, weight 600, **0.14em** letter spacing |
| Technical/turn/budget readouts | **IBM Plex Mono**, typically **10–12px** |

Available reading alternatives from source: **Literata**, **IBM Plex Sans**, **Atkinson Hyperlegible**. Reference fonts and fallback stacks are visual roles, **not authorisation to redistribute licensed font files**.

## VIS-06: Shape, focus and motion

- Basic corners: **6px**; standard buttons/fields **4px**; occasional 2/10/14px radii; chips and small avatars pill/round.
- Dividers and field borders: **1px**. Keyboard focus: clear **2px** gold ring; do not remove actual focus visibility. Edited passages gain a **2px gold left rule** and ~16px inset.
- Selected action/send glow: `0 0 0 1px oklch(0.76 0.12 70 / 0.35), 0 8px 30px -10px oklch(0.76 0.12 70 / 0.35)`. Apply **selectively**, not to every gold button.
- Provisional candidate: **1px dashed pale blue** at ~60% opacity, ~5% blue fill, **20px** padding, 4px radius. Processing status may pulse softly; a 1px thin caret may blink around 1s.
- Confirmed fact changes: understated ~11px outlined pill chips, green check and ordinary editorial text.
- Stop control: red outline, explicit accessible label; no conflation with the primary golden send.
- Dialog open/close: subtle fade/zoom around **200ms**; hover uses gentle opacity/colour shifts, no exaggerated motion. Respect reduced-motion settings when available.
- Typical spacing increments: 4/6/8/10/12/16/20/24/32/40px. 32px large reading gaps, denser rail.

## VIS-07: Core app surfaces

### Header and story reader

- Flat header with book icon, brand, optional location breadcrumb and **truthful** save status plus Settings button.
- Story title in centred literary hierarchy. Individual passages appear as uninterrupted serif sections, not message bubbles.
- A user input preceding a passage may appear as a compact gold/italic sans intent line with a tiny uppercase mode marker; tiny monospaced hover turn marker at wide sizes is optional when grounded.
- Reading text may be directly editable when [IDEA-0003](../production/Direct%20Editable%20Prose%20Document.md) is implemented; gold edit marker and pending treatment are **not** evidence of canonical acceptance.
- A thin summary divider may mark omitted turns, but only when actual summarisation exists. No fictional filler.

### Provisional narrative candidate

- In the same reading flow after committed passages: blue dashed rectangular proposal box, small uppercase status, optionally a blue progress dot/caret and **blue outlined proposed-effect chips**.
- When an actual candidate is ready, show accept/retry/discard affordances **according to existing accepted commit semantics**; when in flight, show restrained progress and Stop.
- Only after valid acceptance through Go's atomic persistence contract may it become normal editorial prose with **green confirmed chips**.
- No simulated persisted save, connected model, turn count, source citation or generated response presented as real.

### Docked primary composer and pending overlays

- Four eventual user modes: **Do, Say, Story, Continue**, shown as compact **mutually exclusive controls**, 16px outline icons, 14px UI text, ~12px horizontal/6px vertical padding. Selected mode gold with modest glow; disabled mode ~35% opacity.
- Composer: ~16px inset, three-line input, 1px border, ~4px corners, 16px side/12px top padding, extra lower padding **~52px**, absolute inset **12px** 36px round gold send. Story mode may use **18px serif input**; Do/Say use functional sans. Continue can show a dashed noneditable explanatory surface instead of text.
- Active Playing As/character selection and optional compact advanced-controls shelf can occupy the row above input; shelf is a 12px-padded quiet outline with compact fields.
- **Functional precedence:** [B3-D07](../architecture/decisions/B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) and [B9-D16](../architecture/decisions/B9-D16%20-%20Basic%20Map%20Navigation%20and%20Shared%20Composer%20Commit%20Controls.md) require one shared **primary chat composer overlay** for pending manual changes, with Commit/Discard **over the action text input**, blocking chat input while pending. The reference kit's separate example *edit banner* may communicate status but **must not add a second map-local or story-local Commit bar**.
- The kit's illustrative helper text saying “Sending accepts the current provisional turn first” is **not automatic acceptance authority**. Existing Lorebound explicit confirmation and attempt/commit boundaries win. Do/Say remain disabled without selected Playing As; **C-D04 A** prioritises the first Story-mode vertical slice before other full modes.

### Context rail

- Persistent darker 320px desktop panel; sticky four icon-over-label tabs **Scene / Items / Lore / Context** with gold 2px underline. Small labels, dividers, 32px initial-only avatars and compact row actions.
- **Scene:** heading, atmosphere and compact character groups (In scene / Remote / In transit / Elsewhere / Unknown) when actually tracked. Active Playing As row gets subtle gold current marker; choosing a character updates all related selectors/views.
- **Items:** narrow actor selector, simple ruled inventory rows with small supporting details and understated empty/disabled state.
- **Lore:** 36px plus action next to compact search; two-line entries with small status dot, name/kind and truncated summary. Editing uses an internally scrolling structured dialog rather than giant cards.
- **Context:** small IBM Plex Mono used/total readout and **8px** stacked allocation bar with concise legend; **only genuine** token measurements, no sample values represented as live.
- Where a feature is not yet implemented or disabled, offer a truthful compact placeholder/disabled state; **do not create dummy canonical content to fill the reference layout**.
- These tab names are the visual starting point, not permission for unimplemented domain features or data mutation.

### Preferences, forms and dialog

- Central Settings dialog **576px** max; serif **24px** title; gold-underlined tabs (e.g. Appearance/Model) when relevant.
- Appearance: Dark/Bright/Midnight; Comfortable/Compact; reading ink Default/Parchment, Sepia, High contrast, Sage; Cormorant/Literata/IBM Plex Sans/Atkinson; **15–28px** prose slider. Live preview updates immediately; Reset to defaults without separate Apply.
- Default: **Dark**, **Comfortable**, **default/parchment ink**, **Cormorant**, **21px** prose.
- Structured editor dialog max **672px** with 1px form outlines, uppercase micro labels, conditional fields, segmented selections, compact pill tags and muted Cancel/gold Save. Dialog closes by X/Escape with focus trapping and restoration. Two-column fields collapse below 640px.
- Visual appearance preferences are **noncanonical UI settings**, not story-history events.

### Map integration

Apply the **same palette, type, borders and tab styling** to the accepted simple map when implemented. Its primary visual role is a distinct spatial canvas integrated into the same workspace/context navigation, not an elaborate cartography workstation.
- [B9-D24 revised B](../architecture/decisions/B9-D24%20-%20Basic%20Map%20Pointer%20Interaction%20Without%20Keyboard%20Controls.md): **no map-specific keyboard interaction**. Other story, form, modal and navigation keyboard access stays intact.
- [B9-D22 C](../architecture/decisions/B9-D22%20-%20No%20Visible%20Geographic%20Scale%20Indicator.md): **no visible scale bar**, although numeric scale remains internal.
- No extra map Commit toolbar, advanced GIS palette or new map-local authoring workflow. Existing shared composer overlay governs manual correction.
- This visual-design document does **not** revive deferred **B9-D12** spatial event/schema migrations.

## VIS-08: Appearance themes

**Dark (default)** is warm charcoal/gold. **Bright** is warm ivory with dark ink (base background `oklch(0.97 0.012 85)`, primary `oklch(0.55 0.13 60)`); **Midnight** is cooler blue-black (base background `oklch(0.15 0.02 260)`, primary `oklch(0.78 0.1 230)`). The uploaded kit leaves the warm radial gradient unchanged across appearance themes; preserve for closest fidelity, or record an explicit design deviation before changing it.

Separate `ink` overrides include Sepia, High contrast and Sage, with darker alternatives in Bright. Keep readable contrast without turning the app into a bright SaaS dashboard. Appearance changes update the visible workspace and preview immediately. Persist UI-only preferences where the accepted preferences implementation provides it.

## VIS-09: Fidelity and acceptance checklist

Future UI work must verify, and record **PASS / FAIL / NOT RUN**, at **390px, 768px, 1024px and 1440px** wide, testing Dark and Bright appearance at minimum:

1. Full-height layout, **48px** top bar, **320px** side rail at desktop, centred **≤672px** article, independent scrolling and fixed composer.
2. Story/World exclusive mobile switch below 1024px; breadcrumb absent below 768px; Settings text absent below 640px with named icon; forms and modes wrap/collapse.
3. Cormorant editorial type, IBM Plex Sans functional controls, IBM Plex Mono metrics; **21px/1.625** prose default and adjustable font/theme/ink/density settings when implemented.
4. Exact OKLCH tokens, faint top gradient, restrained one-pixel boundaries and selective gold glow; no generic floating-card dashboard.
5. Draft/proposal vs committed green confirmation; actual save/provider states and no sample data disguised as actual.
6. Composer mode selection, active-context consistency, disabled/focus/hover states, modal focus management and Escape. No disabling keyboard access to the **rest of the app** because the map does not have keyboard gestures.
7. Shared composer pending Commit/Discard semantics, not a new local map bar; accepted Turn/History requirements unchanged.
8. Text/layout overflow, truncation and wrapping; screen-reader discoverability of icon-only actions; reduced-motion handling.
9. No new canonical world operations, migration work or “implemented spec” claim from style alone.

For each UI change, document intentional departures and whether they are **design adaptation** or a **functional decision requiring separate approval**. The kit is a source-inspected design reference, **not a pixel-perfect screenshot baseline**; visual screenshot comparison to real browser output should be performed when the UI is implemented.

## Implementation and delivery boundary

This approved design style is **cross-cutting guidance for all 52 production ideas** and immediately relevant to the next Story-mode UI slice. It **does not** require all 52 features to appear in the first screen, authorise writing code in this documentation turn, override the current-only canonical story/typed-event/Go storage boundary, or reopen Pass B. The UI design can be applied incrementally as real functions become available.

**History:** 2026-11-03, user supplied a six-file design-only kit and explicitly requested Lorebound to follow its visual style. This design contract and supporting UI-state/palette documents record that instruction. Source file contents were inspected; no runtime UI test or implemented screenshots are claimed.
