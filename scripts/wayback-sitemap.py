"""
Fetch archived URLs under albatros.uz/product from the Wayback Machine (CDX API)
for a given year and write them out as a plain sitemap list + XML sitemap.

Usage:
    python scripts/wayback-sitemap.py
    python scripts/wayback-sitemap.py --year 2025 --domain albatros.uz --path /product
"""

import argparse
import json
import sys
import urllib.parse
import urllib.request

CDX_ENDPOINT = "http://web.archive.org/cdx/search/cdx"


def fetch_cdx(domain: str, path: str, year: int) -> list[dict]:
    match_url = f"{domain}{path}*"
    params = {
        "url": match_url,
        "from": f"{year}0101",
        "to": f"{year}1231",
        "output": "json",
        "fl": "original,timestamp,statuscode,mimetype",
        "collapse": "urlkey",
        "filter": "statuscode:200",
    }
    query = urllib.parse.urlencode(params)
    full_url = f"{CDX_ENDPOINT}?{query}"

    req = urllib.request.Request(full_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    if not data:
        return []

    header, *rows = data
    return [dict(zip(header, row)) for row in rows]


def write_outputs(entries: list[dict], out_prefix: str) -> None:
    urls = sorted({e["original"] for e in entries})

    txt_path = f"{out_prefix}.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        for u in urls:
            f.write(u + "\n")

    xml_path = f"{out_prefix}.xml"
    with open(xml_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for u in urls:
            f.write(f"  <url><loc>{u}</loc></url>\n")
        f.write("</urlset>\n")

    print(f"Found {len(urls)} unique URLs.")
    print(f"Wrote: {txt_path}")
    print(f"Wrote: {xml_path}")


def main():
    parser = argparse.ArgumentParser(description="Build a sitemap from Wayback Machine snapshots.")
    parser.add_argument("--domain", default="albatros.uz")
    parser.add_argument("--path", default="/product")
    parser.add_argument("--year", type=int, default=2025)
    parser.add_argument("--out", default=None, help="Output file prefix (no extension)")
    args = parser.parse_args()

    out_prefix = args.out or f"wayback-sitemap-{args.domain.replace('.', '_')}-{args.year}"

    print(f"Querying Wayback CDX for {args.domain}{args.path}* in {args.year}...")
    try:
        entries = fetch_cdx(args.domain, args.path, args.year)
    except urllib.error.URLError as e:
        print(f"Request failed: {e}", file=sys.stderr)
        sys.exit(1)

    if not entries:
        print("No archived snapshots found for that domain/path/year.")
        sys.exit(0)

    write_outputs(entries, out_prefix)


if __name__ == "__main__":
    main()
