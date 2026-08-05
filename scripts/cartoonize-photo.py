#!/usr/bin/env python3
"""Cartoonize the exact couple photo — same image, cartoon style only."""

import cv2
import numpy as np
from pathlib import Path

SRC = Path("public/images/couple.jpeg")
OUT_COUPLE = Path("public/images/couple-cartoon.png")
OUT_BRIDE = Path("public/images/bride-cartoon.png")
OUT_GROOM = Path("public/images/groom-cartoon.png")


def cartoonize(img: np.ndarray, blur: int = 7, edge_thresh: int = 9) -> np.ndarray:
    """Edge-preserving cartoon filter on the exact photo."""
    # Smooth colors while keeping edges
    color = cv2.bilateralFilter(img, blur, 80, 80)

    # Edge mask
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)
    edges = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, edge_thresh, 7
    )
    edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

    # Combine smooth color with dark outlines
    cartoon = cv2.bitwise_and(color, edges)

    # Slight saturation boost for cartoon pop
    hsv = cv2.cvtColor(cartoon, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.25, 0, 255)
    hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.05, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)


def cartoonize_v2(img: np.ndarray) -> np.ndarray:
    """Same photo → cartoon: flat colors + clean outlines."""
    h, w = img.shape[:2]

    # Color quantization (flat cartoon regions)
    data = img.reshape((-1, 3)).astype(np.float32)
    k = 10
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 12, 1.0)
    _, labels, centers = cv2.kmeans(data, k, None, criteria, 8, cv2.KMEANS_PP_CENTERS)
    quantized = centers[labels.flatten()].reshape(img.shape).astype(np.uint8)
    quantized = cv2.bilateralFilter(quantized, 9, 75, 75)

    # Clean edge lines from original
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(gray, 60, 120)
    edges = cv2.dilate(edges, np.ones((2, 2), np.uint8), iterations=1)
    edges_inv = cv2.bitwise_not(edges)
    edges_inv = cv2.cvtColor(edges_inv, cv2.COLOR_GRAY2BGR)

    cartoon = cv2.bitwise_and(quantized, edges_inv)

    # Light saturation boost
    hsv = cv2.cvtColor(cartoon, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.15, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)


def make_avatar(crop: np.ndarray, size: int = 400) -> np.ndarray:
    """Square avatar from crop with circular mask feel."""
    h, w = crop.shape[:2]
    side = min(h, w)
    y0 = (h - side) // 2
    x0 = (w - side) // 2
    square = crop[y0 : y0 + side, x0 : x0 + side]
    return cv2.resize(square, (size, size), interpolation=cv2.INTER_CUBIC)


def main():
    img = cv2.imread(str(SRC))
    if img is None:
        raise SystemExit(f"Cannot read {SRC}")

    cartoon = cartoonize_v2(img)
    cv2.imwrite(str(OUT_COUPLE), cartoon, [cv2.IMWRITE_PNG_COMPRESSION, 3])

    h, w = cartoon.shape[:2]
    # Woman left, man right (same as photo)
    bride_crop = cartoon[:, : w // 2]
    groom_crop = cartoon[:, w // 2 :]

    cv2.imwrite(str(OUT_BRIDE), make_avatar(bride_crop))
    cv2.imwrite(str(OUT_GROOM), make_avatar(groom_crop))

    print(f"Created {OUT_COUPLE}, {OUT_BRIDE}, {OUT_GROOM}")


if __name__ == "__main__":
    main()
