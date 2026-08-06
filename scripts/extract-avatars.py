#!/usr/bin/env python3
"""Extract groom & bride face avatars from the couple illustration."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets/images/couple-cartoon.png"
OUT_GROOM = ROOT / "assets/images/groom-avatar.png"
OUT_BRIDE = ROOT / "assets/images/bride-avatar.png"
PUBLIC_GROOM = ROOT / "public/images/groom-avatar.png"
PUBLIC_BRIDE = ROOT / "public/images/bride-avatar.png"

# Square face crops — 1024×1536 couple (woman left, man right)
BRIDE_BOX = (60, 90, 470, 500)
GROOM_BOX = (650, 50, 1020, 480)
AVATAR_SIZE = 512
BG = (255, 250, 248)


def to_square_avatar(crop: Image.Image, size: int = AVATAR_SIZE) -> Image.Image:
    """Center crop content in a square canvas for circular display."""
    crop = crop.convert("RGB")
    w, h = crop.size
    side = max(w, h)
    square = Image.new("RGB", (side, side), BG)
    square.paste(crop, ((side - w) // 2, (side - h) // 2))
    return square.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    src = Image.open(SRC)
    bride = to_square_avatar(src.crop(BRIDE_BOX))
    groom = to_square_avatar(src.crop(GROOM_BOX))

    for path in (OUT_BRIDE, OUT_GROOM, PUBLIC_BRIDE, PUBLIC_GROOM):
        path.parent.mkdir(parents=True, exist_ok=True)

    bride.save(OUT_BRIDE)
    groom.save(OUT_GROOM)
    bride.save(PUBLIC_BRIDE)
    groom.save(PUBLIC_GROOM)
    print(f"Created {OUT_BRIDE.name}, {OUT_GROOM.name}")


if __name__ == "__main__":
    main()
