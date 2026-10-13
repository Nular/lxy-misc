#!/usr/bin/env bash
# KickBazar Product Sourcing — 本地/Cloud Agent 一键预览（端口 8080）
set -euo pipefail

PORT="${PORT:-8080}"
DIR="$(cd "$(dirname "$0")" && pwd)"
SESSION="product-sourcing-http"
TMUX=(tmux -f /exec-daemon/tmux.portal.conf)

if curl -sf -o /dev/null --connect-timeout 1 "http://127.0.0.1:${PORT}/index.html"; then
  echo "预览服务已在运行: http://127.0.0.1:${PORT}/index.html"
  exit 0
fi

if command -v tmux >/dev/null 2>&1; then
  "${TMUX[@]}" has-session -t "=$SESSION" 2>/dev/null || \
    "${TMUX[@]}" new-session -d -s "$SESSION" -c "$DIR" -- "${SHELL:-bash}" -l
  "${TMUX[@]}" send-keys -t "$SESSION:0.0" "cd '$DIR' && exec python3 -m http.server $PORT" C-m
else
  cd "$DIR"
  nohup python3 -m http.server "$PORT" >/tmp/product-sourcing-http.log 2>&1 &
fi

sleep 1
if curl -sf -o /dev/null --connect-timeout 3 "http://127.0.0.1:${PORT}/index.html"; then
  echo "预览服务已启动: http://127.0.0.1:${PORT}/index.html"
  echo "入口: http://127.0.0.1:${PORT}/index.html"
else
  echo "启动失败，请查看日志或手动执行: cd '$DIR' && python3 -m http.server $PORT"
  exit 1
fi
