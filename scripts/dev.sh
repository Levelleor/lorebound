#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_dir"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  node_version=$(<.nvmrc)
  node_bin="${NVM_DIR:-$HOME/.nvm}/versions/node/v${node_version}/bin"
  if [[ -x "$node_bin/node" && -x "$node_bin/npm" ]]; then
    export PATH="$node_bin:$PATH"
  fi
fi

for tool in go node npm; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    printf '%s is required. See docs/development.md for setup.\n' "$tool" >&2
    exit 1
  fi
done

bash scripts/build.sh
printf '\nStarting the current checkout for review. Stop with Ctrl+C.\n'
printf 'Default review library: %s\n\n' "$repo_dir/.local/review"
exec ./bin/lorebound -data-dir "$repo_dir/.local/review" "$@"
