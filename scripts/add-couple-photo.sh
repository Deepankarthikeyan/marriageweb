#!/usr/bin/env bash
# Add couple photo to the wedding site and deploy.
# Usage: ./scripts/add-couple-photo.sh /path/to/your/couple-photo.jpg

set -euo pipefail

SOURCE="${1:-}"
DEST="public/images/couple.jpg"
INVITE="public/images/invitation.jpg"

if [[ -z "$SOURCE" || ! -f "$SOURCE" ]]; then
  echo "Usage: ./scripts/add-couple-photo.sh /path/to/couple-photo.jpg"
  echo ""
  echo "Or upload directly on GitHub:"
  echo "  https://github.com/Deepankarthikeyan/marriageweb/upload/cursor/wedding-invitation-4ebd"
  echo "  Save the file as: public/images/couple.jpg"
  exit 1
fi

mkdir -p public/images
cp "$SOURCE" "$DEST"

# If source looks like full invitation card, also save as invitation.jpg
if [[ "$SOURCE" != "$DEST" ]]; then
  cp "$SOURCE" "$INVITE" 2>/dev/null || true
fi

echo "✓ Saved couple photo to $DEST"
echo "  Run: npm run build && npm run deploy"
