# Lorebound conventions

## Code and UI

- For implementation, refactoring, architecture or review use the owner's `personal-development-style` skill when installed (on the original workstation: `~/.codex/skills/personal-development-style/SKILL.md`); discover it by name if relocated. Prefer readable code, explicit ownership, small pragmatic composition, early returns, minimal useful comments and safe concurrency for independent work.
- For new and directly affected TS/JS, use two spaces, Allman block braces, semicolons, single quotes and no optional trailing commas where framework syntax allows. Go is idiomatic and `gofmt`-formatted. These preferences win over conflicting presentation conventions in affected code, but never over correctness, security, platform rules, accepted contracts or required checks. Do not reformat unrelated code.
- Use the accepted Command Citadel decision for UI behavior and responsive layout. Verify appropriate viewport sizes (390/768/1024/1440px), Dark/Bright and keyboard/state feedback. The pinned kit guides presentation, not functionality or verification claims.

## Verification and evidence

- Run the configured gates; the existing GitHub Verify workflow remains the repeatable CI baseline. Use focused local checks for diagnosis. Reuse applicable CI evidence from the reviewed revision. Keep generated logs, screenshots and traces in CI artifacts or temporary directories; never commit them in records. Artifact retention is seven days and excludes databases. Store concise revision-specific PR/run links, scope, verification limits and relevant discoveries.
- Separate simulated replies, real browser/Wails/SQLite integration, manual checks and untested behavior. A recipe or unmerged PR does not prove verified main. Do not certify a full requirement from a bounded slice or start explicitly deferred work.
- For hands-on review of user-facing changes, provide a working URL or one review-launch command and a short walkthrough (actions, expected results, limits). Give the owner an opportunity to try it. CI is not owner acceptance. Commit or publish only with authorization; require explicit approval of the named PR before merging. Completion of a task is not authorization to launch the next slice.
- Keep fixtures deterministic, independent and disposable. Do not write to the default player library during verification. Authentication-required provider endpoints are outside current scope; do not put credentials in model profile fields or records. The current Host/Origin controls are browser precautions, not authentication of arbitrary local processes.

## Toolchain

Use the Go version in `go.mod`, Node from `.nvmrc`, npm and the tracked lockfiles. `bash scripts/build.sh` installs, typechecks and builds the real frontend and host. Build first: Go embeds `frontend/build`. Use `CGO_ENABLED=0` and `-tags server` for the headless Go checks. See [development setup](development.md) for the full CI recipe, Playwright dependencies and separate persistent review library.
