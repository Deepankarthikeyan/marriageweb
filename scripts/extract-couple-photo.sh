#!/usr/bin/env bash
# Extract the couple portrait from the bottom-left of the invitation card.
# Usage: ./scripts/extract-couple-photo.sh [invitation.jpg]

set -euo pipefail

INVITATION="${1:-public/images/invitation.jpg}"
COUPLE_OUT="public/images/couple.jpg"

if [[ ! -f "$INVITATION" ]]; then
  echo "Error: Invitation image not found at $INVITATION"
  echo "Add your invitation card image to public/images/invitation.jpg first."
  exit 1
fi

W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$INVITATION")
H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$INVITATION")

CROP_W=$((W * 38 / 100))
CROP_H=$((H * 32 / 100))
CROP_X=$((W * 4 / 100))
CROP_Y=$((H * 62 / 100))

ffmpeg -y -loglevel error -i "$INVITATION" \
  -vf "crop=${CROP_W}:${CROP_H}:${CROP_X}:${CROP_Y}" \
  -q:v 2 "$COUPLE_OUT"

echo "Created $COUPLE_OUT from $INVITATION (${CROP_W}x${CROP_H} at ${CROP_X},${CROP_Y})"
