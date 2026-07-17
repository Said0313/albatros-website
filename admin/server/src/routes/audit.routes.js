"use strict";
const express = require("express");
const { requireAuth } = require("../auth");
const { git } = require("../git");

// Audit log = git history of panel content commits. Every save already creates
// a commit like `content(<type>): <verb> <name> [via admin: <Имя>]` authored by
// the logged-in admin, so listing/reverting those commits IS the audit trail.
// Revert is safe by construction: `git revert` adds a NEW undo-commit and never
// rewrites history.

const router = express.Router();

const SUBJECT_RE = /^(?:Revert ")?content\(([a-z-]+)\): (\w+) (.*?)(?: \[via admin: (.*?)\])?"?$/;

function isPanelCommit(subject) {
  return subject.includes("[via admin:") && /(^|Revert ")content\(/.test(subject);
}

// Parse `content(type): verb rest [via admin: name]` (optionally wrapped in
// `Revert "..."`). Returns display metadata for the UI.
function parseSubject(subject) {
  const isRevert = subject.startsWith('Revert "');
  const m = SUBJECT_RE.exec(subject);
  if (!m) return { type: "other", verb: isRevert ? "revert" : "other", target: subject, isRevert };
  return {
    type: m[1],
    verb: isRevert ? "revert" : m[2],
    target: m[3],
    isRevert,
  };
}

const RECORD_SEP = "\x1e"; // ASCII record separator, cannot appear in messages

// GET /api/audit?limit=100 -> recent panel content commits with changed files
router.get("/", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "100", 10) || 100, 300);
    // One record per commit: hash|author|email|dateISO|subject then name-only files.
    const raw = await git.raw([
      "log",
      `-n`,
      String(limit * 3), // scan extra; non-panel commits are filtered out below
      `--pretty=format:${RECORD_SEP}%h|%an|%ae|%aI|%s`,
      "--name-only",
    ]);
    const commits = [];
    for (const chunk of raw.split(RECORD_SEP)) {
      const lines = chunk.split("\n").filter((l) => l.trim() !== "");
      if (!lines.length) continue;
      const [hash, author, email, date, ...subjectParts] = lines[0].split("|");
      const subject = subjectParts.join("|");
      if (!isPanelCommit(subject)) continue;
      commits.push({
        hash,
        author,
        email,
        date,
        subject,
        ...parseSubject(subject),
        files: lines.slice(1),
      });
      if (commits.length >= limit) break;
    }
    res.json({ commits });
  } catch (err) {
    res.status(500).json({ error: "Не удалось прочитать историю: " + err.message });
  }
});

// GET /api/audit/:hash -> details + diff for one panel commit
router.get("/:hash", requireAuth, async (req, res) => {
  try {
    const hash = req.params.hash;
    if (!/^[0-9a-f]{6,40}$/i.test(hash)) {
      return res.status(400).json({ error: "Некорректный хэш." });
    }
    const subject = (await git.raw(["log", "-1", "--pretty=format:%s", hash])).trim();
    if (!isPanelCommit(subject)) {
      return res.status(403).json({ error: "Это не изменение, сделанное через панель." });
    }
    const stat = await git.raw(["show", hash, "--numstat", "--pretty=format:"]);
    const files = stat
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => {
        const [ins, del, ...path] = l.split("\t");
        return { path: path.join("\t"), insertions: ins, deletions: del };
      });
    // Text diff only for data files (JSON/messages); binaries show as stat rows.
    let diff = await git.raw(["show", hash, "--pretty=format:", "--", "src", "messages"]);
    const CAP = 60000;
    if (diff.length > CAP) diff = diff.slice(0, CAP) + "\n... (обрезано)";
    res.json({ hash, subject, ...parseSubject(subject), files, diff });
  } catch (err) {
    res.status(500).json({ error: "Не удалось получить детали: " + err.message });
  }
});

// POST /api/audit/:hash/revert -> new undo-commit authored by the current admin
router.post("/:hash/revert", requireAuth, async (req, res) => {
  const hash = req.params.hash;
  try {
    if (!/^[0-9a-f]{6,40}$/i.test(hash)) {
      return res.status(400).json({ error: "Некорректный хэш." });
    }
    const subject = (await git.raw(["log", "-1", "--pretty=format:%s", hash])).trim();
    // Only commits made through the panel can be reverted from the panel.
    if (!isPanelCommit(subject)) {
      return res.status(403).json({ error: "Откатывать можно только изменения, сделанные через панель." });
    }
    const status = await git.status();
    if (!status.isClean()) {
      return res.status(409).json({
        error: "В репозитории есть несохранённые изменения, откат невозможен. Обратитесь к разработчику.",
      });
    }
    await git.raw([
      "-c",
      `user.name=${req.user.name}`,
      "-c",
      `user.email=${req.user.email}`,
      "revert",
      "--no-edit",
      hash,
    ]);
    const newHash = (await git.raw(["log", "-1", "--pretty=format:%h"])).trim();
    res.json({ ok: true, revertCommit: newHash });
  } catch (err) {
    // Never leave the repo mid-revert: abort on conflict.
    try {
      await git.raw(["revert", "--abort"]);
    } catch {
      /* nothing to abort */
    }
    res.status(409).json({
      error:
        "Откат не удался (конфликт с более поздними изменениями). Отмените сначала более новые правки этого же раздела. " +
        err.message.split("\n")[0],
    });
  }
});

module.exports = router;
