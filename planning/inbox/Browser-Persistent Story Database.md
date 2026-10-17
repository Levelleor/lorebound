---
id: "IDEA-0051"
type: idea
status: candidate
origin: user
created: "2026-10-16"
updated: "2026-10-16"
source_brainstorms: ["[[Local First Storage and Deployment Brainstorm]]", "[[Story Editing and Event Timeline Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Browser-Persistent Story Database

## Idea
Evaluate **multiple persistent storage architectures** for many large Lorebound adventures, instead of prematurely committing to a browser-only database. The user has clarified that Lorebound will use **SvelteKit**, so server-side storage is also a viable option if it is straightforward to develop and host. Compare browser-local and SvelteKit backend databases, with possible hybrid approaches, while maintaining reliable complete incremental story/world-state history. **No storage engine or mandatory deployment topology has yet been selected.**

## Why consider it?
The product should reliably store substantial adventures with many story turns, revisions, entities and complete incremental changes. Browser-based storage offers device-local independence; a persistent SvelteKit backend can offer straightforward SQL databases and different backup/deployment options. Actual hosting simplicity and persistence guarantees depend on the chosen SvelteKit adapter, platform and database service. The goal is an informed storage choice, not an assumption that browser storage must be primary.

## Storage options to evaluate (user-requested expansion, not accepted)
### Browser/device-local approaches
- **Web Storage `localStorage`:** Small synchronous string key/value store, useful for UI preferences or lightweight configuration. Compare it, but **do not presume it suitable as the main database for large adventures** because of size limits, blocking access, primitive queries and lack of cross-record transactions.
- **IndexedDB:** Browser-native asynchronous persistent structured storage with indexes and transactions. Candidate for substantial local adventures, event histories and entities, optionally accessed through a Web Worker.
- **SQLite compiled to WebAssembly + OPFS:** A browser-side SQL/SQLite database persisted in the Origin Private File System. Compare SQL queries and transactional history against WASM/worker/OPFS configuration, platform support, locking and deployment constraints.
- **Browser persistent-storage permission:** Evaluate `navigator.storage.persist()` and `persisted()` to reduce eviction risk for supported browsers. This is a **storage retention policy** affecting browser-origin storage, **not a separate database engine**, not automatic, and not a substitute for independent backups. Quotas, site-data clearing and device loss still matter.
- **Local JSON or downloadable file-based storage:** Retain as a simpler alternative for smaller/offline use cases, portability or export. Consider drawbacks for frequent incremental updates, concurrent changes and atomic multi-record writes.

### SvelteKit server-side approaches
- **Server-side SQLite:** Evaluate a SQLite database opened from SvelteKit server-only code or endpoints in an appropriate deployment. Potentially straightforward for local/self-hosted or single-instance deployments with a **persistent writable disk**; consider safe concurrency, migrations and backup, and avoid assuming ephemeral deployment filesystems are durable.
- **Server-side PostgreSQL or similar managed SQL:** Evaluate when a hosted service, concurrency, multi-user access or easier deployment-compatible persistence makes sense. Compare connection/hosting complexity, cost, administration and portability.
- **Other hosted backend databases:** Leave open if deployment convenience warrants them, but avoid adding cloud account/server dependence by assumption.
- **SvelteKit runtime caveat:** SvelteKit can implement server-side database access when deployed with a server-capable adapter/runtime. The framework **by itself does not guarantee a persistent server process or writable disk**; fully static deployment and some serverless hosts impose different constraints. Confirm target hosting before selecting server-side SQLite or any on-disk database.

### Hybrid possibility
A hybrid arrangement (for example a browser cache/local-first adventure database with optional server persistence/sync) is a candidate, **not a requirement**. Clarify authoritative source-of-truth, offline edits, conflicts, multi-device usage, synchronisation and migration before approving it.

## Rough behaviour
Whichever storage backend is eventually selected, persist coherent story turns, text revisions, accepted state changes, stable entity IDs and metadata so the entire adventure can be deterministically reconstructed from incremental history. Use atomic/transactional commit boundaries and recovery for interrupted saves; evaluate worker-based browser access for responsiveness. Provide an abstraction only to the extent justified by actual deployment requirements; do not precommit to supporting every option at runtime.

## Variations and alternatives
- **Browser-only:** Low operational/hosting burden; data remains on the player's device but is subject to origin quota, eviction, clearing, and device loss.
- **Server-backed SvelteKit:** A simpler central database may be viable on a suitably hosted backend, but requires clear deployment and data-ownership expectations and introduces service availability or operating cost considerations.
- **Optional or hybrid storage:** Potential offline/multi-device flexibility at the cost of sync, conflict resolution, migrations, security and debugging complexity.
- **Engine alternatives:** Browser IndexedDB versus SQLite WASM + OPFS; SvelteKit server SQLite versus hosted PostgreSQL or equivalent; local JSON/files as a limited simpler option.
- Avoid committing to browser-local primary storage, mandatory cloud storage, any SQL vendor, or local Node bridge until requirements and hosting constraints are established.

## Dependencies and constraints
- The **user has specified SvelteKit** as the intended application framework. This informs possible backend architecture but does not prove a server deployment or particular database has already been built.
- Compatible with [[Snapshots and Incremental State Rebuild]] (IDEA-0042): every persistent canonical mutation, accepted event and story revision must remain durably recorded and reconstructible at supported historical boundaries, independent of chosen storage engine.
- Compatible with [[Deterministic Adventure Coordinator]] (IDEA-0044): finalisation of a turn and its world-state effects requires coherent transactions rather than partially committed narrative/state.
- [[Backups Export and Storage Quotas]] (IDEA-0052) remains a **separate unaccepted candidate**; consider its implications, but do not silently approve its export or backup design here.
- Browser persistence grants are not permanent backup guarantees; server SQLite durability depends on actual persistent storage mounts; hosted SQL has its own security, operational and cost trade-offs.
- This note is still an **unaccepted Inbox candidate**, not acceptance of any database technology or deployment requirement.

## Open questions and risks
- Which deployments are required: browser-only/static, locally run SvelteKit server, simple self-hosted server, managed hosting, or some combination?
- Is it important that adventures work fully offline and remain portable without accounts?
- What are quota, performance and compatibility limits on target browsers?
- Can SvelteKit server-side SQLite be hosted with persistent storage and simple enough backup/migration for the intended users?
- Would managed PostgreSQL or another hosted SQL service be simpler or more appropriate than a filesystem database?
- If browser and server storage coexist, which is authoritative and how are concurrent edits and sync conflicts resolved?
- How are story text, world-state events, snapshots and revisions committed atomically, including across server failures?
- Which localStorage data, if any, should be limited to settings rather than canonical adventures?
- What happens when browsers refuse persistent storage or evict site data?
- How can a long adventure be moved between engines/deployments without breaking stable IDs or complete replay?

## Draft acceptance criteria (provisional)
- [ ] The design compares localStorage, IndexedDB, SQLite WASM + OPFS, browser persistence requests, server SQLite and hosted/managed SQL options against actual SvelteKit deployment needs.
- [ ] A chosen database can persist many substantial adventures, canonical entity state, versioned narrative and complete incremental history without hidden unreplayable state.
- [ ] An accepted turn and related state/events are persisted coherently or not committed, with recovery from interrupted writes.
- [ ] Target-browser quotas/retention and target-host persistent database durability are explicitly evaluated where relevant.
- [ ] Server-backed persistence is considered on its merits rather than excluded by a browser-only premise.
- [ ] A hybrid/sync solution is adopted only after its authority/conflict/cost requirements are established.
- [ ] No particular engine, automatic cloud account requirement, hosted database or additional service is assumed accepted merely from this options review.

## Evaluation notes
- Origin: **user**. Browser-local persistence came from the original brainstorm; the user has now clarified an intended SvelteKit framework and explicitly requested that browser and server database options be logged for comparison.
- The candidate remains **unaccepted in Inbox** pending an explicit selection of direction; this is not an implementation specification or production decision.

## Decision history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate** initially oriented toward browser-local databases.
- 2026-10-16 — **User clarification during Inbox review, not acceptance:** Record localStorage, persistent browser storage, IndexedDB, SQLite WASM + OPFS and SvelteKit server-backed database possibilities, including an easy-to-host backend database if appropriate. The user specified **SvelteKit** as the application framework and does not want browser-only storage prematurely locked in. Expanded the candidate to compare browser-local, backend and optional hybrid models, keeping storage engine, primary source-of-truth and deployment open. **Still candidate, not moved to staging.**
