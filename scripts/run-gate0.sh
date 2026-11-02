#!/usr/bin/env bash
set -euo pipefail

exec ./bin/lorebound-gate0 -data-dir .gate0 -port "${GATE0_PORT:-8080}"
