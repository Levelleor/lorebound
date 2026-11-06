---
type: architecture
status: verified-gate-0-historical
created: "2026-11-01"
updated: "2026-11-06"
tags:
  - planning/architecture
  - pass-c
  - implementation-evidence
---

# Gate 0 execution evidence

**Historical technical foundation**, merged in [PR #3](https://github.com/Levelleor/lorebound/pull/3), implementation `610b7b77b0f4ff04eb63543f4c1aee6dea2acf30`. The separately authorised [Gate 0 packet](Pass%20C%20-%20Gate%200%20Host%20Verification%20Authorisation%20Packet%20%28Proposed%29.md) covered a disposable test record through Wails/browser/Go/SQLite, not full IDEA-0051/0053 or Story mode. DEV-002A later replaced that test UI/service/schema with production adventure creation. See [current status](../development/NOW.md) and [the delivery record](../development/evidence/DEV-002A.md).

Actual verification on 2026-11-01 used Linux amd64, the Wails headless server build (`CGO_ENABLED=0`, `-tags server`), the embedded SvelteKit frontend, Playwright Firefox and real pure-Go SQLite. No live model was used. This record summarises those executions; it does not claim a new run during documentation cleanup.

| Gate | Historical result and scope |
| --- | --- |
| G0-01 | PASS: server built and listened only on IPv4 loopback; a nonloopback host override failed before listening |
| G0-02 | PASS: embedded frontend/assets loaded in actual Firefox through the Wails server |
| G0-03 | PASS: browser service calls read, committed and redisplayed the disposable technical record |
| G0-04 | PASS: same-origin runtime allowed; tested hostile Origin, fetch metadata, Host and WebSocket requests rejected; hostile preflight rejected |
| G0-05 | PASS: real SQLite transaction committed/read back through Go and the browser bridge |
| G0-06 | PASS: unchanged operation replay made no second increment; changed payload, stale version and wrong epoch rejected |
| G0-07 | PASS: injected failure between staged SQL writes and receipt/commit rolled back the record |
| G0-08 | PASS: database close/reopen and browser reload retained the original epoch/version/value |

The supported server test/build path passed; an untagged desktop/WebView build was outside the chosen architecture. The original commands/output are historical execution detail; [current setup and CI](../../docs/development.md) own the maintained recipe. Do not restore generated logs or captures to this note.

**Limits:** browser-header restrictions do not authenticate arbitrary hostile local processes. Sensitive privileged services need an appropriate access-boundary review before expansion. Future epoch rotation/restore needs its own receipt-fencing verification. Full host launch/Quit/platform packaging, library lifecycle, backup/restore and complete feature certification were outside Gate 0. B9-D12 spatial migration remains deferred; this evidence does not authorise it.
