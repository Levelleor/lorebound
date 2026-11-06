---
type: development-requirements-review
status: pass-scoped-audit
created: "2026-11-04"
updated: "2026-11-04"
task: "DEV-002B"
reviewer: "Codex requirements_audit agent"
baseline_commit: "858806acc15aa54350af11535e59a8d82e73b7a5"
---

# DEV-002B — Accepted Story-turn scope

**Historical prerequisite audit:** the implementation is now merged; [the delivery record](../evidence/DEV-002B.md) owns verification/status. The source analysis below records the scope selected before implementation.

**PASS for defining the bounded Story-turn implementation below.** This is an independent source/requirements audit, not implementation review or executed runtime evidence. The user explicitly authorised launching DEV-002B on 2026-11-04. The lead retains final scope selection and control-file ownership. The seven-IDEA [parent inventory](DEV-002.md) remains a broader draft: this audit does not certify all 95 rows, all seven ideas, or the other 45 production ideas.

## Sources and method

Compared the relevant accepted clauses of original production [IDEA-0002](../../production/Freeform%20Player%20Action%20Modes.md), [IDEA-0006](../../production/Quick%20Start%20and%20Custom%20Story%20Openings.md), [IDEA-0039](../../production/Event-Sourced%20World%20History.md), [IDEA-0040](../../production/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md), [IDEA-0044](../../production/Deterministic%20Adventure%20Coordinator.md), [IDEA-0051](../../production/Browser-Persistent%20Story%20Database.md) and [IDEA-0053](../../production/Localhost%20Startup%20and%20Offline%20Mode.md) with the parent inventory and current task queue. Later accepted ADRs take precedence over dated statements about revisions, staging and simulation validation.

Read the system architecture, current development controls and prior DEV-002A review/reconciliation evidence. Inspected existing `frontend/src/lib/library.ts`, `frontend/src/lib/host.ts`, `service.go` and `internal/store/store.go`: these expose blank adventure create/list/read and do not yet contain accepted turns, structured passages or world-event replay. Existing integration evidence belongs to DEV-002A; no runtime checks were rerun for this audit.

Detailed governing sources: [C-D01](../../architecture/decisions/C-D01%20-%20First%20Mock%20Driven%20End%20to%20End%20Story%20Turn%20Slice.md), [C-D04](../../architecture/decisions/C-D04%20-%20Story%20Mode%20First%20Complete%20Turn.md), [C-D06](../../architecture/decisions/C-D06%20-%20Minimal%20Versioned%20Accepted%20Story%20History%20Payload.md), [B2-D03](../../architecture/decisions/B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md), [B2-D05](../../architecture/decisions/B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md), [B2-D08](../../architecture/decisions/B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md), [B3-D01](../../architecture/decisions/B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md), [B3-D02](../../architecture/decisions/B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D04](../../architecture/decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md), [B4-D03](../../architecture/decisions/B4-D03%20-%20Consistent%20Version%20Tagged%20Canonical%20Reads.md), [B7-D01](../../architecture/decisions/B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) and [B7-D09](../../architecture/decisions/B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md). UI obligations come from the [visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md).

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

## Exclusions and next action

Do/Say/Continue, actor/world schemas, full Quick Start/Custom Opening, durable draft autosave, history edits/Undo/Fork, live providers/streaming configuration, backups/restores, platform packaging, full appearance settings and optional plugins remain later work. **B9-D12 spatial migrations remain deferred: no design, scripts or tests.** A nonspatial extension of the current blank-adventure storage, if needed for Story records, must preserve existing libraries and remain separately labelled from spatial migration.

**Audit disposition:** no new gameplay/architecture approval was required for the bounded scope; full inventory certification and excluded features remain unfinished. This historical audit does not instruct a new implementation launch or duplicate runtime checks.
