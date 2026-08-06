#!/usr/bin/env python3
"""Remove background from scroll corner avatars and trim to transparent PNG."""

import shutil
from pathlib import Path

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets/images"
PUBLIC = ROOT / "public/images"
NAMES = ("groom-scroll-avatar.png", "bride-scroll-avatar.png")


def process(name: str) -> None:
    src = ASSETS / name
    if not src.exists():
        raise FileNotFoundError(src)
    out = remove(Image.open(src))
    if out.mode != "RGBA":
        out = out.convert("RGBA")
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(src)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, PUBLIC / name)
    print(f"Saved transparent {name} ({out.size[0]}x{out.size[1]})")


def main() -> None:
    for name in NAMES:
        process(name)


if __name__ == "__main__":
    main()
