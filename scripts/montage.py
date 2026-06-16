"""Build a labeled grid montage of product crops for quick visual verification.
Usage: python scripts/montage.py slug1 slug2 ...   (or no args = all in products dir)
Saves scripts/montage.png
"""
import sys, os
from PIL import Image, ImageDraw

DIR = "public/images/products"
slugs = sys.argv[1:]
if not slugs:
    slugs = sorted(f[:-4] for f in os.listdir(DIR) if f.endswith(".png"))

cell = 260
cols = 4
rows = (len(slugs) + cols - 1) // cols
canvas = Image.new("RGB", (cols * cell, rows * (cell + 22)), (240, 240, 240))
draw = ImageDraw.Draw(canvas)

for i, slug in enumerate(slugs):
    cx, cy = (i % cols) * cell, (i // cols) * (cell + 22)
    p = f"{DIR}/{slug}.png"
    if os.path.exists(p):
        im = Image.open(p).convert("RGB")
        im.thumbnail((cell - 16, cell - 16))
        canvas.paste(im, (cx + (cell - im.width) // 2, cy + (cell - im.height) // 2))
    else:
        draw.rectangle([cx + 8, cy + 8, cx + cell - 8, cy + cell - 8], outline=(200, 0, 0))
    draw.text((cx + 6, cy + cell + 4), slug, fill=(0, 0, 0))

canvas.save("scripts/montage.png")
print(f"montage: {len(slugs)} items -> scripts/montage.png {canvas.size}")
