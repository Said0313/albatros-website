import fitz, os, io
from PIL import Image

PDF = "../AlbaSite/\u0421atalog_2026.pdf"
OUT = "public/images/products/raw"
os.makedirs(OUT, exist_ok=True)

doc = fitz.open(PDF)
seen = set()
kept = []
for pno in range(len(doc)):
    page = doc[pno]
    for img in page.get_images(full=True):
        xref = img[0]
        if xref in seen:
            continue
        seen.add(xref)
        try:
            base = doc.extract_image(xref)
        except Exception:
            continue
        data = base["image"]
        if len(data) < 150_000:
            continue
        try:
            im = Image.open(io.BytesIO(data))
            w, h = im.size
        except Exception:
            continue
        if w < 500 or h < 400:
            continue
        fname = f"p{pno+1:02d}_x{xref}.png"
        fpath = os.path.join(OUT, fname)
        if im.mode in ("CMYK", "P"):
            im = im.convert("RGB")
        im.save(fpath)
        kept.append((pno+1, fname, w, h, round(len(data)/1024)))

for k in kept:
    print(f"PAGE {k[0]:2d}  {k[1]:20s}  {k[2]}x{k[3]}  {k[4]}KB")
print(f"\nKept {len(kept)} product images")
