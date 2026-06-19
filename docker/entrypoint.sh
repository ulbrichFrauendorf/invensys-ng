#!/bin/sh
set -eu

node /app/tools/mcp/integra-ng-mcp-server.mjs \
  --http \
  --host 127.0.0.1 \
  --port 3200 &
MCP_PID="$!"

nginx -g "daemon off;" &
NGINX_PID="$!"

shutdown() {
  kill "$MCP_PID" "$NGINX_PID" 2>/dev/null || true
  wait "$MCP_PID" "$NGINX_PID" 2>/dev/null || true
}

trap shutdown INT TERM

while true; do
  if ! kill -0 "$MCP_PID" 2>/dev/null; then
    shutdown
    exit 1
  fi

  if ! kill -0 "$NGINX_PID" 2>/dev/null; then
    shutdown
    exit 1
  fi

  sleep 2
done
