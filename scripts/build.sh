#!/usr/bin/env bash
set -euo pipefail

npm --prefix frontend ci
npm --prefix frontend run check
npm --prefix frontend run build
mkdir -p bin
CGO_ENABLED=0 go build -tags server -o bin/lorebound .
