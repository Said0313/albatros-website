// Fetch archived URLs under a domain/path from the Wayback Machine (CDX API)
// for a given year and write them out as a plain sitemap list + XML sitemap.
//
// Usage:
//   node scripts/wayback-sitemap.mjs
//   node scripts/wayback-sitemap.mjs --domain albatros.uz --path /product --year 2025

import { writeFile } from "node:fs/promises";

function parseArgs(argv) {
  const args = { domain: "albatros.uz", path: "/product", year: 2025, out: null, from: null, to: null };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === "--domain") args.domain = argv[++i];
    else if (key === "--path") args.path = argv[++i];
    else if (key === "--year") args.year = Number(argv[++i]);
    else if (key === "--out") args.out = argv[++i];
    else if (key === "--from") args.from = argv[++i];
    else if (key === "--to") args.to = argv[++i];
  }
  return args;
}

async function fetchCdx(domain, path, year, fromOverride, toOverride) {
  const matchUrl = `${domain}${path}*`;
  const params = new URLSearchParams({
    url: matchUrl,
    from: fromOverride ?? `${year}0101`,
    to: toOverride ?? `${year}1231`,
    output: "json",
    fl: "original,timestamp,statuscode,mimetype",
    collapse: "urlkey",
    filter: "statuscode:200",
  });

  const fullUrl = `http://web.archive.org/cdx/search/cdx?${params.toString()}`;
  const res = await fetch(fullUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) {
    throw new Error(`CDX request failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!data || data.length === 0) return [];

  const [header, ...rows] = data;
  return rows.map((row) => Object.fromEntries(header.map((h, i) => [h, row[i]])));
}

async function writeOutputs(entries, outPrefix) {
  const urls = [...new Set(entries.map((e) => e.original))].sort();

  const txtPath = `${outPrefix}.txt`;
  await writeFile(txtPath, urls.join("\n") + "\n", "utf-8");

  const xmlPath = `${outPrefix}.xml`;
  const body = urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  await writeFile(xmlPath, xml, "utf-8");

  console.log(`Found ${urls.length} unique URLs.`);
  console.log(`Wrote: ${txtPath}`);
  console.log(`Wrote: ${xmlPath}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outPrefix = args.out ?? `wayback-sitemap-${args.domain.replace(/\./g, "_")}-${args.year}`;

  console.log(`Querying Wayback CDX for ${args.domain}${args.path}* in ${args.year}...`);
  const entries = await fetchCdx(args.domain, args.path, args.year, args.from, args.to);

  if (entries.length === 0) {
    console.log("No archived snapshots found for that domain/path/year.");
    return;
  }

  await writeOutputs(entries, outPrefix);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
