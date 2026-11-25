---
id: STORY-0012
type: story
status: completed
parent: PRD-0003
depends_on:
- STORY-0011
priority: 3
related:
- NOTE-0065
- PRD-0003
- PRD-0007
- PRD-0040
- PRD-0041
- PRD-0045
- PRD-0052
- PRD-0054
- STORY-0002
---

# First provisional and accepted Story turn

## Outcome

First provisional and accepted Story turn (MERGED).

[Legacy task: DEV-002B](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-002b)

**Bounded delivery verified and merged:** [PR #6](https://github.com/Levelleor/lorebound/pull/6), confirmed on source main at `f0c57b8b808308534cda1c3cb862262c813f5d11`. Broader IDEA delivery is not inferred.

## Acceptance criteria

characterless multiline Story input, explicitly simulated generation, provisional authored/generated passages, Stop/Discard/explicit Accept, atomic ordered structured passage/empty-effect commit and coherent replay/read. Technical malformed/stale/epoch/rollback/isolation/idempotency/receipt-recovery cases apply. Nonspatial upgrade preserves blank adventures; wire version rejects incompatible old readers. No silent acceptance/rebase or second browser canon.

## Verified scope and limits

Verify the first complete simulated Story turn: characterless multiline input; separate authored/generated provisional passages; Stop, Discard and explicit Accept; atomic structured canon with empty effects; safe invalid/stale/epoch/idempotency/receipt paths and an additive nonspatial upgrade.

## Bounded acceptance and required evidence

The following checks are **planned acceptance gates, NOT RUN by this audit**. Implementation review must supply actual test symbols, commands and results.

| Gate | Existing requirement coverage | Observable result |
| --- | --- | --- |
| Ordinary Story lifecycle | IDEA-0002/R01–R03; IDEA-0044/R01–R03, R10–R12; IDEA-0039/R03/R05 | Characterless adventure accepts freeform input; explicit mock label; natural-language generation input has no internal IDs; no durable mutation during generation/candidate; second Send blocked; Discard leaves canon exact; Accept saves authored and generated passages together. Extraordinary authored prose is not fictionally vetoed. |
| Structured current passages | IDEA-0040/R01–R03, R04 source-classification subset | Multi-paragraph and hard-break input/response roundtrip exactly under documented serializer rules; stable IDs/order/source classification survive refetch/reopen. Arbitrary HTML stays text. Unknown/malformed schema is rejected; no revisions or paragraph IDs. |
| Zero-effects reconstruction | IDEA-0039/R01/R03–R06; R02/R07 contract subset | Repeated pure replay from baseline/current turns yields equal result with no invented world facts. Unknown core event/version or malformed data stops dependent writes, preserves durable data and readable prose, and leaves another healthy adventure usable. |
| Atomic technical boundary | IDEA-0051/R01–R03/R05–R07; IDEA-0044/R03/R09 | Typed request carries operation kind/ID, target adventure, expected version and epoch. Actual SQLite failure after staged writes rolls back turn, passages/effects, version and receipt together. No generic SQL or separately successful prose/event save service. Race read/commit never yields mixed-version history. |
| Idempotency and lost response | IDEA-0051/R04; IDEA-0044/R08 | Same immutable request returns original result before/after reopen and later commits with no second turn; changed payload under same ID rejects. Real browser loses a success response after actual Go commit, then resolves/retries unchanged and displays one accepted turn plus current authoritative history. |
| Concurrency and epoch | IDEA-0051/R05; IDEA-0044/R07/R09 | Competing same-version writes allow exactly one success. Loser refetches with visible conflict and retained available text; no silent rebase/resubmit. Wrong epoch rejects without mutation, including receipt recovery. |
| Cancellation and recovery | IDEA-0044/R04/R05; IDEA-0006/R04/R09/R11; IDEA-0039/R05 | Failed/cancelled generation, invalid prepared payload and failed persistence preserve previous canon and live input. Delayed response after Stop/Discard/navigation cannot reappear in the wrong adventure or become accepted. Already durable writes remain durable despite abandonment. |
| Persistence and existing regression | IDEA-0051/R08 and R18 tab subset; IDEA-0053/R01–R05/R10 storage subset | Actual browser→Wails→Go→SQLite save/refetch/browser restart/process reopen retains exact accepted identities/prose/order and isolation. Blank create/list/resume remains usable and never auto-generates. Existing origin/host restrictions still pass; no live model or Go AI proxy. |
| Visual/accessibility | IDEA-0002/R04–R07; IDEA-0053/R15 basic responsiveness subset | Approved 48px header, ≤672px reader, 320px desktop rail and docked multiline Story composer; real generating/stop/disabled states; blue dashed proposed label versus durable green committed indication. Real browser at 390/768/1024/1440, Dark/Bright where implemented, keyboard acceptance/discard/focus, no horizontal overflow or covered controls. No fabricated provider/save/world status. |

IDEA-0044/R06 applies only if Retry generation is exposed: a replacement immediately retires the old candidate/proposals even when the replacement fails. Omit that control if deferring its full behaviour to DEV-003; safe unchanged **commit retry** remains mandatory and is a different operation.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.

[Pinned source delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/evidence/DEV-002B.md) · revision-specific checks and limits.

## Supporting detail

See [NOTE-0065](../../knowledge/inbox/NOTE-0065-story-0012-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
