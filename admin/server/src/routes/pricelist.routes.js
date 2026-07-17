"use strict";
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const { requireAuth } = require("../auth");
const { PRICE_LIST_PATH } = require("../config");
const { isPdf } = require("../images");
const { commitFiles } = require("../git");

// The public "Скачать прайс-лист" buttons all point at /price-list.pdf
// (public/price-list.pdf). Replacing the file keeps every button working.

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024 },
});

// GET /api/pricelist -> current file info
router.get("/", requireAuth, (req, res) => {
  try {
    if (!fs.existsSync(PRICE_LIST_PATH)) return res.json({ exists: false });
    const st = fs.statSync(PRICE_LIST_PATH);
    res.json({ exists: true, size: st.size, modified: st.mtime.toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Ошибка чтения: " + err.message });
  }
});

// POST /api/pricelist (multipart field `file`) -> replace the PDF
router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Файл не получен." });
    if (!isPdf(req.file.buffer)) {
      return res.status(400).json({ error: "Файл не является PDF." });
    }
    fs.writeFileSync(PRICE_LIST_PATH, req.file.buffer);
    const commit = await commitFiles(
      [PRICE_LIST_PATH],
      `content(price-list): replace price list [via admin: ${req.user.name}]`,
      { name: req.user.name, email: req.user.email }
    );
    const st = fs.statSync(PRICE_LIST_PATH);
    res.json({ ok: true, size: st.size, modified: st.mtime.toISOString(), commit });
  } catch (err) {
    res.status(500).json({ error: "Ошибка загрузки: " + err.message });
  }
});

module.exports = router;
