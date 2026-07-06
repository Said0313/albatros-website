"""Robust re-normalization of ALL product images to a uniform white 1000x1000.
Flattens ANY background onto white, trims only near-white margin, contain-fits
(shrink-only, never crops the device), centers. Drops non-PNG sources.
Usage: python scripts/normalize-all-v2.py
"""
from PIL import Image
import numpy as np, glob, os

CANVAS, CONTENT, BG = 1000, 880, (255, 255, 255, 255)


def trim_white(im):
    a = np.array(im.convert("RGB"))
    nz = (a < 250).any(axis=2)  # tolerance 250
    rows = np.where(nz.any(axis=1))[0]
    cols = np.where(nz.any(axis=0))[0]
    if len(rows) == 0 or len(cols) == 0:
        return im
    return im.crop((int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1))


for p in glob.glob("public/images/products/*.*"):
    if not p.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".avif")):
        continue
    im = Image.open(p).convert("RGBA")
    f = Image.new("RGBA", im.size, BG)
    f.alpha_composite(im)
    im = f  # flatten ANY bg onto white
    im = trim_white(im)
    w, h = im.size
    s = min(CONTENT / w, CONTENT / h)  # contain-fit, shrink only, NEVER crop device
    im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    c = Image.new("RGBA", (CANVAS, CANVAS), BG)
    c.alpha_composite(im, ((CANVAS - im.width) // 2, (CANVAS - im.height) // 2))
    out = os.path.splitext(p)[0] + ".png"
    c.convert("RGB").save(out, "PNG")
    if out != p:
        os.remove(p)  # drop the old non-png file
    print("normalized", os.path.basename(out), c.size)
