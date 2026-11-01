---
type: architecture-decision
status: accepted
decision_id: "C-D02"
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit Pass C Batch 1 Option A)"
tags:
  - planning/architecture
  - pass-c
  - slice-refinement
  - architecture-decision
---

# C-D02 — Track cross-cutting slices without replacing staged ideas

## User approval

**Explicit user choice (2026-11-01):** “Pass C Batch 1 review: C-D01: A; C-D02: A; C-D03: A. Record only explicitly approved Pass C decisions in Lorebound GitHub, preserve prior architecture and staging approvals, do not promote ideas or implement code, and continue reviewing Pass C in batches of three.”

**ACCEPTED: Option A.** Maintain a **lightweight, uniquely labelled `C-SL-` planning slice register**, with each proposed slice cross-referencing relevant original immutable `IDEA-` IDs, the 12 subsystem owners and binding accepted Pass B/C ADRs. A slice may cover parts of several accepted staged ideas and several slices may refine one idea. The slice register is a planning index, **not** a new independent idea-promotion pipeline.

## Binding scope and safeguards

1. **One continuing original idea note:** Preserve the same `IDEA-` document, stable identifier, source links and decision history in `planning/staging/`. Do not clone a new `IDEA-` note for every slice.
2. **Cross-cutting slices:** Each proposed `C-SL-` entry includes purpose/observable result, primary and secondary S01–S12 owners, IDEA/ADR references, dependencies, accepted boundaries and proposed acceptance evidence.
3. **Separate approvals:** Accepting a Pass C slice contract is not an automatic readiness approval for every related staging idea. Only an **explicit user-approved staging → production transition** can move the original idea note, preserving its original ID/history. No implementation is authorised by merely assigning a slice number.
4. **Register honesty:** Candidate slice ordering/implementation structure remains **proposed** until reviewed, even though this choice to use a slice register is accepted.

## Alternatives and chronology

- **A accepted:** Traceable `C-SL-` slice catalogue plus original staged note continuity.
- **B not selected:** Require each staged idea to be refined in isolation before cross-module slice planning.
- **C not selected:** Combine all 52 ideas into an untraceable monolithic implementation plan.

- **2026-11-01:** Accepted as **Pass C Batch 1 Option A**. The other alternatives were not approved. This is planning-refinement authority, not permission to create application code, promote original staging ideas, create implemented specs or claim tests ran.
- The [Pass C kickoff](../Pass%20C%20-%20Implementation%20Slice%20Refinement%20Kickoff.md) and [slice register](../Pass%20C%20-%20Implementation%20Slice%20Register.md) retain current review status and cross-references. Earlier Pass A/B architectural acceptances and their historical overrides remain in force.
