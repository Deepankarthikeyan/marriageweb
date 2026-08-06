#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/_site"

rm -rf "$SITE"
mkdir -p "$SITE"
cp "$ROOT/index.html" "$ROOT/style.css" "$ROOT/wedding-experience.css" "$ROOT/wedding-experience.js" "$SITE/"
cp -r "$ROOT/assets" "$SITE/"
touch "$SITE/.nojekyll"

cd "$SITE"
git init -q
git checkout -B gh-pages
git add -A
git commit -m "Deploy static wedding invitation site"
git push -f "https://github.com/Deepankarthikeyan/marriageweb.git" gh-pages:gh-pages

echo ""
echo "Deployed to gh-pages branch."
echo "Enable GitHub Pages: https://github.com/Deepankarthikeyan/marriageweb/settings/pages"
echo "  Source: Deploy from a branch → gh-pages → / (root)"
echo "  Live URL: https://deepankarthikeyan.github.io/marriageweb/"
