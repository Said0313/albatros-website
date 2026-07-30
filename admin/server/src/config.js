"use strict";
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Repo root: where src/data/catalog.json and public/images live.
// admin/server/src/config.js -> ../../../ = repo root.
const DEFAULT_SITE_ROOT = path.resolve(__dirname, "..", "..", "..");
const SITE_ROOT = process.env.SITE_ROOT
  ? path.resolve(process.env.SITE_ROOT)
  : DEFAULT_SITE_ROOT;

// Fail fast if the resolved root does not look like the site repo.
const CATALOG_PATH = path.join(SITE_ROOT, "src", "data", "catalog.json");
const BRANDS_PATH = path.join(SITE_ROOT, "src", "data", "brands.json");
const PRODUCT_IMAGES_DIR = path.join(SITE_ROOT, "public", "images", "products");

if (!fs.existsSync(CATALOG_PATH)) {
  console.error(
    `[config] catalog.json not found at ${CATALOG_PATH}.\n` +
      `Set SITE_ROOT in admin/server/.env to the albatros-website repo root.`
  );
}

module.exports = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "dev-insecure-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "12h",
  // Off by default so local development stays commit-only, as before.
  AUTO_PUSH: process.env.AUTO_PUSH === "true",
  DEPLOY_BRANCH: process.env.DEPLOY_BRANCH || "deploy-website",
  SITE_ROOT,
  CATALOG_PATH,
  BRANDS_PATH,
  PRODUCT_IMAGES_DIR,
  // Phase 2 content sources (all plain JSON arrays + their asset folders).
  CLIENTS_PATH: path.join(SITE_ROOT, "src", "data", "clients.json"),
  CERTIFICATES_PATH: path.join(SITE_ROOT, "src", "data", "certificates.json"),
  EVENTS_PATH: path.join(SITE_ROOT, "src", "data", "events.json"),
  BRAND_IMAGES_DIR: path.join(SITE_ROOT, "public", "images", "brands"),
  CLIENT_IMAGES_DIR: path.join(SITE_ROOT, "public", "images", "clients"),
  CERT_IMAGES_DIR: path.join(SITE_ROOT, "public", "images", "certificates"),
  CERT_FILES_DIR: path.join(SITE_ROOT, "public", "files", "certificates"),
  EVENT_IMAGES_DIR: path.join(SITE_ROOT, "public", "images", "events"),
  PRICE_LIST_PATH: path.join(SITE_ROOT, "public", "price-list.pdf"),
  USERS_PATH: process.env.USERS_PATH
    ? path.resolve(process.env.USERS_PATH)
    : path.join(__dirname, "..", "users.json"),
  UPLOADS_TMP: path.join(__dirname, "..", "uploads-tmp"),
};
