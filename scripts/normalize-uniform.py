"""Devices end at a CONSISTENT visual size (longer side = 84% of canvas), never cropped.
Wide automation lines and tall analyzers end up comparable in scale, all centered on white.
Usage: python scripts/normalize-uniform.py
"""
from PIL import Image
import numpy as np, glob, os

CANVAS, TARGET, BG = 1000, 0.84, (255, 255, 255, 255)  # device's LONGER side = 84% of canvas


def trim_white(im):
    a = np.array(im.convert("RGB"))
    nz = (a < 248).any(axis=2)
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
    im = trim_white(f)
    w, h = im.size
    longer = max(w, h)
    s = (CANVAS * TARGET) / longer  # scale by LONGER side -> uniform visual size
    im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    c = Image.new("RGBA", (CANVAS, CANVAS), BG)
    c.alpha_composite(im, ((CANVAS - im.width) // 2, (CANVAS - im.height) // 2))
    out = os.path.splitext(p)[0] + ".png"
    c.convert("RGB").save(out, "PNG")
    if out.lower() != p.lower():
        os.remove(p)
    print("ok", os.path.basename(out))
