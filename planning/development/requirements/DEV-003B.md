---
type: development-requirements
status: scoped-audit
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003B"
---

# DEV-003B — Independent committed Story-prefix Fork

Execution authority: user's 2026-11-06 launch explicitly requests the next DEV-003 child, implementation/testing/independent review and one primary PR. The user gave verbal approval to finalise and merge PR #12 on 2026-11-06: “yes finish the task”. Main baseline is `f66b169`; DEV-002 and DEV-003A are merged. This child is **VERIFIED within its bounded scope only on confirmed checked-head merge of PR #12**, not an application spec or full-IDEA certification.

## Remaining parent and dependency audit

[DEV-003 audit](./DEV-003.md) retains Retry completed; shared drafts, temporary editor undo, committed Undo, historical prose editing and reconstruction remain later. Drafts require their own noncanonical persistence/base/epoch lifecycle; Undo and historical editing require changing append-only/version-equals-turn-count assumptions. Fork can independently reuse the current adventure-scoped persistence and replay contract without either change. Full Duplicate/export, world, Lorebook, memory and plugins are not prerequisites for copying the entire currently supported zero-effects Story state; their future Fork coverage remains incomplete.

Read [IDEA-0011](../../production/Manual%20Generation%20Branches.md), [IDEA-0004](../../production/Retry%20Undo%20and%20Alternative%20Continuations.md), [IDEA-0039](../../production/Event-Sourced%20World%20History.md), [IDEA-0051](../../production/Browser-Persistent%20Story%20Database.md), [B4-D05](../../architecture/decisions/B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md), B3-D02/D04/D05, B6-D01 and the visual contract. B4-D05 permits engineering choice of scoped ID reuse: turn/passage IDs remain stable, copied rows receive the new adventure ID; no mutable row is shared. No new schema, checkpoints or model calls are needed.

## Stable IDEA-0011 inventory

This inventories the operative original IDEA with later ADR qualifications. Whole-IDEA implementation remains incomplete. All eight rows have **PASS evidence for the supported Story-only zero-effects portion**, with child verification effective only on confirmed checked-head merge of PR #12. Broader mixed/later obligations are not certified by this child.

| ID | Accepted behavior / source | Child disposition and evidence target |
| --- | --- | --- |
| IDEA-0011/R01 | Accepted direction: explicit Fork creates separately addressable adventure, source unchanged. | User correction 2026-11-06: small accessible icon below the clicked accepted turn; opens a separate browser tab/window with default `fork: [source name]`; source tab/input intact. No implicit Fork on Retry. |
| IDEA-0011/R02 | Any committed turn: actual current accepted boundary, including one without checkpoint. | First/interior/latest accepted turn; reject baseline, missing/provisional IDs, beyond-head and stale source. |
| IDEA-0011/R03 | Complete prefix through boundary inclusive with Turn-0 baseline and coherent current references; exclude later source. B3-D04 removes old revision lineage. | Exact structured passages/IDs/order and empty events, baseline; full state replay in browser. Nonempty effects, world/Lorebook/memory/plugin data later; unsupported history fails closed. |
| IDEA-0011/R04 | Independent future: no mutable sharing or source truncation/rewrite/regeneration. | Real independent append in both adventures and exact source/fork reads after restart. Rename/edit/delete isolation later with those features. |
| IDEA-0011/R05 | Safe Fork: coherent atomic Go/SQLite copy, validated source version and boundary, technical reference integrity. | Source expected-version/epoch; receipt/payload integrity; injected mid-copy failure rolls back destination and receipt; concurrent write yields exact prefix or stale rejection. |
| IDEA-0011/R06 | Exclude noncanonical drafts, pending edits, unfinished generation, credentials and incomplete operations. | Copy only baseline/current accepted prefix; no source operation receipts copied; UI guards provisional/saving/uncertain states, no input copied. Durable drafts/edit/provider systems later. |
| IDEA-0011/R07 | Separate feature boundaries: own library item, no in-story branch selector/tree, no export/checkpoint prerequisite, Undo/Retry stay distinct. | Direct per-turn Fork action, no selector/title form, and ordinary library resume; existing Retry/accept regressions. |
| IDEA-0011/R08 | Independently usable with supported state and related lifecycle features. | Continued Story generation/accept/read/reopen verified here; broader editing, rename/delete, world/context/plugin lifecycle remains later. |

Technical recovery obligations also use B3-D02/D05 and IDEA-0051: freeze request/IDs while a response is uncertain, retry that exact request, check epoch before receipts, recover a successful receipt even if source subsequently advanced, reject changed payload and stale new requests without automatic rebasing.

## Required gates and exclusions

Build/typecheck, TypeScript boundary/lifecycle tests, real SQLite atomicity/fencing/isolation/concurrency tests, real Firefox → Wails → Go → disposable SQLite including lost-response recovery and exact process restart, Dark/Bright at 390/768/1024/1440 with accessible turn icons, visible keyboard focus, separate-tab behavior and no overflow, independent source/runtime review, primary PR CI. Local lead status: **PASS** for typecheck/build, 37 TS cases, 19 Go functions/62 nested cases, vet, real host/browser/restart/recovery and eight responsive theme/width checks. [Evidence](../evidence/DEV-003B.md). Independent [revised UX review PASS](../evidence/DEV-003B-ux-review.md); [readiness CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42243295778) at `f86dec286538e3c029536e77162477a4f4946b2a`; final closure-head CI and actual merge provenance are recorded in the same PR. Verification remains conditional until that checked-head merge.

No full IDEA or additional atomic row certification is inferred from bounded coverage. B9-D12 is **DEFERRED — NO WORK**. Live AI, nonempty effects, persisted checkpoints, Undo/history edits, shared drafts, export/backup, credentials and Windows/macOS packaging are excluded.

## Historical first-iteration publication snapshot

[Primary PR #12](https://github.com/Levelleor/lorebound/pull/12) is OPEN, implementation commit `085e53fb3fe6207e3cc506947f217b036b78399c`; independent source hashes match. Publication CI is pending at this record's write. Exact-head checks and verbal finalise/merge approval remain required. [Conditional closure](../evidence/DEV-003B-reconciliation.md) remains ineffective until confirmed checked-head merge.

## Current UX correction — 2026-11-06

The user rejected the first dialog iteration before giving merge approval. The selected accepted turn is implicit in the icon beneath it; clicking immediately starts its fork and opens a separate browser tab/window. There is no turn selector/title form. The automatic title is lowercase `fork: ` plus source title, truncated by Unicode codepoints to the existing 160-codepoint limit; renaming remains a separate feature. Source URL, accepted history and live input stay intact.

Synchronously reserve the target while the click has browser user activation. A blocked pop-up produces no request/write. Pending/uncertain Fork is single-flight across all turn icons; Recover reuses the immutable request. Closing/navigating the target does not cancel or recopy the durable operation; offer a normal Open fork link after confirmed success. Stale rejection refetches current source and requires a deliberate fresh icon click. All prior modal-specific evidence is historical, not current UI certification. Revised local checks and [independent review PASS](../evidence/DEV-003B-ux-review.md); revised-head [readiness CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42243295778); the user has now approved finalise/merge of PR #12. Its final closure additions require independent review and final-head checks, then confirmed merge.

## Final requirement dispositions for single-PR closure

**Effective only on confirmed checked-head merge of PR #12.** R01/R02/R05/R07 have scoped PASS for direct accepted-turn selection, separately addressable current-prefix copying, canonical guards and separate-library/UI boundaries. R03 has PASS for the entire supported baseline/structured zero-effects prefix; nonempty world/Lorebook/memory/plugin payloads remain later. R04/R08 have PASS for isolated Story acceptance, ordinary resume and exact reopen; rename/edit/delete/world lifecycle integration remains later. R06 has PASS for excluding current unsent/provisional state and source receipts; future durable draft/editor/provider systems remain later. These are bounded child dispositions, not eight additional formal full-row certifications. Full IDEA-0011 and parent DEV-003 remain incomplete.

The user's 2026-11-06 “yes finish the task” approves finalisation/merge of this named PR only. [Conditional reconciliation](../evidence/DEV-003B-reconciliation.md) records scope, evidence and the separate future DEV-003 launch gate. No B9-D12 work or next child is authorised.
