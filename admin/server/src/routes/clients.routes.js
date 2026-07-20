"use strict";
const { makeContentRouter } = require("../contentRouter");
const { CLIENTS_PATH } = require("../config");
const { processLogo } = require("../images");

// Clients = src/data/clients.json (About page section + homepage marquee).
// Schema: { id, name, logo, description?, descriptionUz?, link?, hidden? }
// `link` and `hidden` are admin-managed; the public site does not render them yet.

function str(v) {
  return typeof v === "string" ? v.trim() : "";
}

function buildRecord(body, existing) {
  const c = existing ? { ...existing } : {};
  if (typeof body.name === "string") c.name = body.name.trim();
  if (typeof body.logo === "string" && body.logo.trim()) c.logo = body.logo.trim();
  const setOpt = (k) => {
    if (typeof body[k] === "string") {
      const v = body[k].trim();
      if (v) c[k] = v;
      else delete c[k];
    }
  };
  setOpt("description");
  setOpt("descriptionUz");
  setOpt("descriptionEn");
  setOpt("link");
  if (typeof body.hidden === "boolean") {
    if (body.hidden) c.hidden = true;
    else delete c.hidden;
  }
  return c;
}

const router = makeContentRouter({
  filePath: CLIENTS_PATH,
  label: "client",
  fieldOrder: ["id", "name", "logo", "description", "descriptionUz", "descriptionEn", "link", "hidden"],
  nameOf: (r) => r.name,
  buildRecord,
  validateCreate: (body) => {
    const errors = [];
    if (!str(body.name)) errors.push("Укажите название клиента.");
    if (!str(body.logo)) errors.push("Загрузите логотип.");
    return errors;
  },
  idBase: (body) => body.name,
  idFallback: "client",
  fileFields: { logo: "single" },
  uploads: {
    logo: (buffer, body) => processLogo(buffer, body.base, "images/clients"),
  },
});

module.exports = router;
