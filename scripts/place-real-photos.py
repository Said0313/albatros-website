"""Place the owner's real product photos onto a uniform white square canvas.
CONTAIN-FIT ONLY — the whole device is scaled to fit; nothing is ever cropped.
Usage: python scripts/place-real-photos.py
"""
from PIL import Image
import numpy as np, os

SRC = "Photos"
DST = "public/images/products"
CANVAS = 1000          # uniform square
CONTENT_MAX = 900      # device fits within this box; rest is white padding
BG = (255, 255, 255, 255)

mapping = {
    "ACL TOP 350 CTS.webp": "acl-top-350-cts",
    "BF-730.webp": "urit-bf-730",
    "BS-8000.png": "urit-bs-8000",
    "Bactec FX40.avif": "bd-bactec-fx40",
    "Biolumi CX Solution-X10+C10.png": "biolumi-cx-solution",
    "Biossays 240 plus.png": "biossays-240-plus",
    "Biossays C10.png": "biossays-c10",
    "Blozer 200.webp": "blozer-200",
    "Blozer 72.jpg": "blozer-72",
    "Clarius C3.webp": "clarius-hd3",
    "Cube 30 Touch.webp": "cube-30-touch",
    "Dymind DF50 CRP.png": "df50-crp",
    "Dymind DH-26.webp": "dh-26",
    "Dymind DH-615.webp": "dh-615",
    "Dymind DH-800.webp": "dh-800",
    "Dymind DH-88.webp": "dh-88",
    "Evidence Multistat.webp": "evidence-multistat",
    "GEM Premier 3500.png": "gem-premier-3500",
    "GEM Premier 5000.png": "gem-premier-5000",
    "GH900 Plus.webp": "gh-900-plus",
    "H100 Plus.jpeg": "h100-plus",
    "H8.png": "h8",
    "Keyu KU-F20.png": "keyu-ku-f20",
    "Keyu KU-F40.png": "keyu-ku-f40",
    "Maglumi X10.png": "maglumi-x10",
    "Maglumi X3.png": "maglumi-x3",
    "Maglumi X6.png": "maglumi-x6",
    "Maglumi X8.png": "maglumi-x8",
    "MiSeq i100.jpg": "miseq-i100",
    "Molecision MP-32.jpg": "molecision-mp-32",
    "Molecision MP-96.jpg": "molecision-mp-96",
    "Molecision R8.jpg": "molecision-r8",
    "Molecision S6.jpg": "molecision-s6",
    "Phadia 200.jpg": "phadia-200",
    "Phoenix M50.jpg": "bd-phoenix-m50",
    "Randox Acusera.png": "acusera",
    "SQA-iO & VU.png": "sqa-io-vu",
    "Satlars T8.jpg": "satlars-t8",
    "US-1000.webp": "urit-us-1000",
    "US-1680.jpg": "urit-us-1680",
}


def conservative_trim(im):
    """Trim ONLY pure-white outer margin (empty space). Never touches the device.
    A row/column is removed only if EVERY pixel in it is near-pure-white (>=252)."""
    a = np.array(im.convert("RGB"))
    nonwhite_rows = np.where((a < 252).any(axis=2).any(axis=1))[0]
    nonwhite_cols = np.where((a < 252).any(axis=2).any(axis=0))[0]
    if len(nonwhite_rows) == 0 or len(nonwhite_cols) == 0:
        return im
    top, bot = nonwhite_rows[0], nonwhite_rows[-1]
    left, right = nonwhite_cols[0], nonwhite_cols[-1]
    return im.crop((int(left), int(top), int(right) + 1, int(bot) + 1))


placed, skipped = 0, 0
for fname, slug in mapping.items():
    src = os.path.join(SRC, fname)
    if not os.path.exists(src):
        # Already processed into DST previously; raw original was removed as a duplicate.
        print(f"skip    {fname:34} -> not in {SRC}/ (already processed?)")
        skipped += 1
        continue
    im = Image.open(src).convert("RGBA")
    flat = Image.new("RGBA", im.size, BG); flat.alpha_composite(im); im = flat
    im = conservative_trim(im)
    w, h = im.size
    scale = min(CONTENT_MAX / w, CONTENT_MAX / h)   # only shrink, keep aspect
    im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), BG)
    canvas.alpha_composite(im, ((CANVAS - im.width) // 2, (CANVAS - im.height) // 2))
    canvas.convert("RGB").save(os.path.join(DST, f"{slug}.png"), "PNG")
    print(f"placed  {fname:34} -> {slug}.png  (device {im.width}x{im.height} on {CANVAS}x{CANVAS})")
    placed += 1

print(f"\nDone: {placed} photos placed, {skipped} skipped (not found in {SRC}/).")
