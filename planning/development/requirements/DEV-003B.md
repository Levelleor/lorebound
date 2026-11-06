---
type: development-requirements
status: scoped-audit
created: "2026-11-06"
updated: "2026-11-06"
task: "DEV-003B"
---

# DEV-003B — Independent committed Story-prefix Fork

Execution authority: user's 2026-11-06 launch explicitly requests the next DEV-003 child, implementation/testing/independent review and one primary PR. Merge requires later verbal approval. Main baseline is `f66b169`; DEV-002 and DEV-003A are merged. This child is **IMPLEMENTED / UNMERGED; independent review PASS, PR CI pending**, not an application spec or full-IDEA certification.

## Remaining parent and dependency audit

[DEV-003 audit](./DEV-003.md) retains Retry completed; shared drafts, temporary editor undo, committed Undo, historical prose editing and reconstruction remain later. Drafts require their own noncanonical persistence/base/epoch lifecycle; Undo and historical editing require changing append-only/version-equals-turn-count assumptions. Fork can independently reuse the current adventure-scoped persistence and replay contract without either change. Full Duplicate/export, world, Lorebook, memory and plugins are not prerequisites for copying the entire currently supported zero-effects Story state; their future Fork coverage remains incomplete.

Read [IDEA-0011](../../production/Manual%20Generation%20Branches.md), [IDEA-0004](../../production/Retry%20Undo%20and%20Alternative%20Continuations.md), [IDEA-0039](../../production/Event-Sourced%20World%20History.md), [IDEA-0051](../../production/Browser-Persistent%20Story%20Database.md), [B4-D05](../../architecture/decisions/B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md), B3-D02/D04/D05, B6-D01 and the visual contract. B4-D05 permits engineering choice of scoped ID reuse: turn/passage IDs remain stable, copied rows receive the new adventure ID; no mutable row is shared. No new schema, checkpoints or model calls are needed.

## Stable IDEA-0011 inventory

This inventories the operative original IDEA with later ADR qualifications. Whole-IDEA implementation remains incomplete. Each row is **IN PROGRESS** only for the supported Story-only zero-effects portion unless marked later.

| ID | Accepted behavior / source | Child disposition and evidence target |
| --- | --- | --- |
| IDEA-0011/R01 | Accepted direction: explicit Fork creates separately addressable adventure, source unchanged. | Story-level action; no implicit Fork on Retry; own library entry and URL. |
| IDEA-0011/R02 | Any committed turn: actual current accepted boundary, including one without checkpoint. | First/interior/latest accepted turn; reject baseline, missing/provisional IDs, beyond-head and stale source. |
| IDEA-0011/R03 | Complete prefix through boundary inclusive with Turn-0 baseline and coherent current references; exclude later source. B3-D04 removes old revision lineage. | Exact structured passages/IDs/order and empty events, baseline; full state replay in browser. Nonempty effects, world/Lorebook/memory/plugin data later; unsupported history fails closed. |
| IDEA-0011/R04 | Independent future: no mutable sharing or source truncation/rewrite/regeneration. | Real independent append in both adventures and exact source/fork reads after restart. Rename/edit/delete isolation later with those features. |
| IDEA-0011/R05 | Safe Fork: coherent atomic Go/SQLite copy, validated source version and boundary, technical reference integrity. | Source expected-version/epoch; receipt/payload integrity; injected mid-copy failure rolls back destination and receipt; concurrent write yields exact prefix or stale rejection. |
| IDEA-0011/R06 | Exclude noncanonical drafts, pending edits, unfinished generation, credentials and incomplete operations. | Copy only baseline/current accepted prefix; no source operation receipts copied; UI guards provisional/saving/uncertain states, no input copied. Durable drafts/edit/provider systems later. |
| IDEA-0011/R07 | Separate feature boundaries: own library item, no in-story branch selector/tree, no export/checkpoint prerequisite, Undo/Retry stay distinct. | Story-level Fork dialog and ordinary library resume; existing Retry/accept regressions. |
| IDEA-0011/R08 | Independently usable with supported state and related lifecycle features. | Continued Story generation/accept/read/reopen verified here; broader editing, rename/delete, world/context/plugin lifecycle remains later. |

Technical recovery obligations also use B3-D02/D05 and IDEA-0051: freeze request/IDs while a response is uncertain, retry that exact request, check epoch before receipts, recover a successful receipt even if source subsequently advanced, reject changed payload and stale new requests without automatic rebasing.

## Required gates and exclusions

Build/typecheck, TypeScript boundary/lifecycle tests, real SQLite atomicity/fencing/isolation/concurrency tests, real Firefox → Wails → Go → disposable SQLite including lost-response recovery and exact process restart, Dark/Bright at 390/768/1024/1440 with dialog focus/Escape and no overflow, independent source/runtime review, primary PR CI. Local lead status: **PASS** for typecheck/build, 36 TS cases, 19 Go functions/62 nested cases, vet, real host/browser/restart/recovery and eight responsive theme/width checks. [Evidence](../evidence/DEV-003B.md). Independent [review PASS](../evidence/DEV-003B-review.md); publication CI pending; no merged verification is claimed.

No full IDEA or additional atomic row certification is inferred from bounded coverage. B9-D12 is **DEFERRED — NO WORK**. Live AI, nonempty effects, persisted checkpoints, Undo/history edits, shared drafts, export/backup, credentials and Windows/macOS packaging are excluded.
