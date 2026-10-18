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
- **Shared experience across distributions:** Preserve an accessible, keyboard-usable, lightweight interface with responsive behaviour in both the Wails v3 desktop application and its headless localhost browser experience. Do not design for native-window controls alone.
- **Refinement remains open:** Precise desktop/mobile compositions, shortcuts, focus and editor interaction requirements, panel resizing/docking details, preference storage/location, accessibility evaluation criteria and timing of advanced customisations require later design and verification. Acceptance to staging is not implementation approval.

## Proposed behaviour
Give players a primary readable story workspace and clear ways to open relevant secondary views such as a map, inventory and character sheets. On larger windows, support an adjustable layout for applicable panels; on smaller windows, use suitable navigation patterns to keep the story and editing controls legible and usable. All essential controls remain keyboard-accessible with discernible labels and focus handling. Optional gameplay systems expose only their relevant UI panels and controls when enabled. Layout choices and accessibility preferences can be remembered independently from the story's canonical event history, subject to a storage/privacy decision to be refined.

## Alternatives and trade-offs
- **Accessible responsive baseline first (accepted priority):** A straightforward, consistent layout with readable text, keyboard-operable controls, visible focus and convenient views for story, map and sheets. It reduces interface complexity while serving more players.
- **Advanced dockable workspace (potential follow-on):** Free-form panel resizing, docking, detachable panes, extensive shortcut mapping and saved layout presets may benefit power users but introduce interaction, testing and persistence complexity. Not required in the initial release by this acceptance.
- **Fixed compact layout for MVP:** Could simplify initial delivery but must still be accessible, responsive and practical for the accepted major views. An inflexible layout that prevents useful navigation or readable story work does not meet the accepted baseline.

## Dependencies and constraints
- [[Localhost Startup and Offline Mode]] (IDEA-0053) targets one statically built SvelteKit UI in Wails v3 desktop and headless Go server/browser modes. Keyboard navigation and responsive rendering must work in both.
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
- [ ] Core story and gameplay navigation is operable without a pointer using understandable, labelled controls and visible focus.
- [ ] Focus order and focus restoration remain sensible after opening/closing panels, dialogs and action confirmations.
- [ ] Story text and editor controls remain readable on representative desktop and smaller-screen viewports without hiding essential actions.
- [ ] Players can reach story, map and relevant character/status views using responsive navigation appropriate to the available space.
- [ ] Supported panel visibility or layout adjustments can be made without mutating canonical story/world state or generating gameplay events.
- [ ] Only relevant panels and operations for enabled systems are offered, while disabled features do not clutter the interface or bypass permissions.
- [ ] Keyboard accessibility, core responsive behaviour and a smooth story-editing experience work in Wails v3 desktop and headless localhost browser modes.
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
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-17 — **Explicitly accepted by the requesting user:** Accessible, keyboard-usable and responsive interface foundations with clear controls, readable text, focus management and practical navigation among story, map and character sheets on desktop and smaller screens. Support adjustable panels and layout preferences; keep advanced docking, exhaustive shortcuts and presets for refinement or later phases. Show panels based on enabled gameplay systems and persist preferences separately from canonical story/world history. Leave exact layouts, shortcut mappings, preference persistence and accessibility criteria open. Moved to staging, not production.
