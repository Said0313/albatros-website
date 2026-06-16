"""Extract the 12 partner logos from the 2x6 grid on PDF page 3.
Crops each cell, trims to the logo, then whitens the light-blue page
background (incl. the faint skyline watermark) so logos sit clean on white.
"""
import os
import numpy as np
from PIL import Image

os.system('pdftoppm -png -r 300 -f 3 -l 3 catalog.pdf scripts/page3')
img = Image.open("scripts/page3-03.png").convert("RGB")
w, h = img.size
os.makedirs("public/images/brands", exist_ok=True)

row1 = ["snibe", "werfen", "bd", "randox", "urit", "lifotronic"]
row2 = ["dymind", "keyu", "illumina", "phadia", "condalab", "clarius"]
x0, x1 = 0.505, 0.992
col_w = (x1 - x0) / 6
bands = [(row1, 0.850, 0.892), (row2, 0.912, 0.953)]


def whiten(a):
    """Set light-blue background (incl. skyline watermark) to pure white.
    Protects dark logo strokes (low min) and warm-colored logos (R>B)."""
    a = a.astype(int)
    R, B = a[:, :, 0], a[:, :, 2]
    mn = a.min(axis=2)
    mx = a.max(axis=2)
    sat = mx - mn
    light_grey = (mn > 158) & (sat < 60)
    light_blue = (mn > 148) & (sat < 92) & (B >= R - 5)  # skyline watermark
    bg = light_grey | light_blue
    a[bg] = [255, 255, 255]
    return a.astype("uint8")


def trim(a):
    fg = (a < 250).any(axis=2)
    ys, xs = np.where(fg)
    if len(xs):
        p = 10
        return a[max(0, ys.min() - p): ys.max() + p,
                 max(0, xs.min() - p): xs.max() + p]
    return a


for names, yt, yb in bands:
    for c, name in enumerate(names):
        l = int((x0 + c * col_w) * w)
        r = int((x0 + (c + 1) * col_w) * w)
        crop = np.array(img.crop((l, int(yt * h), r, int(yb * h))))
        crop = trim(whiten(crop))
        Image.fromarray(crop).save(f"public/images/brands/{name}.png")
        print("saved", name, crop.shape[1], "x", crop.shape[0])
