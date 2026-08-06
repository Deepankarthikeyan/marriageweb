#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/_site}"

rm -rf "$OUT"
mkdir -p "$OUT"
cp "$ROOT/index.html" "$ROOT/style.css" "$ROOT/wedding-experience.css" "$ROOT/wedding-experience.js" "$OUT/"
cp -r "$ROOT/assets" "$OUT/"
if [ -f "$ROOT/public/_redirects" ]; then
  cp "$ROOT/public/_redirects" "$OUT/_redirects"
fi
touch "$OUT/.nojekyll"

echo "Built static site in $OUT"
