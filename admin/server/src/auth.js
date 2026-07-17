"use strict";
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("./config");

const COOKIE_NAME = "alba_admin_token";

function issueToken(user) {
  // Only non-sensitive identity goes in the token; never the password hash.
  return jwt.sign(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Accept the token from an httpOnly cookie (preferred) or a Bearer header.
function extractToken(req) {
  if (req.cookies && req.cookies[COOKIE_NAME]) return req.cookies[COOKIE_NAME];
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "Требуется вход в систему." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Сессия истекла, войдите заново." });
  }
}

module.exports = { issueToken, requireAuth, COOKIE_NAME };
