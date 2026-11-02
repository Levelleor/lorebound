#!/usr/bin/env bash
set -euo pipefail

port=${GATE0_PORT:-18080}
base="http://127.0.0.1:${port}"
data_dir=$(mktemp -d "${TMPDIR:-/tmp}/lorebound-gate0.XXXXXX")
./bin/lorebound-gate0 -data-dir "$data_dir" -port "$port" >"$data_dir/host.log" 2>&1 &
host_pid=$!
cleanup() { kill "$host_pid" 2>/dev/null || true; wait "$host_pid" 2>/dev/null || true; rm -rf "$data_dir"; }
trap cleanup EXIT

ready=0
for _ in {1..100}; do
  if curl -fsS "$base/health" >/dev/null 2>&1; then ready=1; break; fi
  sleep 0.1
done
if [[ $ready != 1 ]]; then cat "$data_dir/host.log"; exit 1; fi
if command -v ss >/dev/null; then
  ss -ltn "( sport = :$port )"
fi

payload='{"object":0,"method":0,"args":{"call-id":"gate0-origin","methodName":"main.GateService.Ping","args":[]}}'
status() { curl -sS -o "$data_dir/response" -w '%{http_code}' "$@"; }
expect() {
  local label=$1 expected=$2 actual=$3
  printf '%s: HTTP %s\n' "$label" "$actual"
  [[ $actual == "$expected" ]] || { cat "$data_dir/response"; exit 1; }
}

actual=$(status -X POST "$base/wails/runtime" -H 'Content-Type: application/json' -H "Origin: $base" --data "$payload")
expect 'same-origin runtime' 200 "$actual"
cat "$data_dir/response"
printf '\n'
actual=$(status -X POST "$base/wails/runtime" -H 'Content-Type: application/json' -H 'Origin: http://evil.example' --data "$payload")
expect 'cross-origin runtime' 403 "$actual"
actual=$(status -X POST "$base/wails/runtime" -H 'Content-Type: application/json' -H 'Sec-Fetch-Site: cross-site' --data "$payload")
expect 'cross-site fetch metadata' 403 "$actual"
actual=$(status -X OPTIONS "$base/wails/runtime" -H 'Origin: http://evil.example' -H 'Access-Control-Request-Method: POST')
expect 'cross-origin preflight' 405 "$actual"
actual=$(status "$base/health" -H "Host: evil.example:$port")
expect 'rebound Host' 403 "$actual"
actual=$(status --http1.1 "$base/wails/events" -H 'Connection: Upgrade' -H 'Upgrade: websocket' -H 'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==' -H 'Sec-WebSocket-Version: 13' -H 'Origin: http://evil.example')
expect 'cross-origin WebSocket' 403 "$actual"

GATE0_URL="$base" npm --prefix frontend run test:browser
