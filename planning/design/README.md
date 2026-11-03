---
type: design-index
status: current
created: "2026-11-03"
updated: "2026-11-03"
tags:
  - planning/design
  - visual-style
---

# Lorebound Design Reference

**The user has explicitly requested that the finished Lorebound application follow the look and feel of the uploaded `lorebound-design-only-kit(1).zip` (2026-11-03).** These planning files translate that kit into operative, implementation-accessible visual guidance.

## Start here

1. **[Lorebound Command Citadel Visual Design Contract](./Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md)**: binding visual identity, dimensions, typography, semantic colours, layout, components, responsive behaviour, accepted Lorebound adaptation and conformance checklist.
2. **[Lorebound UI Interaction and State Mapping](./Lorebound%20UI%20Interaction%20and%20State%20Mapping.md)**: visual/feedback states for modes, pending narrative, accepted changes, forms, map, contexts, dialogs, errors and preferences; functional precedence clarified.
3. **[palette-and-presets.css](./palette-and-presets.css)**: portable source-exact OKLCH colour system, Dark/Bright/Midnight, ink choices and fonts; **planning reference only**, not an applied runtime stylesheet.

### Full uploaded source-kit structure

The supplied ZIP contains `README.md` (detailed visual spec), `ALL_IN_ONE.md` (combined duplicate of reference/prose/prompt), `RECREATION_PROMPT.md` (general design transfer prompt), `UX_INTERACTION_MAP.md` (observable control matrix), `design-tokens.json` (portable tokens) and `palette-and-presets.css`. The above documents make the operative design accessible within GitHub. **They do not claim the full uploaded ZIP or every source file was copied verbatim into this directory.** The source kit cites inspected `Levelleor/lorebound-command-citadel` revision `0be367d3886e803207e1bc582cca4fb8fc50ac8c`, not a screenshot-based pixel audit.

### Core visual intent

Warm charcoal literary desktop console, old-style serif reading column (Cormorant Garamond), compact IBM Plex Sans controls, IBM Plex Mono metrics, antique gold active/primary, blue dashed pending, green checks for committed, restrained red stop. The 48px full-width header, max-672px centred reading column, 320px darker contextual rail ≥1024px and bottom-docked composer are the principal composition constraints.

Visual choices apply **throughout the 52 production-approved ideas as features are implemented**, starting with the Story-mode slice. They do not imply the features already exist, require immediate all-at-once development, or overrule accepted B1–B9/Pass C functional decisions. **Deferred B9-D12 spatial migrations are not approved.** Validate the visual layout at 390/768/1024/1440px and with Dark/Bright themes when the UI exists.
