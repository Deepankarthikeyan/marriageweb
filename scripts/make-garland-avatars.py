#!/usr/bin/env python3
"""Add marigold garland rings around groom/bride avatar portraits."""

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT_GROOM = ROOT / "assets/images/groom-garland.png"
OUT_BRIDE = ROOT / "assets/images/bride-garland.png"
PUBLIC = ROOT / "public/images"


def make_garland_avatar(src: Path, out: Path, flower_colors: list[tuple[int, int, int]]) -> None:
    face = Image.open(src).convert("RGBA")
    size = 512
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    face_r = 165
    cx, cy = size // 2, size // 2 - 20
    face_img = face.resize((face_r * 2, face_r * 2), Image.Resampling.LANCZOS)
    mask = Image.new("L", (face_r * 2, face_r * 2), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, face_r * 2 - 1, face_r * 2 - 1), fill=255)
    canvas.paste(face_img, (cx - face_r, cy - face_r), mask)
    draw = ImageDraw.Draw(canvas)
    for i in range(36):
        ang = math.radians(i * 360 / 36)
        x = cx + 200 * math.cos(ang)
        y = cy + 30 + 215 * math.sin(ang)
        r = 16 if i % 2 == 0 else 12
        col = flower_colors[i % len(flower_colors)]
        draw.ellipse((x - r, y - r * 0.85, x + r, y + r * 0.85), fill=col + (220,))
        draw.ellipse((x - r * 0.35, y - r * 0.3, x + r * 0.35, y + r * 0.3), fill=(255, 240, 200, 180))
    for i in range(18):
        ang = math.radians(i * 360 / 18 + 10)
        x = cx + 188 * math.cos(ang)
        y = cy + 25 + 200 * math.sin(ang)
        draw.ellipse((x - 8, y - 5, x + 8, y + 5), fill=(34, 120, 60, 200))
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out)


def main() -> None:
    make_garland_avatar(
        ROOT / "assets/images/groom-avatar.png",
        OUT_GROOM,
        [(255, 160, 40), (255, 120, 20), (255, 200, 60), (255, 140, 30)],
    )
    make_garland_avatar(
        ROOT / "assets/images/bride-avatar.png",
        OUT_BRIDE,
        [(255, 150, 50), (255, 100, 120), (255, 180, 70), (230, 80, 100)],
    )
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for path in (OUT_GROOM, OUT_BRIDE):
        path.replace(PUBLIC / path.name) if False else None
        import shutil
        shutil.copy2(path, PUBLIC / path.name)
    print("Created groom-garland.png, bride-garland.png")


if __name__ == "__main__":
    main()
