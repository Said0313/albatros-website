"use strict";
const express = require("express");
const { requireAuth } = require("../auth");
const { readBrands } = require("../catalog");

const router = express.Router();

// The site's fixed category list (mirrors src/lib/catalog.ts `categories`).
// The panel must only write categories the site knows how to localise.
const CATEGORIES = [
  "ИХЛА",
  "Биохимия",
  "Гемостаз",
  "Гематология",
  "Микробиология",
  "ПЦР",
  "Аллергология",
  "КЩС",
  "ВЭЖХ",
  "Клинический анализ",
  "Генетика",
  "Функциональная диагностика",
  "Биодеконтаминация",
  "Программы контроля качества",
  "Автоматизированная лаборатория",
  "Иммуногематология",
  "Токсикология",
  "Клиническая диагностика",
];

// General directions (top level of the two-level taxonomy).
const GENERAL_DIRECTIONS = [
  { key: "equipment", name: "Медицинское оборудование" },
  { key: "reagents", name: "Реагенты" },
  { key: "consumables", name: "Расходные материалы" },
  { key: "controls", name: "Контроль качества" },
];

// GET /api/meta -> categories, brands, general directions for edit form dropdowns
router.get("/", requireAuth, (req, res) => {
  let brands = [];
  try {
    brands = readBrands().map((b) => ({
      id: b.id,
      // product.brand matches the partner name, except Thermo Fisher (id thermofisher).
      name: b.id === "thermofisher" ? "Thermo Fisher" : b.name,
    }));
  } catch (err) {
    // brands are optional for the form; log and continue.
    console.error("[meta] failed to read brands:", err.message);
  }
  res.json({ categories: CATEGORIES, generalDirections: GENERAL_DIRECTIONS, brands });
});

module.exports = { router, CATEGORIES, GENERAL_DIRECTIONS };
