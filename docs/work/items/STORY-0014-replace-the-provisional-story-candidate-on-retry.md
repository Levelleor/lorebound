---
id: STORY-0014
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0002
priority: 3
related:
- PRD-0005
- PRD-0007
- STORY-0003
---

# Replace the provisional Story candidate on Retry

## Outcome

Replace the provisional Story candidate on Retry.

[Legacy task: DEV-003A](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003a)

**Bounded delivery verified and merged:** [PR #10](https://github.com/Levelleor/lorebound/pull/10), confirmed on source main at `9b30042dd0c3cedd8b4d22a02cdc7eb0d53b7145`. Broader IDEA delivery is not inferred.

## Acceptance criteria

immediate old-candidate invalidation, repeated provisional replacement, latest-only explicit acceptance, input preservation on failure/Stop, late-result fencing and existing uncertain-write/stale-version/epoch safeguards. IDEA-0004/R01–R05 have bounded coverage; nonempty effects and full later-history obligations remain unfinished.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/evidence/DEV-003A.md)


[Pinned source delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/evidence/DEV-003A.md) · revision-specific checks and limits.
