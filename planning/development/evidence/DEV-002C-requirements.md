---
type: development-requirements-review
status: scoped-evidence-reviewed-unmerged
created: "2026-11-05"
updated: "2026-11-05"
task: "DEV-002C"
baseline_commit: "899678ad80adc2489ccd84502688a2e8357d6474"
---

# DEV-002C — Parent Story-loop scope and evidence reconciliation

The user explicitly authorised “Launch DEV-002C”. Independent `scope_audit` compared the original seven IDEA notes, accepted ADRs, current code and DEV-002B evidence. Its initial audit found no need for a new gameplay capability or architecture decision. The lead selected **first-slice integration/recovery and parent evidence closure**. The confirmed dropped-invalidation gap and reviewer-discovered conflict-message race are corrected within B1-D04/B3-D05/B4-D03 authority.

This matrix accounts for **all 57 existing inventory rows whose delivery text mentions First**. It does not invent new atomic IDs or certify all 95 whole-IDEA rows. PASS scope means the bounded behavior has executed lead checks; independent review and implementation-head CI passed; latest documentation-head CI/merge are separate gates in [task evidence](./DEV-002C.md). Three previously verified IDEA-0006 rows remain the formal main count. Partial rows retain their unimplemented remainder, particularly nonempty world events; no entire IDEA is archived or marked complete.

## Governing scope

Original [parent inventory and IDEA/ADR source links](../requirements/DEV-002.md), [DEV-002B accepted-source audit](./DEV-002B-requirements-audit.md), [C-D01](../../architecture/decisions/C-D01%20-%20First%20Mock%20Driven%20End%20to%20End%20Story%20Turn%20Slice.md), [C-D04](../../architecture/decisions/C-D04%20-%20Story%20Mode%20First%20Complete%20Turn.md), [C-D06](../../architecture/decisions/C-D06%20-%20Minimal%20Versioned%20Accepted%20Story%20History%20Payload.md), [B1-D04](../../architecture/decisions/B1-D04%20-%20Cross-Tab%20Invalidation%20and%20Refetch.md), [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md), [B4-D03](../../architecture/decisions/B4-D03%20-%20Consistent%20Version%20Tagged%20Canonical%20Reads.md). Later specific accepted ADRs govern historical original wording.

C-D06 permits zero supported world effects. Thus parent DEV-002 closure is a complete **bounded Story-only simulated zero-effects loop**, not supported world-event roundtrip/reduction or all original product functionality. Retry generation is absent and remains DEV-003. No full Quick Start, Custom Opening, durable drafts, history editing, providers, restore, launcher/platform lifecycle or B9-D12 spatial migration work is included.

## Evidence key

- **TS:** [Story coordinator/document tests](../../../frontend/tests/story.test.ts), including the seven DEV-002C regressions; simulated generation/storage unit evidence.
- **L:** [Blank library contracts](../../../frontend/tests/library.test.ts).
- **G:** Real SQLite [Story tests](../../../internal/store/story_test.go) and [library tests](../../../internal/store/store_test.go); all 14 functions/43 subcases rerun.
- **B:** Existing real-browser [creation/navigation/restart harness](../../../frontend/scripts/check-browser.mjs) and [Story scenarios](../../../frontend/scripts/check-story.mjs).
- **I:** Expanded real-browser [Story integration scenarios](../../../frontend/scripts/check-story-integration.mjs). Intercepted HTTP failure responses and clock-controlled simulated generation are explicitly fixtures; actual saves/reads use real Wails/Go/SQLite.
- **R/H:** [Real host verification](../../../scripts/verify-host.sh), fresh browser and restarted process exact library/snapshot comparisons; host/request restrictions.
- **V:** [Visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md), [runtime CSS](../../../frontend/src/lib/appearance.css), real B screenshots/assertions and independent screenshot review. Reduced-motion suppression is source-inspected; full appearance settings remain later.

## First-slice disposition

| Existing requirement | Disposition | Concrete evidence and remaining boundary |
| --- | --- | --- |
| IDEA-0002/R01 | Story-only PASS scope | TS lifecycle test `IDEA-0002/R01–R02`; B/I accepted/discarded input; freeform extraordinary prose allowed without actor or fictional veto. |
| IDEA-0002/R02 | Story-only PASS scope | TS lifecycle test `IDEA-0002/R01–R02`; B/I accepted/discarded input; freeform extraordinary prose allowed without actor or fictional veto. |
| IDEA-0002/R03 | Story-only PASS scope | TS lifecycle test `IDEA-0002/R01–R02`; B/I accepted/discarded input; freeform extraordinary prose allowed without actor or fictional veto. |
| IDEA-0002/R04 | Implemented UI PASS scope | B geometry/keyboard/theme matrix; I keyboard Discard, refresh disabled Send, retained input and truthful recovery states; V source/screenshot review. Full appearance/Lorebook controls remain later. |
| IDEA-0002/R05 | Implemented UI PASS scope | B geometry/keyboard/theme matrix; I keyboard Discard, refresh disabled Send, retained input and truthful recovery states; V source/screenshot review. Full appearance/Lorebook controls remain later. |
| IDEA-0002/R06 | Implemented UI PASS scope | B geometry/keyboard/theme matrix; I keyboard Discard, refresh disabled Send, retained input and truthful recovery states; V source/screenshot review. Full appearance/Lorebook controls remain later. |
| IDEA-0002/R07 | Implemented UI PASS scope | B geometry/keyboard/theme matrix; I keyboard Discard, refresh disabled Send, retained input and truthful recovery states; V source/screenshot review. Full appearance/Lorebook controls remain later. |
| IDEA-0002/R13 | PARTIAL boundary only | B/I assert empty effects and untouched unrelated adventure; no extraction, grounding reducer, character movement or nonempty authorial events certified. DEV-006/007. |
| IDEA-0006/R01 | VERIFIED on main; regression scope | L; G `TestAdventureDurabilityAndIsolation`, creation failure/recovery tests; B blank create/list/reload and R exact reopen. Prior PR #4 certification retained. |
| IDEA-0006/R02 | VERIFIED on main; regression scope | L; G `TestAdventureDurabilityAndIsolation`, creation failure/recovery tests; B blank create/list/reload and R exact reopen. Prior PR #4 certification retained. |
| IDEA-0006/R03 | VERIFIED on main; regression scope | L; G `TestAdventureDurabilityAndIsolation`, creation failure/recovery tests; B blank create/list/reload and R exact reopen. Prior PR #4 certification retained. |
| IDEA-0006/R04 | PASS first Story baseline protection | TS Stop/generation failure; B Stop/Discard exact baseline; I navigation/tab close; full Quick Start failure behavior remains DEV-008. |
| IDEA-0006/R09 | PARTIAL no-invention boundary | L blank payload and B/I empty-effects Story path; no auto-created actor. Future tracked effects/character selection/Custom Opening remain later. |
| IDEA-0006/R11 | PARTIAL no-invention boundary | L blank payload and B/I empty-effects Story path; no auto-created actor. Future tracked effects/character selection/Custom Opening remain later. |
| IDEA-0006/R12 | PARTIAL blank save/resume path | G durability/isolation; B blank create/resume; R exact IDs and both adventures. Rename and other opening paths remain DEV-008. |
| IDEA-0039/R01 | PASS zero-effects scope | TS pure replay and lifecycle; G current-history schema + durability; B/R exact structured accepted turns. No revisions, checkpoint or competing canonical store. |
| IDEA-0039/R02 | PARTIAL; nonempty event verification unavailable | Typed EventEnvelope and zero-effects/source boundary inspected; unknown-event rejection tested. Empty arrays cannot verify supported envelope/source/order roundtrip or reducers. Nonempty contracts remain DEV-006/007. |
| IDEA-0039/R03 | PASS zero-effects scope | TS pure replay and lifecycle; G current-history schema + durability; B/R exact structured accepted turns. No revisions, checkpoint or competing canonical store. |
| IDEA-0039/R04 | PASS zero-effects scope | TS pure replay and lifecycle; G current-history schema + durability; B/R exact structured accepted turns. No revisions, checkpoint or competing canonical store. |
| IDEA-0039/R05 | PASS provisional isolation | TS failure/Stop/Discard/disposal; B exact baseline; I navigation, ready-candidate closure and failures never add an unaccepted turn. |
| IDEA-0039/R06 | PASS required-core fail-closed scope | TS unknown-core replay blocks generation; G `TestUnknownStoredEventsPreserveReadableHistoryAndBlockAppend`; B intercepted incompatible-read UI preserves prose and durable SQLite. Plugin compatibility remains later. |
| IDEA-0039/R07 | PARTIAL; nonempty event verification unavailable | Typed EventEnvelope and zero-effects/source boundary inspected; unknown-event rejection tested. Empty arrays cannot verify supported envelope/source/order roundtrip or reducers. Nonempty contracts remain DEV-006/007. |
| IDEA-0039/R08 | PARTIAL boundary only | TS natural prose/no fictional veto and empty effects; no declarative world reducer or extraction pipeline claimed. DEV-004/006/007 remain. |
| IDEA-0039/R09 | PARTIAL boundary only | TS natural prose/no fictional veto and empty effects; no declarative world reducer or extraction pipeline claimed. DEV-004/006/007 remain. |
| IDEA-0040/R01 | PASS current-passage scope | TS structured documents/pure replay; G atomic durability and malformed payload tests; B literal HTML safe, paragraphs/hard breaks; R exact IDs/bodies/order. Schema inspection confirms no archived revisions. |
| IDEA-0040/R02 | PASS current-passage scope | TS structured documents/pure replay; G atomic durability and malformed payload tests; B literal HTML safe, paragraphs/hard breaks; R exact IDs/bodies/order. Schema inspection confirms no archived revisions. |
| IDEA-0040/R03 | PASS current-passage scope | TS structured documents/pure replay; G atomic durability and malformed payload tests; B literal HTML safe, paragraphs/hard breaks; R exact IDs/bodies/order. Schema inspection confirms no archived revisions. |
| IDEA-0040/R04 | PARTIAL passage-source classification only | Distinct authored/generated passage IDs survive B/R. Supported nonempty event-to-passage association is not exercised or certified. |
| IDEA-0044/R01 | PASS simulated Story boundary | TS lifecycle/request spy; B/I real UI→Wails→Go/SQLite with visibly simulated fixture. Browser TS prepares intent; Go remains technical transaction authority. |
| IDEA-0044/R02 | PASS simulated Story boundary | TS lifecycle/request spy; B/I real UI→Wails→Go/SQLite with visibly simulated fixture. Browser TS prepares intent; Go remains technical transaction authority. |
| IDEA-0044/R03 | PASS simulated Story boundary | TS lifecycle/request spy; B/I real UI→Wails→Go/SQLite with visibly simulated fixture. Browser TS prepares intent; Go remains technical transaction authority. |
| IDEA-0044/R04 | PASS first-slice failure/cancellation | TS failure, invalid output, late result, disposal and rejected-payload cases; G rollback; I navigation/candidate/last-tab closure and failed post-commit read. Generation Retry remains later. |
| IDEA-0044/R05 | PASS first-slice failure/cancellation | TS failure, invalid output, late result, disposal and rejected-payload cases; G rollback; I navigation/candidate/last-tab closure and failed post-commit read. Generation Retry remains later. |
| IDEA-0044/R06 | N/A in first slice; accepted later | Candidate Retry is not exposed; DEV-003 retains replacement semantics. Unchanged commit recovery is separately tested under R08. |
| IDEA-0044/R07 | PASS stale-decision scope | TS stale epoch/version, guarded conflict refetch and preserved diagnostic regressions; G stale/concurrent rejection; B stale two-tab acceptance; I failed conflict read/manual Reload retains text, no automatic rebase/resubmit. |
| IDEA-0044/R08 | PASS unchanged recovery scope | TS uncertain/replayed/newer history; G original receipt after reopen; B lost real success reply; I post-commit read failure and lost reply followed by newer other-tab commit. Payload/operation equality asserted. |
| IDEA-0044/R09 | PASS coherent zero-effects projection | G `TestConcurrentStoryWritesAndCoherentReads`; TS queued read/Stop/Discard/dispose/conflict regressions; I consecutive real cross-tab commits during a gated older read then newest refetch. |
| IDEA-0044/R10 | PARTIAL first-slice boundary | TS actorless Story and natural-prose request with no internal IDs; B monitors no external traffic. Full provider/extractor/direct-network, ambiguity and supported actor facts remain DEV-004/006/007. |
| IDEA-0044/R11 | PARTIAL first-slice boundary | TS actorless Story and natural-prose request with no internal IDs; B monitors no external traffic. Full provider/extractor/direct-network, ambiguity and supported actor facts remain DEV-004/006/007. |
| IDEA-0044/R12 | PARTIAL first-slice boundary | TS actorless Story and natural-prose request with no internal IDs; B monitors no external traffic. Full provider/extractor/direct-network, ambiguity and supported actor facts remain DEV-004/006/007. |
| IDEA-0051/R01 | PASS current library/isolation scope | G adventure and Story isolation; I confirms unrelated adventure exact after all cases; R same single Go-owned library. No canonical browser persistence introduced. |
| IDEA-0051/R02 | PASS zero-effects atomic technical contract | G malformed/unknown/missing fields, rollback/storage failure and prepared typed Story commit; TS one immutable request; B/I actual Go transaction and recovery. No nonempty effect reducer claimed. |
| IDEA-0051/R03 | PASS zero-effects atomic technical contract | G malformed/unknown/missing fields, rollback/storage failure and prepared typed Story commit; TS one immutable request; B/I actual Go transaction and recovery. No nonempty effect reducer claimed. |
| IDEA-0051/R04 | PASS Story/creation receipt scope | G original receipt after later commit/reopen, changed payload rejection, adventure-scoped IDs; B creation/Story lost replies; I post-read failure and newer-history recovery. |
| IDEA-0051/R05 | PASS version/epoch/coherent-read scope | G concurrent same-version writes/coherent reads, wrong epoch before receipt; TS stale/refetch cases; B/I competing tabs and newest canonical reads. Full restore is later. |
| IDEA-0051/R06 | PASS version/epoch/coherent-read scope | G concurrent same-version writes/coherent reads, wrong epoch before receipt; TS stale/refetch cases; B/I competing tabs and newest canonical reads. Full restore is later. |
| IDEA-0051/R07 | PASS zero-effects atomic technical contract | G malformed/unknown/missing fields, rollback/storage failure and prepared typed Story commit; TS one immutable request; B/I actual Go transaction and recovery. No nonempty effect reducer claimed. |
| IDEA-0051/R08 | PASS accepted persistence scope | B/I reload, read-failure recovery, last-tab close; R fresh browser after process restart compares exact full library/snapshots. |
| IDEA-0051/R16 | PARTIAL epoch fencing only | G/TS reject wrong epoch, including old receipts. No restore/maintenance/directory change workflow or automatic streaming resumption; DEV-008 remains. |
| IDEA-0051/R18 | PARTIAL tab/reopen boundary | I closes last tab with proposal, reconnects to surviving real host and exact accepted history. Full Quit/durable drafts remain later. |
| IDEA-0053/R01 | PASS first host boundary | B/I/R headless Wails ordinary browser, Go-owned SQLite, no external/model request, retained host after tab close, exact process reopen; H origin/Host/fetch/preflight/WebSocket checks. Not full launcher/platform/authentication certification. |
| IDEA-0053/R02 | PASS first host boundary | B/I/R headless Wails ordinary browser, Go-owned SQLite, no external/model request, retained host after tab close, exact process reopen; H origin/Host/fetch/preflight/WebSocket checks. Not full launcher/platform/authentication certification. |
| IDEA-0053/R03 | PASS first host boundary | B/I/R headless Wails ordinary browser, Go-owned SQLite, no external/model request, retained host after tab close, exact process reopen; H origin/Host/fetch/preflight/WebSocket checks. Not full launcher/platform/authentication certification. |
| IDEA-0053/R04 | PASS first host boundary | B/I/R headless Wails ordinary browser, Go-owned SQLite, no external/model request, retained host after tab close, exact process reopen; H origin/Host/fetch/preflight/WebSocket checks. Not full launcher/platform/authentication certification. |
| IDEA-0053/R05 | PASS first host boundary | B/I/R headless Wails ordinary browser, Go-owned SQLite, no external/model request, retained host after tab close, exact process reopen; H origin/Host/fetch/preflight/WebSocket checks. Not full launcher/platform/authentication certification. |
| IDEA-0053/R10 | PARTIAL existing library/storage boundary | G/B/I/R verify current Go SQLite library; directory selection, full maintenance, backups/restores remain DEV-008. |
| IDEA-0053/R15 | PARTIAL basic responsiveness | B four-width usable controls; I types during delayed read, waits for generation and recovers saves. No large-history scale/performance threshold or full replay workload certification; DEV-010 remains. |

**Parent completion gate:** all applicable bounded checks plus independent review and final-head CI must pass, then an authorised merge must land before DEV-002/DEV-002C can be marked VERIFIED & MERGED. The remaining 38 inventory rows contain no First delivery obligation and remain assigned to their existing later tasks.
