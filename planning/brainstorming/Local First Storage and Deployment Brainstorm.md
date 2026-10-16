---
type: brainstorm
status: active
mode: autonomous
topic: "Browser-led persistence, backups and localhost deployment"
goal: "Make many stories usable entirely on a local browser installation with optional service integrations."
created: 2026-10-16
updated: 2026-10-16
sources: []
outputs: []
tags:
  - planning/brainstorm
  - planning/storage
---
# Local First Storage and Deployment Brainstorm

## Goal
Make many stories usable entirely on a local browser installation with optional service integrations.

## Context
- Retrospective record of the discussion on 2026-10-16, not implemented functionality or an approved production specification.
- [[Lorebound Vision Brainstorm]] contains the overview. User directions and AI suggestions are distinguished below.


## User direction
- Primarily browser-based/frontend-led application, run from GitHub source with a simple `npm install && npm start` workflow.
- Must run on `http://localhost` without HTTPS or user login.
- Support substantial numbers of stories, narrative history and persistent world entities.
- Support remote and local LLM endpoints, potentially through a lightweight optional local bridge.

## Candidate architecture (AI proposal)
- TypeScript + React + Vite; Zustand or comparable state layer; ProseMirror/Tiptap for editable prose; React Flow for nested map.
- SQLite WASM running in Web Worker with OPFS persistence for relational story, event, character, equipment, world and revision records. IndexedDB alternative remains viable.
- OPFS/IndexedDB storage belongs to browser origin; `localhost:3000` and `localhost:5173` are separate storage origins. Keep stable defaults and migration/export support.
- Small settings in localStorage if useful; avoid it for large story data.
- Browser storage estimates/persistent-storage requests where available; do not assume unlimited quota or immunity from site-data clearing.
- JSON or SQLite export, backup/import, per-adventure export and filesystem-assisted backups.
- Schema migrations, transaction-based updates, worker isolation and quota-error handling.

## Browser connectivity constraints
- Some API endpoints disallow direct cross-origin calls (CORS).
- Cloud keys in browser scripts or browser data have exposure risks. Users control their own local machine, but key custody should still be considered.
- A browser cannot directly spawn local stdio MCP server processes.
- Optional **loopback-only Node bridge** can serve static frontend, proxy cloud/local requests, hold credentials and run MCP processes without changing frontend-led game ownership.
- Default bridge must check origin, restrict accepted endpoints/operations and avoid becoming an open network proxy.
- The interface should still work without bridge for providers that support direct browser calls.

## Local endpoint and deployment options
- Ollama, LM Studio, vLLM, custom server URL and model IDs; no need to embed model downloads/inference manager in first version.
- Local machine may have only one resident model. Sequential task prompts avoid simultaneous VRAM use.
- Direct static frontend deployment might be possible but requires CORS, secure key handling and reliable OPFS support across target browsers.
- `localhost` is generally treated as a trustworthy context by browsers even over HTTP; public HTTP origins have different security limitations.
- Avoid bundling heavy optional visual/model assets inside the browser database unless useful.

## Usability and resilience
- Explicit storage/quota dashboard with estimated usage, free browser quota and backup status.
- Auto-save each committed turn and revision, clear unsaved/edit-in-progress indicators.
- Recover from interrupted reconstruction without clobbering last committed state.
- Support many adventures, copies and isolated saves; backups should not include API secrets by default.
- Consider PWA/offline asset caching and automatic local backup where filesystem permission granted as later options.

## Open implementation comparisons
- SQLite OPFS vs IndexedDB under browser compatibility and backup requirements.
- Pure frontend versus built-in optional Node bridge launched by same `npm start`.
- How to store secrets for direct-only and bridge configurations.
- How to manage large historical event logs/snapshot garbage collection.


## Session Log
- 2026-10-16 — **User idea:** Entirely browser-based/frontend-first; large story library; localhost without HTTPS; clone and npm start.
- 2026-10-16 — **AI possibility:** SQLite WASM + OPFS, IndexedDB alternative, periodic backups and an optional loopback Node bridge.
- 2026-10-16 — **User concern:** Minimise local hardware demands and number of resident models.

## Current Threads
- Benchmark SQLite WASM/OPFS versus IndexedDB across target browsers.
- Define secure API key handling in direct browser mode and optional bridge mode.
- Decide stable default origin/port and data migration when changed.
- Validate real offline/backup behaviour, quota handling and browser limitations.

## Decisions
- Frontend-led, no application auth, localhost-first and ample browser-local persistence are user requirements.
- Exact technology stack, bridge packaging and backup policy are not accepted decisions.

## Outputs
- None. Nothing promoted to staging or production.

## Resume Here
Prototype local storage persistence and backup/export under localhost, including an interrupted turn and browser site-data recovery scenario.
