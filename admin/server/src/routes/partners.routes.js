"use strict";
const { makeContentRouter } = require("../contentRouter");
const { BRANDS_PATH } = require("../config");
const { processLogo } = require("../images");

// Partners = src/data/brands.json. Schema (existing records keep this shape):
// { id, name, logo, url?, description, founded?, country?, specialty?,
//   specialtyUz?, descriptionUz?, hidden? }
// specialty/specialtyUz = short line, description/descriptionUz = long text.

function str(v) {
  return typeof v === "string" ? v.trim() : "";
}

function buildRecord(body, existing) {
  const p = existing ? { ...existing } : {};
  const setReq = (k) => {
    if (typeof body[k] === "string") p[k] = body[k].trim();
  };
  const setOpt = (k) => {
    if (typeof body[k] === "string") {
      const v = body[k].trim();
      if (v) p[k] = v;
      else delete p[k];
    }
  };
  setReq("name");
  if (typeof body.logo === "string" && body.logo.trim()) p.logo = body.logo.trim();
  setReq("description");
  setOpt("url");
  setOpt("founded");
  setOpt("country");
  setOpt("specialty");
  setOpt("specialtyUz");
  setOpt("descriptionUz");
  setOpt("specialtyEn");
  setOpt("descriptionEn");
  if (typeof body.hidden === "boolean") {
    if (body.hidden) p.hidden = true;
    else delete p.hidden;
  }
  return p;
}

const router = makeContentRouter({
  filePath: BRANDS_PATH,
  label: "partner",
  fieldOrder: [
    "id",
    "name",
    "logo",
    "url",
    "description",
    "founded",
    "country",
    "specialty",
    "specialtyUz",
    "descriptionUz",
    "specialtyEn",
    "descriptionEn",
    "hidden",
  ],
  nameOf: (r) => r.name,
  buildRecord,
  validateCreate: (body) => {
    const errors = [];
    if (!str(body.name)) errors.push("Укажите название партнёра.");
    if (!str(body.logo)) errors.push("Загрузите логотип.");
    return errors;
  },
  idBase: (body) => body.name,
  idFallback: "partner",
  fileFields: { logo: "single" },
  uploads: {
    logo: (buffer, body) => processLogo(buffer, body.base, "images/brands"),
  },
});

module.exports = router;
