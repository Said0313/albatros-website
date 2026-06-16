"""Crop a single product from a rendered catalog page.
Usage: python scripts/crop.py <page> <slug> <l> <t> <r> <b>
Coords are fractional (0..1) of the page width/height.
Trims uniform near-white borders for a tight result.
"""
import sys
import numpy as np
from PIL import Image

page, slug = sys.argv[1], sys.argv[2]
l, t, r, b = map(float, sys.argv[3:7])

img = Image.open(f"scripts/pages/page-{int(page):02d}.png").convert("RGB")
w, h = img.size
crop = img.crop((int(l * w), int(t * h), int(r * w), int(b * h)))

a = np.array(crop)
mask = (a < 245).any(axis=2)
ys, xs = np.where(mask)
if len(xs):
    pad = 14
    crop = crop.crop((
        max(0, int(xs.min()) - pad),
        max(0, int(ys.min()) - pad),
        min(crop.width, int(xs.max()) + pad),
        min(crop.height, int(ys.max()) + pad),
    ))

crop.save(f"public/images/products/{slug}.png")
print(f"saved {slug}: {crop.size}")
