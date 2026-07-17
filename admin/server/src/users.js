"use strict";
const fs = require("fs");
const { USERS_PATH } = require("./config");

// Users are stored in a gitignored JSON file so password hashes never enter git.
// Shape: [{ id, name, email, passwordHash, role, createdAt }]

function loadUsers() {
  if (!fs.existsSync(USERS_PATH)) return [];
  try {
    const raw = fs.readFileSync(USERS_PATH, "utf8").trim();
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[users] failed to read users.json:", err.message);
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2) + "\n", "utf8");
}

function findByEmail(email) {
  const target = String(email || "").trim().toLowerCase();
  return loadUsers().find((u) => u.email.toLowerCase() === target);
}

module.exports = { loadUsers, saveUsers, findByEmail, USERS_PATH };
