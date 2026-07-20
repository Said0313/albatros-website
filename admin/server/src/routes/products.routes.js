"use strict";
const express = require("express");
const multer = require("multer");
const { requireAuth } = require("../auth");
const {
  readCatalog,
  writeCatalog,
  validateProduct,
  orderProduct,
} = require("../catalog");
const { CATALOG_PATH } = require("../config");
const { processAndSave, deleteByPublicPath, absFromPublicPath } = require("../images");
const { commitFiles } = require("../git");
const { CATEGORIES, GENERAL_DIRECTIONS } = require("./meta.routes");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB per image
});

const DIRECTION_KEYS = GENERAL_DIRECTIONS.map((d) => d.key);

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function authorOf(req) {
  return { name: req.user.name, email: req.user.email };
}

// ── LIST ──────────────────────────────────────────────────────────────────
// GET /api/products
router.get("/", requireAuth, (req, res) => {
  try {
    const products = readCatalog();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Не удалось прочитать каталог: " + err.message });
  }
});

// GET /api/products/:slug
router.get("/:slug", requireAuth, (req, res) => {
  try {
    const product = readCatalog().find((p) => p.slug === req.params.slug);
    if (!product) return res.status(404).json({ error: "Продукт не найден." });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: "Ошибка чтения: " + err.message });
  }
});

// ── IMAGE UPLOAD ────────────────────────────────────────────────────────────
// POST /api/products/upload  (multipart: image, baseSlug)
// Processes to 1000x1000 white canvas PNG and saves under public/images/products.
// Returns the public path; the file is committed together with the product save.
router.post("/upload", requireAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Файл изображения не получен." });
    const baseSlug = slugify(req.body.baseSlug) || "product";
    const publicPath = await processAndSave(req.file.buffer, baseSlug);
    res.json({ path: publicPath });
  } catch (err) {
    res.status(400).json({ error: "Не удалось обработать изображение: " + err.message });
  }
});

// Build a clean product object from an incoming request body, preserving only
// known schema fields (never restructures the data file).
function buildProduct(body, existing) {
  const p = existing ? { ...existing } : {};

  const setStr = (field) => {
    if (typeof body[field] === "string") p[field] = body[field];
  };
  const setOptStr = (field) => {
    if (typeof body[field] === "string" && body[field].trim() !== "") p[field] = body[field];
    else if (body[field] === "" || body[field] === null) delete p[field];
  };
  const setBool = (field) => {
    if (typeof body[field] === "boolean") p[field] = body[field];
  };

  setStr("name");
  setStr("category");
  setStr("brand");
  setStr("shortDescription");
  setStr("fullDescription");
  setOptStr("shortDescriptionUz");
  setOptStr("fullDescriptionUz");
  setOptStr("videoUrl");
  setOptStr("detailedDescription");
  setOptStr("detailedDescriptionUz");
  setOptStr("originalUrl");

  if (Array.isArray(body.images)) p.images = body.images.filter((x) => typeof x === "string");
  if (Array.isArray(body.specifications)) {
    p.specifications = body.specifications
      .filter((s) => s && typeof s.label === "string")
      .map((s) => ({ label: String(s.label), value: String(s.value ?? "") }));
  }
  if (Array.isArray(body.analytes)) p.analytes = body.analytes.map(String);

  setBool("featured");
  setBool("isNew");
  setBool("imageless");
  // Backward-compatible admin fields.
  setBool("hidden");
  if (typeof body.priority === "number") p.priority = body.priority;
  else if (body.priority === "" || body.priority === null) delete p.priority;

  if (typeof body.generalDirection === "string") {
    if (body.generalDirection === "equipment" || body.generalDirection === "") {
      // equipment is the implicit default; keep the file clean by omitting it.
      delete p.generalDirection;
    } else if (DIRECTION_KEYS.includes(body.generalDirection)) {
      p.generalDirection = body.generalDirection;
    }
  }
  return p;
}

function categoryValid(cat) {
  return CATEGORIES.includes(cat);
}

// Diff old vs new image lists; delete files that were removed. Returns the
// absolute paths touched (for the git commit) and whether any file changed.
function reconcileImages(oldImages, newImages) {
  const removed = (oldImages || []).filter((img) => !(newImages || []).includes(img));
  const touched = [];
  for (const img of removed) {
    const deleted = deleteByPublicPath(img);
    if (deleted) touched.push(deleted);
  }
  // New images already exist on disk (uploaded via /upload); include for commit.
  for (const img of newImages || []) {
    touched.push(absFromPublicPath(img));
  }
  return touched;
}

// ── UPDATE EXISTING ─────────────────────────────────────────────────────────
// PUT /api/products/:slug
router.put("/:slug", requireAuth, async (req, res) => {
  try {
    const products = readCatalog();
    const idx = products.findIndex((p) => p.slug === req.params.slug);
    if (idx === -1) return res.status(404).json({ error: "Продукт не найден." });

    const existing = products[idx];
    const updated = buildProduct(req.body, existing);
    // Slug/id are immutable on update to keep product-page routing stable.
    updated.slug = existing.slug;
    updated.id = existing.id;

    if (!categoryValid(updated.category)) {
      return res.status(400).json({ error: "Недопустимая категория." });
    }
    const errors = validateProduct(updated);
    if (errors.length) return res.status(400).json({ error: errors.join(" ") });

    const imgFiles = reconcileImages(existing.images, updated.images);
    products[idx] = updated;
    writeCatalog(products);

    const commit = await commitFiles(
      [CATALOG_PATH, ...imgFiles],
      `content(product): update ${updated.name} [via admin: ${req.user.name}]`,
      authorOf(req)
    );
    res.json({ product: updated, commit });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сохранения: " + err.message });
  }
});

// ── CREATE NEW ────────────────────────────────────────────────────────────
// POST /api/products
router.post("/", requireAuth, async (req, res) => {
  try {
    const products = readCatalog();

    // Required fields (Task 4). Names are brand/model = language-neutral single field.
    const missing = [];
    if (!req.body.name || !String(req.body.name).trim()) missing.push("название");
    if (!categoryValid(req.body.category)) missing.push("категория");
    const dir = req.body.generalDirection || "equipment";
    if (!DIRECTION_KEYS.includes(dir)) missing.push("общее направление");
    if (!req.body.shortDescription || !String(req.body.shortDescription).trim())
      missing.push("краткое описание (RU)");
    if (!req.body.shortDescriptionUz || !String(req.body.shortDescriptionUz).trim())
      missing.push("краткое описание (UZ)");
    if (!Array.isArray(req.body.images) || req.body.images.length === 0)
      missing.push("хотя бы одно фото");
    if (missing.length) {
      return res.status(400).json({ error: "Заполните обязательные поля: " + missing.join(", ") + "." });
    }

    let slug = slugify(req.body.slug) || slugify(req.body.name);
    if (!slug) return res.status(400).json({ error: "Не удалось сформировать slug." });
    if (products.some((p) => p.slug === slug || p.id === slug)) {
      return res.status(409).json({ error: `Продукт со slug "${slug}" уже существует.` });
    }

    const product = buildProduct(req.body, null);
    product.slug = slug;
    product.id = slug;
    if (!Array.isArray(product.specifications)) product.specifications = [];
    if (product.priority === undefined) product.priority = products.length + 1; // default: end of list

    const errors = validateProduct(product);
    if (errors.length) return res.status(400).json({ error: errors.join(" ") });

    // Canonical key order for the new product only; existing products untouched.
    products.push(orderProduct(product));
    writeCatalog(products);

    const imgFiles = (product.images || []).map((img) => absFromPublicPath(img));
    const commit = await commitFiles(
      [CATALOG_PATH, ...imgFiles],
      `content(product): add ${product.name} [via admin: ${req.user.name}]`,
      authorOf(req)
    );
    res.status(201).json({ product, commit });
  } catch (err) {
    res.status(500).json({ error: "Ошибка создания: " + err.message });
  }
});

// ── HIDE / SHOW ─────────────────────────────────────────────────────────────
// PATCH /api/products/:slug/visibility  { hidden: boolean }
router.patch("/:slug/visibility", requireAuth, async (req, res) => {
  try {
    const products = readCatalog();
    const idx = products.findIndex((p) => p.slug === req.params.slug);
    if (idx === -1) return res.status(404).json({ error: "Продукт не найден." });
    const hidden = !!req.body.hidden;
    if (hidden) products[idx].hidden = true;
    else delete products[idx].hidden;
    writeCatalog(products);
    const action = hidden ? "hide" : "show";
    const commit = await commitFiles(
      [CATALOG_PATH],
      `content(product): ${action} ${products[idx].name} [via admin: ${req.user.name}]`,
      authorOf(req)
    );
    res.json({ product: products[idx], commit });
  } catch (err) {
    res.status(500).json({ error: "Ошибка: " + err.message });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /api/products/:slug
router.delete("/:slug", requireAuth, async (req, res) => {
  try {
    const products = readCatalog();
    const idx = products.findIndex((p) => p.slug === req.params.slug);
    if (idx === -1) return res.status(404).json({ error: "Продукт не найден." });
    const [removed] = products.splice(idx, 1);

    const imgFiles = [];
    for (const img of removed.images || []) {
      const deleted = deleteByPublicPath(img);
      if (deleted) imgFiles.push(deleted);
    }
    writeCatalog(products);
    const commit = await commitFiles(
      [CATALOG_PATH, ...imgFiles],
      `content(product): delete ${removed.name} [via admin: ${req.user.name}]`,
      authorOf(req)
    );
    res.json({ deleted: removed.slug, commit });
  } catch (err) {
    res.status(500).json({ error: "Ошибка удаления: " + err.message });
  }
});

module.exports = router;
