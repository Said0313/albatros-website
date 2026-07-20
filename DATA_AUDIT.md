# Data audit: new catalog vs old site (report only)

**Scope:** Phase 7. Compares `src/data/catalog.json` (the new site) against the live old site `https://www.albatros.uz` product by product. Report only, no catalog data changed. Complements the earlier price-list audit in [AUDIT_catalog_vs_pricelist.md](AUDIT_catalog_vs_pricelist.md) (which covered reagent/spec provenance vs the PDF price list).

**Method:** scraped the old `/catalog` (116 product links) and the matched old `/product/{slug}` detail pages; matched to the new catalog by normalized model name (brand prefixes and trailing id hashes stripped). Matched 57 of 62 new equipment products.

## Counts
- New catalog: 75 records = 62 equipment products (own product page) + 13 grouped "imageless" reagent / consumable / control cards.
- Old site: 116 `/product/` links (a mix of equipment and individual reagents/kits).

## 1. On the old site, MISSING from the new catalog
These are real equipment products present on the old site that have no equivalent in the new catalog. Owner should decide whether to add them:
- **Тромбоэластометр ROTEM delta** (Werfen, thromboelastometry), not present in the new catalog at all.
- **Biossays E6** (SNIBE biochemistry), not present.
- **BQ-50**, not present.
- **iScan**, not present.
- **Biossays C8**, the new catalog has **Biossays C10** instead (see §3). If both models are sold, C8 is missing.

Not actually missing (present in the new catalog under a different slug; flagged here only because the automated name match is imperfect): NextSeq 1000 & 2000 (`nextseq-1000-2000`), NovaSeq X / X Plus (`novaseq-x`), SQA-IO + SQA-VU (`sqa-io-vu`).

The remaining ~50 old `/product/` links that do not map to a new equipment product are individual reagents/kits/consumables. In the new catalog these are intentionally consolidated into the 13 grouped cards (Реагенты MAGLUMI, Биохимические реагенты SNIBE, etc.), so they are not "missing" so much as restructured. This restructuring was validated against the price list in the earlier audit.

## 2. In the new catalog, NOT found on the old site (added / to verify)
- **Maglumi 2000** and **Maglumi 2000 Plus** (ИХЛА), not on the current old catalog. Per project history these were added as placeholders (older SNIBE models, fallback images, not on the live site). Owner should confirm they are still offered.
- The **13 grouped reagent / consumable / control cards** are new constructs that summarize the price list; they are not old-site catalog products. Their analyte lists were validated against the price list (no invented analytes) in the earlier audit.
- `reagenty-ihla`, `condalab-media` appear "new-only" only because the old site's equivalents use Cyrillic slugs the matcher could not normalize; they do exist on the old site.

## 3. Model / naming discrepancy
- **Biossays C8 (old) vs Biossays C10 (new).** The old site sells "Biossays C8"; the new catalog lists "Biossays C10". Either C10 is a newer model or a mislabel. This is the same discrepancy raised in the price-list audit. Owner: confirm the correct model.

## 4. Descriptions and specs (matched products)
- **Names, models and categories align** for the 57 matched products (same brand/model; categories consistent, e.g. Maglumi -> ИХЛА, ACL TOP -> Гемостаз, Phoenix -> Микробиология).
- **`detailedDescription` (RU)** was populated in Phase 4 directly from each old product page's characteristics tab, so it now matches the old site verbatim (56 products).
- **`shortDescription`, `fullDescription`, `specifications`** were authored in an earlier build from sources other than the price list (per the earlier audit, they cannot be validated against the price list and the numeric specs should be spot-checked against manufacturer datasheets). They are generally consistent with the old site's positioning but are shorter/paraphrased rather than copied.
- **No fabricated products** were found in the new catalog: every equipment record corresponds to a real manufacturer model (SNIBE, Dymind, Werfen, BD, Randox, Illumina, URIT, KEYU, Clarius, BLOZER, Lifotronic, Condalab, Thermo Fisher/Phadia).

## 5. Summary for the owner
| Finding | Action |
|---|---|
| ROTEM delta, Biossays E6, BQ-50, iScan missing from new catalog | Owner: add if still sold |
| Biossays C8 (old) vs C10 (new) | Owner: confirm correct model |
| Maglumi 2000 / 2000 Plus added, not on old site | Owner: confirm still offered |
| 13 grouped reagent/consumable/control cards | New constructs, validated vs price list; keep |
| Matched products' names/categories | Consistent, no fabricated products |
| short/full descriptions + numeric specs | Verify against manufacturer datasheets (see price-list audit) |

No catalog data was changed in this phase.
