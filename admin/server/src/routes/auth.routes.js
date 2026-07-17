"use strict";
const express = require("express");
const bcrypt = require("bcrypt");
const { findByEmail } = require("../users");
const { issueToken, requireAuth, COOKIE_NAME } = require("../auth");

const router = express.Router();

// POST /api/auth/login  { email, password } -> sets httpOnly cookie + returns user
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Введите email и пароль." });
  }
  const user = findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Неверный email или пароль." });
  }
  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Неверный email или пароль." });
  }
  const token = issueToken(user);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // local dev over http
    maxAge: 12 * 60 * 60 * 1000,
  });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// POST /api/auth/logout -> clears the cookie
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

// GET /api/auth/me -> current session (used by the UI to guard routes)
router.get("/me", requireAuth, (req, res) => {
  res.json({
    user: { id: req.user.sub, name: req.user.name, email: req.user.email, role: req.user.role },
  });
});

module.exports = router;
