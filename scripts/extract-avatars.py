#!/usr/bin/env python3
"""Extract groom & bride face avatars — face centered in square for circular display."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets/images/couple-cartoon.png"
OUT_GROOM = ROOT / "assets/images/groom-avatar.png"
OUT_BRIDE = ROOT / "assets/images/bride-avatar.png"
PUBLIC_GROOM = ROOT / "public/images/groom-avatar.png"
PUBLIC_BRIDE = ROOT / "public/images/bride-avatar.png"

AVATAR_SIZE = 512
BG = (255, 250, 248)

# Tuned on 1024×1536 couple illustration (woman left, man right)
BRIDE_BOX = (220, 165, 500, 445)
GROOM_BOX = (520, 155, 800, 435)


def to_square(box: tuple[int, int, int, int]) -> Image.Image:
    crop = Image.open(SRC).convert("RGB").crop(box)
    cw, ch = crop.size
    side = max(cw, ch)
    square = Image.new("RGB", (side, side), BG)
    square.paste(crop, ((side - cw) // 2, (side - ch) // 2))
    return square.resize((AVATAR_SIZE, AVATAR_SIZE), Image.Resampling.LANCZOS)


def main() -> None:
    bride = to_square(BRIDE_BOX)
    groom = to_square(GROOM_BOX)

    for path in (OUT_BRIDE, OUT_GROOM, PUBLIC_BRIDE, PUBLIC_GROOM):
        path.parent.mkdir(parents=True, exist_ok=True)

    bride.save(OUT_BRIDE)
    groom.save(OUT_GROOM)
    bride.save(PUBLIC_BRIDE)
    groom.save(PUBLIC_GROOM)
    print(f"Created {OUT_BRIDE.name}, {OUT_GROOM.name}")


if __name__ == "__main__":
    main()
