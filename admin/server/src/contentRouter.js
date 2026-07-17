"use strict";
const express = require("express");
const multer = require("multer");
const { requireAuth } = require("./auth");
const { readArray, writeArray, orderRecord, uniqueId } = require("./datafiles");
const { deletePublicFile, absPublicFile } = require("./images");
const { commitFiles } = require("./git");

// Generic CRUD router over a JSON-array data file, following the Phase 1
// contract: writes preserve untouched records byte-for-byte, every mutation is
// an attributed LOCAL git commit, and validation errors are returned in
// Russian. Per-type behaviour is injected via the options object.
//
// Options:
//   filePath        absolute path to the JSON array data file
//   label           commit noun, e.g. "partner" -> content(partner): ...
//   fieldOrder      canonical key order for NEW records
//   nameOf(rec)     display name for commit messages
//   buildRecord(body, existing) -> record (sanitized; no id handling here)
//   validateCreate(body) -> [errors] (RU strings; empty = ok)
//   idBase(body)    string the new record id is slugified from
//   idFallback      fallback id stem when idBase yields nothing (e.g. "partner")
//   fileFields      record keys holding public file refs: {key: "single"|"array"}
//                   (used to git-add new files and delete files on remove)
//   uploads         {fieldName: async (buffer, body) => publicPath} handlers
//                   exposed as POST /upload with multipart field `file` +
//                   body.kind selecting the handler, body.base for the filename
//   supportsHidden  enable PATCH /:id/visibility (default true)
function makeContentRouter(opts) {
  const router = express.Router();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024 },
  });
  const supportsHidden = opts.supportsHidden !== false;

  const authorOf = (req) => ({ name: req.user.name, email: req.user.email });
  const msg = (verb, name, req) =>
    `content(${opts.label}): ${verb} ${name} [via admin: ${req.user.name}]`;

  function collectFiles(record) {
    const out = [];
    for (const [key, kind] of Object.entries(opts.fileFields || {})) {
      const v = record[key];
      if (kind === "array" && Array.isArray(v)) out.push(...v);
      else if (kind === "single" && typeof v === "string") out.push(v);
    }
    return out;
  }

  // ── list / get ──
  router.get("/", requireAuth, (req, res) => {
    try {
      res.json({ items: readArray(opts.filePath) });
    } catch (err) {
      res.status(500).json({ error: "Не удалось прочитать данные: " + err.message });
    }
  });

  router.get("/:id", requireAuth, (req, res) => {
    try {
      const item = readArray(opts.filePath).find((r) => r.id === req.params.id);
      if (!item) return res.status(404).json({ error: "Запись не найдена." });
      res.json({ item });
    } catch (err) {
      res.status(500).json({ error: "Ошибка чтения: " + err.message });
    }
  });

  // ── uploads ──
  router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "Файл не получен." });
      const handler = (opts.uploads || {})[req.body.kind || "default"];
      if (!handler) return res.status(400).json({ error: "Неизвестный тип файла." });
      const publicPath = await handler(req.file.buffer, req.body);
      res.json({ path: publicPath });
    } catch (err) {
      res.status(400).json({ error: "Не удалось обработать файл: " + err.message });
    }
  });

  // ── create ──
  router.post("/", requireAuth, async (req, res) => {
    try {
      const errors = opts.validateCreate(req.body || {});
      if (errors.length) return res.status(400).json({ error: errors.join(" ") });

      const items = readArray(opts.filePath);
      const record = opts.buildRecord(req.body, null);
      record.id = uniqueId(opts.idBase(req.body), items.map((r) => r.id), opts.idFallback);

      items.push(orderRecord(record, opts.fieldOrder));
      writeArray(opts.filePath, items);

      const files = [opts.filePath, ...collectFiles(record).map(absPublicFile)];
      const commit = await commitFiles(files, msg("add", opts.nameOf(record), req), authorOf(req));
      res.status(201).json({ item: record, commit });
    } catch (err) {
      res.status(500).json({ error: "Ошибка создания: " + err.message });
    }
  });

  // ── update ──
  router.put("/:id", requireAuth, async (req, res) => {
    try {
      const items = readArray(opts.filePath);
      const idx = items.findIndex((r) => r.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Запись не найдена." });

      const existing = items[idx];
      const updated = opts.buildRecord(req.body, existing);
      updated.id = existing.id; // ids are immutable

      // Remove files that were dropped from the record.
      const removedFiles = [];
      const before = collectFiles(existing);
      const after = collectFiles(updated);
      for (const f of before) {
        if (!after.includes(f)) {
          const deleted = deletePublicFile(f);
          if (deleted) removedFiles.push(deleted);
        }
      }

      items[idx] = updated;
      writeArray(opts.filePath, items);

      const files = [opts.filePath, ...after.map(absPublicFile), ...removedFiles];
      const commit = await commitFiles(files, msg("update", opts.nameOf(updated), req), authorOf(req));
      res.json({ item: updated, commit });
    } catch (err) {
      res.status(500).json({ error: "Ошибка сохранения: " + err.message });
    }
  });

  // ── hide / show ──
  if (supportsHidden) {
    router.patch("/:id/visibility", requireAuth, async (req, res) => {
      try {
        const items = readArray(opts.filePath);
        const idx = items.findIndex((r) => r.id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Запись не найдена." });
        const hidden = !!(req.body || {}).hidden;
        if (hidden) items[idx].hidden = true;
        else delete items[idx].hidden;
        writeArray(opts.filePath, items);
        const commit = await commitFiles(
          [opts.filePath],
          msg(hidden ? "hide" : "show", opts.nameOf(items[idx]), req),
          authorOf(req)
        );
        res.json({ item: items[idx], commit });
      } catch (err) {
        res.status(500).json({ error: "Ошибка: " + err.message });
      }
    });
  }

  // ── reorder ──
  router.post("/reorder", requireAuth, async (req, res) => {
    try {
      const ids = (req.body || {}).ids;
      if (!Array.isArray(ids)) return res.status(400).json({ error: "Нужен список ids." });
      const items = readArray(opts.filePath);
      if (
        ids.length !== items.length ||
        !items.every((r) => ids.includes(r.id))
      ) {
        return res.status(400).json({ error: "Список ids не совпадает с записями." });
      }
      const byId = new Map(items.map((r) => [r.id, r]));
      writeArray(opts.filePath, ids.map((id) => byId.get(id)));
      const commit = await commitFiles(
        [opts.filePath],
        `content(${opts.label}): reorder [via admin: ${req.user.name}]`,
        authorOf(req)
      );
      res.json({ ok: true, commit });
    } catch (err) {
      res.status(500).json({ error: "Ошибка изменения порядка: " + err.message });
    }
  });

  // ── delete ──
  router.delete("/:id", requireAuth, async (req, res) => {
    try {
      const items = readArray(opts.filePath);
      const idx = items.findIndex((r) => r.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Запись не найдена." });
      const [removed] = items.splice(idx, 1);

      const removedFiles = [];
      for (const f of collectFiles(removed)) {
        const deleted = deletePublicFile(f);
        if (deleted) removedFiles.push(deleted);
      }
      writeArray(opts.filePath, items);
      const commit = await commitFiles(
        [opts.filePath, ...removedFiles],
        msg("delete", opts.nameOf(removed), req),
        authorOf(req)
      );
      res.json({ deleted: removed.id, commit });
    } catch (err) {
      res.status(500).json({ error: "Ошибка удаления: " + err.message });
    }
  });

  return router;
}

module.exports = { makeContentRouter };
