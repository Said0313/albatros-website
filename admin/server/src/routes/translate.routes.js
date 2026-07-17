"use strict";
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const { requireAuth } = require("../auth");

// UZ auto-draft: translates Russian content text to an Uzbek (Latin) DRAFT via
// the Anthropic Messages API. The result is always shown to the admin for
// correction before saving; nothing is auto-published. Optional feature: with
// no ANTHROPIC_API_KEY in admin/server/.env the endpoint reports
// configured:false (HTTP 200) and the UI degrades gracefully.

const router = express.Router();

const MODEL = "claude-haiku-4-5"; // small fast model; a draft is enough
const MAX_INPUT_CHARS = 6000;

const SYSTEM_PROMPT = [
  "You translate Russian website copy for a medical laboratory equipment distributor into Uzbek (Latin script).",
  "Rules:",
  "- Use correct medical and laboratory terminology (IVD diagnostics domain).",
  "- Keep brand names, product/model names, units and numbers unchanged.",
  "- Use the Uzbek apostrophe letters ʻ (in oʻ, gʻ) and ʼ where required.",
  "- Never use em dashes; use commas, colons or parentheses instead.",
  "- Preserve the tone and approximate length of the source.",
  "- Output ONLY the translated text, no explanations and no quotes around it.",
].join("\n");

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

// POST /api/translate-draft  { text, from: "ru", to: "uz" }
router.post("/", requireAuth, async (req, res) => {
  const { text } = req.body || {};
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Нет текста для перевода." });
  }
  if (text.length > MAX_INPUT_CHARS) {
    return res.status(400).json({ error: `Текст слишком длинный (макс. ${MAX_INPUT_CHARS} символов).` });
  }

  const client = getClient();
  if (!client) {
    // Not configured is a normal state, not an error.
    return res.json({
      configured: false,
      error: "Перевод не настроен: добавьте ANTHROPIC_API_KEY в admin/server/.env.",
    });
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    });
    const draft = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    if (!draft) {
      return res.status(502).json({ error: "Пустой ответ от переводчика, попробуйте ещё раз." });
    }
    res.json({ configured: true, text: draft });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(502).json({ error: "Ключ ANTHROPIC_API_KEY недействителен, проверьте его в admin/server/.env." });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(502).json({ error: "Лимит запросов к переводчику, подождите минуту и повторите." });
    }
    if (err instanceof Anthropic.APIError) {
      return res.status(502).json({ error: "Сервис перевода недоступен: " + err.message });
    }
    res.status(500).json({ error: "Ошибка перевода: " + err.message });
  }
});

module.exports = router;
