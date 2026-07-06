"""AI background removal -> uniform white 1000x1000 (device longer side = 84%, never cropped).
Cuts the device from ANY background (rembg) and centers it on a clean white field.
Usage: python scripts/cutout-bg.py
"""
from rembg import remove
from PIL import Image
import numpy as np, glob, os

CANVAS, TARGET, BG = 1000, 0.84, (255, 255, 255, 255)

TARGETS = [
    "clarius-c3-hd3", "clarius-l7-hd3", "clarius-l15-hd3", "clarius-l20-hd3",
    "clarius-pa-hd3", "clarius-ec7-hd3", "clarius-pal-hd3",
    "blozer-200", "blozer-72", "satlars-t8", "evidence-multistat",
    "molecision-mp-32", "reagenty-ihla",
]


def place(cut, out):
    a = np.array(cut)
    ys, xs = np.where(a[:, :, 3] > 10)
    if len(xs) == 0:
        return False
    cut = cut.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))
    w, h = cut.size
    s = (CANVAS * TARGET) / max(w, h)
    cut = cut.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    c = Image.new("RGBA", (CANVAS, CANVAS), BG)
    c.alpha_composite(cut, ((CANVAS - cut.width) // 2, (CANVAS - cut.height) // 2))
    c.convert("RGB").save(out, "PNG")
    return True


if __name__ == "__main__":
    for slug in TARGETS:
        matches = glob.glob(f"public/images/products/{slug}.*")
        if not matches:
            print("skip (not found)", slug)
            continue
        src = matches[0]
        cut = remove(Image.open(src).convert("RGBA"))
        out = f"public/images/products/{slug}.png"
        if place(cut, out):
            # remove a *different* (non-png) source, but never the file we just wrote
            if os.path.abspath(src) != os.path.abspath(out) and os.path.exists(src):
                os.remove(src)
            print("cut+placed", slug)
        else:
            print("empty cutout (kept original)", slug)
