---
type: architecture
status: promotion-verified
phase: "C"
created: "2026-11-03"
updated: "2026-11-03"
tags:
  - planning/architecture
  - pass-c
  - promotion-audit
---

# Pass C — All accepted ideas promoted to production

## Explicit approval and scope

On **2026-11-03**, the requesting user explicitly asked: **“i merged the branch, please run through the staging ideas, I want to move all of them to production now, instead of only 4.”**

PR #3 Gate 0 was confirmed merged. The 50 remaining original staging ideas were each checked for a stable distinct `IDEA-` identifier, `status: staging`, `accepted_at` and `accepted_by`. All 50 passed. Their original notes were moved to `planning/production/`, with `status: production`, promotion `approved_at`/`approved_by`, a current-stage clarification and a dated promotion history entry. The previous two production ideas, IDEA-0051 and IDEA-0053, remain unchanged.

**Expected inventory following this promotion:** **52 production ideas, zero staging ideas, zero newly implemented specs.**

**Critical meaning:** Production is an explicitly approved implementation-readiness stage. The transition **does not** mean each full feature is coded, tested or deployed, and it does not itself authorise implementing all features at once. Later approved B1–B9 and Pass C decisions govern whenever older historical proposals differ. **B9-D12 spatial migrations remain deferred and are not authorised by this promotion.** Gate 0 implementation evidence remains separate and only covers its technical foundation.

## Fifty promotions

| Original ID | Original idea note in production | Approved |
| --- | --- | --- |
| IDEA-0001 | [Single-Player Account-Free Experience](../production/Single-Player%20Account-Free%20Experience.md) | 2026-11-03 |
| IDEA-0002 | [Freeform Player Action Modes](../production/Freeform%20Player%20Action%20Modes.md) | 2026-11-03 |
| IDEA-0003 | [Direct Editable Prose Document](../production/Direct%20Editable%20Prose%20Document.md) | 2026-11-03 |
| IDEA-0004 | [Retry Undo and Alternative Continuations](../production/Retry%20Undo%20and%20Alternative%20Continuations.md) | 2026-11-03 |
| IDEA-0005 | [Adventure Save and Export Management](../production/Adventure%20Save%20and%20Export%20Management.md) | 2026-11-03 |
| IDEA-0006 | [Quick Start and Custom Story Openings](../production/Quick%20Start%20and%20Custom%20Story%20Openings.md) | 2026-11-03 |
| IDEA-0007 | [Character Creation and Starting Choices](../production/Character%20Creation%20and%20Starting%20Choices.md) | 2026-11-03 |
| IDEA-0008 | [Reusable Scenario Templates and Placeholders](../production/Reusable%20Scenario%20Templates%20and%20Placeholders.md) | 2026-11-03 |
| IDEA-0010 | [Narration Style and Perspective Controls](../production/Narration%20Style%20and%20Perspective%20Controls.md) | 2026-11-03 |
| IDEA-0011 | [Manual Generation Branches](../production/Manual%20Generation%20Branches.md) | 2026-11-03 |
| IDEA-0012 | [Cloud LLM Provider Connectors](../production/Cloud%20LLM%20Provider%20Connectors.md) | 2026-11-03 |
| IDEA-0013 | [Local LLM Server Connections](../production/Local%20LLM%20Server%20Connections.md) | 2026-11-03 |
| IDEA-0014 | [Provider Connection Profiles and Discovery](../production/Provider%20Connection%20Profiles%20and%20Discovery.md) | 2026-11-03 |
| IDEA-0015 | [Model-Capability-Aware Controls](../production/Model-Capability-Aware%20Controls.md) | 2026-11-03 |
| IDEA-0016 | [Sampling Presets and Advanced Parameters](../production/Sampling%20Presets%20and%20Advanced%20Parameters.md) | 2026-11-03 |
| IDEA-0017 | [One-Model Task Routing](../production/One-Model%20Task%20Routing.md) | 2026-11-03 |
| IDEA-0018 | [Configurable Generation Pipeline Strategies](../production/Configurable%20Generation%20Pipeline%20Strategies.md) | 2026-11-03 |
| IDEA-0019 | [Streaming Cancellation and Generation Diagnostics](../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) | 2026-11-03 |
| IDEA-0020 | [Entity-Based Lorebook](../production/Entity-Based%20Lorebook.md) | 2026-11-03 |
| IDEA-0021 | [Conditional Lorebook Activation](../production/Conditional%20Lorebook%20Activation.md) | 2026-11-03 |
| IDEA-0022 | [Automatic Long-Term Story Summaries](../production/Automatic%20Long-Term%20Story%20Summaries.md) | 2026-11-03 |
| IDEA-0023 | [Episodic Memory Retrieval](../production/Episodic%20Memory%20Retrieval.md) | 2026-11-03 |
| IDEA-0024 | [Token-Budgeted Context Builder and Inspector](../production/Token-Budgeted%20Context%20Builder%20and%20Inspector.md) | 2026-11-03 |
| IDEA-0025 | [Author Notes and Persistent Story Instructions](../production/Author%20Notes%20and%20Persistent%20Story%20Instructions.md) | 2026-11-03 |
| IDEA-0026 | [Shared PC and NPC Character Entities](../production/Shared%20PC%20and%20NPC%20Character%20Entities.md) | 2026-11-03 |
| IDEA-0027 | [Customisable Character Status Sheets](../production/Customisable%20Character%20Status%20Sheets.md) | 2026-11-03 |
| IDEA-0029 | [Persistent Items and Inventory Transfers](../production/Persistent%20Items%20and%20Inventory%20Transfers.md) | 2026-11-03 |
| IDEA-0030 | [Slot-Based Equipment and Body Diagram](../production/Slot-Based%20Equipment%20and%20Body%20Diagram.md) | 2026-11-03 |
| IDEA-0031 | [Configurable Anatomy and Transformations](../production/Configurable%20Anatomy%20and%20Transformations.md) | 2026-11-03 |
| IDEA-0033 | [Hierarchical World Locations](../production/Hierarchical%20World%20Locations.md) | 2026-11-03 |
| IDEA-0034 | [Character Presence and Current Scene](../production/Character%20Presence%20and%20Current%20Scene.md) | 2026-11-03 |
| IDEA-0035 | [Configurable Travel Graph Rules](../production/Configurable%20Travel%20Graph%20Rules.md) | 2026-11-03 |
| IDEA-0036 | [AI World Discovery and Expansion](../production/AI%20World%20Discovery%20and%20Expansion.md) | 2026-11-03 |
| IDEA-0037 | [Zoomable Node Map Canvas](../production/Zoomable%20Node%20Map%20Canvas.md) | 2026-11-03 |
| IDEA-0038 | [Persistent Location State and Travel Interactions](../production/Persistent%20Location%20State%20and%20Travel%20Interactions.md) | 2026-11-03 |
| IDEA-0039 | [Event-Sourced World History](../production/Event-Sourced%20World%20History.md) | 2026-11-03 |
| IDEA-0040 | [Versioned Text Blocks and Revision IDs](../production/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md) | 2026-11-03 |
| IDEA-0041 | [Historical Edit Confirmation and Bulk Truncation](../production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md) | 2026-11-03 |
| IDEA-0042 | [Snapshots and Incremental State Rebuild](../production/Snapshots%20and%20Incremental%20State%20Rebuild.md) | 2026-11-03 |
| IDEA-0044 | [Deterministic Adventure Coordinator](../production/Deterministic%20Adventure%20Coordinator.md) | 2026-11-03 |
| IDEA-0045 | [LLM State Interpreter and Proposed Operations](../production/LLM%20State%20Interpreter%20and%20Proposed%20Operations.md) | 2026-11-03 |
| IDEA-0046 | [Typed Tool Rejection and Narrative Repair](../production/Typed%20Tool%20Rejection%20and%20Narrative%20Repair.md) | 2026-11-03 |
| IDEA-0047 | [Native Gameplay Capability Registry](../production/Native%20Gameplay%20Capability%20Registry.md) | 2026-11-03 |
| IDEA-0050 | [Structured UI Game Actions](../production/Structured%20UI%20Game%20Actions.md) | 2026-11-03 |
| IDEA-0052 | [Backups Export and Storage Quotas](../production/Backups%20Export%20and%20Storage%20Quotas.md) | 2026-11-03 |
| IDEA-0055 | [Optional RPG Mechanics Plugins](../production/Optional%20RPG%20Mechanics%20Plugins.md) | 2026-11-03 |
| IDEA-0061 | [Lorebound Branding and Engine Split](../production/Lorebound%20Branding%20and%20Engine%20Split.md) | 2026-11-03 |
| IDEA-0062 | [Accessibility and Customisable Interface](../production/Accessibility%20and%20Customisable%20Interface.md) | 2026-11-03 |
| IDEA-0064 | [Automatic Character Sheet Tracking](../production/Automatic%20Character%20Sheet%20Tracking.md) | 2026-11-03 |
| IDEA-0066 | [AI-Generated Starting Lorebook and World](../production/AI-Generated%20Starting%20Lorebook%20and%20World.md) | 2026-11-03 |

## Implementation order and no retroactive approvals

The user previously preferred the smallest complete Story-mode slice first, followed by further functionality according to dependency. **All ideas being in production does not mean they must be implemented simultaneously** or invalidate C-D01–D12. Before marking any idea fully implemented, use code/tests and the normal `production → specs/archive` evidence gate. Historic `planning/staging/` paths in Pass A audit documents are prior-stage provenance, not present file locations.

## Verification after promotion and link repair — 2026-11-03

- Confirmed **0** remaining original `planning/staging/*.md` ideas and **52** `planning/production/*.md` ideas on `main`.
- Reviewed all **52** current production idea notes for `status: production` and stable `IDEA-` identifiers; checked **144 relative Markdown links** within these notes against the current GitHub file tree with **0 broken**.
- Verified all **50** promotions in this register link to existing production files.
- Repaired affected links in current planning guidance and architecture ADRs to follow the notes into production. Dated historical discussion remains preserved rather than rewritten as new approvals.
- No application source, runtime tests, B9-D12 spatial migration, or implemented specs were created by the promotion operation.

## Audit history

- **2026-10-24:** Pass A closed, 52 accepted ideas mapped across 12 logical subsystems; all were staged.
- **2026-11-01:** User separately promoted original IDEA-0051 and IDEA-0053; no other staging ideas promoted.
- **2026-11-03:** User separately approved **all remaining 50** staging→production promotions. Historical acceptance and supersession remain preserved. No gameplay code or technical tests were executed by this documentation-only transition.
