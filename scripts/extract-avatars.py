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

# Face-focused crops for 1024×1536 couple illustration (woman left, man right)
BRIDE_BOX = (40, 80, 480, 720)
GROOM_BOX = (520, 60, 980, 700)
AVATAR_SIZE = 512


def to_avatar(crop: Image.Image, size: int = AVATAR_SIZE) -> Image.Image:
    crop = crop.convert("RGBA")
    side = max(crop.size)
    square = Image.new("RGBA", (side, side), (255, 252, 250, 255))
    square.paste(crop, ((side - crop.width) // 2, (side - crop.height) // 2))
    return square.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    src = Image.open(SRC)
    bride = to_avatar(src.crop(BRIDE_BOX))
    groom = to_avatar(src.crop(GROOM_BOX))

    for path in (OUT_BRIDE, OUT_GROOM, PUBLIC_BRIDE, PUBLIC_GROOM):
        path.parent.mkdir(parents=True, exist_ok=True)

    bride.save(OUT_BRIDE)
    groom.save(OUT_GROOM)
    bride.save(PUBLIC_BRIDE)
    groom.save(PUBLIC_GROOM)
    print(f"Created {OUT_BRIDE.name}, {OUT_GROOM.name}")


if __name__ == "__main__":
    main()
