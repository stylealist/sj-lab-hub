#!/usr/bin/env bash
# PostToolUse(Edit|Write) 훅: src/, public/, webpack.config.js가 바뀌면 webpack 빌드로 즉시 검증한다.
# 이 프로젝트에는 테스트/린트가 없어 빌드 성공 여부가 사실상 유일한 자동 검증 수단이다.
set -u

f=$(jq -r '.tool_input.file_path // empty')
f="${f%$'\r'}"
f="${f//\\//}"

case "$f" in
  *"/src/"*|*"/public/"*|*"webpack.config.js")
    npm run build
    ;;
esac
