---
id: "IDEA-0062"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-17"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Accessibility and Customisable Interface

## Idea
Provide adjustable story/map/sheet panels, accessible controls, keyboard shortcuts and layout preferences.

## Why this idea matters
A long-running interactive story may combine prose editing, travel maps, character sheets, inventory and optional mechanics panels. The interface must remain readable and navigable for different input methods, screen sizes and accessibility needs. Players should be able to focus on the story rather than wrestle with fixed panels or inaccessible controls. Baseline accessibility is a requirement for the standard interface, not an optional mode that users must discover.

## Accepted direction
- **Accessible interface foundation:** Build the normal Lorebound interface with understandable controls, meaningful labels, readable story text, visible keyboard focus, sensible focus management and operable navigation. Do not make fundamental accessibility contingent on enabling advanced layout customisation.
- **Keyboard usability:** Support operating essential story, editor, navigation and game-action controls with a keyboard. Keyboard shortcuts can improve efficiency but a full configurable shortcut scheme is not an immediate commitment.
- **Responsive layout and navigation:** Make story, maps and character/status sheets usable across desktop windows and smaller screens. When side-by-side panels become cramped, use an appropriate compact navigation or switchable view rather than requiring tiny columns or horizontal scrolling for key tasks. Exact breakpoint and mobile interaction patterns remain open.
- **Adjustable presentation:** Permit appropriately configurable story/map/sheet panels and relevant layout preferences, while deferring deep window-management features such as unrestricted docking, many preset workspaces and exhaustive shortcut remapping for further prioritisation.
- **Visibility follows enabled features:** Offer relevant panels and actions for the gameplay systems or modules actually enabled in an adventure. Do not clutter a story with irrelevant empty panels from disabled optional mechanics, and do not let UI visibility bypass capability permissions or validation.
- **UI preferences are not canonical gameplay events:** Store layout, panel visibility and readability preferences separately from the authoritative narrative/event/state timeline. Changing font size or panel arrangement must never generate a gameplay mutation or affect historical reconstruction.
- **Shared experience across distributions:** Preserve an accessible, keyboard-usable, lightweight interface with responsive behaviour in the Wails v3 headless localhost application's normal-browser UI, without a native WebView. Do not design for native-window controls alone.
- **Refinement remains open:** Precise desktop/mobile compositions, shortcuts, focus and editor interaction requirements, panel resizing/docking details, preference storage/location, accessibility evaluation criteria and timing of advanced customisations require later design and verification. Acceptance to staging is not implementation approval.

## Proposed behaviour
Give players a primary readable story workspace and clear ways to open relevant secondary views such as a map, inventory and character sheets. On larger windows, support an adjustable layout for applicable panels; on smaller windows, use suitable navigation patterns to keep the story and editing controls legible and usable. All essential controls remain keyboard-accessible with discernible labels and focus handling. Optional gameplay systems expose only their relevant UI panels and controls when enabled. Layout choices and accessibility preferences can be remembered independently from the story's canonical event history, subject to a storage/privacy decision to be refined.

## Alternatives and trade-offs
- **Accessible responsive baseline first (accepted priority):** A straightforward, consistent layout with readable text, keyboard-operable controls, visible focus and convenient views for story, map and sheets. It reduces interface complexity while serving more players.
- **Advanced dockable workspace (potential follow-on):** Free-form panel resizing, docking, detachable panes, extensive shortcut mapping and saved layout presets may benefit power users but introduce interaction, testing and persistence complexity. Not required in the initial release by this acceptance.
- **Fixed compact layout for MVP:** Could simplify initial delivery but must still be accessible, responsive and practical for the accepted major views. An inflexible layout that prevents useful navigation or readable story work does not meet the accepted baseline.

## Two-tab information panel and Lorebook shortcut (accepted refinement)
- **Two primary tabs in the character/info panel:** Provide a convenient, accessible panel with **Info** and **Settings** tabs so users can switch quickly between the selected character's information and adventure settings. The panel may adapt its placement/size on smaller screens, but the two destinations remain easily reachable; this is the selected baseline composition, **not** a commitment to arbitrary docking, a specific component library or never adding more tabs later.
- **Info tab follows explicit `Playing As`:** When the user changes their selected Lorebook character, the **Info** tab updates to show **that character's existing inventory, tracked status and known current location**, as available from enabled systems. Other characters may still be inspected in Lorebook. Missing fields must display as **unknown/unrecorded**, not falsely empty; selecting a character does not create or move any world records. Exactly which supporting fields to show and the no-selection presentation remain future UI refinements.
- **Settings tab includes character selection:** Put the adventure's established **`Playing As` selector** in the **Settings** tab of this same panel, rather than assuming an entirely separate settings sidebar. Every existing Lorebook character is eligible; Do/Say remain disabled if none is chosen. Existing `Add Character` navigation to Lorebook manual entry remains in the selector; saving characters never auto-selects or returns to story.
- **Immediate Lorebook access beside the composer, left-side drawer accepted:** Provide a clearly identifiable **Lorebook icon immediately to the LEFT of the story input field**. Activating it opens the editable **Lorebook in a drawer emerging from the LEFT edge**, keeping the story accessible/visible where viewport width permits. The drawer is a separate surface, **not a third Info/Settings tab**, and supports practical width adjustment plus an option to expand into a larger editing workspace. Exact widths, resizing affordances and expanded-view implementation remain for refinement.
- **Accessibility and responsive use:** Make both tabs and the Lorebook icon keyboard-operable, visibly focusable and accessible by name/tooltip. On narrow layouts preserve their convenient access and the intended association of the Lorebook shortcut with the composer while allowing appropriate responsive arrangement. UI switches are **presentation/selection actions**, not canonical turns or state mutation.

## Left-opening Lorebook drawer with asymmetric animation (accepted)
- **Entry point and direction:** The composer-adjacent Lorebook icon (immediately left of the input field) opens the Lorebook from the **left side of the story interface**. The Lorebook is an **editable left-side drawer**, not a required third Info/Settings tab or an always-full-page navigation. On suitable viewports, opening it leaves the story visible for reference; a **resizable width** and **expand-to-larger-workspace** option follow the accepted drawer direction. Exact dimensions, breakpoints, persistence of width and expanded-view mechanics remain open.
- **Two distinct opening phases, in order (explicit user design):** **Phase 1:** the drawer's **narrow leading sidebar/rail slides out from the left edge**. **Phase 2:** the **rest of the Lorebook drawer slides/reveals out from behind that first rail**, becoming the full usable content surface. Preserve a discernible rail-first, main-content-second sequence; do not collapse the opening into one uniform full-width slide or reverse the phase order.
- **Simple closing fade:** Closing the Lorebook uses **a simple fade-out** of the drawer, **not** a reversed two-stage rail/content exit animation. There is no forced staged collapse before it disappears. Animation timing, easing, exact rail width and whether any backdrop fades are not selected.
- **Accessibility and interruptions:** Both phases are presentation only and must not delay availability of semantic controls or corrupt unsaved editor input. Respect reduced-motion preferences by omitting or substantially simplifying the staged animation, retain visible focus/accessibility labels, provide a keyboard-operable close action, restore sensible focus to the initiating Lorebook shortcut, and avoid trapping the user or hiding story controls improperly. Exact interaction semantics for overlays and narrow screens remain to refine.
- **Noncanonical UI:** Opening, resizing, expanding or closing the Lorebook is **not a narrative turn**, lore edit, character selection, inventory operation or world-state event. Lorebook authoring continues through its ordinary separately validated/persisted paths.

## Dependencies and constraints
- [[Localhost Startup and Offline Mode]] (IDEA-0053) targets one statically built SvelteKit UI in Wails v3 headless Go server/normal-browser mode. Keyboard navigation and responsive rendering must work in both.
- [[Native Gameplay Capability Registry]] (IDEA-0047) and [[Optional RPG Mechanics Plugins]] (IDEA-0055) provide optional enabled operations/systems. Panels and direct controls must reflect enabled applicable capabilities and their permissions.
- [[Snapshots and Incremental State Rebuild]] (IDEA-0042) and [[Event-Sourced World History]] (IDEA-0039) require complete canonical adventure history. Purely presentational layout preferences must not be recorded as in-world state changes or affect replay.
- The accepted direction does not make skipped [[Text-to-Speech Story Playback]] (IDEA-0056) a dependency. Baseline accessibility must be addressed without presuming TTS.
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Originally assistant-proposed, then **explicitly accepted by the requesting user** with accessible baseline, responsive workspace, optional personalisation and separation of UI preferences from canonical story history.
- This note is an **accepted staging direction requiring refinement**. It is neither production-approved nor an implemented accessibility claim.

## Decisions and review history
- 2026-10-18 — **Explicit user approval and animation refinement:** The Lorebook opens as an **editable, resizable LEFT-side drawer** from the icon left of the story input, with an option for an expanded editing workspace. **Opening has two distinct phases:** a narrow sidebar/rail comes out first, then the main drawer body emerges from behind it. **Closing is a simple fade-out**, not the same steps reversed. Exact timing/easing, rail dimensions, responsive treatment and detailed focus mechanics remain for refinement; support reduced motion and preserve accessible navigation. Staging only, no code or production approval.
- 2026-10-18 — **Explicitly user-accepted interface refinement:** The character information panel has **two primary tabs, Info and Settings**. Info follows the chosen `Playing As` character's real **inventory/status/known location**, while Settings contains `Playing As` and other applicable configuration. A dedicated **Lorebook icon immediately left of the story input field** provides frequent direct access to the editable Lorebook (not a third mandatory panel tab). Only explicit player selection changes the actor; no lore/world changes result from switching tabs or characters. Exact visual component, responsive arrangement and empty-state content remain open. Accepted for staging only.
- 2026-10-17 — **Accepted runtime correction alignment:** Replaces the dual desktop/headless Wails direction with **Wails v3 headless localhost Go server only**, used through the normal browser, distributed as Windows/macOS/Linux server executables. No native WebView or separate npm player runtime. Docker is the separate unaccepted candidate [[Optional Docker Distribution]] (IDEA-0065). Remaining design specifics stay in staging.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-17 — **Explicitly accepted by the requesting user:** Accessible, keyboard-usable and responsive interface foundations with clear controls, readable text, focus management and practical navigation among story, map and character sheets on desktop and smaller screens. Support adjustable panels and layout preferences; keep advanced docking, exhaustive shortcuts and presets for refinement or later phases. Show panels based on enabled gameplay systems and persist preferences separately from canonical story/world history. Leave exact layouts, shortcut mappings, preference persistence and accessibility criteria open. Moved to staging, not production.
