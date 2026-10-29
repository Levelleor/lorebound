---
id: "IDEA-0031"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Characters Inventory Equipment and Anatomy Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]"]
related: ["[[Shared PC and NPC Character Entities]]", "[[Slot-Based Equipment and Body Diagram]]", "[[Optional Mature Reproductive Anatomy Fields]]"]
tags:
  - planning/idea
---
# Configurable Anatomy and Transformations

## Latest approved narrative-first event semantics — 2026-10-28

The current engine ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)) treats anatomy changes and equipment as **accepted declarative facts**, not simulation proofs. A `SetAnatomyFeature` assertion records a changed limb/status even without earlier fictional change history; if the change invalidates an equipment assignment, the existing user-approved **automatic, grounded equipment disposition** may emit further assertions in that same coherent batch for the **same item ID**. If no placement is grounded, leave the holder unknown or otherwise explicitly unresolved; never fabricate a destination, duplicate gear or reject accepted story solely for a missing cause.


## Idea
Track body parts, missing limbs, injuries, prosthetics and transformations for diverse species.

## Why this idea matters
Physical changes should persist and affect equipment availability.

## Accepted direction
- **Free-form, text-first anatomy for any character:** Characters may have editable anatomy records composed of arbitrary named body features and human-readable textual descriptions/conditions, without a mandatory predefined anatomical hierarchy or fixed species/body-type schema. This applies equally to PCs and NPCs.
- **Any body feature can be represented:** Players may add, rename, describe, update, reorganise or remove entries for broad body regions and specific features such as limbs, wings, horns, lips, hair, breasts, genitals, prosthetics or wholly fictional anatomy. Anatomical entries are not restricted to conventional equipment slots or to a human body plan. They need not be defined in advance.
- **Editable starter template, never mandatory:** Offer an optional basic set of body features as a convenience when starting a story/character. At story setup players can remove, replace or customise every suggested entry, choose a sparse or empty record, and continue editing anatomy later. The starter template must not silently assert anatomy not established for that character.
- **Text-based baseline:** Each custom feature can at least hold a player-editable name and plain-language description/status. Do not require generated artwork, a complex hierarchical body graph, mandatory numerical values or a rigid reproductive/sex-specific schema merely to record anatomy. Optional structured metadata or links may later help enforce physical/equipment constraints but must preserve full text flexibility.
- **Persistent physical state:** Track known body-part conditions, injuries, absent/missing limbs, prosthetics, additions/removals, transformations and relevant temporary or lasting changes across committed narrative history. Distinguish unknown/unrecorded anatomy from explicitly known absent or present features.
- **Grounded declarative outcomes:** Record accepted narrative/player anatomy facts as typed `Set/Clear` assertions for stable character/anatomy IDs. Validate representable current fields and coherent equipment projections, not whether a preceding fictional transformation was mechanically possible. Player edits retain the explicit pending-commit gate.
- **Shared stable identity across forms:** A character's ID persists through species differences, body changes and transformations; don't replace the character with a new identity merely due to anatomy edits.
- **Validated automatic equipment consequences (user decision 2026-10-23):** After a confirmed anatomy change invalidates an equipped slot (for example, a sword held in a now-missing hand), the subsequent validator may **automatically unequip, reassign or move that same item** to a grounded and valid placement. This is a legitimate coherent response, not prohibited fictional teleportation. Do not demand routine manual equipment repair, duplicate/delete an item, invent a destination or partially commit mismatched anatomy/equipment. The exact default disposition if several or no placements are valid remains for refinement.
- **No assumption of universal body parts:** Gender identity, character identity and physical anatomy must not be inferred from one another. Entry presence, absence and details are player/story-defined.
- **Separate mature-feature controls:** [[Optional Mature Reproductive Anatomy Fields]] (IDEA-0032) is a **separate unaccepted Inbox idea** proposing per-story mature-content controls and optional reproductive/sex-related fields. The accepted **general free-form data representation** must remain capable of describing requested body features; this decision does not yet approve IDEA-0032's content setting, default visibility, opt-in mechanics or disclosure/context rules.
- **Optional in context:** Current relevant anatomy and transformations may be included in narration context subject to the accepted context builder's source and token controls. Do not automatically expose every private/descriptive anatomy entry in every prompt; exact selection/default behaviour remains open.

## Proposed behaviour
Create an optional anatomy panel for any stable character entity, without PC/NPC or Playable distinctions. At adventure or character setup, offer a minimal editable set of suggested body features; the player may discard all of them or add their own. Model the baseline as named, free-form text entries with optional per-feature current condition, change/provenance information and, where needed, links to equipment-eligible areas. Users can add, edit, rename and delete features such as limbs, lips, hair, breasts, genitals, tails, wings or invented organs, without being forced to adopt a fixed taxonomy or mandatory content-specific schema. Distinguish unknown data from an explicitly absent feature. When committed validated story outcomes change anatomy, keep the accepted current record consistent while preserving history/revision traceability. Allow future optional metadata for mechanical consequences, but don't force complex anatomy graphs or images onto users who only need descriptions.

## Alternatives and trade-offs
The user **selected free-form text as the baseline** rather than a required hierarchical anatomy graph. Individual named text records can be simple to author and custom-tailor, including unusual anatomy and cosmetic features. A fully linked anatomy graph could improve automatic equipment eligibility, injury propagation and complex partial-body transformations, but carries additional modelling, maintenance and UI complexity; any future machine-readable relationships should be optional additions, not restrictions on what features may be described. A minimal starter template improves convenience, while truly blank custom anatomy avoids imposing assumptions; offer both. The separately unaccepted IDEA-0032 may introduce optional mature-field visibility/context controls, not a required restriction on all general anatomy representation.

## Universal anatomy by character identity
- **Accepted IDEA-0026 direction:** All characters are one kind, regardless of who the player temporarily chooses via Settings `Playing As`; optional anatomy attaches to the real character ID and has no PC/NPC or Playable-specific category. A change of actor selection cannot alter anatomy or history.

## Dependencies and constraints
- Character identities are provided by accepted [[Shared PC and NPC Character Entities]] (IDEA-0026). Anatomy references should remain stable as descriptive entries or conditions change.
- Must interoperate with accepted [[Slot-Based Equipment and Body Diagram]] (IDEA-0030), [[Customisable Character Status Sheets]] (IDEA-0027), and [[Automatic Character Sheet Tracking]] (IDEA-0064), without treating anatomy and equipment descriptions as independent conflicting sources of canonical physical state.
- Anatomical structures are **extensible and text-first**. Even if some anatomy metadata is later structured for validation, that must not prohibit custom features or force a predetermined list of body parts on every character.
- A starter template is optional and fully editable/removable at story start; no anatomy is inferred as factual solely from the template or the character's gender identity.
- Missing or not-yet-recorded features remain unknown; explicitly removed or absent parts are known absent. Deleted configuration/template entries should not be misinterpreted as in-world amputation, and in-world loss should be represented as a validated story-state change.
- Generated physical-state changes **and validated automatic equipment consequences** pass the shared event/transaction boundary together, preserving stable item identity, unique custody and historical edit/Undo semantics. A player-authoritative anatomy change must not be rejected merely to avoid having to adjust equipment.
- Body-feature details can be sensitive. Exposure and selection in AI context should be controllable and inspectable under accepted [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024). Mature-specific rules, age gating, visibility and privacy details from IDEA-0032 remain separately unaccepted.
- Do not claim that keeping free-form descriptions is automatically sufficient for all complex injury, prosthetic and equip-compatibility validation. How to make it robust is refinement work.
- No artwork or image generation is required to describe anatomy.

## Open questions
- How should arbitrary free-form feature entries connect to equipment slots or physical constraints without constraining custom text?
- Does deleting an anatomy entry mean removing a field from the sheet, or explicitly asserting that a body feature was lost/removed? What UX makes that distinction clear?
- What basic starter-template entries, if any, should be offered for particular character/body types, and should template selection be optional at creation?
- How should the user distinguish known-present, known-absent, unknown and temporarily transformed feature states?
- How should prose descriptions and optional structured conditions represent partial limbs, injury severity, prosthetics and temporary or reversible transformations?
- **Resolved policy 2026-10-23:** Validated anatomy changes may automatically reassign or relocate incompatible equipment. Which known destination to prefer, and how to represent genuinely unresolved dispositions without fabricating state, remains a technical decision.
- How will anatomy edits and generated event updates reconcile on historical revision/undo?
- When should anatomy entries, particularly intimate details, be requested, selected or transmitted in the narrator's context? Mature-specific rules are a separate IDEA-0032 decision.
- Which optional machine-readable relationships improve complex anatomy handling without becoming a required hierarchy?

## Draft acceptance criteria
- [ ] All characters can have persistent, editable **free-form text-based** anatomy records with arbitrary player-defined feature names and descriptions.
- [ ] A new story/character can start with a basic editable anatomy template or with no predefined feature list; all starter entries may be removed or changed at setup.
- [ ] Users can add, edit, rename and remove custom features including cosmetic and intimate anatomy, without requiring a fixed list of allowed body parts or generated art.
- [ ] Removing a form field/unused template entry is distinguishable from an in-world event that removes a body part.
- [ ] Recorded anatomy distinguishes unknown/not recorded, explicitly absent and present/changed physical features.
- [ ] Persistent injuries, missing limbs, prosthetics and transformations can be represented consistently for different species or body configurations.
- [ ] Physical-state changes proposed from generated gameplay require validation before changing canonical anatomy.
- [ ] Stable character identity persists through physical transformations.
- [ ] Changing an equipped body region can automatically move/reassign a unique equipped item when a valid grounded disposition is determined by validation, without duplicating, deleting, inventing a remote location or requiring routine player approval. Preserve coherent atomic history; exact destination precedence remains open.
- [ ] The model can use relevant current anatomy in context within token and player-selection controls, without always including every entry.
- [ ] The idea does not require a hierarchical body graph or generated images.
- [ ] Per-story mature-mode gating and visibility controls proposed by unaccepted IDEA-0032 are not considered accepted through this decision.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. User-origin idea, explicitly accepted for staging with additional requirements for fully free-form, text-based anatomy and removable basic starter entries.
- **This is staging, not production approval or implementation.** Automated physical constraints, schema representation and the independent mature-settings idea require further review.

## Decisions and review history

- 2026-10-23 — **User resolved A-18:** When a player changes anatomy and validation finds a sword or other equipped item should move because the hand/slot no longer exists, let the validator move it. This authorises valid automatic consequential equipment correction, not arbitrary invented destinations or duplication. Staging clarification only; no fixed inventory/drop destination chosen.
- 2026-10-18 — **Accepted one-character-kind dependency:** Optional anatomy belongs to any actual character regardless of temporary Do/Say selection, with no PC/NPC or Playable category. Staging unchanged.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user, with added requirements:** Accept configurable anatomy and physical transformations, and make the record **entirely free form and text-based**, with removable basic entries on story creation and the ability to add arbitrary anatomy features such as genitals, lips, hair and breasts when desired. Keep character and world-state validation and equipment links coherent. IDEA-0032 was identified as a separate unaccepted candidate for optional mature-specific content controls, not silently bundled into this acceptance. Moved to staging for refinement only.

- 2026-10-28 — **User-directed architecture supersession:** Explicitly adopted narrative-first declarative state assertions, replacing simulation-style event preconditions; see [B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). Prior contrary statements remain only as original decision history; not current operative guidance. Still staging; no implementation/promotion.
