"use strict";
const express = require("express");
const { requireAuth } = require("../auth");
const { publish, publishStatus } = require("../git");

// Manual catch-up publish: pulls (rebase+autostash) and pushes any commits
// that piled up locally without going out (AUTO_PUSH off, or a previous
// auto-push failed). Makes no new commit.

const router = express.Router();

// GET /api/publish/status -> whether there is anything local to publish
router.get("/status", requireAuth, async (req, res) => {
  try {
    res.json(await publishStatus());
  } catch (err) {
    res.status(500).json({ error: "Не удалось проверить статус публикации: " + err.message });
  }
});

// POST /api/publish -> pull --rebase --autostash + push
router.post("/", requireAuth, async (req, res) => {
  try {
    res.json(await publish());
  } catch (err) {
    res.status(500).json({ error: "Ошибка публикации: " + err.message });
  }
});

module.exports = router;
