# Catalog vs Price-List Audit (report only)

**Source of truth:** `AHC_pricelist_2026_01.pdf` (11 pages, valid to 01.12.2025).
**Checked against:** `src/data/catalog.json` (75 products).
**Scope:** report only. No catalog data was changed. All findings below are for the owner to review and decide.

## 0. What the two documents are

The two files are not the same kind of list, so a 1:1 match is not expected:

- **The price list** is a *reagent / test / consumable / control* price list, organised by discipline: ИХЛА (SNIBE MAGLUMI tests, pp.1-4), Биохимия (SNIBE Biossays reagents + controls, pp.5-6), Гематология (Dymind + Lifotronic HbA1c reagents, p.7), Гемостаз (Werfen ACL TOP reagents, p.8), Микробиология (BD Phoenix + URIT urine, p.9), Внешний контроль качества (Randox RIQAS + ACUSERA, pp.10-11). Equipment models appear only as section headers/footers, not as priced line items with specs.
- **The catalog** is primarily an *equipment* catalog (analyzers) plus 14 grouped "imageless" reagent / consumable / control cards whose analyte lists summarise the price list.

Because of this, the price list mostly validates the reagent cards and a subset of the equipment names; it does not contain specs or descriptions for anything.

## 1. Reagent / consumable / control cards — MATCH the price list

The 14 grouped cards were cross-checked analyte-by-analyte against the price list. They are faithful, accurate condensations of the price-list sections. **No invented analytes were found.** Examples:

- **Реагенты MAGLUMI (ИХЛА)** — 67 analytes, all present in the price list (a representative ~1/3 subset of the ~200 MAGLUMI tests listed; see §4).
- **Биохимические реагенты SNIBE** — 44 analytes, all traceable to pp.5-6.
- **Реагенты для гемостаза Werfen** — 24 analytes, all traceable to p.8.
- **Контроли/калибраторы** (biochemistry, hemostasis, urine) — control codes (HN 1530, HE 1532, CAL 2350, CH 2673, LP 5047, QC22, UQ-14, etc.) all match the price-list control/calibrator sections.

**Conclusion:** the reagent/consumable/control data is sourced from the price list and is trustworthy.

## 2. Equipment names — matches, mismatches, and models not in the price list

### (a) Confirmed by the price list
Maglumi 600 / 800 / 2000 (M600/M800/M2000 consumable headers), Maglumi X3 / X6 / X8, Biossays 240 Plus, Dymind DH-26 / DH-615 / DH-800 / DF50 CRP, Lifotronic H8 / H9 / GH-900 Plus, Werfen ACL TOP 350 CTS, BD Phoenix M50, URIT US-1000 / US-2000C, Randox RIQAS + ACUSERA.

### (b) MISMATCH to flag
- **Biossays C8 vs Biossays C10.** The price list (p.6 footer) references **"Biossays C8"**. The catalog lists **"Biossays C10"** (slug `biossays-c10`) and has no C8. Either the catalog model number is newer than the price list, or it is a mislabel. **Owner: please confirm the correct model (C8 vs C10).**
- **HbA1c HPLC placement.** The price list groups the HbA1c HPLC analyzers (H8/H9/GH900) under **Гематология** (p.7). The catalog files them under a separate **ВЭЖХ** (HPLC) category. This is a reasonable taxonomy choice, not an error, but the two documents categorise them differently.

### (c) Catalog equipment NOT in the price list (expected — price by request)
These are real manufacturer models the company distributes, but they are not priced in this reagent-focused list, so their **names and specs cannot be validated against this source** and should be verified another way:
Maglumi X10, Biossays C10, Biolumi CX Solution, SATLARS T8, URIT BS-8000, Phadia 200, Dymind DH-88, CUBE 30 Touch, DF56 Vet, Lifotronic H100 Plus, all Illumina (MiSeq i100, NextSeq 550, NextSeq 1000/2000, NovaSeq 6000, NovaSeq X), BLOZER 200/72, GEM Premier 5000/3500, URIT US-1680, URIT BF-730, KEYU KU-F20/F40, SQA-IO+VU, BD BACTEC FX 40, Condalab media, Molecision R8/S6/MP-32/MP-96, Evidence Multistat, Clarius C3/L7/L15/L20/PA/EC7/PAL, QCMD, Qnostics.

- **QCMD and Qnostics** specifically: these appear in the catalog under "Программы контроля качества" but are **not in the price list**. RIQAS and ACUSERA are (pp.10-11); QCMD/Qnostics are separate Randox molecular-QC services. **Owner: confirm these two belong here.**

## 3. Specs and descriptions — NOT verifiable against the price list

Every equipment product carries `shortDescription`, `fullDescription`, and a `specifications` list (e.g. Maglumi X8: "до 600 тестов/час", "300 позиций", "192×118×150 см", "670 кг", "260 параметров"). **The price list contains none of this** — no specs, no marketing copy. So all of this text was sourced elsewhere (manufacturer sites, per project history), and:

- It is **not necessarily invented**, but it **cannot be confirmed from the price list**.
- The numeric specs (throughput, sample positions, dimensions, weight, parameter counts) are the highest-risk fields for automated error and should be spot-checked against each manufacturer's datasheet.

This is the direct answer to the concern about "specs or descriptions added that are not in the source": by construction, 100% of the specs/descriptions are outside the price-list source and need manufacturer-datasheet verification.

## 4. Price-list items missing from the catalog

- **MAGLUMI test menu is a subset.** The price list has ~200 MAGLUMI tests across many panels (thyroid, reproductive, prenatal, bone, oncomarkers, cardiology, hypertension, TORCH, hepatitis, autoimmune, diabetes, EBV, etc.). The catalog's "Реагенты MAGLUMI" card lists 67 representative analytes. This is a deliberate summary, not a defect, but the catalog does not expose the full menu.
- **Preaccu™** prenatal-screening software (p.2) — not in the catalog.
- **Veterinary ИХЛА tests** (cTSH, cTT4, cFT4, p.4) — not in the catalog.
- **Электролитный блок / ISE** (Ca²⁺, Cl⁻, K⁺, Na⁺, pH, 10 000 tests, p.6) — the biochemistry reagent card lists Ca/P/Mg/Zn/Cu but not the ISE electrolyte block.
- Numerous individual biochemistry, hemostasis and urine line items are folded into the grouped cards rather than listed individually.

## 5. Summary for the owner

| Area | Verdict |
|------|---------|
| Reagent / consumable / control analyte lists | Accurate, sourced from price list. No invented analytes. |
| Equipment names | Real models; most confirmed or plausibly out-of-scope of the price list. |
| Biossays C8 (price list) vs C10 (catalog) | **Needs owner confirmation.** |
| QCMD / Qnostics under QC programs | **Needs owner confirmation** (not in price list). |
| Specs + descriptions on all equipment | **Not in the price list at all — verify against manufacturer datasheets.** |
| Missing from catalog | Full MAGLUMI menu, Preaccu software, vet tests, ISE electrolyte block (all by design, noted for completeness). |

No data was deleted or changed. Recommend the owner: (1) confirm Biossays C8/C10 and QCMD/Qnostics, (2) spot-check equipment numeric specs against manufacturer datasheets.
