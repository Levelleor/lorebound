---
id: NOTE-0065
type: note
status: inbox
source: STORY-0012
related: []
---

# STORY-0012 supporting requirement and evidence detail

## Discovery

Supporting detail for [STORY-0012](../../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md). Explicitly scoped or draft rows below are not whole-feature verification.

## Outcome

First provisional and accepted Story turn (MERGED).

[Legacy task: DEV-002B](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-002b)

**Bounded delivery verified and merged:** [PR #6](https://github.com/Levelleor/lorebound/pull/6), confirmed on source main at `f0c57b8b808308534cda1c3cb862262c813f5d11`. Broader IDEA delivery is not inferred.

## Acceptance criteria

characterless multiline Story input, explicitly simulated generation, provisional authored/generated passages, Stop/Discard/explicit Accept, atomic ordered structured passage/empty-effect commit and coherent replay/read. Technical malformed/stale/epoch/rollback/isolation/idempotency/receipt-recovery cases apply. Nonspatial upgrade preserves blank adventures; wire version rejects incompatible old readers. No silent acceptance/rebase or second browser canon.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-002B.md)

**Historical prerequisite audit:** the implementation is now merged; [the delivery record](../../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md) owns verification/status. The source analysis below records the scope selected before implementation.

**PASS for defining the bounded Story-turn implementation below.** This is an independent source/requirements audit, not implementation review or executed runtime evidence. The user explicitly authorised launching DEV-002B on 2026-11-04. The lead retains final scope selection and control-file ownership. The seven-IDEA [parent inventory](../../work/items/STORY-0002-first-complete-accepted-story-mode-turn-in-real-host-sqlite.md) remains a broader draft: this audit does not certify all 95 rows, all seven ideas, or the other 45 production ideas.

## Sources and method

Compared the relevant accepted clauses of original production [IDEA-0002](../../product/PRD-0003-freeform-player-action-modes.md), [IDEA-0006](../../product/PRD-0007-quick-start-and-custom-story-openings.md), [IDEA-0039](../../product/PRD-0040-event-sourced-world-history.md), [IDEA-0040](../../product/PRD-0041-versioned-text-blocks-and-revision-ids.md), [IDEA-0044](../../product/PRD-0045-deterministic-adventure-coordinator.md), [IDEA-0051](../../product/PRD-0052-browser-persistent-story-database.md) and [IDEA-0053](../../product/PRD-0054-localhost-startup-and-offline-mode.md) with the parent inventory and current task queue. Later accepted ADRs take precedence over dated statements about revisions, staging and simulation validation.

Read the system architecture, current development controls and prior DEV-002A review/reconciliation evidence. Inspected existing `frontend/src/lib/library.ts`, `frontend/src/lib/host.ts`, `service.go` and `internal/store/store.go`: these expose blank adventure create/list/read and do not yet contain accepted turns, structured passages or world-event replay. Existing integration evidence belongs to DEV-002A; no runtime checks were rerun for this audit.

Detailed governing sources: [C-D01](../../decisions/ADR-0100-first-mock-driven-end-to-end-story-turn-slice.md), [C-D04](../../decisions/ADR-0103-story-mode-first-complete-turn.md), [C-D06](../../decisions/ADR-0105-minimal-versioned-accepted-story-history-payload.md), [B2-D03](../../decisions/ADR-0009-turn-0-replay-for-authoritative-reconstruction.md), [B2-D05](../../decisions/ADR-0011-canonical-structured-passage-documents.md), [B2-D08](../../decisions/ADR-0013-fail-closed-unsupported-core-event-replay.md), [B3-D01](../../decisions/ADR-0014-prepared-atomic-canonical-commit-envelope.md), [B3-D02](../../decisions/ADR-0015-idempotent-canonical-commit-attempts.md), [B3-D04](../../decisions/ADR-0017-single-current-history-without-revisions.md), [B3-D05](../../decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md), [B4-D03](../../decisions/ADR-0026-consistent-version-tagged-canonical-reads.md), [B7-D01](../../decisions/ADR-0052-versioned-typed-declarative-event-envelope.md) and [B7-D09](../../decisions/ADR-0060-minimal-event-provenance-and-deterministic-current-replay-verifi.md). UI obligations come from the [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md).

## Recommended single bounded scope

Deliver ordinary **Story-mode submission → explicitly mocked candidate → deliberate Accept or Discard → atomic durable accepted turn → coherent refetch and deterministic replay** in the actual application. Preserve blank creation/resume and adventure isolation. Include essential failure, cancellation, stale-version/epoch and uncertain-write handling within this slice; these cannot be deferred while claiming safe acceptance.

Represent the authored submission and generated response as **two distinct stable passages in one logical accepted turn**. Each body is one current schema-versioned structured document containing paragraph, text and hard-break semantics. Persist source classification and explicit turn/passage order. Render and derive model text from these documents; do not save arbitrary HTML or a competing editable text copy. B2-D05 explicitly treats each submitted message/accepted response as a logical passage; grouping both in one transaction does not erase their separate identities. B3-D04 supersedes only the older revision retention, not structured documents or passage identity.

The initial world-effect batch may be empty. A typed event/source envelope can reserve stable event identity, total order, source passage/turn and origin, owning domain, supported type/schema and payload without inventing a world operation. **No supported world reducer is required solely to populate the batch.** New nonempty effects unsupported by this slice must be visibly rejected as technical unsupported data, rather than silently dropped or represented as tracked facts. Existing unsupported required-core events must stop affected reconstruction/dependent writes while preserving readable prose and all durable records. Label resulting evidence as a **zero-world-effects contract slice**, not general world-event replay verification.

Concrete serialized fields, ID format, table layout, supported document limits, mock text, fingerprint serialization and wording are engineering refinements under these sources. No blocking new gameplay/architecture choice was found for this scope.

## Clarifications and inventory limits

| Topic | Audit disposition |
| --- | --- |
| Story versus Custom Opening | Ordinary Story submission drives provisional narration under C-D04 and the approved interaction mapping. Both its authored input and candidate remain unaccepted until explicit ordinary acceptance. This does not implement the separate manual Custom Opening flow or Quick Start; Quick Start's later automatic success commit must not inherit this extra Accept gate. |
| Send versus Accept | Send starts only generation. Disable/block a second submission while its candidate is pending; never infer acceptance from Send, navigation or a late callback. |
| Empty effects | C-D06 expressly permits them and excludes requiring full character/item/map schemas. Unsupported narrative descriptions may remain prose without pretending they were tracked. No fictional prerequisites or invented actor/entity are needed. |
| Event verification claim | Empty arrays cannot demonstrate supported nonempty event roundtrip, source association or field reducers. IDEA-0039/R02 and R07 and event-association parts of IDEA-0040/R04 remain **partial contract coverage**, even if envelope/negative tests pass. |
| Document identity | One authored passage and one generated passage retain distinct IDs/provenance; multiple paragraphs or hard breaks do not acquire independent IDs. No old-body/revision tables. |
| Stop/Discard versus an uncertain commit | Cancellation can abandon generation. Once a write may already be durable, Discard/Stop cannot truthfully claim rollback. Resolve that operation through authoritative reads/receipt or unchanged retry before starting a potentially duplicate write. |
| Stale decision | A stale commit rejects atomically, refetches and reports conflict while retaining available player text. A later attempt requires a fresh decision and new operation ID; silently rebuilding the old request against the new version is forbidden. |
| Idempotent retry | Scope Story operation identity to the adventure, retain immutable payload fingerprint and original committed result, and check active epoch before honoring old receipts. Repeated request after later commits returns the original receipt but must not regress the displayed current snapshot. |
| Read/replay | One SQLite read transaction supplies baseline, current passages/events, adventure version and epoch. Browser replay is pure and its derived result has matching version/epoch. No model call, random reroll, checkpoint or competing Go world reducer. |
| Compatibility with blank-reader clients | The existing version-1 reader ignores unknown snapshot fields. Adding turns under the same wire version can let an old tab display a nonempty adventure as blank. Use an incompatible-response version or equivalent enforced compatibility boundary for story-bearing reads; a new field that the old validator ignores does not itself solve this. Storage schema versions and transport versions remain distinct. |
| Draft preservation | Preserve live player text on recoverable errors. Durable shared draft autosave remains DEV-003; do not promise restart recovery of unsaved/provisional text. |
| Optional plugins | Required-core fail-closed handling must not be presented as full optional-plugin compatibility. No plugin system is introduced by this scope. |
| UI authority | Use real docked Story composer and blue proposed/green committed states. Candidate acceptance controls follow the actual ordinary Story workflow. Shared manual-world/map Commit overlay requirements remain intact but do not require adding those editing features. |

No new atomic requirement IDs are needed: these clarify existing first-slice rows. Broad source obligations labelled Later remain accepted and unfinished. Do not promote a whole IDEA to VERIFIED from this slice.

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

## Classification

Source requirement detail and evidence; not a separate task or implementation approval.
