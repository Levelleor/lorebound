#!/usr/bin/env bash
set -euo pipefail

port=${LOREBOUND_PORT:-18080}
if [[ ! $port =~ ^[0-9]{1,5}$ ]] || (( 10#$port < 1 || 10#$port > 65535 )); then
  echo 'LOREBOUND_PORT must be an integer from 1 to 65535' >&2
  exit 1
fi
port=$((10#$port))
base="http://127.0.0.1:${port}"

# Refuse an occupied port before making requests or writing a test record.
LOREBOUND_PORT="$port" node --input-type=module <<'JS'
import net from 'node:net';
const server = net.createServer();
server.on('error', error => {
  console.error(`Smoke-test port is unavailable: ${error.message}`);
  process.exitCode = 1;
});
server.listen(Number(process.env.LOREBOUND_PORT), '127.0.0.1', () => server.close());
JS

data_dir=$(mktemp -d "${TMPDIR:-/tmp}/lorebound.XXXXXX")
host_pid=''
stop_host() {
  if [[ -z $host_pid ]]; then return; fi
  kill "$host_pid" 2>/dev/null || true
  for _ in {1..50}; do
    if ! kill -0 "$host_pid" 2>/dev/null; then break; fi
    sleep 0.1
  done
  kill -KILL "$host_pid" 2>/dev/null || true
  wait "$host_pid" 2>/dev/null || true
  host_pid=''
}
cleanup() {
  local result=$?
  trap - EXIT
  stop_host
  if (( result != 0 )); then cat "$data_dir"/*.log >&2 || true; fi
  if [[ -n ${LOREBOUND_ARTIFACT_DIR:-} ]]; then
    if ! { mkdir -p "$LOREBOUND_ARTIFACT_DIR" && cp "$data_dir"/*.log "$LOREBOUND_ARTIFACT_DIR/"; }; then
      echo 'Could not retain host logs; still removing the disposable database' >&2
      result=1
    fi
  fi
  rm -rf "$data_dir" || result=1
  exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

start_host() {
  local log=$1
  ./bin/lorebound -data-dir "$data_dir" -port "$port" >"$log" 2>&1 &
  host_pid=$!
  for _ in {1..50}; do
    if ! kill -0 "$host_pid" 2>/dev/null; then
      echo 'The smoke-test host exited before becoming ready' >&2
      return 1
    fi
    if curl --connect-timeout 0.25 --max-time 0.5 -fsS "$base/health" >/dev/null 2>&1; then
      # Let a bind failure surface before trusting an already-listening service.
      sleep 0.1
      kill -0 "$host_pid" 2>/dev/null
      return
    fi
    sleep 0.1
  done
  echo 'Timed out waiting for the smoke-test host' >&2
  return 1
}
start_host "$data_dir/host-start.log"

payload='{"object":0,"method":0,"args":{"call-id":"library-origin","methodName":"main.LibraryService.List","args":[]}}'
status() { curl --connect-timeout 1 --max-time 5 -sS -o "$data_dir/response" -w '%{http_code}' "$@"; }
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

LOREBOUND_URL="$base" BROWSER_STATE_PATH="$data_dir/browser-state.json" BROWSER_ARTIFACT_DIR="${LOREBOUND_ARTIFACT_DIR:-$data_dir}" npm --prefix frontend run test:browser
stop_host
start_host "$data_dir/host-reopen.log"
LOREBOUND_URL="$base" BROWSER_STATE_PATH="$data_dir/browser-state.json" BROWSER_ARTIFACT_DIR="${LOREBOUND_ARTIFACT_DIR:-$data_dir}" npm --prefix frontend run test:browser -- --reopen
echo 'PASS: real browser/Go/SQLite smoke, host restrictions and restart persistence'
