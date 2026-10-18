---
id: "IDEA-0065"
type: idea
status: candidate
origin: user
created: "2026-10-17"
updated: "2026-10-17"
source_brainstorms: ["[[Local First Storage and Deployment Brainstorm]]"]
related: ["[[Localhost Startup and Offline Mode]]", "[[Browser-Persistent Story Database]]", "[[Backups Export and Storage Quotas]]"]
tags:
  - planning/idea
---
# Optional Docker Distribution

## Idea
Consider **Docker/container packaging as a separate optional distribution method** for Lorebound's accepted **Wails v3 headless Go localhost server**. This is **not part of the accepted IDEA-0053 runtime requirement** and has **not been accepted for staging or implementation**.

## Why consider it?
The user wants to focus on a straightforward cross-platform, browser-played headless executable first. Docker might later offer a convenient alternative for technically inclined local or self-hosted users without introducing a different gameplay engine or frontend.

## Rough behaviour
- **Candidate only:** A container would package the **same headless Go server and compiled SvelteKit assets**; it would not run a distinct npm/SvelteKit player server or a native desktop window.
- The SQLite adventure database would require explicit, durable host-mounted storage so deleting/recreating a container cannot erase saves.
- Browser access, networking, ports, external AI provider reachability and secure credential handling would need explicit configuration.
- No promise of official Docker images, Compose manifests, update automation, LAN/public hosting, or user-facing setup commands is accepted yet.

## Variations and alternatives
- Official container image with minimal configuration.
- Optional Docker Compose example with bind-mounted data and model-service connectivity.
- No Docker distribution if native headless binaries meet users' needs.

## Open questions and risks
- Who is the target audience for Docker, and is it worth the additional documentation/support burden?
- How are loopback binding and container port publication safely configured without exposing privileged Go service APIs?
- How do host SQLite volumes, permissions, upgrades, backups and filesystem locks work under containers?
- How does the container reach external local model servers on Windows, macOS and Linux?
- Should Docker have a different lifecycle/browser-launch policy from directly executed binaries?

## Evaluation notes
- Dependency: [[Localhost Startup and Offline Mode]] (IDEA-0053) now accepts **only headless Wails v3 Go server** as the primary runtime.
- The user explicitly requested that Docker be treated as a **separate idea for now**, not as a second selected runtime, and that refinement concentrate on the headless server.
- The above packaging variants are **possible approaches**, not approved features or specifications.

## Decision history
- 2026-10-17 — **User direction to separate, not accept:** Keep Docker separate from the newly selected headless-only Wails v3 runtime, and focus now on the normal executable/browser experience. Captured as an **unaccepted Inbox candidate** for later consideration; no implementation or staging approval.
