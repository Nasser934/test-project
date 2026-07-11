#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

for file in Configuration/*.plist Configuration/*.xcprivacy Configuration/*.entitlements; do
  plutil -lint "$file"
done

swift test --package-path Packages/SukunCore

if command -v xcodegen >/dev/null 2>&1; then
  xcodegen generate
else
  echo "xcodegen is required: brew install xcodegen" >&2
  exit 1
fi

xcodebuild -project Sukun.xcodeproj -scheme Sukun -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build
