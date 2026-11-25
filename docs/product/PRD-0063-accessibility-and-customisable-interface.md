---
id: PRD-0063
type: prd
status: accepted
related:
- NOTE-0060
- PRD-0001
- NOTE-0009
- NOTE-0011
---

# Accessibility and Customisable Interface

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0062](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Accessibility%20and%20Customisable%20Interface.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-17; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S04**. First milestone: **M8**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Goals

Provide responsive reading and editing comfort, accessible state/control cues, keyboard/focus and readable status, plus supported theme, font/ink and density preferences aligned with Command Citadel. Preserve the approved map-pointer-only boundary. Verified Story geometry and bundled fonts do not certify the appearance controls, full accessibility or other platforms.

## Accepted direction
- **Accessible interface foundation:** Build the normal Lorebound interface with understandable controls, meaningful labels, readable story text, visible keyboard focus, sensible focus management and operable navigation. Do not make fundamental accessibility contingent on enabling advanced layout customisation.
- **Keyboard usability:** Support operating essential story, editor, navigation and game-action controls with a keyboard. Keyboard shortcuts can improve efficiency but a full configurable shortcut scheme is not an immediate commitment.
- **Responsive layout and navigation:** Make story, maps and character/status sheets usable across desktop windows and smaller screens. When side-by-side panels become cramped, use an appropriate compact navigation or switchable view rather than requiring tiny columns or horizontal scrolling for key tasks. Exact breakpoint and mobile interaction patterns remain open.
- **Adjustable presentation:** Permit appropriately configurable story/map/sheet panels and relevant layout preferences, while deferring deep window-management features such as unrestricted docking, many preset workspaces and exhaustive shortcut remapping for further prioritisation.
- **Visibility follows enabled features:** Offer relevant panels and actions for the gameplay systems or modules actually enabled in an adventure. Do not clutter a story with irrelevant empty panels from disabled optional mechanics, and do not let UI visibility bypass capability permissions or validation.
- **UI preferences are not canonical gameplay events:** Store layout, panel visibility and readability preferences separately from the authoritative narrative/event/state timeline. Changing font size or panel arrangement must never generate a gameplay mutation or affect historical reconstruction.
- **Shared experience across distributions:** Preserve an accessible, keyboard-usable, lightweight interface with responsive behaviour in the Wails v3 headless localhost application's normal-browser UI, without a native WebView. Do not design for native-window controls alone.
- **Refinement remains open:** Precise desktop/mobile compositions, shortcuts, focus and editor interaction requirements, panel resizing/docking details, preference storage/location, accessibility evaluation criteria and timing of advanced customisations require later design and verification. Acceptance to staging is not implementation approval.

## Dependencies and constraints
- Localhost Startup and Offline Mode (IDEA-0053) targets one statically built SvelteKit UI in Wails v3 headless Go server/normal-browser mode. Keyboard navigation and responsive rendering must work in both.
- Native Gameplay Capability Registry (IDEA-0047) and Optional RPG Mechanics Plugins (IDEA-0055) provide optional enabled operations/systems. Panels and direct controls must reflect enabled applicable capabilities and their permissions.
- Snapshots and Incremental State Rebuild (IDEA-0042) and Event-Sourced World History (IDEA-0039) require complete canonical adventure history. Purely presentational layout preferences must not be recorded as in-world state changes or affect replay.
- The accepted direction does not make skipped Text-to-Speech Story Playback (IDEA-0056) a dependency. Baseline accessibility must be addressed without presuming TTS.
- No specific UI component library, shortcut scheme, breakpoint rules or preference database has been selected, and this staging note is not a production or implemented spec.

## Open questions
- How should editor, map and character/status sheets coexist on narrow desktop windows and mobile screens?
- What minimum keyboard interaction and focus behaviour should be tested for editing, navigation, contextual panels, mod operations and dialog confirmations?
- Which readability options should ship initially, and how should system text scaling and reduced-motion preferences be respected?
- Should panel sizes/visibility be per device, per user installation or per adventure, and where do UI preferences persist?
- Which configurable layouts are genuinely necessary early versus advanced dockable workspaces later?
- How should enabled/disabled modules change navigation structure without moving essential controls unpredictably?
- Which accessibility standards or practical test matrix should be used, including keyboard-only and assistive-technology checks?

## Draft acceptance criteria
- [ ] Lorebook and Settings `Playing As` remain operable and distinguishable when multiple characters have unknown names, using descriptive or neutral disambiguated labels with stable underlying IDs.
- [ ] A display label does not assert a canonical personal name or promote rumours into fact; revealing an established name updates the label without changing `Playing As` selection or character history.
- [ ] UI design can refer consistently to **Lorebound UI** versus **Lore Engine** without suggesting a separate native/windowed engine, or relocating browser-side gameplay logic to Go.
- [ ] A user who closed every Lorebound tab can invoke the application shortcut to reach the currently running headless server at its correct URL, including when it is on a fallback port, and navigate to Settings → Quit.
- [ ] The initial experience requires no native tray/menu-bar icon and does not make users memorize the server port; port changes must not strand the UI.
- [ ] **Quit Lorebound** is discoverable and keyboard-accessible in the information panel's **Settings tab**, with a meaningful label that distinguishes quitting the server from closing tabs or switching adventures.
- [ ] Quit stops the headless server through an authorised action without requiring macOS/Linux/Windows tray integrations; any future native tray is a separate approval.
- [ ] With the browser closed but the server still active, relaunch returns to the app and its Settings Quit command; quitting does not itself create story events or mutate canonical lore.
- [ ] Activating the Lorebook icon **immediately left of the story input** opens an **editable drawer from the LEFT edge**, with resizable width and a way to expand the editor for detailed work where layout permits.
- [ ] **Opening animation visibly has two ordered phases:** first a slim Lorebook sidebar/rail comes out, then the main drawer content emerges **from behind that rail**.
- [ ] **Closing fades out simply**, without reversing the two-phase opening or requiring separate rail/content closing movements.
- [ ] Reduced-motion users can open/close the same Lorebook without forced staged movement; keyboard and focus/close handling remain accessible and editing content is not lost due to animation.
- [ ] Drawer movement, resizing and expansion are presentation-only; neither story state nor explicit `Playing As` selection changes solely through the drawer.
- [ ] The information panel exposes **Info** and **Settings** tabs, accessible via keyboard and appropriately labelled; `Playing As` is available on Settings.
- [ ] The **Info** tab reflects the **explicitly selected** character's authoritative inventory, tracked status and known location (where enabled) and updates on selection changes **without mutating character/world state**.
- [ ] A character's unrecorded inventory/status/location stays **unknown**, not converted into an established empty or default value. Information for non-selected characters remains inspectable in Lorebook.
- [ ] A **Lorebook icon immediately LEFT of the story input field** opens Lorebook directly and stays a convenient, accessible path during repeated story interaction, without adding a mandatory third tab to the information panel.
- [ ] The interface remains usable with **no selected/available characters**: Info has an appropriate non-invented empty/no-selection presentation, Story/Continue work, and Do/Say remain disabled until a choice is made.
- [ ] Core story and gameplay navigation is operable without a pointer using understandable, labelled controls and visible focus.
- [ ] Focus order and focus restoration remain sensible after opening/closing panels, dialogs and action confirmations.
- [ ] Story text and editor controls remain readable on representative desktop and smaller-screen viewports without hiding essential actions.
- [ ] Players can reach story, map and relevant character/status views using responsive navigation appropriate to the available space.
- [ ] Supported panel visibility or layout adjustments can be made without mutating canonical story/world state or generating gameplay events.
- [ ] Only relevant panels and operations for enabled systems are offered, while disabled features do not clutter the interface or bypass permissions.
- [ ] Keyboard accessibility, core responsive behaviour and a smooth story-editing experience work in the normal browser using Wails v3 headless localhost.
- [ ] Advanced docking, extensive shortcut remapping and preset systems are optional follow-on features rather than mandatory first-release requirements.
- [ ] Exact layout breakpoints, shortcuts, preferences persistence model and accessibility verification standards are resolved during refinement.

## Supporting detail

See [NOTE-0060](../knowledge/inbox/NOTE-0060-prd-0063-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
