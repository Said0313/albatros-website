"""Normalize every product image to one identical white square canvas.
Same size, centered, uniform margin -> a symmetric, premium-looking grid.
Usage: python scripts/normalize-images.py
"""
from PIL import Image
import numpy as np, glob, os

CANVAS = 1000              # square canvas
CONTENT = 820             # max content box inside canvas (uniform margin all around)
BG = (255, 255, 255, 255)  # white background — matches the product image container

for path in glob.glob("public/images/products/*.png"):
    im = Image.open(path).convert("RGBA")
    # 1) Flatten onto white so trim works on white-bg renders
    flat = Image.new("RGBA", im.size, BG); flat.alpha_composite(im); im = flat
    # 2) Trim uniform near-white borders
    a = np.array(im.convert("RGB"))
    mask = (a < 248).any(axis=2)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        continue
    im = im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))
    # 3) Scale to fit inside CONTENT box, preserving aspect ratio
    w, h = im.size
    scale = min(CONTENT / w, CONTENT / h)
    im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
    # 4) Paste centered onto a fixed CANVAS×CANVAS white canvas
    canvas = Image.new("RGBA", (CANVAS, CANVAS), BG)
    canvas.alpha_composite(im, ((CANVAS - im.width) // 2, (CANVAS - im.height) // 2))
    canvas.convert("RGB").save(path, "PNG")
    print("normalized", os.path.basename(path), "->", canvas.size)
